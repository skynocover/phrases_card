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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { AppContext } from '../AppContext';
import { cardStorage } from '../utils/phrases.db';
import Card, { cardType } from '../modals/Card';
import DeleteCard from '../modals/DeleteCard';

export default function Home() {
  const appCtx = React.useContext(AppContext);
  const [cards, setCards] = React.useState<cardType[]>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const [currentCard, setCurrentCard] = React.useState<cardType>();

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

  React.useEffect(() => {
    init();
  }, []);

  const closeDeleteModal = () => {
    setCurrentCard(undefined);
  };

  return (
    <>
      <div className="flex mt-2 mr-2">
        <div className="flex-1"></div>
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Review
        </Button>
      </div>

      <Card cards={cards} open={openModal} closeModal={() => setOpenModal(false)} refresh={init} />

      <DeleteCard card={currentCard} refresh={init} closeModal={closeDeleteModal} />

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
              <TableCell align="left">comment</TableCell>
              <TableCell align="center">star</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cards.map((card: cardType, index: number) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" align="right">
                  {card.origin}
                </TableCell>
                <TableCell align="left">{card.translate}</TableCell>
                <TableCell align="left">{card.sentence}</TableCell>
                <TableCell align="left">{card.comment}</TableCell>
                <TableCell align="center">
                  <Rating name="simple-controlled" max={4} value={card.star} readOnly />
                </TableCell>
                <TableCell align="center">
                  <>
                    <Button>Edit</Button>
                    <Button
                      onClick={() => {
                        setCurrentCard(card);
                      }}
                    >
                      Delete
                    </Button>
                  </>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
