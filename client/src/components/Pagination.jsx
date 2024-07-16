import React, { useState, useEffect } from 'react';
import { Pagination as MuiPagination } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '1rem',
        '& .MuiPaginationItem-root': {
            color: theme.palette.primary.main,
        },
    }
}));

const Pagination = ({pagination, paginationParams, loaderFn, setTasks}) => {
    const { classes } = useStyles();
    const [page, setPage] = useState(1);

    const {currentPage, limit, totalPages,} = pagination;
    const {status, search} = paginationParams;

    const handlePageChange = (event, value) => {
        loaderFn(value, limit, status, search).then(tasks => setTasks(tasks))
    };
    
    useEffect(() => {
        if (!currentPage && !page) return setPage(1);
        setPage(currentPage + 1);

        // eslint-disable-next-line
    }, [currentPage])

    return (
        <div className={classes.root}>
            <MuiPagination
                count={(totalPages || 1)}
                page={page - 1}
                onChange={handlePageChange}
                color="primary"
            />
        </div>
    );
};

export default Pagination;