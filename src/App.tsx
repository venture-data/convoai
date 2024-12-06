import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Home from './screens/Home';
import AIDial from './screens/AIDial';

function App() {
  return (
    <Router>
       <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/aidial" element={<AIDial/>} />
        </Routes>
    </Router>
  )
}

export default App
