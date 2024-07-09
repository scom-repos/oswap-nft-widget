import ScomNetworkPicker from '@scom/scom-network-picker';
import Config from './data.json';
import { OswapNfts } from './store/index';

const chainIds = (Config.supportedNetworks || []).map(v => v.chainId);
const networks = chainIds.map(v => { return { chainId: v } });

export function getBuilderSchema() {
    return {
        dataSchema: {
            type: 'object',
            properties: {
                tier: {
                    type: 'string',
                    required: true,
                    enum: Object.values(OswapNfts)
                },
                networks: {
                    type: 'array',
                    required: true,
                    items: {
                        type: 'object',
                        maxItems: chainIds.length,
                        properties: {
                            chainId: {
                                type: 'number',
                                enum: chainIds,
                                required: true
                            }
                        }
                    }
                }
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
                            type: 'VerticalLayout',
                            elements: [
                                {
                                    type: 'Control',
                                    scope: '#/properties/tier'
                                },
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
        },
        customControls() {
            return {
                '#/properties/networks/properties/chainId': {
                    render: () => {
                        const networkPicker = new ScomNetworkPicker(undefined, {
                            type: 'combobox',
                            networks
                        });
                        return networkPicker;
                    },
                    getData: (control: ScomNetworkPicker) => {
                        return control.selectedNetwork?.chainId;
                    },
                    setData: async (control: ScomNetworkPicker, value: number) => {
                        await control.ready();
                        control.setNetworkByChainId(value);
                    }
                }
            }
        }
    }
}

export function getProjectOwnerSchema() {
    return null
}