import {useSelector} from "react-redux";
import PropTypes from 'prop-types';
import {NavLink as RouterLink} from 'react-router-dom';
import {useState} from "react";
// @mui
import {Box, List, ListItemText, Stack} from '@mui/material';
import {ExpandLess, ExpandMore} from "@mui/icons-material";
//
import {StyledNavItem, StyledNavItemIcon} from './styles';

// ----------------------------------------------------------------------

NavSection.propTypes = {
    data: PropTypes.array,
};

export default function NavSection({data = [], ...other}) {
    const {user} = useSelector(store => store.user);
    return (
        <Box {...other}>
            <List disablePadding sx={{p: 1}}>
                {data.map((navItem, index) => <Item key={index} {...{...navItem, user}}/>)}
            </List>
        </Box>
    );
}

// ----------------------------------------------------------------------

function Item(props) {
    const {user, type, requireLogin, ...item} = props;
    if (requireLogin && !user) return <></>;
    return (
        <>
            {type === 'group'
                ? <GroupItem item={item}/>
                : <NavItem item={item}/>
            }
        </>
    )
}

function GroupItem({item}) {
    const {children, ...other} = item;
    const [showChildren, setShowChildren] = useState(false);

    return (
        <Stack
            sx={{
                bgcolor: 'action.selected',
                borderRadius: '8px',
                p: 1
            }}
        >
            <ParentItem item={other} onClick={() => setShowChildren(prev => !prev)} showChildren={showChildren}/>
            {showChildren && <Stack
                sx={{
                    paddingX: 2,
                }}
            >
                {children.map((child, index) => (
                    <NavItem item={child} key={index}/>
                ))}
            </Stack>}
        </Stack>
    )
}

function ParentItem({item, showChildren, ...other}) {
    const {title, icon, info} = item;

    return (
        <StyledNavItem
            sx={{
                '&.active': {
                    color: 'text.primary',
                    bgcolor: 'action.focus',
                    fontWeight: 'fontWeightBold',
                },
            }}
            {...other}
        >
            <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

            <ListItemText disableTypography primary={title}/>
            {showChildren
                ? <ExpandLess sx={{mr: 2}}/>
                : <ExpandMore sx={{mr: 2}}/>
            }

            {info && info}
        </StyledNavItem>
    );
}


NavItem.propTypes = {
    item: PropTypes.object,
};

function NavItem({item}) {
    const {title, path, icon, info} = item;

    return (
        <StyledNavItem
            component={RouterLink}
            to={path}
            sx={{
                '&.active': {
                    color: 'text.primary',
                    bgcolor: 'action.selected',
                    fontWeight: 'fontWeightBold',
                },
            }}
        >
            <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

            <ListItemText disableTypography primary={title}/>

            {info && info}
        </StyledNavItem>
    );
}
