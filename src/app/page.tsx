"use client";

import { useState, useEffect } from "react";
import { ConnectButton, useActiveAccount, useWalletInfo } from "thirdweb/react";
import { client } from "./client"; // Ensure this is your Thirdweb client instance
import { ApproveBUSD } from "../../ContractAction/BUSDContractAction";
import {
  mintNFT,
  setdepositeBUSD,
  setwithdrawBUSD,
  getBUSDBalance,
  NftContractaddress,
} from "../../ContractAction/Intreactionnftmint";
import { Toaster, toast } from "react-hot-toast";
import { sendImageToIPFS } from "./helper";
import { log } from "console";

export default function Home() {
  const [userDepositAmount, setUserDepositAmount] = useState("");
  const [userwithdrawAmount, setuserwithdrawAmount] = useState("");
  const [balance, setBalance] = useState<any>(null);
  const [nftDetails, setNftDetails] = useState({ name: "", uri: "" });
  const [isApproved, setIsApproved] = useState(false);
  const [approvedAddress, setApprovedAddress] = useState<string | null>(null); // Store approved address
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [fileurl, setfileurl] = useState<string | undefined>(undefined);

  const activeAccount = useActiveAccount();
  console.log("address using react hook", activeAccount);

  const { data: walletInfo } = useWalletInfo("io.metamask");
  console.log("Wallet name", walletInfo);

  useEffect(() => {
    const storedWalletAddress = localStorage.getItem("walletAddress");
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    }
  }, []);

  const handleWalletConnected = (walletData: { address: string }) => {
    console.log("Wallet connected:", walletData);
    const walletAddress = walletData.address;
    console.log(walletAddress);
    localStorage.setItem("walletAddress", walletAddress);
    fetchBalance();
  };

  const fetchBalance = async () => {
    try {
      const balanceValue = await getBUSDBalance();
      console.log("usdcinfetbaance,", typeof balanceValue);
      setBalance(balanceValue);
      toast.success(`Your BUSD balance is: ${balanceValue}`);
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Failed to fetch BUSD balance.");
    }
  };

  const busdvBalance = async () => {
    try {
      const currentBalance = await getBUSDBalance();
      alert(`Your USDT Balance is: ${currentBalance}`);
    } catch (error) {
      console.error("Error fetching balance:", error);
      alert("Unable to fetch BUSD balance. Please try again.");
    }
  };

  const handleApproveBUSD = async () => {
    try {
      const approvalResponse = await ApproveBUSD(
        userDepositAmount,
        NftContractaddress
      );
      if (approvalResponse) {
        setIsApproved(true);
        // Set the address that approved the BUSD
        const walletAddress = localStorage.getItem("walletAddress");
        if (walletAddress) {
          setApprovedAddress(walletAddress);
        }
        toast.success("BUSD approved successfully! You can now deposit.");
      } else {
        toast.error("Approval failed.");
      }
    } catch (error) {
      console.error("Error approving BUSD:", error);
      toast.error("An error occurred during the approval process.");
    }
  };

  const handleDepositeamount = async () => {
    try {
      if (!isApproved) {
        toast.error("Please approve BUSD first.");
        return;
      }
      const depositResponse = await setdepositeBUSD(userDepositAmount);
      if (depositResponse) {
        toast.success("Deposit successful!");
        fetchBalance();
      } else {
        toast.error("Failed to make deposit.");
      }
    } catch (error) {
      console.error("Error during deposit:", error);
      toast.error("An error occurred while making the deposit.");
    }
  };

  const handleWithdraw = async () => {
    try {
      const withdrawResponse = await setwithdrawBUSD(userwithdrawAmount);
      if (withdrawResponse) {
        toast.success("Withdrawal successful!");
        fetchBalance();
      } else {
        toast.error("Failed to withdraw.");
      }
    } catch (error) {
      console.error("Error during withdrawal:", error);
      toast.error("An error occurred while making the withdrawal.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mintNFT(fileurl);
      toast.success("NFT minted successfully!");
    } catch (error) {
      console.error("Error during NFT minting process:", error);
      toast.error("An error occurred during the minting process.");
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNftDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await sendImageToIPFS(file);
      console.log("Image URL:", imageUrl);
      setfileurl(imageUrl);
      if (imageUrl) {
      }
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  return (
    <main className="bg-gray-900 text-white p-4 pb-10 min-h-screen flex flex-col items-center">
      <div className="py-10 max-w-3xl w-full">
        <Header />
        <div className="my-10 flex justify-center">
          <Toaster />
          <ConnectButton
            client={client}
            autoConnect={true}
            appMetadata={{ name: "Donatuz", url: "https://example.com" }}
            onConnect={(walletData) => handleWalletConnected(walletData)}
            // onConnect={handleWalletConnect}
          />
        </div>
        <div className="mb-10">
          {balance !== null && <p className="mt-4">BUSD Balance: {balance}</p>}
        </div>
        <button
          onClick={busdvBalance}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          USDT Balance
        </button>
        <div className="mb-4">
          <label className="block text-sm mb-2" htmlFor="depositAmount">
            Deposit Amount (in wei)
          </label>
          <input
            type="text"
            id="depositAmount"
            value={userDepositAmount}
            onChange={(e) => setUserDepositAmount(e.target.value)}
            placeholder="Enter amount in wei"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
          />
        </div>
        {approvedAddress === localStorage.getItem("walletAddress") ? (
          <button
            onClick={handleDepositeamount}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2"
          >
            Deposit
          </button>
        ) : (
          <button
            onClick={handleApproveBUSD}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mt-2"
          >
            Approve
          </button>
        )}

        <div className="mb-4 mt-6">
          <label className="block text-sm mb-2" htmlFor="withdrawAmount">
            Withdraw Amount (in wei)
          </label>
          <input
            type="text"
            id="withdrawAmount"
            value={userwithdrawAmount}
            onChange={(e) => setuserwithdrawAmount(e.target.value)}
            placeholder="Enter amount in wei"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
          />
        </div>
        <button
          onClick={handleWithdraw}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Withdraw
        </button>
        <form
          onSubmit={handleFormSubmit}
          className="bg-gray-800 p-6 rounded-lg shadow-md mt-6"
        >
          <div className="flex flex-row items-center gap-3 w-full">
            <div className="flex-grow">
              <h2 className="text-xl font-semibold mb-4">Mint Your NFT</h2>
              <div className="mb-4">
                <label className="block text-sm mb-2" htmlFor="name">
                  NFT Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={nftDetails.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
                  required
                />
              </div>
            </div>
            <div className="size-32 rounded-md bg-gray-400">
              {
                fileurl && (
                  <img src={fileurl} alt="Uploaded Image" />
                )
              }
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-2" htmlFor="file">
              Upload Image
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-2" htmlFor="uri">
              Token URL
            </label>
            <input
              type="text"
              id="uri"
              name="uri"
              value={fileurl}
              onChange={handleFormChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Mint NFT
          </button>
        </form>
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-10">
      <h1 className="text-3xl font-bold tracking-tight text-white mb-4">
        MINT YOUR NFT
      </h1>
    </header>
  );
}
