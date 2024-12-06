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

export const trollAPIUrl: Record<SupportedNetworkId,string> = {
  56: 'https://data.openswap.xyz/nft/v1',
  97: 'https://bsc-test-data.openswap.xyz/nft/v1',
}

//General Troll Attribute Distribution
export interface AttributeDistribution { base: number, digits: number[], probability: number[][], rarityIndex: number }
export const attributeDistribution: AttributeDistribution = {
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
}
export interface NftInfoStore {
  chainId: SupportedNetworkId,
  name: OswapNfts,
  fullName: string,
  address: string,
  token: TokenConstant,
  rewards: number, // oswap staking bouns in %
  apr: number, // apr to holder in %
  flashSales: string, //description to the level of Flash Sales Inclusion
  attributes: AttributeDistribution,
}

export enum SupportedNetworkId { 
  bscMain=56,
  bscTest=97,
}

export const defaultChainId = SupportedNetworkId.bscMain;
export enum OswapNfts {
  tier1="hungry",
  tier2="happy",
  tier3="hunny"
}
export type OswapNftsType = "hungry" | "happy" | "hunny";

export const stakeTokenMap: Record<SupportedNetworkId, TokenConstant> = {
  56: {address:"0xb32aC3C79A94aC1eb258f3C830bBDbc676483c93",decimals:18,name:"OpenSwap",symbol:"OSWAP"},
  97: {address:"0x45eee762aaeA4e5ce317471BDa8782724972Ee19",decimals:18,name:"OpenSwap",symbol:"OSWAP"},
}
export const nftInfoStoreMap: Record<SupportedNetworkId,Record<OswapNfts, NftInfoStore>> = {
  56: {
    [OswapNfts.tier1]:{
      chainId: 56,
      name: OswapNfts.tier1,
      fullName: "Hungry Baby Troll",
      address: '0x1254132567549292388cd699Cb78B47d3101c8A9',
      token: stakeTokenMap[56],
      rewards: 5,
      apr: 2,
      flashSales: '$periodic',
      attributes: attributeDistribution
    },
    [OswapNfts.tier2]:{
      chainId: 56,
      name: OswapNfts.tier2,
      fullName: "Happy Baby Troll",
      address: '0x2d74990f55faeA086A83B9fE176FD36a34bA617b',
      token: stakeTokenMap[56],
      rewards: 15,
      apr: 4,
      flashSales: '$priority',
      attributes: attributeDistribution
    },
    [OswapNfts.tier3]:{
      chainId: 56,
      name: OswapNfts.tier3,
      fullName: "Hunny Baby Troll",
      address: '0x3E8fb94D9dD7A8f9b2ccF0B4CCdC768628890eeB',
      token: stakeTokenMap[56],
      rewards: 40,
      apr: 6,
      flashSales: '$guaranteed',
      attributes: attributeDistribution
    },
  },
  97: {
    [OswapNfts.tier1]:{
      chainId: 97,
      name: OswapNfts.tier1,
      fullName: "Hungry Baby Troll",
      address: '0x946985e7C43Ed2fc7985e89a49A251D52d824122',
      token: stakeTokenMap[97],
      rewards: 5,
      apr: 2,
      flashSales: '$periodic',
      attributes: attributeDistribution
    },
    [OswapNfts.tier2]:{
      chainId: 97,
      name: OswapNfts.tier2,
      fullName: "Happy Baby Troll",
      address: '0x157538c2d508CDb1A6cf48B8336E4e56350A97C8',
      token: stakeTokenMap[97],
      rewards: 15,
      apr: 4,
      flashSales: '$priority',
      attributes: attributeDistribution
    },
    [OswapNfts.tier3]:{
      chainId: 97,
      name: OswapNfts.tier3,
      fullName: "Hunny Baby Troll",
      address: '0xB9425ddFB534CA87B73613283F4fB0073B63F31D',
      token: stakeTokenMap[97],
      rewards: 40,
      apr: 6,
      flashSales: '$guaranteed',
      attributes: attributeDistribution
    },
  },
}
