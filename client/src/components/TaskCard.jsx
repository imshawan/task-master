import React, { useState, useEffect } from "react";
import { CardContent, Chip, Collapse, Grid, IconButton, ListItemIcon, MenuItem, Menu, Typography, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { makeStyles } from 'tss-react/mui';
import { toast } from "react-toastify";
import Sweetalert from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { calculateDueDate } from "../utilities";
import { endpoints, httpClient as http, parseParams } from '../utilities';

const useStyles = makeStyles()((theme) => ({
    chip: {
        fontWeight: 'bold',
    },
    cardContent: {
        cursor: 'pointer'
    },
    button: {
        marginBottom: '1rem'
    }
}));

const Swal = withReactContent(Sweetalert);
const STATUSES = ['To Do', 'In Progress', 'Done', 'Discarded'];

export default function TaskCard({ task, onDatachange, onRemove }) {
    const { classes } = useStyles();
    const [expandedTask, setExpandedTask] = useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [due, setDue] = React.useState(calculateDueDate(task.dueDate));
    const [status, setStatus] = React.useState(task.status);
    const open = Boolean(anchorEl);

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

        try {
            let { data } = await http.put(parseParams(endpoints.UPDATE_TASK, {id}), {status: val});
            if (data && data.response && data.response.message) {
                toast.success(data.response.message);
            }
        } catch ({ message, response }) {

            if (response && response.data.status && response.data.status?.message) {
                message = response.data.status.message;
            }
            toast.error(message);
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
                    let { data } = await http.delete(parseParams(endpoints.DELETE_TASK, {id}));
                    if (data && data.response && data.response.message) {
                        toast.success(data.response.message);
                    }
                } catch ({ message, response }) {
        
                    if (response && response.data.status && response.data.status?.message) {
                        message = response.data.status.message;
                    }
                    toast.error(message);
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
    }, [status]);

    return (
        <CardContent>
            <Grid container alignItems="center" spacing={2}>
                <Grid item xs={status != 'Done' ? 7 : 9} className={classes.cardContent} onClick={() => setExpandedTask(expandedTask === task._id ? null : task._id)}>
                    <Typography variant="h6">{task.title}</Typography>
                </Grid>
            
                {status !== 'Done' && <Grid item xs={2}>
                    <Chip
                        label={due}
                        color={due == 'Overdue' ? 'secondary' : 'primary'}
                        size="small"
                        title={due}
                        className={classes.chip}
                    />
                </Grid>}

                <Grid item xs={2}>
                    <Chip
                        icon={status === 'Done' ? <CheckCircleIcon /> : <PendingIcon />}
                        label={status}
                        color={getTaskStatusColor(status)}
                        size="small"
                        className={classes.chip}
                    />
                </Grid>

                <Grid item xs={1}>
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
                        {STATUSES.map((e, i) => <MenuItem key={i} onClick={() => handleStatusChange(e, task._id)}>Mark as "<em>{e}</em>"</MenuItem>)}
                        <Divider />

                        <MenuItem onClick={() => deleteTask(task._id)}>
                            <ListItemIcon>
                                <DeleteIcon />
                            </ListItemIcon>
                            <Typography textAlign="center">Delete</Typography>
                        </MenuItem>
                    </Menu>
                </Grid>

            </Grid>
            <Collapse in={expandedTask === task._id}>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
                    {task.description}
                </Typography>
            </Collapse>
        </CardContent>
    )
}