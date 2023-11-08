import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// job request page routing
const JobReqPage = Loadable(lazy(() => import('views/job-request/JobReqPage')));
// job posting page routing
const PostingListPage = Loadable(lazy(() => import('views/posting/PostingListPage')));

//test page routing
const CVPage = Loadable(lazy(() => import('views/cv/Page')));
const MyPage = Loadable(lazy(() => import('views/mypage/Mypage')));
//applicant sorting page routing
const ApplicantSortingPage = Loadable(lazy(() => import('views/sort')));
const ApplicantDetailPage = Loadable(lazy(() => import('views/sort/ApplicantDetailPage')));

//admin page routing
const AdminManagePage = Loadable(lazy(() => import('views/admin/AdminManagePage')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'main',
      children: [
        {
          path: 'careers',
          element: <PostingListPage />
        },
        {
          path: 'cv/:job_posting_no',
          element: <CVPage />
        },
        {
          path: 'mypage',
          element: <MyPage />
        }
      ]
    },
    {
      path: 'manage',
      element: <DashboardDefault />
    },
    {
      path: 'manage',
      children: [
        {
          path: 'req',
          element: <JobReqPage />
        },
        {
          path: 'cv-page',
          element: <CVPage />
        },
        {
          path: 'admin',
          element: <AdminManagePage />
        },
        {
          path: ':job_posting_no/sort',
          element: <ApplicantSortingPage />
        },
        {
          path: ':job_posting_no/sort/:apply_no/detail',
          element: <ApplicantDetailPage />
        }
      ]
    },
    // {
    //   path: 'dashboard',
    //   children: [
    //     {
    //       path: 'default',
    //       element: <DashboardDefault />
    //     }
    //   ]
    // },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'tabler-icons',
          element: <UtilsTablerIcons />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'material-icons',
          element: <UtilsMaterialIcons />
        }
      ]
    }
  ]
};

export default MainRoutes;
