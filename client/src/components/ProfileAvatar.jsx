import React, { useState } from 'react';
import { Avatar, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';
import { toast } from 'react-toastify';
import { endpoints } from '../utilities';

const host = process.env.REACT_APP_HOST;

const useStyles = makeStyles()((theme) => ({
    avatar: {
        position: 'relative',
        width: theme.spacing(13),
        height: theme.spacing(13),
        cursor: 'pointer',
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
    },
    iconButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: '50%',
        padding: theme.spacing(0.5),
        '&:hover': {
            backgroundColor: theme.palette.background.default + '90',
        },
    },
    input: {
        display: 'none',
    },
}));

const ProfileAvatar = ({ initials, picture, pictureOnChange }) => {
    const { classes } = useStyles();
    const [profilePicture, setProfilePicture] = useState(host + picture);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!String(file.type).includes('image')) {
                return toast.error('Only images are allowed');
            }
            
            const reader = new FileReader();
            reader.onload = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('picture', file);

            try {
                let { data } = await window.axiosInstance.put(endpoints.UPDATE_PROFILE, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  });
                if (data && data.response && data.response.message) {
                    toast.success(data.response.message);
                    
                    let user = JSON.parse(localStorage.getItem('user')) ||{};
                    localStorage.setItem('user', JSON.stringify({...user, picture: data.response.picture}));

                    if (pictureOnChange && typeof pictureOnChange === 'function') {
                        pictureOnChange(data.response.picture);
                    }
                }
    
            } catch ({ message, response }) {
                let msg = message;
    
                if (response && response.data.status && response.data.status?.message) {
                    msg = response.data.status.message;
                }
    
                toast.error(msg);
            }
        }
    };

    return (
        <div className={classes.avatar}>
            <Avatar src={profilePicture} className={classes.avatar}>
                {!profilePicture && initials}
            </Avatar>
            <input
                accept="image/*"
                className={classes.input}
                id="icon-button-file"
                type="file"
                onChange={handleFileChange}
            />
            <label htmlFor="icon-button-file">
                <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    className={classes.iconButton}
                >
                    <PhotoCamera />
                </IconButton>
            </label>
        </div>
    );
};

export default ProfileAvatar;