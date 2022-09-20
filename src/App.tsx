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
        <Route path=':id/convert' element={<Processor type={'convert'}/>}/>
        <Route path=':id/visualization' element={<Processor type={'visualization'}/>}/>
        <Route path=':id/cleaning' element={<Processor type={'cleaning'}/>}/>
        <Route path=':id/cleaning/:method' element={<Processor type={'cleaning'}/>}/>
        <Route path=':id/processing' element={<Processor type={'processing'}/>}/>
        <Route path=':id/processing/:method' element={<Processor type={'processing'}/>}/>
        <Route path=':id/analyze' element={<Processor type={'analyze'}/>}/>
        <Route path=':id/analyze/:method' element={<Processor type={'analyze'}/>}/>
      </Routes>
    </div>
  );
}

export default App;
