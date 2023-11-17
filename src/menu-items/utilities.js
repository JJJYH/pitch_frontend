// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: '요청/관리',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: '채용요청',
      type: 'item',
      url: '/manage/req',
      icon: TaskOutlinedIcon,
      breadcrumbs: false
    },
    {
      id: 'util-color',
      title: '공고관리',
      type: 'item',
      url: '/manage/posts',
      icon: SupervisorAccountOutlinedIcon,
      breadcrumbs: false
    },
  ]
};

export default utilities;
