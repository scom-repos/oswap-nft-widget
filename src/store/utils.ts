import { application } from '@ijstech/components';
import { BigNumber, ERC20ApprovalModel, IERC20ApprovalEventOptions, INetwork, Wallet } from '@ijstech/eth-wallet';
import { IExtendedNetwork } from '../global/index';
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
    // const supportedNetworks = ConfigData.supportedNetworks || [];
    for (let network of networkList) {
      const networkInfo = defaultNetworkMap[network.chainId];
      // const supportedNetwork = supportedNetworks.find(v => v.chainId == network.chainId);
      // if (!networkInfo || !supportedNetwork) continue;
      if (!networkInfo) continue;
      if (this.infuraId && network.rpcUrls && network.rpcUrls.length > 0) {
        for (let i = 0; i < network.rpcUrls.length; i++) {
          network.rpcUrls[i] = network.rpcUrls[i].replace(/{InfuraId}/g, this.infuraId);
        }
      }
      this.networkMap[network.chainId] = {
        ...networkInfo,
        ...network
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

// wallet
export function getWalletProvider() {
  return localStorage.getItem('walletProvider') || '';
}

export function isClientWalletConnected() {
  const wallet = Wallet.getClientInstance();
  return wallet.isConnected;
}

export const getChainNativeToken = (chainId: number): ITokenObject => {
  return ChainNativeTokenByChainId[chainId];
};

//custom loop
export async function forEachNumberIndexAwait<T>(list: { [index: number]: T }, callbackFn: (item: T, index: number) => Promise<void>) {
  for (const chainId in list) {
    if (
      Object.prototype.hasOwnProperty.call(list, chainId)
      && new BigNumber(chainId).isInteger()
    ) await callbackFn(list[chainId], Number(chainId));
  }
}

export function forEachNumberIndex<T>(list: { [index: number]: T }, callbackFn: (item: T, index: number) => void) {
  for (const chainId in list) {
    if (
      Object.prototype.hasOwnProperty.call(list, chainId)
      && new BigNumber(chainId).isInteger()
    ) callbackFn(list[chainId], Number(chainId));
  }
}

export function mapIndexNumber<T,X>(list: { [index: number]: T }, callbackFn: (item: T, index: number) => X) {
  let out:X[] = [];
  for (const chainId in list) {
    if (
      Object.prototype.hasOwnProperty.call(list, chainId)
      && new BigNumber(chainId).isInteger()
    ) out.push(callbackFn(list[chainId], Number(chainId)));
  }
  return out;
}

export function mapRecordIndex<T,X,I extends string | number | symbol>(list: Record<I,T>, callbackFn: (item: T, index: I, list:Record<I,T>) => X) {
  let out:X[] = [];
  for (const index in list) {
    if (Object.prototype.hasOwnProperty.call(list, index)) out.push(callbackFn(list[index], index, list));
  }
  return out;
}

export function forEachRecordIndex<T,X,I extends string | number | symbol>(list: Record<I,T>, callbackFn: (item: T, index: I, list:Record<I,T>) => X) {
  for (const index in list) {
    if (Object.prototype.hasOwnProperty.call(list, index)) callbackFn(list[index], index, list);
  }
}

export function mapRecord<T,X,I extends string | number | symbol>(list: Record<I,T>, callbackFn: (item: T, index: I, list:Record<I,T>) => X):Record<I,X> {
  let out = {} as Record<I,X>;
  for (const index in list) {
    if (Object.prototype.hasOwnProperty.call(list, index)) out[index] = callbackFn(list[index], index, list);
  }
  return out;
}

export async function mapRecordAwait<T,X,I extends string | number | symbol>(list: Record<I,T>, callbackFn: (item: T, index: I, list:Record<I,T>) => Promise<X>):Promise<Record<I, X>> {
  let out = {} as Record<I,X>;
  for (const index in list) {
    if (Object.prototype.hasOwnProperty.call(list, index)) out[index] = await callbackFn(list[index], index, list);
  }
  return out;
}

export function mapRecordNumber<T,X>(list: Record<number,T>, callbackFn: (item: T, index: number, list:Record<number,T>) => X):Record<number,X> {
  let out = {} as Record<number,X>;
  for (const key in list) {
    if (Object.prototype.hasOwnProperty.call(list, key) && !isNaN(+key)) {
      out[+key]=callbackFn(list[key], +key, list);
    }
  }
  return out;
}

export async function mapRecordNumberAwait<T,X>(list: Record<number,T>, callbackFn: (item: T, index: number, list:Record<number,T>) => Promise<X>):Promise<Record<number, X>> {
  let out = {} as Record<number,X>;
  for (const key in list) {
    if (Object.prototype.hasOwnProperty.call(list, key) && !isNaN(+key)) {
      out[+key] = await callbackFn(list[key], +key, list);
    }
  }
  return out;
}