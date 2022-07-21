import React from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

import Divider from '../components/Divider';
import { db, Card } from '../utils/index.db';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 600,
  //   minHeight: 600,
  backgroundColor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  color: 'white',
};

export default function Index({ card, closeModal }: { card: Card | undefined; closeModal: any }) {
  const [newCard, setNewCard] = React.useState<Card>();

  React.useEffect(() => {
    if (card) {
      setNewCard(card);
    }
  }, [card]);

  const editCard = async () => {
    if (newCard) {
      await db.cards.put(newCard);
    }
    closeModal();
  };

  return (
    <>
      <Modal
        open={!!card}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="grid content-between h-full grid-cols-1">
            <div />
            <div className="flex flex-col items-center ">
              <TextField
                label="Sentence"
                variant="outlined"
                multiline={true}
                maxRows={6}
                margin="normal"
                style={{ width: '75%' }}
                onChange={(e) => newCard && setNewCard({ ...newCard, sentence: e.target.value })}
                value={newCard?.sentence}
              />

              <TextField
                label="Origin"
                variant="outlined"
                margin="normal"
                style={{ width: '75%' }}
                onChange={(e) => newCard && setNewCard({ ...newCard, origin: e.target.value })}
                value={newCard?.origin}
              />

              <Divider />

              <TextField
                label="Translate"
                variant="outlined"
                margin="normal"
                style={{ width: '75%' }}
                onChange={(e) => newCard && setNewCard({ ...newCard, translate: e.target.value })}
                value={newCard?.translate}
              />

              <TextField
                label="Comment"
                variant="outlined"
                margin="normal"
                style={{ width: '75%' }}
                onChange={(e) => newCard && setNewCard({ ...newCard, comment: e.target.value })}
                value={newCard?.comment}
              />

              <Rating
                name="simple-controlled"
                value={newCard?.star || 0}
                max={4}
                onChange={(e, v) => newCard && v && setNewCard({ ...newCard, star: v })}
              />
            </div>
            <div className="flex justify-center">
              <Button variant="contained" onClick={editCard}>
                Edit
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}
