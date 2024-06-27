/// <reference path="@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-dapp-container/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-commission-proxy-contract/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@ijstech/eth-contract/index.d.ts" />
/// <amd-module name="@scom/oswap-nft-widget/global/helper.ts" />
declare module "@scom/oswap-nft-widget/global/helper.ts" {
    import { BigNumber } from "@ijstech/eth-wallet";
    export enum SITE_ENV {
        DEV = "dev",
        TESTNET = "testnet",
        MAINNET = "mainnet"
    }
    export const DefaultDateTimeFormat = "DD/MM/YYYY HH:mm:ss";
    export const DefaultDateFormat = "DD/MM/YYYY";
    export const formatDate: (date: any, customType?: string, showTimezone?: boolean) => string;
    export const formatUTCDate: (date: any, customType?: string, showTimezone?: boolean) => string;
    export const compareDate: (fromDate: any, toDate?: any) => boolean;
    export const formatNumber: (value: any, decimals?: number, options?: {
        min?: number;
        sign?: string;
    }) => string;
    export const formatPercentNumber: (value: any, decimals?: number) => string;
    export const formatNumberWithSeparators: (value: number, precision?: number) => string;
    export const isInvalidInput: (val: any) => boolean;
    export const limitInputNumber: (input: any, decimals: number) => void;
    export const limitDecimals: (value: any, decimals: number) => any;
    export function getAPI(url: string, paramsObj?: any): Promise<any>;
    export const toWeiInv: (n: string, unit?: number) => BigNumber;
    export const padLeft: (string: string, chars: number, sign?: string) => string;
    export const numberToBytes32: (value: any, prefix?: string) => any;
    export const getParamsFromUrl: () => URLSearchParams;
    export const uniqWith: (array: any[], compareFn: (cur: any, oth: any) => boolean) => any;
    export const getWeekDays: () => any[];
    export const showResultMessage: (result: any, status: 'warning' | 'success' | 'error', content?: string | Error) => void;
    export function flatMap<T, U>(array: T[], callback: (item: T) => U[]): U[];
}
/// <amd-module name="@scom/oswap-nft-widget/global/error.ts" />
declare module "@scom/oswap-nft-widget/global/error.ts" {
    export function parseContractError(oMessage: string, tokens: string[]): Promise<string>;
}
/// <amd-module name="@scom/oswap-nft-widget/global/common.ts" />
declare module "@scom/oswap-nft-widget/global/common.ts" {
    import { BigNumber, ISendTxEventsOptions } from "@ijstech/eth-wallet";
    import { ITokenObject } from "@scom/scom-token-list";
    export type TokenMapType = {
        [token: string]: ITokenObject;
    };
    export const ERC20MaxAmount: BigNumber;
    export const isTransactionConfirmed: (txHash: string) => Promise<boolean>;
    export const registerSendTxEvents: (sendTxEventHandlers: ISendTxEventsOptions) => void;
    export const isAddressValid: (address: string) => Promise<any>;
}
/// <amd-module name="@scom/oswap-nft-widget/global/index.ts" />
declare module "@scom/oswap-nft-widget/global/index.ts" {
    import { INetwork } from '@ijstech/eth-wallet';
    export interface IExtendedNetwork extends INetwork {
        shortName?: string;
        isDisabled?: boolean;
        isMainChain?: boolean;
        explorerName?: string;
        explorerTxUrl?: string;
        explorerAddressUrl?: string;
        isTestnet?: boolean;
    }
    export const enum EventId {
        IsWalletConnected = "isWalletConnected",
        IsWalletDisconnected = "IsWalletDisconnected",
        Paid = "Paid"
    }
    export { getAPI, formatNumber, formatNumberWithSeparators, DefaultDateTimeFormat, DefaultDateFormat, formatDate, formatUTCDate, limitDecimals, limitInputNumber, isInvalidInput, toWeiInv, numberToBytes32, getParamsFromUrl, uniqWith, getWeekDays, compareDate, formatPercentNumber, SITE_ENV, showResultMessage, flatMap } from "@scom/oswap-nft-widget/global/helper.ts";
    export { parseContractError } from "@scom/oswap-nft-widget/global/error.ts";
    export { isTransactionConfirmed, registerSendTxEvents, TokenMapType, isAddressValid, ERC20MaxAmount, } from "@scom/oswap-nft-widget/global/common.ts";
}
/// <amd-module name="@scom/oswap-nft-widget/data.json.ts" />
declare module "@scom/oswap-nft-widget/data.json.ts" {
    const _default: {
        infuraId: string;
        defaultBuilderData: {
            defaultChainId: number;
            networks: {
                chainId: number;
            }[];
            wallets: {
                name: string;
            }[];
            showHeader: boolean;
            showFooter: boolean;
        };
        supportedNetworks: ({
            chainId: number;
            isMainChain: boolean;
            isTestnet?: undefined;
        } | {
            chainId: number;
            isMainChain: boolean;
            isTestnet: boolean;
        } | {
            chainId: number;
            isTestnet: boolean;
            isMainChain?: undefined;
        } | {
            chainId: number;
            isMainChain?: undefined;
            isTestnet?: undefined;
        })[];
    };
    export default _default;
}
/// <amd-module name="@scom/oswap-nft-widget/store/data/core.ts" />
declare module "@scom/oswap-nft-widget/store/data/core.ts" {
    export const MainnetMainChain = 56;
    export const TestnetMainChain = 97;
    export const Mainnets: number[];
    export const Testnets: number[];
}
/// <amd-module name="@scom/oswap-nft-widget/store/utils.ts" />
declare module "@scom/oswap-nft-widget/store/utils.ts" {
    import { ERC20ApprovalModel, IERC20ApprovalEventOptions } from '@ijstech/eth-wallet';
    import { IExtendedNetwork, TokenMapType } from "@scom/oswap-nft-widget/global/index.ts";
    import { ITokenObject } from '@scom/scom-token-list';
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
        MetaMask = "metamask",
        Coin98 = "coin98",
        TrustWallet = "trustwallet",
        BinanceChainWallet = "binancechainwallet",
        ONTOWallet = "onto",
        WalletConnect = "walletconnect",
        BitKeepWallet = "bitkeepwallet",
        FrontierWallet = "frontierwallet"
    }
    export enum NetworkType {
        Mainnet = 0,
        Testnet = 1,
        NotSupported = 2
    }
    export function getNetworkType(chainId: number): NetworkType;
    export function getNetworksByType(chainId: number): number[];
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
    export type ProxyAddresses = {
        [key: number]: string;
    };
    export class State {
        defaultChainId: number;
        slippageTolerance: string;
        proxyAddresses: ProxyAddresses;
        infuraId: string;
        rpcWalletId: string;
        networkMap: {
            [key: number]: IExtendedNetwork;
        };
        networkConfig: INetworkConfig[];
        embedderCommissionFee: string;
        approvalModel: ERC20ApprovalModel;
        constructor(options: any);
        initRpcWallet(defaultChainId: number): string;
        getRpcWallet(): import("@ijstech/eth-wallet").IRpcWallet;
        isRpcWalletConnected(): boolean;
        getProxyAddress(chainId?: number): string;
        getNetworkInfo: (chainId: number) => IExtendedNetwork;
        getFilteredNetworks: (filter: (value: IExtendedNetwork, index: number, array: IExtendedNetwork[]) => boolean) => IExtendedNetwork[];
        getSiteSupportedNetworks: () => IExtendedNetwork[];
        getMatchNetworks: (conditions: NetworkConditions) => IExtendedNetwork[];
        getNetworkExplorerName: (chainId: number) => string;
        viewOnExplorerByTxHash: (chainId: number, txHash: string) => void;
        viewOnExplorerByAddress: (chainId: number, address: string) => void;
        getChainId(): number;
        getSlippageTolerance: () => number;
        setSlippageTolerance: (value: number) => void;
        setNetworkConfig: (networks: INetworkConfig[]) => void;
        getNetworkConfig: () => INetworkConfig[];
        private initData;
        setApprovalModelAction(options: IERC20ApprovalEventOptions, spenderAddress: string): Promise<import("@ijstech/eth-wallet").IERC20ApprovalAction>;
    }
    interface NetworkConditions {
        isDisabled?: boolean;
        isTestnet?: boolean;
        isMainChain?: boolean;
    }
    export const getTokensDataList: (tokenMapData: TokenMapType, tokenBalances: any) => Promise<any[]>;
    export function getWalletProvider(): string;
    export function isWalletConnected(): boolean;
    export const truncateAddress: (address: string) => string;
    export const getChainNativeToken: (chainId: number) => ITokenObject;
}
/// <amd-module name="@scom/oswap-nft-widget/store/data/nft.ts" />
declare module "@scom/oswap-nft-widget/store/data/nft.ts" {
    import { ITokenObject } from "@scom/scom-token-list";
    enum NFT_TYPE {
        OSWAP = "oswap",
        OAX = "oax"
    }
    const trollAPIUrl: {
        [key: number]: string;
    };
    const rewardAddress: {
        [key: number]: string;
    };
    const attributesDistribution: {
        [key: string]: {
            base: number;
            digits: number[];
            probability: number[][];
            rarityIndex: number | null;
            rarityMatrix?: number[];
        };
    };
    interface ITrollCampBasicInfo {
        tier?: string;
        contract: string;
        rewards?: number;
        apr: number;
        flashSales?: string;
        attributes: any;
        hide?: boolean;
    }
    interface TrollCampInfoMapType {
        [chainId: number]: ITrollCampBasicInfo[];
    }
    const trollCampInfoMap: TrollCampInfoMapType;
    interface ITrollCampInfo extends ITrollCampBasicInfo {
        token: ITokenObject;
        minimumStake: string;
        cap: string;
        available: string;
        protocolFee: string;
    }
    interface IMyNFTInfo {
        token: ITokenObject;
        tokenID: number;
        stakingBalance: string;
        attributes: string[] | null;
        rarity: number;
        birthday: number;
        image: string;
    }
    interface IUserNFTsInfo extends ITrollCampBasicInfo {
        stakeToken: ITokenObject;
        listNFT: IMyNFTInfo[];
    }
    interface INFTCollectionCard {
        contract: string;
        token: ITokenObject;
        tier?: string;
        tokenID: number;
        owner: string;
        attributes: string[] | null;
        rarity: number;
        birthday: number;
        image: string;
    }
    interface INFTCollectionInfo {
        list: INFTCollectionCard[];
        total: number;
    }
    const oaxNFTInfo: TrollCampInfoMapType;
    interface IDataCard {
        address: string;
        flashSales?: string;
        monthlyReward: string;
        rewardsBoost: string;
        tier?: string;
        slot: string;
        stakeAmount: string;
        stakeToken: ITokenObject;
        stakeAmountText: string;
        protocolFee: string;
        totalPayAmount: string;
    }
    interface IDataMyCard {
        address: string;
        flashSales?: string;
        monthlyRewardAPR: number;
        monthlyRewardText: string;
        rewardsBoost: string;
        tier?: string;
        trollNumber: number;
        stakeToken: ITokenObject;
        stakeAmount: string;
        stakeAmountText: string;
        rarity: number;
        birthday: string;
        image: string;
    }
    export { NFT_TYPE, trollAPIUrl, rewardAddress, attributesDistribution, ITrollCampBasicInfo, TrollCampInfoMapType, trollCampInfoMap, ITrollCampInfo, IMyNFTInfo, IUserNFTsInfo, INFTCollectionCard, INFTCollectionInfo, oaxNFTInfo, IDataCard, IDataMyCard };
}
/// <amd-module name="@scom/oswap-nft-widget/store/data/index.ts" />
declare module "@scom/oswap-nft-widget/store/data/index.ts" {
    export * from "@scom/oswap-nft-widget/store/data/core.ts";
    export * from "@scom/oswap-nft-widget/store/data/nft.ts";
}
/// <amd-module name="@scom/oswap-nft-widget/store/index.ts" />
declare module "@scom/oswap-nft-widget/store/index.ts" {
    import { State } from "@scom/oswap-nft-widget/store/utils.ts";
    export * from "@scom/oswap-nft-widget/store/data/index.ts";
    export const nullAddress = "0x0000000000000000000000000000000000000000";
    export const getTokenIcon: (address: string, chainId: number) => string;
    export const tokenSymbol: (address: string, chainId: number) => string;
    export const tokenName: (address: string, chainId: number) => string;
    export const getNetworkImg: (state: State, chainId: number) => string;
    export * from "@scom/oswap-nft-widget/store/utils.ts";
}
/// <amd-module name="@scom/oswap-nft-widget/assets.ts" />
declare module "@scom/oswap-nft-widget/assets.ts" {
    function fullPath(path: string): string;
    const _default_1: {
        fullPath: typeof fullPath;
    };
    export default _default_1;
}
/// <amd-module name="@scom/oswap-nft-widget/nft-utils/card.css.ts" />
declare module "@scom/oswap-nft-widget/nft-utils/card.css.ts" {
    export const cardStyle: string;
}
/// <amd-module name="@scom/oswap-nft-widget/nft-utils/card.tsx" />
declare module "@scom/oswap-nft-widget/nft-utils/card.tsx" {
    import { Container, ControlElement, Module } from '@ijstech/components';
    import { State } from "@scom/oswap-nft-widget/store/index.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['nft-card']: ControlElement;
            }
        }
    }
    export class NftCard extends Module {
        private $eventBus;
        private _cardData;
        private pnlSlots;
        private stakeAmountText;
        private trollImage;
        private reward;
        private monthlyReward;
        private flashSales;
        private btnHandleStake;
        private _onStake;
        private clientEvents;
        private state;
        constructor(state: State, parent?: Container, options?: any);
        onHide(): void;
        get onStake(): any;
        set onStake(callback: any);
        get cardData(): any;
        set cardData(value: any);
        updateBtn(): void;
        registerEvent(): void;
        handleStake(): void;
        openLink(): void;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/oswap-nft-widget/nft-utils/myCard.css.ts" />
declare module "@scom/oswap-nft-widget/nft-utils/myCard.css.ts" {
    export const myCardStyle: string;
}
/// <amd-module name="@scom/oswap-nft-widget/nft-utils/myCard.tsx" />
declare module "@scom/oswap-nft-widget/nft-utils/myCard.tsx" {
    import { Control, ControlElement, Module, Container } from '@ijstech/components';
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['nft-my-card']: ControlElement;
            }
        }
    }
    export class NftMyCard extends Module {
        private _cardData;
        private caption1;
        private caption2;
        private stakeAmount;
        private trollImage;
        private reward;
        private monthlyReward;
        private flashSales;
        private birthday;
        private rarity;
        private btnHanldeStake;
        private panel1;
        private _onBurn;
        constructor(parent?: Container, options?: any);
        get cardData(): any;
        set cardData(value: any);
        renderStar(): Promise<void>;
        get onBurn(): any;
        set onBurn(callback: any);
        handleFlipCard(sender: Control, event: Event): void;
        init(): Promise<void>;
        render(): Promise<any>;
    }
}
/// <amd-module name="@scom/oswap-nft-widget/nft-utils/ntfColumn.ts" />
declare module "@scom/oswap-nft-widget/nft-utils/ntfColumn.ts" {
    import { Control } from '@ijstech/components';
    import { ITokenObject } from '@scom/scom-token-list';
    export const nftMyRewardsColumns: ({
        title: string;
        fieldName: string;
        key: string;
        textAlign: any;
        onRenderCell?: undefined;
    } | {
        title: string;
        fieldName: string;
        key: string;
        onRenderCell: (source: Control, token: ITokenObject, rowData: any) => any;
        textAlign?: undefined;
    })[];
    const _default_2: {
        nftMyRewardsColumns: ({
            title: string;
            fieldName: string;
            key: string;
            textAlign: any;
            onRenderCell?: undefined;
        } | {
            title: string;
            fieldName: string;
            key: string;
            onRenderCell: (source: Control, token: ITokenObject, rowData: any) => any;
            textAlign?: undefined;
        })[];
    };
    export default _default_2;
}
/// <amd-module name="@scom/oswap-nft-widget/nft-utils/nftAPI.ts" />
declare module "@scom/oswap-nft-widget/nft-utils/nftAPI.ts" {
    import { TransactionReceipt } from "@ijstech/eth-wallet";
    import { ITrollCampInfo, IUserNFTsInfo, State } from "@scom/oswap-nft-widget/store/index.ts";
    import { ITokenObject } from "@scom/scom-token-list";
    const getCommissionRate: (state: State, campaignId: number) => Promise<string>;
    const getNFTObject: (trollAPI: string, nft: string, tokenId?: number, owner?: string) => Promise<any>;
    const getTrollCampInfo: (state: State, nftCampaign: string) => Promise<ITrollCampInfo[]>;
    const getUserNFTs: (state: State, nftCampaign: string, address: string) => Promise<IUserNFTsInfo[]>;
    const mintNFT: (contractAddress: string, token: ITokenObject, amount: string) => Promise<TransactionReceipt>;
    const burnNFT: (contractAddress: string, tokenID: number) => Promise<import("@ijstech/eth-contract").TransactionReceipt>;
    interface IOwnRewards {
        token: ITokenObject;
        startDate: number;
        endDate: number;
        claimedAmount: string;
        unclaimedAmount: string;
        totalAmount: string;
        tokenId?: string;
    }
    const getOwnRewards: (nft: string) => Promise<IOwnRewards[]>;
    const claimReward: (tokenId: string) => Promise<any>;
    const claimMultiple: () => Promise<import("@ijstech/eth-contract").TransactionReceipt>;
    export { getCommissionRate, getTrollCampInfo, mintNFT, burnNFT, getUserNFTs, getOwnRewards, IOwnRewards, claimReward, claimMultiple, getNFTObject };
}
/// <amd-module name="@scom/oswap-nft-widget/nft-utils/index.ts" />
declare module "@scom/oswap-nft-widget/nft-utils/index.ts" {
    export { NftCard } from "@scom/oswap-nft-widget/nft-utils/card.tsx";
    export { NftMyCard } from "@scom/oswap-nft-widget/nft-utils/myCard.tsx";
    export { nftMyRewardsColumns } from "@scom/oswap-nft-widget/nft-utils/ntfColumn.ts";
    export { getCommissionRate, getTrollCampInfo, mintNFT, burnNFT, getUserNFTs, getOwnRewards, IOwnRewards, claimReward, claimMultiple, getNFTObject } from "@scom/oswap-nft-widget/nft-utils/nftAPI.ts";
}
/// <amd-module name="@scom/oswap-nft-widget/formSchema.ts" />
declare module "@scom/oswap-nft-widget/formSchema.ts" {
    import ScomNetworkPicker from '@scom/scom-network-picker';
    export function getBuilderSchema(): {
        dataSchema: {
            type: string;
            properties: {
                networks: {
                    type: string;
                    required: boolean;
                    items: {
                        type: string;
                        properties: {
                            chainId: {
                                type: string;
                                enum: ({
                                    chainId: number;
                                    isMainChain: boolean;
                                    isTestnet?: undefined;
                                } | {
                                    chainId: number;
                                    isMainChain: boolean;
                                    isTestnet: boolean;
                                } | {
                                    chainId: number;
                                    isTestnet: boolean;
                                    isMainChain?: undefined;
                                } | {
                                    chainId: number;
                                    isMainChain?: undefined;
                                    isTestnet?: undefined;
                                })[];
                                required: boolean;
                            };
                        };
                    };
                };
                dark: {
                    type: string;
                    properties: {
                        backgroundColor: {
                            type: string;
                            format: string;
                        };
                        fontColor: {
                            type: string;
                            format: string;
                        };
                        inputBackgroundColor: {
                            type: string;
                            format: string;
                        };
                        inputFontColor: {
                            type: string;
                            format: string;
                        };
                        maxButtonBackground: {
                            type: string;
                            format: string;
                        };
                        maxButtonHoverBackground: {
                            type: string;
                            format: string;
                        };
                        primaryButtonBackground: {
                            type: string;
                            format: string;
                        };
                        primaryButtonHoverBackground: {
                            type: string;
                            format: string;
                        };
                        primaryButtonDisabledBackground: {
                            type: string;
                            format: string;
                        };
                    };
                };
                light: {
                    type: string;
                    properties: {
                        backgroundColor: {
                            type: string;
                            format: string;
                        };
                        fontColor: {
                            type: string;
                            format: string;
                        };
                        inputBackgroundColor: {
                            type: string;
                            format: string;
                        };
                        inputFontColor: {
                            type: string;
                            format: string;
                        };
                        maxButtonBackground: {
                            type: string;
                            format: string;
                        };
                        maxButtonHoverBackground: {
                            type: string;
                            format: string;
                        };
                        primaryButtonBackground: {
                            type: string;
                            format: string;
                        };
                        primaryButtonHoverBackground: {
                            type: string;
                            format: string;
                        };
                        primaryButtonDisabledBackground: {
                            type: string;
                            format: string;
                        };
                    };
                };
            };
        };
        uiSchema: {
            type: string;
            elements: ({
                type: string;
                label: string;
                elements: {
                    type: string;
                    elements: {
                        type: string;
                        label: string;
                        elements: {
                            type: string;
                            elements: {
                                type: string;
                                scope: string;
                            }[];
                        }[];
                    }[];
                }[];
            } | {
                type: string;
                label: string;
                elements: {
                    type: string;
                    elements: {
                        type: string;
                        elements: {
                            type: string;
                            label: string;
                            elements: {
                                type: string;
                                scope: string;
                                options: {
                                    detail: {
                                        type: string;
                                    };
                                };
                            }[];
                        }[];
                    }[];
                }[];
            })[];
        };
        customControls(): {
            '#/properties/networks/properties/chainId': {
                render: () => ScomNetworkPicker;
                getData: (control: ScomNetworkPicker) => number;
                setData: (control: ScomNetworkPicker, value: number) => Promise<void>;
            };
        };
    };
    export function getProjectOwnerSchema(): any;
}
/// <amd-module name="@scom/oswap-nft-widget/index.css.ts" />
declare module "@scom/oswap-nft-widget/index.css.ts" {
    export const nftStyle: string;
    export const tabStyle: string;
    export const nftDefaultStyle: string;
    export const nftStyle_1100: string;
    export const nftStyle_767: string;
    export const nftStyle_525: string;
    export const nftStyle_480: string;
    export const nftStyle_375: string;
    export const listMediaStyles: {
        375: string;
        480: string;
        525: string;
        767: string;
        1100: string;
    };
}
/// <amd-module name="@scom/oswap-nft-widget" />
declare module "@scom/oswap-nft-widget" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import ScomCommissionFeeSetup from '@scom/scom-commission-fee-setup';
    import { IWalletPlugin } from '@scom/scom-wallet-modal';
    interface ICommissionInfo {
        chainId: number;
        walletAddress: string;
    }
    interface INetworkConfig {
        chainName?: string;
        chainId: number;
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
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-oswap-nft-widget']: ScomOswapNftWidgetElement;
            }
        }
    }
    export default class ScomOswapNftWidget extends Module {
        private dappContainer;
        private mdWallet;
        private state;
        private chainId;
        private approvalModelAction;
        private cardRow;
        private myCardRow;
        private myRewardTable;
        private mint;
        private minting;
        private burning;
        private txStatusModal;
        private lbMintTitle;
        private lbMintFee;
        private lbMintStakeAmountText;
        private lbMintStakeAmount;
        private lbMintRewardsBoost;
        private lbMintMonthlyReward;
        private lbMintFlashSales;
        private lbTokenBalance;
        private ImageMintStakeToken;
        private lbMintStakeToken;
        private lbMintMessage1;
        private lbMintMessage2;
        private btnApprove;
        private btnMint;
        private btnBurn;
        private lbBurnMessage;
        private lbMyNFTsNum;
        private lbMyNFTsStakeValue;
        private currentDataCard;
        private dataCards;
        private ImageBurn;
        private dataMyCards;
        private currentDataMyCard;
        private currentTab;
        private myNFTsLoading;
        private myRewardLoading;
        private btnClaimAll;
        private emptyRewardsMsg;
        private myNFTsInfoPanel;
        private _data;
        tag: any;
        constructor(parent?: Container, options?: any);
        removeRpcWalletEvents(): void;
        onHide(): void;
        get defaultChainId(): number;
        set defaultChainId(value: number);
        get wallets(): IWalletPlugin[];
        set wallets(value: IWalletPlugin[]);
        get networks(): INetworkConfig[];
        set networks(value: INetworkConfig[]);
        get showHeader(): boolean;
        set showHeader(value: boolean);
        set width(value: string | number);
        private determineActionsByTarget;
        private loadCommissionFee;
        private getBuilderActions;
        private getProjectOwnerActions;
        getConfigurators(): ({
            name: string;
            target: string;
            elementName: string;
            getLinkParams: () => {
                data: any;
            };
            bindOnChanged: (element: ScomCommissionFeeSetup, callback: (data: any) => Promise<void>) => void;
            getData: () => Promise<{
                fee: string;
                campaignId?: number;
                commissions?: ICommissionInfo[];
                defaultChainId: number;
                wallets: IWalletPlugin[];
                networks: INetworkConfig[];
                showHeader?: boolean;
            }>;
            setData: (properties: INftOswapWidgetData, linkParams?: Record<string, any>) => Promise<void>;
            getTag: any;
            setTag: any;
            getActions?: undefined;
        } | {
            name: string;
            target: string;
            getActions: (category?: string) => any[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
            elementName?: undefined;
            getLinkParams?: undefined;
            bindOnChanged?: undefined;
        })[];
        private getData;
        private resetRpcWallet;
        private setData;
        private getTag;
        private updateTag;
        private setTag;
        private updateStyle;
        private updateTheme;
        private myRewardsCols;
        private refreshUI;
        private isEmptyData;
        init(): Promise<void>;
        private checkWidth;
        private resizeUI;
        private initWallet;
        private initializeWidgetConfig;
        private onChainChange;
        private initApprovalModelAction;
        private updateBalances;
        private switchNetworkByWallet;
        private onChangeTab;
        private renderEmpty;
        private renderMyRewardEmpty;
        private renderData;
        private renderMyReward;
        private renderCards;
        private renderMyCards;
        private onSubmit;
        private onStake;
        private claimAllRewards;
        private handleMint;
        private clickApprove;
        private handleBack;
        private handleBurnBack;
        private handleBurn;
        private handleConfirmBurn;
        render(): any;
    }
}
