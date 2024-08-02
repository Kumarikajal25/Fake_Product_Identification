// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12 <0.9.0;

contract LoginPage{
    struct SignUp {
        string name;
        uint256 passwordHash; // Store password hash instead of the actual password
    }
     struct Product {
        uint256 serialNo;
        string brandName;
        string details;
    }
     mapping(string => Product) public products;

    mapping(address => SignUp) public signUpData;
    event LogValues(bytes32 indexed hashedMessage, address indexed recoveredAddress, address indexed userWalletAddress);
    event NewAccountCreated(address indexed account, uint256 password);
    event LoginAttempt(address indexed account,uint256 password);
    event DataModified(address indexed account);

     modifier onlyExistingAccount(address _Existingaccount) {
        require(signUpData[_Existingaccount].passwordHash != uint256(0), "Account does not exist");
        _;
    }
    function newAccount(address _Newaccountaddr, string memory _name, uint256 _passwordHash) public {
        require(signUpData[_Newaccountaddr].passwordHash == uint256(0), "Account already exists");
        
        signUpData[_Newaccountaddr] = SignUp(_name, _passwordHash);
        emit NewAccountCreated(_Newaccountaddr, _passwordHash);
    }

    function login(address _loginAccount, uint256 _passwordHash)  onlyExistingAccount ( _loginAccount) public {
        require( signUpData[_loginAccount].passwordHash == _passwordHash,"Wrong password");
        emit LoginAttempt(_loginAccount,_passwordHash);

       
    }

    function modifyData(address _modifyAccount, uint256 _newPasswordHash) public {
        signUpData[_modifyAccount].passwordHash = _newPasswordHash;
        emit DataModified(_modifyAccount);
    }
    function verifyUserOnBackend(address _WalletAddress) public view returns (bool) {
                   return (_WalletAddress == msg.sender);
    }
     function getMessageHash(
        string memory _message
       
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked( _message));
    }

    function getEthSignedMessageHash(bytes32 _messageHash)
        public
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
            );
    }

    function verify(
        address _signer,
        string memory _message,
        bytes memory signature
    ) public pure returns (bool) {
        bytes32 messageHash = getMessageHash( _message);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return recoverSigner(ethSignedMessageHash, signature) == _signer;
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature)
        public
        pure
        returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

     function storeData(string memory ipfsHash,uint256 _serialNo ,string memory brandName, string memory details) external {
        products[ipfsHash] = Product(  _serialNo,brandName, details);
    }
    function checkProduct(string memory ipfsHash,uint256 serialNo , string memory brandName, string memory details) external view returns (bool) {
        Product memory storedProduct = products[ipfsHash];
        return (keccak256(abi.encodePacked(storedProduct.brandName)) == keccak256(abi.encodePacked(brandName))) &&
               (keccak256(abi.encodePacked(storedProduct.details)) == keccak256(abi.encodePacked(details))) &&
               (keccak256(abi.encodePacked(storedProduct.serialNo)) == keccak256(abi.encodePacked(serialNo)));
    }

}
