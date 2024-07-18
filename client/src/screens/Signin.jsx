import React, { useState } from 'react';
import { Typography, Link, Paper, Grid, IconButton, InputAdornment, useTheme, useMediaQuery, CircularProgress,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import TextField from '../components/TextField';
import Button from '../components/Button';
import { endpoints,  } from '../utilities';

const useStyles = makeStyles()((theme) => ({
    root: {
        height: '100vh',
        backgroundColor: theme.palette.background.default,
    },
    image: {
        backgroundImage: 'url(https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(63, 81, 181, 0.7)', // primary color with opacity
        },
    },
    paper: {
        margin: theme.spacing(0, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
    },
    imageContent: {
        position: 'relative',
        zIndex: 1,
        color: theme.palette.common.white,
        padding: theme.spacing(0, 4, 0, 4),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
      },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(3),
    },
    logo: {
        fontSize: 40,
        color: theme.palette.primary.main,
        marginRight: theme.spacing(2),
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        padding: theme.spacing(1.5, 0),
        fontWeight: 600,
    },
    textField: {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: theme.palette.primary.light,
            },
            '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
            },
        },
    },
    paperGrid: {
        height: '100%'
    }
}));

const SignIn = () => {
    const initialValues = { username: '', password: '' };

    const { classes } = useStyles();
    const [fetching, setIsFetching] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState(initialValues);
    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const schema = zod.object({
        username: zod.string().min(4, { message: "username is required" }),
        password: zod.string().min(4, { message: 'Password is required and must be atleast 4 chars' })
    });

    const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues, resolver: zodResolver(schema) });

    const handleChange = ({ target }) => {
        setUserData(prev => ({ ...prev, [target.name]: target.value }));
    }

    const onSubmit = async (formData) => {
        setIsFetching(true);

        try {
            let {data} = await window.axiosInstance.post(endpoints.SIGN_IN, formData);
            if (data && data.response) {
                let {token, user} = data.response;
                if (token) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('authenticated', 'true');
                }
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                }
            }

            navigate('/');
        } catch ({message, response}) {
            let msg = message;
            if (response && response.data.status && response.data.status?.message) {
                msg = response.data.status.message;
            }

            toast.error(msg);
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <Grid container component="main" className={classes.root}>
             {!isMobile && (
                <Grid item xs={false} sm={4} md={7} className={classes.image}>
                <div className={classes.imageContent}>
                    <Typography variant="h3" gutterBottom>
                    Organize Your Day
                    </Typography>
                    <Typography variant="h5">
                    Boost your productivity with TaskMaster
                    </Typography>
                </div>
                </Grid>
            )}
            <Grid item xs={12} sm={8} md={5} component={Paper} className={classes.paperGrid} square>
                <div className={classes.paper}>
                    <div className={classes.logoContainer}>
                        <TaskAltIcon className={classes.logo} />
                        <Typography component="h1" variant="h4" fontWeight="bold">
                            TaskMaster
                        </Typography>
                    </div>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Sign in to your account
                    </Typography>
                    <form className={classes.form}>

                        <Controller
                            control={control}
                            name="username"
                            render={({ field }) => (<TextField
                                field={'username'}
                                fullWidth
                                className={classes.textField}
                                variant="outlined"
                                label="Username"
                                autoComplete="username"
                                autoFocus
                                value={userData.username}
                                onChange={handleChange}
                                inputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                errors={errors}
                                {...field}
                                ref={null}
                            />)}
                        />

                        <Controller
                            control={control}
                            name="password"
                            render={({ field }) => (<TextField
                                className={classes.textField}
                                variant="outlined"
                                fullWidth
                                field="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                value={userData.password}
                                onChange={handleChange}
                                inputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                errors={errors}
                                {...field}
                                ref={null}
                            />)}
                        />

                        
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={handleSubmit(onSubmit)}
                            disabled={fetching}
                        >
                            {fetching ? <CircularProgress size={26} /> : 'Sign In'}
                        </Button>
                        <Grid container justifyContent="center">
                            <Grid item>
                                <Link href="/register" variant="body2" color="primary">
                                    Don't have an account? Sign Up
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
};

export default SignIn;