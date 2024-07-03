var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/oswap-nft-widget/store/data/core.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Testnets = exports.Mainnets = exports.TestnetMainChain = exports.MainnetMainChain = void 0;
    ///<amd-module name='@scom/oswap-nft-widget/store/data/core.ts'/> 
    exports.MainnetMainChain = 56;
    exports.TestnetMainChain = 97;
    exports.Mainnets = [56, 43114];
    exports.Testnets = [97, 43113];
});
define("@scom/oswap-nft-widget/store/data/nft.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.nftInfoStoreMap = exports.stakeTokenMap = exports.OswapNfts = exports.defaultChainId = exports.SupportedNetworkId = exports.attributeDistribution = exports.rewardAddress = exports.trollAPIUrl = void 0;
    exports.trollAPIUrl = {
        56: 'https://data.openswap.xyz/nft/v1',
        97: 'https://bsc-test-data.openswap.xyz/nft/v1',
    };
    exports.rewardAddress = {
        56: '0x37c8207975D5B04cc6c2C2570d91425985cF61Df',
        97: '0x265F91CdFC308275504120E32B6A2B09B066df1a',
    };
    exports.attributeDistribution = {
        base: 10,
        digits: [3, 3, 3, 3, 3, 3, 3],
        probability: [
            [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125],
            [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125],
            [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125],
            [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125],
            [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125],
            [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125],
            [0.5, 0.25, 0.15, 0.09, 0.01]
        ],
        rarityIndex: 6
    };
    var SupportedNetworkId;
    (function (SupportedNetworkId) {
        SupportedNetworkId[SupportedNetworkId["bscMain"] = 56] = "bscMain";
        SupportedNetworkId[SupportedNetworkId["bscTest"] = 97] = "bscTest";
    })(SupportedNetworkId = exports.SupportedNetworkId || (exports.SupportedNetworkId = {}));
    exports.defaultChainId = SupportedNetworkId.bscMain;
    var OswapNfts;
    (function (OswapNfts) {
        OswapNfts["tier1"] = "hungry";
        OswapNfts["tier2"] = "happy";
        OswapNfts["tier3"] = "hunny";
    })(OswapNfts = exports.OswapNfts || (exports.OswapNfts = {}));
    exports.stakeTokenMap = {
        56: { address: "0xb32aC3C79A94aC1eb258f3C830bBDbc676483c93", decimals: 18, name: "OpenSwap", symbol: "OSWAP" },
        97: { address: "0x45eee762aaeA4e5ce317471BDa8782724972Ee19", decimals: 18, name: "OpenSwap", symbol: "OSWAP" },
    };
    exports.nftInfoStoreMap = {
        56: {
            [OswapNfts.tier1]: {
                chainId: 56,
                name: OswapNfts.tier1,
                address: '0x1254132567549292388cd699Cb78B47d3101c8A9',
                token: exports.stakeTokenMap[56],
                rewards: 5,
                apr: 2,
                flashSales: 'Periodic',
                attributes: exports.attributeDistribution
            },
            [OswapNfts.tier2]: {
                chainId: 56,
                name: OswapNfts.tier2,
                address: '0x2d74990f55faeA086A83B9fE176FD36a34bA617b',
                token: exports.stakeTokenMap[56],
                rewards: 15,
                apr: 4,
                flashSales: 'Priority',
                attributes: exports.attributeDistribution
            },
            [OswapNfts.tier3]: {
                chainId: 56,
                name: OswapNfts.tier3,
                address: '0x3E8fb94D9dD7A8f9b2ccF0B4CCdC768628890eeB',
                token: exports.stakeTokenMap[56],
                rewards: 40,
                apr: 6,
                flashSales: 'Guaranteed',
                attributes: exports.attributeDistribution
            },
        },
        97: {
            [OswapNfts.tier1]: {
                chainId: 97,
                name: OswapNfts.tier1,
                address: '0x946985e7C43Ed2fc7985e89a49A251D52d824122',
                token: exports.stakeTokenMap[97],
                rewards: 5,
                apr: 2,
                flashSales: 'Periodic',
                attributes: exports.attributeDistribution
            },
            [OswapNfts.tier2]: {
                chainId: 97,
                name: OswapNfts.tier2,
                address: '0x157538c2d508CDb1A6cf48B8336E4e56350A97C8',
                token: exports.stakeTokenMap[97],
                rewards: 15,
                apr: 4,
                flashSales: 'Priority',
                attributes: exports.attributeDistribution
            },
            [OswapNfts.tier3]: {
                chainId: 97,
                name: OswapNfts.tier3,
                address: '0xB9425ddFB534CA87B73613283F4fB0073B63F31D',
                token: exports.stakeTokenMap[97],
                rewards: 40,
                apr: 6,
                flashSales: 'Guaranteed',
                attributes: exports.attributeDistribution
            },
        },
    };
});
define("@scom/oswap-nft-widget/store/data/index.ts", ["require", "exports", "@scom/oswap-nft-widget/store/data/core.ts", "@scom/oswap-nft-widget/store/data/nft.ts"], function (require, exports, core_1, nft_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/oswap-nft-widget/store/data/index.ts'/> 
    __exportStar(core_1, exports);
    __exportStar(nft_1, exports);
});
define("@scom/oswap-nft-widget/global/helper.ts", ["require", "exports", "@ijstech/eth-wallet"], function (require, exports, eth_wallet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.showResultMessage = exports.formatNumberWithSeparators = exports.formatNumber = exports.DefaultDateFormat = exports.DefaultDateTimeFormat = exports.SITE_ENV = void 0;
    var SITE_ENV;
    (function (SITE_ENV) {
        SITE_ENV["DEV"] = "dev";
        SITE_ENV["TESTNET"] = "testnet";
        SITE_ENV["MAINNET"] = "mainnet";
    })(SITE_ENV = exports.SITE_ENV || (exports.SITE_ENV = {}));
    exports.DefaultDateTimeFormat = 'DD/MM/YYYY HH:mm:ss';
    exports.DefaultDateFormat = 'DD/MM/YYYY';
    const formatNumber = (value, decimals, options) => {
        let val = value;
        const { min = '0.0000001', sign = '' } = options || {};
        const minValue = min;
        if (typeof value === 'string') {
            val = new eth_wallet_1.BigNumber(value).toNumber();
        }
        else if (typeof value === 'object') {
            val = value.toNumber();
        }
        if (val != 0 && new eth_wallet_1.BigNumber(val).lt(minValue)) {
            return `< ${sign}${minValue}`;
        }
        return `${sign}${(0, exports.formatNumberWithSeparators)(val, decimals || 4)}`;
    };
    exports.formatNumber = formatNumber;
    const formatNumberWithSeparators = (value, precision) => {
        if (!value)
            value = 0;
        if (precision) {
            let outputStr = '';
            if (value >= 1) {
                const unit = Math.pow(10, precision);
                const rounded = Math.floor(value * unit) / unit;
                outputStr = rounded.toLocaleString('en-US', { maximumFractionDigits: precision });
            }
            else {
                outputStr = value.toLocaleString('en-US', { maximumSignificantDigits: precision });
            }
            if (outputStr.length > 18) {
                outputStr = outputStr.substring(0, 18) + '...';
            }
            return outputStr;
        }
        return value.toLocaleString('en-US');
    };
    exports.formatNumberWithSeparators = formatNumberWithSeparators;
    const showResultMessage = (result, status, content) => {
        if (!result)
            return;
        let params = { status };
        if (status === 'success') {
            params.txtHash = content;
        }
        else {
            params.content = content;
        }
        result.message = { ...params };
        result.showModal();
    };
    exports.showResultMessage = showResultMessage;
});
define("@scom/oswap-nft-widget/global/common.ts", ["require", "exports", "@ijstech/eth-wallet"], function (require, exports, eth_wallet_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.registerSendTxEvents = void 0;
    const registerSendTxEvents = (sendTxEventHandlers) => {
        const wallet = eth_wallet_2.Wallet.getClientInstance();
        wallet.registerSendTxEvents({
            transactionHash: (error, receipt) => {
                if (sendTxEventHandlers.transactionHash) {
                    sendTxEventHandlers.transactionHash(error, receipt);
                }
            },
            confirmation: (receipt) => {
                if (sendTxEventHandlers.confirmation) {
                    sendTxEventHandlers.confirmation(receipt);
                }
            },
        });
    };
    exports.registerSendTxEvents = registerSendTxEvents;
});
define("@scom/oswap-nft-widget/global/index.ts", ["require", "exports", "@scom/oswap-nft-widget/global/helper.ts", "@scom/oswap-nft-widget/global/common.ts"], function (require, exports, helper_1, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.registerSendTxEvents = exports.showResultMessage = exports.SITE_ENV = exports.DefaultDateFormat = exports.DefaultDateTimeFormat = exports.formatNumberWithSeparators = exports.formatNumber = void 0;
    ;
    Object.defineProperty(exports, "formatNumber", { enumerable: true, get: function () { return helper_1.formatNumber; } });
    Object.defineProperty(exports, "formatNumberWithSeparators", { enumerable: true, get: function () { return helper_1.formatNumberWithSeparators; } });
    Object.defineProperty(exports, "DefaultDateTimeFormat", { enumerable: true, get: function () { return helper_1.DefaultDateTimeFormat; } });
    Object.defineProperty(exports, "DefaultDateFormat", { enumerable: true, get: function () { return helper_1.DefaultDateFormat; } });
    Object.defineProperty(exports, "SITE_ENV", { enumerable: true, get: function () { return helper_1.SITE_ENV; } });
    Object.defineProperty(exports, "showResultMessage", { enumerable: true, get: function () { return helper_1.showResultMessage; } });
    Object.defineProperty(exports, "registerSendTxEvents", { enumerable: true, get: function () { return common_1.registerSendTxEvents; } });
});
define("@scom/oswap-nft-widget/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/oswap-nft-widget/data.json.ts'/> 
    const InfuraId = "adc596bf88b648e2a8902bc9093930c5";
    exports.default = {
        "infuraId": InfuraId,
        "defaultBuilderData": {
            "defaultChainId": 97,
            "networks": [
                {
                    "chainId": 56
                },
                {
                    "chainId": 97
                }
            ],
            "wallets": [
                {
                    "name": "metamask"
                }
            ],
            "showHeader": true,
            "showFooter": true
        },
        "supportedNetworks": [
            {
                "chainId": 56,
                "isMainChain": true
            },
            {
                "chainId": 97,
                "isMainChain": true,
                "isTestnet": true
            }
        ]
    };
});
define("@scom/oswap-nft-widget/store/utils.ts", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-network-list", "@scom/oswap-nft-widget/store/data/core.ts", "@scom/scom-token-list"], function (require, exports, components_1, eth_wallet_3, scom_network_list_1, core_2, scom_token_list_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mapRecordNumberAwait = exports.mapRecordNumber = exports.mapRecordAwait = exports.mapRecord = exports.forEachRecordIndex = exports.mapRecordIndex = exports.mapIndexNumber = exports.forEachNumberIndex = exports.forEachNumberIndexAwait = exports.getChainNativeToken = exports.isClientWalletConnected = exports.getWalletProvider = exports.State = exports.getNetworksByType = exports.getNetworkType = exports.NetworkType = exports.WalletPlugin = void 0;
    var WalletPlugin;
    (function (WalletPlugin) {
        WalletPlugin["MetaMask"] = "metamask";
        WalletPlugin["Coin98"] = "coin98";
        WalletPlugin["TrustWallet"] = "trustwallet";
        WalletPlugin["BinanceChainWallet"] = "binancechainwallet";
        WalletPlugin["ONTOWallet"] = "onto";
        WalletPlugin["WalletConnect"] = "walletconnect";
        WalletPlugin["BitKeepWallet"] = "bitkeepwallet";
        WalletPlugin["FrontierWallet"] = "frontierwallet";
    })(WalletPlugin = exports.WalletPlugin || (exports.WalletPlugin = {}));
    var NetworkType;
    (function (NetworkType) {
        NetworkType[NetworkType["Mainnet"] = 0] = "Mainnet";
        NetworkType[NetworkType["Testnet"] = 1] = "Testnet";
        NetworkType[NetworkType["NotSupported"] = 2] = "NotSupported";
    })(NetworkType = exports.NetworkType || (exports.NetworkType = {}));
    function getNetworkType(chainId) {
        if (core_2.Mainnets.some(network => network === chainId)) {
            return NetworkType.Mainnet;
        }
        if (core_2.Testnets.some(network => network === chainId)) {
            return NetworkType.Testnet;
        }
        return NetworkType.NotSupported;
    }
    exports.getNetworkType = getNetworkType;
    function getNetworksByType(chainId) {
        switch (getNetworkType(chainId)) {
            case NetworkType.Mainnet:
                return core_2.Mainnets;
            case NetworkType.Testnet:
                return core_2.Testnets;
        }
        return [];
    }
    exports.getNetworksByType = getNetworksByType;
    class State {
        constructor(options) {
            this.defaultChainId = 0;
            this.proxyAddresses = {};
            this.infuraId = "";
            this.rpcWalletId = "";
            this.networkMap = {};
            this.networkConfig = [];
            this.getNetworkInfo = (chainId) => {
                return this.networkMap[chainId];
            };
            this.viewOnExplorerByAddress = (chainId, address) => {
                let network = this.getNetworkInfo(chainId);
                if (network && network.explorerAddressUrl) {
                    let url = `${network.explorerAddressUrl}${address}`;
                    window.open(url);
                }
            };
            this.setNetworkConfig = (networks) => {
                this.networkConfig = networks;
            };
            this.getNetworkConfig = () => {
                return this.networkConfig;
            };
            this.initData(options);
        }
        initRpcWallet(defaultChainId) {
            this.defaultChainId = defaultChainId;
            if (this.rpcWalletId) {
                return this.rpcWalletId;
            }
            const clientWallet = eth_wallet_3.Wallet.getClientInstance();
            const networkList = Object.values(components_1.application.store?.networkMap || []);
            const instanceId = clientWallet.initRpcWallet({
                networks: networkList,
                defaultChainId,
                infuraId: components_1.application.store?.infuraId,
                multicalls: components_1.application.store?.multicalls
            });
            this.rpcWalletId = instanceId;
            if (clientWallet.address) {
                const rpcWallet = eth_wallet_3.Wallet.getRpcWalletInstance(instanceId);
                rpcWallet.address = clientWallet.address;
            }
            const defaultNetworkList = (0, scom_network_list_1.default)();
            const defaultNetworkMap = defaultNetworkList.reduce((acc, cur) => {
                acc[cur.chainId] = cur;
                return acc;
            }, {});
            // const supportedNetworks = ConfigData.supportedNetworks || [];
            for (let network of networkList) {
                const networkInfo = defaultNetworkMap[network.chainId];
                // const supportedNetwork = supportedNetworks.find(v => v.chainId == network.chainId);
                // if (!networkInfo || !supportedNetwork) continue;
                if (!networkInfo)
                    continue;
                if (this.infuraId && network.rpcUrls && network.rpcUrls.length > 0) {
                    for (let i = 0; i < network.rpcUrls.length; i++) {
                        network.rpcUrls[i] = network.rpcUrls[i].replace(/{InfuraId}/g, this.infuraId);
                    }
                }
                this.networkMap[network.chainId] = {
                    ...networkInfo,
                    ...network
                };
            }
            return instanceId;
        }
        getRpcWallet() {
            return this.rpcWalletId ? eth_wallet_3.Wallet.getRpcWalletInstance(this.rpcWalletId) : null;
        }
        isRpcWalletConnected() {
            const wallet = this.getRpcWallet();
            return wallet?.isConnected;
        }
        getProxyAddress(chainId) {
            const _chainId = chainId || eth_wallet_3.Wallet.getInstance().chainId;
            const proxyAddresses = this.proxyAddresses;
            if (proxyAddresses) {
                return proxyAddresses[_chainId];
            }
            return null;
        }
        getChainId() {
            const rpcWallet = this.getRpcWallet();
            return rpcWallet?.chainId;
        }
        initData(options) {
            if (options.infuraId) {
                this.infuraId = options.infuraId;
            }
            if (options.proxyAddresses) {
                this.proxyAddresses = options.proxyAddresses;
            }
        }
        async setApprovalModelAction(options, spenderAddress) {
            const approvalOptions = {
                ...options,
                spenderAddress
            };
            let wallet = this.getRpcWallet();
            this.approvalModel = new eth_wallet_3.ERC20ApprovalModel(wallet, approvalOptions);
            let approvalModelAction = this.approvalModel.getAction();
            return approvalModelAction;
        }
    }
    exports.State = State;
    // wallet
    function getWalletProvider() {
        return localStorage.getItem('walletProvider') || '';
    }
    exports.getWalletProvider = getWalletProvider;
    function isClientWalletConnected() {
        const wallet = eth_wallet_3.Wallet.getClientInstance();
        return wallet.isConnected;
    }
    exports.isClientWalletConnected = isClientWalletConnected;
    const getChainNativeToken = (chainId) => {
        return scom_token_list_1.ChainNativeTokenByChainId[chainId];
    };
    exports.getChainNativeToken = getChainNativeToken;
    //custom loop
    async function forEachNumberIndexAwait(list, callbackFn) {
        for (const chainId in list) {
            if (Object.prototype.hasOwnProperty.call(list, chainId)
                && new eth_wallet_3.BigNumber(chainId).isInteger())
                await callbackFn(list[chainId], Number(chainId));
        }
    }
    exports.forEachNumberIndexAwait = forEachNumberIndexAwait;
    function forEachNumberIndex(list, callbackFn) {
        for (const chainId in list) {
            if (Object.prototype.hasOwnProperty.call(list, chainId)
                && new eth_wallet_3.BigNumber(chainId).isInteger())
                callbackFn(list[chainId], Number(chainId));
        }
    }
    exports.forEachNumberIndex = forEachNumberIndex;
    function mapIndexNumber(list, callbackFn) {
        let out = [];
        for (const chainId in list) {
            if (Object.prototype.hasOwnProperty.call(list, chainId)
                && new eth_wallet_3.BigNumber(chainId).isInteger())
                out.push(callbackFn(list[chainId], Number(chainId)));
        }
        return out;
    }
    exports.mapIndexNumber = mapIndexNumber;
    function mapRecordIndex(list, callbackFn) {
        let out = [];
        for (const index in list) {
            if (Object.prototype.hasOwnProperty.call(list, index))
                out.push(callbackFn(list[index], index, list));
        }
        return out;
    }
    exports.mapRecordIndex = mapRecordIndex;
    function forEachRecordIndex(list, callbackFn) {
        for (const index in list) {
            if (Object.prototype.hasOwnProperty.call(list, index))
                callbackFn(list[index], index, list);
        }
    }
    exports.forEachRecordIndex = forEachRecordIndex;
    function mapRecord(list, callbackFn) {
        let out = {};
        for (const index in list) {
            if (Object.prototype.hasOwnProperty.call(list, index))
                out[index] = callbackFn(list[index], index, list);
        }
        return out;
    }
    exports.mapRecord = mapRecord;
    async function mapRecordAwait(list, callbackFn) {
        let out = {};
        for (const index in list) {
            if (Object.prototype.hasOwnProperty.call(list, index))
                out[index] = await callbackFn(list[index], index, list);
        }
        return out;
    }
    exports.mapRecordAwait = mapRecordAwait;
    function mapRecordNumber(list, callbackFn) {
        let out = {};
        for (const key in list) {
            if (Object.prototype.hasOwnProperty.call(list, key) && !isNaN(+key)) {
                out[+key] = callbackFn(list[key], +key, list);
            }
        }
        return out;
    }
    exports.mapRecordNumber = mapRecordNumber;
    async function mapRecordNumberAwait(list, callbackFn) {
        let out = {};
        for (const key in list) {
            if (Object.prototype.hasOwnProperty.call(list, key) && !isNaN(+key)) {
                out[+key] = await callbackFn(list[key], +key, list);
            }
        }
        return out;
    }
    exports.mapRecordNumberAwait = mapRecordNumberAwait;
});
define("@scom/oswap-nft-widget/store/index.ts", ["require", "exports", "@scom/oswap-nft-widget/store/data/index.ts", "@scom/oswap-nft-widget/store/utils.ts"], function (require, exports, index_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/oswap-nft-widget/store/index.ts'/> 
    __exportStar(index_1, exports);
    __exportStar(utils_1, exports);
});
define("@scom/oswap-nft-widget/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let moduleDir = components_2.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    exports.default = {
        fullPath
    };
});
define("@scom/oswap-nft-widget/nft-utils/card.css.ts", ["require", "exports", "@ijstech/components", "@scom/oswap-nft-widget/assets.ts"], function (require, exports, components_3, assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cardStyle = void 0;
    exports.cardStyle = components_3.Styles.style({
        $nest: {
            '.display-none': {
                display: 'none'
            },
            '.invisible': {
                opacity: '0 !important'
            },
            '.text-yellow *': {
                color: '#f7d063',
            },
            'i-icon': {
                display: 'inline-block',
            },
            '.btn-stake': {
                marginTop: '1.5rem',
                width: '100%',
                height: '50px',
                border: 'none',
                padding: '0.375rem 0.5rem',
            },
            '.card-widget': {
                position: 'relative',
                flex: '1 1 0%',
                borderRadius: '15px',
                background: '#252a48',
                color: '#fff',
            },
            '.bg-img': {
                width: '100%',
                height: '100%',
                padding: '2rem',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundImage: `url(${assets_1.default.fullPath('img/nft/TrollBorder.png')})`
            },
            '.bg-img-collection': {
                width: '100%',
                height: '100%',
                padding: '1rem',
            },
            '.available-box': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '0.5rem 0.75rem',
                marginBottom: '1rem',
                $nest: {
                    '.label': {
                        marginRight: '0.5rem',
                        $nest: {
                            '*': {
                                color: '#f15e61',
                                fontSize: '1rem',
                            },
                        },
                    },
                    '.box': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '25px',
                        height: '35px',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        $nest: {
                            '&.box-left': {
                                marginRight: '0.5rem',
                                backgroundImage: `url(${assets_1.default.fullPath('img/nft/LeftBox.svg')})`
                            },
                            '&.box-right': {
                                backgroundImage: `url(${assets_1.default.fullPath('img/nft/RightBox.svg')})`
                            },
                        },
                    },
                },
            },
            '.os-slider': {
                position: 'relative',
                margin: '25px auto',
                width: '230px',
                height: '300px',
                $nest: {
                    '.wrapper-slider': {
                        $nest: {
                            '.slider-arrow:first-child': {
                                left: '-30px'
                            },
                            '.slider-arrow:last-child': {
                                right: '-30px'
                            }
                        }
                    },
                    '.slider-arrow': {
                        position: 'absolute'
                    }
                }
            },
            '.troll-img': {
                position: 'relative',
                margin: '25px auto',
                width: '220px',
                height: '300px',
                $nest: {
                    'i-image': {
                        position: 'absolute',
                        $nest: {
                            img: {
                                width: '100%',
                            },
                        },
                    },
                    '.coffin': {
                        top: '-50px',
                        left: '-50px',
                    },
                    '.death': {
                        filter: 'grayscale(100%)',
                        $nest: {
                            '&:hover': {
                                filter: 'inherit',
                            }
                        },
                    },
                    'i-label': {
                        position: 'absolute',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        top: '81.5%',
                        padding: '0 25%',
                        fontWeight: 700,
                        letterSpacing: 0,
                        color: '#6f1018',
                        textAlign: 'center',
                        width: '100%',
                        height: '40px',
                        textTransform: 'uppercase',
                    },
                    'i-label *': {
                        color: '#6f1018',
                    },
                    '.background img': {
                        padding: '20px 12px 0',
                    },
                    '.frame': {
                        height: '100%',
                        left: '-2px',
                    },
                },
            },
            '.section': {
                padding: '0 0.75rem'
            },
            '.row-item': {
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '0.35rem 0',
                $nest: {
                    '.title-icon': {
                        position: 'relative',
                    },
                    'i-label': {
                        $nest: {
                            '*': {
                                fontSize: '.875rem',
                            },
                        },
                    },
                    '.title-icon i-icon': {
                        position: 'absolute',
                        top: '50%',
                        right: '-20px',
                        transform: 'translateY(-50%)',
                        display: 'inline-block',
                        width: '14px',
                        height: '14px',
                    },
                    '.value': {
                        fontWeight: 700,
                    },
                },
            },
        },
    });
});
define("@scom/oswap-nft-widget/nft-utils/myCard.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.myCardStyle = void 0;
    exports.myCardStyle = components_4.Styles.style({
        $nest: {
            '.bg-flip': {
                backgroundColor: 'transparent',
                position: 'relative',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                transition: 'transform 0.6s',
                transformStyle: 'preserve-3d',
                overflow: 'visible',
            },
            '.invisible': {
                opacity: '0 !important'
            },
            '.text-yellow *': {
                color: '#f7d063',
            },
            'i-icon': {
                display: 'inline-block',
            },
            '.btn-burn': {
                width: '100%',
                height: '50px',
                border: 'none',
                padding: '0.375rem 0.5rem',
            },
            '.card-section': {
                borderRadius: '12px',
                backgroundColor: 'transparent',
                $nest: {
                    '&.active .bg-flip': {
                        transform: 'rotateY(180deg)',
                        $nest: {
                            '.mycard-img': {
                                pointerEvents: 'none'
                            },
                            '.section-my-card': {
                                zIndex: 1
                            }
                        }
                    }
                }
            },
            '.section-my-card': {
                padding: '0.5rem 0.75rem',
                backgroundColor: '#ffffff33',
                color: 'white',
                transform: 'rotateY(180deg)',
                position: 'absolute',
                borderRadius: '12px',
                top: 0,
                flexDirection: 'column',
                flexWrap: 'nowrap',
                display: 'flex',
                justifyContent: 'space-between'
            },
            '.mycard-img, .section-my-card': {
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                transform: 'rotateX(0deg)'
            },
            '.row-item': {
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '2px 0',
                $nest: {
                    '.title-icon': {
                        position: 'relative',
                    },
                    'i-label': {
                        $nest: {
                            '*': {
                                fontSize: '0.75rem',
                            },
                        },
                    },
                    '.title-icon i-icon': {
                        position: 'absolute',
                        top: '50%',
                        right: '-20px',
                        transform: 'translateY(-50%)',
                        display: 'inline-block',
                        width: '14px',
                        height: '14px',
                    },
                    '.value': {
                        fontWeight: 700,
                    },
                },
            },
        },
    });
});
define("@scom/oswap-nft-widget/nft-utils/myCard.tsx", ["require", "exports", "@ijstech/components", "@scom/oswap-nft-widget/nft-utils/myCard.css.ts"], function (require, exports, components_5, myCard_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NftMyCard = void 0;
    let NftMyCard = class NftMyCard extends components_5.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        get cardData() {
            return this._cardData;
        }
        set cardData(value) {
            this._cardData = value;
            this.renderCard();
        }
        async renderStar() {
            let icon = await components_5.Icon.create();
            icon.name = 'star';
            icon.fill = '#fff';
            icon.width = 20;
            icon.height = 20;
            this.rarity.appendChild(icon);
        }
        async renderCard() {
            const value = this.cardData;
            if (!this.stakeAmount.isConnected)
                await this.stakeAmount.ready();
            this.stakeAmount.caption = value.stakeAmountText;
            if (this.reward)
                await this.reward.ready();
            this.reward.caption = value.rewardsBoost;
            if (this.monthlyReward)
                await this.monthlyReward.ready();
            this.monthlyReward.caption = value.monthlyRewardText;
            if (this.flashSales)
                await this.flashSales.ready();
            this.flashSales.caption = value.flashSales;
            if (this.birthday)
                await this.birthday.ready();
            this.birthday.caption = value.birthday;
            if (this.rarity) {
                for (let i = 0; i < value.rarity; i++) {
                    this.renderStar();
                }
            }
            if (this.trollImage) {
                const img1 = new components_5.Image();
                img1.url = value.image;
                this.trollImage.appendChild(img1);
            }
        }
        handleFlipCard(sender, event) {
            const target = event.target;
            if (target.classList.contains('btn-burn') || target.closest('.btn-burn')) {
                this.onBurn();
            }
            else {
                sender.classList.toggle('active');
            }
        }
        async init() {
            this.classList.add(myCard_css_1.myCardStyle);
            super.init();
        }
        async render() {
            return (this.$render("i-panel", { class: "card-section", id: "panel1", onClick: (control, e) => this.handleFlipCard(control, e) },
                this.$render("i-panel", { class: "bg-flip" },
                    this.$render("i-panel", { id: "trollImage", class: "mycard-img" }),
                    this.$render("i-vstack", { verticalAlignment: 'space-between', class: "section-my-card" },
                        this.$render("i-panel", { margin: { top: 10 }, class: "row-item" },
                            this.$render("i-panel", { class: "title-icon" },
                                this.$render("i-label", { caption: "Birthday" })),
                            this.$render("i-label", { id: "birthday", caption: "50,000 OSWAP", class: "value" })),
                        this.$render("i-panel", { class: "row-item" },
                            this.$render("i-panel", { class: "title-icon" },
                                this.$render("i-label", { caption: "Rarity" })),
                            this.$render("i-panel", { id: "rarity" })),
                        this.$render("i-panel", { class: "row-item" },
                            this.$render("i-panel", { class: "title-icon" },
                                this.$render("i-label", { caption: "Value" })),
                            this.$render("i-label", { id: "stakeAmount", caption: "50,000 OSWAP", class: "value" })),
                        this.$render("i-panel", { class: "row-item" },
                            this.$render("i-panel", { class: "title-icon" },
                                this.$render("i-label", { caption: "Rewards Boost" }),
                                this.$render("i-icon", { name: "question-circle", fill: "#fff", tooltip: {
                                        content: 'The Reward Boost is only applicable to OSWAP staking rewards.',
                                        placement: 'right'
                                    } })),
                            this.$render("i-label", { id: "reward", caption: "5%", class: "value" })),
                        this.$render("i-panel", { class: "row-item" },
                            this.$render("i-panel", { class: "title-icon" },
                                this.$render("i-label", { caption: "Monthly Reward" }),
                                this.$render("i-icon", { name: "question-circle", fill: "#fff", tooltip: {
                                        content: "The Monthly Reward will be distributed at the end of each month.",
                                        placement: 'right'
                                    } })),
                            this.$render("i-label", { id: "monthlyReward", caption: "5%", class: "value" })),
                        this.$render("i-panel", { class: "row-item" },
                            this.$render("i-panel", { class: "title-icon" },
                                this.$render("i-label", { caption: "Flash Sales Inclusion" })),
                            this.$render("i-label", { id: "flashSales", caption: "Periodic", class: "value" })),
                        this.$render("i-panel", { class: "row-item" },
                            this.$render("i-panel", { class: "title-icon" },
                                this.$render("i-label", { caption: "Bridge Transaction Validate" })),
                            this.$render("i-label", { id: "bridge", caption: "-", class: "value" })),
                        this.$render("i-panel", { class: "row-item" },
                            this.$render("i-panel", { class: "title-icon" },
                                this.$render("i-label", { caption: "Bridge Fee Earn" })),
                            this.$render("i-label", { id: "fee", caption: "-", class: "value" })),
                        this.$render("i-button", { id: "btnHandleBurn", margin: { bottom: 10, top: 10 }, height: "auto", class: "btn-burn btn-os", caption: "Burn" })))));
        }
    };
    NftMyCard = __decorate([
        (0, components_5.customElements)('nft-my-card')
    ], NftMyCard);
    exports.NftMyCard = NftMyCard;
});
define("@scom/oswap-nft-widget/nft-utils/card.tsx", ["require", "exports", "@ijstech/components", "@scom/oswap-nft-widget/assets.ts", "@scom/oswap-nft-widget/store/index.ts", "@scom/oswap-nft-widget/nft-utils/card.css.ts", "@scom/oswap-nft-widget/nft-utils/myCard.tsx"], function (require, exports, components_6, assets_2, index_2, card_css_1, myCard_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NftCard = void 0;
    let NftCard = class NftCard extends components_6.Module {
        constructor(state, parent, options) {
            super(parent, options);
            this.state = state;
        }
        get state() {
            return this._state;
        }
        set state(value) {
            this._state = value;
        }
        get cardData() {
            return this._cardData;
        }
        set cardData(value) {
            this._cardData = value;
            this.renderCard();
        }
        capitalizeFirstLetter(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        async renderCard() {
            const value = this.cardData;
            this.trollImage.clearInnerHTML();
            // this.pnlSlots.clearInnerHTML();
            // this.pnlSlots.append(<i-label caption="Available Slots" class="label"></i-label>);
            // let slotText: string = new BigNumber(value.slot).lt(10) ? ('0' + value.slot) : value.slot;
            // let slotArr = slotText.split('');
            // for (let text of slotArr) {
            //   this.pnlSlots.append(<i-label caption={text} class="box box-left"></i-label>);
            // }
            const count = value.userNFTs?.length || 0;
            if (this.stakeAmountText)
                this.stakeAmountText.caption = value.stakeAmountText;
            if (this.reward)
                this.reward.caption = value.rewardsBoost;
            if (this.monthlyReward)
                this.monthlyReward.caption = value.monthlyReward;
            if (this.flashSales)
                this.flashSales.caption = value.flashSales;
            if (this.lbCount)
                this.lbCount.caption = `${count} ${count === 1 ? 'NFT' : 'NFTs'}`;
            if (count) {
                if (!this.carouselSlider) {
                    this.carouselSlider = await components_6.CarouselSlider.create({
                        width: '100%',
                        height: '100%',
                        overflow: 'inherit',
                        minHeight: 200,
                        slidesToShow: 1,
                        transitionSpeed: 600,
                        items: [],
                        type: 'arrow'
                    });
                }
                this.trollImage.classList.remove('troll-img');
                this.trollImage.classList.add('os-slider');
                this.trollImage.appendChild(this.carouselSlider);
                const items = [];
                for (const nft of value.userNFTs) {
                    const pnl = await components_6.Panel.create({ padding: { left: 5, right: 5 }, margin: { bottom: 0 } });
                    pnl.classList.add('nft-card-column');
                    const card = await myCard_1.NftMyCard.create();
                    pnl.appendChild(card);
                    card.onBurn = () => this.onBurn(nft);
                    card.cardData = nft;
                    items.push(pnl);
                }
                this.carouselSlider.items = items.map((item, idx) => {
                    return {
                        name: `NFT ${value.tier} ${idx}`,
                        controls: [item]
                    };
                });
            }
            else {
                this.trollImage.classList.add('troll-img');
                this.trollImage.classList.remove('os-slider');
                const img1 = new components_6.Image();
                const img2 = new components_6.Image();
                const img3 = new components_6.Image();
                const img4 = new components_6.Image();
                const img5 = new components_6.Image();
                const trollText = new components_6.Label();
                const trollType = this.capitalizeFirstLetter(value.tier);
                img1.url = assets_2.default.fullPath(`img/nft/${trollType}-Troll-01-Skin.svg`);
                img2.url = assets_2.default.fullPath(`img/nft/${trollType}-Troll-01-Horn.svg`);
                img3.url = assets_2.default.fullPath(`img/nft/${trollType}-Troll-01-Mouth.svg`);
                img4.url = assets_2.default.fullPath(`img/nft/${trollType}-Troll-01-Shirt.svg`);
                img5.url = assets_2.default.fullPath(`img/nft/${trollType}-Troll-01-Eyes.svg`);
                this.trollImage.appendChild(this.$render("i-image", { url: assets_2.default.fullPath('img/nft/Background.svg'), class: "background" }));
                this.trollImage.appendChild(this.$render("i-image", { url: assets_2.default.fullPath('img/nft/Frame.svg'), class: "frame" }));
                this.trollImage.appendChild(img1);
                this.trollImage.appendChild(img2);
                this.trollImage.appendChild(img3);
                this.trollImage.appendChild(img4);
                this.trollImage.appendChild(img5);
                this.trollImage.appendChild(trollText);
                trollText.caption = `${trollType} BABY TROLL`;
            }
            this.updateBtn();
        }
        updateBtn() {
            if (!(0, index_2.isClientWalletConnected)()) {
                this.btnHandleStake.caption = 'No Wallet';
                this.btnHandleStake.enabled = false;
            }
            else {
                const isSoldedOut = this.cardData?.slot <= 0;
                this.btnHandleStake.caption = isSoldedOut ? 'Sold Out' : 'Stake';
                this.btnHandleStake.enabled = !isSoldedOut;
            }
        }
        handleStake() {
            this.onStake();
        }
        openLink() {
            const chainId = this.state.getChainId();
            this.state.viewOnExplorerByAddress(chainId, this._cardData.address);
        }
        async init() {
            this.classList.add(card_css_1.cardStyle);
            super.init();
        }
        render() {
            return (this.$render("i-panel", { class: "card-widget" },
                this.$render("i-panel", { class: "bg-img" },
                    this.$render("i-panel", { id: "trollImage" }),
                    this.$render("i-panel", { class: "section" },
                        this.$render("i-panel", { class: "row-item" },
                            this.$render("i-panel", { class: "title-icon" },
                                this.$render("i-label", { caption: "Stake Amount" })),
                            this.$render("i-label", { id: "stakeAmountText", caption: "50,000 OSWAP", class: "value" })),
                        this.$render("i-panel", { class: "row-item" },
                            this.$render("i-panel", { class: "title-icon" },
                                this.$render("i-label", { caption: "Rewards Boost" }),
                                this.$render("i-icon", { name: "question-circle", fill: "#fff", tooltip: {
                                        content: 'The Reward Boost is only applicable to OSWAP staking rewards.',
                                        placement: 'right'
                                    } })),
                            this.$render("i-label", { id: "reward", caption: "5%", class: "value" })),
                        this.$render("i-panel", { class: "row-item" },
                            this.$render("i-panel", { class: "title-icon" },
                                this.$render("i-label", { caption: "Monthly Reward" }),
                                this.$render("i-icon", { name: "question-circle", fill: "#fff", tooltip: { content: 'The Monthly Reward will be distributed at the end of each month.', placement: 'right' } })),
                            this.$render("i-label", { id: "monthlyReward", caption: "5%", class: "value" })),
                        this.$render("i-panel", { class: "row-item" },
                            this.$render("i-panel", { class: "title-icon" },
                                this.$render("i-label", { caption: "Flash Sales Inclusion" })),
                            this.$render("i-label", { id: "flashSales", caption: "Periodic", class: "value" })),
                        this.$render("i-panel", { class: "row-item" },
                            this.$render("i-panel", { class: "title-icon" },
                                this.$render("i-label", { caption: "Owned" })),
                            this.$render("i-label", { id: "lbCount", caption: "0", class: "value" })),
                        this.$render("i-button", { id: "btnHandleStake", height: "auto", class: "btn-stake btn-os", caption: "Stake", onClick: this.handleStake }),
                        this.$render("i-hstack", { horizontalAlignment: "start", verticalAlignment: "center", margin: { top: '0.25rem', bottom: '0.25rem' } },
                            this.$render("i-label", { caption: "View contract", onClick: this.openLink, margin: { right: '0.5rem' }, class: "text-yellow pointer" }),
                            this.$render("i-icon", { name: "external-link-alt", onClick: this.openLink, fill: "#f7d063", width: 15, height: 15, class: "text-yellow pointer" }))))));
        }
    };
    NftCard = __decorate([
        (0, components_6.customElements)('nft-card')
    ], NftCard);
    exports.NftCard = NftCard;
});
define("@scom/oswap-nft-widget/nft-utils/nftAPI.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/oswap-troll-nft-contract", "@scom/oswap-nft-widget/store/index.ts", "@scom/scom-commission-proxy-contract"], function (require, exports, eth_wallet_4, oswap_troll_nft_contract_1, index_3, scom_commission_proxy_contract_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getNFTObject = exports.burnNFT = exports.mintNFT = exports.fetchAllNftInfo = exports.getCommissionRate = exports.nftInfoMap = void 0;
    function convToken(t) {
        if (!t.address)
            console.log(`no address for ${t.name}`);
        return {
            address: t.address || "",
            decimals: t.decimals,
            name: t.name,
            symbol: t.symbol,
        };
    }
    function initNftInfo() {
        let out;
        out = (0, index_3.mapRecordNumber)(index_3.nftInfoStoreMap, nfts => {
            return (0, index_3.mapRecord)(nfts, (nft) => {
                return {
                    ...nft,
                    minimumStake: new eth_wallet_4.BigNumber("0"),
                    cap: new eth_wallet_4.BigNumber("0"),
                    totalSupply: new eth_wallet_4.BigNumber("0"),
                    protocolFee: new eth_wallet_4.BigNumber("0"),
                    userNfts: [],
                };
            });
        });
        return out;
    }
    let nftInfoMap = initNftInfo();
    exports.nftInfoMap = nftInfoMap;
    const getCommissionRate = async (state, campaignId) => {
        const rpcWallet = state.getRpcWallet();
        const proxyAddress = state.getProxyAddress();
        await rpcWallet.init();
        let commissionRate = await scom_commission_proxy_contract_1.ContractUtils.getCommissionRate(rpcWallet, proxyAddress, campaignId);
        return eth_wallet_4.Utils.fromDecimals(commissionRate, 6).toFixed();
    };
    exports.getCommissionRate = getCommissionRate;
    const getNFTObject = async (trollAPI, nft, tokenId, owner) => {
        try {
            const wallet = eth_wallet_4.Wallet.getClientInstance();
            let param = '';
            if (tokenId) {
                param = '/' + tokenId;
            }
            else if (owner) {
                param = '/?owner=' + wallet.toChecksumAddress(owner); //FIXME: API only recognizes checksum address
                // param = '/?owner=' + owner
            }
            const response = await fetch(`${trollAPI}/${nft}${param}`);
            const json = await response.json();
            return json;
        }
        catch {
            return {};
        }
    };
    exports.getNFTObject = getNFTObject;
    const getAttributes2 = async (trollNFT, tokenID, base, digits, probability) => {
        let attributes = await trollNFT.getAttributes2({
            tokenId: tokenID,
            base,
            digits
        });
        if (JSON.stringify(attributes) == JSON.stringify(new Array(digits.length).fill("0"))) { //NFT is minted but attr is not created yet by ChainLink Random Contract
            return null;
        }
        let distributedAttributes = [];
        for (let i = 0; i < attributes.length; i++) {
            distributedAttributes[i] = distributeByProbability(attributes[i], base, digits[i], probability[i]);
        }
        return distributedAttributes;
    };
    const distributeByProbability = (index, base, power, probability) => {
        let output = '0';
        let max = new eth_wallet_4.BigNumber(base).pow(power);
        let indexRatio = index.div(max);
        let counter = 0;
        for (let i = 0; i < probability.length; i++) {
            counter = counter + probability[i];
            if (new eth_wallet_4.BigNumber(indexRatio).lt(counter)) {
                output = new eth_wallet_4.BigNumber(i).plus(1).toFixed();
                break;
            }
        }
        return output;
    };
    async function fetchAllNftInfo(state) {
        const chainId = state.getChainId();
        if (!(chainId in index_3.SupportedNetworkId))
            return false;
        let wallet = state.getRpcWallet();
        nftInfoMap[chainId] = await (0, index_3.mapRecordAwait)(nftInfoMap[chainId], info => fetchNftInfo(state, wallet, info));
        return nftInfoMap[chainId];
    }
    exports.fetchAllNftInfo = fetchAllNftInfo;
    async function fetchNftInfo(state, wallet, nftInfo) {
        if (wallet.chainId !== nftInfo.chainId)
            throw new Error("chain id do not match");
        let trollNFT = new oswap_troll_nft_contract_1.Contracts.TrollNFT(wallet, nftInfo.address);
        let calls = [
            {
                contract: trollNFT,
                methodName: 'minimumStake',
                params: [],
                to: nftInfo.address
            },
            {
                contract: trollNFT,
                methodName: 'cap',
                params: [],
                to: nftInfo.address
            },
            {
                contract: trollNFT,
                methodName: 'totalSupply',
                params: [],
                to: nftInfo.address
            },
            {
                contract: trollNFT,
                methodName: 'protocolFee',
                params: [],
                to: nftInfo.address
            },
        ];
        try {
            let [minimumStake, cap, totalSupply, protocolFee] = await wallet.doMulticall(calls) || [];
            let userNfts = await fetchUserNft(state, nftInfo) || [];
            let out = {
                ...nftInfo,
                minimumStake: new eth_wallet_4.BigNumber(minimumStake).shiftedBy(-nftInfo.token.decimals),
                cap: new eth_wallet_4.BigNumber(cap),
                totalSupply: new eth_wallet_4.BigNumber(totalSupply),
                protocolFee: new eth_wallet_4.BigNumber(protocolFee).shiftedBy(-nftInfo.token.decimals),
                userNfts,
            };
            nftInfoMap[nftInfo.chainId][out.name] = out;
            return out;
        }
        catch (error) {
            console.log("fetchNftInfo", nftInfo.chainId, nftInfo.address, error);
        }
        return {
            ...nftInfo,
            minimumStake: new eth_wallet_4.BigNumber(0),
            cap: new eth_wallet_4.BigNumber(0),
            totalSupply: new eth_wallet_4.BigNumber(0),
            protocolFee: new eth_wallet_4.BigNumber(0),
            userNfts: [],
        };
    }
    async function fetchUserNft(state, nftInfo) {
        if (!(0, index_3.isClientWalletConnected)())
            return [];
        let wallet = state.getRpcWallet();
        let chainId = wallet.chainId;
        //console.log("fetchUserNft", chainId, wallet.address, nftInfo.name);
        let userNfts = [];
        const trollAPI = index_3.trollAPIUrl[chainId];
        let nftContract = new oswap_troll_nft_contract_1.Contracts.TrollNFT(wallet, nftInfo.address);
        let tier = nftInfo.name;
        let token = nftInfo.token;
        const fetchInfoByDapp = async (info, contractAddress, token, i) => {
            let trollNFT = new oswap_troll_nft_contract_1.Contracts.TrollNFT(wallet, contractAddress);
            let tokenId = (await trollNFT.tokenOfOwnerByIndex({
                owner: wallet.address,
                index: i
            })).toNumber();
            let stakingBalance = (await trollNFT.stakingBalance(tokenId)).toFixed();
            let birthday;
            birthday = (await trollNFT.creationTime(tokenId)).toNumber();
            let attributes = await getAttributes2(trollNFT, tokenId, info.attributes.base, info.attributes.digits, info.attributes.probability);
            let rarity = 0;
            if (!rarity && attributes) {
                rarity = new eth_wallet_4.BigNumber(attributes[info.attributes.rarityIndex]).toNumber();
            }
            let obj = await getNFTObject(trollAPI, `${info.name}-troll`, tokenId);
            userNfts.push({
                tokenId,
                stakeBalance: eth_wallet_4.Utils.fromDecimals(stakingBalance, token.decimals).toFixed(),
                attributes,
                rarity,
                birthday,
                image: obj.image ? obj.image : undefined,
            });
        };
        const fetchInfoByAPI = async (info, obj, token) => {
            let rarity = 0;
            if (obj.attributes) {
                rarity = new eth_wallet_4.BigNumber(obj.attributes[info.attributes.rarityIndex].value).toNumber();
            }
            else if (obj.attritubes) { //handle the spelling problem on api temporarily
                rarity = new eth_wallet_4.BigNumber(obj.attritubes[info.attributes.rarityIndex].value).toNumber();
            }
            let stakeBalance = obj.staking_balance ? eth_wallet_4.Utils.fromDecimals(obj.staking_balance, token.decimals).toFixed() : '0';
            userNfts.push({
                tokenId: obj.id,
                stakeBalance,
                attributes: obj.attritubes,
                rarity,
                birthday: obj.creation_time,
                image: obj.image,
            });
        };
        let promises = [];
        let AllUserNftByApi = await getNFTObject(trollAPI, `${tier}-troll`, undefined, wallet.address);
        let userOwnNftCount = (await nftContract.balanceOf(wallet.address)).toNumber();
        if (!AllUserNftByApi.length || AllUserNftByApi.length != userOwnNftCount) { //API Fail: The count is difference right after mint/burn
            if (userOwnNftCount > 0) {
                for (let i = 0; i < userOwnNftCount; i++) {
                    promises.push(fetchInfoByDapp(nftInfo, nftInfo.address, token, i));
                }
            }
        }
        else { //API success
            if (AllUserNftByApi.length > 0) {
                for (let i = 0; i < AllUserNftByApi.length; i++) {
                    promises.push(fetchInfoByAPI(nftInfo, AllUserNftByApi[i], token));
                }
            }
        }
        await Promise.all(promises);
        return userNfts;
    }
    const mintNFT = async (contractAddress, token, amount) => {
        let wallet = eth_wallet_4.Wallet.getClientInstance();
        let trollNFT = new oswap_troll_nft_contract_1.Contracts.TrollNFT(wallet, contractAddress);
        let tokenAmount = eth_wallet_4.Utils.toDecimals(amount, token.decimals);
        let receipt = await trollNFT.stake(tokenAmount);
        return receipt;
    };
    exports.mintNFT = mintNFT;
    const burnNFT = async (contractAddress, tokenID) => {
        let wallet = eth_wallet_4.Wallet.getClientInstance();
        let trollNFT = new oswap_troll_nft_contract_1.Contracts.TrollNFT(wallet, contractAddress);
        let receipt = await trollNFT.unstake(tokenID);
        return receipt;
    };
    exports.burnNFT = burnNFT;
});
define("@scom/oswap-nft-widget/nft-utils/index.ts", ["require", "exports", "@scom/oswap-nft-widget/nft-utils/card.tsx", "@scom/oswap-nft-widget/nft-utils/myCard.tsx", "@scom/oswap-nft-widget/nft-utils/nftAPI.ts"], function (require, exports, card_1, myCard_2, nftAPI_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getNFTObject = exports.burnNFT = exports.mintNFT = exports.fetchAllNftInfo = exports.getCommissionRate = exports.NftMyCard = exports.NftCard = void 0;
    Object.defineProperty(exports, "NftCard", { enumerable: true, get: function () { return card_1.NftCard; } });
    Object.defineProperty(exports, "NftMyCard", { enumerable: true, get: function () { return myCard_2.NftMyCard; } });
    Object.defineProperty(exports, "getCommissionRate", { enumerable: true, get: function () { return nftAPI_1.getCommissionRate; } });
    Object.defineProperty(exports, "fetchAllNftInfo", { enumerable: true, get: function () { return nftAPI_1.fetchAllNftInfo; } });
    Object.defineProperty(exports, "mintNFT", { enumerable: true, get: function () { return nftAPI_1.mintNFT; } });
    Object.defineProperty(exports, "burnNFT", { enumerable: true, get: function () { return nftAPI_1.burnNFT; } });
    Object.defineProperty(exports, "getNFTObject", { enumerable: true, get: function () { return nftAPI_1.getNFTObject; } });
});
define("@scom/oswap-nft-widget/formSchema.ts", ["require", "exports", "@scom/scom-network-picker", "@scom/oswap-nft-widget/data.json.ts"], function (require, exports, scom_network_picker_1, data_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getProjectOwnerSchema = exports.getBuilderSchema = void 0;
    const chainIds = data_json_1.default.supportedNetworks || [];
    const networks = chainIds.map(v => { return { chainId: v.chainId }; });
    const theme = {
        type: 'object',
        properties: {
            backgroundColor: {
                type: 'string',
                format: 'color'
            },
            fontColor: {
                type: 'string',
                format: 'color'
            },
            inputBackgroundColor: {
                type: 'string',
                format: 'color'
            },
            inputFontColor: {
                type: 'string',
                format: 'color'
            },
            maxButtonBackground: {
                type: 'string',
                format: 'color'
            },
            maxButtonHoverBackground: {
                type: 'string',
                format: 'color'
            },
            primaryButtonBackground: {
                type: 'string',
                format: 'color'
            },
            primaryButtonHoverBackground: {
                type: 'string',
                format: 'color'
            },
            primaryButtonDisabledBackground: {
                type: 'string',
                format: 'color'
            }
        }
    };
    const themeUISchema = {
        type: 'Category',
        label: 'Theme',
        elements: [
            {
                type: 'VerticalLayout',
                elements: [
                    {
                        type: 'Group',
                        label: 'Dark',
                        elements: [
                            {
                                type: 'HorizontalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/dark/properties/backgroundColor'
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/dark/properties/fontColor'
                                    }
                                ]
                            },
                            {
                                type: 'HorizontalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/dark/properties/inputBackgroundColor'
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/dark/properties/inputFontColor'
                                    }
                                ]
                            },
                            {
                                type: 'HorizontalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/dark/properties/maxButtonBackground'
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/dark/properties/maxButtonHoverBackground'
                                    }
                                ]
                            },
                            {
                                type: 'HorizontalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/dark/properties/primaryButtonBackground'
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/dark/properties/primaryButtonHoverBackground'
                                    }
                                ]
                            },
                            {
                                type: 'HorizontalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/dark/properties/primaryButtonDisabledBackground'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'Group',
                        label: 'Light',
                        elements: [
                            {
                                type: 'HorizontalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/light/properties/backgroundColor'
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/light/properties/fontColor'
                                    }
                                ]
                            },
                            {
                                type: 'HorizontalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/light/properties/inputBackgroundColor'
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/light/properties/inputFontColor'
                                    }
                                ]
                            },
                            {
                                type: 'HorizontalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/light/properties/maxButtonBackground'
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/light/properties/maxButtonHoverBackground'
                                    }
                                ]
                            },
                            {
                                type: 'HorizontalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/light/properties/primaryButtonBackground'
                                    },
                                    {
                                        type: 'Control',
                                        scope: '#/properties/light/properties/primaryButtonHoverBackground'
                                    }
                                ]
                            },
                            {
                                type: 'HorizontalLayout',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/light/properties/primaryButtonDisabledBackground'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
    function getBuilderSchema() {
        return {
            dataSchema: {
                type: 'object',
                properties: {
                    networks: {
                        type: 'array',
                        required: true,
                        items: {
                            type: 'object',
                            properties: {
                                chainId: {
                                    type: 'number',
                                    enum: chainIds,
                                    required: true
                                }
                            }
                        }
                    },
                    dark: theme,
                    light: theme
                }
            },
            uiSchema: {
                type: 'Categorization',
                elements: [
                    {
                        type: 'Category',
                        label: 'General',
                        elements: [
                            {
                                type: 'HorizontalLayout',
                                elements: [
                                    {
                                        type: 'Categorization',
                                        elements: [
                                            {
                                                type: 'Category',
                                                label: 'Networks',
                                                elements: [
                                                    {
                                                        type: 'Control',
                                                        scope: '#/properties/networks',
                                                        options: {
                                                            detail: {
                                                                type: 'VerticalLayout'
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    themeUISchema
                ]
            },
            customControls() {
                return {
                    '#/properties/networks/properties/chainId': {
                        render: () => {
                            const networkPicker = new scom_network_picker_1.default(undefined, {
                                type: 'combobox',
                                networks
                            });
                            return networkPicker;
                        },
                        getData: (control) => {
                            return control.selectedNetwork?.chainId;
                        },
                        setData: async (control, value) => {
                            await control.ready();
                            control.setNetworkByChainId(value);
                        }
                    }
                };
            }
        };
    }
    exports.getBuilderSchema = getBuilderSchema;
    function getProjectOwnerSchema() {
        return null;
    }
    exports.getProjectOwnerSchema = getProjectOwnerSchema;
});
define("@scom/oswap-nft-widget/index.css.ts", ["require", "exports", "@ijstech/components", "@scom/oswap-nft-widget/assets.ts"], function (require, exports, components_7, assets_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.listMediaStyles = exports.nftStyle_360 = exports.nftStyle_480 = exports.nftStyle_767 = exports.nftStyle_1100 = exports.nftDefaultStyle = exports.nftStyle = void 0;
    exports.nftStyle = components_7.Styles.style({
        minHeight: '600px',
        paddingTop: '1rem',
        $nest: {
            '*': {
                boxSizing: 'border-box',
            },
            '.widget': {
                position: 'relative',
                width: '100%',
            },
            '.i-loading--active': {
                marginTop: '2rem',
                $nest: {
                    '.tab-sheet--container': {
                        display: 'none !important',
                    },
                    '.i-loading-spinner': {
                        marginTop: '2rem',
                    },
                },
            },
            '.current-nft': {
                // position: 'absolute',
                // right: 'calc(1rem - 5px)',
                width: 'fit-content',
                margin: '0 auto 20px',
                display: 'block',
                borderRadius: '12px',
                background: '#252a48',
                border: '2px solid #f15e61',
                padding: '0.35rem 2rem',
                $nest: {
                    'i-label': {
                        $nest: {
                            '*': {
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: '#fff',
                                textTransform: 'uppercase',
                            },
                        },
                    },
                },
            },
            '.nft-card-column': {
                height: 'auto',
                padding: '0 15px',
                marginBottom: '2rem',
            },
            '.custom-card-column': {
                width: 'calc(33% - 30px)',
                minWidth: '300px',
            },
            '.new-card-column': {
                width: 'calc(33% - 30px)',
                minWidth: '320px',
                maxWidth: '400px',
            },
            '.nft-card-stake': {
                height: 'auto',
                padding: '0 15px',
                marginBottom: '2rem',
                width: '450px',
                maxWidth: '100%',
                $nest: {
                    '.bg-img': {
                        padding: '3rem'
                    }
                }
            },
            '.nft-burn-stake': {
                $nest: {
                    '.bg-img': {
                        padding: '3rem'
                    }
                }
            },
            '.card-widget': {
                position: 'relative',
                flex: '1 1 0%',
                borderRadius: '15px',
                background: '#252a48',
                color: '#fff',
                $nest: {
                    '.title-icon': {
                        position: 'relative',
                    },
                }
            },
            '.bg-img': {
                width: '100%',
                height: '100%',
                padding: '2rem',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundImage: `url(${assets_3.default.fullPath('img/nft/TrollBorder.png')})`
            },
            '.bg-img-collection': {
                width: '100%',
                height: '100%',
                padding: '1rem',
            },
            '.btn-stake': {
                marginTop: '1.5rem',
                width: '100%',
                height: '50px',
                background: 'transparent linear-gradient(90deg, #AF2175 0%, #D4626A 100%) 0% 0% no-repeat padding-box',
                border: 'none',
                padding: '0.375rem 0.5rem',
                marginBottom: '1rem'
            },
            '.text-yellow *': {
                color: '#f7d063',
            },
            'i-icon': {
                display: 'inline-block',
            },
            '.title-box': {
                width: '100%',
                textAlign: 'center',
                position: 'relative'
            },
            '.icon-back': {
                position: 'absolute',
                left: 0,
                top: '5px',
            },
            '.row-line': {
                marginBottom: '20px',
                $nest: {
                    'i-icon': {
                        marginLeft: '5px'
                    }
                }
            },
            '.stake-caption *': {
                fontSize: '1.4rem !important',
                fontWeight: 'bold',
                color: '#f7d063'
            },
            '.line-middle': {
                margin: '20px 0',
                borderTop: '1px solid #f15e61',
            },
            '.section-1': {
                border: '1px solid #fff',
                borderRadius: '12px',
                padding: '0.5rem 1rem',
                opacity: '0.75',
                marginBottom: '20px'
            },
            '.section-2': {
                padding: '5px',
                borderRadius: '12px',
                background: 'transparent linear-gradient(90deg, #D4626A 0%, #AF2175 100%) 0% 0% no-repeat padding-box',
            },
            '.caption-big': {
                fontSize: '1.2rem'
            },
            '.note-burn *': {
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#f7d063',
            },
        }
    });
    exports.nftDefaultStyle = components_7.Styles.style({
        $nest: {
            '.custom-card-column': {
                width: 'calc(25% - 30px)'
            }
        }
    });
    exports.nftStyle_1100 = components_7.Styles.style({
        $nest: {
            '.custom-card-column, .new-card-column': {
                width: 'calc(50% - 30px)'
            }
        }
    });
    exports.nftStyle_767 = components_7.Styles.style({
        $nest: {
            '.custom-card-column, .new-card-column': {
                margin: '0 auto 1.5rem'
            }
        }
    });
    exports.nftStyle_480 = components_7.Styles.style({
        $nest: {
            '.custom-card-column': {
                width: '100% !important',
                minWidth: 'auto',
                maxWidth: '300px'
            },
            '.new-card-column': {
                width: '100% !important',
                minWidth: 'auto',
                padding: 0
            }
        }
    });
    exports.nftStyle_360 = components_7.Styles.style({
        $nest: {
            '.os-slider': {
                $nest: {
                    '.wrapper-slider': {
                        $nest: {
                            '.slider-arrow': {
                                width: 20,
                                height: 20
                            },
                            '.slider-arrow:first-child': {
                                left: '-20px'
                            },
                            '.slider-arrow:last-child': {
                                right: '-20px'
                            }
                        }
                    }
                }
            }
        }
    });
    exports.listMediaStyles = {
        360: exports.nftStyle_360,
        480: exports.nftStyle_480,
        767: exports.nftStyle_767,
        1100: exports.nftStyle_1100
    };
});
define("@scom/oswap-nft-widget", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/oswap-nft-widget/store/index.ts", "@scom/oswap-nft-widget/global/index.ts", "@scom/oswap-nft-widget/assets.ts", "@scom/scom-commission-fee-setup", "@scom/scom-token-list", "@scom/oswap-nft-widget/nft-utils/index.ts", "@scom/oswap-nft-widget/formSchema.ts", "@scom/oswap-nft-widget/index.css.ts", "@scom/oswap-nft-widget/data.json.ts"], function (require, exports, components_8, eth_wallet_5, index_4, index_5, assets_4, scom_commission_fee_setup_1, scom_token_list_2, index_6, formSchema_1, index_css_1, data_json_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_8.Styles.Theme.ThemeVars;
    let OswapNftWidget = class OswapNftWidget extends components_8.Module {
        constructor(parent, options) {
            super(parent, options);
            this._data = {
                defaultChainId: 0,
                wallets: [],
                networks: []
            };
            this.tag = {};
            this.initWallet = async () => {
                try {
                    await eth_wallet_5.Wallet.getClientInstance().init();
                    const rpcWallet = this.state.getRpcWallet();
                    await rpcWallet.init();
                }
                catch (err) {
                    console.log(err);
                }
            };
            this.initializeWidgetConfig = async () => {
                setTimeout(async () => {
                    await this.initWallet();
                    this.chainId = this.state.getChainId();
                    await this.updateBalances();
                    this.renderData();
                });
            };
            this.onChainChange = async () => {
                this.chainId = this.state.getChainId();
                scom_token_list_2.tokenStore.updateTokenMapData(this.chainId);
                this.initializeWidgetConfig();
            };
            this.deferReadyCallback = true;
        }
        removeRpcWalletEvents() {
            const rpcWallet = this.state.getRpcWallet();
            if (rpcWallet)
                rpcWallet.unregisterAllWalletEvents();
        }
        onHide() {
            this.dappContainer.onHide();
            this.removeRpcWalletEvents();
        }
        get defaultChainId() {
            return this._data.defaultChainId;
        }
        set defaultChainId(value) {
            this._data.defaultChainId = value;
        }
        get wallets() {
            return this._data.wallets ?? [];
        }
        set wallets(value) {
            this._data.wallets = value;
        }
        get networks() {
            return this._data.networks ?? [];
        }
        set networks(value) {
            this._data.networks = value;
        }
        get showHeader() {
            return this._data.showHeader ?? true;
        }
        set showHeader(value) {
            this._data.showHeader = value;
        }
        set width(value) {
            this.resizeUI(value);
        }
        determineActionsByTarget(target, category) {
            if (target === 'builder') {
                return this.getBuilderActions(category);
            }
            return this.getProjectOwnerActions();
        }
        async loadCommissionFee() {
            if (this._data.campaignId && this.state.embedderCommissionFee === undefined) {
                const commissionRate = await (0, index_6.getCommissionRate)(this.state, this._data.campaignId);
                this.state.embedderCommissionFee = commissionRate;
            }
        }
        getBuilderActions(category) {
            const formSchema = (0, formSchema_1.getBuilderSchema)();
            const dataSchema = formSchema.dataSchema;
            const uiSchema = formSchema.uiSchema;
            const customControls = formSchema.customControls();
            let self = this;
            const actions = [
                {
                    name: 'Commissions',
                    icon: 'dollar-sign',
                    command: (builder, userInputData) => {
                        let _oldData = {
                            defaultChainId: 0,
                            wallets: [],
                            networks: []
                        };
                        return {
                            execute: async () => {
                                _oldData = { ...this._data };
                                if (userInputData.commissions)
                                    this._data.commissions = userInputData.commissions;
                                this.refreshUI();
                                if (builder?.setData)
                                    builder.setData(this._data);
                            },
                            undo: () => {
                                this._data = { ..._oldData };
                                this.refreshUI();
                                if (builder?.setData)
                                    builder.setData(this._data);
                            },
                            redo: () => { }
                        };
                    },
                    customUI: {
                        render: async (data, onConfirm) => {
                            const vstack = new components_8.VStack();
                            await self.loadCommissionFee();
                            const config = new scom_commission_fee_setup_1.default(null, {
                                commissions: self._data.commissions || [],
                                fee: self.state.embedderCommissionFee,
                                networks: self._data.networks
                            });
                            const hstack = new components_8.HStack(null, {
                                verticalAlignment: 'center',
                            });
                            const button = new components_8.Button(hstack, {
                                caption: 'Confirm',
                                width: '100%',
                                height: 40,
                                font: { color: Theme.colors.primary.contrastText }
                            });
                            vstack.append(config);
                            vstack.append(hstack);
                            button.onClick = async () => {
                                const commissions = config.commissions;
                                if (onConfirm)
                                    onConfirm(true, { commissions });
                            };
                            return vstack;
                        }
                    }
                }
            ];
            if (category !== 'offers') {
                actions.push({
                    name: 'Edit',
                    icon: 'edit',
                    command: (builder, userInputData) => {
                        let oldData = {
                            defaultChainId: 0,
                            wallets: [],
                            networks: []
                        };
                        let oldTag = {};
                        return {
                            execute: async () => {
                                oldData = JSON.parse(JSON.stringify(this._data));
                                const { networks, tokens, ...themeSettings } = userInputData;
                                const generalSettings = {
                                    networks,
                                    tokens
                                };
                                this._data.networks = generalSettings.networks;
                                this._data.defaultChainId = this._data.networks[0].chainId;
                                await this.resetRpcWallet();
                                this.refreshUI();
                                if (builder?.setData)
                                    builder.setData(this._data);
                                oldTag = JSON.parse(JSON.stringify(this.tag));
                                if (builder?.setTag)
                                    builder.setTag(themeSettings);
                                else
                                    this.setTag(themeSettings);
                                if (this.dappContainer)
                                    this.dappContainer.setTag(themeSettings);
                            },
                            undo: () => {
                                this._data = JSON.parse(JSON.stringify(oldData));
                                this.refreshUI();
                                if (builder?.setData)
                                    builder.setData(this._data);
                                this.tag = JSON.parse(JSON.stringify(oldTag));
                                if (builder?.setTag)
                                    builder.setTag(this.tag);
                                else
                                    this.setTag(this.tag);
                                if (this.dappContainer)
                                    this.dappContainer.setTag(this.tag);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: dataSchema,
                    userInputUISchema: uiSchema,
                    customControls: customControls
                });
            }
            return actions;
        }
        getProjectOwnerActions() {
            const formSchema = (0, formSchema_1.getProjectOwnerSchema)();
            if (!formSchema)
                return [];
            const propertiesDataSchema = formSchema.general.dataSchema;
            const propertiesUISchema = formSchema.general.uiSchema;
            const actions = [
                {
                    name: 'Settings',
                    userInputDataSchema: propertiesDataSchema,
                    userInputUISchema: propertiesUISchema
                }
            ];
            return actions;
        }
        getConfigurators() {
            let self = this;
            return [
                {
                    name: 'Project Owner Configurator',
                    target: 'Project Owners',
                    getActions: (category) => {
                        return this.determineActionsByTarget('projectOwner', category);
                    },
                    getData: this.getData.bind(this),
                    setData: async (value) => {
                        this.setData(value);
                    },
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Builder Configurator',
                    target: 'Builders',
                    getActions: (category) => {
                        return this.determineActionsByTarget('builder', category);
                    },
                    getData: this.getData.bind(this),
                    setData: async (value) => {
                        const defaultData = data_json_2.default.defaultBuilderData;
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
                        };
                    },
                    bindOnChanged: (element, callback) => {
                        element.onChanged = async (data) => {
                            let resultingData = {
                                ...self._data,
                                ...data
                            };
                            await this.setData(resultingData);
                            await callback(data);
                        };
                    },
                    getData: async () => {
                        await self.loadCommissionFee();
                        const fee = this.state.embedderCommissionFee;
                        return { ...this._data, fee };
                    },
                    setData: async (properties, linkParams) => {
                        let resultingData = {
                            ...properties
                        };
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
                    getActions: (category) => {
                        const actions = this.determineActionsByTarget('builder', 'category');
                        const editAction = actions.find(action => action.name === 'Edit');
                        return editAction ? [editAction] : [];
                    },
                    getData: this.getData.bind(this),
                    setData: this.setData.bind(this),
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                }
            ];
        }
        getData() {
            return this._data;
        }
        async resetRpcWallet() {
            this.removeRpcWalletEvents();
            await this.state.initRpcWallet(this.defaultChainId);
            const rpcWallet = this.state.getRpcWallet();
            const chainChangedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_5.Constants.RpcWalletEvent.ChainChanged, async (chainId) => {
                this.onChainChange();
            });
            const connectedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_5.Constants.RpcWalletEvent.Connected, async (connected) => {
                await this.initializeWidgetConfig();
            });
            const data = {
                defaultChainId: this.defaultChainId,
                wallets: this.wallets,
                networks: this.networks,
                showHeader: this.showHeader,
                rpcWalletId: rpcWallet.instanceId
            };
            if (this.dappContainer?.setData)
                this.dappContainer.setData(data);
        }
        async setData(value) {
            this._data = value;
            this.state.setNetworkConfig(value.networks);
            for (let network of this._data.networks) {
                scom_token_list_2.tokenStore.updateTokenMapData(network.chainId);
            }
            await this.resetRpcWallet();
            await this.refreshUI();
        }
        async getTag() {
            return this.tag;
        }
        updateTag(type, value) {
            this.tag[type] = this.tag[type] ?? {};
            for (let prop in value) {
                if (value.hasOwnProperty(prop))
                    this.tag[type][prop] = value[prop];
            }
        }
        async setTag(value) {
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
        updateStyle(name, value) {
            value ?
                this.style.setProperty(name, value) :
                this.style.removeProperty(name);
        }
        updateTheme() {
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
        async refreshUI() {
            await this.initializeWidgetConfig();
        }
        isEmptyData(value) {
            return !value || !value.networks || value.networks.length === 0;
        }
        async init() {
            super.init();
            this.state = new index_4.State(data_json_2.default);
            this.chainId = this.state.getChainId();
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                const campaignId = this.getAttribute('campaignId', true);
                const commissions = this.getAttribute('commissions', true, []);
                const defaultChainId = this.getAttribute('defaultChainId', true);
                const networks = this.getAttribute('networks', true);
                const wallets = this.getAttribute('wallets', true);
                const showHeader = this.getAttribute('showHeader', true);
                let data = {
                    campaignId,
                    commissions,
                    defaultChainId,
                    networks,
                    wallets,
                    showHeader
                };
                if (!this.isEmptyData(data)) {
                    await this.setData(data);
                }
            }
            ;
            window.addEventListener('resize', () => {
                setTimeout(() => {
                    this.resizeUI();
                }, 300);
            });
            this.executeReadyCallback();
        }
        checkWidth(width, value) {
            return (this.offsetWidth !== 0 && this.offsetWidth < value) || window.innerWidth < value || (!isNaN(width) && width !== 0 && width < value);
        }
        resizeUI(value) {
            let interval = setInterval(() => {
                const tagWidth = Number(value || this.tag?.width);
                const screens = Object.keys(index_css_1.listMediaStyles);
                screens.forEach((screen) => {
                    this.classList.remove(index_css_1.listMediaStyles[screen]);
                });
                this.classList.remove(index_css_1.nftDefaultStyle);
                if (this.checkWidth(tagWidth, 1420)) {
                    for (const screen of screens) {
                        if (this.checkWidth(tagWidth, Number(screen))) {
                            this.classList.add(index_css_1.listMediaStyles[screen]);
                            break;
                        }
                    }
                }
                else {
                    this.classList.add(index_css_1.nftDefaultStyle);
                }
                clearInterval(interval);
            }, 100);
        }
        async initApprovalModelAction(item) {
            this.approvalModelAction = await this.state.setApprovalModelAction({
                sender: this,
                payAction: async () => {
                    (0, index_6.mintNFT)(item.address, item.stakeToken, item.totalPayAmount);
                },
                onToBeApproved: async (token) => {
                    this.btnApprove.visible = true;
                    this.btnMint.visible = false;
                    this.btnApprove.caption = (this.state.getChainId() !== this.targetChainId || !this.state.isRpcWalletConnected()) ? 'Switch Network' : `Approve ${token.symbol}`;
                    this.btnApprove.enabled = true;
                    this.btnMint.enabled = false;
                },
                onToBePaid: async (token) => {
                    this.btnApprove.visible = false;
                    this.btnMint.visible = true;
                    this.btnMint.enabled = true;
                },
                onApproving: async (token, receipt, data) => {
                    this.btnApprove.rightIcon.visible = true;
                    this.btnApprove.enabled = false;
                    this.btnApprove.caption = `Approving ${token.symbol}`;
                    if (receipt) {
                        (0, index_5.showResultMessage)(this.txStatusModal, 'success', receipt);
                    }
                },
                onApproved: async (token, data) => {
                    this.btnApprove.rightIcon.visible = false;
                },
                onApprovingError: async (token, err) => {
                    (0, index_5.showResultMessage)(this.txStatusModal, 'error', err);
                },
                onPaying: async (receipt, data) => {
                    if (receipt) {
                        (0, index_5.showResultMessage)(this.txStatusModal, 'success', receipt);
                        this.btnMint.rightIcon.visible = true;
                        this.btnMint.caption = 'Staking';
                    }
                },
                onPaid: async (data) => {
                    await this.updateBalances();
                    this.btnMint.rightIcon.visible = false;
                    this.btnMint.caption = 'Stake';
                    this.handleBack();
                    this.renderCards();
                },
                onPayingError: async (err) => {
                    (0, index_5.showResultMessage)(this.txStatusModal, 'error', err);
                }
            }, item.address);
        }
        async updateBalances() {
            await scom_token_list_2.tokenStore.updateTokenBalancesByChainId(this.state.getChainId());
        }
        async switchNetworkByWallet() {
            if (this.mdWallet) {
                await components_8.application.loadPackage('@scom/scom-wallet-modal', '*');
                this.mdWallet.networks = this.networks;
                this.mdWallet.wallets = this.wallets;
                this.mdWallet.showModal();
            }
        }
        renderEmpty(elm, msg) {
            if (!elm)
                return;
            elm.clearInnerHTML();
            elm.appendChild(this.$render("i-panel", { width: "100%" },
                this.$render("i-hstack", { gap: "32px" },
                    this.$render("i-panel", { border: { radius: '12px' }, background: { color: "#ffffff33" }, width: "100%", height: "auto" },
                        this.$render("i-vstack", { padding: { top: 30, bottom: 30 }, horizontalAlignment: "center" },
                            this.$render("i-panel", { class: "text-center", width: "100%" },
                                this.$render("i-image", { url: assets_4.default.fullPath('img/nft/TrollEgg.svg'), width: 200, height: "auto", display: "block", margin: { left: 'auto', right: 'auto' } })),
                            this.$render("i-label", { class: "text-center", width: "100%", margin: { top: 20 }, caption: msg, font: { color: 'white', size: '1.5rem' } }))))));
        }
        async renderData() {
            this.updateButtons();
            const currentChainId = this.state.getChainId();
            const isConnected = (0, index_4.isClientWalletConnected)();
            const { chainId, connected, fetching } = this.initializedState || {};
            if (chainId === currentChainId && connected === isConnected && fetching === true)
                return;
            this.initializedState = {
                chainId: currentChainId,
                connected: isConnected,
                fetching: true
            };
            await this.renderCards();
            this.updateButtons();
            this.initializedState.fetching = false;
        }
        async renderCards() {
            this.pnlLoading.visible = true;
            this.cardRow.visible = false;
            const info = await (0, index_6.fetchAllNftInfo)(this.state);
            const chainId = this.state.getChainId();
            if (this.initializedState.chainId !== chainId)
                return;
            if (!info || !Object.keys(info).length) {
                const network = this.state.getNetworkInfo(chainId);
                const msg = info === false ? `${network ? `${network.chainName} (${chainId})` : `Chain ID ${chainId}`} is not supported!` : 'Your very own NFT is getting ready!';
                this.renderEmpty(this.cardRow, msg);
                this.pnlLoading.visible = false;
                this.cardRow.visible = true;
                return;
            }
            const types = Object.keys(info);
            const cards = [];
            for (let type of types) {
                const item = info[type];
                const { address, flashSales, apr, rewards, token, protocolFee, minimumStake, userNfts } = item;
                const totalPayAmount = new eth_wallet_5.BigNumber(minimumStake).plus(protocolFee).toFixed();
                const _userNfts = userNfts.map(v => {
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
                        stakeAmountText: `${(0, index_5.formatNumber)(v.stakeBalance)} ${token?.symbol || ''}`,
                        birthday: components_8.moment.unix(v.birthday).format(index_5.DefaultDateFormat),
                        rarity: v.rarity,
                        image: v.image
                    };
                });
                cards.push({
                    address: item.address,
                    flashSales: item.flashSales,
                    monthlyReward: `${item.apr}% APR`,
                    rewardsBoost: `${item.rewards}%`,
                    tier: type,
                    slot: item.cap.minus(item.totalSupply).toNumber(),
                    stakeAmount: item.minimumStake.toFixed(),
                    stakeToken: item.token,
                    stakeAmountText: `${(0, index_5.formatNumber)(item.minimumStake)} ${item.token?.symbol || ''}`,
                    protocolFee: item.protocolFee.toFixed(),
                    totalPayAmount,
                    userNFTs: _userNfts
                });
            }
            this.dataCards = cards;
            this.cardRow.clearInnerHTML();
            for (const item of this.dataCards) {
                const column = await components_8.VStack.create();
                column.classList.add('nft-card-column', 'new-card-column');
                column.stack = { basis: '0%', shrink: '1', grow: '1' };
                const nftCard = await index_6.NftCard.create();
                column.appendChild(nftCard);
                this.cardRow.appendChild(column);
                nftCard.state = this.state;
                nftCard.onStake = () => this.onStake(item);
                nftCard.onBurn = (userNFT) => this.handleBurn(userNFT);
                nftCard.cardData = item;
            }
            this.pnlLoading.visible = false;
            this.cardRow.visible = true;
        }
        async onSubmit(isMint) {
            if (!(0, index_4.isClientWalletConnected)()) {
                this.switchNetworkByWallet();
                return;
            }
            else if (this.state.getChainId() !== this.targetChainId || !this.state.isRpcWalletConnected()) {
                const rpcWallet = this.state.getRpcWallet();
                if (rpcWallet.chainId != this.targetChainId) {
                    await rpcWallet.switchNetwork(this.targetChainId);
                }
                if (!this.state.isRpcWalletConnected()) {
                    const clientWallet = eth_wallet_5.Wallet.getClientInstance();
                    await clientWallet.switchNetwork(this.targetChainId);
                }
                return;
            }
            if (isMint) {
                await this.handleMint();
            }
            else {
                await this.handleConfirmBurn();
            }
        }
        updateButtons() {
            if (this.targetChainId && this.state.getChainId() !== this.targetChainId || !this.state.isRpcWalletConnected()) {
                this.btnApprove.caption = 'Switch Network';
                this.btnBurn.caption = 'Switch Network';
                this.btnMint.caption = 'Switch Network';
            }
            else {
                this.btnApprove.caption = `Approve ${this.currentDataCard?.stakeToken?.symbol || ''}`;
                this.btnBurn.caption = 'Burn';
                this.btnMint.caption = 'Stake';
            }
        }
        async onStake(item) {
            this.targetChainId = Number(this.state.getChainId());
            this.updateButtons();
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
            let tokenBalances = scom_token_list_2.tokenStore.getTokenBalancesByChainId(this.chainId) || {};
            let tokenBalance = tokenBalances[item.stakeToken.address.toLowerCase()];
            this.lbTokenBalance.caption = (0, index_5.formatNumber)(tokenBalance, 4);
            this.ImageMintStakeToken.url = scom_token_list_2.assets.tokenPath(item.stakeToken, this.chainId);
            this.lbMintStakeToken.caption = stakeTokenSymbol;
            this.lbMintMessage1.caption = `Please confirm you would like to mint a NFT by staking of ${item.stakeAmount} of ${stakeTokenSymbol}.`;
            this.lbMintMessage2.caption = `You can unstake ${stakeTokenSymbol} by the burning the NFT.`;
            await this.initApprovalModelAction(item);
            this.approvalModelAction.checkAllowance(item.stakeToken, new eth_wallet_5.BigNumber(item.totalPayAmount).toFixed());
        }
        async handleMint() {
            await this.approvalModelAction.doPayAction();
        }
        async clickApprove() {
            if (!(0, index_4.isClientWalletConnected)()) {
                this.switchNetworkByWallet();
                return;
            }
            else if (this.state.getChainId() !== this.targetChainId || !this.state.isRpcWalletConnected()) {
                const rpcWallet = this.state.getRpcWallet();
                if (rpcWallet.chainId != this.targetChainId) {
                    await rpcWallet.switchNetwork(this.targetChainId);
                }
                if (!this.state.isRpcWalletConnected()) {
                    const clientWallet = eth_wallet_5.Wallet.getClientInstance();
                    await clientWallet.switchNetwork(this.targetChainId);
                }
                return;
            }
            this.approvalModelAction.doApproveAction(this.currentDataCard.stakeToken, new eth_wallet_5.BigNumber(this.currentDataCard.totalPayAmount).toFixed());
        }
        handleBack() {
            this.mint.visible = true;
            this.minting.visible = false;
        }
        handleBurnBack() {
            this.mint.visible = true;
            this.burning.visible = false;
        }
        handleBurn(item) {
            this.targetChainId = Number(this.state.getChainId());
            this.currentDataMyCard = item;
            this.lbBurnMessage.caption = `By confirmimg the transaction, you will burn NFT and receive ${item.stakeAmountText}`;
            this.ImageBurn.url = item.image;
            this.mint.visible = false;
            this.burning.visible = true;
        }
        async handleConfirmBurn() {
            var self = this;
            (0, index_5.showResultMessage)(this.txStatusModal, 'warning', 'Burning');
            const txHashCallback = (err, receipt) => {
                if (err) {
                    (0, index_5.showResultMessage)(this.txStatusModal, 'error', err);
                }
                else if (receipt) {
                    (0, index_5.showResultMessage)(this.txStatusModal, 'success', receipt);
                    this.txStatusModal.onCustomClose = function () {
                        self.txStatusModal.closeModal();
                        self.mint.visible = true;
                        self.burning.visible = false;
                        self.txStatusModal.onCustomClose = null;
                    };
                    this.btnBurn.rightIcon.visible = true;
                    this.btnBurn.caption = 'Burning';
                }
            };
            const confirmationCallback = (receipt) => {
                this.btnBurn.rightIcon.visible = false;
                this.btnBurn.caption = 'Burn';
                this.handleBurnBack();
                this.renderCards();
            };
            (0, index_5.registerSendTxEvents)({
                transactionHash: txHashCallback,
                confirmation: confirmationCallback
            });
            await (0, index_6.burnNFT)(this.currentDataMyCard.address, this.currentDataMyCard.trollNumber);
        }
        render() {
            return (this.$render("i-scom-dapp-container", { id: "dappContainer" },
                this.$render("i-panel", { class: index_css_1.nftStyle },
                    this.$render("i-panel", { id: "mint", class: "widget" },
                        this.$render("i-panel", { padding: { left: '1rem', right: '1rem' } },
                            this.$render("i-panel", { id: "pnlLoading", minHeight: 300, class: "i-loading-overlay" },
                                this.$render("i-vstack", { class: "i-loading-spinner", horizontalAlignment: "center", verticalAlignment: "center" },
                                    this.$render("i-icon", { class: "i-loading-spinner_icon", cursor: "default", image: { url: assets_4.default.fullPath('img/loading.svg'), width: 36, height: 36 } }),
                                    this.$render("i-label", { caption: "Loading...", font: { color: '#FD4A4C', size: '1.5em' }, class: "i-loading-spinner_text" }))),
                            this.$render("i-hstack", { gap: "2rem", id: "cardRow", maxWidth: 1440, margin: { left: 'auto', right: 'auto' }, wrap: "wrap" }))),
                    this.$render("i-hstack", { id: "minting", visible: false, gap: "30px", horizontalAlignment: "center" },
                        this.$render("i-vstack", { class: "nft-card-stake" },
                            this.$render("i-panel", { class: "card-widget" },
                                this.$render("i-panel", { class: "bg-img" },
                                    this.$render("i-panel", { class: "title-box" },
                                        this.$render("i-icon", { class: 'icon-back pointer', height: 20, width: 20, name: 'arrow-left', fill: '#fff', onClick: this.handleBack }),
                                        this.$render("i-label", { id: "lbMintTitle", font: { color: '#f7d063', size: '1.4rem', bold: true } })),
                                    this.$render("i-panel", { class: "line-middle" }),
                                    this.$render("i-panel", { class: "section" },
                                        this.$render("i-panel", { class: "row-line" },
                                            this.$render("i-panel", { class: "title-icon" },
                                                this.$render("i-label", { caption: "Stake Amount" })),
                                            this.$render("i-label", { id: "lbMintStakeAmountText", caption: "50,000 OSWAP", font: { color: '#f7d063', size: '1.4rem', bold: true } })),
                                        this.$render("i-panel", { class: "row-line" },
                                            this.$render("i-panel", { class: "title-icon" },
                                                this.$render("i-label", { caption: "Rewards Boost" }),
                                                this.$render("i-icon", { name: "question-circle", fill: "#fff", height: 15, width: 15, tooltip: {
                                                        content: 'The Reward Boost is only applicable to OSWAP staking rewards.',
                                                        placement: 'right'
                                                    } })),
                                            this.$render("i-label", { id: "lbMintRewardsBoost", caption: "5%", font: { color: '#f7d063', size: '1.4rem', bold: true } })),
                                        this.$render("i-panel", { class: "row-line" },
                                            this.$render("i-panel", { class: "title-icon" },
                                                this.$render("i-label", { caption: "Monthly Reward" }),
                                                this.$render("i-icon", { name: "question-circle", fill: "#fff", height: 15, width: 15, tooltip: {
                                                        content: 'The Monthly Reward will be distributed at the end of each month.',
                                                        placement: 'right'
                                                    } })),
                                            this.$render("i-label", { id: "lbMintMonthlyReward", caption: "5%", font: { color: '#f7d063', size: '1.4rem', bold: true } })),
                                        this.$render("i-panel", { class: "row-line" },
                                            this.$render("i-panel", { class: "title-icon" },
                                                this.$render("i-label", { caption: "Flash Sales Inclusion" })),
                                            this.$render("i-label", { id: "lbMintFlashSales", caption: "Periodic", font: { color: '#f7d063', size: '1.4rem', bold: true } })),
                                        this.$render("i-panel", { class: "row-line" },
                                            this.$render("i-panel", { class: "title-icon" },
                                                this.$render("i-label", { caption: "Mint Fee" }),
                                                this.$render("i-icon", { name: "question-circle", fill: "#fff", height: 15, width: 15, tooltip: {
                                                        content: 'The mint fee covers the transaction cost on using Chainlink Verifiable Random Function.',
                                                        placement: 'right'
                                                    } })),
                                            this.$render("i-label", { id: "lbMintFee", caption: "", font: { color: '#f7d063', size: '1.4rem', bold: true } })),
                                        this.$render("i-panel", { class: "section-1" },
                                            this.$render("i-hstack", { gap: 4, margin: { bottom: '0.75rem' }, verticalAlignment: "center", horizontalAlignment: "space-between" },
                                                this.$render("i-label", { caption: "Stake Amount" }),
                                                this.$render("i-hstack", { gap: 4, verticalAlignment: "center", horizontalAlignment: "end" },
                                                    this.$render("i-label", { font: { color: '#f7d063', size: '1rem' }, caption: "Balance: " }),
                                                    this.$render("i-label", { id: "lbTokenBalance", font: { color: '#f7d063', size: '1rem' } }))),
                                            this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "space-between" },
                                                this.$render("i-label", { id: "lbMintStakeAmount", font: { color: '#f7d063', size: '1.2rem' } }),
                                                this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "end" },
                                                    this.$render("i-image", { id: "ImageMintStakeToken", width: 20, class: "flex", margin: { right: 4 }, url: assets_4.default.fullPath('img/swap/openswap.png') }),
                                                    this.$render("i-label", { id: "lbMintStakeToken", caption: "OSWAP" })))),
                                        this.$render("i-panel", { class: "section-2" },
                                            this.$render("i-panel", null,
                                                this.$render("i-label", { id: "lbMintMessage1", caption: "Please confirm you would like to mint a NFT by staking of 50000 of OSWAP." })),
                                            this.$render("i-panel", null,
                                                this.$render("i-label", { id: "lbMintMessage2", caption: "You can unstake OSWAP by the burning the NFT." }))),
                                        this.$render("i-button", { id: "btnApprove", visible: false, class: "btn-stake", height: 40, enabled: false, caption: "Approve", rightIcon: { spin: true, visible: false }, onClick: this.clickApprove }),
                                        this.$render("i-button", { id: "btnMint", height: 40, class: "btn-stake", caption: 'Stake', rightIcon: { spin: true, visible: false }, onClick: () => this.onSubmit(true) })))))),
                    this.$render("i-hstack", { id: "burning", visible: false, gap: "30px", horizontalAlignment: 'center' },
                        this.$render("i-vstack", { class: "nft-burn-stake", width: 500, maxWidth: '100%', padding: { left: 15, right: 15 }, margin: { bottom: 30 } },
                            this.$render("i-panel", { class: "card-widget" },
                                this.$render("i-panel", { class: "bg-img" },
                                    this.$render("i-panel", { class: "title-box" },
                                        this.$render("i-icon", { class: 'icon-back pointer', height: 20, width: 20, name: 'arrow-left', fill: '#fff', onClick: this.handleBurnBack }),
                                        this.$render("i-label", { caption: "Confim Burn", font: { color: '#f7d063', size: '1.4rem', bold: true } })),
                                    this.$render("i-panel", { class: "line-middle" }),
                                    this.$render("i-panel", { class: "section" },
                                        this.$render("i-panel", { class: "section-2", margin: { bottom: 30 } },
                                            this.$render("i-panel", null,
                                                this.$render("i-label", { id: "lbBurnMessage", class: "text-center", caption: "By confirmimg the transaction, you will burn NFT and receive 75,000OSWAP" }))),
                                        this.$render("i-hstack", { horizontalAlignment: 'center', margin: { bottom: 20 } },
                                            this.$render("i-image", { id: "ImageBurn", class: "text-center", width: '100%', height: 'auto' })),
                                        this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'center' },
                                            this.$render("i-image", { url: assets_4.default.fullPath('img/nft/TrollCry.png'), margin: { right: 4 }, width: 40, height: "auto", class: "flex" }),
                                            this.$render("i-label", { class: "note-burn", caption: "This is NFT Will Be Gone Forever" })),
                                        this.$render("i-button", { id: "btnBurn", height: 40, class: "btn-stake btn-os", caption: 'Burn', rightIcon: { spin: true, visible: false }, onClick: () => this.onSubmit() }))))))),
                this.$render("i-scom-tx-status-modal", { id: "txStatusModal" }),
                this.$render("i-scom-wallet-modal", { id: "mdWallet", wallets: [] })));
        }
    };
    OswapNftWidget = __decorate([
        components_8.customModule,
        (0, components_8.customElements)('i-oswap-nft-widget')
    ], OswapNftWidget);
    exports.default = OswapNftWidget;
});
