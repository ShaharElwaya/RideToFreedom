import React, { useState } from 'react';
import axios from 'axios';
import { Typography, TextField, Button } from '@mui/material';
import style from "../styles/loginRegisterPage.module.css";
import TextFieldComponent from '@/components/UI/TextField';
import PicAndHeadlines from '@/components/UI/picAndheadline';
import FutureDatePicker from '@/components/UI/FutureDatePicker';

export default function introduction_meeting() {
    const [selectedDate, setSelectedDate] = useState();

    const textFieldStyle = {
        width: '250px', // Set a fixed width for both text fields
    };    

    const createMeetingReq = async (e) => {

    }

    return (
        <div className={style.general}>
            <PicAndHeadlines
                pictureName="formicon"
                picturePath="../formicon.png"
                primaryHeadline="בקשה לפגישת היכרות"
            />
            <form onSubmit={createMeetingReq}>
                <div className={style.space}>
                    <div>
                        <TextFieldComponent type="name" outlinedText="שם הילד/ה" required />
                    </div>
                    <div>
                        <TextFieldComponent type="number" outlinedText="גיל" required />
                    </div>
                    <div>
                        <TextFieldComponent type="name" outlinedText="מין" required />
                    </div>
                    <div>
                        <TextFieldComponent type="name" outlinedText="שם ההורה" required />
                    </div>
                    <div>
                        <TextFieldComponent type="name" outlinedText="שם הורה נוסף" />
                    </div>
                    <div>
                        <FutureDatePicker 
                         value={selectedDate} 
                         onChange={(date) => setSelectedDate(date)} 
                         label="תאריך לפגישה"
                        />
                    </div>
                </div>
                <Button type="submit" variant="contained">צור בקשה</Button>
            </form>
        </div>
    );
};



