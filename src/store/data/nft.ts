import { ITokenObject } from "@scom/scom-token-list";


enum NFT_TYPE {
  OSWAP = 'oswap',
  OAX = 'oax',
}

const trollAPIUrl: { [key: number]: string } = {
  56: 'https://data.openswap.xyz/nft/v1',
  97: 'https://bsc-test-data.openswap.xyz/nft/v1',
  31337: 'https://amino.openswap.xyz/nft/v1',
  43113: 'https://bsc-test-data.openswap.xyz/nft/v1'  //FIXME
}

const rewardAddress: { [key: number]: string } = {
  56: '0x37c8207975D5B04cc6c2C2570d91425985cF61Df',
  97: '0x265F91CdFC308275504120E32B6A2B09B066df1a',
}

const attributesDistribution: { [key: string]: { base: number, digits: number[], probability: number[][], rarityIndex: number | null, rarityMatrix?: number[] } } = {
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
}

interface ITrollCampBasicInfo {
  tier?: string;
  contract: string;
  rewards?: number;
  apr: number;
  flashSales?: string;
  attributes: any;
  hide?: boolean;
}

interface TrollCampInfoMapType { [chainId: number]: ITrollCampBasicInfo[] }

const trollCampInfoMap: TrollCampInfoMapType = {
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
}

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

const oaxNFTInfo: TrollCampInfoMapType = {
  // Binance Mainnet
  56: [
  ],
  // Binance Test Chain
  97: [
    {
      contract: '0x47Ee972499dD103fa2Fb101b49a385d8024C1BA9',
      apr: 10,
      attributes: attributesDistribution.oax
    },
  ],
}


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

export {
  NFT_TYPE,
  trollAPIUrl,
  rewardAddress,
  attributesDistribution,
  ITrollCampBasicInfo,
  TrollCampInfoMapType,
  trollCampInfoMap,
  ITrollCampInfo,
  IMyNFTInfo,
  IUserNFTsInfo,
  INFTCollectionCard,
  INFTCollectionInfo,
  oaxNFTInfo,
  IDataCard,
  IDataMyCard
}
