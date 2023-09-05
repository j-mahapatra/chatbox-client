import {
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  Paper,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const CreateChatModal = ({
  isCreateModalOpen,
  setIsCreateModalOpen,
  refetchChats,
}) => {
  const [newChatName, setNewChatName] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const queryClient = new QueryClient();

  const { data: allUsers } = useQuery({
    queryKey: ['get-all-users'],
    queryFn: async () => {
      return await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/user/all`,
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

  const mutation = useMutation({
    mutationFn: (newChat) => {
      return axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/chat/create`,
        newChat,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['get-chat'] });
      refetchChats();
    },
  });

  const handleClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleCheckboxInput = (event, userId) => {
    if (event.target.checked) {
      const usersAfterAddition = [...selectedUsers, userId];
      setSelectedUsers([...usersAfterAddition]);
    } else {
      const usersAfterRemoval = selectedUsers.filter((id) => id !== userId);
      setSelectedUsers([...usersAfterRemoval]);
    }
  };

  const handleCreateChat = () => {
    setIsCreateModalOpen(false);
    mutation.mutate({ name: newChatName, members: selectedUsers });
  };

  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={isCreateModalOpen}
        maxWidth='xl'
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          Create Chat
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Paper elevation={3} sx={{ m: 1, px: 2 }}>
          <TextField
            label='Chat Name'
            required
            fullWidth
            variant='standard'
            onChange={(e) => setNewChatName(e.target.value)}
            sx={{ my: 2 }}
          />
        </Paper>
        <Paper elevation={3} sx={{ m: 1 }}>
          <FormGroup
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              px: 10,
              py: 5,
              height: 200,
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {allUsers?.data?.allUsers?.map((user) => (
              <FormControlLabel
                key={user._id}
                control={
                  <Checkbox
                    icon={<PersonAddIcon />}
                    checkedIcon={<PersonRemoveIcon />}
                  />
                }
                label={user.username}
                sx={{ display: 'flex', widt: 'auto' }}
                onChange={(e) => handleCheckboxInput(e, user._id)}
              />
            ))}
          </FormGroup>
        </Paper>
        <Button onClick={handleCreateChat}>Create</Button>
      </Dialog>
    </>
  );
};

export default CreateChatModal;
