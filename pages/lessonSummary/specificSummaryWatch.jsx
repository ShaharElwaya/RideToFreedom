import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Checkbox, Typography } from "@mui/material";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import PatientRow from "@/components/UI/patientRow";
import style from "../../styles/summariesPatientLessons.module.css";
import TextAreaComponent from "@/components/UI/textAreaComponent";
import CustomizedDialogs from "@/components/dialog";
import LoadingSpinner from "@/components/loadingSpinner";
import { useRouter } from "next/router";
import { userStore } from "@/stores/userStore";

export default function SpecificSummaryWatch() {
  const [lessonDetails, setLessonDetails] = useState({});
  const router = useRouter();
  const { lessonId } = router.query;
  const [parentPermission, setParentPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [isDialogSuccessOpen, setIsDialogSuccessOpen] = useState(false);
  const [dialogSuccess, setDialogSuccess] = useState("");
  const [comment, setComment] = useState("");
  const { type, id } = userStore.getState();
  const [comments, setComments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setComment(""); // Clear the comment when the dialog is closed
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
      await axios.post("/api/lessonsSummaries/addComment", {
        lessonId,
        comment,
        id,
        type,
      });

      // Fetch updated comments after saving the comment
      const commentsResponse = await axios.get(
        `/api/lessonsSummaries/getComments?lesson_id=${lessonId}`
      );
      setComments(commentsResponse.data);

      // Close the comment dialog
      handleCloseDialog();

      // Open the success dialog
      setDialogSuccess("התגובה נשמרה בהצלחה");
      setIsDialogSuccessOpen(true);
    } catch (error) {
      console.error("Error saving comment:", error);

      // Open the failure dialog only if there's an actual error
      if (error.response && error.response.data && error.response.data.error) {
        setDialogError(
          `אירעה שגיאה בעת שמירת התגובה: ${error.response.data.error}`
        );
        setIsDialogOpen(true);
        setIsDialogSuccessOpen(false); // Close the success dialog if there was an error
      } else {
        // If it's not an error from the server, it might be a network issue
        setDialogError("אירעה שגיאה בעת שמירת התגובה");
        setIsDialogOpen(true);
        setIsDialogSuccessOpen(false); // Close the success dialog if there was an error
      }
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Fetch lesson details based on lessonId from the URL
    const fetchLessonDetails = async () => {
      try {
        const response = await axios.get(
          "/api/lessonsSummaries/specificSummaryWatch",
          {
            params: { lesson_id: lessonId },
          }
        );
        setLessonDetails(response.data);
        setParentPermission(response.data.parent_permission);

        if (type == 1 && !response.data.parent_permission) {
          // Redirect to the desired route for unauthorized users
          router.push(
            `/lessonSummary/summariesPatientLessons?patientId=${response.data.patient_id}`
          );
        }

        const fetchComments = async () => {
          try {
            // Fetch comments for the specific lessonId
            const response = await axios.get(
              `/api/lessonsSummaries/getComments?lesson_id=${lessonId}`
            );
            setComments(response.data);
            setIsLoading(false);
          } catch (error) {
            console.error("Error fetching comments:", error);
          }
        };

        fetchComments();

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching lesson details:", error);
      }
    };

    fetchLessonDetails();
  }, [lessonId]);

  return (
    <>
      {isLoading && <LoadingSpinner />}

      <div className={style.leftStyle}>
        <Button onClick={handleGoBack}> חזור &gt;</Button>
      </div>

      <PicAndHeadlines
        pictureName="lessonSummary"
        picturePath="../lessonSummary.png"
        primaryHeadline="סיכומי שיעורים"
        secondaryHeadline={
          lessonDetails.patient_name ? lessonDetails.patient_name : ""
        }
      />
      <PatientRow
        pictureName="GenderPic"
        picturePath={`../${
          lessonDetails.gender === "F" ? "girlPic" : "boyPic"
        }.png`}
        date={lessonDetails.formatted_date}
        time={lessonDetails.formatted_time}
        name={lessonDetails.guide_name}
        lesson={lessonDetails.lesson_type_name}
        isCenter
      />
      <div className={style.containerCommenrs}>
        <TextAreaComponent
          placeholderText=" ספר איך היה השיעור *"
          value={lessonDetails.summary}
          required
          disabled
        />
        {type !== 1 && (
          <div>
            <Checkbox checked={parentPermission} disabled />
            האם לאפשר להורה לצפות בשיעור?
          </div>
        )}
        {comments.length > 0 && (
          <div>
            <h4>תגובות:</h4>
            {isLoading ? (
              <p>Loading comments...</p>
            ) : (
              comments.map((comment) => (
                <PatientRow
                  pictureName="commentPic"
                  picturePath={
                    comment.user_type === 1 ? "/parent.png" : "/guide.webp"
                  }
                  name={comment.name}
                  lesson={comment.comment}
                  hasBottomBorder={true}
                  maxLessonTextLength={50}
                />
              ))
            )}
          </div>
        )}
      </div>
      <div className={style.submitButtonStyle}>
        <Button variant="contained" onClick={handleOpenDialog}>
          הוספת תגובה
        </Button>
      </div>

      {/* Comment Dialog */}
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
    </>
  );
}
