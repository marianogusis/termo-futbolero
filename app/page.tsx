"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { track } from "@vercel/analytics";

// ─── DATASET ───────────────────────────────────────────────────────────────

const PREGUNTAS = [
  { id: 1, a: { texto: "Messi", dims: { Modernidad: 2, Romanticismo: 2, Racionalidad: 1, Resultadismo: 1 } }, b: { texto: "Maradona", dims: { Nostalgia: 2, Pasión: 2, Termismo: 1, AntiSistema: 1 } } },
  { id: 2, a: { texto: "Bilardo", dims: { Termismo: 1, Pasión: 1, Resultadismo: 2, Modernidad: 1, AntiSistema: 1 } }, b: { texto: "Menotti", dims: { Romanticismo: 3, Nostalgia: 2, Racionalidad: 1 } } },
  { id: 3, a: { texto: "Club", dims: { Pasión: 2, Termismo: 2, Nostalgia: 1, AntiSistema: 1 } }, b: { texto: "Selección", dims: { Modernidad: 2, Romanticismo: 2, Racionalidad: 1, Resultadismo: 1 } } },
  { id: 4, a: { texto: "Ganar 1-0 jugando horrible", dims: { Termismo: 2, Pasión: 1, Resultadismo: 2, AntiSistema: 1 } }, b: { texto: "Empatar 4-4 jugando espectacular", dims: { Romanticismo: 3, Nostalgia: 2, Pasión: 1 } } },
  { id: 5, a: { texto: "VAR sí", dims: { Racionalidad: 3, Modernidad: 3 } }, b: { texto: "VAR no", dims: { AntiSistema: 3, Termismo: 2, Pasión: 1 } } },
  { id: 6, a: { texto: "Guardiola", dims: { Romanticismo: 2, Modernidad: 2, Racionalidad: 2 } }, b: { texto: "Mourinho", dims: { Termismo: 1, Resultadismo: 3, Modernidad: 1, AntiSistema: 1 } } },
  { id: 7, a: { texto: "Talento", dims: { Romanticismo: 3, Pasión: 1, Nostalgia: 1, Modernidad: 1 } }, b: { texto: "Garra", dims: { Termismo: 2, Pasión: 2, Resultadismo: 2 } } },
  { id: 8, a: { texto: "Fútbol de antes", dims: { Nostalgia: 3, AntiSistema: 2, Termismo: 1 } }, b: { texto: "Fútbol moderno", dims: { Modernidad: 3, Racionalidad: 3 } } },
  { id: 9, a: { texto: "Ronaldo Nazario", dims: { Pasión: 1, Romanticismo: 2, Resultadismo: 1, Nostalgia: 1, Modernidad: 1 } }, b: { texto: "Ronaldinho", dims: { Pasión: 1, Romanticismo: 3, Nostalgia: 1, AntiSistema: 1 } } },
  { id: 10, a: { texto: "Champions League", dims: { Romanticismo: 1, Resultadismo: 1, Modernidad: 2, Racionalidad: 2 } }, b: { texto: "Mundial", dims: { Termismo: 1, Pasión: 2, Romanticismo: 2, Nostalgia: 1 } } },
  { id: 11, a: { texto: "Ganar con un penal polémico", dims: { Resultadismo: 3, AntiSistema: 1, Termismo: 2 } }, b: { texto: "Empatar siendo superior", dims: { Romanticismo: 3, Racionalidad: 2, Nostalgia: 1 } } },
  { id: 12, a: { texto: "Un crack indisciplinado", dims: { Romanticismo: 2, AntiSistema: 2, Pasión: 1, Termismo: 1 } }, b: { texto: "Un jugador promedio ejemplar", dims: { Racionalidad: 3, Modernidad: 2, Resultadismo: 1 } } },
  { id: 13, a: { texto: "Tener al mejor jugador del mundo", dims: { Romanticismo: 3, Pasión: 2, Termismo: 1 } }, b: { texto: "Tener el mejor equipo del mundo", dims: { Resultadismo: 2, Modernidad: 2, Racionalidad: 2 } } },
  { id: 14, a: { texto: "La gambeta", dims: { Romanticismo: 3, Pasión: 2, AntiSistema: 1 } }, b: { texto: "El pase perfecto", dims: { Racionalidad: 3, Modernidad: 2, Resultadismo: 1 } } },
  { id: 15, a: { texto: "Un 10 clásico", dims: { Romanticismo: 3, Nostalgia: 2, AntiSistema: 1 } }, b: { texto: "Un mediocampista todoterreno", dims: { Modernidad: 2, Racionalidad: 2, Resultadismo: 2 } } },
  { id: 16, a: { texto: "Presión alta", dims: { Resultadismo: 1, Modernidad: 3, Racionalidad: 2 } }, b: { texto: "Esperar y contraatacar", dims: { Termismo: 1, Resultadismo: 3, Modernidad: 1, AntiSistema: 1 } } },
  { id: 17, a: { texto: "El Diego 1986", dims: { Pasión: 1, Romanticismo: 2, Resultadismo: 1, Nostalgia: 1, AntiSistema: 1 } }, b: { texto: "Messi 2022", dims: { Pasión: 1, Romanticismo: 2, Modernidad: 1, Racionalidad: 2 } } },
  { id: 18, a: { texto: "Ver el partido en la cancha", dims: { Pasión: 3, Termismo: 2, Nostalgia: 1 } }, b: { texto: "Verlo por TV", dims: { Racionalidad: 3, Modernidad: 3 } } },
  { id: 19, a: { texto: "Festejar un gol agónico", dims: { Termismo: 2, Pasión: 3, Resultadismo: 1 } }, b: { texto: "Ver jugar perfecto a tu equipo", dims: { Romanticismo: 2, Modernidad: 2, Racionalidad: 2 } } },
  { id: 20, a: { texto: "Un jugador que ama la camiseta", dims: { Termismo: 2, Pasión: 2, Romanticismo: 1, Nostalgia: 1 } }, b: { texto: "Un jugador que siempre rinde", dims: { Resultadismo: 3, Racionalidad: 2, Modernidad: 1 } } },
  { id: 21, a: { texto: "Ver el mejor gol de la historia", dims: { Termismo: 1, Pasión: 1, Romanticismo: 2, Nostalgia: 2 } }, b: { texto: "Ver a tu equipo campeón una vez más", dims: { Pasión: 1, Resultadismo: 1, Nostalgia: 1, Modernidad: 1, Racionalidad: 2 } } },
  { id: 22, a: { texto: "La Scaloneta", dims: { Pasión: 1, Romanticismo: 1, Modernidad: 2, Racionalidad: 2 } }, b: { texto: "Argentina 1986", dims: { Termismo: 1, Pasión: 2, Romanticismo: 1, Nostalgia: 2 } } },
  { id: 23, a: { texto: "Un ídolo que nunca salió campeón", dims: { Termismo: 1, Pasión: 1, Romanticismo: 2, Nostalgia: 2 } }, b: { texto: "Un campeón que nunca fue ídolo", dims: { Resultadismo: 4, Racionalidad: 2 } } },
  { id: 24, a: { texto: "Ganar 6 a 0", dims: { Romanticismo: 2, Resultadismo: 1, Modernidad: 1, Racionalidad: 2 } }, b: { texto: "Ganar en la última jugada", dims: { Termismo: 2, Pasión: 2, Resultadismo: 2 } } },
  { id: 25, a: { texto: "Que tu equipo tenga una estrella", dims: { Romanticismo: 3, Pasión: 2, Termismo: 1 } }, b: { texto: "Que tenga once guerreros", dims: { Resultadismo: 2, Termismo: 2, Pasión: 1, AntiSistema: 1 } } },
  { id: 26, a: { texto: "Ser recordado por jugar bien", dims: { Romanticismo: 4, Nostalgia: 1, Pasión: 1 } }, b: { texto: "Ser recordado por ganar", dims: { Resultadismo: 4, Racionalidad: 1, Modernidad: 1 } } },
  { id: 27, a: { texto: "Fillol", dims: { Romanticismo: 3, Nostalgia: 2, Racionalidad: 1 } }, b: { texto: "Dibu Martínez", dims: { Termismo: 2, Pasión: 2, Resultadismo: 1, AntiSistema: 1 } } },
  { id: 28, a: { texto: "Ver campeón a tu club", dims: { Pasión: 2, Termismo: 2, Nostalgia: 1, AntiSistema: 1 } }, b: { texto: "Ver campeón a tu selección", dims: { Pasión: 2, Romanticismo: 2, Modernidad: 1, Resultadismo: 1 } } },
  { id: 29, a: { texto: "Que tu clásico descienda", dims: { Termismo: 3, Pasión: 2, AntiSistema: 1 } }, b: { texto: "Salir campeón", dims: { Pasión: 1, Romanticismo: 1, Modernidad: 1, Racionalidad: 3 } } },
  { id: 30, a: { texto: "Un Mundial más para Messi", dims: { Pasión: 1, Romanticismo: 2, Modernidad: 1, Racionalidad: 2 } }, b: { texto: "Una Libertadores para tu club", dims: { Termismo: 2, Pasión: 2, Nostalgia: 1, AntiSistema: 1 } } },
];

