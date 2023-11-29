// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { useSelector } from 'react-redux';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const userInfo = useSelector((state) => state.userInfo);

  const navItems = menuItem.items.map((item) => {
    console.log(item.title === '관리자');
    if (item.title !== '관리자' || userInfo.role === 'ADMIN') {
      switch (item.type) {
        case 'group':
          return <NavGroup key={item.id} item={item} />;
        default:
          return (
            <Typography key={item.id} variant="h6" color="error" align="center">
              Menu Items Error
            </Typography>
          );
      }
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
