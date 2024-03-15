// updateComment.jsx

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { comment, id } = req.body;

      // Insert the comment into the database
      const result = await sql`
        UPDATE public.personal_details_comments 
        SET comment = ${comment}
        WHERE id = ${id}
        RETURNING *;
      `;

      const insertedComment = result.rows[0];

      res.status(200).json({ success: true, comment: insertedComment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end();
  }
}
