import { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Paper,
  Popper,
  Stack,
  Switch,
  Typography
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import UpgradePlanCard from './UpgradePlanCard';
import User1 from 'assets/images/users/user-round.svg';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LoginIcon from '@mui/icons-material/Login';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import RegisterIcon from 'assets/images/icons/register.svg';

// assets
import { IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons';
import { logoutUser } from '../../../../store/userInfoSlice';
import { principal } from 'api';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);
  const userInfo = useSelector((state) => state.userInfo);
  const navigate = useNavigate();

  const [sdm, setSdm] = useState(true);
  const [value, setValue] = useState('');
  const [notification, setNotification] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);
  const handleLogout = async () => {
    console.log('Logout');
    principal.logout().then(() => {
      dispatch(logoutUser());
      sessionStorage.removeItem('AccessToken');
      localStorage.setItem('logoutEvent', 'true');
      navigate('/main');
      window.location.reload();
    }).catch((error) => {
      dispatch(logoutUser());
      sessionStorage.removeItem('AccessToken');
      localStorage.setItem('logoutEvent', 'true');
    });
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== '') {
      navigate(route);
    }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleRegisterLocation = () => {
    navigate('/pages/register/register3');
  }

  const handleLoginLocation = () => {
    navigate('/pages/login/login3');
  }

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          marginLeft: '30px',
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.secondary.light,
            background: `${theme.palette.secondary.light}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              fill: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={!userInfo.isLogin ? <></> :
          <Avatar
            src={User1}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={!userInfo.isLogin ? <PersonOutlineIcon sx={{ color: theme.palette.secondary.main }} /> :
          <IconSettings stroke={1.5} size="1.5rem" color={theme.palette.secondary.main} />
        }
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />

      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  {!userInfo.isLogin ?
                    <>
                      <Box>
                        <List
                          component="nav"
                          sx={{
                            width: '100%',
                            maxWidth: 200,
                            minWidth: 150,
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: '10px',
                            [theme.breakpoints.down('md')]: {
                              minWidth: '100%'
                            },
                            '& .MuiListItemButton-root': {
                              gap: 0.6,
                              mt: 0.5,
                              alignItems: 'center'
                            }
                          }}
                        >
                          <ListItemButton
                            sx={{ borderRadius: `${customization.borderRadius}px` }}
                            selected={selectedIndex === 4}
                            onClick={handleRegisterLocation}
                          >
                            <ListItemIcon sx={{ justifyContent: 'center' }}>
                              <img src={RegisterIcon} alt="register" width={24} height={24} />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body2" fontSize={16} textAlign={'center'}>회원가입</Typography>} />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ borderRadius: `${customization.borderRadius}px` }}
                            selected={selectedIndex === 4}
                            onClick={handleLoginLocation}
                          >
                            <ListItemIcon sx={{ justifyContent: 'center' }}>
                              <VpnKeyOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body2" fontSize={16} textAlign={'center'}>로그인</Typography>} />
                          </ListItemButton>
                        </List>
                      </Box>
                    </>
                    :
                    <>
                      <Box sx={{ p: 2 }}>
                        <Stack>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Typography variant="h4">{userInfo.role ? userInfo.role === 'HR' ? '인사담당자' : '관리자' : '지원자'}</Typography>
                            <Typography component="span" variant="h4" sx={{ fontWeight: 400, pl: 0.2 }}>
                              {userInfo.user_nm}님
                            </Typography>
                          </Stack>
                          <Typography variant="subtitle2">{userInfo.user_email}</Typography>
                        </Stack>
                      </Box>
                      <Divider />
                      <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                      </PerfectScrollbar>
                      <Box sx={{ p: 2, marginTop: '-4px' }}>
                        <List
                          component="nav"
                          sx={{
                            width: '100%',
                            maxWidth: 350,
                            minWidth: 300,
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: '10px',
                            [theme.breakpoints.down('md')]: {
                              minWidth: '100%'
                            },
                            '& .MuiListItemButton-root': {
                              mt: 0.5
                            }
                          }}
                        >
                          <ListItemButton
                            sx={{ borderRadius: `${customization.borderRadius}px` }}
                            selected={selectedIndex === 0}
                            onClick={(event) => handleListItemClick(event, 0, '#')}
                          >
                            <ListItemIcon>
                              <IconUser stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body2">My Pages</Typography>} />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ borderRadius: `${customization.borderRadius}px` }}
                            selected={selectedIndex === 4}
                            onClick={handleLogout}
                          >
                            <ListItemIcon>
                              <IconLogout stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body2">로그아웃</Typography>} />
                          </ListItemButton>
                        </List>
                      </Box>
                    </>}
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
