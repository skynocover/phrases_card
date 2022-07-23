import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

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

const GotoSetAirtable = () => {
  return (
    <Link to={{ pathname: '/setting', hash: '#airtable' }}>
      <Button>airtable</Button>
    </Link>
  );
};

const AdditionalAction = () => {
  const [expand, setExpand] = React.useState<boolean>(false);

  // progress setting
  const [progressOpen, setProgressOpen] = React.useState<boolean>(false);
  const [progressStep, setProgressStep] = React.useState<number>(0);
  const [progressMax, setProgressMax] = React.useState<number>(0);

  const { setting, clearAllCards, exportToAirtable, importFromAirtable } = useSetting();

  const exportAirtable = async () => {
    try {
      const result = await Swal.fire({
        title: 'It will creates cards into airtable',
        showDenyButton: true,
        confirmButtonText: 'Yes, I know',
        denyButtonText: 'Let me think about it',
      });

      if (result.isConfirmed) {
        setProgressOpen(true);
        setProgressStep(0);
        await exportToAirtable(setProgressStep, setProgressMax);
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Export airtable error',
        text: 'The url or key for airtable may be wrong',
      });
      console.log(error);
    }
    setProgressOpen(false);
  };

  const importAirtable = async () => {
    try {
      const result = await Swal.fire({
        title: 'Would you like to clear all cards before importing?',
        text: 'Cards in local will be cleared',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'No, just import',
        denyButtonText: 'Yes, clear it all',
      });

      if (result.isConfirmed) {
        setProgressOpen(true);
        await importFromAirtable();
      }
      if (result.isDenied) {
        setProgressOpen(true);
        await clearAllCards();
        await importFromAirtable();
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Export airtable error',
        text: 'The url or key for airtable may be wrong',
      });
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
        <div className="flex items-center justify-center mt-2 space-x-2">
          <Typography>Export </Typography>
          <ButtonGroup variant="outlined">
            <Button onClick={export2JSON}>JSON</Button>
            <Button onClick={export2Xlsx}>Xlsx</Button>
            {setting.airtable?.url && setting.airtable?.key ? (
              <Button onClick={exportAirtable}>airtable</Button>
            ) : (
              <GotoSetAirtable />
            )}
          </ButtonGroup>
        </div>

        <div className="flex items-center justify-center mt-2 space-x-2">
          <Typography>Import </Typography>
          <ButtonGroup variant="outlined">
            <Button component="label">
              JSON
              <input hidden type="file" onChange={importFromJSON} />
            </Button>
            <Button component="label">
              Xlsx
              <input hidden type="file" onChange={importFromXlsx} />
            </Button>
            {setting.airtable?.url && setting.airtable?.key ? (
              <Button onClick={importAirtable}>airtable</Button>
            ) : (
              <GotoSetAirtable />
            )}
          </ButtonGroup>
        </div>
      </AccordionDetails>

      <ProgressBar open={progressOpen} max={progressMax} step={progressStep} />
    </Accordion>
  );
};

export default AdditionalAction;