// ─── PERFILES ────────────────────────────────────────────────────────────────
// El perfil se asigna por 'rasgo más marcado' (ver PERFIL_FIRMA y calcularResultado).

const PERFILES = [
  {
    id: "termo-nuclear", nombre: "EL TERMO NUCLEAR", emoji: "🌋",
    descripcion: "Sos una fuerza de la naturaleza. Discutís cualquier cosa con cualquiera en cualquier momento.",
    resumen: "Si el fútbol fuera una religión, vos serías el Papa.",
  },
  {
    id: "bilardista", nombre: "EL BILARDISTA", emoji: "🔒",
    descripcion: "Ganás o no jugás. Campeón es campeón, lo demás son cuentos.",
    resumen: "Lo importante es el resultado. Y el resultado.",
  },
  {
    id: "menottista", nombre: "EL MENOTTISTA", emoji: "🎨",
    descripcion: "El fútbol es arte y emoción. Primero la belleza, después el resultado.",
    resumen: "Para vos el fútbol es poesía. Para los demás es un deporte donde hay que meter goles.",
  },
  {
    id: "nostalgico", nombre: "EL NOSTÁLGICO", emoji: "📼",
    descripcion: "Antes sí se jugaba. Antes había jugadores de verdad.",
    resumen: "Vivís mentalmente en los 80/90.",
  },
  {
    id: "anti-sistema", nombre: "EL ANTI-SISTEMA", emoji: "✊",
    descripcion: "El fútbol te lo arruinó el dinero, la FIFA, los dirigentes y el VAR.",
    resumen: "El fútbol es corrupción, plata y robo. Pero igual vas a ver los 90 minutos.",
  },
  {
    id: "analista", nombre: "EL ANALISTA", emoji: "📊",
    descripcion: "Presión alta, porcentaje de posesión, transiciones. Tu vocabulario no es para todos.",
    resumen: "Para vos el fútbol es una ciencia. Y cada partido es un experimento que confirma lo que ya sabías.",
  },
  {
    id: "moderno", nombre: "EL MODERNO", emoji: "📱",
    descripcion: "Seguís el fútbol con datos, apps y análisis tácticos. El pasado no te interesa.",
    resumen: "El fútbol de antes te aburre. Lo tuyo es el presente y el futuro.",
  },
  {
    id: "tribunero", nombre: "EL TRIBUNERO", emoji: "📣",
    descripcion: "Lo tuyo es el aguante. El trapo. El bombo.",
    resumen: "Para vos el fútbol es aliento. El resultado importa, pero alentar importa más.",
  },
  {
    id: "fanatico-total", nombre: "EL FANÁTICO TOTAL", emoji: "🔥",
    descripcion: "El fútbol no es parte de tu vida. Es tu vida.",
    resumen: "Médico, vendedor, electricista. Nada de eso importa. Lo que importa es el fútbol.",
  },
  {
    id: "futbolero-de-bar", nombre: "EL FUTBOLERO DE BAR", emoji: "🍺",
    descripcion: "Sabés de todo un poco. Lo tuyo es la discusión.",
    resumen: "Sos el corazón de cualquier debate futbolero. Tenés una teoría para todo. Algunas hasta tienen sentido.",
  },
];

