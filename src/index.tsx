import {
  customModule,
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
  moment
} from '@ijstech/components';
import { BigNumber, Constants, IERC20ApprovalAction, Wallet } from '@ijstech/eth-wallet';
import {
  isClientWalletConnected,
  State,
  IDataCard,
  IDataMyCard,
  OswapNfts,
  OswapNftsType,
  nftImagePlaceHolder,
  getChainNativeToken,
  stakeTokenMap,
} from './store/index';
import {
  formatNumber,
  showResultMessage,
  registerSendTxEvents,
  DefaultDateFormat,
} from './global/index'
import Assets from './assets';
import ScomCommissionFeeSetup from '@scom/scom-commission-fee-setup';
import ScomTxStatusModal from '@scom/scom-tx-status-modal';
import ScomDappContainer from '@scom/scom-dapp-container'
import { tokenStore, assets as tokenAssets, ITokenObject } from '@scom/scom-token-list';
import ScomWalletModal, { IWalletPlugin } from '@scom/scom-wallet-modal';
import { NftCard, fetchNftInfoByTier, mintNFT, burnNFT, getCommissionRate, NftInfo } from './nft-utils/index';
import { getBuilderSchema, getProjectOwnerSchema } from './formSchema';
import { nftStyle, listMediaStyles, nftDefaultStyle, dappContainerStyle } from './index.css';
import configData from './data.json';
import { Block, BlockNoteEditor, BlockNoteSpecs, callbackFnType, executeFnType, getWidgetEmbedUrl, parseUrl } from '@scom/scom-blocknote-sdk';

const Theme = Styles.Theme.ThemeVars;

interface ICommissionInfo {
  chainId: number;
  walletAddress: string;
}

interface INetworkConfig {
  chainName?: string;
  chainId: number;
}

interface OswapNftWidgetElement extends ControlElement {
  lazyLoad?: boolean;
  campaignId?: number;
  tier: OswapNftsType;
  defaultChainId: number;
  networks: INetworkConfig[];
  wallets: IWalletPlugin[];
  showHeader?: boolean;
  commissions?: ICommissionInfo[];
}

export interface IOswapNftWidgetData {
  campaignId?: number;
  commissions?: ICommissionInfo[];
  defaultChainId: number;
  wallets: IWalletPlugin[];
  networks: INetworkConfig[];
  tier: OswapNftsType;
  showHeader?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-oswap-nft-widget']: OswapNftWidgetElement;
    }
  }
}
declare const window: any;

@customModule
@customElements('i-oswap-nft-widget')
export default class OswapNftWidget extends Module implements BlockNoteSpecs {
  private dappContainer: ScomDappContainer;
  private mdWallet: ScomWalletModal;
  private state: State;
  private chainId: number;
  private targetChainId: number;
  private approvalModelAction: IERC20ApprovalAction;

  private pnlLoading: Panel;
  private cardRow: HStack;
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
  private currentDataCard: IDataCard;
  private dataCards: IDataCard[];
  private ImageBurn: Image;
  private currentDataMyCard: IDataMyCard;
  private initializedState: { chainId: number, address: string, connected: boolean, fetching: boolean };

