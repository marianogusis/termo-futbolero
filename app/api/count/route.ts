// Devuelve el total de partidas jugadas (Neon + offset histórico pre-Neon).
// Input: ninguno
// Output: { count: number }

import { neon } from "@neondatabase/serverless";

export const revalidate = 60;

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const [row] = await sql`SELECT COUNT(*)::int AS total FROM scores`;
    const count = row.total + 1000;
    return Response.json({ count });
  } catch (error) {
    console.error("Error fetching count:", error);
    return Response.json({ count: null }, { status: 500 });
  }
}
