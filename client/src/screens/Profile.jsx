import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Container, Grid, Divider, useTheme, Paper, LinearProgress, useMediaQuery, CircularProgress
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
import { endpoints } from '../utilities';
import Loading from '../components/Loading';
import ProfileAvatar from '../components/ProfileAvatar';

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
        minHeight: '613px'
    },
    loaderContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '500px',
    },
    header: {
        marginBottom: theme.spacing(4),
    },
    form: {
        marginTop: theme.spacing(3),
    },
    divider: {
        margin: theme.spacing(3, 0),
    },
    saveButton: {
        minWidth: '185px'
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
    const initialValues = { fullname: '', email: '', totalTasks: 0, completedTasks: 0, completionRate: 0 }
    const { classes } = useStyles();
    const theme = useTheme();

    const [user, setUser] = useState(initialValues);
    const [fullname, setFullname] = useState('');
    const [initials, setInitials] = useState('');
    const [fetching, setIsFetching] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
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

        const options = { year: 'numeric', month: 'long', day: 'numeric' }; //e.g. May 24, 2024
        const formatter = new Intl.DateTimeFormat('en-US', options);
        return formatter.format(date);
    }

    const onSubmit = async (formData) => {
        setIsFetching(true);

        try {
            let { data } = await window.axiosInstance.put(endpoints.UPDATE_PROFILE, formData);
            if (data && data.response && data.response.message) {
                toast.success(data.response.message);
                
                // Also update the localstorage value of user's fullname
                localStorage.setItem('user', JSON.stringify({...user, fullname: formData.fullname}));
            }

        } catch ({ message, response }) {
            let msg = message;

            if (response && response.data.status && response.data.status?.message) {
                msg = response.data.status.message;
            }

            toast.error(msg);
        } finally {
            setIsFetching(false);
        }
    };

    const handeNameChange = ({target}) => {
        setFullname(target.value);
    }

    const handlePictureChange = (picture) => {
        setUser(prev => ({ ...prev, picture }));
    }

    useEffect(() => {
        setInitials(getInitials(user.fullname));
    }, [fullname, user.fullname]);

    useEffect(() => {
        // So that the default value can change after the state has changed with actual user data
        reset({ fullname });
        
    }, [fullname, reset]);

    useEffect(() => {
        async function loadProfile() {

            try {
                let { data } = await window.axiosInstance.get(endpoints.GET_PROFILE);
                if (data && data.response && data.response) {
                    let {response} = data;
                    setUser(response)
                    setInitials(getInitials(response.fullname));
                    setFullname(response.fullname)

                    // Update the locally stored data
                    localStorage.setItem('user', JSON.stringify(response)) // Update the user profile data
                }
    
            } catch ({ message, response }) {
    
                let msg = message;

                if (response && response.data.status && response.data.status?.message) {
                    msg = response.data.status.message;
                }

                toast.error(msg);
            } finally {
                setTimeout(() => setProfileLoading(false), 500);
            }
        }

        loadProfile()
    }, []);

    return (
        <React.Fragment>
            <NavBar user={{...user, fullname}} />
            <Box className={classes.root}>
                <Container maxWidth="md" className={classes.container}>
                    <MotionContainer
                        maxWidth="md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {!profileLoading ? <Box>
                            <Grid container className={classes.header}>
                                <Grid item display={'flex'} justifyContent={'center'} xs={12} sm={2}>
                                    <ProfileAvatar initials={initials} picture={user.picture} pictureOnChange={handlePictureChange} />
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
                                        <Typography variant="h6">{Math.floor(user.completionRate) || 0}%</Typography>
                                        <Typography variant="body2">Completion Rate</Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={user.completionRate || 0}
                                            className={classes.progressBar}
                                        />
                                    </MotionPaper>
                                </Grid>
                            </Grid>
                            <Divider className={classes.divider} />
                            <Typography variant="h6" gutterBottom>
                                Account information
                            </Typography>
                            <form className={classes.form}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            control={control}
                                            name="fullname"
                                            render={({ field }) => (<TextField
                                                field="fullname"
                                                label="Name"
                                                fullWidth
                                                value={fullname}
                                                variant="outlined"
                                                errors={errors}
                                                {...field}
                                                onChange={handeNameChange}
                                                ref={null}
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
                                        disabled={fetching}
                                    >
                                        {fetching ? <CircularProgress size={26} /> : 'Save Changes'}
                                    </Button>
                                </Box>
                            </form>
                        </Box> : <Box className={classes.loaderContainer}>
                            <Loading title={"Loading your profile"} />
                        </Box>}
                    </MotionContainer>
                </Container>
            </Box>
        </React.Fragment>
    );
};

export default Profile;