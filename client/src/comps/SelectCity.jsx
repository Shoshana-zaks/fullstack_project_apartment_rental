import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';

const SelectCity = ({ label, url, value, onChange, options: propOptions }) => {
    const [options, setOptions] = useState(propOptions || []);
    const [inputValue, setInputValue] = useState(value || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!propOptions && url) {
            let isMounted = true;
            const fetchOptions = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(url);
                    if (isMounted) {
                        setOptions(response.data.map(item => ({ ...item, id: item._id })));
                    }
                } catch (error) {
                    console.error(`שגיאה בטעינת ${label}:`, error);
                } finally {
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            };
            fetchOptions();
            return () => { isMounted = false; };
        } else if (propOptions) {
            setOptions(propOptions);
        }
    }, [url, label, propOptions]);

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        onChange(newInputValue);
    };

    const handleChange = (event, newValue) => {
        console.log(`SelectCity handleChange עבור ${label}:`, newValue);
        setInputValue(newValue?.name || '');

        if (newValue && newValue._id) {
            onChange(newValue._id);
        } else if (typeof newValue === 'string' && newValue.trim() !== '') {
            onChange(newValue.trim());
        } else {
            onChange('');
        }
    };

    return (
        <Autocomplete
            freeSolo
            options={options}
            getOptionLabel={(option) => option?.name || ''}
            value={options?.find(option => option?._id === value) || null}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onChange={handleChange}
            isOptionEqualToValue={(option, value) => option?._id === value}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading && !propOptions ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            getOptionKey={(option) => option?._id || option?.name}
        />
    );
};

export default SelectCity;