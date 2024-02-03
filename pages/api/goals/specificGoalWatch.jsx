import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Get the patient_id from the query parameters
            const { goal_id } = req.query;
            const result = await sql`SELECT 
            p.id AS patient_id,
            g.setting_date AS setting_date,
            g.goal AS summary,
            g.destination_date AS destination_date, 
            g.field_id AS field_id,
            g.status_id AS status_id,
            p.name AS patient_name,
            s.status AS status_name,
            gf.field AS field_name
        FROM public.goals AS g
        JOIN public.patient AS p ON g.patient_id = p.id
        JOIN enums.statuses AS s ON g.status_id = s.id
        JOIN enums.goals_fields AS gf ON g.field_id = gf.id
        WHERE g.id = ${goal_id};
        `;

            res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).end();
    }    
}
