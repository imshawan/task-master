import React from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddIcon from '@mui/icons-material/Add';
import Button from './Button';

const useStyles = makeStyles()((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(4),
        textAlign: 'center',
    },
    icon: {
        fontSize: 80,
        color: theme.palette.primary.main,
        marginBottom: theme.spacing(2),
    },
    button: {
        marginTop: theme.spacing(2),
    },
}));


const NoTasks = ({ onAddTask }) => {
    const { classes } = useStyles();

    return (
        <Box className={classes.root}>
            <AssignmentIcon className={classes.icon} />
            <Typography variant="h5" gutterBottom>
                Nothing was found!
            </Typography>
            <Typography variant="body1" paragraph>
                It looks like you haven't added any tasks.
                Start organizing your day by creating your first task!
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={onAddTask}
                className={classes.button}
            >
                Create a new Task
            </Button>
        </Box>
    );
};

export default NoTasks;