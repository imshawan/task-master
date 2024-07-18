import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Grid, Card, SpeedDial, Container, Select, MenuItem, InputLabel, 
    FormControl, LinearProgress,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import _ from 'lodash';
// import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskModal from '../components/TaskModal';
import NavBar from '../components/NavBar';
import { endpoints,  parseParams } from '../utilities';
import TaskCard from '../components/TaskCard';
import NoTasks from '../components/NoTasks';
import Loading from '../components/Loading';
import TaskPagination from '../components/Pagination';

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
        minHeight: '780px',
        // overflow: 'hidden'
    },
    tasks: {
        // maxHeight: '500px',
        // overflow: 'auto'
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
        position: "fixed",
        "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
          bottom: theme.spacing(4),
          right: theme.spacing(4)
        },
        "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
          top: theme.spacing(2),
          left: theme.spacing(2)
        }
      }
}));

const MotionCard = motion(Card);
const MotionContainer = motion(Container);

const TaskList = () => {
    const { classes } = useStyles();

    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('All');
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({completionRate: 0, completedTasks: 0, totalTasks: 0});
    const [pagination, setPagination] = useState({page: 1, limit: 5, nextPage: null, currentPage: null, totalPages: null});
    const [paginationParams, setPaginationParams] = useState({status: null, search: null});

    const addTask = (task) => {
        setTasks(prev => {
            if (prev.length >= pagination.limit) {
                // Remove the last element by slicing the array
                return [task, ...prev.slice(0, prev.length - 1)];
            }
            return [task, ...prev];
        });

        if (tasks.length >= pagination.limit && pagination.nextPage <= 1) {
            setPagination(prev => ({...prev, nextPage: prev.nextPage + 1, totalPages: prev.totalPages + 1}));
        }

    };
    

    const onTaskRemove = (task) => {
        if (task && Object.keys(task).length) {
            setTasks(prev => prev.filter(t => t._id !== task._id));
        }
    }

    const getCompletionPercentage = (completedTasks, total) => {
        let num = Math.round((completedTasks / total) * 100);
        if (!num) return 0;

        return num;
    };

    const onTaskUpdate = (task) => {
        let {completedTasks, totalTasks} = profile;

        if (task && Object.keys(task).length) {
            let prevData = tasks.find(t => t._id === task._id);
            
            // Ensure that the previous status was not "Done" or else it will illegally increment the counter
            if (task.status === 'Done' && prevData.status !== 'Done') {
                completedTasks++;

            // If the previous status was "Done" and currently it's being changed to undone, than only decrement
            } else if (task.status !== 'Done' && prevData.status === 'Done') {
                completedTasks--;
            }

            let _profile = {...profile, completedTasks, completionRate: getCompletionPercentage(completedTasks, totalTasks)};

            setTasks(prev => prev.map(t => t._id === task._id ? task : t));
            setProfile(_profile);
            localStorage.setItem('user', JSON.stringify(_profile))
        }
    }

    const handleSearch = _.debounce(({target}) => {
        let {value} = target;
        loadTasks(pagination.nextPage || 1, pagination.limit, filter, value).then(data => data && setTasks(data));
        setPaginationParams(prev => ({...prev, search: value}));
    }, 500);

    const loadTasks = async (page=1, limit=5, status, search) => {
        setLoading(true);

        const query = new URLSearchParams({page, limit});
        if (status || status !== 'All') {
            query.append('status', status);
        }
        if (search) {
            query.append('search', search);
        }

        try {
            const {data} = await window.axiosInstance.get(parseParams(endpoints.GET_TASKS, {query: query.toString()}));
            if (data && data.response && data.response.tasks) {
                setPagination({page, limit, nextPage: data.response.nextPage, currentPage: data.response.currentPage, totalPages: data.response.totalPages});
                return data.response.tasks; 
            }
        } catch ({ message, response }) {
            let msg = message;

            if (response && response.data.status && response.data.status?.message) {
                msg = response.data.status.message;
            }

            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() =>  {
        if (!filter) return;
        if (filter === 'All') {
            loadTasks().then(data => data && setTasks(data));
        } else {
            loadTasks(1, pagination.limit, filter).then(data => data && setTasks(data));
            setPaginationParams(prev => ({...prev, status: filter}))
        }
        // eslint-disable-next-line
    }, [filter]);

    useEffect(() => {
        async function fetchTasks() {
            let data = await loadTasks();
            if (data) {
                setTasks(data);
            }
        }

        // Load the cached profile from the localstorage
        setProfile(JSON.parse(localStorage.getItem('user')) || {});

        fetchTasks();
    }, []);

    return (
        <React.Fragment>
            <NavBar />
            <TaskModal open={openModal} onClose={() => setOpenModal(false)} onCreate={addTask} />
            <Box className={classes.root}>
                <MotionContainer 
                    maxWidth="md" 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={classes.container}>
                    <Grid container spacing={2} className={classes.filterContainer}>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    className={classes.textField}
                                    variant="outlined"
                                    fullWidth
                                    label="Search"
                                    placeholder="Type a task name"
                                    onChange={handleSearch}
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
                                        <MenuItem value="Discarded">Discarded</MenuItem>
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
                                {profile.completionRate}%
                            </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={profile.completionRate} />
                    </Box>
            
                    <Box className={classes.tasks}>
                        {tasks.length > 0 ? <Box>
                            {tasks.map((task) => (
                                <MotionCard
                                    key={task._id}
                                    className={classes.taskCard}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >   
                                    <TaskCard task={task} onDatachange={onTaskUpdate} onRemove={onTaskRemove} afterRemove={() => loadTasks()} />
                                </MotionCard>
                            ))}
                        </Box> : (loading ? <Loading title={'Loading Your Tasks'} /> : <NoTasks onAddTask={() => setOpenModal(true)} />)}
                    </Box>
                    <TaskPagination pagination={pagination} paginationParams={paginationParams} loaderFn={loadTasks} setTasks={setTasks} />
                </MotionContainer>
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