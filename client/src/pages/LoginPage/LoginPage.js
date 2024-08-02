import React,{useState ,useContext} from 'react'
import "./style.scss";
import image from "../../assest/Ethereum.png"
import { LoginPageContext } from '../../context/LoginPageContext';
import { TbReload } from "react-icons/tb";


const LoginPage = () => {
  const {connectWallet ,currentAccount ,signInData,signUpData ,handleChange,sendData,value,newsignInData,sucessValue,Reload} = useContext(LoginPageContext);
  const [isSignInFormActive, setSignInFormActive] = useState(true);
    const[formForgotPass ,setFormForgotPass]=useState(false);
    
  const handleSignInClick = () => {
    setSignInFormActive(true);
    setFormForgotPass(false);
  };
  const handleSignUpClick = () => {
     setSignInFormActive(false);
     setFormForgotPass(false);
  };
  const handleSubmit=(e)=>{
   const{ AccountAddresssignIn ,PasswordsignIn} =signInData;
   const {Username ,AccountAddresssignUp , PasswordsignUp} =signUpData;
   const{ModifyAccountAddress,ModifyPasswordsignIn}=newsignInData;
    e.preventDefault();
 
   if((AccountAddresssignIn && PasswordsignIn) ||(Username && AccountAddresssignUp && PasswordsignUp) || (ModifyAccountAddress && ModifyPasswordsignIn)) sendData();
    return ;
  }
  
  
  const handleForgotPassword= ()=>{
    setFormForgotPass(true);
  };
  return (
    <div className="box">
    <div className='Tittle-container'>
    <div className="image-container">
    <img src={image} alt="Ethereum" />
    </div>
      <div className='Tittle'>
      <h1>Fake product identification system </h1>
     
      <p className="subtitle">Say No to Fake!</p>
     {
      !currentAccount && (
        <button className='btn' onClick={connectWallet}>Connect Wallet</button>
      )
      
     } 
      
    </div>
    </div>
    <div className="Input-container">
    <span className='border-line'></span>
      { isSignInFormActive? <>
        <div className="Input-Form">
        <form>
          <h2>Sign in</h2>
          <div className="inputBox">
         
            <input className="input" type="text" required="required" name="AccountAddresssignIn "  onChange={(e) => handleChange(e, "AccountAddresssignIn","signIn")}/>
            
            <span>Account-Address</span>
            
            
              <i>
             
              </i>
          </div>
          <div className="inputBox">
       
            <input className="input" type="password" required="required" name="PasswordsignIn"  onChange={(e) => handleChange(e, "PasswordsignIn","signIn")}/>
            <span>Password</span>
              <i></i>
          </div>
          <div className="links">
            <a  onClick={handleForgotPassword}>Forgot Password</a>
            <a  onClick={handleSignUpClick}>SignUp</a>
          </div>
          {sucessValue ?
            <input type="submit" onClick={handleSubmit} value="Sign In"/>:
            <>
            <span>Invalid Login or Password</span>
            <span onClick={()=>Reload(true)}><TbReload /></span>
            </>
            
            
            
            }
        </form>
       </div>
      </>  :
      <>
      <div className="Input-Form" >
        <form className='signUp'>
          <h2>Sign Up</h2>
         
          <div className="inputBox">
          
          <input className="input" type="text" required="required" name="AccountAddresssignUp" onChange={(e) => handleChange(e, "AccountAddresssignUp","signUp")}/>
          <span>Account-Address</span>
            <i></i>
        </div>
        <div className="inputBox">
            <input className="input signup" type="text" required="required" name="Username" onChange={(e) => handleChange(e, "Username","signUp")}/>
            <span>Username</span>
              <i>
              </i>
          </div>
          <div className="inputBox">
          
            <input className="input" type="password" required="required" name="PasswordsignUp" onChange={(e) => handleChange(e, "PasswordsignUp","signUp")}/>
            <span>Password</span>
              <i></i>
          </div>
          <div className="links">
          <div className="check">
          <input type="checkbox" className='chick'required="required"/>
            <a className='agree' >
             I have read terms &conditions</a>
            </div>
            <a onClick={handleSignInClick}>SignIn</a>
          </div>
          {value ?
            <input type="submit" onClick={handleSubmit} value="Sign Up"/>:
            <>
            <span>Account Already Exit</span>
            <span onClick={()=>Reload(true)}><TbReload /></span>
            </>
            
            
            
            }

             
        </form>
       </div>
      </>

      } { formForgotPass && 
      <>
         
         <div className="Input-Form">
        <form className='signUp'>
          <h3>Modify Password</h3>
          <div className="inputBox">
         
            <input className="input" type="text" required="required" name="ModifyAccountAddress"  onChange={(e) => handleChange(e, "ModifyAccountAddress")}/>
            
            <span>Account-Address</span>
            
            
              <i>
             
              </i>
          </div>
          <div className="inputBox">
       
            <input className="input" type="password" required="required" name="ModifyPasswordsignIn"  onChange={(e) => handleChange(e, "ModifyPasswordsignIn")}/>
            <span>New Password</span>
              <i></i>
          </div>
          <div className="inputBox">
          
          <input className="input" type="text" required="required" name="ModifyPasswordsignIn" onChange={(e) => handleChange(e, "ModifyPasswordsignIn")}/>
          <span>Confirm Password</span>
            <i></i>
        </div>
          <div className="links">
          <div className="check">
          <input type="checkbox" className='chick' required="required"/>
            <a className='agree'>
             agree to modify password</a>
            </div>
            <a  onClick={handleSignInClick}>SignIn</a>
          </div>
        
            <input type="submit" onClick={handleSubmit} value="confirm"/>
  
        </form>
       </div> </>
      }
      
       </div>
    </div>
  )
}

export default LoginPage;
