import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';

import Layout from './Components/Layout';
import ProtectedRoute from './Components/ProtectedRoute';

import Ingreso from './Pages/Ingreso';
import Registro from './Pages/Registro';
import AsignacionCitas from './Pages/Asignacion_citas';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/ingreso" element={<Ingreso />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/asignacion-citas" replace />} />
            <Route
              path="asignacion-citas"
              element={
                <ProtectedRoute>
                  <AsignacionCitas />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/asignacion-citas" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
