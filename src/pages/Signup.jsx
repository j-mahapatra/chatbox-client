import {
  Box,
  TextField,
  Typography,
  Container,
  Snackbar,
  Alert,
  Button,
  Avatar,
} from '@mui/material';
import logo from '../assets/logo-icon.png';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Signup = () => {
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [pictureUploadFailed, setPictureUploadFailed] = useState(false);

  const navigate = useNavigate();

  const { isFetching, isError, data, error, isSuccess, refetch } = useQuery({
    queryKey: ['signup'],
    queryFn: async () => {
      return await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/user/signup`,
        {
          username,
          email,
          password,
          profilePicture,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    },
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess || isError) {
      setIsSnackbarOpen(true);
    }
    if (isSuccess) {
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }
  }, [isSuccess, isError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    refetch();
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleProfilePictureInput = async (e) => {
    try {
      const profilePictureBase64 = await toBase64(e.target.files[0]);
      setProfilePicture(profilePictureBase64);
    } catch (error) {
      setPictureUploadFailed(true);
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img
          src={logo}
          alt=''
          style={{ height: 100, width: 'auto', marginTop: 15 }}
        />
        <Typography component='h1' variant='h5'>
          Sign Up
        </Typography>
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='username'
            label='Username'
            name='username'
            autoComplete='username'
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            accept='image/*'
            style={{ display: 'none' }}
            id='profile-picture-upload'
            type='file'
            onChange={handleProfilePictureInput}
          />
          <label
            htmlFor='profile-picture-upload'
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 25,
              padding: 20,
            }}
          >
            <Button variant='outlined' component='span'>
              Upload Profile Picture
            </Button>
            <Avatar alt='Profile Picture' variant='circular'>
              {profilePicture ? (
                <img
                  src={profilePicture}
                  style={{ height: 40, width: 40, objectFit: 'contain' }}
                />
              ) : (
                <AccountCircleIcon />
              )}
            </Avatar>
          </label>
          <LoadingButton
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
            loading={isFetching}
          >
            Signup
          </LoadingButton>
        </Box>
      </Box>
      {isSuccess && (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={isSnackbarOpen}
          autoHideDuration={5000}
          onClose={() => {
            setIsSnackbarOpen(false);
          }}
        >
          <Alert severity='success'>{data?.data?.message || 'Success'}</Alert>
        </Snackbar>
      )}
      {isError && (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={isSnackbarOpen}
          autoHideDuration={5000}
          onClose={() => {
            setIsSnackbarOpen(false);
          }}
        >
          <Alert severity='error'>
            {error?.response?.data?.message || 'Error'}
          </Alert>
        </Snackbar>
      )}
      {pictureUploadFailed && (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={isSnackbarOpen}
          autoHideDuration={5000}
          onClose={() => {
            setIsSnackbarOpen(false);
          }}
        >
          <Alert severity='error'>Profile picture upload failed!</Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default Signup;
