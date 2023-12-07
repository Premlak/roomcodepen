import {useEffect, useState} from "react";
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/css/css.js';
import 'codemirror/addon/edit/closetag.js';
import 'codemirror/addon/edit/closebrackets.js';
import { useAppContext } from "./Allcode.js";
import ACTIONs from "../Actions.js";
export default function CSS({socketRef,roomId,onCodeChange}){
    const {cssRef} = useAppContext();
    const [open,setOpen] = useState(false);
    useEffect(()=>{
        async function init(){
            cssRef.current = Codemirror.fromTextArea(
                document.getElementById('css'),
                {
                    mode: { name: 'css', json: true },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );
            cssRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONs.CSS_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });
        }init();
    },[]);
    useEffect(()=>{
        if (socketRef.current) {
            socketRef.current.on(ACTIONs.CSS_CHANGE, ({ code }) => {
                if (code !== null) {
                    console.log(code);
                    cssRef.current.setValue(code);
                }
            });
        }
        return () => {
            socketRef.current.off(ACTIONs.CSS_CHANGE);
        };
    },[socketRef.current])
    return(
        <div className={`editor-container ${open ? '' : 'collapsed'}`}>
        <div className='editor-title'>
            CSS
            <button className="edibtn" onClick={()=>setOpen(!open)}>{open ? 'Hide' : 'Show'}</button>
        </div> 
        <textarea id="css" className="code-mirror-wrapper"/>
    </div>
    )
}