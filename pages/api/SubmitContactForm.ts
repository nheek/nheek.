import pool from './Config';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const formData = req.body;

            // Validate form data
            if (!isValidFormData(formData)) {
                res.status(400).json({ error: 'Invalid form data' });
                return;
            }

            // Access individual form data values
            const { name, email, subject, message } = formData;

            // Handle the form data (e.g., save to a database)
            // Use pool.query directly for the SQL query
            const [insertResult] = await pool.query(
                'INSERT INTO ContactForm (name, email, subject, message) VALUES (?, ?, ?, ?)',
                [name, email, subject, message]
            );

            res.status(200).json({ message: 'Form data received successfully' });

            // Respond with a success message or other appropriate response
        } catch (error) {
            console.error('Error processing form data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        // Respond with a method not allowed error for non-POST requests
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

function isValidFormData(formData) {
    // Add your validation logic here
    const { name, email, subject, message } = formData;

    // Example validation: Check if required fields are present, email is valid, and name, subject, and message are strings
    if (
        !name ||
        !email ||
        !subject ||
        !message ||
        typeof name !== 'string' ||
        typeof subject !== 'string' ||
        typeof message !== 'string' ||
        !isValidEmail(email)
    ) {
        return false;
    }

    return true;
}

function isValidEmail(email) {
    // Example email validation using a simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
