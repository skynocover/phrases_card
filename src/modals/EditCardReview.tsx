import React from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InputAdornment from '@mui/material/InputAdornment';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../utils/index.db';

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
};

export default function Index({ open, closeModal }: { open: boolean; closeModal: any }) {
  const [reviewNumber, setReviewNumber] = React.useState<number>(0);
  const [probability, setProbability] = React.useState<number[]>([]);

  const setting = useLiveQuery(() => db.setting.get(1), [open]);
  const cardCount = useLiveQuery(async () => {
    let temp = [];
    for (let i = 0; i <= 4; i++) {
      const count = await db.cards
        .where('star')
        .equals(i)
        .and((c) => c.from === (setting ? setting.cardTranslate['from'] : 'en'))
        .and((c) => c.to === (setting ? setting.cardTranslate['to'] : 'zh-TW'))
        .count();
      temp.push(count);
    }

    return temp;
  });

  React.useEffect(() => {
    if (setting) {
      setReviewNumber(setting.review.reviewNumber);
      setProbability(setting.review.probability);
    }
  }, [setting]);

  const changeProbability = (index: number, input: number) => {
    const temp = [...probability];
    temp[index] = input;
    let all = 0;
    for (let i = 0; i < 4; i++) {
      all += +temp[i];
    }
    temp[4] = 100 - all;
    setProbability(temp);
  };

  const setSetting = async () => {
    if (setting) {
      await db.setting.put({ ...setting, review: { reviewNumber, probability } });
    }
    closeModal();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="grid content-between h-full grid-cols-1">
            <div />
            <div className="flex flex-col items-center ">
              <Typography variant="h4">Take cards into review deck</Typography>
              <TextField
                label="Deck quantity"
                variant="outlined"
                margin="normal"
                style={{ width: '75%' }}
                type="number"
                onChange={(e) => setReviewNumber(+e.target.value)}
                defaultValue={reviewNumber || 40}
              />

              <TableContainer>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">Star</TableCell>
                      <TableCell align="left">Take Probability</TableCell>
                      <TableCell width="200px" align="center">
                        Take / Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {probability.map((item, index) => {
                      return (
                        <>
                          <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row" align="right">
                              <Rating name="simple-controlled" value={index} max={4} readOnly />
                            </TableCell>
                            <TableCell align="left">
                              <TextField
                                type="number"
                                sx={{ m: 1 }}
                                InputProps={{
                                  endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                }}
                                value={item}
                                disabled={index === 4}
                                onChange={(e) => {
                                  changeProbability(index, +e.target.value);
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="h6">
                                {Math.round((reviewNumber * item) / 100) +
                                  ' / ' +
                                  (cardCount && cardCount[index])}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className="flex justify-center mt-2">
              {(probability.length > 0 && probability[4] < 0) || reviewNumber <= 0 ? (
                <Button variant="contained" disabled={true}>
                  Setting Fail
                </Button>
              ) : (
                <Button variant="contained" onClick={setSetting}>
                  Setting
                </Button>
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}
