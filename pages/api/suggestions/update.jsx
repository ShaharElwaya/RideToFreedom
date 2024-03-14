import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    const { id, status } = req.body;
    if (req.method === 'POST') {
        try {
            await sql`
                UPDATE public.guide_suggestion_for_patient
                SET status = ${status}
                WHERE id = ${id};
            `;
            res.status(200).json({ message: 'Row updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).end();
    }
}
