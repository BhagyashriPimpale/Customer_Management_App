import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import CustomerForm from './CustomerForm';

const App = () => {
  return (
    <div>
      <header style={{ backgroundColor: '#5c5ce5' }} className="text-white text-center py-1 mb-4">
        <h1 className="display-4">Customer Management App</h1>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-customer" element={<CustomerForm />} />
        <Route path="/edit-customer/:id" element={<CustomerForm />} />
      </Routes>
    </div>
  );
};

export default App;
