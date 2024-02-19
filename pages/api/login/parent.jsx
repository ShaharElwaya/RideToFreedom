// pages/api/options.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;

      // Select all patients for a given parent_id
      const childrens = await sql`
        SELECT name, gender, id FROM public.patient WHERE parent_id = ${id};
      `;

      if (childrens.rows.length === 1) {
        // If there's only one child, return the details
        const { name, gender, id: childId } = childrens.rows[0];
        res.status(200).json({ hasOneChild: true, childDetails: { name, gender, id: childId } });
      } else {
        // If there's more than one child or no child, return a default value
        res.status(200).json({ hasOneChild: false, childDetails: childrens.rows });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).end();
  }
}
