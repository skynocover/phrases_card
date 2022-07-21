import { useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Paper } from '@mui/material';

import Home from './pages/Home';
import About from './pages/About';
import Card from './pages/Card';
import Login from './pages/Login';
import Setting from './pages/Setting';
import Header from './components/Header';
import useSetting from './hooks/useSetting';
import { BackendlessContext } from './hooks/useBackendless';

const NotFound = () => {
  return <div>This is wrong way</div>;
};

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const backendlessCtx = useContext(BackendlessContext);
  const { syncSetting } = useSetting();

  useEffect(() => {
    syncSetting();
  }, [backendlessCtx.currentUser]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper square className="h-screen overflow-scroll">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="cards" element={<Card />} />
          <Route path="setting" element={<Setting />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
