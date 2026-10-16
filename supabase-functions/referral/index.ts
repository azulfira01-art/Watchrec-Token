// Supabase Edge Function: referral
// - Telegram'ın imzaladığı initData'yı BOT_TOKEN ile doğrular (sahte kullanıcı kimliği kabul edilmez)
// - Davet kaydını ve ödül miktarını sunucuda belirler
import { createClient } from "npm:@supabase/supabase-js@2";

const REWARD = 200;                       // davet başına WRGP (tek yerde, sunucuda)
const MAX_AGE_SEC = 7 * 24 * 3600;        // initData en fazla 7 gün eski olabilir
const BOT_TOKEN = Deno.env.get("BOT_TOKEN") ?? "";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const enc = new TextEncoder();
async function hmac(key: ArrayBuffer | Uint8Array, msg: string): Promise<ArrayBuffer> {
  const k = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return crypto.subtle.sign("HMAC", k, enc.encode(msg));
}
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");

// initData geçerliyse Telegram kullanıcısını döndürür, değilse null
async function verify(initData: string): Promise<{ id: number; name: string } | null> {
  if (!BOT_TOKEN || !initData) return null;
  const p = new URLSearchParams(initData);
  const hash = p.get("hash");
  if (!hash) return null;
  p.delete("hash");
  const check = [...p.entries()].map(([k, v]) => `${k}=${v}`).sort().join("\n");
  const secret = await hmac(enc.encode("WebAppData"), BOT_TOKEN);
  const calc = hex(await hmac(secret, check));
  if (calc.length !== hash.length) return null;
  let diff = 0; for (let i = 0; i < calc.length; i++) diff |= calc.charCodeAt(i) ^ hash.charCodeAt(i);
  if (diff !== 0) return null;
  const age = Math.floor(Date.now() / 1000) - Number(p.get("auth_date") || 0);
  if (!(age >= -300 && age <= MAX_AGE_SEC)) return null;
  try {
    const u = JSON.parse(p.get("user") || "{}");
    if (!u.id) return null;
    const name = String(u.username ? "@" + u.username : (u.first_name || "Player")).slice(0, 32);
    return { id: Number(u.id), name };
  } catch { return null; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);
  let body: any; try { body = await req.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }

  const user = await verify(String(body.initData || ""));
  if (!user) return json({ ok: false, error: "unauthorized" }, 401);

  try {
    if (body.action === "register") {
      // Yeni oyuncu bir davet linkiyle geldi: kaydı sunucu yapar.
      const inviter = Number(body.ref);
      if (!Number.isInteger(inviter) || inviter <= 0 || inviter === user.id) return json({ ok: true, result: "invalid" });
      const me = await db.from("players").select("tg_id").eq("tg_id", user.id).maybeSingle();
      if (me.error) throw me.error;
      if (me.data) return json({ ok: true, result: "not_new" });            // zaten oyuncu: davet sayılmaz
      const inv = await db.from("players").select("tg_id").eq("tg_id", inviter).maybeSingle();
      if (inv.error) throw inv.error;
      if (!inv.data) return json({ ok: true, result: "inviter_unknown" });  // davet eden gerçek bir oyuncu değil
      const ins = await db.from("referrals").upsert(
        { invitee_id: user.id, inviter_id: inviter, invitee_name: user.name },
        { onConflict: "invitee_id", ignoreDuplicates: true },
      );
      if (ins.error) throw ins.error;
      return json({ ok: true, result: "registered" });
    }

    if (body.action === "claim") {
      // 1) Eski sürümde (cihazda) ödülü zaten verilmiş davetleri ödenmiş işaretle (ödül verme)
      const old = (Array.isArray(body.paid) ? body.paid : []).map(Number).filter((n: number) => Number.isInteger(n) && n > 0).slice(-500);
      if (old.length) {
        const u0 = await db.from("referrals").update({ paid: true }).eq("inviter_id", user.id).eq("paid", false).in("invitee_id", old);
        if (u0.error) throw u0.error;
      }
      // 2) Ödenmemiş davetleri tek işlemde ödenmiş işaretle ve say (iki cihazda çift ödül olmaz)
      const up = await db.from("referrals").update({ paid: true }).eq("inviter_id", user.id).eq("paid", false).select("invitee_id");
      if (up.error) throw up.error;
      const claimed = (up.data ?? []).map((r: any) => Number(r.invitee_id));
      // 3) Davet listesi (nick'ler)
      const ls = await db.from("referrals").select("invitee_id,invitee_name,created_at").eq("inviter_id", user.id).order("created_at", { ascending: false }).limit(500);
      if (ls.error) throw ls.error;
      return json({ ok: true, reward: REWARD, claimed, gain: claimed.length * REWARD, list: ls.data ?? [] });
    }
    return json({ ok: false, error: "action" }, 400);
  } catch (e) {
    console.error(e);
    return json({ ok: false, error: "server" }, 500);
  }
});
