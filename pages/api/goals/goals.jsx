

import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Get the patient_id from the query parameters
            const { patient_id } = req.query;

            // Fetch data from the 'lessons' table for the specific patient
            const result = await sql`
      SELECT * 
      FROM public.goals 
      WHERE patient_id = ${patient_id}
      ORDER BY setting_date;
      `;

            const goals = result.rows;

            res.status(200).json(goals);
        } catch (error) {
            console.error('Error executing SQL query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
