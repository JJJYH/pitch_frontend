import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';

// assets
import { IconMenu2 } from '@tabler/icons';
import { Link } from 'react-router-dom';
import classNames from './Header.module.scss';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle, isUser }) => {
  const theme = useTheme();

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        {isUser ? <></> : <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden', marginRight: '5px', marginTop: '2px' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: '#ffffff',
              color: theme.palette.secondary.dark,
              '&:hover': {
                background: theme.palette.secondary.light,
                color: theme.palette.secondary.dark
              }
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.1rem" />
          </Avatar>
        </ButtonBase>}

        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>

      </Box>

      {/* <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: '50px', paddingTop: '8px', marginLeft: '30px' }}>
        <Link className={classNames.links} to={'/manage/req'}>채용요청</Link>
        <Link className={classNames.links} to={'/manage/req'}>공고목록</Link>
        <Link className={classNames.links} to={'/manage/req'}>권한관리</Link>
      </div> */}

      {/* header search */}
      <SearchSection />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func,
  isUser: PropTypes.bool
};

export default Header;
