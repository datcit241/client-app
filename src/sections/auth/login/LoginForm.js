import {useDispatch, useSelector} from "react-redux";
import {useState} from 'react';
import {Controller, useForm} from "react-hook-form";
import {useNavigate} from 'react-router-dom';
// @mui
import {
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Link,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// components
import {login} from "../../../features/userSlice";
import Iconify from '../../../components/iconify';
import Loader from "../../../components/loader/Loader";

// ----------------------------------------------------------------------

export default function LoginForm() {
    const dispatch = useDispatch();
    const {isLoading, hasError} = useSelector(store => store.user)
    const {control, handleSubmit} = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const handleClick = (data) => {
        console.log(data)
        dispatch(login(data))
        // navigate('/dashboard', {replace: true});
    };

    return (
        <>
            {isLoading && <Loader/>}
            <Stack spacing={3}>
                <Controller
                    name='email'
                    control={control}
                    rules={{required: true}}
                    render={({field}) => (
                        <TextField type={'email'} {...field} label="Email address"/>
                    )
                    }
                />

                <Controller
                    name='password'
                    control={control}
                    rules={{required: true}}
                    render={({field}) => (
                        <TextField
                            {...field}
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )
                    }
                />

            </Stack>

            {hasError && <Typography variant="subtitle2" sx={{mt: 2, color: 'error.main', textAlign: 'center'}}>
                Invalid email or password
            </Typography>}

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{my: 2}}>
                <FormControlLabel control={<Checkbox/>} name="remember" label="Remember me"/>
                <Link variant="subtitle2" underline="hover">
                    Forgot password?
                </Link>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit(handleClick)}>
                Login
            </LoadingButton>
        </>
    );
}
