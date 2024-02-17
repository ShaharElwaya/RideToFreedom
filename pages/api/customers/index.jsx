// pages/api/options.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { type, id } = req.query;

      let options;

      if (type === '1') {
        // If type is 1, select patients based on parent_id
        options = await sql`
          SELECT name, gender, id
          FROM public.patient
          WHERE parent_id = ${id} 
          ORDER BY name;
        `;
      } else {
        // For other types, select all patients
        options = await sql`SELECT name, gender, id FROM public.patient ORDER BY name;`;
      }

      res.status(200).json(options.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).end();
  }
}
