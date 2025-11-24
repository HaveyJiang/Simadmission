// api/events.js (or pages/api/events.js)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY  // server-side only!
);

export default async function handler(req, res) {
    try {
        const { data, error } = await supabase
            .from('events')
            .select('payload, ts')
            .order('ts', { ascending: true });

        if (error) {
            console.error('Supabase select error:', error);
            return res.status(500).json({ error: error.message });
        }

        // Dev portal expects an array of rows with {payload, ts}
        return res.status(200).json(data || []);
    } catch (e) {
        console.error('Unexpected /api/events error:', e);
        return res.status(500).json({ error: 'Unexpected error' });
    }
}
