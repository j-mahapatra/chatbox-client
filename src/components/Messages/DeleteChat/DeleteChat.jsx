import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { useContext, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { GlobalContext } from '../../../contexts/globalContext';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserContext } from '../../../contexts/userContext';

const DeleteChat = () => {
  const { selectedChat } = useContext(GlobalContext);
  const { user } = useContext(UserContext);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isBackdropOpen, setIsBackdropOpen] = useState(false);

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

  const mutation = useMutation({
    mutationFn: () => {
      setIsBackdropOpen(true);
      return axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/chat/${selectedChat}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      setIsBackdropOpen(false);
      queryClient.refetchQueries({ queryKey: ['get-chat'] });
    },
  });

  const handleOpen = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleClose = () => {
    setIsConfirmDialogOpen(false);
  };

  const handleDelete = () => {
    mutation.mutate({});
    setIsConfirmDialogOpen(false);
  };

  if (isBackdropOpen) {
    return (
      <>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isBackdropOpen}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </>
    );
  }

  return (
    chatData?.data?.admin?._id === user._id && (
      <>
        <IconButton
          onClick={handleOpen}
          sx={{ position: 'absolute', right: 18, top: 18 }}
        >
          <DeleteIcon />
        </IconButton>
        <Dialog
          open={isConfirmDialogOpen}
          onClose={handleClose}
          aria-labelledby='delete-chat-dialog-title'
        >
          <DialogTitle id='delete-chat-dialog-title'>Delete Chat</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure that you want to delete the chat?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete} autoFocus>
              Yes
            </Button>
            <Button autoFocus onClick={handleClose}>
              No
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  );
};

export default DeleteChat;
