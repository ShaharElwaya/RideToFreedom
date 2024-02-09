import React, { useState } from 'react';
import PicAndHeadlines from '@/components/UI/picAndheadline';
import PatientRow from '@/components/UI/patientRow';
import style from '../../styles/summariesPatientLessons.module.css';
import TextAreaComponent from '@/components/UI/textAreaComponent';
import { Button } from '@mui/material';
import axios from 'axios';

export default function SpecialProgramSuggestion() {
  const [proposalText, setProposalText] = useState('');

  const handleProposalChange = (event) => {
    setProposalText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    const body = {
      suggestion:proposalText,
      patientId:11,
      guideId:14,
      date: new Date()
    }
    
    try {
      const response =await axios.post('/api/suggestions/saveSuggestion', body)
      console.log(response.data);
    } catch (error) {
      console.error('Error saving suggestion:', error.message);
    }
  };

  return (
    <div>
      <PicAndHeadlines
        pictureName="specialProgramSuggestion"
        picturePath="../specialProgramSuggestion.png"
        primaryHeadline="הצעה לתכנית טיפול מיוחדת"
      />

      <PatientRow
        pictureName="GenderPic"
        picturePath={`../girlPic.png`}
        date='12.12.12'
        name='guide'
        isCenter
      />

      <form onSubmit={handleSubmit}>
        <div className={style.container}>
          <TextAreaComponent
            placeholderText="* רשום את ההצעה לתכנית טיפול מיוחדת"
            value={proposalText}
            onChange={handleProposalChange}
            required
          />
        </div>
        <div className={style.submitButtonStyle}>
          <Button type='submit'>הגש הצעה</Button>
        </div>
      </form>

    </div>
  );
}
