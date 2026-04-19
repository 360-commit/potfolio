const BREVO_API_KEY = process.env.BREVO_API_KEY;
const LIST_ID = parseInt(process.env.BREVO_LIST_ID) || 1; // Replace with your list ID

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { email } = JSON.parse(event.body);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Valid email required' }) };
    }

    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        email,
        listIds: [LIST_ID],
        updateEnabled: true
      })
    });

    const data = await res.json();

    if (res.ok) {
      return { statusCode: 200, body: JSON.stringify({ success: true, message: 'Subscribed successfully!' }) };
    } else if (data.message && data.message.includes('already exist')) {
      return { statusCode: 200, body: JSON.stringify({ success: true, message: 'You are already subscribed!' }) };
    } else {
      return { statusCode: 500, body: JSON.stringify({ error: data.message || 'Subscription failed' }) };
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
