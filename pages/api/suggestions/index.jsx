// suggestions/index.jsx

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const options = await sql`SELECT 
            s.id AS id,
            s.patient_id AS patient_id,
            s.guide_id AS guide_id,
            s.suggestion AS suggestion,
            s.date AS date,
            s.status AS status,
            g.name AS guide_name,
            p.name AS patient_name
            FROM public.guide_suggestion_for_patient AS s
            JOIN public.guide AS g ON g.id=s.guide_id
            JOIN public.patient AS p ON p.id=s.patient_id
            WHERE s.status != 'הסתיים' 
            ORDER BY s.date;`;
      res.status(200).json(options.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end();
  }
}
