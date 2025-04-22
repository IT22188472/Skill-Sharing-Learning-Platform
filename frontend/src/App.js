import { Route, Routes } from 'react-router-dom';
import './App.css';
import Authentication from './pages/Authentication/Authentication';
import HomePage from './pages/HomePage/HomePage';

function App() {
  return (
    <div className="">

      <Routes>         
        <Route path='/*' element={<HomePage/>}/>   
        <Route path='/*' element={<Authentication/>}/>              
      </Routes>

      
      
      
     
    </div>
  );
}

export default App;
