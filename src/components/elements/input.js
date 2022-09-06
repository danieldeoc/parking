import React from "react";

function Input(props){
    return(
        <label>
            {props.label}
            <input type={props.type} 
                name={props.name} id={props.id} onChange={props.onChangeHandler} />
        </label>
    )
}
export default Input;