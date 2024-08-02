import React ,{useEffect,useState} from "react";
import { ethers } from "ethers";
import { contractABI,contractAddres } from "../utils/Api";
import { Router, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Swal from "sweetalert2";
export const LoginPageContext =React.createContext();

 const { ethereum } =window;
 
const getEthereumContract =  ()=>{
  const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const LoginPageContract = new ethers.Contract(contractAddres,contractABI,signer);
    return {
        provider: provider,
        signer: signer,
        LoginPageContract: LoginPageContract,
      };
      
}

export const LoginPageProvider= ({children}) =>{
   const[currentAccount,setCurrentAccount]= useState("");
   const[signInData,setSignInData]=useState({
    AccountAddresssignIn:" ", PasswordsignIn:" "
   });
   const[signUpData ,setSignUPData]=useState({
    Username:" " ,AccountAddresssignUp:" ",PasswordsignUp:""

   })
   const[newsignInData,setNewsignInData]=useState({
    ModifyAccountAddress:" ",ModifyPasswordsignIn:" "
   })
   const navigate=useNavigate();
   const { pathname } = useLocation();
   const [value,setValue] =useState(true);
   const[sucessValue,setSucessValue]=useState(true);
   const[nextPage,setNextPage]=useState(false);
   const [otherPage ,setOtherPage]=useState(false);
   
   const  Reload=(Isreload)=>{
    setValue(Isreload);
    setSucessValue(Isreload);
   }
   const handleChange=(e,name,formType)=>{
    if(formType==="signUp"){
        setSignUPData((prevState)=>({
            ...prevState,[name]:e.target.value })); 
            setSignInData((prevState) => ({
                ...prevState,
                AccountAddresssignIn: "",
                PasswordsignIn: "",
              }));
              setNewsignInData((prevState) => ({
                ...prevState,
                ModifyAccountAddress: "",
                ModifyPasswordsignIn: "",
              
              }));
        
    }
       else if(formType==="signIn"){
        setSignInData((prevState)=>({
            ...prevState,[name]:e.target.value })); 

            setSignUPData((prevState) => ({
                ...prevState,
                AccountAddresssignUp: "",
                Username: "",
                PasswordsignUp: "",
              }));
              setNewsignInData((prevState) => ({
                ...prevState,
                ModifyAccountAddress: "",
                ModifyPasswordsignIn: "",
              
              }));
        }
        else{
            setNewsignInData((prevState)=>({
                ...prevState,[name]:e.target.value })); 
                setSignInData((prevState) => ({
                    ...prevState,
                    AccountAddresssignIn: "",
                    PasswordsignIn: "",
                  }));
                  setSignUPData((prevState) => ({
                    ...prevState,
                    AccountAddresssignUp: "",
                    Username: "",
                    PasswordsignUp: "",
                  }));
        }
       }
    const checkIfWalletIsConnected = async ()=>{
        
        try{
            if(!ethereum) return alert("please install metamask");
            const ConnectedAccounts = await ethereum.request({method :"eth_accounts"});
            if(ConnectedAccounts.length){
                setCurrentAccount(ConnectedAccounts);
                console.log(currentAccount);
            }else{
                Swal.fire('Warning!',"no account found",'warning');
            }
           
       }
        catch(error){
            console.log(error)
            Swal.fire('Error!',"No ethereum object.",'error');
        }
        
    }
    const connectWallet =async ()=>{
        
        try{
            if(!ethereum) return alert("please install metamask");
            const ConnectedAccounts = await ethereum.request({method :"eth_requestAccounts"});
            setCurrentAccount(ConnectedAccounts);
            Swal.fire("Success!",'Successfully Connected To metamask','success');
            
        }catch(error){
            Swal.fire('Error!',"No ethereum object.",'error');
        }
    }


    const sendData=async()=>{
            if(!ethereum) return Swal.fire('Warning!',"please install metamask",'warning');
            const{ AccountAddresssignIn ,PasswordsignIn} =signInData;
            const {AccountAddresssignUp , Username , PasswordsignUp} =signUpData;
            const{ModifyAccountAddress , ModifyPasswordsignIn}= newsignInData;
            console.log(currentAccount);
            try {
        if(Username && AccountAddresssignUp && PasswordsignUp){
           await createNewAccount( AccountAddresssignUp ,Username, PasswordsignUp);
        }
         if(AccountAddresssignIn && PasswordsignIn){
            await loginAccount(AccountAddresssignIn ,PasswordsignIn);
        }
        if(ModifyAccountAddress && ModifyPasswordsignIn){
              await  ModifyAccount(ModifyAccountAddress , ModifyPasswordsignIn)
        }
       
      
        
    }
    catch (error) {
        Swal.fire("Warning!","Enter the Data into Form or Incorrect Account-Address Format",'warning');
    }
      
        
    } 
    const createNewAccount= async(AccountAddresssignUp , Username , PasswordsignUp)=>{
        try{
            const {LoginPageContract} =  getEthereumContract();
            const data=  await LoginPageContract.newAccount(AccountAddresssignUp , Username , PasswordsignUp);
            await data.wait();
            setValue(true);
            Swal.fire("Success!","SuccessFully Account-Created",'success');
                
        }catch(error){
            if (error.message.includes("Account already exists")) {
                setValue(false);
                Swal.fire("Warning!","Account already exists",'warning');
            } else {
               Swal.fire("Error!", "Error Occur while creating New Account",'error');
            }
        }
       
    }
    const loginAccount= async(AccountAddresssignIn ,PasswordsignIn)=>{
        try{
            const {LoginPageContract} =  getEthereumContract();
            const datas =  await LoginPageContract.login(AccountAddresssignIn ,PasswordsignIn);
            setSucessValue(true);
            setNextPage(true);
            
        }catch(error){
            if (error.message.includes("Account does not exist") || error.message.includes("Wrong password")) {
                Swal.fire("Warning!","Account Does not exist or Wrong Password",'warning')
                setSucessValue(false);
                setNextPage(false);
            } else {
                Swal.fire("Error!", 'Error Occur While login into Your account','error');
            }
        }
    }
    const ModifyAccount=async(ModifyAccountAddress , ModifyPasswordsignIn)=>{
        try{
            const {LoginPageContract} =  getEthereumContract();
            const modifydata=  await LoginPageContract.modifyData(ModifyAccountAddress , ModifyPasswordsignIn);
            Swal.fire("Success!","Data Modified Succesfully",'success');
            // await modifydata.wait();
           
        }
        catch(error){
            Swal.fire("Warning!","please enter the account-data",'warning');
        }
    }
        
    useEffect(()=>{
        checkIfWalletIsConnected();
        getEthereumContract();
        console.log(getEthereumContract());
      
},[]);
useEffect(() => {
    if (nextPage || otherPage) {
        Swal.fire('Success!','Sucessfully Login into your Account','success');
      navigate("/user");  
    }
  }, [nextPage]);
useEffect(()=>{
   if(pathname==="/"){
    setNextPage(false);
    setOtherPage(true);
   }
})

    return (
        <LoginPageContext.Provider value={{connectWallet,currentAccount,signInData,setSignInData,signUpData ,
        setSignUPData,handleChange,sendData,value,newsignInData,setNewsignInData,sucessValue,Reload,signInData
        ,getEthereumContract,ethereum}}>
          {children}
        </LoginPageContext.Provider>
     
    )
};
