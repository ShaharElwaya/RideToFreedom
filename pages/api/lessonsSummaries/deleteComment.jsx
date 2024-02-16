// pages/api/lessonsSummaries/addComment.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {  
  const { id } = req.body;

  if (req.method === 'POST') {
    try {
      // Insert the comment into the database
      const result = await sql`
      DELETE FROM public.lessons_comments 
      WHERE id=${id}
        RETURNING *;`;

      // Assuming the database returns the inserted comment details
      const insertedComment = result.rows[0];

      res.status(200).json({ success: true, comment: insertedComment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).end();
  }
}
