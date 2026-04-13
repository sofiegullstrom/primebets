
import { Resend } from 'resend';

const resend = new Resend('re_CEEBJ8Gw_FavuNWkqawaMp9xbqb7feMHb');

export default async function handler(request, response) {
    // Endast tillåt POST-anrop (när vi skickar data)
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email } = request.body;

        if (!email) {
            return response.status(400).json({ error: 'Email saknas' });
        }

        const { data, error } = await resend.emails.send({
            from: 'PrimeBets Notis <onboarding@resend.dev>', // Använd standard avsändare tills du verifierat domän
            to: ['primebets.se@gmail.com'],
            subject: '🚀 Ny användare registrerad!',
            html: `
        <div style="font-family: sans-serif; color: #333;">
          <h1>Ny användare har registrerat sig!</h1>
          <p>En ny trav-entusiast har just skapat ett konto på PrimeBets.</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Email:</strong> ${email}
          </div>
          <p>Härligt! 🎉</p>
        </div>
      `,
        });

        if (error) {
            console.error('Resend error:', error);
            return response.status(400).json({ error });
        }

        return response.status(200).json({ message: 'Email skickat!' });
    } catch (err) {
        console.error('Server error:', err);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}
