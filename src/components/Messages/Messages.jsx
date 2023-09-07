import {
  Avatar,
  Box,
  CircularProgress,
  Fade,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { UserContext } from '../../contexts/userContext';
import { GlobalContext } from '../../contexts/globalContext';
import { socket } from '../../config/socket';

const Messages = () => {
  const { selectedChat } = useContext(GlobalContext);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentMessage, setCurrentMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const messageContainer = useRef();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (messageContainer?.current?.scrollTop === 0) {
      messageContainer?.current?.lastChild.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [messageContainer, allMessages]);

  useEffect(() => {
    if (selectedChat) {
      socket.emit('join-room', selectedChat);
    }

    return () => {
      if (selectedChat) {
        socket.emit('leave-room', selectedChat);
      }
    };
  }, [selectedChat]);

  useEffect(() => {
    socket.on('server-event', (message) => {
      setAllMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('server-event');
    };
  }, []);

  const {
    isLoading,
    isFetching,
    data: messageData,
    isSuccess,
  } = useQuery({
    queryKey: ['get-messages', { selectedChat }],
    queryFn: async () => {
      if (selectedChat) {
        return await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/message/chat/${selectedChat}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
      }
      return {};
    },
    retry: false,
    staleTime: Infinity,
    cacheTime: 0,
  });

  const mutation = useMutation({
    mutationFn: (newMessage) => {
      return axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/message/create`,
        newMessage,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
    },
  });

  useEffect(() => {
    setAllMessages(
      messageData?.data?.map((message) => {
        return { sender: message.sender, content: message.content };
      })
    );
  }, [isSuccess]);

  const handleSendMessageMouse = () => {
    if (!currentMessage) {
      return;
    }
    const message = {
      sender: user,
      content: currentMessage,
    };
    setAllMessages((prev) => [...prev, message]);
    mutation.mutate({ content: currentMessage, chat: selectedChat });

    socket.emit('client-event', selectedChat, message);
    setCurrentMessage('');
  };

  const handleSendMessageKeyboard = (event) => {
    if (event.key !== 'Enter') {
      return;
    }
    handleSendMessageMouse();
  };

  const scroll = (container) => {
    // Handle auto scroll to bottom on sending new message
    if (!container.current) {
      return;
    }
    const { offsetHeight, scrollHeight, scrollTop } = container.current;
    if (scrollHeight <= scrollTop + offsetHeight + 100) {
      container.current?.scrollTo(0, scrollHeight);
    }
  };

  useEffect(() => {
    // Auto scroll behavior
    scroll(messageContainer);
  }, [allMessages]);

  if (!selectedChat) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', width: '100%' }}>
        <Paper elevation={10} sx={{ padding: 1 }}>
          Select a chat to view messages!
        </Paper>
      </Box>
    );
  }

  if (isLoading || isFetching) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', width: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        width: isSmallScreen ? '100%' : '75%',
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
        Messages
      </Paper>
      <Box
        component='div'
        sx={{
          display: 'flex',
          overflow: 'auto',
          justifyContent: 'flex-end',
          pt: 10,
        }}
      >
        <Box
          component='div'
          sx={{
            display: 'flex',
            width: '100%',
            p: 1,
            flexDirection: 'column',
            overflow: 'auto',
            position: 'relative',
            bottom: 50,
          }}
          ref={messageContainer}
        >
          {allMessages?.map((message, index) => (
            <Fade key={index} in={true} appear={true} direction='up'>
              <Paper
                elevation={5}
                sx={{
                  display: 'flex',
                  p: 1,
                  width: 'max-content',
                  my: 1,
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor:
                    message.sender?._id === user?._id
                      ? theme.palette.secondary.main
                      : 'inherit',
                  color:
                    message.sender?._id === user?._id ? 'black' : 'inherit',
                  alignSelf:
                    message.sender?._id === user?._id
                      ? 'flex-end'
                      : 'flex-start',
                }}
              >
                {message?.sender?._id !== user?._id && (
                  <Avatar src={message?.sender.profilePicture}>
                    {!message?.sender?.profilePicture &&
                      message?.sender?.username?.toUpperCase().charAt(0)}
                  </Avatar>
                )}

                {message.content}
              </Paper>
            </Fade>
          ))}
        </Box>
        <Box
          sx={{
            display: 'flex',
            position: 'absolute',
            bottom: 0,
            width: '100%',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <FormControl fullWidth variant='filled' sx={{ m: 2, mt: 3 }}>
            <Input
              value={currentMessage}
              onKeyDown={handleSendMessageKeyboard}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='Send message'
                    onClick={handleSendMessageMouse}
                    edge='end'
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              }
              inputProps={{
                value: currentMessage,
                onChange: (e) => setCurrentMessage(e.target.value),
              }}
            />
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default Messages;
