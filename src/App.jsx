import { useState, useEffect, useRef, useCallback } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,600&family=DM+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;1,300&family=Syne:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#030208;--ink2:#09070f;--deep:#100c1d;--abyss:#060410;
  --surface:#faf9f8;--white:#fff;--off:#f4f2ee;--parchment:#ede8df;
  --gold:#c9a84c;--gold2:#e8c97a;--gold3:#f5e1a4;--gold-d:#8b6d28;
  --rose:#c2566b;--emerald:#2a9d74;--sap:#2563c4;--violet:#7c3aed;
  --muted:#6b6760;--dim:#4a4760;
  --bd:rgba(0,0,0,.07);--bd2:rgba(0,0,0,.13);
  --glow:rgba(201,168,76,.35);
  --glass-l:rgba(255,255,255,.08);--glass-d:rgba(8,5,18,.72);
  --gbl:rgba(255,255,255,.12);--gbd:rgba(255,255,255,.08);
  --serif:'Cormorant Garamond',Georgia,serif;
  --playfair:'Playfair Display',serif;
  --syne:'Syne',sans-serif;
  --disp:'Bebas Neue','Impact',condensed,sans-serif;
  --body:'DM Sans',system-ui,sans-serif;
  --grotesk:'Space Grotesk',sans-serif;
  --nav-h:72px;
}
html{scroll-behavior:smooth}
body{background:var(--surface);color:var(--ink);font-family:var(--body);-webkit-font-smoothing:antialiased;overflow-x:hidden}

/* ═══ KEYFRAMES ═══ */
@keyframes fadeUp{from{opacity:0;transform:translateY(48px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spinCW{to{transform:rotate(360deg)}}
@keyframes spinCCW{to{transform:rotate(-360deg)}}
@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
@keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}40%{transform:translateY(-14px) rotate(.8deg)}70%{transform:translateY(-7px) rotate(-.4deg)}}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes gradDrift{0%{transform:translate(0,0) scale(1)}30%{transform:translate(28px,-20px) scale(1.06)}60%{transform:translate(-16px,24px) scale(.96)}100%{transform:translate(0,0) scale(1)}}
@keyframes orbDrift1{0%{transform:translate(0,0) scale(1)}25%{transform:translate(35px,-25px) scale(1.08)}50%{transform:translate(-14px,34px) scale(.94)}75%{transform:translate(24px,12px) scale(1.05)}100%{transform:translate(0,0) scale(1)}}
@keyframes orbDrift2{0%{transform:translate(0,0)}20%{transform:translate(-28px,18px) scale(1.1)}55%{transform:translate(18px,-28px) scale(.92)}80%{transform:translate(-12px,5px) scale(1.06)}100%{transform:translate(0,0)}}
@keyframes orbDrift3{0%{transform:translate(0,0)}30%{transform:translate(14px,26px) scale(1.07)}60%{transform:translate(-22px,-12px) scale(.96)}100%{transform:translate(0,0)}}
@keyframes marqueeLTR{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes marqueeRTL{from{transform:translateX(-50%)}to{transform:translateX(0)}}
@keyframes scanLine{0%{top:-2px;opacity:.55}45%{opacity:.22}100%{top:108%;opacity:0}}
@keyframes filmGrain{0%{transform:translate(0,0)}12%{transform:translate(-2%,-1%)}24%{transform:translate(1%,0)}36%{transform:translate(0,2%)}48%{transform:translate(-1%,0)}60%{transform:translate(0,-1%)}72%{transform:translate(2%,1%)}84%{transform:translate(-1%,2%)}100%{transform:translate(0,0)}}
@keyframes noiseFlicker{0%,100%{opacity:.04}50%{opacity:.08}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes loaderExit{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.06);pointer-events:none}}
@keyframes dotBounce{0%,100%{transform:translateY(0)}40%{transform:translateY(-10px)}}
@keyframes successPop{0%{transform:scale(0) rotate(-15deg)}70%{transform:scale(1.15) rotate(2deg)}100%{transform:scale(1) rotate(0)}}
@keyframes confettiFly{0%{opacity:1;transform:translateY(0) rotate(0)}100%{opacity:0;transform:translateY(var(--dy)) translateX(var(--dx)) rotate(var(--dr))}}
@keyframes toastSlide{from{transform:translateX(115%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes modalIn{from{opacity:0;transform:scale(.88) translateY(24px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes bladeIn{from{transform:scaleX(0);transform-origin:left}to{transform:scaleX(1);transform-origin:left}}
@keyframes bladeOut{from{transform:scaleX(1);transform-origin:right}to{transform:scaleX(0);transform-origin:right}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 0 0 var(--glow)}50%{box-shadow:0 0 44px 6px var(--glow)}}
@keyframes cardFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-10px) rotate(.4deg)}}
@keyframes imgReveal{from{opacity:0;transform:scale(1.1) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes charIn{from{opacity:0;transform:translateY(110%) skewY(8deg)}to{opacity:1;transform:translateY(0) skewY(0deg)}}
@keyframes lineGrow{from{width:0}to{width:100%}}
@keyframes videoKen{0%{transform:scale(1.08) translateX(0)}100%{transform:scale(1) translateX(-1%)}}
@keyframes counterFlip{0%{transform:rotateX(90deg);opacity:0}100%{transform:rotateX(0);opacity:1}}
@keyframes numRoll{0%{transform:translateY(100%);opacity:0}100%{transform:translateY(0);opacity:1}}
@keyframes numExit{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-100%);opacity:0}}

/* ── LOADER NUMBER ROLL ── */
@keyframes digitRoll{
  0%{transform:translateY(100%);opacity:0;filter:blur(4px)}
  15%{opacity:1;filter:blur(0)}
  85%{opacity:1;filter:blur(0);transform:translateY(0)}
  100%{transform:translateY(0);opacity:1;filter:blur(0)}
}
@keyframes loaderNumIn{
  0%{clip-path:inset(0 0 100% 0);transform:translateY(20px)}
  100%{clip-path:inset(0 0 0% 0);transform:translateY(0)}
}
@keyframes loaderBarFill{from{width:0}to{width:100%}}
@keyframes navLinkHover{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes navSlideIn{from{opacity:0;transform:translateY(-100%)}to{opacity:1;transform:translateY(0)}}
@keyframes glitchX{0%,100%{transform:none}33%{transform:translateX(-2px)}66%{transform:translateX(2px)}}
@keyframes wipeLeft{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes heroTagIn{from{opacity:0;transform:translateX(-20px) scale(.95)}to{opacity:1;transform:translateX(0) scale(1)}}
@keyframes goldSheen{0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes borderDraw{from{stroke-dashoffset:600}to{stroke-dashoffset:0}}
@keyframes navWordmark{0%{letter-spacing:.4em;opacity:0}100%{letter-spacing:-.01em;opacity:1}}

/* ─── ULTRA NAVBAR ─── */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:600;
  height:var(--nav-h);
  transition:all .6s cubic-bezier(.22,1,.36,1);
  display:flex;align-items:center;
  padding:0 clamp(1.2rem,3vw,2.8rem);gap:1.4rem;
}
/* PILL BORDER that appears on scroll — drawn via pseudo */
.nav::before{
  content:'';
  position:absolute;inset:0;
  border-radius:0;
  transition:all .6s cubic-bezier(.22,1,.36,1);
  pointer-events:none;
}
.nav.scrolled{
  background:rgba(4,2,10,.78);
  backdrop-filter:blur(48px) saturate(200%);
  -webkit-backdrop-filter:blur(48px) saturate(200%);
  border-bottom:1px solid rgba(201,168,76,.1);
  box-shadow:0 1px 0 rgba(201,168,76,.06),0 20px 60px rgba(0,0,0,.5);
}
.nav.light-page{
  background:rgba(250,249,248,.82);
  backdrop-filter:blur(40px) saturate(220%);
  -webkit-backdrop-filter:blur(40px) saturate(220%);
  border-bottom:1px solid rgba(0,0,0,.06);
}
.nav.light-page.scrolled{
  background:rgba(250,249,248,.96);
  box-shadow:0 4px 32px rgba(0,0,0,.07);
}

/* NAV LOGO — animated wordmark */
.nav-logo{display:flex;align-items:center;gap:10px;cursor:pointer;flex-shrink:0;position:relative}
.nav-wordmark{
  font-family:var(--syne);font-size:1.38rem;font-weight:800;
  letter-spacing:-.01em;color:#fff;line-height:1;
  transition:color .3s;
  animation:navWordmark .8s .1s cubic-bezier(.22,1,.36,1) both;
  position:relative;
}
.nav.light-page .nav-wordmark{color:var(--ink)}
.nav-wordmark em{
  font-style:normal;
  background:linear-gradient(120deg,var(--gold-d) 0%,var(--gold2) 40%,var(--gold3) 60%,var(--gold) 100%);
  background-size:200% auto;
  animation:goldSheen 3s linear infinite;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
/* Small accent dot next to logo */
.nav-logo-dot{
  width:6px;height:6px;border-radius:50%;
  background:var(--gold2);
  box-shadow:0 0 12px var(--gold),0 0 4px var(--gold2);
  animation:pulse 2.5s ease-in-out infinite;
  flex-shrink:0;
}

/* NAV LINKS — editorial style with draw underline */
.nav-links{display:flex;gap:2px;margin:0 auto;position:relative}
.nav-link{
  background:none;border:none;
  font-family:var(--grotesk);font-size:.8rem;font-weight:500;
  color:rgba(255,255,255,.45);cursor:pointer;
  padding:.5rem 1.1rem;border-radius:10px;
  transition:color .25s;letter-spacing:.01em;
  position:relative;overflow:visible;
}
.nav.light-page .nav-link{color:rgba(0,0,0,.45)}
/* Draw underline on hover */
.nav-link::after{
  content:'';
  position:absolute;bottom:2px;left:50%;right:50%;
  height:1.5px;background:var(--gold);border-radius:2px;
  transition:left .28s cubic-bezier(.22,1,.36,1),right .28s cubic-bezier(.22,1,.36,1);
  opacity:.7;
}
.nav-link:hover::after,.nav-link.active::after{left:16px;right:16px}
.nav-link:hover{color:rgba(255,255,255,.88)}
.nav.light-page .nav-link:hover{color:var(--ink)}
.nav-link.active{color:#fff;font-weight:600}
.nav.light-page .nav-link.active{color:var(--ink)}
/* Active indicator */
.nav-link.active::before{
  content:'';position:absolute;top:6px;right:8px;
  width:4px;height:4px;border-radius:50%;background:var(--gold);
  box-shadow:0 0 8px var(--gold);
}

/* NAV RIGHT */
.nav-right{display:flex;align-items:center;gap:.5rem;flex-shrink:0}
.nav-mobile-toggle{
  display:none;align-items:center;justify-content:center;flex-direction:column;gap:4px;
  width:46px;height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.14);
  background:rgba(255,255,255,.04);cursor:pointer;transition:all .3s cubic-bezier(.22,1,.36,1);
  margin-left:auto;flex-shrink:0;
}
.nav.light-page .nav-mobile-toggle{border-color:var(--bd2);background:rgba(255,255,255,.72)}
.nav-mobile-toggle span{
  width:18px;height:2px;border-radius:999px;background:#fff;
  transition:transform .3s ease,opacity .2s ease,background .3s ease;
}
.nav.light-page .nav-mobile-toggle span{background:var(--ink)}
.nav-mobile-toggle:hover{border-color:rgba(201,168,76,.45);transform:translateY(-1px)}
.nav-mobile-toggle.open span:nth-child(1){transform:translateY(6px) rotate(45deg)}
.nav-mobile-toggle.open span:nth-child(2){opacity:0}
.nav-mobile-toggle.open span:nth-child(3){transform:translateY(-6px) rotate(-45deg)}
.mobile-nav-backdrop{
  position:fixed;inset:0;z-index:580;background:rgba(3,2,8,.58);
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  opacity:0;pointer-events:none;transition:opacity .3s ease;
}
.mobile-nav-backdrop.open{opacity:1;pointer-events:auto}
.mobile-nav-panel{
  position:fixed;top:calc(var(--nav-h) + .65rem);left:1rem;right:1rem;z-index:590;
  background:rgba(10,7,17,.92);border:1px solid rgba(201,168,76,.18);border-radius:26px;
  box-shadow:0 24px 70px rgba(0,0,0,.38);
  backdrop-filter:blur(26px) saturate(160%);-webkit-backdrop-filter:blur(26px) saturate(160%);
  opacity:0;transform:translateY(-12px) scale(.98);transform-origin:top center;
  pointer-events:none;transition:opacity .28s ease,transform .28s cubic-bezier(.22,1,.36,1);
  max-height:calc(100vh - var(--nav-h) - 1.5rem);overflow:auto;
}
.mobile-nav-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}
.mobile-nav-header{
  padding:1rem 1rem .7rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;
  border-bottom:1px solid rgba(255,255,255,.08);
}
.mobile-nav-header strong{font-family:var(--syne);font-size:1rem;color:#fff;letter-spacing:-.01em}
.mobile-nav-header span{font-size:.72rem;color:rgba(255,255,255,.38)}
.mobile-nav-links{display:grid;gap:.45rem;padding:1rem}
.mobile-nav-link{
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:18px;
  padding:.9rem 1rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;
  color:#fff;font-family:var(--grotesk);font-size:.86rem;font-weight:600;cursor:pointer;
  transition:all .25s;text-align:left;
}
.mobile-nav-link.active{border-color:rgba(201,168,76,.38);background:rgba(201,168,76,.12);color:var(--gold2)}
.mobile-nav-link:hover{transform:translateX(4px);border-color:rgba(201,168,76,.28)}
.mobile-nav-link small{font-size:.68rem;color:rgba(255,255,255,.35);font-weight:500}
.mobile-nav-actions{display:grid;gap:.75rem;padding:0 1rem 1rem}
.mobile-nav-actions .nav-saved,
.mobile-nav-actions .nav-ghost,
.mobile-nav-actions .nav-cta{width:100%;justify-content:center}
.mobile-nav-actions .nav-saved{padding:.8rem 1rem;background:rgba(201,168,76,.08);color:#fff}
.mobile-nav-actions .nav-ghost{padding:.82rem 1rem;font-size:.8rem;color:#fff;border-color:rgba(255,255,255,.12)}
.mobile-nav-actions .nav-cta{padding:.82rem 1rem;font-size:.8rem;box-shadow:none}
.mobile-nav-footer{padding:0 1rem 1rem;display:flex;gap:.6rem;flex-wrap:wrap}
.mobile-nav-chip{
  background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:100px;
  padding:.42rem .8rem;font-size:.68rem;color:rgba(255,255,255,.45);
}

/* Ghost with animated border */
.nav-ghost{
  background:none;
  border:1px solid rgba(255,255,255,.15);
  color:rgba(255,255,255,.6);
  font-family:var(--grotesk);font-size:.74rem;font-weight:600;
  padding:.42rem 1.1rem;border-radius:100px;cursor:pointer;
  transition:all .3s cubic-bezier(.34,1.56,.64,1);
  letter-spacing:.02em;position:relative;overflow:hidden;
}
.nav.light-page .nav-ghost{border-color:var(--bd2);color:var(--ink)}
.nav-ghost::before{
  content:'';position:absolute;inset:0;
  background:rgba(201,168,76,.08);
  transform:scaleX(0);transform-origin:left;
  transition:transform .3s cubic-bezier(.22,1,.36,1);
  border-radius:100px;
}
.nav-ghost:hover::before{transform:scaleX(1)}
.nav-ghost:hover{border-color:rgba(201,168,76,.5);color:var(--gold)}

.nav-cta{
  font-family:var(--grotesk);font-size:.76rem;font-weight:700;
  letter-spacing:.04em;text-transform:uppercase;
  background:linear-gradient(135deg,var(--gold-d) 0%,var(--gold) 50%,var(--gold2) 100%);
  background-size:200% auto;
  color:#1a0e00;border:none;
  padding:.48rem 1.4rem;border-radius:100px;cursor:pointer;
  transition:all .35s cubic-bezier(.34,1.56,.64,1);
  position:relative;overflow:hidden;
  box-shadow:0 4px 20px rgba(201,168,76,.32);
}
.nav-cta::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);transform:translateX(-150%);transition:transform .5s}
.nav-cta:hover{background-position:right center;transform:scale(1.06) translateY(-1px);box-shadow:0 10px 32px rgba(201,168,76,.52)}
.nav-cta:hover::after{transform:translateX(150%)}

.nav-saved{
  display:flex;align-items:center;gap:6px;
  background:rgba(201,168,76,.08);
  border:1px solid rgba(201,168,76,.2);
  border-radius:100px;padding:5px 14px 5px 8px;
  cursor:pointer;transition:all .3s cubic-bezier(.34,1.56,.64,1);
  font-size:.74rem;color:rgba(255,255,255,.55);font-family:var(--grotesk);font-weight:600;
}
.nav.light-page .nav-saved{color:var(--muted)}
.nav-saved:hover{background:rgba(201,168,76,.16);border-color:rgba(201,168,76,.45);color:var(--gold);transform:scale(1.03)}
.nav-saved-count{
  min-width:20px;height:20px;border-radius:10px;
  background:linear-gradient(135deg,var(--gold-d),var(--gold));
  color:#1a0e00;font-size:.6rem;font-weight:900;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 2px 8px rgba(201,168,76,.4);
}

/* ═══ LOADER — ULTRA TYPOGRAPHY ═══ */
.loader{position:fixed;inset:0;z-index:9999;background:var(--abyss);display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden}
.loader.exit{animation:loaderExit 1s .1s ease-in-out forwards}
.loader-mesh{position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 30% 20%,rgba(201,168,76,.24),transparent 55%),radial-gradient(ellipse 50% 70% at 80% 80%,rgba(194,86,107,.14),transparent 55%),radial-gradient(ellipse 40% 40% at 60% 50%,rgba(42,157,116,.07),transparent 50%);animation:gradDrift 14s ease-in-out infinite}
.loader-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(201,168,76,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.04) 1px,transparent 1px);background-size:72px 72px}
.loader-scan{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.6),rgba(255,255,255,.3),rgba(201,168,76,.6),transparent);animation:scanLine 2.8s linear infinite;pointer-events:none;z-index:2}
.loader-grain{position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");opacity:.045;animation:noiseFlicker 4s ease-in-out infinite,filmGrain .15s steps(1) infinite;pointer-events:none}

/* BIG WORDMARK */
.loader-wordmark-wrap{position:relative;z-index:1;margin-bottom:clamp(1.5rem,4vh,3rem);text-align:center}
.loader-wordmark{
  font-family:var(--syne);font-weight:800;
  font-size:clamp(3.5rem,9vw,7rem);
  color:#fff;line-height:.88;letter-spacing:-.03em;
  display:block;
}
.loader-wordmark em{
  font-style:normal;
  background:linear-gradient(120deg,var(--gold-d) 0%,var(--gold2) 35%,var(--gold3) 55%,var(--gold) 100%);
  background-size:200% auto;
  animation:goldSheen 2.5s linear infinite;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  filter:drop-shadow(0 0 28px rgba(201,168,76,.5));
}
.loader-eyebrow{
  font-family:var(--body);font-size:clamp(.54rem,.7vw,.64rem);
  letter-spacing:.38em;text-transform:uppercase;
  color:rgba(255,255,255,.18);
  margin-bottom:clamp(.6rem,1.5vh,1rem);
  animation:fadeIn .6s .3s both;position:relative;z-index:1;
}

/* ULTRA NUMBER COUNTER */
.loader-numbers{
  display:flex;gap:0;margin-bottom:clamp(2rem,4vh,3rem);
  position:relative;z-index:1;
  border:1px solid rgba(255,255,255,.06);border-radius:20px;
  overflow:hidden;
  background:rgba(255,255,255,.025);
  backdrop-filter:blur(20px);
}
.loader-stat{
  text-align:center;
  padding:clamp(1rem,2.5vh,1.6rem) clamp(1.5rem,3.5vw,2.8rem);
  position:relative;
}
.loader-stat:not(:last-child)::after{
  content:'';position:absolute;right:0;top:20%;bottom:20%;
  width:1px;background:rgba(255,255,255,.07);
}
/* Number roll animation wrapper */
.loader-num-wrap{overflow:hidden;height:clamp(2.8rem,6vw,5.2rem);display:flex;align-items:center;justify-content:center;margin-bottom:.5rem}
.loader-stat-num{
  font-family:var(--grotesk);
  font-size:clamp(2.4rem,5.5vw,4.8rem);
  font-weight:700;
  letter-spacing:-.04em;
  line-height:1;
  display:block;
  background:linear-gradient(180deg,#fff 0%,rgba(255,255,255,.7) 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  filter:drop-shadow(0 0 20px rgba(201,168,76,.5));
}
.loader-stat-num.gold{
  background:linear-gradient(135deg,var(--gold2),var(--gold3),var(--gold));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  animation:loaderNumIn .6s cubic-bezier(.22,1,.36,1) both;
}
.loader-stat-label{
  font-family:var(--grotesk);font-size:clamp(.54rem,.65vw,.62rem);
  font-weight:600;letter-spacing:.18em;text-transform:uppercase;
  color:rgba(255,255,255,.22);display:block;
}

/* Orb ring */
.loader-orb-ring{position:relative;width:100px;height:100px;margin-bottom:clamp(1.5rem,4vh,3rem);z-index:1}
.lor-ring{position:absolute;border-radius:50%;border:1.5px solid transparent}
.lor1{inset:0;border-top-color:var(--gold);border-right-color:rgba(201,168,76,.08);animation:spinCW 2.2s linear infinite}
.lor2{inset:12px;border-bottom-color:var(--rose);border-left-color:rgba(194,86,107,.06);animation:spinCCW 1.6s linear infinite}
.lor3{inset:24px;border-top-color:var(--emerald);animation:spinCW 2.8s linear infinite}
.lor-core{position:absolute;inset:36px;border-radius:50%;background:radial-gradient(circle,var(--gold2),var(--gold-d));animation:breathe 2.2s ease-in-out infinite;box-shadow:0 0 24px rgba(201,168,76,.5)}

/* Progress */
.loader-bar-wrap{width:clamp(200px,28vw,320px);position:relative;z-index:1}
.loader-bar{height:2px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;margin-bottom:.65rem}
.loader-fill{height:100%;background:linear-gradient(90deg,var(--gold-d),var(--gold),var(--gold2),var(--emerald));background-size:200% 100%;animation:shimmer 1.5s linear infinite;transition:width .4s ease;border-radius:4px}
.loader-status{font-family:var(--grotesk);font-size:.58rem;color:rgba(255,255,255,.18);text-transform:uppercase;letter-spacing:.2em;text-align:center;transition:all .3s}

/* ═══ VIDEO HERO ═══ */
.hero{min-height:100vh;position:relative;overflow:hidden;display:flex;align-items:center;background:var(--abyss)}
.hero-video-wrap{position:absolute;inset:0;z-index:0;overflow:hidden}
.hero-video-wrap video{width:100%;height:100%;object-fit:cover;animation:videoKen 20s ease-in-out infinite alternate;filter:brightness(.32) saturate(1.3);transform-origin:center center}
.hero-video-fallback{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 20% 30%, rgba(201,168,76,.22) 0%, transparent 55%),radial-gradient(ellipse 60% 70% at 80% 70%, rgba(194,86,107,.14) 0%, transparent 55%),radial-gradient(ellipse 50% 50% at 55% 50%, rgba(42,157,116,.1) 0%, transparent 55%),linear-gradient(180deg, #060410 0%, #0d0a1e 50%, #060410 100%);animation:gradDrift 18s ease-in-out infinite}
.hero-orb{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none}
.hero-orb-1{width:700px;height:700px;background:radial-gradient(circle,rgba(201,168,76,.18) 0%,transparent 65%);top:-130px;left:-150px;animation:orbDrift1 20s ease-in-out infinite;z-index:1}
.hero-orb-2{width:520px;height:520px;background:radial-gradient(circle,rgba(194,86,107,.12) 0%,transparent 60%);bottom:-100px;right:-70px;animation:orbDrift2 24s ease-in-out infinite;z-index:1}
.hero-scan{position:absolute;left:0;right:0;height:1.5px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.35) 30%,rgba(255,255,255,.2) 50%,rgba(201,168,76,.35) 70%,transparent);animation:scanLine 7s linear infinite;pointer-events:none;z-index:4}
.hero-grain{position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");opacity:.04;animation:noiseFlicker 3s ease-in-out infinite,filmGrain .18s steps(1) infinite;pointer-events:none;z-index:4}
.hero-vignette{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 25%,rgba(4,2,10,.82) 100%);z-index:2}
.hero-bottom-fade{position:absolute;bottom:0;left:0;right:0;height:240px;background:linear-gradient(to bottom,transparent,var(--abyss));z-index:3;pointer-events:none}
.hero-inner{max-width:1280px;margin:0 auto;padding:clamp(6rem,12vh,10rem) clamp(1.5rem,4vw,3rem) clamp(5rem,8vh,7rem);display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,4vw,5rem);align-items:center;width:100%;position:relative;z-index:5}

/* HERO EYEBROW TAG */
.hero-eyebrow{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(201,168,76,.08);
  border:1px solid rgba(201,168,76,.25);
  border-radius:100px;
  padding:6px 16px 6px 10px;
  margin-bottom:clamp(1rem,2.5vh,1.8rem);
  animation:heroTagIn .7s .12s cubic-bezier(.22,1,.36,1) both;
  position:relative;overflow:hidden;
}
.hero-eyebrow::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(90deg,transparent,rgba(201,168,76,.08),transparent);
  animation:shimmer 3s linear infinite;background-size:200% 100%;
}
.hero-live-dot{width:7px;height:7px;border-radius:50%;background:var(--emerald);box-shadow:0 0 10px var(--emerald);animation:pulse 2s ease-in-out infinite;flex-shrink:0}
.hero-eyebrow span{font-family:var(--grotesk);font-size:clamp(.58rem,.7vw,.72rem);font-weight:600;color:rgba(255,255,255,.6);letter-spacing:.06em;text-transform:uppercase;position:relative;z-index:1}

