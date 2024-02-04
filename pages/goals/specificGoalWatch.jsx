import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { Button, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers";
import PicAndHeadlines from '@/components/UI/picAndheadline';
import GoalRow from '@/components/UI/goalRow';
import style from '../../styles/summariesPatientLessons.module.css';
import TextAreaComponent from '@/components/UI/textAreaComponent';
import CustomizedDialogs from '@/components/dialog';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/loadingSpinner';

export default function SpecificGoalWatch() {
    const [goalsDetails, setGoalsDetails] = useState({
        patient_id: '',
        patient_name: '',
        summary: '',
        field_id: '',
        field_name: '',
        status_id: '',
        status_name: '',
        destination_date: '',
        setting_date: ''
    });
    const router = useRouter();
    const { goalId, index } = router.query;
    const [isLoading, setIsLoading] = useState(true); 

    const handleGoBack = () => {
        router.back();
    };

    const selectStyle = {
        width: '244px',
    };

    useEffect(() => {
        // Fetch lesson details based on lessonId from the URL
        const fetchGoalsDetails = async () => {
            try {
                const response = await axios.get("/api/goals/specificGoalWatch", {
                    params: { goal_id: goalId },
                });
                setGoalsDetails(response.data);
                setIsLoading(false); 
            } catch (error) {
                console.error('Error fetching lesson details:', error);
                setIsLoading(false); 
            }
        };

        fetchGoalsDetails();
    }, [goalId]);

    const handleClick = (goalId, index) => {
        router.push(`/goals/specificGoalEdit?goalId=${encodeURIComponent(goalId)}&index=${encodeURIComponent(index)}`);
    };

    return (
        <>
            {isLoading && <LoadingSpinner />} {/* Use LoadingSpinner component */}

            <div className={style.leftStyle}>
                <Button onClick={handleGoBack}> חזור &gt;</Button>
            </div>

            <PicAndHeadlines
                pictureName="goal"
                picturePath="../goal.png"
                primaryHeadline="קביעת מטרה"
                secondaryHeadline={goalsDetails.patient_name ? goalsDetails.patient_name : 'No Name Data'}
            />
            <GoalRow goal={`מטרה ${index}`} />
            <form>
                {/* Display other goal details in read-only mode */}
                <div className={style.container}>
                    <TextAreaComponent
                        placeholderText=" מה המטרה שתרצה להגדיר? *"
                        value={goalsDetails.summary}
                        disabled
                    />
                    <div className={style.container}>
                        <DatePicker
                            label="תאריך קביעת מטרה"
                            sx={{ width: 255 }}
                            value={dayjs(goalsDetails.setting_date)}
                            disabled
                        />
                        <DatePicker
                            label="תאריך יעד רצוי"
                            sx={{ width: 255 }}
                            value={dayjs(goalsDetails.destination_date)}
                            disabled
                        />

                    </div>
                    <FormControl className={style.rightStyle}>
                        <InputLabel id="fieldTypeLabel">תחום המטרה</InputLabel>
                        <Select
                            labelId="fieldTypeLabel"
                            id="fieldTypeId"
                            label="תחום המטרה"
                            value={goalsDetails.field_id}
                            disabled
                            style={selectStyle}
                        >
                            <MenuItem value={goalsDetails.field_id}>
                                {goalsDetails.field_name}
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl className={style.rightStyle}>
                        <InputLabel id="statusTypeLabel">סטטוס המטרה</InputLabel>
                        <Select
                            labelId="statusTypeLabel"
                            id="statusTypeId"
                            label="סטטוס המטרה"
                            value={goalsDetails.status_id}
                            disabled
                            style={selectStyle}
                        >
                            <MenuItem value={goalsDetails.status_id}>
                                {goalsDetails.status_name}
                            </MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className={style.centerStyle}>
                    <Button variant="contained" onClick={() => handleClick(goalId, index)}>עריכת מטרה</Button>
                </div>
            </form>
        </>
    );
}