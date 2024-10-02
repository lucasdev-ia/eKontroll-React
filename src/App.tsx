import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from "./pages/Dashboard";
import ClientList from './pages/ClientList'; 
import Calendar from './pages/Calendar'; 
import Calendar2 from './pages/Calendar2';
import Faturamento from './pages/Faturamento';
import subLimite from "./pages/sublimite";
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/calendario' element={<Calendar />} />
        <Route path='/clientes' element={<ClientList />} />
        <Route path='/calendarioSocios' element={<Calendar2 />} />
        <Route path='/calendarioSocios' element={< Calendar2 />} />
        <Route path='/faturamento' element={<Faturamento /> } />
        <Route path='/sublimite' element={<subLimite/> } />
      </Routes> 
    </Router>
  );
}

export default App;