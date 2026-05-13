import { useState, useEffect, useRef, useCallback } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

@font-face {
  font-family: 'BespokeStencil';
  src: local('Impact'), local('Haettenschweiler');
  font-weight: 900;
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --black:#050308;--near-black:#0a0710;--deep:#0f0c1a;
  --surface:#faf9f7;--white:#ffffff;--off:#f4f2ee;
  --gold:#c9a84c;--gold2:#e8c97a;--gold3:#f5e1a4;--gold-dark:#8b6d28;
  --amber:#d4813a;--rose:#c2566b;--emerald:#2a9d74;--sapphire:#2563c4;
  --platinum:#e8e4dc;--silver:#9a9591;--muted:#6b6760;
  --border:rgba(0,0,0,0.08);--border2:rgba(0,0,0,0.14);
  --glow:rgba(201,168,76,0.35);
  --serif:'Cormorant Garamond',Georgia,serif;
  --display:'Bebas Neue','Impact',system-ui,sans-serif;
  --stencil:'Bebas Neue','Impact',condensed,sans-serif;
  --body:'DM Sans',system-ui,sans-serif;
  --script:'Playfair Display',Georgia,serif;
}

html{scroll-behavior:smooth}
body{background:var(--surface);color:var(--black);font-family:var(--body);-webkit-font-smoothing:antialiased;overflow-x:hidden}

/* ══ PREMIUM FONT CLASSES ══ */
.sharpie-bold{
  font-family:'Bebas Neue','Impact',sans-serif;
  font-weight:900;
  letter-spacing:.04em;
  text-transform:uppercase;
  -webkit-text-stroke:1.5px currentColor;
  paint-order:stroke fill;
}
.stencil-cut{
  font-family:'Bebas Neue','Impact',sans-serif;
  font-weight:900;
  letter-spacing:.22em;
  text-transform:uppercase;
  opacity:.88;
  position:relative;
}
.stencil-cut::before{
  content:attr(data-text);
  position:absolute;
  inset:0;
  background:repeating-linear-gradient(
    90deg,
    transparent 0px,transparent 3px,
    rgba(0,0,0,.08) 3px,rgba(0,0,0,.08) 4px
  );
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
  pointer-events:none;
}
.hybrid-headline{
  font-family:'Bebas Neue','Impact',sans-serif;
  font-weight:900;
  letter-spacing:.06em;
  text-transform:uppercase;
  line-height:.95;
}

/* ══ ANIMATIONS ══ */
@keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spinCW{to{transform:rotate(360deg)}}
@keyframes spinCCW{to{transform:rotate(-360deg)}}
@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes marqueeLTR{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes marqueeRTL{from{transform:translateX(-50%)}to{transform:translateX(0)}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 0 0 var(--glow)}50%{box-shadow:0 0 40px 4px var(--glow)}}
@keyframes cardFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-9px) rotate(.4deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes gradDrift{0%{transform:translate(0,0) scale(1)}33%{transform:translate(22px,-16px) scale(1.06)}66%{transform:translate(-16px,12px) scale(.97)}100%{transform:translate(0,0) scale(1)}}
@keyframes imgReveal{from{opacity:0;transform:scale(1.1) translateY(14px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes toastSlide{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes modalIn{from{opacity:0;transform:scale(.88) translateY(22px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes successPop{0%{transform:scale(0) rotate(-12deg)}70%{transform:scale(1.15) rotate(2deg)}100%{transform:scale(1) rotate(0)}}
@keyframes confettiFly{0%{opacity:1;transform:translateY(0) rotate(0)}100%{opacity:0;transform:translateY(var(--dy)) translateX(var(--dx)) rotate(var(--dr))}}
@keyframes countUp{from{transform:translateY(60%);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes loaderExit{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.05);pointer-events:none}}
@keyframes dotBounce{0%,100%{transform:translateY(0)}40%{transform:translateY(-9px)}}

/* ── PREMIUM TEXT REVEAL (fixed — no clip-path flicker) ── */
.reveal-wrap{
  overflow:hidden;
  display:block;
  line-height:1.1;
}
.reveal-inner{
  display:block;
  will-change:transform,opacity;
}
.reveal-inner.animate{
  animation:revealSlide .85s cubic-bezier(.22,1,.36,1) both;
}
@keyframes revealSlide{
  0%{transform:translateY(105%);opacity:0}
  100%{transform:translateY(0);opacity:1}
}

/* ── VIDEO-AESTHETIC FLOATING ORBS ── */
@keyframes orbDrift1{0%{transform:translate(0,0) scale(1)}25%{transform:translate(30px,-20px) scale(1.08)}50%{transform:translate(-10px,30px) scale(.95)}75%{transform:translate(20px,10px) scale(1.04)}100%{transform:translate(0,0) scale(1)}}
@keyframes orbDrift2{0%{transform:translate(0,0) scale(1)}20%{transform:translate(-25px,15px) scale(1.1)}55%{transform:translate(15px,-25px) scale(.92)}80%{transform:translate(-10px,5px) scale(1.05)}100%{transform:translate(0,0) scale(1)}}
@keyframes orbDrift3{0%{transform:translate(0,0) scale(1)}30%{transform:translate(10px,20px) scale(1.06)}60%{transform:translate(-20px,-10px) scale(.97)}100%{transform:translate(0,0) scale(1)}}
@keyframes scanLine{0%{top:-4px}100%{top:105%}}
@keyframes noiseFlicker{0%,100%{opacity:.03}50%{opacity:.06}}
@keyframes filmGrain{0%{transform:translate(0,0)}10%{transform:translate(-1%,-1%)}20%{transform:translate(1%,0)}30%{transform:translate(0,1%)}40%{transform:translate(-1%,0)}50%{transform:translate(0,-1%)}60%{transform:translate(1%,1%)}70%{transform:translate(-1%,1%)}80%{transform:translate(1%,-1%)}90%{transform:translate(0,0)}100%{transform:translate(-1%,-1%)}}
@keyframes vignetteIn{from{opacity:0}to{opacity:1}}

/* ── LOADER ── */
.loader{position:fixed;inset:0;z-index:9999;background:var(--near-black);display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden}
.loader.exit{animation:loaderExit .9s .1s ease-in-out forwards}
.loader-mesh{position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 30% 20%,rgba(201,168,76,.22),transparent 55%),radial-gradient(ellipse 50% 70% at 80% 80%,rgba(194,86,107,.12),transparent 55%),radial-gradient(ellipse 40% 40% at 60% 50%,rgba(42,157,116,.07),transparent 50%);animation:gradDrift 14s ease-in-out infinite}
.loader-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(201,168,76,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.045) 1px,transparent 1px);background-size:64px 64px}
/* Scan line */
.loader-scan{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.5),transparent);animation:scanLine 3s linear infinite;pointer-events:none;z-index:2}
/* Film grain */
.loader-grain{position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");opacity:.04;animation:noiseFlicker 4s ease-in-out infinite,filmGrain .15s steps(1) infinite;pointer-events:none}

.loader-orb-ring{position:relative;width:120px;height:120px;margin-bottom:2.8rem}
.lor-ring{position:absolute;border-radius:50%;border:2px solid transparent}
.lor1{inset:0;border-top-color:var(--gold);border-right-color:rgba(201,168,76,.12);animation:spinCW 2.2s linear infinite}
.lor2{inset:14px;border-bottom-color:var(--rose);border-left-color:rgba(194,86,107,.1);animation:spinCCW 1.6s linear infinite}
.lor3{inset:28px;border-top-color:var(--emerald);animation:spinCW 2.8s linear infinite}
.lor-core{position:absolute;inset:42px;border-radius:50%;background:radial-gradient(circle,var(--gold2),var(--gold-dark));animation:breathe 2.2s ease-in-out infinite;box-shadow:0 0 20px rgba(201,168,76,.4)}

/* ── LOADER COUNTING NUMBERS ── */
.loader-numbers{display:flex;gap:3rem;margin-bottom:2.5rem;position:relative;z-index:1}
.loader-stat{text-align:center;position:relative}
.loader-stat-num{
  font-family:'Bebas Neue','Impact',sans-serif;
  font-size:3.2rem;
  font-weight:900;
  line-height:1;
  background:linear-gradient(135deg,var(--gold2),var(--gold3),var(--gold));
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
  letter-spacing:.04em;
  display:block;
  min-width:90px;
  text-align:center;
  filter:drop-shadow(0 0 12px rgba(201,168,76,.4));
  animation:countUp .6s cubic-bezier(.22,1,.36,1) both;
}
.loader-stat-label{
  font-family:'DM Sans',sans-serif;
  font-size:.6rem;
  font-weight:500;
  letter-spacing:.18em;
  text-transform:uppercase;
  color:rgba(255,255,255,.22);
  margin-top:.3rem;
  display:block;
}
.loader-stat-sep{width:1px;background:rgba(255,255,255,.08);align-self:stretch;margin:4px 0}

.loader-wordmark{
  font-family:'Bebas Neue','Impact',sans-serif;
  font-size:4.2rem;
  font-weight:900;
  letter-spacing:.12em;
  text-transform:uppercase;
  color:#fff;
  line-height:1;
  margin-bottom:.35rem;
  position:relative;
  z-index:1;
  -webkit-text-stroke:1px rgba(201,168,76,.3);
}
.loader-wordmark em{
  -webkit-text-stroke:0;
  background:linear-gradient(135deg,var(--gold2),var(--gold3));
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
  font-style:normal;
}
.loader-sub{font-family:var(--body);font-size:.6rem;letter-spacing:.38em;text-transform:uppercase;color:rgba(255,255,255,.18);margin-bottom:2rem;animation:fadeIn .6s .4s both;position:relative;z-index:1}
.loader-bar{width:240px;height:2px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;position:relative;z-index:1}
.loader-fill{height:100%;background:linear-gradient(90deg,var(--gold-dark),var(--gold),var(--gold2));animation:shimmer 1.5s linear infinite;background-size:200% 100%;transition:width .4s ease;border-radius:4px}
.loader-status{font-family:var(--body);font-size:.58rem;color:rgba(255,255,255,.16);text-transform:uppercase;letter-spacing:.2em;margin-top:.65rem;animation:fadeIn .3s both;position:relative;z-index:1}

/* ── PAGE TRANSITION (cinematic wipe) ── */
.page-wipe{position:fixed;inset:0;z-index:9000;pointer-events:none;overflow:hidden}
.wipe-blade{position:absolute;top:0;bottom:0;background:linear-gradient(180deg,#0d0a18,#050308)}
@keyframes bladeIn{from{transform:scaleX(0);transform-origin:left}to{transform:scaleX(1);transform-origin:left}}
@keyframes bladeOut{from{transform:scaleX(1);transform-origin:right}to{transform:scaleX(0);transform-origin:right}}

/* ── NAV ── */
.nav{position:sticky;top:0;z-index:500;height:70px;background:rgba(250,249,247,.92);backdrop-filter:blur(40px) saturate(180%);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 3rem;gap:2rem;transition:all .3s}
.nav.dark{background:rgba(10,7,16,.92);border-color:rgba(201,168,76,.1)}
.nav.scrolled{box-shadow:0 4px 32px rgba(0,0,0,.08)}
.nav.dark.scrolled{box-shadow:0 4px 32px rgba(0,0,0,.4)}
.nav-logo{display:flex;align-items:center;gap:10px;cursor:pointer;flex-shrink:0}
.nav-wordmark{
  font-family:'Bebas Neue','Impact',sans-serif;
  font-size:1.55rem;
  font-weight:900;
  letter-spacing:.1em;
  text-transform:uppercase;
  color:var(--black);
  line-height:1;
}
.nav.dark .nav-wordmark{color:#fff}
.nav-wordmark em{
  color:var(--gold);
  font-style:normal;
  -webkit-text-stroke:.5px rgba(201,168,76,.5);
}
.nav-links{display:flex;gap:2px;margin:0 auto}
.nav-link{background:none;border:none;font-family:var(--body);font-size:.84rem;color:var(--muted);cursor:pointer;padding:.44rem 1rem;border-radius:8px;transition:all .25s;position:relative}
.nav.dark .nav-link{color:rgba(255,255,255,.45)}
.nav-link:hover{color:var(--black);background:rgba(0,0,0,.04)}
.nav.dark .nav-link:hover{color:#fff;background:rgba(255,255,255,.06)}
.nav-link.active{color:var(--black);font-weight:500}
.nav.dark .nav-link.active{color:#fff}
.nav-link.active::after{content:'';position:absolute;bottom:3px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:var(--gold)}
.nav-right{display:flex;align-items:center;gap:.65rem;flex-shrink:0}
.nav-btn-ghost{background:none;border:1px solid var(--border);color:var(--black);font-family:var(--body);font-size:.78rem;font-weight:500;padding:.42rem 1rem;border-radius:100px;cursor:pointer;transition:all .3s}
.nav.dark .nav-btn-ghost{border-color:rgba(255,255,255,.15);color:rgba(255,255,255,.7)}
.nav-btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
.nav-btn-cta{
  font-family:'Bebas Neue','Impact',sans-serif;
  font-size:.9rem;
  letter-spacing:.08em;
  background:var(--black);color:#fff;border:none;padding:.48rem 1.4rem;border-radius:100px;cursor:pointer;transition:all .3s;position:relative;overflow:hidden;text-transform:uppercase;
}
.nav.dark .nav-btn-cta{background:var(--gold);color:#1a0e00}
.nav-btn-cta:hover{transform:scale(1.04)}
.nav-saved{display:flex;align-items:center;gap:6px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.2);border-radius:100px;padding:5px 12px 5px 8px;cursor:pointer;transition:all .25s;font-size:.78rem;color:var(--muted)}
.nav-saved:hover{background:rgba(201,168,76,.15);border-color:rgba(201,168,76,.4);color:var(--gold)}
.nav-saved-count{min-width:18px;height:18px;border-radius:9px;background:var(--gold);color:#1a0e00;font-size:.62rem;font-weight:800;display:flex;align-items:center;justify-content:center;font-family:var(--body)}

/* ── HERO VIDEO-AESTHETIC ── */
.hero{min-height:100vh;background:var(--near-black);position:relative;overflow:hidden;display:flex;align-items:center}
/* Layered drifting orbs */
.hero-orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none}
.hero-orb-1{width:650px;height:650px;background:radial-gradient(circle,rgba(201,168,76,.18) 0%,transparent 65%);top:-100px;left:-120px;animation:orbDrift1 18s ease-in-out infinite}
.hero-orb-2{width:500px;height:500px;background:radial-gradient(circle,rgba(194,86,107,.12) 0%,transparent 60%);bottom:-80px;right:-60px;animation:orbDrift2 22s ease-in-out infinite}
.hero-orb-3{width:350px;height:350px;background:radial-gradient(circle,rgba(42,157,116,.1) 0%,transparent 60%);top:40%;left:45%;animation:orbDrift3 16s ease-in-out infinite}
/* Scan line effect */
.hero-scan{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 0%,rgba(201,168,76,.25) 30%,rgba(255,255,255,.15) 50%,rgba(201,168,76,.25) 70%,transparent 100%);animation:scanLine 6s linear infinite;pointer-events:none;z-index:2}
/* Film grain */
.hero-grain{position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");opacity:.035;animation:filmGrain .2s steps(1) infinite;pointer-events:none;z-index:1}
/* Grid */
.hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(201,168,76,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.045) 1px,transparent 1px);background-size:80px 80px;mask-image:radial-gradient(ellipse at center,black 20%,transparent 75%);z-index:1}
/* Vignette */
.hero-vignette{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 40%,rgba(5,3,8,.6) 100%);z-index:1;animation:vignetteIn 1.5s ease both}

.hero-inner{max-width:1200px;margin:0 auto;padding:8rem 3rem 6rem;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;width:100%;position:relative;z-index:3}
.hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.25);border-radius:100px;padding:6px 16px 6px 10px;margin-bottom:1.8rem;animation:fadeUp .6s .1s both}
.hero-live-dot{width:7px;height:7px;border-radius:50%;background:var(--emerald);box-shadow:0 0 8px var(--emerald);animation:pulse 2s ease-in-out infinite}
.hero-eyebrow span{font-family:var(--body);font-size:.68rem;font-weight:500;color:rgba(255,255,255,.6);letter-spacing:.06em;text-transform:uppercase}

/* Hero headline with stencil + sharpie combo */
.hero-h1{
  font-family:'Bebas Neue','Impact',sans-serif;
  font-size:clamp(3.8rem,7vw,6.5rem);
  font-weight:900;
  line-height:.95;
  color:#fff;
  letter-spacing:.04em;
  text-transform:uppercase;
  margin-bottom:1.5rem;
}
.hero-h1-row{overflow:hidden;display:block}
.hero-h1-inner{display:block;animation:revealSlide .9s cubic-bezier(.22,1,.36,1) both;will-change:transform,opacity}
.hero-h1-row:nth-child(1) .hero-h1-inner{animation-delay:.18s}
.hero-h1-row:nth-child(2) .hero-h1-inner{animation-delay:.32s}
.hero-h1-row:nth-child(3) .hero-h1-inner{animation-delay:.46s}
.gold-grad{
  background:linear-gradient(135deg,var(--gold2) 0%,var(--gold3) 40%,var(--gold) 100%);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
  filter:drop-shadow(0 0 20px rgba(201,168,76,.4));
}
.stroke-text{
  -webkit-text-fill-color:transparent;
  -webkit-text-stroke:2px rgba(255,255,255,.6);
  color:transparent;
}

.hero-p{font-size:1rem;color:rgba(255,255,255,.4);line-height:1.9;max-width:440px;margin-bottom:2.5rem;font-weight:300;animation:fadeUp .7s .6s both}
.hero-actions{display:flex;gap:.8rem;flex-wrap:wrap;animation:fadeUp .6s .72s both}
.btn-primary{background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold2));color:#1a0e00;border:none;padding:.75rem 2rem;font-family:'Bebas Neue','Impact',sans-serif;font-size:1rem;font-weight:900;letter-spacing:.12em;border-radius:100px;cursor:pointer;box-shadow:0 6px 28px rgba(201,168,76,.4);transition:all .3s cubic-bezier(.34,1.56,.64,1);text-transform:uppercase;position:relative;overflow:hidden}
.btn-primary::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);transform:translateX(-100%);transition:transform .5s}
.btn-primary:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 12px 40px rgba(201,168,76,.55)}
.btn-primary:hover::after{transform:translateX(100%)}
.btn-secondary{background:transparent;color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.15);padding:.75rem 1.8rem;font-family:var(--body);font-size:.86rem;font-weight:500;border-radius:100px;cursor:pointer;transition:all .3s;letter-spacing:.02em}
.btn-secondary:hover{border-color:rgba(255,255,255,.4);color:#fff;background:rgba(255,255,255,.06)}

.hero-stats{display:flex;gap:2.5rem;margin-top:3rem;padding-top:2rem;border-top:1px solid rgba(255,255,255,.06);animation:fadeUp .6s .85s both}
.h-stat-num{
  font-family:'Bebas Neue','Impact',sans-serif;
  font-size:2.6rem;
  font-weight:900;
  color:var(--gold2);
  line-height:1;
  letter-spacing:.04em;
  display:block;
}
.h-stat-label{font-size:.68rem;color:rgba(255,255,255,.22);text-transform:uppercase;letter-spacing:.12em;font-family:var(--body);font-weight:500;margin-top:4px}

/* Hero right */
.hero-right{position:relative;height:560px;animation:fadeIn .8s .3s both}
.hero-img-main{position:absolute;top:0;left:30px;right:0;bottom:60px;border-radius:24px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,.5)}
.hero-img-main img{width:100%;height:100%;object-fit:cover;animation:imgReveal .9s .4s both}
.hero-img-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 50%,rgba(0,0,0,.6))}
.hero-card-float{position:absolute;background:rgba(255,255,255,.07);backdrop-filter:blur(22px);border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:14px 18px;animation:cardFloat 6s ease-in-out infinite}
.hero-card-1{bottom:80px;left:0;right:120px;animation-delay:0s}
.hero-card-2{top:40px;right:-20px;width:180px;animation-delay:-3s}
.hc-title{font-family:var(--body);font-size:.82rem;font-weight:600;color:#fff;margin-bottom:3px}
.hc-sub{font-size:.71rem;color:rgba(255,255,255,.42)}
.hc-dot{width:7px;height:7px;border-radius:50%;background:var(--emerald);animation:pulse 2s ease-in-out infinite}

/* ── MARQUEE ── */
.marquee-wrap{background:var(--black);padding:1.4rem 0;overflow:hidden;border-top:1px solid rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.05)}
.marquee-track{display:flex;gap:0;width:max-content}
.marquee-track.ltr{animation:marqueeLTR 30s linear infinite}
.marquee-track.rtl{animation:marqueeRTL 30s linear infinite}
.marquee-item{display:flex;align-items:center;gap:.8rem;padding:0 2.5rem;white-space:nowrap;font-family:'Bebas Neue','Impact',sans-serif;font-size:1rem;font-weight:900;color:rgba(255,255,255,.18);text-transform:uppercase;letter-spacing:.12em}
.marquee-item .m-dot{width:4px;height:4px;border-radius:50%;background:var(--gold);opacity:.6}
.marquee-item.gold{color:rgba(201,168,76,.55)}

