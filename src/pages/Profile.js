import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {
    Avatar,
    Box,
    Button,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography
} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useEffect, useState} from "react";
import {TabContext, TabPanel} from "@mui/lab";
import {AccountBox, Edit, Email, Room} from "@mui/icons-material";
import account from "../_mock/account";
import {updateBio} from "../features/userSlice";

const CustomPaper = styled(Paper)({
    paddingBlock: '24px',
    background: 'white',
    color: 'rgb(33, 43, 54)',
    borderRadius: '16px',
    boxShadow: 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px'
})
export default function Profile() {
    const user = useSelector(store => store.user.user)

    const [value, setValue] = useState("1");
    const [edit, setEdit] = useState(false);
    const [bio, setBio] = useState(user.bio);
    const dispatch = useDispatch();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (!edit) {
            setBio(user.bio);
        }
    }, [edit]);

    const handleEdit = () => {
        dispatch(updateBio(bio));
        setEdit(false);
    };

    if (!user) {
        return <Navigate to={'/'}/>
    }

    return (
        <Box>
            <TabContext value={value}>
                <CustomPaper
                    sx={{
                        paddingBottom: 0,
                        marginInline: '24px',
                        background: 'white'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginInline: 'auto',
                            text: 'center',
                            gap: '8px',
                            marginBlock: '40px',
                        }}
                    >
                        <Avatar
                            sx={{
                                width: '80px',
                                height: '80px',
                            }}
                            src={user ? (user.avatar || account.photoURL) : null} alt="photoURL"/>
                        <Typography variant='subtitle1'>{user.name}</Typography>
                    </Box>
                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                            centered
                        >
                            <Tab
                                icon={<AccountBox/>}
                                iconPosition='start'
                                label="Profile"
                                value="1"
                                sx={{minHeight: '48px'}}
                            />
                        </Tabs>
                    </Box>
                </CustomPaper>
                <TabPanel value="1">
                    <CustomPaper>
                        <CardHeader title={<Typography variant='subtitle1'>About</Typography>}/>
                        <Box
                            sx={{padding: '24px'}}
                        >
                            {/* {edit */}
                            {/*     ? */}
                            <Dialog
                                open={Boolean(edit)}
                            >
                                <DialogTitle id="alert-dialog-title">
                                    Edit bio
                                </DialogTitle>
                                <DialogContent>
                                    <Stack direction='row'>
                                        <TextField
                                            value={bio}
                                            placeholder={'Share your bio here...'}
                                            multiline
                                            rows={4}
                                            sx={{width: '500px'}}
                                            onChange={event => setBio(event.target.value)}
                                        />
                                    </Stack>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        variant={bio !== user.bio ? 'contained' : 'disabled'}
                                        onClick={() => handleEdit()}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant='outlined'
                                        color='primary'
                                        onClick={() => setEdit(false)}
                                        autoFocus>Cancel</Button>
                                </DialogActions>

                            </Dialog>
                            {/* : */}
                            <Stack
                                direction='row'
                                spacing={2}
                            >
                                <Typography
                                    onClick={() => setEdit(true)}
                                >{user.bio || 'Give some words to describe yourself...'}</Typography>
                                <Edit/>
                            </Stack>
                            {/* } */}
                            <InfoItem
                                Illustration={Email}
                                text='Email'
                                value={user.email}
                            />
                            <InfoItem
                                Illustration={Room}
                                text='Address'
                                value={user.address}
                            />
                        </Box>
                    </CustomPaper>
                </TabPanel>
            </TabContext>
        </Box>
    )
}

const InfoItem = (props) => {
    const {Illustration, text, value} = props
    return <Stack
        direction='row'
        spacing={2}
        sx={{
            marginTop: '16px',
            alignItems: 'end'
        }}
    >
        <Illustration/>
        <Stack direction='row'
               sx={{
                   alignItems: 'end'
               }}
        >
            <Typography>{text}</Typography>
            &nbsp;
            <Typography variant='subtitle2'>{value}</Typography>
        </Stack>
    </Stack>
}