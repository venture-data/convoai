import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

const AIDial = lazy(() => import('./screens/AIDial'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<AIDial />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
