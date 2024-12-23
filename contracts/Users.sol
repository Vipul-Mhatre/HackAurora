pragma solidity >=0.4.21 <0.9.0;

library Users {

    struct User {
        mapping(address => bool) userAddresses;
    }

    function addUser(User storage user, address userAddress) internal {
        user.userAddresses[userAddress] = true;
    }

    function removeUser(User storage user, address userAddress) internal {
        user.userAddresses[userAddress] = false;
    }

    function isExistingUser(User storage user, address userAddress) internal view returns (bool) {
        return user.userAddresses[userAddress];
    }
}