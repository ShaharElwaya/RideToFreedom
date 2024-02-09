import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import PicAndHeadlines from '@/components/UI/picAndheadline';
import SuggestionRow from '@/components/UI/specialProgramSuggestionRow';

export default function specialProgramSuggestionAll() {
  const [data, setData] = useState([])
  const [suggestions, setSuggestions] = useState([]);
  console.log("🚀 ~ specialProgramSuggestionAll ~ suggestions:", suggestions)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/suggestions');
        setIsLoading(false)
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length === 0) return

    const fetchNames = async () => {
      try {
        const suggestions = await Promise.all(data.map(async (item) => {
          const patientName = await getPatientName(item.patient_id);
          const guideName = await getGuideName(item.guide_id);
          return { ...item, patientName, guideName };
        }));
        setSuggestions(suggestions);
      } catch (error) {
        console.error('Error fetching names:', error);
      }
    };

    fetchNames();
  }, [data]);

  async function getPatientName(patientId) {
    try {
      const response = await fetch(`/api/lessonsSummaries/patientIdToName?patient_id=${encodeURIComponent(patientId)}`);
      const data = await response.json();
      return data.name;
    } catch (error) {
      console.error('Error fetching patient name:', error);
      return '';
    }
  }

  async function getGuideName(guideId) {
    try {
      const response = await axios.get('/api/lessonsSummaries/guideIdToName', {
        params: { id: guideId },
      });
      return response.data.name;
    } catch (error) {
      console.error('Error fetching guide name:', error);
      return '';
    }
  }

  const handleSetMeeting = async (e, suggestionToUpdate) => {
    e.stopPropagation()
    const body = {
      name: "Google I/O 2015",
      date: "2024-01-11T17:00:00-07:00",
      location: "800 Howard St., San Francisco, CA 94103",
      description: "A chance to hear more about Google\'s developer products.",
      users: [
        'mayavivi1412@gmail.com',
        'shahar.al22@gmail.com',
        'orreuven1243@gmail.com',
      ]
    };
  
    try {
      // Update the status to "wait for program" for the clicked suggestion
      const updatedSuggestion = { ...suggestionToUpdate, status: "wait for program" };
      const filteredSuggestions = suggestions.filter((suggestion) => suggestion.patient_id !== updatedSuggestion.patient_id)
      const newSuggestions = [...filteredSuggestions, updatedSuggestion]
      await axios.post('/api/suggestions/update', {id:updatedSuggestion.id, status:updatedSuggestion.status})
      
      setSuggestions(newSuggestions)
  
     await axios.post("/api/google", body);


    } catch (error) {
      console.error("Error setting meeting:", error);
    }
  };
  const content = () => {
    if (isLoading) return <div>טוען נתונים...</div>
    if (suggestions.length === 0) return <div>לא נמצאו המלצות...</div>
    return suggestions.map((suggestion) => (
      <div key={suggestion.id}>
        <SuggestionRow
          pictureName={suggestion.gender}
          picturePath={`../${suggestion.gender === 'F' ? 'boyPic' : 'girlPic'}.png`}
          patient_name={suggestion.patientName}
          patientId={suggestion.patient_id}
          guide_name={suggestion.guideName}
          date={suggestion.date}
          status={suggestion.status}
          suggestionId={suggestion.id}
          onSetMeeting={(e) => handleSetMeeting(e,suggestion)}
        />
      </div>
    ))
  }


  return (
    <>
      <PicAndHeadlines
        pictureName="specialProgramSuggestion"
        picturePath="../specialProgramSuggestion.png"
        primaryHeadline="הצעות תכניות טיפול מיוחדות"
        secondaryHeadline="כל ההצעות"
      />
      {content()}
    </>
  );
}
