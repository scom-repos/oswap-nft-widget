import { BigNumber } from "@ijstech/eth-wallet";

export enum SITE_ENV {
  DEV = 'dev',
  TESTNET = 'testnet',
  MAINNET = 'mainnet',
}

export const DefaultDateTimeFormat = 'DD/MM/YYYY HH:mm:ss';
export const DefaultDateFormat = 'DD/MM/YYYY';

export const formatNumber = (value: any, decimals?: number, options?: { min?: number, sign?: string }) => {
  let val = value;
  const { min = '0.0000001', sign = '' } = options || {};
  const minValue = min;
  if (typeof value === 'string') {
    val = new BigNumber(value).toNumber();
  } else if (typeof value === 'object') {
    val = value.toNumber();
  }
  if (val != 0 && new BigNumber(val).lt(minValue)) {
    return `< ${sign}${minValue}`;
  }
  return `${sign}${formatNumberWithSeparators(val, decimals || 4)}`;
};

export const formatNumberWithSeparators = (value: number, precision?: number) => {
  if (!value) value = 0;
  if (precision) {
    let outputStr = '';
    if (value >= 1) {
      const unit = Math.pow(10, precision);
      const rounded = Math.floor(value * unit) / unit;
      outputStr = rounded.toLocaleString('en-US', { maximumFractionDigits: precision });
    } else {
      outputStr = value.toLocaleString('en-US', { maximumSignificantDigits: precision });
    }
    if (outputStr.length > 18) {
      outputStr = outputStr.substring(0, 18) + '...';
    }
    return outputStr;
  }
  return value.toLocaleString('en-US');
}

export const showResultMessage = (result: any, status: 'warning' | 'success' | 'error', content?: string | Error) => {
  if (!result) return;
  let params: any = { status };
  if (status === 'success') {
    params.txtHash = content;
  } else {
    params.content = content;
  }
  result.message = { ...params };
  result.showModal();
}
