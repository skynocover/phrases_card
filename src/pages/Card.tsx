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
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';

import { useLiveQuery } from 'dexie-react-hooks';

import { AppContext } from '../AppContext';
import ShowCard from '../modals/ShowCard';
import DeleteCard from '../modals/DeleteCard';
import EditCard from '../modals/EditCard';
import EditCardReview from '../modals/EditCardReview';
import CardLanguageSelect from '../components/CardLanguageSelect';
import { db, Card } from '../utils/index.db';
import { getLanguages } from '../utils/cardQuery';

import { importFromXlsx, importFromJSON, export2JSON, export2Xlsx } from '../utils/import_export';

export default function Index() {
  const appCtx = React.useContext(AppContext);

  const pageSize = 10;
  const [page, setPage] = React.useState<number>(0);
  const [searchInput, setSearchInput] = React.useState<string>('');
  const [range, setRange] = React.useState<number[]>([0, 4]);

  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openReviewSetting, setOpenReviewSetting] = React.useState<boolean>(false);

  const [currentCard, setCurrentCard] = React.useState<Card>();
  const [editedCard, setEditedCard] = React.useState<Card>();

  const setting = useLiveQuery(() => db.setting.get(1));

  const cards = useLiveQuery(
    () =>
      db.cards
        .where('star')
        .between(range[0], range[1], true, true)
        .and((c) => (searchInput === '' ? true : c.origin.includes(searchInput)))
        .and((c) => c.from === (setting ? setting.cardTranslate['from'] : 'en'))
        .and((c) => c.to === (setting ? setting.cardTranslate['to'] : 'zh-TW'))
        .offset(page * pageSize)
        .limit(pageSize)
        .sortBy('star'),
    [page, setting, range, searchInput],
  );

  const count = useLiveQuery(
    () =>
      db.cards
        .where('star')
        .between(range[0], range[1], true, true)
        .and((c) => (searchInput === '' ? true : c.origin.includes(searchInput)))
        .and((c) => c.from === (setting ? setting.cardTranslate['from'] : 'en'))
        .and((c) => c.to === (setting ? setting.cardTranslate['to'] : 'zh-TW'))
        .count(),
    [page, setting, range, searchInput],
  );

  const fromLanguage = useLiveQuery(async () => await getLanguages('from'));
  const toLanguage = useLiveQuery(async () => await getLanguages('to'));

  return (
    <>
      <div className="flex items-start mt-2 mr-2">
        <div className="grid grid-cols-2 ">
          <CardLanguageSelect settingName="from" onlyLanguage={fromLanguage || []} />
          <CardLanguageSelect settingName="to" onlyLanguage={toLanguage || []} />
        </div>
        <div className="flex-1"></div>
        <div className="ml-2" />

        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Review
        </Button>
        <div className="ml-2" />
        <Button variant="outlined" onClick={() => setOpenReviewSetting(true)}>
          Setting
        </Button>
      </div>

      <div className="flex items-center justify-start mx-4 space-x-4">
        <TextField
          label="Search origin"
          variant="outlined"
          margin="normal"
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
        />
        <Slider
          style={{ width: '25%' }}
          marks
          max={4}
          value={range}
          onChange={(e, newValue) => setRange(newValue as number[])}
          getAriaValueText={(v) => `${v}`}
        />
        <div className="flex-1" />
        <div className="flex items-center space-x-2">
          <Typography>Export as </Typography>
          <ButtonGroup variant="outlined">
            <Button onClick={export2JSON}>JSON</Button>
            <Button onClick={export2Xlsx}>EXCEL</Button>
          </ButtonGroup>
        </div>

        <div className="flex items-center space-x-2">
          <Typography>Import from </Typography>
          <ButtonGroup variant="outlined">
            <Button component="label">
              JSON
              <input hidden type="file" onChange={importFromJSON} />
            </Button>
            <Button component="label">
              Xlsx
              <input hidden type="file" onChange={importFromXlsx} />
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <ShowCard open={openModal} closeModal={() => setOpenModal(false)} />

      <DeleteCard card={currentCard} closeModal={() => setCurrentCard(undefined)} />
      <EditCard card={editedCard} closeModal={() => setEditedCard(undefined)} />

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
            {cards &&
              cards.map((card, index) => (
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
        count={count || 0}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
        page={page}
        onPageChange={(e, p) => setPage(p)}
      />
    </>
  );
}
