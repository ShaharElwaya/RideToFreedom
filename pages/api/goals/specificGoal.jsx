// specificGoal.jsx

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  const {
    summary,
    date,
    patientId,
    fieldType,
    destinationDateFormat,
    statusType,
  } = req.body;

  if (req.method === "POST") {
    try {
      const result = await sql`
        INSERT INTO public.goals(goal, setting_date, patient_id, field_id, status_id, destination_date)
        VALUES (${summary}, ${date}, ${patientId}, ${fieldType}, ${statusType}, ${destinationDateFormat})
        RETURNING *;`;

      const newGoal = result.rows[0];

      res.status(200).json({ goal: newGoal });
    } catch (error) {
      console.error("Error executing SQL query:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}
