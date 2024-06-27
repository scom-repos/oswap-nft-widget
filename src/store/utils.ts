import { application } from '@ijstech/components';
import { BigNumber, ERC20ApprovalModel, IERC20ApprovalEventOptions, INetwork, Wallet } from '@ijstech/eth-wallet';
import { IExtendedNetwork, TokenMapType } from '../global/index';
import getNetworkList from '@scom/scom-network-list';
import ConfigData from '../data.json';
import { Mainnets, Testnets } from './data/core';
import { ChainNativeTokenByChainId, ITokenObject } from '@scom/scom-token-list';
import { INetworkConfig } from '@scom/scom-network-picker';

export interface IWalletConnectMetadata {
  name: string;
  description: string;
  url: string;
  icons: string[];
}

export interface IWalletConnectConfig {
  projectId: string;
  metadata: IWalletConnectMetadata;
}

export enum WalletPlugin {
  MetaMask = 'metamask',
  Coin98 = 'coin98',
  TrustWallet = 'trustwallet',
  BinanceChainWallet = 'binancechainwallet',
  ONTOWallet = 'onto',
  WalletConnect = 'walletconnect',
  BitKeepWallet = 'bitkeepwallet',
  FrontierWallet = 'frontierwallet',
}

export enum NetworkType {
  Mainnet,
  Testnet,
  NotSupported,
}

export function getNetworkType(chainId: number) {
  if (Mainnets.some(network => network === chainId)) {
    return NetworkType.Mainnet;
  }
  if (Testnets.some(network => network === chainId)) {
    return NetworkType.Testnet;
  }
  return NetworkType.NotSupported;
}

export function getNetworksByType(chainId: number): number[] {
  switch (getNetworkType(chainId)) {
    case NetworkType.Mainnet:
      return Mainnets;
    case NetworkType.Testnet:
      return Testnets;
  }
  return [];
}

interface Logo {
  default: string;
  mobile: string;
  footer: string;
}

interface FooterPageInfo {
  caption: string;
  link: string;
}

interface SocialMediaInfo {
  img: string;
  link: string;
}

interface TokenInfo {
  symbol: string;
  img: string;
}

export interface ProjectInfo {
  logo: Logo;
  versionText: string;
}

export interface IParams {
  projectInfo: ProjectInfo;
  footerPagesInfo: FooterPageInfo[];
  socialMediaInfo: SocialMediaInfo[];
  tokenInfo: TokenInfo;
}

export type ProxyAddresses = { [key: number]: string };

export class State {
  defaultChainId: number = 0;
  slippageTolerance = "0.5";
  proxyAddresses: ProxyAddresses = {};
  infuraId: string = "";
  rpcWalletId: string = "";
  networkMap = {} as { [key: number]: IExtendedNetwork };
  networkConfig = [] as INetworkConfig[];
  embedderCommissionFee: string;
  approvalModel: ERC20ApprovalModel;

  constructor(options: any) {
    this.initData(options);
  }

  initRpcWallet(defaultChainId: number) {
    this.defaultChainId = defaultChainId;
    if (this.rpcWalletId) {
      return this.rpcWalletId;
    }
    const clientWallet = Wallet.getClientInstance();
    const networkList: INetwork[] = Object.values(application.store?.networkMap || []);
    const instanceId = clientWallet.initRpcWallet({
      networks: networkList,
      defaultChainId,
      infuraId: application.store?.infuraId,
      multicalls: application.store?.multicalls
    });
    this.rpcWalletId = instanceId;
    if (clientWallet.address) {
      const rpcWallet = Wallet.getRpcWalletInstance(instanceId);
      rpcWallet.address = clientWallet.address;
    }
    const defaultNetworkList = getNetworkList();
    const defaultNetworkMap = defaultNetworkList.reduce((acc, cur) => {
      acc[cur.chainId] = cur;
      return acc;
    }, {});
    const supportedNetworks = ConfigData.supportedNetworks || [];
    for (let network of networkList) {
      const networkInfo = defaultNetworkMap[network.chainId];
      const supportedNetwork = supportedNetworks.find(v => v.chainId == network.chainId);
      if (!networkInfo || !supportedNetwork) continue;
      if (this.infuraId && network.rpcUrls && network.rpcUrls.length > 0) {
        for (let i = 0; i < network.rpcUrls.length; i++) {
          network.rpcUrls[i] = network.rpcUrls[i].replace(/{InfuraId}/g, this.infuraId);
        }
      }
      this.networkMap[network.chainId] = {
        ...networkInfo,
        ...network,
        isTestnet: supportedNetwork.isTestnet
      };
    }
    return instanceId;
  }

  getRpcWallet() {
    return this.rpcWalletId ? Wallet.getRpcWalletInstance(this.rpcWalletId) : null;
  }

