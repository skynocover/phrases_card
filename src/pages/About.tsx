import React from 'react';
import { useLocation } from 'react-router-dom';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Airtable from '../components/Airtable';
import Account from '../components/Account';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function About() {
  const [value, setValue] = React.useState(0);

  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  React.useEffect(() => {}, []);

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', height: 'calc(100vh - 70px)' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label="How to use" {...a11yProps(0)} />
        <Tab label="FAQ" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Account />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="flex justify-center">
          <Airtable />
        </div>
      </TabPanel>
    </Box>
  );
}
