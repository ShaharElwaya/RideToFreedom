import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import PicAndHeadlines from '@/components/UI/picAndheadline';
import PatientRow from '@/components/UI/patientRow';
import style from '../../styles/summariesPatientLessons.module.css';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/loadingSpinner';
import { userStore } from '@/stores/userStore';
import useCustomQuery from "@/utils/useCustomQuery";

export default function HomeEvents() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [addTime, setAddTime] = useState('');
  const [name, setName] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { patientId } = router.query;
  const { type, id } = userStore.getState(); 

  // Handle function to navigate to the specificSummary page
  const handleAdd = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Asia/Jerusalem', // Set the timezone to Israel
    });

    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      timeZone: 'UTC',
      timeZone: 'Asia/Jerusalem', // Set the timezone to Israel
    });

    const formattedDateTime = `${currentDate} ${currentTime}`;
    setAddTime(formattedDateTime);

    router.push(`/homeEvents/specificHomeEvent?time=${encodeURIComponent(formattedDateTime)}&patientId=${encodeURIComponent(patientId)}`);
  };

  useCustomQuery(() => {
    // Keep track of completion status for each fetch operation
    let isEventsLoaded = false;
    let isPatientNameLoaded = false;

    const fetchData = async () => {
        try {
            const { data } = await axios.get('/api/homeEvents/homeEvents', {
                params: { patient_id: patientId }, // Send patient_id as a query parameter
            });
            setEvents(data);
            isEventsLoaded = true;
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
                isPatientNameLoaded = true;
            }
        } catch (error) {
            console.error('Error fetching patient name:', error);
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
    Promise.all([fetchData(), getPatientName()])
        .then(() => {
            // Set isLoading to false when all data is fetched
            setIsLoading(false);
        })
        .catch((error) => {
            console.error('Error during data fetching:', error);
            setIsLoading(false);
        });

}, []);

  // Handle function to navigate to the specificSummaryWatch page with event.id
  const handleRowClick = (eventId) => {
    router.push(`/homeEvents/specificHomeEventWatch?eventId=${encodeURIComponent(eventId)}`);
  };

  const handleGoBack = () => {
    router.push(`/personalMenu?patientId=${encodeURIComponent(patientId)}&name=${encodeURIComponent(name)}`);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />} {/* Use LoadingSpinner component */}

      <div className={style.leftStyle}>
        <Button onClick={handleGoBack}> חזור &gt;</Button>
      </div>

      <PicAndHeadlines
        pictureName="homeEvents"
        picturePath="../homeEvents.png"
        primaryHeadline="דיווח אירועים מהבית"
        secondaryHeadline={name ? name : 'No Name Data'}
      />
      {type == 1 && (
        <div className={style.addButtonStyle}>
          <Button onClick={handleAdd}>+ הוספת אירוע</Button>
        </div>
      )}
      <div className={style.rowWrapperContainer}>
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
      </div>
    </>
  );
}
