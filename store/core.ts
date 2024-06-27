import { BigNumber } from "@ijstech/eth-wallet";

export interface TokenConstant {
  address: string;
  name: string;
  decimals: number;
  symbol: string;
}

export interface TokenStore {
  address: string;
  name: string;
  decimals: number;
  symbol: string;
  userBalance: BigNumber;
}

export interface ContractSet {
  token:string, //oswap token to mint nft
  nftHungry:string, //nft contract
  nftHappy:string, //nft contract
  nftHunny:string, //nft contract
}

export const CoreContractStore: {[chainId: number]: ContractSet
 } = {
  56: { // Binance Mainnet
    token: "0xb32aC3C79A94aC1eb258f3C830bBDbc676483c93", //oswap token to mint nft
    nftHungry: "0x1254132567549292388cd699Cb78B47d3101c8A9", //nft contract
    nftHappy: "0x2d74990f55faeA086A83B9fE176FD36a34bA617b", //nft contract
    nftHunny: "0x3E8fb94D9dD7A8f9b2ccF0B4CCdC768628890eeB", //nft contract
  },
  97: { // Binance Test Chain
    token: "0x45eee762aaeA4e5ce317471BDa8782724972Ee19", //oswap token to mint nft
    nftHungry: "0x946985e7C43Ed2fc7985e89a49A251D52d824122", //nft contract
    nftHappy: "0x157538c2d508CDb1A6cf48B8336E4e56350A97C8", //nft contract
    nftHunny: "0xB9425ddFB534CA87B73613283F4fB0073B63F31D", //nft contract
  }
}