// ─── ROASTS POR PERFIL ───────────────────────────────────────────────────────

const ROASTS_POR_PERFIL = {
  "termo-nuclear": ["Hablás de fútbol en situaciones que no tienen nada que ver con el fútbol.","Recordás exactamente dónde estabas en cada gol histórico de tu vida.","Tu pareja ya sabe que en día de clásico no existís.","Insultar al árbitro es tu cardio diario.","Que tu equipo pierda un partido te arruina el día.","El festejo de Qatar 2022 fue el momento más feliz de tu vida adulta. Y no te avergüenza.","Tu psicólogo ya desistió de explicarte que es solo un deporte."],
  "bilardista": ["Para vos un empate 0-0 es un resultado válido y defendible.","Para vos la ética en el fútbol es un lujo de los que no ganan.","Nunca festejaste un gol tan lindo como un triunfo 1-0 en el último minuto.","Ganar feo te genera más satisfacción que perder jugando bien.","Para vos subcampeón es el primero de los perdedores.","Tu respuesta ante cualquier crítica es '¿y cuántos títulos tenés?'."],
  "menottista": ["Analizás el juego de un equipo que acaba de perder y encontrás cosas para destacar.","Preferirías empatar un partido importante jugando bien que ganarlo con un penal dudoso.","En cualquier debate de fútbol, vos sos 'el de la estética'.","Aplaudiste un gol que no fue de tu equipo porque fue hermoso.","Defendiste a un jugador porque 'tenía muy buena técnica' aunque errara mucho.","Alguna vez dijiste 'prefiero que no salgan campeones si van a jugar así'."],
  "nostalgico": ["Todavía no superaste la era del Diego. Nunca lo vas a superar.","Tenés álbumes de figuritas de varios mundiales atesorados entre tus recuerdos.","Ver fútbol moderno te genera una mezcla de nostalgia y decepción.","Tu once ideal tiene al menos siete jugadores retirados.","Defendés jugadores de los 90 en discusiones con gente que no los vio jugar.","Creés que el fútbol murió en algún punto entre 1995 y 2005."],
  "anti-sistema": ["Para vos el VAR arruinó la civilización occidental.","Tenés una teoría conspirativa para cada resultado que no te gustó.","El árbitro siempre cobra en contra de tu equipo. Siempre. Sin excepción.","Cuando tu equipo gana, fue mérito. Cuando pierde, fue robo.","Creés que la FIFA, la AFA y el VAR son parte del mismo complot.","Para vos cada derrota tiene un culpable. Y nunca es tu equipo."],
  "analista": ["Analizaste un partido de pretemporada como si fuera una final.","Ves los partidos con el teléfono para seguir las estadísticas en tiempo real.","Tus predicciones tienen sustento teórico y fallaron igual.","Usás términos tácticos en conversaciones que no lo requieren.","Predecís el resultado antes del partido basándote en datos. Y a veces hasta acertás.","Después de cada partido mandás un análisis que nadie pidió."],
  "moderno": ["Para vos Maradona es 'el mejor de su época'.","Usás datos para defender posiciones en asados.","Seguís la Premier, la Bundesliga y la Serie A más que el fútbol argentino.","Creés que el VAR mejoró el juego y lo decís sin vergüenza.","Citás fuentes en discusiones de fútbol. Fuentes de verdad.","El fútbol de antes te parece lento y sin estructura."],
  "tribunero": ["Sabés de memoria cada canción de tu club.","Para vos el mejor DT es el que arma un equipo que deja todo.","Pedís offside aunque estás segurísimo que no fue.","Cantás en el partido aunque tu equipo vaya perdiendo 3-0.","Tu voz tarda tres días en volver después de cada clásico.","Nunca saliste de la cancha antes del pitazo final, ni en las peores noches."],
  "fanatico-total": ["Tu agenda social depende del fixture.","Conocés jugadores de la quinta división de tu club.","Perdiste una cena por un partido que terminó 0-0 y no te arrepentiste.","Tenés más camisetas de fútbol que ropa de trabajo.","Tu alarma del domingo es a las 9AM para ver el fútbol europeo.","El fútbol no es parte de tu vida. Es el centro de tu vida."],
  "futbolero-de-bar": ["Nunca te quedaste sin argumento. Aunque el argumento no cerrara.","Cambiás de posición según el resultado del partido.","Tenés una opinión formada sobre todo, incluso sobre lo que no viste.","Defendiste y atacaste al mismo DT en el mismo mes.","Sabés un poco de todo y mucho de nada, pero lo decís con convicción.","Tus predicciones son 50/50 y las recordás solo cuando aciertan."],
};

