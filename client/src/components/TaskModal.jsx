import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Button, useTheme, Select, MenuItem, InputLabel, FormControl,
    FormHelperText, Dialog, DialogActions, DialogTitle, DialogContent,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import TextField from './TextField';

const useStyles = makeStyles()((theme) => ({
    modal: {

    },
    modalContent: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        width: '90%',
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

const TaskModal = ({ open, onClose }) => {
    const initialValues = { title: '', description: '', status: 'To Do', dueDate: new Date() };
    const { classes } = useStyles();
    const theme = useTheme();
    const [newTask, setNewTask] = useState(initialValues);
    const [dueDate, setDueDate] = useState(null);

    const schema = zod.object({
        title: zod.string().min(5, { message: "Title is required" }),
        description: zod.string().min(5, { message: "Description is required" }),
        dueDate: zod.date({ message: 'Please pick a due date' })
    });

    const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues, resolver: zodResolver(schema) });

    const addTask = (values) => {
        console.log(values)
    };

    const valueOnChange = ({ target }) => {
        setNewTask(prev => ({ ...prev, [target.name]: target.value }));
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                            />)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={newTask.status || 'To Do'}
                                onChange={valueOnChange}
                                label="Status"
                                name="status"
                            >
                                <MenuItem value="To Do">To Do</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Done">Done</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <FormControl error={Boolean(errors.dueDate)}>
                            <Controller
                                control={control}
                                name="dueDate"
                                render={({ field }) => (
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Due Date"
                                            value={dueDate}
                                            {...field}
                                            onChange={valueOnChange}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
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
                    >
                        Add Task
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
}

export default TaskModal;