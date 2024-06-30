import { Wallet, BigNumber, Utils, TransactionReceipt, IWallet, IRpcWallet } from "@ijstech/eth-wallet";
import { Contracts, Contracts as TrollNFTContracts } from '@scom/oswap-troll-nft-contract';

import {
  trollAPIUrl,
  State,
  nftInfoStore,
  nftInfoStoreMap,
  OswapNfts,
  SupportedNetworkId,
  mapRecordNumber,
  mapRecord,
  mapRecordAwait,
  TokenConstant,
  UserNftInfo,
} from "../store/index";
import { tokenStore } from '@scom/scom-token-list';
import { ITokenObject } from "@scom/scom-token-list";
import { ContractUtils as ProxyContractUtils } from '@scom/scom-commission-proxy-contract';

interface nftInfo extends nftInfoStore {
  minimumStake: BigNumber, // fetch once 
  cap: BigNumber, // fetch once
  totalSupply: BigNumber, // alwasys fetch
  protocolFee: BigNumber, // fetch once
  userNfts: UserNftInfo[],
}

function convToken(t: ITokenObject): TokenConstant {
  return {
    address: t.address,
    decimals: t.decimals,
    name: t.name,
    symbol: t.symbol,
  }
}
function findNftInfoStore(chainId: SupportedNetworkId, nftName: OswapNfts) {
  let nftInfos = nftInfoStoreMap[chainId];
  return nftInfos[nftName];
}

function findNftInfo(chainId: SupportedNetworkId, nftName: OswapNfts) {
  let nftInfos = nftInfoMap[chainId];
  return nftInfos[nftName];
}

function initNftInfo() {
  let out: Record<SupportedNetworkId, Record<OswapNfts, nftInfo>>;
  out = mapRecordNumber(nftInfoStoreMap, (nfts, chainId, o1) => {
    return mapRecord(nfts, (nft, tier, o2): nftInfo => {
      return {
        ...nft,
        minimumStake: new BigNumber("0"),
        cap: new BigNumber("0"),
        totalSupply: new BigNumber("0"),
        protocolFee: new BigNumber("0"),
        userNfts:[],
      }
    });
  });
  return out;
}

let nftInfoMap: Record<SupportedNetworkId, Record<OswapNfts, nftInfo>> = initNftInfo();
interface nftInfo extends nftInfoStore {
  minimumStake: BigNumber, // fetch once 
  cap: BigNumber, // fetch once
  totalSupply: BigNumber, // alwasys fetch
  protocolFee: BigNumber // fetch once
}

