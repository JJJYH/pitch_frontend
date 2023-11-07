import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

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

  if (window.addEventListener) {
    window.addEventListener('storage', sessionStorage_transfer, false);
  } else {
    window.attachEvent('onstorage', sessionStorage_transfer);
  }

  if (!sessionStorage.length) {
    localStorage.setItem('getSessionStorage', 'foobar');
    localStorage.removeItem('getSessionStorage', 'foobar');
  }
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

  useEffect(() => {}, [userInfo]);

  useEffect(() => {
    loginHandler(accessToken);
  }, [accessToken]);

  return (
    <OpenCvProvider openCvPath="/opencv/opencv.js">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themes(customization)}>
          <CssBaseline />
          <NavigationScroll>
            <Routes />
          </NavigationScroll>
        </ThemeProvider>
      </StyledEngineProvider>
    </OpenCvProvider>
  );
};

export default App;
