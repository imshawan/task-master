import React from "react";
import { FormControl, FormHelperText, OutlinedInput, InputLabel } from "@mui/material";

export default function TextField({errors, onChange, field, type, value, label, inputProps, ...props}) {
    if (!["dense","none"].includes(props.margin)) props.margin = 'none';

    return (
        <FormControl error={Boolean(errors && errors[field])} sx={{mt: 1}} fullWidth>
            <InputLabel>{label}</InputLabel>
            <OutlinedInput 
                fullWidth
                label={label}
                value={value}
                onChange={onChange}
                margin="normal"
                name={field}
                type={type}
                {...props}
                {...inputProps}
            />
            {errors && errors[field] && <FormHelperText>{errors[field]['message']}</FormHelperText>}
        </FormControl>
    )
}