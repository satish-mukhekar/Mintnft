import Web3 from "web3";
import { abiBUSD } from "./ABI/BUSD.js";

const RPCUrl = "https://rpc-test.donatuz.com";
// const ContractaddressBUSD = "0xa693de8668b0fe25CE66C1E1083E25Df23814707";
const ContractaddressBUSD = "0x0094a2979cF30A0e6651A57038932426eC232fC9";

const web3 = new Web3(new Web3.providers.HttpProvider(RPCUrl));

// Approve NFT Contract

export const ApproveBUSD = async (_amount, _NftContractaddress) => {
  try {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);

      // Convert _amount to Wei (assuming _amount is in human-readable format)
      const amountInWei = web3.utils.toWei(_amount.toString(), "ether");

      // Validate NftContractAddress
      if (!web3.utils.isAddress(_NftContractaddress)) {
        throw new Error("Invalid NFT contract address");
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const account = accounts[0];

      const contracts = new web3.eth.Contract(abiBUSD, ContractaddressBUSD);

      // Use send instead of call to execute the transaction
      const response = await contracts.methods
        .approve(_NftContractaddress, amountInWei)
        .send({ from: account });

      // Optionally return the transaction receipt or status
      return response; // You can return response or any relevant info from it
    } else {
      throw new Error("Ethereum wallet is not detected");
    }
  } catch (error) {
    console.error("Error in ApproveBUSD:", error);
    return null;
  }
};

// Get BUSD Balance
// export const getBUSDBalance = async () => {
//   try {
//     if (window.ethereum) {
//       const web3 = new Web3(window.ethereum);
//       const accounts = await window.ethereum.request({
//         method: "eth_accounts",
//       });
//       const account = accounts[0];
//       const contracts = new web3.eth.Contract(abiBUSD, ContractaddressBUSD);
//       const response = await contracts.methods.balanceOf(account).call();
//       return parseFloat(web3.utils.fromWei(response, "ether"));
//     }
//   } catch (error) {
//     console.error("Error in getBUSDBalance:", error);
//     return null;
//   }
// };

export { ContractaddressBUSD };
