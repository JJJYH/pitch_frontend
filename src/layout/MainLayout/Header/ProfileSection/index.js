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
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Paper,
  Popper,
  Stack,
  Switch,
  Typography,
  TextField,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

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
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles'
import { margin } from '@mui/system';
import { async } from 'q';


// ==============================|| PROFILE MENU ||============================== //
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 3,
    top: 36,
    border: `2px solid #fBC02D`,
    padding: '0 4px',
    color: 'white',
    backgroundColor: '#fBC02D'
  },
}));

const ProfileSection = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);
  const userInfo = useSelector((state) => state.userInfo);
  const navigate = useNavigate();

  const [sdm, setSdm] = useState(true);
  const [value, setValue] = useState('');
  //const [notification, setNotification] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [notifications, setNotifications] = useState([
    // { id: 1, text: '새로운 메시지 도착', url: '/messages', date: '2023-11-15' },
    // { id: 2, text: '오후 3시에 회의 예정', url: '/meetings', date: '2023-11-16' },
    // { id: 3, text: '오늘은 중요한 기한이 있습니다', url: '/deadlines', date: '2023-11-17' },
    // { id: 4, text: '새로운 업데이트 사용 가능', url: '/updates', date: '2023-11-18' },
    // { id: 5, text: '최근에 로그인한 기기가 있습니다', url: '/recent-logins', date: '2023-11-19' },
  ]);
  const [openTooltip, setOpenTooltip] = useState(false);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getNoti = () => {
    principal.notifications().then((res) => {
      const sort = res.data.sort((a, b) => b.date - a.date);
      setNotifications(sort);
    });
  }

  const setPolling = async () => {
    try {
      const resData = await principal.polling();
      console.log(resData.data);
      if (resData.data[0] === 'find new notification') {
        getNoti();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let interval;

    if (userInfo.isLogin) {
      getNoti();
      interval = setInterval(() => {
        setPolling();
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [userInfo]);

  useEffect(() => {
    console.log(userInfo);
    if (userInfo.isLogin) {
      setOpenTooltip(false);
    } else {
      //setOpenTooltip(true);
      const timeout = setTimeout(() => setOpenTooltip(true), 1000);
      return () => clearTimeout(timeout);
    }
  }, [userInfo.isLogin]);

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
    //setSelectedIndex(index);
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
    window.open('/pages/login/login3', '_blank', 'width=600,height=700');
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
      <Tooltip
        open={openTooltip}
        arrow
        placement='auto-start'
        title={
          <Box component="span" py={2} sx={{ display: 'flex', width: 240, borderRadius: 10 }}>
            <IconButton onClick={() => {
              setOpenTooltip(false);
            }}>
              <CloseIcon sx={{ color: '#ffffff', width: 15, height: 15 }} />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', width: 200 }}>
              <Typography>
                채용지원을 하시려면 로그인을 하셔야 합니다.
              </Typography>
              {/* <FormControlLabel control={<Checkbox defaultChecked />} label="Don’t show again" /> */}
            </Box>
          </Box>
        }
        componentsProps={{
          tooltip: {
            sx: {
              borderRadius: 4,
            }
          },
          popper: {
            sx: {
              zIndex: 1300
            }
          }
        }}
      >
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
            <StyledBadge badgeContent={notifications.length} invisible={notifications.length === 0}>
              <Avatar
                src={'broken.png'}
                alt={userInfo.user_nm}
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
            </StyledBadge>
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
      </Tooltip>


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
                offset: [10, 14]
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
                            onClick={(e) => { handleClose(e); handleLoginLocation(e); }}
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
                        <Grid item xs={12} mb={0.5}>
                          <Box sx={{ pt: 0.25 }}>
                            {notifications.length !== 0 ? notifications.map((notification, index) => (
                              <ListItemButton
                                key={notification.id}
                                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e3e8ef' }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => {
                                  navigate(notification.url);
                                  principal.notiDelte(notification.id);
                                  const updatedNotifications = [...notifications];
                                  updatedNotifications.splice(index, 1);
                                  setNotifications(updatedNotifications);
                                  handleToggle();
                                }}
                              >
                                <Stack>
                                  <Typography variant="body2">
                                    {notification.text}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    {formatDate(notification.date)}
                                  </Typography>
                                </Stack>
                                {hoveredIndex === index && (
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      principal.notiDelte(notification.id);
                                      const updatedNotifications = [...notifications];
                                      updatedNotifications.splice(index, 1);
                                      setNotifications(updatedNotifications);
                                    }}
                                    sx={{ width: 10, height: 10, paddingRight: 2 }}
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                )}
                              </ListItemButton>
                            )) : <></>}
                          </Box>
                        </Grid>
                      </PerfectScrollbar>
                      <Box sx={{ paddingX: 2, marginTop: '-4px' }}>
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
                              //mt: 0.5
                            }
                          }}
                        >
                          <ListItemButton
                            sx={{ borderRadius: `${customization.borderRadius}px` }}
                            selected={selectedIndex === 0}
                            onClick={(event) => { handleListItemClick(event, 0, '#'); navigate(`/main/mypage`) }}
                          >
                            <ListItemIcon>
                              <IconUser stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body2">My Pages</Typography>} />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ borderRadius: `${customization.borderRadius}px` }}
                            selected={selectedIndex === 4}
                            onClick={(e) => { handleClose(e); handleLogout(); }}
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
      </Popper >
    </>
  );
};

export default ProfileSection;
