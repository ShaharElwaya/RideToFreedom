// getComments.jsx

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { lesson_id, type } = req.query;

      const result = await sql`
      SELECT c.id, c.user_type, c.user_id, c.comment, c.summary_id, 
             CASE
               WHEN c.user_type = 1 THEN p.name
               WHEN c.user_type != 1 THEN g.name
             END AS name
      FROM public.lessons_comments AS c
      LEFT JOIN parent AS p ON c.user_id = p.id AND c.user_type = 1
      LEFT JOIN guide AS g ON c.user_id = g.id AND c.user_type != 1
      WHERE summary_id = ${lesson_id}
      ORDER BY c.id;`;

      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end();
  }
}
