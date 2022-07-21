import React from 'react';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

export default function ProgressBar({
  max,
  step,
  open,
}: {
  open: boolean;
  max: number;
  step: number;
}) {
  return (
    <>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress variant="determinate" value={Math.round((step / max) * 100)} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary">
              {Math.round((step / max) * 100) + `%`}
            </Typography>
          </Box>
        </Box>
      </Backdrop>
    </>
  );
}
