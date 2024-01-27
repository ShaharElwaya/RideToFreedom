import { sql } from '@vercel/postgres';

// Handler
export default async function handler(req, res) {
  const { summary, date, patientId, guideId, parentPermission, lessonType } = req.body;

  if (req.method === 'POST') {
    try {
      const result = await sql`
        INSERT INTO public.lessons(summary, date, type, patient_id, guide_id, parent_permission)
        VALUES (${summary}, ${date}, ${lessonType}, ${patientId}, ${guideId}, ${parentPermission})
        RETURNING *;`;

      const newUser = result.rows[0];

      res.status(200).json({ user: newUser });
    } catch (error) {
      console.error('Error executing SQL query:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}
