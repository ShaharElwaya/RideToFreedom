import React from 'react';
import axios from 'axios';
import style from "../styles/loginRegisterPage.module.css";
import TextFieldComponent from '@/components/UI/TextFiled';
import { useState, useEffect } from 'react';
import { Typography, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

export default function register() {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        phone: '',
        userType: '',
        password: ''
    });

    const selectStyle = {
        width: '240px'
    };

    useEffect(() => {
        async function fetchOptions() {
            try {
                const response = await fetch('/api/register/user_types_options');
                const data = await response.json();
                setOptions(data);
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        }

        fetchOptions();
    }, []);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        setFormValues({ ...formValues, userType: event.target.value });
    };

    const handleInputChange = (name, value) => {
        setFormValues({ ...formValues, [name]: value });
    };  

    const handleClickRegister = async (e) => {
        e.preventDefault()
        try {
            const { name, email, phone, userType, password } = formValues;
            const res = await axios.post("api/register", { name, email, phone, userType, password });
            alert('Register successful!')
            console.log("reset start")
            // Reset the form
            setFormValues({
                name: '',
                email: '',
                phone: '',
                userType: '',
                password: ''
            })
            console.log('Form values after reset:', formValues);
        }
        catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                alert(`Registration failed: ${err.response.data.error}`);
              } else {
                alert('We have a problem, try again');
              }
        }
    };

    return (
        <>
            <div className={style.login_general}>
                <div className={style.space}>
                    <Typography variant='h4' className={style.bold}>
                        הוספת משתמש
                    </Typography>
                    <Typography>
                        נא למלא את הפרטים עבור המשתמש
                    </Typography>
                </div>
                <form onSubmit={handleClickRegister}>
                    <div className={style.space}>
                        <div>
                            <TextFieldComponent
                                outlinedText="שם"
                                value={formValues.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                        </div>
                        <div>
                            <TextFieldComponent
                                type="email"
                                outlinedText="אימייל"
                                value={formValues.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                        </div>
                        <div>
                            <TextFieldComponent
                                outlinedText="טלפון"
                                value={formValues.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                            />
                        </div>
                        <FormControl className={style.select_style}>
                            <InputLabel id="selectUsersTypes">סוג משתמש</InputLabel>
                            <Select
                                labelId="selectUsersTypes"
                                id="selectUsersTypesId"
                                label="סוג משתמש"
                                value={formValues.userType}
                                onChange={handleSelectChange}
                                style={selectStyle}
                            >
                                {options.map(option => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div>
                            <TextFieldComponent 
                                type="password" 
                                outlinedText="סיסמה" 
                                value={formValues.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}/>
                        </div>
                    </div>
                    <Button type="submit" variant="contained">הוספת משתמש</Button>
                </form>
            </div>
        </>
    );
}
