import React from 'react';

import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';

import { langs } from '../utils/translate.js';
import { settingStorage } from '../utils/setting.db';

export default function CardLanguageSelect({
  settingName,
  onlyLanguage,
}: {
  settingName: string;
  onlyLanguage: string[];
}) {
  const [expand, setExpand] = React.useState<boolean>(false);
  const [language, setLanguage] = React.useState<string>('');

  const setSettingStorage = async (input: string) => await settingStorage.set(settingName, input);

  React.useEffect(() => {
    settingStorage.get(settingName).then((item) => setLanguage(item || 'en'));
  }, []);

  return (
    <Accordion expanded={expand} onChange={() => setExpand(!expand)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        {/** @ts-ignore */}
        <Typography>{langs[language]}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="grid gap-2 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2">
          {onlyLanguage.map((item, index) => {
            return (
              <div
                className={`flex justify-center item-center ${
                  item === language && 'border border-slate-400'
                }`}
                key={index}
              >
                <Button
                  key={index}
                  variant="text"
                  onClick={() => {
                    setLanguage(item);
                    setSettingStorage(item);
                    setExpand(false);
                  }}
                >
                  {/** @ts-ignore */}
                  {langs[item]}
                </Button>
              </div>
            );
          })}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
