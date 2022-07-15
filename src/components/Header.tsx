import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import { Link } from 'react-router-dom';
import readXlsxFile, { readSheetNames } from 'read-excel-file';
import { saveAs } from 'file-saver';
import xlsx from 'json-as-xlsx';

import { db, Card } from '../utils/index.db';
import { getLanguages } from '../utils/cardQuery';

const pages = ['About', 'Card'];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const importFromXlsx = async (e: any) => {
    const file = e.target.files[0];

    const sheetNames = await readSheetNames(file);

    for (const sheetName of sheetNames) {
      const langs = sheetName.split('_to_');
      const from = langs[0];
      const to = langs[1];

      const { rows } = await readXlsxFile<Card>(file, {
        schema: {
          origin: { prop: 'origin', type: String, required: true },
          translate: { prop: 'translate', type: String, required: true },
          sentence: { prop: 'sentence', type: String, required: true },
          comment: { prop: 'comment', type: String },
          star: { prop: 'star', type: Number, required: true },
        },
        sheet: sheetName,
      });

      for (const card of rows) {
        await db.cards.add({ ...card, from, to });
      }
    }
  };

  const importFromJSON = async (e: any) => {
    const file = e.target.files[0];

    const exampleFileReader = new FileReader();
    exampleFileReader.onload = async (e) => {
      const text = e?.target?.result;
      if (typeof text === 'string') {
        const cards = JSON.parse(text);
        cards.map((card: any) => {
          const { origin, translate, sentence, comment, from, to, star } = card;
          if (
            typeof origin !== 'string' ||
            typeof translate !== 'string' ||
            typeof sentence !== 'string' ||
            (comment && typeof comment !== 'string') ||
            typeof from !== 'string' ||
            typeof to !== 'string' ||
            typeof star !== 'number'
          ) {
            alert('json format error!');
            return;
          }
        });

        cards.map(async (card: any) => {
          const temp: Card = { ...card, id: undefined };
          await db.cards.add(temp);
        });
      }
    };
    exampleFileReader.readAsText(file);
  };

  const export2JSON = async () => {
    const cards = await db.cards.toArray();

    const blob = new Blob([JSON.stringify(cards)], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'phrase_cards.json');
  };

  const export2Xlsx = async () => {
    const froms = await getLanguages('from');
    const tos = await getLanguages('to');

    let data: any = [];
    const get = froms.map(async (from) => {
      const getTo = tos.map(async (to) => {
        const cards = await db.cards
          .where('from')
          .equals(from)
          .and((c) => c.to === to)
          .toArray();

        data.push({
          sheet: `${from}_to_${to}`,
          columns: [
            { label: 'origin', value: 'origin' },
            { label: 'translate', value: 'translate' },
            { label: 'sentence', value: 'sentence' },
            { label: 'comment', value: 'comment' },
            { label: 'star', value: 'star' },
          ],
          content: cards,
        });
      });
      await Promise.all(getTo);
    });

    await Promise.all(get);

    xlsx(data, { fileName: 'phrase_cards' });
  };

  // 測試用單字自動填入
  const setTest = async () => {
    await db.cards.add({
      origin: 'Apple',
      translate: '蘋果',
      sentence: 'This is an apple',
      comment: 'This is comment',
      from: 'en',
      to: 'zh-TW',
      star: 0,
    });
    await db.cards.add({
      origin: 'Banana',
      translate: '香蕉',
      sentence: 'This is an banana',
      comment: 'Comment 2 ',
      from: 'en',
      to: 'zh-TW',
      star: 1,
    });
    await db.cards.add({
      origin: 'Dog',
      translate: '狗',
      sentence: 'This is an dog',
      comment: 'Dog not to use this',
      from: 'en',
      to: 'zh-TW',
      star: 2,
    });

    await db.cards.add({
      origin: 'Cat',
      translate: '貓',
      sentence: 'This is an cat',
      from: 'en',
      to: 'zh-TW',
      star: 3,
    });

    await db.cards.add({
      origin: 'Pet',
      translate: '寵物',
      sentence: 'This is my pet',
      comment: 'this is another comment',
      from: 'en',
      to: 'zh-TW',
      star: 4,
    });

    await db.cards.add({
      origin: 'そのスケジュール',
      translate: '嘗試',
      sentence: 'try no to do this',
      from: 'ja',
      to: 'zh-TW',
      star: 3,
    });

    await db.cards.add({
      origin: '決まりし',
      translate: '可以',
      sentence: '決まりし',
      from: 'ja',
      to: 'zh-TW',
      star: 1,
    });
  };

  React.useEffect(() => {
    /** @ts-ignore */
    window.setTest = function () {
      setTest();
    };
    /** @ts-ignore */
    window.clearAll = function () {
      db.cards.clear();
    };
  }, []);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/">
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: 'flex',
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Home
            </Typography>
          </Link>

          <div className="flex flex-grow md:hidden"></div>

          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                <Link to={page}> {page}</Link>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key={'export'} onClick={export2JSON}>
                <Button variant="text" component="label">
                  Export JSON
                </Button>
                <Typography textAlign="center"></Typography>
              </MenuItem>
              <MenuItem key={'exportToXlsx'} onClick={export2Xlsx}>
                <Button variant="text" component="label">
                  Export Xlsx
                </Button>
              </MenuItem>
              <MenuItem key={'import'}>
                <Button variant="text" component="label">
                  Import JSON
                  <input hidden type="file" onChange={importFromJSON} />
                </Button>
              </MenuItem>
              <MenuItem key={'importFromXlsx'}>
                <Button variant="text" component="label">
                  Import Xlsx
                  <input hidden type="file" onChange={importFromXlsx} />
                </Button>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
