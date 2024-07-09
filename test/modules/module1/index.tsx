import { Module, customModule, Container, VStack, Styles, application } from '@ijstech/components';
import { getMulticallInfoList } from '@scom/scom-multicall';
import { INetwork } from '@ijstech/eth-wallet';
import getNetworkList from '@scom/scom-network-list';
import ScomOswapNftWidget from '@scom/oswap-nft-widget';

@customModule
export default class Module1 extends Module {
  private nftWidget: ScomOswapNftWidget;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    const multicalls = getMulticallInfoList();
    const networkMap = this.getNetworkMap(options.infuraId);
    application.store = {
      infuraId: options.infuraId,
      multicalls,
      networkMap
    }
  }

  private getNetworkMap = (infuraId?: string) => {
    const networkMap = {};
    const defaultNetworkList: INetwork[] = getNetworkList();
    const defaultNetworkMap: Record<number, INetwork> = defaultNetworkList.reduce((acc, cur) => {
      acc[cur.chainId] = cur;
      return acc;
    }, {});
    for (const chainId in defaultNetworkMap) {
      const networkInfo = defaultNetworkMap[chainId];
      const explorerUrl = networkInfo.blockExplorerUrls && networkInfo.blockExplorerUrls.length ? networkInfo.blockExplorerUrls[0] : "";
      if (infuraId && networkInfo.rpcUrls && networkInfo.rpcUrls.length > 0) {
        for (let i = 0; i < networkInfo.rpcUrls.length; i++) {
          networkInfo.rpcUrls[i] = networkInfo.rpcUrls[i].replace(/{INFURA_ID}/g, infuraId);
        }
      }
      networkMap[networkInfo.chainId] = {
        ...networkInfo,
        symbol: networkInfo.nativeCurrency?.symbol || "",
        explorerTxUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}tx/` : "",
        explorerAddressUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}address/` : ""
      }
    }
    return networkMap;
  }

  async init() {
    super.init();
    this.nftWidget.style.width = '100%';
    const dapp: any = this.nftWidget.querySelector('i-scom-dapp-container');
    if (dapp) {
      dapp.style.setProperty('--background-modal', '#252a48');
    }
  }

  render() {
    return (
      <i-panel>
        <i-hstack
          id="mainStack"
          margin={{ top: '1rem', left: '1rem' }}
          justifyContent="center"
          width="100%"
        >
          <i-oswap-nft-widget
            id="nftWidget"
            tier="hungry"
            defaultChainId={97}
            networks={[
              {
                "chainId": 97
              }
            ]}
            wallets={[
              {
                "name": "metamask"
              }
            ]}
          />
        </i-hstack>
      </i-panel>
    )
  }
}