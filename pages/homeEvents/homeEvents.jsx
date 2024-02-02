import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import PicAndHeadlines from '@/components/UI/picAndheadline';
import PatientRow from '@/components/UI/patientRow';
import style from '../../styles/summariesPatientLessons.module.css';
import { useRouter } from 'next/router';

export default function HomeEvents() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [addTime, setAddTime] = useState('');
  const [name, setName] = useState();
  const { patientId } = router.query;

  // Handle function to navigate to the specificSummary page
  const handleAdd = () => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Asia/Jerusalem", // Set the timezone to Israel
    });

    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      timeZone: "UTC",
      timeZone: "Asia/Jerusalem", // Set the timezone to Israel
    });

    const formattedDateTime = `${currentDate} ${currentTime}`;
    setAddTime(formattedDateTime);

    router.push(`/homeEvents/specificHomeEvent?time=${encodeURIComponent(formattedDateTime)}&patientId=${encodeURIComponent(patientId)}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/homeEvents/homeEvents', {
          params: { patient_id: patientId }, // Send patient_id as a query parameter
        });
        setEvents(data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    async function getPatientName() {
      try {
        if (router.query.patientId) {
          const response = await fetch(`../api/lessonsSummaries/patientIdToName?patient_id=${encodeURIComponent(router.query.patientId)}`);
          const data = await response.json();
          setName(data.name);
        }
      } catch (error) {
        console.error('Error fetching patient name:', error);
      }
    }

    fetchData();
    getPatientName();
  }, []); // Empty dependency array to run the effect only once on mount

  // Handle function to navigate to the specificSummaryWatch page with event.id
  const handleRowClick = (eventId) => {
    router.push(`/homeEvents/specificHomeEventWatch?eventId=${encodeURIComponent(eventId)}`);
  };

  return (
    <>
      <PicAndHeadlines
        pictureName="homeEvents"
        picturePath="../homeEvents.png"
        primaryHeadline="דיווח אירועים מהבית"
        secondaryHeadline={name ? name : 'No Name Data'}
      />
      <div className={style.addButtonStyle}>
        <Button onClick={handleAdd}>+ הוספת אירוע</Button>
      </div>
      {events.map((event) => (
        <div key={event.event_id} className={style.rowWrapper} onClick={() => handleRowClick(event.event_id)}>
          <PatientRow
            pictureName={event.type}
            picturePath={`../${event.patient_gender === 'F' ? 'girlPic' : 'boyPic'}.png`}
            date={event.formatted_date}
            time={event.formatted_time}
            name={event.parent_name}
          />
        </div>
      ))}
    </>
  );
}
