import { Module, customModule, Container, VStack, Styles, application } from '@ijstech/components';
import { getMulticallInfoList } from '@scom/scom-multicall';
import { INetwork } from '@ijstech/eth-wallet';
import getNetworkList from '@scom/scom-network-list';
import ScomOswapNftWidget from '@scom/oswap-nft-widget';

const Theme = Styles.Theme.currentTheme;
Theme.background.main = '#2c2626';
Theme.background.default = '#0c1234';
Theme.text.primary = '#d3c0c0 ';
Theme.input.background = '#272F39';
Theme.input.fontColor = '#ffffff4d';
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
    this.nftWidget.style.maxWidth = '1440px';
    const dapp: any = this.nftWidget.querySelector('i-scom-dapp-container');
    if (dapp) {
      dapp.style.setProperty('--background-default', Theme.background.default);
    }
  }

  render() {
    return (
      <i-panel>
        <i-hstack
          id="mainStack"
          margin={{ top: '1rem', left: '1rem' }}
          gap="2rem"
          justifyContent="center"
          width="100%"
        >
          <i-oswap-nft-widget
            id="nftWidget"
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