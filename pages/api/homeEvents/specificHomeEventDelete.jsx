import { sql } from '@vercel/postgres';

// Handler
export default async function handler(req, res) {
  const { eventId } = req.body;

  if (req.method === 'POST') {
    try {
      const result = await sql`
        DELETE FROM public.home_events
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
