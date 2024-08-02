import React ,{useEffect,useState} from 'react'
import "./style.scss"
import axios from 'axios';
import TransactionData from './TransactionData';
const Transaction = () => {
  const apiKey="68PRMJPH575KW49PHP9UTKH33IRSVRF4TR";
  const AccountAddres="0xE46913AF1C05E481df783C734f0FC3e5aE8b9434";
  // const ApiUrl=`https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${AccountAddres}&startblock=0&endblock=99999999&page=1&offset=0&sort=asc&limit=20&apikey=${apiKey}`;
  const ApiUrl= `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=0xE46913AF1C05E481df783C734f0FC3e5aE8b9434&startblock=0&endblock=99999999&page=1&sort=desc&apikey=68PRMJPH575KW49PHP9UTKH33IRSVRF4TR
  `
 const [response,setResponse]=useState("")
 const fetchData=async(Url)=>{
        try{
          const response = await axios.get(Url);
          const data = response.data;
          // Log or process the data here
          console.log(data);
      setResponse(data);
          return data;
        }    
        catch(error){
   console.log(error)
        }
 }
 
  useEffect(()=>{
    fetchData(ApiUrl)
  },[])
  return (
    <div className='Block'>
    <div className="Transaction-block">
    <div className="Head">
    {
      response && <>
      <p>{`A Total of ${response.result.length} Transaction Found / Latest 20 Transaction`}</p>
      </>
    }
   
      <thead>
      <tr>
        <th>Txn Hash</th>
        <th>Method</th>
        <th>Block</th>
        <th className='converted'>Timestamp</th>
        <th className='from-to'>From</th>
        <th className='from-to'>To</th>
        <th className='headingValue'>Value</th>
        <th className='converted '>Gas fee</th>
        </tr>
      </thead>
      <tbody>
        <TransactionData response={response}/>
      </tbody>
      </div>
    </div>
      
    </div>
  )
}

export default Transaction;