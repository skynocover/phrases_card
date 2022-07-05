import React from 'react';

import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import ButtonGroup from '@mui/material/ButtonGroup';

import { AppContext } from '../AppContext';
import { cardStorage } from '../utils/phrases.db';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Home() {
  const appCtx = React.useContext(AppContext);
  const [cards, setCards] = React.useState<any[]>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [index, setIndex] = React.useState<number>(0);
  const [answer, setAnswer] = React.useState<boolean>(false);

  const init = async () => {
    try {
      const keys = await cardStorage.keys();
      let cards: any[] = [];
      for (const key of keys) {
        const v = await cardStorage.get(key);
        cards.push(v);
      }
      setCards(cards);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const next = (rate: '1' | '2' | '3' | '4' | 'Enter') => {
    if (answer) {
      if (index + 1 > cards.length - 1) {
        setOpenModal(false);
        setAnswer(false);
        setIndex(0);
        return;
      }
      setIndex(index + 1);
      setAnswer(false);
    } else {
      setAnswer(true);
    }
  };

  const keyDownHandler = (event: any) => {
    console.log('User pressed: ', event.key);

    switch (event.key) {
      case 'Enter':
      case '1':
      case '2':
      case '3':
      case '4':
        event.preventDefault();

        next(event.key);
        break;

      default:
        break;
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  return (
    <div onKeyDown={keyDownHandler}>
      <div className="flex mt-2 mr-2">
        <div className="flex-1"></div>
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Review
        </Button>
      </div>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Slider
            marks
            max={cards.length - 1}
            value={index}
            /* @ts-ignore */
            onChange={(e) => setIndex(e.target.value)}
            aria-label="Disabled slider"
          />
          <div className="flex-col items-center justify-center h-60">
            {cards.length > 0 && <Typography variant="h4">{cards[index].origin}</Typography>}
            {answer && <Typography variant="h4">{cards[index].translate}</Typography>}
          </div>
          <div className="flex justify-center">
            <ButtonGroup color="primary">
              <Button key="skip">Skip</Button>
              <Button key="2">Two</Button>
              <Button key="3">Three</Button>
              <Button key="4">Three</Button>
            </ButtonGroup>
          </div>
        </Box>
      </Modal>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 200 }} align="right">
                Origin
              </TableCell>
              <TableCell style={{ width: 200 }} align="left">
                Translate
              </TableCell>
              <TableCell align="left">sentence</TableCell>
              <TableCell align="left">star</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cards.map((cards: any, index: number) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" align="right">
                  {cards.origin}
                </TableCell>
                <TableCell align="left">{cards.translate}</TableCell>
                <TableCell align="left">{cards.sentence}</TableCell>
                <TableCell align="left">
                  <Rating name="simple-controlled" value={cards.value} disabled={true} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
