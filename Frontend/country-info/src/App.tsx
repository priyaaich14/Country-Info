import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CountryList from './pages/CountryList';
import CountryDetail from './pages/CountryDetail';
import CompareCountries from './pages/CompareCountries';

const App: React.FC = () => {
  return (
    <Routes>
        <Route path="/" element={<CountryList />} />
        <Route path="/country/:code" element={<CountryDetail />} /> 
        <Route path="/compare" element={<CompareCountries />} />
      </Routes>
  
  );
};

export default App;
