import React from 'react';

import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import ButtonGroup from '@mui/material/ButtonGroup';

import { AppContext } from '../AppContext';
import Divider from '../components/Divider';
import { cardStorage } from '../utils/phrases.db';

export interface cardType {
  id: number;
  origin: string;
  translate: string;
  sentence: string;
  comment: string;
  star?: number;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  backgroundColor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  color: 'white',
  // minHeight: 600,
  height: 600,
};

export default function Card({
  cards,
  open,
  closeModal,
  refresh,
}: {
  cards: cardType[];
  open: boolean;
  closeModal: Function;
  refresh: Function;
}) {
  const [index, setIndex] = React.useState<number>(0);
  const [answer, setAnswer] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (open) {
      setAnswer(false);
    }
  }, [open]);

  React.useEffect(() => {
    setAnswer(false);
  }, [index]);

  const next = async (key: '1' | '2' | '3' | '4' | 'Enter') => {
    if (answer) {
      await cardStorage.set({
        ...cards[index],
        star: key === 'Enter' ? 2 : +key,
      });
      if (index + 1 > cards.length - 1) {
        closeModal();
        setAnswer(false);
        setIndex(0);
        refresh();
        return;
      }
      setIndex(index + 1);
    } else if (key === 'Enter') {
      setAnswer(true);
    }
  };

  const keyDownHandler = async (event: any) => {
    switch (event.key) {
      case 'Enter':
      case '1':
      case '2':
      case '3':
      case '4':
        next(event.key);
        break;

      default:
        break;
    }

    event.preventDefault();
  };
  return (
    <div onKeyUp={keyDownHandler}>
      <Modal
        open={open}
        onClose={() => {
          closeModal();
          refresh();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="grid content-between h-full grid-cols-1">
            <Slider
              marks
              max={cards.length - 1}
              value={index}
              /* @ts-ignore */
              onChange={(e) => setIndex(e.target.value)}
              aria-label="Disabled slider"
            />

            <div className="flex flex-col items-center ">
              {cards.length > 0 && <Typography variant="h4">{cards[index].sentence}</Typography>}
              {cards.length > 0 && <Typography variant="h4">{cards[index].origin}</Typography>}

              {answer && (
                <>
                  <Divider />
                  <Typography variant="h4">{cards[index].translate}</Typography>
                  {cards[index].comment && (
                    <TextField
                      variant="filled"
                      label="comment"
                      margin="normal"
                      style={{ width: '75%' }}
                      value={cards[index].comment}
                      disabled={true}
                    />
                  )}
                </>
              )}
            </div>

            {answer ? (
              <div className="flex justify-center">
                <ButtonGroup color="primary">
                  <Button>1</Button>
                  <Button>2</Button>
                  <Button>3</Button>
                  <Button>4</Button>
                </ButtonGroup>
              </div>
            ) : (
              <div className="flex justify-center ">
                <Button variant="outlined" onClick={() => next('Enter')}>
                  Check Answer
                </Button>
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
}
