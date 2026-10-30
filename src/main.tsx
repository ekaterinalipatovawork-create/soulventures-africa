import React from 'react';import {createRoot}from'react-dom/client';import {Viewport}from'./Viewport';import {App}from'./App';import './fonts.css';import './design.css';import './styles.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><Viewport><App/></Viewport></React.StrictMode>);
