import React, { useState, useRef, useEffect, useContext } from 'react';
import "./style.scss";
import upload from "../../assest/upload.png";
import { create } from 'ipfs-http-client';
import { LoginPageContext } from '../../context/LoginPageContext';
import QRCode from 'qrcode.react';
import axios from 'axios';
import Swal from "sweetalert2";
const ProductDetails = () => {
 
  const [file, setFile] = useState(null);
  const [serialNo, setSerialNo] = useState('');
  const [brandName, setBrandName] = useState('');
  const [details, setDetails] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const fileInputRef = useRef(null);
  const[message,setMessage]=useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const ipfs = create({ host: '127.0.0.1', port: 5002, protocol: 'http' });
  const { getEthereumContract } = useContext(LoginPageContext);
  const handleFileUpload = (file) => {
    setFile(file);
    console.log(file);
    if (file) {
      const background = URL.createObjectURL(file);
      setBackgroundImage(background);
    }
  };

  const handleProductScanMouseDown = () => {
    fileInputRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const productScan = document.querySelector(".product-scan");
    productScan.addEventListener("mousedown", handleProductScanMouseDown);
    productScan.addEventListener("drop", handleDrop);
    productScan.addEventListener("dragover", handleDragOver);
    return () => {
      productScan.removeEventListener("mousedown", handleProductScanMouseDown);
      productScan.removeEventListener("drop", handleDrop);
      productScan.removeEventListener("dragover", handleDragOver);
    };
    
  }, []);

  useEffect(() => {
    // This effect runs when qrCodeData changes
    if (qrCodeData) {
      Swal.fire('Success!', 'QR-generated Successfully of ProducT-Item', 'success');
    }
  }, [qrCodeData]);
 
  
  const handleSubmit = async () => {
    try {
      if (file && brandName && details) {
        const ipfsHash = await uploadToIPFS(file);
        console.log(ipfsHash);
        try {
          if (ipfsHash) {
            setMessage(ipfsHash);
            try {
              const response = await axios.post('http://localhost:4000/manufacture/store', {
                message
            });
            console.log("responseData",response.data);
            const encryptedData=await  response.data ;
            console.log(encryptedData);
            if(encryptedData && serialNo &&brandName && details){
              const {LoginPageContract} =  getEthereumContract();
            const productData=  await LoginPageContract.storeData(message,serialNo,brandName,details);
              const dataForQrCode = `${encryptedData}`;
              console.log('QR Code Data:', dataForQrCode);
              setQrCodeData(dataForQrCode);
            }
            } catch (error) {
              console.error('Error during encryption:', error);
            }
          } else {
            console.log("Error while loading keys");
          }
        } catch (error) {
          console.error('Error:', error);
        }
      } else {
        console.log('Please upload a file and enter details');
      }
    } catch (error) {
      console.log('Error while uploading file', error);
    }
  };

  const uploadToIPFS = async (file) => {
    const fileBuffer = new Uint8Array(await file.arrayBuffer());
    try {
      const result = await ipfs.add(fileBuffer);
      console.log(result.path);
      return result.path;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      return null;
    }
  };

  return (
    <div className='Scan-Product-form'>
      <div className='Scan-section'>
        <h1> Product Details</h1>
        <div className="product-scan" style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          borderStyle: backgroundImage ? 'none' : 'dashed',
        }}>
          <div className="upload" style={{ display: backgroundImage ? 'none' : 'flex' }}>
            <label htmlFor="input-file" id="label" >
              <input
                type="file"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                accept="image/*"
                id="input-file"
                hidden
                ref={fileInputRef}
                required="required"
              />
              <div className="img-section">
                <img src={upload} alt="Upload Icon" />
              </div>
              <p>Drag and drop or click here<br />to upload image</p>
              <span>Upload any images from desktop</span>
            </label>
          </div>
        </div>
        <div className="input-details" required="required">
          <label>
            Serial No:
            <input
              type="text"
              value={serialNo}
              onChange={(e) => setSerialNo(e.target.value)}
            />
          </label>
          <label>
            Brand Name:
            <input required="required"
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </label>
          <label className='details'>
            Details:
             <textarea name="textarea" rows="5" type="text" value={details} required="required"
              onChange={(e) => setDetails(e.target.value)} cols="40">Write something here</textarea>
          </label>
        </div>
        <button onClick={()=>handleSubmit()}>Store</button>
      </div>
      <div className='qr-code'>
        {/* Render the QR code component with the generated data */}
        {qrCodeData && <>
        <QRCode size={256} value={qrCodeData}/>
        <h3>QR-Code of {brandName}</h3>
        </>
        }
      </div>
    </div>
  );
};

export default ProductDetails;