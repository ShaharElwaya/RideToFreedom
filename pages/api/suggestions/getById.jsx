import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Missing id parameter" });
    }
    try {
      const options = await sql`
            SELECT 
            s.id AS id,
            s.patient_id AS patient_id,
            s.guide_id AS guide_id, 
            s.suggestion AS suggestion, 
            s.date AS date,
            s.status AS status, 
            p.id AS patient_id,
            p.name AS patient_name,
            p.gender AS patient_gender,
            g.name AS guide_name
            FROM public.guide_suggestion_for_patient AS s
            JOIN public.patient AS p ON s.patient_id = p.id
            JOIN public.guide AS g ON s.guide_id = g.id
            WHERE s.id = ${id};`;
      if (options.rows.length === 0) {
        return res.status(404).json({ error: "Row not found" });
      }
      res.status(200).json(options.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end();
  }
}
