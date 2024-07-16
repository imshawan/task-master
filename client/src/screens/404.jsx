import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { motion } from 'framer-motion';

const useStyles = makeStyles()((theme) => ({
    root: {
        minHeight: '100vh',
        background: `linear-gradient(45deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(0, 4),
    },
    container: {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: theme.shape.borderRadius * 2,
        padding: theme.spacing(6),
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        textAlign: 'center',
    },
    icon: {
        fontSize: 120,
        color: theme.palette.primary.main,
        marginBottom: theme.spacing(2),
    },
    title: {
        marginBottom: theme.spacing(2),
        fontWeight: 'bold',
    },
    subtitle: {
        marginBottom: theme.spacing(4),
        color: theme.palette.text.secondary,
    },
    button: {
        borderRadius: theme.shape.borderRadius * 2,
        padding: theme.spacing(1, 4),
    },
}));

const MotionBox = motion(Box);

const NotFound = () => {
    const { classes } = useStyles();

    return (
        <React.Fragment>
            <Box className={classes.root}>
                <Container maxWidth="sm">
                    <MotionBox
                        className={classes.container}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ErrorOutlineIcon className={classes.icon} />
                        <Typography variant="h2" className={classes.title}>
                            404
                        </Typography>
                        <Typography variant="h4" className={classes.subtitle}>
                            Oops! Page not found
                        </Typography>
                        <Typography variant="body1" paragraph>
                            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            href="/"
                        >
                            Go to Homepage
                        </Button>
                    </MotionBox>
                </Container>
            </Box>
        </React.Fragment>
    );
};

export default NotFound;