import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useContext, useState } from 'react';
import { UserContext } from '../../../contexts/userContext';
import { QueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const queryClient = new QueryClient();

const ProfileDropdown = () => {
  const { user, setUser } = useContext(UserContext);
  const [anchorElement, setAnchorElement] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpenUserMenu = (event) => {
    setAnchorElement(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElement(null);
  };

  const { refetch } = useQuery({
    queryKey: ['logout'],
    queryFn: async () => {
      return await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/user/logout`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
    },
    enabled: false,
    retry: false,
    staleTime: Infinity,
    cacheTime: 0,
  });

  const handleLogout = () => {
    refetch();
    setUser(null);
    queryClient.resetQueries(['verify-login']);
  };

  return (
    <Box>
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        <Avatar src={user?.profilePicture} alt={user?.username}>
          <Typography textAlign='center' color='black' fontWeight='bold'>
            {!user?.profilePicture && user?.username.toUpperCase().charAt(0)}
          </Typography>
        </Avatar>
      </IconButton>
      <Menu
        sx={{ mt: '45px' }}
        id='menu-appbar'
        anchorEl={anchorElement}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElement)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={() => setIsProfileModalOpen(true)}>
          <Typography textAlign='center'>Profile</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography textAlign='center'>Logout</Typography>
        </MenuItem>
      </Menu>
      <Modal
        open={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        aria-labelledby='Profile Modal'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isSmallScreen ? '90%' : '30%',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              padding: 5,
            }}
          >
            {user?.profilePicture ? (
              <Avatar
                variant='circular'
                src={user?.profilePicture}
                alt={user?.username}
                sx={{
                  height: 150,
                  width: 150,
                }}
              />
            ) : (
              <Avatar
                variant='circular'
                sx={{
                  bgcolor: theme.palette.primary.main,
                  height: 150,
                  width: 150,
                }}
              >
                <AccountCircleIcon />
              </Avatar>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              padding: 1,
            }}
          >
            <Typography
              variant='h6'
              component='h2'
              textAlign='center'
              sx={{ padding: 1 }}
              fontWeight='bold'
            >
              Username:
            </Typography>
            <Typography
              variant='h6'
              component='h2'
              textAlign='center'
              sx={{ padding: 1, flexGrow: 1 }}
            >
              {user?.username}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              padding: 1,
            }}
          >
            <Typography
              variant='h6'
              component='h2'
              textAlign='center'
              sx={{ padding: 1 }}
              fontWeight='bold'
            >
              Email:
            </Typography>
            <Typography
              variant='h6'
              component='h2'
              textAlign='center'
              sx={{ padding: 1, flexGrow: 1 }}
            >
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProfileDropdown;
