import { Wallet, BigNumber, Utils, TransactionReceipt, IRpcWallet, IMulticallContractCall } from "@ijstech/eth-wallet";
import { Contracts, Contracts as TrollNFTContracts } from '@scom/oswap-troll-nft-contract';

import {
  trollAPIUrl,
  State,
  NftInfoStore,
  nftInfoStoreMap,
  OswapNfts,
  SupportedNetworkId,
  mapRecordNumber,
  mapRecord,
  mapRecordAwait,
  TokenConstant,
  UserNftInfo,
  isClientWalletConnected,
} from "../store/index";
import { ITokenObject } from "@scom/scom-token-list";
import { ContractUtils as ProxyContractUtils } from '@scom/scom-commission-proxy-contract';

interface NftInfo extends NftInfoStore {
  minimumStake: BigNumber, // fetch once 
  cap: BigNumber, // fetch once
  totalSupply: BigNumber, // alwasys fetch
  protocolFee: BigNumber, // fetch once
  userNfts: UserNftInfo[],
}

function convToken(t: ITokenObject): TokenConstant {
  if (!t.address) console.log(`no address for ${t.name}`);
  return {
    address: t.address || "",
    decimals: t.decimals,
    name: t.name,
    symbol: t.symbol,
  }
}

function initNftInfo() {
  let out: Record<SupportedNetworkId, Record<OswapNfts, NftInfo>>;
  out = mapRecordNumber(nftInfoStoreMap, (nfts, chainId, o1) => {
    return mapRecord(nfts, (nft, tier, o2): NftInfo => {
      return {
        ...nft,
        minimumStake: new BigNumber("0"),
        cap: new BigNumber("0"),
        totalSupply: new BigNumber("0"),
        protocolFee: new BigNumber("0"),
        userNfts: [],
      }
    });
  });
  return out;
}

let nftInfoMap: Record<SupportedNetworkId, Record<OswapNfts, NftInfo>> = initNftInfo();

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

async function fetchAllNftInfo(state: State) {
  const chainId = state.getChainId();
  if (!(chainId in SupportedNetworkId)) return false;
  let wallet = state.getRpcWallet();
  nftInfoMap[chainId as SupportedNetworkId] = await mapRecordAwait(
    nftInfoMap[chainId as SupportedNetworkId],
    info => fetchNftInfo(state, wallet, info)
  );
  return nftInfoMap[chainId as SupportedNetworkId];
}

async function fetchNftInfo(state: State, wallet: IRpcWallet, nftInfo: NftInfo | NftInfoStore): Promise<NftInfo> {
    if (wallet.chainId !== nftInfo.chainId) throw new Error("chain id do not match");
    let trollNFT = new TrollNFTContracts.TrollNFT(wallet, nftInfo.address);
    let calls: IMulticallContractCall[] = [
      {
        contract: trollNFT,
        methodName: 'minimumStake',
        params: [],
        to: nftInfo.address
      },
      {
        contract: trollNFT,
        methodName: 'cap',
        params: [],
        to: nftInfo.address
      },
      {
        contract: trollNFT,
        methodName: 'totalSupply',
        params: [],
        to: nftInfo.address
      },
      {
        contract: trollNFT,
        methodName: 'protocolFee',
        params: [],
        to: nftInfo.address
      },
    ];

    try {
      let [minimumStake, cap, totalSupply, protocolFee] = await wallet.doMulticall(calls) || [];
      let userNfts = await fetchUserNft(state, nftInfo) || [];
      let out: NftInfo = {
        ...nftInfo,
        minimumStake: new BigNumber(minimumStake).shiftedBy(-nftInfo.token.decimals),
        cap: new BigNumber(cap),
        totalSupply: new BigNumber(totalSupply),
        protocolFee: new BigNumber(protocolFee).shiftedBy(-nftInfo.token.decimals),
        userNfts,
      }
      nftInfoMap[nftInfo.chainId][out.name] = out;
      return out;
    } catch (error) {
      console.log("fetchNftInfo",nftInfo.chainId,nftInfo.address, error);
    }
    return {
      ...nftInfo,
      minimumStake: new BigNumber(0),
      cap: new BigNumber(0),
      totalSupply: new BigNumber(0),
      protocolFee: new BigNumber(0),
      userNfts:[],
    }
}

async function fetchUserNft(state: State, nftInfo: NftInfo | NftInfoStore): Promise<UserNftInfo[]> { //only get user nft on current chain
  if (!isClientWalletConnected()) return [];
  let wallet = state.getRpcWallet();
  let chainId = wallet.chainId;
  console.log("fetchUserNft", chainId, wallet.address, nftInfo.name);

  let userNfts: UserNftInfo[] = [];
  const trollAPI = trollAPIUrl[chainId];

  let nftContract = new Contracts.TrollNFT(wallet, nftInfo.address);
  let tier = nftInfo.name;
  let token = nftInfo.token;

  const fetchInfoByDapp = async (info: NftInfo | NftInfoStore, contractAddress: string, token: TokenConstant, i: number) => {
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

  const fetchInfoByAPI = async (info: NftInfoStore, obj: any, token: TokenConstant) => {
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
  } catch (e) { console.log(e); }
  return receipt;
}

const burnNFT = async (contractAddress: string, tokenID: number) => {
  let wallet = Wallet.getClientInstance();
  let trollNFT = new TrollNFTContracts.TrollNFT(wallet, contractAddress);
  let receipt = await trollNFT.unstake(tokenID);
  return receipt;
}

export {
  NftInfo,
  nftInfoMap,
  getCommissionRate,
  fetchAllNftInfo,
  mintNFT,
  burnNFT,
  getNFTObject
};