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
  OswapNftsType,
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
  out = mapRecordNumber(nftInfoStoreMap, nfts => {
    return mapRecord(nfts, (nft): NftInfo => {
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
  }
  return output;
}

async function fetchNftInfoByTier(state: State, tier: OswapNfts | OswapNftsType) {
  const chainId = state.getChainId();
  if (!(chainId in SupportedNetworkId)) return false;
  let wallet = state.getRpcWallet();
  nftInfoMap[chainId as SupportedNetworkId][tier] = await fetchNftInfo(state, wallet, nftInfoMap[chainId as SupportedNetworkId][tier]);
  return nftInfoMap[chainId as SupportedNetworkId][tier];
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
    console.log("fetchNftInfo", nftInfo.chainId, nftInfo.address, error);
  }
  return {
    ...nftInfo,
    minimumStake: new BigNumber(0),
    cap: new BigNumber(0),
    totalSupply: new BigNumber(0),
    protocolFee: new BigNumber(0),
    userNfts: [],
  }
}

//fetchUserNftOnChain
async function fetchUserNft(state: State, nftInfo: NftInfo | NftInfoStore): Promise<UserNftInfo[]> { //only get user nft on current chain
  if (!isClientWalletConnected()) return [];
  let wallet = state.getRpcWallet();
  const trollAPI = trollAPIUrl[wallet.chainId];
  let userNfts: UserNftInfo[] = [];
  let nftContract = new Contracts.TrollNFT(wallet, nftInfo.address);
  let token = nftInfo.token;
  let userNftCount = (await nftContract.balanceOf(wallet.address)).toNumber();
  let IdCalls: IMulticallContractCall[] = [];
  for (let i = 0; i < userNftCount; i++) {
    IdCalls.push({
      contract: nftContract,
      methodName: 'tokenOfOwnerByIndex',
      params: [wallet.address, i],
      to: nftInfo.address
    });
  }
  let ids = (await wallet.doMulticall(IdCalls).catch(error=>{
    console.log("fetchUserNft IdCalls", error);
    return[];
  })).map(id => new BigNumber(id)).filter(id => id.isInteger() && id.gte(0)).map(id=>id.toNumber());
  if (userNftCount > ids.length) console.log("some id is invalid");
  let nftCalls: IMulticallContractCall[] = [];
  ids.forEach(id => nftCalls.push({
    contract: nftContract,
    methodName: 'stakingBalance',
    params: [id],
    to: nftInfo.address
  },
  {
    contract: nftContract,
    methodName: 'creationTime',
    params: [id],
    to: nftInfo.address
  },
  /** 
  {
    contract: nftContract,
    methodName: 'getAttributes2',
    params: [id,nftInfo.attributes.base,nftInfo.attributes.digits],
    to: nftInfo.address
  }*/
 ));
  
  let mixedResult=await wallet.doMulticall(nftCalls).catch(error=>{
    console.log("fetchUserNft nftCalls",error);
    return[];
  });

  for (let i = 0; i < ids.length; i++) {
    let stakeBalance:string = mixedResult[i * 2];
    let creationTime:string = mixedResult[i * 2 + 1];
    //let attributes:string[] = ar(mixedResult[i * 3 + 2]);
    
    let attributes = await getAttributes2(nftContract, ids[i], nftInfo.attributes.base, nftInfo.attributes.digits, nftInfo.attributes.probability);
    let obj = await getNFTObject(trollAPI, `${nftInfo.name}-troll`, ids[i]);
    userNfts.push({
      tokenId: ids[i],
      stakeBalance: Utils.fromDecimals(stakeBalance, token.decimals).toFixed(),
      attributes,
      rarity:new BigNumber(attributes[nftInfo.attributes.rarityIndex]).toNumber(),
      birthday:new BigNumber(creationTime).toNumber(),
      image: obj.image ? obj.image : undefined,
    });
  }
  
  return userNfts;
}

const mintNFT = async (contractAddress: string, token: TokenConstant, amount: string) => {
  let wallet = Wallet.getClientInstance();
  let trollNFT = new TrollNFTContracts.TrollNFT(wallet, contractAddress);
  let tokenAmount = Utils.toDecimals(amount, token.decimals);
  let receipt = await trollNFT.stake(tokenAmount);
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
  fetchNftInfoByTier,
  mintNFT,
  burnNFT,
  getNFTObject
};