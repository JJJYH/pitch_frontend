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

// ==============================|| APP ||============================== //
import { OpenCvProvider } from 'opencv-react';
const App = () => {
  const customization = useSelector((state) => state.customization);
  const userInfo = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  const accessToken = sessionStorage.getItem('AccessToken');
  console.log(accessToken);
  if (accessToken) {
    principal.setToken(accessToken);
    principal.getUser(accessToken).then((res) => {
      console.log(res.data);
      dispatch(setUser(res.data));
      navigate('/main');
    });
  } else {
    dispatch(logoutUser);
  }

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo])

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
