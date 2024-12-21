import { ethers } from "ethers";

// Load the contract's ABI and address
import SupplyChainABI from "./abis/SupplyChainLifecycle.json"; // Replace with your ABI file
const contractAddress = "0x4850b85Cf0105f9F3527168c57Cee4A0b8Dfb902";

let provider;
let signer;
let supplyChainContract;

// Initialize provider and contract
export const initializeBlockchain = async () => {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        signer = provider.getSigner();
        supplyChainContract = new ethers.Contract(contractAddress, SupplyChainABI.abi, signer);
    } else {
        console.error("MetaMask not found");
    }
};

// Example function to add a product
export const produceProduct = async (productName, productDesc, productPrice, productQty) => {
    try {
        const tx = await supplyChainContract.produceProduct(productName, productDesc, productPrice, productQty, await signer.getAddress());
        await tx.wait();
        console.log("Product produced successfully!");
    } catch (error) {
        console.error("Error producing product:", error);
    }
};

// Example function to fetch all products
export const getAllProducts = async () => {
    try {
        const products = await supplyChainContract.getAllProductDetails();
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};
