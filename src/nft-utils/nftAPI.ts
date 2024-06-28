import { Wallet, BigNumber, Utils, TransactionReceipt, IWallet } from "@ijstech/eth-wallet";
import { Contracts as TrollNFTContracts } from '@scom/oswap-troll-nft-contract';
import { Contracts as DripContracts } from '@scom/oswap-drip-contract';
import {
  ITrollCampBasicInfo,
  NFT_TYPE,
  trollCampInfoMap,
  oaxNFTInfo,
  ITrollCampInfo,
  trollAPIUrl,
  IUserNFTsInfo,
  IMyNFTInfo,
  rewardAddress,
  State,
} from "../store/index";
import { tokenStore } from '@scom/scom-token-list';
import { ITokenObject } from "@scom/scom-token-list";
import { ContractUtils as ProxyContractUtils } from '@scom/scom-commission-proxy-contract';

const getCommissionRate = async (state: State, campaignId: number) => {
  const rpcWallet = state.getRpcWallet();
  const proxyAddress = state.getProxyAddress();
  await rpcWallet.init();
  let commissionRate = await ProxyContractUtils.getCommissionRate(rpcWallet, proxyAddress, campaignId)
  return Utils.fromDecimals(commissionRate, 6).toFixed();
}

const getCampaign = async (chainId: number, nftCampaign: string) => {
  let trollCampList: ITrollCampBasicInfo[];
  let creationABI: string
  let contract: typeof TrollNFTContracts.TrollNFT | typeof TrollNFTContracts.TrollNFTV2
  switch (nftCampaign) {
    case NFT_TYPE.OSWAP:
      trollCampList = trollCampInfoMap[chainId].filter(v => v.hide !== true)
      creationABI = 'creationTime'
      contract = TrollNFTContracts.TrollNFT
      return { trollCampList, creationABI, contract }
    case NFT_TYPE.OAX:
      trollCampList = oaxNFTInfo[chainId]
      creationABI = 'creationDate'
      contract = TrollNFTContracts.TrollNFTV2
      return { trollCampList, creationABI, contract }
    default:
      throw 'Invalid Campaign'
  }
}

const getNFTObject = async (trollAPI: string, nft: string, tokenId?: number, owner?: string) => {
  try {
    const wallet = Wallet.getClientInstance();
    let param = ''
    if (tokenId) {
      param = '/' + tokenId
    } else if (owner) {
      param = '/?owner=' + wallet.toChecksumAddress(owner); //FIXME: API only recognizes checksum address
      // param = '/?owner=' + owner
    }
    const response = await fetch(`${trollAPI}/${nft}${param}`);
    const json = await response.json();
    return json;
  } catch {
    return {};
  }
}

const getAttributes2 = async (trollNFT: TrollNFTContracts.TrollNFT | TrollNFTContracts.TrollNFTV2, tokenID: number, base: number, digits: number[], probability: any[]) => {
  let attributes = await trollNFT.getAttributes2({
    tokenId: tokenID,
    base,
    digits
  })
  if (JSON.stringify(attributes) == JSON.stringify(new Array(digits.length).fill("0"))) { //NFT is minted but attr is not created yet by ChainLink Random Contract
    return null;
  }
  let distributedAttributes: string[] = [];
  for (let i = 0; i < attributes.length; i++) {
    distributedAttributes[i] = distributeByProbability(attributes[i], base, digits[i], probability[i]);
  }
  return distributedAttributes;
}

const distributeByProbability = (index: BigNumber, base: number, power: number, probability: number[]) => {
  let output = '0';
  let max = new BigNumber(base).pow(power);
  let indexRatio = index.div(max);
  let counter = 0;
  for (let i = 0; i < probability.length; i++) {
    counter = counter + probability[i];
    if (new BigNumber(indexRatio).lt(counter)) {
      output = new BigNumber(i).plus(1).toFixed();
      break;
    }
  };
  return output;
}

