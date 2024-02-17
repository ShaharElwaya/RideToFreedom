import React, { useState, useEffect } from "react";
import { Paper, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import CustomizedDialogs from "@/components/dialog";
import TextAreaComponent from "@/components/UI/textAreaComponent";
import PatientRow from "@/components/UI/patientRow";
import style from "../styles/summariesPatientLessons.module.css";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import useCustomQuery from "@/utils/useCustomQuery";
import { userStore } from '@/stores/userStore';
import LoadingSpinner from "@/components/loadingSpinner";

export default function ViewForm() {
  const [formData, setFormData] = useState([]);
  const [parentName, setParentName] = useState("");
  const { query } = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [isDialogSuccessOpen, setIsDialogSuccessOpen] = useState(false);
  const [dialogSuccess, setDialogSuccess] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const router = useRouter();
  const { type, id } = userStore.getState(); 

  function formatDate(date) {
    const birthday = new Date (date);
    // Ensure the input is a valid Date object
    if (!(birthday instanceof Date) || isNaN(birthday)) {
      return "Invalid Date";
    }
  
    // Get day, month, and year components
    const day = birthday.getDate().toString().padStart(2, "0");
    const month = (birthday.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = birthday.getFullYear();
  
    // Concatenate components with "-"
    return `${day}-${month}-${year}`;
  };
  
  useEffect(() => {
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
  }, []);

  useCustomQuery(() => {
    const fetchData = async () => {
      try {
        const { data: formData } = await axios.get("/api/patient/getPatient", {
          params: { patient_id: query.patientId },
        });
        const { data: parentData } = await axios.get(
          `/api/parent/getParentById`,
          { params: { id: formData[0].parent_id } }
        );

        setParentName(parentData[0].name);
        setFormData(formData);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching form data:", error);
        setIsLoading(false);
      }
    };

    if (query.patientId) {
      fetchData();
    }
  }, [query.patientId]);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setComment("");
  };

  const handleSaveComment = async () => {
    try {
      if (!comment.trim()) {
        setDialogError("התגובה אינה יכולה להיות ריקה");
        setIsDialogOpen(true);
        return;
      }

      setIsSaving(true);

      // Save the comment to the database
      await axios.post("/api/introMeeting/addComment", {
        comment,
        patient_id: query.patientId, // Send data in request body
      });

      // Fetch updated comments after saving the comment
      const response = await axios.get(
        `/api/introMeeting/getComments?patient_id=${query.patientId}`
      );
      setComments(response.data);

      // Close the comment dialog
      handleCloseDialog();

      // Open the success dialog
      setDialogSuccess("התגובה נשמרה בהצלחה");
      setIsDialogSuccessOpen(true);
    } catch (error) {
      console.error("Error saving comment:", error);

      // Handle error
      setDialogError("אירעה שגיאה בעת שמירת התגובה");
      setIsDialogOpen(true);
      setIsDialogSuccessOpen(false); // Close the success dialog if there was an error
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Fetch comments for the specific patient
        const response = await axios.get(
          `/api/introMeeting/getComments?patient_id=${query.patientId}`
        );
        setComments(response.data); // Set comments

        if (response.data.length > 0) {
          setShowComments(true); // Show comments section if there are comments
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setIsLoading(false);
      }
    };

    if (query.patientId) {
      fetchComments(); // Fetch comments when component mounts
    }
  }, [query.patientId]);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
    {isLoading && <LoadingSpinner />}
    <div style={{ height: "90vh" }}>
      <div className={style.leftStyle}>
        <Button onClick={handleGoBack}> חזור &gt;</Button>
      </div>
      <PicAndHeadlines
        pictureName="introduction"
        picturePath="../introduction.png"
        primaryHeadline="פרטי פגישת היכרות"
      />
      <div className={style.container}>
        {formData.map((data, index) => (
          <Paper key={index} style={{ padding: "20px", marginBottom: "20px" }}>
            <Typography>
              <strong> שם ההורה:</strong> {parentName}
            </Typography>
            <Typography>
              <strong>שם הילד:</strong> {data.name}
            </Typography>
            <Typography>
              <strong>כתובת:</strong> {data.address}
            </Typography>
            <Typography>
              <strong>יום הולדת:</strong> {formatDate(data.birthday)}
            </Typography>
            <Typography>
              <strong>מין:</strong> {data.gender === "M" ? "זכר" : "נקבה"}
            </Typography>
            <Typography>
              <strong>סיבת בקשה:</strong> {data.reason_for_request}
            </Typography>
          </Paper>
        ))}
      </div>
      {showComments && ( // Render comments section only if there are comments
        <div className={style.container}>
          <h4>תגובות:</h4>
          {isLoading ? (
            <p>Loading comments...</p>
          ) : (
            comments.map((comment, index) => (
              <PatientRow
                key={index}
                pictureName="guidePic"
                picturePath="/guide.webp"
                lesson={comment}
                hasBottomBorder={true}
              />
            ))
          )}
        </div>
      )}
      {type !== 1 && (
        <div className="submitButtonStyle">
          <Button variant="contained" onClick={handleOpenDialog}>
            הוספת תגובה
          </Button>
        </div>
      )}

      {/* Comment Dialog */}
      {type !== 1 && ( // Render the comment dialog only if userType is not 1
        <CustomizedDialogs
          title="הוספת תגובה"
          text={
            <React.Fragment>
              <TextAreaComponent
                placeholderText="הוספת תגובה"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              {dialogError && (
                <Typography color="error" variant="body2">
                  {dialogError}
                </Typography>
              )}
            </React.Fragment>
          }
          open={isDialogOpen}
          onClose={handleCloseDialog}
          actions={[
            <Button key="cancelButton" onClick={handleCloseDialog}>
              ביטול
            </Button>,
            <Button
              key="saveButton"
              autoFocus
              onClick={handleSaveComment}
              variant="contained"
              disabled={isSaving}
            >
              שמירה
            </Button>,
          ]}
        />
      )}

      {/* Success Dialog */}
      <CustomizedDialogs
        title="הוספת התגובה הושלמה"
        text={dialogSuccess}
        open={isDialogSuccessOpen}
        onClose={() => setIsDialogSuccessOpen(false)}
        actions={[
          <Button
            key="confirmButton"
            autoFocus
            onClick={() => setIsDialogSuccessOpen(false)}
          >
            הבנתי
          </Button>,
        ]}
      />
    </div>
    </>
  );
}
