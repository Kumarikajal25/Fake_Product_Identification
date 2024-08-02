import React, { useState, useContext } from 'react';
import { LoginPageContext } from '../../context/LoginPageContext';
import './style.scss';
import wallet from '../../assest/Wallet.png';
import {  useNavigate } from 'react-router-dom';
import {ethers} from "ethers"
import Swal from "sweetalert2";
const Manufacture = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [password, setPassword] = useState('');
  const { getEthereumContract } = useContext(LoginPageContext);
  const navigate=useNavigate();
  const handleLogin = async (e) => {
    try {
      if (walletAddress.length !== 0) {
        const {LoginPageContract} = getEthereumContract();
        e.preventDefault();
        const isVerified = await LoginPageContract.verifyUserOnBackend(walletAddress); 
        if (isVerified) {
          Swal.fire('Success!','Sucessfully login into your Account','success');
          navigate("/manufacture/details");
        } else {
          Swal.fire('Error!','User verification failed. Please try again.','error');
        }
      }
    } catch (error) {
      Swal.fire('Error!',' During login:', error);
    }
  };

  const handleWalletIconClick = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userWalletAddress = accounts[0];
        const { LoginPageContract, signer } = getEthereumContract();
        const isVerified = await LoginPageContract.verifyUserOnBackend(userWalletAddress);
        if (isVerified) {
          setWalletAddress(userWalletAddress);
          const signatureRequest = await createSignatureRequest(userWalletAddress, signer, LoginPageContract);
        } else {
          Swal.fire('Error!','User verification failed. Please try again.','error');
        }
      } else {
        Swal.fire('Warning!','MetaMask is not installed. Please install MetaMask to log in.');
      }
    } catch (error) {
      Swal.fire('Error!',' during wallet icon click:', error);
    }
  };

  const createSignatureRequest = async (userWalletAddress, signer, LoginPageContract) => {
    const message = "Do you want to login using wallet-address";
    if (signer && userWalletAddress.length > 0 && message) {
      try {
        const hash = await LoginPageContract.getMessageHash(message);
     const signature = await signer.signMessage(ethers.utils.arrayify(hash));
     const hexString = signature.slice(2);
        // Convert hex string to Uint8Array
        const sig = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        console.log('Signature:', sig);
        const verifySignatures = await verifySignature(userWalletAddress, LoginPageContract, message,sig);
        if (verifySignatures) {
          Swal.fire('Success!','Sucessfully login into your Account','success');
          navigate("/manufacture/details");
        } else {
          Swal.fire('Error!','Does Not Verify-Signature','error');
        }
      } catch (error) {
        Swal.fire('Error!','Error during signature request:','error');
        return false;
      }
    }
  };

  const verifySignature = async (userWalletAddress, LoginPageContract, message,sig) => {
    if (LoginPageContract && userWalletAddress.length > 0 && sig) {
      try {
        const result = await LoginPageContract.verify(userWalletAddress, message, sig);
        console.log(result);
        return result;
      } catch (error) {
        Swal.fire('Error!','Error verifying signature:', 'error');
      }
    } else {
      Swal.fire('Warning!','Ethers or contract not initialized, or no signature available.','warning');
    }
  };

  return (
    <div className="manufacture-login">
      <div className="Input-container">
        <span className="border-line"></span>
        <div className="Input-Form">
          <form>
            <h3>Manufacture Login</h3>
            <div className="inputBox">
              <input
                className="input"
                type="text"
                required="required"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
              <span> Wallet Address:</span>
              <i></i>
            </div>
            <div className="inputBox">
              <input
                className="input"
                type="password"
                required="required"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span>Password</span>
              <i></i>
            </div>
            <button onClick={handleLogin}>Login</button>
            <hr />
            <div className="options">
              <div className="another-option">
                <img
                  src={wallet} 
                  alt="Wallet Icon"
                  style={{ cursor: 'pointer' }}
                  onClick={handleWalletIconClick}
                />
              </div>
              <a>Sign In using wallet</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Manufacture;