// ─── SCORING ENGINE (DISTANCIA A ARQUETIPO) ──────────────────────────────────

const DIMS_LIST = ["Termismo","Pasión","Romanticismo","Resultadismo","Nostalgia","Modernidad","Racionalidad","AntiSistema"];

// Media y desvío de cada dimensión en jugadores típicos (calibrado por simulación).
// Sirve para medir cuánto sobresale el jugador respecto al promedio (z-score).
const BASELINE_MEAN = { Termismo: 51, Pasión: 63, Romanticismo: 55, Resultadismo: 52, Nostalgia: 53, Modernidad: 52, Racionalidad: 50, AntiSistema: 50 };
const BASELINE_STD  = { Termismo: 10, Pasión: 9,  Romanticismo: 10, Resultadismo: 11, Nostalgia: 12, Modernidad: 10, Racionalidad: 11, AntiSistema: 13 };

// Cada perfil es dueño de una dimensión-firma, con un peso que calibra su frecuencia.
const PERFIL_FIRMA = {
  "termo-nuclear": { dim: "Termismo", peso: 1.1 },
  "tribunero":     { dim: "Pasión", peso: 1.1 },
  "menottista":    { dim: "Romanticismo", peso: 0.82 },
  "bilardista":    { dim: "Resultadismo", peso: 0.82 },
  "nostalgico":    { dim: "Nostalgia", peso: 0.8 },
  "moderno":       { dim: "Modernidad", peso: 0.68 },
  "analista":      { dim: "Racionalidad", peso: 0.72 },
  "anti-sistema":  { dim: "AntiSistema", peso: 1.05 },
};

