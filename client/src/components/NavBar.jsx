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
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useNavigate } from 'react-router-dom';
import { Divider, ListItemIcon, MenuList } from '@mui/material';
import { ExitToApp, AccountCircleOutlined } from '@mui/icons-material';
import Button from './Button';

const pages = [
    {
        label: 'Home',
        url: '/',
        protected: true
    },
    {
        label: 'About',
        url: '/about'
    }
];
const host = process.env.REACT_APP_HOST;

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
    },
    signinBtn: {
        height: '38px'
    },
}));

function NavBar({user}) {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate();
    const [profile, setProfile] = React.useState({});
    const [isAuth, setIsAuth] = React.useState(false);

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
        window.location.href = '/signin';
    }

    React.useEffect(() => {
        let usr = JSON.parse(localStorage.getItem('user'));
        usr = user || usr;

        setProfile(usr);
        setIsAuth(usr && Object.keys(usr).length > 0);
    }, [user]);

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
                            {pages.map((page, ind) => {
                                if (page.protected && !isAuth) return null;
                                return (
                                    <MenuItem key={ind} onClick={() => navigate(page.url)}>
                                        <Typography textAlign="center">{page.label}</Typography>
                                    </MenuItem>
                                )
                            })}
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
                        {pages.map((page, ind) => {
                            if (page.protected && !isAuth) return null;
                            return (
                                <Button
                                    key={ind}
                                    onClick={() => navigate(page.url)}
                                    className={classes.navPageBtn}
                                    sx={{ my: 2 }}
                                >
                                    {page.label}
                                </Button>
                            )
                        })}
                    </Box>
                    <Box className={classes.userMenu}>
                        {isAuth ? <React.Fragment>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt={profile.fullname} src={host + profile.picture} />
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
                        </React.Fragment> : (
                            <Button variant="outlined" color='inherit' className={classes.signinBtn} onClick={() => navigate('/signin')}>
                                Sign In <ArrowForwardIcon />
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;
