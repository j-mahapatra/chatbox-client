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
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Signup = () => {
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isSuccessSnackbarOpen, setSuccessIsSnackbarOpen] = useState(false);
  const [isErrorSnackbarOpen, setErrorIsSnackbarOpen] = useState(false);
  const [pictureUploadFailed, setPictureUploadFailed] = useState(false);

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (user) => {
      setLoading(true);
      return axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/user/signup`,
        user,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      setLoading(false);
      setSuccessIsSnackbarOpen(true);
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    },
    onError: (error) => {
      setLoading(false);
      setError(error);
      setErrorIsSnackbarOpen(true);
    },
  });

  const handleSubmit = () => {
    mutation.mutate({
      username: username,
      email: email,
      password: password,
      profilePicture: profilePicture,
    });
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
        <Box noValidate sx={{ mt: 1 }}>
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
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
            loading={loading}
            onClick={handleSubmit}
          >
            Signup
          </LoadingButton>
        </Box>
      </Box>
      {isSuccessSnackbarOpen && (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={isSuccessSnackbarOpen}
          autoHideDuration={5000}
          onClose={() => {
            setSuccessIsSnackbarOpen(false);
          }}
        >
          <Alert severity='success'>Registration successful!</Alert>
        </Snackbar>
      )}
      {isErrorSnackbarOpen && (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={isErrorSnackbarOpen}
          autoHideDuration={5000}
          onClose={() => {
            setErrorIsSnackbarOpen(false);
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
          open={isErrorSnackbarOpen}
          autoHideDuration={5000}
          onClose={() => {
            setErrorIsSnackbarOpen(false);
          }}
        >
          <Alert severity='error'>Profile picture upload failed!</Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default Signup;
