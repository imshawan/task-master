import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(4),
        textAlign: 'center',
    },
    progress: {
        marginBottom: theme.spacing(2),
        color: theme.palette.primary.main,
    },
    loadingText: {
        marginTop: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
}));


const Loading = () => {
    const { classes } = useStyles();

    return (
        <Box className={classes.root}>
            <CircularProgress
                size={60}
                thickness={4}
                className={classes.progress}
            />
            <Typography variant="h6" gutterBottom>
                Loading Your Tasks
            </Typography>
            <Typography variant="body2" className={classes.loadingText}>
                Just a moment while we fetch your tasks...
            </Typography>
        </Box>
    );
};

export default Loading;