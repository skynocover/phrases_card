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

const Enter = () => {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g id="🔍-System-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="ic_fluent_arrow_enter_24_filled" fill="#3f50b5" fill-rule="nonzero">
          <path
            d="M21,4 C21.5128358,4 21.9355072,4.38604019 21.9932723,4.88337887 L22,5 L22,11.5 C22,13.3685634 20.5357224,14.8951264 18.6920352,14.9948211 L18.5,15 L5.415,15 L8.70710678,18.2928932 C9.06759074,18.6533772 9.09532028,19.2206082 8.79029539,19.6128994 L8.70710678,19.7071068 C8.34662282,20.0675907 7.77939176,20.0953203 7.38710056,19.7902954 L7.29289322,19.7071068 L2.29289322,14.7071068 C2.25749917,14.6717127 2.22531295,14.6343256 2.19633458,14.5953066 L2.12467117,14.4840621 L2.12467117,14.4840621 L2.07122549,14.371336 L2.07122549,14.371336 L2.03584514,14.265993 L2.03584514,14.265993 L2.0110178,14.1484669 L2.0110178,14.1484669 L2.00397748,14.0898018 L2.00397748,14.0898018 L2,14 L2.00278786,13.9247615 L2.00278786,13.9247615 L2.02024007,13.7992742 L2.02024007,13.7992742 L2.04973809,13.6878575 L2.04973809,13.6878575 L2.09367336,13.5767785 L2.09367336,13.5767785 L2.14599545,13.4792912 L2.14599545,13.4792912 L2.20970461,13.3871006 L2.20970461,13.3871006 L2.29289322,13.2928932 L2.29289322,13.2928932 L7.29289322,8.29289322 C7.68341751,7.90236893 8.31658249,7.90236893 8.70710678,8.29289322 C9.06759074,8.65337718 9.09532028,9.22060824 8.79029539,9.61289944 L8.70710678,9.70710678 L5.415,13 L18.5,13 C19.2796961,13 19.9204487,12.4051119 19.9931334,11.64446 L20,11.5 L20,5 C20,4.44771525 20.4477153,4 21,4 Z"
            id="🎨-Color"
          ></path>
        </g>
      </g>
    </svg>
  );
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
                <Typography variant="h6">{'Familiarity: '}</Typography>
                <div className="mx-2" />

                <ButtonGroup color="primary">
                  <Button onClick={() => next('1')}>1</Button>
                  <Button onClick={() => next('2')} endIcon={<Enter />}>
                    2
                  </Button>
                  <Button onClick={() => next('3')}>3</Button>
                  <Button onClick={() => next('4')}>4</Button>
                </ButtonGroup>
              </div>
            ) : (
              <div className="flex justify-center ">
                <Button variant="outlined" onClick={() => next('Enter')} endIcon={<Enter />}>
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
