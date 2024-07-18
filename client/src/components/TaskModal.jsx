import React, { useState } from 'react';
import {
    Box, Grid, Button, Select, MenuItem, InputLabel, FormControl, CircularProgress,
    FormHelperText, Dialog, DialogActions, DialogTitle, DialogContent,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import { toast } from 'react-toastify';
import TextField from './TextField';
import { endpoints,  } from '../utilities';

const useStyles = makeStyles()((theme) => ({
    modal: {

    },
    modalContent: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
    },
    actions: {
        display: 'flex',
        justifyContent: 'center',
        paddingLeft: theme.spacing(.5),
        paddingRight: theme.spacing(.5)
    },
    actionItems: {
        width: '90%',
        display: 'flex',
        justifyContent: 'end',
        marginBottom: theme.spacing(1)
    },
    button: {
        width: '140px',
        marginLeft: theme.spacing(2)
    }
}));

const TaskModal = ({ open, onClose, onCreate }) => {
    const initialValues = { title: '', description: '', status: '', dueDate: new Date() };
    const { classes } = useStyles();

    const [newTask, setNewTask] = useState(initialValues);
    const [fetching, setIsFetching] = useState(false);

    const schema = zod.object({
        title: zod.string().min(1, { message: "Title must be atleast 1 char" }),
        description: zod.string().optional(),
        dueDate: zod.date({ message: 'Please pick a due date' })
    });

    const { control, handleSubmit, formState: { errors }, reset, } = useForm({ defaultValues: initialValues, resolver: zodResolver(schema) });

    const addTask = async (values) => {
        setIsFetching(true);

        let formData = {...values, dueDate: new Date(newTask.dueDate).toISOString(), status: newTask.status};

        try {
            let { data } = await window.axiosInstance.post(endpoints.CREATE_TASK, formData);
            if (data && data.response && data.response.message) {
                toast.success(data.response.message);

                if (onClose && typeof onClose === 'function') {
                    onClose();
                }

                if (onCreate && typeof onCreate === 'function') {
                    onCreate(data.response.task);
                }

                setNewTask(initialValues);
                reset(initialValues);
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

    const handleCloseDialog = (ev, reason) => {
        if (!onClose || typeof onClose !== 'function') return;

        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            onClose()
        }
    }

    const valueOnChange = ({ target }) => {
        setNewTask(prev => ({ ...prev, [target.name]: target.value }));
    }

    const dueDateOnChange = (date) => {
        setNewTask(prev => ({ ...prev, dueDate: date }));
    }

    return (
        <Dialog
            open={open}
            onClose={handleCloseDialog}
            className={classes.modal}
            PaperProps={{
                style: {
                    maxWidth: '600px', // Custom maxWidth
                    width: '100%',
                },
            }}
        >
            <DialogTitle>
                Add New Task
            </DialogTitle>
            <DialogContent className={classes.modalContent}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12}>
                        <Controller
                            control={control}
                            name="title"
                            render={({ field }) => (<TextField
                                fullWidth
                                label="Title"
                                value={newTask.title}
                                field={'title'}
                                onChange={valueOnChange}
                                margin="normal"
                                errors={errors}
                                {...field}
                                ref={null}
                            />)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            control={control}
                            name="description"
                            render={({ field }) => (<TextField
                                fullWidth
                                label="Description"
                                value={newTask.description}
                                field={'description'}
                                onChange={valueOnChange}
                                margin="normal"
                                multiline
                                rows={4}
                                errors={errors}
                                {...field}
                                ref={null}
                            />)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={newTask.status}
                                onChange={valueOnChange}
                                label="Status"
                                name="status"
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="To Do">To Do</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Done">Done</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} mt={1} sm={6}>

                        <FormControl fullWidth error={Boolean(errors.dueDate)}>
                            <Controller
                                control={control}
                                name="dueDate"
                                render={({ field }) => (
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Due Date"
                                            value={newTask.dueDate}
                                            {...field}
                                            onChange={dueDateOnChange}
                                        >

                                        </DatePicker>
                                    </LocalizationProvider>
                                )}
                            />
                            {errors.dueDate && <FormHelperText>{errors.dueDate.message}</FormHelperText>}
                        </FormControl>

                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions className={classes.actions}>
                <Box className={classes.actionItems}>
                    <Button
                        type="submit"
                        variant="outlined"
                        color="primary"
                        fullWidth
                        className={classes.button}
                        onClick={onClose}
                        disabled={fetching}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className={classes.button}
                        onClick={handleSubmit(addTask)}
                        disabled={fetching}
                    >
                        {fetching ? <CircularProgress size={20} /> : 'Add Task'}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
}

export default TaskModal;