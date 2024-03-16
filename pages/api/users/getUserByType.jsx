// getUserByType.jsx

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { type } = req.query;
    try {
      const result = await sql`SELECT * FROM public.users WHERE Type=${type}`;

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Record not found" });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end();
  }
}
