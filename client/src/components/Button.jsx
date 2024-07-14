import React from "react";
import { Button as MuiButton, useTheme } from "@mui/material";

export default function Button({children, ...props }) {

    return <MuiButton
            sx={{height: '49px'}}
            {...props}
        >
            {children}
        </MuiButton>
}