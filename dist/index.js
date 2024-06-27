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
define("@scom/oswap-nft-widget/global/helper.ts", ["require", "exports", "@ijstech/eth-wallet", "@ijstech/components"], function (require, exports, eth_wallet_1, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.flatMap = exports.showResultMessage = exports.getWeekDays = exports.uniqWith = exports.getParamsFromUrl = exports.numberToBytes32 = exports.padLeft = exports.toWeiInv = exports.getAPI = exports.limitDecimals = exports.limitInputNumber = exports.isInvalidInput = exports.formatNumberWithSeparators = exports.formatPercentNumber = exports.formatNumber = exports.compareDate = exports.formatUTCDate = exports.formatDate = exports.DefaultDateFormat = exports.DefaultDateTimeFormat = exports.SITE_ENV = void 0;
    var SITE_ENV;
    (function (SITE_ENV) {
        SITE_ENV["DEV"] = "dev";
        SITE_ENV["TESTNET"] = "testnet";
        SITE_ENV["MAINNET"] = "mainnet";
    })(SITE_ENV = exports.SITE_ENV || (exports.SITE_ENV = {}));
    exports.DefaultDateTimeFormat = 'DD/MM/YYYY HH:mm:ss';
    exports.DefaultDateFormat = 'DD/MM/YYYY';
    const formatDate = (date, customType, showTimezone) => {
        const formatType = customType || exports.DefaultDateFormat;
        const formatted = (0, components_1.moment)(date).format(formatType);
        if (showTimezone) {
            let offsetHour = (0, components_1.moment)().utcOffset() / 60;
            //will look like UTC-2 UTC+2 UTC+0
            return `${formatted} (UTC${offsetHour >= 0 ? "+" : ""}${offsetHour})`;
        }
        return formatted;
    };
    exports.formatDate = formatDate;
    const formatUTCDate = (date, customType, showTimezone) => {
        const formatType = customType || exports.DefaultDateFormat;
        const formatted = (0, components_1.moment)(date).utc().format(formatType);
        return showTimezone ? `${formatted} (UTC)` : formatted;
    };
    exports.formatUTCDate = formatUTCDate;
    const compareDate = (fromDate, toDate) => {
        if (!toDate) {
            toDate = (0, components_1.moment)();
        }
        return (0, components_1.moment)(fromDate).isSameOrBefore(toDate);
    };
    exports.compareDate = compareDate;
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
    const formatPercentNumber = (value, decimals) => {
        let val = value;
        if (typeof value === 'string') {
            val = new eth_wallet_1.BigNumber(value).toNumber();
        }
        else if (typeof value === 'object') {
            val = value.toNumber();
        }
        return (0, exports.formatNumberWithSeparators)(val, decimals || 2);
    };
    exports.formatPercentNumber = formatPercentNumber;
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
    const isInvalidInput = (val) => {
        const value = new eth_wallet_1.BigNumber(val);
        if (value.lt(0))
            return true;
        return (val || '').toString().substring(0, 2) === '00' || val === '-';
    };
    exports.isInvalidInput = isInvalidInput;
    const limitInputNumber = (input, decimals) => {
        const amount = input.value;
        if ((0, exports.isInvalidInput)(amount)) {
            input.value = '0';
            return;
        }
        if (!new eth_wallet_1.BigNumber(amount).isNaN()) {
            input.value = (0, exports.limitDecimals)(amount, decimals || 18);
        }
    };
    exports.limitInputNumber = limitInputNumber;
    const limitDecimals = (value, decimals) => {
        let val = value;
        if (typeof value !== 'string') {
            val = val.toString();
        }
        let chart;
        if (val.includes('.')) {
            chart = '.';
        }
        else if (val.includes(',')) {
            chart = ',';
        }
        else {
            return value;
        }
        const parts = val.split(chart);
        let decimalsPart = parts[1];
        if (decimalsPart && decimalsPart.length > decimals) {
            parts[1] = decimalsPart.substr(0, decimals);
        }
        return parts.join(chart);
    };
    exports.limitDecimals = limitDecimals;
    async function getAPI(url, paramsObj) {
        let queries = '';
        if (paramsObj) {
            try {
                queries = new URLSearchParams(paramsObj).toString();
            }
            catch (err) {
                console.log('err', err);
            }
        }
        let fullURL = url + (queries ? `?${queries}` : '');
        const response = await fetch(fullURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        return response.json();
    }
    exports.getAPI = getAPI;
    const toWeiInv = (n, unit) => {
        if (new eth_wallet_1.BigNumber(n).eq(0))
            return new eth_wallet_1.BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
        return new eth_wallet_1.BigNumber('1').shiftedBy((unit || 18) * 2).idiv(new eth_wallet_1.BigNumber(n).shiftedBy(unit || 18));
    };
    exports.toWeiInv = toWeiInv;
    const padLeft = function (string, chars, sign) {
        return new Array(chars - string.length + 1).join(sign ? sign : "0") + string;
    };
    exports.padLeft = padLeft;
    const numberToBytes32 = (value, prefix) => {
        if (!value)
            return;
        let v = value;
        if (typeof value == "number") {
            // covert to a hex string
            v = value.toString(16);
        }
        else if (/^[0-9]*$/.test(value)) {
            // assuming value to be a decimal number, value could be a hex
            v = new eth_wallet_1.BigNumber(value).toString(16);
        }
        else if (/^(0x)?[0-9A-Fa-f]*$/.test(value)) {
            // value already a hex
            v = value;
        }
        else if (eth_wallet_1.BigNumber.isBigNumber(value)) {
            v = value.toString(16);
        }
        v = v.replace("0x", "");
        v = (0, exports.padLeft)(v, 64);
        if (prefix)
            v = '0x' + v;
        return v;
    };
    exports.numberToBytes32 = numberToBytes32;
    const getParamsFromUrl = () => {
        const startIdx = window.location.href.indexOf("?");
        const search = window.location.href.substring(startIdx, window.location.href.length);
        const queryString = search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams;
    };
    exports.getParamsFromUrl = getParamsFromUrl;
    const uniqWith = (array, compareFn) => {
        const unique = [];
        for (const cur of array) {
            const isDuplicate = unique.some((oth) => compareFn(cur, oth));
            if (!isDuplicate)
                unique.push(cur);
        }
        return unique;
    };
    exports.uniqWith = uniqWith;
    const getWeekDays = () => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        let days = [];
        let day = d;
        for (let i = 0; i < 7; i++) {
            days.push(day.setDate(day.getDate() + 1));
        }
        return days;
    };
    exports.getWeekDays = getWeekDays;
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
    function flatMap(array, callback) {
        return array.reduce((acc, item) => {
            return acc.concat(callback(item));
        }, []);
    }
    exports.flatMap = flatMap;
});
define("@scom/oswap-nft-widget/global/error.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseContractError = void 0;
    ///<amd-module name='@scom/oswap-nft-widget/global/error.ts'/> 
    async function parseContractError(oMessage, tokens) {
        const staticMessageMap = {
            'execution reverted: OAXDEX: K': 'x * y = k Violated',
            'execution reverted: OAXDEX: FORBIDDEN': 'Forbidden',
            'execution reverted: OAXDEX: INSUFFICIENT_INPUT_AMOUNT': 'Insufficient input amount',
            'execution reverted: OAXDEX: INVALID_TO': 'Invalid to',
            'execution reverted: OAXDEX: INSUFFICIENT_LIQUIDITY': 'Insufficient liquidity',
            'execution reverted: OAXDEX: INSUFFICIENT_OUTPUT_AMOUNT': 'Insufficient output amount',
            'execution reverted: OAXDEX: PAIR PAUSED': 'Pair paused',
            'execution reverted: OAXDEX: GLOBALLY PAUSED': 'Globally paused',
            'execution reverted: OAXDEX: INSUFFICIENT_LIQUIDITY_BURNED': 'Insufficient liquidity burned',
            'execution reverted: OAXDEX: INSUFFICIENT_LIQUIDITY_MINTED': 'Insufficient liquidity minted',
            'execution reverted: OAXDEX: OVERFLOW': 'Overflow',
            'execution reverted: OAXDEX_Pair: INSUFFICIENT_LIQUIDITY': 'Insufficient liquidity',
            'execution reverted: OAXDEX_Pair: INSUFFICIENT_OUTPUT_AMOUNT': 'Insufficient output amount',
            'execution reverted: OAXDEX_Pair: INSUFFICIENT_INPUT_AMOUNT': 'Insufficient input amount',
            'execution reverted: OAXDEX: LOCKED': 'Locked',
            'execution reverted: OAXDEX: INVALID_SIGNATURE': 'Invalid signature',
            'execution reverted: OAXDEX: EXPIRED': 'Expired',
            'Returned error: MetaMask Tx Signature: User denied transaction signature.': 'User denied transaction signature',
            'MetaMask Tx Signature: User denied transaction signature.': 'User denied transaction signature',
            'execution reverted: OracleAdaptor: Price outside allowed range': 'Circuit Breaker: Exceeds Price Protection Range',
            'execution reverted: PAIR_NOT_MATCH': 'Pair Not Match',
            'execution reverted: Cap exceeded': 'Trolls have been sold out',
            'execution reverted: No oracle found': 'No Oracle found',
            'execution reverted: Amount exceeds available fund': 'Insufficient liquidity',
            'execution reverted: OAXDEX_VotingRegistry: exceeded maxVoteDuration': 'Exceeded maxVoteDuration'
        };
        return staticMessageMap[oMessage] ?? `Unknown Error: ${oMessage}`;
    }
    exports.parseContractError = parseContractError;
});
define("@scom/oswap-nft-widget/global/common.ts", ["require", "exports", "@ijstech/eth-wallet"], function (require, exports, eth_wallet_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isAddressValid = exports.registerSendTxEvents = exports.isTransactionConfirmed = exports.ERC20MaxAmount = void 0;
    exports.ERC20MaxAmount = new eth_wallet_2.BigNumber(2).pow(256).minus(1);
    const isTransactionConfirmed = async (txHash) => {
        const wallet = eth_wallet_2.Wallet.getClientInstance();
        const tx = await wallet.getTransactionReceipt(txHash); // wallet.web3.eth.getTransaction(txHash);
        return tx && !!tx.blockNumber;
    };
    exports.isTransactionConfirmed = isTransactionConfirmed;
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
    const isAddressValid = async (address) => {
        let wallet = eth_wallet_2.Wallet.getClientInstance();
        const isValid = wallet.web3.utils.isAddress(address);
        return isValid;
    };
    exports.isAddressValid = isAddressValid;
});
define("@scom/oswap-nft-widget/global/index.ts", ["require", "exports", "@scom/oswap-nft-widget/global/helper.ts", "@scom/oswap-nft-widget/global/error.ts", "@scom/oswap-nft-widget/global/common.ts"], function (require, exports, helper_1, error_1, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ERC20MaxAmount = exports.isAddressValid = exports.registerSendTxEvents = exports.isTransactionConfirmed = exports.parseContractError = exports.flatMap = exports.showResultMessage = exports.SITE_ENV = exports.formatPercentNumber = exports.compareDate = exports.getWeekDays = exports.uniqWith = exports.getParamsFromUrl = exports.numberToBytes32 = exports.toWeiInv = exports.isInvalidInput = exports.limitInputNumber = exports.limitDecimals = exports.formatUTCDate = exports.formatDate = exports.DefaultDateFormat = exports.DefaultDateTimeFormat = exports.formatNumberWithSeparators = exports.formatNumber = exports.getAPI = void 0;
    ;
    Object.defineProperty(exports, "getAPI", { enumerable: true, get: function () { return helper_1.getAPI; } });
    Object.defineProperty(exports, "formatNumber", { enumerable: true, get: function () { return helper_1.formatNumber; } });
    Object.defineProperty(exports, "formatNumberWithSeparators", { enumerable: true, get: function () { return helper_1.formatNumberWithSeparators; } });
    Object.defineProperty(exports, "DefaultDateTimeFormat", { enumerable: true, get: function () { return helper_1.DefaultDateTimeFormat; } });
    Object.defineProperty(exports, "DefaultDateFormat", { enumerable: true, get: function () { return helper_1.DefaultDateFormat; } });
    Object.defineProperty(exports, "formatDate", { enumerable: true, get: function () { return helper_1.formatDate; } });
    Object.defineProperty(exports, "formatUTCDate", { enumerable: true, get: function () { return helper_1.formatUTCDate; } });
    Object.defineProperty(exports, "limitDecimals", { enumerable: true, get: function () { return helper_1.limitDecimals; } });
    Object.defineProperty(exports, "limitInputNumber", { enumerable: true, get: function () { return helper_1.limitInputNumber; } });
    Object.defineProperty(exports, "isInvalidInput", { enumerable: true, get: function () { return helper_1.isInvalidInput; } });
    Object.defineProperty(exports, "toWeiInv", { enumerable: true, get: function () { return helper_1.toWeiInv; } });
    Object.defineProperty(exports, "numberToBytes32", { enumerable: true, get: function () { return helper_1.numberToBytes32; } });
    Object.defineProperty(exports, "getParamsFromUrl", { enumerable: true, get: function () { return helper_1.getParamsFromUrl; } });
    Object.defineProperty(exports, "uniqWith", { enumerable: true, get: function () { return helper_1.uniqWith; } });
    Object.defineProperty(exports, "getWeekDays", { enumerable: true, get: function () { return helper_1.getWeekDays; } });
    Object.defineProperty(exports, "compareDate", { enumerable: true, get: function () { return helper_1.compareDate; } });
    Object.defineProperty(exports, "formatPercentNumber", { enumerable: true, get: function () { return helper_1.formatPercentNumber; } });
    Object.defineProperty(exports, "SITE_ENV", { enumerable: true, get: function () { return helper_1.SITE_ENV; } });
    Object.defineProperty(exports, "showResultMessage", { enumerable: true, get: function () { return helper_1.showResultMessage; } });
    Object.defineProperty(exports, "flatMap", { enumerable: true, get: function () { return helper_1.flatMap; } });
    Object.defineProperty(exports, "parseContractError", { enumerable: true, get: function () { return error_1.parseContractError; } });
    Object.defineProperty(exports, "isTransactionConfirmed", { enumerable: true, get: function () { return common_1.isTransactionConfirmed; } });
    Object.defineProperty(exports, "registerSendTxEvents", { enumerable: true, get: function () { return common_1.registerSendTxEvents; } });
    Object.defineProperty(exports, "isAddressValid", { enumerable: true, get: function () { return common_1.isAddressValid; } });
    Object.defineProperty(exports, "ERC20MaxAmount", { enumerable: true, get: function () { return common_1.ERC20MaxAmount; } });
});
define("@scom/oswap-nft-widget/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/oswap-nft-widget/data.json.ts'/> 
    const InfuraId = "adc596bf88b648e2a8902bc9093930c5";
    exports.default = {
        "infuraId": InfuraId,
        "defaultBuilderData": {
            "defaultChainId": 43113,
            "networks": [
                {
                    "chainId": 43113
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
            },
            {
                "chainId": 43113,
                "isTestnet": true
            },
            {
                "chainId": 43114
            }
        ]
    };
});
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
define("@scom/oswap-nft-widget/store/utils.ts", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-network-list", "@scom/oswap-nft-widget/data.json.ts", "@scom/oswap-nft-widget/store/data/core.ts", "@scom/scom-token-list"], function (require, exports, components_2, eth_wallet_3, scom_network_list_1, data_json_1, core_1, scom_token_list_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getChainNativeToken = exports.truncateAddress = exports.isWalletConnected = exports.getWalletProvider = exports.getTokensDataList = exports.State = exports.getNetworksByType = exports.getNetworkType = exports.NetworkType = exports.WalletPlugin = void 0;
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
        if (core_1.Mainnets.some(network => network === chainId)) {
            return NetworkType.Mainnet;
        }
        if (core_1.Testnets.some(network => network === chainId)) {
            return NetworkType.Testnet;
        }
        return NetworkType.NotSupported;
    }
    exports.getNetworkType = getNetworkType;
    function getNetworksByType(chainId) {
        switch (getNetworkType(chainId)) {
            case NetworkType.Mainnet:
                return core_1.Mainnets;
            case NetworkType.Testnet:
                return core_1.Testnets;
        }
        return [];
    }
    exports.getNetworksByType = getNetworksByType;
    class State {
        constructor(options) {
            this.defaultChainId = 0;
            this.slippageTolerance = "0.5";
            this.proxyAddresses = {};
            this.infuraId = "";
            this.rpcWalletId = "";
            this.networkMap = {};
            this.networkConfig = [];
            this.getNetworkInfo = (chainId) => {
                return this.networkMap[chainId];
            };
            this.getFilteredNetworks = (filter) => {
                let networkFullList = Object.values(this.networkMap);
                return networkFullList.filter(filter);
            };
            this.getSiteSupportedNetworks = () => {
                let networkFullList = Object.values(this.networkMap);
                let list = networkFullList.filter(network => !this.getNetworkInfo(network.chainId)?.isDisabled);
                return list;
            };
            this.getMatchNetworks = (conditions) => {
                let networkFullList = Object.values(this.networkMap);
                let out = matchFilter(networkFullList, conditions);
                return out;
            };
            this.getNetworkExplorerName = (chainId) => {
                if (this.getNetworkInfo(chainId)) {
                    return this.getNetworkInfo(chainId).explorerName;
                }
                return 'Unknown';
            };
            this.viewOnExplorerByTxHash = (chainId, txHash) => {
                let network = this.getNetworkInfo(chainId);
                if (network && network.explorerTxUrl) {
                    let url = `${network.explorerTxUrl}${txHash}`;
                    window.open(url);
                }
            };
            this.viewOnExplorerByAddress = (chainId, address) => {
                let network = this.getNetworkInfo(chainId);
                if (network && network.explorerAddressUrl) {
                    let url = `${network.explorerAddressUrl}${address}`;
                    window.open(url);
                }
            };
            this.getSlippageTolerance = () => {
                return Number(this.slippageTolerance) || 0;
            };
            this.setSlippageTolerance = (value) => {
                this.slippageTolerance = new eth_wallet_3.BigNumber(value).toFixed();
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
            const networkList = Object.values(components_2.application.store?.networkMap || []);
            const instanceId = clientWallet.initRpcWallet({
                networks: networkList,
                defaultChainId,
                infuraId: components_2.application.store?.infuraId,
                multicalls: components_2.application.store?.multicalls
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
            const supportedNetworks = data_json_1.default.supportedNetworks || [];
            for (let network of networkList) {
                const networkInfo = defaultNetworkMap[network.chainId];
                const supportedNetwork = supportedNetworks.find(v => v.chainId == network.chainId);
                if (!networkInfo || !supportedNetwork)
                    continue;
                if (this.infuraId && network.rpcUrls && network.rpcUrls.length > 0) {
                    for (let i = 0; i < network.rpcUrls.length; i++) {
                        network.rpcUrls[i] = network.rpcUrls[i].replace(/{InfuraId}/g, this.infuraId);
                    }
                }
                this.networkMap[network.chainId] = {
                    ...networkInfo,
                    ...network,
                    isTestnet: supportedNetwork.isTestnet
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
    function matchFilter(list, filter) {
        let filters = Object.keys(filter);
        return list.filter(item => filters.every(f => {
            switch (typeof filter[f]) {
                case 'boolean':
                    if (filter[f] === false) {
                        return !item[f];
                    }
                // also case for filter[f] === true 
                case 'string':
                case 'number':
                    return filter[f] === item[f];
                case 'object': // have not implemented yet
                default:
                    console.log(`matchFilter do not support ${typeof filter[f]} yet!`);
                    return false;
            }
        }));
    }
    const getTokensDataList = async (tokenMapData, tokenBalances) => {
        let dataList = [];
        for (let i = 0; i < Object.keys(tokenMapData).length; i++) {
            let tokenAddress = Object.keys(tokenMapData)[i];
            let tokenObject = tokenMapData[tokenAddress];
            if (tokenBalances) {
                dataList.push({
                    ...tokenObject,
                    status: false,
                    value: tokenBalances[tokenAddress] ? tokenBalances[tokenAddress] : 0,
                });
            }
            else {
                dataList.push({
                    ...tokenObject,
                    status: null,
                });
            }
        }
        return dataList;
    };
    exports.getTokensDataList = getTokensDataList;
    // wallet
    function getWalletProvider() {
        return localStorage.getItem('walletProvider') || '';
    }
    exports.getWalletProvider = getWalletProvider;
    function isWalletConnected() {
        const wallet = eth_wallet_3.Wallet.getClientInstance();
        return wallet.isConnected;
    }
    exports.isWalletConnected = isWalletConnected;
    const truncateAddress = (address) => {
        if (address === undefined || address === null)
            return '';
        return address.substr(0, 6) + '...' + address.substr(-4);
    };
    exports.truncateAddress = truncateAddress;
    const getChainNativeToken = (chainId) => {
        return scom_token_list_1.ChainNativeTokenByChainId[chainId];
    };
    exports.getChainNativeToken = getChainNativeToken;
});
define("@scom/oswap-nft-widget/store/data/nft.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.oaxNFTInfo = exports.trollCampInfoMap = exports.attributesDistribution = exports.rewardAddress = exports.trollAPIUrl = exports.NFT_TYPE = void 0;
    var NFT_TYPE;
    (function (NFT_TYPE) {
        NFT_TYPE["OSWAP"] = "oswap";
        NFT_TYPE["OAX"] = "oax";
    })(NFT_TYPE || (NFT_TYPE = {}));
    exports.NFT_TYPE = NFT_TYPE;
    const trollAPIUrl = {
        56: 'https://data.openswap.xyz/nft/v1',
        97: 'https://bsc-test-data.openswap.xyz/nft/v1',
        31337: 'https://amino.openswap.xyz/nft/v1',
        43113: 'https://bsc-test-data.openswap.xyz/nft/v1' //FIXME
    };
    exports.trollAPIUrl = trollAPIUrl;
    const rewardAddress = {
        56: '0x37c8207975D5B04cc6c2C2570d91425985cF61Df',
        97: '0x265F91CdFC308275504120E32B6A2B09B066df1a',
    };
    exports.rewardAddress = rewardAddress;
    const attributesDistribution = {
        generalTroll: {
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
        },
        oax: {
            base: 8,
            digits: [3, 3, 3, 3, 3],
            probability: [
                [0.6, 0.4],
                [0.7, 0.3],
                [0.7, 0.2, 0.1],
                [0.8, 0.2],
                [0.4, 0.4, 0.2]
            ],
            rarityIndex: null,
            rarityMatrix: [0.002, 0.0051, 0.01, 0.03, 0.1]
        }
    };
    exports.attributesDistribution = attributesDistribution;
    const trollCampInfoMap = {
        // Binance Mainnet
        56: [
            {
                tier: 'hungry',
                contract: '0x1254132567549292388cd699Cb78B47d3101c8A9',
                rewards: 5,
                apr: 2,
                flashSales: 'Periodic',
                attributes: attributesDistribution.generalTroll
            },
            {
                tier: 'happy',
                contract: '0x2d74990f55faeA086A83B9fE176FD36a34bA617b',
                rewards: 15,
                apr: 4,
                flashSales: 'Priority',
                attributes: attributesDistribution.generalTroll
            },
            {
                tier: 'hunny',
                contract: '0x3E8fb94D9dD7A8f9b2ccF0B4CCdC768628890eeB',
                rewards: 40,
                apr: 6,
                flashSales: 'Guaranteed',
                attributes: attributesDistribution.generalTroll
            },
            {
                tier: 'mean',
                contract: '0x4c934C39a766c8DbcB3F40bD597201d07851ccAa',
                rewards: 0,
                apr: 0,
                flashSales: 'Guaranteed',
                attributes: attributesDistribution.generalTroll,
                hide: true
            }
        ],
        // Binance Test Chain
        97: [
            {
                tier: 'hungry',
                contract: '0x946985e7C43Ed2fc7985e89a49A251D52d824122',
                rewards: 5,
                apr: 2,
                flashSales: 'Periodic',
                attributes: attributesDistribution.generalTroll
            },
            {
                tier: 'happy',
                contract: '0x157538c2d508CDb1A6cf48B8336E4e56350A97C8',
                rewards: 15,
                apr: 4,
                flashSales: 'Priority',
                attributes: attributesDistribution.generalTroll
            },
            {
                tier: 'hunny',
                contract: '0xB9425ddFB534CA87B73613283F4fB0073B63F31D',
                rewards: 40,
                apr: 6,
                flashSales: 'Guaranteed',
                attributes: attributesDistribution.generalTroll
            },
        ],
        31337: [
            {
                tier: 'hungry',
                contract: '0xA887958C66bec5da6a884936c050FeB32D67F4d3',
                rewards: 5,
                apr: 2,
                flashSales: 'Periodic',
                attributes: attributesDistribution.generalTroll
            },
            {
                tier: 'happy',
                contract: '0x26c5B9cE4ca0792f98ef4B6D9b7a71Af11aA033b',
                rewards: 15,
                apr: 4,
                flashSales: 'Priority',
                attributes: attributesDistribution.generalTroll
            },
            {
                tier: 'hunny',
                contract: '0x8882aF970E7856127E4f1afa88CF401A22F4d1D1',
                rewards: 40,
                apr: 6,
                flashSales: 'Guaranteed',
                attributes: attributesDistribution.generalTroll
            }
        ],
        // Contracts without vrf
        43113: [
            {
                tier: 'hungry',
                contract: '0x390118aa8bde8c63f159a0d032dbdc8bed83ef42',
                rewards: 5,
                apr: 2,
                flashSales: 'Periodic',
                attributes: attributesDistribution.generalTroll
            },
            {
                tier: 'happy',
                contract: '0x4e616ae82324b519c7d338450e7048024390be32',
                rewards: 15,
                apr: 4,
                flashSales: 'Priority',
                attributes: attributesDistribution.generalTroll
            },
            {
                tier: 'hunny',
                contract: '0xc11c7b25e97b85657be6c8c9f057214cf793b536',
                rewards: 40,
                apr: 6,
                flashSales: 'Guaranteed',
                attributes: attributesDistribution.generalTroll
            }
        ]
    };
    exports.trollCampInfoMap = trollCampInfoMap;
    const oaxNFTInfo = {
        // Binance Mainnet
        56: [],
        // Binance Test Chain
        97: [
            {
                contract: '0x47Ee972499dD103fa2Fb101b49a385d8024C1BA9',
                apr: 10,
                attributes: attributesDistribution.oax
            },
        ],
    };
    exports.oaxNFTInfo = oaxNFTInfo;
});
define("@scom/oswap-nft-widget/store/data/index.ts", ["require", "exports", "@scom/oswap-nft-widget/store/data/core.ts", "@scom/oswap-nft-widget/store/data/nft.ts"], function (require, exports, core_2, nft_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/oswap-nft-widget/store/data/index.ts'/> 
    __exportStar(core_2, exports);
    __exportStar(nft_1, exports);
});
define("@scom/oswap-nft-widget/store/index.ts", ["require", "exports", "@scom/scom-token-list", "@scom/oswap-nft-widget/store/utils.ts", "@scom/oswap-nft-widget/store/data/index.ts", "@scom/oswap-nft-widget/store/utils.ts"], function (require, exports, scom_token_list_2, utils_1, index_1, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getNetworkImg = exports.tokenName = exports.tokenSymbol = exports.getTokenIcon = exports.nullAddress = void 0;
    __exportStar(index_1, exports);
    exports.nullAddress = "0x0000000000000000000000000000000000000000";
    const getTokenIcon = (address, chainId) => {
        if (!address)
            return '';
        const tokenMap = scom_token_list_2.tokenStore.getTokenMapByChainId(chainId);
        let ChainNativeToken;
        let tokenObject;
        if ((0, utils_1.isWalletConnected)()) {
            ChainNativeToken = (0, utils_1.getChainNativeToken)(chainId);
            tokenObject = address == ChainNativeToken.symbol ? ChainNativeToken : tokenMap[address.toLowerCase()];
        }
        else {
            tokenObject = tokenMap[address.toLowerCase()];
        }
        return scom_token_list_2.assets.tokenPath(tokenObject, chainId);
    };
    exports.getTokenIcon = getTokenIcon;
    const tokenSymbol = (address, chainId) => {
        const tokenMap = scom_token_list_2.tokenStore.getTokenMapByChainId(chainId);
        if (!address || !tokenMap)
            return '';
        const nativeToken = (0, utils_1.getChainNativeToken)(chainId);
        let tokenObject = nativeToken.symbol.toLowerCase() === address.toLowerCase() ? nativeToken : tokenMap[address.toLowerCase()];
        if (!tokenObject)
            tokenObject = tokenMap[address];
        return tokenObject ? tokenObject.symbol : '';
    };
    exports.tokenSymbol = tokenSymbol;
    const tokenName = (address, chainId) => {
        const tokenMap = scom_token_list_2.tokenStore.getTokenMapByChainId(chainId);
        if (!address || !tokenMap)
            return '';
        const nativeToken = (0, utils_1.getChainNativeToken)(chainId);
        let tokenObject = nativeToken.symbol.toLowerCase() === address.toLowerCase() ? nativeToken : tokenMap[address.toLowerCase()];
        if (!tokenObject)
            tokenObject = tokenMap[address];
        return tokenObject?.name || '';
    };
    exports.tokenName = tokenName;
    const getNetworkImg = (state, chainId) => {
        try {
            const network = state.getNetworkInfo(chainId);
            if (network) {
                return network.image;
            }
        }
        catch { }
        return scom_token_list_2.assets.fallbackUrl;
    };
    exports.getNetworkImg = getNetworkImg;
    __exportStar(utils_2, exports);
});
define("@scom/oswap-nft-widget/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let moduleDir = components_3.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    exports.default = {
        fullPath
    };
});
define("@scom/oswap-nft-widget/nft-utils/card.css.ts", ["require", "exports", "@ijstech/components", "@scom/oswap-nft-widget/assets.ts"], function (require, exports, components_4, assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cardStyle = void 0;
    exports.cardStyle = components_4.Styles.style({
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
                        color: ' #6f1018',
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
define("@scom/oswap-nft-widget/nft-utils/card.tsx", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/oswap-nft-widget/assets.ts", "@scom/oswap-nft-widget/store/index.ts", "@scom/oswap-nft-widget/nft-utils/card.css.ts"], function (require, exports, components_5, eth_wallet_4, assets_2, index_2, card_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NftCard = void 0;
    let NftCard = class NftCard extends components_5.Module {
        constructor(state, parent, options) {
            super(parent, options);
            this.clientEvents = [];
            this.state = state;
            this.$eventBus = components_5.application.EventBus;
            this.registerEvent();
        }
        onHide() {
            for (let event of this.clientEvents) {
                event.unregister();
            }
            this.clientEvents = [];
        }
        get onStake() {
            return this._onStake;
        }
        set onStake(callback) {
            this._onStake = callback;
        }
        get cardData() {
            return this._cardData;
        }
        set cardData(value) {
            this._cardData = value;
            this.pnlSlots.clearInnerHTML();
            this.pnlSlots.append(this.$render("i-label", { caption: "Available Slots", class: "label" }));
            let slotText = new eth_wallet_4.BigNumber(value.slot).lt(10) ? ('0' + value.slot) : value.slot;
            let slotArr = slotText.split('');
            for (let text of slotArr) {
                this.pnlSlots.append(this.$render("i-label", { caption: text, class: "box box-left" }));
            }
            if (this.stakeAmountText)
                this.stakeAmountText.caption = value.stakeAmountText;
            if (this.reward)
                this.reward.caption = value.rewardsBoost;
            if (this.monthlyReward)
                this.monthlyReward.caption = value.monthlyReward;
            if (this.flashSales)
                this.flashSales.caption = value.flashSales;
            function capitalizeFirstLetter(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
            if (this.trollImage) {
                const img1 = new components_5.Image();
                const img2 = new components_5.Image();
                const img3 = new components_5.Image();
                const img4 = new components_5.Image();
                const img5 = new components_5.Image();
                const trollText = new components_5.Label();
                const trollType = capitalizeFirstLetter(value.tier);
                img1.url = assets_2.default.fullPath(`img/nft/${trollType}-Troll-01-Skin.svg`);
                img2.url = assets_2.default.fullPath(`img/nft/${trollType}-Troll-01-Horn.svg`);
                img3.url = assets_2.default.fullPath(`img/nft/${trollType}-Troll-01-Mouth.svg`);
                img4.url = assets_2.default.fullPath(`img/nft/${trollType}-Troll-01-Shirt.svg`);
                img5.url = assets_2.default.fullPath(`img/nft/${trollType}-Troll-01-Eyes.svg`);
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
            if (!(0, index_2.isWalletConnected)()) {
                this.btnHandleStake.caption = 'No Wallet';
                this.btnHandleStake.enabled = false;
            }
            else {
                const isSoldedOut = this.cardData?.slot == 0;
                this.btnHandleStake.caption = isSoldedOut ? 'Sold Out' : 'Stake';
                this.btnHandleStake.enabled = !isSoldedOut;
            }
        }
        registerEvent() {
            this.clientEvents.push(this.$eventBus.register(this, "isWalletConnected" /* EventId.IsWalletConnected */, this.updateBtn));
            this.clientEvents.push(this.$eventBus.register(this, "IsWalletDisconnected" /* EventId.IsWalletDisconnected */, this.updateBtn));
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
                    this.$render("i-panel", { id: "pnlSlots", class: "available-box" },
                        this.$render("i-label", { caption: "Available Slots", class: "label" }),
                        this.$render("i-label", { id: "caption1", caption: "0", class: "box box-left" }),
                        this.$render("i-label", { id: "caption2", caption: "0", class: "box box-right" })),
                    this.$render("i-panel", { id: "trollImage", class: "troll-img" },
                        this.$render("i-image", { url: assets_2.default.fullPath('img/nft/Background.svg'), class: "background" }),
                        this.$render("i-image", { url: assets_2.default.fullPath('img/nft/Frame.svg'), class: "frame" })),
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
                        this.$render("i-button", { id: "btnHandleStake", height: "auto", class: "btn-stake btn-os", caption: "Stake", onClick: this.handleStake }),
                        this.$render("i-hstack", { horizontalAlignment: "start", verticalAlignment: "center", margin: { top: '0.25rem', bottom: '0.25rem' } },
                            this.$render("i-label", { caption: "View contract", onClick: this.openLink, margin: { right: '0.5rem' }, class: "text-yellow pointer" }),
                            this.$render("i-icon", { name: "external-link-alt", onClick: this.openLink, fill: "#f7d063", width: 15, height: 15, class: "text-yellow pointer" }))))));
        }
    };
    NftCard = __decorate([
        (0, components_5.customElements)('nft-card')
    ], NftCard);
    exports.NftCard = NftCard;
});
define("@scom/oswap-nft-widget/nft-utils/myCard.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.myCardStyle = void 0;
    exports.myCardStyle = components_6.Styles.style({
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
                                fontSize: '14px',
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
define("@scom/oswap-nft-widget/nft-utils/myCard.tsx", ["require", "exports", "@ijstech/components", "@scom/oswap-nft-widget/nft-utils/myCard.css.ts"], function (require, exports, components_7, myCard_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NftMyCard = void 0;
    let NftMyCard = class NftMyCard extends components_7.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        get cardData() {
            return this._cardData;
        }
        set cardData(value) {
            this._cardData = value;
            if (this.stakeAmount)
                this.stakeAmount.caption = value.stakeAmountText;
            if (this.reward)
                this.reward.caption = value.rewardsBoost;
            if (this.monthlyReward)
                this.monthlyReward.caption = value.monthlyRewardText;
            if (this.flashSales)
                this.flashSales.caption = value.flashSales;
            if (this.birthday)
                this.birthday.caption = value.birthday;
            if (this.rarity) {
                for (let i = 0; i < value.rarity; i++) {
                    this.renderStar();
                }
            }
            if (this.trollImage) {
                const img1 = new components_7.Image();
                img1.url = value.image;
                this.trollImage.appendChild(img1);
            }
        }
        async renderStar() {
            let icon = await components_7.Icon.create();
            icon.name = 'star';
            icon.fill = '#fff';
            icon.width = 20;
            icon.height = 20;
            this.rarity.appendChild(icon);
        }
        get onBurn() {
            return this._onBurn;
        }
        set onBurn(callback) {
            this._onBurn = callback;
        }
        handleFlipCard(sender, event) {
            const target = event.target;
            if (target.classList.contains('btn-burn') || target.closest('.btn-burn')) {
                this._onBurn();
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
        (0, components_7.customElements)('nft-my-card')
    ], NftMyCard);
    exports.NftMyCard = NftMyCard;
});
define("@scom/oswap-nft-widget/nft-utils/ntfColumn.ts", ["require", "exports", "@scom/scom-token-list", "@ijstech/eth-wallet"], function (require, exports, scom_token_list_3, eth_wallet_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.nftMyRewardsColumns = void 0;
    exports.nftMyRewardsColumns = [
        {
            title: 'Token',
            fieldName: 'token',
            key: 'token',
            onRenderCell: (source, token, rowData) => {
                if (!token)
                    return '';
                let tokenPath = scom_token_list_3.assets.tokenPath(token, eth_wallet_5.Wallet.getClientInstance().chainId);
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
            textAlign: 'center'
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
            onRenderCell: (source, token, rowData) => {
                return {};
            }
        }
    ];
    exports.default = {
        nftMyRewardsColumns: exports.nftMyRewardsColumns,
    };
});
define("@scom/oswap-nft-widget/nft-utils/nftAPI.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/oswap-troll-nft-contract", "@scom/oswap-drip-contract", "@scom/oswap-nft-widget/store/index.ts", "@scom/scom-token-list", "@scom/scom-commission-proxy-contract"], function (require, exports, eth_wallet_6, oswap_troll_nft_contract_1, oswap_drip_contract_1, index_3, scom_token_list_4, scom_commission_proxy_contract_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getNFTObject = exports.claimMultiple = exports.claimReward = exports.getOwnRewards = exports.getUserNFTs = exports.burnNFT = exports.mintNFT = exports.getTrollCampInfo = exports.getCommissionRate = void 0;
    const getCommissionRate = async (state, campaignId) => {
        const rpcWallet = state.getRpcWallet();
        const proxyAddress = state.getProxyAddress();
        await rpcWallet.init();
        let commissionRate = await scom_commission_proxy_contract_1.ContractUtils.getCommissionRate(rpcWallet, proxyAddress, campaignId);
        return eth_wallet_6.Utils.fromDecimals(commissionRate, 6).toFixed();
    };
    exports.getCommissionRate = getCommissionRate;
    const getCampaign = async (chainId, nftCampaign) => {
        let trollCampList;
        let creationABI;
        let contract;
        switch (nftCampaign) {
            case index_3.NFT_TYPE.OSWAP:
                trollCampList = index_3.trollCampInfoMap[chainId].filter(v => v.hide !== true);
                creationABI = 'creationTime';
                contract = oswap_troll_nft_contract_1.Contracts.TrollNFT;
                return { trollCampList, creationABI, contract };
            case index_3.NFT_TYPE.OAX:
                trollCampList = index_3.oaxNFTInfo[chainId];
                creationABI = 'creationDate';
                contract = oswap_troll_nft_contract_1.Contracts.TrollNFTV2;
                return { trollCampList, creationABI, contract };
            default:
                throw 'Invalid Campaign';
        }
    };
    const getNFTObject = async (trollAPI, nft, tokenId, owner) => {
        try {
            const wallet = eth_wallet_6.Wallet.getClientInstance();
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
        let max = new eth_wallet_6.BigNumber(base).pow(power);
        let indexRatio = index.div(max);
        let counter = 0;
        for (let i = 0; i < probability.length; i++) {
            counter = counter + probability[i];
            if (new eth_wallet_6.BigNumber(indexRatio).lt(counter)) {
                output = new eth_wallet_6.BigNumber(i).plus(1).toFixed();
                break;
            }
        }
        ;
        return output;
    };
    const getRarityByMatrix = async (attributes, info) => {
        let cumulativeProbability = new eth_wallet_6.BigNumber(1);
        for (let i = 0; i < attributes.length; i++) {
            cumulativeProbability = new eth_wallet_6.BigNumber(cumulativeProbability).times(info.attributes.probability[i][attributes[i].minus(1).toFixed()]);
        }
        for (let j = 0; j < info.attributes.rarityMatrix.length; j++) {
            if (cumulativeProbability.lte(info.attributes.rarityMatrix[j])) {
                return info.attributes.rarityMatrix.length - j;
            }
        }
        return 0;
    };
    const getTrollCampInfo = async (state, nftCampaign) => {
        const chainId = state.getChainId();
        let campaignInfo = await getCampaign(chainId, nftCampaign);
        if (!campaignInfo.trollCampList || campaignInfo.trollCampList.length == 0)
            return [];
        let wallet = state.getRpcWallet();
        let trollCamp = [];
        const tokenMap = scom_token_list_4.tokenStore.getTokenMapByChainId(chainId) || {};
        const getInfo = async (info, resolve) => {
            try {
                let trollNFT = new oswap_troll_nft_contract_1.Contracts.TrollNFT(wallet, info.contract);
                let minimumStake = await trollNFT.minimumStake();
                let cap = await trollNFT.cap();
                let totalSupply = await trollNFT.totalSupply();
                let tokenAddress = await trollNFT.stakeToken();
                let protocolFee = await trollNFT.protocolFee();
                let token = tokenMap[tokenAddress.toLowerCase()];
                trollCamp.push({
                    ...info,
                    token,
                    minimumStake: minimumStake.shiftedBy(-18).toFixed(),
                    cap: cap.toFixed(),
                    available: cap.minus(totalSupply).toFixed(),
                    protocolFee: protocolFee.shiftedBy(-18).toFixed(),
                });
                resolve();
            }
            catch (e) {
                console.log(e);
            }
        };
        let promises = campaignInfo.trollCampList.map((info, index) => {
            return new Promise(async (resolve, reject) => {
                getInfo(info, resolve);
            });
        });
        await Promise.all(promises);
        return trollCamp.sort((a, b) => a.apr - b.apr);
    };
    exports.getTrollCampInfo = getTrollCampInfo;
    const getUserNFTs = async (state, nftCampaign, address) => {
        let wallet = state.getRpcWallet();
        let chainId = wallet.chainId;
        let campaignInfo = await getCampaign(chainId, nftCampaign);
        if (!campaignInfo.trollCampList || campaignInfo.trollCampList.length == 0)
            return [];
        let trollNFTContract = campaignInfo.contract;
        let userNFT = [];
        const tokenMap = scom_token_list_4.tokenStore.getTokenMapByChainId(chainId) || {};
        const getInfo = async (info, resolve) => {
            try {
                let contractAddress = info.contract;
                let trollNFT = new trollNFTContract(wallet, contractAddress);
                let tier = info.tier;
                let allObj = {};
                let tokenAddress = await trollNFT.stakeToken();
                let token = tokenMap[tokenAddress.toLowerCase()];
                let promises = [];
                let listNFT = [];
                switch (nftCampaign) {
                    case index_3.NFT_TYPE.OSWAP:
                        allObj = await getNFTObject(trollAPI, `${tier}-troll`, undefined, address);
                        break;
                    case index_3.NFT_TYPE.OAX:
                        allObj = await getNFTObject(trollAPI, 'oax', undefined, address);
                        break;
                }
                let balance = (await trollNFT.balanceOf(address)).toNumber();
                if (!allObj.length || allObj.length != balance) { //API Fail: The count is difference right after mint/burn
                    if (balance > 0) {
                        for (let i = 0; i < balance; i++) {
                            promises.push(getInfoByDapp(info, contractAddress, token, listNFT, i));
                        }
                    }
                }
                else { //API success
                    if (allObj.length > 0) {
                        for (let i = 0; i < allObj.length; i++) {
                            promises.push(getInfoByAPI(info, allObj[i], token, listNFT));
                        }
                    }
                }
                await Promise.all(promises);
                userNFT.push({
                    ...info,
                    stakeToken: token,
                    listNFT
                });
                resolve();
            }
            catch {
            }
        };
        const getInfoByDapp = async (info, contractAddress, token, listNFT, i) => {
            let trollNFT = new trollNFTContract(wallet, contractAddress);
            let tokenID = (await trollNFT.tokenOfOwnerByIndex({
                owner: address,
                index: i
            })).toNumber();
            let stakingBalance = (await trollNFT.stakingBalance(tokenID)).toFixed();
            let birthday;
            if (trollNFT instanceof oswap_troll_nft_contract_1.Contracts.TrollNFTV2) {
                birthday = (await trollNFT.creationDate(tokenID)).toNumber();
            }
            else {
                birthday = (await trollNFT.creationTime(tokenID)).toNumber();
            }
            let attributes = await getAttributes2(trollNFT, tokenID, info.attributes.base, info.attributes.digits, info.attributes.probability);
            let rarity = 0;
            if (!rarity && attributes) {
                if (info.attributes.rarityIndex) {
                    rarity = new eth_wallet_6.BigNumber(attributes[info.attributes.rarityIndex]).toNumber();
                }
                else if (info.attributes.rarityMatrix) {
                    rarity = await getRarityByMatrix(attributes, info);
                }
            }
            let obj;
            switch (nftCampaign) {
                case index_3.NFT_TYPE.OSWAP:
                    obj = await getNFTObject(trollAPI, `${info.tier}-troll`, tokenID);
                    break;
                case index_3.NFT_TYPE.OAX:
                    obj = await getNFTObject(trollAPI, 'oax', tokenID);
                    break;
            }
            listNFT.push({
                token,
                tokenID,
                stakingBalance: eth_wallet_6.Utils.fromDecimals(stakingBalance, token.decimals).toFixed(),
                attributes,
                rarity,
                birthday,
                image: obj.image ? obj.image : undefined,
            });
        };
        const getInfoByAPI = async (info, obj, token, listNFT) => {
            let rarity = 0;
            if (nftCampaign == index_3.NFT_TYPE.OSWAP) {
                if (obj.attributes) {
                    rarity = new eth_wallet_6.BigNumber(obj.attributes[info.attributes.rarityIndex].value).toNumber();
                }
                else if (obj.attritubes) { //handle the spelling problem on api temporarily
                    rarity = new eth_wallet_6.BigNumber(obj.attritubes[info.attributes.rarityIndex].value).toNumber();
                }
            }
            else {
                rarity = obj.rarity;
            }
            let stakingBalance = obj.staking_balance ? eth_wallet_6.Utils.fromDecimals(obj.staking_balance, token.decimals).toFixed() : '0';
            listNFT.push({
                token,
                tokenID: obj.id,
                stakingBalance,
                attributes: obj.attritubes,
                rarity,
                birthday: obj.creation_time,
                image: obj.image,
            });
        };
        const trollAPI = index_3.trollAPIUrl[chainId];
        let promises = campaignInfo.trollCampList.map((info, index) => {
            return new Promise(async (resolve, reject) => {
                await getInfo(info, resolve);
            });
        });
        await Promise.all(promises);
        return userNFT;
    };
    exports.getUserNFTs = getUserNFTs;
    const mintNFT = async (contractAddress, token, amount) => {
        let receipt;
        try {
            let wallet = eth_wallet_6.Wallet.getClientInstance();
            let trollNFT = new oswap_troll_nft_contract_1.Contracts.TrollNFT(wallet, contractAddress);
            let tokenAmount = eth_wallet_6.Utils.toDecimals(amount, token.decimals);
            receipt = await trollNFT.stake(tokenAmount);
        }
        catch { }
        return receipt;
    };
    exports.mintNFT = mintNFT;
    const burnNFT = async (contractAddress, tokenID) => {
        let wallet = eth_wallet_6.Wallet.getClientInstance();
        let trollNFT = new oswap_troll_nft_contract_1.Contracts.TrollNFT(wallet, contractAddress);
        let receipt = await trollNFT.unstake(tokenID);
        return receipt;
    };
    exports.burnNFT = burnNFT;
    const getRewardInfo = async (address, i) => {
        let wallet = eth_wallet_6.Wallet.getClientInstance();
        let drip = new oswap_drip_contract_1.Contracts.Drip(wallet, address);
        let info = await drip.getInfo(i);
        const tokenAddress = (info._token || '').toLocaleLowerCase();
        let tokenMap = scom_token_list_4.tokenStore.getTokenMapByChainId(wallet.chainId) || {};
        const tokenObj = tokenMap[tokenAddress];
        const tokenDecimals = tokenObj.decimals || 18;
        return {
            token: tokenObj,
            startDate: new eth_wallet_6.BigNumber(info._startDate).shiftedBy(3).toNumber(),
            endDate: new eth_wallet_6.BigNumber(info._endDate).shiftedBy(3).toNumber(),
            claimedAmount: new eth_wallet_6.BigNumber(info._claimedAmount).shiftedBy(-tokenDecimals).toFixed(),
            unclaimedAmount: new eth_wallet_6.BigNumber(info._unclaimedFunds).shiftedBy(-tokenDecimals).toFixed(),
            totalAmount: new eth_wallet_6.BigNumber(info._totalAmount).shiftedBy(-tokenDecimals).toFixed(),
        };
    };
    const getOwnRewards = async (nft) => {
        switch (nft) {
            case index_3.NFT_TYPE.OSWAP:
                break;
            default:
                return [];
        }
        let wallet = eth_wallet_6.Wallet.getClientInstance();
        let chainId = wallet.chainId;
        let address = index_3.rewardAddress[chainId];
        if (!address)
            return [];
        let ids = await ownRewardIds(address);
        let infoTasks = [];
        for (let i = 0; i < ids.length; i++) {
            infoTasks.push(getRewardInfo(address, ids[i].toNumber()));
        }
        let infos = await Promise.all(infoTasks);
        let out = [];
        infos.forEach((info, index) => {
            out.push({
                tokenId: ids[index].toString(),
                ...info
            });
        });
        return out;
    };
    exports.getOwnRewards = getOwnRewards;
    const claimReward = async (tokenId) => {
        let wallet = eth_wallet_6.Wallet.getClientInstance();
        let chainId = wallet.chainId;
        let address = index_3.rewardAddress[chainId];
        let receipt;
        if (tokenId && address) {
            let drip = new oswap_drip_contract_1.Contracts.Drip(wallet, address);
            receipt = await drip.claim(new eth_wallet_6.BigNumber(tokenId));
        }
        return receipt;
    };
    exports.claimReward = claimReward;
    const claimMultiple = async () => {
        let wallet = eth_wallet_6.Wallet.getClientInstance();
        let chainId = wallet.chainId;
        let address = index_3.rewardAddress[chainId];
        if (!address)
            return null;
        let ids = await ownRewardIds(address);
        let task = [];
        for (let i = 0; i < ids.length; i++) {
            task.push(getRewardInfo(address, ids[i].toNumber()));
        }
        let allRewards = await Promise.all(task);
        ids = ids.filter((id, i) => new eth_wallet_6.BigNumber(allRewards[i].unclaimedAmount).gt(0));
        if (ids.length <= 0)
            return null;
        let drip = new oswap_drip_contract_1.Contracts.Drip(wallet, address);
        let receipt = await drip.claimMultiple(ids);
        return receipt;
    };
    exports.claimMultiple = claimMultiple;
    async function ownRewardIds(dripAddress) {
        let wallet = eth_wallet_6.Wallet.getClientInstance();
        let drip = new oswap_drip_contract_1.Contracts.Drip(wallet, dripAddress);
        let rewardCount = (await drip.balanceOf(wallet.address)).toNumber();
        let tasks = [];
        for (let i = 0; i < rewardCount; i++) {
            let task = drip.tokenOfOwnerByIndex({
                owner: wallet.address,
                index: i
            });
            tasks.push(task);
        }
        return await Promise.all(tasks);
    }
});
define("@scom/oswap-nft-widget/nft-utils/index.ts", ["require", "exports", "@scom/oswap-nft-widget/nft-utils/card.tsx", "@scom/oswap-nft-widget/nft-utils/myCard.tsx", "@scom/oswap-nft-widget/nft-utils/ntfColumn.ts", "@scom/oswap-nft-widget/nft-utils/nftAPI.ts"], function (require, exports, card_1, myCard_1, ntfColumn_1, nftAPI_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getNFTObject = exports.claimMultiple = exports.claimReward = exports.getOwnRewards = exports.getUserNFTs = exports.burnNFT = exports.mintNFT = exports.getTrollCampInfo = exports.getCommissionRate = exports.nftMyRewardsColumns = exports.NftMyCard = exports.NftCard = void 0;
    Object.defineProperty(exports, "NftCard", { enumerable: true, get: function () { return card_1.NftCard; } });
    Object.defineProperty(exports, "NftMyCard", { enumerable: true, get: function () { return myCard_1.NftMyCard; } });
    Object.defineProperty(exports, "nftMyRewardsColumns", { enumerable: true, get: function () { return ntfColumn_1.nftMyRewardsColumns; } });
    Object.defineProperty(exports, "getCommissionRate", { enumerable: true, get: function () { return nftAPI_1.getCommissionRate; } });
    Object.defineProperty(exports, "getTrollCampInfo", { enumerable: true, get: function () { return nftAPI_1.getTrollCampInfo; } });
    Object.defineProperty(exports, "mintNFT", { enumerable: true, get: function () { return nftAPI_1.mintNFT; } });
    Object.defineProperty(exports, "burnNFT", { enumerable: true, get: function () { return nftAPI_1.burnNFT; } });
    Object.defineProperty(exports, "getUserNFTs", { enumerable: true, get: function () { return nftAPI_1.getUserNFTs; } });
    Object.defineProperty(exports, "getOwnRewards", { enumerable: true, get: function () { return nftAPI_1.getOwnRewards; } });
    Object.defineProperty(exports, "claimReward", { enumerable: true, get: function () { return nftAPI_1.claimReward; } });
    Object.defineProperty(exports, "claimMultiple", { enumerable: true, get: function () { return nftAPI_1.claimMultiple; } });
    Object.defineProperty(exports, "getNFTObject", { enumerable: true, get: function () { return nftAPI_1.getNFTObject; } });
});
define("@scom/oswap-nft-widget/formSchema.ts", ["require", "exports", "@scom/scom-network-picker", "@scom/oswap-nft-widget/data.json.ts"], function (require, exports, scom_network_picker_1, data_json_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getProjectOwnerSchema = exports.getBuilderSchema = void 0;
    const chainIds = data_json_2.default.supportedNetworks || [];
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
define("@scom/oswap-nft-widget/index.css.ts", ["require", "exports", "@ijstech/components", "@scom/oswap-nft-widget/assets.ts"], function (require, exports, components_8, assets_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.listMediaStyles = exports.nftStyle_375 = exports.nftStyle_480 = exports.nftStyle_525 = exports.nftStyle_767 = exports.nftStyle_1100 = exports.nftDefaultStyle = exports.tabStyle = exports.nftStyle = void 0;
    const Theme = components_8.Styles.Theme.ThemeVars;
    exports.nftStyle = components_8.Styles.style({
        flex: '1 1 0% !important',
        height: '100%',
        minHeight: '100vh',
        overflow: 'auto',
        overflowX: 'hidden',
        paddingTop: '1rem',
        $nest: {
            'i-combo-box': {
                color: '#fff',
                $nest: {
                    '.item-list': {
                        background: '#1f1e4f',
                        $nest: {
                            'i-combo-box > .item-list > ul > li.matched, i-combo-box > .item-list > ul > li:hover': {
                                background: '#252a48'
                            },
                            'ul': {
                                overflow: 'unset',
                                maxHeight: 'fit-content',
                                fontSize: '14px',
                                textAlign: 'left'
                            }
                        }
                    },
                    'input': {
                        width: '100%',
                        color: '#fff',
                        background: '#1f1e4f',
                        border: 'none',
                        paddingLeft: '15px'
                    },
                    'input:focus-visible': {
                        outline: 'none'
                    },
                    '.icon-btn': {
                        display: 'flex',
                        alignItems: 'center',
                        background: '#1f1e4f',
                        color: '#fff',
                        width: 'auto !important',
                        borderRadius: '0 12px 12px 0'
                    },
                    '.selection': {
                        background: '#1f1e4f',
                        padding: 0,
                        borderRadius: '12px 0 0 12px',
                        border: 'none'
                    }
                }
            },
            'i-pagination': {
                marginBottom: '1.5rem',
                $nest: {
                    '.paginate_button': {
                        backgroundColor: 'rgb(12, 18, 52)',
                        border: '1px solid #f15e61',
                        color: '#f7d064',
                        padding: '4px 16px',
                        $nest: {
                            '&.active': {
                                backgroundColor: '#d05271',
                                border: '1px solid #d05271',
                                color: '#fff',
                            },
                        },
                    },
                },
            },
            '#myRewardTable': {
                $nest: {
                    'thead tr th': {
                        borderTop: '1px solid #f7d063',
                        borderBottom: '1px solid #f7d063',
                    },
                    'thead tr th:first-child': {
                        borderLeft: '1px solid #f7d063',
                        borderRadius: '12px 0 0 0',
                    },
                    'thead tr th:last-child': {
                        borderRadius: '0 12px 0 0',
                        borderRight: '1px solid #f7d063',
                    },
                    'tbody tr td': {
                        borderBottom: '1px solid #f7d063',
                        textAlign: 'center'
                    },
                    'tbody tr td:first-child': {
                        borderLeft: '1px solid #f7d063',
                    },
                    'tbody tr td:last-child': {
                        borderRight: '1px solid #f7d063',
                    },
                    'tbody tr:last-child td:first-child': {
                        borderRadius: ' 0 0 0 12px',
                    },
                    'tbody tr:last-child td:last-child': {
                        borderRadius: ' 0 0 12px 0',
                    }
                }
            },
            '*': {
                boxSizing: 'border-box',
            },
            '.widget': {
                position: 'relative',
                width: '100%',
            },
            '.btn-claim': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.35rem 0.5rem',
                fontWeight: 'bold',
                $nest: {
                    'i-icon': {
                        marginRight: '0.25rem',
                    },
                },
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
            '.box-description': {
                color: '#fff',
                background: 'rgba(255, 255, 255, 0.2)',
                margin: '1rem 0 0',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                $nest: {
                    'i-label': {
                        $nest: {
                            '*': {
                                fontSize: '1rem',
                            },
                        },
                    },
                },
            },
            '.current-nft': {
                position: 'absolute',
                right: 'calc(1rem - 5px)',
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
                        color: ' #6f1018',
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
                fontSize: '1.4rem',
                fontWeight: 'bold',
                color: '#f7d063',
            },
            '.render-mobile--item': {
                display: 'none',
                marginTop: '1rem',
            }
        }
    });
    exports.tabStyle = components_8.Styles.style({
        $nest: {
            '.tabs-nav-wrap': {
                marginBottom: '2rem',
                background: 'transparent',
                $nest: {
                    '.tabs-nav': {
                        gap: '0 !important',
                        border: 'none',
                        flexWrap: 'wrap',
                        width: '100%',
                        maxWidth: 'calc(100% - 175px)',
                    },
                    'i-tab': {
                        minWidth: '33.33%',
                        // background: Theme.background.default,
                        padding: '9px 16px',
                        display: 'flex',
                        alignSelf: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        background: "transparent",
                        marginBottom: '0px',
                        border: "none",
                        borderBottom: '4px solid transparent',
                        $nest: {
                            'i-label *': {
                                fontSize: '1.3125rem',
                                fontWeight: 700,
                                marginLeft: '7px',
                                display: 'inline-block'
                            },
                            '&::after': {
                                position: 'absolute',
                                bottom: '-1px',
                                width: '100%',
                                borderBottomColor: Theme.colors.warning.main + ' !important',
                                borderBottomWidth: '4px !important',
                                left: 0,
                            },
                            '.tab-item': {
                                fontFamily: Theme.typography.fontFamily,
                            },
                        },
                    },
                    'i-tab:not(.disabled).active': {
                        // background: Theme.background.gradient
                        backgroundColor: 'transparent',
                        borderBottom: '4px solid #e2c05e',
                    },
                    '.tab-item': {
                        margin: 'auto'
                    }
                }
            }
        }
    });
    exports.nftDefaultStyle = components_8.Styles.style({
        $nest: {
            '.custom-card-column': {
                width: 'calc(25% - 30px)'
            }
        }
    });
    exports.nftStyle_1100 = components_8.Styles.style({
        $nest: {
            '.custom-card-column, .new-card-column': {
                width: 'calc(50% - 30px)'
            }
        }
    });
    exports.nftStyle_767 = components_8.Styles.style({
        $nest: {
            '.custom-card-column, .new-card-column': {
                margin: '0 auto 1.5rem'
            },
            '.mobile-hidden': {
                display: 'none !important'
            },
            '.render-mobile--item': {
                display: 'flex',
                $nest: {
                    'i-label': {
                        whiteSpace: 'nowrap',
                        textAlign: 'left',
                        lineHeight: '1rem'
                    },
                    'i-label *': {
                        fontSize: '0.8rem'
                    },
                    '.custom-min--h': {
                        minHeight: '32px'
                    }
                }
            }
        }
    });
    exports.nftStyle_525 = components_8.Styles.style({
        $nest: {
            '.current-nft': {
                position: 'relative',
                maxWidth: '12.5rem',
                right: 0,
                top: 0,
                margin: '1rem auto',
                textAlign: 'center'
            },
            '.nft-tabs .tabs-nav': {
                maxWidth: '100%',
                $nest: {
                    'i-tab': {
                        width: 'max-content',
                        minWidth: '12rem'
                    }
                }
            },
            '.troll-img': {
                width: '160px',
                height: '220px',
                $nest: {
                    'i-label': {
                        height: '30px'
                    },
                    'i-label *': {
                        fontSize: '.75rem',
                        lineHeight: '1rem'
                    }
                }
            },
            '.note-burn *': {
                fontSize: '1.125rem'
            }
        }
    });
    exports.nftStyle_480 = components_8.Styles.style({
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
    exports.nftStyle_375 = components_8.Styles.style({
        $nest: {
            '#myRewardTable .i-table-body>tr>td': {
                padding: '1rem 0.5rem'
            }
        }
    });
    exports.listMediaStyles = {
        375: exports.nftStyle_375,
        480: exports.nftStyle_480,
        525: exports.nftStyle_525,
        767: exports.nftStyle_767,
        1100: exports.nftStyle_1100
    };
});
define("@scom/oswap-nft-widget", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/oswap-nft-widget/store/index.ts", "@scom/oswap-nft-widget/global/index.ts", "@scom/oswap-nft-widget/assets.ts", "@scom/scom-commission-fee-setup", "@scom/scom-token-list", "@scom/oswap-nft-widget/nft-utils/index.ts", "@scom/oswap-nft-widget/formSchema.ts", "@scom/oswap-nft-widget/index.css.ts", "@scom/oswap-nft-widget/data.json.ts"], function (require, exports, components_9, eth_wallet_7, index_4, index_5, assets_4, scom_commission_fee_setup_1, scom_token_list_5, index_6, formSchema_1, index_css_1, data_json_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_9.Styles.Theme.ThemeVars;
    let myRewardData = [];
    let ScomOswapNftWidget = class ScomOswapNftWidget extends components_9.Module {
        constructor(parent, options) {
            super(parent, options);
            this.currentTab = 0 /* KEY_TAB.NEW_NFT */;
            this._data = {
                defaultChainId: 0,
                wallets: [],
                networks: []
            };
            this.tag = {};
            this.initWallet = async () => {
                try {
                    await eth_wallet_7.Wallet.getClientInstance().init();
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
                scom_token_list_5.tokenStore.updateTokenMapData(this.chainId);
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
                            const vstack = new components_9.VStack();
                            await self.loadCommissionFee();
                            const config = new scom_commission_fee_setup_1.default(null, {
                                commissions: self._data.commissions || [],
                                fee: self.state.embedderCommissionFee,
                                networks: self._data.networks
                            });
                            const hstack = new components_9.HStack(null, {
                                verticalAlignment: 'center',
                            });
                            const button = new components_9.Button(hstack, {
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
                        const defaultData = data_json_3.default.defaultBuilderData;
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
            const rpcWalletId = await this.state.initRpcWallet(this.defaultChainId);
            const rpcWallet = this.state.getRpcWallet();
            const chainChangedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_7.Constants.RpcWalletEvent.ChainChanged, async (chainId) => {
                this.onChainChange();
            });
            const connectedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_7.Constants.RpcWalletEvent.Connected, async (connected) => {
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
                scom_token_list_5.tokenStore.updateTokenMapData(network.chainId);
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
        myRewardsCols() {
            let cols = index_6.nftMyRewardsColumns;
            const self = this;
            cols[cols.length - 1] = {
                title: '',
                fieldName: 'claim',
                key: 'claim',
                onRenderCell: async function (source, data, row) {
                    const panel = await components_9.Panel.create();
                    const button = await components_9.Button.create();
                    button.caption = 'Claim';
                    button.classList.add('btn-claim', 'btn-os');
                    button.onClick = () => self.claimAllRewards(button, row.tokenId);
                    panel.appendChild(button);
                    const vstackMobile = new components_9.VStack();
                    const hstackDate = new components_9.HStack(undefined, { margin: { bottom: '0.5rem' } });
                    const hstackAmount = new components_9.HStack();
                    const lbDate = await components_9.Label.create({ margin: { right: '0.25rem' } });
                    const lbDateVal = await components_9.Label.create();
                    const lbAmount = await components_9.Label.create({ margin: { right: '0.25rem' } });
                    const lbAmountVal = await components_9.Label.create();
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
            };
            return cols;
        }
        async refreshUI() {
            await this.initializeWidgetConfig();
        }
        isEmptyData(value) {
            return !value || !value.networks || value.networks.length === 0;
        }
        async init() {
            super.init();
            this.state = new index_4.State(data_json_3.default);
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
                    this.btnApprove.caption = `Approve ${token.symbol}`;
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
            await scom_token_list_5.tokenStore.updateTokenBalancesByChainId(this.state.getChainId());
        }
        async switchNetworkByWallet() {
            if (this.mdWallet) {
                await components_9.application.loadPackage('@scom/scom-wallet-modal', '*');
                this.mdWallet.networks = this.networks;
                this.mdWallet.wallets = this.wallets;
                this.mdWallet.showModal();
            }
        }
        onChangeTab(key) {
            if (key === this.currentTab)
                return;
            this.currentTab = key;
            this.resizeUI();
            switch (key) {
                case 0 /* KEY_TAB.NEW_NFT */:
                    this.renderCards();
                    break;
                case 1 /* KEY_TAB.MY_NFTS */:
                    this.renderMyCards();
                    break;
                case 2 /* KEY_TAB.MY_REWARD */:
                    this.renderMyReward();
                    break;
                default:
                    break;
            }
        }
        renderEmpty(elm, _msg) {
            if (!elm)
                return;
            let msg = '';
            if ((0, index_4.isWalletConnected)()) {
                switch (this.currentTab) {
                    case 0 /* KEY_TAB.NEW_NFT */:
                        msg = 'Your very own NFT is getting ready!';
                        break;
                    case 1 /* KEY_TAB.MY_NFTS */:
                        msg = 'You have no NFT in the My NFTs!';
                        break;
                }
            }
            else {
                msg = _msg || 'Please connect with you wallet!';
            }
            elm.innerHTML = '';
            elm.appendChild(this.$render("i-panel", { width: "100%" },
                this.$render("i-hstack", { gap: "32px" },
                    this.$render("i-panel", { border: { radius: '12px' }, background: { color: "#ffffff33" }, width: "100%", height: "auto" },
                        this.$render("i-vstack", { padding: { top: 30, bottom: 30 }, horizontalAlignment: "center" },
                            this.$render("i-panel", { class: "text-center", width: "100%" },
                                this.$render("i-image", { url: assets_4.default.fullPath('img/nft/TrollEgg.svg'), width: 200, height: "auto" })),
                            this.$render("i-label", { class: "text-center", width: "100%", margin: { top: 20 }, caption: msg, font: { color: 'white', size: '1.5rem' } }))))));
        }
        ;
        renderMyRewardEmpty(source) {
            const emptyElm = (this.$render("i-hstack", { verticalAlignment: "center", width: "100%" },
                this.$render("i-image", { url: assets_4.default.fullPath('img/icon-advice.svg') }),
                this.$render("i-panel", null,
                    this.$render("i-label", { id: "emptyRewardsMsg", caption: "No Data", font: { size: '1rem', bold: true }, margin: { left: 10 } }))));
            const td = source.querySelector('td');
            td && td.appendChild(emptyElm);
        }
        renderData() {
            switch (this.currentTab) {
                case 0 /* KEY_TAB.NEW_NFT */:
                    this.renderCards();
                    break;
                case 1 /* KEY_TAB.MY_NFTS */:
                    this.renderMyCards();
                    break;
                case 2 /* KEY_TAB.MY_REWARD */:
                    this.renderMyReward();
                    break;
                default:
                    break;
            }
        }
        async renderMyReward() {
            if (!(0, index_4.isWalletConnected)()) {
                this.btnClaimAll.visible = false;
                this.myRewardTable.data = [];
                if (this.myRewardTable.pagination)
                    this.myRewardTable.pagination.totalPages = 0;
                this.emptyRewardsMsg.caption = 'Please connect with your wallet!';
                if (this.myRewardLoading)
                    this.myRewardLoading.visible = false;
                return;
            }
            if (this.myRewardLoading)
                this.myRewardLoading.visible = true;
            let info = await (0, index_6.getOwnRewards)(index_4.NFT_TYPE.OSWAP);
            myRewardData = [];
            if (!info || !info.length) {
                this.emptyRewardsMsg.caption = 'No Data';
                this.myRewardTable.data = [];
                if (this.myRewardTable.pagination)
                    this.myRewardTable.pagination.totalPages = 0;
                this.btnClaimAll.visible = false;
                this.myRewardLoading.visible = false;
                return;
            }
            if (!this.btnClaimAll.visible) {
                this.btnClaimAll.visible = true;
            }
            for (let item of info) {
                let lockedAmount = new eth_wallet_7.BigNumber(item.totalAmount).minus(new eth_wallet_7.BigNumber(item.claimedAmount).plus(item.unclaimedAmount)).toFixed();
                myRewardData.push({
                    tokenId: item.tokenId,
                    token: item.token,
                    startDate: (0, index_5.formatDate)(item.startDate),
                    endDate: (0, index_5.formatDate)(item.endDate),
                    lockedAmount: (0, index_5.formatNumber)(lockedAmount, 4),
                    claimableAmount: (0, index_5.formatNumber)(item.unclaimedAmount, 4)
                });
            }
            this.myRewardTable.data = myRewardData;
            if (this.myRewardTable.pagination)
                this.myRewardTable.pagination.totalPages = Math.ceil(myRewardData.length / 10);
            if (this.myRewardLoading)
                this.myRewardLoading.visible = false;
        }
        async renderCards() {
            let info = await (0, index_6.getTrollCampInfo)(this.state, index_4.NFT_TYPE.OSWAP);
            this.dataCards = [];
            if (!info || !info.length) {
                this.renderEmpty(this.cardRow, 'Your very own NFT is getting ready!');
                return;
            }
            for (let item of info) {
                let totalPayAmount = new eth_wallet_7.BigNumber(item.minimumStake).plus(item.protocolFee).toFixed();
                this.dataCards.push({
                    address: item.contract,
                    flashSales: item.flashSales,
                    monthlyReward: `${item.apr}% APR`,
                    rewardsBoost: `${item.rewards}%`,
                    tier: item.tier,
                    slot: item.available,
                    stakeAmount: item.minimumStake,
                    stakeToken: item.token,
                    stakeAmountText: `${(0, index_5.formatNumber)(item.minimumStake)} ${item.token?.symbol || ''}`,
                    protocolFee: item.protocolFee,
                    totalPayAmount
                });
            }
            this.cardRow.clearInnerHTML();
            this.dataCards.forEach((item, key) => {
                const column = new components_9.VStack();
                column.classList.add('nft-card-column', 'new-card-column');
                column.stack = { basis: '0%', shrink: '1', grow: '1' };
                const elm = new index_6.NftCard(this.state);
                column.appendChild(elm);
                this.cardRow.appendChild(column);
                elm.onStake = () => this.onStake(item);
                elm.cardData = item;
            });
        }
        async renderMyCards() {
            if (!(0, index_4.isWalletConnected)()) {
                this.myNFTsInfoPanel.visible = false;
                this.renderEmpty(this.myCardRow);
                if (this.myNFTsLoading)
                    this.myNFTsLoading.visible = false;
                return;
            }
            if (this.myNFTsLoading) {
                this.myCardRow.clearInnerHTML();
                this.myNFTsLoading.visible = true;
            }
            let userNFTs = await (0, index_6.getUserNFTs)(this.state, index_4.NFT_TYPE.OSWAP, eth_wallet_7.Wallet.getClientInstance().address);
            this.dataMyCards = [];
            this.myCardRow.clearInnerHTML();
            if (userNFTs.length == 0 || userNFTs.every((f) => !f.listNFT.length)) {
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
                    let myCard = {
                        address: nftTypeItem.contract,
                        flashSales: nftTypeItem.flashSales,
                        monthlyRewardAPR: nftTypeItem.apr,
                        monthlyRewardText: `${nftTypeItem.apr}% APR`,
                        rewardsBoost: `${nftTypeItem.rewards}%`,
                        tier: nftTypeItem.tier,
                        trollNumber: item.tokenID,
                        stakeToken: item.token,
                        stakeAmount: item.stakingBalance,
                        stakeAmountText: `${(0, index_5.formatNumber)(item.stakingBalance)} ${item.token?.symbol || ''}`,
                        rarity: item.rarity,
                        birthday: components_9.moment.unix(item.birthday).format(index_5.DefaultDateFormat),
                        image: item.image
                    };
                    this.dataMyCards.push(myCard);
                }
            }
            let stakeToken = userNFTs[0].stakeToken;
            if (this.dataMyCards.length > 0) {
                this.lbMyNFTsNum.caption = `${(0, index_5.formatNumberWithSeparators)(this.dataMyCards.length)}`;
                let totalStakeAmount = this.dataMyCards.reduce((prev, curr) => {
                    return prev.plus(curr.stakeAmount);
                }, new eth_wallet_7.BigNumber(0));
                this.lbMyNFTsStakeValue.caption = `${(0, index_5.formatNumber)(totalStakeAmount.toFixed(), 4)} ${stakeToken.symbol}`;
            }
            else {
                this.lbMyNFTsNum.caption = '0';
                this.lbMyNFTsStakeValue.caption = `0 ${stakeToken.symbol}`;
            }
            this.dataMyCards = this.dataMyCards.sort((a, b) => b.monthlyRewardAPR - a.monthlyRewardAPR || b.rarity - a.rarity || a.trollNumber - b.trollNumber);
            this.dataMyCards.forEach((item, key) => {
                const card = new components_9.Panel();
                card.classList.add('nft-card-column', 'custom-card-column');
                const elm = new index_6.NftMyCard();
                card.appendChild(elm);
                this.myCardRow.appendChild(card);
                elm.onBurn = () => this.handleBurn(item);
                elm.cardData = item;
            });
            if (this.myNFTsLoading)
                this.myNFTsLoading.visible = false;
        }
        async onSubmit(isMint) {
            if (!(0, index_4.isWalletConnected)()) {
                this.switchNetworkByWallet();
                return;
            }
            else if (!this.state.isRpcWalletConnected()) {
                const chainId = this.state.getChainId();
                const clientWallet = eth_wallet_7.Wallet.getClientInstance();
                await clientWallet.switchNetwork(chainId);
                return;
            }
            if (isMint) {
                await this.handleMint();
            }
            else {
                await this.handleConfirmBurn();
            }
        }
        async onStake(item) {
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
            let tokenBalances = scom_token_list_5.tokenStore.getTokenBalancesByChainId(this.chainId) || {};
            let tokenBalance = tokenBalances[item.stakeToken.address.toLowerCase()];
            this.lbTokenBalance.caption = (0, index_5.formatNumber)(tokenBalance, 4);
            this.ImageMintStakeToken.url = scom_token_list_5.assets.tokenPath(item.stakeToken, eth_wallet_7.Wallet.getClientInstance().chainId);
            this.lbMintStakeToken.caption = stakeTokenSymbol;
            this.lbMintMessage1.caption = `Please confirm you would like to mint a NFT by staking of ${item.stakeAmount} of ${stakeTokenSymbol}.`;
            this.lbMintMessage2.caption = `You can unstake ${stakeTokenSymbol} by the burning the NFT.`;
            await this.initApprovalModelAction(item);
            this.approvalModelAction.checkAllowance(item.stakeToken, new eth_wallet_7.BigNumber(item.totalPayAmount).toFixed());
        }
        async claimAllRewards(btn, tokenId) {
            (0, index_5.showResultMessage)(this.txStatusModal, 'warning', 'Claiming');
            const txHashCallback = (err, receipt) => {
                if (err) {
                    (0, index_5.showResultMessage)(this.txStatusModal, 'error', err);
                }
                else if (receipt) {
                    btn.rightIcon.visible = true;
                    if (tokenId === undefined) {
                        const btnClaims = this.myRewardTable.querySelectorAll('.btn-claim');
                        btnClaims.forEach((elm) => elm.rightIcon.visible = true);
                    }
                    else {
                        this.btnClaimAll.rightIcon.visible = true;
                    }
                    (0, index_5.showResultMessage)(this.txStatusModal, 'success', receipt);
                }
            };
            const confirmationCallback = async (receipt) => {
                await this.renderMyReward();
                btn.rightIcon.visible = false;
                if (tokenId === undefined) {
                    const btnClaims = this.myRewardTable.querySelectorAll('.btn-claim');
                    btnClaims.forEach((elm) => elm.rightIcon.visible = false);
                }
                else {
                    this.btnClaimAll.rightIcon.visible = false;
                }
            };
            (0, index_5.registerSendTxEvents)({
                transactionHash: txHashCallback,
                confirmation: confirmationCallback
            });
            if (tokenId === undefined) {
                await (0, index_6.claimMultiple)();
            }
            else {
                await (0, index_6.claimReward)(tokenId);
            }
        }
        async handleMint() {
            await this.approvalModelAction.doPayAction();
        }
        clickApprove() {
            this.approvalModelAction.doApproveAction(this.currentDataCard.stakeToken, new eth_wallet_7.BigNumber(this.currentDataCard.totalPayAmount).toFixed());
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
                this.renderMyCards();
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
                        this.$render("i-panel", { class: "current-nft" },
                            this.$render("i-label", { caption: "oswap" })),
                        this.$render("i-tabs", { id: "tabs", width: "100%", height: "100%", mode: "horizontal", class: index_css_1.tabStyle, onChanged: this.onChangeTab.bind(this) },
                            this.$render("i-tab", { caption: "New NFT", icon: { image: { url: assets_4.default.fullPath('img/nft/Tiers.svg') } }, onClick: () => this.onChangeTab(0 /* KEY_TAB.NEW_NFT */) },
                                this.$render("i-panel", { padding: { left: '1rem', right: '1rem' } },
                                    this.$render("i-hstack", { gap: "2rem", id: "cardRow", wrap: "wrap" }))),
                            this.$render("i-tab", { caption: "My NFTs", icon: { image: { url: assets_4.default.fullPath('img/nft/NFT.svg') } }, onClick: () => this.onChangeTab(1 /* KEY_TAB.MY_NFTS */) },
                                this.$render("i-panel", null,
                                    this.$render("i-vstack", { id: "myNFTsLoading", padding: { top: 100 }, class: "i-loading-overlay" },
                                        this.$render("i-vstack", { class: "i-loading-spinner", horizontalAlignment: "center", verticalAlignment: "center" },
                                            this.$render("i-icon", { class: "i-loading-spinner_icon", image: { url: assets_4.default.fullPath('img/loading.svg'), width: 36, height: 36 } }),
                                            this.$render("i-label", { caption: "Loading...", font: { color: '#FD4A4C', size: '1.5em' }, class: "i-loading-spinner_text" }))),
                                    this.$render("i-panel", { padding: { left: '1rem', right: '1rem' }, class: "tab-sheet--container" },
                                        this.$render("i-panel", { id: "myNFTsInfoPanel", margin: { bottom: '0.25rem' }, class: "box-description" },
                                            this.$render("i-hstack", null,
                                                this.$render("i-hstack", { minWidth: "50%" },
                                                    this.$render("i-label", { caption: "Number of NFTs:", margin: { right: '0.25rem' } }),
                                                    this.$render("i-label", { id: "lbMyNFTsNum", font: { bold: true } })),
                                                this.$render("i-hstack", { minWidth: "50%" },
                                                    this.$render("i-label", { caption: "Stake Value:", margin: { right: '0.25rem' } }),
                                                    this.$render("i-label", { id: "lbMyNFTsStakeValue", font: { bold: true } })))),
                                        this.$render("i-hstack", { gap: "2rem", id: "myCardRow", wrap: "wrap", margin: { top: '2rem' } })))),
                            this.$render("i-tab", { caption: "My Reward", onClick: () => this.onChangeTab(2 /* KEY_TAB.MY_REWARD */), icon: { image: { url: assets_4.default.fullPath('img/nft/NFT.svg') } } },
                                this.$render("i-panel", null,
                                    this.$render("i-vstack", { id: "myRewardLoading", padding: { top: 100 }, class: "i-loading-overlay" },
                                        this.$render("i-vstack", { class: "i-loading-spinner", horizontalAlignment: "center", verticalAlignment: "center" },
                                            this.$render("i-icon", { class: "i-loading-spinner_icon", image: { url: assets_4.default.fullPath('img/loading.svg'), width: 36, height: 36 } }),
                                            this.$render("i-label", { caption: "Loading...", font: { color: '#FD4A4C', size: '1.5em' }, class: "i-loading-spinner_text" }))),
                                    this.$render("i-hstack", { horizontalAlignment: "center", padding: { left: 18, right: 18, bottom: 18 } },
                                        this.$render("i-button", { id: "btnClaimAll", caption: "Claim All", class: "btn-os btn-claim", rightIcon: { spin: true, visible: false }, onClick: () => this.claimAllRewards(this.btnClaimAll) })),
                                    this.$render("i-table", { id: "myRewardTable", columns: this.myRewardsCols(), data: myRewardData, mediaQueries: [
                                            {
                                                maxWidth: '767px',
                                                properties: {
                                                    fieldNames: ['token', 'claim']
                                                }
                                            }
                                        ], onRenderEmptyTable: this.renderMyRewardEmpty.bind(this) }))))),
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
                                            this.$render("i-hstack", { class: "mb-1", verticalAlignment: 'center', horizontalAlignment: 'space-between' },
                                                this.$render("i-label", { caption: "Stake Amount" }),
                                                this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'end' },
                                                    this.$render("i-label", { font: { color: '#f7d063', size: '1.2rem' }, margin: { right: 4 }, caption: "Balance: " }),
                                                    this.$render("i-label", { id: "lbTokenBalance", font: { color: '#f7d063', size: '1.2rem' }, caption: "10000" }))),
                                            this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'space-between' },
                                                this.$render("i-label", { id: "lbMintStakeAmount", font: { color: '#f7d063', size: '1.2rem' }, caption: "50000" }),
                                                this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'end' },
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
                this.$render("i-scom-wallet-modal", { id: "mdWallet", wallets: [] })));
        }
    };
    ScomOswapNftWidget = __decorate([
        components_9.customModule,
        (0, components_9.customElements)('i-scom-oswap-nft-widget')
    ], ScomOswapNftWidget);
    exports.default = ScomOswapNftWidget;
});
