import { useState, useEffect } from "react";
import axios from "axios";
import { Button, FormControl, InputLabel, Select, TextField, MenuItem, Typography } from "@mui/material";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import PatientRow from "@/components/UI/patientRow";
import style from "../../styles/summariesPatientLessons.module.css";
import { useRouter } from "next/router";
import LoadingSpinner from "@/components/loadingSpinner";
import { userStore } from "@/stores/userStore";
import useCustomQuery from "@/utils/useCustomQuery";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function HomeEvents() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [addTime, setAddTime] = useState("");
  const [name, setName] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { patientId } = router.query;
  const { type, id } = userStore.getState();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  // Filter state
  const [filters, setFilters] = useState({
    selectedParents: [],
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
  });
  const [parents, setParents] = useState([]);

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

    router.push(
      `/homeEvents/specificHomeEvent?time=${encodeURIComponent(
        formattedDateTime
      )}&patientId=${encodeURIComponent(patientId)}`
    );
  };

  useCustomQuery(() => {
    // Keep track of completion status for each fetch operation
    let isEventsLoaded = false;
    let isPatientNameLoaded = false;

    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/homeEvents/homeEvents", {
          params: { patient_id: patientId }, // Send patient_id as a query parameter
        });
        setEvents(data);
        isEventsLoaded = true;

        // Extract unique guide names and lesson types from the lessons array
        const uniqueParents = [
          ...new Set(data.map((lesson) => lesson.parent_name)),
        ];

        // Set the extracted values to the state
        setParents(uniqueParents);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    async function getPatientName() {
      try {
        if (router.query.patientId) {
          const response = await fetch(
            `../api/lessonsSummaries/patientIdToName?patient_id=${encodeURIComponent(
              router.query.patientId
            )}`
          );
          const data = await response.json();
          setName(data.name);
          isPatientNameLoaded = true;
        }
      } catch (error) {
        console.error("Error fetching patient name:", error);
      }
    }

    async function checkPremission() {
      try {
        if (type === 1) {
          // Fetch comments for the specific lessonId
          const response = await axios.get(`/api/login/childrens?id=${id}`);
          let isOk = false;

          for (let i = 0; i < response.data.length && !isOk; i++) {
            if (response.data[i].id == patientId) {
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
        console.error("Error during data fetching:", error);
        setIsLoading(false);
      });
  }, []);

  // Handle function to navigate to the specificSummaryWatch page with event.id
  const handleRowClick = (eventId) => {
    router.push(
      `/homeEvents/specificHomeEventWatch?eventId=${encodeURIComponent(
        eventId
      )}`
    );
  };

  const handleGoBack = () => {
    router.push(
      `/personalMenu?patientId=${encodeURIComponent(
        patientId
      )}&name=${encodeURIComponent(name)}`
    );
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const formatDateFilter = (date) => {
    // Display date in "YYYY-MM-DD" format for consistency
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };

  const isDateMatch = (lessonDate, lessonTime) => {
    if (
      !filters.startDate &&
      !filters.endDate &&
      !filters.startTime &&
      !filters.endTime
    ) {
      return true; // No date filter applied, consider it a match
    }

    const formatLessonDate = formatDateFilter(lessonDate);
    if (filters.startDate && filters.endDate) {
      if (!filters.startTime && !filters.endTime) {
        return (
          formatLessonDate >= filters.startDate &&
          formatLessonDate <= filters.endDate
        );
      } else if (filters.startTime && filters.endTime) {
        if (
          formatLessonDate == filters.startDate &&
          formatLessonDate == filters.endDate
        ) {
          if (
            lessonTime >= filters.startTime &&
            lessonTime <= filters.endTime
          ) {
            return true;
          }
        } else if (
          (formatLessonDate == filters.startDate &&
            lessonTime >= filters.startTime) ||
          (formatLessonDate == filters.endDate && lessonTime <= filters.endTime)
        ) {
          return true;
        }
        return (
          formatLessonDate > filters.startDate &&
          formatLessonDate < filters.endDate
        );
      } else if (filters.startTime) {
        if (formatLessonDate == filters.startDate) {
          if (lessonTime >= filters.startTime) {
            return true;
          }
        } else {
          return (
            formatLessonDate > filters.startDate &&
            formatLessonDate <= filters.endDate
          );
        }
      } else if (filters.endTime) {
        if (formatLessonDate == filters.endDate) {
          if (lessonTime <= filters.endTime) {
            return true;
          }
        } else {
          return (
            formatLessonDate > filters.startDate &&
            formatLessonDate <= filters.endDate
          );
        }
      }
    } else if (filters.startDate) {
      if (formatLessonDate == filters.startDate && filters.startTime) {
        return (
          formatLessonDate >= filters.startDate &&
          lessonTime >= filters.startTime
        );
      } else {
        return formatLessonDate >= filters.startDate;
      }
    } else if (filters.endDate) {
      if (formatLessonDate == filters.endDate && filters.endTime) {
        return (
          formatLessonDate <= filters.endDate && lessonTime <= filters.endTime
        );
      } else {
        return formatLessonDate <= filters.endDate;
      }
    }

    return false; // Should not reach here
  };

  const filteredEvents = events.filter((event) => {
    const isParentMatch =
      filters.selectedParents.length === 0 ||
      filters.selectedParents.includes(event.parent_name);

    const isDateMatchFilter = isDateMatch(
      event.formatted_date,
      event.formatted_time
    );

    return isParentMatch && isDateMatchFilter;
  });

  const selectStyle = {
    textAlign: "right",
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
        secondaryHeadline={name ? name : "No Name Data"}
      />      
      <div className={style.rightStyle}>
      <div className="container">
        <b>סננים: </b>
        {Object.values(filters).some((value) => value) && (
          <Button
            color="secondary"
            onClick={() =>
              setFilters({
                selectedParents: [],
                startDate: null,
                endDate: null,
                startTime: null,
                endTime: null,
              })
            }
          >
            איפוס סננים
          </Button>
        )}
        <Typography style={{ fontSize: "12px", marginRight: "6px" }}>
            בסינון הורה ניתן לבחור כמה ערכים מהרשימה, ניתן לסנן שעה
            רק לאחר בחירת תאריך
          </Typography>
      </div>
      {/* Filter Controls */}
      <FormControl className={style.filterInput}>
        <InputLabel>הורה</InputLabel>
        <Select
          sx={{ width: isSmallScreen ? "150px" : "200px" }}
          style={selectStyle}
          label="הורה"
          multiple
          value={filters.selectedParents}
          onChange={(e) =>
            handleFilterChange("selectedParents", e.target.value)
          }
          variant="outlined"
        >
          {/* Replace with the actual list of lesson types */}
          {parents.map((parent) => (
            <MenuItem key={parent} value={parent}>
              {parent}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        sx={{ width: isSmallScreen ? "162px" : "210px" }}
        label="מתאריך"
        type="date"
        value={filters.startDate || ""}
        onChange={(e) => handleFilterChange("startDate", e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        sx={{ width: isSmallScreen ? "162px" : "210px" }}
        label="עד תאריך"
        type="date"
        value={filters.endDate || ""}
        onChange={(e) => handleFilterChange("endDate", e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        sx={{ width: isSmallScreen ? "162px" : "120px" }}
        label="משעה"
        type="time"
        value={filters.startTime || ""}
        onChange={(e) => handleFilterChange("startTime", e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        disabled={!filters.startDate}
      />
      <TextField
        sx={{ width: isSmallScreen ? "162px" : "120px" }}
        label="עד שעה"
        type="time"
        value={filters.endTime || ""}
        onChange={(e) => handleFilterChange("endTime", e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        disabled={!filters.endDate}
      />
      </div>
      {type == 1 && (
        <div className={style.addButtonStyle}>
          <Button onClick={handleAdd}>+ הוספת אירוע</Button>
        </div>
      )}
      <div className={style.rowWrapperContainer}>
        {/* Display filtered lessons */}
        {!isLoading &&
          filteredEvents.map((event) => (
            <div
              key={event.event_id}
              className={style.rowWrapper}
              onClick={() => handleRowClick(event.event_id)}
            >
              <PatientRow
                pictureName={event.type}
                picturePath={`../${
                  event.patient_gender === "F" ? "girlPic" : "boyPic"
                }.png`}
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
