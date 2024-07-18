import React, { useState } from 'react';
import {
    Typography, Link, Paper, Grid, IconButton, InputAdornment, useTheme, useMediaQuery, CircularProgress,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import { toast } from 'react-toastify';
import Sweetalert from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
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
    formItems: {
        marginBottom: theme.spacing(1)
    }
}));

const Swal = withReactContent(Sweetalert);

const Register = () => {
    const initialValues = { username: '', email: '', fullname: '', password: '', confirmPassword: '' };

    const { classes } = useStyles();
    const [fetching, setIsFetching] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState(initialValues);
    const navigate = useNavigate();

    const schema = zod.object({
        username: zod.string().min(4, { message: "username is required" }),
        email: zod.string().email({ message: "Invalid email address" }).min(5, { message: "Email is required and must be at least 5 characters long" }),
        fullname: zod.string().min(5, { message: 'Full name is required and must be atleast 5 chars' }),
        password: zod.string().min(4, { message: 'Password is required and must be atleast 4 chars' }),
        confirmPassword: zod.string().min(4, { message: "Password is required and must be atleast 4 chars" })
    }).refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"], // This will point to the confirmPassword field
    });

    const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues, resolver: zodResolver(schema) });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const onSubmit = async (formData) => {
        setIsFetching(true);

        try {
            await window.axiosInstance.post(endpoints.REGISTER, formData);

            Swal.fire({
                title: 'Registered successfully!',
                text: `Welcome to our platform ${String(formData.fullname).split(' ')[0]}! Please Signin to continue.`,
                confirmButtonText: 'Proceed to login',
                customClass: {
                    confirmButton: 'css-1tk0gnd-MuiButtonBase-root-MuiButton-root-submit',
                },
            }).then(res => {
                if (res.isConfirmed) {
                    navigate('/signin');
                }
            });

        } catch ({ message, response }) {
            let msg = message;

            if (response && response.data.status && response.data.status?.message) {
                msg = response.data.status.message;
            }

            toast.error(msg)
        } finally {
            setIsFetching(false);
            setUserData(initialValues);
        }
    };

    const handleChange = ({ target }) => {
        setUserData(prev => ({ ...prev, [target.name]: target.value }));
    }

    return (
        <Grid container component="main" className={classes.root}>
            {!isMobile && (
                <Grid item xs={false} sm={4} md={7} className={classes.image}>
                    <div className={classes.imageContent}>
                        <Typography variant="h3" gutterBottom>
                            Join TaskMaster
                        </Typography>
                        <Typography variant="h5">
                            Start organizing your tasks and boost your productivity today
                        </Typography>
                    </div>
                </Grid>
            )}
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <div className={classes.logoContainer}>
                        <TaskAltIcon className={classes.logo} />
                        <Typography component="h1" variant="h4" fontWeight="bold">
                            TaskMaster
                        </Typography>
                    </div>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Create your account
                    </Typography>
                    <form className={classes.form}>
                        <div className={classes.formItems}>
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
                        </div>

                        <div className={classes.formItems}>
                            <Controller
                                control={control}
                                name="fullname"
                                render={({ field }) => (<TextField
                                    className={classes.textField}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    label="Full Name"
                                    field="fullname"
                                    autoComplete="name"
                                    value={userData.fullname}
                                    onChange={handleChange}
                                    inputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <BadgeIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    errors={errors}
                                    {...field}
                                    ref={null}
                                />)}
                            />
                        </div>

                        <div className={classes.formItems}>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field }) => (<TextField
                                    className={classes.textField}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    label="Email Address"
                                    field="email"
                                    autoComplete="email"
                                    value={userData.email}
                                    onChange={handleChange}
                                    inputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    errors={errors}
                                    {...field}
                                    ref={null}
                                />)}
                            />
                        </div>
                        <div className={classes.formItems}>
                            <Controller
                                control={control}
                                name="password"
                                render={({ field }) => (<TextField
                                    className={classes.textField}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    field="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
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
                        </div>

                        <div className={classes.formItems}>
                            <Controller
                                control={control}
                                name="confirmPassword"
                                render={({ field }) => (<TextField
                                    className={classes.textField}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    field="confirmPassword"
                                    label="Re-enter your Password"
                                    type={'text'}
                                    value={userData.confirmPassword}
                                    onChange={handleChange}
                                    inputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    errors={errors}
                                    {...field}
                                    ref={null}
                                />)}
                            />
                        </div>

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={handleSubmit(onSubmit)}
                            disabled={fetching}
                        >
                            {fetching ? <CircularProgress size={26} /> : 'Register'}
                        </Button>
                        <Grid container justifyContent="center">
                            <Grid item>
                                <Link href="/signin" variant="body2" color="primary">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
};

export default Register;