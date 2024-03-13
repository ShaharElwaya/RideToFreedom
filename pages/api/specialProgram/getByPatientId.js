import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { patientId } = req.query;
    console.log("🚀 ~ handler ~ req.params:", req.params)
    try {
      if (!patientId)
        return res.status(404).json({ error: "Missing parameters!" });

      const options = await sql`SELECT * FROM public.special_treatment_plan WHERE patient_id = ${patientId}`;

      return res.status(200).json(options.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end();
  }
}