function calcularResultado(respuestas: any[]) {
  // 1. Acumular dims crudas
  const dims: any = {};
  DIMS_LIST.forEach(d => dims[d] = 0);
  respuestas.forEach(({ pregunta, opcion }: any) => {
    Object.entries((pregunta as any)[opcion].dims).forEach(([k, v]: any) => { dims[k] = (dims[k] || 0) + v; });
  });

  // 2. Normalizar a 0-100. Con opciones balanceadas a 6 pts y 30 preguntas,
  //    cada dim acumula entre 0 y ~50. Normalizamos por el máximo observado teórico.
  const maxPorDim: any = {};
  DIMS_LIST.forEach(d => maxPorDim[d] = 0);
  PREGUNTAS.forEach(p => {
    DIMS_LIST.forEach(d => {
      maxPorDim[d] += Math.max((p.a.dims as any)[d] || 0, (p.b.dims as any)[d] || 0);
    });
  });
  const normalized: any = {};
  DIMS_LIST.forEach(d => {
    normalized[d] = maxPorDim[d] > 0 ? Math.min(100, Math.round((dims[d] / maxPorDim[d]) * 100)) : 0;
  });

  // 3. Score de Termismo: pasión + termismo + antisistema + nostalgia suman;
  //    racionalidad penaliza fuerte, modernidad y romanticismo penalizan suave.
  const caliente = normalized.Termismo * 0.38 + normalized.Pasión * 0.30 + normalized.AntiSistema * 0.22 + normalized.Resultadismo * 0.10;
  const penal = Math.max(0, (normalized.Racionalidad - 50) * 0.16 + (normalized.Modernidad - 50) * 0.10);
  const termismoScore = Math.min(96, Math.max(18, Math.round((caliente - penal) * 0.62 + 33)));

  // 4. Perfil = tu rasgo más marcado (z-score sobre la media de jugadores).
  //    Cada perfil es "dueño" de una dimensión-firma. Te asignás al perfil
  //    donde más sobresalís respecto al jugador promedio.
  //    Fanático Total = alto en 5+ dimensiones a la vez sin un pico dominante.
  //    Futbolero de Bar = no sobresalís en nada (fallback).
  const z: any = {};
  DIMS_LIST.forEach(d => {
    z[d] = (normalized[d] - (BASELINE_MEAN as any)[d]) / (BASELINE_STD as any)[d];
  });

  let mejorId: string | null = null;
  let mejorVal = -Infinity;
  Object.entries(PERFIL_FIRMA).forEach(([pid, firma]: any) => {
    const val = z[firma.dim] * firma.peso;
    if (val > mejorVal) { mejorVal = val; mejorId = pid; }
  });

  const dimsAltas = DIMS_LIST.filter(d => z[d] > 0.6).length;
  if (dimsAltas >= 4 && mejorVal < 1.7) {
    mejorId = "fanatico-total";
  } else if (mejorVal < 0.22) {
    mejorId = "futbolero-de-bar";
  }

  const mejorPerfil = PERFILES.find(p => p.id === mejorId) || PERFILES.find(p => p.id === "futbolero-de-bar");

  // 5. Roasts del perfil
  const pool = (ROASTS_POR_PERFIL as any)[mejorPerfil!.id] || ROASTS_POR_PERFIL["futbolero-de-bar"];
  return { termismoScore, dims, normalized, perfil: mejorPerfil!, pool };
}


function getCategoria(score: number) {
  if (score <= 25) return { label: "Pecho Frío", emoji: "🥶", color: "#64748b" };
  if (score <= 55) return { label: "Simpatizante", emoji: "👀", color: "#22d3ee" };
  if (score <= 66) return { label: "Futbolero", emoji: "⚽", color: "#4ade80" };
  if (score <= 80) return { label: "Termo", emoji: "🔥", color: "#f97316" };
  return { label: "Termo Nuclear", emoji: "🌋", color: "#ef4444" };
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const GrainOverlay = () => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.035,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  }} />
);

const ProgressBar = ({ current, total }: any) => {
  const pct = (current / total) * 100;
  return (
    <div style={{ width: "100%", padding: "0 20px", marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "#94a3b8", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>
        <span>PREGUNTA {current} DE {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #f97316, #ef4444)", borderRadius: 99, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
};

const DimBar = ({ label, value, color }: any) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 12, color: "#94a3b8", fontFamily: "var(--font-mono)" }}>
      <span style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
      <span style={{ color: "#e2e8f0" }}>{value}%</span>
    </div>
    <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 99, transition: "width 1s ease" }} />
    </div>
  </div>
);

// ─── SCREENS ─────────────────────────────────────────────────────────────────

