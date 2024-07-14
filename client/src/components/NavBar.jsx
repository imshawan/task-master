import * as React from 'react';
import { makeStyles } from 'tss-react/mui';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useNavigate } from 'react-router-dom';
import { Divider, ListItemIcon, MenuList } from '@mui/material';
import { ExitToApp, AccountCircleOutlined } from '@mui/icons-material';

const pages = [
    {
        label: 'Home',
        url: '/'
    },
    {
        label: 'About',
        url: '/about'
    }
];

const useStyles = makeStyles()((theme) => ({
    appBar: {
        position: 'sticky',
    },
    taskIconDesktop: {
        display: 'none',
        marginRight: theme.spacing(1),
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    taskIconMobile: {
        display: 'flex',
        marginRight: theme.spacing(1),
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    taskmasterDesktop: {
        marginRight: theme.spacing(2),
        display: 'none',
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
        color: 'inherit',
        textDecoration: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    taskmasterMobile: {
        marginRight: theme.spacing(2),
        display: 'flex',
        flexGrow: 1,
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
        color: 'inherit',
        textDecoration: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    navMenu: {
        flexGrow: 1,
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    navMenuDesktop: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    userMenu: {
        flexGrow: 0,
    },
    userProfile: {
        padding: '16px 20px',
    },
    userMenuList: {
        padding: '8px',
        '& .MuiMenuItem-root': {
            borderRadius: 1,
        },
    },
    navPageBtn: {
        color: theme.palette.background.default, 
        display: 'block'
    }
}));

function NavBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate();
    const [profile, setProfile] = React.useState({});

    const { classes } = useStyles();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        ['user', 'authenticated', 'token'].forEach(e => localStorage.removeItem(e));
        window.location.reload();
    }

    React.useEffect(() => {
        setProfile(JSON.parse(localStorage.getItem('user')) || {})
    }, []);

    return (
        <AppBar className={classes.appBar}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <TaskAltIcon className={classes.taskIconDesktop} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        className={classes.taskmasterDesktop}
                    >
                        TASKMASTER
                    </Typography>

                    <Box className={classes.navMenu}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                        >
                            {pages.map((page, ind) => (
                                <MenuItem key={ind} onClick={() => navigate(page.url)}>
                                    <Typography textAlign="center">{page.label}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <TaskAltIcon className={classes.taskIconMobile} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        className={classes.taskmasterMobile}
                    >
                        TASKMASTER
                    </Typography>
                    <Box className={classes.navMenuDesktop}>
                        {pages.map((page, ind) => (
                            <Button
                                key={ind}
                                onClick={() => navigate(page.url)}
                                className={classes.navPageBtn}
                                sx={{ my: 2 }}
                            >
                                {page.label}
                            </Button>
                        ))}
                    </Box>

                    <Box className={classes.userMenu}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={profile.fullname} src="/" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {Object.keys(profile).length > 0 && <Box className={classes.userProfile}>
                                <Typography variant="subtitle1"> {profile.fullname}</Typography>
                                <Typography color="text.secondary" variant="body2">
                                    {profile.email}
                                </Typography>
                            </Box>}
                            <Divider />
                            <MenuList className={classes.userMenuList}>
                                <MenuItem onClick={() => navigate('/profile')}>
                                    <ListItemIcon>
                                        <AccountCircleOutlined />
                                    </ListItemIcon>
                                    <Typography textAlign="center">{'Profile'}</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon>
                                        <ExitToApp />
                                    </ListItemIcon>
                                    <Typography textAlign="center">{'Log out'}</Typography>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;
