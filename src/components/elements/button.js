import React from "react";

function Button(props){


    return(<button className="btn" type={props.type} onClick={props.submitHandler} >{props.label}</button>);
}

export default Button;