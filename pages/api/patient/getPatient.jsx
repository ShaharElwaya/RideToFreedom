// pages/api/options.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { patient_id } = req.query; // Change req.body to req.query
        console.log("🚀 ~ handler ~ patient_id:", patient_id)
        try {
            const options = await sql`SELECT * FROM public.patient WHERE id=${patient_id};`;
            res.status(200).json(options.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).end();
    }
}
