import {useEffect, useState} from "react";
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/addon/edit/closetag.js';
import 'codemirror/addon/edit/closebrackets.js';
import { useAppContext } from "./Allcode.js";
import ACTIONs from "../Actions.js";
const HtmlEditor = ({socketRef,roomId,onCodeChange}) => {
    const [open,setOpen] = useState(true);
    const {htmlRef} = useAppContext();
    useEffect(()=>{
        async function init(){
            htmlRef.current = Codemirror.fromTextArea(
                document.getElementById('html'),
                {
                    mode: { name: 'xml', json: true },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );
            htmlRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONs.HTML_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });
        }init();
    },[]);
    useEffect(()=>{
        if (socketRef.current) {
            socketRef.current.on(ACTIONs.HTML_CHANGE, ({ code }) => {
                if (code !== null) {
                    htmlRef.current.setValue(code);
                }
            });
        }
        return () => {
            socketRef.current.off(ACTIONs.HTML_CHANGE);
        };
    },[socketRef.current])
    return(
        <div className={`editor-container ${open ? '' : 'collapsed'}`}>
            <div className='editor-title'>
                HTML
                <button className="edibtn" onClick={()=>setOpen(!open)}>{open ? 'Hide' : 'Show'}</button>
            </div>
            <textarea id="html" className="code-mirror-wrapper"/>
        </div>
    )
}
export default HtmlEditor;