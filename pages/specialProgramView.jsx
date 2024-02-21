import { Box, Card, Container, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SpecialProgramView() {
  const { query } = useRouter();
  const [programs, setPrograms] = useState([]);
  const [programLessons, setProgramLessons] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data: programs } = await axios.get("/api/specialProgram");
        const { data: lessons } = await axios.get(
          "/api/lessons/recommendedLessons"
        );
        const userPrograms = programs.filter(
          (item) => item.patient_id == query.patientId
        );

        const userProgramLessons = {};
        userPrograms.forEach((program) => {
          const programLessons = [];
          program.recommended_lessons.forEach((lessonId) => {
            const userLesson = lessons.find((lesson) => lesson.id === lessonId);
            programLessons.push(userLesson);
          });
          userProgramLessons[program.id] = programLessons;
        });
        setProgramLessons(userProgramLessons);
        setPrograms(userPrograms);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (query.patientId) {
      fetchPrograms();
    }
  }, [query]);

  return (
    <Container>
      <h1>צפייה בתוכניות טיפול</h1>
      {isLoading ? (
        <Typography>טוען נתונים...</Typography>
      ) : programs.length === 0 ? (
        <Typography>אין לך תוכניות!</Typography>
      ) : (
        <Box>
          {programs?.map((program) => (
            <Card key={program.id}>
              <Typography>
                תאריך התחלה: {new Date(program.start_date).toDateString()}
              </Typography>
              {programLessons[program.id].map((programLesson) => (
                <Box sx={{ marginBottom: 2 }} key={programLesson.id}>
                  <Typography>שם שיעור: {programLesson.lesson_name}</Typography>
                  <Typography>תדירות: {programLesson.frequency}</Typography>
                  <Typography>
                    כמות שיעורים: {programLesson.lesson_count}
                  </Typography>
                </Box>
              ))}
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}
