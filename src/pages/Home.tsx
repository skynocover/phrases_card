import React from 'react';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { styled } from '@mui/material/styles';
import MuiGrid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';

import { translate, langs } from '../components/translate.js';
import axios from 'axios';

var synth = window.speechSynthesis;

function speak(text: any, repeatTimes: any) {
  var utterThis = new SpeechSynthesisUtterance(text);
  utterThis.lang = 'ja-JP';
  // utterThis.lang = 'zh-TW';
  utterThis.onend = function (event) {
    console.log('SpeechSynthesisUtterance.onend');
  };
  utterThis.onerror = function (event) {
    console.error('SpeechSynthesisUtterance.onerror');
  };
  utterThis.pitch = 1;
  utterThis.rate = 1;
  for (var i = 0; i < repeatTimes; i++) {
    synth.speak(utterThis);
  }
}

const LanguageSelect = ({
  expand,
  setExpand,
  selected,
  setChoose,
  forbiddenAuto,
}: {
  expand: boolean;
  setExpand: Function;
  selected: string;
  setChoose: Function;
  forbiddenAuto?: boolean;
}) => {
  return (
    <Accordion expanded={expand} onChange={() => setExpand(!expand)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        {/** @ts-ignore */}
        <Typography>{langs[selected]}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 gap-2">
          {Object.keys(langs)
            .filter((item) => (forbiddenAuto ? item !== 'auto' : true))
            .map((item, index) => {
              return (
                <div
                  className={`flex justify-center item-center ${
                    item === selected && 'border border-slate-400'
                  }`}
                  key={index}
                >
                  <Button
                    key={index}
                    variant="text"
                    onClick={() => {
                      setChoose(item);
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
};

export default function Home() {
  const [content, setContent] = React.useState<string>('');
  const [from, setFrom] = React.useState<string>('auto');
  const [fromExpand, setFromExpand] = React.useState<boolean>(false);

  const [to, setTo] = React.useState<string>('zh-TW');
  const [toExpand, setToExpand] = React.useState<boolean>(false);

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const init = async () => {
    try {
    } catch (error: any) {
      console.log(error.message);
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  const setTranslate = async (input: string) => {
    console.log({ input });
    const { lang, text } = await translate(input, from, to);
    console.log(text);
    setContent(text ? text.join('') : '');
  };

  return (
    <>
      {/* <div>
        <Button variant="contained">Contained</Button>
        <Checkbox {...label} />
      </div> */}
      <Grid container>
        <Grid item xs>
          <div className="flex-col justify-center m-2">
            <LanguageSelect
              expand={fromExpand}
              setExpand={setFromExpand}
              selected={from}
              setChoose={setFrom}
            />

            <TextField
              id="filled-multiline-static"
              label="Origin"
              multiline
              variant="filled"
              onChange={(e) => setTranslate(e.target.value)}
              fullWidth
            />
          </div>
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item xs>
          <div className="flex-col justify-center m-2">
            <LanguageSelect
              expand={toExpand}
              setExpand={setToExpand}
              selected={to}
              setChoose={setTo}
              forbiddenAuto
            />
            <TextField
              id="filled-multiline-static"
              disabled
              // label="Multiline"
              multiline
              // rows={8}
              // variant="filled"
              value={content}
              fullWidth
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
}

const Grid = styled(MuiGrid)(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& [role="separator"]': {
    margin: theme.spacing(0, 2),
  },
}));
