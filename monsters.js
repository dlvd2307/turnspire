// api/monsters.js
// Vercel serverless fallback: used only if the browser blocks the direct
// request to Open5e. Cached at the edge so it costs almost nothing.
const UPSTREAM =
  "https://api.open5e.com/v2/creatures/?document__key__in=srd-2024" +
  "&fields=name,hit_points,armor_class,initiative_bonus,challenge_rating" +
  "&limit=500";

export default async function handler(req, res) {
  try {
    const upstream = await fetch(UPSTREAM);
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: "Upstream error" });
    }
    const data = await upstream.json();
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=604800"
    );
    return res.status(200).json(data);
  } catch {
    return res.status(502).json({ error: "Could not reach Open5e" });
  }
}
