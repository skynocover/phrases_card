import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';

import { langs } from '../utils/translate.js';
import useSetting from '../hooks/useSetting';

export default function CardLanguageSelect({
  settingName,
  onlyLanguage,
}: {
  settingName: 'from' | 'to';
  onlyLanguage: string[];
}) {
  const [expand, setExpand] = React.useState<boolean>(false);

  const { setting, setSetting } = useSetting();

  const changeLanguage = async (item: string) => {
    setting.cardTranslate[settingName] = item;
    setSetting(setting);

    setExpand(false);
  };

  return (
    <Accordion expanded={expand} onChange={() => setExpand(!expand)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        {/** @ts-ignore */}
        <Typography>{langs[setting.cardTranslate[settingName]]}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="grid gap-2 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2">
          {onlyLanguage
            .filter((item) => item !== 'auto')
            .map((item, index) => {
              return (
                <div
                  className={`flex justify-center item-center ${
                    item === setting.cardTranslate[settingName] && 'border border-slate-400'
                  }`}
                  key={index}
                >
                  <Button key={index} variant="text" onClick={() => changeLanguage(item)}>
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
