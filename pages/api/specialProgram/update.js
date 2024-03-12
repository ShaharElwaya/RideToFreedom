import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const {  startDate, impression, bookedLessons, programId } =
      req.body;
    try {
      if (
        !startDate ||
        !impression ||
        !bookedLessons ||
        !programId
      )
        return res.status(404).json({ error: "Missing parameters!" });

      const options = await sql`UPDATE public.special_treatment_plan
      SET start_date = ${startDate},
          impression = ${impression},
          recommended_lessons = ${bookedLessons}
      WHERE id = ${programId} 
      RETURNING *;`;

      return res.status(200).json(options.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end();
  }
}
