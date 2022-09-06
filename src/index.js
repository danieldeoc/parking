import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import AddCarPage from './components/pages/addCar';
import Navigator from './components/elements/navigator';
import ExitPage from './components/pages/RemoveCarPage';
import ParkedPage from './components/pages/parkedPage';

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( 
    <Router>
        <Navigator />
        <Routes>            
            <Route exact path="/" element={<AddCarPage />} />
            <Route path="/exit/:id" element={<ExitPage />} />
            <Route path='/parked' element={<ParkedPage />} />
        </Routes>
    </Router> 
);