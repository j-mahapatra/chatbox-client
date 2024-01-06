import {
  Box,
  TextField,
  Typography,
  Container,
  Snackbar,
  Alert,
  Button,
} from '@mui/material';
import logo from '../assets/logo-icon.png';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const { isFetching, isError, data, error, isSuccess, refetch } = useQuery({
    queryKey: ['login'],
    queryFn: async () => {
      return await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/user/login`,
        {
          email,
          password,
        },
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
    cacheTime: 0,
  });

  useEffect(() => {
    if (isSuccess) {
      setIsSnackbarOpen(true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setIsSnackbarOpen(true);
    }
  }, [isError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    refetch();
  };

  const fillGuestCredentials = () => {
    setEmail('guest@email.com');
    setPassword('admin');
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
          Login
        </Typography>
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            value={email}
            autoComplete='email'
            autoFocus
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
            value={password}
            autoComplete='current-password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <LoadingButton
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 4, mb: 1 }}
            loading={isFetching}
          >
            Login
          </LoadingButton>
          <Button
            fullWidth
            variant='outlined'
            sx={{ mt: 1, mb: 2 }}
            onClick={fillGuestCredentials}
          >
            Get Guest Credentials
          </Button>
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
    </Container>
  );
};

export default Login;
