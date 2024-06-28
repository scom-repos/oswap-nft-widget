import { Control } from '@ijstech/components';
import { assets as tokenAssets } from '@scom/scom-token-list';
import { ITokenObject } from '@scom/scom-token-list';
import { State } from '../store/index';

export const nftMyRewardsColumns = (state: State) => {
  return [
    {
      title: 'Token',
      fieldName: 'token',
      key: 'token',
      onRenderCell: (source: Control, token: ITokenObject, rowData: any) => {
        if (!token) return '';
        let tokenPath = tokenAssets.tokenPath(token, state.getChainId());
        return `
        <i-hstack gap="4px" verticalAlignment="center">
          <i-image height="25" width="25" url="${tokenPath}"></i-image>
          <i-label caption="${token.symbol}"></i-label>
        </i-hstack>
        <i-vstack class="render-mobile--item" gap="8px">
          <i-hstack gap="4px" verticalAlignment="center">
            <i-label caption="Vesting Start Date:"></i-label>
            <i-label caption="${rowData.startDate}"></i-label>
          </i-hstack>
          <i-hstack gap="4px" verticalAlignment="center" class="custom-min--h">
            <i-label caption="Locked Amount:"></i-label>
            <i-label caption="${rowData.lockedAmount}"></i-label>
          </i-hstack>
        </i-vstack>
      `;
      }
    },
    {
      title: 'Vesting Start Date',
      fieldName: 'startDate',
      key: 'startDate',
      textAlign: 'center' as any
    },
    {
      title: 'Vesting End Date',
      fieldName: 'endDate',
      key: 'endDate',
      textAlign: 'center'
    },
    {
      title: 'Locked Amount',
      fieldName: 'lockedAmount',
      key: 'lockedAmount',
      textAlign: 'right'
    },
    {
      title: 'Claimable Amount',
      fieldName: 'claimableAmount',
      key: 'claimableAmount',
      textAlign: 'right'
    },
    {
      title: '',
      fieldName: 'claim',
      key: 'claim',
      onRenderCell: (source: Control, token: ITokenObject, rowData: any) => {
        return {} as any
      }
    }
  ]
};

export default {
  nftMyRewardsColumns,
};
