import { sql } from '@vercel/postgres';

// Handler
export default async function handler(req, res) {
  const { summary, eventId, patientId, parentId } = req.body;

  if (req.method === 'POST') {
    try {
      const result = await sql`
        UPDATE public.home_events
        SET event = ${summary}, patient_id = ${patientId}, parent_id = ${parentId}
        WHERE id=${eventId}
        RETURNING *;`;

      const newEvent = result.rows[0];

      res.status(200).json({ event: newEvent });
    } catch (error) {
      console.error('Error executing SQL query:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}
