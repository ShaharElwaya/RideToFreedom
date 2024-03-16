// create.jsx

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { patientId, startDate, impression, bookedLessons } = req.body;
    try {
      if (!patientId || !startDate || !impression || !bookedLessons)
        return res.status(404).json({ error: "Missing parameters!" });

      const options =
        await sql`INSERT INTO public.special_treatment_plan (patient_id, start_date, impression, recommended_lessons)
        VALUES (${patientId}, ${startDate}, ${impression}, ${bookedLessons});`;

      return res.status(200).json(options.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end();
  }
}
