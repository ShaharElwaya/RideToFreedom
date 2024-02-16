import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { patient_id } = req.query; // Change req.body to req.query
        console.log("🚀 ~ handler ~ patient_id:", patient_id)
        try {
            const options = await sql`SELECT comment FROM public.personal_details_comments WHERE patient_id=${patient_id};`;
            const comments = options.rows.map(row => row.comment); // Extract comments into an array
            console.log("🚀 ~ handler ~ comments:", comments)
            res.status(200).json(comments); // Send the comments array in response
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).end();
    }
}
