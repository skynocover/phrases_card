import * as React from 'react';
import { Link } from 'react-router-dom';
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

import { AppContext } from '../AppContext';
import * as firebase from '../libs/firebase';
import { useBackendless } from '../hooks/useBackendless';
import { db, Card } from '../utils/index.db';

const pages = ['About', 'Card'];

const ResponsiveAppBar = () => {
  const appCtx = React.useContext(AppContext);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const { currentUser, getCurrentUser, emailLogin, logout } = useBackendless();

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

  const userLogout = async () => {
    await logout();
    await firebase.logout();
  };

  React.useEffect(() => {
    /** @ts-ignore */
    window.setTest = setTest;

    /** @ts-ignore */
    window.clearAll = function () {
      db.cards.clear();
    };
  }, []);

  return (
    <AppBar position="static" sx={{ height: 70 }}>
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
            {currentUser ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src="" />
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
                  <MenuItem>
                    <Button variant="text">
                      <Link to={'/setting'}>Setting</Link>
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Button variant="text" onClick={userLogout}>
                      Logout
                    </Button>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button variant="contained">
                  <Link to="/login">Login</Link>
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
