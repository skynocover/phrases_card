import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import { Paper } from '@mui/material';

import Home from './pages/Home';
import About from './pages/About';
import Card from './pages/Card';
import Login from './pages/Login';
import Setting from './pages/Setting';
import Header from './components/Header';
import useSetting from './hooks/useSetting';

const NotFound = () => {
  return <div>This is wrong way</div>;
};

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const { syncSetting } = useSetting();
  const init = async () => {
    try {
      await syncSetting();
    } catch (error) {}
  };
  // useBeforeunload(async (event) => {
  //   await syncDB.setSetting();
  //   event.preventDefault();
  //   event.returnValue = false;
  // });
  useEffect(() => {
    init();
    const handleTabClose = async (event: any) => {
      // event.preventDefault();
      // event.returnValue = false;
      // await syncDB.setSetting();
      return;
    };
    window.addEventListener('beforeunload', handleTabClose);
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper square className="h-screen overflow-scroll">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="card" element={<Card />} />
          <Route path="setting" element={<Setting />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
