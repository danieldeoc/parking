import React from "react";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link} from "react-router-dom";

function Navigator(){
    return(
        <nav className="navigator">
            <Link to="/">Entradas</Link>
            <Link to="/parked">Estacionados</Link>
        </nav>
    )
}

export default Navigator;