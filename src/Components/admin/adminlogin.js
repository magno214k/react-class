import React,{useEffect} from "react";
import './adminlogin.css';
import { Link } from "react-router-dom";
 
const Adminlogin = () =>{
useEffect(()=>{
    document.title="Admin panel";

    })
    return(
        <header>
            <div className="ad-login">
            <div className="ad-log-form">
                    <h2><span>Admin</span>  Login</h2>
                    <div>
                        <p>Email</p>
                        <input className="ad-log-fill" type="text"></input>
                    </div>
                    <div> 
                        <p>Password</p>
                        <input className="ad-log-fill"  type="text"></input>
                    </div>
                    <Link to="/admin"><button>Login</button></Link>
                    
                    <p>Doctor Login?<Link to="/doclogin">Click here</Link></p>
                </div>
            </div>
        </header>

    )

}
export default Adminlogin