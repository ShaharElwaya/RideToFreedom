// childrens.jsx

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;

      // Select all patients for a given parent_id
      const childrens = await sql`
        SELECT id FROM public.patient WHERE parent_id = ${id};
      `;

      res.status(200).json(childrens.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end();
  }
}
