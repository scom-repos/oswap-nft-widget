/// <reference path="@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-dapp-container/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@scom/scom-commission-proxy-contract/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@ijstech/eth-contract/index.d.ts" />
/// <amd-module name="@scom/oswap-nft-widget/store/data/core.ts" />
declare module "@scom/oswap-nft-widget/store/data/core.ts" {
    export const MainnetMainChain = 56;
    export const TestnetMainChain = 97;
    export const Mainnets: number[];
    export const Testnets: number[];
}
/// <amd-module name="@scom/oswap-nft-widget/store/data/nft.ts" />
declare module "@scom/oswap-nft-widget/store/data/nft.ts" {
    export interface TokenConstant {
        address: string;
        name: string;
        decimals: number;
        symbol: string;
    }
    export interface UserNftInfo {
        tokenId: number;
        stakeBalance: string;
        attributes: string[] | null;
        rarity: number;
        birthday: number;
        image: string;
    }
    export interface UserNFTsInfo extends NftInfoStore {
        stakeToken: TokenConstant;
        userNfts: UserNftInfo[];
    }
    export interface IDataCard {
        address: string;
        flashSales?: string;
        monthlyReward: string;
        rewardsBoost: string;
        tier?: string;
        fullName: string;
        slot: number;
        stakeAmount: string;
        stakeToken: TokenConstant;
        stakeAmountText: string;
        protocolFee: string;
        totalPayAmount: string;
        userNFTs?: IDataMyCard[];
    }
    export interface IDataMyCard {
        address: string;
        flashSales?: string;
        monthlyRewardAPR: number;
        monthlyRewardText: string;
        rewardsBoost: string;
        tier?: string;
        trollNumber: number;
        stakeToken: TokenConstant;
        stakeAmount: string;
        stakeAmountText: string;
        rarity: number;
        birthday: string;
        image: string;
    }
    export const trollAPIUrl: Record<SupportedNetworkId, string>;
    export interface AttributeDistribution {
        base: number;
        digits: number[];
        probability: number[][];
        rarityIndex: number;
    }
    export const attributeDistribution: AttributeDistribution;
    export interface NftInfoStore {
        chainId: SupportedNetworkId;
        name: OswapNfts;
        fullName: string;
        address: string;
        token: TokenConstant;
        rewards: number;
        apr: number;
        flashSales: string;
        attributes: AttributeDistribution;
    }
    export enum SupportedNetworkId {
        bscMain = 56,
        bscTest = 97
    }
    export const defaultChainId = SupportedNetworkId.bscMain;
    export enum OswapNfts {
        tier1 = "hungry",
        tier2 = "happy",
        tier3 = "hunny"
    }
    export type OswapNftsType = "hungry" | "happy" | "hunny";
    export const stakeTokenMap: Record<SupportedNetworkId, TokenConstant>;
    export const nftInfoStoreMap: Record<SupportedNetworkId, Record<OswapNfts, NftInfoStore>>;
}
/// <amd-module name="@scom/oswap-nft-widget/store/data/index.ts" />
declare module "@scom/oswap-nft-widget/store/data/index.ts" {
    export * from "@scom/oswap-nft-widget/store/data/core.ts";
    export * from "@scom/oswap-nft-widget/store/data/nft.ts";
}
/// <amd-module name="@scom/oswap-nft-widget/global/helper.ts" />
declare module "@scom/oswap-nft-widget/global/helper.ts" {
    export enum SITE_ENV {
        DEV = "dev",
        TESTNET = "testnet",
        MAINNET = "mainnet"
    }
    export const DefaultDateTimeFormat = "DD/MM/YYYY HH:mm:ss";
    export const DefaultDateFormat = "DD/MM/YYYY";
    export const formatNumber: (value: any, decimals?: number, options?: {
        min?: number;
        sign?: string;
    }) => string;
    export const formatNumberWithSeparators: (value: number, precision?: number) => string;
    export const showResultMessage: (result: any, status: 'warning' | 'success' | 'error', content?: string | Error) => void;
}
/// <amd-module name="@scom/oswap-nft-widget/global/common.ts" />
declare module "@scom/oswap-nft-widget/global/common.ts" {
    import { ISendTxEventsOptions } from "@ijstech/eth-wallet";
    export const registerSendTxEvents: (sendTxEventHandlers: ISendTxEventsOptions) => void;
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
    export { formatNumber, formatNumberWithSeparators, DefaultDateTimeFormat, DefaultDateFormat, SITE_ENV, showResultMessage, } from "@scom/oswap-nft-widget/global/helper.ts";
    export { registerSendTxEvents, } from "@scom/oswap-nft-widget/global/common.ts";
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
            tier: string;
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
        })[];
    };
    export default _default;
}
/// <amd-module name="@scom/oswap-nft-widget/assets.ts" />
declare module "@scom/oswap-nft-widget/assets.ts" {
    function fullPath(path: string): string;
    const _default_1: {
        fullPath: typeof fullPath;
    };
    export default _default_1;
}
/// <amd-module name="@scom/oswap-nft-widget/store/utils.ts" />
declare module "@scom/oswap-nft-widget/store/utils.ts" {
    import { ERC20ApprovalModel, IERC20ApprovalEventOptions } from '@ijstech/eth-wallet';
    import { IExtendedNetwork } from "@scom/oswap-nft-widget/global/index.ts";
    import { ITokenObject } from '@scom/scom-token-list';
    import { INetworkConfig } from '@scom/scom-network-picker';
    export const nftImagePlaceHolder: string;
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
        viewOnExplorerByAddress: (chainId: number, address: string) => void;
        getChainId(): number;
        setNetworkConfig: (networks: INetworkConfig[]) => void;
        getNetworkConfig: () => INetworkConfig[];
        private initData;
        setApprovalModelAction(options: IERC20ApprovalEventOptions, spenderAddress: string): Promise<import("@ijstech/eth-wallet").IERC20ApprovalAction>;
    }
    export function getWalletProvider(): string;
    export function isClientWalletConnected(): boolean;
    export const getChainNativeToken: (chainId: number) => ITokenObject;
    export function forEachNumberIndexAwait<T>(list: {
        [index: number]: T;
    }, callbackFn: (item: T, index: number) => Promise<void>): Promise<void>;
    export function forEachNumberIndex<T>(list: {
        [index: number]: T;
    }, callbackFn: (item: T, index: number) => void): void;
    export function mapIndexNumber<T, X>(list: {
        [index: number]: T;
    }, callbackFn: (item: T, index: number) => X): X[];
    export function mapRecordIndex<T, X, I extends string | number | symbol>(list: Record<I, T>, callbackFn: (item: T, index: I, list: Record<I, T>) => X): X[];
    export function forEachRecordIndex<T, X, I extends string | number | symbol>(list: Record<I, T>, callbackFn: (item: T, index: I, list: Record<I, T>) => X): void;
    export function mapRecord<T, X, I extends string | number | symbol>(list: Record<I, T>, callbackFn: (item: T, index: I, list: Record<I, T>) => X): Record<I, X>;
    export function mapRecordAwait<T, X, I extends string | number | symbol>(list: Record<I, T>, callbackFn: (item: T, index: I, list: Record<I, T>) => Promise<X>): Promise<Record<I, X>>;
    export function mapRecordNumber<T, X>(list: Record<number, T>, callbackFn: (item: T, index: number, list: Record<number, T>) => X): Record<number, X>;
    export function mapRecordNumberAwait<T, X>(list: Record<number, T>, callbackFn: (item: T, index: number, list: Record<number, T>) => Promise<X>): Promise<Record<number, X>>;
}
/// <amd-module name="@scom/oswap-nft-widget/store/index.ts" />
declare module "@scom/oswap-nft-widget/store/index.ts" {
    export * from "@scom/oswap-nft-widget/store/data/index.ts";
    export * from "@scom/oswap-nft-widget/store/utils.ts";
}
/// <amd-module name="@scom/oswap-nft-widget/nft-utils/card.css.ts" />
declare module "@scom/oswap-nft-widget/nft-utils/card.css.ts" {
    export const cardStyle: string;
}
/// <amd-module name="@scom/oswap-nft-widget/nft-utils/myCard.css.ts" />
declare module "@scom/oswap-nft-widget/nft-utils/myCard.css.ts" {
    export const myCardStyle: string;
}
/// <amd-module name="@scom/oswap-nft-widget/translations.json.ts" />
declare module "@scom/oswap-nft-widget/translations.json.ts" {
    const _default_2: {
        en: {
            approving: string;
            balance: string;
            birthday: string;
            burn: string;
            burning: string;
            by_confirmimg_the_transaction_you_will_burn_nft_and_receive_75000oswap: string;
            by_confirmimg_the_transaction_you_will_burn_nft_and_receive: string;
            chain_id_is_not_supported: string;
            chain_name_is_not_supported: string;
            confirm_burn: string;
            connect_wallet: string;
            flash_sales_inclusion: string;
            guaranteed: string;
            loading: string;
            mint_fee: string;
            mint_troll: string;
            minting: string;
            monthly_reward: string;
            owned: string;
            periodic: string;
            please_confirm_you_would_like_to_mint_a_nft_by_staking_of_50000_of_oswap: string;
            please_confirm_you_would_like_to_mint_a_nft_by_staking: string;
            priority: string;
            rarity: string;
            rewards_boost: string;
            sold_out: string;
            stake_amount: string;
            stake: string;
            staking: string;
            switch_network: string;
            the_mint_fee_covers_the_transaction_cost_on_using_chainlink_verifiable_random_function: string;
            the_monthly_reward_will_be_distributed_at_the_end_of_each_month: string;
            the_reward_boost_is_only_applicable_to_oswap_staking_rewards: string;
            this_is_nft_will_be_gone_forever: string;
            value: string;
            view_contract: string;
            you_can_unstake_by_the_burning_the_nft: string;
            you_can_unstake_oswap_by_the_burning_the_nft: string;
            your_very_own_nft_is_getting_ready: string;
        };
        "zh-hant": {
            approving: string;
            balance: string;
            birthday: string;
            burn: string;
            burning: string;
            by_confirmimg_the_transaction_you_will_burn_nft_and_receive_75000oswap: string;
            by_confirmimg_the_transaction_you_will_burn_nft_and_receive: string;
            chain_id_is_not_supported: string;
            chain_name_is_not_supported: string;
            confirm_burn: string;
            connect_wallet: string;
            flash_sales_inclusion: string;
            guaranteed: string;
            loading: string;
            mint_fee: string;
            mint_troll: string;
            minting: string;
            monthly_reward: string;
            owned: string;
            periodic: string;
            please_confirm_you_would_like_to_mint_a_nft_by_staking_of_50000_of_oswap: string;
            please_confirm_you_would_like_to_mint_a_nft_by_staking: string;
            priority: string;
            rarity: string;
            rewards_boost: string;
            sold_out: string;
            stake_amount: string;
            stake: string;
            staking: string;
            switch_network: string;
            the_mint_fee_covers_the_transaction_cost_on_using_chainlink_verifiable_random_function: string;
            the_monthly_reward_will_be_distributed_at_the_end_of_each_month: string;
            the_reward_boost_is_only_applicable_to_oswap_staking_rewards: string;
            this_is_nft_will_be_gone_forever: string;
            value: string;
            view_contract: string;
            you_can_unstake_by_the_burning_the_nft: string;
            you_can_unstake_oswap_by_the_burning_the_nft: string;
            your_very_own_nft_is_getting_ready: string;
        };
        vi: {
            approving: string;
            balance: string;
            birthday: string;
            burn: string;
            burning: string;
            by_confirmimg_the_transaction_you_will_burn_nft_and_receive_75000oswap: string;
            by_confirmimg_the_transaction_you_will_burn_nft_and_receive: string;
            chain_id_is_not_supported: string;
            chain_name_is_not_supported: string;
            confirm_burn: string;
            connect_wallet: string;
            flash_sales_inclusion: string;
            guaranteed: string;
            loading: string;
            mint_fee: string;
            mint_troll: string;
            minting: string;
            monthly_reward: string;
            owned: string;
            periodic: string;
            please_confirm_you_would_like_to_mint_a_nft_by_staking_of_50000_of_oswap: string;
            please_confirm_you_would_like_to_mint_a_nft_by_staking: string;
            priority: string;
            rarity: string;
            rewards_boost: string;
            sold_out: string;
            stake_amount: string;
            stake: string;
            staking: string;
            switch_network: string;
            the_mint_fee_covers_the_transaction_cost_on_using_chainlink_verifiable_random_function: string;
            the_monthly_reward_will_be_distributed_at_the_end_of_each_month: string;
            the_reward_boost_is_only_applicable_to_oswap_staking_rewards: string;
            this_is_nft_will_be_gone_forever: string;
            value: string;
            view_contract: string;
            you_can_unstake_by_the_burning_the_nft: string;
            you_can_unstake_oswap_by_the_burning_the_nft: string;
            your_very_own_nft_is_getting_ready: string;
        };
    };
    export default _default_2;
}
/// <amd-module name="@scom/oswap-nft-widget/nft-utils/myCard.tsx" />
declare module "@scom/oswap-nft-widget/nft-utils/myCard.tsx" {
    import { ControlElement, Module, Container } from '@ijstech/components';
    import { IDataMyCard } from "@scom/oswap-nft-widget/store/index.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['nft-my-card']: ControlElement;
            }
        }
    }
    export class NftMyCard extends Module {
        private _cardData;
        private nftImage;
        private stakeAmount;
        private lbNftID;
        private birthday;
        private rarity;
        onBurn: () => void;
        constructor(parent?: Container, options?: any);
        get cardData(): IDataMyCard;
        set cardData(value: IDataMyCard);
        private renderStar;
        private renderCard;
        private handleFlipCard;
        init(): Promise<void>;
        render(): Promise<any>;
    }
}
/// <amd-module name="@scom/oswap-nft-widget/nft-utils/card.tsx" />
declare module "@scom/oswap-nft-widget/nft-utils/card.tsx" {
    import { Container, ControlElement, Module } from '@ijstech/components';
    import { IDataCard, IDataMyCard, State } from "@scom/oswap-nft-widget/store/index.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['nft-card']: ControlElement;
            }
        }
    }
    export class NftCard extends Module {
        private _cardData;
        private stakeAmountText;
        private trollImage;
        private reward;
        private monthlyReward;
        private flashSales;
        private lbCount;
        private lbViewContract;
        private btnHandleStake;
        private carouselSlider;
        onConnectWallet: () => void;
        onStake: () => void;
        onBurn: (item: IDataMyCard) => void;
        private _state;
        constructor(state: State, parent?: Container, options?: any);
        get state(): State;
        set state(value: State);
        get cardData(): IDataCard;
        set cardData(value: IDataCard);
        private renderCard;
        private updateBtn;
        private handleStake;
        private openLink;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/oswap-nft-widget/nft-utils/nftAPI.ts" />
declare module "@scom/oswap-nft-widget/nft-utils/nftAPI.ts" {
    import { BigNumber } from "@ijstech/eth-wallet";
    import { State, NftInfoStore, OswapNfts, SupportedNetworkId, TokenConstant, UserNftInfo, OswapNftsType } from "@scom/oswap-nft-widget/store/index.ts";
    interface NftInfo extends NftInfoStore {
        minimumStake: BigNumber;
        cap: BigNumber;
        totalSupply: BigNumber;
        protocolFee: BigNumber;
        userNfts: UserNftInfo[];
    }
    let nftInfoMap: Record<SupportedNetworkId, Record<OswapNfts, NftInfo>>;
    const getCommissionRate: (state: State, campaignId: number) => Promise<string>;
    const getNFTObject: (trollAPI: string, nft: string, tokenId?: number, owner?: string) => Promise<any>;
    function fetchNftInfoByTier(state: State, tier: OswapNfts | OswapNftsType): Promise<false | NftInfo>;
    function fetchAllNftInfo(state: State): Promise<false | Record<OswapNfts, NftInfo>>;
    const mintNFT: (contractAddress: string, token: TokenConstant, amount: string) => Promise<import("@ijstech/eth-contract").TransactionReceipt>;
    const burnNFT: (contractAddress: string, tokenID: number) => Promise<import("@ijstech/eth-contract").TransactionReceipt>;
    export { NftInfo, nftInfoMap, getCommissionRate, fetchAllNftInfo, fetchNftInfoByTier, mintNFT, burnNFT, getNFTObject };
}
/// <amd-module name="@scom/oswap-nft-widget/nft-utils/index.ts" />
declare module "@scom/oswap-nft-widget/nft-utils/index.ts" {
    export { NftCard } from "@scom/oswap-nft-widget/nft-utils/card.tsx";
    export { NftMyCard } from "@scom/oswap-nft-widget/nft-utils/myCard.tsx";
    export { NftInfo, getCommissionRate, fetchAllNftInfo, fetchNftInfoByTier, mintNFT, burnNFT, getNFTObject } from "@scom/oswap-nft-widget/nft-utils/nftAPI.ts";
}
/// <amd-module name="@scom/oswap-nft-widget/formSchema.ts" />
declare module "@scom/oswap-nft-widget/formSchema.ts" {
    import ScomNetworkPicker from '@scom/scom-network-picker';
    import { OswapNfts } from "@scom/oswap-nft-widget/store/index.ts";
    export function getBuilderSchema(): {
        dataSchema: {
            type: string;
            properties: {
                tier: {
                    type: string;
                    required: boolean;
                    enum: OswapNfts[];
                };
                networks: {
                    type: string;
                    required: boolean;
                    items: {
                        type: string;
                        maxItems: number;
                        properties: {
                            chainId: {
                                type: string;
                                enum: number[];
                                required: boolean;
                            };
                        };
                    };
                };
            };
        };
        uiSchema: {
            type: string;
            elements: {
                type: string;
                label: string;
                elements: {
                    type: string;
                    elements: ({
                        type: string;
                        scope: string;
                        options?: undefined;
                    } | {
                        type: string;
                        scope: string;
                        options: {
                            detail: {
                                type: string;
                            };
                        };
                    })[];
                }[];
            }[];
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
    export const dappContainerStyle: string;
    export const nftStyle: string;
    export const nftDefaultStyle: string;
    export const nftStyle_1100: string;
    export const nftStyle_767: string;
    export const nftStyle_480: string;
    export const nftStyle_360: string;
    export const listMediaStyles: {
        360: string;
        480: string;
        767: string;
        1100: string;
    };
}
/// <amd-module name="@scom/oswap-nft-widget" />
declare module "@scom/oswap-nft-widget" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { OswapNftsType } from "@scom/oswap-nft-widget/store/index.ts";
    import ScomCommissionFeeSetup from '@scom/scom-commission-fee-setup';
    import { IWalletPlugin } from '@scom/scom-wallet-modal';
    import { BlockNoteEditor, BlockNoteSpecs, callbackFnType, executeFnType } from '@scom/scom-blocknote-sdk';
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
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-oswap-nft-widget']: OswapNftWidgetElement;
            }
        }
    }
    export default class OswapNftWidget extends Module implements BlockNoteSpecs {
        private dappContainer;
        private mdWallet;
        private state;
        private chainId;
        private targetChainId;
        private approvalModelAction;
        private pnlLoading;
        private cardRow;
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
        private currentDataCard;
        private dataCards;
        private ImageBurn;
        private currentDataMyCard;
        private initializedState;
        private _data;
        tag: any;
        constructor(parent?: Container, options?: any);
        addBlock(blocknote: any, executeFn: executeFnType, callbackFn?: callbackFnType): {
            block: any;
            slashItem: {
                name: string;
                execute: (editor: BlockNoteEditor) => void;
                aliases: string[];
                group: string;
                icon: {
                    name: string;
                };
                hint: string;
            };
            moduleData: {
                name: string;
                localPath: string;
            };
        };
        removeRpcWalletEvents(): void;
        onHide(): void;
        get defaultChainId(): number;
        set defaultChainId(value: number);
        get wallets(): IWalletPlugin[];
        set wallets(value: IWalletPlugin[]);
        get networks(): INetworkConfig[];
        set networks(value: INetworkConfig[]);
        get tier(): OswapNftsType;
        set tier(value: OswapNftsType);
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
                tier: OswapNftsType;
                showHeader?: boolean;
            }>;
            setData: (properties: IOswapNftWidgetData, linkParams?: Record<string, any>) => Promise<void>;
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
        private initOswapTheme;
        private updateTheme;
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
        private renderEmpty;
        private renderData;
        private renderCards;
        private onSubmit;
        private updateButtons;
        private onStake;
        private handleMint;
        private clickApprove;
        private handleBack;
        private handleBurnBack;
        private handleBurn;
        private handleConfirmBurn;
        render(): any;
    }
}
