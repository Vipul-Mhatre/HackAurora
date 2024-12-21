pragma solidity >=0.4.21 <0.9.0;

/**
 * @title Users
 * @dev Stores user addresses and their associated names for different types of users.
 */
library Users {

    struct User {
        mapping(address => bool) userAddresses;
        mapping(address => string) userNames; 
    }
    function addUser(User storage user, address userAddress, string memory name) internal {
        require(!user.userAddresses[userAddress], "User already exists.");
        user.userAddresses[userAddress] = true;
        user.userNames[userAddress] = name;
    }

    function removeUser(User storage user, address userAddress) internal {
        require(user.userAddresses[userAddress], "User does not exist.");
        user.userAddresses[userAddress] = false;
        delete user.userNames[userAddress];
    }

    function isExistingUser(User storage user, address userAddress) internal view returns (bool) {
        return user.userAddresses[userAddress];
    }

    function getUserName(User storage user, address userAddress) internal view returns (string memory) {
        require(user.userAddresses[userAddress], "User does not exist.");
        return user.userNames[userAddress];
    }
}
