const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 4000;

// Use cors middleware
app.use(cors());

// Use express.json() middleware to parse JSON request bodies
app.use(express.json());

function generateKeyFiles() {
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 700,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: ''
    },
  });

  console.log('Generated Public Key:', keyPair.publicKey);
  console.log('Generated Private Key:', keyPair.privateKey);

  fs.writeFileSync('public_key.pem', keyPair.publicKey);
  fs.writeFileSync('private_key.pem', keyPair.privateKey);

  return keyPair.publicKey;
}

function encryptString(plaintext) {
  const publicKey = fs.readFileSync('public_key.pem', "utf8");
  console.log(publicKey);
  if (!publicKey) {
    return null;
  }
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, // Use RSA_PKCS1_OAEP_PADDING for encryption
    },
    Buffer.from(plaintext)
  );
  return encrypted.toString("hex");
}

function readKeyFiles() {
  try {
    const privateKey = fs.readFileSync('private_key.pem', "utf8");
    return { privateKey };
  } catch (error) {
    console.error('Error reading private key file:', error);
    return { privateKey: null };
  }
}

function decryptString(private_key, encryptedData) {
  try {
    const decrypted = crypto.privateDecrypt(
      {
        key: private_key,
        passphrase: "",
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, // Use RSA_PKCS1_OAEP_PADDING for decryption
      },
      Buffer.from(encryptedData, "hex")
    );

    return decrypted.toString("utf-8");
  } catch (error) {
    console.error('Error decrypting string:', error);
    return null;
  }
}

app.post('/product/verification', (req, res) => {
  try {
    const { qrdata } = req.body;
    const PRIVATE_KEY = readKeyFiles();
    if (!PRIVATE_KEY.privateKey && !qrdata) {
      return res.status(500).send('Internal Server Error: Private key not available');
    }
    const decryptData = decryptString(PRIVATE_KEY.privateKey, qrdata);
    console.log('HASH_VALUE', decryptData);
    res.send(decryptData);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/manufacture/store', (req, res) => {
  try {
    const PRIVATE_KEY = readKeyFiles();
    const { message } = req.body;
    if (!message) {
      // Check if the required data is provided
      return res.status(400).send('Bad Request: Missing required data');
    }
    const encryptedData = encryptString(message);
    console.log('HASH_VALUE', encryptedData);
    res.send(encryptedData);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
