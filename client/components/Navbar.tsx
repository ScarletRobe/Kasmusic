import * as React from 'react';

import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from 'next/router';
import AppBar from '@mui/material/AppBar';
import ListItem from '@mui/material/ListItem';
import { ClickAwayListener, ListItemButton, Stack } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AudiotrackRoundedIcon from '@mui/icons-material/AudiotrackRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LibraryMusicRoundedIcon from '@mui/icons-material/LibraryMusicRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import Searchbar from './Searchbar';

const menuItems = [
  { text: 'Главная', href: '/', icon: <HomeRoundedIcon /> },
  { text: 'Список треков', href: '/tracks', icon: <AudiotrackRoundedIcon /> },
  {
    text: 'Список плейлистов',
    href: '/playlists',
    icon: <LibraryMusicRoundedIcon />,
  },
  { text: 'Любимые', href: '/favorite', icon: <FavoriteRoundedIcon /> },
  {
    text: 'Загруженные вами',
    href: '/uploaded',
    icon: <FileDownloadRoundedIcon />,
  },
];

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed">
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Music Platform
            </Typography>
          </Toolbar>
          <Searchbar />
        </Stack>
      </AppBar>
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={() => open && setOpen(false)}
      >
        <Drawer variant="persistent" anchor="left" open={open}>
          <div>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <List>
            {menuItems.map(({ text, href, icon }) => (
              <ListItem key={href} disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleDrawerClose();
                    router.push(href);
                  }}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </ClickAwayListener>
    </>
  );
}
