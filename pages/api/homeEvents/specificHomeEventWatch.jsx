import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Get the patient_id from the query parameters
            const { event_id } = req.query;
            const result = await sql`SELECT 
            h.event AS event_summary,
            h.parent_id AS parent_id,
            TO_CHAR(h.event_date, 'DD-MM-YYYY') AS formatted_date,
            TO_CHAR(h.event_date, 'HH24:MI') AS formatted_time,
            pt.id AS patient_id,
            pt.name AS patient_name,
            pt.gender AS patient_gender,
            pr.name AS parent_name
          FROM public.home_events AS h
          JOIN public.patient AS pt ON h.patient_id = pt.id
          JOIN public.parent AS pr ON h.parent_id = pr.id
          WHERE h.id = ${event_id};`;

            res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).end();
    }    
}
