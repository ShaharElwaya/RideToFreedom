import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { patientId } = req.query;
        if (!patientId) {
            return res.status(400).json({ error: 'Missing id parameter' });
        }

        try {
            const options = await sql`SELECT * FROM public.guide_suggestion_for_patient WHERE patient_id = ${patientId};`; 
            console.log("🚀 ~handler ~ options:", options)
            if (options.rows.length === 0) {
                return res.status(404).json({ error: 'Row not found' });
            }
            res.status(200).json(options.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).end();
    }
}
