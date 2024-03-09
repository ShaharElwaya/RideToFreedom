import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

// Handler
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { id, name, email, phone, userType, password, employment_date } = req.body;

      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10); // Use 10 rounds of hashing

      // Check if a user with the given email already exists
      const existingUser = await sql`SELECT * FROM users WHERE email = ${email};`;

      if (existingUser.error) {
        console.error('Error checking existing user:', existingUser.error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      } else if (existingUser.rows.length > 0) {
        res.status(400).json({ error: 'User with this email already exists.' });
        return;
      }

      // Insert data based on user type
      let newUser;
      if (userType === 1) {
        // If user type is 1 (parent), insert into the 'users' and 'parent' tables
        const result = await sql`
          INSERT INTO users (id, email, password, type)
          VALUES (${id}, ${email}, ${hashedPassword}, ${userType})
          RETURNING *;`;

        await sql`
          INSERT INTO parent (id, name, phone_number)
          VALUES (${id}, ${name}, ${phone});`;

        newUser = result.rows[0];
      } else if (userType === 2 || userType === 3) {
        // If user type is 2 or 3 (guide), insert into the 'users' and 'guide' tables
        const result = await sql`
          INSERT INTO users (id, email, password, type)
          VALUES (${id}, ${email}, ${hashedPassword}, ${userType})
          RETURNING *;`;

        await sql`
          INSERT INTO guide (id, name, phone_number, employment_date)
          VALUES (${id}, ${name}, ${phone}, ${employment_date});`;

        newUser = result.rows[0];
      } else {
        // Invalid user type
        res.status(400).json({ error: 'Invalid user type.' });
        return;
      }

      res.status(200).json({ user: newUser });
    } catch (error) {
      console.error('Error inserting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).end();
  }
}
