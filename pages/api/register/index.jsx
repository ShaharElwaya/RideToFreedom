import { sql } from '@vercel/postgres';

// Handler
export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { name, email, phone, userType, password } = req.body;

            // Check if a user with the given email already exists
            const existingUser = await sql`
                SELECT * FROM users WHERE email = ${email};`;

            if (existingUser.error) {
                // There was an error in the query
                console.error('Error checking existing user:', existingUser.error);
                res.status(500).json({ error: 'Internal server error' });
            } else if (existingUser.rows.length > 0) {
                // User with the given email already exists
                res.status(400).json({ error: 'User with this email already exists.' });
            } else {
                // Insert data into the 'users' table
                const result = await sql`
                    INSERT INTO users (email, password, name, phone, type)
                    VALUES (${email}, ${password}, ${name}, ${phone}, ${userType})
                    RETURNING *;`;

                const newUser = result.rows[0];

                res.status(200).json({ user: newUser });
            }
        } catch (error) {
            console.error('Error inserting user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).end();
    }
}
