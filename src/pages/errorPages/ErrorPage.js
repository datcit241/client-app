import {Helmet} from 'react-helmet-async';
import {Link as RouterLink, Navigate, useParams} from 'react-router-dom';
// @mui
import {styled} from '@mui/material/styles';
import {Box, Button, Container, Typography} from '@mui/material';
import errorConfig from "./errorConfig";

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({theme}) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ErrorPage(props) {
    const {id: status} = useParams();

    if (!status || !errorConfig[status]) {
        return <Navigate to={'/error/404'}/>
    }

    const {title, message, desc, img, button} = errorConfig[status];

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>

            <Container>
                <StyledContent sx={{textAlign: 'center', alignItems: 'center'}}>
                    {message && <Typography variant="h3" paragraph>
                        {message}
                    </Typography>}

                    {desc && <Typography sx={{color: 'text.secondary'}}>
                        {desc}
                    </Typography>}

                    {img && <Box
                        component="img"
                        src={errorConfig.url + img}
                        sx={{width: '100%', height: 'auto', mx: 'auto', my: {xs: 5, sm: 10}}}
                    />}

                    {button && <Button to={button.link} size="large" variant="contained" component={RouterLink}>
                        {button.text}
                    </Button>}
                </StyledContent>
            </Container>
        </>
    );
}
