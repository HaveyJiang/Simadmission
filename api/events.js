// JavaScript source code
// api/events.js ¡ª Vercel serverless function for secure reads from Supabase
export default async function handler(req, res) {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

    if (!SUPABASE_URL || !SERVICE_KEY) {
        res.status(500).json({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_KEY' });
        return;
    }

    const url =
        `${SUPABASE_URL}/rest/v1/events` +
        `?select=payload,ts,session_id,name,channel,prolific_id,case_index,within_case_index,route_code,transcript_type,letters,slider_value,transcript_time_ms` +
        `&order=ts.asc`;

    const resp = await fetch(url, {
        headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    if (!resp.ok) {
        const text = await resp.text();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(resp.status).send(text);
        return;
    }

    const rows = await resp.json();
    res.setHeader('Access-Control-Allow-Origin', '*'); // allow Dev Portal
    res.status(200).json(rows);
}
