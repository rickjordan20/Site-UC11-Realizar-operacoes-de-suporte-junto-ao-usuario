// Vercel Function — verificação de matrícula no Google Classroom.
// Variáveis privadas configuradas APENAS no painel Vercel.
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const FIREBASE_PROJECT = "uc11---central-de-suporte";
const COURSE_ID = "689889762928";
const ORIGIN = "https://rickjordan20.github.io";
if (!getApps().length) initializeApp({ projectId: FIREBASE_PROJECT });

function reply(res, status, payload) {
  res.status(status).setHeader("Cache-Control", "no-store");
  return res.json(payload);
}

async function classroomToken() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN)
    throw new Error("classroom_not_configured");
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token"
    })
  });
  if (!response.ok) throw new Error("classroom_oauth_failed");
  const json = await response.json();
  if (!json.access_token) throw new Error("classroom_oauth_failed");
  return json.access_token;
}

async function isStudent(googleUserId, accessToken) {
  let pageToken = "";
  let pages = 0;
  do {
    const url = new URL("https://classroom.googleapis.com/v1/courses/" + COURSE_ID + "/students");
    url.searchParams.set("pageSize", "100");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const response = await fetch(url, { headers: { Authorization: "Bearer " + accessToken } });
    if (!response.ok) throw new Error("classroom_roster_failed");
    const data = await response.json();
    if ((data.students || []).some(student => student.userId === googleUserId || student.profile?.id === googleUserId)) return true;
    pageToken = data.nextPageToken || "";
    pages++;
  } while (pageToken && pages < 100);
  if (pageToken) throw new Error("classroom_roster_incomplete");
  return false;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", ORIGIN);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return reply(res, 405, { authorized: false });
  if (req.headers.origin !== ORIGIN) return reply(res, 403, { authorized: false });
  const match = /^Bearer (.+)$/.exec(req.headers.authorization || "");
  if (!match) return reply(res, 401, { authorized: false });
  try {
    const decoded = await getAuth().verifyIdToken(match[1], true);
    const user = await getAuth().getUser(decoded.uid);
    const googleIdentity = user.providerData.find(p => p.providerId === "google.com");
    if (!googleIdentity?.uid) return reply(res, 403, { authorized: false });
    const accessToken = await classroomToken();
    const authorized = await isStudent(googleIdentity.uid, accessToken);
    return reply(res, 200, { authorized });
  } catch (err) {
    // Fail closed; never reveal provider credentials or roster details.
    console.error("Authorization failed:", err.message);
    return reply(res, 503, { authorized: false, error: "verification_unavailable" });
  }
}
