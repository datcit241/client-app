import {Navigate, useRoutes} from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/management/UserPage';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import ProductDetails from "./pages/ProductDetails";
import ProductPage from "./pages/management/ProductPage";
import RegisterPage from "./pages/RegisterPage";
import ErrorPage from "./pages/errorPages/ErrorPage";
import ProductPagePagin from "./pages/management/ProductPagePagin";
import Profile from "./pages/Profile";

// ----------------------------------------------------------------------

export default function Router() {
    const routes = useRoutes([
        {
            path: '/dashboard',
            element: <DashboardLayout/>,
            children: [
                {element: <Navigate to="/dashboard/app"/>, index: true},
                {path: 'app', element: <DashboardAppPage/>},
                {path: 'management/user', element: <UserPage/>},
                {path: 'management/product-pagin', element: <ProductPage/>},
                {path: 'management/product', element: <ProductPagePagin/>},
                {path: 'products', element: <ProductsPage/>},
                {path: 'products/details/:id', element: <ProductDetails/>},
                {path: 'blog', element: <BlogPage/>},
            ],
        },
        {
            path: 'login',
            element: <LoginPage/>,
        },
        {
            path: 'profile',
            element: <Profile/>,
        },
        {
            path: 'register',
            element: <RegisterPage/>,
        },
        {
            element: <SimpleLayout/>,
            children: [
                {element: <Navigate to="/dashboard/app"/>, index: true},
                // {path: '404', element: <Page404/>},
                // { path: '401', element: <Page401/> },
                {path: 'error/:id', element: <ErrorPage/>},
                {path: '*', element: <Navigate to="/error/404"/>},
            ],
        },
        {
            path: '*',
            element: <Navigate to="/error/404"/>,
        },
    ]);

    return routes;
}
