import { Wallet, BigNumber, ISendTxEventsOptions } from "@ijstech/eth-wallet";
import { ITokenObject } from "@scom/scom-token-list";

export type TokenMapType = { [token: string]: ITokenObject };
export const ERC20MaxAmount = new BigNumber(2).pow(256).minus(1);

export const isTransactionConfirmed = async (txHash: string) => {
  const wallet = Wallet.getClientInstance();
  const tx = await wallet.getTransactionReceipt(txHash); // wallet.web3.eth.getTransaction(txHash);
  return tx && !!tx.blockNumber;
}

export const registerSendTxEvents = (sendTxEventHandlers: ISendTxEventsOptions) => {
  const wallet = Wallet.getClientInstance();
  wallet.registerSendTxEvents({
    transactionHash: (error: Error, receipt?: string) => {
      if (sendTxEventHandlers.transactionHash) {
        sendTxEventHandlers.transactionHash(error, receipt);
      }
    },
    confirmation: (receipt: any) => {
      if (sendTxEventHandlers.confirmation) {
        sendTxEventHandlers.confirmation(receipt);
      }
    },
  })
}

export const isAddressValid = async (address: string) => {
  let wallet: any = Wallet.getClientInstance();
  const isValid = wallet.web3.utils.isAddress(address);
  return isValid;
}
