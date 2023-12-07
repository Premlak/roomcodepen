import {useEffect, useState} from "react";
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/edit/closetag.js';
import 'codemirror/addon/edit/closebrackets.js';
import { useAppContext } from "./Allcode.js";
import ACTIONs from "../Actions.js";
export default function Javascript({socketRef,roomId,onCodeChange}){
    const {javascriptRef} = useAppContext();
    const [open,setOpen] = useState(false);
    useEffect(()=>{
        async function init(){
            javascriptRef.current = Codemirror.fromTextArea(
                document.getElementById('javascript'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );
            javascriptRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONs.JAVASCRIPT_CHANHE, {
                        roomId,
                        code,
                    });
                }
            });
        }init();
    },[]);
    useEffect(()=>{
        if (socketRef.current) {
            socketRef.current.on(ACTIONs.JAVASCRIPT_CHANHE, ({ code }) => {
                if (code !== null) {
                    console.log(code);
                    javascriptRef.current.setValue(code);
                }
            });
        }
        return () => {
            socketRef.current.off(ACTIONs.JAVASCRIPT_CHANHE);
        };
    },[socketRef.current])
    return(
        <div className={`editor-container ${open ? '' : 'collapsed'}`}>
        <div className='editor-title'>
            Java-Script
            <button className="edibtn" onClick={()=>setOpen(!open)}>{open ? 'Hide' : 'Show'}</button>
        </div>
        <textarea id="javascript" className="code-mirror-wrapper"/>
    </div>
    )
}