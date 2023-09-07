import {
  Avatar,
  Box,
  Button,
  Modal,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useContext, useState } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import { GlobalContext } from '../../../contexts/globalContext';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const ChatMembers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { selectedChat } = useContext(GlobalContext);

  const { data: chatData } = useQuery({
    queryKey: ['get-chat-by-id', { selectedChat }],
    queryFn: async () => {
      if (selectedChat) {
        return await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/chat/${selectedChat}`,
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

  return (
    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
      <Button
        variant='contained'
        sx={{ display: 'flex', color: 'white', width: '50%' }}
        onClick={() => setIsModalOpen(true)}
      >
        <GroupIcon />
      </Button>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isSmallScreen ? '90%' : '50%',
            bgcolor: 'background.paper',
            boxShadow: 10,
            p: 5,
            height: 'auto',
            maxHeight: '50vh',
            overflow: 'auto',
          }}
        >
          <Paper elevation={10} sx={{ mb: 5, p: 2 }}>
            <Typography variant='h5' component='h2' textAlign='center'>
              Members
            </Typography>
          </Paper>
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              alignItems: 'center',
              width: '100%',
              flexWrap: 'wrap',
            }}
          >
            {chatData?.data?.members?.map((user) => (
              <Box
                key={user?._id}
                sx={{
                  display: 'flex',
                  flexDirection: isSmallScreen ? 'column' : 'row',
                  gap: 1,
                  mx: 2,
                }}
              >
                <Avatar src={user.profilePicture}></Avatar>
                <Typography variant='h6' component='h2' textAlign='left'>
                  {user.username}
                </Typography>
                <Typography variant='h6' component='h2' textAlign='left'>
                  {chatData?.data?.admin?._id === user?._id && '[Admin]'}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ChatMembers;
