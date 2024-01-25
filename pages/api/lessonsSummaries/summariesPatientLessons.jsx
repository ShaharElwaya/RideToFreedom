

import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Get the patient_id from the query parameters
            const { patient_id } = req.query;
            
            // Fetch data from the 'lessons' table for the specific patient
            const result = await sql`
      SELECT 
      l.id AS lesson_id,
      l.type,
      l.summary,
      TO_CHAR(l.date, 'DD-MM-YYYY') AS formatted_date,
      TO_CHAR(l.date, 'HH24:MI') AS formatted_time,
      l.guide_id,
      l.parent_permission,
      p.id AS patient_id,
      p.name AS patient_name,
      p.gender AS patient_gender
    FROM public.lessons AS l
    JOIN public.patient AS p ON l.patient_id = p.id
    WHERE l.patient_id = ${patient_id};
      `;

            const lessons = result.rows;

            res.status(200).json(lessons);
        } catch (error) {
            console.error('Error executing SQL query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
