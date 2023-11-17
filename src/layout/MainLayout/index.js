import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

// project imports
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';
import navigation from 'menu-items';
import { drawerWidth } from 'store/constant';

// assets
import { IconChevronRight } from '@tabler/icons';
import { useState } from 'react';
import { setMenu } from 'store/customizationSlice';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  transition: theme.transitions.create(
    'margin',
    open
      ? {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        }
      : {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }
  ),
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? 0 : -(drawerWidth - 20),
    width: `calc(100% - ${drawerWidth}px)`
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: '20px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px'
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '10px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px',
    marginRight: '10px'
  }
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  // Handle left drawer
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch(setMenu(!leftDrawerOpened));
  };
  const { enqueueSnackbar } = useSnackbar();
  const isMain = useSelector((state) => state.customization.isMain);
  const isUser = useSelector((state) => state.userInfo.isUser);
  //이거로 권한 잠깐 쓰세요 일반사용자 : true    관리자, 인사담당자:false
  //const [isUser, setUser] = useState(false);

  let channel;

  useEffect(() => {
    // 채널 생성
    channel = new BroadcastChannel('token_channel');

    channel.onmessage = (event) => {
      if (event.data.NoneApp) {
        console.log(event.data.NoneApp);
        enqueueSnackbar('해당 계정은 승인 대기 중입니다.', { variant: 'error' });
      }
    };

    return () => {
      // 컴포넌트가 언마운트되면 채널을 닫음
      channel.close();
    };
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: leftDrawerOpened ? theme.transitions.create('width') : 'none',
          height: '70px'
        }}
      >
        <Toolbar>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} isUser={isUser} />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <Sidebar
        drawerOpen={!matchDownMd ? (isUser ? !leftDrawerOpened : leftDrawerOpened) : !leftDrawerOpened}
        drawerToggle={handleLeftDrawerToggle}
      />

      {/* main content */}
      <Main theme={theme} open={isUser ? !leftDrawerOpened : leftDrawerOpened} sx={isMain ? { backgroundColor: '#ffffff' } : {}}>
        {/* breadcrumb */}
        <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
        <Outlet />
      </Main>
      {/* <Customization /> */}
    </Box>
  );
};

export default MainLayout;
