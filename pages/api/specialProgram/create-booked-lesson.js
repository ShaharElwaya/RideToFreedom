import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { patientId, type, number, frequency } = req.body;
    try {
      const options =
        await sql`INSERT INTO public.recommended_lessons (patient_id, lesson_name, lesson_count, frequency)
        VALUES (${patientId}, ${type}, ${number}, ${frequency})
        RETURNING id;`;
        
      res.status(200).json(options.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end();
  }
}
