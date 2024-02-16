import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { DateTime } from 'luxon';
import { Typography, Button, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers";
import PicAndHeadlines from '@/components/UI/picAndheadline';
import GoalRow from '@/components/UI/goalRow';
import style from '../../styles/summariesPatientLessons.module.css';
import TextAreaComponent from '@/components/UI/textAreaComponent';
import CustomizedDialogs from '@/components/dialog';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/loadingSpinner';
import useCustomQuery from "@/utils/useCustomQuery";
import useMediaQuery from '@mui/material/useMediaQuery'; 

export default function SpecificGoal() {
    const [summary, setSummary] = useState('');
    const [statusesOptions, setStatusesOptions] = useState([]);
    const [fieldsOptions, setFieldsOptions] = useState([]);
    const [fieldType, setFieldType] = useState('');
    const [statusType, setStatusType] = useState(1);
    const [dialogError, setDialogError] = useState('');
    const [isLoading, setIsLoading] = useState(true); 
    const [destinationDate, setDestinationDate] = useState(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [name, setName] = useState();
    const router = useRouter();
    const { time } = router.query;
    const { patientId } = router.query;
    const [isSaving, setIsSaving] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width: 600px)');

    const date = time ? new Date(time).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }) : '';

    const handleCloseDialog = () => {
        setDialogOpen(false);

        if (saveSuccess) {
            router.push(`/goals/goals?patientId=${encodeURIComponent(patientId)}`);
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    const handleClickSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!summary.trim()) {
                setDialogError("המטרה אינה יכולה להיות ריקה");
                setDialogOpen(true);
                return;
            }
            else if (!fieldType) {
                setDialogError("יש לבחור תחום למטרה");
                setDialogOpen(true);
                return;
            }
            else if (!statusType) {
                setDialogError("יש לבחור סטטוס למטרה");
                setDialogOpen(true);
                return;
            }
            else if (!destinationDate) {
                setDialogError("יש לבחור תאריך יעד רצוי");
                setDialogOpen(true);
                return;
            }
            
            const destinationDateFormat = destinationDate ? destinationDate.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }) : '';

            setIsSaving(true);
            
            const res = await axios.post("../api/goals/specificGoal", {
                date,
                summary,
                patientId,
                fieldType,
                destinationDateFormat,
                statusType
            });
            setDialogError('');
            setSaveSuccess(true);
            setDialogOpen(true);
        } catch (err) {
            let errorMessage = "We have a problem, try again";

            if (err.response && err.response.data && err.response.data.error) {
                errorMessage = `Add lesson failed: ${err.response.data.error}`;
            }

            setSaveSuccess(false);
            setDialogOpen(true);
            setDialogError(errorMessage);
        } finally {
            setIsSaving(false);
          }
    };

    useCustomQuery(() => {
        // Keep track of completion status for each fetch operation
        let isStatusesLoaded = false;
        let isFieldsLoaded = false;
        let isPatientNameLoaded = false;
    
        async function getPatientName() {
            try {
                if (router.query.patientId) {
                    const response = await fetch(`../api/lessonsSummaries/patientIdToName?patient_id=${encodeURIComponent(router.query.patientId)}`);
                    const data = await response.json();
                    console.log('Patient Name Data:', data);
                    setName(data.name);
                    isPatientNameLoaded = true;
                }
            } catch (error) {
                console.error('Error fetching patient name:', error);
            }
        }
    
        async function fetchStatusesOptions() {
            try {
                const response = await fetch('../api/goals/statusesOptions');
                const data = await response.json();
                setStatusesOptions(data);
                isStatusesLoaded = true;
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        }
    
        async function fetchFieldsOptions() {
            try {
                const response = await fetch('../api/goals/fieldsOptions');
                const data = await response.json();
                setFieldsOptions(data);
                isFieldsLoaded = true;
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        }

        async function checkPremission() {
            try {
              if (type === 1) {
                // Fetch comments for the specific lessonId
                const response = await axios.get(`/api/login/childrens?id=${id}`);
                let isOk = false;
                
                for(let i = 0; i < response.data.length && !isOk; i++) {
                  if(response.data[i].id == patientId){
                    isOk = true;
                  }
                }
      
                if (isOk == false) {
                  router.back(); // Use await to wait for the navigation to complete
                }
              }
            } catch (error) {
              console.error("Error checking permission:", error);
            }
          }    
      
          checkPremission();
    
        // Use Promise.all to wait for all asynchronous operations to complete
        Promise.all([getPatientName(), fetchStatusesOptions(), fetchFieldsOptions()])
            .then(() => {
                // Set isLoading to false when all data is fetched
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error during data fetching:', error);
                setIsLoading(false);
            });
    
    }, []);
    
    const handleSelectChangeField = (event) => {
        setFieldType(event.target.value);
    };

    const handleSelectChangeStatus = (event) => {
        setStatusType(event.target.value);
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
                secondaryHeadline={name ? name : 'No Name Data'}
            />
            <GoalRow goal={"מטרה חדשה "}/>
            <form>
                <div className={style.container}>
                    <TextAreaComponent
                        placeholderText=" מה המטרה שתרצה להגדיר? *"
                        value={summary}
                        required
                        onChange={(e) => setSummary(e.target.value)}
                    />
                </div>
                <div className={style.container}>
                    <DatePicker
                            label="תאריך קביעת מטרה"
                            sx={{ width: isSmallScreen ? '50%' : '255px', }}
                            value={dayjs(date)}
                            disabled
                    />
                    <DatePicker
                        label="תאריך יעד רצוי *"
                        sx={{ width: isSmallScreen ? '50%' : '255px', }}
                        value={destinationDate}
                        required
                        onChange={(v) => setDestinationDate(new Date(v))}
                    />
                </div>
                <div className={style.container}>
                    <FormControl className={style.rightStyleGoal}>
                        <InputLabel id="selectUsersTypes">תחום המטרה *</InputLabel>
                        <Select
                            labelId="selectUsersTypes"
                            id="selectUsersTypesId"
                            label="תחום המטרה"
                            value={fieldType}
                            onChange={handleSelectChangeField}
                            required
                            sx={{ width: isSmallScreen ? "93%" : "95%" }}
                        >
                            {fieldsOptions.map(option => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.field}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl className={style.rightStyleGoal}>
                        <InputLabel id="selectUsersTypes">סטטוס המטרה *</InputLabel>
                        <Select
                            labelId="selectUsersTypes"
                            id="selectUsersTypesId"
                            label="סטטוס המטרה"
                            value={statusType}
                            onChange={handleSelectChangeStatus}
                            required
                            sx={{ width: isSmallScreen ? "93%" : "95%" }}
                        >
                            {statusesOptions.map(option => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.status}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className={style.submitButtonStyle}>
                    <Button type='submit' disabled={isSaving} variant="contained" onClick={handleClickSubmit}>קבע מטרה</Button>
                </div>
            </form>

            <CustomizedDialogs
                title={dialogError ? "הוספת המטרה נכשלה" : "הוספת המטרה הושלמה"}
                text={dialogError ? dialogError : ""}
                open={dialogOpen}
                onClose={handleCloseDialog}
                actions={[
                    <Button key="confirmButton" autoFocus onClick={handleCloseDialog}>
                      הבנתי
                    </Button>,
                  ]}
            />
        </>
    );
}
