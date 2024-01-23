import React from 'react';
import { Typography, Button, Checkbox } from '@mui/material';
import { TextareaAutosize } from '@mui/material';
import PicAndHeadlines from '@/components/UI/picAndheadline';
import PatientRow from '@/components/UI/patientRow';
import style from '../../styles/summariesPatientLessons.module.css';
import TextAreaComponent from '@/components/UI/textAreaComponent';

export default function SummariesPatientLessons() {
    return (
        <>
            <PicAndHeadlines
                pictureName="lessonSummary"
                picturePath="../lessonSummary.png"
                primaryHeadline="סיכומי שיעורים"
                secondaryHeadline="להשלים שם מטופל"
            />
            <PatientRow
                pictureName="boyPic"
                picturePath="../boyPic.png"
                date="12.3.12"
                time="23:34"
                name="שם מטופל"
                isCenter
            />
            <div className={style.container}>
            <TextAreaComponent placeholderText=" ספר איך היה השיעור"></TextAreaComponent>
            <Checkbox></Checkbox> האם לאפשר להורה לצפות בשיעור?
            </div>
            <div className={style.submitButtonStyle}>
                <Button>הגש סיכום</Button>
            </div>
        </>
    );
}
