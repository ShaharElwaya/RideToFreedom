import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { lessonId, type, count, frequency } = req.body;
    console.log("🚀 ~ handler ~ req.body:", req.body)
    try {
      const options = await sql`UPDATE public.recommended_lessons
        SET lesson_name = ${type},
            lesson_count = ${count},
            frequency = ${frequency}
        WHERE id = ${lessonId}
        RETURNING *;`;

      res.status(200).json(options.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end();
  }
}
