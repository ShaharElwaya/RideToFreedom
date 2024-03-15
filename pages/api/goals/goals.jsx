// goals.jsx

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Get the patient_id from the query parameters
      const { patient_id } = req.query;

      // Fetch data from the 'lessons' table for the specific patient
      const result = await sql`
      SELECT 
      g.id AS id,
      TO_CHAR(g.setting_date, 'DD-MM-YYYY') AS setting_date,
      g.goal AS goal,
      TO_CHAR(g.destination_date, 'DD-MM-YYYY') AS destination_date, 
      g.patient_id AS patient_id, 
      g.field_id AS field_id, 
      g.status_id AS status_id,
      gf.field AS field,
      s.status AS status
      FROM public.goals AS g
      JOIN enums.statuses AS s ON g.status_id = s.id
      JOIN enums.goals_fields AS gf ON g.field_id = gf.id
      WHERE g.patient_id = ${patient_id}
      ORDER BY g.setting_date;
      `;

      const goals = result.rows;

      res.status(200).json(goals);
    } catch (error) {
      console.error("Error executing SQL query:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