  private _data: IOswapNftWidgetData = {
    defaultChainId: 0,
    wallets: [],
    networks: [],
    tier: OswapNfts.tier1
  };
  tag: any = {};

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    // this.deferReadyCallback = true;
  }

  addBlock(blocknote: any, executeFn: executeFnType, callbackFn?: callbackFnType) {
    const blockType = 'oswapNft';
    const moduleData = {
      name: '@scom/oswap-nft-widget',
      localPath: 'oswap-nft-widget'
    }

    function getData(href: string) {
      const widgetData = parseUrl(href);
      if (widgetData) {
        const { module, properties } = widgetData;
        if (module.localPath === moduleData.localPath) return { ...properties };
      }
      return false;
    }

    const OswapNftBlock = blocknote.createBlockSpec({
      type: blockType,
      propSchema: {
        ...blocknote.defaultProps,
        tier: { default: 'hungry' },
        defaultChainId: { default: 0 },
        networks: { default: [] },
        wallets: { default: [] },
        commissions: { default: [] },
      },
      content: "none"
    },
      {
        render: (block: Block) => {
          const wrapper = new Panel();
          const props = JSON.parse(JSON.stringify(block.props));
          const customElm = new OswapNftWidget(wrapper, {...props});
          if (typeof callbackFn === "function") callbackFn(customElm, block);
          wrapper.appendChild(customElm);
          return {
            dom: wrapper
          };
        },
        parseFn: () => {
          return [
            {
              tag: `div[data-content-type=${blockType}]`,
              node: blockType
            },
            {
              tag: "a",
              getAttrs: (element: string | HTMLElement) => {
                if (typeof element === "string") {
                  return false;
                }
                const href = element.getAttribute('href');
                if (href) return getData(href);
                return false;
              },
              priority: 402,
              node: blockType
            },
            {
              tag: "p",
              getAttrs: (element: string | HTMLElement) => {
                if (typeof element === "string") {
                  return false;
                }
                const child = element.firstChild as HTMLElement;
                if (child?.nodeName === 'A' && child.getAttribute('href')) {
                  const href = child.getAttribute('href');
                  return getData(href);
                }
                return false;
              },
              priority: 403,
              node: blockType
            },
          ]
        },
        toExternalHTML: (block: any, editor: any) => {
          const link = document.createElement("a");
          const url = getWidgetEmbedUrl(
            {
              type: blockType,
              props: { ...(block.props || {}) }
            },
            moduleData
          );
          link.setAttribute("href", url);
          link.textContent = blockType;
          const wrapper = document.createElement("p");
          wrapper.appendChild(link);
          return { dom: wrapper };
        }
      });
    const OswapNftSlashItem = {
      name: "Oswap NFT",
      execute: (editor: BlockNoteEditor) => {
        const block: any = {
          type: blockType,
          props: configData.defaultBuilderData
        };
        if (typeof executeFn === "function") executeFn(editor, block);
      },
      aliases: [blockType, "widget"],
      group: "Widget",
      icon: { name: 'campground' },
      hint: "Insert an Oswap NFT widget"
    }

    return {
      block: OswapNftBlock,
      slashItem: OswapNftSlashItem,
      moduleData
    }
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

  get tier() {
    return this._data.tier;
  }

  set tier(value: OswapNftsType) {
    this._data.tier = value;
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
          let _oldData: IOswapNftWidgetData = {
            defaultChainId: 0,
            wallets: [],
            networks: [],
            tier: OswapNfts.tier1
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
          let oldData: IOswapNftWidgetData = {
            defaultChainId: 0,
            wallets: [],
            networks: [],
            tier: OswapNfts.tier1
          };
          let oldTag = {};
          return {
            execute: async () => {
              oldData = JSON.parse(JSON.stringify(this._data));
              const {
                networks,
                tier,
                ...themeSettings
              } = userInputData;

              const generalSettings = {
                networks,
                tier
              };

              this._data.tier = generalSettings.tier;
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
        setData: async (properties: IOswapNftWidgetData, linkParams?: Record<string, any>) => {
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
    await this.state.initRpcWallet(this.defaultChainId);
    const rpcWallet = this.state.getRpcWallet();
    const chainChangedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.ChainChanged, async (chainId: number) => {
      this.onChainChange();
    });
    const connectedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.Connected, async (connected: boolean) => {
      await this.initializeWidgetConfig();
    });
    const data = {
      defaultChainId: this.defaultChainId,
      wallets: this.wallets,
      networks: this.networks,
      showHeader: this.showHeader,
      rpcWalletId: rpcWallet.instanceId
    }
    if (this.dappContainer?.setData) this.dappContainer.setData(data);
  }

  private async setData(value: IOswapNftWidgetData) {
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
    // if (this.dappContainer)
    //   this.dappContainer.setTag(this.tag);
    // this.updateTheme();
    this.initOswapTheme();
    this.resizeUI();
  }

  private updateStyle(name: string, value: any) {
    value ?
      this.style.setProperty(name, value) :
      this.style.removeProperty(name);
  }

  private initOswapTheme() {
    const oswapTheme = {
      fontColor: '#fff',
      backgroundColor: '#0c1234',
      buttonBackgroundColor: '#f15e61',
      buttonFontColor: '#fff',
      modalColor: '#252a48'
    }
    this.tag['light'] = oswapTheme;
    this.tag['dark'] = oswapTheme;
    if (this.dappContainer) this.dappContainer.setTag(this.tag);
    this.dappContainer.style.setProperty('--text-secondary', '#f7d063');
    this.dappContainer.style.setProperty('--background-default', '#252a48');
    this.dappContainer.style.setProperty('--background-gradient', 'transparent linear-gradient(90deg, #AC1D78 0%, #E04862 100%) 0% 0% no-repeat padding-box');
  }

  private updateTheme() {
    const themeVar = this.dappContainer?.theme || 'light';
    this.updateStyle('--text-primary', this.tag[themeVar]?.fontColor);
    this.updateStyle('--background-main', this.tag[themeVar]?.backgroundColor);
    //FIXME: temporary solution
    this.updateStyle('--primary-button-background', this.tag[themeVar]?.primaryButtonBackground || 'transparent linear-gradient(90deg, #AC1D78 0%, #E04862 100%) 0% 0% no-repeat padding-box');
    this.updateStyle('--primary-button-hover-background', this.tag[themeVar]?.primaryButtonHoverBackground || 'linear-gradient(255deg,#f15e61,#b52082)');
    this.updateStyle('--primary-button-disabled-background', this.tag[themeVar]?.primaryButtonDisabledBackground || 'transparent linear-gradient(270deg,#351f52,#552a42) 0% 0% no-repeat padding-box');
  }

  private async refreshUI() {
    await this.initializeWidgetConfig();
  }

  private isEmptyData(value: IOswapNftWidgetData) {
    return !value || !value.networks || value.networks.length === 0;
  }

  async init() {
    super.init();
    this.initOswapTheme();
    this.state = new State(configData);
    this.chainId = this.state.getChainId();
    const lazyLoad = this.getAttribute('lazyLoad', true, false);
    if (!lazyLoad) {
      const campaignId = this.getAttribute('campaignId', true);
      const commissions = this.getAttribute('commissions', true, []);
      const defaultChainId = this.getAttribute('defaultChainId', true);
      const tier = this.getAttribute('tier', true, OswapNfts.tier1);
      const networks = this.getAttribute('networks', true);
      const wallets = this.getAttribute('wallets', true);
      const showHeader = this.getAttribute('showHeader', true);
      let data = {
        campaignId,
        commissions,
        defaultChainId,
        networks,
        tier,
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
        showResultMessage(this.txStatusModal, 'warning', 'Minting...');
        mintNFT(item.address, item.stakeToken, item.totalPayAmount);
      },
      onToBeApproved: async (token: ITokenObject) => {
        this.btnApprove.visible = true;
        this.btnMint.visible = false;
        const caption = !isClientWalletConnected() ? 'Connect Wallet' : (this.state.getChainId() !== this.targetChainId || !this.state.isRpcWalletConnected()) ? 'Switch Network' : `Approve ${token.symbol}`;
        this.btnApprove.caption = caption;
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
    const nativeToken = getChainNativeToken(this.chainId);
    const stakeToken: ITokenObject = stakeTokenMap[this.chainId];
    const tokens: ITokenObject[] = [];
    if (nativeToken) tokens.push(nativeToken);
    if (stakeToken) tokens.push(stakeToken);
    await tokenStore.updateTokenBalancesByChainId(this.state.getChainId(), tokens.length ? tokens : undefined);
  }

  private async switchNetworkByWallet() {
    if (this.mdWallet) {
      await application.loadPackage('@scom/scom-wallet-modal', '*');
      this.mdWallet.networks = this.networks;
      this.mdWallet.wallets = this.wallets;
      this.mdWallet.showModal();
    }
  }

  private renderEmpty(elm: HStack, msg: string) {
    if (!elm) return;
    elm.clearInnerHTML();
    elm.appendChild(<i-panel width="100%">
      <i-hstack gap="32px">
        <i-panel border={{ radius: '12px' }} background={{ color: "#ffffff33" }} width="100%" height="auto">
          <i-vstack padding={{ top: 30, bottom: 30 }} horizontalAlignment="center">
            <i-panel class="text-center" width="100%">
              <i-image url={Assets.fullPath('img/nft/TrollEgg.svg')} width={200} height="auto" display="block" margin={{ left: 'auto', right: 'auto' }} />
            </i-panel>
            <i-label class="text-center" width="100%" margin={{ top: 20 }} caption={msg} font={{ color: Theme.text.primary, size: '1.5rem' }} />
          </i-vstack>
        </i-panel>
      </i-hstack>
    </i-panel>)
  }

  private async renderData() {
    this.updateButtons();
    const currentChainId = this.state.getChainId();
    const isConnected = isClientWalletConnected();
    const walletAddress = this.state.getRpcWallet()?.address;
    const { chainId, connected, address, fetching } = this.initializedState || {};
    if (chainId === currentChainId && connected === isConnected && fetching === true && address === walletAddress) return;
    this.initializedState = {
      chainId: currentChainId,
      connected: isConnected,
      address: walletAddress,
      fetching: true
    }
    if ((!isConnected || (address && address !== walletAddress)) && !this.mint.visible) {
      this.mint.visible = true;
      this.minting.visible = false;
      this.burning.visible = false;
    }
    await this.renderCards();
    this.updateButtons();
    this.initializedState.fetching = false;
  }

  private async renderCards() {
    this.pnlLoading.visible = true;
    this.cardRow.visible = false;
    const tier = this.tier;
    const info = await fetchNftInfoByTier(this.state, tier);
    const chainId = this.state.getChainId();
    if (this.initializedState.chainId !== chainId) return;
    if (!info) {
      const network = this.state.getNetworkInfo(chainId);
      const msg = info === false ? `${network ? `${network.chainName} (${chainId})` : `Chain ID ${chainId}`} is not supported!` : 'Your very own NFT is getting ready!';
      this.renderEmpty(this.cardRow, msg);
      this.pnlLoading.visible = false;
      this.cardRow.visible = true;
      return;
    }

    // const types = Object.keys(info);
    const types = [tier];
    const cards: IDataCard[] = [];
    for (let type of types) {
      const item: NftInfo = info;
      const { address, flashSales, apr, rewards, token, protocolFee, minimumStake, userNfts } = item;
      const totalPayAmount = new BigNumber(minimumStake).plus(protocolFee).toFixed();
      const _userNfts: IDataMyCard[] = userNfts.map(v => {
        return {
          address,
          flashSales: flashSales,
          monthlyRewardAPR: apr,
          monthlyRewardText: `${apr}% APR`,
          rewardsBoost: `${rewards}%`,
          tier: type,
          trollNumber: v.tokenId,
          stakeToken: token,
          stakeAmount: v.stakeBalance,
          stakeAmountText: `${formatNumber(v.stakeBalance)} ${token?.symbol || ''}`,
          birthday: moment.unix(v.birthday).format(DefaultDateFormat),
          rarity: v.rarity,
          image: v.image
        }
      })
      cards.push({
        address: item.address,
        flashSales: item.flashSales,
        monthlyReward: `${item.apr}% APR`,
        rewardsBoost: `${item.rewards}%`,
        tier: type,
        fullName: item.fullName,
        slot: item.cap.minus(item.totalSupply).toNumber(),
        stakeAmount: item.minimumStake.toFixed(),
        stakeToken: item.token,
        stakeAmountText: `${formatNumber(item.minimumStake)} ${item.token?.symbol || ''}`,
        protocolFee: item.protocolFee.toFixed(),
        totalPayAmount,
        userNFTs: _userNfts
      })
    }
    this.dataCards = cards;
    this.cardRow.clearInnerHTML();
    for (const item of this.dataCards) {
      const column = await VStack.create();
      column.classList.add('nft-card-column', 'new-card-column');
      column.stack = { basis: '0%', shrink: '1', grow: '1' };
      const nftCard = await NftCard.create() as NftCard;
      column.appendChild(nftCard);
      this.cardRow.appendChild(column);
      nftCard.state = this.state;
      nftCard.onConnectWallet = () => this.switchNetworkByWallet();
      nftCard.onStake = () => this.onStake(item);
      nftCard.onBurn = (userNFT: IDataMyCard) => this.handleBurn(userNFT);
      nftCard.cardData = item;
    }
    this.pnlLoading.visible = false;
    this.cardRow.visible = true;
  }

  private async onSubmit(isMint?: boolean) {
    if (!isClientWalletConnected()) {
      this.switchNetworkByWallet();
      return;
    } else if (this.state.getChainId() !== this.targetChainId || !this.state.isRpcWalletConnected()) {
      const rpcWallet = this.state.getRpcWallet();
      if (rpcWallet.chainId != this.targetChainId) {
        await rpcWallet.switchNetwork(this.targetChainId);
      }
      if (!this.state.isRpcWalletConnected()) {
        const clientWallet = Wallet.getClientInstance();
        await clientWallet.switchNetwork(this.targetChainId);
      }
      return;
    }
    if (isMint) {
      await this.handleMint();
    } else {
      await this.handleConfirmBurn();
    }
  }

  private updateButtons() {
    if (this.targetChainId && this.state.getChainId() !== this.targetChainId || !this.state.isRpcWalletConnected()) {
      const caption = !isClientWalletConnected() ? 'Connect Wallet' : 'Switch Network';
      this.btnApprove.caption = caption;
      this.btnBurn.caption = caption;
      this.btnMint.caption = caption;
    } else {
      this.btnApprove.caption = `Approve ${this.currentDataCard?.stakeToken?.symbol || ''}`;
      this.btnBurn.caption = 'Burn';
      this.btnMint.caption = 'Stake';
    }
  }

  private async onStake(item: IDataCard) {
    this.targetChainId = Number(this.state.getChainId());
    this.updateButtons();
    this.mint.visible = false;
    this.minting.visible = true;
    this.currentDataCard = item;
    this.lbMintTitle.caption = `Mint ${item.tier} Troll`;
    this.lbMintStakeAmountText.caption = item.stakeAmountText;
    this.lbMintStakeAmount.caption = formatNumber(item.stakeAmount);
    this.lbMintRewardsBoost.caption = item.rewardsBoost;
    this.lbMintMonthlyReward.caption = item.monthlyReward;
    const stakeTokenSymbol = item.stakeToken?.symbol || '';
    this.lbMintFee.caption = `${item.protocolFee} ${stakeTokenSymbol}`;
    if (item.flashSales) {
      this.lbMintFlashSales.caption = item.flashSales;
    }
    let tokenBalances = tokenStore.getTokenBalancesByChainId(this.chainId) || {};
    let tokenBalance = tokenBalances[item.stakeToken.address.toLowerCase()];
    this.lbTokenBalance.caption = formatNumber(tokenBalance);
    this.ImageMintStakeToken.url = tokenAssets.tokenPath(item.stakeToken as ITokenObject, this.chainId);
    this.lbMintStakeToken.caption = stakeTokenSymbol;
    this.lbMintMessage1.caption = `Please confirm you would like to mint a NFT by staking of ${formatNumber(item.stakeAmount)} of ${stakeTokenSymbol}.`;
    this.lbMintMessage2.caption = `You can unstake ${stakeTokenSymbol} by the burning the NFT.`;
    await this.initApprovalModelAction(item);
    this.approvalModelAction.checkAllowance(item.stakeToken, new BigNumber(item.totalPayAmount).toFixed());
  }

  private async handleMint() {
    await this.approvalModelAction.doPayAction();
  }

  private async clickApprove() {
    if (!isClientWalletConnected()) {
      this.switchNetworkByWallet();
      return;
    } else if (this.state.getChainId() !== this.targetChainId || !this.state.isRpcWalletConnected()) {
      const rpcWallet = this.state.getRpcWallet();
      if (rpcWallet.chainId != this.targetChainId) {
        await rpcWallet.switchNetwork(this.targetChainId);
      }
      if (!this.state.isRpcWalletConnected()) {
        const clientWallet = Wallet.getClientInstance();
        await clientWallet.switchNetwork(this.targetChainId);
      }
      return;
    }
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
    this.targetChainId = Number(this.state.getChainId());
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
      this.renderCards();
    }
    registerSendTxEvents({
      transactionHash: txHashCallback,
      confirmation: confirmationCallback
    });

    await burnNFT(this.currentDataMyCard.address, this.currentDataMyCard.trollNumber);
  }

  render() {
    return (
      <i-scom-dapp-container id="dappContainer" class={dappContainerStyle}>
        <i-panel class={nftStyle}>
          <i-panel id="mint" class="widget">
            <i-panel padding={{ left: '1rem', right: '1rem' }}>
              <i-panel id="pnlLoading" minHeight={300} class="i-loading-overlay">
                <i-vstack class="i-loading-spinner" horizontalAlignment="center" verticalAlignment="center">
                  <i-icon
                    class="i-loading-spinner_icon"
                    cursor="default"
                    image={{ url: Assets.fullPath('img/loading.svg'), width: 36, height: 36 }}
                  />
                  <i-label
                    caption="Loading..." font={{ color: Theme.colors.primary.main, size: '1.5em' }}
                    class="i-loading-spinner_text"
                  />
                </i-vstack>
              </i-panel>
              <i-hstack gap="2rem" id="cardRow" maxWidth={1280} margin={{ left: 'auto', right: 'auto' }} wrap="wrap" />
            </i-panel>
          </i-panel>
          <i-hstack id="minting" visible={false} gap="30px" horizontalAlignment="center">
            <i-vstack class="nft-card-stake">
              <i-panel class="card-widget">
                <i-panel class="bg-img">
                  <i-panel class="title-box">
                    <i-icon class="icon-back pointer" height={20} width={20} name="arrow-left" fill={Theme.text.primary} onClick={this.handleBack} />
                    <i-label id="lbMintTitle" font={{ color: Theme.text.secondary, size: '1.4rem', bold: true, transform: 'capitalize' }} />
                  </i-panel>
                  <i-panel class="line-middle" />
                  <i-panel class="section">
                    <i-panel class="row-line">
                      <i-panel class="title-icon">
                        <i-label caption="Stake Amount" />
                      </i-panel>
                      <i-label id="lbMintStakeAmountText" caption="50,000 OSWAP" font={{ color: Theme.text.secondary, size: '1.4rem', bold: true }} />
                    </i-panel>

                    <i-panel class="row-line">
                      <i-panel class="title-icon">
                        <i-label caption="Rewards Boost" />
                        <i-icon
                          name="question-circle"
                          fill={Theme.text.primary}
                          height={15} width={15}
                          tooltip={{
                            content: 'The Reward Boost is only applicable to OSWAP staking rewards.',
                            placement: 'right'
                          }}
                        />
                      </i-panel>
                      <i-label id="lbMintRewardsBoost" caption="5%" font={{ color: Theme.text.secondary, size: '1.4rem', bold: true }} />
                    </i-panel>

                    <i-panel class="row-line">
                      <i-panel class="title-icon">
                        <i-label caption="Monthly Reward" />
                        <i-icon
                          name="question-circle"
                          fill={Theme.text.primary}
                          height={15} width={15}
                          tooltip={{
                            content: 'The Monthly Reward will be distributed at the end of each month.',
                            placement: 'right'
                          }}
                        />
                      </i-panel>
                      <i-label id="lbMintMonthlyReward" caption="5%" font={{ color: Theme.text.secondary, size: '1.4rem', bold: true }} />
                    </i-panel>
                    <i-panel class="row-line">
                      <i-panel class="title-icon">
                        <i-label caption="Flash Sales Inclusion" />
                      </i-panel>
                      <i-label id="lbMintFlashSales" caption="Periodic" font={{ color: Theme.text.secondary, size: '1.4rem', bold: true }} />
                    </i-panel>
                    <i-panel class="row-line">
                      <i-panel class="title-icon">
                        <i-label caption="Mint Fee" />
                        <i-icon
                          name="question-circle"
                          fill={Theme.text.primary}
                          height={15} width={15}
                          tooltip={{
                            content: 'The mint fee covers the transaction cost on using Chainlink Verifiable Random Function.',
                            placement: 'right'
                          }}
                        />
                      </i-panel>
                      <i-label id="lbMintFee" font={{ color: Theme.text.secondary, size: '1.4rem', bold: true }} />
                    </i-panel>
                    <i-panel class="section-1">
                      <i-hstack gap={4} margin={{ bottom: '0.75rem' }} verticalAlignment="center" horizontalAlignment="space-between">
                        <i-label caption="Stake Amount" />
                        <i-hstack gap={4} verticalAlignment="center" horizontalAlignment="end">
                          <i-label font={{ color: Theme.text.secondary, size: '1rem' }} caption="Balance: " />
                          <i-label id="lbTokenBalance" font={{ color: Theme.text.secondary, size: '1rem' }} />
                        </i-hstack>
                      </i-hstack>
                      <i-hstack verticalAlignment="center" horizontalAlignment="space-between">
                        <i-label id="lbMintStakeAmount" font={{ color: Theme.text.secondary, size: '1.2rem' }} />
                        <i-hstack verticalAlignment="center" horizontalAlignment="end">
                          <i-image
                            id="ImageMintStakeToken"
                            width={20}
                            class="flex"
                            margin={{ right: 4 }}
                            url={Assets.fullPath('img/swap/openswap.png')}
                          />
                          <i-label id="lbMintStakeToken" caption="OSWAP" />
                        </i-hstack>
                      </i-hstack>
                    </i-panel>
                    <i-panel class="section-2">
                      <i-panel>
                        <i-label id="lbMintMessage1" caption="Please confirm you would like to mint a NFT by staking of 50000 of OSWAP." />
                      </i-panel>
                      <i-panel>
                        <i-label id="lbMintMessage2" caption="You can unstake OSWAP by the burning the NFT." />
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
                      id="btnMint" height={40} class="btn-stake" caption="Stake"
                      rightIcon={{ spin: true, visible: false }}
                      onClick={() => this.onSubmit(true)}
                    />
                  </i-panel>
                </i-panel>
              </i-panel>
            </i-vstack>
          </i-hstack>
          <i-hstack id="burning" visible={false} gap="30px" horizontalAlignment="center">
            <i-vstack class="nft-burn-stake" width={500} maxWidth='100%' padding={{ left: 15, right: 15 }} margin={{ bottom: 30 }}>
              <i-panel class="card-widget">
                <i-panel class="bg-img">
                  <i-panel class="title-box">
                    <i-icon class="icon-back pointer" height={20} width={20} name="arrow-left" fill={Theme.text.primary} onClick={this.handleBurnBack} />
                    <i-label caption="Confim Burn" font={{ color: Theme.colors.primary.main, size: '1.4rem', bold: true }} />
                  </i-panel>
                  <i-panel class="line-middle" />
                  <i-panel class="section">
                    <i-panel class="section-2" margin={{ bottom: 30 }}>
                      <i-panel>
                        <i-label id="lbBurnMessage" class="text-center" caption="By confirmimg the transaction, you will burn NFT and receive 75,000OSWAP" />
                      </i-panel>
                    </i-panel>
                    <i-hstack horizontalAlignment="center" margin={{ bottom: 20 }} padding={{ left: 20, right: 20 }}>
                      <i-image id="ImageBurn" class="text-center" width="100%" height="auto" fallbackUrl={nftImagePlaceHolder} />
                    </i-hstack>
                    <i-hstack verticalAlignment="center" horizontalAlignment="center">
                      <i-image url={Assets.fullPath('img/nft/TrollCry.png')} margin={{ right: 4 }} width={40} height="auto" class="flex" />
                      <i-label class="note-burn" caption="This is NFT Will Be Gone Forever" />
                    </i-hstack>
                    <i-button
                      id="btnBurn" height={40} class="btn-stake btn-os" caption="Burn"
                      rightIcon={{ spin: true, visible: false }}
                      onClick={() => this.onSubmit()}
                    />
                  </i-panel>
                </i-panel>
              </i-panel>
            </i-vstack>
          </i-hstack>
        </i-panel>
        <i-scom-tx-status-modal id="txStatusModal" />
        <i-scom-wallet-modal id="mdWallet" wallets={[]} />
      </i-scom-dapp-container>
    )
  }
}