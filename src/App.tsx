import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from "./pages/Dashboard";
import ClientList from './pages/ClientList.tsx';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard/>} />
        <Route path='/clients' element={<ClientList/>} />
      </Routes>
    </Router>
    </>
  );
}
export default App;
