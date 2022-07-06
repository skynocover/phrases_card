import React from 'react';
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

import { translate, langs } from '../utils/translate.js';
import { settingStorage } from '../utils/setting.db';
import { LanguageSelect } from '../components/LanguageSelect';
import NewCard from '../modals/NewCard';
import { speak } from '../utils/speak';

export default function Home() {
  const appCtx = React.useContext(AppContext);

  // 原文
  const [text, setText] = React.useState<string>('');
  // 翻譯
  const [content, setContent] = React.useState<string>('');

  const [from, setFrom] = React.useState<string>('auto');
  // 偵測語言
  const [detectFrom, setDetectFrom] = React.useState<string>();
  const [fromExpand, setFromExpand] = React.useState<boolean>(false);

  const [to, setTo] = React.useState<string>('zh-TW');
  const [toExpand, setToExpand] = React.useState<boolean>(false);

  const [hightLightText, setHightLightText] = React.useState<string>('');
  const [selectedWord, setSelectedWord] = React.useState<string>('');
  const [autoSpeech, setAutoSpeech] = React.useState<boolean>(false);

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  const getSelected = async () => {
    const temp = window.getSelection();
    if (temp) {
      const selectText = temp.toString();
      if (selectText) {
        setHightLightText(selectText);
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

  React.useEffect(() => {
    translate(text, from, to).then(({ lang, text }) => {
      setContent(text ? text.join('') : '');
      console.log({ lang, text });
      setDetectFrom(lang);
    });
  }, [text]);

  return (
    <>
      <NewCard
        modalOpen={modalOpen}
        closeModal={() => setModalOpen(false)}
        origin={hightLightText}
        translate={selectedWord}
        sentence={text}
        from={detectFrom || from}
        to={to}
      />
      <div className="flex mt-2">
        <TextField
          value={selectedWord}
          label={!!selectedWord ? '' : 'Highlight Some Text'}
          variant="outlined"
          disabled={true}
        />
        <IconButton aria-label="delete" onClick={() => setAutoSpeech(!autoSpeech)}>
          {autoSpeech ? <VolumeUpIcon /> : <VolumeOffIcon />}
        </IconButton>
        <Button variant="contained" onClick={() => selectedWord && setModalOpen(true)}>
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
                      setText('');
                      setSelectedWord('');
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => speak(text, from)}>
                    <VolumeUpIcon />
                  </IconButton>
                </>
              )}
            </div>

            <TextField
              id="filled-multiline-static"
              /* @ts-ignore */
              label={from === 'auto' && langs[detectFrom] && 'Detect: ' + langs[detectFrom]}
              multiline
              variant="filled"
              onChange={(e) => setText(e.target.value)}
              value={text}
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
