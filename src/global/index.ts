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

export {
  formatNumber,
  formatNumberWithSeparators,
  DefaultDateTimeFormat,
  DefaultDateFormat,
  SITE_ENV,
  showResultMessage,
} from './helper';

export {
  registerSendTxEvents,
} from './common';