/* HERO H1 */
.hero-h1{font-size:clamp(3.2rem,7vw,7.2rem);line-height:.9;color:#fff;margin-bottom:clamp(1rem,2.5vh,1.6rem)}
.h1-line{overflow:hidden;display:block;margin-bottom:.08em}
.h1-inner{display:block;animation:charIn .9s cubic-bezier(.22,1,.36,1) both;will-change:transform,opacity}
.h1-line:nth-child(1) .h1-inner{animation-delay:.2s}
.h1-line:nth-child(2) .h1-inner{animation-delay:.35s}
.h1-line:nth-child(3) .h1-inner{animation-delay:.5s}
.h1-line:nth-child(4) .h1-inner{animation-delay:.65s}
.h1-serif{font-family:var(--playfair);font-style:italic;font-weight:700;letter-spacing:-.02em}
.h1-bebas{font-family:var(--disp);font-weight:900;letter-spacing:.06em;text-transform:uppercase}
.h1-syne{font-family:var(--syne);font-weight:800;letter-spacing:-.025em}
.gold-grad{background:linear-gradient(120deg,var(--gold2) 0%,var(--gold3) 40%,var(--gold) 100%);background-size:200% auto;animation:goldSheen 4s linear infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 0 22px rgba(201,168,76,.4))}
.sig-underline{position:relative;display:inline-block}
.sig-underline::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold-d),var(--gold2));border-radius:2px;animation:lineGrow .9s .9s cubic-bezier(.22,1,.36,1) both}

.hero-sub{font-family:var(--body);font-size:clamp(.88rem,1.1vw,1.05rem);color:rgba(255,255,255,.36);line-height:1.9;max-width:460px;margin-bottom:clamp(1.5rem,3vh,2.5rem);font-weight:300;animation:fadeUp .7s .68s both}
.hero-actions{display:flex;gap:.8rem;flex-wrap:wrap;animation:fadeUp .6s .8s both}

/* BUTTONS */
.btn-primary{
  background:linear-gradient(135deg,var(--gold-d),var(--gold),var(--gold2));
  background-size:200% auto;
  color:#1a0e00;border:none;padding:.82rem clamp(1.4rem,2.5vw,2.2rem);
  font-family:var(--grotesk);font-size:clamp(.8rem,.9vw,.9rem);font-weight:700;letter-spacing:.04em;
  border-radius:100px;cursor:pointer;
  box-shadow:0 6px 28px rgba(201,168,76,.42);
  transition:all .35s cubic-bezier(.34,1.56,.64,1);text-transform:uppercase;
  position:relative;overflow:hidden;white-space:nowrap;
}
.btn-primary::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);transform:translateX(-150%);transition:transform .5s}
.btn-primary:hover{transform:translateY(-3px) scale(1.05);box-shadow:0 16px 48px rgba(201,168,76,.6);background-position:right center}
.btn-primary:hover::after{transform:translateX(150%)}

.btn-secondary{
  background:transparent;color:rgba(255,255,255,.72);
  border:1px solid rgba(255,255,255,.16);
  padding:.82rem clamp(1.2rem,2vw,1.8rem);
  font-family:var(--grotesk);font-size:clamp(.78rem,.88vw,.88rem);font-weight:600;
  border-radius:100px;cursor:pointer;transition:all .32s;letter-spacing:.02em;white-space:nowrap;
  position:relative;overflow:hidden;
}
.btn-secondary::before{content:'';position:absolute;inset:0;background:rgba(255,255,255,.04);transform:scaleX(0);transform-origin:left;transition:transform .32s cubic-bezier(.22,1,.36,1);border-radius:100px}
.btn-secondary:hover::before{transform:scaleX(1)}
.btn-secondary:hover{border-color:rgba(255,255,255,.42);color:#fff;transform:translateY(-1px)}

/* HERO STATS */
.hero-stats{display:flex;gap:clamp(1.5rem,3vw,2.8rem);margin-top:clamp(2rem,3.5vh,3rem);padding-top:clamp(1.2rem,2.5vh,2rem);border-top:1px solid rgba(255,255,255,.07);animation:fadeUp .6s .92s both;flex-wrap:wrap}
.h-stat{text-align:center;position:relative}
.h-stat-num{font-family:var(--grotesk);font-size:clamp(1.8rem,2.8vw,2.6rem);font-weight:700;color:var(--gold2);line-height:1;letter-spacing:-.03em;display:block;animation:counterFlip .6s cubic-bezier(.22,1,.36,1) both}
.h-stat-label{font-size:clamp(.58rem,.68vw,.65rem);color:rgba(255,255,255,.2);text-transform:uppercase;letter-spacing:.14em;font-family:var(--grotesk);font-weight:600;margin-top:5px;display:block}

/* HERO RIGHT */
.hero-right{position:relative;height:clamp(440px,65vh,620px);animation:fadeIn .9s .35s both}
.hero-img-main{position:absolute;top:0;left:clamp(1rem,3vw,2rem);right:0;bottom:clamp(3rem,6vh,5rem);border-radius:clamp(16px,2vw,28px);overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.06);animation:imgReveal 1s .45s both}
.hero-img-main img{width:100%;height:100%;object-fit:cover;animation:videoKen 18s ease-in-out infinite alternate}
.hero-img-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 45%,rgba(0,0,0,.7))}
.hero-photo-grid{position:absolute;bottom:0;left:0;width:clamp(120px,18vw,170px);display:grid;grid-template-columns:1fr 1fr;gap:6px;animation:fadeUp .6s .7s both}
.hero-photo-thumb{border-radius:12px;overflow:hidden;height:clamp(60px,8vh,80px);border:2px solid rgba(255,255,255,.12);box-shadow:0 8px 24px rgba(0,0,0,.4)}
.hero-photo-thumb img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
.hero-photo-thumb:hover img{transform:scale(1.08)}

/* Floating cards — UPGRADED */
.hero-card-float{
  position:absolute;
  background:rgba(8,5,18,.72);
  backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);
  border:1px solid rgba(255,255,255,.1);
  border-radius:clamp(14px,1.8vw,20px);
  padding:clamp(10px,1.5vw,16px) clamp(12px,1.8vw,20px);
  animation:cardFloat 6s ease-in-out infinite;
  z-index:2;
  box-shadow:0 24px 60px rgba(0,0,0,.4);
  transition:transform .3s cubic-bezier(.22,1,.36,1);
}
.hero-card-float:hover{transform:translateY(-6px) scale(1.02)!important}
.hero-card-1{bottom:clamp(3.5rem,7vh,6rem);left:clamp(.5rem,1vw,0px);right:clamp(6rem,12vw,100px);animation-delay:0s}
.hero-card-2{top:clamp(1.5rem,3vw,2.5rem);right:clamp(-1rem,-1.5vw,-1.5rem);width:clamp(150px,18vw,190px);animation-delay:-3s}
.hero-card-3{top:45%;left:clamp(-1.5rem,-2vw,-2rem);transform:translateY(-50%);animation-delay:-1.5s;padding:clamp(8px,1vw,11px) clamp(10px,1.4vw,15px)}
.hc-title{font-family:var(--grotesk);font-size:clamp(.75rem,.88vw,.84rem);font-weight:600;color:#fff;margin-bottom:3px}
.hc-sub{font-size:clamp(.62rem,.72vw,.7rem);color:rgba(255,255,255,.35)}
.hc-dot{width:7px;height:7px;border-radius:50%;background:var(--emerald);animation:pulse 2s ease-in-out infinite;box-shadow:0 0 10px var(--emerald);flex-shrink:0}

/* ═══ JOB CARDS — ULTRA ═══ */
.jobs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(clamp(280px,30vw,360px),1fr));gap:clamp(.8rem,1.5vw,1.2rem)}
.job-card{
  background:var(--white);
  border:1px solid var(--bd);
  border-radius:clamp(18px,2.2vw,24px);
  padding:clamp(1.3rem,2vw,1.9rem);
  cursor:pointer;position:relative;overflow:hidden;
  transition:border-color .4s,box-shadow .4s,transform .4s cubic-bezier(.22,1,.36,1);
  transform-style:preserve-3d;will-change:transform;
}
/* Animated top bar */
.job-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2.5px;
  background:linear-gradient(90deg,var(--gold-d),var(--gold2),var(--emerald));
  transform:scaleX(0);transform-origin:left;
  transition:transform .5s cubic-bezier(.22,1,.36,1);
}
/* Radial mouse glow */
.job-card::after{
  content:'';position:absolute;inset:0;
  background:radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(201,168,76,.07), transparent 60%);
  opacity:0;transition:opacity .35s;pointer-events:none;border-radius:24px;
}
.job-card:hover{border-color:rgba(201,168,76,.35);box-shadow:0 32px 72px rgba(0,0,0,.1),0 0 0 1px rgba(201,168,76,.12)}
.job-card:hover::before{transform:scaleX(1)}
.job-card:hover::after{opacity:1}
.job-card.featured{background:linear-gradient(165deg,#fffdf8,#faf8f0);border-color:rgba(201,168,76,.3);box-shadow:0 8px 40px rgba(201,168,76,.1)}
.job-feat-badge{
  display:inline-flex;align-items:center;gap:5px;
  background:linear-gradient(135deg,var(--gold-d),var(--gold));
  color:#1a0e00;font-family:var(--grotesk);font-size:.6rem;font-weight:700;
  padding:4px 12px;border-radius:100px;letter-spacing:.07em;text-transform:uppercase;margin-bottom:.9rem;
  box-shadow:0 4px 12px rgba(201,168,76,.3);
}
.jc-row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem}
.job-title{font-family:var(--syne);font-size:clamp(.9rem,1.1vw,1.02rem);font-weight:800;margin-bottom:.22rem;letter-spacing:-.01em}
.job-co{font-size:clamp(.72rem,.82vw,.78rem);color:var(--muted)}
.save-btn{width:34px;height:34px;border-radius:10px;background:none;border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;color:var(--muted);transition:all .32s cubic-bezier(.34,1.56,.64,1);flex-shrink:0}
.save-btn:hover,.save-btn.saved{background:rgba(201,168,76,.1);border-color:rgba(201,168,76,.4);color:var(--gold);transform:scale(1.18)}
.tags{display:flex;flex-wrap:wrap;gap:.38rem;margin-bottom:1rem}
.tag{font-family:var(--grotesk);font-size:.64rem;font-weight:600;padding:.26rem .78rem;border-radius:100px;letter-spacing:.02em}
.t-full{background:#e6f3ee;color:#1a6b4a}
.t-remote{background:#ede9fd;color:#5b3ea8}
.t-level{background:#f0eeea;color:#5a5750}
.t-gold{background:linear-gradient(135deg,var(--gold-d),var(--gold));color:#fff}
.jc-footer{display:flex;justify-content:space-between;align-items:center;padding-top:1rem;border-top:1px solid var(--bd)}
.j-salary{font-family:var(--grotesk);font-weight:700;font-size:clamp(.88rem,1vw,.96rem);color:var(--gold-d);letter-spacing:-.01em}
.j-date{font-size:.71rem;color:var(--muted)}

/* ═══ COMPANY CARDS — ULTRA ═══ */
.co-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(clamp(260px,28vw,340px),1fr));gap:clamp(.8rem,1.5vw,1.2rem)}
.co-card{
  background:var(--white);border:1px solid var(--bd);
  border-radius:clamp(18px,2.2vw,24px);overflow:hidden;
  cursor:pointer;transition:all .42s cubic-bezier(.22,1,.36,1);
  position:relative;
}
.co-card::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(201,168,76,.04),transparent 50%);opacity:0;transition:opacity .35s;pointer-events:none}
.co-card:hover{border-color:rgba(201,168,76,.32);transform:translateY(-10px) scale(1.01);box-shadow:0 30px 64px rgba(0,0,0,.12),0 0 0 1px rgba(201,168,76,.1)}
.co-card:hover::after{opacity:1}
.co-banner{height:clamp(90px,11vw,112px);overflow:hidden;position:relative}
.co-banner img{width:100%;height:100%;object-fit:cover;transition:transform .6s ease}
.co-card:hover .co-banner img{transform:scale(1.08)}
.co-banner-overlay{position:absolute;inset:0;background:rgba(0,0,0,.24)}
.co-body{padding:clamp(.9rem,1.5vw,1.2rem)}
.co-header{display:flex;align-items:center;gap:.88rem;margin-bottom:.82rem}
.co-logo{width:48px;height:48px;border-radius:14px;overflow:hidden;margin-top:-32px;position:relative;z-index:1;border:2.5px solid var(--white);box-shadow:0 6px 20px rgba(0,0,0,.18)}
.co-logo img{width:100%;height:100%;object-fit:cover}
.co-name{font-family:var(--syne);font-size:clamp(.9rem,1.1vw,1rem);font-weight:800;letter-spacing:-.01em}
.co-ind{font-size:clamp(.68rem,.78vw,.74rem);color:var(--muted)}
.co-desc{font-size:clamp(.76rem,.88vw,.82rem);line-height:1.72;color:var(--muted);margin-bottom:.88rem}
.co-footer{display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--bd);padding-top:.8rem}
.roles-chip{background:linear-gradient(135deg,var(--gold-d),var(--gold));color:#fff;font-family:var(--grotesk);font-size:.68rem;font-weight:700;padding:.26rem .85rem;border-radius:100px;box-shadow:0 3px 10px rgba(201,168,76,.28)}
.co-size{font-size:.73rem;color:var(--muted)}

/* ═══ CATEGORY PILLS — ULTRA ═══ */
.cat-scroll{display:flex;gap:.9rem;overflow-x:auto;padding-bottom:.5rem;scrollbar-width:none}
.cat-scroll::-webkit-scrollbar{display:none}
.cat-pill{
  flex-shrink:0;display:flex;align-items:center;gap:.55rem;
  background:var(--white);border:1px solid var(--bd);
  border-radius:100px;padding:.6rem 1.3rem;
  cursor:pointer;transition:all .38s cubic-bezier(.22,1,.36,1);white-space:nowrap;
  position:relative;overflow:hidden;
}
.cat-pill::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(201,168,76,.06),rgba(201,168,76,.02));opacity:0;transition:opacity .3s;border-radius:100px}
.cat-pill:hover::before{opacity:1}
.cat-pill:hover{border-color:var(--gold);transform:translateY(-5px) scale(1.04);box-shadow:0 12px 30px rgba(201,168,76,.2)}
.cat-pill-icon{font-size:1.05rem}
.cat-pill-label{font-family:var(--grotesk);font-size:clamp(.76rem,.88vw,.84rem);font-weight:600;letter-spacing:.01em;color:var(--ink)}
.cat-pill-count{font-size:.68rem;color:var(--muted)}

/* ═══ PHOTO STRIP / BENTO ═══ */
.photo-strip{background:var(--abyss);padding:clamp(4rem,7vh,6rem) 0;overflow:hidden;position:relative}
.photo-strip-orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;background:radial-gradient(circle,rgba(201,168,76,.1),transparent 65%);width:400px;height:400px;top:10%;left:5%;animation:orbDrift1 22s ease-in-out infinite}
.photo-strip-scan{position:absolute;left:0;right:0;height:1.5px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.28) 30%,rgba(255,255,255,.14) 50%,rgba(201,168,76,.28) 70%,transparent);animation:scanLine 8s linear infinite;pointer-events:none;z-index:2}
.photo-strip-head{max-width:1280px;margin:0 auto;padding:0 clamp(1.5rem,4vw,3rem) clamp(2rem,3.5vh,3rem);display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;position:relative;z-index:3}
.ps-label{font-family:var(--body);font-size:clamp(.58rem,.7vw,.65rem);font-weight:700;color:var(--gold);letter-spacing:.28em;text-transform:uppercase;display:flex;align-items:center;gap:.55rem;margin-bottom:.7rem}
.ps-label::before{content:'';width:22px;height:1px;background:var(--gold)}
.ps-title{font-family:var(--playfair);font-size:clamp(2rem,3.5vw,3.2rem);font-weight:700;font-style:italic;color:#fff;line-height:1}
.ps-title em{font-style:normal;font-family:var(--syne);font-weight:800;background:linear-gradient(120deg,var(--gold2),var(--gold3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ps-sub{font-size:clamp(.8rem,.95vw,.9rem);color:rgba(255,255,255,.28);font-weight:300}
.photo-bento{max-width:1280px;margin:0 auto;padding:0 clamp(1.5rem,4vw,3rem);display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:repeat(2,clamp(160px,20vw,220px));gap:clamp(8px,1.2vw,14px);position:relative;z-index:3}
.pb-item{border-radius:clamp(14px,1.8vw,22px);overflow:hidden;position:relative;cursor:pointer}
.pb-item img{width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.22,1,.36,1)}
.pb-item:hover img{transform:scale(1.08)}
.pb-item::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.65),transparent 55%);opacity:0;transition:opacity .35s}
.pb-item:hover::after{opacity:1}
.pb-label{position:absolute;bottom:0;left:0;right:0;padding:clamp(.6rem,1vw,1rem) clamp(.8rem,1.2vw,1.2rem);transform:translateY(4px);opacity:0;transition:all .35s;z-index:1}
.pb-item:hover .pb-label{opacity:1;transform:translateY(0)}
.pb-label-title{font-family:var(--grotesk);font-size:clamp(.78rem,.9vw,.88rem);font-weight:700;color:#fff}
.pb-label-sub{font-size:clamp(.62rem,.7vw,.7rem);color:rgba(255,255,255,.5)}
.pb-a{grid-column:span 4;grid-row:span 2}
.pb-b{grid-column:span 3;grid-row:span 1}
.pb-c{grid-column:span 5;grid-row:span 1}
.pb-d{grid-column:span 3;grid-row:span 1}
.pb-e{grid-column:span 5;grid-row:span 1}

/* ═══ MARQUEE ═══ */
.marquee-wrap{background:var(--ink2);padding:1.3rem 0;overflow:hidden;border-top:1px solid rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.04)}
.marquee-track{display:flex;width:max-content}
.marquee-track.ltr{animation:marqueeLTR 28s linear infinite}
.marquee-track.rtl{animation:marqueeRTL 28s linear infinite}
.marquee-item{display:flex;align-items:center;gap:.75rem;padding:0 2.2rem;white-space:nowrap;font-family:var(--grotesk);font-size:clamp(.78rem,.88vw,.88rem);font-weight:600;color:rgba(255,255,255,.16);text-transform:uppercase;letter-spacing:.12em}
.marquee-item .m-dot{width:4px;height:4px;border-radius:50%;background:var(--gold);opacity:.6}
.marquee-item.gold{color:rgba(201,168,76,.5)}

