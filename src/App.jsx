import React from 'react';
import { PrivateRoutes } from './components/index';
import { AuthProvider } from './utils/AuthContext';
import { Room, Login } from './pages/index';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route element={<PrivateRoutes />}>
            <Route path='/' element={<Room />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App;