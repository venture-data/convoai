import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('./screens/Home'));
const AIDial = lazy(() => import('./screens/AIDial'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aidial" element={<AIDial />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
