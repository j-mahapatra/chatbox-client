import logoDark from '../assets/logo.png';
import logoLight from '../assets/logo-black.png';
import { ThemeContext } from '../contexts/themeContext';
import { useContext, useState } from 'react';

import { useTheme } from '@mui/material/styles';
import {
  LightMode,
  DarkMode,
  Login,
  AppRegistration,
} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';

import {
  AppBar,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ThemeContext);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleLogin = () => {
    navigate('/login');
  };
  const handleSignup = () => {
    navigate('/signup');
  };
  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };
  const handleOpenMenu = (event) => {
    setMenuAnchor(event.currentTarget);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar
          component='div'
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box
            component='img'
            sx={{
              height: 60,
              width: 140,
              padding: 1,
            }}
            alt='Logo'
            src={theme.palette.mode === 'dark' ? logoDark : logoLight}
          />
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
            <IconButton
              onClick={colorMode.toggleColorMode}
              color='secondary'
              edge='end'
              size='small'
              aria-label='Theme toggle'
              sx={{ justifySelf: 'flex-end' }}
            >
              {theme.palette.mode === 'dark' ? <DarkMode /> : <LightMode />}
            </IconButton>
            {!isSmallScreen ? (
              <>
                <Button
                  variant='outlined'
                  sx={{
                    color: theme.palette.mode === 'light' ? 'white' : 'none',
                  }}
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <Button
                  variant='outlined'
                  sx={{
                    color: theme.palette.mode === 'light' ? 'white' : 'none',
                  }}
                  onClick={handleSignup}
                >
                  Signup
                </Button>
              </>
            ) : (
              <>
                <IconButton
                  size='large'
                  aria-label='User Login and Signup'
                  aria-controls='menu'
                  aria-haspopup='true'
                  onClick={handleOpenMenu}
                  color='inherit'
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={menuAnchor}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(menuAnchor)}
                  onClose={handleCloseMenu}
                >
                  <MenuItem onClick={handleSignup}>
                    <ListItemIcon>
                      <AppRegistration fontSize='small' />
                    </ListItemIcon>
                    Signup
                  </MenuItem>
                  <MenuItem onClick={handleLogin}>
                    <ListItemIcon>
                      <Login fontSize='small' />
                    </ListItemIcon>
                    Login
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
