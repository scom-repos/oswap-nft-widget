import { INetwork } from '@ijstech/eth-wallet';

export interface IExtendedNetwork extends INetwork {
  shortName?: string;
  isDisabled?: boolean;
  isMainChain?: boolean;
  explorerName?: string;
  explorerTxUrl?: string;
  explorerAddressUrl?: string;
  isTestnet?: boolean;
};

export const enum EventId {
  IsWalletConnected = 'isWalletConnected',
  IsWalletDisconnected = 'IsWalletDisconnected',
  Paid = 'Paid'
}

export {
  getAPI,
  formatNumber,
  formatNumberWithSeparators,
  DefaultDateTimeFormat,
  DefaultDateFormat,
  formatDate,
  formatUTCDate,
  limitDecimals,
  limitInputNumber,
  isInvalidInput,
  toWeiInv,
  numberToBytes32,
  getParamsFromUrl,
  uniqWith,
  getWeekDays,
  compareDate,
  formatPercentNumber,
  SITE_ENV,
  showResultMessage,
  flatMap
} from './helper';

export {
  parseContractError
} from './error';

export {
  isTransactionConfirmed,
  registerSendTxEvents,
  TokenMapType,
  isAddressValid,
  ERC20MaxAmount,
} from './common';