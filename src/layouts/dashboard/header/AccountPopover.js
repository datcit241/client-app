import {useDispatch, useSelector} from "react-redux";
import {useState} from 'react';
// @mui
import {alpha} from '@mui/material/styles';
import {Avatar, Box, Divider, IconButton, MenuItem, Popover, Stack, Typography} from '@mui/material';

import {NavLink, useNavigate} from "react-router-dom";
import {logOut} from "../../../features/userSlice"
import account from "../../../_mock/account";
// mocks_

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
    {
        label: 'Home',
        url: '/',
        icon: 'eva:home-fill',
    },
    {
        label: 'Profile',
        url: '/profile',
        icon: 'eva:person-fill',
    },
    {
        label: 'Settings',
        url: '/settings',
        icon: 'eva:settings-2-fill',
    },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
    const {user} = useSelector(store => store.user);
    const dispatch = useDispatch();

    const [open, setOpen] = useState(null);

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const navigate = useNavigate();

    const handleClose = (url) => {
        setOpen(null);
        navigate(url);
    };
    const handleLogOut = () => {
        dispatch(logOut());
        handleClose();
    }

    return (
        <>
            <IconButton
                onClick={handleOpen}
                sx={{
                    p: 0,
                    ...(open && {
                        '&:before': {
                            zIndex: 1,
                            content: "''",
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            position: 'absolute',
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                        },
                    }),
                }}
            >
                {/* <Avatar src={user ? account.photoURL : null} alt="photoURL"/> */}
                <Avatar src={user ? (user.avatar || account.photoURL) : null} alt="photoURL"/>
            </IconButton>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                PaperProps={{
                    sx: {
                        p: 0,
                        mt: 1.5,
                        ml: 0.75,
                        width: 180,
                        '& .MuiMenuItem-root': {
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                {user ? <Box sx={{my: 1.5, px: 2.5}}>
                        <Typography variant="subtitle2" noWrap>
                            {user.name}
                        </Typography>
                        <Typography variant="body2" sx={{color: 'text.secondary'}} noWrap>
                            {user.email}
                        </Typography>
                    </Box>
                    : <Box sx={{my: 1.5, px: 2.5}}>
                        <Typography variant="subtitle2" noWrap>
                            Please login
                        </Typography>
                    </Box>}

                <Divider sx={{borderStyle: 'dashed'}}/>

                {user && <Stack sx={{p: 1}}>
                    {MENU_OPTIONS.map((option) => (
                        <MenuItem key={option.label} onClick={() => handleClose(option.url)}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Stack>}

                <Divider sx={{borderStyle: 'dashed'}}/>

                {user
                    ? <MenuItem onClick={() => handleLogOut()} sx={{m: 1}}>
                        Logout
                    </MenuItem>
                    : <>
                        <MenuItem component={NavLink} to={'/login'} sx={{m: 1}}>
                            Login
                        </MenuItem>
                        <MenuItem component={NavLink} to={'/register'} sx={{m: 1}}>
                            Register
                        </MenuItem>
                    </>
                }
            </Popover>
        </>
    )
        ;
}
