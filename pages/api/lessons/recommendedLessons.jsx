// recommendedLessons.jsx

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { patient_id } = req.query;
      const options =
        await sql`SELECT * FROM public.recommended_lessons WHERE patient_id = ${patient_id};`;
      res.status(200).json(options.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end();
  }
}
