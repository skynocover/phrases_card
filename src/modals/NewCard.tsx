import React from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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

export default function Index({
  modalOpen,
  closeModal,
  origin,
  translate,
  detectFrom,
  sentence,
}: {
  modalOpen: boolean;
  closeModal: Function;
  origin: string;
  translate: string;
  sentence: string;
  detectFrom?: string;
}) {
  const [newTranslate, setTranslate] = React.useState<string>('');
  const [comment, setComment] = React.useState<string>('');

  React.useEffect(() => {
    setTranslate(translate);
  }, [translate]);

  const newCard = async () => {
    const setting = await db.setting.get(1);
    const from = detectFrom ? detectFrom : setting ? setting.homeTranslate.from : 'auto';
    const to = setting ? setting.homeTranslate.to : 'zh-TW';
    const temp: Card = {
      origin,
      translate,
      sentence,
      comment,
      from,
      to,
      star: 0,
    };
    await db.cards.add(temp);
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
            <div className="flex flex-col items-center ">
              <div className="w-full h-[180px] overflow-scroll p-2 mb-3 bg-gray-800">
                <Typography variant="h6">{sentence}</Typography>
              </div>
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
