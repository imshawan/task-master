import React, { useState, useEffect } from "react";
import { CardContent, Chip, Collapse, Grid, IconButton, ListItemIcon, MenuItem, Menu, Typography, Divider, Box,
    useMediaQuery, useTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { makeStyles } from 'tss-react/mui';
import { toast } from "react-toastify";
import Sweetalert from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { calculateDueDate } from "../utilities";
import { endpoints, parseParams } from '../utilities';

    const useStyles = makeStyles()((theme) => ({
        chip: {
            fontWeight: 'bold',
        },
        cardContent: {
            padding: theme.spacing(1),
        },
        button: {
            marginBottom: '1rem'
        },
        title: {
            cursor: 'pointer'
        },
        indicators: {
            marginRight: '.75rem',
        },
        menu: {
            display: 'flex',
            justifyContent: 'end'
        }
    }));

const Swal = withReactContent(Sweetalert);
const STATUSES = ['To Do', 'In Progress', 'Done', 'Discarded'];

export default function TaskCard({ task, onDatachange, onRemove, afterRemove }) {
    const { classes } = useStyles();
    const theme = useTheme();
    const [expandedTask, setExpandedTask] = useState(task._id);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [due, ] = React.useState(calculateDueDate(task.dueDate));
    const [status, setStatus] = React.useState(task.status);
    
    const open = Boolean(anchorEl);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleStatusChange = async (val, id) => {
        let prev = status;
        handleClose();
        setStatus(val);

        if (prev === val) return;

        try {
            let { data } = await window.axiosInstance.put(parseParams(endpoints.UPDATE_TASK, {id}), {status: val});
            if (data && data.response && data.response.message) {
                toast.success(data.response.message);
            }
        } catch ({ message, response }) {
            let msg = message;
            if (response && response.data.status && response.data.status?.message) {
                msg = response.data.status.message;
            }
            toast.error(msg);
            setStatus(prev);
        }
    }

    const deleteTask = async (id) => {
        handleClose()

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                confirmButton: classes.button,
                cancelButton: classes.button
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (onRemove && typeof onRemove === 'function') {
                    onRemove(task)
                }
        
                try {
                    let { data } = await window.axiosInstance.delete(parseParams(endpoints.DELETE_TASK, {id}));
                    if (data && data.response && data.response.message) {
                        toast.success(data.response.message);
                    }

                    if (afterRemove && typeof afterRemove === 'function') {
                        afterRemove()
                    }
                } catch ({ message, response }) {
                    let msg = message;

                    if (response && response.data.status && response.data.status?.message) {
                        msg = response.data.status.message;
                    }
                    toast.error(msg);
                }
            }
        });
    }

    const getTaskStatusColor = (status) => {
        if (status === 'To Do') {
            return 'warning';
        } else if (status === 'In Progress') {
            return 'info';
        } else if (status === 'Done') {
            return 'success';
        } else if (status === 'Discarded') {
            return 'default';
        } else {
            return 'secondary';
        }
    }

    useEffect(() => {
        if (onDatachange && typeof onDatachange === 'function') {
            onDatachange({...task, status});
        }

        // eslint-disable-next-line
    }, [status]);

    return (
        <CardContent className={classes.cardContent}>
            <Grid container spacing={isMobile ? 1 : 2}>
                <Grid item xs={10} display={'flex'}>
                    <Box pt={2}>
                        <IconButton
                            size="small"
                            onClick={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
                        >
                            {expandedTask === task._id ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </Box>
                    <Typography 
                        className={classes.title}
                        onClick={() => setExpandedTask(expandedTask === task._id ? null : task._id)} pt={2} 
                        variant="h6">{task.title}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Box pt={2} className={classes.menu}>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            MenuListProps={{
                                'aria-labelledby': 'long-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            {STATUSES.map((e, i) => <MenuItem key={i} disabled={e === status} onClick={() => handleStatusChange(e, task._id)}>Mark as "<em>{e}</em>"</MenuItem>)}
                            <Divider />
                            <MenuItem onClick={() => deleteTask(task._id)}>
                                <ListItemIcon>
                                    <DeleteIcon />
                                </ListItemIcon>
                                <Typography textAlign="center">Delete</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Grid>

                <Collapse in={expandedTask === task._id}>
                    <Box sx={{paddingLeft:  isMobile ? '34px' : '50px'}}>
                        <Typography variant="body2" color="textSecondary" my={2}>
                            {task.description}
                        </Typography>

                        <Grid item xs={6} display={'flex'}>
                            {status !== 'Done' && <Box className={classes.indicators} >
                                <Chip
                                    label={due}
                                    color={due === 'Overdue' ? 'secondary' : 'primary'}
                                    size="small"
                                    title={due}
                                    className={classes.chip}
                                />
                            </Box>}
                            <Box display={'flex'} className={classes.indicators}>
                                <Chip
                                    icon={status === 'Done' ? <CheckCircleIcon /> : <PendingIcon />}
                                    label={status}
                                    color={getTaskStatusColor(status)}
                                    size="small"
                                    className={classes.chip}
                                />
                            </Box>
                        </Grid>
                    </Box>
                </Collapse>
            </Grid>
            
        </CardContent>
    )
}