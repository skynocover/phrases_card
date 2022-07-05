import React from 'react';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { AppContext } from '../AppContext';

import { styled } from '@mui/material/styles';
import MuiGrid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import { translate, langs } from '../components/translate.js';
import { cardStorage } from '../utils/phrases.db';
import { settingStorage } from '../utils/setting.db';
import { LanguageSelect } from '../components/LanguageSelect';
import { speak } from '../utils/speak';

export default function Home() {
  const appCtx = React.useContext(AppContext);
  const [content, setContent] = React.useState<string>('');
  const textInput = React.useRef(null);

  const [from, setFrom] = React.useState<string>('auto');
  const [detectFrom, setDetextFrom] = React.useState<string>('');
  const [fromExpand, setFromExpand] = React.useState<boolean>(false);

  const [to, setTo] = React.useState<string>('zh-TW');
  const [toExpand, setToExpand] = React.useState<boolean>(false);

  const [selectedWord, setSelectedWord] = React.useState<string>('');
  const [autoSpeech, setAutoSpeech] = React.useState<boolean>(false);

  const getSelected = async () => {
    const temp = window.getSelection();
    if (temp) {
      const selectText = temp.toString();
      if (selectText) {
        const { text } = await translate(selectText, from, to);
        setSelectedWord(text.join(''));
        if (autoSpeech) {
          speak(selectText, from);
        }
      }
    }
  };

  const init = async () => {
    try {
      const from = await settingStorage.get('from');
      if (from) {
        setFrom(from);
      }
      const to = await settingStorage.get('to');
      if (to) {
        setTo(to);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  const setTranslate = async (input: string) => {
    const { lang, text } = await translate(input, from, to);
    setContent(text ? text.join('') : '');
    setDetextFrom(lang);
  };

  const newCard = async () => {
    const temp = window.getSelection();
    if (temp) {
      const origin = temp.toString();
      if (origin) {
        await cardStorage.add({
          origin,
          translate: selectedWord,
          /* @ts-ignore */
          sentence: textInput.current.value,
        });
      }
    }
  };

  return (
    <>
      <div className="flex mt-2">
        <TextField
          value={selectedWord}
          label={!!selectedWord ? '' : 'Highlight Text'}
          variant="outlined"
          disabled={true}
        />
        <IconButton aria-label="delete" onClick={() => setAutoSpeech(!autoSpeech)}>
          {autoSpeech ? <VolumeUpIcon /> : <VolumeOffIcon />}
        </IconButton>
        <Button variant="contained" onClick={newCard}>
          Create New Card
        </Button>
      </div>
      <Grid container>
        <Grid item xs>
          <div className="flex-col justify-center m-2">
            <div className="flex justify-center">
              <LanguageSelect
                expand={fromExpand}
                setExpand={setFromExpand}
                selected={from}
                setChoose={setFrom}
                setSettingStorage={(input: string) => settingStorage.set('from', input)}
              />
              {!fromExpand && (
                <>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setContent('');
                      /* @ts-ignore */
                      textInput.current.value = '';
                      setSelectedWord('');
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    /* @ts-ignore */
                    onClick={() => speak(textInput.current.value, from)}
                  >
                    <VolumeUpIcon />
                  </IconButton>
                </>
              )}
            </div>

            <TextField
              id="filled-multiline-static"
              /* @ts-ignore */
              label={detectFrom && detectFrom !== from && 'Detect: ' + langs[detectFrom]}
              multiline
              variant="filled"
              onChange={(e) => setTranslate(e.target.value)}
              inputRef={textInput}
              onMouseUp={getSelected}
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
              setSettingStorage={(input: string) => settingStorage.set('to', input)}
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
