import React ,{useEffect,useState}from 'react'

const TransactionData = ({response}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update time every second

    return () => clearInterval(interval);
  }, []);
    const convertTimestamp = (timestamp) => {
        const Currenthours = time.getHours();
  const Currentminutes = time.getMinutes();
  const Currentseconds = time.getSeconds();
  const Currentyear = time.getFullYear();
  const Currentmonth = time.getMonth() + 1; 
  const Currentday = time.getDate();
const date = new Date(timestamp * 1000);
const year = date.getFullYear();
const month = date.getMonth() + 1; 
const day = date.getDate();

const hours = date.getHours();
const minutes = "0" + date.getMinutes();
const seconds = "0" + date.getSeconds();
const remaininghours= Currenthours-hours;
const remainingminute=Currentminutes-minutes.substr(-2);
const remainingsec= Currentseconds-seconds.substr(-2);
const Exactday=Currentday-day;
if(Currentday==day && Currentyear==year && Currentmonth==month){
  if(remaininghours!=0){
    if(remainingminute<0){
      return `${remaininghours}  hrs ${Math.abs(remainingminute)} min`
    }
    return `${remaininghours}  hrs  ${remainingminute} min`
  }else if(remainingminute>0){
    return ` ${remainingminute} min`
  }else {
    return `${remainingsec}sec`
  }
}else if(Exactday==1){
  if((60-Math.abs(remainingminute))<60 && (24-Math.abs(remaininghours))==1){
    return ` ${60-Math.abs(remainingminute)} min`
  }else{
    return ` ${24-Math.abs(remaininghours)} hrs ${Math.abs(remainingminute)} min`
  }
}else{
  return `${Exactday} day ${24-Math.abs(remaininghours)} hrs`
}
 

      };
      const formatEthereumAddress = (address) => {
        if (!address) {
          return '';
        }
      
        const firstPart = address.substring(0, 8);
        const lastPart = address.substring(address.length - 8);
      
        return `${firstPart}...${lastPart}`;
      };
    if (!response || !response.result) {
        return null; // or you can return a loading indicator or an empty message
      }
  return (
    <>
      {
        response.result.map((data)=>{
          const {hash,methodId,blockNumber,timeStamp,from,to,value,gasPrice,gasUsed} =data;
          const convertedTimestamp = convertTimestamp(timeStamp);
          const FromData = formatEthereumAddress(from);
          const ToData = formatEthereumAddress(to);
          return(<>
          <tr>
            <td>{`${hash.substring(0, 18)}...`}</td>
            <td>{methodId}</td>
            <td className='block'>{blockNumber}</td>
            <td className='time'>{convertedTimestamp} ago</td>
            <td className='from-to'>{FromData}</td>
            <td className='from-to'>{ToData}</td>
            <td className='value'>{value.substring(0, 1)}ETH</td>
            <td className='gasprice'>{((gasPrice*gasUsed)/ Math.pow(10, 19)).toFixed(5)}</td>
          </tr>
          </>)
        })
      }
    </>
  )
}

export default TransactionData