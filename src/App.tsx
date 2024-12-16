import './input.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home';
// import Service from './pages/Service';
import Login from './pages/Login';
import Signup, { action as SignupAction } from './pages/Signup';
import LoginTest from './pages/testLogin';
// import Info from './pages/Info';
import Settings from './pages/Settings';
// import NotFoundPage from './pages/404Page';

import Root, { loader as loadingAction } from './pages/Root';

import Users from './pages/admin/user';
import AdminHome from './pages/admin/home';
import Rooms from './pages/admin/room';
import RoomsUser from './pages/admin/roomUser';
import HeaderAdmin from './pages/admin/header';
import AdminLayout, {loader as loadingActionAdmin} from './pages/admin/layout';
import NotFoundPage from './pages/404NotFound';
import HomeChat from './pages/HomeChat';
import VerifyEmail from './pages/EmailVerify';
// import Search from './pages/Search';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path: 'login2',
    element: <LoginTest></LoginTest>
  },
  {
    path: 'login',
    element: <Login></Login>,

  },
  {
    path: 'signup',
    element: <Signup></Signup>,
    action: SignupAction
  },
  {
    path: 'chat',
    element: <HomeChat></HomeChat>,

  },
  {
    path: 'auth/verify/:userId/:unique_string',
    element: <VerifyEmail></VerifyEmail>

  },

  {
    path: '/home',
    element: <Root></Root>,
    loader: loadingAction,
    children: [
      {
        path: 'message',
        element: <HomeChat></HomeChat>
      },
      //     {
      //       path:'dashboard',
      //       element:<Info></Info>
      //     },
      {
        path: "settings",
        element: <Settings></Settings>
      },
      //     {
      //       path:"search",
      //       element:<Search></Search>
      //     }
      //   ]

      // },
      // {
      //   path:'*',
      //   element:<NotFoundPage></NotFoundPage>
      // }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout></AdminLayout>,
    loader: loadingActionAdmin,
    children: [
      {
        path: 'users',
        element: <Users></Users>
      },
      {
        path: 'dashboard',
        element: <AdminHome></AdminHome>
      },

      {
        path: "rooms",
        element: <Rooms></Rooms>,
        children: [
          {
            path: ":id",
            element: <RoomsUser></RoomsUser>
          }
        ]
      }
    ]
  },
  {
    path:'*',
    element:<NotFoundPage></NotFoundPage>
  }
]);
function App() {
  return (<RouterProvider router={router} />);
}

export default App;


///todo 
//messages not incoming when ad is showw
//responsiveness
//loading spinner
//