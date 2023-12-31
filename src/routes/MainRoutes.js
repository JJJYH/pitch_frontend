import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

//test page routing 
const CVPage = Loadable(lazy(() => import('views/cv')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'main',
      element: <DashboardDefault />
    },
    {
      path: 'simple',
      element: <SamplePage />
    },
    {
      path: 'cv2',
      element: <CVPage />
    },
  ]
};

export default MainRoutes;
