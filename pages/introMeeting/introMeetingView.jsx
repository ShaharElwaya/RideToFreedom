// introMeetingView.jsx

import React, { useState, useEffect } from "react";
import { Paper, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import CustomizedDialogs from "@/components/dialog";
import TextAreaComponent from "@/components/UI/textAreaComponent";
import PatientRow from "@/components/UI/patientRow";
import style from "../../styles/generalStyle.module.css";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import useCustomQuery from "@/utils/useCustomQuery";
import { userStore } from "@/stores/userStore";
import LoadingSpinner from "@/components/loadingSpinner";
import Nevigation from "@/components/nevigation";

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
  const { patientId } = router.query;
  const [commentBeingEdited, setCommentBeingEdited] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  const [isDialogEditOpen, setIsDialogEditOpen] = useState(false);

  function formatDate(date) {
    const birthday = new Date(date);
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
  }

  useEffect(() => {
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
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

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
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    const fetchDataAndComments = async () => {
      await Promise.all([fetchData(), fetchComments()]);
      setIsLoading(false);
    };

    if (query.patientId) {
      fetchDataAndComments();
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
        patient_id: query.patientId,
        guide_id: id, // Send data in request body
      });

      // Fetch updated comments after saving the comment
      const response = await axios.get(
        `/api/introMeeting/getComments?patient_id=${query.patientId}`
      );
      setComments(response.data);
      setShowComments(true);

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

  const handleGoBack = () => {
    router.back();
  };

  const handleEditClick = (comment) => {
    // Only allow the owner of the comment to edit it
    if (comment.guide_id === id) {
      setEditedComment(comment.comment);
      setCommentBeingEdited(comment);
      setIsDialogEditOpen(true);
    }
  };

  const handleCloseEditDialog = () => {
    setEditedComment("");
    setIsDialogEditOpen(false);
    setDialogError("");
    setCommentBeingEdited(null);
  };

  const handleUpdateComment = async () => {
    try {
      if (!editedComment.trim()) {
        setDialogError("התגובה אינה יכולה להיות ריקה");
        setIsDialogEditOpen(true);
        return;
      }

      setIsSaving(true);

      // Save the comment to the database
      await axios.post("/api/introMeeting/updateComment", {
        id: commentBeingEdited.id,
        comment: editedComment,
      });

      // Fetch updated comments after saving the comment
      const response = await axios.get(
        `/api/introMeeting/getComments?patient_id=${query.patientId}`
      );
      setComments(response.data);

      // Close the comment dialog
      handleCloseEditDialog();

      // Open the success dialog
      setDialogSuccess("התגובה נשמרה בהצלחה");
      setIsDialogSuccessOpen(true);
    } catch (error) {
      console.error("Error saving comment:", error);

      // Handle error
      setDialogError("אירעה שגיאה בעת שמירת התגובה");
      setIsDialogEditOpen(true);
      setIsDialogSuccessOpen(false); // Close the success dialog if there was an error
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteComment = async () => {
    try {
      setIsSaving(true);

      // Save the comment to the database
      await axios.post("/api/introMeeting/deleteComment", {
        id: commentBeingEdited.id,
      });

      // Fetch updated comments after saving the comment
      const response = await axios.get(
        `/api/introMeeting/getComments?patient_id=${query.patientId}`
      );
      setComments(response.data);

      if (response.data.length == 0) {
        setShowComments(false);
      }

      // Close the comment dialog
      handleCloseEditDialog();

      // Open the success dialog
      setDialogSuccess("התגובה נמחקה בהצלחה");
      setIsDialogSuccessOpen(true);
    } catch (error) {
      console.error("Error saving comment:", error);

      // Handle error
      setDialogError("אירעה שגיאה בעת מחיקת התגובה");
      setIsDialogEditOpen(true);
      setIsDialogSuccessOpen(false); // Close the success dialog if there was an error
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div>
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
            <Paper
              key={index}
              style={{ padding: "20px", marginBottom: "20px" }}
            >
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
                <p
                  onClick={() => handleEditClick(comment)}
                  title={comment.guide_id === id ? "Click to edit" : undefined}
                >
                  <PatientRow
                    key={index}
                    pictureName="guidePic"
                    picturePath="/guide.webp"
                    lesson={comment.comment}
                    hasBottomBorder={true}
                    canEdit={comment.guide_id === id}
                  />
                </p>
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
          title="שמירת תגובה"
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
        {/* Comment Dialog */}
        <CustomizedDialogs
          title="עריכת תגובה"
          text={
            <React.Fragment>
              <TextAreaComponent
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                required
              />
              {dialogError && (
                <Typography color="error" variant="body2">
                  {dialogError}
                </Typography>
              )}
            </React.Fragment>
          }
          open={isDialogEditOpen}
          onClose={handleCloseEditDialog}
          actions={[
            <Button key="cancelButton" onClick={() => handleDeleteComment()}>
              מחיקה
            </Button>,
            <Button
              key="saveButton"
              autoFocus
              onClick={() => handleUpdateComment()}
              variant="contained"
              disabled={isSaving}
            >
              שמירה
            </Button>,
          ]}
        />
      </div>
      <Nevigation patientId={patientId} screen="introMeetingView" />
    </>
  );
}
