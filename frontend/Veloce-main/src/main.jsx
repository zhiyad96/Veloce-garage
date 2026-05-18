// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import LazyLoadPage from './lazy/lazy.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <LazyLoadPage/>
//   </StrictMode>,
// )



import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import LazyLoadPage from './lazy/lazy.jsx';
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1057639794290-p47jbkpidvecn1kmv7k7nqdpgdvnapev.apps.googleusercontent.com">
    <LazyLoadPage />
    </GoogleOAuthProvider>
  </StrictMode>
);
