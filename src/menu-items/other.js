// assets
//import { IconBrandChrome, IconHelp } from '@tabler/icons';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

// constant
//const icons = { IconBrandChrome, IconHelp };
const maIcon = ManageAccountsIcon;

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: 'sample-docs-roadmap',
  title: 'Admin',
  type: 'group',
  children: [
    {
      id: 'admin-page',
      title: '권한관리',
      type: 'item',
      url: '/manage/admin',
      icon: maIcon,
      breadcrumbs: false
    }
  ]
};

export default other;