/* ── SECTIONS ── */
.section{max-width:1200px;margin:0 auto;padding:6rem 3rem}
.section-sm{padding:4rem 3rem}
.bg-dark{background:var(--near-black)}
.bg-off{background:var(--off)}
.sec-label{font-family:var(--body);font-size:.63rem;font-weight:700;color:var(--gold);letter-spacing:.28em;text-transform:uppercase;margin-bottom:1rem;display:flex;align-items:center;gap:.6rem}
.sec-label::before{content:'';width:24px;height:1px;background:var(--gold)}
.sec-title{
  font-family:'Bebas Neue','Impact',sans-serif;
  font-size:clamp(2.8rem,5vw,4rem);
  font-weight:900;
  letter-spacing:.04em;
  text-transform:uppercase;
  line-height:.95;
}
.sec-title span{display:block}
.sec-title em{
  font-style:normal;
  background:linear-gradient(135deg,var(--gold2),var(--gold3));
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
}
.dark-title{color:#fff}
.sec-sub{font-size:.9rem;color:var(--muted);line-height:1.8;max-width:480px;margin-top:.75rem;font-weight:300}
.dark-sub{color:rgba(255,255,255,.32)}
.sec-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:3rem;gap:1.5rem;flex-wrap:wrap}
.link-btn{background:none;border:1px solid var(--border2);color:var(--muted);font-family:var(--body);font-size:.78rem;font-weight:500;padding:.42rem .95rem;border-radius:100px;cursor:pointer;transition:all .3s}
.link-btn:hover{border-color:var(--gold);color:var(--gold)}
.dark-link{border-color:rgba(255,255,255,.12);color:rgba(255,255,255,.35)}
.dark-link:hover{border-color:var(--gold);color:var(--gold)}

/* ── CATEGORY SCROLL ── */
.cat-scroll{display:flex;gap:1rem;overflow-x:auto;padding-bottom:.5rem;scrollbar-width:none}
.cat-scroll::-webkit-scrollbar{display:none}
.cat-pill{flex-shrink:0;display:flex;align-items:center;gap:.6rem;background:var(--white);border:1px solid var(--border);border-radius:100px;padding:.6rem 1.2rem;cursor:pointer;transition:all .35s cubic-bezier(.22,1,.36,1);white-space:nowrap}
.cat-pill:hover{border-color:var(--gold);background:rgba(201,168,76,.06);transform:translateY(-3px)}
.cat-pill-icon{font-size:1.1rem}
.cat-pill-label{font-family:'Bebas Neue','Impact',sans-serif;font-size:.9rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--black)}
.cat-pill-count{font-size:.7rem;color:var(--muted)}

/* ── JOB CARDS ── */
.jobs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1.2rem}
.job-card{background:var(--white);border:1px solid var(--border);border-radius:20px;padding:1.8rem;cursor:pointer;position:relative;overflow:hidden;transition:all .4s cubic-bezier(.22,1,.36,1)}
.job-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold-dark),var(--gold2));transform:scaleX(0);transform-origin:left;transition:transform .5s cubic-bezier(.22,1,.36,1)}
.job-card:hover{border-color:rgba(201,168,76,.3);transform:translateY(-8px);box-shadow:0 24px 56px rgba(0,0,0,.09)}
.job-card:hover::before{transform:scaleX(1)}
.job-card.featured{background:linear-gradient(160deg,#fffdf8,#faf8f0);border-color:rgba(201,168,76,.3);box-shadow:0 8px 32px rgba(201,168,76,.1)}
.job-feat-badge{display:inline-flex;align-items:center;gap:5px;background:linear-gradient(135deg,var(--gold-dark),var(--gold));color:#1a0e00;font-family:var(--body);font-size:.62rem;font-weight:700;padding:4px 10px;border-radius:100px;letter-spacing:.06em;text-transform:uppercase;margin-bottom:.9rem}
.jc-row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem}
.job-co-logo{width:48px;height:48px;border-radius:14px;overflow:hidden;flex-shrink:0}
.job-title{font-family:'Bebas Neue','Impact',sans-serif;font-size:1.1rem;font-weight:900;margin-bottom:.2rem;letter-spacing:.06em;text-transform:uppercase}
.job-co{font-size:.78rem;color:var(--muted)}
.save-btn{width:32px;height:32px;border-radius:9px;background:none;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;color:var(--muted);transition:all .3s cubic-bezier(.34,1.56,.64,1);flex-shrink:0}
.save-btn:hover,.save-btn.saved{background:rgba(201,168,76,.1);border-color:rgba(201,168,76,.4);color:var(--gold)}
.tags{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1rem}
.tag{font-size:.69rem;font-weight:600;padding:.26rem .7rem;border-radius:100px;letter-spacing:.02em}
.t-full{background:#e6f3ee;color:#1a6b4a}
.t-remote{background:#ede9fd;color:#5b3ea8}
.t-level{background:#f0eeea;color:#5a5750}
.t-gold{background:linear-gradient(135deg,var(--gold-dark),var(--gold));color:#fff}
.jc-footer{display:flex;justify-content:space-between;align-items:center;padding-top:1rem;border-top:1px solid var(--border)}
.j-salary{font-family:'Bebas Neue','Impact',sans-serif;font-weight:900;font-size:1rem;color:var(--gold-dark);letter-spacing:.06em}
.j-date{font-size:.72rem;color:var(--muted)}

/* ── COMPANIES GRID ── */
.co-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.2rem}
.co-card{background:var(--white);border:1px solid var(--border);border-radius:20px;overflow:hidden;cursor:pointer;transition:all .38s cubic-bezier(.22,1,.36,1)}
.co-card:hover{border-color:rgba(201,168,76,.3);transform:translateY(-7px);box-shadow:0 20px 52px rgba(0,0,0,.09)}
.co-banner{height:110px;overflow:hidden;position:relative}
.co-banner img{width:100%;height:100%;object-fit:cover;transition:transform .5s ease}
.co-card:hover .co-banner img{transform:scale(1.06)}
.co-banner-overlay{position:absolute;inset:0;background:rgba(0,0,0,.25)}
.co-body{padding:1.2rem}
.co-header{display:flex;align-items:center;gap:.9rem;margin-bottom:.85rem}
.co-logo{width:46px;height:46px;border-radius:12px;overflow:hidden;margin-top:-30px;position:relative;z-index:1;border:2px solid var(--white);box-shadow:0 4px 16px rgba(0,0,0,.12)}
.co-logo img{width:100%;height:100%;object-fit:cover}
.co-name{font-family:'Bebas Neue','Impact',sans-serif;font-size:1.05rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
.co-ind{font-size:.74rem;color:var(--muted)}
.co-desc{font-size:.82rem;line-height:1.7;color:var(--muted);margin-bottom:.9rem}
.co-footer{display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border);padding-top:.8rem}
.roles-chip{background:linear-gradient(135deg,var(--gold-dark),var(--gold));color:#fff;font-size:.7rem;font-weight:700;padding:.24rem .75rem;border-radius:100px;font-family:var(--body)}
.co-size{font-size:.74rem;color:var(--muted)}

/* ── TESTIMONIALS ── */
.testi-scroll{display:flex;gap:1.2rem;animation:marqueeLTR 45s linear infinite;width:max-content;padding:.5rem 0}
.testi-card{flex-shrink:0;width:300px;background:var(--white);border:1px solid var(--border);border-radius:20px;padding:1.5rem;transition:transform .3s}
.testi-card:hover{transform:translateY(-5px)}
.testi-quote{font-family:var(--serif);font-size:.95rem;line-height:1.8;color:var(--black);font-style:italic;margin-bottom:1rem}
.testi-author{display:flex;align-items:center;gap:.75rem}
.testi-avatar{width:36px;height:36px;border-radius:50%;overflow:hidden;flex-shrink:0}
.testi-avatar img{width:100%;height:100%;object-fit:cover}
.testi-name{font-family:var(--body);font-size:.8rem;font-weight:700}
.testi-role{font-size:.71rem;color:var(--muted)}
.stars{color:var(--gold);font-size:.75rem;margin-bottom:.65rem;letter-spacing:2px}

/* ── LISTINGS ── */
.listings-layout{display:flex;gap:2rem;max-width:1200px;margin:0 auto;padding:2.5rem 3rem}
.sidebar{width:240px;flex-shrink:0;background:var(--white);border:1px solid var(--border);border-radius:20px;padding:1.6rem;height:fit-content;position:sticky;top:88px}
.sb-title{font-family:'Bebas Neue','Impact',sans-serif;font-size:1.1rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1.5rem}
.filter-group{margin-bottom:1.4rem}
.filter-label{font-family:var(--body);font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:.65rem;display:block}
.filter-opt{display:flex;align-items:center;gap:.5rem;margin-bottom:.4rem;cursor:pointer}
.filter-opt input[type=checkbox]{accent-color:var(--gold-dark);width:14px;height:14px;cursor:pointer}
.filter-opt span{font-size:.82rem}
.range-wrap{display:flex;flex-direction:column;gap:.35rem}
input[type=range]{width:100%;accent-color:var(--gold-dark)}
.range-value{font-size:.82rem;font-weight:700;color:var(--gold-dark)}
.reset-btn{width:100%;padding:.55rem;background:none;border:1px solid var(--border);font-family:var(--body);font-size:.78rem;font-weight:500;border-radius:10px;cursor:pointer;transition:all .25s;color:var(--muted)}
.reset-btn:hover{border-color:var(--gold);color:var(--gold-dark)}
.listings-main{flex:1}
.list-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem}
.list-count{font-size:.84rem;color:var(--muted)}
.list-count strong{color:var(--black)}
.sort-select{border:1px solid var(--border);background:var(--white);font-family:var(--body);font-size:.8rem;padding:.4rem .8rem;border-radius:10px;color:var(--black);outline:none;cursor:pointer}
.list-row{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:1.2rem 1.5rem;display:flex;align-items:center;gap:1rem;cursor:pointer;transition:all .3s cubic-bezier(.22,1,.36,1);margin-bottom:.75rem}
.list-row:hover{border-color:rgba(201,168,76,.3);box-shadow:0 10px 28px rgba(0,0,0,.07);transform:translateX(4px)}
.list-info{flex:1}
.list-title{font-family:'Bebas Neue','Impact',sans-serif;font-size:1rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
.list-meta{display:flex;align-items:center;gap:.55rem;margin-top:.25rem;flex-wrap:wrap}
.list-meta span{font-size:.77rem;color:var(--muted)}
.list-right{text-align:right;flex-shrink:0}

/* ── DETAIL ── */
.detail-layout{max-width:1100px;margin:0 auto;padding:2.5rem 3rem;display:flex;gap:2rem}
.detail-main{flex:1;min-width:0}
.detail-side{width:280px;flex-shrink:0}
.detail-header{background:var(--white);border:1px solid var(--border);border-radius:20px;padding:2.2rem;margin-bottom:1.2rem;position:relative;overflow:hidden}
.detail-header::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold-dark),var(--gold2))}
.d-logo-row{display:flex;align-items:center;gap:1.2rem;margin-bottom:1.5rem}
.d-title{font-family:'Bebas Neue','Impact',sans-serif;font-size:2rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase;margin-bottom:.3rem;line-height:1}
.d-company{font-size:.88rem;color:var(--gold-dark);cursor:pointer;font-weight:500;transition:color .2s}
.d-company:hover{color:var(--gold);text-decoration:underline}
.d-tags{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.2rem;padding-top:1.2rem;border-top:1px solid var(--border)}
.d-fact{display:flex;align-items:center;gap:.35rem;font-size:.78rem;background:var(--off);padding:.3rem .78rem;border-radius:100px;transition:all .2s;cursor:default}
.d-fact:hover{background:rgba(201,168,76,.1);color:var(--gold-dark)}
.d-section{background:var(--white);border:1px solid var(--border);border-radius:20px;padding:1.8rem;margin-bottom:1rem}
.d-section h3{font-family:'Bebas Neue','Impact',sans-serif;font-size:1.2rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase;margin-bottom:.9rem}
.d-section p{font-size:.875rem;line-height:1.9;color:#4a4760;margin-bottom:.8rem}
.req-list{list-style:none}
.req-list li{padding:.38rem 0 .38rem 1.3rem;position:relative;font-size:.875rem;line-height:1.65;color:#4a4760}
.req-list li::before{content:'◆';position:absolute;left:0;color:var(--gold);font-size:.5rem;top:.6rem}
.sticky-card{background:var(--white);border:1px solid var(--border);border-radius:20px;padding:1.7rem;position:sticky;top:88px}
.sc-label{font-family:var(--body);font-size:.65rem;font-weight:700;color:var(--muted);letter-spacing:.1em;text-transform:uppercase}
.sc-salary{font-family:'Bebas Neue','Impact',sans-serif;font-size:1.8rem;font-weight:900;color:var(--gold-dark);letter-spacing:.06em;margin:.3rem 0 1.2rem;text-transform:uppercase}
.apply-btn{width:100%;background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold2));color:#1a0e00;border:none;padding:.9rem;font-family:'Bebas Neue','Impact',sans-serif;font-size:1rem;font-weight:900;border-radius:12px;cursor:pointer;box-shadow:0 6px 24px rgba(201,168,76,.3);transition:all .3s cubic-bezier(.34,1.56,.64,1);letter-spacing:.12em;text-transform:uppercase;position:relative;overflow:hidden}
.apply-btn:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 12px 36px rgba(201,168,76,.45)}
.save-role-btn{width:100%;margin-top:.65rem;background:none;border:1px solid var(--border);padding:.78rem;font-family:var(--body);font-size:.83rem;font-weight:500;border-radius:12px;cursor:pointer;transition:all .25s;color:var(--black)}
.save-role-btn:hover{border-color:var(--gold);color:var(--gold-dark);background:rgba(201,168,76,.05)}
.sc-meta{font-size:.77rem;color:var(--muted);line-height:2.2;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border)}

/* ── PLANS ── */
.plans-hero{text-align:center;padding:7rem 3rem 4rem;background:var(--near-black);position:relative;overflow:hidden}
.plans-hero-mesh{position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 30%,rgba(201,168,76,.18),transparent 55%);pointer-events:none}
.billing-toggle{display:inline-flex;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:100px;padding:4px;margin-bottom:3rem}
.billing-opt{background:none;border:none;padding:.5rem 1.4rem;border-radius:100px;font-family:var(--body);font-size:.8rem;font-weight:600;cursor:pointer;color:rgba(255,255,255,.35);transition:all .3s}
.billing-opt.active{background:var(--white);color:var(--black)}
.plans-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.2rem;max-width:1200px;margin:0 auto;padding:0 3rem 6rem}
.plan-card{background:var(--white);border:1px solid var(--border);border-radius:24px;padding:2.2rem;position:relative;overflow:hidden;transition:all .38s cubic-bezier(.22,1,.36,1)}
.plan-card:hover{transform:translateY(-8px);box-shadow:0 24px 56px rgba(0,0,0,.1)}
.plan-card.dark-card{background:linear-gradient(160deg,#0f0c1a,#1a1528);border-color:rgba(201,168,76,.35);color:#fff;box-shadow:0 16px 48px rgba(201,168,76,.15);animation:glowPulse 5s ease-in-out infinite}
.plan-badge{position:absolute;top:1.2rem;right:1.2rem;background:linear-gradient(135deg,var(--gold-dark),var(--gold));color:#1a0e00;font-family:var(--body);font-size:.62rem;font-weight:800;padding:4px 10px;border-radius:100px;letter-spacing:.06em;text-transform:uppercase}
.plan-tier{font-family:var(--body);font-size:.63rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:.4rem}
.dark-card .plan-tier{color:rgba(255,255,255,.3)}
.plan-name{font-family:'Bebas Neue','Impact',sans-serif;font-size:1.8rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;margin-bottom:.3rem}
.dark-card .plan-name{color:#fff}
.plan-desc{font-size:.82rem;color:var(--muted);margin-bottom:1.6rem;line-height:1.65}
.dark-card .plan-desc{color:rgba(255,255,255,.35)}
.plan-price{font-family:'Bebas Neue','Impact',sans-serif;font-size:3.5rem;font-weight:900;letter-spacing:.04em;line-height:1;color:var(--black);margin-bottom:.3rem}
.dark-card .plan-price{color:#fff}
.plan-period{font-size:.8rem;color:var(--muted)}
.dark-card .plan-period{color:rgba(255,255,255,.3)}
.plan-divider{border:none;border-top:1px solid var(--border);margin:1.5rem 0}
.dark-card .plan-divider{border-color:rgba(255,255,255,.08)}
.plan-features{list-style:none;margin-bottom:2rem}
.plan-feat{display:flex;align-items:flex-start;gap:.65rem;padding:.4rem 0;font-size:.82rem;line-height:1.55}
.feat-check{width:18px;height:18px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:9px;margin-top:1px}
.feat-yes{background:#e6f3ee;color:#1a6b4a}
.dark-card .feat-yes{background:rgba(42,157,116,.2);color:var(--emerald)}
.feat-no{background:var(--off);color:var(--muted)}
.feat-text{color:var(--black)}
.dark-card .feat-text{color:rgba(255,255,255,.7)}
.feat-text.dim{color:var(--muted);text-decoration:line-through}
.dark-card .feat-text.dim{color:rgba(255,255,255,.2)}
.plan-btn{width:100%;padding:.88rem;border-radius:14px;font-family:'Bebas Neue','Impact',sans-serif;font-size:1rem;font-weight:900;cursor:pointer;transition:all .3s cubic-bezier(.34,1.56,.64,1);letter-spacing:.1em;border:none;text-transform:uppercase}
.pb-outline{background:none;border:1px solid var(--border2);color:var(--black)}
.pb-outline:hover{border-color:var(--gold);color:var(--gold-dark);background:rgba(201,168,76,.04)}
.pb-gold{background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold2));color:#1a0e00;box-shadow:0 6px 24px rgba(201,168,76,.35)}
.pb-gold:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(201,168,76,.5)}
.pb-dark{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.15)}
.pb-dark:hover{background:rgba(255,255,255,.18);transform:translateY(-2px)}
.pb-emerald{background:linear-gradient(135deg,#1b7a58,var(--emerald));color:#fff;box-shadow:0 6px 24px rgba(42,157,116,.3)}
.pb-emerald:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(42,157,116,.45)}

/* ── AUTH ── */
.auth-page{min-height:100vh;display:grid;grid-template-columns:1fr 1fr}
.auth-left{background:var(--near-black);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:3rem}
.auth-mesh{position:absolute;inset:0;background:radial-gradient(ellipse 60% 60% at 30% 40%,rgba(201,168,76,.2),transparent 55%),radial-gradient(ellipse 40% 50% at 80% 80%,rgba(194,86,107,.12),transparent 50%);animation:gradDrift 14s ease-in-out infinite}
.auth-left-content{position:relative;z-index:1;text-align:center;max-width:380px}
.auth-left-logo{font-family:'Bebas Neue','Impact',sans-serif;font-size:2.8rem;font-weight:900;color:#fff;margin-bottom:1.5rem;letter-spacing:.12em;text-transform:uppercase}
.auth-left-logo em{color:var(--gold2);font-style:normal}
.auth-left-title{font-family:var(--serif);font-size:2rem;color:#fff;line-height:1.2;margin-bottom:.9rem;font-style:italic}
.auth-left-sub{font-size:.88rem;color:rgba(255,255,255,.35);line-height:1.85;font-weight:300;margin-bottom:2.5rem}
.als-num{font-family:'Bebas Neue','Impact',sans-serif;font-size:2rem;letter-spacing:.06em;color:var(--gold2);display:block;font-weight:900}
.als-label{font-family:var(--body);font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.25)}
.auth-right{display:flex;align-items:center;justify-content:center;padding:3rem;background:var(--surface)}
.auth-box{width:100%;max-width:400px}
.auth-tabs{display:flex;background:var(--off);border-radius:12px;padding:4px;margin-bottom:2.5rem}
.auth-tab{flex:1;padding:.6rem;background:none;border:none;font-family:var(--body);font-size:.82rem;font-weight:600;cursor:pointer;border-radius:9px;color:var(--muted);transition:all .3s}
.auth-tab.active{background:var(--white);color:var(--black);box-shadow:0 2px 8px rgba(0,0,0,.08)}
.auth-title{font-family:'Bebas Neue','Impact',sans-serif;font-size:2.2rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase;margin-bottom:.4rem}
.auth-sub{font-size:.84rem;color:var(--muted);margin-bottom:2rem;line-height:1.7}
.form-group{margin-bottom:1.1rem}
.form-label{font-family:var(--body);font-size:.68rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:.4rem}
.form-input{width:100%;border:1.5px solid var(--border);border-radius:12px;padding:.8rem 1rem;font-family:var(--body);font-size:.88rem;background:var(--white);color:var(--black);outline:none;transition:all .25s}
.form-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,.1)}
.form-input::placeholder{color:rgba(0,0,0,.25)}
.auth-submit{width:100%;background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold2));color:#1a0e00;border:none;padding:.9rem;font-family:'Bebas Neue','Impact',sans-serif;font-size:1rem;font-weight:900;border-radius:12px;cursor:pointer;box-shadow:0 6px 24px rgba(201,168,76,.3);transition:all .3s;letter-spacing:.1em;text-transform:uppercase;margin-top:.5rem}
.auth-submit:hover{transform:translateY(-1px);box-shadow:0 10px 32px rgba(201,168,76,.45)}
.auth-divider{display:flex;align-items:center;gap:.8rem;margin:1.5rem 0}
.auth-divider-line{flex:1;height:1px;background:var(--border)}
.auth-divider-text{font-size:.77rem;color:var(--muted)}
.social-auth{display:flex;gap:.65rem}
.social-auth-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:.5rem;background:var(--white);border:1.5px solid var(--border);border-radius:12px;padding:.72rem;cursor:pointer;transition:all .25s;font-family:var(--body);font-size:.8rem;font-weight:600;color:var(--black)}
.social-auth-btn:hover{border-color:var(--border2);background:var(--off)}
.forgot-link{font-size:.78rem;color:var(--gold-dark);cursor:pointer;text-align:right;margin-top:.3rem;display:block}
.auth-footer{text-align:center;font-size:.8rem;color:var(--muted);margin-top:1.5rem}
.auth-footer a{color:var(--gold-dark);cursor:pointer;font-weight:600}

/* ── RESUME ── */
.resume-page{max-width:680px;margin:0 auto;padding:4rem 3rem}
.upload-zone{border:2px dashed rgba(201,168,76,.4);border-radius:24px;min-height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all .35s cubic-bezier(.22,1,.36,1);background:var(--near-black);position:relative;overflow:hidden;margin-bottom:1.5rem}
.upload-zone::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 30%,rgba(201,168,76,.12),transparent 60%);pointer-events:none}
.upload-zone:hover{border-color:rgba(201,168,76,.7);background:#110e1e;box-shadow:0 0 0 4px rgba(201,168,76,.07),0 16px 48px rgba(201,168,76,.12)}
.upload-zone.dragging{border-color:var(--emerald);background:#0d1a14}
.uz-icon{width:80px;height:80px;border-radius:50%;background:rgba(201,168,76,.1);border:1.5px dashed rgba(201,168,76,.4);display:flex;align-items:center;justify-content:center;font-size:2rem;margin-bottom:1.2rem;transition:all .35s;position:relative;z-index:1;animation:glowPulse 4s ease-in-out infinite}
.upload-zone:hover .uz-icon{background:rgba(201,168,76,.18);transform:scale(1.08)}
.uz-title{font-family:'Bebas Neue','Impact',sans-serif;font-size:1.5rem;letter-spacing:.08em;text-transform:uppercase;color:#fff;margin-bottom:.4rem;font-weight:900;position:relative;z-index:1}
.uz-sub{font-size:.8rem;color:rgba(255,255,255,.3);margin-bottom:1rem;position:relative;z-index:1}
.uz-formats{display:flex;gap:.45rem;position:relative;z-index:1}
.uz-fmt{background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.2);border-radius:6px;padding:3px 9px;font-family:var(--body);font-size:.65rem;font-weight:700;color:rgba(201,168,76,.7)}
.upload-progress{background:var(--near-black);border:1px solid rgba(201,168,76,.2);border-radius:20px;padding:1.8rem;margin-bottom:1.5rem}
.up-bar{height:4px;background:rgba(255,255,255,.07);border-radius:4px;overflow:hidden;margin-bottom:.6rem}
.up-fill{height:100%;background:linear-gradient(90deg,var(--gold-dark),var(--gold2),var(--emerald));background-size:200% 100%;animation:shimmer 1.5s linear infinite;transition:width .4s ease;border-radius:4px}
.upload-success{background:var(--near-black);border:1px solid rgba(42,157,116,.25);border-radius:20px;padding:1.8rem;text-align:center;margin-bottom:1.5rem}
.us-icon{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,rgba(42,157,116,.2),rgba(201,168,76,.2));display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto .9rem;animation:successPop .7s cubic-bezier(.34,1.56,.64,1) both}

/* ── CONTACT ── */
.contact-page{max-width:760px;margin:0 auto;padding:4rem 3rem}
.contact-tabs{display:flex;border-bottom:1px solid var(--border);margin-bottom:2rem}
.contact-tab{background:none;border:none;padding:.7rem 1.5rem;font-family:var(--body);font-size:.85rem;font-weight:500;cursor:pointer;color:var(--muted);border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .25s}
.contact-tab.active{color:var(--gold-dark);border-bottom-color:var(--gold-dark)}
.contact-box{background:var(--white);border:1px solid var(--border);border-radius:20px;padding:2.2rem}
.cb-title{font-family:'Bebas Neue','Impact',sans-serif;font-size:1.5rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;margin-bottom:.4rem}
.cb-sub{font-size:.83rem;color:var(--muted);margin-bottom:1.6rem}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:.9rem;margin-bottom:.9rem}
.form-grid .form-group{margin-bottom:0}
.form-full{grid-column:1/-1}
.form-submit{width:100%;background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold2));color:#1a0e00;border:none;padding:.88rem;font-family:'Bebas Neue','Impact',sans-serif;font-size:1rem;font-weight:900;border-radius:12px;cursor:pointer;transition:all .3s;letter-spacing:.1em;margin-top:.5rem;text-transform:uppercase}
.form-submit:hover{box-shadow:0 8px 28px rgba(201,168,76,.4);transform:translateY(-1px)}

