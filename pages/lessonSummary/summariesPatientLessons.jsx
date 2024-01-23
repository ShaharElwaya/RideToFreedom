import React from 'react';
import axios from 'axios';
import { Typography, TextField, Button } from '@mui/material';
import TextFieldComponent from '@/components/UI/TextFiled';
import PicAndHeadlines from '@/components/UI/picAndheadline';
import PatientRow from '@/components/UI/patientRow';
import style from '../../styles/summariesPatientLessons.module.css';
import { useRouter } from 'next/router'; // Import useRouter from next/router

export default function summariesPatientLessons() {
    const router = useRouter(); // Get the router object from next/router

    const handleAdd = () => {
        router.push('/lessonSummary/specificSummary');
    };

    return (
        <>
            <PicAndHeadlines
                pictureName="lessonSummary"
                picturePath="../lessonSummary.png"
                primaryHeadline="סיכומי שיעורים"
                secondaryHeadline="להשלים שם מטופל"
            />
            <div className={style.addButtonStyle}>
                <Button onClick={handleAdd}>+ הוספת סיכום</Button>
            </div>
            <PatientRow
                pictureName="boyPic"
                picturePath="../boyPic.png"
                date="12.3.12"
                time="23:34"
                name="שם מטופל">
            </PatientRow>
            <PatientRow
                pictureName="boyPic"
                picturePath="../boyPic.png"
                date="12.3.12"
                time="23:34"
                name="שם מטופל">
            </PatientRow>
        </>
    );
}
