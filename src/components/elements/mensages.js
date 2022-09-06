import React from "react";


function Messager(props){
    return(
        <div id={props.id} className={`messager ${props.msgClass}`} >{props.msg}</div>
    );
}

export default Messager;