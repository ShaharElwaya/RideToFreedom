// specificGoalDelete.jsx

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  const { goalId } = req.body;

  if (req.method === "POST") {
    try {
      const result = await sql`
      DELETE FROM public.goals
      WHERE id=${goalId}
        RETURNING *;`;

      const newGoal = result.rows[0];

      res.status(200).json({ goal: newGoal });
    } catch (error) {
      console.error("Error executing SQL query:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}
