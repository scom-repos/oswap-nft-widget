import { assets as tokenAssets, tokenStore } from '@scom/scom-token-list';
import { getChainNativeToken, isClientWalletConnected, State } from './utils';

export * from './data/index';

export const nullAddress = "0x0000000000000000000000000000000000000000";

export const getTokenIcon = (address: string, chainId: number) => {
  if (!address) return '';
  const tokenMap = tokenStore.getTokenMapByChainId(chainId);
  let ChainNativeToken;
  let tokenObject;
  if (isClientWalletConnected()) {
    ChainNativeToken = getChainNativeToken(chainId);
    tokenObject = address == ChainNativeToken.symbol ? ChainNativeToken : tokenMap[address.toLowerCase()];
  } else {
    tokenObject = tokenMap[address.toLowerCase()];
  }
  return tokenAssets.tokenPath(tokenObject, chainId);
}

export const tokenSymbol = (address: string, chainId: number) => {
  const tokenMap = tokenStore.getTokenMapByChainId(chainId);
  if (!address || !tokenMap) return '';
  const nativeToken = getChainNativeToken(chainId);
  let tokenObject = nativeToken.symbol.toLowerCase() === address.toLowerCase() ? nativeToken : tokenMap[address.toLowerCase()];
  if (!tokenObject) tokenObject = tokenMap[address];
  return tokenObject ? tokenObject.symbol : '';
}

export const tokenName = (address: string, chainId: number) => {
  const tokenMap = tokenStore.getTokenMapByChainId(chainId);
  if (!address || !tokenMap) return '';
  const nativeToken = getChainNativeToken(chainId);
  let tokenObject = nativeToken.symbol.toLowerCase() === address.toLowerCase() ? nativeToken : tokenMap[address.toLowerCase()];
  if (!tokenObject) tokenObject = tokenMap[address];
  return tokenObject?.name || '';
}

export const getNetworkImg = (state: State, chainId: number) => {
  try {
    const network = state.getNetworkInfo(chainId);
    if (network) {
      return network.image;
    }
  } catch { }
  return tokenAssets.fallbackUrl;
}

export * from './utils';
