// login/index.jsx

import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const { email, password } = req.body;

  if (req.method === "POST") {
    try {
      const data = await sql`SELECT * FROM users WHERE email = ${email};`;
      const actual_password = data.rows[0].password;

      // Compare the entered password with the hashed password
      const passwordMatch = await bcrypt.compare(password, actual_password);

      if (!passwordMatch) {
        res.status(401).json("Not authorized");
        return;
      }

      const user = data.rows[0];
      res.status(200).json({
        email: user.email,
        type: user.type,
        id: user.id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}
