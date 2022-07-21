import React from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';

import useSetting from '../hooks/useSetting';

const steps = [
  {
    label: 'Copy the template',
    component: (
      <>
        <Typography variant="h6">
          Go to{' '}
          <Link
            href="https://www.airtable.com/universe/expHqljI82V3MVkAh/phrase-cards-template"
            target="_blank"
          >
            Here
          </Link>
          , and click{' '}
          <Typography variant="h6" fontWeight={'bold'} style={{ display: 'inline' }}>
            Use template
          </Typography>{' '}
          button
        </Typography>

        <img className="mt-2" src={'/airtable/template.png'} alt={'template'} loading="lazy" />
      </>
    ),
  },
  {
    label: 'Copy url to setting',
    component: (
      <>
        <Typography variant="h6">
          After you have completed copying the base, copy and paste its url
        </Typography>

        <img className="mt-2" src={'/airtable/setting.png'} alt={'template'} loading="lazy" />
      </>
    ),
  },
  {
    label: 'Copy API key to setting',
    component: (
      <>
        <Typography variant="h6">
          Go to{' '}
          <Link href="https://airtable.com/account" target="_blank">
            your airtable account
          </Link>
          , and click{' '}
          <Typography variant="h6" fontWeight={'bold'} style={{ display: 'inline' }}>
            Generate API key
          </Typography>{' '}
          button
        </Typography>

        <img className="mt-2" src={'/airtable/generate.png'} alt={'template'} loading="lazy" />

        <Typography variant="h6">And paste it to above input</Typography>

        <img className="mt-2" src={'/airtable/key.png'} alt={'template'} loading="lazy" />
      </>
    ),
  },
];

export default function Airtable() {
  const [expand, setExpand] = React.useState<boolean>(false);

  // setting
  const { error, setting, setSetting, syncFromAirtable } = useSetting();

  const [url, setUrl] = React.useState<string>('');
  const [key, setKey] = React.useState<string>('');

  React.useEffect(() => {
    setUrl(setting.airtable?.url || '');
    setKey(setting.airtable?.key || '');
  }, [setting]);

  const [pending, setPending] = React.useState<boolean>(false);

  const set = async () => {
    setPending(true);
    const newSetting = { ...setting, airtable: { url, key } };
    await setSetting(newSetting);
    setPending(false);
  };

  const sync = async () => {
    setPending(true);
    await syncFromAirtable();
    setPending(false);
  };

  // step
  const [activeStep, setActiveStep] = React.useState(0);

  const handleStep = (input: number) => {
    setActiveStep((prevActiveStep) => prevActiveStep + input);
  };

  return (
    <div className="grid w-[36rem] grid-cols-2">
      <div className="flex justify-center col-span-2">
        <Typography variant="h4">Airtable Setting</Typography>
      </div>
      <div className="flex flex-col items-center col-span-2">
        <TextField
          fullWidth={true}
          label="airtable url"
          variant="outlined"
          margin="normal"
          onChange={(e) => setUrl(e.target.value)}
          value={url}
        />
      </div>
      <div className="flex flex-col items-start col-span-1">
        <TextField
          fullWidth={true}
          label="airtable key"
          variant="outlined"
          margin="normal"
          onChange={(e) => setKey(e.target.value)}
          value={key}
          type="password"
        />
      </div>

      <div className="flex justify-between col-span-2 mt-2">
        <Button variant="outlined" disabled={!setting.airtable} onClick={sync}>
          Sync cards from airtable
        </Button>
        <Button variant="contained" onClick={set}>
          Setting
        </Button>
      </div>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={pending}
        onClick={() => setPending(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="col-span-2 my-5">
        <Divider />
      </div>

      <div className="col-span-2">
        <Accordion expanded={expand} onChange={() => setExpand(!expand)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5">How to set airtable</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    optional={
                      index === 2 ? <Typography variant="caption">Last step</Typography> : null
                    }
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    <>{step.component}</>
                    <Box sx={{ mt: 2 }}>
                      <div>
                        <Button
                          variant="contained"
                          onClick={() => handleStep(1)}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1 ? 'Finish' : 'Continue'}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={() => handleStep(-1)}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
