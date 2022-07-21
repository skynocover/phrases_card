import React from 'react';
import { Link } from 'react-router-dom';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import ProgressBar from '../modals/ProgressBar';
import useSetting from '../hooks/useSetting';
import { importFromXlsx, importFromJSON, export2JSON, export2Xlsx } from '../utils/import_export';

const AdditionalAction = () => {
  const [expand, setExpand] = React.useState<boolean>(false);

  // progress setting
  const [progressOpen, setProgressOpen] = React.useState<boolean>(false);
  const [progressStep, setProgressStep] = React.useState<number>(0);
  const [progressMax, setProgressMax] = React.useState<number>(0);

  const { setting, syncToAirtable } = useSetting();

  const sync = async () => {
    try {
      setProgressOpen(true);
      setProgressStep(0);
      await syncToAirtable(setProgressStep, setProgressMax);
    } catch (error) {
      console.log(error);
    }
    setProgressOpen(false);
  };

  return (
    <Accordion expanded={expand} onChange={() => setExpand(!expand)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Additional action</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="flex items-center justify-around space-x-2">
          {setting.airtable ? (
            <>
              <Button variant="contained" onClick={sync}>
                Sync to airtable
              </Button>
            </>
          ) : (
            <>
              <Link to={{ pathname: '/setting', hash: '#airtable' }}>
                <Button variant="contained">Go to set airtable</Button>
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center justify-center mt-3 space-x-2">
          <Typography>Export as </Typography>
          <ButtonGroup variant="outlined">
            <Button onClick={export2JSON}>JSON</Button>
            <Button onClick={export2Xlsx}>Xlsx</Button>
          </ButtonGroup>
        </div>

        <div className="flex items-center justify-center mt-3 space-x-2">
          <Typography>Import from </Typography>
          <ButtonGroup variant="outlined">
            <Button component="label">
              JSON
              <input hidden type="file" onChange={importFromJSON} />
            </Button>
            <Button component="label">
              Xlsx
              <input hidden type="file" onChange={importFromXlsx} />
            </Button>
          </ButtonGroup>
        </div>
      </AccordionDetails>

      <ProgressBar open={progressOpen} max={progressMax} step={progressStep} />
    </Accordion>
  );
};

export default AdditionalAction;
