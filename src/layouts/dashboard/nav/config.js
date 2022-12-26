// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{width: 1, height: 1}}/>;

const navConfig = [
    {
        type: 'individual',
        title: 'dashboard',
        path: '/dashboard/app',
        icon: icon('ic_analytics'),
    },
    {
        type: 'group',
        requireLogin: true,
        title: 'management',
        icon: icon('ic_lock'),
        children: [
            {
                title: 'user',
                path: '/dashboard/management/user',
                icon: icon('ic_user'),
            },
            {
                title: 'product',
                path: '/dashboard/management/product',
                icon: icon('ic_cart'),
            },
        ]
    },
    {
        type: 'individual',
        title: 'products',
        path: '/dashboard/products',
        icon: icon('ic_cart'),
    },
    // {
    //     type: 'individual',
    //     title: 'blog',
    //     path: '/dashboard/blog',
    //     icon: icon('ic_blog'),
    // },
    {
        type: 'individual',
        title: 'login',
        path: '/login',
        icon: icon('ic_lock'),
    },
    // {
    //     type: 'individual',
    //     title: 'Not found',
    //     path: '/404',
    //     icon: icon('ic_disabled'),
    // },
];

export default navConfig;
