import {
  Container,
  Drawer,
  IconButton,
  Paper,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext, useEffect } from 'react';

import Chats from '../components/Chats/Chats';
import Messages from '../components/Messages/Messages';
import { UserContext } from '../contexts/userContext';
import { GlobalContext } from '../contexts/globalContext';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const { isChatDrawerOpen, setIsChatDrawerOpen } = useContext(GlobalContext);

  const { data, isSuccess } = useQuery({
    queryKey: ['verify-login'],
    queryFn: async () => {
      return await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/user/details`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
    },
    retry: false,
    cacheTime: 0,
    refetchOnWindowFocus: false,
  });

  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (isSuccess) {
      setUser(data?.data);
    }
  }, [isSuccess]);

  if (!user) {
    return (
      <Container
        fixed
        maxWidth='xs'
        sx={{
          display: 'flex',
          height: '92vh',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={5}
          sx={{
            display: 'flex',
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
          }}
        >
          Please login to chat!
        </Paper>
      </Container>
    );
  }

  return (
    <Container
      maxWidth='xl'
      disableGutters
      sx={{ display: 'flex', gap: 2, height: '92vh', padding: 2 }}
    >
      {isSmallScreen ? (
        <>
          <IconButton
            size='large'
            onClick={() => {
              setIsChatDrawerOpen(true);
            }}
            sx={{
              display: 'flex',
              width: 'auto',
              height: 'max-content',
              position: 'absolute',
              zIndex: 1,
              top: 90,
              left: 20,
            }}
          >
            <ViewSidebarIcon />
          </IconButton>
          <Drawer
            anchor='left'
            open={isChatDrawerOpen}
            onClose={() => setIsChatDrawerOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: '70%',
              },
            }}
          >
            <Chats />
          </Drawer>
        </>
      ) : (
        <Chats />
      )}
      <Messages />
    </Container>
  );
};

export default Home;
