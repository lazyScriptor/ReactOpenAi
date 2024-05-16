// AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MapAPI from './pages/MapAPI';

export const routes = [
  { path: '/', name: 'Home', component: <Home /> },
  { path: '/map', name: 'MapAPI', component: <MapAPI /> },
];

const AppRouter = () => {
  return (
    <Router>
      <Navbar />

      <div className='container'>
        <Routes>

          {
            routes.map((route,index) => {
              return (
                <Route key={index} path={route.path} exact element={route.component} />
              );
            })
          }
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;