const getCommissionRate = async (state: State, campaignId: number) => {
  const rpcWallet = state.getRpcWallet();
  const proxyAddress = state.getProxyAddress();
  await rpcWallet.init();
  let commissionRate = await ProxyContractUtils.getCommissionRate(rpcWallet, proxyAddress, campaignId)
  return Utils.fromDecimals(commissionRate, 6).toFixed();
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

async function fetchAllNftInfo(state: State){
  const chainId = state.getChainId();
  if (!(chainId in SupportedNetworkId)) throw new Error(`chain id ${chainId} is not suppported`);
  let wallet = state.getRpcWallet();
  nftInfoMap[chainId as SupportedNetworkId] = await mapRecordAwait(
    nftInfoMap[chainId as SupportedNetworkId],
    info => fetchNftInfo(state, wallet, info)
  );
  return nftInfoMap[chainId as SupportedNetworkId];
}

async function fetchNftInfo(state: State, wallet: IRpcWallet, nftInfo: nftInfo | nftInfoStore): Promise<nftInfo> {
  try {
    if (wallet.chainId !== nftInfo.chainId) throw new Error("chain id do not match");
    let trollNFT = new TrollNFTContracts.TrollNFT(wallet, nftInfo.address);
    let minimumStake = await trollNFT.minimumStake();
    let cap = await trollNFT.cap();
    let totalSupply = await trollNFT.totalSupply();
    //let tokenAddress = await trollNFT.stakeToken();
    let protocolFee = await trollNFT.protocolFee();
    //let token = tokenMap[tokenAddress.toLowerCase()];
    let userNfts = await fetchUserNft(state,nftInfo) || [];
    let out: nftInfo = {
      ...nftInfo,
      minimumStake,
      cap,
      totalSupply,
      protocolFee,
      userNfts,
    }
    nftInfoMap[nftInfo.chainId][out.name] = out;
    return out;
  } catch (e) {
    console.log(e)
  }
}

async function fetchUserNft(state: State, nftInfo: nftInfo | nftInfoStore):Promise<UserNftInfo[]>  { //only get user nft on current chain
  let wallet = state.getRpcWallet();
  let chainId = wallet.chainId;
  console.log("getUserNFTs", chainId, wallet.address, nftInfo.name);

  let userNfts: UserNftInfo[] = [];
  const trollAPI = trollAPIUrl[chainId];

  let nftContract = new Contracts.TrollNFT(wallet, nftInfo.address);
  let tier = nftInfo.name;
  let token = nftInfo.token;

  const fetchInfoByDapp = async (info: nftInfo|nftInfoStore, contractAddress: string, token: TokenConstant, i: number) => {
    let trollNFT = new Contracts.TrollNFT(wallet, contractAddress);
    let tokenId = (await trollNFT.tokenOfOwnerByIndex({
      owner: wallet.address,
      index: i
    })).toNumber();
    let stakingBalance = (await trollNFT.stakingBalance(tokenId)).toFixed();
    let birthday: number;
    birthday = (await trollNFT.creationTime(tokenId)).toNumber();

    let attributes = await getAttributes2(trollNFT, tokenId, info.attributes.base, info.attributes.digits, info.attributes.probability);
    let rarity = 0;
    if (!rarity && attributes) {
      rarity = new BigNumber(attributes[info.attributes.rarityIndex]).toNumber();
    }
    let obj = await getNFTObject(trollAPI, `${info.name}-troll`, tokenId);

    userNfts.push({
      tokenId,
      stakeBalance: Utils.fromDecimals(stakingBalance, token.decimals).toFixed(),
      attributes,
      rarity,
      birthday,
      image: obj.image ? obj.image : undefined,
    });
  }

  const fetchInfoByAPI = async (info: nftInfoStore, obj: any, token: TokenConstant) => {
    let rarity = 0;
    if (obj.attributes) {
      rarity = new BigNumber(obj.attributes[info.attributes.rarityIndex].value).toNumber()
    } else if (obj.attritubes) { //handle the spelling problem on api temporarily
      rarity = new BigNumber(obj.attritubes[info.attributes.rarityIndex].value).toNumber()
    }

    let stakeBalance = obj.staking_balance ? Utils.fromDecimals(obj.staking_balance, token.decimals).toFixed() : '0';
    userNfts.push({
      tokenId: obj.id,
      stakeBalance,
      attributes: obj.attritubes,
      rarity,
      birthday: obj.creation_time,
      image: obj.image,
    })
  }

  let promises: Promise<any>[] = []
  let AllUserNftByApi = await getNFTObject(trollAPI, `${tier}-troll`, undefined, wallet.address);
  let userOwnNftCount = (await nftContract.balanceOf(wallet.address)).toNumber();
  if (!AllUserNftByApi.length || AllUserNftByApi.length != userOwnNftCount) { //API Fail: The count is difference right after mint/burn
    if (userOwnNftCount > 0) {
      for (let i = 0; i < userOwnNftCount; i++) {
        promises.push(fetchInfoByDapp(nftInfo, nftInfo.address, token, i))
      }
    }
  } else { //API success
    if (AllUserNftByApi.length > 0) {
      for (let i = 0; i < AllUserNftByApi.length; i++) {
        promises.push(fetchInfoByAPI(nftInfo, AllUserNftByApi[i], token))
      }
    }
  }

  await Promise.all(promises);
  return userNfts;
}

const mintNFT = async (contractAddress: string, token: TokenConstant, amount: string) => {
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

export {
  nftInfoMap,
  getCommissionRate,
  fetchAllNftInfo,
  mintNFT,
  burnNFT,
  IOwnRewards,
  getNFTObject
};