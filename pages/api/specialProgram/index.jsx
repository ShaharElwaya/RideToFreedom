// specialProgram/index.jsx

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { patient_id } = req.query;
      const options = await sql`SELECT 
            s.id AS id, 
            s.start_date AS start_date, 
            s.impression AS impression,
            p.name AS patient_name
             FROM public.special_treatment_plan AS s
             JOIN public.patient AS p ON p.id = s.patient_id
             WHERE patient_id = ${patient_id};`;
      res.status(200).json(options.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end();
  }
}
