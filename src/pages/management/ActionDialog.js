import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

export default function ActionDialog(props) {
    const {action, setAction, message, children, buttonProps} = props;

    const handleClose = () => {
        setAction(null)
    };

    return (
        <div>
            <Dialog
                open={!!action}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {action?.label}
                </DialogTitle>
                <DialogContent>
                    {message &&
                        <DialogContentText id="alert-dialog-description">
                            {message}
                        </DialogContentText>
                    }
                    {children}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant='contained'
                        color='error'
                        {...buttonProps}
                        onClick={() => {
                            handleClose();
                            action.handler();
                        }}
                    >
                        {action?.label}
                    </Button>
                    <Button variant='outlined' color='primary' onClick={handleClose}
                            autoFocus>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}