import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home/Home';
import Processor from './Components/Processor/Processor';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path=':id/:type' element={<Processor/>}/>
        <Route path=':id/:type/:method' element={<Processor/>}/>
      </Routes>
    </div>
  );
}

export default App;