  isRpcWalletConnected() {
    const wallet = this.getRpcWallet();
    return wallet?.isConnected;
  }

  getProxyAddress(chainId?: number) {
    const _chainId = chainId || Wallet.getInstance().chainId;
    const proxyAddresses = this.proxyAddresses;
    if (proxyAddresses) {
      return proxyAddresses[_chainId];
    }
    return null;
  }

  getNetworkInfo = (chainId: number) => {
    return this.networkMap[chainId];
  }

  getFilteredNetworks = (filter: (value: IExtendedNetwork, index: number, array: IExtendedNetwork[]) => boolean) => {
    let networkFullList = Object.values(this.networkMap);
    return networkFullList.filter(filter);
  }

  getSiteSupportedNetworks = () => {
    let networkFullList = Object.values(this.networkMap);
    let list = networkFullList.filter(network => !this.getNetworkInfo(network.chainId)?.isDisabled);
    return list;
  }

  getMatchNetworks = (conditions: NetworkConditions): IExtendedNetwork[] => {
    let networkFullList = Object.values(this.networkMap);
    let out = matchFilter(networkFullList, conditions);
    return out;
  }
  
  getNetworkExplorerName = (chainId: number) => {
    if (this.getNetworkInfo(chainId)) {
      return this.getNetworkInfo(chainId).explorerName;
    }
    return 'Unknown';
  }

  viewOnExplorerByTxHash = (chainId: number, txHash: string) => {
    let network = this.getNetworkInfo(chainId);
    if (network && network.explorerTxUrl) {
      let url = `${network.explorerTxUrl}${txHash}`;
      window.open(url);
    }
  }
  
  viewOnExplorerByAddress = (chainId: number, address: string) => {
    let network = this.getNetworkInfo(chainId);
    if (network && network.explorerAddressUrl) {
      let url = `${network.explorerAddressUrl}${address}`;
      window.open(url);
    }
  }

  getChainId() {
    const rpcWallet = this.getRpcWallet();
    return rpcWallet?.chainId;
  }

  getSlippageTolerance = (): number => {
    return Number(this.slippageTolerance) || 0;
  }

  setSlippageTolerance = (value: number) => {
    this.slippageTolerance = new BigNumber(value).toFixed();
  }


  setNetworkConfig = (networks: INetworkConfig[]) => {
    this.networkConfig = networks;
  }

  getNetworkConfig = () => {
    return this.networkConfig;
  }

  private initData(options: any) {
    if (options.infuraId) {
      this.infuraId = options.infuraId;
    }
    if (options.proxyAddresses) {
      this.proxyAddresses = options.proxyAddresses;
    }
  }

  async setApprovalModelAction(options: IERC20ApprovalEventOptions, spenderAddress: string) {
    const approvalOptions = {
      ...options,
      spenderAddress
    };
    let wallet = this.getRpcWallet();
    this.approvalModel = new ERC20ApprovalModel(wallet, approvalOptions);
    let approvalModelAction = this.approvalModel.getAction();
    return approvalModelAction;
  }
}

interface NetworkConditions {
  isDisabled?: boolean,
  isTestnet?: boolean,
  isMainChain?: boolean
}

function matchFilter<O extends { [keys: string]: any }>(list: O[], filter: Partial<O>): O[] {
  let filters = Object.keys(filter);
  return list.filter(item => filters.every(f => {
    switch (typeof filter[f]) {
      case 'boolean':
        if (filter[f] === false) {
          return !item[f];
        }
      // also case for filter[f] === true 
      case 'string':
      case 'number':
        return filter[f] === item[f];
      case 'object': // have not implemented yet
      default:
        console.log(`matchFilter do not support ${typeof filter[f]} yet!`)
        return false;
    }
  }));
}

export const getTokensDataList = async (tokenMapData: TokenMapType, tokenBalances: any): Promise<any[]> => {
  let dataList: any[] = [];
  for (let i = 0; i < Object.keys(tokenMapData).length; i++) {
    let tokenAddress = Object.keys(tokenMapData)[i];
    let tokenObject = tokenMapData[tokenAddress];
    if (tokenBalances) {
      dataList.push({
        ...tokenObject,
        status: false,
        value: tokenBalances[tokenAddress] ? tokenBalances[tokenAddress] : 0,
      });
    } else {
      dataList.push({
        ...tokenObject,
        status: null,
      })
    }
  }
  return dataList;
}

// wallet
export function getWalletProvider() {
  return localStorage.getItem('walletProvider') || '';
}

export function isWalletConnected() {
  const wallet = Wallet.getClientInstance();
  return wallet.isConnected;
}

export const truncateAddress = (address: string) => {
  if (address === undefined || address === null) return '';
  return address.substr(0, 6) + '...' + address.substr(-4);
}

export const getChainNativeToken = (chainId: number): ITokenObject => {
  return ChainNativeTokenByChainId[chainId];
};