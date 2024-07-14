import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, IconButton, useTheme, useMediaQuery, Card, 
    CardContent, Chip, SpeedDial, Container, Select, MenuItem, InputLabel, FormControl, Collapse, LinearProgress,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { motion, AnimatePresence } from 'framer-motion';
import TaskModal from '../components/TaskModal';
import NavBar from '../components/NavBar';

const useStyles = makeStyles()((theme) => ({
    root: {
        minHeight: 'calc(100vh - 69px)',
        background: `linear-gradient(45deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent:  'center'
    },
    container: {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: theme.shape.borderRadius * 2,
        padding: theme.spacing(4),
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        minHeight: '694px',
    },
    tasks: {
        maxHeight: '380px',
        overflow: 'auto'
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
    },
    logo: {
        fontSize: 48,
        color: theme.palette.primary.main,
        marginRight: theme.spacing(2),
    },
    form: {
        width: '100%',
        marginBottom: theme.spacing(4),
    },
    textField: {
        '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            '& fieldset': {
                borderColor: 'transparent',
            },
            '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
            },
        },
    },
    taskCard: {
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(5px)',
        borderRadius: theme.shape.borderRadius,
        marginBottom: theme.spacing(2),
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        },
    },
    chip: {
        fontWeight: 'bold',
    },
    addButton: {
        borderRadius: '50%',
        padding: theme.spacing(2),
        minWidth: 'unset',
    },
    filterContainer: {
        marginBottom: theme.spacing(3),
        // marginTop: theme.spacing(2)
    },
    progress: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    progressBar: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(4),
    },
    speedDial: {
        position: "absolute",
        "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
          bottom: theme.spacing(2),
          right: theme.spacing(2)
        },
        "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
          top: theme.spacing(2),
          left: theme.spacing(2)
        }
      }
}));

const MotionCard = motion(Card);

const TaskList = () => {
    const { classes } = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [tasks, setTasks] = useState([
        { id: 1, title: 'Complete project proposal', description: 'Draft and finalize the project proposal for the new client', status: 'To Do' },
        { id: 2, title: 'Review code changes', description: 'Go through the latest pull requests and provide feedback', status: 'In Progress' },
        { id: 3, title: 'Update documentation', description: 'Revise the API documentation with the latest changes', status: 'To Do' },
        { id: 4, title: 'Schedule team meeting', description: 'Set up a meeting to discuss the upcoming sprint goals', status: 'Done' },
    ]);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [filter, setFilter] = useState('All');
    const [filtered, setFiltered] = useState([]);
    const [expandedTask, setExpandedTask] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const updateStatus = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, status: getNextStatus(task.status) } : task
        ));
    };

    const getNextStatus = (currentStatus) => {
        const statuses = ['To Do', 'In Progress', 'Done'];
        const currentIndex = statuses.indexOf(currentStatus);
        return statuses[(currentIndex + 1) % statuses.length];
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const addTask = (event) => {
        event.preventDefault();
        if (newTask.title.trim() && newTask.description.trim()) {
            setTasks([...tasks, { id: Date.now(), ...newTask, status: 'To Do' }]);
            setNewTask({ title: '', description: '' });
        }
    };

    const getCompletionPercentage = () => {
        const completedTasks = tasks.filter(task => task.status === 'Done').length;
        return (completedTasks / tasks.length) * 100;
    };

    useEffect(() =>  {
        filter && setFiltered(filter === 'All' ? tasks : tasks.filter(task => task.status === filter));
    }, [filter]);

    return (
        <React.Fragment>
            <NavBar />
            <TaskModal open={openModal} onClose={() => setOpenModal(false)} />
            <Box className={classes.root}>
                <Container maxWidth="md" className={classes.container}>
                    <div className={classes.logoContainer}>
                        <TaskAltIcon className={classes.logo} />
                        <Typography component="h1" variant="h3" fontWeight="bold" color="primary">
                            TaskMaster
                        </Typography>
                    </div>
                    <Typography variant="h5" color="textSecondary" gutterBottom>
                        Manage Your Tasks Effortlessly
                    </Typography>
                    <Grid container spacing={2} className={classes.filterContainer}>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    className={classes.textField}
                                    variant="outlined"
                                    fullWidth
                                    label="Search"
                                    placeholder="Type a task name"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Filter Tasks</InputLabel>
                                    <Select
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                        label="Filter Tasks"
                                    >
                                        <MenuItem value="All">All</MenuItem>
                                        <MenuItem value="To Do">To Do</MenuItem>
                                        <MenuItem value="In Progress">In Progress</MenuItem>
                                        <MenuItem value="Done">Done</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                    </Grid>
                    <Box className={classes.progressBar}>
                        <Box className={classes.progress}>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Overall Progress
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                {getCompletionPercentage()}%
                            </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={getCompletionPercentage()} />
                    </Box>
            
                    <Box className={classes.tasks}>
                        <AnimatePresence>
                            {filtered.map((task) => (
                                <MotionCard
                                    key={task.id}
                                    className={classes.taskCard}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <CardContent>
                                        <Grid container alignItems="center" spacing={2}>
                                            <Grid item xs>
                                                <Typography variant="h6">{task.title}</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Chip
                                                    icon={task.status === 'Done' ? <CheckCircleIcon /> : <PendingIcon />}
                                                    label={task.status}
                                                    color={task.status === 'Done' ? 'primary' : 'secondary'}
                                                    size="small"
                                                    className={classes.chip}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    size="small"
                                                    onClick={() => updateStatus(task.id)}
                                                    variant="outlined"
                                                    color="primary"
                                                >
                                                    Update Status
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => deleteTask(task.id)}
                                                    color="secondary"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Grid>
                                            <Grid item>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                                                >
                                                    {expandedTask === task.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                        <Collapse in={expandedTask === task.id}>
                                            <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
                                                {task.description}
                                            </Typography>
                                        </Collapse>
                                    </CardContent>
                                </MotionCard>
                            ))}
                        </AnimatePresence>
                    </Box>
                </Container>
                <Box>
                    <SpeedDial
                        ariaLabel="SpeedDial basic example"
                        className={classes.speedDial}
                        open={false}
                        onClick={() => setOpenModal(true)}
                        icon={<SpeedDialIcon />}
                    />
                </Box>
            </Box>
        </React.Fragment>
    );
};

export default TaskList;