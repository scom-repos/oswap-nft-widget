import {
  customModule,
  Control,
  Module,
  Styles,
  Label,
  Button,
  Image,
  Panel,
  Container,
  application,
  HStack,
  VStack,
  ControlElement,
  customElements,
  Table,
  moment
} from '@ijstech/components';
import { BigNumber, Constants, IERC20ApprovalAction, Wallet } from '@ijstech/eth-wallet';
import {
  isWalletConnected,
  State,
  NFT_TYPE,
  IDataCard,
  IDataMyCard,
} from './store/index';
import {
  formatNumber,
  showResultMessage,
  registerSendTxEvents,
  formatDate,
  DefaultDateFormat,
  formatNumberWithSeparators,
} from './global/index'
import Assets from './assets';
import ScomCommissionFeeSetup from '@scom/scom-commission-fee-setup';
import ScomTxStatusModal from '@scom/scom-tx-status-modal';
import ScomDappContainer from '@scom/scom-dapp-container'
import { tokenStore, assets as tokenAssets, ITokenObject } from '@scom/scom-token-list';
import ScomWalletModal, { IWalletPlugin } from '@scom/scom-wallet-modal';
import { nftMyRewardsColumns, NftCard, NftMyCard, getTrollCampInfo, getUserNFTs, mintNFT, burnNFT, getOwnRewards, claimMultiple, claimReward, getCommissionRate } from './nft-utils/index';
import { getBuilderSchema, getProjectOwnerSchema } from './formSchema';
import { nftStyle, listMediaStyles, tabStyle, nftDefaultStyle } from './index.css';
import configData from './data.json';

const Theme = Styles.Theme.ThemeVars;

interface ICommissionInfo {
  chainId: number;
  walletAddress: string;
}

interface INetworkConfig {
  chainName?: string;
  chainId: number;
}

let myRewardData: any[] = [];

const enum KEY_TAB {
  NEW_NFT,
  MY_NFTS,
  MY_REWARD
}

interface ScomOswapNftWidgetElement extends ControlElement {
  lazyLoad?: boolean;
  campaignId?: number;
  defaultChainId: number;
  networks: INetworkConfig[];
  wallets: IWalletPlugin[];
  showHeader?: boolean;
  commissions?: ICommissionInfo[];
}

export interface INftOswapWidgetData {
  campaignId?: number;
  commissions?: ICommissionInfo[];
  defaultChainId: number;
  wallets: IWalletPlugin[];
  networks: INetworkConfig[];
  showHeader?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-oswap-nft-widget']: ScomOswapNftWidgetElement;
    }
  }
}
declare const window: any;

@customModule
@customElements('i-scom-oswap-nft-widget')
export default class ScomOswapNftWidget extends Module {
  private dappContainer: ScomDappContainer;
  private mdWallet: ScomWalletModal;
  private state: State;
  private chainId: number;
  private approvalModelAction: IERC20ApprovalAction;

  private cardRow: Panel;
  private myCardRow: Panel;
  private myRewardTable: Table;
  private mint: Panel;
  private minting: Panel;
  private burning: Panel;
  private txStatusModal: ScomTxStatusModal;
  private lbMintTitle: Label;
  private lbMintFee: Label;
  private lbMintStakeAmountText: Label;
  private lbMintStakeAmount: Label;
  private lbMintRewardsBoost: Label;
  private lbMintMonthlyReward: Label;
  private lbMintFlashSales: Label;
  private lbTokenBalance: Label;
  private ImageMintStakeToken: Image;
  private lbMintStakeToken: Label;
  private lbMintMessage1: Label;
  private lbMintMessage2: Label;
  private btnApprove: Button;
  private btnMint: Button;
  private btnBurn: Button;
  private lbBurnMessage: Label;
  private lbMyNFTsNum: Label;
  private lbMyNFTsStakeValue: Label;
  private currentDataCard: IDataCard;
  private dataCards: IDataCard[];
  private ImageBurn: Image;
  private dataMyCards: IDataMyCard[];
  private currentDataMyCard: IDataMyCard;
  private currentTab: number = KEY_TAB.NEW_NFT;
  private myNFTsLoading: Panel;
  private myRewardLoading: Panel;
  private btnClaimAll: Button;
  private emptyRewardsMsg: Label;
  private myNFTsInfoPanel: Panel;

