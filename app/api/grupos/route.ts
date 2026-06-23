// Crea un grupo nuevo y guarda el score del creador.
// Input: POST { creator_name, score, categoria, perfil }
// Output: { grupo_id }

import { neon } from "@neondatabase/serverless";

function generarId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 8 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export async function POST(request: Request) {
  try {
    const { creator_name, score, categoria, perfil } = await request.json();
    const sql = neon(process.env.DATABASE_URL!);
    const grupo_id = generarId();

    await sql`INSERT INTO grupos (id, creator_name) VALUES (${grupo_id}, ${creator_name})`;
    await sql`
      INSERT INTO grupo_scores (grupo_id, player_name, score, categoria, perfil)
      VALUES (${grupo_id}, ${creator_name}, ${score}, ${categoria}, ${perfil})
    `;

    return Response.json({ grupo_id });
  } catch (error) {
    console.error("Error creating group:", error);
    return Response.json({ error: "Error creating group" }, { status: 500 });
  }
}
