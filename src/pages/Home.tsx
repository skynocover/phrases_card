import React from 'react';
import TextField from '@mui/material/TextField';

import { styled } from '@mui/material/styles';
import MuiGrid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import { translate, langs } from '../utils/translate.js';
import { LanguageSelect } from '../components/LanguageSelect';
import NewCard from '../modals/NewCard';
import { speak } from '../utils/speak';
import useSetting from '../hooks/useSetting';

export default function Home() {
  // 原文
  const [text, setText] = React.useState<string>('');
  // 翻譯
  const [content, setContent] = React.useState<string>('');
  // 偵測語言
  const [detectFrom, setDetectFrom] = React.useState<string>();
  const [detectLabel, setDetectLabel] = React.useState<string>();

  const [hightLightText, setHightLightText] = React.useState<string>('');
  const [selectedWord, setSelectedWord] = React.useState<string>('');

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  const { setting, setSetting } = useSetting();

  const getSelected = async () => {
    const from = setting.homeTranslate.from;
    const to = setting.homeTranslate.to;
    const autoSpeech = setting.homeTranslate.autoSpeech;

    const temp = window.getSelection();
    if (temp) {
      const selectText = temp.toString();
      if (selectText) {
        setHightLightText(selectText);
        const { text } = await translate(selectText, from, to);
        setSelectedWord(text.join(''));
        if (autoSpeech) {
          speak(selectText, detectFrom || from);
        }
      }
    }
  };

  const getTranslate = async () => {
    const from = setting.homeTranslate.from;
    const to = setting.homeTranslate.to;

    const { lang, text: textRes } = await translate(text, from, to);

    setContent(text ? textRes.join('') : '');
    setDetectFrom(lang);
    /* @ts-ignore */
    const temp = langs[lang];
    if (from === 'auto' && temp) {
      setDetectLabel('Detect: ' + temp);
    } else {
      setDetectLabel(undefined);
    }
  };

  React.useEffect(() => {
    getTranslate();
  }, [text]);

  const Speak = async () => speak(text, detectFrom || setting.homeTranslate.from);

  const autoSpeech = async () => {
    setting.homeTranslate.autoSpeech = !setting.homeTranslate.autoSpeech;
    await setSetting(setting);
  };

  return (
    <>
      <NewCard
        modalOpen={modalOpen}
        closeModal={() => setModalOpen(false)}
        origin={hightLightText}
        translate={selectedWord}
        sentence={text}
        detectFrom={detectFrom}
      />
      <div className="flex items-center mt-2">
        <TextField
          value={selectedWord}
          label={!!selectedWord ? '' : 'Highlight Some Text'}
          variant="outlined"
          disabled={true}
        />
        <IconButton aria-label="delete" onClick={autoSpeech}>
          {(setting ? setting.homeTranslate.autoSpeech : false) ? (
            <VolumeUpIcon />
          ) : (
            <VolumeOffIcon />
          )}
        </IconButton>
        <Button variant="contained" size="large" onClick={() => selectedWord && setModalOpen(true)}>
          Create New Card
        </Button>
      </div>
      <Grid container>
        <Grid item xs>
          <div className="flex-col justify-center m-2">
            <div className="flex items-start">
              <LanguageSelect settingName="from" />

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
              <IconButton aria-label="delete" onClick={Speak}>
                <VolumeUpIcon />
              </IconButton>
            </div>

            <TextField
              id="filled-multiline-static"
              label={detectLabel}
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
            <LanguageSelect settingName="to" forbiddenAuto />
            <TextField id="filled-multiline-static" disabled multiline value={content} fullWidth />
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
