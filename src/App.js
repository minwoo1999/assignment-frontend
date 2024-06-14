import './App.css';
import {BrowserRouter as Route, Router, Routes } from "react-router-dom";
import Voc from './pages/voc/Voc';
import React from 'react'
function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Voc/>}></Route>
        </Routes>
      </Router>
      </div>
  );
}

export default App;
