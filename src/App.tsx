import { useState } from 'react';
import logo from './logo.svg';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import { amber, deepOrange, grey } from '@mui/material/colors';
import { PaletteMode } from '@mui/material';
// import {grey} from '@mui/material/colors'

import Home from './pages/Home';
import About from './pages/About';

import Header from './components/Header';
import { Box, Card, Paper } from '@mui/material';
// import './App.css';

import Button from '@mui/material/Button';

const NotFound = () => {
  return <div>你来到了没有知识的荒原</div>;
};

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Paper square className="h-screen overflow-scroll">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
