import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsQR from 'jsqr';

const User = () => {
  const [qrData, setQrData] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const handleSuccess = async (stream) => {
      video.srcObject = stream;
      await video.play();
      scanQRCode();
    };

    const handleError = (error) => {
      console.error('Error accessing camera:', error);
    };

    const scanQRCode = () => {
      const interval = setInterval(() => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            setQrData(code.data);
            clearInterval(interval);
          }
        }
      }, 1000 / 30);
    };

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(handleSuccess)
      .catch(handleError);

    return () => {
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const image = new Image();
        image.src = event.target.result;
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          console.log('Decoded QR Code:', code); // Log the decoded QR code
          if (code) {
            setQrData(code.data);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handlePasswordSubmit = () => {
    // Check if the entered password is correct
    if (password === 'YOUR_PASSWORD_HERE') {
      // Unlock the QR code or redirect to the unlocked content
      alert('Password is correct! Unlocking the QR code.');
      // Perform unlock action here
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  return (
    <div className='Scan-Product-form-1'>
      <div className='Scan-section-1'>
        <div className="product-scan-1">
          <h1>Scan Your Product</h1>
          <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
        <div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} />
        </div>
        {showPasswordPrompt && (
          <div>
            <p>Scanned QR Code Data: {qrData}</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to unlock"
            />
            <button onClick={handlePasswordSubmit}>Unlock</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
