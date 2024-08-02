import React ,{useEffect ,useState} from "react";
import './App.css';
import LoginPage from "./pages/LoginPage/LoginPage";
import User from "./pages/userScanner/user";
import {  Routes, Route, HashRouter } from "react-router-dom";
import {LoginPageProvider} from "./context/LoginPageContext"
import Header  from "./component/Header";
import Manufacture from "./pages/Manufacture/Manufacture";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Transaction from "./pages/Transaction/Transaction";
function App() {
  

  return (
    <HashRouter>
     <LoginPageProvider>
     <Header />
            <Routes>
                <Route path="/" element={ <LoginPage/>} />
                <Route path="/user" element={<User/>} />
                <Route path="/manufacture" element={<Manufacture/>}/>
                {/* <Route path="/complain" element={<Complain/>}/> */}
                <Route path="/manufacture/details" element={<ProductDetails/>}/>
                <Route path="/Transaction" element={<Transaction/>}/>
            </Routes>
            
            </LoginPageProvider>
         
        </HashRouter>

  );
}

export default App;