function Landing({ onStart }: any) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { if (!visible) setTimeout(() => setVisible(true), 50); }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "32px 20px", position: "relative", overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 400, height: 400, background: "radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "-10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 440, width: "100%", textAlign: "center", transition: "opacity 0.6s ease, transform 0.6s ease", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)" }}>

        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", marginBottom: 8, fontSize: 11, color: "#f87171", fontFamily: "var(--font-mono)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          ⚽ TEST FUTBOLERO 🇦🇷
        </div>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#475569", letterSpacing: "0.1em", marginBottom: 20, textTransform: "uppercase" }}>
          Previa Argentina vs Argelia
        </p>

        {/* Title */}
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(42px, 12vw, 72px)", fontWeight: 900, lineHeight: 1, margin: "0 0 8px", letterSpacing: "-0.02em", background: "linear-gradient(135deg, #ffffff 0%, #f97316 50%, #ef4444 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          ¿QUÉ TAN<br />TERMO SOS?
        </h1>

        {/* Subtitle */}
        <p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: "#94a3b8", lineHeight: 1.5, margin: "20px 0 32px", maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>
          30 decisiones futboleras.<br />
          Sin respuestas correctas.<br />
          <span style={{ color: "#e2e8f0" }}>Descubrí tu nivel de termismo y tu perfil argento-futbolístico.</span>
        </p>

        {/* Provocations */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 24px", marginBottom: 36, textAlign: "left" }}>
          {[
            "¿El festejo de Qatar 2022 fue el momento más feliz de tu vida adulta?",
            "¿Tu familia ya sabe que en día de clásico no existís?",
            "¿Tu agenda social depende del fixture?",
          ].map((t: string, i: number) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < 2 ? 12 : 0, alignItems: "flex-start" }}>
              <span style={{ color: "#ef4444", marginTop: 1, flexShrink: 0 }}>▶</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#cbd5e1", lineHeight: 1.4 }}>{t}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button onClick={onStart} style={{
          width: "100%", padding: "18px 24px", borderRadius: 14, border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
          fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "0.04em",
          boxShadow: "0 0 40px rgba(239,68,68,0.3), 0 4px 20px rgba(0,0,0,0.4)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
          onMouseEnter={(e: any) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(239,68,68,0.4), 0 8px 30px rgba(0,0,0,0.5)"; }}
          onMouseLeave={(e: any) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(239,68,68,0.3), 0 4px 20px rgba(0,0,0,0.4)"; }}
        >
          EMPEZAR
        </button>

        <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#475569", marginTop: 14 }}>⏱ Menos de 3 minutos · Gratis · 100% argentino</p>
      </div>
    </div>
  );
}

function Juego({ onFinalizar }: any) {
  const [idx, setIdx] = useState(0);
  const [respuestas, setRespuestas] = useState<any[]>([]);
  const [animando, setAnimando] = useState(false);
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(true);

  const pregunta = PREGUNTAS[idx];

  const elegir = (opcion: string) => {
    if (animando) return;
    setSeleccionado(opcion);
    setAnimando(true);
    const nuevas = [...respuestas, { pregunta, opcion }];
    if (idx < PREGUNTAS.length - 1) {
      setFadeIn(false);
      setTimeout(() => {
        setIdx(idx + 1);
        setSeleccionado(null);
        setAnimando(false);
        setFadeIn(true);
        setRespuestas(nuevas);
      }, 220);
    } else {
      setRespuestas(nuevas);
      setTimeout(() => onFinalizar(nuevas), 220);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "20px 0" }}>
      <div style={{ padding: "10px 0 0" }}>
        <ProgressBar current={idx + 1} total={PREGUNTAS.length} />
      </div>

      <div style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "20px", transition: "opacity 0.22s ease-in-out", opacity: fadeIn ? 1 : 0,
      }}>
        <div style={{ maxWidth: 440, width: "100%" }}>

          {/* VS label */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#475569", letterSpacing: "0.2em", textTransform: "uppercase" }}>ELEGÍ UNO</span>
          </div>

          {/* Card A */}
          <OpcionCard
            texto={pregunta.a.texto}
            lado="A"
            seleccionado={seleccionado === "a"}
            rechazado={seleccionado === "b"}
            onClick={() => elegir("a")}
          />

          {/* VS divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, color: "#ef4444", letterSpacing: "0.05em" }}>VS</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Card B */}
          <OpcionCard
            texto={pregunta.b.texto}
            lado="B"
            seleccionado={seleccionado === "b"}
            rechazado={seleccionado === "a"}
            onClick={() => elegir("b")}
          />

          <p style={{ textAlign: "center", marginTop: 20, fontFamily: "var(--font-body)", fontSize: 12, color: "#334155" }}>Tocá para elegir · Sin vuelta atrás</p>
        </div>
      </div>
    </div>
  );
}

function OpcionCard({ texto, lado, seleccionado, rechazado, onClick }: any) {
  const [hovered, setHovered] = useState(false);

  const getBg = () => {
    if (seleccionado) return "linear-gradient(135deg, rgba(239,68,68,0.25), rgba(249,115,22,0.2))";
    if (rechazado) return "rgba(255,255,255,0.01)";
    if (hovered) return "rgba(255,255,255,0.06)";
    return "rgba(255,255,255,0.03)";
  };

  const getBorder = () => {
    if (seleccionado) return "1px solid rgba(239,68,68,0.6)";
    if (rechazado) return "1px solid rgba(255,255,255,0.04)";
    if (hovered) return "1px solid rgba(255,255,255,0.15)";
    return "1px solid rgba(255,255,255,0.07)";
  };

  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", padding: "28px 24px", borderRadius: 18,
        background: getBg(), border: getBorder(), cursor: "pointer",
        transition: "background 0.15s ease, border 0.15s ease, opacity 0.15s ease",
        textAlign: "center",
        opacity: rechazado ? 0.35 : 1,
      }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: seleccionado ? "#f87171" : "#475569", letterSpacing: "0.2em", marginBottom: 8 }}>
        OPCIÓN {lado}
      </div>
      <div style={{
        fontFamily: "var(--font-display)", fontSize: "clamp(22px, 6vw, 30px)", fontWeight: 800,
        color: seleccionado ? "#ffffff" : "#e2e8f0", lineHeight: 1.1, letterSpacing: "-0.01em",
      }}>
        {texto}
      </div>
      {/* Espacio reservado siempre para evitar layout shift */}
      <div style={{ marginTop: 10, fontSize: 20, visibility: seleccionado ? "visible" : "hidden" }}>✓</div>
    </button>
  );
}