const getRarityByMatrix = async (attributes: any, info: any) => {
  let cumulativeProbability = new BigNumber(1)
  for (let i = 0; i < attributes.length; i++) {
    cumulativeProbability = new BigNumber(cumulativeProbability).times(info.attributes.probability[i][attributes[i].minus(1).toFixed()])
  }
  for (let j = 0; j < info.attributes.rarityMatrix.length; j++) {
    if (cumulativeProbability.lte(info.attributes.rarityMatrix[j])) {
      return info.attributes.rarityMatrix.length - j
    }
  }
  return 0
}

const getTrollCampInfo = async (state: State, nftCampaign: string) => {
  const chainId = state.getChainId();
  let campaignInfo = await getCampaign(chainId, nftCampaign);
  if (!campaignInfo.trollCampList || campaignInfo.trollCampList.length == 0) return [];
  let wallet = state.getRpcWallet();
  let trollCamp: ITrollCampInfo[] = [];
  const tokenMap = tokenStore.getTokenMapByChainId(chainId) || {};

  const getInfo = async (info: ITrollCampBasicInfo, resolve: any) => {
    try {
      let trollNFT = new TrollNFTContracts.TrollNFT(wallet, info.contract);
      let minimumStake = await trollNFT.minimumStake();
      let cap = await trollNFT.cap();
      let totalSupply = await trollNFT.totalSupply();
      let tokenAddress = await trollNFT.stakeToken();
      let protocolFee = await trollNFT.protocolFee();
      let token = tokenMap[tokenAddress.toLowerCase()];
      trollCamp.push({
        ...info,
        token,
        minimumStake: minimumStake.shiftedBy(-18).toFixed(),
        cap: cap.toFixed(),
        available: cap.minus(totalSupply).toFixed(),
        protocolFee: protocolFee.shiftedBy(-18).toFixed(),
      })
      resolve();
    } catch (e) {
      console.log(e)
    }
  }

  let promises = campaignInfo.trollCampList.map((info, index) => {
    return new Promise<void>(async (resolve, reject) => {
      getInfo(info, resolve);
    })
  })
  await Promise.all(promises);
  return trollCamp.sort((a, b) => a.apr - b.apr);
}