/* ── SOCIAL ── */
.social-page{max-width:900px;margin:0 auto;padding:4rem 3rem}
.social-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.1rem;margin-bottom:2rem}
.social-card{border-radius:20px;padding:1.6rem;cursor:pointer;position:relative;overflow:hidden;border:1px solid transparent;text-decoration:none;display:block;transition:transform .38s cubic-bezier(.22,1,.36,1),box-shadow .38s;color:#fff}
.social-card:hover{transform:translateY(-7px) scale(1.025)}
.sc-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;margin-bottom:1rem;background:rgba(255,255,255,.15)}
.sc-name{font-family:'Bebas Neue','Impact',sans-serif;font-size:1.1rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase;margin-bottom:.2rem}
.sc-handle{font-size:.76rem;opacity:.55;margin-bottom:.75rem}
.sc-follow-btn{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);border-radius:100px;padding:5px 13px;font-size:.72rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;transition:all .25s}
.nl-box{background:var(--white);border:1px solid var(--border);border-radius:20px;padding:2.2rem;text-align:center;margin-bottom:1.5rem}
.nl-title{font-family:'Bebas Neue','Impact',sans-serif;font-size:1.6rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;margin-bottom:.4rem}
.nl-sub{font-size:.84rem;color:var(--muted);margin-bottom:1.2rem;line-height:1.65}
.nl-form{display:flex;gap:.6rem;max-width:380px;margin:0 auto}
.nl-input{flex:1;border:1.5px solid var(--border);border-radius:100px;padding:.68rem 1rem;font-family:var(--body);font-size:.84rem;outline:none;transition:all .25s}
.nl-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,.1)}
.nl-btn{background:linear-gradient(135deg,var(--gold-dark),var(--gold));color:#1a0e00;border:none;padding:.68rem 1.3rem;border-radius:100px;font-family:'Bebas Neue','Impact',sans-serif;font-size:.85rem;font-weight:900;cursor:pointer;transition:all .3s;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;box-shadow:0 4px 16px rgba(201,168,76,.3)}
.nl-btn:hover{transform:scale(1.04);box-shadow:0 6px 22px rgba(201,168,76,.45)}

/* ── PAYMENT MODAL ── */
.payment-overlay{position:fixed;inset:0;z-index:800;background:rgba(5,3,8,.82);backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto}
.payment-modal{background:#fff;border-radius:32px;width:min(960px,100%);overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,.3);animation:modalIn .5s cubic-bezier(.34,1.56,.64,1) both;margin:auto;display:grid;grid-template-columns:1.05fr .95fr}
.pm-left{background:linear-gradient(160deg,#060412,#110d24,#1a163a);padding:2.8rem 2.4rem;position:relative;overflow:hidden;color:#fff}
.pm-left-orb{position:absolute;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(201,168,76,.2),transparent 70%)}
.pm-orb1{width:280px;height:280px;top:-80px;right:-80px;animation:gradDrift 10s ease-in-out infinite}
.pm-orb2{width:180px;height:180px;bottom:-50px;left:10%;animation:gradDrift 8s ease-in-out infinite reverse}
.pm-badge{display:inline-flex;align-items:center;gap:7px;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.25);border-radius:100px;padding:5px 14px;font-family:var(--body);font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold2);margin-bottom:1.5rem}
.pm-plan-title{font-family:'Bebas Neue','Impact',sans-serif;font-size:2.5rem;letter-spacing:.06em;text-transform:uppercase;line-height:1;font-weight:900;margin-bottom:.5rem;position:relative;z-index:1}
.pm-plan-sub{color:rgba(255,255,255,.38);font-size:.88rem;line-height:1.75;margin-bottom:2rem;position:relative;z-index:1}
.pm-order{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:1.3rem;margin-bottom:1.3rem;position:relative;z-index:1}
.pm-row{display:flex;justify-content:space-between;align-items:center;padding:.38rem 0;font-size:.84rem;color:rgba(255,255,255,.45)}
.pm-row strong{color:#fff;font-weight:700}
.pm-row.total{border-top:1px solid rgba(255,255,255,.1);margin-top:.4rem;padding-top:.8rem;font-size:.95rem;color:#fff}
.pm-total-num{font-family:'Bebas Neue','Impact',sans-serif;font-size:2rem;letter-spacing:.06em;color:var(--gold2);font-weight:900}
.pm-lock{display:flex;align-items:center;gap:8px;background:rgba(42,157,116,.1);border:1px solid rgba(42,157,116,.2);border-radius:12px;padding:.8rem 1rem;font-size:.77rem;color:var(--emerald);position:relative;z-index:1}
.pm-right{padding:2.8rem 2.4rem;background:#fff;overflow-y:auto;max-height:90vh}
.pm-methods{display:flex;gap:0;background:var(--off);border:1px solid var(--border);border-radius:12px;padding:3px;margin-bottom:1.5rem}
.pm-method{flex:1;background:none;border:none;padding:.55rem;font-family:var(--body);font-size:.77rem;font-weight:600;color:var(--muted);border-radius:9px;cursor:pointer;transition:all .3s;display:flex;align-items:center;justify-content:center;gap:4px}
.pm-method.active{background:#fff;color:var(--gold-dark);box-shadow:0 2px 10px rgba(201,168,76,.15)}
.card-visual{background:linear-gradient(135deg,var(--gold-dark),#b8900f,var(--gold2),#2a5a8a);border-radius:18px;padding:1.5rem;margin-bottom:1.3rem;color:#fff;position:relative;overflow:hidden;box-shadow:0 10px 36px rgba(201,168,76,.25)}
.card-visual::before{content:'';position:absolute;top:-40px;right:-40px;width:140px;height:140px;border-radius:50%;background:rgba(255,255,255,.07)}
.cv-chip{width:34px;height:26px;background:rgba(255,255,255,.2);border-radius:6px;margin-bottom:1.2rem;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;font-size:1.1rem}
.cv-number{font-family:var(--body);font-size:.95rem;letter-spacing:.22em;margin-bottom:1rem;opacity:.85;position:relative;z-index:1}
.cv-footer{display:flex;justify-content:space-between;font-size:.68rem;opacity:.65;text-transform:uppercase;letter-spacing:.06em;position:relative;z-index:1}
.pay-grid{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
.pay-field{display:flex;flex-direction:column;gap:.38rem;margin-bottom:.85rem}
.pay-field.full{grid-column:1/-1}
.pay-label{font-family:var(--body);font-size:.66rem;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--muted)}
.pay-input{border:1.5px solid var(--border);border-radius:11px;padding:.78rem .95rem;font-family:var(--body);font-size:.87rem;outline:none;background:var(--off);color:var(--black);transition:all .25s;width:100%}
.pay-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,.1);background:var(--white)}
.upi-apps{display:flex;gap:.6rem;margin-bottom:1.2rem;flex-wrap:wrap}
.upi-app{flex:1;min-width:68px;display:flex;flex-direction:column;align-items:center;gap:4px;padding:.75rem .5rem;border:1.5px solid var(--border);border-radius:14px;cursor:pointer;transition:all .3s cubic-bezier(.34,1.56,.64,1);background:var(--off)}
.upi-app:hover{border-color:var(--gold);transform:translateY(-4px) scale(1.06);background:rgba(201,168,76,.05)}
.upi-app.sel{border-color:var(--gold);background:rgba(201,168,76,.08)}
.upi-app-icon{font-size:1.5rem}
.upi-app-name{font-family:var(--body);font-size:.62rem;font-weight:700}
.bank-list{display:flex;flex-direction:column;gap:.6rem;margin-bottom:1.1rem}
.bank-item{display:flex;align-items:center;gap:.85rem;background:var(--off);border:1.5px solid var(--border);border-radius:14px;padding:.85rem 1rem;cursor:pointer;transition:all .3s}
.bank-item:hover{border-color:var(--gold);background:rgba(201,168,76,.05);transform:translateX(3px)}
.bank-item.sel{border-color:var(--gold);background:linear-gradient(135deg,#fffdf8,#fff)}
.bank-logo{width:40px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-family:var(--body);font-size:.65rem;font-weight:800;flex-shrink:0}
.bank-name{font-weight:600;font-size:.87rem;flex:1}
.bank-radio{width:18px;height:18px;border-radius:50%;border:2px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .25s;font-size:10px}
.bank-item.sel .bank-radio{background:var(--gold);border-color:var(--gold-dark);color:#1a0e00;font-weight:900}
.pay-progress{background:rgba(201,168,76,.05);border:1px solid rgba(201,168,76,.12);border-radius:14px;padding:1.1rem;margin-top:1.2rem}
.pp-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.8rem}
.pp-label{font-family:var(--body);font-size:.7rem;font-weight:700;color:var(--gold-dark);text-transform:uppercase;letter-spacing:.08em}
.pp-pct{font-family:'Bebas Neue','Impact',sans-serif;font-size:1.6rem;letter-spacing:.06em;color:var(--gold-dark);font-weight:900}
.pp-bar{height:4px;background:rgba(201,168,76,.1);border-radius:4px;overflow:hidden;margin-bottom:.9rem}
.pp-fill{height:100%;background:linear-gradient(90deg,var(--gold-dark),var(--gold2),var(--emerald));background-size:200% 100%;animation:shimmer 1.5s linear infinite;transition:width .5s ease;border-radius:4px}
.pp-steps{display:flex;gap:.4rem;flex-wrap:wrap}
.pp-step{display:flex;align-items:center;gap:3px;background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.1);border-radius:100px;padding:3px 9px;font-size:.64rem;color:var(--muted);font-family:var(--body);font-weight:700;transition:all .35s}
.pp-step.active{background:rgba(201,168,76,.15);border-color:rgba(201,168,76,.35);color:var(--gold-dark)}
.pp-step.done{background:rgba(42,157,116,.08);border-color:rgba(42,157,116,.25);color:var(--emerald)}
.pp-dot{width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0}
.pp-step.active .pp-dot{animation:pulse 1s ease-in-out infinite}
.pm-actions{display:flex;gap:.8rem;margin-top:1.3rem}
.pm-cancel-btn{flex:1;border:1.5px solid var(--border);background:#fff;color:var(--black);border-radius:14px;padding:.85rem;font-family:var(--body);font-size:.85rem;font-weight:600;cursor:pointer;transition:all .25s}
.pm-pay-btn{flex:1.5;background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold2));color:#1a0e00;border:none;border-radius:14px;padding:.85rem;font-family:'Bebas Neue','Impact',sans-serif;font-size:1rem;font-weight:900;cursor:pointer;box-shadow:0 6px 24px rgba(201,168,76,.35);transition:all .3s;letter-spacing:.1em;text-transform:uppercase;position:relative;overflow:hidden}
.pm-pay-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 36px rgba(201,168,76,.5)}
.pm-pay-btn:disabled{opacity:.7;cursor:not-allowed}
.processing-dots{display:flex;align-items:center;justify-content:center;gap:6px}
.proc-dot{width:7px;height:7px;border-radius:50%;background:rgba(26,14,0,.6)}
.proc-dot:nth-child(1){animation:dotBounce .8s ease-in-out infinite 0s}
.proc-dot:nth-child(2){animation:dotBounce .8s ease-in-out infinite .15s}
.proc-dot:nth-child(3){animation:dotBounce .8s ease-in-out infinite .3s}
.pm-success{text-align:center;padding:4rem 2.5rem;min-height:500px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(180deg,#fffdf8,#f8f6ff)}
.pm-success-icon{width:110px;height:110px;border-radius:50%;background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(42,157,116,.2));display:flex;align-items:center;justify-content:center;font-size:3rem;margin:0 auto 1.8rem;animation:successPop .7s cubic-bezier(.34,1.56,.64,1) both}
.pm-success-title{font-family:'Bebas Neue','Impact',sans-serif;font-size:2.5rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;margin-bottom:.6rem}
.pm-success-sub{font-size:.9rem;color:var(--muted);line-height:1.8;max-width:360px;margin:0 auto 2rem}
.pm-success-btn{background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold2));color:#1a0e00;border:none;padding:.95rem 2.5rem;border-radius:100px;font-family:'Bebas Neue','Impact',sans-serif;font-size:1rem;font-weight:900;cursor:pointer;box-shadow:0 6px 24px rgba(201,168,76,.35);transition:all .3s;letter-spacing:.1em;text-transform:uppercase}
.pm-success-btn:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 12px 36px rgba(201,168,76,.5)}
.confetti-piece{position:absolute;pointer-events:none;border-radius:3px;animation:confettiFly .8s ease-out both}

/* ── APPLY MODAL ── */
.apply-overlay{position:fixed;inset:0;z-index:700;background:rgba(5,3,8,.75);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:1rem}
.apply-modal{background:var(--white);border-radius:28px;padding:2.5rem;max-width:440px;width:100%;animation:modalIn .5s cubic-bezier(.34,1.56,.64,1) both;position:relative;overflow:hidden;border:1px solid var(--border)}
.apply-modal::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold-dark),var(--gold2))}

/* ── TOAST ── */
.toast{position:fixed;bottom:1.75rem;right:1.75rem;z-index:900;background:var(--near-black);color:#fff;padding:.85rem 1.2rem;border-radius:16px;font-size:.84rem;font-weight:500;display:flex;align-items:center;gap:.85rem;box-shadow:0 16px 56px rgba(0,0,0,.35),0 0 0 1px rgba(201,168,76,.12);animation:toastSlide .4s cubic-bezier(.34,1.56,.64,1) both;max-width:340px;font-family:var(--body)}
.toast-icon{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,var(--gold-dark),var(--gold));display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;color:#1a0e00}
.toast-close{background:none;border:none;color:rgba(255,255,255,.28);cursor:pointer;font-size:14px;margin-left:auto;padding:2px;line-height:1}
.toast-close:hover{color:#fff}

/* ── BREADCRUMB ── */
.breadcrumb{max-width:1200px;margin:0 auto;padding:1rem 3rem;display:flex;align-items:center;gap:.4rem;font-size:.78rem;color:var(--muted);flex-wrap:wrap}
.bc-btn{background:none;border:none;color:var(--muted);cursor:pointer;font-family:var(--body);font-size:.78rem;padding:2px 4px;border-radius:5px;transition:all .2s}
.bc-btn:hover{color:var(--gold-dark);background:rgba(201,168,76,.06)}

/* ── FOOTER ── */
.footer{background:var(--black);color:rgba(255,255,255,.22);padding:4rem 3rem 2rem;border-top:1px solid rgba(255,255,255,.05)}
.footer-inner{max-width:1200px;margin:0 auto}
.footer-top{display:flex;justify-content:space-between;gap:2rem;flex-wrap:wrap;margin-bottom:3rem}
.footer-brand-name{font-family:'Bebas Neue','Impact',sans-serif;font-size:1.8rem;color:rgba(255,255,255,.65);font-weight:900;letter-spacing:.12em;text-transform:uppercase;margin-bottom:.4rem}
.footer-brand-name em{color:var(--gold2);font-style:normal}
.footer-brand p{font-size:.8rem;max-width:230px;line-height:1.8}
.footer-col h4{font-family:var(--body);font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.35);margin-bottom:.9rem}
.footer-col a{display:block;font-size:.8rem;color:rgba(255,255,255,.22);cursor:pointer;margin-bottom:.4rem;transition:color .2s;text-decoration:none}
.footer-col a:hover{color:var(--gold2)}
.footer-bottom{display:flex;justify-content:space-between;align-items:center;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,.05);font-size:.74rem;flex-wrap:wrap;gap:.5rem}
.footer-socials{display:flex;gap:.5rem}
.fsoc{width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center;font-size:12px;cursor:pointer;color:rgba(255,255,255,.3);transition:all .3s;text-decoration:none}
.fsoc:hover{background:rgba(201,168,76,.18);border-color:rgba(201,168,76,.4);color:var(--gold2);transform:translateY(-3px)}

/* ── EMPTY ── */
.empty-wrap{text-align:center;padding:8rem 2rem;color:var(--muted)}
.empty-icon{font-size:3.5rem;display:block;margin-bottom:1rem;animation:float 3s ease-in-out infinite}

/* ── RESPONSIVE ── */
@media(max-width:1100px){.hero-inner{grid-template-columns:1fr}.hero-right{display:none}.plans-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:860px){.nav{padding:0 1.5rem}.nav-links{display:none}.auth-page{grid-template-columns:1fr}.auth-left{display:none}.payment-modal{grid-template-columns:1fr}.pm-left{display:none}.listings-layout{flex-direction:column;padding:1.5rem}.sidebar{width:100%;position:static}.section{padding:4rem 1.5rem}}
@media(max-width:640px){.nav{padding:0 1rem}.plans-grid{grid-template-columns:1fr}.hero-inner{padding:6rem 1.5rem 4rem}.jobs-grid{grid-template-columns:1fr}.co-grid{grid-template-columns:1fr}.social-grid{grid-template-columns:1fr}.contact-page,.resume-page,.social-page{padding:3rem 1.5rem}.detail-layout{flex-direction:column;padding:1.5rem}.detail-side{width:100%}.sticky-card{position:static}.pm-right{padding:1.8rem 1.4rem}.form-grid{grid-template-columns:1fr}.hero-stats{gap:1.5rem;flex-wrap:wrap}}
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const UNSPLASH = {
  office1:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&h=500&fit=crop&q=80",
  office2:"https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=700&h=500&fit=crop&q=80",
  office3:"https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=700&h=500&fit=crop&q=80",
  cowork:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&h=500&fit=crop&q=80",
  remote:"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&h=500&fit=crop&q=80",
  meeting:"https://images.unsplash.com/photo-1551434678-e076c223a692?w=700&h=500&fit=crop&q=80",
  team:"https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&h=500&fit=crop&q=80",
  startup:"https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=700&h=500&fit=crop&q=80",
  p1:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80",
  p2:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&q=80",
  p3:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&q=80",
  p4:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&q=80",
  p5:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80",
  p6:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80",
  co1:"https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=80&h=80&fit=crop&q=80",
  co2:"https://images.unsplash.com/photo-1563986768609-322da13575f3?w=80&h=80&fit=crop&q=80",
  co3:"https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=80&h=80&fit=crop&q=80",
  co4:"https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=80&h=80&fit=crop&q=80",
  co5:"https://images.unsplash.com/photo-1555421689-491a97ff2040?w=80&h=80&fit=crop&q=80",
  co6:"https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=80&h=80&fit=crop&q=80",
  b1:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&h=120&fit=crop&q=80",
  b2:"https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=700&h=120&fit=crop&q=80",
  b3:"https://images.unsplash.com/photo-1617040619263-41c5a9ca7521?w=700&h=120&fit=crop&q=80",
  b4:"https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=700&h=120&fit=crop&q=80",
  b5:"https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=700&h=120&fit=crop&q=80",
  b6:"https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=700&h=120&fit=crop&q=80",
};

const TESTIMONIALS = [
  {quote:"Found my dream role at Figma in under two weeks. The AI matching is genuinely impressive.",name:"Priya Sharma",role:"Product Designer · Figma",img:UNSPLASH.p2},
  {quote:"WorkBoard's premium listings filter out all the noise. I applied to 4 companies and got 3 offers.",name:"Marcus Chen",role:"Full-Stack Engineer · Stripe",img:UNSPLASH.p3},
  {quote:"As a recruiter, the candidate quality here is unmatched. We filled two senior roles in a month.",name:"Aisha Patel",role:"Talent Lead · Notion",img:UNSPLASH.p4},
  {quote:"The resume AI scanning matched me to a role I'd never have found myself. Changed my career.",name:"James Wright",role:"AI Researcher · Anthropic",img:UNSPLASH.p5},
  {quote:"Elite tier is worth every rupee. The 1-click apply alone saved me 20+ hours.",name:"Sofia Romano",role:"UX Lead · Airbnb",img:UNSPLASH.p6},
  {quote:"Clean, distraction-free, professional. Every post is verified. What the market was missing.",name:"Raj Mehta",role:"DevOps Lead · HashiCorp",img:UNSPLASH.p1},
];

const COMPANIES = [
  {id:1,name:"Figma Inc.",logo:UNSPLASH.co1,banner:UNSPLASH.b1,fallback:"Fi",color:"#7c3aed",bg:"#f5f3ff",industry:"Design Tools · SaaS",size:"1,000–5,000",about:"Building the future of collaborative design for millions of teams worldwide.",open:14,founded:"2012",hq:"San Francisco"},
  {id:2,name:"Stripe",logo:UNSPLASH.co2,banner:UNSPLASH.b2,fallback:"St",color:"#2563eb",bg:"#eff6ff",industry:"Fintech · Infrastructure",size:"5,000–10,000",about:"Economic infrastructure for the internet — payments, billing, and beyond.",open:38,founded:"2010",hq:"San Francisco"},
  {id:3,name:"Notion",logo:UNSPLASH.co3,banner:UNSPLASH.b3,fallback:"No",color:"#1d1d1d",bg:"#f5f5f5",industry:"Productivity · SaaS",size:"500–1,000",about:"The all-in-one workspace for modern teams building products and culture.",open:22,founded:"2016",hq:"New York"},
  {id:4,name:"Anthropic",logo:UNSPLASH.co4,banner:UNSPLASH.b4,fallback:"An",color:"#c84b2f",bg:"#fff0eb",industry:"AI Safety · Research",size:"500–1,000",about:"Building safe, interpretable, and steerable AI systems for a beneficial future.",open:31,founded:"2021",hq:"San Francisco"},
  {id:5,name:"Airbnb",logo:UNSPLASH.co5,banner:UNSPLASH.b5,fallback:"Ab",color:"#ff5a5f",bg:"#fff0f0",industry:"Travel · Marketplace",size:"5,000–10,000",about:"Connecting people to unique travel experiences in 220+ countries worldwide.",open:9,founded:"2008",hq:"San Francisco"},
  {id:6,name:"HashiCorp",logo:UNSPLASH.co6,banner:UNSPLASH.b6,fallback:"Ha",color:"#2d6a4f",bg:"#e8f8f1",industry:"DevOps · Cloud",size:"1,000–5,000",about:"Infrastructure automation software powering the world's largest enterprises.",open:17,founded:"2012",hq:"Austin"},
];

const JOBS = [
  {id:1,title:"Senior Product Designer",company:"Figma Inc.",coId:1,location:"San Francisco",type:"Full-time",remote:true,level:"Senior",salary:"₹1.2–1.6 Cr",salaryNum:140,date:"2d ago",featured:true,category:"Design",desc:"Lead design of next-gen collaborative tools used by 10M+ teams globally.",reqs:["5+ years product design","Figma & prototyping mastery","Systems thinking","User research","Executive communication"]},
  {id:2,title:"Full-Stack Engineer",company:"Stripe",coId:2,location:"Remote",type:"Full-time",remote:true,level:"Mid",salary:"₹90L–1.2 Cr",salaryNum:105,date:"1d ago",featured:true,category:"Engineering",desc:"Build financial infrastructure handling billions in transactions daily.",reqs:["3+ years full-stack","TypeScript / Node.js","Distributed systems","PostgreSQL","Fintech interest"]},
  {id:3,title:"Marketing Manager",company:"Notion",coId:3,location:"New York",type:"Full-time",remote:false,level:"Mid",salary:"₹55–75L",salaryNum:65,date:"3d ago",featured:false,category:"Marketing",desc:"Drive PLG growth initiatives for one of the fastest-growing productivity tools.",reqs:["4+ yrs B2B marketing","Content strategy","HubSpot / Mixpanel","Data-driven mindset","Exceptional writing"]},
  {id:4,title:"AI Safety Researcher",company:"Anthropic",coId:4,location:"San Francisco",type:"Full-time",remote:true,level:"Senior",salary:"₹1.5–2.4 Cr",salaryNum:200,date:"5h ago",featured:true,category:"AI/ML",desc:"Work at the frontier of AI safety research shaping the trajectory of safe AI development.",reqs:["PhD or 4+ yrs applied ML","PyTorch / JAX","LLM experience","Research publications","AI safety passion"]},
  {id:5,title:"UX Researcher",company:"Airbnb",coId:5,location:"Remote",type:"Contract",remote:true,level:"Mid",salary:"₹70–90L",salaryNum:80,date:"1w ago",featured:false,category:"Design",desc:"Conduct mixed-methods research uncovering host and guest insights.",reqs:["3+ yrs UX research","Qual & quant methods","Dovetail proficiency","Clear communication","Collaborative style"]},
  {id:6,title:"DevOps Engineer",company:"HashiCorp",coId:6,location:"Austin, TX",type:"Full-time",remote:true,level:"Senior",salary:"₹95L–1.3 Cr",salaryNum:115,date:"2d ago",featured:false,category:"Engineering",desc:"Scale infrastructure for 3,000+ enterprise customers using Terraform, Vault, and Nomad.",reqs:["5+ yrs DevOps/SRE","Deep Kubernetes","Terraform & Vault","Bash / Python","Cloud certifications"]},
];

const CATEGORIES = [
  {icon:"💻",label:"Engineering",count:"2,143"},{icon:"🎨",label:"Design",count:"893"},
  {icon:"🤖",label:"AI / ML",count:"1,201"},{icon:"📣",label:"Marketing",count:"744"},
  {icon:"💰",label:"Finance",count:"623"},{icon:"🤝",label:"Sales",count:"1,055"},
  {icon:"⚕️",label:"Healthcare",count:"381"},{icon:"🏗",label:"Operations",count:"502"},
];

const MARQUEE_ITEMS = ["Figma","Stripe","Anthropic","Notion","Airbnb","HashiCorp","Google","Meta","Apple","OpenAI","Vercel","Linear","Loom","Figma"];

const UPI_APPS = [
  {icon:"💜",name:"PhonePe",url:"https://www.phonepe.com"},
  {icon:"🟢",name:"GPay",url:"https://pay.google.com"},
  {icon:"🔵",name:"Paytm",url:"https://paytm.com"},
  {icon:"🇮🇳",name:"BHIM",url:"https://bhimupi.org.in"},
];

const BANKS = [
  {name:"HDFC Bank",type:"Net Banking",abbr:"HD",color:"#c13b2f",bg:"#fde8e7"},
  {name:"SBI",type:"State Bank",abbr:"SB",color:"#003366",bg:"#e6eef7"},
  {name:"ICICI Bank",type:"Net Banking",abbr:"IC",color:"#b5451b",bg:"#fceae5"},
  {name:"Axis Bank",type:"Net Banking",abbr:"AX",color:"#97144d",bg:"#fce8f0"},
];

const PLANS = [
  {key:"free",tier:"Starter",name:"Free",monthly:0,annual:0,desc:"Everything to kickstart your search.",btn:"Get Started",btnCls:"pb-outline",features:[{y:1,t:"Browse all 8,400+ roles"},{y:1,t:"Save up to 5 jobs"},{y:1,t:"Basic profile & resume upload"},{y:1,t:"Weekly email alerts"},{y:0,t:"Priority application badge",d:1},{y:0,t:"AI resume match score",d:1}]},
  {key:"pro",tier:"Most Popular",name:"Pro",monthly:19,annual:14,featured:true,desc:"AI tools to accelerate your job search.",btn:"Start Free Trial",btnCls:"pb-gold",features:[{y:1,t:"Everything in Free"},{y:1,t:"Unlimited saved jobs"},{y:1,t:"Priority application badge"},{y:1,t:"Recruiter visibility"},{y:1,t:"AI resume match score"},{y:0,t:"1-click apply",d:1}]},
  {key:"elite",tier:"Power User",name:"Elite",monthly:39,annual:29,desc:"Complete career toolkit for serious professionals.",btn:"Go Elite",btnCls:"pb-emerald",features:[{y:1,t:"Everything in Pro"},{y:1,t:"1-click apply"},{y:1,t:"Salary insights"},{y:1,t:"Application tracker"},{y:1,t:"Interview prep"},{y:1,t:"Monthly coaching call"}]},
  {key:"recruiter",tier:"For Teams",name:"Recruiter",monthly:99,annual:74,dark:true,desc:"Post jobs, search candidates, manage pipelines.",btn:"Start Hiring",btnCls:"pb-dark",features:[{y:1,t:"Post unlimited listings"},{y:1,t:"Full candidate database"},{y:1,t:"Advanced search & filters"},{y:1,t:"Branded company page"},{y:1,t:"ATS integrations"},{y:1,t:"Dedicated account manager"}]},
];

const SOCIALS = [
  {name:"X / Twitter",handle:"@WorkBoardHQ",icon:"𝕏",bg:"linear-gradient(135deg,#000,#222)",border:"rgba(255,255,255,.08)",url:"https://twitter.com"},
  {name:"LinkedIn",handle:"WorkBoard Official",icon:"in",bg:"linear-gradient(135deg,#005ea5,#0077b5)",border:"rgba(0,119,181,.3)",url:"https://linkedin.com"},
  {name:"YouTube",handle:"WorkBoard Careers",icon:"▶",bg:"linear-gradient(135deg,#c00,#f22)",border:"rgba(255,0,0,.2)",url:"https://youtube.com"},
  {name:"Instagram",handle:"@workboard.io",icon:"📸",bg:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",border:"rgba(193,53,132,.3)",url:"https://instagram.com"},
  {name:"Discord",handle:"Community Server",icon:"💬",bg:"linear-gradient(135deg,#4752c4,#7289da)",border:"rgba(88,101,242,.3)",url:"https://discord.gg"},
  {name:"GitHub",handle:"workboard-hq",icon:"⌥",bg:"linear-gradient(135deg,#24292e,#3a4049)",border:"rgba(255,255,255,.06)",url:"https://github.com"},
];

// ─── ANIMATED COUNT-UP HOOK ───────────────────────────────────────────────────
function useCountUp(target, dur=2000, start=false) {
  const [n, setN] = useState(0);
  const raf = useRef();
  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * ease));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [start, target, dur]);
  return n;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function CoLogo({ co, size=48, radius=13 }) {
  const [err, setErr] = useState(false);
  if (!err && co.logo) return (
    <div style={{ width:size, height:size, borderRadius:radius, overflow:"hidden", flexShrink:0 }}>
      <img src={co.logo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={()=>setErr(true)} />
    </div>
  );
  return (
    <div style={{ width:size, height:size, borderRadius:radius, background:co.bg, color:co.color, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Bebas Neue','Impact',sans-serif", fontWeight:900, fontSize:size*.36, flexShrink:0 }}>
      {co.fallback}
    </div>
  );
}

function TagBadge({ type, children }) {
  const cls = { type:"t-full", remote:"t-remote", level:"t-level", gold:"t-gold" };
  return <span className={`tag ${cls[type]||"t-level"}`}>{children}</span>;
}

// ─── LOADER ───────────────────────────────────────────────────────────────────
function LoaderStat({ target, suffix="", label, delay=0 }) {
  const [started, setStarted] = useState(false);
  const num = useCountUp(target, 1800, started);
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div className="loader-stat" style={{ animationDelay:`${delay}ms` }}>
      <span className="loader-stat-num" style={{ animationDelay:`${delay/1000}s` }}>
        {num.toLocaleString()}{suffix}
      </span>
      <span className="loader-stat-label">{label}</span>
    </div>
  );
}

function Loader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [step, setStep] = useState(0);
  const [statsGo, setStatsGo] = useState(false);
  const [exiting, setExiting] = useState(false);
  const STEPS = ["Connecting","Loading Roles","AI Matching","Ready"];

  useEffect(() => {
    const ts = [
      setTimeout(()=>{ setPct(20); setStep(1); setStatsGo(true); }, 200),
      setTimeout(()=>{ setPct(55); setStep(2); }, 700),
      setTimeout(()=>{ setPct(85); setStep(3); }, 1200),
      setTimeout(()=>{ setPct(100); }, 1700),
      setTimeout(()=>{ setExiting(true); setTimeout(onDone, 900); }, 2100),
    ];
    return () => ts.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className={`loader${exiting?" exit":""}`}>
      <div className="loader-mesh" />
      <div className="loader-grid" />
      <div className="loader-scan" />
      <div className="loader-grain" />

      <div className="loader-orb-ring">
        <div className="lor-ring lor1"/><div className="lor-ring lor2"/>
        <div className="lor-ring lor3"/><div className="lor-core"/>
      </div>

      {/* COUNTING NUMBERS — premium aesthetic */}
      <div className="loader-numbers">
        <LoaderStat target={8412} suffix="+" label="Live Roles" delay={300} />
        <div className="loader-stat-sep" />
        <LoaderStat target={1203} suffix="" label="Companies" delay={450} />
        <div className="loader-stat-sep" />
        <LoaderStat target={94} suffix="K" label="Hires Made" delay={600} />
      </div>

      {/* WORDMARK */}
      <div className="loader-wordmark" style={{ animation:"fadeIn .5s .1s both" }}>
        WORK<em>BOARD</em>
      </div>
      <div className="loader-sub">Elite Career Platform</div>

      {/* PROGRESS */}
      <div className="loader-bar">
        <div className="loader-fill" style={{ width:`${pct}%` }} />
      </div>
      <div className="loader-status">{STEPS[step]}</div>
    </div>
  );
}

// ─── PAGE TRANSITION ──────────────────────────────────────────────────────────
function PageTransition({ onDone }) {
  const N = 10;
  const [phase, setPhase] = useState("in");
  useEffect(() => {
    const t1 = setTimeout(()=>setPhase("out"), 360);
    const t2 = setTimeout(onDone, 760);
    return ()=>{ clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);
  return (
    <div className="page-wipe">
      {Array.from({length:N},(_,i)=>(
        <div key={i} className="wipe-blade" style={{
          left:`${i*(100/N)}%`, width:`${100/N+.3}%`,
          animation: phase==="in"
            ? `bladeIn .38s ${i*.025}s cubic-bezier(.76,0,.24,1) both`
            : `bladeOut .36s ${(N-1-i)*.022}s cubic-bezier(.76,0,.24,1) both`,
        }}/>
      ))}
    </div>
  );
}

// ─── JOB CARD ─────────────────────────────────────────────────────────────────
function JobCard({ job, saved, onSave, onClick, delay=0 }) {
  const co = COMPANIES.find(c=>c.id===job.coId);
  return (
    <div className={`job-card${job.featured?" featured":""}`}
      style={{ animation:`fadeUp .6s ${delay}s both` }}
      onClick={()=>onClick(job)}>
      {job.featured && <div className="job-feat-badge">✦ Featured</div>}
      <div className="jc-row">
        <div style={{ display:"flex", alignItems:"flex-start", gap:"1rem" }}>
          {co ? <CoLogo co={co} /> : <div style={{ width:48, height:48, borderRadius:14, background:"#f5f5f5", display:"flex", alignItems:"center", justifyContent:"center" }}>{job.company[0]}</div>}
          <div>
            <div className="job-title">{job.title}</div>
            <div className="job-co">{job.company} · {job.location}</div>
          </div>
        </div>
        <button className={`save-btn${saved?" saved":""}`} onClick={e=>{e.stopPropagation();onSave(job.id);}}>
          {saved?"♥":"♡"}
        </button>
      </div>
      <div className="tags">
        <TagBadge type="type">{job.type}</TagBadge>
        {job.remote && <TagBadge type="remote">Remote</TagBadge>}
        <TagBadge type="level">{job.level}</TagBadge>
      </div>
      <div className="jc-footer">
        <span className="j-salary">{job.salary}</span>
        <span className="j-date">{job.date}</span>
      </div>
    </div>
  );
}

// ─── APPLY MODAL ──────────────────────────────────────────────────────────────
function ApplyModal({ job, onClose }) {
  const confetti = Array.from({length:20},(_,i)=>({
    left:`${5+i*5}%`, top:`${50+Math.random()*35}%`,
    background:["#c9a84c","#2a9d74","#c2566b","#7c3aed","#fff"][i%5],
    "--dx":`${(Math.random()-.5)*100}px`, "--dy":`${-(40+Math.random()*80)}px`,
    "--dr":`${(Math.random()-.5)*720}deg`,
    width:`${8+Math.random()*10}px`, height:`${8+Math.random()*10}px`,
    borderRadius:Math.random()>.5?"50%":"3px",
    animationDelay:`${Math.random()*.25}s`,
  }));
  return (
    <div className="apply-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="apply-modal">
        {confetti.map((c,i)=><div key={i} className="confetti-piece" style={{...c,position:"absolute"}}/>)}
        <div style={{ textAlign:"center", position:"relative", zIndex:1 }}>
          <div style={{ width:70,height:70,borderRadius:"50%",background:"linear-gradient(135deg,rgba(201,168,76,.2),rgba(42,157,116,.2))",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1.2rem",fontSize:"2rem",animation:"successPop .6s .1s cubic-bezier(.34,1.56,.64,1) both" }}>🎉</div>
          <div className="hybrid-headline" style={{ fontSize:"1.8rem", marginBottom:".4rem" }}>Application Sent!</div>
          <div style={{ fontSize:".85rem", color:"var(--muted)", lineHeight:1.75, marginBottom:"1.5rem" }}>Your application for <strong>{job?.title}</strong> at <strong>{job?.company}</strong> is under review.</div>
          <div style={{ background:"var(--off)", borderRadius:14, padding:"1rem 1.2rem", marginBottom:"1.5rem", textAlign:"left" }}>
            {[["Position",job?.title],["Company",job?.company],["Location",job?.location],["Status","✓ Under Review"]].map(([l,v],i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:".32rem 0", fontSize:".82rem", borderBottom:i<3?"1px solid var(--border)":"none" }}>
                <span style={{ color:"var(--muted)" }}>{l}</span>
                <span style={{ fontWeight:600, color:l==="Status"?"var(--emerald)":"var(--black)" }}>{v}</span>
              </div>
            ))}
          </div>
          <button className="form-submit" onClick={onClose}>Back to Jobs</button>
        </div>
      </div>
    </div>
  );
}

// ─── PAYMENT MODAL ────────────────────────────────────────────────────────────
function PaymentModal({ plan, billing, price, onClose, onSuccess }) {
  const [tab, setTab] = useState("card");
  const [selBank, setSelBank] = useState(null);
  const [selUpi, setSelUpi] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [paying, setPaying] = useState(false);
  const [payPct, setPayPct] = useState(0);
  const [payStep, setPayStep] = useState(-1);
  const [done, setDone] = useState(false);
  const PAY_STEPS = ["Verifying","Encrypting","Processing","Confirming"];
  const annual = billing==="annual";
  const confetti = Array.from({length:32},(_,i)=>({
    left:`${3+i*3}%`, top:`${42+Math.random()*40}%`,
    background:["#c9a84c","#2a9d74","#c2566b","#7c3aed","#fff"][i%5],
    "--dx":`${(Math.random()-.5)*150}px`,"--dy":`${-(50+Math.random()*120)}px`,"--dr":`${(Math.random()-.5)*900}deg`,
    width:`${7+Math.random()*11}px`, height:`${7+Math.random()*11}px`,
    borderRadius:Math.random()>.5?"50%":"3px", animationDelay:`${i*.02}s`,
  }));

  const handlePay = () => {
    setPaying(true); setPayPct(0); setPayStep(0);
    [{p:22,s:0,t:400},{p:52,s:1,t:950},{p:78,s:2,t:1550},{p:96,s:3,t:2050},{p:100,s:3,t:2400}]
      .forEach(({p,s,t})=>setTimeout(()=>{setPayPct(p);setPayStep(s);},t));
    setTimeout(()=>{setPaying(false);setDone(true);},2750);
  };

  return (
    <div className="payment-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="payment-modal">
        {done ? (
          <div className="pm-success" style={{ gridColumn:"1/-1", position:"relative" }}>
            {confetti.map((c,i)=><div key={i} className="confetti-piece" style={{...c,position:"absolute"}}/>)}
            <div className="pm-success-icon" style={{ position:"relative", zIndex:1 }}>✅</div>
            <div className="pm-success-title" style={{ position:"relative", zIndex:1 }}>Welcome to {plan.name}!</div>
            <div className="pm-success-sub" style={{ position:"relative", zIndex:1 }}>Payment confirmed. All {plan.name} features are now live on your account.</div>
            <button className="pm-success-btn" style={{ position:"relative", zIndex:1 }} onClick={onSuccess}>Explore {plan.name} →</button>
          </div>
        ) : (<>
          <div className="pm-left">
            <div className="pm-left-orb pm-orb1"/><div className="pm-left-orb pm-orb2"/>
            <div className="pm-badge">🔒 Secure Checkout</div>
            <div className="pm-plan-title">Upgrade to<br/><span style={{ color:"var(--gold2)" }}>{plan.name}</span></div>
            <div className="pm-plan-sub">Unlock everything instantly. Cancel anytime.</div>
            <div className="pm-order">
              {[["Plan",plan.name],["Billing",annual?"Annual":"Monthly"],...(annual?[["Discount","Save 25%"]]:[])].map(([l,v],i)=>(
                <div key={i} className="pm-row"><span>{l}</span><strong style={l==="Discount"?{color:"var(--emerald)"}:{}}>{v}</strong></div>
              ))}
              <div className="pm-row total"><span>Total</span><div className="pm-total-num">${price}{annual?"/yr":"/mo"}</div></div>
            </div>
            <div className="pm-lock">🔐 256-bit SSL · PCI-DSS L1 · Instant activation</div>
          </div>
          <div className="pm-right">
            <div className="hybrid-headline" style={{ fontSize:"1.6rem", marginBottom:".3rem" }}>Complete Payment</div>
            <div style={{ fontSize:".82rem", color:"var(--muted)", marginBottom:"1.4rem" }}>Choose your preferred method</div>
            <div className="pm-methods">
              {[{k:"card",l:"💳 Card"},{k:"upi",l:"📲 UPI"},{k:"bank",l:"🏦 Net Banking"}].map(m=>(
                <button key={m.k} className={`pm-method${tab===m.k?" active":""}`} onClick={()=>setTab(m.k)}>{m.l}</button>
              ))}
            </div>

            {tab==="card" && (
              <div>
                <div className="card-visual">
                  <div className="cv-chip">💳</div>
                  <div className="cv-number">•••• •••• •••• ••••</div>
                  <div className="cv-footer">
                    <div><div>Card Holder</div><div style={{fontWeight:700,fontSize:".82rem"}}>Your Name</div></div>
                    <div><div>Expires</div><div style={{fontWeight:700,fontSize:".82rem"}}>MM/YY</div></div>
                  </div>
                </div>
                <div className="pay-grid">
                  <div className="pay-field full"><label className="pay-label">Card Number</label><input className="pay-input" placeholder="1234 5678 9012 3456"/></div>
                  <div className="pay-field"><label className="pay-label">Expiry</label><input className="pay-input" placeholder="MM / YY"/></div>
                  <div className="pay-field"><label className="pay-label">CVV</label><input className="pay-input" type="password" placeholder="•••"/></div>
                  <div className="pay-field full"><label className="pay-label">Name on Card</label><input className="pay-input" placeholder="As on card"/></div>
                </div>
              </div>
            )}

            {tab==="upi" && (
              <div>
                <div style={{ fontSize:".73rem", color:"var(--muted)", fontWeight:700, fontFamily:"var(--body)", textTransform:"uppercase", letterSpacing:".06em", marginBottom:".8rem" }}>Open your UPI app:</div>
                <div className="upi-apps">
                  {UPI_APPS.map((u,i)=>(
                    <div key={i} className={`upi-app${selUpi===i?" sel":""}`} onClick={()=>{setSelUpi(i);setTimeout(()=>window.open(u.url,"_blank"),400);}}>
                      <div className="upi-app-icon">{u.icon}</div>
                      <div className="upi-app-name">{u.name}</div>
                      <div style={{ fontSize:".56rem", color:"var(--gold-dark)", background:"rgba(201,168,76,.12)", borderRadius:4, padding:"2px 5px", border:"1px solid rgba(201,168,76,.2)" }}>Open ↗</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:".7rem", margin:".9rem 0" }}>
                  <div style={{ flex:1, height:1, background:"var(--border)" }}/><div style={{ fontSize:".72rem", color:"var(--muted)" }}>or enter UPI ID</div><div style={{ flex:1, height:1, background:"var(--border)" }}/>
                </div>
                <div style={{ position:"relative", marginBottom:".8rem" }}>
                  <span style={{ position:"absolute", left:"1rem", top:"50%", transform:"translateY(-50%)", fontWeight:700, color:"var(--gold-dark)", fontSize:"1.1rem" }}>@</span>
                  <input className="pay-input" style={{ paddingLeft:"2.8rem" }} placeholder="yourname@upi" value={upiId} onChange={e=>setUpiId(e.target.value)}/>
                </div>
                <button style={{ width:"100%", background:"linear-gradient(135deg,#4752c4,#7289da)", color:"#fff", border:"none", padding:".82rem", borderRadius:12, fontFamily:"'Bebas Neue','Impact',sans-serif", fontSize:".95rem", fontWeight:900, cursor:"pointer", boxShadow:"0 4px 16px rgba(71,82,196,.35)", letterSpacing:".08em", textTransform:"uppercase" }} onClick={()=>upiId&&handlePay()}>
                  Verify & Pay ₹{Math.round(price*83)}
                </button>
              </div>
            )}

            {tab==="bank" && (
              <div>
                <div className="bank-list">
                  {BANKS.map((b,i)=>(
                    <div key={i} className={`bank-item${selBank===i?" sel":""}`} onClick={()=>setSelBank(i)}>
                      <div className="bank-logo" style={{background:b.bg,color:b.color}}>{b.abbr}</div>
                      <div style={{flex:1}}><div className="bank-name">{b.name}</div><div style={{fontSize:".68rem",color:"var(--muted)"}}>{b.type}</div></div>
                      <div className="bank-radio">{selBank===i&&"✓"}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {paying && (
              <div className="pay-progress">
                <div className="pp-header"><span className="pp-label">Processing…</span><span className="pp-pct">{payPct}%</span></div>
                <div className="pp-bar"><div className="pp-fill" style={{width:`${payPct}%`}}/></div>
                <div className="pp-steps">
                  {PAY_STEPS.map((s,i)=>(
                    <div key={i} className={`pp-step${i===payStep?" active":i<payStep?" done":""}`}>
                      <span className="pp-dot"/>{i<payStep?"✓ ":""}{s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pm-actions">
              <button className="pm-cancel-btn" onClick={onClose} disabled={paying}>Cancel</button>
              <button className="pm-pay-btn" onClick={tab!=="upi"&&tab!=="bank"?handlePay:(tab==="bank"&&selBank!==null?handlePay:()=>{})} disabled={paying}>
                {paying ? <div className="processing-dots"><div className="proc-dot"/><div className="proc-dot"/><div className="proc-dot"/></div>
                : `Pay $${price}${annual?"/yr":"/mo"} →`}
              </button>
            </div>
          </div>
        </>)}
      </div>
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  return (
    <div className="toast">
      <div className="toast-icon">✦</div>
      <span>{msg}</span>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGES
// ══════════════════════════════════════════════════════════════════════════════

// ─── HOME ────────────────────────────────────────────────────────────────────
function HomePage({ onNav, onJobClick, savedJobs, onSave, visible }) {
  const roles  = useCountUp(8412, 1800, visible);
  const cos    = useCountUp(1203, 1600, visible);
  const hires  = useCountUp(94,   1400, visible);
  const IMG_CARDS = [
    {img:UNSPLASH.office1,label:"Figma HQ",sub:"San Francisco"},
    {img:UNSPLASH.cowork, label:"Stripe Campus",sub:"Remote Friendly"},
    {img:UNSPLASH.office3,label:"Anthropic Labs",sub:"AI Research"},
    {img:UNSPLASH.meeting,label:"Notion HQ",sub:"New York"},
    {img:UNSPLASH.team,   label:"Team Culture",sub:"Work & Life Balance"},
    {img:UNSPLASH.startup,label:"Startup Life",sub:"Move Fast"},
    {img:UNSPLASH.remote, label:"Remote First",sub:"Work Anywhere"},
    {img:UNSPLASH.office2,label:"Open Office",sub:"Collaboration"},
  ];
  const all3 = [...IMG_CARDS,...IMG_CARDS,...IMG_CARDS];
  const rowA = all3.filter((_,i)=>i%2===0).concat(all3.filter((_,i)=>i%2===0));
  const rowB = all3.filter((_,i)=>i%2!==0).concat(all3.filter((_,i)=>i%2!==0));

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero-orb hero-orb-1"/>
        <div className="hero-orb hero-orb-2"/>
        <div className="hero-orb hero-orb-3"/>
        <div className="hero-scan"/>
        <div className="hero-grain"/>
        <div className="hero-grid"/>
        <div className="hero-vignette"/>

        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow">
              <span className="hero-live-dot"/>
              <span>8,412+ curated opportunities live now</span>
            </div>
            <h1 className="hero-h1">
              <span className="hero-h1-row"><span className="hero-h1-inner">THE <span className="gold-grad">PREMIUM</span></span></span>
              <span className="hero-h1-row"><span className="hero-h1-inner stroke-text">PLATFORM</span></span>
              <span className="hero-h1-row"><span className="hero-h1-inner">FOR <span className="gold-grad">ELITE</span></span></span>
            </h1>
            <p className="hero-p">Handpicked roles at companies building the future. AI-matched to your profile — no recruiter spam, ever.</p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={()=>onNav("listings")}>Explore Jobs →</button>
              <button className="btn-secondary" onClick={()=>onNav("resume")}>Upload Resume</button>
            </div>
            <div className="hero-stats">
              {[[roles,"","Live Roles"],[cos,"","Companies"],[hires,"K+","Hires Made"]].map(([n,s,l])=>(
                <div key={l}>
                  <span className="h-stat-num">{n.toLocaleString()}{s}</span>
                  <span className="h-stat-label">{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-img-main">
              <img src={UNSPLASH.office1} alt="Office"/>
              <div className="hero-img-overlay"/>
            </div>
            <div className="hero-card-float hero-card-1" style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
              <div style={{ width:38,height:38,borderRadius:10,overflow:"hidden",flexShrink:0 }}><img src={UNSPLASH.co1} style={{ width:"100%",height:"100%",objectFit:"cover" }}/></div>
              <div><div className="hc-title">Sr. Product Designer · Figma</div><div className="hc-sub">₹1.2–1.6 Cr · San Francisco</div></div>
              <div className="hc-dot"/>
            </div>
            <div className="hero-card-float hero-card-2">
              <div className="hc-title">Anthropic</div>
              <div className="hc-sub">31 open roles</div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track ltr">
          {[...MARQUEE_ITEMS,...MARQUEE_ITEMS].map((t,i)=>(
            <div key={i} className={`marquee-item${i%4===0?" gold":""}`}><span className="m-dot"/>{t}</div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={{ background:"var(--surface)", padding:"4rem 0" }}>
        <div className="section" style={{ padding:"0 3rem" }}>
          <div className="sec-head">
            <div>
              <div className="sec-label">Explore Roles</div>
              <div className="sec-title"><span>Browse by <em>Category</em></span></div>
            </div>
          </div>
          <div className="cat-scroll">
            {CATEGORIES.map((c,i)=>(
              <div key={c.label} className="cat-pill" style={{ animation:`fadeUp .5s ${i*.06}s both` }} onClick={()=>onNav("listings")}>
                <span className="cat-pill-icon">{c.icon}</span>
                <span className="cat-pill-label">{c.label}</span>
                <span className="cat-pill-count">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* IMAGE CARDS ROLLING — video aesthetic */}
      <div style={{ background:"var(--near-black)", padding:"4rem 0", overflow:"hidden", position:"relative" }}>
        {/* Ambient orbs behind */}
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(201,168,76,.12),transparent 65%)", filter:"blur(60px)", top:"20%", left:"10%", pointerEvents:"none", animation:"orbDrift1 20s ease-in-out infinite" }}/>
        <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(194,86,107,.1),transparent 65%)", filter:"blur(50px)", bottom:"10%", right:"15%", pointerEvents:"none", animation:"orbDrift2 16s ease-in-out infinite" }}/>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 3rem 2rem", textAlign:"center", position:"relative", zIndex:1 }}>
          <div className="sec-label" style={{ justifyContent:"center" }}>Culture & Companies</div>
          <div className="sec-title dark-title" style={{ textAlign:"center" }}><span>Life at the<br/><em>World's Best Companies</em></span></div>
        </div>
        <div style={{ overflow:"hidden", paddingBottom:"1rem" }}>
          <div style={{ display:"flex", gap:"1.2rem", animation:"marqueeLTR 45s linear infinite", width:"max-content" }}>
            {rowA.map((c,i)=>(
              <div key={i} style={{ width:280, height:200, borderRadius:20, overflow:"hidden", flexShrink:0, position:"relative", cursor:"pointer" }}>
                <img src={c.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .6s" }}/>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.75),transparent 60%)", display:"flex", alignItems:"flex-end", padding:"1rem 1.2rem" }}>
                  <div><div style={{ fontFamily:"'Bebas Neue','Impact',sans-serif", fontSize:"1rem", fontWeight:900, color:"#fff", letterSpacing:".08em", textTransform:"uppercase" }}>{c.label}</div><div style={{ fontSize:".7rem", color:"rgba(255,255,255,.5)", marginTop:2 }}>{c.sub}</div></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:"1.2rem", animation:"marqueeRTL 38s linear infinite", width:"max-content", marginTop:"1.2rem" }}>
            {rowB.map((c,i)=>(
              <div key={i} style={{ width:280, height:200, borderRadius:20, overflow:"hidden", flexShrink:0, position:"relative", cursor:"pointer" }}>
                <img src={c.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .6s" }}/>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.75),transparent 60%)", display:"flex", alignItems:"flex-end", padding:"1rem 1.2rem" }}>
                  <div><div style={{ fontFamily:"'Bebas Neue','Impact',sans-serif", fontSize:"1rem", fontWeight:900, color:"#fff", letterSpacing:".08em", textTransform:"uppercase" }}>{c.label}</div><div style={{ fontSize:".7rem", color:"rgba(255,255,255,.5)", marginTop:2 }}>{c.sub}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED JOBS */}
      <div style={{ background:"var(--surface)", padding:"6rem 0" }}>
        <div className="section" style={{ padding:"0 3rem" }}>
          <div className="sec-head">
            <div>
              <div className="sec-label">Handpicked for You</div>
              <div className="sec-title"><span><em>Featured</em> Opportunities</span></div>
            </div>
            <button className="link-btn" onClick={()=>onNav("listings")}>View all →</button>
          </div>
          <div className="jobs-grid">
            {JOBS.filter(j=>j.featured).map((job,i)=>(
              <JobCard key={job.id} job={job} saved={savedJobs.includes(job.id)} onSave={onSave} onClick={onJobClick} delay={i*.1}/>
            ))}
          </div>
        </div>
      </div>

      {/* COMPANIES */}
      <div style={{ background:"var(--off)", padding:"6rem 0" }}>
        <div className="section" style={{ padding:"0 3rem" }}>
          <div className="sec-head">
            <div>
              <div className="sec-label">Top Employers</div>
              <div className="sec-title"><span>Companies <em>Hiring Now</em></span></div>
            </div>
            <button className="link-btn" onClick={()=>onNav("companies")}>All companies →</button>
          </div>
          <div className="co-grid">
            {COMPANIES.slice(0,3).map((co,i)=>(
              <div key={co.id} className="co-card" style={{ animation:`fadeUp .6s ${i*.1}s both` }} onClick={()=>onNav("company",null,co)}>
                <div className="co-banner"><img src={co.banner} alt=""/><div className="co-banner-overlay"/></div>
                <div className="co-body">
                  <div className="co-header">
                    <CoLogo co={co} size={46} radius={12}/>
                    <div style={{ marginTop:".2rem" }}><div className="co-name">{co.name}</div><div className="co-ind">{co.industry}</div></div>
                  </div>
                  <div className="co-desc">{co.about.slice(0,100)}…</div>
                  <div className="co-footer"><span className="roles-chip">{co.open} open roles</span><span className="co-size">{co.size}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ background:"var(--surface)", padding:"6rem 0", overflow:"hidden" }}>
        <div className="section" style={{ padding:"0 3rem 3rem" }}>
          <div className="sec-head" style={{ marginBottom:"2rem" }}>
            <div>
              <div className="sec-label">Success Stories</div>
              <div className="sec-title"><span>Loved by <em>Job Seekers</em></span></div>
            </div>
          </div>
        </div>
        <div style={{ overflow:"hidden" }}>
          <div className="testi-scroll">
            {[...TESTIMONIALS,...TESTIMONIALS].map((t,i)=>(
              <div key={i} className="testi-card">
                <div className="stars">★★★★★</div>
                <div className="testi-quote">"{t.quote}"</div>
                <div className="testi-author">
                  <div className="testi-avatar"><img src={t.img} alt=""/></div>
                  <div><div className="testi-name">{t.name}</div><div className="testi-role">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background:"var(--near-black)", padding:"6rem 3rem", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 50%,rgba(201,168,76,.18),transparent 65%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", inset:0, animation:"filmGrain .15s steps(1) infinite", opacity:.025, backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", pointerEvents:"none" }}/>
        <div style={{ position:"relative", zIndex:1, maxWidth:600, margin:"0 auto" }}>
          <div className="sec-label" style={{ justifyContent:"center" }}>Ready to Start?</div>
          <div className="sec-title dark-title" style={{ textAlign:"center", marginBottom:".9rem" }}><span>Your next great role<br/><em>starts here</em></span></div>
          <div className="dark-sub" style={{ marginBottom:"2.5rem", fontSize:"1rem" }}>Join 200,000+ professionals who found their next opportunity on WorkBoard.</div>
          <div style={{ display:"flex", gap:".8rem", justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn-primary" onClick={()=>onNav("listings")}>Browse 8,400+ Jobs</button>
            <button className="btn-secondary" onClick={()=>onNav("plans")}>View Plans</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LISTINGS ─────────────────────────────────────────────────────────────────
function ListingsPage({ onJobClick, savedJobs, onSave }) {
  const [salary, setSalary] = useState(200);
  const [types, setTypes] = useState([]);
  const [levels, setLevels] = useState([]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const toggle = (arr,set,v) => set(arr.includes(v)?arr.filter(x=>x!==v):[...arr,v]);
  const filtered = JOBS.filter(j=>{
    if(j.salaryNum>salary) return false;
    if(types.length&&!types.includes(j.type)) return false;
    if(levels.length&&!levels.includes(j.level)) return false;
    if(remoteOnly&&!j.remote) return false;
    return true;
  });
  return (
    <div className="listings-layout">
      <aside className="sidebar">
        <div className="sb-title">Filters</div>
        <div className="filter-group">
          <span className="filter-label">Salary (max)</span>
          <div className="range-wrap">
            <input type="range" min="50" max="200" step="5" value={salary} onChange={e=>setSalary(+e.target.value)}/>
            <div className="range-value">₹{salary}L / yr</div>
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-label">Job Type</span>
          {["Full-time","Contract","Internship"].map(t=>(
            <div key={t} className="filter-opt"><input type="checkbox" checked={types.includes(t)} onChange={()=>toggle(types,setTypes,t)}/><span>{t}</span></div>
          ))}
        </div>
        <div className="filter-group">
          <span className="filter-label">Level</span>
          {["Junior","Mid","Senior","Lead"].map(l=>(
            <div key={l} className="filter-opt"><input type="checkbox" checked={levels.includes(l)} onChange={()=>toggle(levels,setLevels,l)}/><span>{l}</span></div>
          ))}
        </div>
        <div className="filter-group">
          <span className="filter-label">Work Mode</span>
          <div className="filter-opt"><input type="checkbox" checked={remoteOnly} onChange={e=>setRemoteOnly(e.target.checked)}/><span>Remote only</span></div>
        </div>
        <button className="reset-btn" onClick={()=>{setSalary(200);setTypes([]);setLevels([]);setRemoteOnly(false);}}>Reset</button>
      </aside>
      <main className="listings-main">
        <div className="list-header">
          <div className="list-count">Showing <strong>{filtered.length}</strong> of {JOBS.length}</div>
          <select className="sort-select"><option>Most Recent</option><option>Highest Salary</option><option>Most Relevant</option></select>
        </div>
        {filtered.map((job,i)=>{
          const co=COMPANIES.find(c=>c.id===job.coId);
          return (
            <div key={job.id} className="list-row" style={{ animation:`fadeUp .4s ${i*.06}s both` }} onClick={()=>onJobClick(job)}>
              {co ? <CoLogo co={co} size={46} radius={12}/> : <div style={{ width:46,height:46,borderRadius:12,background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{job.company[0]}</div>}
              <div className="list-info">
                <div className="list-title">{job.title}</div>
                <div className="list-meta"><span>{job.company}</span><span>·</span><span>📍 {job.location}</span><TagBadge type="type">{job.type}</TagBadge>{job.remote&&<TagBadge type="remote">Remote</TagBadge>}</div>
              </div>
              <div className="list-right"><div className="j-salary">{job.salary}</div><div className="j-date">{job.date}</div></div>
              <button className={`save-btn${savedJobs.includes(job.id)?" saved":""}`} onClick={e=>{e.stopPropagation();onSave(job.id);}} style={{ flexShrink:0 }}>{savedJobs.includes(job.id)?"♥":"♡"}</button>
            </div>
          );
        })}
        {!filtered.length && <div className="empty-wrap"><span className="empty-icon">🔍</span><h3>No matches</h3><p>Try relaxing your filters.</p></div>}
      </main>
    </div>
  );
}

// ─── JOB DETAIL ───────────────────────────────────────────────────────────────
function JobDetailPage({ job, savedJobs, onSave, onApply, onCompanyClick }) {
  const co=COMPANIES.find(c=>c.id===job.coId);
  return (
    <div className="detail-layout">
      <div className="detail-main">
        <div className="detail-header" style={{ animation:"fadeUp .5s both" }}>
          <div className="d-logo-row">
            {co ? <CoLogo co={co} size={64} radius={16}/> : <div style={{ width:64,height:64,borderRadius:16,background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem" }}>{job.company[0]}</div>}
            <div><div className="d-title">{job.title}</div><div className="d-company" onClick={()=>co&&onCompanyClick(co)}>{job.company} ↗</div></div>
          </div>
          <div className="tags"><TagBadge type="type">{job.type}</TagBadge>{job.remote&&<TagBadge type="remote">Remote</TagBadge>}<TagBadge type="level">{job.level}</TagBadge><TagBadge type="gold">✦ Featured</TagBadge></div>
          <div className="d-tags"><div className="d-fact">📍 {job.location}</div><div className="d-fact">🕐 {job.type}</div><div className="d-fact">📅 {job.date}</div><div className="d-fact">🎯 {job.level}</div></div>
        </div>
        <div className="d-section" style={{ animation:"fadeUp .5s .08s both" }}><h3>About the Role</h3><p>{job.desc}</p><p>High impact, high autonomy. You'll work closely with engineering, product, and leadership to shape the future of the product.</p></div>
        <div className="d-section" style={{ animation:"fadeUp .5s .16s both" }}><h3>Requirements</h3><ul className="req-list">{job.reqs.map((r,i)=><li key={i}>{r}</li>)}</ul></div>
        <div className="d-section" style={{ animation:"fadeUp .5s .24s both" }}><h3>What We Offer</h3><ul className="req-list"><li>Salary: {job.salary}</li><li>Equity (4-year vesting)</li><li>Health, dental & vision</li><li>₹1.5L annual L&D budget</li><li>Flexible PTO & remote-first culture</li></ul></div>
        {co && <div className="d-section" style={{ animation:"fadeUp .5s .32s both" }}><h3>About {co.name}</h3><p>{co.about}</p></div>}
      </div>
      <div className="detail-side">
        <div className="sticky-card">
          <div className="sc-label">Compensation</div>
          <div className="sc-salary">{job.salary}</div>
          <button className="apply-btn" onClick={onApply}>Apply Now →</button>
          <button className="save-role-btn" onClick={()=>onSave(job.id)}>{savedJobs.includes(job.id)?"♥ Saved":"♡ Save Role"}</button>
          <div style={{ fontSize:".72rem", color:"var(--muted)", textAlign:"center", marginTop:".75rem" }}>⏰ Closes in ~2 weeks</div>
          <div className="sc-meta">📍 {job.location}<br/>🕐 {job.type}<br/>{co&&<>🏢 {co.size} employees</>}</div>
        </div>
      </div>
    </div>
  );
}

// ─── COMPANIES ────────────────────────────────────────────────────────────────
function CompaniesPage({ onCompanyClick }) {
  return (
    <div style={{ background:"var(--surface)", padding:"5rem 0" }}>
      <div className="section" style={{ padding:"0 3rem" }}>
        <div className="sec-head">
          <div><div className="sec-label">Top Employers</div><div className="sec-title"><span>Companies <em>Hiring Now</em></span></div></div>
        </div>
        <div className="co-grid">
          {COMPANIES.map((co,i)=>(
            <div key={co.id} className="co-card" style={{ animation:`fadeUp .6s ${i*.08}s both` }} onClick={()=>onCompanyClick(co)}>
              <div className="co-banner"><img src={co.banner} alt=""/><div className="co-banner-overlay"/></div>
              <div className="co-body">
                <div className="co-header"><CoLogo co={co} size={46} radius={12}/><div style={{ marginTop:".2rem" }}><div className="co-name">{co.name}</div><div className="co-ind">{co.industry}</div></div></div>
                <div className="co-desc">{co.about}</div>
                <div className="co-footer"><span className="roles-chip">{co.open} open roles</span><span className="co-size">{co.size}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── COMPANY DETAIL ───────────────────────────────────────────────────────────
function CompanyDetailPage({ co, jobs, onJobClick }) {
  const cjobs = jobs.filter(j=>j.coId===co.id);
  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"2.5rem 3rem" }}>
      <div className="d-section" style={{ marginBottom:"1.2rem", animation:"fadeUp .5s both" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"1.4rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
          <CoLogo co={co} size={74} radius={18}/>
          <div>
            <div className="hybrid-headline" style={{ fontSize:"2.2rem" }}>{co.name}</div>
            <div style={{ color:"var(--muted)", fontSize:".88rem" }}>{co.industry} · Founded {co.founded} · {co.hq}</div>
          </div>
        </div>
        <p style={{ fontSize:".9rem", lineHeight:1.85, color:"#4a4760", marginBottom:"1rem" }}>{co.about}</p>
        <div style={{ display:"flex", gap:".6rem", flexWrap:"wrap" }}>
          {[["🏢",co.size],["📍",co.hq],["📅",`Founded ${co.founded}`]].map(([i,v])=>(
            <div key={v} className="d-fact">{i} {v}</div>
          ))}
        </div>
      </div>
      <div className="d-section" style={{ animation:"fadeUp .5s .1s both" }}>
        <h3>Open Roles at {co.name}</h3>
        {cjobs.length ? cjobs.map(job=>(
          <div key={job.id} className="list-row" style={{ marginTop:".7rem" }} onClick={()=>onJobClick(job)}>
            <CoLogo co={co} size={44} radius={11}/>
            <div className="list-info"><div className="list-title">{job.title}</div><div className="list-meta"><span>📍 {job.location}</span><TagBadge type="type">{job.type}</TagBadge></div></div>
            <div className="list-right"><div className="j-salary">{job.salary}</div></div>
          </div>
        )) : <p style={{ color:"var(--muted)", fontSize:".85rem" }}>No open roles right now.</p>}
      </div>
    </div>
  );
}

// ─── PLANS ────────────────────────────────────────────────────────────────────
function PlansPage({ onToast }) {
  const [billing, setBilling] = useState("annual");
  const [faqOpen, setFaqOpen] = useState(null);
  const [confirmPlan, setConfirmPlan] = useState(null);
  const annual = billing==="annual";
  const pr = p => p[billing];
  const FAQS = [
    ["Can I cancel anytime?","Yes — no lock-ins. Cancel in 2 clicks from settings."],
    ["Is there a free trial for Pro?","14-day free trial, no credit card required."],
    ["How does AI matching work?","We analyse your resume against 12 dimensions including skills, seniority, and company culture fit."],
    ["What payment methods are accepted?","All major cards, UPI (PhonePe, GPay, Paytm, BHIM), and Net Banking."],
    ["Can I switch plans mid-cycle?","Upgrades are instant and prorated. Downgrades take effect next cycle."],
  ];
  return (
    <div>
      <div className="plans-hero">
        <div className="plans-hero-mesh"/>
        <div style={{ position:"absolute", inset:0, animation:"filmGrain .15s steps(1) infinite", opacity:.025, backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", pointerEvents:"none" }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontFamily:"var(--body)", fontSize:".65rem", fontWeight:800, color:"var(--gold2)", letterSpacing:".25em", textTransform:"uppercase", marginBottom:"1rem", display:"inline-flex", alignItems:"center", gap:".5rem", background:"rgba(201,168,76,.1)", border:"1px solid rgba(201,168,76,.25)", borderRadius:100, padding:"6px 16px", animation:"fadeUp .5s .05s both" }}>✦ Simple Transparent Pricing</div>
          <div className="sec-title dark-title" style={{ textAlign:"center", fontSize:"clamp(2.8rem,5vw,4.5rem)", margin:"0 auto 1rem", maxWidth:600, animation:"fadeUp .6s .12s both" }}><span>Invest in your <em>career</em></span></div>
          <div className="dark-sub" style={{ textAlign:"center", maxWidth:460, margin:"0 auto 2.5rem", fontSize:"1rem", animation:"fadeUp .5s .2s both" }}>Plans that grow with you — from first search to hiring at scale.</div>
          <div className="billing-toggle" style={{ animation:"fadeUp .5s .28s both" }}>
            <button className={`billing-opt${billing==="monthly"?" active":""}`} onClick={()=>setBilling("monthly")}>Monthly</button>
            <button className={`billing-opt${billing==="annual"?" active":""}`} onClick={()=>setBilling("annual")}>Annual <span style={{ background:"rgba(42,157,116,.2)", color:"var(--emerald)", fontSize:".65rem", padding:"2px 7px", borderRadius:100, marginLeft:4 }}>Save 25%</span></button>
          </div>
        </div>
      </div>

      <div style={{ background:"var(--off)", padding:"6rem 3rem" }}>
        <div className="plans-grid">
          {PLANS.map((plan,i)=>(
            <div key={plan.key} className={`plan-card${plan.dark?" dark-card":""}`} style={{ animation:`fadeUp .6s ${i*.08}s both` }}>
              {plan.featured && <div className="plan-badge">⭐ Popular</div>}
              <div className="plan-tier">{plan.tier}</div>
              <div className="plan-name">{plan.name}</div>
              <div className="plan-desc">{plan.desc}</div>
              <div className="plan-price">{pr(plan)===0?"Free":`$${pr(plan)}`}</div>
              <div className="plan-period">{pr(plan)>0?`per month${annual?" · billed annually":" · billed monthly"}`:"always free"}</div>
              {pr(plan)>0&&annual&&<div style={{ fontSize:".72rem", color:"var(--emerald)", fontWeight:600, marginTop:".25rem" }}>Save ${(plan.monthly-plan.annual)*12}/yr</div>}
              <hr className="plan-divider"/>
              <ul className="plan-features">
                {plan.features.map((f,j)=>(
                  <li key={j} className="plan-feat">
                    <span className={`feat-check${f.y?" feat-yes":" feat-no"}`}>{f.y?"✓":"×"}</span>
                    <span className={`feat-text${f.d?" dim":""}`}>{f.t}</span>
                  </li>
                ))}
              </ul>
              <button className={`plan-btn ${plan.btnCls}`} onClick={()=>{
                if(plan.key==="free"){onToast("🚀 You're on the Free plan!");return;}
                setConfirmPlan(plan);
              }}>{plan.btn}</button>
            </div>
          ))}
        </div>
        <div style={{ maxWidth:760, margin:"0 auto" }}>
          <div className="hybrid-headline" style={{ fontSize:"1.8rem", marginBottom:"1.5rem" }}>Frequently Asked Questions</div>
          {FAQS.map(([q,a],i)=>(
            <div key={i} style={{ background:"var(--white)", border:"1px solid var(--border)", borderRadius:14, marginBottom:".6rem", overflow:"hidden" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1rem 1.4rem", cursor:"pointer", fontSize:".88rem", fontWeight:600 }} onClick={()=>setFaqOpen(faqOpen===i?null:i)}>
                <span>{q}</span>
                <span style={{ color:"var(--muted)", transition:"transform .3s", transform:faqOpen===i?"rotate(180deg)":"rotate(0)" }}>▾</span>
              </div>
              {faqOpen===i && <div style={{ padding:"0 1.4rem 1rem", fontSize:".82rem", color:"var(--muted)", lineHeight:1.75 }}>{a}</div>}
            </div>
          ))}
        </div>
      </div>

      {confirmPlan && (
        <PaymentModal plan={confirmPlan} billing={billing} price={annual?pr(confirmPlan)*12:pr(confirmPlan)}
          onClose={()=>setConfirmPlan(null)}
          onSuccess={()=>{setConfirmPlan(null);onToast(`🎉 Welcome to ${confirmPlan.name}! All features unlocked.`);}}
        />
      )}
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthPage({ onToast, onNav }) {
  const [tab, setTab] = useState("login");
  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-mesh"/>
        <div style={{ position:"absolute", inset:0, animation:"filmGrain .15s steps(1) infinite", opacity:.03, backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", pointerEvents:"none" }}/>
        <div className="auth-left-content">
          <div className="auth-left-logo">WORK<em>BOARD</em></div>
          <div className="auth-left-title">"Found my dream role in 11 days."</div>
          <div className="auth-left-sub">WorkBoard's AI matched me to a Figma role I would never have found on my own.</div>
          <div style={{ display:"flex", gap:".75rem", marginBottom:"2rem", justifyContent:"center" }}>
            <div style={{ width:38,height:38,borderRadius:"50%",overflow:"hidden" }}><img src={UNSPLASH.p2} style={{ width:"100%",height:"100%",objectFit:"cover" }}/></div>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontFamily:"var(--body)", fontSize:".8rem", fontWeight:700, color:"#fff" }}>Priya Sharma</div>
              <div style={{ fontSize:".72rem", color:"rgba(255,255,255,.35)" }}>Product Designer · Figma</div>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:"2rem" }}>
            {[["8,400+","Jobs Listed"],["94K","Hires Made"],["200K+","Users"]].map(([n,l])=>(
              <div key={l} style={{ textAlign:"center" }}><span className="als-num">{n}</span><span className="als-label">{l}</span></div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-box">
          <div className="hybrid-headline" style={{ fontSize:"2rem", marginBottom:"2rem" }}>WORK<span style={{ color:"var(--gold)" }}>BOARD</span></div>
          <div className="auth-tabs">
            <button className={`auth-tab${tab==="login"?" active":""}`} onClick={()=>setTab("login")}>Sign In</button>
            <button className={`auth-tab${tab==="signup"?" active":""}`} onClick={()=>setTab("signup")}>Create Account</button>
          </div>
          {tab==="login" ? <>
            <div className="auth-title">Welcome Back</div>
            <div className="auth-sub">Sign in to your WorkBoard account to continue.</div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@example.com"/></div>
            <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="Your password"/><span className="forgot-link" onClick={()=>onToast("📧 Password reset email sent!")}>Forgot password?</span></div>
            <button className="auth-submit" onClick={()=>{onToast("✅ Signed in! Welcome back.");onNav("home");}}>Sign In →</button>
            <div className="auth-divider"><div className="auth-divider-line"/><div className="auth-divider-text">or continue with</div><div className="auth-divider-line"/></div>
            <div className="social-auth">
              {[["G","Google"],["in","LinkedIn"],["⌥","GitHub"]].map(([i,l])=>(
                <button key={l} className="social-auth-btn" onClick={()=>onToast(`Signing in with ${l}…`)}><span style={{ fontWeight:800 }}>{i}</span>{l}</button>
              ))}
            </div>
          </> : <>
            <div className="auth-title">Create Account</div>
            <div className="auth-sub">Join 200,000+ professionals finding great work.</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".8rem" }}>
              <div className="form-group" style={{ marginBottom:0 }}><label className="form-label">First Name</label><input className="form-input" placeholder="Priya"/></div>
              <div className="form-group" style={{ marginBottom:0 }}><label className="form-label">Last Name</label><input className="form-input" placeholder="Sharma"/></div>
            </div>
            <div className="form-group" style={{ marginTop:".9rem" }}><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@example.com"/></div>
            <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="Create a password"/></div>
            <button className="auth-submit" onClick={()=>{onToast("🎉 Account created! Welcome to WorkBoard.");onNav("home");}}>Create Account →</button>
            <div className="auth-footer">By creating an account you agree to our <a onClick={()=>{}}>Terms</a> & <a onClick={()=>{}}>Privacy Policy</a>.</div>
          </>}
        </div>
      </div>
    </div>
  );
}

// ─── RESUME ───────────────────────────────────────────────────────────────────
function ResumePage({ onUploadDone }) {
  const [file, setFile] = useState(null);
  const [pct, setPct] = useState(0);
  const [stage, setStage] = useState(0);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();
  const STAGES = ["Uploading","Parsing","Analysing","Indexing"];

  const handleFile = f => {
    if(!f) return;
    setFile({name:f.name,size:(f.size/1024).toFixed(0)+"KB"});
    setStage(1); setPct(0);
    let p=0;
    const iv = setInterval(()=>{
      p+=Math.random()*15+8;
      if(p>=100){clearInterval(iv);setPct(100);setTimeout(()=>{setStage(2);onUploadDone(f.name);},400);}
      else setPct(Math.min(Math.round(p),99));
    },200);
  };

  const curStage = stage===1?Math.floor(pct/25):4;
  return (
    <div className="resume-page">
      <div className="hybrid-headline" style={{ fontSize:"2.8rem", marginBottom:".4rem", animation:"fadeUp .5s .05s both" }}>Upload Your Resume</div>
      <div style={{ color:"var(--muted)", fontSize:".88rem", marginBottom:"2.5rem", lineHeight:1.7, fontWeight:300, animation:"fadeUp .5s .14s both" }}>Go live to 1,200+ hiring companies. Upload once — apply everywhere.</div>

      {stage===0 && (
        <div className={`upload-zone${drag?" dragging":""}`}
          onDragOver={e=>{e.preventDefault();setDrag(true);}}
          onDragLeave={()=>setDrag(false)}
          onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}}
          onClick={()=>fileRef.current.click()}>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>
          <div className="uz-icon">📄</div>
          <div className="uz-title">{drag?"Drop it here!":"Drag & Drop Resume"}</div>
          <div className="uz-sub">or click to browse your files</div>
          <div className="uz-formats">{["PDF","DOC","DOCX","Max 5MB"].map(f=><span key={f} className="uz-fmt">{f}</span>)}</div>
        </div>
      )}

      {stage===1 && (
        <div className="upload-progress">
          <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.3rem" }}>
            <div style={{ width:50,height:50,borderRadius:14,background:"rgba(201,168,76,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",flexShrink:0 }}>📎</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Bebas Neue','Impact',sans-serif", fontWeight:900, fontSize:"1rem", color:"#fff", marginBottom:2, letterSpacing:".06em", textTransform:"uppercase" }}>{file?.name}</div>
              <div style={{ fontSize:".72rem", color:"rgba(255,255,255,.3)" }}>{file?.size}</div>
            </div>
            <div style={{ fontFamily:"'Bebas Neue','Impact',sans-serif", fontWeight:900, fontSize:"1.4rem", color:"var(--gold2)" }}>{pct}%</div>
          </div>
          <div className="up-bar"><div className="up-fill" style={{ width:`${pct}%` }}/></div>
          <div style={{ display:"flex", gap:".4rem", marginTop:".9rem", flexWrap:"wrap" }}>
            {STAGES.map((s,i)=>(
              <div key={s} style={{ display:"flex", alignItems:"center", gap:4, background:i===curStage?"rgba(201,168,76,.15)":i<curStage?"rgba(42,157,116,.1)":"rgba(255,255,255,.04)", border:`1px solid ${i===curStage?"rgba(201,168,76,.35)":i<curStage?"rgba(42,157,116,.3)":"rgba(255,255,255,.07)"}`, borderRadius:100, padding:"3px 9px", fontSize:".68rem", color:i===curStage?"var(--gold2)":i<curStage?"var(--emerald)":"rgba(255,255,255,.25)", fontFamily:"var(--body)", fontWeight:700 }}>
                <span style={{ width:5,height:5,borderRadius:"50%",background:"currentColor",flexShrink:0,animation:i===curStage?"pulse 1s ease-in-out infinite":"none" }}/>
                {i<curStage?"✓ ":""}{s}
              </div>
            ))}
          </div>
        </div>
      )}

      {stage===2 && (
        <div className="upload-success">
          <div className="us-icon">✅</div>
          <div className="hybrid-headline" style={{ fontSize:"1.5rem", color:"#fff", marginBottom:".4rem" }}>Resume is Live!</div>
          <div style={{ fontSize:".82rem", color:"rgba(255,255,255,.38)", marginBottom:"1rem" }}>{file?.name} · AI-parsed · Profile updated</div>
          <div style={{ display:"flex", gap:".5rem", justifyContent:"center", flexWrap:"wrap" }}>
            {[["✓ Recruiter visible","rgba(42,157,116,.1)","rgba(42,157,116,.25)","var(--emerald)"],["✓ Skills extracted","rgba(42,157,116,.1)","rgba(42,157,116,.25)","var(--emerald)"],["⭐ 72% profile strength","rgba(201,168,76,.1)","rgba(201,168,76,.25)","var(--gold2)"]].map(([t,bg,b,c])=>(
              <span key={t} style={{ background:bg, border:`1px solid ${b}`, borderRadius:100, padding:"4px 12px", fontSize:".71rem", color:c, fontFamily:"var(--body)", fontWeight:700 }}>{t}</span>
            ))}
          </div>
          <button style={{ marginTop:"1rem", background:"none", border:"none", color:"rgba(255,255,255,.22)", cursor:"pointer", fontSize:".73rem" }} onClick={()=>{setStage(0);setFile(null);}}>Upload different file</button>
        </div>
      )}

      <div style={{ background:"var(--white)", border:"1px solid var(--border)", borderRadius:20, padding:"2rem", marginTop:"1.5rem", animation:"fadeUp .5s .3s both" }}>
        <div className="hybrid-headline" style={{ fontSize:"1.4rem", marginBottom:"1.5rem" }}>Profile Details</div>
        <div className="form-grid">
          {[["First Name","Priya"],["Last Name","Sharma"],["Email","priya@example.com"],["Phone","+91 98765 43210"],["Current Role","Sr. Product Designer"],["Desired CTC","₹25,00,000"]].map(([l,p])=>(
            <div key={l} className="form-group"><label className="form-label">{l}</label><input className="form-input" placeholder={p}/></div>
          ))}
          <div className="form-group form-full"><label className="form-label">Bio</label><textarea className="form-input" rows={3} placeholder="A short intro about yourself…" style={{ resize:"vertical" }}/></div>
        </div>
        <button className="form-submit" onClick={()=>onUploadDone("profile")}>Save & Go Live →</button>
      </div>
    </div>
  );
}

// ─── SAVED ────────────────────────────────────────────────────────────────────
function SavedPage({ savedJobs, jobs, onJobClick, onSave }) {
  const saved = jobs.filter(j=>savedJobs.includes(j.id));
  if(!saved.length) return (
    <div className="empty-wrap"><span className="empty-icon">♡</span><h3>No saved roles yet</h3><p>Bookmark roles and they'll appear here.</p></div>
  );
  return (
    <div className="section">
      <div className="sec-head"><div><div className="sec-label">Bookmarked</div><div className="sec-title"><span><em>Saved</em> Roles</span></div></div></div>
      <div className="jobs-grid">{saved.map((job,i)=><JobCard key={job.id} job={job} saved onSave={onSave} onClick={onJobClick} delay={i*.08}/>)}</div>
    </div>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function ContactPage({ onToast }) {
  const [tab, setTab] = useState("seeker");
  return (
    <div className="contact-page">
      <div className="hybrid-headline" style={{ fontSize:"2.8rem", marginBottom:".4rem", animation:"fadeUp .5s .05s both" }}>Get in Touch</div>
      <div style={{ color:"var(--muted)", fontSize:".88rem", marginBottom:"2rem", animation:"fadeUp .5s .14s both" }}>Whether you're hiring or searching — we're here to help.</div>
      <div className="contact-tabs">
        <button className={`contact-tab${tab==="seeker"?" active":""}`} onClick={()=>setTab("seeker")}>Job Seeker</button>
        <button className={`contact-tab${tab==="employer"?" active":""}`} onClick={()=>setTab("employer")}>Employer</button>
      </div>
      <div className="contact-box" style={{ animation:"fadeUp .4s .1s both" }}>
        {tab==="seeker" ? <>
          <div className="cb-title">Need Help With Your Search?</div>
          <div className="cb-sub">Tell us about your account or a listing issue.</div>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Name</label><input className="form-input" placeholder="Your name"/></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" placeholder="your@email.com"/></div>
            <div className="form-group form-full"><label className="form-label">Subject</label><select className="form-input"><option>General Inquiry</option><option>Account Issue</option><option>Report a Listing</option><option>Other</option></select></div>
            <div className="form-group form-full"><label className="form-label">Message</label><textarea className="form-input" rows={5} placeholder="Tell us what's on your mind…"/></div>
          </div>
          <button className="form-submit" onClick={()=>onToast("✉️ Message sent! We'll reply within 24h.")}>Send Message</button>
        </> : <>
          <div className="cb-title">Post a Job or Partner With Us</div>
          <div className="cb-sub">Reach thousands of qualified candidates.</div>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Your Name</label><input className="form-input" placeholder="Jane Smith"/></div>
            <div className="form-group"><label className="form-label">Company</label><input className="form-input" placeholder="Acme Corp"/></div>
            <div className="form-group"><label className="form-label">Work Email</label><input className="form-input" placeholder="jane@company.com"/></div>
            <div className="form-group"><label className="form-label">Team Size</label><select className="form-input"><option>1–10</option><option>11–50</option><option>51–200</option><option>200+</option></select></div>
            <div className="form-group form-full"><label className="form-label">Details</label><textarea className="form-input" rows={4} placeholder="Describe your hiring needs…"/></div>
          </div>
          <button className="form-submit" onClick={()=>onToast("🏢 Thanks! Our team will reach out shortly.")}>Submit Inquiry</button>
        </>}
      </div>
    </div>
  );
}

// ─── SOCIAL ───────────────────────────────────────────────────────────────────
function SocialPage({ onToast }) {
  return (
    <div className="social-page">
      <div className="hybrid-headline" style={{ fontSize:"2.8rem", marginBottom:".4rem", animation:"fadeUp .5s .05s both" }}>Connect With Us</div>
      <div style={{ color:"var(--muted)", fontSize:".88rem", marginBottom:"2.5rem", animation:"fadeUp .5s .14s both" }}>Follow us for job drops, career tips, and community updates.</div>
      <div style={{ background:"linear-gradient(135deg,var(--near-black),#18142e)", border:"1px solid rgba(201,168,76,.2)", borderRadius:20, padding:"1.8rem 2rem", marginBottom:"1.8rem", position:"relative", overflow:"hidden", animation:"fadeUp .5s .2s both" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 50% 80% at 90% 50%,rgba(201,168,76,.12),transparent 60%)", pointerEvents:"none" }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(201,168,76,.1)", border:"1px solid rgba(201,168,76,.22)", borderRadius:100, padding:"4px 12px", fontFamily:"var(--body)", fontSize:".65rem", fontWeight:800, color:"var(--gold2)", letterSpacing:".08em", textTransform:"uppercase", marginBottom:".9rem" }}>⚡ Advertise with Us</div>
          <div className="hybrid-headline" style={{ fontSize:"1.5rem", color:"#fff", marginBottom:".4rem" }}>Reach 200K+ Active Job Seekers</div>
          <div style={{ fontSize:".82rem", color:"rgba(255,255,255,.38)", marginBottom:"1.2rem", lineHeight:1.65 }}>Promote open roles and your employer brand to qualified candidates.</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:".7rem", marginBottom:"1.2rem" }}>
            {[["200K+","Monthly Reach"],["8.4%","Avg. CTR"],["94K","Hires"],["₹3,200","Avg. CPL"]].map(([n,l])=>(
              <div key={l} style={{ background:"rgba(255,255,255,.05)", borderRadius:12, padding:".8rem .9rem" }}>
                <div className="loader-stat-num" style={{ fontSize:"1.4rem", display:"block", margin:0 }}>{n}</div>
                <div style={{ fontFamily:"var(--body)", fontSize:".64rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".07em", color:"rgba(255,255,255,.28)" }}>{l}</div>
              </div>
            ))}
          </div>
          <button style={{ background:"linear-gradient(135deg,var(--gold-dark),var(--gold))", color:"#1a0e00", border:"none", padding:".7rem 1.6rem", borderRadius:100, fontFamily:"'Bebas Neue','Impact',sans-serif", fontSize:".9rem", fontWeight:900, cursor:"pointer", letterSpacing:".1em", textTransform:"uppercase" }} onClick={()=>onToast("📣 Our ads team will be in touch!")}>Get Media Kit →</button>
        </div>
      </div>
      <div className="social-grid">
        {SOCIALS.map((s,i)=>(
          <a key={s.name} className="social-card" style={{ background:s.bg, border:`1px solid ${s.border}`, animation:`fadeUp .5s ${i*.07}s both` }}
            href={s.url} onClick={e=>{e.preventDefault();onToast(`Opening ${s.name}…`);setTimeout(()=>window.open(s.url,"_blank"),300);}}>
            <div className="sc-icon">{s.icon}</div>
            <div className="sc-name">{s.name}</div>
            <div className="sc-handle">{s.handle}</div>
            <div className="sc-follow-btn">Follow →</div>
          </a>
        ))}
      </div>
      <div className="nl-box" style={{ animation:"fadeUp .5s .5s both" }}>
        <div style={{ fontSize:"2rem", marginBottom:".5rem" }}>📬</div>
        <div className="nl-title">Weekly Job Digest</div>
        <div className="nl-sub">Top 10 curated roles every Monday. No noise, ever.</div>
        <div className="nl-form">
          <input className="nl-input" type="email" placeholder="your@email.com"/>
          <button className="nl-btn" onClick={()=>onToast("🎉 Subscribed to weekly digest!")}>Subscribe</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP SHELL
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [pendingPage, setPendingPage] = useState(null);
  const [page, setPage] = useState("home");
  const [selJob, setSelJob] = useState(null);
  const [selCo, setSelCo] = useState(null);
  const [savedJobs, setSavedJobs] = useState([1,4]);
  const [toast, setToast] = useState(null);
  const [applyModal, setApplyModal] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const toastRef = useRef();

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>16);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  const showToast = msg => {
    if(toastRef.current) clearTimeout(toastRef.current);
    setToast(msg);
    toastRef.current = setTimeout(()=>setToast(null), 3800);
  };

  const nav = useCallback((newPage, job=null, co=null)=>{
    if(transitioning) return;
    if(newPage===page&&!job&&!co) return;
    setPendingPage({page:newPage,job,co});
    setTransitioning(true);
    setPageVisible(false);
  },[page,transitioning]);

  const onTransitionDone = useCallback(()=>{
    if(!pendingPage) return;
    setPage(pendingPage.page);
    if(pendingPage.job) setSelJob(pendingPage.job);
    else if(pendingPage.co) setSelCo(pendingPage.co);
    else { setSelJob(null); setSelCo(null); }
    setTransitioning(false);
    setPendingPage(null);
    window.scrollTo({top:0,behavior:"auto"});
    setTimeout(()=>setPageVisible(true),120);
  },[pendingPage]);

  const onLoaderDone = useCallback(()=>{
    setLoading(false);
    setTimeout(()=>setPageVisible(true),200);
  },[]);

  const toggleSave = id => {
    const was = savedJobs.includes(id);
    setSavedJobs(prev=>was?prev.filter(x=>x!==id):[...prev,id]);
    showToast(was?"Removed from saved ♡":"Saved to bookmarks ♥");
  };

  const goJob = job => nav("detail",job,null);
  const goCo  = co  => nav("company",null,co);

  const NAV_ITEMS = [
    {key:"home",l:"Home"},
    {key:"listings",l:"Jobs"},
    {key:"companies",l:"Companies"},
    {key:"social",l:"Community"},
    {key:"contact",l:"Contact"},
  ];

  const isDark = page==="home";
  const isJobsActive = page==="listings"||page==="detail";

  const renderPage = () => {
    switch(page){
      case "home":      return <HomePage onNav={nav} onJobClick={goJob} savedJobs={savedJobs} onSave={toggleSave} visible={pageVisible}/>;
      case "listings":  return <ListingsPage onJobClick={goJob} savedJobs={savedJobs} onSave={toggleSave}/>;
      case "detail":    return selJob ? <JobDetailPage job={selJob} savedJobs={savedJobs} onSave={toggleSave} onApply={()=>setApplyModal(selJob)} onCompanyClick={goCo}/> : null;
      case "companies": return <CompaniesPage onCompanyClick={goCo}/>;
      case "company":   return selCo ? <CompanyDetailPage co={selCo} jobs={JOBS} onJobClick={goJob}/> : null;
      case "resume":    return <ResumePage onUploadDone={()=>showToast("📄 Resume is live to 1,200+ recruiters!")}/>;
      case "saved":     return <SavedPage savedJobs={savedJobs} jobs={JOBS} onJobClick={goJob} onSave={toggleSave}/>;
      case "contact":   return <ContactPage onToast={showToast}/>;
      case "social":    return <SocialPage onToast={showToast}/>;
      case "plans":     return <PlansPage onToast={showToast} visible={pageVisible}/>;
      case "login":     return <AuthPage onToast={showToast} onNav={nav}/>;
      default:          return <HomePage onNav={nav} onJobClick={goJob} savedJobs={savedJobs} onSave={toggleSave} visible={pageVisible}/>;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      {loading && <Loader onDone={onLoaderDone}/>}
      {transitioning && pendingPage && <PageTransition onDone={onTransitionDone}/>}

      <div style={{ opacity:loading?0:1, transition:"opacity .8s ease", display:"flex", flexDirection:"column", minHeight:"100vh" }}>
        {/* NAVBAR */}
        {page!=="login" && (
          <nav className={`nav${isDark?" dark":""}${scrolled?" scrolled":""}`}>
            <div className="nav-logo" onClick={()=>nav("home")}>
              <div className="nav-wordmark">WORK<em>BOARD</em></div>
            </div>
            <div className="nav-links">
              {NAV_ITEMS.map(item=>(
                <button key={item.key} className={`nav-link${(item.key==="listings"?isJobsActive:page===item.key)?" active":""}`} onClick={()=>nav(item.key)}>{item.l}</button>
              ))}
            </div>
            <div className="nav-right">
              <div className="nav-saved" onClick={()=>nav("saved")}><div className="nav-saved-count">{savedJobs.length}</div><span>Saved</span></div>
              <button className="nav-btn-ghost" onClick={()=>nav("plans")}>💎 Plans</button>
              <button className="nav-btn-ghost" onClick={()=>nav("login")}>Sign In</button>
              <button className="nav-btn-cta" onClick={()=>nav("resume")}>Upload Resume</button>
            </div>
          </nav>
        )}

        {/* BREADCRUMB */}
        {(page==="detail"||page==="company") && (
          <div className="breadcrumb">
            <button className="bc-btn" onClick={()=>nav("home")}>Home</button><span>›</span>
            {page==="detail" && <><button className="bc-btn" onClick={()=>nav("listings")}>Jobs</button><span>›</span><span>{selJob?.title}</span></>}
            {page==="company" && <><button className="bc-btn" onClick={()=>nav("companies")}>Companies</button><span>›</span><span>{selCo?.name}</span></>}
          </div>
        )}

        <div style={{ flex:1 }}>{renderPage()}</div>

        {/* FOOTER */}
        {page!=="login" && (
          <footer className="footer">
            <div className="footer-inner">
              <div className="footer-top">
                <div>
                  <div className="footer-brand-name">WORK<em>BOARD</em></div>
                  <p>Connecting exceptional talent with companies building the future. No ghost jobs, no spam.</p>
                </div>
                <div className="footer-col"><h4>Job Seekers</h4>{[["Browse Jobs","listings"],["Upload Resume","resume"],["Saved Roles","saved"],["Pricing","plans"]].map(([l,p])=><a key={l} onClick={()=>nav(p)}>{l}</a>)}</div>
                <div className="footer-col"><h4>Employers</h4>{["Post a Job","Talent Search","Recruiter Plan","Contact Sales"].map(l=><a key={l} onClick={()=>nav("contact")}>{l}</a>)}</div>
                <div className="footer-col"><h4>Community</h4>{[["Social Media","social"],["Newsletter","social"],["Contact","contact"]].map(([l,p])=><a key={l} onClick={()=>nav(p)}>{l}</a>)}</div>
              </div>
              <div className="footer-bottom">
                <span>© 2026 WorkBoard · Built with intention · All rights reserved</span>
                <div className="footer-socials">
                  {[["𝕏","https://twitter.com"],["in","https://linkedin.com"],["▶","https://youtube.com"],["📸","https://instagram.com"]].map(([i,u])=>(
                    <a key={i} className="fsoc" href={u} onClick={e=>{e.preventDefault();showToast("Opening…");setTimeout(()=>window.open(u,"_blank"),200);}}>{i}</a>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        )}

        {toast && <Toast msg={toast} onClose={()=>setToast(null)}/>}
        {applyModal && <ApplyModal job={applyModal} onClose={()=>{setApplyModal(null);showToast("🎉 Application submitted!");}}/>}
      </div>
    </>
  );
}