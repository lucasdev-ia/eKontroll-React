import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from "./pages/Dashboard";
import ClientList from './pages/ClientList'; 
import Calendar from './pages/Calendar'; 
import Calendar2 from './pages/Calendar2';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/calendario' element={<Calendar />} />
        <Route path='/clientes' element={<ClientList />} />
        <Route path='/calendarioSocios' element={< Calendar2/>} />
      </Routes> 
    </Router>
  );
}

export default App;
