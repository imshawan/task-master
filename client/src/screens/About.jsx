import React from 'react';
import { Box, Typography, Container, Grid, Paper, useTheme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import DevicesIcon from '@mui/icons-material/Devices';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';

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
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(4),
    },
    logo: {
        fontSize: 48,
        color: theme.palette.primary.main,
        marginRight: theme.spacing(2),
    },
    featurePaper: {
        padding: theme.spacing(3),
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.6)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        },
    },
    featureIcon: {
        fontSize: 48,
        color: theme.palette.primary.main,
        marginBottom: theme.spacing(2),
    },
    missionPaper: {
        padding: theme.spacing(3),
        marginTop: theme.spacing(9),
        background: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
    },
}));

const MotionContainer = motion(Container);
const MotionPaper = motion(Paper);

const AboutScreen = () => {
    const { classes } = useStyles();
    const theme = useTheme();

    const features = [
        { icon: <SpeedIcon className={classes.featureIcon} />, title: 'Efficient', description: 'Streamline your workflow and boost productivity' },
        { icon: <SecurityIcon className={classes.featureIcon} />, title: 'Secure', description: 'Your data is protected with top-notch security' },
        { icon: <DevicesIcon className={classes.featureIcon} />, title: 'Cross-platform', description: 'Access your tasks from any device, anywhere' },
    ];

    return (
        <React.Fragment>
            <NavBar />
            <Box className={classes.root}>
                <Container className={classes.container} maxWidth="md">
                    <MotionContainer
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={classes.header}>
                            <TaskAltIcon className={classes.logo} />
                            <Typography variant="h3" component="h1" color="primary" fontWeight="bold">
                                About TaskMaster
                            </Typography>
                        </div>
                        <Typography variant="h5" paragraph>
                            Empowering Your Productivity Journey
                        </Typography>
                        <Typography variant="body1" paragraph>
                            TaskMaster is a powerful task management application designed to help individuals and teams organize, prioritize, and accomplish their goals efficiently. With its intuitive interface and robust features, TaskMaster transforms the way you approach your daily tasks and long-term projects.
                        </Typography>
                        <Grid container spacing={3} style={{ marginTop: theme.spacing(4) }}>
                            {features.map((feature, index) => (
                                <Grid item xs={12} sm={4} key={index}>
                                    <MotionPaper
                                        className={classes.featurePaper}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {feature.icon}
                                        <Typography variant="h6" gutterBottom>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2">
                                            {feature.description}
                                        </Typography>
                                    </MotionPaper>
                                </Grid>
                            ))}
                        </Grid>
                        <MotionPaper
                            className={classes.missionPaper}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <Typography variant="h5" gutterBottom color="primary">
                                Our Mission
                            </Typography>
                            <Typography variant="body1">
                                At TaskMaster, we're committed to providing a seamless task management experience that adapts to your unique workflow. Our mission is to empower individuals and teams to achieve their goals, one task at a time, by offering innovative tools that enhance focus, collaboration, and productivity.
                            </Typography>
                        </MotionPaper>
                    </MotionContainer>
                </Container>
            </Box>
        </React.Fragment>
    );
};

export default AboutScreen;