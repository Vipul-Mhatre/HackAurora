import React from "react";

import { ethers } from "ethers";
import SupplyChainLifecycle from "../contracts/SupplyChainLifecycle.json";
import contractAddresses from "../contracts/contract-addresses.json";
import { NoWalletDetected } from "./NoWalletDetected";
import { PageLoader } from "./static/PageLoader";
import { InitializedContent } from "./InitializedContent";

const SEPOLIA_NETWORK_ID = '11155111';

export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      selectedAddress: undefined,
      initialized: false,
    };

    this.state = this.initialState;
  }

  componentDidMount(){
    this.connectWallet();
  }

  render() {
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    if (!this.state.initialized) {
      return <PageLoader />;
    }

    return (
      <InitializedContent 
        contract={this.contractInstance}
        currentAddress={this.state.selectedAddress}
      />
    );
  }

  async connectWallet() {
    const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    this.checkNetwork();
  
    this.initialize(selectedAddress);

    this.checkAccountChange();
  }

  checkAccountChange(){
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      window.location.reload();

      if (newAddress === undefined) {
        return this.resetState();
      }
      
      this.initialize(newAddress);
    });
  }

  initialize(userAddress) {
    
    this.setState({
      selectedAddress: userAddress,
    });
    this.initializeEthers();
    this.setState({ initialized: true});
  }

  async initializeEthers() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);

    this.contractInstance = new ethers.Contract(
      contractAddresses[0].SupplyChainLifecycle,
      SupplyChainLifecycle.abi,
      this.provider.getSigner(0)
    );
  }

  resetState() {
    this.setState(this.initialState);
  }

  async switchChain() {
    const chainIdHex = `0x${SEPOLIA_NETWORK_ID.toString(16)}`
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
    await this.initialize(this.state.selectedAddress);
  }

  checkNetwork() {
    if (window.ethereum.networkVersion !== SEPOLIA_NETWORK_ID) {
      this.switchChain();
    }
  }
}