import { Route, Routes } from 'react-router-dom';
import './App.css';
import Authentication from './pages/Authentication/Authentication';
import HomePage from './pages/HomePage/HomePage';
import React from 'react';
import Register from './pages/Authentication/Register';

function App() {
  return (
    <div className="">

      <Routes>         
        <Route path='/*' element={<HomePage/>}/>   
        <Route path='/*' element={<Authentication/>}/>
        <Route path='/register' element={<Register/>}/> 
                    
      </Routes>

      
      
      
     
    </div>
  );
}

export default App;
