import React, { useState } from 'react';  
import { NavLink } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';  

import AccountCircle from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { USER_TYPES } from '../enum/UsersEnum';

import Profile from '../Profile';

import '../../css/App.css';

export default function Header({isAuthenticated, userType, contract, currentAddress}) {

    const [showProfile, setShowProfile] = useState();
    const [anchorEl, setAnchorEl] = useState();
    const [profilePicture, setProfilePicture] = useState();
    const [name, setName] = useState('');

    const fetchUserName = async () => {
        try {
            let fetchMethod;
            switch (userType) {
                case USER_TYPES[0]: // Producer
                    fetchMethod = contract.getProducerName;
                    break;
                case USER_TYPES[1]: // Distributor
                    fetchMethod = contract.getDistributorName;
                    break;
                case USER_TYPES[2]: // Retailer
                    fetchMethod = contract.getRetailerName;
                    break;
                case USER_TYPES[3]: // Consumer
                    fetchMethod = contract.getConsumerName;
                    break;
                default:
                    console.error("Invalid user type");
                    return;
            }

            if (fetchMethod) {
                const userName = await fetchMethod(currentAddress);
                setName(userName);
            }
        } catch (error) {
            console.error("Error fetching user name:", error);
        }
    };

    const toggleProfile = (event) => {
        if (!showProfile) {
            fetchUserName(); // Fetch name before toggling the profile
        }

        let profilePicturePath = "/profile-designs/Producer.png";
        if (userType === USER_TYPES[1]) {
            profilePicturePath = "/profile-designs/Distributor.png";
        } else if (userType === USER_TYPES[2]) {
            profilePicturePath = "/profile-designs/Retailer.png";
        }

        setProfilePicture(profilePicturePath);
        setShowProfile(!showProfile);
        setAnchorEl(event.currentTarget);
    };

    if(!isAuthenticated){
        return null;
    } else {
        return(
            <div> 
                <AppBar position="static" color="secondary" elevation={0}>
                    <Toolbar> 
                        <NavLink exact to="/" className="undecorated-links"> 
                            <IconButton color="inherit">
                                <img src="/logo.jpg" alt="logo" id="app-logo-header"/>
                            </IconButton>
                        </NavLink>
                        <NavLink exact to="/" className="undecorated-links iconbutton"> 
                            <IconButton color="inherit">
                                <Typography noWrap>VIEW BATCHES</Typography>  
                            </IconButton>
                        </NavLink>
                        <IconButton color="inherit" id="right-anchored-menu-item" onClick={toggleProfile}>
                            <AccountCircle style={{ fontSize: 40 }}/> 
                            <ArrowDropDownIcon className="dropdown-arrow-icon" />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {showProfile ? 
                    <Profile 
                        open={showProfile} 
                        close={toggleProfile}
                        userType={userType} 
                        currentAddress={currentAddress}
                        anchorEl={anchorEl}
                        profilePicturePath={profilePicture}
                        userName={name}
                    />
                    : null
                }   
            </div>
        );
    }
};
