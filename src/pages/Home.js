import { v4 as uuid } from "uuid";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
const Home = () =>{
    const navigate = useNavigate();
    const [roomId,setRoomId] = useState('');
    const [userName,setUserName] = useState('');
    const CreateRoom = (e) => {
        e.preventDefault();
        const uuId = uuid();
        setRoomId(uuId);
        toast.success('Created Room');
    }
    const JoinRoom = () => {
        if(!roomId || !userName){
            toast.error('Room-ID: and Username Required');
        }else{
            navigate(`/editor/${roomId}`,{
                state:{
                    userName
                }
            });
        }
    }
    return(
        <div className="homePageWrapper">
            <div className="formWrapper">
            <img className="homePageLogo" src="/logo.png"/>
            <h4 className="mainLable">CodeRoom</h4>
            <div className="inputGroup">
                <input defaultValue={roomId} type="text" className="inputBox" placeholder="Enter Room-ID: or Genrate Room"onChange={(e)=>setRoomId(e.target.value)}/>
                <input value={userName} type="text" className="inputBox" placeholder="Your Name" onChange={(e)=>setUserName(e.target.value)}/>
                <button className="btn joinBtn" onClick={()=>JoinRoom()}>Get-IN</button>
                <span className="createInfo">
                    Don't have a Room! Create Now: &nbsp; &nbsp;<a onClick={(e)=>CreateRoom(e)} href="" className="createNewBtn">New Room</a>
                </span>
            </div>
            </div>
            <footer>Built by Godara! &nbsp;&nbsp;<a className="insta" href="https://www.instagram.com/premlakshaygodara/"><FontAwesomeIcon icon={faInstagram} size="2xl" shake/>&nbsp;premlakshaygodara</a></footer>
        </div>
    )
}
export default Home