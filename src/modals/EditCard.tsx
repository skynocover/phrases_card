import React from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';

import Divider from '../components/Divider';
import { cardStorage } from '../utils/phrases.db';
import { cardType } from './Card';

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

export default function Index({
  card,
  closeModal,
  refresh,
}: {
  card: cardType | undefined;
  closeModal: any;
  refresh: Function;
}) {
  const [newCard, setNewCard] = React.useState<cardType>();

  React.useEffect(() => {
    if (card) {
      setNewCard(card);
    }
  }, [card]);

  const editCard = async () => {
    await cardStorage.set(newCard);
    refresh();
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
                label="Origin"
                variant="outlined"
                margin="normal"
                style={{ width: '75%' }}
                onChange={(e) => newCard && setNewCard({ ...newCard, origin: e.target.value })}
                value={newCard?.origin}
              />

              <TextField
                label="Sentence"
                variant="outlined"
                margin="normal"
                style={{ width: '75%' }}
                onChange={(e) => newCard && setNewCard({ ...newCard, sentence: e.target.value })}
                value={newCard?.sentence}
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
                value={newCard?.star}
                max={4}
                onChange={(event, newValue) =>
                  newCard && setNewCard({ ...newCard, star: newValue || 0 })
                }
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
