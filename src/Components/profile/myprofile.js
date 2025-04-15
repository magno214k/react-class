import React,{useState} from "react";
import './myprofile.css';
import profilepic from '../assets/profilepic.png'

const Myprofile=()=>{
    const[showEdit,setShowEdit]=useState(false);
    const handleEdit=()=>{
        setShowEdit(true);
    }
    return(
        <header>
            <div className="mypro">
                <img src={profilepic}alt=""></img>
                <h2>Name</h2>
                <hr></hr>
                <h4>CONTACT INFORMATION</h4>
                <div className="profilegrid">
                    <p className="pg1">Email id:</p>
                    <p className="pg2">hk@gmail.com</p>
                    <p className="pg1">Phone:</p>
                    <p className="pg2">000000000</p>
                    <p className="pg1">Address:</p>
                    <p className="pg2"></p>
                </div>
                <h4>BASIC INFORMATION</h4>
                <div className="profilegrid">
                    <p className="pg1">Gender:</p>
                    <p className="pg1">Not Selected</p>
                    <p className="pg1">Birthday:</p>
                    <p className="pg1">Not Selected</p>
                </div>
                <button className="edit">Edit</button>
            </div>
        </header>
    )
}
export default Myprofile