const getUserNFTs = async (state: State, nftCampaign: string, address: string) => {
  let wallet = state.getRpcWallet();
  let chainId = wallet.chainId;
  let campaignInfo = await getCampaign(chainId, nftCampaign);
  if (!campaignInfo.trollCampList || campaignInfo.trollCampList.length == 0) return [];
  let trollNFTContract = campaignInfo.contract;
  let userNFT: IUserNFTsInfo[] = [];

  const tokenMap = tokenStore.getTokenMapByChainId(chainId) || {};
  const getInfo = async (info: ITrollCampBasicInfo, resolve: any) => {
    try {
      let contractAddress = info.contract;
      let trollNFT = new trollNFTContract(wallet, contractAddress);
      let tier = info.tier;
      let allObj: any = {};
      let tokenAddress = await trollNFT.stakeToken();
      let token = tokenMap[tokenAddress.toLowerCase()];
      let promises: any = []
      let listNFT: IMyNFTInfo[] = [];

      switch (nftCampaign) {
        case NFT_TYPE.OSWAP:
          allObj = await getNFTObject(trollAPI, `${tier}-troll`, undefined, address);
          break;
        case NFT_TYPE.OAX:
          allObj = await getNFTObject(trollAPI, 'oax', undefined, address);
          break;
      }
      let balance = (await trollNFT.balanceOf(address)).toNumber();
      if (!allObj.length || allObj.length != balance) { //API Fail: The count is difference right after mint/burn
        if (balance > 0) {
          for (let i = 0; i < balance; i++) {
            promises.push(getInfoByDapp(info, contractAddress, token, listNFT, i))
          }
        }
      } else { //API success
        if (allObj.length > 0) {
          for (let i = 0; i < allObj.length; i++) {
            promises.push(getInfoByAPI(info, allObj[i], token, listNFT))
          }
        }
      }

      await Promise.all(promises);
      userNFT.push({
        ...info,
        stakeToken: token,
        listNFT
      })
      resolve();
    } catch {
    }
  }

  const getInfoByDapp = async (info: ITrollCampBasicInfo, contractAddress: string, token: ITokenObject, listNFT: IMyNFTInfo[], i: number) => {
    let trollNFT = new trollNFTContract(wallet, contractAddress);
    let tokenID = (await trollNFT.tokenOfOwnerByIndex({
      owner: address,
      index: i
    })).toNumber();
    let stakingBalance = (await trollNFT.stakingBalance(tokenID)).toFixed();
    let birthday: number;
    if (trollNFT instanceof TrollNFTContracts.TrollNFTV2) {
      birthday = (await trollNFT.creationDate(tokenID)).toNumber();
    }
    else {
      birthday = (await trollNFT.creationTime(tokenID)).toNumber();
    }

    let attributes = await getAttributes2(trollNFT, tokenID, info.attributes.base, info.attributes.digits, info.attributes.probability);
    let rarity = 0;
    if (!rarity && attributes) {
      if (info.attributes.rarityIndex) {
        rarity = new BigNumber(attributes[info.attributes.rarityIndex]).toNumber();
      } else if (info.attributes.rarityMatrix) {
        rarity = await getRarityByMatrix(attributes, info);
      }
    }
    let obj: any
    switch (nftCampaign) {
      case NFT_TYPE.OSWAP:
        obj = await getNFTObject(trollAPI, `${info.tier}-troll`, tokenID);
        break;
      case NFT_TYPE.OAX:
        obj = await getNFTObject(trollAPI, 'oax', tokenID);
        break;
    }

    listNFT.push({
      token,
      tokenID,
      stakingBalance: Utils.fromDecimals(stakingBalance, token.decimals).toFixed(),
      attributes,
      rarity,
      birthday,
      image: obj.image ? obj.image : undefined,
    });
  }

  const getInfoByAPI = async (info: any, obj: any, token: ITokenObject, listNFT: IMyNFTInfo[]) => {
    let rarity = 0;
    if (nftCampaign == NFT_TYPE.OSWAP) {
      if (obj.attributes) {
        rarity = new BigNumber(obj.attributes[info.attributes.rarityIndex].value).toNumber()
      } else if (obj.attritubes) { //handle the spelling problem on api temporarily
        rarity = new BigNumber(obj.attritubes[info.attributes.rarityIndex].value).toNumber()
      }
    } else {
      rarity = obj.rarity
    }
    let stakingBalance = obj.staking_balance ? Utils.fromDecimals(obj.staking_balance, token.decimals).toFixed() : '0';
    listNFT.push({
      token,
      tokenID: obj.id,
      stakingBalance,
      attributes: obj.attritubes,
      rarity,
      birthday: obj.creation_time,
      image: obj.image,
    })
  }

  const trollAPI = trollAPIUrl[chainId];
  let promises = campaignInfo.trollCampList.map((info, index) => {
    return new Promise<void>(async (resolve, reject) => {
      await getInfo(info, resolve);
    })
  })
  await Promise.all(promises);
  return userNFT;
}

const mintNFT = async (contractAddress: string, token: ITokenObject, amount: string) => {
  let receipt: TransactionReceipt;
  try {
    let wallet = Wallet.getClientInstance();
    let trollNFT = new TrollNFTContracts.TrollNFT(wallet, contractAddress);
    let tokenAmount = Utils.toDecimals(amount, token.decimals);
    receipt = await trollNFT.stake(tokenAmount);
  } catch { }
  return receipt;
}

const burnNFT = async (contractAddress: string, tokenID: number) => {
  let wallet = Wallet.getClientInstance();
  let trollNFT = new TrollNFTContracts.TrollNFT(wallet, contractAddress);
  let receipt = await trollNFT.unstake(tokenID);
  return receipt;
}

