import {
  Box,
  Button,
  Fab,
  Paper,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import AddIcon from '@mui/icons-material/Add';
import { useContext, useState } from 'react';
import axios from 'axios';
import CreateChatModal from './CreateChatModal/CreateChatModal';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { GlobalContext } from '../../contexts/globalContext';
import { UserContext } from '../../contexts/userContext';

const Chats = () => {
  const { selectedChat, setSelectedChat, setIsChatDrawerOpen } =
    useContext(GlobalContext);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useContext(UserContext);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const {
    isError,
    data: chatData,
    refetch: refetchChats,
  } = useQuery({
    queryKey: ['get-chat'],
    queryFn: async () => {
      return await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/chat/all`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
    },
    retry: false,
  });

  const handleOpen = () => {
    setIsCreateModalOpen(true);
  };

  if (user && isError) {
    return (
      <Paper
        elevation={5}
        sx={{ margin: 1, padding: 1, display: 'grid', placeItems: 'center' }}
      >
        Error loading chats! Refresh the page.
      </Paper>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: isSmallScreen ? '100%' : '25%',
          height: isSmallScreen ? '100vh' : '100%',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Paper
          elevation={5}
          component='h3'
          sx={{
            display: 'flex',
            justifyContent: 'center',
            padding: 2,
            margin: 1,
            color: 'white',
            backgroundColor: theme.palette.primary.main,
          }}
        >
          Chats
        </Paper>
        <Box
          component='div'
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            overflow: 'auto',
            pt: 1,
          }}
        >
          {chatData?.data?.chats?.map((chat) => {
            return (
              <Button
                key={chat._id}
                variant='contained'
                color={selectedChat === chat._id ? 'primary' : 'inherit'}
                endIcon={selectedChat === chat._id ? <ArrowRightIcon /> : null}
                sx={{
                  my: 1,
                  mx: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
                onClick={() => {
                  setSelectedChat(chat._id);
                  setIsChatDrawerOpen(false);
                }}
              >
                <span
                  style={{
                    display: 'block',
                    maxWidth: '20ch',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {chat.name}
                </span>
              </Button>
            );
          })}
        </Box>
        <Fab
          size='small'
          color='primary'
          aria-label='add'
          sx={{ position: 'absolute', bottom: 0, right: '40%' }}
          onClick={handleOpen}
        >
          <AddIcon />
        </Fab>
      </Box>

      {isCreateModalOpen && (
        <CreateChatModal
          isCreateModalOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
          refetchChats={refetchChats}
          setIsSnackbarOpen={setIsSnackbarOpen}
        />
      )}

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={isSnackbarOpen}
        autoHideDuration={5000}
        onClose={() => {
          setIsSnackbarOpen(false);
        }}
      >
        <Alert severity='success'>Chat created successfully!</Alert>
      </Snackbar>
    </>
  );
};

export default Chats;
