import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';

import Home from './pages/Home';
import About from './pages/About';
import Card from './pages/Card';

import Header from './components/Header';
import { Paper } from '@mui/material';

const NotFound = () => {
  return <div>This is wrong way</div>;
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
          <Route path="card" element={<Card />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
