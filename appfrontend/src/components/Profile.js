import React, { useState, useEffect } from "react"; 
import { ethers } from "ethers";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';

import "../css/Profile.css";

export default function Profile({ currentAddress, userType, close, open, anchorEl, profilePicturePath, userName }) {
    const [balance, setBalance] = useState();

    async function getUserAccountBalance() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accountBalance = await provider.getBalance(currentAddress);
        setBalance(parseFloat(ethers.utils.formatEther(accountBalance)).toFixed(4));
    }

    useEffect(() => {
        getUserAccountBalance();
    }, []);

    return (
        <Menu
            className="profile-menu"
            anchorEl={anchorEl}
            keepMounted
            disableScrollLock={true}
            PaperProps={{
                style: {
                    transform: 'translateX(-10px) translateY(60px)',
                    padding: "10px 30px 20px 30px"
                }
            }}
            open={open}
            onClose={close}
        >
            <div>
                <center>
                    <img className="profile-picture" src={profilePicturePath} alt="profile picture" />
                    <h2>{userName}</h2>
                    <Button 
                        variant="outlined" 
                        style={{ color: "#03989E", borderColor: "#03989E" }}
                        disabled={true}>
                        {userType}
                    </Button>
                </center>
                <br/>
                <div className="profile-details">
                    <div style={{ paddingBottom: "24px" }}>
                        <h4>Account Address</h4> 
                        <p>{currentAddress}</p>
                    </div>
                    <div>
                        <h4>Account Balance</h4> 
                        <p>{balance} <b>ETH</b></p>
                    </div>
                </div>
            </div>
        </Menu>
    );
}
