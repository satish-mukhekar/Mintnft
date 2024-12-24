import Web3 from "web3";
import { MINTNFT } from "./ABI/MINTNFT.js";

const RPCUrl = "https://rpc-test.donatuz.com"; // RPC URL of the blockchain network
// const NftContractaddress = "0xcd5EE9B742C8D5E184c394F0dd4E31b2cfD7Ec67"; // NFT contract address
const NftContractaddress = "0xA988Ab74e7A9Fb8a01fB0893F39ad3280F75eD0D"; // NFT contract address

export const mintNFT = async (_tokenURI) => {
  try {
    if (window.ethereum) {
      // Initialize Web3 with MetaMask provider
      const web3 = new Web3(window.ethereum);

      // Request MetaMask account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const account = accounts[0];

      // Create a contract instance with ABI and address
      const contract = new web3.eth.Contract(MINTNFT, NftContractaddress);

      // Call the `mintNFT` function with the _tokenURI parameter
      const result = await contract.methods
        .mintNFT(_tokenURI)
        .send({ from: account });

      console.log("Mint NFT Result:", result);
    } else {
      console.error("Ethereum wallet not detected. Please install MetaMask.");
    }
  } catch (error) {
    console.error("Error in mintNFT function:", error);
  }
};

export const setdepositeBUSD = async (_amount) => {
  try {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const account = accounts[0];
      const contracts = new web3.eth.Contract(MINTNFT, NftContractaddress);

      // Convert amount from Wei to BUSD
      const amountInBUSD = web3.utils.fromWei(_amount, "ether"); // Assume 1 Ether = 1 BUSD for simplicity (update if necessary)

      console.log(`Depositing amount in Wei: ${_amount}`);
      console.log(`Converted amount in BUSD: ${amountInBUSD}`);

      const response = await contracts.methods
        .depositFunds(_amount)
        .send({ from: account });
      console.log("Response from contract:", response);

      return response;
    } else {
      console.error("Ethereum wallet is not connected.");
      return null;
    }
  } catch (error) {
    console.error("Error in setdepositeBUSD function:", error);
    return null;
  }
};

export const setwithdrawBUSD = async (_amount) => {
  console.log("setwithdrawBUSD called");
  try {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const account = accounts[0];
      const contracts = new web3.eth.Contract(MINTNFT, NftContractaddress);

      // Convert amount from Wei to BUSD
      const amountInBUSD = web3.utils.fromWei(_amount, "ether"); // Assume 1 Ether = 1 BUSD for simplicity (update if necessary)

      const response = await contracts.methods
        .withdrawFunds(_amount)
        .send({ from: account });
      console.log(`Withdrawed amount in Wei: ${_amount}`);
      console.log(`Converted amount in BUSD: ${amountInBUSD}`);
      console.log("Response from contract:", response);

      return response;
    } else {
      console.error("Ethereum wallet is not connected.");
      return null;
    }
  } catch (error) {
    console.error("Error in setwithdrawBUSD function:", error);
    return null;
  }
};

export const setmintnft = async (_amount) => {
  try {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const account = accounts[0];
      const contracts = new web3.eth.Contract(MINTNFT, NftContractaddress);

      // Convert amount from Wei to BUSD
      const amountInBUSD = web3.utils.fromWei(_amount, "ether"); // Assume 1 Ether = 1 BUSD for simplicity (update if necessary)

      const response = await contracts.methods.mintNFT(_tokenURI);
      console.log(`mint amount in Wei: ${_amount}`);
      console.log(`Converted amount in BUSD: ${amountInBUSD}`);
      console.log("Response from contract:", response);
      return response;
    } else {
      console.error("Ethereum wallet is not connected.");
      return null;
    }
  } catch (error) {
    console.error("Error in setwithdrawBUSD function:", error);
    return null;
  }
};

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
 export const getBUSDBalance = async () => {
  try {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const account = accounts[0];
      const contracts = new web3.eth.Contract(MINTNFT,NftContractaddress );
      const response = await contracts.methods.getUserBalance(account).call();
      console.log("rsponse", response);
      return (response);
    }
  } catch (error) {
    console.error("Error in getBUSDBalance:", error);
    return null;
  }
};

export { NftContractaddress };
