// specficGoalEdit.jsx

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  const {
    goalId,
    summary,
    date,
    fieldType,
    destinationDateFormat,
    statusType,
  } = req.body;

  if (req.method === "POST") {
    try {
      const result = await sql`
      UPDATE public.goals
      SET setting_date=${date}, goal=${summary}, destination_date=${destinationDateFormat}, field_id=${fieldType}, status_id=${statusType}
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
