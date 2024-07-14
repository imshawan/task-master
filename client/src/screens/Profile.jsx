import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Container, Avatar, Grid, Divider, useTheme, Paper, LinearProgress, useMediaQuery,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import SaveIcon from '@mui/icons-material/Save';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { motion } from 'framer-motion';
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import { toast } from 'react-toastify';

import NavBar from '../components/NavBar';
import TextField from '../components/TextField';
import Button from '../components/Button';
import { endpoints, httpClient as http } from '../utilities';

const useStyles = makeStyles()((theme) => ({
    root: {
        minHeight: 'calc(100vh - 69px)',
        background: `linear-gradient(45deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    container: {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: theme.shape.borderRadius * 2,
        padding: theme.spacing(4),
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    },
    header: {
        marginBottom: theme.spacing(4),
    },
    avatar: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        marginTop: theme.spacing(3),
    },
    divider: {
        margin: theme.spacing(3, 0),
    },
    saveButton: {
    },
    statsPaper: {
        padding: theme.spacing(2),
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.6)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        },
    },
    statsIcon: {
        fontSize: 40,
        marginBottom: theme.spacing(1),
        color: theme.palette.primary.main,
    },
    progressBar: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    actionBtnArea: {
        display: 'flex',
        justifyContent: 'end'
    }
}));

const MotionContainer = motion(Container);
const MotionPaper = motion(Paper);

const Profile = () => {
    const initialValues = { fullname: '', email: '', totalTasks: 10, completedTasks: 1, completionRate: 10 }
    const { classes } = useStyles();
    const theme = useTheme();

    const [user, setUser] = useState(initialValues);
    const [fullname, setFullname] = useState('');
    const [initials, setInitials] = useState('');
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const schema = zod.object({
        fullname: zod.string().min(4, { message: "fullname must be atleast 4 chars" }),
    });

    const { control, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues: { fullname }, resolver: zodResolver(schema) });

    // Extract the first two initials from the user's full name
    const getInitials = (fullname) => {
        const names = fullname.split(' ');
        const initials = names.map(name => name.charAt(0).toUpperCase()).join('');
        return initials.substring(0, 2); // Ensure only two initials are returned
    };

    const formatDate = (date) => {
        date = new Date(String(date));

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        return formatter.format(date);
    }

    const onSubmit = (formData) => {
        console.log(formData)
    };

    useEffect(() => {
        let data = JSON.parse(localStorage.getItem('user')) || {};
        let { completedTasks, totalTasks, completionRate } = initialValues;

        if (!data.completionRate) data.completionRate = completionRate;
        if (!data.totalTasks) data.totalTasks = totalTasks;
        if (!data.completedTasks) data.completedTasks = completedTasks;

        setInitials(getInitials(data.fullname));
        setFullname(data.fullname)
        setUser(data);
    }, []);

    useEffect(() => {
        setInitials(getInitials(user.fullname));
    }, [fullname]);

    useEffect(() => {
        // So that the default value can change after the state has changed with actual user data
        reset({ fullname });
        
    }, [fullname, reset]);

    return (
        <React.Fragment>
            <NavBar />
            <Box className={classes.root}>
                <Container maxWidth="md" className={classes.container}>
                    <MotionContainer
                        maxWidth="md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Grid container className={classes.header}>
                            <Grid item display={'flex'} justifyContent={'center'} xs={12} sm={1.7}>
                                <Avatar className={classes.avatar}>
                                    {initials}
                                </Avatar>
                            </Grid>
                            <Grid item xs={12} sm={10} textAlign={isMobile ? 'center' : 'left'}>
                                <Typography variant="h4">
                                    {fullname}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    {user.email}
                                </Typography>
                                {user.joinedAt && <Typography variant="subtitle1" color="textSecondary">
                                    Member since {formatDate(user.joinedAt)}
                                </Typography>}
                            </Grid>
                        </Grid>
                        <Grid container spacing={3} style={{ marginBottom: theme.spacing(4) }}>
                            <Grid item xs={12} sm={4}>
                                <MotionPaper
                                    className={classes.statsPaper}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <AssignmentIcon className={classes.statsIcon} />
                                    <Typography variant="h6">{user.totalTasks}</Typography>
                                    <Typography variant="body2">Total Tasks</Typography>
                                </MotionPaper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <MotionPaper
                                    className={classes.statsPaper}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <CheckCircleIcon className={classes.statsIcon} />
                                    <Typography variant="h6">{user.completedTasks}</Typography>
                                    <Typography variant="body2">Completed Tasks</Typography>
                                </MotionPaper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <MotionPaper
                                    className={classes.statsPaper}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <TrendingUpIcon className={classes.statsIcon} />
                                    <Typography variant="h6">{user.completionRate}%</Typography>
                                    <Typography variant="body2">Completion Rate</Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={user.completionRate}
                                        className={classes.progressBar}
                                    />
                                </MotionPaper>
                            </Grid>
                        </Grid>
                        <Divider className={classes.divider} />
                        <Typography variant="h6" gutterBottom>
                            Account information
                        </Typography>
                        <form onSubmit={handleSubmit} className={classes.form}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        control={control}
                                        name="fullname"
                                        render={({ field }) => (<TextField
                                            field="fullname"
                                            label="Name"
                                            fullWidth
                                            onChange={({ target }) => setFullname(target.value)}
                                            value={fullname}
                                            variant="outlined"
                                            errors={errors}
                                            {...field}
                                        />)}
                                    />

                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={user.email}
                                        disabled
                                        variant="outlined"
                                        type="email"
                                    />
                                </Grid>
                            </Grid>
                            <Divider className={classes.divider} />
                            <Box className={classes.actionBtnArea}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    startIcon={<SaveIcon />}
                                    className={classes.saveButton}
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    Save Changes
                                </Button>
                            </Box>
                        </form>
                    </MotionContainer>
                </Container>
            </Box>
        </React.Fragment>
    );
};

export default Profile;