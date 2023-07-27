import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    BrowserRouter as Router,
    Route,
    Routes,
  } from "react-router-dom";
import App from './App';
import "./index.css"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router basename='/rcts/speech-collection'>
        <Routes>
            <Route exact path="/" element={<App />} />
        </Routes>
        {/* <App /> */}
    </Router>
);
