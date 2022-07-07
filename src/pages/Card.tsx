import React from 'react';

import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

import { AppContext } from '../AppContext';
import { cardStorage } from '../utils/phrases.db';
import { settingStorage } from '../utils/setting.db';
import Card, { cardType } from '../modals/Card';
import DeleteCard from '../modals/DeleteCard';
import EditCard from '../modals/EditCard';
import EditCardReview from '../modals/EditCardReview';
import CardLanguageSelect from '../components/CardLanguageSelect';

// 區分不同語言庫
export default function Home() {
  const appCtx = React.useContext(AppContext);

  const pageSize = 10;

  const [count, setCount] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(0);

  const [cards, setCards] = React.useState<cardType[]>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openReviewSetting, setOpenReviewSetting] = React.useState<boolean>(true);

  const [currentCard, setCurrentCard] = React.useState<cardType>();
  const [editedCard, setEditedCard] = React.useState<cardType>();

  const [fromLanguage, setFromLanguage] = React.useState<string[]>([]);
  const [toLanguage, setToLanguage] = React.useState<string[]>([]);

  const init = async (_page = page) => {
    try {
      const from = await cardStorage.allLanguages('from');
      setFromLanguage(from);
      const to = await cardStorage.allLanguages('to');
      setToLanguage(to);

      const keys = await cardStorage.queryKeys(
        await settingStorage.get('cardFrom'),
        await settingStorage.get('to'),
      );

      setCount(keys.length);
      let cards: cardType[] = [];
      let end = _page * pageSize + pageSize;
      if (end > keys.length) end = keys.length;

      for (let i = _page * pageSize; i < end; i++) {
        const v = await cardStorage.get(keys[i]);
        cards.push(v);
      }
      setCards([...cards]);
      setPage(_page);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div className="flex mt-2 mr-2">
        <div className="grid grid-cols-2 ">
          <CardLanguageSelect settingName="cardFrom" onlyLanguage={fromLanguage} />
          <CardLanguageSelect settingName="to" onlyLanguage={toLanguage} />
        </div>
        <div className="flex-1"></div>

        <Button variant="contained" onClick={() => init()}>
          Filter
        </Button>
        <div className="ml-2" />
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Review
        </Button>
        <div className="ml-2" />
        <Button variant="outlined" onClick={() => setOpenReviewSetting(true)}>
          Review Setting
        </Button>
      </div>

      <Card cards={cards} open={openModal} closeModal={() => setOpenModal(false)} refresh={init} />

      <DeleteCard
        card={currentCard}
        refresh={() => {
          init();
          setCurrentCard(undefined);
        }}
        closeModal={() => setCurrentCard(undefined)}
      />
      <EditCard
        card={editedCard}
        refresh={() => {
          init();
          setEditedCard(undefined);
        }}
        closeModal={() => setEditedCard(undefined)}
      />

      <EditCardReview open={openReviewSetting} closeModal={() => setOpenReviewSetting(false)} />

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
              <TableCell style={{ width: 150 }} align="center">
                star
              </TableCell>
              <TableCell style={{ width: 200 }} align="center"></TableCell>
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
                    <Button onClick={() => setEditedCard(card)}>Edit</Button>
                    <Button onClick={() => setCurrentCard(card)}>Delete</Button>
                  </>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={count}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
        page={page}
        onPageChange={(e, p) => init(p)}
      />
    </>
  );
}
