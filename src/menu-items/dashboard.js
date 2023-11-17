// assets
import { IconDashboard } from '@tabler/icons';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: '메인',
  type: 'group',
  children: [
    {
      id: 'default',
      title: '메인페이지',
      type: 'item',
      url: '/main',
      icon: HomeOutlinedIcon,
      breadcrumbs: false
    },
    {
      id: 'dashboard',
      title: '대시보드',
      type: 'item',
      url: '/manage',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
