import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = "854312165167-ai2tevkg711312s6tjs3ujsv380nc3pc.apps.googleusercontent.com";

function App() {
    return (
        <GoogleOAuthProvider clientId={clientId}>
            <Router>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Login />} />
                    
                    {/* Redirect all unknown routes to Register */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
