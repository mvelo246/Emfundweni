import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Mission from './components/Mission';
import About from './components/About';
import TopStudents from './components/TopStudents';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/admin/login" />;
};

function App() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
              <Hero />
              <Mission />
              <About />
              <TopStudents />
              <Contact />
              <Footer />
            </div>
          }
        />
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