// nft = OSWAP or OAX
interface IOwnRewards {
  token: ITokenObject;
  startDate: number;
  endDate: number;
  claimedAmount: string;
  unclaimedAmount: string;
  totalAmount: string;
  tokenId?: string;
}

const getRewardInfo = async (wallet: IWallet, address: string, i: number): Promise<IOwnRewards> => {
  let drip = new DripContracts.Drip(wallet, address);
  let info = await drip.getInfo(i);
  const tokenAddress = (info._token || '').toLocaleLowerCase();
  let tokenMap = tokenStore.getTokenMapByChainId(wallet.chainId) || {};
  const tokenObj = tokenMap[tokenAddress];
  const tokenDecimals = tokenObj.decimals || 18;
  return {
    token: tokenObj,
    startDate: new BigNumber(info._startDate).shiftedBy(3).toNumber(),
    endDate: new BigNumber(info._endDate).shiftedBy(3).toNumber(),
    claimedAmount: new BigNumber(info._claimedAmount).shiftedBy(-tokenDecimals).toFixed(),
    unclaimedAmount: new BigNumber(info._unclaimedFunds).shiftedBy(-tokenDecimals).toFixed(),
    totalAmount: new BigNumber(info._totalAmount).shiftedBy(-tokenDecimals).toFixed(),
  }
}

const getOwnRewards = async (state: State, nft: string):
  Promise<IOwnRewards[]> => {
  switch (nft) {
    case NFT_TYPE.OSWAP:
      break;
    default:
      return [];
  }
  let wallet = state.getRpcWallet();
  let chainId = wallet.chainId;
  let address = rewardAddress[chainId];
  if (!address) return [];
  let ids = await ownRewardIds(wallet, address);
  let infoTasks: Promise<IOwnRewards>[] = [];
  for (let i = 0; i < ids.length; i++) {
    infoTasks.push(getRewardInfo(wallet, address, ids[i].toNumber()));
  }
  let infos = await Promise.all(infoTasks);
  let out: IOwnRewards[] = [];
  infos.forEach((info, index) => {
    out.push({
      tokenId: ids[index].toString(),
      ...info
    })
  });
  return out;
}

const claimReward = async (tokenId: string) => {
  let wallet = Wallet.getClientInstance();
  let chainId = wallet.chainId;
  let address = rewardAddress[chainId];
  let receipt;
  if (tokenId && address) {
    let drip = new DripContracts.Drip(wallet, address);
    receipt = await drip.claim(new BigNumber(tokenId))
  }
  return receipt;
}

const claimMultiple = async () => {
  let wallet = Wallet.getClientInstance();
  let chainId = wallet.chainId;
  let address = rewardAddress[chainId];
  if (!address) return null;
  let ids = await ownRewardIds(wallet, address);
  let task: Promise<IOwnRewards>[] = [];
  for (let i = 0; i < ids.length; i++) {
    task.push(getRewardInfo(wallet, address, ids[i].toNumber()));
  }
  let allRewards = await Promise.all(task);
  ids = ids.filter((id, i) => new BigNumber(allRewards[i].unclaimedAmount).gt(0));
  if (ids.length <= 0) return null;
  let drip = new DripContracts.Drip(wallet, address);
  let receipt = await drip.claimMultiple(ids)
  return receipt;
}

async function ownRewardIds(wallet: IWallet, dripAddress: string) {
  let drip = new DripContracts.Drip(wallet, dripAddress);
  let rewardCount = (await drip.balanceOf(wallet.address)).toNumber();
  let tasks: Promise<BigNumber>[] = [];
  for (let i = 0; i < rewardCount; i++) {
    let task = drip.tokenOfOwnerByIndex({
      owner: wallet.address,
      index: i
    })
    tasks.push(task);
  }
  return await Promise.all(tasks);
}


export {
  getCommissionRate,
  getTrollCampInfo,
  mintNFT,
  burnNFT,
  getUserNFTs,
  getOwnRewards,
  IOwnRewards,
  claimReward,
  claimMultiple,
  getNFTObject
};