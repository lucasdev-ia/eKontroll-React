import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from "./pages/Dashboard";
import ClientList from './pages/ClientList'; // Remover a extensão '.tsx'
import Calendar from './pages/Calendar'; // Remover a extensão '.tsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/calendario' element={<Calendar />} />
        <Route path='/clients' element={<ClientList />} />
      </Routes> 
    </Router>
  );
}

export default App;
