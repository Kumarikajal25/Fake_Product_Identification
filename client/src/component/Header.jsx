import React,{useEffect, useState,useContext} from 'react'
import img from "../assest/logo.svg"
import "./style.scss"
import { useNavigate } from "react-router-dom";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useLocation } from 'react-router-dom';
import { LoginPageContext } from "../context/LoginPageContext";
import Swal from "sweetalert2";
const Header = () => {
  const {currentAccount} = useContext(LoginPageContext);
  const [mobileMenu, setMobileMenu] = useState(false);
  const[logoutbtn,setLogoutbtn]=useState(false)
  const navigate = useNavigate();
  const openMobileMenu = () => {
    setMobileMenu(true);
};
const { pathname } = useLocation();
console.log(pathname);
useEffect(()=>{
  if(pathname=="/user" || pathname=="/manufacture/details"){
    setLogoutbtn(true);
  }else if(pathname=="/"){
    setLogoutbtn(false);
  }
})
const handleTransaction=()=>{
  if (window.innerWidth < 768) {
    window.open(`https://sepolia.etherscan.io/address/${currentAccount}`, "_blank");
  } else {
    navigate("/Transaction");
    window.location.reload();
  }
 
}
  return (
    <div className={`header ${mobileMenu ? "mobileView" : ""}`}>
    <div className="img-log">
         <img src={img}></img>
    </div>
      <div className='menuItems'>
        <a className='menuItem' href="https://www.buyucoin.com/cryptocurrency"  target="_blank">Live Crypto Price</a>
        <a className='menuItem' onClick={() =>{ navigate("/manufacture")}}>Manufacture</a>
       {
        currentAccount &&
        <a className='menuItem'  onClick={handleTransaction} >Latest Transaction</a> 
       }  
        <button className={`${mobileMenu ? "menuItem" : ""}`}>
       { logoutbtn ? <a className='menuItem login' onClick={() =>{ 
       Swal.fire({
        title:'Are You sure?',
        text:'Logout Your Account',
        icon:'warning',
        showCancelButton:true,
        confirmButtonText:'Yes,Logout',
        cancelButtonText:'Cancel it'
       }).then((result)=>{
        if(result.isConfirmed){
          Swal.fire("Logout","Account Sucessfully Logout",'success');
          navigate("/");
        }
       });
        setMobileMenu(false);}}>logout</a>:
        <a className='menuItem login' onClick={() =>{
          navigate("/")
        setMobileMenu(false);}}>login</a>
         }</button>
        
        
      </div>
      <div className="mobileMenuItems">
                  
                  {mobileMenu ? (
                    
                      <VscChromeClose onClick={() => setMobileMenu(false)} />
                  ) : (
                      <SlMenu onClick={openMobileMenu} />
                  )}
              </div>
    </div>
  )
}

export default Header
