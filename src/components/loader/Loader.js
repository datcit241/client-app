import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const LoaderItem = styled('div')(({theme}) => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    '&:nth-of-type(1)': {
        // borderBottom: '6px solid #f13a8f',
        borderBottom: '6px solid #ff1bd1',
        borderBottomColor: theme.palette.primary.lighter,
        transform: 'rotateX(35deg) rotateY(-45deg)',
        animation: 'rotate-one 1s linear infinite'
    },
    '&:nth-of-type(2)': {
        // borderRight: '6px solid #4bc8eb',
        borderRight: '6px solid #20e3b2',
        borderRightColor: theme.palette.primary.light,
        transform: 'rotateX(50deg) rotateY(10deg)',
        animation: 'rotate-two 1s linear infinite'
    },
    '&:nth-of-type(3)': {
        borderRight: '6px solid #36f372',
        borderRightColor: theme.palette.primary.main,
        transform: 'rotateX(35deg) rotateY(55deg)',
        animation: 'rotate-three 1s linear infinite'
    },

    '@keyframes rotate-one': {
        'to': {
            transform: 'rotateX(35deg) rotateY(-45deg) rotateZ(360deg)'
        }
    },

    '@keyframes rotate-two': {
        'to': {
            transform: 'rotateX(50deg) rotateY(10deg) rotateZ(360deg)'
        }
    },

    '@keyframes rotate-three': {
        'to': {
            transform: 'rotateX(35deg) rotateY(55deg) rotateZ(360deg)'
        }
    }
}))

function Loader() {
    return (
        <>
            <Box
                component='div'
                sx={{
                    position: 'fixed',
                    // background: 'transparent',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    perspective: '800px',
                    zIndex: '1000'
                }}
            >
                <LoaderItem/>
                <LoaderItem/>
                <LoaderItem/>
            </Box>
        </>
    )
}

export default Loader;