function Resultado({ respuestas, onReiniciar }: any) {
  const resultado = calcularResultado(respuestas);
  const { termismoScore, normalized, perfil, pool } = resultado;
  const roasts = useMemo(() => [...(pool as string[])].sort(() => Math.random() - 0.5).slice(0, 3), [perfil.id]);
  const categoria = getCategoria(termismoScore);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) setTimeout(() => setVisible(true), 100);
    track("quiz_completado", {
      perfil: perfil.id,
      score: termismoScore,
      categoria: categoria.label,
    });
  }, []);

  const dimColors = {
    Pasión: "#ef4444", Nostalgia: "#8b5cf6", Romanticismo: "#ec4899",
    Resultadismo: "#f97316", AntiSistema: "#ef4444", Modernidad: "#0ea5e9",
    Racionalidad: "#10b981", Termismo: "#f97316",
  };

  const dimsParaMostrar = ["Pasión", "Nostalgia", "Romanticismo", "Resultadismo", "Modernidad", "Racionalidad"]
    .map(k => ({ label: k, value: normalized[k] || 0, color: (dimColors as any)[k] }));

  const SITE_URL = "https://termo-futbolero.vercel.app";
  const textoCompartir = `Saqué ${termismoScore}/100 en "¿Qué tan termo sos?" 🔥\nPerfil: ${perfil.nombre}\n\n¿Vos qué tan termo sos? 👇`;
  const textoConLink = `${textoCompartir}\n${SITE_URL}`;
  const [descargando, setDescargando] = useState(false);

  const desafiar = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(textoConLink)}`;
    window.open(url, "_blank");
  };

  const compartirX = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(textoCompartir)}&url=${encodeURIComponent(SITE_URL)}`, "_blank");
  };

  const [linkCopiado, setLinkCopiado] = useState(false);

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL);
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 2500);
    } catch { }
  };

  const descargarImagen = async () => {
    if (!cardRef.current) return;
    setDescargando(true);
    try {
      const domtoimage = (await import("dom-to-image-more" as any)).default;
      const dataUrl = await domtoimage.toPng(cardRef.current, {
        quality: 1,
        scale: 2,
        bgcolor: "#090c10",
      });
      // Mobile-friendly download
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        const img = new Image();
        img.src = dataUrl;
        const w = window.open("");
        if (w) { w.document.write(img.outerHTML); w.document.close(); }
      } else {
        const link = document.createElement("a");
        link.download = "que-tan-termo-sos.png";
        link.href = dataUrl;
        link.click();
      }
    } catch (e) {
      console.error("Error al generar imagen:", e);
    } finally {
      setDescargando(false);
    }
  };

  const compartir = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "¿Qué tan termo sos?", text: textoCompartir, url: SITE_URL });
      } else {
        await navigator.clipboard.writeText(textoConLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch { }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "24px 20px 60px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ maxWidth: 440, width: "100%", transition: "opacity 0.6s ease, transform 0.6s ease", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}>

        {/* Card para captura */}
        <div ref={cardRef} style={{ background: "#090c10", padding: "4px 0 4px", borderRadius: 20, overflow: "hidden" }}>
        {/* Score hero */}
        <div style={{ textAlign: "center", marginBottom: 28, padding: "36px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 300, background: `radial-gradient(circle, ${categoria.color}20 0%, transparent 70%)`, pointerEvents: "none" }} />

          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#64748b", letterSpacing: "0.15em", marginBottom: 16, textTransform: "uppercase" }}>
            NIVEL DE TERMISMO
          </div>

          <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(72px, 22vw, 96px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", background: `linear-gradient(135deg, #fff 0%, ${categoria.color} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {termismoScore}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#475569", marginTop: 2, marginBottom: 16 }}>/100</div>

          <div style={{ display: "inline-block", padding: "8px 20px", borderRadius: 99, background: `${categoria.color}20`, border: `1px solid ${categoria.color}40`, fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: categoria.color, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {categoria.emoji} {categoria.label}
          </div>
        </div>

        {/* Perfil */}
        <div style={{ padding: "24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, marginBottom: 20 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#475569", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>TU PERFIL</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900, color: "#f1f5f9", marginBottom: 6, letterSpacing: "-0.01em" }}>
            {perfil.emoji} {perfil.nombre}
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>{perfil.descripcion}</p>

          <div style={{ marginTop: 16, padding: "14px", background: "rgba(255,255,255,0.03)", borderRadius: 12, borderLeft: "3px solid #f97316" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#cbd5e1", lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
              "{perfil.resumen}"
            </p>
          </div>
        </div>

        {/* Dimensiones */}
        <div style={{ padding: "24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, marginBottom: 20 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#475569", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 18 }}>DESGLOSE DE PERSONALIDAD</div>
          {dimsParaMostrar.map(d => <DimBar key={d.label} {...d} />)}
        </div>

        </div>{/* end cardRef */}

        {/* Roasts */}
        <div style={{ padding: "24px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 20, marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#f87171", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>🎯 TE DESCRIBE</div>
          {roasts.map((r: string, i: number) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < roasts.length - 1 ? 12 : 0 }}>
              <span style={{ color: "#ef4444", flexShrink: 0 }}>•</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#e2e8f0", lineHeight: 1.4 }}>{r}</span>
            </div>
          ))}
        </div>

        {/* Desafío viral */}
        <div style={{ padding: "24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "#f1f5f9", marginBottom: 8, letterSpacing: "-0.01em" }}>
            ¿Tus amigos son más termos que vos?
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#64748b", marginBottom: 16 }}>
            Mandales el desafío y que demuestren cuán termos son.
          </p>
          <button onClick={desafiar} style={{
            width: "100%", padding: "16px", borderRadius: 12, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #f97316, #ef4444)",
            fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: "0.04em",
          }}>
            {copied ? "✓ COPIADO AL PORTAPAPELES" : "🔥 DESAFIALOS (WhatsApp)"}
          </button>
        </div>

        {/* Botones de compartir — izquierda: X + Jugar de nuevo | derecha: Guardar + Copiar link */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          {/* Columna izquierda */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "space-between" }}>
            <button onClick={compartirX} style={{
              padding: "14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer",
              background: "rgba(255,255,255,0.05)", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "#e2e8f0",
            }}>
              𝕏  Compartir
            </button>
            <div style={{ flex: 1 }} />
            <button onClick={onReiniciar} style={{
              padding: "14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
              background: "rgba(255,255,255,0.05)", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "#e2e8f0",
            }}>
              🔄 Jugar de nuevo
            </button>
          </div>

          {/* Columna derecha */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <button onClick={descargarImagen} disabled={descargando} style={{
              padding: "14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
              background: "rgba(255,255,255,0.05)", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "#e2e8f0",
            }}>
              {descargando ? "⏳ Generando..." : "📸 Guardar imagen"}
            </button>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#64748b", textAlign: "center", lineHeight: 1.4 }}>
              Guardá la imagen y compartila en Instagram, TikTok o Facebook Stories 📲
            </p>
            <button onClick={copiarLink} style={{
              padding: "14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
              background: "rgba(255,255,255,0.05)", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "#e2e8f0",
            }}>
              {linkCopiado ? "✓ Link copiado" : "🔗 Copiar link"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 14, fontFamily: "var(--font-body)", fontSize: 13, color: "#64748b", lineHeight: 1.4 }}>
          Podés tocar todos los botones que quieras. ¡Compartilo donde quieras! 🚀
        </p>

        <p style={{ textAlign: "center", marginTop: 24, fontFamily: "var(--font-mono)", fontSize: 11, color: "#475569", letterSpacing: "0.1em" }}>
          ¿QUÉ TAN TERMO SOS?
        </p>
        <div style={{ textAlign: "center", marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#94a3b8", letterSpacing: "0.02em", marginBottom: 6 }}>
            Vamos por la cuarta 🏆
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#94a3b8", letterSpacing: "0.02em" }}>
            Elijo creer 🙏
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────

export default function App() {
  const [pantalla, setPantalla] = useState("landing");
  const [respuestas, setRespuestas] = useState<any[]>([]);

  const handleStart = () => setPantalla("juego");
  const handleFinalizar = (r: any) => { setRespuestas(r); setPantalla("resultado"); };
  const handleReiniciar = () => { setRespuestas([]); setPantalla("landing"); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --font-display: 'Bebas Neue', 'Arial Black', sans-serif;
          --font-body: 'DM Sans', -apple-system, sans-serif;
          --font-mono: 'JetBrains Mono', 'Courier New', monospace;
          --bg: #090c10;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

        body {
          background: var(--bg);
          color: #e2e8f0;
          min-height: 100vh;
          font-family: var(--font-body);
          -webkit-font-smoothing: antialiased;
        }

        button { outline: none; }

        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>

      <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <GrainOverlay />
        <div style={{ position: "relative", zIndex: 1 }}>
          {pantalla === "landing" && <Landing onStart={handleStart} />}
          {pantalla === "juego" && <Juego onFinalizar={handleFinalizar} />}
          {pantalla === "resultado" && <Resultado respuestas={respuestas} onReiniciar={handleReiniciar} />}
        </div>
      </div>
    </>
  );
}
