import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import { cardStorage } from '../utils/phrases.db';
import { cardType } from './Card';

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
  const delCard = async () => {
    if (card) {
      await cardStorage.del(card.id);
      refresh();
    }
  };

  return (
    <Modal
      open={!!card}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="flex flex-col items-center justify-center h-60">
          {/* <Typography variant="h3">Delete This Card ?</Typography> */}
          <Typography variant="h4">{card?.origin}</Typography>
          <Typography variant="h4">{card?.translate}</Typography>
        </div>
        <div className="flex justify-around">
          <Button variant="contained" onClick={delCard}>
            Delete
          </Button>
          <Button onClick={closeModal}>Cancel</Button>
        </div>
      </Box>
    </Modal>
  );
}
