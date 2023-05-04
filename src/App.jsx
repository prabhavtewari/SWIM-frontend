import React from 'react';
import { Routes, Route } from "react-router-dom"
import Home from './Home';
import Prev from './Prev';


const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path="prev" element={ <Prev/> } />
      </Routes>
    </div>
  );
};

export default  App;
