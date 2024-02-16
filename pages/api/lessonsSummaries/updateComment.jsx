// pages/api/lessonsSummaries/addComment.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { comment, id } = req.body;

      // You may want to perform some validation on lessonId and comment here

      // Insert the comment into the database
      const result = await sql`
        UPDATE public.lessons_comments 
        SET comment = ${comment}
        WHERE id = ${id}
        RETURNING *;
      `;

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
