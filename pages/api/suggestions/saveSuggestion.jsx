import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { patientId, guideId, suggestion, date } = req.body; // Destructure necessary fields from req.body
        try {
            const result = await sql`
                INSERT INTO public.guide_suggestion_for_patient (patient_id, guide_id, suggestion, date, status)
                VALUES (${patientId}, ${guideId}, ${suggestion}, ${date}, 'onhold')
                RETURNING *;
            `;
         
            res.status(200).json({ message: 'Row inserted successfully', insertedResult:result.rows[0] });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).end();
    }
}
