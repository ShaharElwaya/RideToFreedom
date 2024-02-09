import React from 'react';
import axios from 'axios';
import style from "../styles/loginRegisterPage.module.css";
import TextFieldComponent from '@/components/UI/TextFiled';
import { useState, useEffect } from 'react';
import { Typography, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers";
import PicAndHeadlines from '@/components/UI/picAndheadline';
import CustomizedDialogs from '@/components/dialog';

export default function register() {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [dialogError, setDialogError] = useState(""); // Add a state variable for error message
    const [dialogOpen, setDialogOpen] = React.useState(false); // Initialize state

    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        id: '',
        phone: '',
        userType: '',
        password: '',
        employment_date: '',
    });

    const selectStyle = {
        width: '255px'
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
        e.preventDefault();
        try {
            const { name, email, id, phone, userType, password, employment_date } = formValues;
            const res = await axios.post("api/register", { name, email, id, phone, userType, password, employment_date });

            // Open the success dialog on successful registration
            setDialogOpen(true);
            
            setFormValues({
                name: '',
                email: '',
                id: '',
                phone: '',
                userType: '',
                password: '',
                employment_date: '',
            });

        } catch (err) {
            let errorMessage = "We have a problem, try again"; // Default error message

            if (err.response && err.response.data && err.response.data.error) {
                // If there is a specific error message from the server, use that
                errorMessage = `Registration failed: ${err.response.data.error}`;
            }

            // Open the error dialog with the specific error message
            setDialogOpen(true);
            setDialogError(errorMessage); // Set the error message in the state
        }
    };

    return (
        <>
            <PicAndHeadlines
                primaryHeadline="הוספת משתמש"
                secondaryHeadline="נא למלא את הפרטים עבור המשתמש"
            />
            <form onSubmit={handleClickRegister}>
                <div className={style.space}>
                    <div>
                        <TextFieldComponent
                            outlinedText="שם"
                            value={formValues.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <TextFieldComponent
                            type="email"
                            outlinedText="אימייל"
                            value={formValues.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <TextFieldComponent
                            type="number"
                            outlinedText="תעודת זהות"
                            value={formValues.id}
                            onChange={(e) => handleInputChange('id', e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <TextFieldComponent
                            outlinedText="טלפון"
                            value={formValues.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <TextFieldComponent
                            type="password"
                            outlinedText="סיסמה"
                            value={formValues.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            required
                        />
                    </div>
                    <FormControl className={style.select_style}>
                        <InputLabel id="selectUsersTypes">סוג משתמש *</InputLabel>
                        <Select
                            labelId="selectUsersTypes"
                            id="selectUsersTypesId"
                            label="סוג משתמש"
                            value={formValues.userType}
                            onChange={handleSelectChange}
                            required
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
                    {formValues.userType === 2 || formValues.userType === 3 ? (
                        <DatePicker
                            label="תאריך תחילת עבודה"
                            value={formValues.employment_date}
                            onChange={(newDate) => handleInputChange('employment_date', newDate)}
                            required={formValues.userType === 2 || formValues.userType === 3}
                            width="238px"

                        />
                    ) : null}
                </div>
                </div>
                <Button type="submit" variant="contained">הוספת משתמש</Button>
            </form>

            <CustomizedDialogs
                title={dialogError ? "ההרשמה נכשלה" : "ההרשמה הושלמה"}
                text={dialogError ? dialogError : "משתמש " + formValues.email + " התווסף בהצלחה למערכת!"}
                open={dialogOpen}
                onClose={() => { setDialogOpen(false); setDialogError(""); }} 
                actions={[
                    <Button key="confirmButton" autoFocus onClick={handleCloseDialog}>
                      הבנתי
                    </Button>,
                  ]}
            />
        </>
    );
}
