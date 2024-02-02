// Import necessary modules
import { sql } from '@vercel/postgres';

// Define the API handler
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Get the table name and ID from the query parameters
      const { id } = req.query;

      // Construct the SQL query based on the provided table name and ID
      const result = await sql`SELECT name FROM public.guide WHERE id = ${id}`;

      // Check if a record was found
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }

      // Return the name
      res.status(200).json({ name: result.rows[0].name });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
