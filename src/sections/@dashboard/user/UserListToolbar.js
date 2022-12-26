import PropTypes from 'prop-types';
// @mui
import {alpha, styled} from '@mui/material/styles';
import {Button, IconButton, InputAdornment, OutlinedInput, Toolbar, Tooltip, Typography} from '@mui/material';
// component
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({theme}) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({theme}) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': {
        width: 320,
        boxShadow: theme.customShadows.z8,
    },
    '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
    },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
};

export default function UserListToolbar({
                                            numSelected,
                                            filterName,
                                            onFilterName,
                                            handleDelete,
                                            handleSearch,
                                            handleClear,
                                            isSearching
                                        }) {
    return (
        <StyledRoot
            sx={{
                ...(numSelected > 0 && {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter',
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography component="div" variant="subtitle1">
                    {numSelected} selected
                </Typography>
            ) : (
                <>
                    <StyledSearch
                        value={filterName}
                        onChange={onFilterName}
                        placeholder="Search product..."
                        endAdornment={
                            <>
                                {isSearching
                                    ?
                                    <Button
                                        sx={{
                                            height: '36px'
                                        }}
                                        onClick={() => handleSearch()}
                                    >
                                        <InputAdornment position="start">
                                            <Iconify icon="eva:search-fill"
                                                     sx={{
                                                         color: 'disabled',
                                                     }}/>
                                        </InputAdornment>
                                    </Button>
                                    :
                                    <Button
                                        sx={{
                                            boxSizing: 'border-box',
                                            width: '25px',
                                            height: '25px',
                                            minWidth: '25px',
                                            borderRadius: '50%',
                                        }}
                                        onClick={() => handleClear()}
                                    >
                                        &#10005;
                                    </Button>
                                }

                            </>
                        }
                    />
                </>
            )
            }

            {
                numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton onClick={handleDelete}>
                            <Iconify icon="eva:trash-2-fill"/>
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filter list">
                        <IconButton>
                            <Iconify icon="ic:round-filter-list"/>
                        </IconButton>
                    </Tooltip>
                )
            }
        </StyledRoot>
    )
}