/* ═══ SECTIONS ═══ */
.section{max-width:1280px;margin:0 auto;padding:clamp(4rem,7vh,6rem) clamp(1.5rem,4vw,2.5rem)}
.sec-label{font-family:var(--body);font-size:clamp(.58rem,.7vw,.65rem);font-weight:700;color:var(--gold);letter-spacing:.28em;text-transform:uppercase;margin-bottom:.9rem;display:flex;align-items:center;gap:.55rem}
.sec-label::before{content:'';width:22px;height:1px;background:var(--gold)}
.sec-title{font-family:var(--syne);font-size:clamp(2rem,4.5vw,3.8rem);font-weight:800;letter-spacing:-.02em;line-height:.96}
.sec-title em{font-style:normal;background:linear-gradient(120deg,var(--gold2),var(--gold3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sec-title-serif{font-family:var(--playfair);font-style:italic;font-weight:700;font-size:clamp(2rem,4.5vw,3.8rem);line-height:.96}
.dark-title{color:#fff}
.dark-sub{color:rgba(255,255,255,.3)}
.sec-sub{font-size:clamp(.82rem,.95vw,.92rem);color:var(--muted);line-height:1.85;max-width:480px;margin-top:.75rem;font-weight:300}
.sec-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:clamp(2rem,3.5vh,3rem);gap:1.5rem;flex-wrap:wrap}
.link-btn{background:none;border:1px solid var(--bd2);color:var(--muted);font-family:var(--grotesk);font-size:.75rem;font-weight:600;padding:.44rem 1rem;border-radius:100px;cursor:pointer;transition:all .28s}
.link-btn:hover{border-color:var(--gold);color:var(--gold)}
.dark-link{border-color:rgba(255,255,255,.12);color:rgba(255,255,255,.35)}
.dark-link:hover{border-color:var(--gold);color:var(--gold)}

/* ═══ TESTIMONIALS ═══ */
.testi-scroll{display:flex;gap:1.2rem;animation:marqueeLTR 44s linear infinite;width:max-content;padding:.5rem 0}
.testi-card{flex-shrink:0;width:clamp(260px,28vw,310px);background:var(--white);border:1px solid var(--bd);border-radius:clamp(18px,2.2vw,24px);padding:clamp(1.2rem,1.8vw,1.6rem);transition:transform .35s,box-shadow .35s}
.testi-card:hover{transform:translateY(-8px);box-shadow:0 20px 52px rgba(0,0,0,.1)}
.testi-quote{font-family:var(--serif);font-size:clamp(.88rem,.98vw,.96rem);line-height:1.85;color:var(--ink);font-style:italic;margin-bottom:1rem}
.testi-author{display:flex;align-items:center;gap:.75rem}
.testi-avatar{width:38px;height:38px;border-radius:50%;overflow:hidden;flex-shrink:0}
.testi-avatar img{width:100%;height:100%;object-fit:cover}
.testi-name{font-family:var(--grotesk);font-size:.78rem;font-weight:600}
.testi-role{font-size:.7rem;color:var(--muted)}
.stars{color:var(--gold);font-size:.75rem;margin-bottom:.62rem;letter-spacing:2px}

/* ═══ TYPOGRAPHY STATEMENT SECTION ═══ */
.typo-hero{padding:clamp(5rem,9vh,8rem) clamp(1.5rem,4vw,3rem);background:var(--abyss);position:relative;overflow:hidden;text-align:center}
.typo-mesh{position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(201,168,76,.12),transparent 60%);pointer-events:none}
.typo-grain{position:absolute;inset:0;opacity:.04;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");animation:filmGrain .18s steps(1) infinite}
.typo-hero-inner{max-width:1000px;margin:0 auto;position:relative;z-index:1}
.typo-big{font-family:var(--playfair);font-style:italic;font-weight:900;font-size:clamp(3rem,7vw,7rem);color:#fff;line-height:.9;letter-spacing:-.02em;margin-bottom:clamp(.5rem,1.5vh,1rem)}
.typo-big-2{font-family:var(--disp);font-weight:900;font-size:clamp(4rem,9vw,9rem);line-height:.88;letter-spacing:.04em;background:linear-gradient(120deg,var(--gold2),var(--gold3),var(--gold));background-size:200% auto;animation:goldSheen 4s linear infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 0 30px rgba(201,168,76,.35))}
.typo-small-text{font-family:var(--grotesk);font-size:clamp(.82rem,.95vw,.9rem);color:rgba(255,255,255,.3);font-weight:300;letter-spacing:.2em;text-transform:uppercase;margin:clamp(1rem,2vh,1.5rem) auto;max-width:460px;line-height:2}
.typo-sig{font-family:var(--playfair);font-style:italic;font-size:clamp(1.2rem,2vw,1.8rem);color:rgba(255,255,255,.22);margin-top:clamp(.5rem,1.5vh,1rem)}

/* ═══ PLANS ═══ */
.plans-hero{text-align:center;padding:clamp(5rem,9vh,7rem) 2.5rem clamp(3rem,5vh,4rem);background:var(--ink2);position:relative;overflow:hidden}
.plans-hero-mesh{position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 30%,rgba(201,168,76,.18),transparent 55%);pointer-events:none}
.billing-toggle{display:inline-flex;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:100px;padding:4px;margin-bottom:3rem}
.billing-opt{background:none;border:none;padding:.5rem 1.4rem;border-radius:100px;font-family:var(--grotesk);font-size:.78rem;font-weight:600;cursor:pointer;color:rgba(255,255,255,.35);transition:all .3s}
.billing-opt.active{background:var(--white);color:var(--ink)}
.plans-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(clamp(220px,22vw,260px),1fr));gap:1.2rem;max-width:1200px;margin:0 auto;padding:0 2.5rem clamp(4rem,7vh,6rem)}
.plans-section{background:var(--off);padding:clamp(4rem,7vh,6rem) 2.5rem}
.plans-faq-wrap{max-width:760px;margin:0 auto}
.plan-card{background:var(--white);border:1px solid var(--bd);border-radius:clamp(18px,2.5vw,26px);padding:clamp(1.5rem,2vw,2.2rem);position:relative;overflow:hidden;transition:all .42s cubic-bezier(.22,1,.36,1)}
.plan-card:hover{transform:translateY(-10px);box-shadow:0 32px 64px rgba(0,0,0,.1)}
.plan-card.dark-card{background:linear-gradient(165deg,#0f0c1a,#1a1528);border-color:rgba(201,168,76,.38);color:#fff;box-shadow:0 18px 52px rgba(201,168,76,.16);animation:glowPulse 5s ease-in-out infinite}
.plan-badge{position:absolute;top:1.2rem;right:1.2rem;background:linear-gradient(135deg,var(--gold-d),var(--gold));color:#1a0e00;font-family:var(--grotesk);font-size:.6rem;font-weight:800;padding:4px 10px;border-radius:100px;letter-spacing:.07em;text-transform:uppercase}
.plan-tier{font-family:var(--body);font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:.4rem}
.dark-card .plan-tier{color:rgba(255,255,255,.3)}
.plan-name{font-family:var(--syne);font-size:clamp(1.4rem,1.8vw,1.7rem);font-weight:800;letter-spacing:-.02em;margin-bottom:.3rem}
.dark-card .plan-name{color:#fff}
.plan-desc{font-size:.81rem;color:var(--muted);margin-bottom:1.6rem;line-height:1.68}
.dark-card .plan-desc{color:rgba(255,255,255,.35)}
.plan-price{font-family:var(--grotesk);font-size:clamp(2.4rem,3.5vw,3.2rem);font-weight:700;letter-spacing:-.04em;line-height:1;color:var(--ink);margin-bottom:.3rem}
.dark-card .plan-price{color:#fff}
.plan-period{font-size:.8rem;color:var(--muted)}
.dark-card .plan-period{color:rgba(255,255,255,.3)}
.plan-divider{border:none;border-top:1px solid var(--bd);margin:1.5rem 0}
.dark-card .plan-divider{border-color:rgba(255,255,255,.08)}
.plan-features{list-style:none;margin-bottom:2rem}
.plan-feat{display:flex;align-items:flex-start;gap:.65rem;padding:.4rem 0;font-size:.81rem;line-height:1.58}
.feat-check{width:18px;height:18px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:9px;margin-top:1px}
.feat-yes{background:#e6f3ee;color:#1a6b4a}
.dark-card .feat-yes{background:rgba(42,157,116,.2);color:var(--emerald)}
.feat-no{background:var(--off);color:var(--muted)}
.feat-text{color:var(--ink)}
.dark-card .feat-text{color:rgba(255,255,255,.7)}
.feat-text.dim{color:var(--muted);text-decoration:line-through}
.dark-card .feat-text.dim{color:rgba(255,255,255,.2)}
.plan-btn{width:100%;padding:.9rem;border-radius:14px;font-family:var(--grotesk);font-size:.9rem;font-weight:700;cursor:pointer;transition:all .3s cubic-bezier(.34,1.56,.64,1);letter-spacing:.03em;border:none;text-transform:uppercase}
.pb-outline{background:none;border:1px solid var(--bd2);color:var(--ink)}
.pb-outline:hover{border-color:var(--gold);color:var(--gold-d);background:rgba(201,168,76,.04)}
.pb-gold{background:linear-gradient(135deg,var(--gold-d),var(--gold),var(--gold2));color:#1a0e00;box-shadow:0 6px 24px rgba(201,168,76,.38)}
.pb-gold:hover{transform:translateY(-2px);box-shadow:0 12px 38px rgba(201,168,76,.52)}
.pb-dark{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.15)}
.pb-dark:hover{background:rgba(255,255,255,.18);transform:translateY(-2px)}
.pb-emerald{background:linear-gradient(135deg,#1b7a58,var(--emerald));color:#fff;box-shadow:0 6px 24px rgba(42,157,116,.3)}
.pb-emerald:hover{transform:translateY(-2px);box-shadow:0 12px 34px rgba(42,157,116,.48)}

/* AUTH */
.auth-page{min-height:100vh;display:grid;grid-template-columns:1fr 1fr}
.auth-left{background:var(--ink2);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:3rem}
.auth-mesh{position:absolute;inset:0;background:radial-gradient(ellipse 60% 60% at 30% 40%,rgba(201,168,76,.2),transparent 55%),radial-gradient(ellipse 40% 50% at 80% 80%,rgba(194,86,107,.12),transparent 50%);animation:gradDrift 14s ease-in-out infinite}
.auth-left-content{position:relative;z-index:1;text-align:center;max-width:380px}
.auth-left-logo{font-family:var(--syne);font-size:2.4rem;font-weight:800;color:#fff;margin-bottom:1.5rem;letter-spacing:-.02em}
.auth-left-logo em{background:linear-gradient(135deg,var(--gold2),var(--gold3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-style:normal}
.auth-left-title{font-family:var(--playfair);font-size:2rem;color:#fff;line-height:1.2;margin-bottom:.9rem;font-style:italic}
.auth-left-sub{font-size:.87rem;color:rgba(255,255,255,.35);line-height:1.88;font-weight:300;margin-bottom:2.5rem}
.als-num{font-family:var(--grotesk);font-size:1.9rem;letter-spacing:-.03em;color:var(--gold2);display:block;font-weight:700}
.als-label{font-family:var(--body);font-size:.63rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.25)}
.auth-right{display:flex;align-items:center;justify-content:center;padding:3rem;background:var(--surface)}
.auth-box{width:100%;max-width:400px}
.auth-tabs{display:flex;background:var(--off);border-radius:12px;padding:4px;margin-bottom:2.5rem}
.auth-tab{flex:1;padding:.6rem;background:none;border:none;font-family:var(--grotesk);font-size:.8rem;font-weight:600;cursor:pointer;border-radius:9px;color:var(--muted);transition:all .3s}
.auth-tab.active{background:var(--white);color:var(--ink);box-shadow:0 2px 8px rgba(0,0,0,.08)}
.auth-title{font-family:var(--syne);font-size:clamp(1.6rem,2.5vw,2rem);font-weight:800;letter-spacing:-.02em;margin-bottom:.4rem}
.auth-sub{font-size:.83rem;color:var(--muted);margin-bottom:2rem;line-height:1.72}
.form-group{margin-bottom:1.1rem}
.form-label{font-family:var(--body);font-size:.66rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:.38rem}
.form-input{width:100%;border:1.5px solid var(--bd);border-radius:12px;padding:.8rem 1rem;font-family:var(--body);font-size:.87rem;background:var(--white);color:var(--ink);outline:none;transition:all .25s}
.form-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,.1)}
.form-input::placeholder{color:rgba(0,0,0,.24)}
.auth-submit{width:100%;background:linear-gradient(135deg,var(--gold-d),var(--gold),var(--gold2));color:#1a0e00;border:none;padding:.9rem;font-family:var(--grotesk);font-size:.9rem;font-weight:700;border-radius:12px;cursor:pointer;box-shadow:0 6px 24px rgba(201,168,76,.32);transition:all .3s;letter-spacing:.03em;text-transform:uppercase;margin-top:.5rem}
.auth-submit:hover{transform:translateY(-1px);box-shadow:0 12px 34px rgba(201,168,76,.48)}
.auth-divider{display:flex;align-items:center;gap:.8rem;margin:1.5rem 0}
.auth-divider-line{flex:1;height:1px;background:var(--bd)}
.auth-divider-text{font-size:.76rem;color:var(--muted)}
.social-auth{display:flex;gap:.62rem}
.social-auth-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:.5rem;background:var(--white);border:1.5px solid var(--bd);border-radius:12px;padding:.72rem;cursor:pointer;transition:all .25s;font-family:var(--grotesk);font-size:.78rem;font-weight:600;color:var(--ink)}
.social-auth-btn:hover{border-color:var(--bd2);background:var(--off)}
.auth-name-grid{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}
.forgot-link{font-size:.77rem;color:var(--gold-d);cursor:pointer;text-align:right;margin-top:.3rem;display:block;font-weight:600}
.auth-footer{text-align:center;font-size:.79rem;color:var(--muted);margin-top:1.5rem}
.auth-footer a{color:var(--gold-d);cursor:pointer;font-weight:700}

/* LISTINGS, DETAIL, RESUME, CONTACT, SOCIAL, PAYMENT etc */
.listings-layout{display:flex;gap:2rem;max-width:1280px;margin:0 auto;padding:2.5rem clamp(1.5rem,4vw,2.5rem)}
.sidebar{width:240px;flex-shrink:0;background:var(--white);border:1px solid var(--bd);border-radius:20px;padding:1.6rem;height:fit-content;position:sticky;top:calc(var(--nav-h) + 1rem)}
.sb-title{font-family:var(--syne);font-size:1rem;font-weight:800;letter-spacing:-.01em;margin-bottom:1.5rem}
.filter-group{margin-bottom:1.4rem}
.filter-label{font-family:var(--body);font-size:.64rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:.62rem;display:block}
.filter-opt{display:flex;align-items:center;gap:.5rem;margin-bottom:.4rem;cursor:pointer}
.filter-opt input[type=checkbox]{accent-color:var(--gold-d);width:14px;height:14px;cursor:pointer}
.filter-opt span{font-size:.82rem}
.range-wrap{display:flex;flex-direction:column;gap:.34rem}
input[type=range]{width:100%;accent-color:var(--gold-d)}
.range-value{font-family:var(--grotesk);font-size:.8rem;font-weight:700;color:var(--gold-d)}
.reset-btn{width:100%;padding:.54rem;background:none;border:1px solid var(--bd);font-family:var(--grotesk);font-size:.76rem;font-weight:600;border-radius:10px;cursor:pointer;transition:all .25s;color:var(--muted)}
.reset-btn:hover{border-color:var(--gold);color:var(--gold-d)}
.listings-main{flex:1;min-width:0}
.list-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem}
.list-count{font-size:.83rem;color:var(--muted)}
.list-count strong{color:var(--ink)}
.sort-select{border:1px solid var(--bd);background:var(--white);font-family:var(--body);font-size:.8rem;padding:.4rem .8rem;border-radius:10px;color:var(--ink);outline:none;cursor:pointer}
.list-row{background:var(--white);border:1px solid var(--bd);border-radius:clamp(12px,1.5vw,16px);padding:clamp(.9rem,1.5vw,1.2rem) clamp(1rem,2vw,1.5rem);display:flex;align-items:center;gap:1rem;cursor:pointer;transition:all .32s cubic-bezier(.22,1,.36,1);margin-bottom:.72rem}
.list-row:hover{border-color:rgba(201,168,76,.3);box-shadow:0 12px 32px rgba(0,0,0,.07);transform:translateX(6px)}
.list-info{flex:1;min-width:0}
.list-title{font-family:var(--syne);font-size:clamp(.88rem,1vw,.98rem);font-weight:800;letter-spacing:-.01em}
.list-meta{display:flex;align-items:center;gap:.52rem;margin-top:.26rem;flex-wrap:wrap}
.list-meta span{font-size:clamp(.7rem,.8vw,.76rem);color:var(--muted)}
.list-right{text-align:right;flex-shrink:0}
.detail-layout{max-width:1100px;margin:0 auto;padding:2.5rem clamp(1.5rem,4vw,2.5rem);display:flex;gap:2rem}
.detail-main{flex:1;min-width:0}
.detail-side{width:282px;flex-shrink:0}
.detail-header{background:var(--white);border:1px solid var(--bd);border-radius:clamp(16px,2vw,22px);padding:clamp(1.4rem,2vw,2.2rem);margin-bottom:1.2rem;position:relative;overflow:hidden}
.detail-header::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold-d),var(--gold2))}
.d-logo-row{display:flex;align-items:center;gap:1.2rem;margin-bottom:1.5rem}
.d-title{font-family:var(--syne);font-size:clamp(1.4rem,2.5vw,1.9rem);font-weight:800;letter-spacing:-.02em;margin-bottom:.32rem;line-height:1}
.d-company{font-size:.87rem;color:var(--gold-d);cursor:pointer;font-weight:600;transition:color .2s}
.d-company:hover{color:var(--gold);text-decoration:underline}
.d-tags{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.2rem;padding-top:1.2rem;border-top:1px solid var(--bd)}
.d-fact{display:flex;align-items:center;gap:.35rem;font-size:.77rem;background:var(--off);padding:.3rem .78rem;border-radius:100px;transition:all .2s;cursor:default}
.d-fact:hover{background:rgba(201,168,76,.1);color:var(--gold-d)}
.d-section{background:var(--white);border:1px solid var(--bd);border-radius:clamp(16px,2vw,22px);padding:clamp(1.3rem,1.8vw,1.85rem);margin-bottom:1rem}
.d-section h3{font-family:var(--syne);font-size:clamp(.95rem,1.1vw,1.1rem);font-weight:800;letter-spacing:-.01em;margin-bottom:.9rem}
.d-section p{font-size:.875rem;line-height:1.92;color:var(--dim);margin-bottom:.8rem}
.req-list{list-style:none}
.req-list li{padding:.38rem 0 .38rem 1.3rem;position:relative;font-size:.875rem;line-height:1.68;color:var(--dim)}
.req-list li::before{content:'◆';position:absolute;left:0;color:var(--gold);font-size:.48rem;top:.65rem}
.sticky-card{background:var(--white);border:1px solid var(--bd);border-radius:clamp(16px,2vw,22px);padding:clamp(1.2rem,1.8vw,1.75rem);position:sticky;top:calc(var(--nav-h) + 1rem)}
.sc-label{font-family:var(--body);font-size:.63rem;font-weight:700;color:var(--muted);letter-spacing:.1em;text-transform:uppercase}
.sc-salary{font-family:var(--grotesk);font-size:clamp(1.4rem,2vw,1.75rem);font-weight:700;color:var(--gold-d);letter-spacing:-.03em;margin:.3rem 0 1.2rem}
.apply-btn{width:100%;background:linear-gradient(135deg,var(--gold-d),var(--gold),var(--gold2));color:#1a0e00;border:none;padding:.9rem;font-family:var(--grotesk);font-size:.9rem;font-weight:700;border-radius:12px;cursor:pointer;box-shadow:0 6px 24px rgba(201,168,76,.32);transition:all .3s cubic-bezier(.34,1.56,.64,1);letter-spacing:.03em;text-transform:uppercase;position:relative;overflow:hidden}
.apply-btn:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 14px 40px rgba(201,168,76,.5)}
.save-role-btn{width:100%;margin-top:.65rem;background:none;border:1px solid var(--bd);padding:.78rem;font-family:var(--grotesk);font-size:.8rem;font-weight:600;border-radius:12px;cursor:pointer;transition:all .25s;color:var(--ink)}
.save-role-btn:hover{border-color:var(--gold);color:var(--gold-d);background:rgba(201,168,76,.05)}
.sc-meta{font-size:.76rem;color:var(--muted);line-height:2.25;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--bd)}

/* RESUME / CONTACT / SOCIAL */
.resume-page{max-width:680px;margin:0 auto;padding:clamp(3rem,5vh,4rem) clamp(1.5rem,4vw,2.5rem)}
.upload-zone{border:2px dashed rgba(201,168,76,.4);border-radius:26px;min-height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all .35s cubic-bezier(.22,1,.36,1);background:var(--ink2);position:relative;overflow:hidden;margin-bottom:1.5rem}
.upload-zone::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 30%,rgba(201,168,76,.12),transparent 60%);pointer-events:none}
.upload-zone:hover{border-color:rgba(201,168,76,.72);background:#110e1e;box-shadow:0 0 0 4px rgba(201,168,76,.07),0 16px 52px rgba(201,168,76,.14)}
.upload-zone.dragging{border-color:var(--emerald);background:#0d1a14}
.uz-icon{width:80px;height:80px;border-radius:50%;background:rgba(201,168,76,.1);border:1.5px dashed rgba(201,168,76,.4);display:flex;align-items:center;justify-content:center;font-size:2rem;margin-bottom:1.2rem;transition:all .35s;position:relative;z-index:1;animation:glowPulse 4s ease-in-out infinite}
.upload-zone:hover .uz-icon{background:rgba(201,168,76,.18);transform:scale(1.1)}
.uz-title{font-family:var(--syne);font-size:clamp(1.1rem,1.5vw,1.4rem);letter-spacing:-.01em;color:#fff;margin-bottom:.4rem;font-weight:800;position:relative;z-index:1}
.uz-sub{font-size:.8rem;color:rgba(255,255,255,.3);margin-bottom:1rem;position:relative;z-index:1}
.uz-formats{display:flex;gap:.45rem;position:relative;z-index:1}
.uz-fmt{background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.2);border-radius:6px;padding:3px 9px;font-family:var(--body);font-size:.64rem;font-weight:700;color:rgba(201,168,76,.7)}
.contact-page,.social-page{max-width:760px;margin:0 auto;padding:clamp(3rem,5vh,4rem) clamp(1.5rem,4vw,2.5rem)}
.contact-tabs{display:flex;border-bottom:1px solid var(--bd);margin-bottom:2rem}
.contact-tab{background:none;border:none;padding:.7rem 1.5rem;font-family:var(--grotesk);font-size:.82rem;font-weight:600;cursor:pointer;color:var(--muted);border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .25s}
.contact-tab.active{color:var(--gold-d);border-bottom-color:var(--gold-d)}
.contact-box{background:var(--white);border:1px solid var(--bd);border-radius:22px;padding:clamp(1.5rem,2vw,2.2rem)}
.cb-title{font-family:var(--syne);font-size:clamp(1.1rem,1.5vw,1.4rem);font-weight:800;letter-spacing:-.01em;margin-bottom:.4rem}
.cb-sub{font-size:.82rem;color:var(--muted);margin-bottom:1.6rem}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:.9rem;margin-bottom:.9rem}
.form-grid .form-group{margin-bottom:0}
.form-full{grid-column:1/-1}
.form-submit{width:100%;background:linear-gradient(135deg,var(--gold-d),var(--gold),var(--gold2));color:#1a0e00;border:none;padding:.88rem;font-family:var(--grotesk);font-size:.9rem;font-weight:700;border-radius:12px;cursor:pointer;transition:all .3s;letter-spacing:.03em;margin-top:.5rem;text-transform:uppercase}
.form-submit:hover{box-shadow:0 8px 30px rgba(201,168,76,.42);transform:translateY(-1px)}
.social-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(clamp(220px,26vw,260px),1fr));gap:1.1rem;margin-bottom:2rem}
.social-card{border-radius:22px;padding:1.6rem;cursor:pointer;position:relative;overflow:hidden;border:1px solid transparent;text-decoration:none;display:block;transition:transform .38s cubic-bezier(.22,1,.36,1),box-shadow .38s;color:#fff}
.social-card:hover{transform:translateY(-8px) scale(1.02);box-shadow:0 24px 56px rgba(0,0,0,.22)}
.sc-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;margin-bottom:1rem;background:rgba(255,255,255,.15)}
.sc-name{font-family:var(--syne);font-size:1.05rem;font-weight:800;letter-spacing:-.01em;margin-bottom:.2rem}
.sc-handle{font-size:.75rem;opacity:.5;margin-bottom:.75rem}
.sc-follow-btn{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);border-radius:100px;padding:5px 13px;font-family:var(--grotesk);font-size:.7rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;transition:all .25s}
.social-promo-card{
  background:linear-gradient(135deg,var(--abyss),#18142e);border:1px solid rgba(201,168,76,.22);
  border-radius:22px;padding:1.8rem 2rem;margin-bottom:1.8rem;position:relative;overflow:hidden;
}
.social-promo-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.7rem;margin-bottom:1.2rem}
.social-promo-stat{background:rgba(255,255,255,.05);border-radius:12px;padding:.8rem .9rem}
.nl-box{background:var(--white);border:1px solid var(--bd);border-radius:22px;padding:2.2rem;text-align:center;margin-bottom:1.5rem}
.nl-title{font-family:var(--syne);font-size:clamp(1.2rem,1.8vw,1.5rem);font-weight:800;letter-spacing:-.01em;margin-bottom:.4rem}
.nl-sub{font-size:.83rem;color:var(--muted);margin-bottom:1.2rem;line-height:1.68}
.nl-form{display:flex;gap:.6rem;max-width:380px;margin:0 auto}
.nl-input{flex:1;border:1.5px solid var(--bd);border-radius:100px;padding:.66rem 1rem;font-family:var(--body);font-size:.83rem;outline:none;transition:all .25s}
.nl-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,.1)}
.nl-btn{background:linear-gradient(135deg,var(--gold-d),var(--gold));color:#1a0e00;border:none;padding:.66rem 1.3rem;border-radius:100px;font-family:var(--grotesk);font-size:.82rem;font-weight:700;cursor:pointer;transition:all .3s;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;box-shadow:0 4px 16px rgba(201,168,76,.32)}
.nl-btn:hover{transform:scale(1.04);box-shadow:0 6px 22px rgba(201,168,76,.48)}

/* PAYMENT MODAL */
.payment-overlay{position:fixed;inset:0;z-index:800;background:rgba(4,2,10,.88);backdrop-filter:blur(20px);display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto}
.payment-modal{background:#fff;border-radius:34px;width:min(960px,100%);overflow:hidden;box-shadow:0 44px 130px rgba(0,0,0,.38);animation:modalIn .5s cubic-bezier(.34,1.56,.64,1) both;margin:auto;display:grid;grid-template-columns:1.05fr .95fr}
.pm-left{background:linear-gradient(165deg,#060412,#110d24,#1a163a);padding:2.8rem 2.4rem;position:relative;overflow:hidden;color:#fff}
.pm-left-orb{position:absolute;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(201,168,76,.2),transparent 70%)}
.pm-orb1{width:280px;height:280px;top:-80px;right:-80px;animation:gradDrift 10s ease-in-out infinite}
.pm-orb2{width:180px;height:180px;bottom:-50px;left:10%;animation:gradDrift 8s ease-in-out infinite reverse}
.pm-badge{display:inline-flex;align-items:center;gap:7px;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.25);border-radius:100px;padding:5px 14px;font-family:var(--body);font-size:.63rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold2);margin-bottom:1.5rem}
.pm-plan-title{font-family:var(--syne);font-size:clamp(1.6rem,2.5vw,2.2rem);letter-spacing:-.02em;line-height:1;font-weight:800;margin-bottom:.5rem;position:relative;z-index:1}
.pm-plan-sub{color:rgba(255,255,255,.38);font-size:.87rem;line-height:1.78;margin-bottom:2rem;position:relative;z-index:1}
.pm-order{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:1.3rem;margin-bottom:1.3rem;position:relative;z-index:1}
.pm-row{display:flex;justify-content:space-between;align-items:center;padding:.38rem 0;font-size:.83rem;color:rgba(255,255,255,.45)}
.pm-row strong{color:#fff;font-weight:700}
.pm-row.total{border-top:1px solid rgba(255,255,255,.1);margin-top:.4rem;padding-top:.8rem;font-size:.94rem;color:#fff}
.pm-total-num{font-family:var(--grotesk);font-size:clamp(1.4rem,2vw,1.9rem);letter-spacing:-.03em;color:var(--gold2);font-weight:700}
.pm-lock{display:flex;align-items:center;gap:8px;background:rgba(42,157,116,.1);border:1px solid rgba(42,157,116,.2);border-radius:12px;padding:.8rem 1rem;font-size:.76rem;color:var(--emerald);position:relative;z-index:1}
.pm-right{padding:clamp(1.8rem,2.5vw,2.8rem) clamp(1.4rem,2vw,2.4rem);background:#fff;overflow-y:auto;max-height:90vh}
.pm-methods{display:flex;background:var(--off);border:1px solid var(--bd);border-radius:12px;padding:3px;margin-bottom:1.5rem}
.pm-method{flex:1;background:none;border:none;padding:.54rem;font-family:var(--grotesk);font-size:.75rem;font-weight:600;color:var(--muted);border-radius:9px;cursor:pointer;transition:all .3s;display:flex;align-items:center;justify-content:center;gap:4px}
.pm-method.active{background:#fff;color:var(--gold-d);box-shadow:0 2px 10px rgba(201,168,76,.16)}
.card-visual{background:linear-gradient(135deg,var(--gold-d),#b8900f,var(--gold2),#2a5a8a);border-radius:18px;padding:1.5rem;margin-bottom:1.3rem;color:#fff;position:relative;overflow:hidden;box-shadow:0 10px 36px rgba(201,168,76,.26)}
.card-visual::before{content:'';position:absolute;top:-40px;right:-40px;width:140px;height:140px;border-radius:50%;background:rgba(255,255,255,.07)}
.cv-chip{width:34px;height:26px;background:rgba(255,255,255,.2);border-radius:6px;margin-bottom:1.2rem;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;font-size:1.1rem}
.cv-number{font-family:var(--body);font-size:.94rem;letter-spacing:.22em;margin-bottom:1rem;opacity:.85;position:relative;z-index:1}
.cv-footer{display:flex;justify-content:space-between;font-size:.67rem;opacity:.65;text-transform:uppercase;letter-spacing:.06em;position:relative;z-index:1}
.pay-grid{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
.pay-field{display:flex;flex-direction:column;gap:.36rem;margin-bottom:.84rem}
.pay-field.full{grid-column:1/-1}
.pay-label{font-family:var(--body);font-size:.64rem;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--muted)}
.pay-input{border:1.5px solid var(--bd);border-radius:11px;padding:.77rem .94rem;font-family:var(--body);font-size:.86rem;outline:none;background:var(--off);color:var(--ink);transition:all .25s;width:100%}
.pay-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,.1);background:var(--white)}
.upi-apps{display:flex;gap:.6rem;margin-bottom:1.2rem;flex-wrap:wrap}
.upi-app{flex:1;min-width:68px;display:flex;flex-direction:column;align-items:center;gap:4px;padding:.75rem .5rem;border:1.5px solid var(--bd);border-radius:14px;cursor:pointer;transition:all .3s cubic-bezier(.34,1.56,.64,1);background:var(--off)}
.upi-app:hover{border-color:var(--gold);transform:translateY(-4px) scale(1.07);background:rgba(201,168,76,.05)}
.upi-app.sel{border-color:var(--gold);background:rgba(201,168,76,.08)}
.upi-app-icon{font-size:1.5rem}
.upi-app-name{font-family:var(--grotesk);font-size:.6rem;font-weight:700}
.bank-list{display:flex;flex-direction:column;gap:.6rem;margin-bottom:1.1rem}
.bank-item{display:flex;align-items:center;gap:.85rem;background:var(--off);border:1.5px solid var(--bd);border-radius:14px;padding:.85rem 1rem;cursor:pointer;transition:all .3s}
.bank-item:hover{border-color:var(--gold);background:rgba(201,168,76,.05);transform:translateX(3px)}
.bank-item.sel{border-color:var(--gold);background:linear-gradient(135deg,#fffdf8,#fff)}
.bank-logo{width:40px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-family:var(--body);font-size:.64rem;font-weight:800;flex-shrink:0}
.bank-name{font-weight:600;font-size:.86rem;flex:1}
.bank-radio{width:18px;height:18px;border-radius:50%;border:2px solid var(--bd);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .25s;font-size:10px}
.bank-item.sel .bank-radio{background:var(--gold);border-color:var(--gold-d);color:#1a0e00;font-weight:900}
.pay-progress{background:rgba(201,168,76,.05);border:1px solid rgba(201,168,76,.12);border-radius:14px;padding:1.1rem;margin-top:1.2rem}
.pp-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.8rem}
.pp-label{font-family:var(--body);font-size:.68rem;font-weight:700;color:var(--gold-d);text-transform:uppercase;letter-spacing:.08em}
.pp-pct{font-family:var(--grotesk);font-size:clamp(1.2rem,1.8vw,1.5rem);letter-spacing:-.03em;color:var(--gold-d);font-weight:700}
.pp-bar{height:4px;background:rgba(201,168,76,.1);border-radius:4px;overflow:hidden;margin-bottom:.9rem}
.pp-fill{height:100%;background:linear-gradient(90deg,var(--gold-d),var(--gold2),var(--emerald));background-size:200% 100%;animation:shimmer 1.5s linear infinite;transition:width .5s ease;border-radius:4px}
.pp-steps{display:flex;gap:.4rem;flex-wrap:wrap}
.pp-step{display:flex;align-items:center;gap:3px;background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.1);border-radius:100px;padding:3px 9px;font-size:.63rem;color:var(--muted);font-family:var(--body);font-weight:700;transition:all .35s}
.pp-step.active{background:rgba(201,168,76,.15);border-color:rgba(201,168,76,.35);color:var(--gold-d)}
.pp-step.done{background:rgba(42,157,116,.08);border-color:rgba(42,157,116,.25);color:var(--emerald)}
.pp-dot{width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0}
.pp-step.active .pp-dot{animation:pulse 1s ease-in-out infinite}
.pm-actions{display:flex;gap:.8rem;margin-top:1.3rem}
.pm-cancel-btn{flex:1;border:1.5px solid var(--bd);background:#fff;color:var(--ink);border-radius:14px;padding:.85rem;font-family:var(--grotesk);font-size:.83rem;font-weight:600;cursor:pointer;transition:all .25s}
.pm-pay-btn{flex:1.5;background:linear-gradient(135deg,var(--gold-d),var(--gold),var(--gold2));color:#1a0e00;border:none;border-radius:14px;padding:.85rem;font-family:var(--grotesk);font-size:.9rem;font-weight:700;cursor:pointer;box-shadow:0 6px 24px rgba(201,168,76,.36);transition:all .3s;letter-spacing:.03em;text-transform:uppercase;position:relative;overflow:hidden}
.pm-pay-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 38px rgba(201,168,76,.52)}
.pm-pay-btn:disabled{opacity:.7;cursor:not-allowed}
.processing-dots{display:flex;align-items:center;justify-content:center;gap:6px}
.proc-dot{width:7px;height:7px;border-radius:50%;background:rgba(26,14,0,.6)}
.proc-dot:nth-child(1){animation:dotBounce .8s ease-in-out infinite 0s}
.proc-dot:nth-child(2){animation:dotBounce .8s ease-in-out infinite .15s}
.proc-dot:nth-child(3){animation:dotBounce .8s ease-in-out infinite .3s}
.pm-success{text-align:center;padding:4rem 2.5rem;min-height:500px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(180deg,#fffdf8,#f8f6ff)}
.pm-success-icon{width:110px;height:110px;border-radius:50%;background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(42,157,116,.2));display:flex;align-items:center;justify-content:center;font-size:3rem;margin:0 auto 1.8rem;animation:successPop .7s cubic-bezier(.34,1.56,.64,1) both}
.pm-success-title{font-family:var(--syne);font-size:clamp(1.6rem,2.5vw,2.2rem);font-weight:800;letter-spacing:-.02em;margin-bottom:.6rem}
.pm-success-sub{font-size:.9rem;color:var(--muted);line-height:1.82;max-width:360px;margin:0 auto 2rem}
.pm-success-btn{background:linear-gradient(135deg,var(--gold-d),var(--gold),var(--gold2));color:#1a0e00;border:none;padding:.95rem 2.5rem;border-radius:100px;font-family:var(--grotesk);font-size:.9rem;font-weight:700;cursor:pointer;box-shadow:0 6px 24px rgba(201,168,76,.36);transition:all .3s;letter-spacing:.04em;text-transform:uppercase}
.pm-success-btn:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 14px 38px rgba(201,168,76,.52)}
.confetti-piece{position:absolute;pointer-events:none;border-radius:3px;animation:confettiFly .8s ease-out both}

/* APPLY MODAL */
.apply-overlay{position:fixed;inset:0;z-index:700;background:rgba(4,2,10,.8);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;padding:1rem}
.apply-modal{background:var(--white);border-radius:30px;padding:clamp(1.8rem,2.5vw,2.5rem);max-width:440px;width:100%;animation:modalIn .5s cubic-bezier(.34,1.56,.64,1) both;position:relative;overflow:hidden;border:1px solid var(--bd)}
.apply-modal::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold-d),var(--gold2))}

/* AI CHAT */
.ai-fab{position:fixed;bottom:1.75rem;right:1.75rem;z-index:850;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--ink2),var(--deep));border:1.5px solid rgba(201,168,76,.35);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 32px rgba(0,0,0,.35),0 0 0 0 rgba(201,168,76,.3);transition:all .3s cubic-bezier(.34,1.56,.64,1);font-size:1.4rem;animation:glowPulse 4s ease-in-out infinite}
.ai-fab:hover{transform:scale(1.14);box-shadow:0 12px 44px rgba(0,0,0,.45),0 0 24px rgba(201,168,76,.3)}
.ai-chat{position:fixed;bottom:5.5rem;right:1.75rem;z-index:849;width:clamp(300px,90vw,360px);max-height:520px;background:var(--white);border:1px solid var(--bd2);border-radius:24px;box-shadow:0 28px 80px rgba(0,0,0,.16);display:flex;flex-direction:column;overflow:hidden;animation:slideDown .4s cubic-bezier(.22,1,.36,1) both}
.ai-chat-head{background:linear-gradient(135deg,var(--ink2),var(--deep));padding:1.1rem 1.3rem;display:flex;align-items:center;gap:.7rem}
.ai-chat-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,rgba(201,168,76,.3),rgba(42,157,116,.2));border:1.5px solid rgba(201,168,76,.4);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;animation:glowPulse 3s ease-in-out infinite}
.ai-chat-title{font-family:var(--grotesk);font-size:.85rem;font-weight:700;color:#fff}
.ai-chat-sub{font-size:.65rem;color:rgba(255,255,255,.38);margin-top:1px}
.ai-chat-close{margin-left:auto;background:none;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:1rem;transition:color .2s;padding:2px}
.ai-chat-close:hover{color:#fff}
.ai-messages{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:.75rem;scrollbar-width:thin;scrollbar-color:var(--bd) transparent}
.ai-msg{max-width:85%;padding:.7rem .95rem;border-radius:14px;font-size:.82rem;line-height:1.68;animation:fadeUp .3s both}
.ai-msg.bot{background:var(--off);color:var(--ink);align-self:flex-start;border-radius:4px 14px 14px 14px}
.ai-msg.user{background:linear-gradient(135deg,var(--gold-d),var(--gold));color:#1a0e00;align-self:flex-end;font-weight:600;border-radius:14px 4px 14px 14px}
.ai-msg.typing{display:flex;align-items:center;gap:4px;padding:.7rem 1rem}
.ai-typing-dot{width:6px;height:6px;border-radius:50%;background:var(--muted)}
.ai-typing-dot:nth-child(1){animation:dotBounce .7s ease-in-out infinite 0s}
.ai-typing-dot:nth-child(2){animation:dotBounce .7s ease-in-out infinite .12s}
.ai-typing-dot:nth-child(3){animation:dotBounce .7s ease-in-out infinite .24s}
.ai-chat-input{display:flex;gap:.5rem;padding:.85rem;border-top:1px solid var(--bd)}
.ai-input{flex:1;border:1.5px solid var(--bd);border-radius:100px;padding:.5rem 1rem;font-family:var(--body);font-size:.82rem;outline:none;transition:all .24s;background:var(--off)}
.ai-input:focus{border-color:var(--gold);background:var(--white)}
.ai-send{background:linear-gradient(135deg,var(--gold-d),var(--gold));color:#1a0e00;border:none;border-radius:100px;padding:.5rem .9rem;font-family:var(--grotesk);font-size:.78rem;font-weight:700;cursor:pointer;transition:all .28s;white-space:nowrap}
.ai-send:hover{transform:scale(1.06);box-shadow:0 4px 14px rgba(201,168,76,.35)}
.ai-quick-replies{display:flex;gap:.38rem;padding:.5rem .85rem 0;flex-wrap:wrap}
.ai-qr{background:var(--off);border:1px solid var(--bd);border-radius:100px;padding:4px 10px;font-size:.72rem;font-weight:600;cursor:pointer;transition:all .22s;color:var(--muted);font-family:var(--grotesk)}
.ai-qr:hover{border-color:var(--gold);color:var(--gold-d);background:rgba(201,168,76,.06)}

/* TOAST */
.toast{position:fixed;bottom:1.75rem;left:1.75rem;z-index:900;background:var(--ink2);color:#fff;padding:.85rem 1.2rem;border-radius:18px;font-size:.83rem;font-weight:500;display:flex;align-items:center;gap:.85rem;box-shadow:0 18px 60px rgba(0,0,0,.38),0 0 0 1px rgba(201,168,76,.14);animation:toastSlide .4s cubic-bezier(.34,1.56,.64,1) both;max-width:340px;font-family:var(--body)}
.toast-icon{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,var(--gold-d),var(--gold));display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;color:#1a0e00}
.toast-close{background:none;border:none;color:rgba(255,255,255,.28);cursor:pointer;font-size:14px;margin-left:auto;padding:2px;line-height:1}
.toast-close:hover{color:#fff}

/* PAGE WIPE */
.page-wipe{position:fixed;inset:0;z-index:9000;pointer-events:none;overflow:hidden}
.wipe-blade{position:absolute;top:0;bottom:0;background:linear-gradient(180deg,#0d0a18,#050308)}

/* BREADCRUMB */
.breadcrumb{max-width:1280px;margin:0 auto;padding:1rem clamp(1.5rem,4vw,2.5rem);display:flex;align-items:center;gap:.38rem;font-size:.77rem;color:var(--muted);flex-wrap:wrap;margin-top:var(--nav-h)}
.bc-btn{background:none;border:none;color:var(--muted);cursor:pointer;font-family:var(--body);font-size:.77rem;padding:2px 4px;border-radius:5px;transition:all .2s}
.bc-btn:hover{color:var(--gold-d);background:rgba(201,168,76,.06)}

/* FOOTER */
.footer{background:var(--ink);color:rgba(255,255,255,.22);padding:clamp(3rem,5vh,4rem) clamp(1.5rem,4vw,2.5rem) 2rem;border-top:1px solid rgba(255,255,255,.05)}
.footer-inner{max-width:1280px;margin:0 auto}
.footer-top{display:flex;justify-content:space-between;gap:2rem;flex-wrap:wrap;margin-bottom:3rem}
.footer-brand{max-width:260px}
.footer-brand-name{font-family:var(--syne);font-size:clamp(1.2rem,1.8vw,1.7rem);color:rgba(255,255,255,.65);font-weight:800;letter-spacing:-.02em;margin-bottom:.4rem}
.footer-brand-name em{background:linear-gradient(135deg,var(--gold2),var(--gold3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-style:normal}
.footer-brand p{font-size:clamp(.74rem,.85vw,.79rem);max-width:230px;line-height:1.82}
.footer-col h4{font-family:var(--grotesk);font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.3);margin-bottom:.9rem}
.footer-col a{display:block;font-size:clamp(.74rem,.85vw,.79rem);color:rgba(255,255,255,.22);cursor:pointer;margin-bottom:.4rem;transition:color .2s;text-decoration:none}
.footer-col a:hover{color:var(--gold2)}
.footer-bottom{display:flex;justify-content:space-between;align-items:center;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,.05);font-size:clamp(.66rem,.75vw,.73rem);flex-wrap:wrap;gap:.5rem}
.footer-socials{display:flex;gap:.5rem}
.fsoc{width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center;font-size:12px;cursor:pointer;color:rgba(255,255,255,.28);transition:all .3s;text-decoration:none}
.fsoc:hover{background:rgba(201,168,76,.18);border-color:rgba(201,168,76,.4);color:var(--gold2);transform:translateY(-3px)}

/* EMPTY */
.empty-wrap{text-align:center;padding:8rem 2rem;color:var(--muted)}
.empty-icon{font-size:3.5rem;display:block;margin-bottom:1rem;animation:float 3s ease-in-out infinite}
.hybrid-headline{font-family:var(--syne);font-weight:800;letter-spacing:-.02em;line-height:.96}
.page-top{padding-top:var(--nav-h)}

@media(max-width:1100px){
  .hero-inner{grid-template-columns:1fr}
  .hero-right{display:none}
  .plans-grid{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:900px){
  .photo-bento{grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(3,clamp(130px,16vw,180px))}
  .pb-a,.pb-b,.pb-c,.pb-d,.pb-e{grid-column:span 3}
}
@media(max-width:860px){
  .nav{padding:0 1.2rem}
  .nav-links{display:none}
  .nav-right{display:none}
  .nav-mobile-toggle{display:inline-flex}
  .auth-page{grid-template-columns:1fr}
  .auth-left{display:none}
  .payment-modal{grid-template-columns:1fr}
  .pm-left{display:none}
  .listings-layout{flex-direction:column;padding:1.5rem}
  .sidebar{width:100%;position:static}
  .list-header{flex-direction:column;align-items:stretch;gap:.75rem}
  .sort-select{width:100%}
  .detail-layout{flex-direction:column}
  .detail-side{width:100%}
  .sticky-card{position:static}
  .social-promo-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
  .plans-section{padding:clamp(3rem,6vh,5rem) 1.5rem}
}
@media(max-width:640px){
  .nav{padding:0 1rem}
  .nav-right .nav-saved span{display:none}
  .mobile-nav-panel{left:.75rem;right:.75rem;top:calc(var(--nav-h) + .5rem)}
  .plans-grid{grid-template-columns:1fr}
  .hero-inner{padding:6rem 1.2rem 4rem}
  .jobs-grid,.co-grid,.social-grid{grid-template-columns:1fr}
  .contact-page,.social-page,.resume-page{padding:2rem 1.2rem}
  .detail-layout{flex-direction:column;padding:1.2rem}
  .detail-side{width:100%}
  .sticky-card{position:static}
  .listings-layout{padding:1.2rem}
  .list-row{flex-wrap:wrap;gap:.75rem}
  .list-row:hover{transform:none}
  .list-right{
    order:3;width:100%;padding-left:58px;margin-top:.1rem;
    display:flex;align-items:center;justify-content:space-between;text-align:left;
  }
  .list-row .save-btn{order:2;margin-left:auto}
  .d-logo-row{align-items:flex-start}
  .pm-right{padding:1.5rem 1.2rem}
  .form-grid{grid-template-columns:1fr}
  .contact-tabs{display:grid;grid-template-columns:1fr 1fr;gap:.35rem;border-bottom:none}
  .contact-tab{padding:.8rem 1rem;border:1px solid var(--bd);border-radius:12px;margin-bottom:0}
  .contact-tab.active{background:rgba(201,168,76,.08)}
  .social-promo-card{padding:1.4rem}
  .social-promo-stats{grid-template-columns:1fr 1fr}
  .nl-form{flex-direction:column;max-width:none}
  .nl-btn{width:100%}
  .plans-hero{padding:4.75rem 1.2rem 3rem}
  .plans-grid{padding:0 0 clamp(3rem,6vh,4rem)}
  .plans-section{padding:clamp(3rem,6vh,4rem) 1.2rem}
  .billing-toggle{display:flex;flex-wrap:wrap;justify-content:center;border-radius:24px}
  .auth-tabs,.social-auth{flex-direction:column}
  .auth-name-grid{grid-template-columns:1fr}
  .footer-brand{max-width:none}
  .uz-formats{flex-wrap:wrap;justify-content:center}
  .loader-numbers{flex-direction:column;width:min(100%,22rem)}
  .loader-stat{width:100%}
  .loader-stat:not(:last-child)::after{display:none}
  .loader-stat:not(:last-child){border-bottom:1px solid rgba(255,255,255,.07)}
  .toast{left:.75rem;right:.75rem;width:auto}
  .ai-chat{width:calc(100vw - 2rem);right:1rem}
  .photo-bento{grid-template-columns:1fr 1fr;grid-template-rows:auto}
  .pb-a,.pb-b,.pb-c,.pb-d,.pb-e{grid-column:span 1}
}
`;

/* ─── DATA ─────────────────────────────────────────── */
const IMG={office1:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=560&fit=crop&q=80",office2:"https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=560&fit=crop&q=80",office3:"https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&h=560&fit=crop&q=80",cowork:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=560&fit=crop&q=80",remote:"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=560&fit=crop&q=80",meeting:"https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=560&fit=crop&q=80",team:"https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=560&fit=crop&q=80",startup:"https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=560&fit=crop&q=80",p1:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80",p2:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&q=80",p3:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&q=80",p4:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&q=80",p5:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80",p6:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80",co1:"https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=80&h=80&fit=crop&q=80",co2:"https://images.unsplash.com/photo-1563986768609-322da13575f3?w=80&h=80&fit=crop&q=80",co3:"https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=80&h=80&fit=crop&q=80",co4:"https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=80&h=80&fit=crop&q=80",co5:"https://images.unsplash.com/photo-1555421689-491a97ff2040?w=80&h=80&fit=crop&q=80",co6:"https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=80&h=80&fit=crop&q=80",b1:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&h=120&fit=crop&q=80",b2:"https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=700&h=120&fit=crop&q=80",b3:"https://images.unsplash.com/photo-1617040619263-41c5a9ca7521?w=700&h=120&fit=crop&q=80",b4:"https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=700&h=120&fit=crop&q=80",b5:"https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=700&h=120&fit=crop&q=80",b6:"https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=700&h=120&fit=crop&q=80"};
const BENTO_PHOTOS=[{src:IMG.office1,label:"Figma HQ",sub:"San Francisco",cls:"pb-a"},{src:IMG.cowork,label:"Stripe Campus",sub:"Remote Friendly",cls:"pb-b"},{src:IMG.meeting,label:"Anthropic Labs",sub:"AI Research",cls:"pb-c"},{src:IMG.team,label:"Team Culture",sub:"Work & Life",cls:"pb-d"},{src:IMG.startup,label:"Startup Life",sub:"Move Fast",cls:"pb-e"}];
const TESTIMONIALS=[{quote:"Found my dream role at Figma in under two weeks. The AI matching is genuinely impressive.",name:"Priya Sharma",role:"Product Designer · Figma",img:IMG.p2},{quote:"WorkBoard's premium listings filter out all the noise. I applied to 4 companies and got 3 offers.",name:"Marcus Chen",role:"Full-Stack Engineer · Stripe",img:IMG.p3},{quote:"As a recruiter, the candidate quality here is unmatched. We filled two senior roles in a month.",name:"Aisha Patel",role:"Talent Lead · Notion",img:IMG.p4},{quote:"The resume AI scanning matched me to a role I'd never have found myself. Changed my career.",name:"James Wright",role:"AI Researcher · Anthropic",img:IMG.p5},{quote:"Elite tier is worth every rupee. The 1-click apply alone saved me 20+ hours.",name:"Sofia Romano",role:"UX Lead · Airbnb",img:IMG.p6},{quote:"Clean, distraction-free, professional. Every post is verified. What the market was missing.",name:"Raj Mehta",role:"DevOps Lead · HashiCorp",img:IMG.p1}];
const COMPANIES=[{id:1,name:"Figma Inc.",logo:IMG.co1,banner:IMG.b1,fallback:"Fi",color:"#7c3aed",bg:"#f5f3ff",industry:"Design Tools · SaaS",size:"1,000–5,000",about:"Building the future of collaborative design for millions of teams worldwide.",open:14,founded:"2012",hq:"San Francisco"},{id:2,name:"Stripe",logo:IMG.co2,banner:IMG.b2,fallback:"St",color:"#2563eb",bg:"#eff6ff",industry:"Fintech · Infrastructure",size:"5,000–10,000",about:"Economic infrastructure for the internet — payments, billing, and beyond.",open:38,founded:"2010",hq:"San Francisco"},{id:3,name:"Notion",logo:IMG.co3,banner:IMG.b3,fallback:"No",color:"#1d1d1d",bg:"#f5f5f5",industry:"Productivity · SaaS",size:"500–1,000",about:"The all-in-one workspace for modern teams building products and culture.",open:22,founded:"2016",hq:"New York"},{id:4,name:"Anthropic",logo:IMG.co4,banner:IMG.b4,fallback:"An",color:"#c84b2f",bg:"#fff0eb",industry:"AI Safety · Research",size:"500–1,000",about:"Building safe, interpretable, and steerable AI systems for a beneficial future.",open:31,founded:"2021",hq:"San Francisco"},{id:5,name:"Airbnb",logo:IMG.co5,banner:IMG.b5,fallback:"Ab",color:"#ff5a5f",bg:"#fff0f0",industry:"Travel · Marketplace",size:"5,000–10,000",about:"Connecting people to unique travel experiences in 220+ countries worldwide.",open:9,founded:"2008",hq:"San Francisco"},{id:6,name:"HashiCorp",logo:IMG.co6,banner:IMG.b6,fallback:"Ha",color:"#2d6a4f",bg:"#e8f8f1",industry:"DevOps · Cloud",size:"1,000–5,000",about:"Infrastructure automation software powering the world's largest enterprises.",open:17,founded:"2012",hq:"Austin"}];
const JOBS=[{id:1,title:"Senior Product Designer",company:"Figma Inc.",coId:1,location:"San Francisco",type:"Full-time",remote:true,level:"Senior",salary:"₹1.2–1.6 Cr",salaryNum:140,date:"2d ago",featured:true,category:"Design",desc:"Lead design of next-gen collaborative tools used by 10M+ teams globally.",reqs:["5+ years product design","Figma & prototyping mastery","Systems thinking","User research","Executive communication"]},{id:2,title:"Full-Stack Engineer",company:"Stripe",coId:2,location:"Remote",type:"Full-time",remote:true,level:"Mid",salary:"₹90L–1.2 Cr",salaryNum:105,date:"1d ago",featured:true,category:"Engineering",desc:"Build financial infrastructure handling billions in transactions daily.",reqs:["3+ years full-stack","TypeScript / Node.js","Distributed systems","PostgreSQL","Fintech interest"]},{id:3,title:"Marketing Manager",company:"Notion",coId:3,location:"New York",type:"Full-time",remote:false,level:"Mid",salary:"₹55–75L",salaryNum:65,date:"3d ago",featured:false,category:"Marketing",desc:"Drive PLG growth initiatives for one of the fastest-growing productivity tools.",reqs:["4+ yrs B2B marketing","Content strategy","HubSpot / Mixpanel","Data-driven mindset","Exceptional writing"]},{id:4,title:"AI Safety Researcher",company:"Anthropic",coId:4,location:"San Francisco",type:"Full-time",remote:true,level:"Senior",salary:"₹1.5–2.4 Cr",salaryNum:200,date:"5h ago",featured:true,category:"AI/ML",desc:"Work at the frontier of AI safety research shaping the trajectory of safe AI development.",reqs:["PhD or 4+ yrs applied ML","PyTorch / JAX","LLM experience","Research publications","AI safety passion"]},{id:5,title:"UX Researcher",company:"Airbnb",coId:5,location:"Remote",type:"Contract",remote:true,level:"Mid",salary:"₹70–90L",salaryNum:80,date:"1w ago",featured:false,category:"Design",desc:"Conduct mixed-methods research uncovering host and guest insights.",reqs:["3+ yrs UX research","Qual & quant methods","Dovetail proficiency","Clear communication","Collaborative style"]},{id:6,title:"DevOps Engineer",company:"HashiCorp",coId:6,location:"Austin, TX",type:"Full-time",remote:true,level:"Senior",salary:"₹95L–1.3 Cr",salaryNum:115,date:"2d ago",featured:false,category:"Engineering",desc:"Scale infrastructure for 3,000+ enterprise customers using Terraform, Vault, and Nomad.",reqs:["5+ yrs DevOps/SRE","Deep Kubernetes","Terraform & Vault","Bash / Python","Cloud certifications"]}];
const CATEGORIES=[{icon:"💻",label:"Engineering",count:"2,143"},{icon:"🎨",label:"Design",count:"893"},{icon:"🤖",label:"AI / ML",count:"1,201"},{icon:"📣",label:"Marketing",count:"744"},{icon:"💰",label:"Finance",count:"623"},{icon:"🤝",label:"Sales",count:"1,055"},{icon:"⚕️",label:"Healthcare",count:"381"},{icon:"🏗",label:"Operations",count:"502"}];
const MARQUEE_ITEMS=["Figma","Stripe","Anthropic","Notion","Airbnb","HashiCorp","Google","Meta","Apple","OpenAI","Vercel","Linear","Loom"];
const UPI_APPS=[{icon:"💜",name:"PhonePe",url:"https://www.phonepe.com"},{icon:"🟢",name:"GPay",url:"https://pay.google.com"},{icon:"🔵",name:"Paytm",url:"https://paytm.com"},{icon:"🇮🇳",name:"BHIM",url:"https://bhimupi.org.in"}];
const BANKS=[{name:"HDFC Bank",type:"Net Banking",abbr:"HD",color:"#c13b2f",bg:"#fde8e7"},{name:"SBI",type:"State Bank",abbr:"SB",color:"#003366",bg:"#e6eef7"},{name:"ICICI Bank",type:"Net Banking",abbr:"IC",color:"#b5451b",bg:"#fceae5"},{name:"Axis Bank",type:"Net Banking",abbr:"AX",color:"#97144d",bg:"#fce8f0"}];
const PLANS=[{key:"free",tier:"Starter",name:"Free",monthly:0,annual:0,desc:"Everything to kickstart your search.",btn:"Get Started",btnCls:"pb-outline",features:[{y:1,t:"Browse all 8,400+ roles"},{y:1,t:"Save up to 5 jobs"},{y:1,t:"Basic profile & resume upload"},{y:1,t:"Weekly email alerts"},{y:0,t:"Priority application badge",d:1},{y:0,t:"AI resume match score",d:1}]},{key:"pro",tier:"Most Popular",name:"Pro",monthly:19,annual:14,featured:true,desc:"AI tools to accelerate your job search.",btn:"Start Free Trial",btnCls:"pb-gold",features:[{y:1,t:"Everything in Free"},{y:1,t:"Unlimited saved jobs"},{y:1,t:"Priority application badge"},{y:1,t:"Recruiter visibility"},{y:1,t:"AI resume match score"},{y:0,t:"1-click apply",d:1}]},{key:"elite",tier:"Power User",name:"Elite",monthly:39,annual:29,desc:"Complete career toolkit for serious professionals.",btn:"Go Elite",btnCls:"pb-emerald",features:[{y:1,t:"Everything in Pro"},{y:1,t:"1-click apply"},{y:1,t:"Salary insights"},{y:1,t:"Application tracker"},{y:1,t:"Interview prep"},{y:1,t:"Monthly coaching call"}]},{key:"recruiter",tier:"For Teams",name:"Recruiter",monthly:99,annual:74,dark:true,desc:"Post jobs, search candidates, manage pipelines.",btn:"Start Hiring",btnCls:"pb-dark",features:[{y:1,t:"Post unlimited listings"},{y:1,t:"Full candidate database"},{y:1,t:"Advanced search & filters"},{y:1,t:"Branded company page"},{y:1,t:"ATS integrations"},{y:1,t:"Dedicated account manager"}]}];
const SOCIALS=[{name:"X / Twitter",handle:"@WorkBoardHQ",icon:"𝕏",bg:"linear-gradient(135deg,#000,#222)",border:"rgba(255,255,255,.08)",url:"https://twitter.com",followers:"24.8K"},{name:"LinkedIn",handle:"WorkBoard Official",icon:"in",bg:"linear-gradient(135deg,#005ea5,#0077b5)",border:"rgba(0,119,181,.3)",url:"https://linkedin.com",followers:"112K"},{name:"YouTube",handle:"WorkBoard Careers",icon:"▶",bg:"linear-gradient(135deg,#c00,#f22)",border:"rgba(255,0,0,.2)",url:"https://youtube.com",followers:"38.4K"},{name:"Instagram",handle:"@workboard.io",icon:"📸",bg:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",border:"rgba(193,53,132,.3)",url:"https://instagram.com",followers:"67.2K"},{name:"Discord",handle:"Community Server",icon:"💬",bg:"linear-gradient(135deg,#4752c4,#7289da)",border:"rgba(88,101,242,.3)",url:"https://discord.gg",followers:"8,941"},{name:"GitHub",handle:"workboard-hq",icon:"⌥",bg:"linear-gradient(135deg,#24292e,#3a4049)",border:"rgba(255,255,255,.06)",url:"https://github.com",followers:"3.1K"}];
const AI_RESPONSES={default:["I can help you find the perfect role! What skills do you have?","Let me search for matching opportunities. What's your target salary?","I've found 12 roles that match your profile. Want to see them?","Great choice! This company has a 4.8/5 rating on Glassdoor.","Your resume is a 78% match for this role. Want tips to improve it?"],jobs:["I found 34 jobs matching 'Product Designer' in Bangalore. Top picks: Figma (₹1.4Cr), Stripe (₹1.1Cr), Notion (₹85L). Shall I filter by remote-only?","Based on your profile, AI/ML roles at Anthropic and Google fit your background well. Want details?"],salary:["Median salary for Senior Engineers in Bangalore: ₹22–35L. With your 5yr XP, you should target ₹28–40L. Want a negotiation script?"],resume:["Your resume scores 72% for this role. Key gaps: 'TypeScript' mentioned only once. Add 2-3 more specific examples. Shall I rewrite the summary?"],apply:["I can 1-click apply to all 6 shortlisted roles simultaneously! You'll get interview invites in 2–5 days on average. Proceed?"]};
function getAiReply(msg){const m=msg.toLowerCase();if(m.includes("job")||m.includes("role")||m.includes("position"))return AI_RESPONSES.jobs[Math.floor(Math.random()*AI_RESPONSES.jobs.length)];if(m.includes("salary")||m.includes("pay")||m.includes("ctc"))return AI_RESPONSES.salary[0];if(m.includes("resume")||m.includes("cv")||m.includes("profile"))return AI_RESPONSES.resume[0];if(m.includes("apply")||m.includes("submit"))return AI_RESPONSES.apply[0];return AI_RESPONSES.default[Math.floor(Math.random()*AI_RESPONSES.default.length)];}

/* ─── HOOKS ─────────────────────────────────────────── */
function useCountUp(target,dur=2000,start=false){const[n,setN]=useState(0);const raf=useRef();useEffect(()=>{if(!start)return;const t0=performance.now();const tick=now=>{const p=Math.min((now-t0)/dur,1);setN(Math.round(target*(1-Math.pow(1-p,3))));if(p<1)raf.current=requestAnimationFrame(tick);};raf.current=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf.current);},[start,target,dur]);return n;}
function useTilt(ref){useEffect(()=>{const el=ref.current;if(!el)return;const move=e=>{const r=el.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;const cx=r.width/2,cy=r.height/2;const rx=(y-cy)/cy*-6,ry=(x-cx)/cx*6;el.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;el.style.setProperty('--mx',`${(x/r.width)*100}%`);el.style.setProperty('--my',`${(y/r.height)*100}%`);};const leave=()=>{el.style.transform='';};el.addEventListener('mousemove',move);el.addEventListener('mouseleave',leave);return()=>{el.removeEventListener('mousemove',move);el.removeEventListener('mouseleave',leave);};},[]);}

/* ─── HELPERS ─────────────────────────────────────── */
function CoLogo({co,size=48,radius=13}){const[err,setErr]=useState(false);if(!err&&co.logo)return(<div style={{width:size,height:size,borderRadius:radius,overflow:"hidden",flexShrink:0}}><img src={co.logo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={()=>setErr(true)}/></div>);return(<div style={{width:size,height:size,borderRadius:radius,background:co.bg,color:co.color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--syne)",fontWeight:800,fontSize:size*.36,flexShrink:0}}>{co.fallback}</div>);}
function TagBadge({type,children}){const cls={type:"t-full",remote:"t-remote",level:"t-level",gold:"t-gold"};return<span className={`tag ${cls[type]||"t-level"}`}>{children}</span>;}

/* ─── AI CHAT ─────────────────────────────────────── */
function AiChat({onClose}){const[msgs,setMsgs]=useState([{role:"bot",text:"Hey! I'm WorkBoard AI 🤖 I can match you to jobs, score your resume, and help you apply. What are you looking for?"}]);const[input,setInput]=useState("");const[typing,setTyping]=useState(false);const bottomRef=useRef();const QUICK=["Find me remote jobs","Score my resume","Best AI roles","Top salaries"];useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,typing]);const send=(text)=>{if(!text.trim())return;const userMsg=text.trim();setInput("");setMsgs(prev=>[...prev,{role:"user",text:userMsg}]);setTyping(true);setTimeout(()=>{setTyping(false);setMsgs(prev=>[...prev,{role:"bot",text:getAiReply(userMsg)}]);},1200+Math.random()*800);};return(<div className="ai-chat"><div className="ai-chat-head"><div className="ai-chat-avatar">🤖</div><div><div className="ai-chat-title">WorkBoard AI</div><div className="ai-chat-sub">● Online — responds instantly</div></div><button className="ai-chat-close" onClick={onClose}>✕</button></div><div className="ai-quick-replies">{QUICK.map(q=><button key={q} className="ai-qr" onClick={()=>send(q)}>{q}</button>)}</div><div className="ai-messages">{msgs.map((m,i)=>(<div key={i} className={`ai-msg ${m.role}`} style={{animationDelay:`${i*.05}s`}}>{m.text}</div>))}{typing&&(<div className="ai-msg bot typing"><span className="ai-typing-dot"/><span className="ai-typing-dot"/><span className="ai-typing-dot"/></div>)}<div ref={bottomRef}/></div><div className="ai-chat-input"><input className="ai-input" placeholder="Ask me anything about jobs…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)}/><button className="ai-send" onClick={()=>send(input)}>Send →</button></div></div>);}

/* ─── ULTRA LOADER ────────────────────────────────── */
function LoaderNum({target,suffix="",label,delay=0}){
  const[go,setGo]=useState(false);
  const num=useCountUp(target,1600,go);
  useEffect(()=>{const t=setTimeout(()=>setGo(true),delay);return()=>clearTimeout(t);},[delay]);
  return(
    <div className="loader-stat">
      <div className="loader-num-wrap">
        <span className="loader-stat-num gold" style={{animationDelay:`${delay/1000+.1}s`}}>
          {num.toLocaleString()}{suffix}
        </span>
      </div>
      <span className="loader-stat-label">{label}</span>
    </div>
  );
}

function Loader({onDone}){
  const[pct,setPct]=useState(0);
  const[step,setStep]=useState(0);
  const[exiting,setExiting]=useState(false);
  const STEPS=["Connecting","Loading","Matching","Ready ✓"];
  useEffect(()=>{
    const ts=[
      setTimeout(()=>{setPct(18);setStep(0);},150),
      setTimeout(()=>{setPct(42);setStep(1);},600),
      setTimeout(()=>{setPct(74);setStep(2);},1100),
      setTimeout(()=>{setPct(92);setStep(3);},1600),
      setTimeout(()=>{setPct(100);},1900),
      setTimeout(()=>{setExiting(true);setTimeout(onDone,900);},2200),
    ];
    return()=>ts.forEach(clearTimeout);
  },[onDone]);

  return(
    <div className={`loader${exiting?" exit":""}`}>
      <div className="loader-mesh"/>
      <div className="loader-grid"/>
      <div className="loader-scan"/>
      <div className="loader-grain"/>

      {/* Orb ring */}
      <div className="loader-orb-ring">
        <div className="lor-ring lor1"/>
        <div className="lor-ring lor2"/>
        <div className="lor-ring lor3"/>
        <div className="lor-core"/>
      </div>

      {/* Wordmark */}
      <div className="loader-wordmark-wrap">
        <div className="loader-eyebrow">Elite Career Platform · AI-Powered</div>
        <div className="loader-wordmark" style={{animation:"fadeUp .6s .05s both"}}>
          WORK<em>BOARD</em>
        </div>
      </div>

      {/* ULTRA NUMBER STATS */}
      <div className="loader-numbers">
        <LoaderNum target={8412} suffix="+" label="Live Roles" delay={250}/>
        <LoaderNum target={1203} label="Companies" delay={420}/>
        <LoaderNum target={94} suffix="K" label="Hires Made" delay={580}/>
      </div>

      {/* Progress */}
      <div className="loader-bar-wrap">
        <div className="loader-bar">
          <div className="loader-fill" style={{width:`${pct}%`}}/>
        </div>
        <div className="loader-status">
          {STEPS.map((s,i)=>(
            <span key={s} style={{
              marginRight:"1.5rem",
              color:i===step?"rgba(201,168,76,.7)":i<step?"rgba(42,157,116,.6)":"rgba(255,255,255,.15)",
              transition:"color .4s",
              fontWeight:i===step?700:400,
            }}>{i<step?"✓ ":i===step?"▶ ":""}{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── PAGE TRANSITION ─────────────────────────────── */
function PageTransition({onDone}){const N=10;const[phase,setPhase]=useState("in");useEffect(()=>{const t1=setTimeout(()=>setPhase("out"),360);const t2=setTimeout(onDone,760);return()=>{clearTimeout(t1);clearTimeout(t2);};},[onDone]);return(<div className="page-wipe">{Array.from({length:N},(_,i)=>(<div key={i} className="wipe-blade" style={{left:`${i*(100/N)}%`,width:`${100/N+.3}%`,animation:phase==="in"?`bladeIn .38s ${i*.025}s cubic-bezier(.76,0,.24,1) both`:`bladeOut .36s ${(N-1-i)*.022}s cubic-bezier(.76,0,.24,1) both`}}/>))}</div>);}

/* ─── JOB CARD ────────────────────────────────────── */
function JobCard({job,saved,onSave,onClick,delay=0}){const ref=useRef();useTilt(ref);const co=COMPANIES.find(c=>c.id===job.coId);return(<div ref={ref} className={`job-card${job.featured?" featured":""}`} style={{animation:`fadeUp .6s ${delay}s both`,cursor:"pointer"}} onClick={()=>onClick(job)}>{job.featured&&<div className="job-feat-badge">✦ Featured</div>}<div className="jc-row"><div style={{display:"flex",alignItems:"flex-start",gap:"1rem"}}>{co?<CoLogo co={co}/>:<div style={{width:48,height:48,borderRadius:14,background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center"}}>{job.company[0]}</div>}<div><div className="job-title">{job.title}</div><div className="job-co">{job.company} · {job.location}</div></div></div><button className={`save-btn${saved?" saved":""}`} onClick={e=>{e.stopPropagation();onSave(job.id);}}>{saved?"♥":"♡"}</button></div><div className="tags"><TagBadge type="type">{job.type}</TagBadge>{job.remote&&<TagBadge type="remote">Remote</TagBadge>}<TagBadge type="level">{job.level}</TagBadge></div><div className="jc-footer"><span className="j-salary">{job.salary}</span><span className="j-date">{job.date}</span></div></div>);}

/* ─── APPLY MODAL ─────────────────────────────────── */
function ApplyModal({job,onClose}){const confetti=Array.from({length:22},(_,i)=>({left:`${4+i*4.5}%`,top:`${48+Math.random()*34}%`,background:["#c9a84c","#2a9d74","#c2566b","#7c3aed","#fff"][i%5],"--dx":`${(Math.random()-.5)*110}px`,"--dy":`${-(44+Math.random()*88)}px`,"--dr":`${(Math.random()-.5)*780}deg`,width:`${8+Math.random()*10}px`,height:`${8+Math.random()*10}px`,borderRadius:Math.random()>.5?"50%":"3px",animationDelay:`${Math.random()*.28}s`}));return(<div className="apply-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}><div className="apply-modal">{confetti.map((c,i)=><div key={i} className="confetti-piece" style={{...c,position:"absolute"}}/>)}<div style={{textAlign:"center",position:"relative",zIndex:1}}><div style={{width:70,height:70,borderRadius:"50%",background:"linear-gradient(135deg,rgba(201,168,76,.2),rgba(42,157,116,.2))",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1.2rem",fontSize:"2rem",animation:"successPop .6s .1s cubic-bezier(.34,1.56,.64,1) both"}}>🎉</div><div className="hybrid-headline" style={{fontSize:"1.75rem",marginBottom:".4rem"}}>Application Sent!</div><div style={{fontSize:".84rem",color:"var(--muted)",lineHeight:1.78,marginBottom:"1.5rem"}}>Your application for <strong>{job?.title}</strong> at <strong>{job?.company}</strong> is under review.</div><div style={{background:"var(--off)",borderRadius:14,padding:"1rem 1.2rem",marginBottom:"1.5rem",textAlign:"left"}}>{[["Position",job?.title],["Company",job?.company],["Location",job?.location],["Status","✓ Under Review"]].map(([l,v],i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:".32rem 0",fontSize:".82rem",borderBottom:i<3?"1px solid var(--bd)":"none"}}><span style={{color:"var(--muted)"}}>{l}</span><span style={{fontWeight:700,color:l==="Status"?"var(--emerald)":"var(--ink)"}}>{v}</span></div>))}</div><button className="form-submit" onClick={onClose}>Back to Jobs</button></div></div></div>);}

/* ─── PAYMENT MODAL ───────────────────────────────── */
function PaymentModal({plan,billing,price,onClose,onSuccess}){const[tab,setTab]=useState("card");const[selBank,setSelBank]=useState(null);const[selUpi,setSelUpi]=useState(null);const[upiId,setUpiId]=useState("");const[paying,setPaying]=useState(false);const[payPct,setPayPct]=useState(0);const[payStep,setPayStep]=useState(-1);const[done,setDone]=useState(false);const PAY_STEPS=["Verifying","Encrypting","Processing","Confirming"];const annual=billing==="annual";const pr=p=>p[billing];const confetti=Array.from({length:32},(_,i)=>({left:`${3+i*3}%`,top:`${42+Math.random()*40}%`,background:["#c9a84c","#2a9d74","#c2566b","#7c3aed","#fff"][i%5],"--dx":`${(Math.random()-.5)*150}px`,"--dy":`${-(50+Math.random()*120)}px`,"--dr":`${(Math.random()-.5)*900}deg`,width:`${7+Math.random()*11}px`,height:`${7+Math.random()*11}px`,borderRadius:Math.random()>.5?"50%":"3px",animationDelay:`${i*.02}s`}));const handlePay=()=>{setPaying(true);setPayPct(0);setPayStep(0);[{p:22,s:0,t:400},{p:52,s:1,t:950},{p:78,s:2,t:1550},{p:96,s:3,t:2050},{p:100,s:3,t:2400}].forEach(({p,s,t})=>setTimeout(()=>{setPayPct(p);setPayStep(s);},t));setTimeout(()=>{setPaying(false);setDone(true);},2750);};return(<div className="payment-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}><div className="payment-modal">{done?(<div className="pm-success" style={{gridColumn:"1/-1",position:"relative"}}>{confetti.map((c,i)=><div key={i} className="confetti-piece" style={{...c,position:"absolute"}}/>)}<div className="pm-success-icon" style={{position:"relative",zIndex:1}}>✅</div><div className="pm-success-title" style={{position:"relative",zIndex:1}}>Welcome to {plan.name}!</div><div className="pm-success-sub" style={{position:"relative",zIndex:1}}>Payment confirmed. All {plan.name} features are now live on your account.</div><button className="pm-success-btn" style={{position:"relative",zIndex:1}} onClick={onSuccess}>Explore {plan.name} →</button></div>):(<><div className="pm-left"><div className="pm-left-orb pm-orb1"/><div className="pm-left-orb pm-orb2"/><div className="pm-badge">🔒 Secure Checkout</div><div className="pm-plan-title">Upgrade to<br/><span style={{color:"var(--gold2)"}}>{plan.name}</span></div><div className="pm-plan-sub">Unlock everything instantly. Cancel anytime.</div><div className="pm-order">{[["Plan",plan.name],["Billing",annual?"Annual":"Monthly"],...(annual?[["Discount","Save 25%"]]:[])].map(([l,v],i)=>(<div key={i} className="pm-row"><span>{l}</span><strong style={l==="Discount"?{color:"var(--emerald)"}:{}}>{v}</strong></div>))}<div className="pm-row total"><span>Total</span><div className="pm-total-num">${price}{annual?"/yr":"/mo"}</div></div></div><div className="pm-lock">🔐 256-bit SSL · PCI-DSS L1 · Instant activation</div></div><div className="pm-right"><div className="hybrid-headline" style={{fontSize:"1.55rem",marginBottom:".3rem"}}>Complete Payment</div><div style={{fontSize:".81rem",color:"var(--muted)",marginBottom:"1.4rem"}}>Choose your preferred method</div><div className="pm-methods">{[{k:"card",l:"💳 Card"},{k:"upi",l:"📲 UPI"},{k:"bank",l:"🏦 Net Banking"}].map(m=>(<button key={m.k} className={`pm-method${tab===m.k?" active":""}`} onClick={()=>setTab(m.k)}>{m.l}</button>))}</div>{tab==="card"&&(<div><div className="card-visual"><div className="cv-chip">💳</div><div className="cv-number">•••• •••• •••• ••••</div><div className="cv-footer"><div><div>Card Holder</div><div style={{fontWeight:700,fontSize:".82rem"}}>Your Name</div></div><div><div>Expires</div><div style={{fontWeight:700,fontSize:".82rem"}}>MM/YY</div></div></div></div><div className="pay-grid"><div className="pay-field full"><label className="pay-label">Card Number</label><input className="pay-input" placeholder="1234 5678 9012 3456"/></div><div className="pay-field"><label className="pay-label">Expiry</label><input className="pay-input" placeholder="MM / YY"/></div><div className="pay-field"><label className="pay-label">CVV</label><input className="pay-input" type="password" placeholder="•••"/></div><div className="pay-field full"><label className="pay-label">Name on Card</label><input className="pay-input" placeholder="As on card"/></div></div></div>)}{tab==="upi"&&(<div><div style={{fontSize:".71rem",color:"var(--muted)",fontWeight:700,fontFamily:"var(--body)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:".8rem"}}>Open your UPI app:</div><div className="upi-apps">{UPI_APPS.map((u,i)=>(<div key={i} className={`upi-app${selUpi===i?" sel":""}`} onClick={()=>{setSelUpi(i);setTimeout(()=>window.open(u.url,"_blank"),400);}}><div className="upi-app-icon">{u.icon}</div><div className="upi-app-name">{u.name}</div><div style={{fontSize:".54rem",color:"var(--gold-d)",background:"rgba(201,168,76,.12)",borderRadius:4,padding:"2px 5px",border:"1px solid rgba(201,168,76,.2)"}}>Open ↗</div></div>))}</div><div style={{display:"flex",alignItems:"center",gap:".7rem",margin:".9rem 0"}}><div style={{flex:1,height:1,background:"var(--bd)"}}/><div style={{fontSize:".71rem",color:"var(--muted)"}}>or enter UPI ID</div><div style={{flex:1,height:1,background:"var(--bd)"}}/></div><div style={{position:"relative",marginBottom:".8rem"}}><span style={{position:"absolute",left:"1rem",top:"50%",transform:"translateY(-50%)",fontWeight:800,color:"var(--gold-d)",fontSize:"1.1rem"}}>@</span><input className="pay-input" style={{paddingLeft:"2.8rem"}} placeholder="yourname@upi" value={upiId} onChange={e=>setUpiId(e.target.value)}/></div><button style={{width:"100%",background:"linear-gradient(135deg,#4752c4,#7289da)",color:"#fff",border:"none",padding:".82rem",borderRadius:12,fontFamily:"var(--grotesk)",fontSize:".9rem",fontWeight:700,cursor:"pointer",boxShadow:"0 4px 16px rgba(71,82,196,.36)",letterSpacing:".04em",textTransform:"uppercase"}} onClick={()=>upiId&&handlePay()}>Verify & Pay ₹{Math.round(price*83)}</button></div>)}{tab==="bank"&&(<div><div className="bank-list">{BANKS.map((b,i)=>(<div key={i} className={`bank-item${selBank===i?" sel":""}`} onClick={()=>setSelBank(i)}><div className="bank-logo" style={{background:b.bg,color:b.color}}>{b.abbr}</div><div style={{flex:1}}><div className="bank-name">{b.name}</div><div style={{fontSize:".67rem",color:"var(--muted)"}}>{b.type}</div></div><div className="bank-radio">{selBank===i&&"✓"}</div></div>))}</div></div>)}{paying&&(<div className="pay-progress"><div className="pp-header"><span className="pp-label">Processing…</span><span className="pp-pct">{payPct}%</span></div><div className="pp-bar"><div className="pp-fill" style={{width:`${payPct}%`}}/></div><div className="pp-steps">{PAY_STEPS.map((s,i)=>(<div key={i} className={`pp-step${i===payStep?" active":i<payStep?" done":""}`}><span className="pp-dot"/>{i<payStep?"✓ ":""}{s}</div>))}</div></div>)}<div className="pm-actions"><button className="pm-cancel-btn" onClick={onClose} disabled={paying}>Cancel</button><button className="pm-pay-btn" onClick={tab!=="upi"&&tab!=="bank"?handlePay:(tab==="bank"&&selBank!==null?handlePay:()=>{})} disabled={paying}>{paying?<div className="processing-dots"><div className="proc-dot"/><div className="proc-dot"/><div className="proc-dot"/></div>:`Pay $${price}${annual?"/yr":"/mo"} →`}</button></div></div></>)}</div></div>);}

function Toast({msg,onClose}){return(<div className="toast"><div className="toast-icon">✦</div><span>{msg}</span><button className="toast-close" onClick={onClose}>✕</button></div>);}

/* ══════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════ */
function HomePage({onNav,onJobClick,savedJobs,onSave,visible}){
  const roles=useCountUp(8412,1800,visible);
  const cos=useCountUp(1203,1600,visible);
  const hires=useCountUp(94,1400,visible);

  return(
    <div>
      <section className="hero">
        <div className="hero-video-wrap">
          <video autoPlay muted loop playsInline>
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4"/>
          </video>
        </div>
        <div className="hero-video-fallback"/>
        <div className="hero-orb hero-orb-1"/>
        <div className="hero-orb hero-orb-2"/>
        <div className="hero-scan"/>
        <div className="hero-grain"/>
        <div className="hero-vignette"/>
        <div className="hero-bottom-fade"/>

        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow">
              <span className="hero-live-dot"/>
              <span>8,412+ curated opportunities live now</span>
            </div>
            <h1 className="hero-h1">
              <span className="h1-line"><span className="h1-inner"><span className="h1-serif" style={{fontSize:"clamp(2.8rem,6.2vw,6.2rem)"}}>The </span><span className="h1-syne gold-grad" style={{fontSize:"clamp(3rem,6.5vw,6.5rem)"}}>PREMIUM</span></span></span>
              <span className="h1-line"><span className="h1-inner"><span className="h1-bebas" style={{fontSize:"clamp(4rem,8.5vw,8.5rem)",WebkitTextFillColor:"transparent",WebkitTextStroke:"2px rgba(255,255,255,.42)"}}>PLATFORM</span></span></span>
              <span className="h1-line"><span className="h1-inner"><span className="h1-serif" style={{fontSize:"clamp(2.2rem,5vw,5rem)",color:"rgba(255,255,255,.52)"}}>for </span><span className="sig-underline"><span className="h1-syne gold-grad" style={{fontSize:"clamp(2.6rem,5.8vw,5.8rem)"}}>ELITE</span></span><span className="h1-serif" style={{fontSize:"clamp(2.2rem,5vw,5rem)",color:"rgba(255,255,255,.52)"}}> Careers</span></span></span>
            </h1>
            <p className="hero-sub">
              Handpicked roles at companies building the future.<br/>
              <span style={{fontFamily:"var(--serif)",fontStyle:"italic",color:"rgba(255,255,255,.26)"}}>AI-matched to your profile — no recruiter spam, ever.</span>
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={()=>onNav("listings")}>Explore 8,400+ Jobs →</button>
              <button className="btn-secondary" onClick={()=>onNav("resume")}>Upload Resume</button>
            </div>
            <div className="hero-stats">
              {[[roles,"","Live Roles"],[cos,"","Companies"],[hires,"K+","Hires Made"]].map(([n,s,l],i)=>(
                <div key={l} className="h-stat" style={{animationDelay:`${i*.1}s`}}>
                  <span className="h-stat-num">{typeof n==="number"?n.toLocaleString():n}{s}</span>
                  <span className="h-stat-label">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PHOTO COLLAGE */}
          <div className="hero-right">
            <div className="hero-img-main">
              <img src={IMG.office1} alt="Premium office space"/>
              <div className="hero-img-overlay"/>
              <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"1.5rem 1.8rem",zIndex:1}}>
                <div style={{fontFamily:"var(--playfair)",fontStyle:"italic",fontSize:"clamp(1rem,1.4vw,1.3rem)",color:"rgba(255,255,255,.7)",lineHeight:1.4}}>"Where ambition<br/>meets opportunity"</div>
              </div>
            </div>
            <div className="hero-photo-grid">
              {[IMG.team,IMG.cowork,IMG.meeting,IMG.startup].map((src,i)=>(
                <div key={i} className="hero-photo-thumb" style={{animationDelay:`${.8+i*.1}s`}}>
                  <img src={src} alt=""/>
                </div>
              ))}
            </div>
            <div className="hero-card-float hero-card-1" style={{display:"flex",alignItems:"center",gap:"1rem"}}>
              <div style={{width:38,height:38,borderRadius:10,overflow:"hidden",flexShrink:0}}><img src={IMG.co1} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
              <div style={{flex:1,minWidth:0}}><div className="hc-title" style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Sr. Product Designer · Figma</div><div className="hc-sub">₹1.2–1.6 Cr · San Francisco</div></div>
              <div className="hc-dot"/>
            </div>
            <div className="hero-card-float hero-card-2">
              <div className="hc-title">Anthropic</div>
              <div className="hc-sub">31 open roles</div>
              <div style={{marginTop:8,display:"flex",alignItems:"center",gap:5}}>
                {[IMG.p4,IMG.p5].map((src,i)=>(<div key={i} style={{width:20,height:20,borderRadius:"50%",overflow:"hidden",marginLeft:i?-6:0}}><img src={src} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>))}
                <div style={{fontSize:".62rem",color:"rgba(255,255,255,.38)",marginLeft:3}}>+12 new</div>
              </div>
            </div>
            <div className="hero-card-float hero-card-3" style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:28,height:28,borderRadius:"50%",overflow:"hidden"}}><img src={IMG.p2} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
              <div style={{fontSize:".68rem",color:"rgba(255,255,255,.6)"}}>Just hired at Figma 🎉</div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track ltr">
          {[...MARQUEE_ITEMS,...MARQUEE_ITEMS].map((t,i)=>(<div key={i} className={`marquee-item${i%4===0?" gold":""}`}><span className="m-dot"/>{t}</div>))}
        </div>
      </div>

      {/* TYPOGRAPHY STATEMENT */}
      <div className="typo-hero">
        <div className="typo-mesh"/><div className="typo-grain"/>
        <div className="typo-hero-inner">
          <div className="typo-small-text" style={{animation:"fadeUp .6s .1s both"}}>— where exceptional talent meets opportunity —</div>
          <div className="typo-big" style={{animation:"fadeUp .7s .2s both"}}>Your next great</div>
          <div className="typo-big-2" style={{animation:"fadeUp .8s .32s both"}}>CAREER MOVE</div>
          <div className="typo-small-text" style={{animation:"fadeUp .6s .44s both"}}>8,412 live roles · 1,203 companies · 94,000+ hires made</div>
          <div className="typo-sig" style={{animation:"fadeUp .6s .56s both"}}>"crafted for those who refuse to settle"</div>
          <div style={{display:"flex",gap:".8rem",justifyContent:"center",marginTop:"clamp(1.5rem,3vh,2.5rem)",animation:"fadeUp .6s .68s both",flexWrap:"wrap"}}>
            <button className="btn-primary" onClick={()=>onNav("listings")}>Start Exploring →</button>
            <button className="btn-secondary" onClick={()=>onNav("plans")} style={{borderColor:"rgba(255,255,255,.2)"}}>View Plans</button>
          </div>
        </div>
      </div>

      {/* PHOTO BENTO */}
      <div className="photo-strip">
        <div className="photo-strip-orb"/><div className="photo-strip-scan"/>
        <div className="photo-strip-head">
          <div><div className="ps-label">Culture & Companies</div><div className="ps-title">Life at the <em>World's Best</em></div></div>
          <div className="ps-sub">Behind the scenes at top-tier companies</div>
        </div>
        <div className="photo-bento">
          {BENTO_PHOTOS.map((p,i)=>(<div key={i} className={`pb-item ${p.cls}`} style={{animation:`fadeUp .6s ${i*.1}s both`}}><img src={p.src} alt={p.label}/><div className="pb-label"><div className="pb-label-title">{p.label}</div><div className="pb-label-sub">{p.sub}</div></div></div>))}
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={{background:"var(--surface)",padding:"clamp(4rem,7vh,6rem) 0"}}>
        <div className="section" style={{padding:"0 clamp(1.5rem,4vw,2.5rem)"}}>
          <div className="sec-head"><div><div className="sec-label">Explore Roles</div><div className="sec-title"><span>Browse by <em>Category</em></span></div></div></div>
          <div className="cat-scroll">
            {CATEGORIES.map((c,i)=>(<div key={c.label} className="cat-pill" style={{animation:`fadeUp .5s ${i*.06}s both`}} onClick={()=>onNav("listings")}><span className="cat-pill-icon">{c.icon}</span><span className="cat-pill-label">{c.label}</span><span className="cat-pill-count">{c.count}</span></div>))}
          </div>
        </div>
      </div>

      {/* FEATURED JOBS */}
      <div style={{background:"var(--off)",padding:"clamp(4rem,7vh,6rem) 0"}}>
        <div className="section" style={{padding:"0 clamp(1.5rem,4vw,2.5rem)"}}>
          <div className="sec-head"><div><div className="sec-label">Handpicked for You</div><div className="sec-title"><span><em>Featured</em> Opportunities</span></div></div><button className="link-btn" onClick={()=>onNav("listings")}>View all →</button></div>
          <div className="jobs-grid">{JOBS.filter(j=>j.featured).map((job,i)=>(<JobCard key={job.id} job={job} saved={savedJobs.includes(job.id)} onSave={onSave} onClick={onJobClick} delay={i*.1}/>))}</div>
        </div>
      </div>

      {/* COMPANIES */}
      <div style={{background:"var(--surface)",padding:"clamp(4rem,7vh,6rem) 0"}}>
        <div className="section" style={{padding:"0 clamp(1.5rem,4vw,2.5rem)"}}>
          <div className="sec-head"><div><div className="sec-label">Top Employers</div><div className="sec-title"><span>Companies <em>Hiring Now</em></span></div></div><button className="link-btn" onClick={()=>onNav("companies")}>All companies →</button></div>
          <div className="co-grid">
            {COMPANIES.slice(0,3).map((co,i)=>(<div key={co.id} className="co-card" style={{animation:`fadeUp .6s ${i*.1}s both`}} onClick={()=>onNav("company",null,co)}><div className="co-banner"><img src={co.banner} alt=""/><div className="co-banner-overlay"/></div><div className="co-body"><div className="co-header"><CoLogo co={co} size={46} radius={12}/><div style={{marginTop:".2rem"}}><div className="co-name">{co.name}</div><div className="co-ind">{co.industry}</div></div></div><div className="co-desc">{co.about.slice(0,96)}…</div><div className="co-footer"><span className="roles-chip">{co.open} open roles</span><span className="co-size">{co.size}</span></div></div></div>))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{background:"var(--abyss)",padding:"clamp(4rem,7vh,6rem) 0",overflow:"hidden",position:"relative"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 50% at 50% 50%,rgba(201,168,76,.1),transparent 60%)",pointerEvents:"none"}}/>
        <div className="section" style={{padding:"0 clamp(1.5rem,4vw,2.5rem) clamp(2rem,3.5vh,3rem)"}}><div className="sec-head" style={{marginBottom:"2rem"}}><div><div className="sec-label">Success Stories</div><div className="sec-title dark-title">Loved by <em>Job Seekers</em></div></div></div></div>
        <div style={{overflow:"hidden"}}><div className="testi-scroll">{[...TESTIMONIALS,...TESTIMONIALS].map((t,i)=>(<div key={i} className="testi-card"><div className="stars">★★★★★</div><div className="testi-quote">"{t.quote}"</div><div className="testi-author"><div className="testi-avatar"><img src={t.img} alt=""/></div><div><div className="testi-name">{t.name}</div><div className="testi-role">{t.role}</div></div></div></div>))}</div></div>
      </div>

      {/* DARK CTA */}
      <div style={{background:"var(--abyss)",padding:"clamp(5rem,9vh,8rem) 2.5rem",textAlign:"center",position:"relative",overflow:"hidden",borderTop:"1px solid rgba(201,168,76,.1)"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 50% at 50% 50%,rgba(201,168,76,.18),transparent 65%)",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:660,margin:"0 auto"}}>
          <div className="sec-label" style={{justifyContent:"center",animation:"fadeUp .6s .1s both"}}>Ready to Start?</div>
          <div style={{marginBottom:".5rem",animation:"fadeUp .7s .2s both"}}>
            <span style={{fontFamily:"var(--playfair)",fontStyle:"italic",fontWeight:700,fontSize:"clamp(2.2rem,4vw,4rem)",color:"rgba(255,255,255,.7)",lineHeight:".95",display:"block"}}>Your next great role</span>
            <span style={{fontFamily:"var(--disp)",fontWeight:900,fontSize:"clamp(3rem,6vw,6rem)",background:"linear-gradient(120deg,var(--gold2),var(--gold3))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",lineHeight:"1",display:"block",letterSpacing:".04em"}}>STARTS HERE</span>
          </div>
          <div className="dark-sub" style={{marginBottom:"2.5rem",fontSize:"1rem",animation:"fadeUp .6s .32s both"}}>Join 200,000+ professionals who found their next opportunity on WorkBoard.</div>
          <div style={{display:"flex",gap:".8rem",justifyContent:"center",flexWrap:"wrap",animation:"fadeUp .6s .44s both"}}>
            <button className="btn-primary" onClick={()=>onNav("listings")}>Browse 8,400+ Jobs</button>
            <button className="btn-secondary" onClick={()=>onNav("plans")}>View Plans</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ SECONDARY PAGES ═══ */
function ListingsPage({onJobClick,savedJobs,onSave}){const[salary,setSalary]=useState(200);const[types,setTypes]=useState([]);const[levels,setLevels]=useState([]);const[remoteOnly,setRemoteOnly]=useState(false);const toggle=(arr,set,v)=>set(arr.includes(v)?arr.filter(x=>x!==v):[...arr,v]);const filtered=JOBS.filter(j=>{if(j.salaryNum>salary)return false;if(types.length&&!types.includes(j.type))return false;if(levels.length&&!levels.includes(j.level))return false;if(remoteOnly&&!j.remote)return false;return true;});return(<div className="listings-layout" style={{paddingTop:"calc(var(--nav-h) + 1.5rem)"}}><aside className="sidebar"><div className="sb-title">Filters</div><div className="filter-group"><span className="filter-label">Salary (max)</span><div className="range-wrap"><input type="range" min="50" max="200" step="5" value={salary} onChange={e=>setSalary(+e.target.value)}/><div className="range-value">₹{salary}L / yr</div></div></div><div className="filter-group"><span className="filter-label">Job Type</span>{["Full-time","Contract","Internship"].map(t=>(<div key={t} className="filter-opt"><input type="checkbox" checked={types.includes(t)} onChange={()=>toggle(types,setTypes,t)}/><span>{t}</span></div>))}</div><div className="filter-group"><span className="filter-label">Level</span>{["Junior","Mid","Senior","Lead"].map(l=>(<div key={l} className="filter-opt"><input type="checkbox" checked={levels.includes(l)} onChange={()=>toggle(levels,setLevels,l)}/><span>{l}</span></div>))}</div><div className="filter-group"><span className="filter-label">Work Mode</span><div className="filter-opt"><input type="checkbox" checked={remoteOnly} onChange={e=>setRemoteOnly(e.target.checked)}/><span>Remote only</span></div></div><button className="reset-btn" onClick={()=>{setSalary(200);setTypes([]);setLevels([]);setRemoteOnly(false);}}>Reset Filters</button></aside><main className="listings-main"><div className="list-header"><div className="list-count">Showing <strong>{filtered.length}</strong> of {JOBS.length}</div><select className="sort-select"><option>Most Recent</option><option>Highest Salary</option><option>Most Relevant</option></select></div>{filtered.map((job,i)=>{const co=COMPANIES.find(c=>c.id===job.coId);return(<div key={job.id} className="list-row" style={{animation:`fadeUp .4s ${i*.06}s both`}} onClick={()=>onJobClick(job)}>{co?<CoLogo co={co} size={46} radius={12}/>:<div style={{width:46,height:46,borderRadius:12,background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{job.company[0]}</div>}<div className="list-info"><div className="list-title">{job.title}</div><div className="list-meta"><span>{job.company}</span><span>·</span><span>📍 {job.location}</span><TagBadge type="type">{job.type}</TagBadge>{job.remote&&<TagBadge type="remote">Remote</TagBadge>}</div></div><div className="list-right"><div className="j-salary">{job.salary}</div><div className="j-date">{job.date}</div></div><button className={`save-btn${savedJobs.includes(job.id)?" saved":""}`} onClick={e=>{e.stopPropagation();onSave(job.id);}} style={{flexShrink:0}}>{savedJobs.includes(job.id)?"♥":"♡"}</button></div>);})}{!filtered.length&&<div className="empty-wrap"><span className="empty-icon">🔍</span><h3>No matches</h3><p>Try relaxing your filters.</p></div>}</main></div>);}
function JobDetailPage({job,savedJobs,onSave,onApply,onCompanyClick}){const co=COMPANIES.find(c=>c.id===job.coId);return(<div className="detail-layout" style={{paddingTop:"calc(var(--nav-h) + 1.5rem)"}}><div className="detail-main"><div className="detail-header" style={{animation:"fadeUp .5s both"}}><div className="d-logo-row">{co?<CoLogo co={co} size={64} radius={16}/>:<div style={{width:64,height:64,borderRadius:16,background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem"}}>{job.company[0]}</div>}<div><div className="d-title">{job.title}</div><div className="d-company" onClick={()=>co&&onCompanyClick(co)}>{job.company} ↗</div></div></div><div className="tags"><TagBadge type="type">{job.type}</TagBadge>{job.remote&&<TagBadge type="remote">Remote</TagBadge>}<TagBadge type="level">{job.level}</TagBadge><TagBadge type="gold">✦ Featured</TagBadge></div><div className="d-tags"><div className="d-fact">📍 {job.location}</div><div className="d-fact">🕐 {job.type}</div><div className="d-fact">📅 {job.date}</div><div className="d-fact">🎯 {job.level}</div></div></div><div className="d-section" style={{animation:"fadeUp .5s .08s both"}}><h3>About the Role</h3><p>{job.desc}</p><p>High impact, high autonomy. You'll work closely with engineering, product, and leadership to shape the future of the product.</p></div><div className="d-section" style={{animation:"fadeUp .5s .16s both"}}><h3>Requirements</h3><ul className="req-list">{job.reqs.map((r,i)=><li key={i}>{r}</li>)}</ul></div><div className="d-section" style={{animation:"fadeUp .5s .24s both"}}><h3>What We Offer</h3><ul className="req-list"><li>Salary: {job.salary}</li><li>Equity (4-year vesting)</li><li>Health, dental & vision</li><li>₹1.5L annual L&D budget</li><li>Flexible PTO & remote-first culture</li></ul></div>{co&&<div className="d-section" style={{animation:"fadeUp .5s .32s both"}}><h3>About {co.name}</h3><p>{co.about}</p></div>}</div><div className="detail-side"><div className="sticky-card"><div className="sc-label">Compensation</div><div className="sc-salary">{job.salary}</div><button className="apply-btn" onClick={onApply}>Apply Now →</button><button className="save-role-btn" onClick={()=>onSave(job.id)}>{savedJobs.includes(job.id)?"♥ Saved":"♡ Save Role"}</button><div style={{fontSize:".72rem",color:"var(--muted)",textAlign:"center",marginTop:".75rem"}}>⏰ Closes in ~2 weeks</div><div className="sc-meta">📍 {job.location}<br/>🕐 {job.type}<br/>{co&&<>🏢 {co.size} employees</>}</div></div></div></div>);}
function CompaniesPage({onCompanyClick}){return(<div style={{background:"var(--surface)",padding:"clamp(4rem,7vh,6rem) 0",paddingTop:"calc(var(--nav-h) + 4rem)"}}><div className="section" style={{padding:"0 clamp(1.5rem,4vw,2.5rem)"}}><div className="sec-head"><div><div className="sec-label">Top Employers</div><div className="sec-title"><span>Companies <em>Hiring Now</em></span></div></div></div><div className="co-grid">{COMPANIES.map((co,i)=>(<div key={co.id} className="co-card" style={{animation:`fadeUp .6s ${i*.08}s both`}} onClick={()=>onCompanyClick(co)}><div className="co-banner"><img src={co.banner} alt=""/><div className="co-banner-overlay"/></div><div className="co-body"><div className="co-header"><CoLogo co={co} size={46} radius={12}/><div style={{marginTop:".2rem"}}><div className="co-name">{co.name}</div><div className="co-ind">{co.industry}</div></div></div><div className="co-desc">{co.about}</div><div className="co-footer"><span className="roles-chip">{co.open} open roles</span><span className="co-size">{co.size}</span></div></div></div>))}</div></div></div>);}
function CompanyDetailPage({co,jobs,onJobClick}){const cjobs=jobs.filter(j=>j.coId===co.id);return(<div style={{maxWidth:1100,margin:"0 auto",padding:"2.5rem clamp(1.5rem,4vw,2.5rem)",paddingTop:"calc(var(--nav-h) + 2.5rem)"}}><div className="d-section" style={{marginBottom:"1.2rem",animation:"fadeUp .5s both"}}><div style={{display:"flex",alignItems:"center",gap:"1.4rem",marginBottom:"1.5rem",flexWrap:"wrap"}}><CoLogo co={co} size={74} radius={18}/><div><div className="hybrid-headline" style={{fontSize:"clamp(1.6rem,3vw,2.1rem)"}}>{co.name}</div><div style={{color:"var(--muted)",fontSize:".87rem"}}>{co.industry} · Founded {co.founded} · {co.hq}</div></div></div><p style={{fontSize:".9rem",lineHeight:1.88,color:"var(--dim)",marginBottom:"1rem"}}>{co.about}</p><div style={{display:"flex",gap:".6rem",flexWrap:"wrap"}}>{[["🏢",co.size],["📍",co.hq],["📅",`Founded ${co.founded}`]].map(([ic,v])=>(<div key={v} className="d-fact">{ic} {v}</div>))}</div></div><div className="d-section" style={{animation:"fadeUp .5s .1s both"}}><h3>Open Roles at {co.name}</h3>{cjobs.length?cjobs.map(job=>(<div key={job.id} className="list-row" style={{marginTop:".7rem"}} onClick={()=>onJobClick(job)}><CoLogo co={co} size={44} radius={11}/><div className="list-info"><div className="list-title">{job.title}</div><div className="list-meta"><span>📍 {job.location}</span><TagBadge type="type">{job.type}</TagBadge></div></div><div className="list-right"><div className="j-salary">{job.salary}</div></div></div>)):<p style={{color:"var(--muted)",fontSize:".85rem"}}>No open roles right now.</p>}</div></div>);}
function PlansPage({onToast}){const[billing,setBilling]=useState("annual");const[faqOpen,setFaqOpen]=useState(null);const[confirmPlan,setConfirmPlan]=useState(null);const annual=billing==="annual";const pr=p=>p[billing];const FAQS=[["Can I cancel anytime?","Yes — no lock-ins. Cancel in 2 clicks from settings."],["Is there a free trial for Pro?","14-day free trial, no credit card required."],["How does AI matching work?","We analyse your resume against 12 dimensions including skills, seniority, and company culture fit."],["What payment methods are accepted?","All major cards, UPI (PhonePe, GPay, Paytm, BHIM), and Net Banking."],["Can I switch plans mid-cycle?","Upgrades are instant and prorated. Downgrades take effect next cycle."]];return(<div style={{paddingTop:"var(--nav-h)"}}><div className="plans-hero"><div className="plans-hero-mesh"/><div style={{position:"relative",zIndex:1}}><div style={{fontFamily:"var(--body)",fontSize:".63rem",fontWeight:800,color:"var(--gold2)",letterSpacing:".25em",textTransform:"uppercase",marginBottom:"1rem",display:"inline-flex",alignItems:"center",gap:".5rem",background:"rgba(201,168,76,.1)",border:"1px solid rgba(201,168,76,.25)",borderRadius:100,padding:"6px 16px",animation:"fadeUp .5s .05s both"}}>✦ Simple Transparent Pricing</div><div className="sec-title dark-title" style={{textAlign:"center",fontSize:"clamp(2.4rem,4.5vw,4.2rem)",margin:"0 auto 1rem",maxWidth:600,animation:"fadeUp .6s .12s both"}}>Invest in your <em>career</em></div><div className="dark-sub" style={{textAlign:"center",maxWidth:460,margin:"0 auto 2.5rem",fontSize:"1rem",animation:"fadeUp .5s .2s both"}}>Plans that grow with you — from first search to hiring at scale.</div><div className="billing-toggle" style={{animation:"fadeUp .5s .28s both"}}><button className={`billing-opt${billing==="monthly"?" active":""}`} onClick={()=>setBilling("monthly")}>Monthly</button><button className={`billing-opt${billing==="annual"?" active":""}`} onClick={()=>setBilling("annual")}>Annual <span style={{background:"rgba(42,157,116,.2)",color:"var(--emerald)",fontSize:".63rem",padding:"2px 7px",borderRadius:100,marginLeft:4}}>Save 25%</span></button></div></div></div><div style={{background:"var(--off)",padding:"clamp(4rem,7vh,6rem) 2.5rem"}}><div className="plans-grid">{PLANS.map((plan,i)=>(<div key={plan.key} className={`plan-card${plan.dark?" dark-card":""}`} style={{animation:`fadeUp .6s ${i*.08}s both`}}>{plan.featured&&<div className="plan-badge">⭐ Popular</div>}<div className="plan-tier">{plan.tier}</div><div className="plan-name">{plan.name}</div><div className="plan-desc">{plan.desc}</div><div className="plan-price">{pr(plan)===0?"Free":`$${pr(plan)}`}</div><div className="plan-period">{pr(plan)>0?`per month${annual?" · billed annually":" · billed monthly"}`:"always free"}</div>{pr(plan)>0&&annual&&<div style={{fontSize:".7rem",color:"var(--emerald)",fontWeight:700,marginTop:".25rem"}}>Save ${(plan.monthly-plan.annual)*12}/yr</div>}<hr className="plan-divider"/><ul className="plan-features">{plan.features.map((f,j)=>(<li key={j} className="plan-feat"><span className={`feat-check${f.y?" feat-yes":" feat-no"}`}>{f.y?"✓":"×"}</span><span className={`feat-text${f.d?" dim":""}`}>{f.t}</span></li>))}</ul><button className={`plan-btn ${plan.btnCls}`} onClick={()=>{if(plan.key==="free"){onToast("🚀 You're on the Free plan!");return;}setConfirmPlan(plan);}}>{plan.btn}</button></div>))}</div><div style={{maxWidth:760,margin:"0 auto"}}><div className="hybrid-headline" style={{fontSize:"clamp(1.4rem,2.2vw,1.75rem)",marginBottom:"1.5rem"}}>Frequently Asked Questions</div>{FAQS.map(([q,a],i)=>(<div key={i} style={{background:"var(--white)",border:"1px solid var(--bd)",borderRadius:14,marginBottom:".6rem",overflow:"hidden"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1rem 1.4rem",cursor:"pointer",fontSize:".87rem",fontWeight:700,fontFamily:"var(--syne)"}} onClick={()=>setFaqOpen(faqOpen===i?null:i)}><span>{q}</span><span style={{color:"var(--muted)",transition:"transform .3s",transform:faqOpen===i?"rotate(180deg)":"rotate(0)"}}>▾</span></div>{faqOpen===i&&<div style={{padding:"0 1.4rem 1rem",fontSize:".82rem",color:"var(--muted)",lineHeight:1.78}}>{a}</div>}</div>))}</div></div>{confirmPlan&&(<PaymentModal plan={confirmPlan} billing={billing} price={annual?pr(confirmPlan)*12:pr(confirmPlan)} onClose={()=>setConfirmPlan(null)} onSuccess={()=>{setConfirmPlan(null);onToast(`🎉 Welcome to ${confirmPlan.name}! All features unlocked.`);}}/>)}</div>);}
function AuthPage({onToast,onNav}){const[tab,setTab]=useState("login");return(<div className="auth-page"><div className="auth-left"><div className="auth-mesh"/><div className="auth-left-content"><div className="auth-left-logo">Work<em>Board</em></div><div className="auth-left-title">"Found my dream role in 11 days."</div><div className="auth-left-sub">WorkBoard's AI matched me to a Figma role I would never have found on my own.</div><div style={{display:"flex",gap:".75rem",marginBottom:"2rem",justifyContent:"center"}}><div style={{width:38,height:38,borderRadius:"50%",overflow:"hidden"}}><img src={IMG.p2} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div><div style={{textAlign:"left"}}><div style={{fontFamily:"var(--grotesk)",fontSize:".8rem",fontWeight:600,color:"#fff"}}>Priya Sharma</div><div style={{fontSize:".71rem",color:"rgba(255,255,255,.35)"}}>Product Designer · Figma</div></div></div><div style={{display:"flex",justifyContent:"center",gap:"2rem"}}>{[["8,400+","Jobs"],["94K","Hires"],["200K+","Users"]].map(([n,l])=>(<div key={l} style={{textAlign:"center"}}><span className="als-num">{n}</span><span className="als-label">{l}</span></div>))}</div></div></div><div className="auth-right"><div className="auth-box"><div className="hybrid-headline" style={{fontSize:"clamp(1.6rem,2.5vw,1.9rem)",marginBottom:"2rem"}}>Work<span style={{background:"linear-gradient(135deg,var(--gold2),var(--gold3))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Board</span></div><div className="auth-tabs"><button className={`auth-tab${tab==="login"?" active":""}`} onClick={()=>setTab("login")}>Sign In</button><button className={`auth-tab${tab==="signup"?" active":""}`} onClick={()=>setTab("signup")}>Create Account</button></div>{tab==="login"?<><div className="auth-title">Welcome Back</div><div className="auth-sub">Sign in to your WorkBoard account.</div><div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@example.com"/></div><div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="Your password"/><span className="forgot-link" onClick={()=>onToast("📧 Password reset email sent!")}>Forgot password?</span></div><button className="auth-submit" onClick={()=>{onToast("✅ Signed in! Welcome back.");onNav("home");}}>Sign In →</button><div className="auth-divider"><div className="auth-divider-line"/><div className="auth-divider-text">or continue with</div><div className="auth-divider-line"/></div><div className="social-auth">{[["G","Google"],["in","LinkedIn"],["⌥","GitHub"]].map(([ic,l])=>(<button key={l} className="social-auth-btn" onClick={()=>onToast(`Signing in with ${l}…`)}><span style={{fontWeight:900}}>{ic}</span>{l}</button>))}</div></>:<><div className="auth-title">Create Account</div><div className="auth-sub">Join 200,000+ professionals finding great work.</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".8rem"}}><div className="form-group" style={{marginBottom:0}}><label className="form-label">First Name</label><input className="form-input" placeholder="Priya"/></div><div className="form-group" style={{marginBottom:0}}><label className="form-label">Last Name</label><input className="form-input" placeholder="Sharma"/></div></div><div className="form-group" style={{marginTop:".9rem"}}><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@example.com"/></div><div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="Create a password"/></div><button className="auth-submit" onClick={()=>{onToast("🎉 Account created! Welcome to WorkBoard.");onNav("home");}}>Create Account →</button><div className="auth-footer">By creating an account you agree to our <a onClick={()=>{}}>Terms</a> & <a onClick={()=>{}}>Privacy Policy</a>.</div></>}</div></div></div>);}
function ResumePage({onUploadDone}){const[file,setFile]=useState(null);const[pct,setPct]=useState(0);const[stage,setStage]=useState(0);const[drag,setDrag]=useState(false);const fileRef=useRef();const STAGES=["Uploading","Parsing","Analysing","Indexing"];const handleFile=f=>{if(!f)return;setFile({name:f.name,size:(f.size/1024).toFixed(0)+"KB"});setStage(1);setPct(0);let p=0;const iv=setInterval(()=>{p+=Math.random()*15+8;if(p>=100){clearInterval(iv);setPct(100);setTimeout(()=>{setStage(2);onUploadDone(f.name);},400);}else setPct(Math.min(Math.round(p),99));},200);};const curStage=stage===1?Math.floor(pct/25):4;return(<div className="resume-page" style={{paddingTop:"calc(var(--nav-h) + 2rem)"}}><div className="hybrid-headline" style={{fontSize:"clamp(2rem,4vw,2.7rem)",marginBottom:".4rem",animation:"fadeUp .5s .05s both"}}>Upload Your Resume</div><div style={{color:"var(--muted)",fontSize:".87rem",marginBottom:"2.5rem",lineHeight:1.72,fontWeight:300,animation:"fadeUp .5s .14s both"}}>Go live to 1,200+ hiring companies. Upload once — apply everywhere.</div>{stage===0&&(<div className={`upload-zone${drag?" dragging":""}`} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}} onClick={()=>fileRef.current.click()}><input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/><div className="uz-icon">📄</div><div className="uz-title">{drag?"Drop it here!":"Drag & Drop Resume"}</div><div className="uz-sub">or click to browse your files</div><div className="uz-formats">{["PDF","DOC","DOCX","Max 5MB"].map(f=><span key={f} className="uz-fmt">{f}</span>)}</div></div>)}{stage===1&&(<div style={{background:"var(--abyss)",border:"1px solid rgba(201,168,76,.2)",borderRadius:22,padding:"1.8rem",marginBottom:"1.5rem"}}><div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.3rem"}}><div style={{width:50,height:50,borderRadius:14,background:"rgba(201,168,76,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",flexShrink:0}}>📎</div><div style={{flex:1}}><div style={{fontFamily:"var(--syne)",fontWeight:800,fontSize:".98rem",color:"#fff",marginBottom:2}}>{file?.name}</div><div style={{fontSize:".71rem",color:"rgba(255,255,255,.3)"}}>{file?.size}</div></div><div style={{fontFamily:"var(--grotesk)",fontWeight:700,fontSize:"1.4rem",color:"var(--gold2)"}}>{pct}%</div></div><div style={{height:4,background:"rgba(255,255,255,.07)",borderRadius:4,overflow:"hidden",marginBottom:".6rem"}}><div style={{height:"100%",background:"linear-gradient(90deg,var(--gold-d),var(--gold2),var(--emerald))",backgroundSize:"200% 100%",animation:"shimmer 1.5s linear infinite",transition:"width .4s ease",borderRadius:4,width:`${pct}%`}}/></div><div style={{display:"flex",gap:".4rem",flexWrap:"wrap"}}>{STAGES.map((s,i)=>(<div key={s} style={{display:"flex",alignItems:"center",gap:4,background:i===curStage?"rgba(201,168,76,.15)":i<curStage?"rgba(42,157,116,.1)":"rgba(255,255,255,.04)",border:`1px solid ${i===curStage?"rgba(201,168,76,.35)":i<curStage?"rgba(42,157,116,.3)":"rgba(255,255,255,.07)"}`,borderRadius:100,padding:"3px 9px",fontSize:".67rem",color:i===curStage?"var(--gold2)":i<curStage?"var(--emerald)":"rgba(255,255,255,.25)",fontFamily:"var(--body)",fontWeight:700}}><span style={{width:5,height:5,borderRadius:"50%",background:"currentColor",flexShrink:0,animation:i===curStage?"pulse 1s ease-in-out infinite":"none"}}/>{i<curStage?"✓ ":""}{s}</div>))}</div></div>)}{stage===2&&(<div style={{background:"var(--abyss)",border:"1px solid rgba(42,157,116,.25)",borderRadius:22,padding:"1.8rem",textAlign:"center",marginBottom:"1.5rem"}}><div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,rgba(42,157,116,.2),rgba(201,168,76,.2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",margin:"0 auto .9rem",animation:"successPop .7s cubic-bezier(.34,1.56,.64,1) both"}}>✅</div><div className="hybrid-headline" style={{fontSize:"1.4rem",color:"#fff",marginBottom:".4rem"}}>Resume is Live!</div><div style={{fontSize:".81rem",color:"rgba(255,255,255,.38)",marginBottom:"1rem"}}>{file?.name} · AI-parsed · Profile updated</div><div style={{display:"flex",gap:".5rem",justifyContent:"center",flexWrap:"wrap"}}>{[["✓ Recruiter visible","rgba(42,157,116,.1)","rgba(42,157,116,.25)","var(--emerald)"],["✓ Skills extracted","rgba(42,157,116,.1)","rgba(42,157,116,.25)","var(--emerald)"],["⭐ 72% profile match","rgba(201,168,76,.1)","rgba(201,168,76,.25)","var(--gold2)"]].map(([t,bg,b,c])=>(<span key={t} style={{background:bg,border:`1px solid ${b}`,borderRadius:100,padding:"4px 12px",fontSize:".7rem",color:c,fontFamily:"var(--body)",fontWeight:700}}>{t}</span>))}</div><button style={{marginTop:"1rem",background:"none",border:"none",color:"rgba(255,255,255,.22)",cursor:"pointer",fontSize:".72rem"}} onClick={()=>{setStage(0);setFile(null);}}>Upload different file</button></div>)}<div style={{background:"var(--white)",border:"1px solid var(--bd)",borderRadius:22,padding:"2rem",marginTop:"1.5rem",animation:"fadeUp .5s .3s both"}}><div className="hybrid-headline" style={{fontSize:"clamp(1.1rem,1.6vw,1.35rem)",marginBottom:"1.5rem"}}>Profile Details</div><div className="form-grid">{[["First Name","Priya"],["Last Name","Sharma"],["Email","priya@example.com"],["Phone","+91 98765 43210"],["Current Role","Sr. Product Designer"],["Desired CTC","₹25,00,000"]].map(([l,p])=>(<div key={l} className="form-group"><label className="form-label">{l}</label><input className="form-input" placeholder={p}/></div>))}<div className="form-group form-full"><label className="form-label">Bio</label><textarea className="form-input" rows={3} placeholder="A short intro about yourself…" style={{resize:"vertical"}}/></div></div><button className="form-submit" onClick={()=>onUploadDone("profile")}>Save & Go Live →</button></div></div>);}
function SavedPage({savedJobs,jobs,onJobClick,onSave}){const saved=jobs.filter(j=>savedJobs.includes(j.id));if(!saved.length)return(<div className="empty-wrap" style={{paddingTop:"calc(var(--nav-h) + 4rem)"}}><span className="empty-icon">♡</span><h3>No saved roles yet</h3><p>Bookmark roles and they'll appear here.</p></div>);return(<div className="section" style={{paddingTop:"calc(var(--nav-h) + 3rem)"}}><div className="sec-head"><div><div className="sec-label">Bookmarked</div><div className="sec-title"><span><em>Saved</em> Roles</span></div></div></div><div className="jobs-grid">{saved.map((job,i)=><JobCard key={job.id} job={job} saved onSave={onSave} onClick={onJobClick} delay={i*.08}/>)}</div></div>);}
function ContactPage({onToast}){const[tab,setTab]=useState("seeker");return(<div className="contact-page" style={{paddingTop:"calc(var(--nav-h) + 2rem)"}}><div className="hybrid-headline" style={{fontSize:"clamp(2rem,4vw,2.7rem)",marginBottom:".4rem",animation:"fadeUp .5s .05s both"}}>Get in Touch</div><div style={{color:"var(--muted)",fontSize:".87rem",marginBottom:"2rem",animation:"fadeUp .5s .14s both"}}>Whether you're hiring or searching — we're here to help.</div><div className="contact-tabs"><button className={`contact-tab${tab==="seeker"?" active":""}`} onClick={()=>setTab("seeker")}>Job Seeker</button><button className={`contact-tab${tab==="employer"?" active":""}`} onClick={()=>setTab("employer")}>Employer</button></div><div className="contact-box" style={{animation:"fadeUp .4s .1s both"}}>{tab==="seeker"?<><div className="cb-title">Need Help With Your Search?</div><div className="cb-sub">Tell us about your account or a listing issue.</div><div className="form-grid"><div className="form-group"><label className="form-label">Name</label><input className="form-input" placeholder="Your name"/></div><div className="form-group"><label className="form-label">Email</label><input className="form-input" placeholder="your@email.com"/></div><div className="form-group form-full"><label className="form-label">Subject</label><select className="form-input"><option>General Inquiry</option><option>Account Issue</option><option>Report a Listing</option><option>Other</option></select></div><div className="form-group form-full"><label className="form-label">Message</label><textarea className="form-input" rows={5} placeholder="Tell us what's on your mind…"/></div></div><button className="form-submit" onClick={()=>onToast("✉️ Message sent! We'll reply within 24h.")}>Send Message</button></>:<><div className="cb-title">Post a Job or Partner With Us</div><div className="cb-sub">Reach thousands of qualified candidates.</div><div className="form-grid"><div className="form-group"><label className="form-label">Your Name</label><input className="form-input" placeholder="Jane Smith"/></div><div className="form-group"><label className="form-label">Company</label><input className="form-input" placeholder="Acme Corp"/></div><div className="form-group"><label className="form-label">Work Email</label><input className="form-input" placeholder="jane@company.com"/></div><div className="form-group"><label className="form-label">Team Size</label><select className="form-input"><option>1–10</option><option>11–50</option><option>51–200</option><option>200+</option></select></div><div className="form-group form-full"><label className="form-label">Details</label><textarea className="form-input" rows={4} placeholder="Describe your hiring needs…"/></div></div><button className="form-submit" onClick={()=>onToast("🏢 Thanks! Our team will reach out shortly.")}>Submit Inquiry</button></>}</div></div>);}
function SocialPage({onToast}){const[nlEmail,setNlEmail]=useState("");const[nlDone,setNlDone]=useState(false);const[followStates,setFollowStates]=useState({});const toggleFollow=name=>{setFollowStates(prev=>{const next={...prev,[name]:!prev[name]};onToast(next[name]?`✅ Following ${name}!`:`Unfollowed ${name}`);return next;});};return(<div className="social-page" style={{paddingTop:"calc(var(--nav-h) + 2rem)"}}><div className="hybrid-headline" style={{fontSize:"clamp(2rem,4vw,2.7rem)",marginBottom:".4rem",animation:"fadeUp .5s .05s both"}}>Connect With Us</div><div style={{color:"var(--muted)",fontSize:".87rem",marginBottom:"2.5rem",animation:"fadeUp .5s .14s both"}}>Follow us for job drops, career tips, and community updates.</div><div style={{background:"linear-gradient(135deg,var(--abyss),#18142e)",border:"1px solid rgba(201,168,76,.22)",borderRadius:22,padding:"1.8rem 2rem",marginBottom:"1.8rem",position:"relative",overflow:"hidden",animation:"fadeUp .5s .2s both"}}><div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 50% 80% at 90% 50%,rgba(201,168,76,.12),transparent 60%)",pointerEvents:"none"}}/><div style={{position:"relative",zIndex:1}}><div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(201,168,76,.1)",border:"1px solid rgba(201,168,76,.22)",borderRadius:100,padding:"4px 12px",fontFamily:"var(--body)",fontSize:".63rem",fontWeight:800,color:"var(--gold2)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:".9rem"}}>⚡ Advertise with Us</div><div className="hybrid-headline" style={{fontSize:"clamp(1.2rem,2vw,1.5rem)",color:"#fff",marginBottom:".4rem"}}>Reach 200K+ Active Job Seekers</div><div style={{fontSize:".81rem",color:"rgba(255,255,255,.38)",marginBottom:"1.2rem",lineHeight:1.68}}>Promote open roles and your employer brand to qualified candidates.</div><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:".7rem",marginBottom:"1.2rem"}}>{[["200K+","Monthly Reach"],["8.4%","Avg. CTR"],["94K","Hires"],["₹3,200","Avg. CPL"]].map(([n,l])=>(<div key={l} style={{background:"rgba(255,255,255,.05)",borderRadius:12,padding:".8rem .9rem"}}><div style={{fontFamily:"var(--grotesk)",fontSize:"clamp(1rem,1.5vw,1.35rem)",fontWeight:700,color:"var(--gold2)",display:"block"}}>{n}</div><div style={{fontFamily:"var(--body)",fontSize:".62rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"rgba(255,255,255,.28)"}}>{l}</div></div>))}</div><button style={{background:"linear-gradient(135deg,var(--gold-d),var(--gold))",color:"#1a0e00",border:"none",padding:".7rem 1.6rem",borderRadius:100,fontFamily:"var(--grotesk)",fontSize:".85rem",fontWeight:700,cursor:"pointer",letterSpacing:".04em",textTransform:"uppercase"}} onClick={()=>onToast("📣 Our ads team will be in touch!")}>Get Media Kit →</button></div></div><div className="social-grid">{SOCIALS.map((s,i)=>(<div key={s.name} className="social-card" style={{background:s.bg,border:`1px solid ${s.border}`,animation:`fadeUp .5s ${i*.07}s both`}}><div className="sc-icon">{s.icon}</div><div className="sc-name">{s.name}</div><div className="sc-handle">{s.handle}</div><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:".5rem"}}><div style={{fontSize:".7rem",opacity:.4}}>{s.followers} followers</div><button className="sc-follow-btn" onClick={e=>{e.stopPropagation();toggleFollow(s.name);}} style={followStates[s.name]?{background:"rgba(255,255,255,.28)",borderColor:"rgba(255,255,255,.45)"}:{}}>{followStates[s.name]?"✓ Following":"Follow →"}</button></div></div>))}</div><div className="nl-box" style={{animation:"fadeUp .5s .5s both"}}><div style={{fontSize:"2rem",marginBottom:".5rem"}}>📬</div><div className="nl-title">Weekly Job Digest</div><div className="nl-sub">Top 10 curated roles every Monday. No noise, ever.</div>{nlDone?(<div style={{background:"rgba(42,157,116,.1)",border:"1px solid rgba(42,157,116,.25)",borderRadius:100,padding:".6rem 1.4rem",color:"var(--emerald)",fontFamily:"var(--grotesk)",fontWeight:700,fontSize:".84rem",display:"inline-block"}}>✓ You're subscribed! Check your inbox on Monday.</div>):(<div className="nl-form"><input className="nl-input" type="email" placeholder="your@email.com" value={nlEmail} onChange={e=>setNlEmail(e.target.value)}/><button className="nl-btn" onClick={()=>{if(nlEmail){setNlDone(true);onToast("🎉 Subscribed to weekly digest!");}else{onToast("Please enter a valid email.");}}}>Subscribe</button></div>)}</div></div>);}

/* ══════════════════════════════════════════════════
   APP SHELL
══════════════════════════════════════════════════ */
export default function App(){
  const[loading,setLoading]=useState(true);
  const[transitioning,setTransitioning]=useState(false);
  const[pendingPage,setPendingPage]=useState(null);
  const[page,setPage]=useState("home");
  const[selJob,setSelJob]=useState(null);
  const[selCo,setSelCo]=useState(null);
  const[savedJobs,setSavedJobs]=useState([1,4]);
  const[toast,setToast]=useState(null);
  const[applyModal,setApplyModal]=useState(null);
  const[scrolled,setScrolled]=useState(false);
  const[pageVisible,setPageVisible]=useState(false);
  const[chatOpen,setChatOpen]=useState(false);
  const[mobileNavOpen,setMobileNavOpen]=useState(false);
  const toastRef=useRef();
  const isHomePage=page==="home";
  const isLightPage=!isHomePage&&page!=="login";

  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>20);window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);},[]);
  useEffect(()=>{
    if(!mobileNavOpen)return;
    const prevOverflow=document.body.style.overflow;
    const onKey=e=>{if(e.key==="Escape")setMobileNavOpen(false);};
    const onResize=()=>{if(window.innerWidth>860)setMobileNavOpen(false);};
    document.body.style.overflow="hidden";
    window.addEventListener("keydown",onKey);
    window.addEventListener("resize",onResize);
    return()=>{
      document.body.style.overflow=prevOverflow;
      window.removeEventListener("keydown",onKey);
      window.removeEventListener("resize",onResize);
    };
  },[mobileNavOpen]);
  const showToast=msg=>{if(toastRef.current)clearTimeout(toastRef.current);setToast(msg);toastRef.current=setTimeout(()=>setToast(null),3800);};
  const nav=useCallback((newPage,job=null,co=null)=>{setMobileNavOpen(false);if(transitioning)return;if(newPage===page&&!job&&!co)return;setPendingPage({page:newPage,job,co});setTransitioning(true);setPageVisible(false);setChatOpen(false);},[page,transitioning]);
  const onTransitionDone=useCallback(()=>{if(!pendingPage)return;setPage(pendingPage.page);if(pendingPage.job)setSelJob(pendingPage.job);else if(pendingPage.co)setSelCo(pendingPage.co);else{setSelJob(null);setSelCo(null);}setTransitioning(false);setPendingPage(null);window.scrollTo({top:0,behavior:"auto"});setTimeout(()=>setPageVisible(true),120);},[pendingPage]);
  const onLoaderDone=useCallback(()=>{setLoading(false);setTimeout(()=>setPageVisible(true),200);},[]);
  const toggleSave=id=>{const was=savedJobs.includes(id);setSavedJobs(prev=>was?prev.filter(x=>x!==id):[...prev,id]);showToast(was?"Removed from saved ♡":"Saved to bookmarks ♥");};
  const goJob=job=>nav("detail",job,null);
  const goCo=co=>nav("company",null,co);
  const toggleMobileNav=()=>{setChatOpen(false);setMobileNavOpen(prev=>!prev);};

  const NAV_ITEMS=[{key:"home",l:"Home"},{key:"listings",l:"Jobs"},{key:"companies",l:"Companies"},{key:"social",l:"Community"},{key:"contact",l:"Contact"}];
  const isJobsActive=page==="listings"||page==="detail";

  const renderPage=()=>{switch(page){case"home":return<HomePage onNav={nav} onJobClick={goJob} savedJobs={savedJobs} onSave={toggleSave} visible={pageVisible}/>;case"listings":return<ListingsPage onJobClick={goJob} savedJobs={savedJobs} onSave={toggleSave}/>;case"detail":return selJob?<JobDetailPage job={selJob} savedJobs={savedJobs} onSave={toggleSave} onApply={()=>setApplyModal(selJob)} onCompanyClick={goCo}/>:null;case"companies":return<CompaniesPage onCompanyClick={goCo}/>;case"company":return selCo?<CompanyDetailPage co={selCo} jobs={JOBS} onJobClick={goJob}/>:null;case"resume":return<ResumePage onUploadDone={()=>showToast("📄 Resume is live to 1,200+ recruiters!")}/>;case"saved":return<SavedPage savedJobs={savedJobs} jobs={JOBS} onJobClick={goJob} onSave={toggleSave}/>;case"contact":return<ContactPage onToast={showToast}/>;case"social":return<SocialPage onToast={showToast}/>;case"plans":return<PlansPage onToast={showToast}/>;case"login":return<AuthPage onToast={showToast} onNav={nav}/>;default:return<HomePage onNav={nav} onJobClick={goJob} savedJobs={savedJobs} onSave={toggleSave} visible={pageVisible}/>;}};

  return(
    <>
      <style>{CSS}</style>
      {loading&&<Loader onDone={onLoaderDone}/>}
      {transitioning&&pendingPage&&<PageTransition onDone={onTransitionDone}/>}

      <div style={{opacity:loading?0:1,transition:"opacity .8s ease",display:"flex",flexDirection:"column",minHeight:"100vh"}}>

        {/* ULTRA NAVBAR */}
        {page!=="login"&&(
          <nav className={`nav${isLightPage?" light-page":""}${scrolled?" scrolled":""}`}>
            <div className="nav-logo" onClick={()=>nav("home")}>
              <div className="nav-wordmark">WORK<em>BOARD</em></div>
              <div className="nav-logo-dot"/>
            </div>
            <div className="nav-links">
              {NAV_ITEMS.map(item=>(
                <button key={item.key} className={`nav-link${(item.key==="listings"?isJobsActive:page===item.key)?" active":""}`} onClick={()=>nav(item.key)}>{item.l}</button>
              ))}
            </div>
            <div className="nav-right">
              <div className="nav-saved" onClick={()=>nav("saved")}>
                <div className="nav-saved-count">{savedJobs.length}</div>
                <span>Saved</span>
              </div>
              <button className="nav-ghost" onClick={()=>nav("plans")}>💎 Plans</button>
              <button className="nav-ghost" onClick={()=>nav("login")}>Sign In</button>
              <button className="nav-cta" onClick={()=>nav("resume")}>Upload CV</button>
            </div>
            <button className={`nav-mobile-toggle${mobileNavOpen?" open":""}`} type="button" aria-label={mobileNavOpen?"Close menu":"Open menu"} aria-expanded={mobileNavOpen} onClick={toggleMobileNav}>
              <span/>
              <span/>
              <span/>
            </button>
          </nav>
        )}
        {page!=="login"&&<div className={`mobile-nav-backdrop${mobileNavOpen?" open":""}`} onClick={()=>setMobileNavOpen(false)}/>}
        {page!=="login"&&(
          <div className={`mobile-nav-panel${mobileNavOpen?" open":""}`}>
            <div className="mobile-nav-header">
              <strong>Navigate WorkBoard</strong>
              <span>{savedJobs.length} saved roles</span>
            </div>
            <div className="mobile-nav-links">
              {NAV_ITEMS.map(item=>{
                const active=item.key==="listings"?isJobsActive:page===item.key;
                return(
                  <button key={item.key} className={`mobile-nav-link${active?" active":""}`} onClick={()=>nav(item.key)}>
                    <span>{item.l}</span>
                    <small>{active?"Current page":"Open"}</small>
                  </button>
                );
              })}
            </div>
            <div className="mobile-nav-actions">
              <div className="nav-saved" onClick={()=>nav("saved")}>
                <div className="nav-saved-count">{savedJobs.length}</div>
                <span>Saved Jobs</span>
              </div>
              <button className="nav-ghost" onClick={()=>nav("plans")}>ðŸ’Ž Plans</button>
              <button className="nav-ghost" onClick={()=>nav("login")}>Sign In</button>
              <button className="nav-cta" onClick={()=>nav("resume")}>Upload CV</button>
            </div>
            <div className="mobile-nav-footer">
              <span className="mobile-nav-chip">Trusted companies</span>
              <span className="mobile-nav-chip">Verified roles</span>
              <span className="mobile-nav-chip">AI resume tools</span>
            </div>
          </div>
        )}

        {(page==="detail"||page==="company")&&(
          <div className="breadcrumb">
            <button className="bc-btn" onClick={()=>nav("home")}>Home</button><span>›</span>
            {page==="detail"&&<><button className="bc-btn" onClick={()=>nav("listings")}>Jobs</button><span>›</span><span>{selJob?.title}</span></>}
            {page==="company"&&<><button className="bc-btn" onClick={()=>nav("companies")}>Companies</button><span>›</span><span>{selCo?.name}</span></>}
          </div>
        )}

        <div style={{flex:1}}>{renderPage()}</div>

        {page!=="login"&&(
          <footer className="footer">
            <div className="footer-inner">
              <div className="footer-top">
                <div className="footer-brand"><div className="footer-brand-name">Work<em>Board</em></div><p>Connecting exceptional talent with companies building the future. No ghost jobs, no spam.</p></div>
                <div className="footer-col"><h4>Job Seekers</h4>{[["Browse Jobs","listings"],["Upload Resume","resume"],["Saved Roles","saved"],["Pricing","plans"]].map(([l,p])=><a key={l} onClick={()=>nav(p)}>{l}</a>)}</div>
                <div className="footer-col"><h4>Employers</h4>{["Post a Job","Talent Search","Recruiter Plan","Contact Sales"].map(l=><a key={l} onClick={()=>nav("contact")}>{l}</a>)}</div>
                <div className="footer-col"><h4>Community</h4>{[["Social Media","social"],["Newsletter","social"],["Contact","contact"]].map(([l,p])=><a key={l} onClick={()=>nav(p)}>{l}</a>)}</div>
              </div>
              <div className="footer-bottom">
                <span>© 2026 WorkBoard · Built with intention · All rights reserved</span>
                <div className="footer-socials">
                  {[["𝕏","https://twitter.com"],["in","https://linkedin.com"],["▶","https://youtube.com"],["📸","https://instagram.com"]].map(([ic,u])=>(<a key={ic} className="fsoc" href={u} onClick={e=>{e.preventDefault();showToast("Opening…");setTimeout(()=>window.open(u,"_blank"),200);}}>{ic}</a>))}
                </div>
              </div>
            </div>
          </footer>
        )}

        {page!=="login"&&(
          <>
            <button className="ai-fab" onClick={()=>setChatOpen(!chatOpen)} title="WorkBoard AI">{chatOpen?"✕":"🤖"}</button>
            {chatOpen&&<AiChat onClose={()=>setChatOpen(false)}/>}
          </>
        )}

        {toast&&<Toast msg={toast} onClose={()=>setToast(null)}/>}
        {applyModal&&<ApplyModal job={applyModal} onClose={()=>{setApplyModal(null);showToast("🎉 Application submitted!");}}/>}
      </div>
    </>
  );
}