  private _data: INftOswapWidgetData = {
    defaultChainId: 0,
    wallets: [],
    networks: []
  };
  tag: any = {};

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.deferReadyCallback = true;
  }

  removeRpcWalletEvents() {
    const rpcWallet = this.state.getRpcWallet();
    if (rpcWallet) rpcWallet.unregisterAllWalletEvents();
  }

  onHide() {
    this.dappContainer.onHide();
    this.removeRpcWalletEvents();
  }

  get defaultChainId() {
    return this._data.defaultChainId;
  }

  set defaultChainId(value: number) {
    this._data.defaultChainId = value;
  }

  get wallets() {
    return this._data.wallets ?? [];
  }

  set wallets(value: IWalletPlugin[]) {
    this._data.wallets = value;
  }

  get networks() {
    return this._data.networks ?? [];
  }

  set networks(value: INetworkConfig[]) {
    this._data.networks = value;
  }

  get showHeader() {
    return this._data.showHeader ?? true;
  }

  set showHeader(value: boolean) {
    this._data.showHeader = value;
  }

  set width(value: string | number) {
    this.resizeUI(value);
  }

  private determineActionsByTarget(target: 'builder' | 'projectOwner', category?: string) {
    if (target === 'builder') {
      return this.getBuilderActions(category);
    }
    return this.getProjectOwnerActions();
  }

  private async loadCommissionFee() {
    if (this._data.campaignId && this.state.embedderCommissionFee === undefined) {
      const commissionRate = await getCommissionRate(this.state, this._data.campaignId);
      this.state.embedderCommissionFee = commissionRate;
    }
  }

  private getBuilderActions(category?: string) {
    const formSchema = getBuilderSchema();
    const dataSchema = formSchema.dataSchema;
    const uiSchema = formSchema.uiSchema;
    const customControls = formSchema.customControls();
    let self = this;
    const actions: any[] = [
      {
        name: 'Commissions',
        icon: 'dollar-sign',
        command: (builder: any, userInputData: any) => {
          let _oldData: INftOswapWidgetData = {
            defaultChainId: 0,
            wallets: [],
            networks: []
          }
          return {
            execute: async () => {
              _oldData = { ...this._data };
              if (userInputData.commissions) this._data.commissions = userInputData.commissions;
              this.refreshUI();
              if (builder?.setData) builder.setData(this._data);
            },
            undo: () => {
              this._data = { ..._oldData };
              this.refreshUI();
              if (builder?.setData) builder.setData(this._data);
            },
            redo: () => { }
          }
        },
        customUI: {
          render: async (data?: any, onConfirm?: (result: boolean, data: any) => void) => {
            const vstack = new VStack();
            await self.loadCommissionFee();
            const config = new ScomCommissionFeeSetup(null, {
              commissions: self._data.commissions || [],
              fee: self.state.embedderCommissionFee,
              networks: self._data.networks
            });
            const hstack = new HStack(null, {
              verticalAlignment: 'center',
            });
            const button = new Button(hstack, {
              caption: 'Confirm',
              width: '100%',
              height: 40,
              font: { color: Theme.colors.primary.contrastText }
            });
            vstack.append(config);
            vstack.append(hstack);
            button.onClick = async () => {
              const commissions = config.commissions;
              if (onConfirm) onConfirm(true, { commissions });
            }
            return vstack;
          }
        }
      }
    ]
    if (category !== 'offers') {
      actions.push({
        name: 'Edit',
        icon: 'edit',
        command: (builder: any, userInputData: any) => {
          let oldData: any = {
            defaultChainId: 0,
            wallets: [],
            networks: []
          };
          let oldTag = {};
          return {
            execute: async () => {
              oldData = JSON.parse(JSON.stringify(this._data));
              const {
                networks,
                tokens,
                ...themeSettings
              } = userInputData;

              const generalSettings = {
                networks,
                tokens
              };

              this._data.networks = generalSettings.networks;
              this._data.defaultChainId = this._data.networks[0].chainId;
              await this.resetRpcWallet();
              this.refreshUI();
              if (builder?.setData) builder.setData(this._data);

              oldTag = JSON.parse(JSON.stringify(this.tag));
              if (builder?.setTag) builder.setTag(themeSettings);
              else this.setTag(themeSettings);
              if (this.dappContainer) this.dappContainer.setTag(themeSettings);
            },
            undo: () => {
              this._data = JSON.parse(JSON.stringify(oldData));
              this.refreshUI();
              if (builder?.setData) builder.setData(this._data);

              this.tag = JSON.parse(JSON.stringify(oldTag));
              if (builder?.setTag) builder.setTag(this.tag);
              else this.setTag(this.tag);
              if (this.dappContainer) this.dappContainer.setTag(this.tag);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: dataSchema,
        userInputUISchema: uiSchema,
        customControls: customControls
      });
    }
    return actions
  }

  private getProjectOwnerActions() {
    const formSchema: any = getProjectOwnerSchema();
    if (!formSchema) return [];
    const propertiesDataSchema = formSchema.general.dataSchema;
    const propertiesUISchema = formSchema.general.uiSchema;
    const actions: any[] = [
      {
        name: 'Settings',
        userInputDataSchema: propertiesDataSchema,
        userInputUISchema: propertiesUISchema
      }
    ];
    return actions
  }

  getConfigurators() {
    let self = this;
    return [
      {
        name: 'Project Owner Configurator',
        target: 'Project Owners',
        getActions: (category?: string) => {
          return this.determineActionsByTarget('projectOwner', category);
        },
        getData: this.getData.bind(this),
        setData: async (value: any) => {
          this.setData(value);
        },
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: (category?: string) => {
          return this.determineActionsByTarget('builder', category);
        },
        getData: this.getData.bind(this),
        setData: async (value: any) => {
          const defaultData = configData.defaultBuilderData;
          this.setData({ ...defaultData, ...value });
        },
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Embedder Configurator',
        target: 'Embedders',
        elementName: 'i-scom-commission-fee-setup',
        getLinkParams: () => {
          const commissions = this._data.commissions || [];
          return {
            data: window.btoa(JSON.stringify(commissions))
          }
        },
        bindOnChanged: (element: ScomCommissionFeeSetup, callback: (data: any) => Promise<void>) => {
          element.onChanged = async (data: any) => {
            let resultingData = {
              ...self._data,
              ...data
            };

            await this.setData(resultingData);
            await callback(data);
          }
        },
        getData: async () => {
          await self.loadCommissionFee();
          const fee = this.state.embedderCommissionFee;
          return { ...this._data, fee }
        },
        setData: async (properties: INftOswapWidgetData, linkParams?: Record<string, any>) => {
          let resultingData = {
            ...properties
          }
          if (linkParams?.data) {
            const decodedString = window.atob(linkParams.data);
            const commissions = JSON.parse(decodedString);
            resultingData.commissions = commissions;

          }
          await this.setData(resultingData);
        },
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Editor',
        target: 'Editor',
        getActions: (category?: string) => {
          const actions = this.determineActionsByTarget('builder', 'category');
          const editAction = actions.find(action => action.name === 'Edit');
          return editAction ? [editAction] : [];
        },
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  private getData() {
    return this._data;
  }

  private async resetRpcWallet() {
    this.removeRpcWalletEvents();
    const rpcWalletId = await this.state.initRpcWallet(this.defaultChainId);
    const rpcWallet = this.state.getRpcWallet();
    const chainChangedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.ChainChanged, async (chainId: number) => {
      this.onChainChange();
    });
    const connectedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.Connected, async (connected: boolean) => {
      await this.initializeWidgetConfig();
    });
    const data: any = {
      defaultChainId: this.defaultChainId,
      wallets: this.wallets,
      networks: this.networks,
      showHeader: this.showHeader,
      rpcWalletId: rpcWallet.instanceId
    }
    if (this.dappContainer?.setData) this.dappContainer.setData(data);
  }

  private async setData(value: INftOswapWidgetData) {
    this._data = value;
    this.state.setNetworkConfig(value.networks);
    for (let network of this._data.networks) {
      tokenStore.updateTokenMapData(network.chainId);
    }
    await this.resetRpcWallet();
    await this.refreshUI();
  }

  private async getTag() {
    return this.tag;
  }

  private updateTag(type: 'light' | 'dark', value: any) {
    this.tag[type] = this.tag[type] ?? {};
    for (let prop in value) {
      if (value.hasOwnProperty(prop))
        this.tag[type][prop] = value[prop];
    }
  }

  private async setTag(value: any) {
    const newValue = value || {};
    for (let prop in newValue) {
      if (newValue.hasOwnProperty(prop)) {
        if (prop === 'light' || prop === 'dark')
          this.updateTag(prop, newValue[prop]);
        else
          this.tag[prop] = newValue[prop];
      }
    }
    if (this.dappContainer)
      this.dappContainer.setTag(this.tag);
    this.updateTheme();
    this.resizeUI();
  }

  private updateStyle(name: string, value: any) {
    value ?
      this.style.setProperty(name, value) :
      this.style.removeProperty(name);
  }

  private updateTheme() {
    const themeVar = this.dappContainer?.theme || 'light';
    this.updateStyle('--text-primary', this.tag[themeVar]?.fontColor);
    this.updateStyle('--background-main', this.tag[themeVar]?.backgroundColor);
    this.updateStyle('--input-font_color', this.tag[themeVar]?.inputFontColor);
    this.updateStyle('--input-background', this.tag[themeVar]?.inputBackgroundColor);
    //FIXME: temporary solution
    this.updateStyle('--primary-button-background', this.tag[themeVar]?.primaryButtonBackground || 'transparent linear-gradient(90deg, #AC1D78 0%, #E04862 100%) 0% 0% no-repeat padding-box');
    this.updateStyle('--primary-button-hover-background', this.tag[themeVar]?.primaryButtonHoverBackground || 'linear-gradient(255deg,#f15e61,#b52082)');
    this.updateStyle('--primary-button-disabled-background', this.tag[themeVar]?.primaryButtonDisabledBackground || 'transparent linear-gradient(270deg,#351f52,#552a42) 0% 0% no-repeat padding-box');
    this.updateStyle('--max-button-background', this.tag[themeVar]?.maxButtonBackground || 'transparent linear-gradient(255deg,#e75b66,#b52082) 0% 0% no-repeat padding-box');
    this.updateStyle('--max-button-hover-background', this.tag[themeVar]?.maxButtonHoverBackground || 'linear-gradient(255deg,#f15e61,#b52082)');
  }

  private myRewardsCols() {
    let cols = nftMyRewardsColumns;
    const self = this;
    cols[cols.length - 1] = {
      title: '',
      fieldName: 'claim',
      key: 'claim',
      onRenderCell: async function (source: Control, data: any, row: any) {
        const panel = await Panel.create();
        const button = await Button.create();
        button.caption = 'Claim';
        button.classList.add('btn-claim', 'btn-os');
        button.onClick = () => self.claimAllRewards(button, row.tokenId);
        panel.appendChild(button);

        const vstackMobile = new VStack();
        const hstackDate = new HStack(undefined, { margin: { bottom: '0.5rem' } });
        const hstackAmount = new HStack();
        const lbDate = await Label.create({ margin: { right: '0.25rem' } });
        const lbDateVal = await Label.create();
        const lbAmount = await Label.create({ margin: { right: '0.25rem' } });
        const lbAmountVal = await Label.create();
        vstackMobile.classList.add('render-mobile--item');
        hstackAmount.classList.add('custom-min--h');
        lbDate.caption = 'Vesting End Date:';
        lbDateVal.caption = row.endDate;
        lbAmount.caption = 'Claimable Amount:';
        lbAmountVal.caption = row.claimableAmount;
        hstackDate.append(lbDate, lbDateVal);
        hstackAmount.append(lbAmount, lbAmountVal);
        vstackMobile.append(hstackDate, hstackAmount);
        panel.appendChild(vstackMobile);
        return panel;
      }
    }
    return cols;
  }

  private async refreshUI() {
    await this.initializeWidgetConfig();
  }

  private isEmptyData(value: INftOswapWidgetData) {
    return !value || !value.networks || value.networks.length === 0;
  }

  async init() {
    super.init();
    this.state = new State(configData);
    this.chainId = this.state.getChainId();
    const lazyLoad = this.getAttribute('lazyLoad', true, false);
    if (!lazyLoad) {
      const campaignId = this.getAttribute('campaignId', true);
      const commissions = this.getAttribute('commissions', true, []);
      const defaultChainId = this.getAttribute('defaultChainId', true);
      const defaultInputToken = this.getAttribute('defaultInputToken', true);
      const networks = this.getAttribute('networks', true);
      const wallets = this.getAttribute('wallets', true);
      const showHeader = this.getAttribute('showHeader', true);
      let data = {
        campaignId,
        commissions,
        defaultChainId,
        defaultInputToken,
        networks,
        wallets,
        showHeader
      };
      if (!this.isEmptyData(data)) {
        await this.setData(data);
      }
    };

    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.resizeUI();
      }, 300);
    });

    this.executeReadyCallback();
  }

  private checkWidth(width: number, value: number) {
    return (this.offsetWidth !== 0 && this.offsetWidth < value) || (window as any).innerWidth < value || (!isNaN(width) && width !== 0 && width < value);
  }

  private resizeUI(value?: number | string) {
    let interval = setInterval(() => {
      const tagWidth = Number(value || this.tag?.width);
      const screens = Object.keys(listMediaStyles);
      screens.forEach((screen) => {
        this.classList.remove(listMediaStyles[screen]);
      })
      this.classList.remove(nftDefaultStyle);
      if (this.checkWidth(tagWidth, 1420)) {
        for (const screen of screens) {
          if (this.checkWidth(tagWidth, Number(screen))) {
            this.classList.add(listMediaStyles[screen]);
            break;
          }
        }
      } else {
        this.classList.add(nftDefaultStyle);
      }
      clearInterval(interval);
    }, 100);
  }

  private initWallet = async () => {
    try {
      await Wallet.getClientInstance().init();
      const rpcWallet = this.state.getRpcWallet();
      await rpcWallet.init();
    } catch (err) {
      console.log(err);
    }
  }

  private initializeWidgetConfig = async () => {
    setTimeout(async () => {
      await this.initWallet();
      this.chainId = this.state.getChainId();
      await this.updateBalances();
      this.renderData();
    })
  }

  private onChainChange = async () => {
    this.chainId = this.state.getChainId();
    tokenStore.updateTokenMapData(this.chainId);
    this.initializeWidgetConfig();
  }

  private async initApprovalModelAction(item: IDataCard) {
    this.approvalModelAction = await this.state.setApprovalModelAction({
      sender: this,
      payAction: async () => {
        mintNFT(item.address, item.stakeToken, item.totalPayAmount);
      },
      onToBeApproved: async (token: ITokenObject) => {
        this.btnApprove.visible = true;
        this.btnMint.visible = false;
        this.btnApprove.caption = `Approve ${token.symbol}`;
        this.btnApprove.enabled = true;
        this.btnMint.enabled = false;
      },
      onToBePaid: async (token: ITokenObject) => {
        this.btnApprove.visible = false;
        this.btnMint.visible = true;
        this.btnMint.enabled = true;
      },
      onApproving: async (token: ITokenObject, receipt?: string, data?: any) => {
        this.btnApprove.rightIcon.visible = true;
        this.btnApprove.enabled = false;
        this.btnApprove.caption = `Approving ${token.symbol}`;
        if (receipt) {
          showResultMessage(this.txStatusModal, 'success', receipt);
        }
      },
      onApproved: async (token: ITokenObject, data?: any) => {
        this.btnApprove.rightIcon.visible = false;
      },
      onApprovingError: async (token: ITokenObject, err: Error) => {
        showResultMessage(this.txStatusModal, 'error', err);
      },
      onPaying: async (receipt?: string, data?: any) => {
        if (receipt) {
          showResultMessage(this.txStatusModal, 'success', receipt);
          this.btnMint.rightIcon.visible = true;
          this.btnMint.caption = 'Staking';
        }
      },
      onPaid: async (data?: any) => {
        await this.updateBalances();
        this.btnMint.rightIcon.visible = false;
        this.btnMint.caption = 'Stake';
        this.handleBack();
        this.renderCards();
      },
      onPayingError: async (err: Error) => {
        showResultMessage(this.txStatusModal, 'error', err);
      }
    }, item.address)
  }

  private async updateBalances() {
    await tokenStore.updateTokenBalancesByChainId(this.state.getChainId());
  }

  private async switchNetworkByWallet() {
    if (this.mdWallet) {
      await application.loadPackage('@scom/scom-wallet-modal', '*');
      this.mdWallet.networks = this.networks;
      this.mdWallet.wallets = this.wallets;
      this.mdWallet.showModal();
    }
  }

  private onChangeTab(key: KEY_TAB) {
    if (key === this.currentTab) return;
    this.currentTab = key;
    this.resizeUI();
    switch (key) {
      case KEY_TAB.NEW_NFT:
        this.renderCards();
        break;
      case KEY_TAB.MY_NFTS:
        this.renderMyCards();
        break;
      case KEY_TAB.MY_REWARD:
        this.renderMyReward();
        break;
      default:
        break;
    }
  }

  private renderEmpty(elm: any, _msg?: string) {
    if (!elm) return;
    let msg = '';
    if (isWalletConnected()) {
      switch (this.currentTab) {
        case KEY_TAB.NEW_NFT:
          msg = 'Your very own NFT is getting ready!';
          break;
        case KEY_TAB.MY_NFTS:
          msg = 'You have no NFT in the My NFTs!';
          break;
      }
    } else {
      msg = _msg || 'Please connect with you wallet!';
    }
    elm.innerHTML = '';
    elm.appendChild(<i-panel width="100%">
      <i-hstack gap="32px">
        <i-panel border={{ radius: '12px' }} background={{ color: "#ffffff33" }} width="100%" height="auto">
          <i-vstack padding={{ top: 30, bottom: 30 }} horizontalAlignment="center">
            <i-panel class="text-center" width="100%">
              <i-image url={Assets.fullPath('img/nft/TrollEgg.svg')} width={200} height="auto" />
            </i-panel>
            <i-label class="text-center" width="100%" margin={{ top: 20 }} caption={msg} font={{ color: 'white', size: '1.5rem' }} />
          </i-vstack>
        </i-panel>
      </i-hstack>
    </i-panel>)
  };

  private renderMyRewardEmpty(source: Control) {
    const emptyElm = (
      <i-hstack verticalAlignment="center" width="100%">
        <i-image url={Assets.fullPath('img/icon-advice.svg')} />
        <i-panel>
          <i-label
            id="emptyRewardsMsg"
            caption="No Data"
            font={{ size: '1rem', bold: true }}
            margin={{ left: 10 }}
          />
        </i-panel>
      </i-hstack>
    )
    const td = source.querySelector('td');
    td && td.appendChild(emptyElm);
  }

  private renderData() {
    switch (this.currentTab) {
      case KEY_TAB.NEW_NFT:
        this.renderCards();
        break;
      case KEY_TAB.MY_NFTS:
        this.renderMyCards();
        break;
      case KEY_TAB.MY_REWARD:
        this.renderMyReward();
        break;
      default:
        break;
    }
  }

  private async renderMyReward() {
    if (!isWalletConnected()) {
      this.btnClaimAll.visible = false;
      this.myRewardTable.data = [];
      if (this.myRewardTable.pagination) this.myRewardTable.pagination.totalPages = 0;
      this.emptyRewardsMsg.caption = 'Please connect with your wallet!';
      if (this.myRewardLoading) this.myRewardLoading.visible = false;
      return;
    }
    if (this.myRewardLoading)
      this.myRewardLoading.visible = true;
    let info = await getOwnRewards(NFT_TYPE.OSWAP);
    myRewardData = [];
    if (!info || !info.length) {
      this.emptyRewardsMsg.caption = 'No Data';
      this.myRewardTable.data = [];
      if (this.myRewardTable.pagination) this.myRewardTable.pagination.totalPages = 0;
      this.btnClaimAll.visible = false;
      this.myRewardLoading.visible = false;
      return;
    }
    if (!this.btnClaimAll.visible) {
      this.btnClaimAll.visible = true;
    }
    for (let item of info) {
      let lockedAmount = new BigNumber(item.totalAmount).minus(new BigNumber(item.claimedAmount).plus(item.unclaimedAmount)).toFixed()
      myRewardData.push({
        tokenId: item.tokenId,
        token: item.token,
        startDate: formatDate(item.startDate),
        endDate: formatDate(item.endDate),
        lockedAmount: formatNumber(lockedAmount, 4),
        claimableAmount: formatNumber(item.unclaimedAmount, 4)
      })
    }
    this.myRewardTable.data = myRewardData;
    if (this.myRewardTable.pagination)
      this.myRewardTable.pagination.totalPages = Math.ceil(myRewardData.length / 10);
    if (this.myRewardLoading)
      this.myRewardLoading.visible = false;
  }

  private async renderCards() {
    let info = await getTrollCampInfo(this.state, NFT_TYPE.OSWAP);
    this.dataCards = [];
    if (!info || !info.length) {
      this.renderEmpty(this.cardRow, 'Your very own NFT is getting ready!');
      return;
    }
    for (let item of info) {
      let totalPayAmount = new BigNumber(item.minimumStake).plus(item.protocolFee).toFixed();
      this.dataCards.push({
        address: item.contract,
        flashSales: item.flashSales,
        monthlyReward: `${item.apr}% APR`,
        rewardsBoost: `${item.rewards}%`,
        tier: item.tier,
        slot: item.available,
        stakeAmount: item.minimumStake,
        stakeToken: item.token,
        stakeAmountText: `${formatNumber(item.minimumStake)} ${item.token?.symbol || ''}`,
        protocolFee: item.protocolFee,
        totalPayAmount
      })
    }
    this.cardRow.clearInnerHTML();
    this.dataCards.forEach((item, key: number) => {
      const column = new VStack();
      column.classList.add('nft-card-column', 'new-card-column');
      column.stack = { basis: '0%', shrink: '1', grow: '1' };
      const elm = new NftCard(this.state);
      column.appendChild(elm);
      this.cardRow.appendChild(column);
      elm.onStake = () => this.onStake(item);
      elm.cardData = item;
    })
  }

  private async renderMyCards() {
    if (!isWalletConnected()) {
      this.myNFTsInfoPanel.visible = false;
      this.renderEmpty(this.myCardRow);
      if (this.myNFTsLoading) this.myNFTsLoading.visible = false;
      return;
    }
    if (this.myNFTsLoading) {
      this.myCardRow.clearInnerHTML();
      this.myNFTsLoading.visible = true;
    }
    let userNFTs = await getUserNFTs(this.state, NFT_TYPE.OSWAP, Wallet.getClientInstance().address);
    this.dataMyCards = [];
    this.myCardRow.clearInnerHTML();
    if (userNFTs.length == 0 || userNFTs.every((f: any) => !f.listNFT.length)) {
      this.lbMyNFTsNum.caption = '0';
      this.lbMyNFTsStakeValue.caption = '0';
      this.myNFTsInfoPanel.visible = false;
      this.renderEmpty(this.myCardRow);
      if (this.myNFTsLoading)
        this.myNFTsLoading.visible = false;
      return;
    }
    if (!this.myNFTsInfoPanel.visible) {
      this.myNFTsInfoPanel.visible = true;
    }
    for (let nftTypeItem of userNFTs) {
      for (let item of nftTypeItem.listNFT) {
        let myCard: IDataMyCard = {
          address: nftTypeItem.contract,
          flashSales: nftTypeItem.flashSales,
          monthlyRewardAPR: nftTypeItem.apr,
          monthlyRewardText: `${nftTypeItem.apr}% APR`,
          rewardsBoost: `${nftTypeItem.rewards}%`,
          tier: nftTypeItem.tier,
          trollNumber: item.tokenID,
          stakeToken: item.token,
          stakeAmount: item.stakingBalance,
          stakeAmountText: `${formatNumber(item.stakingBalance)} ${item.token?.symbol || ''}`,
          rarity: item.rarity,
          birthday: moment.unix(item.birthday).format(DefaultDateFormat),
          image: item.image
        }
        this.dataMyCards.push(myCard);
      }
    }
    let stakeToken = userNFTs[0].stakeToken;
    if (this.dataMyCards.length > 0) {
      this.lbMyNFTsNum.caption = `${formatNumberWithSeparators(this.dataMyCards.length)}`;
      let totalStakeAmount = this.dataMyCards.reduce((prev, curr) => {
        return prev.plus(curr.stakeAmount);
      }, new BigNumber(0));
      this.lbMyNFTsStakeValue.caption = `${formatNumber(totalStakeAmount.toFixed(), 4)} ${stakeToken.symbol}`;
    }
    else {
      this.lbMyNFTsNum.caption = '0';
      this.lbMyNFTsStakeValue.caption = `0 ${stakeToken.symbol}`;
    }

    this.dataMyCards = this.dataMyCards.sort((a, b) => b.monthlyRewardAPR - a.monthlyRewardAPR || b.rarity - a.rarity || a.trollNumber - b.trollNumber);

    this.dataMyCards.forEach((item, key: number) => {
      const card = new Panel();
      card.classList.add('nft-card-column', 'custom-card-column');
      const elm = new NftMyCard();
      card.appendChild(elm);
      this.myCardRow.appendChild(card);
      elm.onBurn = () => this.handleBurn(item);
      elm.cardData = item;
    })
    if (this.myNFTsLoading)
      this.myNFTsLoading.visible = false;
  }

  private async onSubmit(isMint?: boolean) {
    if (!isWalletConnected()) {
      this.switchNetworkByWallet();
      return;
    } else if (!this.state.isRpcWalletConnected()) {
      const chainId = this.state.getChainId();
      const clientWallet = Wallet.getClientInstance();
      await clientWallet.switchNetwork(chainId);
      return;
    }
    if (isMint) {
      await this.handleMint();
    } else {
      await this.handleConfirmBurn();
    }
  }

  private async onStake(item: IDataCard) {
    this.mint.visible = false;
    this.minting.visible = true;
    this.currentDataCard = item;
    this.lbMintTitle.caption = `Mint ${item.tier} Troll`;
    this.lbMintStakeAmountText.caption = item.stakeAmountText;
    this.lbMintStakeAmount.caption = item.stakeAmount;
    this.lbMintRewardsBoost.caption = item.rewardsBoost;
    this.lbMintMonthlyReward.caption = item.monthlyReward;
    const stakeTokenSymbol = item.stakeToken?.symbol || '';
    this.lbMintFee.caption = `${item.protocolFee} ${stakeTokenSymbol}`;
    if (item.flashSales) {
      this.lbMintFlashSales.caption = item.flashSales;
    }
    let tokenBalances = tokenStore.getTokenBalancesByChainId(this.chainId) || {};
    let tokenBalance = tokenBalances[item.stakeToken.address.toLowerCase()];
    this.lbTokenBalance.caption = formatNumber(tokenBalance, 4);
    this.ImageMintStakeToken.url = tokenAssets.tokenPath(item.stakeToken, Wallet.getClientInstance().chainId);
    this.lbMintStakeToken.caption = stakeTokenSymbol;
    this.lbMintMessage1.caption = `Please confirm you would like to mint a NFT by staking of ${item.stakeAmount} of ${stakeTokenSymbol}.`;
    this.lbMintMessage2.caption = `You can unstake ${stakeTokenSymbol} by the burning the NFT.`;
    await this.initApprovalModelAction(item);
    this.approvalModelAction.checkAllowance(item.stakeToken, new BigNumber(item.totalPayAmount).toFixed());
  }

  private async claimAllRewards(btn: Button, tokenId?: string) {
    showResultMessage(this.txStatusModal, 'warning', 'Claiming');
    const txHashCallback = (err: Error, receipt?: string) => {
      if (err) {
        showResultMessage(this.txStatusModal, 'error', err);
      }
      else if (receipt) {
        btn.rightIcon.visible = true;
        if (tokenId === undefined) {
          const btnClaims = this.myRewardTable.querySelectorAll('.btn-claim');
          btnClaims.forEach((elm: any) => elm.rightIcon.visible = true);
        } else {
          this.btnClaimAll.rightIcon.visible = true;
        }
        showResultMessage(this.txStatusModal, 'success', receipt);
      }
    }
    const confirmationCallback = async (receipt: any) => {
      await this.renderMyReward();
      btn.rightIcon.visible = false;
      if (tokenId === undefined) {
        const btnClaims = this.myRewardTable.querySelectorAll('.btn-claim');
        btnClaims.forEach((elm: any) => elm.rightIcon.visible = false);
      } else {
        this.btnClaimAll.rightIcon.visible = false;
      }
    }
    registerSendTxEvents({
      transactionHash: txHashCallback,
      confirmation: confirmationCallback
    })
    if (tokenId === undefined) {
      await claimMultiple();
    } else {
      await claimReward(tokenId);
    }
  }

  private async handleMint() {
    await this.approvalModelAction.doPayAction();
  }

  private clickApprove() {
    this.approvalModelAction.doApproveAction(this.currentDataCard.stakeToken, new BigNumber(this.currentDataCard.totalPayAmount).toFixed());
  }

  private handleBack() {
    this.mint.visible = true;
    this.minting.visible = false;
  }

  private handleBurnBack() {
    this.mint.visible = true;
    this.burning.visible = false;
  }

  private handleBurn(item: IDataMyCard) {
    this.currentDataMyCard = item;
    this.lbBurnMessage.caption = `By confirmimg the transaction, you will burn NFT and receive ${item.stakeAmountText}`;
    this.ImageBurn.url = item.image;
    this.mint.visible = false;
    this.burning.visible = true;
  }

  private async handleConfirmBurn() {
    var self = this;
    showResultMessage(this.txStatusModal, 'warning', 'Burning');

    const txHashCallback = (err: Error, receipt?: string) => {
      if (err) {
        showResultMessage(this.txStatusModal, 'error', err);
      }
      else if (receipt) {
        showResultMessage(this.txStatusModal, 'success', receipt);
        this.txStatusModal.onCustomClose = function () {
          self.txStatusModal.closeModal();
          self.mint.visible = true;
          self.burning.visible = false;
          self.txStatusModal.onCustomClose = null;
        }
        this.btnBurn.rightIcon.visible = true;
        this.btnBurn.caption = 'Burning';
      }
    }
    const confirmationCallback = (receipt: any) => {
      this.btnBurn.rightIcon.visible = false;
      this.btnBurn.caption = 'Burn';
      this.handleBurnBack();
      this.renderMyCards();
    }
    registerSendTxEvents({
      transactionHash: txHashCallback,
      confirmation: confirmationCallback
    });

    await burnNFT(this.currentDataMyCard.address, this.currentDataMyCard.trollNumber);
  }

  render() {
    return (
      <i-scom-dapp-container id="dappContainer">
        <i-panel class={nftStyle}>
          <i-panel id="mint" class="widget">
            <i-panel class="current-nft">
              <i-label caption="oswap" />
            </i-panel>
            <i-tabs
              id="tabs"
              width="100%"
              height="100%"
              mode="horizontal"
              class={tabStyle}
              onChanged={this.onChangeTab.bind(this)}
            >
              <i-tab
                caption="New NFT"
                icon={{ image: { url: Assets.fullPath('img/nft/Tiers.svg') } }}
                onClick={() => this.onChangeTab(KEY_TAB.NEW_NFT)}
              >
                <i-panel padding={{ left: '1rem', right: '1rem' }}>
                  <i-hstack gap="2rem" id="cardRow" wrap="wrap" />
                </i-panel>
              </i-tab>
              <i-tab
                caption="My NFTs"
                icon={{ image: { url: Assets.fullPath('img/nft/NFT.svg') } }}
                onClick={() => this.onChangeTab(KEY_TAB.MY_NFTS)}
              >
                <i-panel>
                  <i-vstack id="myNFTsLoading" padding={{ top: 100 }} class="i-loading-overlay">
                    <i-vstack class="i-loading-spinner" horizontalAlignment="center" verticalAlignment="center">
                      <i-icon
                        class="i-loading-spinner_icon"
                        image={{ url: Assets.fullPath('img/loading.svg'), width: 36, height: 36 }}
                      />
                      <i-label
                        caption="Loading..." font={{ color: '#FD4A4C', size: '1.5em' }}
                        class="i-loading-spinner_text"
                      />
                    </i-vstack>
                  </i-vstack>
                  <i-panel padding={{ left: '1rem', right: '1rem' }} class="tab-sheet--container">
                    <i-panel id="myNFTsInfoPanel" margin={{ bottom: '0.25rem' }} class="box-description">
                      <i-hstack>
                        <i-hstack minWidth="50%">
                          <i-label caption="Number of NFTs:" margin={{ right: '0.25rem' }} />
                          <i-label id="lbMyNFTsNum" font={{ bold: true }} />
                        </i-hstack>
                        <i-hstack minWidth="50%">
                          <i-label caption="Stake Value:" margin={{ right: '0.25rem' }} />
                          <i-label id="lbMyNFTsStakeValue" font={{ bold: true }} />
                        </i-hstack>
                      </i-hstack>
                    </i-panel>
                    <i-hstack gap="2rem" id="myCardRow" wrap="wrap" margin={{ top: '2rem' }} />
                  </i-panel>
                </i-panel>
              </i-tab>
              <i-tab
                caption="My Reward"
                onClick={() => this.onChangeTab(KEY_TAB.MY_REWARD)}
                icon={{ image: { url: Assets.fullPath('img/nft/NFT.svg') } }}
              >
                <i-panel>
                  <i-vstack id="myRewardLoading" padding={{ top: 100 }} class="i-loading-overlay">
                    <i-vstack class="i-loading-spinner" horizontalAlignment="center" verticalAlignment="center">
                      <i-icon
                        class="i-loading-spinner_icon"
                        image={{ url: Assets.fullPath('img/loading.svg'), width: 36, height: 36 }}
                      />
                      <i-label
                        caption="Loading..." font={{ color: '#FD4A4C', size: '1.5em' }}
                        class="i-loading-spinner_text"
                      />
                    </i-vstack>
                  </i-vstack>
                  <i-hstack horizontalAlignment="center" padding={{ left: 18, right: 18, bottom: 18 }}>
                    <i-button
                      id="btnClaimAll"
                      caption="Claim All"
                      class="btn-os btn-claim"
                      rightIcon={{ spin: true, visible: false }}
                      onClick={() => this.claimAllRewards(this.btnClaimAll)}
                    />
                  </i-hstack>
                  <i-table
                    id="myRewardTable"
                    columns={this.myRewardsCols()}
                    data={myRewardData}
                    mediaQueries={
                      [
                        {
                          maxWidth: '767px',
                          properties: {
                            fieldNames: ['token', 'claim']
                          }
                        }
                      ]
                    }
                    onRenderEmptyTable={this.renderMyRewardEmpty.bind(this)}
                  />
                </i-panel>
              </i-tab>
            </i-tabs>
          </i-panel>
          <i-hstack id="minting" visible={false} gap="30px" horizontalAlignment="center">
            <i-vstack class="nft-card-stake">
              <i-panel class="card-widget">
                <i-panel class="bg-img">
                  <i-panel class="title-box">
                    <i-icon class='icon-back pointer' height={20} width={20} name='arrow-left' fill='#fff' onClick={this.handleBack}></i-icon>
                    <i-label id="lbMintTitle" font={{ color: '#f7d063', size: '1.4rem', bold: true }}></i-label>
                  </i-panel>
                  <i-panel class="line-middle"></i-panel>
                  <i-panel class="section">
                    <i-panel class="row-line">
                      <i-panel class="title-icon">
                        <i-label caption="Stake Amount"></i-label>
                      </i-panel>
                      <i-label id="lbMintStakeAmountText" caption="50,000 OSWAP" font={{ color: '#f7d063', size: '1.4rem', bold: true }}></i-label>
                    </i-panel>

                    <i-panel class="row-line">
                      <i-panel class="title-icon">
                        <i-label caption="Rewards Boost"></i-label>
                        <i-icon
                          name="question-circle"
                          fill="#fff"
                          height={15} width={15}
                          tooltip={{
                            content: 'The Reward Boost is only applicable to OSWAP staking rewards.',
                            placement: 'right'
                          }}
                        ></i-icon>
                      </i-panel>
                      <i-label id="lbMintRewardsBoost" caption="5%" font={{ color: '#f7d063', size: '1.4rem', bold: true }}></i-label>
                    </i-panel>

                    <i-panel class="row-line">
                      <i-panel class="title-icon">
                        <i-label caption="Monthly Reward"></i-label>
                        <i-icon
                          name="question-circle"
                          fill="#fff"
                          height={15} width={15}
                          tooltip={{
                            content: 'The Monthly Reward will be distributed at the end of each month.',
                            placement: 'right'
                          }}
                        ></i-icon>
                      </i-panel>
                      <i-label id="lbMintMonthlyReward" caption="5%" font={{ color: '#f7d063', size: '1.4rem', bold: true }}></i-label>
                    </i-panel>
                    <i-panel class="row-line">
                      <i-panel class="title-icon">
                        <i-label caption="Flash Sales Inclusion"></i-label>
                      </i-panel>
                      <i-label id="lbMintFlashSales" caption="Periodic" font={{ color: '#f7d063', size: '1.4rem', bold: true }}></i-label>
                    </i-panel>
                    <i-panel class="row-line">
                      <i-panel class="title-icon">
                        <i-label caption="Mint Fee"></i-label>
                        <i-icon
                          name="question-circle"
                          fill="#fff"
                          height={15} width={15}
                          tooltip={{
                            content: 'The mint fee covers the transaction cost on using Chainlink Verifiable Random Function.',
                            placement: 'right'
                          }}
                        ></i-icon>
                      </i-panel>
                      <i-label id="lbMintFee" caption="" font={{ color: '#f7d063', size: '1.4rem', bold: true }}></i-label>
                    </i-panel>
                    <i-panel class="section-1">
                      <i-hstack class="mb-1" verticalAlignment='center' horizontalAlignment='space-between'>
                        <i-label caption="Stake Amount"></i-label>
                        <i-hstack verticalAlignment='center' horizontalAlignment='end'>
                          <i-label font={{ color: '#f7d063', size: '1.2rem' }} margin={{ right: 4 }} caption="Balance: " />
                          <i-label id="lbTokenBalance" font={{ color: '#f7d063', size: '1.2rem' }} caption="10000" />
                        </i-hstack>
                      </i-hstack>
                      <i-hstack verticalAlignment='center' horizontalAlignment='space-between'>
                        <i-label id="lbMintStakeAmount" font={{ color: '#f7d063', size: '1.2rem' }} caption="50000"></i-label>
                        <i-hstack verticalAlignment='center' horizontalAlignment='end'>
                          <i-image
                            id="ImageMintStakeToken"
                            width={20}
                            class="flex"
                            margin={{ right: 4 }}
                            url={Assets.fullPath('img/swap/openswap.png')}
                          ></i-image>
                          <i-label id="lbMintStakeToken" caption="OSWAP" />
                        </i-hstack>
                      </i-hstack>
                    </i-panel>
                    <i-panel class="section-2">
                      <i-panel>
                        <i-label id="lbMintMessage1" caption="Please confirm you would like to mint a NFT by staking of 50000 of OSWAP."></i-label>
                      </i-panel>
                      <i-panel>
                        <i-label id="lbMintMessage2" caption="You can unstake OSWAP by the burning the NFT."></i-label>
                      </i-panel>
                    </i-panel>
                    <i-button
                      id="btnApprove"
                      visible={false}
                      class="btn-stake"
                      height={40}
                      enabled={false}
                      caption="Approve"
                      rightIcon={{ spin: true, visible: false }}
                      onClick={this.clickApprove}
                    />
                    <i-button
                      id="btnMint" height={40} class="btn-stake" caption='Stake'
                      rightIcon={{ spin: true, visible: false }}
                      onClick={() => this.onSubmit(true)}
                    />
                  </i-panel>
                </i-panel>
              </i-panel>
            </i-vstack>
          </i-hstack>
          <i-hstack id="burning" visible={false} gap="30px" horizontalAlignment='center'>
            <i-vstack class="nft-burn-stake" width={500} maxWidth='100%' padding={{ left: 15, right: 15 }} margin={{ bottom: 30 }}>
              <i-panel class="card-widget">
                <i-panel class="bg-img">
                  <i-panel class="title-box">
                    <i-icon class='icon-back pointer' height={20} width={20} name='arrow-left' fill='#fff' onClick={this.handleBurnBack}></i-icon>
                    <i-label caption="Confim Burn" font={{ color: '#f7d063', size: '1.4rem', bold: true }} ></i-label>
                  </i-panel>
                  <i-panel class="line-middle"></i-panel>
                  <i-panel class="section">
                    <i-panel class="section-2" margin={{ bottom: 30 }}>
                      <i-panel>
                        <i-label id="lbBurnMessage" class="text-center" caption="By confirmimg the transaction, you will burn NFT and receive 75,000OSWAP"></i-label>
                      </i-panel>
                    </i-panel>
                    <i-hstack horizontalAlignment='center' margin={{ bottom: 20 }}>
                      <i-image id="ImageBurn" class="text-center" width='100%' height='auto'></i-image>
                    </i-hstack>
                    <i-hstack verticalAlignment='center' horizontalAlignment='center'>
                      <i-image url={Assets.fullPath('img/nft/TrollCry.png')} margin={{ right: 4 }} width={40} height="auto" class="flex" />
                      <i-label class="note-burn" caption="This is NFT Will Be Gone Forever" />
                    </i-hstack>
                    <i-button
                      id="btnBurn" height={40} class="btn-stake btn-os" caption='Burn'
                      rightIcon={{ spin: true, visible: false }}
                      onClick={() => this.onSubmit()}
                    />
                  </i-panel>
                </i-panel>
              </i-panel>
            </i-vstack>
          </i-hstack>
        </i-panel>
        <i-scom-wallet-modal id="mdWallet" wallets={[]} />
      </i-scom-dapp-container>
    )
  }
}