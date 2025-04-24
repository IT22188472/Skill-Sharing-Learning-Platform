import { Route, Routes } from 'react-router-dom';
import './App.css';
import Authentication from './pages/Authentication/Authentication';
import HomePage from './pages/HomePage/HomePage';
import React, { useEffect } from 'react';
import Register from './pages/Authentication/Register';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileAction } from './Redux/Auth/auth.action';

function App() {
  const {auth}=useSelector(store=>store);
  const dispatch=useDispatch();
  const jwt=localStorage.getItem("jwt");

    useEffect(()=>{
      dispatch(getProfileAction(jwt))
    },[jwt])

  return (
    <div className="">

      <Routes>         
        <Route path='/*' element={auth.user?<HomePage/>:<Authentication/>}/>   
        <Route path='/*' element={<Authentication/>}/>
        <Route path='/register' element={<Register/>}/> 
                    
      </Routes>

      
      
      
     
    </div>
  );
}

export default App;
