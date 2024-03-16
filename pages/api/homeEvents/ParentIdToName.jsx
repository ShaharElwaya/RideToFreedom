// ParentIdToName.jsx

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;

      const result = await sql`SELECT name FROM public.parent WHERE id = ${id}`;

      // Check if a record was found
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Record not found" });
      }

      res.status(200).json({ name: result.rows[0].name });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end();
  }
}
