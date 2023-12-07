import { useEffect, useState, useRef} from "react";
import Client from "../componets/Client.js";
import HtmlEditor from "../componets/Html.js";
import Javascript from '../componets/Javascript.js';
import CSS from "../componets/Css.js";
import { useAppContext } from "../componets/Allcode.js";
import { initSocket } from "../socket.js";
import ACTIONs from "../Actions.js";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
const Editor = () => {
    const location = useLocation();
    const [newHtml,setNewHtml] = useState('');
    const [newCss,setNewCss] = useState('');
    const [newJavascript,setNewJavascript] = useState('');
    const [sourceDoc,setSourceDoc] = useState('');
    const html = useRef(null);
    const css = useRef(null);
    const javascript = useRef(null);
    const socketRef = useRef(null);
    const navigate = useNavigate();
    const {htmlRef,cssRef,javascriptRef} = useAppContext();
    const [clients,SetClients] = useState([]);
    const {roomId} = useParams();
    useEffect(()=>{
        const init = async() => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error',(err)=>{toast.error("Server Not Connected");console.log(err);navigate('/');});
            socketRef.current.on('connect_failed',(err)=>{toast.error("Server Not Connected");console.log(err);navigate('/');});
            socketRef.current.emit(ACTIONs.JOIN,{
                roomId,
                userName: location.state?.userName
            });
            socketRef.current.on(ACTIONs.JOINED,({clients, userName, socketId})=>{
                if(userName !== location.state?.userName){
                    toast.success(`${userName}, Just Get in the Room`)
                }
                SetClients(clients);
                socketRef.current.emit(ACTIONs.HTML_SYNC,{
                    code: html.current,
                    roomId,
                })
                socketRef.current.emit(ACTIONs.CSS_SYNC,{
                    code: css.current,
                    roomId
                })
                socketRef.current.emit(ACTIONs.JAVASCRIPT_SYNC,{
                    code: javascript.current,
                    roomId
                })
            });
            socketRef.current.on(ACTIONs.DISCONNECTED,({socketId, userName})=>{
                toast.error(`${userName}, Just Got Out from the Room`);
                SetClients((prev)=>{
                    return prev.filter(client => client.socketId !== socketId)
                })
            })
        }
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONs.JOINED);
            socketRef.current.off(ACTIONs.DISCONNECTED);
        }
    },[])
    useEffect(()=>{
        const handlehtml = (instance,changes) => {
            setNewHtml(instance.getValue());
        }
        const handlecss = (instance,changes) => {
            setNewCss(instance.getValue());
        }
        const handeljavascript = (instance,changes) => {
            setNewJavascript(instance.getValue());
        }
        if(htmlRef.current || cssRef.current || javascriptRef.current){
            htmlRef.current.on('change',handlehtml)
            cssRef.current.on('change',handlecss)
            javascriptRef.current.on('change',handeljavascript)
            setSourceDoc(`
            <html>
            <style>
            body{
                background-color:white;
            }
            ${newCss}
            </style>
            <body>
            ${newHtml}
            </body>
            <script>
            ${newJavascript}
            </script>
            </html>`);
        }
    },[htmlRef.current,cssRef.current,javascriptRef.current,newHtml,newCss,newJavascript])
    if(!location.state){
        navigate('/');
    }
    return(
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img className="logoImage" src="/logo.png"/>
                    </div>
                    <h3>Connected</h3>
                    <div className="clientList">
                        {
                            clients.map((client)=>(<Client key={client.socketId} username={client.userName}/>))
                        }
                    </div>
                </div>
                <button className="btn copyBtn" onClick={async()=>{
                    try{
                       await navigator.clipboard.writeText(roomId);
                       toast.success('Room-ID: copied')
                    }catch{
                        toast.error('Error Ocured')
                    }
                }}>Copy Room-ID:</button>
                <button className="btn leaveBtn" onClick={()=>{
                    navigate('/');
                }}>Leave Room</button>
            </div>
            <div className="editorWrap">
                <div className="pane top-pane">
                <HtmlEditor 
                socketRef = {socketRef}
                roomId={roomId}
                onCodeChange={(code)=>{
                    html.current = code;
                }}/>
                <CSS 
                socketRef = {socketRef}
                roomId = {roomId}
                onCodeChange={(code)=>{
                    css.current = code;
                }}
                />
                <Javascript
                socketRef = {socketRef}
                roomId = {roomId}
                onCodeChange={(code)=>{
                    javascript.current = code;
                }} 
                />
                </div>
                <div className="pane">
                    <iframe srcDoc={sourceDoc} title="output" sandbox="allow-scripts" frameBorder="0" width="100%" height="100%"></iframe>
                </div>
            </div>
        </div>
    )
}
export default Editor;