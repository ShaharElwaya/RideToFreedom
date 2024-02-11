import React, { useState } from 'react';
import { MenuItem, Button, TextField } from '@mui/material';
import style from "../styles/loginRegisterPage.module.css";
import PicAndHeadlines from '@/components/UI/picAndheadline';
import TextFieldComponent from '@/components/UI/TextFiled';

export default function introduction_meeting() {
    const [selectedDate, setSelectedDate] = useState('');

    const selectStyle = {
        width: '250px', // Set a fixed width for both text fields
        alignText: 'start',
    };

    const [status, setStatus] = React.useState('');

    const handleChange = (event) => {
        setStatus(event.target.value);
    };

    const createMeetingReq = async (e) => {

    }

    return (
        <div className={style.general}>
            <PicAndHeadlines
                pictureName="introicon"
                picturePath="../introicon.png"
                primaryHeadline="בקשה לפגישת היכרות"
            />
            <form onSubmit={createMeetingReq}>
                <div className={style.space}>
                    <div>
                        <TextFieldComponent type="text" outlinedText="שם הילד/ה" required />
                    </div>
                    <div>
                        <TextFieldComponent type="number" outlinedText="גיל" required />
                    </div>
                    <div>
                    <TextField labelId="demo-simple-select-label"
                            select
                            id="demo-simple-select"
                            value={status}
                            label={"מין"}
                            onChange={handleChange}
                            style={selectStyle}
                            sx={{input: {textAlign: "right"}}}>
                            <MenuItem value={1}>זכר</MenuItem>
                            <MenuItem value={2}>נקבה</MenuItem>
                        </TextField>
                    </div>
                    <div>
                        <TextFieldComponent type="text" outlinedText="שם ההורה" required />
                    </div>
                    <div>
                        <TextFieldComponent type="text" outlinedText="שם הורה נוסף" />
                    </div>
                    <div>
                        <TextFieldComponent type="text" outlinedText="סיבת הגעה" required />
                    </div>
                    <div>
                        <TextField labelId="demo-simple-select-label"
                            select
                            id="demo-simple-select"
                            value={status}
                            label={"מצב משפחתי"}
                            onChange={handleChange}
                            style={selectStyle}
                            sx={{input: {textAlign: "center"}}}>
                            <MenuItem value={1}>נשואים</MenuItem>
                            <MenuItem value={2}>גרושים</MenuItem>
                            <MenuItem value={3}>פרודים</MenuItem>
                            <MenuItem value={4}>בזוגיות</MenuItem> 
                        </TextField>
                    </div>
                </div>
                <Button type="submit" variant="contained">צור בקשה</Button>
            </form>
        </div>
    );
};
