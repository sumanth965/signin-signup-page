import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Pages/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import Login from './Pages/Login';

const clientId = "854312165167-ai2tevkg711312s6tjs3ujsv380nc3pc.apps.googleusercontent.com";

function App() {
    return (
        <GoogleOAuthProvider clientId={clientId}>
            <Router>
                <Routes>
                    <Route path="/" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
