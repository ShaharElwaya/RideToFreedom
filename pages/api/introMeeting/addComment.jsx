// addComment.jsx

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { comment, patient_id, guide_id } = req.body;

      // Insert comment using parameterized query to prevent SQL injection
      const result = await sql`
      INSERT INTO public.personal_details_comments (comment, patient_id, guide_id)
      VALUES (${comment}, ${patient_id}, ${guide_id})
      RETURNING *;
    `;

      res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error("Error inserting comment:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
