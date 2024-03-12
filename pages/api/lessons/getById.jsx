// pages/api/options.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { id } = req.query;
            const options = await sql`SELECT * FROM public.recommended_lessons WHERE id = ${id};`;
            res.status(200).json(options.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).end();
    }
}
