import React from 'react';
import Slider from '@mui/material/Slider';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

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
  height: 150,
};

export default function ProgressBar({
  max,
  step,
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: any;
  max: number;
  step: number;
}) {
  return (
    <Modal
      open={open}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="flex items-center justify-center">
          <Slider marks max={max} value={step} getAriaValueText={(v) => `${v}`} />
        </div>
      </Box>
    </Modal>
  );
}
