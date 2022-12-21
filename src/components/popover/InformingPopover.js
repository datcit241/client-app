import {useEffect} from "react";
import {Button, Popover, Stack} from "@mui/material";

InformingPopover.defaultProps = {
    closeButton: true,
}

function InformingPopover(props) {
    const {closeButton, timeOut, children, setOpen, ...rootProps} = props;

    useEffect(() => {
        if (timeOut) {
            setTimeout(() => {
                setOpen(false);
            }, timeOut)
        }
    });

    return <Popover
        open={Boolean(true)}
        {...rootProps}
    >
        <Stack direction="row" sx={{p: 2, pr: 1}}>
            <Stack direction="column" sx={{pr: 1}}>
                {children}
            </Stack>
            {closeButton && <Button
                sx={{
                    boxSizing: 'border-box',
                    width: '20px',
                    height: '20px',
                    minWidth: '20px',
                    borderRadius: '50%',
                }}
                onClick={() => setOpen(false)}
            >
                &#10005;
            </Button>}
        </Stack>
    </Popover>;
}

export default InformingPopover;