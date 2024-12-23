
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import HomeWrapper from "./wrapper/HomeWrapper";

import Register from "./Register";
import ConfirmRegistration from "./ConfirmRegistration";

import Header from "./static/Header";
import Footer from "./static/Footer";
import { CircularPageLoader } from "./static/CircularPageLoader";
import NotFound from "./static/NotFound";
import NewUser from "./static/NewUser";
import RegistrationSuccess from "./static/RegistrationSuccess";
import RegistrationFailure from "./static/RegistrationFailure";

import { USER_TYPES } from "./enum/UsersEnum";

import "../css/App.css";
import QrCodeScanner from "./QrCodeScanner";

export const InitializedContent = ({contract, currentAddress}) => {

    const [isAuth, setIsAuth] = useState();
    const [userType, setUserType] = useState();

    useEffect(() => {
        
        window.history.replaceState({}, '');

        let retailerResult = null;
        let producerResult = null;
        let consumerResult = null;
        
        contract.connect(currentAddress).isRetailer().then((receipt) => {
                    console.log(receipt);
                    retailerResult = receipt;
                    if(receipt){
                        setUserType(USER_TYPES[2]);
                    }
                }).catch((error) => {
                    console.log(error);
                    retailerResult = false;
                });
        contract.connect(currentAddress).isProducer().then((receipt) => {
                    console.log(receipt);
                    producerResult = receipt;
                    if(receipt){
                        setUserType(USER_TYPES[0]);
                    }
                }).catch((error) => {
                    console.log(error);
                    producerResult = false;
                });
        contract.connect(currentAddress).isConsumer().then((receipt) => {
            console.log(receipt);
            consumerResult = receipt;
            if (receipt) {
                setUserType(USER_TYPES[3]);
            }
        }).catch((error) => {
            console.log(error);
            consumerResult = false;
        });
        contract.connect(currentAddress).isDistributor().then((receipt) => {
                    console.log(receipt);
                    if(receipt){
                        setUserType(USER_TYPES[1]);
                    }
            setIsAuth(retailerResult || producerResult || consumerResult || receipt);
                }).catch((error) => {
                    console.log(error);
                    setIsAuth(retailerResult || producerResult || consumerResult || false);
                });
    }, []);

    function updateIsAuth(newIsAuth){
        setIsAuth(newIsAuth);
    }

    function updateUserType(newUserType){
        setUserType(newUserType);
    }

    console.log(isAuth);

    if(isAuth != undefined) {
        return (
            <Router>
                <Header isAuthenticated={isAuth} userType={userType} contract={contract} currentAddress={currentAddress} /> 
                <div>
                    <Routes>
                        <Route exact path="/new-user" element={<NewUser isAuthenticated={isAuth} />} /> 
                        <Route exact path="/register" element={<Register contract={contract} currentAddress={currentAddress} isAuthenticated={isAuth} />} /> 
                        <Route exact path="/confirm-registration" element={<ConfirmRegistration contract={contract} currentAddress={currentAddress} isAuthenticated={isAuth} />} />   
                        <Route exact path="/registration-success" element={<RegistrationSuccess isAuthenticated={isAuth} />} />   
                        <Route exact path="/registration-failure" element={<RegistrationFailure isAuthenticated={isAuth} />} />   
                        <Route exact path="/" element={<HomeWrapper contract={contract} currentAddress={currentAddress} isAuthenticated={isAuth} userType={userType} updateAuth={updateIsAuth} updateUserType={updateUserType} />} /> 
                        <Route exact path="/qr-scanner" contract={contract} element={<QrCodeScanner/>}/>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
                <Footer isAuthenticated={isAuth} />
            </Router>
        );
    } else {
        return (<CircularPageLoader open = {true} />);
    }
}
