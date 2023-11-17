import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { makeStyles } from '@mui/styles'

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { useDispatch } from 'react-redux/es';
import { setUser } from 'store/userInfoSlice';
import { principal } from 'api';
import { useEffect } from 'react';
import { logoutUser } from './store/userInfoSlice';
import { useState } from 'react';

// ==============================|| APP ||============================== //
import { OpenCvProvider } from 'opencv-react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { ModalProvider, useModal } from 'layout/Common/ModalContext';
import { useLocation } from 'react-router-dom';
import { setMain } from 'store/customizationSlice';

const App = () => {

  //=====================================//
  var sessionStorage_transfer = function (event) {
    if (!event) {
      event = window.event;
    }
    if (!event.newValue) return;
    if (event.key == 'getSessionStorage') {
      localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
      localStorage.removeItem('sessionStorage');
    } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
      var data = JSON.parse(event.newValue);
      for (var key in data) {
        sessionStorage.setItem(key, data[key]);
        if (key === 'AccessToken') {
          setAccessToken(data[key]);
        }
      }
    } else if (event.key == 'logoutEvent') {
      sessionStorage.clear();
      setAccessToken(null);
      localStorage.removeItem('logoutEvent');
    }
  };

  var updateSession = (event) => {
    if (event.data.accessToken) {
      sessionStorage.setItem('AccessToken', event.data.accessToken);
    }
  };

  if (window.addEventListener) {
    window.addEventListener('storage', sessionStorage_transfer, false);
    window.addEventListener('message', updateSession);
  } else {
    window.attachEvent('onstorage', sessionStorage_transfer);
  }

  if (!sessionStorage.length) {
    localStorage.setItem('getSessionStorage', 'foobar');
    localStorage.removeItem('getSessionStorage', 'foobar');
  }

  const Styles = makeStyles(() => ({
    variantSuccess: {
      //color: theme.palette.error.contrastText,
      opacity: 0.9, // 투명도 조절
    },
    variantError: {
      //color: theme.palette.error.contrastText,
      opacity: 0.9,
    },
    variantInfo: {
      //color: theme.palette.error.contrastText,
      opacity: 0.9,
    },
    variantWarning: {
      //color: theme.palette.error.contrastText,
      opacity: 0.9,
    },
  }));

  // channel = new BroadcastChannel('token_channel');
  // channel.onmessage = (event) => {
  //   const receivedToken = event.data.accessToken;
  //   if(receivedToken){
  //     setT
  //   }
  // }

  //====================================================================//
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem('AccessToken'));
  const customization = useSelector((state) => state.customization);
  const userInfo = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  const loginHandler = (token) => {
    if (token) {
      principal.setToken(token);
      principal.getUser(token).then((res) => {
        dispatch(setUser(res.data));
      });
    } else {
      dispatch(logoutUser());
    }
  };
  const classes = Styles();
  const { openModal, open, closeModal } = useModal();
  const loaction = useLocation();
  let channel;

  useEffect(() => {
    // 채널 생성
    channel = new BroadcastChannel('token_channel');

    channel.onmessage = (event) => {
      const receivedToken = event.data.accesstoken;
      //console.log(event);
      if (receivedToken) {
        setAccessToken(receivedToken);
        sessionStorage.setItem('AccessToken', event.data.accesstoken);
      }
      if (event.data.notFoundAccount) {
        console.log(event.data.notFoundAccount);
        openModal(event.data.email);
      }
    };

    return () => {
      // 컴포넌트가 언마운트되면 채널을 닫음
      channel.close();
    };
  }, []);

  useEffect(() => { }, [userInfo]);

  useEffect(() => {
    loginHandler(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (loaction.pathname === '/main' || loaction.pathname === '/') {
      dispatch(setMain(true));
    } else {
      dispatch(setMain(false));
    }
  }, [loaction.pathname]);

  return (
    <OpenCvProvider openCvPath="/opencv/opencv.js">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themes(customization)}>
          <SnackbarProvider
            autoHideDuration={3000}
            classes={{
              variantError: classes.variantError,
              variantSuccess: classes.variantSuccess,
              variantInfo: classes.variantInfo,
              variantWarning: classes.variantWarning
            }}
          >
            <CssBaseline />
            <NavigationScroll>
              <Routes />
            </NavigationScroll>
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </OpenCvProvider>
  );
};

export default App;
