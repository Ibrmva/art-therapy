import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Gentext from './pages/Gentext/Gentext';
import ImageGenerate from './pages/ImageGenerate/ImageGenerate';

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path="/" element={<ImageGenerate />} />
        <Route path="/gentext" element={<Gentext />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
