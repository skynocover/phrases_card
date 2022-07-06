import React from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Divider from '../components/Divider';
import { cardStorage } from '../utils/phrases.db';

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
  modalOpen,
  closeModal,
  origin,
  translate,
  sentence,
  from,
  to,
}: {
  modalOpen: boolean;
  closeModal: Function;
  origin: string;
  translate: string;
  sentence: string;
  from: string;
  to: string;
}) {
  const [newTranslate, setTranslate] = React.useState<string>('');
  const [comment, setComment] = React.useState<string>('');

  React.useEffect(() => {
    setTranslate(translate);
  }, [translate]);

  const newCard = async () => {
    const temp = {
      origin,
      translate,
      sentence,
      comment,
      from,
      to,
    };
    await cardStorage.add(temp);
    closeModal();
  };

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={() => closeModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="grid content-between h-full grid-cols-1">
            <div />
            <div className="flex flex-col items-center ">
              <Typography variant="h4">{sentence}</Typography>
              <Typography variant="h4">{origin}</Typography>

              <Divider />
              <TextField
                label="Translate"
                variant="outlined"
                margin="normal"
                style={{ width: '75%' }}
                onChange={(e) => setTranslate(e.target.value)}
                value={newTranslate}
              />

              <Divider />
              <TextField
                label="Comment"
                variant="filled"
                margin="normal"
                style={{ width: '75%' }}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <Button variant="contained" onClick={newCard}>
                Add new card
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}
