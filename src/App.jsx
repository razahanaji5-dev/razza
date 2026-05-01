import { useState, useRef, useEffect, useCallback } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0a0812;
    --surface: #ffffff;
    --paper: #f8f7fc;
    --cream: #f0edf9;
    --midnight: #060412;
    --deep: #0d0a20;
    --gold: #d4a843;
    --gold-light: #f0c960;
    --gold-pale: #fdf6e3;
    --gold-dark: #a87d28;
    --emerald: #00b894;
    --emerald-pale: #d5f5ef;
    --emerald-dark: #007a64;
    --crimson: #e63757;
    --crimson-pale: #fde8ed;
    --sapphire: #2563eb;
    --sapphire-pale: #eff6ff;
    --amethyst: #7c3aed;
    --amethyst-mid: #9b5cf6;
    --amethyst-light: #c4b5fd;
    --amethyst-pale: #f5f3ff;
    --rose-gold: #e8956d;
    --platinum: #e8e6f0;
    --silver: #8a8799;
    --border: #e5e2f0;
    --border2: #c8c4df;
    --serif: 'Playfair Display', Georgia, serif;
    --display: 'Syne', system-ui, sans-serif;
    --sans: 'Outfit', system-ui, sans-serif;
    --mono: 'SF Mono', 'Fira Code', monospace;
    --r-sm: 10px; --r-md: 16px; --r-lg: 22px; --r-xl: 32px; --r-2xl: 44px;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--paper); color: var(--ink); font-family: var(--sans); min-height: 100vh; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
  .app { display: flex; flex-direction: column; min-height: 100vh; }
  .page-wrap { flex: 1; position: relative; }

  /* ══════════════════════════════════════
     CINEMATIC INITIAL LOADER — GOLD PREMIUM
  ══════════════════════════════════════ */
  .initial-loader {
    position: fixed; inset: 0; z-index: 10000;
    background: var(--midnight);
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 0; overflow: hidden;
  }
  .initial-loader.hide {
    animation: ilHide 1.1s 0.3s cubic-bezier(.76,0,.24,1) forwards;
  }
  @keyframes ilHide {
    0%   { opacity: 1; transform: scale(1); }
    25%  { opacity: 1; transform: scale(1.03); }
    100% { opacity: 0; transform: scale(1.08) translateY(-4%); pointer-events: none; visibility: hidden; }
  }

  .il-aurora {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 65% 55% at 30% 38%, rgba(212,168,67,0.22) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 78% 62%, rgba(124,58,237,0.15) 0%, transparent 55%),
      radial-gradient(ellipse 40% 40% at 50% 98%, rgba(0,184,148,0.12) 0%, transparent 50%);
    animation: auroraShift 10s ease-in-out infinite alternate;
  }
  @keyframes auroraShift { 0%{opacity:.7;transform:scale(1)} 100%{opacity:1;transform:scale(1.07)} }

  .il-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(212,168,67,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212,168,67,0.05) 1px, transparent 1px);
    background-size: 80px 80px;
    animation: gridScroll 18s linear infinite;
  }
  @keyframes gridScroll { 0%{transform:translateY(0) translateX(0)} 100%{transform:translateY(80px) translateX(80px)} }

  /* Streak / light-ray effect */
  .il-streaks { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
  .il-streak {
    position: absolute; height: 1px; opacity: 0;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    animation: streakFly linear infinite;
  }
  @keyframes streakFly {
    0%   { opacity: 0; transform: translateX(-150%) scaleX(.4); }
    20%  { opacity: .7; }
    80%  { opacity: .5; }
    100% { opacity: 0; transform: translateX(150%) scaleX(1.2); }
  }

  .il-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
  .il-particle {
    position: absolute; border-radius: 50%;
    animation: particleRise linear infinite;
  }
  @keyframes particleRise {
    0%   { transform: translateY(110vh) scale(0) rotate(0deg); opacity: 0; }
    8%   { opacity: 1; }
    88%  { opacity: .4; }
    100% { transform: translateY(-60px) scale(1) rotate(360deg); opacity: 0; }
  }

  .il-center {
    position: relative; z-index: 2;
    display: flex; flex-direction: column; align-items: center; gap: 1.8rem;
    animation: ilCenterReveal .9s cubic-bezier(.34,1.56,.64,1) both;
  }
  @keyframes ilCenterReveal {
    0%   { opacity: 0; transform: scale(.65) translateY(24px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* Premium gem logo */
  .il-logomark { width: 100px; height: 100px; position: relative; }

  .il-rings { position: absolute; inset: -22px; pointer-events: none; }
  .il-ring { position: absolute; border-radius: 50%; border: 1px solid transparent; animation: ringPulse 3s ease-in-out infinite; }
  .il-ring:nth-child(1) { inset: 0;      border-color: rgba(212,168,67,.35); animation-delay: 0s; }
  .il-ring:nth-child(2) { inset: -14px;  border-color: rgba(124,58,237,.22); animation-delay: .7s; }
  .il-ring:nth-child(3) { inset: -28px;  border-color: rgba(0,184,148,.18);  animation-delay: 1.4s; }
  @keyframes ringPulse {
    0%,100% { opacity:.35; transform:scale(1); }
    50%     { opacity:1;   transform:scale(1.05); }
  }

  .il-logomark-ring {
    position: absolute; inset: 0; border-radius: 50%;
    background: conic-gradient(from 0deg, var(--gold), var(--amethyst-mid), var(--emerald), var(--gold));
    padding: 2px; animation: gemSpin 8s linear infinite;
  }
  .il-logomark-ring::before {
    content: ''; position: absolute; inset: 2px;
    background: var(--midnight); border-radius: 50%;
  }
  @keyframes gemSpin { to { transform: rotate(360deg); } }

  .il-logomark-inner {
    position: absolute; inset: 10px; border-radius: 50%;
    background: linear-gradient(135deg, #1a1435, #0d0a20);
    display: flex; align-items: center; justify-content: center;
    animation: gemCounterSpin 8s linear infinite; z-index: 1;
  }
  @keyframes gemCounterSpin { to { transform: rotate(-360deg); } }

  .il-logomark-icon {
    font-size: 2.2rem;
    filter: drop-shadow(0 0 12px rgba(212,168,67,.9));
    position: relative; z-index: 1;
    animation: gemIconPulse 2s ease-in-out infinite;
  }
  @keyframes gemIconPulse {
    0%,100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(212,168,67,.8)); }
    50%     { transform: scale(1.12); filter: drop-shadow(0 0 22px rgba(212,168,67,1)); }
  }

  .il-brand { display: flex; flex-direction: column; align-items: center; gap: .35rem; }
  .il-wordmark {
    font-family: var(--serif); font-size: 2.8rem; font-weight: 700;
    color: #fff; letter-spacing: -.02em;
    animation: wordReveal .7s .2s cubic-bezier(.22,1,.36,1) both;
  }
  .il-wordmark em { color: var(--gold-light); font-style: italic; }
  @keyframes wordReveal {
    0%   { opacity: 0; transform: translateY(14px) scale(.96); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  .il-tagline {
    font-family: var(--display); font-size: .7rem; font-weight: 600;
    letter-spacing: .3em; text-transform: uppercase;
    color: rgba(255,255,255,.25);
    animation: fadeUp .5s .4s both;
  }

  /* STATS COUNTERS */
  .il-stats {
    display: flex; gap: 2.8rem;
    animation: fadeUp .6s .5s both;
  }
  .il-stat { text-align: center; }
  .il-stat-num {
    font-family: var(--serif); font-size: 2.1rem; font-style: italic;
    color: var(--gold-light); font-weight: 700; line-height: 1;
    min-width: 80px; display: block;
  }
  .il-stat-label {
    font-family: var(--display); font-size: .62rem; font-weight: 600;
    color: rgba(255,255,255,.22); text-transform: uppercase; letter-spacing: .12em; margin-top: 4px;
  }
  .il-stat-sep { width: 1px; background: rgba(255,255,255,.08); align-self: stretch; margin: .2rem 0; }

  /* PROGRESS */
  .il-progress-wrap { width: 240px; animation: fadeUp .5s .65s both; }
  .il-progress-bg { height: 2px; background: rgba(255,255,255,.06); border-radius: 2px; overflow: hidden; margin-bottom: .65rem; position: relative; }
  .il-progress-line {
    height: 100%; border-radius: 2px;
    background: linear-gradient(90deg, var(--gold-dark), var(--gold), var(--gold-light), var(--emerald));
    width: 0; transition: width .3s cubic-bezier(.22,1,.36,1);
  }
  .il-status {
    text-align: center; font-family: var(--display);
    font-size: .65rem; color: rgba(255,255,255,.2);
    letter-spacing: .12em; text-transform: uppercase; font-weight: 600;
  }

  /* ══════════════════════════════════════
     PAGE TRANSITION — LASER CURTAIN
  ══════════════════════════════════════ */
  .page-transition {
    position: fixed; inset: 0; z-index: 9999;
    pointer-events: all;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 1.5rem;
  }
  .pt-curtain {
    position: absolute; inset: 0;
    display: grid; grid-template-columns: repeat(6, 1fr);
    pointer-events: none;
  }
  .pt-panel {
    background: var(--deep);
    transform-origin: bottom;
    animation: curtainDown .58s cubic-bezier(.76,0,.24,1) both;
  }
  .pt-panel.leave {
    transform-origin: top;
    animation: curtainUp .52s cubic-bezier(.76,0,.24,1) both;
  }
  .pt-panel:nth-child(1) { animation-delay: 0s; }
  .pt-panel:nth-child(2) { animation-delay: .045s; }
  .pt-panel:nth-child(3) { animation-delay: .09s; }
  .pt-panel:nth-child(4) { animation-delay: .135s; }
  .pt-panel:nth-child(5) { animation-delay: .18s; }
  .pt-panel:nth-child(6) { animation-delay: .225s; }
  .pt-panel.leave:nth-child(1) { animation-delay: .225s; }
  .pt-panel.leave:nth-child(2) { animation-delay: .18s; }
  .pt-panel.leave:nth-child(3) { animation-delay: .135s; }
  .pt-panel.leave:nth-child(4) { animation-delay: .09s; }
  .pt-panel.leave:nth-child(5) { animation-delay: .045s; }
  .pt-panel.leave:nth-child(6) { animation-delay: 0s; }
  @keyframes curtainDown { 0%{transform:scaleY(0)} 100%{transform:scaleY(1)} }
  @keyframes curtainUp   { 0%{transform:scaleY(1)} 100%{transform:scaleY(0)} }

  /* Gold glow-line that sweeps across panels */
  .pt-glowline {
    position: absolute; inset: 0; pointer-events: none; overflow: hidden;
  }
  .pt-glowline::after {
    content: ''; position: absolute; top: 0; bottom: 0; width: 4px;
    background: linear-gradient(180deg, transparent 0%, var(--gold) 30%, var(--gold-light) 50%, var(--emerald) 70%, transparent 100%);
    filter: blur(3px);
    animation: glowSweep .9s .15s ease-in-out forwards;
    left: -6px; opacity: 0;
  }
  @keyframes glowSweep {
    0%   { left: -6px; opacity: 0; }
    15%  { opacity: 1; }
    80%  { opacity: 1; }
    100% { left: 100.5%; opacity: 0; }
  }

  .pt-content {
    position: relative; z-index: 2;
    display: flex; flex-direction: column; align-items: center; gap: 1.2rem;
    animation: ptContentIn .4s .28s cubic-bezier(.34,1.56,.64,1) both;
  }
  @keyframes ptContentIn {
    from { opacity: 0; transform: scale(.75) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .pt-content.leaving { animation: ptContentOut .28s cubic-bezier(.55,0,.1,1) both; }
  @keyframes ptContentOut {
    from { opacity: 1; transform: scale(1); }
    to   { opacity: 0; transform: scale(1.18); }
  }

  /* Tri-ring spinner */
  .pt-spinner { width: 72px; height: 72px; position: relative; }
  .pt-ring {
    position: absolute; border-radius: 50%;
    border: 2.5px solid transparent;
  }
  .pt-ring-1 { inset: 0;    border-top-color: var(--gold);        border-right-color: rgba(212,168,67,.2); animation: spinCW 1.1s linear infinite; }
  .pt-ring-2 { inset: 11px; border-bottom-color: var(--emerald);  border-left-color:  rgba(0,184,148,.2);  animation: spinCCW .85s linear infinite; }
  .pt-ring-3 { inset: 22px; border-top-color: var(--amethyst-mid);                                         animation: spinCW 1.5s linear infinite; }
  .pt-core   { position: absolute; inset: 31px; border-radius: 50%; background: radial-gradient(circle, var(--gold), var(--gold-dark)); animation: ptCorePulse .9s ease-in-out infinite; }
  @keyframes spinCW   { to { transform: rotate(360deg); } }
  @keyframes spinCCW  { to { transform: rotate(-360deg); } }
  @keyframes ptCorePulse { 0%,100%{transform:scale(1);opacity:.9;box-shadow:0 0 10px rgba(212,168,67,.6)} 50%{transform:scale(1.35);opacity:1;box-shadow:0 0 22px rgba(212,168,67,.95)} }

  .pt-page-name {
    font-family: var(--display); font-size: .7rem; font-weight: 700;
    letter-spacing: .25em; text-transform: uppercase;
    color: rgba(255,255,255,.3);
    animation: labelPulse 1.4s ease-in-out infinite;
  }
  @keyframes labelPulse { 0%,100%{opacity:.3} 50%{opacity:.88} }

  .pt-progress { width: 160px; height: 1.5px; background: rgba(255,255,255,.06); border-radius: 2px; overflow: hidden; }
  .pt-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold-dark), var(--gold-light), var(--emerald));
    animation: ptProgressFill .8s cubic-bezier(.22,1,.36,1) forwards; width: 0;
  }
  @keyframes ptProgressFill { to { width: 100%; } }

  /* ══════════════════════════════════════
     SKELETON LOADERS
  ══════════════════════════════════════ */
  .skel {
    background: linear-gradient(90deg, var(--border) 25%, var(--cream) 50%, var(--border) 75%);
    background-size: 400% 100%; border-radius: var(--r-sm);
    animation: shimmer 1.6s ease-in-out infinite;
  }
  @keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:-100% 0} }
  .skeleton-wrap { padding: 2rem 2.5rem; max-width: 1200px; margin: 0 auto; animation: fadeIn .3s ease both; }

  /* ══════════════════════════════════════
     SHARED KEYFRAMES
  ══════════════════════════════════════ */
  @keyframes fadeUp    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes slideRight{ from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes scaleIn   { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
  @keyframes cardIn    { from{opacity:0;transform:translateY(36px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes breathe   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
  @keyframes heartbeat { 0%,100%{transform:scale(1)} 14%{transform:scale(1.3)} 28%{transform:scale(1)} 42%{transform:scale(1.2)} }
  @keyframes bellRing  { 0%,100%{transform:rotate(0)} 20%{transform:rotate(-12deg)} 40%{transform:rotate(10deg)} 60%{transform:rotate(-6deg)} 80%{transform:rotate(4deg)} }
  @keyframes toastIn   { from{opacity:0;transform:translateX(60px) scale(0.9)} to{opacity:1;transform:translateX(0) scale(1)} }
  @keyframes modalIn   { from{opacity:0;transform:scale(0.85) translateY(24px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes overlayIn { from{opacity:0} to{opacity:1} }
  @keyframes checkPop  { 0%{transform:scale(0) rotate(-45deg);opacity:0} 60%{transform:scale(1.3) rotate(5deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
  @keyframes shine     { 0%{left:-100%} 100%{left:220%} }
  @keyframes pulse     { 0%,100%{box-shadow:0 0 0 0 rgba(212,168,67,0.5)} 50%{box-shadow:0 0 0 12px rgba(212,168,67,0)} }
  @keyframes goldGlow  { 0%,100%{box-shadow:0 0 0 0 rgba(212,168,67,0.4)} 50%{box-shadow:0 0 24px rgba(212,168,67,0.6)} }
  @keyframes dotPulse  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0.5} }
  @keyframes navIn     { from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }
  @keyframes pageReveal{ from{opacity:0;transform:translateY(18px) scale(0.99);filter:blur(4px)} to{opacity:1;transform:translateY(0) scale(1);filter:blur(0)} }
  @keyframes confetti  { 0%{opacity:1;transform:translateY(0) rotate(0) scale(1)} 100%{opacity:0;transform:translateY(var(--cy)) translateX(var(--cx)) rotate(var(--cr)) scale(0.2)} }
  @keyframes numPop    { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
  @keyframes ringExpand{ 0%{transform:scale(0.3);opacity:0} 60%{transform:scale(1.2);opacity:1} 100%{transform:scale(1);opacity:1} }
  @keyframes successRing{ 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.2);opacity:0} }
  @keyframes scanLine  { 0%{top:5%} 100%{top:88%} }
  @keyframes orbFloat  { 0%{transform:translate(0,0)} 33%{transform:translate(16px,-12px)} 66%{transform:translate(-12px,8px)} 100%{transform:translate(0,0)} }
  @keyframes uploadPulse{ 0%,100%{box-shadow:0 0 0 0 rgba(212,168,67,0.4)} 50%{box-shadow:0 0 0 20px rgba(212,168,67,0)} }
  @keyframes stagger   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes priceIn   { from{opacity:0;transform:scale(0.82) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes bounce    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes goldSweep { 0%{transform:translateX(-130%) skewX(-18deg)} 100%{transform:translateX(260%) skewX(-18deg)} }
  @keyframes countPop  { 0%{opacity:0;transform:scale(0.5)} 60%{transform:scale(1.12)} 100%{opacity:1;transform:scale(1)} }

  .fade-in   { animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }
  .fade-in-1 { animation: fadeUp 0.55s 0.07s cubic-bezier(.22,1,.36,1) both; }
  .fade-in-2 { animation: fadeUp 0.55s 0.14s cubic-bezier(.22,1,.36,1) both; }
  .fade-in-3 { animation: fadeUp 0.55s 0.21s cubic-bezier(.22,1,.36,1) both; }
  .fade-in-4 { animation: fadeUp 0.55s 0.28s cubic-bezier(.22,1,.36,1) both; }
  .page-stage { animation: pageReveal 0.6s cubic-bezier(.22,1,.36,1) both; }

  /* ══════════════════════════════════════
     PREMIUM NAVBAR
  ══════════════════════════════════════ */
  .nav {
    position: sticky; top: 0; z-index: 300; height: 72px;
    background: rgba(6,4,18,0.88);
    backdrop-filter: blur(48px) saturate(200%);
    -webkit-backdrop-filter: blur(48px) saturate(200%);
    border-bottom: 1px solid rgba(212,168,67,0.12);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2.5rem; gap: 1rem;
    animation: navIn 0.7s cubic-bezier(.22,1,.36,1) both;
    transition: background 0.4s, box-shadow 0.4s, border-color 0.4s;
  }
  .nav.scrolled {
    background: rgba(3,2,10,0.97);
    border-color: rgba(212,168,67,0.2);
    box-shadow: 0 1px 0 rgba(212,168,67,0.08), 0 8px 40px rgba(0,0,0,0.5);
  }
  .nav-logo { display:flex; align-items:center; gap:12px; cursor:pointer; user-select:none; flex-shrink:0; }
  .logo-gem {
    width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, #1a1435 0%, #0d0a20 100%);
    border: 1.5px solid rgba(212,168,67,0.4);
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.4s cubic-bezier(.34,1.56,.64,1), border-color 0.3s;
    animation: goldGlow 3s ease-in-out infinite;
  }
  .logo-gem:hover { transform: scale(1.1) rotate(8deg); border-color: var(--gold); }
  .logo-gem::before { content:''; position:absolute; top:-50%; left:-100%; width:60%; height:200%; background:linear-gradient(90deg,transparent,rgba(212,168,67,0.3),transparent); transform:skewX(-20deg); transition:left .6s ease; }
  .logo-gem:hover::before { left: 180%; }
  .logo-gem-icon { font-size: 1.1rem; filter: drop-shadow(0 0 6px rgba(212,168,67,0.8)); position: relative; z-index: 1; }
  .logo-name { font-family: var(--serif); font-weight: 700; font-size: 1.15rem; color: #fff; letter-spacing: -0.01em; }
  .logo-name em { color: var(--gold-light); font-style: italic; }

  .nav-search-wrap { flex: 1; max-width: 280px; position: relative; }
  .nav-search-inner { display:flex; align-items:center; gap:0; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:100px; overflow:hidden; width:100%; transition:all .3s; }
  .nav-search-inner:focus-within { border-color:rgba(212,168,67,0.5); background:rgba(255,255,255,0.08); box-shadow:0 0 0 3px rgba(212,168,67,0.1); }
  .nav-search-icon { padding:0 10px; color:rgba(255,255,255,0.25); font-size:12px; }
  .nav-search-input { background:none; border:none; outline:none; color:#fff; font-family:var(--sans); font-size:.82rem; padding:.52rem .5rem .52rem 0; width:100%; }
  .nav-search-input::placeholder { color:rgba(255,255,255,0.2); }
  .nav-search-kbd { flex-shrink:0; margin-right:8px; font-size:.62rem; padding:2px 6px; background:rgba(212,168,67,0.1); border:1px solid rgba(212,168,67,0.2); border-radius:4px; color:rgba(212,168,67,0.6); font-family:var(--display); }

  .nav-center { display: flex; gap: 2px; }
  .nav-item { background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.38); font-family:var(--sans); font-size:.84rem; font-weight:500; padding:.44rem 1rem; border-radius:10px; transition:color .25s, background .25s; position:relative; overflow:hidden; }
  .nav-item::after { content:''; position:absolute; bottom:4px; left:50%; transform:translateX(-50%); width:0; height:2px; border-radius:2px; background:linear-gradient(90deg,var(--gold-dark),var(--gold-light)); transition:width .3s cubic-bezier(.22,1,.36,1); }
  .nav-item:hover { color:rgba(255,255,255,0.85); background:rgba(255,255,255,0.05); }
  .nav-item:hover::after, .nav-item.active::after { width: 55%; }
  .nav-item.active { color: #fff; }

  .nav-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; margin-left: auto; }
  .nav-bell { position:relative; width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; cursor:pointer; color:rgba(255,255,255,0.35); font-size:16px; transition:all .3s cubic-bezier(.34,1.56,.64,1); }
  .nav-bell:hover { background:rgba(212,168,67,0.15); border-color:rgba(212,168,67,0.4); color:var(--gold-light); transform:scale(1.05); animation:bellRing .5s ease; }
  .bell-dot { position:absolute; top:7px; right:7px; width:7px; height:7px; border-radius:50%; background:var(--crimson); border:1.5px solid rgba(6,4,18,0.9); animation:dotPulse 2s ease-in-out infinite; }
  .notif-dropdown { position:absolute; top:calc(100% + 14px); right:0; width:330px; background:#12101e; border:1px solid rgba(212,168,67,0.15); border-radius:var(--r-lg); overflow:hidden; box-shadow:0 24px 64px rgba(0,0,0,0.5); animation:scaleIn .3s cubic-bezier(.34,1.56,.64,1) both; z-index:99; }
  .notif-header { padding:1rem 1.3rem .8rem; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; }
  .notif-title { font-family:var(--display); font-size:.88rem; font-weight:700; color:#fff; }
  .notif-clear { font-size:.71rem; color:var(--gold-light); cursor:pointer; background:none; border:none; font-family:var(--sans); }
  .notif-item { display:flex; gap:.75rem; padding:.9rem 1.3rem; border-bottom:1px solid rgba(255,255,255,0.04); cursor:pointer; transition:background .2s; }
  .notif-item:hover { background:rgba(255,255,255,0.04); }
  .notif-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:5px; }
  .notif-text { font-size:.78rem; color:rgba(255,255,255,0.6); line-height:1.55; flex:1; }
  .notif-time { font-size:.67rem; color:rgba(255,255,255,0.22); margin-top:3px; display:block; }
  .notif-footer { padding:.75rem; text-align:center; }
  .notif-footer-btn { font-size:.77rem; color:var(--gold-light); cursor:pointer; background:none; border:none; font-family:var(--sans); }

  .saved-pill { display:flex; align-items:center; gap:7px; background:rgba(212,168,67,0.08); border:1px solid rgba(212,168,67,0.2); border-radius:100px; padding:5px 12px 5px 7px; cursor:pointer; transition:all .3s cubic-bezier(.22,1,.36,1); font-size:.78rem; color:rgba(255,255,255,0.45); font-family:var(--sans); }
  .saved-pill:hover { background:rgba(212,168,67,0.18); border-color:rgba(212,168,67,0.5); color:#fff; transform:scale(1.03); }
  .saved-count { min-width:20px; height:20px; border-radius:10px; background:linear-gradient(135deg,var(--gold-dark),var(--gold)); color:#1a0e00; font-size:.66rem; font-weight:800; display:flex; align-items:center; justify-content:center; animation:heartbeat 2s ease-in-out infinite; }
  .nav-plans-btn { background:linear-gradient(135deg,rgba(212,168,67,0.12),rgba(212,168,67,0.06)); border:1px solid rgba(212,168,67,0.35); color:var(--gold); font-family:var(--sans); font-size:.78rem; font-weight:700; padding:.44rem .9rem; border-radius:100px; cursor:pointer; transition:all .3s cubic-bezier(.34,1.56,.64,1); letter-spacing:.02em; }
  .nav-plans-btn:hover { background:rgba(212,168,67,0.22); border-color:var(--gold); transform:scale(1.04); box-shadow:0 4px 20px rgba(212,168,67,0.3); }
  .nav-cta { background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold-light)); color:#1a0e00; border:none; padding:.5rem 1.3rem; font-family:var(--display); font-size:.8rem; font-weight:700; border-radius:100px; cursor:pointer; box-shadow:0 4px 20px rgba(212,168,67,0.4); transition:all .3s cubic-bezier(.34,1.56,.64,1); letter-spacing:.04em; position:relative; overflow:hidden; }
  .nav-cta::before { content:''; position:absolute; top:-50%; left:-100%; width:60%; height:200%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent); transform:skewX(-20deg); transition:left .6s ease; }
  .nav-cta:hover { transform:translateY(-2px) scale(1.04); box-shadow:0 8px 32px rgba(212,168,67,0.55); }
  .nav-cta:hover::before { left: 180%; }
  .nav-mobile-toggle { display:none; background:none; border:none; color:rgba(255,255,255,0.7); font-size:22px; cursor:pointer; padding:4px; line-height:1; }
  .nav-mobile-menu { display:none; position:fixed; inset:0; top:72px; z-index:299; background:rgba(6,4,18,0.98); backdrop-filter:blur(24px); flex-direction:column; padding:1.5rem; gap:.35rem; border-top:1px solid rgba(212,168,67,0.1); overflow-y:auto; }
  .nav-mobile-menu.open { display: flex; }
  .nav-mobile-item { background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.5); font-family:var(--sans); font-size:1rem; font-weight:500; padding:.9rem 1rem; border-radius:12px; text-align:left; transition:all .2s; }
  .nav-mobile-item:hover, .nav-mobile-item.active { background:rgba(212,168,67,0.1); color:var(--gold-light); }
  .nav-mobile-divider { height:1px; background:rgba(255,255,255,0.06); margin:.5rem 0; }
  .nav-mobile-cta { background:linear-gradient(135deg,var(--gold-dark),var(--gold)); color:#1a0e00; border:none; padding:.9rem; font-family:var(--display); font-size:.9rem; font-weight:700; border-radius:var(--r-md); cursor:pointer; text-align:center; }
  .nav-mobile-plans { background:rgba(212,168,67,0.08); border:1px solid rgba(212,168,67,0.25); color:var(--gold); font-family:var(--sans); font-size:.88rem; font-weight:700; padding:.78rem; border-radius:var(--r-md); cursor:pointer; text-align:center; }

  /* ══════════════════════════════════════
     HERO
  ══════════════════════════════════════ */
  .hero { position:relative; overflow:hidden; background:var(--midnight); padding:7rem 2.5rem 6rem; min-height:85vh; display:flex; align-items:center; }
  .hero-bg-mesh { position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse 75% 70% at 65% -10%,rgba(212,168,67,0.18) 0%,transparent 55%),radial-gradient(ellipse 55% 65% at -5% 90%,rgba(0,184,148,0.1) 0%,transparent 50%),radial-gradient(ellipse 45% 50% at 100% 60%,rgba(124,58,237,0.1) 0%,transparent 50%),radial-gradient(ellipse 35% 40% at 50% 110%,rgba(212,168,67,0.12) 0%,transparent 55%); }
  .hero-grid { position:absolute; inset:0; pointer-events:none; background-image:linear-gradient(rgba(212,168,67,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,67,0.04) 1px,transparent 1px); background-size:70px 70px; mask-image:radial-gradient(ellipse at center,black 20%,transparent 75%); }
  .hero-lines { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
  .hero-line { position:absolute; height:1px; opacity:.06; background:linear-gradient(90deg,transparent,var(--gold),transparent); animation:lineSlide 8s ease-in-out infinite; }
  .hero-line:nth-child(1){width:60%;top:25%;left:-10%;animation-delay:0s}
  .hero-line:nth-child(2){width:40%;top:55%;right:-5%;animation-delay:-3s}
  .hero-line:nth-child(3){width:50%;top:75%;left:20%;animation-delay:-5s}
  @keyframes lineSlide{0%,100%{opacity:.04;transform:translateX(0)}50%{opacity:.1;transform:translateX(20px)}}
  .hero-inner { max-width:880px; margin:0 auto; position:relative; width:100%; }
  .hero-eyebrow { display:inline-flex; align-items:center; gap:10px; background:rgba(212,168,67,0.1); border:1px solid rgba(212,168,67,0.25); border-radius:100px; padding:7px 18px 7px 10px; margin-bottom:2rem; animation:fadeUp .7s .1s cubic-bezier(.22,1,.36,1) both; backdrop-filter:blur(8px); }
  .hero-dot { width:8px; height:8px; border-radius:50%; background:var(--emerald); box-shadow:0 0 10px var(--emerald); animation:breathe 2.5s ease-in-out infinite; }
  .hero-eyebrow span { font-size:.73rem; font-weight:600; color:rgba(255,255,255,0.72); letter-spacing:.08em; text-transform:uppercase; font-family:var(--display); }
  .hero h1 { font-family:var(--serif); font-size:clamp(3.2rem,6.5vw,5.8rem); font-weight:700; line-height:1.04; color:#fff; margin-bottom:1.5rem; letter-spacing:-.025em; animation:fadeUp .7s .18s cubic-bezier(.22,1,.36,1) both; }
  .hero h1 .gold-text { background:linear-gradient(100deg,var(--gold-light),var(--gold),var(--rose-gold)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .hero h1 .emerald-text { background:linear-gradient(100deg,var(--emerald),#00d4a8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .hero-sub { font-size:1.05rem; color:rgba(255,255,255,0.4); max-width:500px; line-height:1.85; margin-bottom:2.8rem; animation:fadeUp .7s .26s cubic-bezier(.22,1,.36,1) both; font-weight:300; }
  .search-container { animation: fadeUp .7s .34s cubic-bezier(.22,1,.36,1) both; }
  .search-glass { display:flex; align-items:center; background:rgba(255,255,255,0.05); border:1px solid rgba(212,168,67,0.18); border-radius:var(--r-2xl); padding:7px; max-width:680px; backdrop-filter:blur(20px); transition:border-color .3s, box-shadow .3s; }
  .search-glass:focus-within { border-color:rgba(212,168,67,0.55); box-shadow:0 0 0 4px rgba(212,168,67,0.1), 0 8px 40px rgba(212,168,67,0.15); }
  .search-icon { padding:0 1rem; font-size:1rem; opacity:.3; flex-shrink:0; }
  .search-glass input { flex:1; background:none; border:none; outline:none; color:#fff; font-family:var(--sans); font-size:.94rem; padding:.75rem 0; }
  .search-glass input::placeholder { color:rgba(255,255,255,0.2); }
  .search-div { width:1px; height:28px; background:rgba(255,255,255,0.08); flex-shrink:0; }
  .search-glass select { background:none; border:none; outline:none; color:rgba(255,255,255,0.4); font-family:var(--sans); font-size:.85rem; padding:.75rem 1rem; cursor:pointer; min-width:140px; }
  .search-glass select option { background:#1a1435; color:#fff; }
  .search-btn { background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold-light)); color:#1a0e00; border:none; padding:.78rem 1.8rem; font-family:var(--display); font-size:.84rem; font-weight:700; border-radius:100px; cursor:pointer; white-space:nowrap; box-shadow:0 4px 24px rgba(212,168,67,0.45); transition:all .3s cubic-bezier(.34,1.56,.64,1); letter-spacing:.04em; position:relative; overflow:hidden; }
  .search-btn::before { content:''; position:absolute; top:-50%; left:-100%; width:55%; height:200%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent); transform:skewX(-20deg); transition:left .5s ease; }
  .search-btn:hover { transform:scale(1.04); box-shadow:0 8px 36px rgba(212,168,67,0.6); }
  .search-btn:hover::before { left: 180%; }
  .hero-stats { display:flex; gap:4rem; margin-top:3rem; padding-top:2.2rem; border-top:1px solid rgba(255,255,255,0.06); animation:fadeUp .7s .45s cubic-bezier(.22,1,.36,1) both; }
  .hstat-num { font-family:var(--serif); font-size:2.4rem; font-weight:700; color:var(--gold-light); line-height:1; margin-bottom:4px; font-style:italic; }
  .hstat-label { font-size:.71rem; color:rgba(255,255,255,0.25); text-transform:uppercase; letter-spacing:.1em; font-weight:500; font-family:var(--display); }
  .hero-cards { position:absolute; right:2rem; top:50%; transform:translateY(-48%); display:flex; flex-direction:column; gap:16px; pointer-events:none; }
  @media(max-width:1000px){.hero-cards{display:none}}
  .float-card { background:rgba(255,255,255,0.05); border:1px solid rgba(212,168,67,0.15); border-radius:18px; padding:14px 18px; backdrop-filter:blur(16px); display:flex; align-items:center; gap:12px; width:250px; animation:floatY 5.5s ease-in-out infinite; transition:border-color .3s; }
  .float-card:nth-child(1){animation-delay:0s}
  .float-card:nth-child(2){animation-delay:-2s;margin-left:32px}
  .float-card:nth-child(3){animation-delay:-3.8s}
  .float-card:hover{border-color:rgba(212,168,67,0.4)}
  .fc-title { font-size:.82rem; font-weight:700; color:#fff; margin-bottom:2px; font-family:var(--display); }
  .fc-sub { font-size:.71rem; color:rgba(255,255,255,0.4); }
  .fc-badge { margin-left:auto; flex-shrink:0; width:8px; height:8px; border-radius:50%; background:var(--emerald); box-shadow:0 0 8px var(--emerald); animation:breathe 2s ease-in-out infinite; }

  /* ══════════════════════════════════════
     SECTION
  ══════════════════════════════════════ */
  .section { padding:5.5rem 2.5rem; max-width:1200px; margin:0 auto; width:100%; }
  .sec-head { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:2.5rem; }
  .sec-title { font-family:var(--serif); font-size:2.1rem; font-weight:700; letter-spacing:-.025em; }
  .sec-title em { font-style:italic; color:var(--gold-dark); }
  .sec-sub { font-size:.84rem; color:var(--silver); margin-top:.3rem; }
  .sec-link { font-size:.82rem; color:var(--gold-dark); font-weight:600; background:var(--gold-pale); border:1px solid rgba(212,168,67,0.25); border-radius:100px; padding:.44rem .95rem; cursor:pointer; font-family:var(--sans); transition:all .3s cubic-bezier(.22,1,.36,1); }
  .sec-link:hover { background:rgba(212,168,67,0.15); border-color:var(--gold); transform:translateX(3px); }
  .divider { border:none; border-top:1px solid var(--border); }

  /* ══════════════════════════════════════
     CATEGORY GRID
  ══════════════════════════════════════ */
  .cat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(135px,1fr)); gap:1rem; }
  .cat-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); padding:1.6rem .85rem; text-align:center; cursor:pointer; transition:all .38s cubic-bezier(.22,1,.36,1); position:relative; overflow:hidden; }
  .cat-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,var(--gold-pale),transparent 65%); opacity:0; transition:opacity .3s; }
  .cat-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2.5px; background:linear-gradient(90deg,var(--gold-dark),var(--gold-light)); transform:scaleX(0); transform-origin:left; transition:transform .38s cubic-bezier(.22,1,.36,1); }
  .cat-card:hover { border-color:rgba(212,168,67,0.4); transform:translateY(-7px) scale(1.03); box-shadow:0 16px 40px rgba(212,168,67,0.12); }
  .cat-card:hover::before { opacity:1; }
  .cat-card:hover::after { transform:scaleX(1); }
  .cat-icon { font-size:1.9rem; margin-bottom:.65rem; display:block; transition:transform .35s cubic-bezier(.34,1.56,.64,1); }
  .cat-card:hover .cat-icon { transform:scale(1.25) rotate(10deg); }
  .cat-label { font-size:.8rem; font-weight:700; color:var(--ink); letter-spacing:-.01em; font-family:var(--display); }
  .cat-count { font-size:.7rem; color:var(--silver); margin-top:.2rem; }

  /* ══════════════════════════════════════
     JOB CARDS
  ══════════════════════════════════════ */
  .jobs-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:1.2rem; }
  .job-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:1.75rem; cursor:pointer; position:relative; overflow:hidden; transition:all .45s cubic-bezier(.22,1,.36,1); animation:cardIn .7s cubic-bezier(.22,1,.36,1) both; }
  .job-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--gold-dark),var(--gold-light)); transform:scaleX(0); transform-origin:left; transition:transform .55s cubic-bezier(.22,1,.36,1); }
  .job-card:hover { border-color:rgba(212,168,67,0.3); transform:translateY(-10px) scale(1.016); box-shadow:0 28px 60px rgba(212,168,67,0.1); }
  .job-card:hover::before { transform:scaleX(1); }
  .job-card.premium-card { background:radial-gradient(circle at top right,rgba(212,168,67,0.08),transparent 40%),linear-gradient(180deg,#fffdf7 0%,#fefbf0 100%); border-color:rgba(212,168,67,0.3); box-shadow:0 8px 32px rgba(212,168,67,0.08); animation:cardIn .7s cubic-bezier(.22,1,.36,1) both, goldGlow 5s ease-in-out infinite; }
  .job-card.premium-card:hover { transform:translateY(-13px) scale(1.02); box-shadow:0 36px 80px rgba(212,168,67,0.18); }
  .job-card.premium-card::after { content:''; position:absolute; top:-40%; left:-20%; width:45%; height:190%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent); opacity:0; pointer-events:none; }
  .job-card.premium-card:hover::after { opacity:1; animation:goldSweep 1s ease; }
  .premium-kicker { display:inline-flex; align-items:center; gap:8px; padding:5px 12px; border-radius:100px; background:linear-gradient(135deg,rgba(212,168,67,0.12),rgba(212,168,67,0.06)); border:1px solid rgba(212,168,67,0.25); font-size:.68rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--gold-dark); margin-bottom:.9rem; animation:pulse 2.5s ease-in-out infinite; }
  .pk-dot { width:7px; height:7px; border-radius:50%; background:var(--emerald); animation:breathe 2s ease-in-out infinite; }
  .jc-top { display:flex; justify-content:space-between; margin-bottom:1.1rem; }
  .jc-logo-row { display:flex; align-items:flex-start; gap:1rem; }
  .job-title { font-family:var(--display); font-size:1rem; font-weight:700; margin-bottom:.22rem; letter-spacing:-.01em; }
  .job-co { font-size:.78rem; color:var(--silver); font-weight:400; }
  .bk-btn { width:34px; height:34px; border-radius:10px; flex-shrink:0; background:none; border:1px solid var(--border); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:16px; color:var(--silver); transition:all .3s cubic-bezier(.34,1.56,.64,1); }
  .bk-btn:hover, .bk-btn.saved { background:var(--gold-pale); border-color:rgba(212,168,67,0.4); color:var(--gold-dark); transform:scale(1.1); }
  .bk-btn.saved { animation:heartbeat .8s ease; }
  .job-tags { display:flex; flex-wrap:wrap; gap:.4rem; margin-bottom:1.1rem; }
  .tag { font-size:.69rem; font-weight:600; padding:.28rem .72rem; border-radius:100px; letter-spacing:.03em; }
  .t-full   { background:var(--emerald-pale); color:var(--emerald-dark); }
  .t-remote { background:var(--amethyst-pale); color:var(--amethyst); }
  .t-level  { background:var(--cream); color:#5a5870; }
  .t-gold   { background:linear-gradient(135deg,var(--gold-dark),var(--gold)); color:#fff; }
  .jc-foot { display:flex; align-items:center; justify-content:space-between; padding-top:1rem; border-top:1px solid var(--border); }
  .j-salary { font-family:var(--display); font-weight:700; font-size:.96rem; color:var(--gold-dark); }
  .j-date { font-size:.72rem; color:var(--silver); }

  /* ══════════════════════════════════════
     COMPANY CARDS
  ══════════════════════════════════════ */
  .co-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:1.2rem; }
  .co-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; cursor:pointer; transition:all .38s cubic-bezier(.22,1,.36,1); animation:cardIn .6s cubic-bezier(.22,1,.36,1) both; }
  .co-card:hover { border-color:rgba(212,168,67,0.3); transform:translateY(-8px); box-shadow:0 24px 56px rgba(212,168,67,0.1); }
  .co-banner { height:118px; position:relative; overflow:hidden; }
  .co-banner-bg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform .4s ease; }
  .co-card:hover .co-banner-bg { transform:scale(1.05); }
  .co-banner-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.3); }
  .co-body { padding:1.25rem; }
  .co-header { display:flex; align-items:center; gap:1rem; margin-bottom:.9rem; }
  .co-mini-logo { width:48px; height:48px; border-radius:12px; background:var(--surface); border:2px solid var(--surface); display:flex; align-items:center; justify-content:center; font-family:var(--display); font-weight:800; font-size:.95rem; flex-shrink:0; margin-top:-32px; position:relative; z-index:1; box-shadow:0 4px 20px rgba(0,0,0,0.12); overflow:hidden; }
  .co-name { font-family:var(--display); font-size:1rem; font-weight:700; letter-spacing:-.01em; }
  .co-ind { font-size:.75rem; color:var(--silver); }
  .co-desc { font-size:.82rem; line-height:1.7; color:#5a5870; margin-bottom:1rem; }
  .co-foot { display:flex; justify-content:space-between; align-items:center; padding-top:.8rem; border-top:1px solid var(--border); }
  .roles-badge { background:linear-gradient(135deg,var(--gold-dark),var(--gold)); color:#fff; font-size:.71rem; font-weight:700; padding:.25rem .72rem; border-radius:100px; }
  .co-size { font-size:.74rem; color:var(--silver); }

  /* ══════════════════════════════════════
     LISTINGS SIDEBAR + CARDS
  ══════════════════════════════════════ */
  .listings-wrap { display:flex; gap:1.8rem; max-width:1220px; margin:0 auto; padding:2rem 2.5rem; width:100%; }
  .sidebar { width:258px; flex-shrink:0; background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:1.7rem; height:fit-content; position:sticky; top:90px; animation:slideRight .5s cubic-bezier(.22,1,.36,1) both; }
  .sf-title { font-family:var(--display); font-size:1rem; font-weight:700; margin-bottom:1.6rem; }
  .fg { margin-bottom:1.5rem; }
  .fg > label { display:block; font-size:.71rem; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:var(--silver); margin-bottom:.7rem; font-family:var(--display); }
  .fopt { display:flex; align-items:center; gap:.6rem; margin-bottom:.45rem; cursor:pointer; }
  .fopt input[type=checkbox] { accent-color:var(--gold-dark); width:14px; height:14px; cursor:pointer; }
  .fopt span { font-size:.83rem; }
  .range-val { font-size:.82rem; color:var(--gold-dark); font-weight:700; margin-top:.4rem; }
  input[type=range] { width:100%; accent-color:var(--gold-dark); cursor:pointer; }
  .reset-btn { width:100%; padding:.6rem; background:none; border:1px solid var(--border); font-family:var(--sans); font-size:.78rem; font-weight:600; border-radius:var(--r-sm); cursor:pointer; transition:all .3s cubic-bezier(.22,1,.36,1); color:var(--silver); }
  .reset-btn:hover { border-color:var(--gold); color:var(--gold-dark); background:var(--gold-pale); }
  .listings-main { flex:1; min-width:0; }
  .list-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.3rem; }
  .list-count { font-size:.85rem; color:var(--silver); }
  .list-count strong { color:var(--ink); }
  .sort-sel { border:1px solid var(--border); background:var(--surface); padding:.42rem .88rem; font-family:var(--sans); font-size:.8rem; border-radius:var(--r-sm); cursor:pointer; outline:none; color:var(--ink); }
  .list-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); padding:1.2rem 1.5rem; cursor:pointer; transition:all .3s cubic-bezier(.22,1,.36,1); margin-bottom:.8rem; display:flex; align-items:center; gap:1.2rem; position:relative; animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both; }
  .list-card:hover { border-color:rgba(212,168,67,0.3); box-shadow:0 10px 32px rgba(212,168,67,0.08); transform:translateX(5px); }
  .list-info { flex:1; min-width:0; }
  .list-meta { display:flex; align-items:center; gap:.6rem; margin-top:.3rem; flex-wrap:wrap; }
  .list-meta span { font-size:.78rem; color:var(--silver); }
  .list-right { text-align:right; flex-shrink:0; }

  /* ══════════════════════════════════════
     JOB DETAIL
  ══════════════════════════════════════ */
  .detail-wrap { max-width:1110px; margin:0 auto; padding:2rem 2.5rem; display:flex; gap:2rem; }
  .detail-main { flex:1; min-width:0; }
  .detail-side { width:288px; flex-shrink:0; }
  .detail-hdr { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:2.2rem; margin-bottom:1.2rem; position:relative; overflow:hidden; }
  .detail-hdr::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--gold-dark),var(--gold-light)); }
  .d-logo-row { display:flex; align-items:center; gap:1.2rem; margin-bottom:1.5rem; }
  .d-h1 { font-family:var(--serif); font-size:1.85rem; font-weight:700; margin-bottom:.35rem; line-height:1.2; }
  .d-coname { font-size:.9rem; color:var(--gold-dark); cursor:pointer; font-weight:500; transition:color .2s; }
  .d-coname:hover { color:var(--gold); text-decoration:underline; }
  .d-facts { display:flex; flex-wrap:wrap; gap:.6rem; margin-top:1.3rem; padding-top:1.3rem; border-top:1px solid var(--border); }
  .fact { display:flex; align-items:center; gap:.4rem; font-size:.79rem; background:var(--cream); padding:.32rem .8rem; border-radius:100px; transition:all .2s; cursor:default; }
  .fact:hover { background:var(--gold-pale); color:var(--gold-dark); }
  .dsec { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:1.8rem; margin-bottom:1.1rem; }
  .dsec h3 { font-family:var(--serif); font-size:1.15rem; font-weight:700; margin-bottom:1rem; }
  .dsec p { font-size:.875rem; line-height:1.88; color:#4a4862; margin-bottom:.8rem; }
  .req-list { list-style:none; }
  .req-list li { padding:.4rem 0 .4rem 1.4rem; position:relative; font-size:.875rem; line-height:1.65; }
  .req-list li::before { content:'▸'; position:absolute; left:0; color:var(--gold-dark); font-size:.7rem; top:.52rem; }
  .sticky-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:1.75rem; position:sticky; top:90px; }
  .sc-label { font-size:.71rem; color:var(--silver); text-transform:uppercase; letter-spacing:.1em; font-family:var(--display); }
  .sc-salary { font-family:var(--serif); font-size:1.65rem; margin:.28rem 0 1.2rem; color:var(--gold-dark); font-weight:700; }
  .apply-btn { width:100%; background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold-light)); color:#1a0e00; border:none; padding:.95rem; font-family:var(--display); font-size:.88rem; font-weight:700; border-radius:var(--r-sm); cursor:pointer; box-shadow:0 6px 28px rgba(212,168,67,0.35); transition:all .3s cubic-bezier(.34,1.56,.64,1); letter-spacing:.04em; position:relative; overflow:hidden; }
  .apply-btn:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 12px 40px rgba(212,168,67,0.5); }
  .save-btn { width:100%; margin-top:.7rem; background:none; border:1px solid var(--border); padding:.8rem; font-family:var(--sans); font-size:.85rem; font-weight:600; border-radius:var(--r-sm); cursor:pointer; transition:all .3s; color:var(--ink); }
  .save-btn:hover { border-color:var(--gold); color:var(--gold-dark); background:var(--gold-pale); }
  .sc-deadline { font-size:.73rem; color:var(--silver); text-align:center; margin-top:.8rem; }
  .sc-meta { font-size:.77rem; color:var(--silver); line-height:2.2; margin-top:1rem; padding-top:1rem; border-top:1px solid var(--border); }

  /* ══════════════════════════════════════
     RESUME PAGE
  ══════════════════════════════════════ */
  .resume-wrap { max-width:700px; margin:0 auto; padding:3.5rem 2.5rem; animation:pageReveal .6s cubic-bezier(.22,1,.36,1) both; }
  .pg-h2 { font-family:var(--serif); font-size:2.5rem; font-weight:700; letter-spacing:-.025em; margin-bottom:.45rem; }
  .pg-sub { color:var(--silver); font-size:.88rem; margin-bottom:2.5rem; line-height:1.7; font-weight:300; }
  .upload-stage { position:relative; border-radius:var(--r-2xl); overflow:hidden; margin-bottom:1.5rem; background:#06040f; border:1.5px dashed rgba(212,168,67,0.3); cursor:pointer; transition:all .4s cubic-bezier(.22,1,.36,1); min-height:290px; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .upload-stage:hover { border-color:rgba(212,168,67,0.7); box-shadow:0 0 0 4px rgba(212,168,67,0.08), 0 16px 48px rgba(212,168,67,0.15); }
  .upload-stage.drag { border-color:var(--emerald); box-shadow:0 0 0 4px rgba(0,184,148,0.15), 0 16px 48px rgba(0,184,148,0.2); animation:uploadPulse 1s ease-in-out infinite; }
  .up-mesh { position:absolute; inset:0; background:radial-gradient(ellipse 70% 70% at 50% 30%,rgba(212,168,67,0.14) 0%,transparent 65%); pointer-events:none; }
  .up-orb { position:absolute; border-radius:50%; pointer-events:none; }
  .up-orb-1 { width:130px; height:130px; background:rgba(212,168,67,0.08); top:-25px; right:-25px; animation:orbFloat 9s ease-in-out infinite; }
  .up-orb-2 { width:90px; height:90px; background:rgba(0,184,148,0.07); bottom:-15px; left:-15px; animation:orbFloat 7s ease-in-out infinite reverse; }
  .up-grid { position:absolute; inset:0; pointer-events:none; background-image:linear-gradient(rgba(212,168,67,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,67,0.03) 1px,transparent 1px); background-size:44px 44px; }
  .up-scan-line { position:absolute; left:0; right:0; height:1px; pointer-events:none; background:linear-gradient(90deg,transparent,var(--gold-light),transparent); box-shadow:0 0 10px var(--gold); animation:scanLine 3s ease-in-out infinite; opacity:.5; }
  .up-content { position:relative; z-index:2; text-align:center; padding:3.5rem 2rem; }
  .up-icon-ring { width:96px; height:96px; border-radius:50%; border:2px dashed rgba(212,168,67,0.35); display:flex; align-items:center; justify-content:center; background:rgba(212,168,67,0.07); transition:all .4s cubic-bezier(.34,1.56,.64,1); animation:goldGlow 3.5s ease-in-out infinite; margin:0 auto 1.5rem; }
  .upload-stage:hover .up-icon-ring { border-color:rgba(212,168,67,0.8); background:rgba(212,168,67,0.12); transform:scale(1.1); }
  .up-icon-inner { font-size:2.4rem; transition:transform .3s; }
  .upload-stage:hover .up-icon-inner { transform:translateY(-5px) scale(1.1); }
  .up-title { font-family:var(--serif); font-size:1.4rem; color:#fff; margin-bottom:.5rem; font-weight:700; }
  .up-hint { font-size:.82rem; color:rgba(255,255,255,0.32); margin-bottom:1.2rem; }
  .up-formats { display:flex; gap:.5rem; justify-content:center; flex-wrap:wrap; }
  .up-fmt { background:rgba(212,168,67,0.1); border:1px solid rgba(212,168,67,0.18); border-radius:7px; padding:4px 10px; font-size:.68rem; font-weight:700; color:rgba(212,168,67,0.6); letter-spacing:.05em; font-family:var(--display); }
  .upload-progress { background:#06040f; border-radius:var(--r-2xl); border:1px solid rgba(212,168,67,0.2); padding:2rem; margin-bottom:1.5rem; animation:fadeUp .5s both; }
  .up-prog-bar { height:6px; background:rgba(255,255,255,0.07); border-radius:4px; overflow:hidden; margin-bottom:.65rem; }
  .up-prog-fill { height:100%; border-radius:4px; background:linear-gradient(90deg,var(--gold-dark),var(--gold-light),var(--emerald)); background-size:200% 100%; transition:width .35s ease; animation:shimmer 1.5s linear infinite; }
  .up-stages { display:flex; gap:.5rem; margin-top:1rem; flex-wrap:wrap; }
  .up-stage-pill { display:flex; align-items:center; gap:5px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:100px; padding:4px 10px; font-size:.69rem; color:rgba(255,255,255,0.25); transition:all .4s; }
  .up-stage-pill.active { background:rgba(212,168,67,0.15); border-color:rgba(212,168,67,0.35); color:var(--gold-light); }
  .up-stage-pill.done { background:rgba(0,184,148,0.1); border-color:rgba(0,184,148,0.3); color:var(--emerald); }
  .up-stage-dot { width:6px; height:6px; border-radius:50%; background:currentColor; }
  .up-stage-pill.active .up-stage-dot { animation:dotPulse 1s ease-in-out infinite; }
  .upload-success { background:#06040f; border-radius:var(--r-2xl); border:1px solid rgba(0,184,148,0.25); padding:2rem; text-align:center; margin-bottom:1.5rem; animation:fadeUp .5s both; }
  .up-success-icon { width:76px; height:76px; border-radius:50%; background:linear-gradient(135deg,rgba(0,184,148,0.2),rgba(212,168,67,0.2)); display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; font-size:2.2rem; animation:checkPop .7s cubic-bezier(.34,1.56,.64,1) both; }
  .up-success-title { font-family:var(--serif); font-size:1.35rem; color:#fff; margin-bottom:.4rem; font-weight:700; }
  .up-success-sub { font-size:.82rem; color:rgba(255,255,255,0.38); margin-bottom:1.1rem; }
  .up-chips { display:flex; gap:.5rem; justify-content:center; flex-wrap:wrap; }
  .up-chip { display:flex; align-items:center; gap:5px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:100px; padding:5px 12px; font-size:.71rem; color:rgba(255,255,255,0.45); }
  .up-chip-green { background:rgba(0,184,148,0.1); border-color:rgba(0,184,148,0.25); color:var(--emerald); }
  .up-chip-gold { background:rgba(212,168,67,0.1); border-color:rgba(212,168,67,0.25); color:var(--gold-light); }
  .resume-form { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:2rem; margin-top:1.6rem; }
  .rf-title { font-family:var(--serif); font-size:1.15rem; font-weight:700; margin-bottom:1.6rem; }
  .fgrid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem; }
  .fg2 { display:flex; flex-direction:column; gap:.44rem; }
  .fg2 label { font-size:.7rem; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:var(--silver); font-family:var(--display); }
  .fg2 input, .fg2 select, .fg2 textarea { border:1px solid var(--border); border-radius:var(--r-sm); padding:.68rem .9rem; font-family:var(--sans); font-size:.86rem; outline:none; transition:border .25s, box-shadow .25s; background:var(--paper); color:var(--ink); }
  .fg2 input:focus, .fg2 select:focus, .fg2 textarea:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(212,168,67,0.1); }
  .fg2 textarea { resize:vertical; min-height:84px; }
  .fcol2 { grid-column:1/-1; }
  .sub-btn { width:100%; background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold-light)); color:#1a0e00; border:none; padding:.95rem; font-family:var(--display); font-size:.88rem; font-weight:700; border-radius:var(--r-sm); cursor:pointer; transition:all .3s; margin-top:.5rem; letter-spacing:.04em; }
  .sub-btn:hover { box-shadow:0 10px 32px rgba(212,168,67,0.4); transform:translateY(-1px); }

  /* ══════════════════════════════════════
     CONTACT PAGE
  ══════════════════════════════════════ */
  .contact-wrap { max-width:680px; margin:0 auto; padding:3.5rem 2.5rem; animation:pageReveal .6s both; }
  .ctabs { display:flex; border-bottom:1px solid var(--border); margin-bottom:2rem; }
  .ctab { background:none; border:none; padding:.7rem 1.5rem; font-family:var(--sans); font-size:.85rem; font-weight:500; cursor:pointer; color:var(--silver); border-bottom:2px solid transparent; margin-bottom:-1px; transition:all .25s; }
  .ctab.active { color:var(--gold-dark); border-bottom-color:var(--gold-dark); }
  .contact-box { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:2.2rem; }
  .cb-h3 { font-family:var(--serif); font-size:1.2rem; font-weight:700; margin-bottom:.44rem; }
  .cb-desc { font-size:.83rem; color:var(--silver); margin-bottom:1.6rem; }

  /* ══════════════════════════════════════
     SAVED PAGE
  ══════════════════════════════════════ */
  .empty-state { text-align:center; padding:7rem 2rem; color:var(--silver); }
  .empty-icon { font-size:3.5rem; margin-bottom:1rem; animation:bounce 2s ease-in-out infinite; display:block; }
  .empty-state h3 { font-family:var(--serif); font-size:1.5rem; font-weight:700; color:var(--ink); margin-bottom:.5rem; }

  /* ══════════════════════════════════════
     BREADCRUMB
  ══════════════════════════════════════ */
  .breadcrumb { font-size:.79rem; color:var(--silver); padding:1.1rem 2.5rem; max-width:1220px; margin:0 auto; display:flex; align-items:center; gap:.45rem; flex-wrap:wrap; }
  .bc-btn { background:none; border:none; color:var(--silver); cursor:pointer; font-family:var(--sans); font-size:.79rem; transition:all .2s; padding:2px 5px; border-radius:4px; }
  .bc-btn:hover { color:var(--gold-dark); background:var(--gold-pale); }

  /* ══════════════════════════════════════
     TOAST
  ══════════════════════════════════════ */
  .toast { position:fixed; bottom:2rem; right:2rem; z-index:999; background:linear-gradient(135deg,#12101e,#1e1b30); color:#fff; padding:.9rem 1.3rem; border-radius:18px; font-size:.84rem; font-weight:500; box-shadow:0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(212,168,67,0.12); display:flex; align-items:center; gap:.9rem; animation:toastIn .5s cubic-bezier(.34,1.56,.64,1) both; max-width:340px; font-family:var(--sans); }
  .toast-icon { width:32px; height:32px; border-radius:10px; background:linear-gradient(135deg,var(--gold-dark),var(--gold)); display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; color:#1a0e00; }
  .toast-dismiss { background:none; border:none; color:rgba(255,255,255,0.3); cursor:pointer; font-size:15px; margin-left:auto; padding:3px; border-radius:4px; }
  .toast-dismiss:hover { color:#fff; }

  /* ══════════════════════════════════════
     MODAL
  ══════════════════════════════════════ */
  .modal-overlay { position:fixed; inset:0; z-index:500; background:rgba(6,4,18,0.75); backdrop-filter:blur(10px); display:flex; align-items:center; justify-content:center; padding:1rem; animation:overlayIn .3s ease both; }
  .modal { background:var(--surface); border-radius:var(--r-xl); padding:2.5rem; max-width:460px; width:100%; box-shadow:0 32px 96px rgba(0,0,0,0.3); animation:modalIn .5s cubic-bezier(.34,1.56,.64,1) both; position:relative; overflow:hidden; border:1px solid var(--border); }
  .modal::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,var(--gold-dark),var(--gold-light)); }
  .modal-icon-wrap { width:74px; height:74px; border-radius:50%; margin:0 auto 1.5rem; background:linear-gradient(135deg,var(--gold-pale),var(--emerald-pale)); display:flex; align-items:center; justify-content:center; font-size:2.2rem; animation:checkPop .7s .2s both; }
  .modal-title { font-family:var(--serif); font-size:1.75rem; font-weight:700; text-align:center; margin-bottom:.6rem; }
  .modal-body { font-size:.88rem; color:var(--silver); text-align:center; line-height:1.75; margin-bottom:1.75rem; }
  .modal-details { background:var(--paper); border:1px solid var(--border); border-radius:var(--r-md); padding:1rem 1.3rem; margin-bottom:1.75rem; }
  .modal-detail-row { display:flex; justify-content:space-between; align-items:center; padding:.38rem 0; font-size:.83rem; }
  .modal-detail-row:not(:last-child) { border-bottom:1px solid var(--border); }
  .modal-detail-label { color:var(--silver); }
  .modal-detail-value { font-weight:600; color:var(--ink); }
  .modal-btn-primary { width:100%; background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold-light)); color:#1a0e00; border:none; padding:.9rem; font-family:var(--display); font-size:.88rem; font-weight:700; border-radius:var(--r-sm); cursor:pointer; box-shadow:0 6px 28px rgba(212,168,67,0.35); transition:all .3s cubic-bezier(.34,1.56,.64,1); margin-bottom:.65rem; letter-spacing:.04em; }
  .modal-btn-primary:hover { transform:translateY(-2px); box-shadow:0 10px 40px rgba(212,168,67,0.5); }
  .modal-btn-secondary { width:100%; background:none; border:1px solid var(--border); padding:.8rem; font-family:var(--sans); font-size:.84rem; font-weight:500; border-radius:var(--r-sm); cursor:pointer; transition:all .25s; color:var(--silver); }
  .modal-btn-secondary:hover { border-color:var(--border2); color:var(--ink); }
  .modal-confetti { position:absolute; pointer-events:none; border-radius:3px; }

  /* ══════════════════════════════════════
     SOCIAL PAGE
  ══════════════════════════════════════ */
  .social-wrap { max-width:800px; margin:0 auto; padding:4.5rem 2.5rem; animation:pageReveal .6s both; }
  .social-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.1rem; margin-bottom:2rem; }
  .social-card { border-radius:var(--r-lg); padding:1.7rem; cursor:pointer; position:relative; overflow:hidden; display:block; text-decoration:none; border:1px solid transparent; transition:transform .38s cubic-bezier(.22,1,.36,1), box-shadow .38s; animation:cardIn .5s cubic-bezier(.22,1,.36,1) both; }
  .social-card::after { content:''; position:absolute; top:-50%; left:-100%; width:55%; height:200%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent); transform:skewX(-20deg); transition:left .6s ease; }
  .social-card:hover { transform:translateY(-8px) scale(1.025); }
  .social-card:hover::after { left:180%; }
  .sc-logo { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:1rem; font-size:1.1rem; font-weight:900; font-family:var(--display); flex-shrink:0; }
  .sc-name { font-family:var(--display); font-weight:700; font-size:1.05rem; margin-bottom:.22rem; }
  .sc-handle { font-size:.76rem; opacity:.6; margin-bottom:.75rem; }
  .sc-stats { display:flex; gap:1rem; margin-bottom:.9rem; }
  .sc-stat { font-size:.72rem; opacity:.7; }
  .sc-stat strong { font-weight:700; font-size:.88rem; display:block; opacity:1; }
  .sc-follow { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.14); border:1px solid rgba(255,255,255,0.22); border-radius:100px; padding:6px 14px; font-size:.72rem; font-weight:700; letter-spacing:.04em; text-transform:uppercase; transition:all .25s; }
  .social-card:hover .sc-follow { background:rgba(255,255,255,0.24); }
  .ads-banner { background:linear-gradient(135deg,#0e0b1e,#1a1533); border:1px solid rgba(212,168,67,0.2); border-radius:var(--r-lg); padding:1.8rem 2rem; margin-bottom:1.8rem; position:relative; overflow:hidden; animation:fadeUp .5s .2s both; }
  .ads-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(212,168,67,0.12); border:1px solid rgba(212,168,67,0.25); border-radius:100px; padding:4px 12px; font-size:.68rem; font-weight:700; color:var(--gold); letter-spacing:.05em; text-transform:uppercase; margin-bottom:.9rem; font-family:var(--display); }
  .ads-title { font-family:var(--serif); font-size:1.3rem; color:#fff; margin-bottom:.4rem; font-weight:700; }
  .ads-sub { font-size:.82rem; color:rgba(255,255,255,0.42); margin-bottom:1.25rem; font-weight:300; line-height:1.65; }
  .ads-grid { display:grid; grid-template-columns:1fr 1fr; gap:.7rem; margin-bottom:1.3rem; }
  .ads-stat-card { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:.88rem 1rem; }
  .ads-stat-num { font-family:var(--serif); font-size:1.45rem; font-style:italic; color:var(--gold-light); display:block; font-weight:700; }
  .ads-stat-lbl { font-size:.68rem; color:rgba(255,255,255,0.3); text-transform:uppercase; letter-spacing:.07em; font-weight:700; font-family:var(--display); }
  .ads-cta { background:linear-gradient(135deg,var(--gold-dark),var(--gold)); color:#1a0e00; border:none; padding:.72rem 1.6rem; border-radius:100px; font-family:var(--display); font-size:.82rem; font-weight:700; cursor:pointer; box-shadow:0 4px 20px rgba(212,168,67,0.4); transition:all .3s; letter-spacing:.04em; }
  .ads-cta:hover { transform:scale(1.05); box-shadow:0 8px 32px rgba(212,168,67,0.55); }
  .nl-box { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:2.2rem; text-align:center; margin-bottom:1.5rem; }
  .nl-title { font-family:var(--serif); font-size:1.4rem; font-weight:700; margin-bottom:.4rem; }
  .nl-sub { font-size:.84rem; color:var(--silver); margin-bottom:1.3rem; line-height:1.65; }
  .nl-form { display:flex; gap:.6rem; max-width:380px; margin:0 auto; }
  .nl-input { flex:1; border:1px solid var(--border); border-radius:100px; padding:.68rem 1rem; font-family:var(--sans); font-size:.85rem; outline:none; background:var(--paper); color:var(--ink); transition:border-color .25s, box-shadow .25s; }
  .nl-input:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(212,168,67,0.1); }
  .nl-btn { background:linear-gradient(135deg,var(--gold-dark),var(--gold)); color:#1a0e00; border:none; padding:.68rem 1.3rem; border-radius:100px; font-family:var(--display); font-size:.82rem; font-weight:700; cursor:pointer; white-space:nowrap; transition:all .3s; box-shadow:0 4px 16px rgba(212,168,67,0.35); letter-spacing:.04em; }
  .nl-btn:hover { transform:scale(1.05); box-shadow:0 6px 24px rgba(212,168,67,0.5); }
  .community-strip { display:flex; gap:.8rem; flex-wrap:wrap; }
  .comm-item { flex:1; min-width:140px; background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); padding:1.1rem; text-align:center; transition:all .3s cubic-bezier(.22,1,.36,1); cursor:pointer; }
  .comm-item:hover { border-color:rgba(212,168,67,0.3); transform:translateY(-5px); box-shadow:0 12px 32px rgba(212,168,67,0.1); }
  .comm-num { font-family:var(--serif); font-size:1.5rem; font-style:italic; display:block; margin-bottom:.2rem; color:var(--gold-dark); font-weight:700; }
  .comm-label { font-size:.71rem; color:var(--silver); text-transform:uppercase; letter-spacing:.08em; font-weight:600; font-family:var(--display); }

  /* ══════════════════════════════════════
     PLANS PAGE
  ══════════════════════════════════════ */
  .plans-wrap { max-width:1140px; margin:0 auto; padding:4.5rem 2.5rem; animation:pageReveal .6s both; }
  .plans-hero { text-align:center; margin-bottom:4rem; }
  .plans-badge { display:inline-flex; align-items:center; gap:7px; background:var(--gold-pale); border:1px solid rgba(212,168,67,0.3); border-radius:100px; padding:6px 16px; font-size:.72rem; font-weight:700; color:var(--gold-dark); letter-spacing:.08em; text-transform:uppercase; margin-bottom:1.3rem; font-family:var(--display); }
  .plans-h1 { font-family:var(--serif); font-size:clamp(2.2rem,4.5vw,3.5rem); font-weight:700; letter-spacing:-.025em; margin-bottom:.8rem; }
  .plans-h1 em { font-style:italic; color:var(--gold-dark); }
  .plans-p { font-size:1rem; color:var(--silver); max-width:500px; margin:0 auto 2.2rem; line-height:1.8; font-weight:300; }
  .billing-toggle { display:inline-flex; align-items:center; background:var(--surface); border:1px solid var(--border); border-radius:100px; padding:4px; }
  .billing-opt { background:none; border:none; padding:.52rem 1.3rem; border-radius:100px; font-family:var(--sans); font-size:.82rem; font-weight:500; cursor:pointer; color:var(--silver); transition:all .3s; }
  .billing-opt.active { background:var(--ink); color:#fff; font-weight:700; }
  .billing-save { background:var(--emerald-pale); color:var(--emerald-dark); font-size:.66rem; font-weight:700; padding:3px 8px; border-radius:100px; margin-left:4px; }
  .plans-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(265px,1fr)); gap:1.3rem; margin-bottom:3.5rem; }
  .plan-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-xl); padding:2.1rem; position:relative; overflow:hidden; transition:all .38s cubic-bezier(.22,1,.36,1); animation:priceIn .6s cubic-bezier(.22,1,.36,1) both; }
  .plan-card:hover { transform:translateY(-9px); box-shadow:0 24px 60px rgba(0,0,0,0.1); border-color:var(--border2); }
  .plan-card.featured { background:linear-gradient(160deg,#0a0618 0%,#14102a 100%); border-color:rgba(212,168,67,0.4); color:#fff; box-shadow:0 16px 50px rgba(212,168,67,0.2); animation:priceIn .6s both, goldGlow 5s ease-in-out infinite; }
  .plan-card.featured:hover { transform:translateY(-12px); box-shadow:0 32px 80px rgba(212,168,67,0.3); }
  .plan-card.featured::before { content:''; position:absolute; top:0; left:-100%; width:50%; height:100%; background:linear-gradient(90deg,transparent,rgba(212,168,67,0.06),transparent); animation:goldSweep 4s ease-in-out infinite; }
  .plan-badge { position:absolute; top:1.3rem; right:1.3rem; background:linear-gradient(135deg,var(--gold-dark),var(--gold)); color:#1a0e00; font-size:.64rem; font-weight:800; padding:4px 10px; border-radius:100px; letter-spacing:.06em; text-transform:uppercase; font-family:var(--display); }
  .plan-tier { font-size:.7rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--silver); margin-bottom:.5rem; font-family:var(--display); }
  .plan-card.featured .plan-tier { color:rgba(255,255,255,0.38); }
  .plan-name { font-family:var(--serif); font-size:1.55rem; font-weight:700; margin-bottom:.35rem; }
  .plan-card.featured .plan-name { color:#fff; }
  .plan-desc { font-size:.82rem; color:var(--silver); margin-bottom:1.8rem; line-height:1.65; }
  .plan-card.featured .plan-desc { color:rgba(255,255,255,0.42); }
  .plan-price-row { display:flex; align-items:baseline; gap:4px; margin-bottom:.3rem; }
  .plan-currency { font-size:1.1rem; font-weight:700; color:var(--ink); }
  .plan-card.featured .plan-currency { color:var(--gold-light); }
  .plan-amount { font-family:var(--serif); font-size:3.2rem; font-weight:700; line-height:1; color:var(--ink); font-style:italic; }
  .plan-card.featured .plan-amount { color:#fff; }
  .plan-period { font-size:.8rem; color:var(--silver); }
  .plan-card.featured .plan-period { color:rgba(255,255,255,0.38); }
  .plan-save-note { font-size:.72rem; color:var(--emerald-dark); font-weight:600; margin-bottom:1.8rem; }
  .plan-card.featured .plan-save-note { color:var(--emerald); }
  .plan-divider { border:none; border-top:1px solid var(--border); margin:1.6rem 0; }
  .plan-card.featured .plan-divider { border-color:rgba(255,255,255,0.1); }
  .plan-features { list-style:none; margin-bottom:2.2rem; }
  .plan-feature { display:flex; align-items:flex-start; gap:.7rem; padding:.42rem 0; font-size:.83rem; line-height:1.55; }
  .plan-check { width:19px; height:19px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:10px; margin-top:1px; }
  .plan-check.yes { background:var(--emerald-pale); color:var(--emerald-dark); }
  .plan-card.featured .plan-check.yes { background:rgba(0,184,148,0.2); color:var(--emerald); }
  .plan-check.no { background:var(--cream); color:var(--silver); }
  .plan-card.featured .plan-check.no { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.2); }
  .feat-text { color:var(--ink); }
  .plan-card.featured .feat-text { color:rgba(255,255,255,0.8); }
  .feat-text.dim { color:var(--silver); text-decoration:line-through; }
  .plan-card.featured .feat-text.dim { color:rgba(255,255,255,0.2); }
  .plan-btn { width:100%; padding:.9rem; border-radius:var(--r-md); font-family:var(--display); font-size:.87rem; font-weight:700; cursor:pointer; transition:all .3s cubic-bezier(.34,1.56,.64,1); letter-spacing:.04em; border:none; }
  .btn-outline { background:none; border:1px solid var(--border); color:var(--ink); }
  .btn-outline:hover { border-color:var(--gold); color:var(--gold-dark); background:var(--gold-pale); transform:scale(1.02); }
  .btn-gold { background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold-light)); color:#1a0e00; box-shadow:0 6px 28px rgba(212,168,67,0.4); }
  .btn-gold:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 10px 40px rgba(212,168,67,0.55); }
  .btn-emerald { background:linear-gradient(135deg,var(--emerald-dark),var(--emerald)); color:#fff; box-shadow:0 6px 28px rgba(0,184,148,0.35); }
  .btn-emerald:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 10px 40px rgba(0,184,148,0.5); }
  .btn-dark { background:linear-gradient(135deg,#1a1435,#2a2060); color:var(--gold-light); box-shadow:0 6px 28px rgba(0,0,0,0.3); border:1px solid rgba(212,168,67,0.2); }
  .btn-dark:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 10px 40px rgba(0,0,0,0.5); border-color:rgba(212,168,67,0.5); }
  .career-plans-strip { background:linear-gradient(135deg,#0a0618,#14102a); border:1px solid rgba(212,168,67,0.2); border-radius:var(--r-xl); padding:3rem; margin-bottom:3rem; position:relative; overflow:hidden; animation:fadeUp .5s .2s both; }
  .career-plans-strip::before { content:''; position:absolute; top:-80px; right:-80px; width:280px; height:280px; border-radius:50%; background:radial-gradient(circle,rgba(212,168,67,0.15),transparent 70%); pointer-events:none; }
  .career-plans-strip::after { content:''; position:absolute; bottom:-60px; left:30%; width:200px; height:200px; border-radius:50%; background:radial-gradient(circle,rgba(0,184,148,0.1),transparent 70%); pointer-events:none; }
  .cp-title { font-family:var(--serif); font-size:1.8rem; color:#fff; margin-bottom:.5rem; font-weight:700; }
  .cp-title em { color:var(--gold-light); font-style:italic; }
  .cp-sub { font-size:.88rem; color:rgba(255,255,255,0.42); margin-bottom:1.8rem; max-width:520px; line-height:1.7; }
  .cp-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1rem; position:relative; z-index:1; }
  .cp-card { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); border-radius:var(--r-md); padding:1.3rem; transition:all .3s cubic-bezier(.22,1,.36,1); cursor:pointer; }
  .cp-card:hover { background:rgba(212,168,67,0.1); border-color:rgba(212,168,67,0.3); transform:translateY(-4px); }
  .cp-card-icon { font-size:1.8rem; margin-bottom:.7rem; display:block; }
  .cp-card-title { font-family:var(--display); font-weight:700; font-size:.9rem; color:#fff; margin-bottom:.25rem; }
  .cp-card-desc { font-size:.75rem; color:rgba(255,255,255,0.38); line-height:1.5; }
  .cp-card-price { font-family:var(--serif); font-size:1.1rem; font-style:italic; color:var(--gold-light); margin-top:.6rem; font-weight:700; }
  .plans-compare { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; margin-bottom:3rem; }
  .compare-head { background:var(--paper); padding:1.5rem 2rem; border-bottom:1px solid var(--border); }
  .compare-head h3 { font-family:var(--serif); font-size:1.3rem; font-weight:700; }
  .compare-table { width:100%; border-collapse:collapse; }
  .compare-table th { padding:.9rem 1.5rem; font-size:.73rem; font-weight:700; text-transform:uppercase; letter-spacing:.09em; color:var(--silver); text-align:left; border-bottom:1px solid var(--border); font-family:var(--display); }
  .compare-table th:not(:first-child) { text-align:center; }
  .compare-table td { padding:.88rem 1.5rem; font-size:.84rem; border-bottom:1px solid var(--border); }
  .compare-table td:not(:first-child) { text-align:center; }
  .compare-table tr:last-child td { border-bottom:none; }
  .compare-table tr:hover td { background:var(--paper); }
  .ct-check { color:var(--emerald); font-size:1rem; }
  .ct-x { color:var(--silver); }
  .ct-gold { background:rgba(212,168,67,0.06); }
  .faq-title { font-family:var(--serif); font-size:1.5rem; font-weight:700; margin-bottom:1.5rem; }
  .faq-item { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); margin-bottom:.65rem; overflow:hidden; }
  .faq-q { display:flex; justify-content:space-between; align-items:center; padding:1.1rem 1.45rem; cursor:pointer; font-size:.9rem; font-weight:600; transition:background .2s; }
  .faq-q:hover { background:var(--paper); }
  .faq-arrow { color:var(--silver); transition:transform .3s; flex-shrink:0; }
  .faq-arrow.open { transform:rotate(180deg); color:var(--gold-dark); }
  .faq-a { padding:0 1.45rem 1.1rem; font-size:.83rem; color:var(--silver); line-height:1.75; }
  .enterprise-strip { background:linear-gradient(135deg,#060412,#120f26); border:1px solid rgba(212,168,67,0.2); border-radius:var(--r-xl); padding:2.5rem; display:flex; justify-content:space-between; align-items:center; gap:2rem; flex-wrap:wrap; }
  .enterprise-text h3 { font-family:var(--serif); font-size:1.5rem; color:#fff; margin-bottom:.4rem; font-weight:700; }
  .enterprise-text p { font-size:.85rem; color:rgba(255,255,255,0.38); max-width:440px; line-height:1.65; }
  .enterprise-btn { background:none; border:1px solid rgba(212,168,67,0.3); color:var(--gold-light); padding:.78rem 1.8rem; border-radius:100px; font-family:var(--display); font-size:.85rem; font-weight:700; cursor:pointer; transition:all .3s; white-space:nowrap; flex-shrink:0; letter-spacing:.04em; }
  .enterprise-btn:hover { background:rgba(212,168,67,0.1); border-color:var(--gold); transform:scale(1.04); }

  /* ══════════════════════════════════════
     PLAN CONFIRM MODAL
  ══════════════════════════════════════ */
  .pcm-overlay { position:fixed; inset:0; z-index:600; background:rgba(4,2,14,0.8); backdrop-filter:blur(14px); display:flex; align-items:center; justify-content:center; padding:1rem; animation:overlayIn .35s ease both; overflow-y:auto; }
  .pcm-modal { background:linear-gradient(180deg,#fcfbff 0%,#f6f3ff 100%); border-radius:32px; width:min(960px,100%); border:1px solid rgba(212,168,67,0.15); box-shadow:0 40px 100px rgba(14,8,33,0.3); overflow:hidden; position:relative; animation:modalIn .55s cubic-bezier(.34,1.56,.64,1) both; margin:auto; }
  .pcm-modal::before { content:''; position:absolute; inset:0; background:radial-gradient(circle at 80% 0%,rgba(212,168,67,0.08),transparent 30%),radial-gradient(circle at 10% 95%,rgba(0,184,148,0.06),transparent 25%); pointer-events:none; }
  .pcm-grid { position:relative; z-index:1; display:grid; grid-template-columns:1.1fr 0.9fr; }
  .pcm-left { background:linear-gradient(160deg,#060412 0%,#100d22 55%,#1a1540 100%); padding:2.4rem 2.1rem; position:relative; overflow:hidden; color:#fff; }
  .pcm-left::after { content:''; position:absolute; bottom:-60px; right:-50px; width:240px; height:240px; border-radius:50%; background:radial-gradient(circle,rgba(212,168,67,0.15),transparent 70%); animation:orbFloat 8s ease-in-out infinite; }
  .pcm-left-grid { position:absolute; inset:0; pointer-events:none; opacity:.4; background-image:linear-gradient(rgba(212,168,67,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,67,0.04) 1px,transparent 1px); background-size:40px 40px; }
  .pcm-badge-strip { display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border-radius:100px; background:rgba(212,168,67,0.1); border:1px solid rgba(212,168,67,0.2); font-size:.67rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--gold-light); margin-bottom:1.3rem; animation:stagger .5s .1s both; font-family:var(--display); }
  .pcm-title { font-family:var(--serif); font-size:2.1rem; line-height:1.1; margin-bottom:.5rem; font-weight:700; animation:stagger .5s .18s both; }
  .pcm-sub { color:rgba(255,255,255,0.5); font-size:.86rem; line-height:1.7; margin-bottom:1.9rem; animation:stagger .5s .26s both; }
  .pcm-summary { background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.1); border-radius:20px; padding:1.2rem; backdrop-filter:blur(16px); margin-bottom:1.3rem; animation:stagger .5s .34s both; }
  .pcm-row { display:flex; justify-content:space-between; gap:1rem; padding:.4rem 0; font-size:.84rem; color:rgba(255,255,255,0.6); }
  .pcm-row strong { color:#fff; font-weight:700; }
  .pcm-row.total { border-top:1px solid rgba(255,255,255,0.1); margin-top:.3rem; padding-top:.75rem; font-size:.96rem; }
  .pcm-secure { display:flex; align-items:center; gap:8px; background:rgba(0,184,148,0.1); border:1px solid rgba(0,184,148,0.2); border-radius:12px; padding:.78rem 1rem; font-size:.77rem; color:var(--emerald); animation:stagger .5s .42s both; }
  .pcm-right { padding:2.4rem 2.1rem; background:#fff; }
  .pcm-right-title { font-family:var(--serif); font-size:1.25rem; font-weight:700; margin-bottom:.4rem; animation:stagger .5s .2s both; }
  .pcm-right-sub { font-size:.8rem; color:var(--silver); margin-bottom:1.5rem; animation:stagger .5s .28s both; }
  .pay-tabs { display:flex; gap:0; background:var(--paper); border:1px solid var(--border); border-radius:14px; padding:4px; margin-bottom:1.5rem; animation:stagger .5s .36s both; }
  .pay-tab { flex:1; background:none; border:none; padding:.58rem .5rem; font-family:var(--sans); font-size:.77rem; font-weight:600; color:var(--silver); border-radius:10px; cursor:pointer; transition:all .3s; display:flex; align-items:center; justify-content:center; gap:5px; }
  .pay-tab.active { background:#fff; color:var(--gold-dark); box-shadow:0 2px 12px rgba(212,168,67,0.15); }
  .card-visual { background:linear-gradient(135deg,var(--gold-dark),var(--gold),#e8c870,var(--emerald-dark)); border-radius:18px; padding:1.6rem 1.5rem; margin-bottom:1.5rem; color:#fff; position:relative; overflow:hidden; box-shadow:0 12px 40px rgba(212,168,67,0.35); animation:stagger .5s .28s both; }
  .card-visual::before { content:''; position:absolute; top:-30px; right:-30px; width:130px; height:130px; border-radius:50%; background:rgba(255,255,255,0.1); }
  .card-visual::after { content:''; position:absolute; bottom:-25px; left:70px; width:90px; height:90px; border-radius:50%; background:rgba(255,255,255,0.07); }
  .card-chip { width:36px; height:28px; background:rgba(255,255,255,0.25); border-radius:7px; margin-bottom:1.3rem; display:flex; align-items:center; justify-content:center; font-size:18px; }
  .card-number { font-family:var(--mono); font-size:1rem; letter-spacing:.2em; margin-bottom:1rem; opacity:.9; }
  .card-row { display:flex; justify-content:space-between; font-size:.71rem; opacity:.75; text-transform:uppercase; letter-spacing:.07em; }
  .pay-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:.78rem; }
  .pay-field { display:flex; flex-direction:column; gap:.4rem; margin-bottom:.9rem; }
  .pay-field.full { grid-column:1/-1; }
  .pay-field label { font-size:.69rem; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:var(--silver); font-family:var(--display); }
  .pay-field input, .pay-field select { border:1.5px solid var(--border); background:var(--paper); border-radius:12px; padding:.8rem 1rem; font-family:var(--sans); font-size:.87rem; outline:none; transition:border-color .25s, box-shadow .25s, transform .25s; color:var(--ink); }
  .pay-field input:focus, .pay-field select:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(212,168,67,0.1); transform:translateY(-1px); }
  .upi-panel { animation:stagger .4s both; }
  .upi-heading { font-size:.77rem; color:var(--silver); margin-bottom:.9rem; font-weight:600; font-family:var(--display); letter-spacing:.04em; text-transform:uppercase; }
  .upi-apps { display:flex; gap:.65rem; margin-bottom:1.2rem; flex-wrap:wrap; }
  .upi-app { display:flex; flex-direction:column; align-items:center; gap:5px; padding:.75rem 1rem; border:1.5px solid var(--border); border-radius:16px; cursor:pointer; flex:1; min-width:72px; text-align:center; transition:all .3s cubic-bezier(.34,1.56,.64,1); background:var(--paper); text-decoration:none; }
  .upi-app:hover { border-color:var(--gold); transform:translateY(-5px) scale(1.06); box-shadow:0 10px 28px rgba(212,168,67,0.15); background:var(--gold-pale); }
  .upi-app.selected { border-color:var(--gold); background:var(--gold-pale); box-shadow:0 0 0 3px rgba(212,168,67,0.12); }
  .upi-app-icon { font-size:1.6rem; line-height:1; }
  .upi-app-name { font-size:.64rem; font-weight:700; color:var(--ink); font-family:var(--display); }
  .upi-app-open { font-size:.58rem; color:var(--gold-dark); font-weight:600; background:var(--gold-pale); border-radius:4px; padding:1px 5px; margin-top:2px; border:1px solid rgba(212,168,67,0.2); }
  .upi-divider { display:flex; align-items:center; gap:.75rem; margin:1rem 0; }
  .upi-divider-line { flex:1; height:1px; background:var(--border); }
  .upi-divider-text { font-size:.72rem; color:var(--silver); }
  .upi-id-wrap { position:relative; margin-bottom:.85rem; }
  .upi-id-input { width:100%; border:1.5px solid var(--border); border-radius:14px; padding:.82rem 1rem .82rem 2.8rem; font-family:var(--sans); font-size:.88rem; outline:none; background:var(--paper); color:var(--ink); transition:border-color .25s, box-shadow .25s; }
  .upi-id-input:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(212,168,67,0.1); }
  .upi-id-at { position:absolute; left:1rem; top:50%; transform:translateY(-50%); font-size:1rem; color:var(--gold-dark); pointer-events:none; font-weight:700; }
  .upi-verify-btn { width:100%; background:linear-gradient(135deg,#4752c4,#7289da); color:#fff; border:none; padding:.82rem; border-radius:14px; font-family:var(--display); font-size:.84rem; font-weight:700; cursor:pointer; transition:all .3s; box-shadow:0 4px 18px rgba(71,82,196,0.35); letter-spacing:.04em; }
  .upi-verify-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(71,82,196,0.5); }
  .bank-panel { animation:stagger .4s both; }
  .bank-list { display:flex; flex-direction:column; gap:.65rem; margin-bottom:1.2rem; }
  .bank-item { display:flex; align-items:center; gap:1rem; background:var(--paper); border:1.5px solid var(--border); border-radius:16px; padding:.9rem 1.1rem; cursor:pointer; transition:all .3s cubic-bezier(.22,1,.36,1); }
  .bank-item:hover { border-color:var(--gold); background:var(--gold-pale); transform:translateX(4px); }
  .bank-item.selected { border-color:var(--gold); background:linear-gradient(135deg,#fffdf7,#fff); box-shadow:0 0 0 3px rgba(212,168,67,0.1); }
  .bank-logo { width:44px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:.68rem; font-weight:800; font-family:var(--display); flex-shrink:0; }
  .bank-name { font-weight:600; font-size:.88rem; flex:1; }
  .bank-type { font-size:.68rem; color:var(--silver); }
  .bank-check { width:20px; height:20px; border-radius:50%; border:2px solid var(--border); flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all .25s; }
  .bank-item.selected .bank-check { background:var(--gold); border-color:var(--gold-dark); color:#1a0e00; font-size:11px; font-weight:900; }
  .pcm-actions { display:flex; gap:.8rem; margin-top:1.3rem; }
  .pcm-cancel { flex:1; border:1.5px solid var(--border); background:#fff; color:var(--ink); border-radius:16px; padding:.9rem; font-family:var(--sans); font-size:.85rem; font-weight:700; cursor:pointer; transition:all .25s; }
  .pcm-cancel:hover { border-color:var(--border2); color:var(--silver); }
  .pcm-pay { flex:1.5; border:none; background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold-light)); color:#1a0e00; border-radius:16px; padding:.9rem; font-family:var(--display); font-size:.86rem; font-weight:700; cursor:pointer; box-shadow:0 8px 28px rgba(212,168,67,0.4); transition:all .3s cubic-bezier(.34,1.56,.64,1); position:relative; overflow:hidden; letter-spacing:.04em; }
  .pcm-pay:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 14px 40px rgba(212,168,67,0.55); }
  .pcm-success { position:relative; z-index:1; text-align:center; padding:3.5rem 2.5rem; min-height:520px; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .pcm-success-ring-wrap { position:relative; width:116px; height:116px; margin:0 auto 1.6rem; }
  .pcm-success-ring { width:116px; height:116px; border-radius:50%; background:linear-gradient(135deg,rgba(212,168,67,0.2),rgba(0,184,148,0.2)); display:flex; align-items:center; justify-content:center; animation:ringExpand .7s cubic-bezier(.34,1.56,.64,1) both; }
  .pcm-success-pulse { position:absolute; inset:0; border-radius:50%; border:2px solid var(--gold); opacity:0; animation:successRing 2s .7s ease-out infinite; }
  .pcm-success-check { animation:ringExpand .6s .22s both; font-size:2.7rem; }
  .pcm-success-title { font-family:var(--serif); font-size:2.2rem; font-weight:700; margin-bottom:.55rem; animation:stagger .5s .38s both; }
  .pcm-success-sub { font-size:.88rem; color:var(--silver); line-height:1.75; max-width:380px; margin:0 auto 2rem; animation:stagger .5s .48s both; }
  .pcm-success-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:.9rem; width:100%; margin-bottom:2rem; }
  .pcm-stat { background:#fff; border:1px solid rgba(212,168,67,0.15); border-radius:18px; padding:1rem .8rem; text-align:center; animation:countPop .6s cubic-bezier(.34,1.56,.64,1) both; }
  .pcm-stat:nth-child(1){animation-delay:.5s} .pcm-stat:nth-child(2){animation-delay:.62s} .pcm-stat:nth-child(3){animation-delay:.74s}
  .pcm-stat strong { display:block; font-family:var(--serif); font-size:1.35rem; font-style:italic; margin-bottom:.22rem; color:var(--gold-dark); }
  .pcm-stat span { font-size:.7rem; color:var(--silver); text-transform:uppercase; letter-spacing:.07em; font-weight:700; font-family:var(--display); }
  .pcm-success-btn { background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold-light)); color:#1a0e00; border:none; padding:.95rem 2.8rem; border-radius:100px; font-family:var(--display); font-size:.88rem; font-weight:700; cursor:pointer; box-shadow:0 8px 28px rgba(212,168,67,0.4); transition:all .3s; animation:stagger .5s .9s both; letter-spacing:.06em; }
  .pcm-success-btn:hover { transform:translateY(-2px) scale(1.04); box-shadow:0 14px 40px rgba(212,168,67,0.55); }
  .pcm-confetti { position:absolute; pointer-events:none; border-radius:3px; }

  /* ══════════════════════════════════════
     FOOTER
  ══════════════════════════════════════ */
  .footer { background:var(--midnight); color:rgba(255,255,255,0.25); padding:3.5rem 2.5rem 2rem; border-top:1px solid rgba(212,168,67,0.1); }
  .footer-inner { max-width:1200px; margin:0 auto; }
  .footer-top { display:flex; justify-content:space-between; align-items:flex-start; gap:2rem; flex-wrap:wrap; margin-bottom:2.5rem; }
  .footer-brand .footer-logo { font-family:var(--serif); font-size:1.4rem; color:rgba(255,255,255,0.7); margin-bottom:.5rem; font-style:italic; font-weight:700; }
  .footer-brand .footer-logo em { color:var(--gold-light); font-style:normal; }
  .footer-brand p { font-size:.8rem; max-width:240px; line-height:1.75; }
  .footer-links h4 { font-family:var(--display); font-size:.76rem; font-weight:700; color:rgba(255,255,255,0.45); text-transform:uppercase; letter-spacing:.1em; margin-bottom:1rem; }
  .footer-links a { display:block; font-size:.81rem; color:rgba(255,255,255,0.28); text-decoration:none; margin-bottom:.45rem; transition:color .2s; cursor:pointer; }
  .footer-links a:hover { color:var(--gold-light); }
  .footer-bottom { display:flex; justify-content:space-between; align-items:center; padding-top:1.5rem; border-top:1px solid rgba(255,255,255,0.06); font-size:.75rem; flex-wrap:wrap; gap:.5rem; }
  .footer-socials { display:flex; gap:.65rem; }
  .fsoc { width:34px; height:34px; border-radius:9px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; font-size:13px; cursor:pointer; transition:all .3s cubic-bezier(.34,1.56,.64,1); text-decoration:none; color:rgba(255,255,255,0.35); }
  .fsoc:hover { background:rgba(212,168,67,0.2); border-color:rgba(212,168,67,0.4); transform:translateY(-3px); color:var(--gold-light); }

  /* ══════════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════════ */
  @media(max-width:1200px){.plans-grid{grid-template-columns:repeat(2,1fr)}.detail-wrap{padding:2rem 1.5rem}.listings-wrap{padding:2rem 1.5rem}.section{padding:4rem 1.5rem}}
  @media(max-width:1024px){.nav-search-wrap{display:none}.nav-center{gap:0}.nav-item{padding:.44rem .75rem;font-size:.78rem}.nav-plans-btn{display:none}.hero{padding:5.5rem 2rem 4.5rem;min-height:72vh}.detail-wrap{flex-direction:column}.detail-side{width:100%}.sticky-card{position:static}.pcm-grid{grid-template-columns:1fr 1fr}}
  @media(max-width:860px){.nav-center{display:none}.nav-cta{display:none}.nav-mobile-toggle{display:flex;align-items:center;justify-content:center}.hero{padding:4.5rem 1.5rem 3.5rem}.search-glass{flex-wrap:wrap;border-radius:20px;padding:8px;gap:4px}.search-div{display:none}.search-glass select{min-width:unset;flex:1}.search-btn{width:100%;border-radius:var(--r-md);padding:.75rem;margin-top:4px}.hero-stats{gap:2rem;flex-wrap:wrap}.listings-wrap{flex-direction:column;gap:1.2rem;padding:1.5rem}.sidebar{width:100%;position:static}.pcm-grid{grid-template-columns:1fr}.social-grid{grid-template-columns:1fr}.plans-grid{grid-template-columns:1fr 1fr}.enterprise-strip{flex-direction:column;text-align:center}}
  @media(max-width:640px){:root{--r-xl:24px;--r-2xl:32px}.nav{padding:0 1rem;height:64px}.nav-mobile-menu{top:64px}.hero{padding:3.5rem 1.25rem 3rem;min-height:unset}.hero-eyebrow{display:none}.hero h1{font-size:clamp(2.1rem,8vw,3.2rem);margin-bottom:1rem}.section{padding:3rem 1.25rem}.cat-grid{grid-template-columns:repeat(4,1fr);gap:.6rem}.cat-card{padding:1rem .5rem}.jobs-grid{grid-template-columns:1fr}.co-grid{grid-template-columns:1fr}.plans-grid{grid-template-columns:1fr}.pcm-left{padding:1.6rem 1.3rem}.pcm-right{padding:1.6rem 1.3rem}.footer{padding:2rem 1.25rem 1.5rem}.toast{bottom:1rem;right:1rem;left:1rem;max-width:unset}.cp-grid{grid-template-columns:1fr 1fr}.ads-grid{grid-template-columns:1fr}}
  @media(max-width:420px){.nav{padding:0 .75rem}.logo-name{display:none}.hero h1{font-size:1.95rem}.pcm-actions{flex-direction:column}.pay-form-grid{grid-template-columns:1fr}.fgrid{grid-template-columns:1fr}.fcol2{grid-column:1}}
`;

// ─── DATA ─────────────────────────────────────────────────────────────
const CO_IMGS = {
  1:"https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=80&h=80&fit=crop&q=80",
  2:"https://images.unsplash.com/photo-1563986768609-322da13575f3?w=80&h=80&fit=crop&q=80",
  3:"https://images.unsplash.com/photo-1555421689-491a97ff2040?w=80&h=80&fit=crop&q=80",
  4:"https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=80&h=80&fit=crop&q=80",
  5:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=80&fit=crop&q=80",
  6:"https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=80&h=80&fit=crop&q=80",
};
const BANNER_IMGS = {
  1:"https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=700&h=130&fit=crop&q=80",
  2:"https://images.unsplash.com/photo-1563986768609-322da13575f3?w=700&h=130&fit=crop&q=80",
  3:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&h=130&fit=crop&q=80",
  4:"https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=700&h=130&fit=crop&q=80",
  5:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&h=130&fit=crop&q=80",
  6:"https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=700&h=130&fit=crop&q=80",
};

const JOBS = [
  { id:1, title:"Senior Product Designer", company:"Figma Inc.", logo:"Fi", color:"#7c3aed", bg:"#f5f3ff", location:"San Francisco", type:"Full-time", remote:true, level:"Senior", salary:"₹1.2–1.6 Cr", salaryNum:140, date:"2d ago", featured:true, category:"Design", description:"Lead design of next-generation collaborative tools used by millions of designers worldwide.", requirements:["5+ years product design","Proficiency in Figma & prototyping","Strong systems thinking","Experience with user research","Excellent communication skills"], companyId:1 },
  { id:2, title:"Full-Stack Engineer", company:"Stripe", logo:"St", color:"#2563eb", bg:"#eff6ff", location:"Remote", type:"Full-time", remote:true, level:"Mid", salary:"₹90–1.2 Cr", salaryNum:105, date:"1d ago", featured:true, category:"Engineering", description:"Build financial infrastructure of the internet. Work on APIs handling billions in transactions.", requirements:["3+ years full-stack","Strong TypeScript/Node.js","Distributed systems experience","PostgreSQL familiarity","Interest in fintech"], companyId:2 },
  { id:3, title:"Marketing Manager", company:"Notion", logo:"No", color:"#1d1d1d", bg:"#f5f5f5", location:"New York, NY", type:"Full-time", remote:false, level:"Mid", salary:"₹55–75L", salaryNum:65, date:"3d ago", featured:false, category:"Marketing", description:"Drive growth initiatives and brand storytelling for one of the fastest-growing productivity tools.", requirements:["4+ years B2B/PLG marketing","Content strategy skills","Data-driven mindset","HubSpot/Mixpanel experience","Exceptional writing"], companyId:3 },
  { id:4, title:"AI Safety Researcher", company:"Anthropic", logo:"Ai", color:"#c84b2f", bg:"#fff0eb", location:"San Francisco", type:"Full-time", remote:true, level:"Senior", salary:"₹1.5–2.4 Cr", salaryNum:200, date:"5h ago", featured:true, category:"Data", description:"Work on safety research at the frontier of AI. Apply statistical modelling and interpretability research.", requirements:["PhD or 4+ years applied ML","Python, PyTorch or JAX","LLM experience strongly preferred","Research publications","AI safety passion"], companyId:4 },
  { id:5, title:"UX Researcher", company:"Airbnb", logo:"Ab", color:"#ff5a5f", bg:"#fff0f0", location:"Remote", type:"Contract", remote:true, level:"Mid", salary:"₹70–90L", salaryNum:80, date:"1w ago", featured:false, category:"Design", description:"Conduct mixed-methods research to uncover host and guest insights across the Airbnb platform.", requirements:["3+ years UX research","Qual & quant skills","Dovetail experience","Clear communication","Collaborative style"], companyId:5 },
  { id:6, title:"DevOps Engineer", company:"HashiCorp", logo:"Ha", color:"#2d6a4f", bg:"#e8f8f1", location:"Austin, TX", type:"Full-time", remote:true, level:"Senior", salary:"₹95–1.3 Cr", salaryNum:115, date:"2d ago", featured:false, category:"Engineering", description:"Scale infrastructure for enterprise customers using Terraform, Vault, and Nomad.", requirements:["5+ years DevOps/SRE","Deep Kubernetes","Terraform & Vault","Bash/Python scripting","Cloud certs a plus"], companyId:6 },
];

const COMPANIES = [
  { id:1, name:"Figma Inc.", logo:"Fi", color:"#7c3aed", bg:"#f5f3ff", bannerBg:"linear-gradient(135deg,#7c3aed,#a855f7)", industry:"Design Tools · SaaS", size:"1,000–5,000", about:"Figma is a collaborative interface design tool built for web-based workflows. On a mission to make design accessible to everyone.", openRoles:14, culture:["Remote-friendly","Design-led","Inclusive"], founded:"2012", hq:"San Francisco" },
  { id:2, name:"Stripe", logo:"St", color:"#2563eb", bg:"#eff6ff", bannerBg:"linear-gradient(135deg,#1d4ed8,#3b82f6)", industry:"Fintech · Infrastructure", size:"5,000–10,000", about:"Stripe builds economic infrastructure for the internet. Millions of businesses rely on Stripe's APIs to accept payments.", openRoles:38, culture:["Data-driven","High performance","Global"], founded:"2010", hq:"San Francisco" },
  { id:3, name:"Notion", logo:"No", color:"#1d1d1d", bg:"#f5f5f5", bannerBg:"linear-gradient(135deg,#1d1d1d,#555)", industry:"Productivity · SaaS", size:"500–1,000", about:"Notion is an all-in-one workspace for notes, docs, and collaboration. Redefining how teams work together.", openRoles:22, culture:["Async-first","Transparent","Creative"], founded:"2016", hq:"New York" },
  { id:4, name:"Anthropic", logo:"Ai", color:"#c84b2f", bg:"#fff0eb", bannerBg:"linear-gradient(135deg,#c84b2f,#e8703a)", industry:"AI Safety · Research", size:"500–1,000", about:"Anthropic is an AI safety company building reliable, interpretable, and steerable AI systems for the long-term benefit of humanity.", openRoles:31, culture:["Mission-driven","Rigorous","Open"], founded:"2021", hq:"San Francisco" },
  { id:5, name:"Airbnb", logo:"Ab", color:"#ff5a5f", bg:"#fff0f0", bannerBg:"linear-gradient(135deg,#ff5a5f,#ff8c8f)", industry:"Travel · Marketplace", size:"5,000–10,000", about:"Airbnb connects people to unique travel experiences worldwide, creating a community of belonging for all.", openRoles:9, culture:["Belong anywhere","Entrepreneurial","Community"], founded:"2008", hq:"San Francisco" },
  { id:6, name:"HashiCorp", logo:"Ha", color:"#2d6a4f", bg:"#e8f8f1", bannerBg:"linear-gradient(135deg,#2d6a4f,#40916c)", industry:"DevOps · Cloud", size:"1,000–5,000", about:"HashiCorp delivers infrastructure automation software enabling organizations to provision, secure, connect, and run any infrastructure.", openRoles:17, culture:["Open source","Remote-first","Engineering-led"], founded:"2012", hq:"San Francisco" },
];

const CATEGORIES = [
  {icon:"💻",label:"Engineering",count:"2143"},{icon:"🎨",label:"Design",count:"893"},
  {icon:"🤖",label:"AI / ML",count:"1201"},{icon:"📣",label:"Marketing",count:"744"},
  {icon:"💰",label:"Finance",count:"623"},{icon:"🤝",label:"Sales",count:"1055"},
  {icon:"⚕️",label:"Healthcare",count:"381"},{icon:"🏗️",label:"Operations",count:"502"},
];

const NOTIFICATIONS = [
  { color:"#d4a843", text:"New match: Senior Designer at Figma — 97% fit for your profile", time:"2 min ago" },
  { color:"#00b894", text:"Stripe viewed your resume — apply now before it closes", time:"1 hr ago" },
  { color:"#e63757", text:"Job alert: 14 new AI roles in San Francisco this week", time:"3 hr ago" },
  { color:"#7c3aed", text:"Your Pro trial expires in 3 days — upgrade to keep alerts", time:"1 day ago" },
];

const SOCIALS = [
  { name:"X / Twitter", handle:"@WorkBoardHQ", logo:"𝕏", logoBg:"#000", gradient:"linear-gradient(135deg,#000,#222)", border:"rgba(255,255,255,0.08)", followers:"48.2K", posts:"12.4K", url:"https://twitter.com" },
  { name:"LinkedIn", handle:"WorkBoard Official", logo:"in", logoBg:"#0077b5", gradient:"linear-gradient(135deg,#005ea5,#0077b5)", border:"rgba(0,119,181,0.3)", followers:"112K", posts:"3.8K", url:"https://linkedin.com" },
  { name:"YouTube", handle:"WorkBoard Careers", logo:"▶", logoBg:"#ff0000", gradient:"linear-gradient(135deg,#c00,#f22)", border:"rgba(255,0,0,0.2)", followers:"23.4K", posts:"284", url:"https://youtube.com" },
  { name:"Instagram", handle:"@workboard.io", logo:"📸", logoBg:"#c13584", gradient:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", border:"rgba(193,53,132,0.3)", followers:"38.7K", posts:"1.2K", url:"https://instagram.com" },
  { name:"Discord", handle:"Community Server", logo:"💬", logoBg:"#5865f2", gradient:"linear-gradient(135deg,#4752c4,#7289da)", border:"rgba(88,101,242,0.3)", followers:"14.9K", posts:"Online", url:"https://discord.gg" },
  { name:"GitHub", handle:"workboard-hq", logo:"⌥", logoBg:"#24292e", gradient:"linear-gradient(135deg,#24292e,#3a4049)", border:"rgba(255,255,255,0.06)", followers:"6.1K", posts:"142", url:"https://github.com" },
];

const UPI_APPS = [
  { icon:"💜", name:"PhonePe", deepLink:"phonepe://pay", storeLink:"https://www.phonepe.com/app-download/" },
  { icon:"🟢", name:"GPay", deepLink:"tez://upi/pay", storeLink:"https://pay.google.com/intl/en_in/about/" },
  { icon:"🔵", name:"Paytm", deepLink:"paytmmp://pay", storeLink:"https://paytm.com/app" },
  { icon:"🇮🇳", name:"BHIM", deepLink:"upi://pay", storeLink:"https://www.bhimupi.org.in/" },
];

const BANKS = [
  { name:"HDFC Bank", type:"Net Banking / UPI", color:"#c13b2f", bg:"#fde8e7", abbr:"HD" },
  { name:"SBI", type:"State Bank of India", color:"#003366", bg:"#e6eef7", abbr:"SB" },
  { name:"ICICI Bank", type:"Net Banking / UPI", color:"#b5451b", bg:"#fceae5", abbr:"IC" },
  { name:"Axis Bank", type:"Net Banking / UPI", color:"#97144d", bg:"#fce8f0", abbr:"AX" },
];

// ─── COUNT-UP HOOK ─────────────────────────────────────────────────────
function useCountUp(target, duration = 1400, start = false, decimals = 0) {
  const [current, setCurrent] = useState(0);
  const frameRef = useRef();
  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = target * ease;
      setCurrent(decimals > 0 ? parseFloat(val.toFixed(decimals)) : Math.round(val));
      if (p < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [start, target, duration, decimals]);
  return current;
}

function CountUp({ value, suffix = "", prefix = "", duration = 1400, decimals = 0, start = true }) {
  const n = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
  const c = useCountUp(n, duration, start, decimals);
  return <span>{prefix}{c.toLocaleString()}{suffix}</span>;
}

// ─── IMPROVED INITIAL LOADER ───────────────────────────────────────────
function InitialLoader({ onDone }) {
  const [hiding, setHiding] = useState(false);
  const [status, setStatus] = useState("Initialising platform…");
  const [progress, setProgress] = useState(0);
  const [countStart, setCountStart] = useState(false);

  // Streak particles
  const streaks = Array.from({length:6}, (_, i) => ({
    top: `${10 + i * 14}%`,
    width: `${80 + Math.random() * 200}px`,
    animationDuration: `${2.5 + Math.random() * 3}s`,
    animationDelay: `${Math.random() * 2}s`,
  }));

  // Floating particles
  const particles = Array.from({length:22}, (_, i) => ({
    left: `${4 + (i / 22) * 92}%`,
    width: `${3 + Math.random() * 8}px`,
    height: `${3 + Math.random() * 8}px`,
    background: ["#d4a843","#f0c960","#00b894","#c4b5fd","#e63757","#fff"][i % 6],
    animationDuration: `${3.5 + Math.random() * 5}s`,
    animationDelay: `${Math.random() * 2.5}s`,
    borderRadius: Math.random() > 0.5 ? "50%" : "3px",
  }));

  useEffect(() => {
    // Start counters after small delay
    setTimeout(() => setCountStart(true), 350);

    // Progress steps with messages
    const steps = [
      { w: 28, msg: "Fetching 8,400+ live roles…",  t: 400  },
      { w: 52, msg: "Curating your feed…",           t: 800  },
      { w: 76, msg: "Running AI matching…",          t: 1200 },
      { w: 92, msg: "Almost ready…",                 t: 1650 },
      { w: 100,msg: "Ready!",                        t: 2000 },
    ];
    const timers = steps.map(({ w, msg, t }) =>
      setTimeout(() => { setProgress(w); setStatus(msg); }, t)
    );

    const hideTimer = setTimeout(() => {
      setHiding(true);
      setTimeout(onDone, 1100);
    }, 2700);

    return () => { timers.forEach(clearTimeout); clearTimeout(hideTimer); };
  }, [onDone]);

  return (
    <div className={`initial-loader${hiding ? " hide" : ""}`}>
      <div className="il-aurora"/>
      <div className="il-grid"/>

      {/* Light streaks */}
      <div className="il-streaks">
        {streaks.map((s, i) => (
          <div key={i} className="il-streak" style={s}/>
        ))}
      </div>

      {/* Floating particles */}
      <div className="il-particles">
        {particles.map((p, i) => (
          <div key={i} className="il-particle" style={p}/>
        ))}
      </div>

      <div className="il-center">
        {/* Premium gem with orbital rings */}
        <div className="il-logomark">
          <div className="il-rings">
            <div className="il-ring"/>
            <div className="il-ring"/>
            <div className="il-ring"/>
          </div>
          <div className="il-logomark-ring"/>
          <div className="il-logomark-inner">
            <span className="il-logomark-icon">💎</span>
          </div>
        </div>

        {/* Brand */}
        <div className="il-brand">
          <div className="il-wordmark">Work<em>Board</em></div>
          <div className="il-tagline">Elite Career Platform</div>
        </div>

        {/* LIVE STATS COUNTERS — key improvement */}
        <div className="il-stats">
          <div className="il-stat">
            <span className="il-stat-num">
              {countStart ? <CountUp value={8412} duration={1800} start={true}/> : "0"}
            </span>
            <div className="il-stat-label">Live Roles</div>
          </div>
          <div className="il-stat-sep"/>
          <div className="il-stat">
            <span className="il-stat-num">
              {countStart ? <CountUp value={1203} duration={1600} start={true}/> : "0"}
            </span>
            <div className="il-stat-label">Companies</div>
          </div>
          <div className="il-stat-sep"/>
          <div className="il-stat">
            <span className="il-stat-num">
              {countStart ? <CountUp value={94} suffix="K" duration={1400} start={true}/> : "0"}
            </span>
            <div className="il-stat-label">Hires Made</div>
          </div>
        </div>

        {/* Progress bar — now controlled by state */}
        <div className="il-progress-wrap">
          <div className="il-progress-bg">
            <div className="il-progress-line" style={{ width: `${progress}%` }}/>
          </div>
          <div className="il-status">{status}</div>
        </div>
      </div>
    </div>
  );
}

// ─── IMPROVED PAGE TRANSITION ──────────────────────────────────────────
const PAGE_LABELS = {
  home:"Home", listings:"Browse Jobs", companies:"Companies", detail:"Job Details",
  company:"Company", resume:"Resume", saved:"Saved", contact:"Contact",
  social:"Community", plans:"Pricing"
};

function PageTransition({ pageName, onDone }) {
  const [phase, setPhase] = useState("enter");
  useEffect(() => {
    // Panels come down → show spinner → panels lift up
    const t1 = setTimeout(() => setPhase("leave"), 420);
    const t2 = setTimeout(onDone, 880);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className="page-transition">
      {/* 6-panel curtain */}
      <div className="pt-curtain">
        {[0,1,2,3,4,5].map(i => (
          <div
            key={i}
            className={`pt-panel${phase === "leave" ? " leave" : ""}`}
            style={{
              animationDelay: phase === "leave"
                ? `${(5 - i) * 0.042}s`
                : `${i * 0.042}s`
            }}
          />
        ))}
      </div>

      {/* Gold glow-line sweeps across */}
      <div className="pt-glowline"/>

      {/* Spinner content */}
      <div className={`pt-content${phase === "leave" ? " leaving" : ""}`}>
        <div className="pt-spinner">
          <div className="pt-ring pt-ring-1"/>
          <div className="pt-ring pt-ring-2"/>
          <div className="pt-ring pt-ring-3"/>
          <div className="pt-core"/>
        </div>
        <div className="pt-page-name">{PAGE_LABELS[pageName] || pageName}</div>
        <div className="pt-progress">
          <div className="pt-progress-fill"/>
        </div>
      </div>
    </div>
  );
}

// ─── HELPERS ───────────────────────────────────────────────────────────
function CoLogo({ companyId, fallback, color, bg, size = 48, radius = 13 }) {
  const [err, setErr] = useState(false);
  const img = CO_IMGS[companyId];
  if (!err && img) return (
    <div style={{ width:size, height:size, borderRadius:radius, overflow:"hidden", flexShrink:0 }}>
      <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={() => setErr(true)}/>
    </div>
  );
  return (
    <div style={{ width:size, height:size, borderRadius:radius, background:bg, color, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--display)", fontWeight:800, fontSize:size*0.35, flexShrink:0 }}>
      {fallback}
    </div>
  );
}

function Badge({ v, children }) {
  const cls = { type:"t-full", remote:"t-remote", level:"t-level", gold:"t-gold" };
  return <span className={`tag ${cls[v] || "t-level"}`}>{children}</span>;
}

function JobCard({ job, saved, onSave, onClick, delay = 0, premium = false }) {
  return (
    <div className={`job-card${premium ? " premium-card" : ""}`} style={{ animationDelay:`${delay}s` }} onClick={() => onClick(job)}>
      <div className="jc-top">
        <div className="jc-logo-row">
          <CoLogo companyId={job.companyId} fallback={job.logo} color={job.color} bg={job.bg}/>
          <div>
            {premium && <div className="premium-kicker"><span className="pk-dot"/>⭐ Signature Pick</div>}
            <div className="job-title">{job.title}</div>
            <div className="job-co">{job.company} · {job.location}</div>
          </div>
        </div>
        <button className={`bk-btn${saved ? " saved" : ""}`} onClick={e => { e.stopPropagation(); onSave(job.id); }}>
          {saved ? "♥" : "♡"}
        </button>
      </div>
      <div className="job-tags">
        {job.featured && <Badge v="gold">✦ Featured</Badge>}
        <Badge v="type">{job.type}</Badge>
        {job.remote && <Badge v="remote">Remote</Badge>}
        <Badge v="level">{job.level}</Badge>
      </div>
      <div className="jc-foot">
        <span className="j-salary">{job.salary}</span>
        <span className="j-date">{job.date}</span>
      </div>
    </div>
  );
}

// ─── MODALS ─────────────────────────────────────────────────────────────
function ApplyModal({ job, onClose }) {
  const cols = ["#d4a843","#00b894","#e63757","#7c3aed","#c4b5fd"];
  const pieces = Array.from({length:22}, (_, i) => ({
    left:`${5+(i/22)*90}%`, top:`${52+Math.random()*36}%`,
    background:cols[i%cols.length], '--cx':`${(Math.random()-0.5)*90}px`,
    '--cy':`${-(50+Math.random()*90)}px`, '--cr':`${(Math.random()-0.5)*720}deg`,
    borderRadius:Math.random()>0.5?"50%":"4px",
    width:`${10+Math.random()*8}px`, height:`${10+Math.random()*8}px`,
  }));
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {pieces.map((s, i) => (
          <div key={i} className="modal-confetti" style={{...s, position:"absolute", animation:`confetti ${0.7+Math.random()*0.5}s ${Math.random()*0.2}s ease-out both`}}/>
        ))}
        <div className="modal-icon-wrap">🎉</div>
        <div className="modal-title">Application Sent!</div>
        <div className="modal-body">Your application for <strong>{job?.title}</strong> at <strong>{job?.company}</strong> is on its way.</div>
        <div className="modal-details">
          {[["Position",job?.title],["Company",job?.company],["Location",job?.location],["Status","✓ Under Review"]].map(([l,v],i) => (
            <div key={i} className="modal-detail-row">
              <span className="modal-detail-label">{l}</span>
              <span className="modal-detail-value" style={l==="Status"?{color:"var(--emerald)"}:{}}>{v}</span>
            </div>
          ))}
        </div>
        <button className="modal-btn-primary" onClick={onClose}>Back to Jobs</button>
        <button className="modal-btn-secondary" onClick={onClose}>View Application Tracker</button>
      </div>
    </div>
  );
}

function PlanConfirmModal({ plan, billing, price, onClose, onSuccess }) {
  const [tab, setTab] = useState("card");
  const [selBank, setSelBank] = useState(null);
  const [selUpi, setSelUpi] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [paying, setPaying] = useState(false);
  const annual = billing === "annual";

  const confettiPieces = Array.from({length:30}, (_, i) => ({
    left:`${4+(i/30)*92}%`, top:`${48+Math.random()*40}%`,
    background:["#d4a843","#00b894","#e63757","#7c3aed","#fff","#f0c960"][i%6],
    '--cx':`${(Math.random()-0.5)*130}px`, '--cy':`${-(55+Math.random()*110)}px`,
    '--cr':`${(Math.random()-0.5)*800}deg`,
    borderRadius:Math.random()>0.5?"50%":"3px",
    width:`${8+Math.random()*10}px`, height:`${8+Math.random()*10}px`,
  }));

  const handleUpiApp = (app, idx) => {
    setSelUpi(idx);
    const upiUrl = `${app.deepLink}?pa=workboard@upi&pn=WorkBoard&am=${price}&cu=INR&tn=WorkBoard+${plan.name}+Plan`;
    try { window.location.href = upiUrl; } catch(e) {}
    setTimeout(() => { window.open(app.storeLink, '_blank'); }, 2500);
  };

  const handlePay = () => {
    if (tab === "upi" && upiId.length < 3) return;
    setPaying(true);
    setTimeout(() => { setPaying(false); setConfirmed(true); }, 2000);
  };

  return (
    <div className="pcm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pcm-modal">
        {confirmed ? (
          <div className="pcm-success">
            {confettiPieces.map((s, i) => (
              <div key={i} className="pcm-confetti" style={{...s, position:"absolute", animation:`confetti ${0.7+Math.random()*0.6}s ${i*0.03}s ease-out both`}}/>
            ))}
            <div className="pcm-success-ring-wrap">
              <div className="pcm-success-ring"><span className="pcm-success-check">✅</span></div>
              <div className="pcm-success-pulse"/>
            </div>
            <div className="pcm-success-title">Welcome to {plan.name}!</div>
            <div className="pcm-success-sub">Payment processed. All premium features are now unlocked.</div>
            <div className="pcm-success-stats">
              {[[plan.name,"Plan"],[annual?"Annual":"Monthly","Billing"],["Active","Status"]].map(([v,l],i) => (
                <div key={i} className="pcm-stat"><strong>{v}</strong><span>{l}</span></div>
              ))}
            </div>
            <button className="pcm-success-btn" onClick={onSuccess}>Start Exploring {plan.name} →</button>
          </div>
        ) : (
          <div className="pcm-grid">
            <div className="pcm-left">
              <div className="pcm-left-grid"/>
              <div className="pcm-badge-strip">✦ Secure Checkout</div>
              <div className="pcm-title">Upgrade to<br/><em style={{fontStyle:"italic",color:"var(--gold-light)"}}>{plan.name}</em></div>
              <div className="pcm-sub">Unlock everything instantly. Cancel anytime with zero friction.</div>
              <div className="pcm-summary">
                <div className="pcm-row"><span>Plan</span><strong>{plan.name} · {annual?"Annual":"Monthly"}</strong></div>
                <div className="pcm-row"><span>Billing</span><strong>{annual?"Billed annually":"Month-to-month"}</strong></div>
                {annual && <div className="pcm-row"><span>Savings</span><strong style={{color:"var(--emerald)"}}>Save 25% vs monthly</strong></div>}
                <div className="pcm-row total"><span>Total today</span><strong style={{fontSize:"1.05rem",color:"var(--gold-light)"}}>${price}{annual?"/yr":"/mo"}</strong></div>
              </div>
              <div className="pcm-secure">🔒 256-bit SSL · PCI-DSS · Instant activation</div>
            </div>
            <div className="pcm-right">
              <div className="pcm-right-title">Complete Payment</div>
              <div className="pcm-right-sub">Choose your preferred method</div>
              <div className="pay-tabs">
                {[{k:"card",icon:"💳",l:"Card"},{k:"upi",icon:"📲",l:"UPI"},{k:"bank",icon:"🏦",l:"Net Banking"}].map(t => (
                  <button key={t.k} className={`pay-tab${tab===t.k?" active":""}`} onClick={() => setTab(t.k)}>
                    {t.icon} {t.l}
                  </button>
                ))}
              </div>
              {tab === "card" && (
                <div>
                  <div className="card-visual">
                    <div className="card-chip">💳</div>
                    <div className="card-number">•••• •••• •••• ••••</div>
                    <div className="card-row"><div><div style={{marginBottom:"2px"}}>Card Holder</div><div style={{fontWeight:700,fontSize:".82rem"}}>Your Name</div></div><div><div style={{marginBottom:"2px"}}>Expires</div><div style={{fontWeight:700,fontSize:".82rem"}}>MM / YY</div></div></div>
                  </div>
                  <div className="pay-form-grid">
                    <div className="pay-field full"><label>Card Number</label><input placeholder="1234 5678 9012 3456" maxLength={19}/></div>
                    <div className="pay-field"><label>Expiry</label><input placeholder="MM / YY" maxLength={7}/></div>
                    <div className="pay-field"><label>CVV</label><input placeholder="•••" type="password" maxLength={4}/></div>
                    <div className="pay-field full"><label>Name on Card</label><input placeholder="As on card"/></div>
                  </div>
                </div>
              )}
              {tab === "upi" && (
                <div className="upi-panel">
                  <div className="upi-heading">Tap to open app directly:</div>
                  <div className="upi-apps">
                    {UPI_APPS.map((u, i) => (
                      <div key={i} className={`upi-app${selUpi===i?" selected":""}`} onClick={() => handleUpiApp(u, i)}>
                        <div className="upi-app-icon">{u.icon}</div>
                        <div className="upi-app-name">{u.name}</div>
                        <div className="upi-app-open">Open ↗</div>
                      </div>
                    ))}
                  </div>
                  <div className="upi-divider"><div className="upi-divider-line"/><div className="upi-divider-text">or enter UPI ID</div><div className="upi-divider-line"/></div>
                  <div className="upi-id-wrap">
                    <span className="upi-id-at">@</span>
                    <input className="upi-id-input" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)}/>
                  </div>
                  <button className="upi-verify-btn" onClick={() => upiId && handlePay()}>💬 Verify & Pay ₹{price*83}</button>
                </div>
              )}
              {tab === "bank" && (
                <div className="bank-panel">
                  <div className="bank-list">
                    {BANKS.map((b, i) => (
                      <div key={i} className={`bank-item${selBank===i?" selected":""}`} onClick={() => setSelBank(i)}>
                        <div className="bank-logo" style={{background:b.bg,color:b.color}}>{b.abbr}</div>
                        <div style={{flex:1}}><div className="bank-name">{b.name}</div><div className="bank-type">{b.type}</div></div>
                        <div className="bank-check">{selBank===i && "✓"}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{fontSize:".74rem",color:"var(--silver)"}}>Redirected to your bank's secure portal.</div>
                </div>
              )}
              <div className="pcm-actions">
                <button className="pcm-cancel" onClick={onClose}>Cancel</button>
                <button className="pcm-pay" onClick={handlePay} disabled={paying}>
                  {paying
                    ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
                        <span style={{display:"inline-block",width:"14px",height:"14px",border:"2px solid rgba(0,0,0,0.25)",borderTopColor:"#1a0e00",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
                        Processing…
                      </span>
                    : `Pay $${price}${annual?"/yr":"/mo"} →`
                  }
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PAGES ──────────────────────────────────────────────────────────────
function HomePage({ onJobClick, onNav, savedJobs, onSave, visible }) {
  return (
    <div className="page-stage">
      <div className="hero">
        <div className="hero-bg-mesh"/>
        <div className="hero-grid"/>
        <div className="hero-lines">
          <div className="hero-line"/><div className="hero-line"/><div className="hero-line"/>
        </div>
        <div className="hero-inner">
          <div className="hero-eyebrow"><span className="hero-dot"/><span>8,400+ curated opportunities live now</span></div>
          <h1>The <span className="gold-text">Premium</span> Platform<br/>for <span className="emerald-text">Elite Careers</span></h1>
          <p className="hero-sub">Handpicked roles at companies building the future. AI-matched to your profile — no recruiter spam, ever.</p>
          <div className="search-container">
            <div className="search-glass">
              <span className="search-icon">🔍</span>
              <input placeholder="Role, skill, or company…"/>
              <span className="search-div"/>
              <select><option>All Locations</option><option>Remote</option><option>Bangalore</option><option>Mumbai</option><option>San Francisco</option><option>New York</option></select>
              <button className="search-btn" onClick={() => onNav("listings")}>Search →</button>
            </div>
          </div>
          <div className="hero-stats">
            {[["8412","Live Roles",""],["1203","Companies",""],["94","Hires","K+"]].map(([n,l,s]) => (
              <div key={l}>
                <div className="hstat-num"><CountUp value={parseInt(n)} suffix={s} duration={1800} start={visible}/></div>
                <div className="hstat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-cards">
          {[{id:1,logo:"Fi",bg:"#f5f3ff",color:"#7c3aed",title:"Sr. Designer",sub:"Figma Inc."},{id:2,logo:"St",bg:"#eff6ff",color:"#2563eb",title:"Full-Stack Eng.",sub:"Stripe"},{id:4,logo:"Ai",bg:"#fff0eb",color:"#c84b2f",title:"AI Researcher",sub:"Anthropic"}].map((c,i) => (
            <div className="float-card" key={i}>
              <CoLogo companyId={c.id} fallback={c.logo} color={c.color} bg={c.bg} size={44} radius={11}/>
              <div><div className="fc-title">{c.title}</div><div className="fc-sub">{c.sub}</div></div>
              <div className="fc-badge"/>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="sec-head"><div><div className="sec-title">Browse by <em>Category</em></div><div className="sec-sub">Roles across every discipline</div></div></div>
        <div className="cat-grid">
          {CATEGORIES.map((c, i) => (
            <div key={c.label} className="cat-card fade-in" style={{animationDelay:`${i*0.06}s`}} onClick={() => onNav("listings")}>
              <span className="cat-icon">{c.icon}</span>
              <div className="cat-label">{c.label}</div>
              <div className="cat-count"><CountUp value={parseInt(c.count)} suffix=" jobs" duration={1200} start={visible}/></div>
            </div>
          ))}
        </div>
      </div>

      <hr className="divider"/>

      <div className="section">
        <div className="sec-head">
          <div><div className="sec-title"><em>Featured</em> Opportunities</div><div className="sec-sub">Hand-picked roles updated daily</div></div>
          <button className="sec-link" onClick={() => onNav("listings")}>View all →</button>
        </div>
        <div className="jobs-grid">
          {JOBS.filter(j => j.featured).map((job, i) => (
            <JobCard key={job.id} job={job} saved={savedJobs.includes(job.id)} onSave={onSave} onClick={onJobClick} delay={i*0.1} premium={i===0}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListingsPage({ onJobClick, savedJobs, onSave }) {
  const [salary, setSalary] = useState(200);
  const [types, setTypes] = useState([]);
  const [levels, setLevels] = useState([]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const toggle = (arr, set, val) => set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  const filtered = JOBS.filter(j => {
    if (j.salaryNum > salary) return false;
    if (types.length && !types.includes(j.type)) return false;
    if (levels.length && !levels.includes(j.level)) return false;
    if (remoteOnly && !j.remote) return false;
    return true;
  });
  return (
    <div className="listings-wrap">
      <aside className="sidebar">
        <div className="sf-title">Refine Results</div>
        <div className="fg"><label>Salary (up to)</label><input type="range" min="50" max="200" value={salary} step="5" onChange={e => setSalary(+e.target.value)}/><div className="range-val">₹{salary}L / year</div></div>
        <div className="fg"><label>Job Type</label>{["Full-time","Part-time","Contract","Internship"].map(t => <div key={t} className="fopt"><input type="checkbox" checked={types.includes(t)} onChange={() => toggle(types,setTypes,t)}/><span>{t}</span></div>)}</div>
        <div className="fg"><label>Level</label>{["Junior","Mid","Senior","Lead"].map(l => <div key={l} className="fopt"><input type="checkbox" checked={levels.includes(l)} onChange={() => toggle(levels,setLevels,l)}/><span>{l}</span></div>)}</div>
        <div className="fg"><label>Work Mode</label><div className="fopt"><input type="checkbox" checked={remoteOnly} onChange={e => setRemoteOnly(e.target.checked)}/><span>Remote only</span></div></div>
        <button className="reset-btn" onClick={() => { setSalary(200); setTypes([]); setLevels([]); setRemoteOnly(false); }}>Reset Filters</button>
      </aside>
      <main className="listings-main">
        <div className="list-header">
          <div className="list-count">Showing <strong>{filtered.length}</strong> of {JOBS.length} roles</div>
          <select className="sort-sel"><option>Most Recent</option><option>Highest Salary</option><option>Most Relevant</option></select>
        </div>
        {filtered.map((job, i) => (
          <div key={job.id} className="list-card" style={{animationDelay:`${i*0.07}s`}} onClick={() => onJobClick(job)}>
            <CoLogo companyId={job.companyId} fallback={job.logo} color={job.color} bg={job.bg} size={46} radius={12}/>
            <div className="list-info">
              <div style={{fontFamily:"var(--display)",fontWeight:700,fontSize:".94rem"}}>{job.title}</div>
              <div className="list-meta"><span>{job.company}</span><span>·</span><span>📍 {job.location}</span><Badge v="type">{job.type}</Badge>{job.remote && <Badge v="remote">Remote</Badge>}</div>
            </div>
            <div className="list-right"><div className="j-salary">{job.salary}</div><div className="j-date">{job.date}</div></div>
            <button className={`bk-btn${savedJobs.includes(job.id)?" saved":""}`} style={{position:"static"}} onClick={e => { e.stopPropagation(); onSave(job.id); }}>{savedJobs.includes(job.id) ? "♥" : "♡"}</button>
          </div>
        ))}
        {!filtered.length && <div className="empty-state"><span className="empty-icon">🔍</span><h3>No matches</h3><p>Try relaxing your filters.</p></div>}
      </main>
    </div>
  );
}

function JobDetailPage({ job, savedJobs, onSave, onApply, onCompanyClick }) {
  const company = COMPANIES.find(c => c.id === job.companyId);
  const isSaved = savedJobs.includes(job.id);
  return (
    <div className="detail-wrap fade-in">
      <div className="detail-main">
        <div className="detail-hdr">
          <div className="d-logo-row">
            <CoLogo companyId={job.companyId} fallback={job.logo} color={job.color} bg={job.bg} size={68} radius={18}/>
            <div><div className="d-h1">{job.title}</div><div className="d-coname" onClick={() => company && onCompanyClick(company)}>{job.company} ↗</div></div>
          </div>
          <div className="job-tags"><Badge v="gold">✦ Featured</Badge><Badge v="type">{job.type}</Badge>{job.remote && <Badge v="remote">Remote</Badge>}<Badge v="level">{job.level}</Badge></div>
          <div className="d-facts"><div className="fact">📍 {job.location}</div><div className="fact">🕐 {job.type}</div><div className="fact">📅 {job.date}</div><div className="fact">🎯 {job.level}</div></div>
        </div>
        <div className="dsec fade-in-1"><h3>About the Role</h3><p>{job.description}</p><p>You'll collaborate closely with engineering, product, and leadership. High-impact, high-autonomy — for someone who cares deeply about their craft.</p></div>
        <div className="dsec fade-in-2"><h3>Requirements</h3><ul className="req-list">{job.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
        <div className="dsec fade-in-3"><h3>What We Offer</h3><ul className="req-list"><li>Salary: {job.salary}</li><li>Equity package with 4-year vesting</li><li>Health, dental & vision coverage</li><li>₹1.5L annual learning budget</li><li>Flexible PTO & remote-first culture</li></ul></div>
        {company && <div className="dsec fade-in-4"><h3>About {company.name}</h3><p>{company.about}</p><div style={{display:"flex",gap:".5rem",flexWrap:"wrap",marginTop:".75rem"}}>{company.culture.map(c => <Badge key={c} v="level">{c}</Badge>)}</div></div>}
      </div>
      <div className="detail-side">
        <div className="sticky-card">
          <div className="sc-label">Compensation</div>
          <div className="sc-salary">{job.salary}</div>
          <button className="apply-btn" onClick={onApply}>Apply Now →</button>
          <button className="save-btn" onClick={() => onSave(job.id)}>{isSaved ? "♥ Saved" : "♡ Save Role"}</button>
          <div className="sc-deadline">⏰ Closes in ~2 weeks</div>
          <div className="sc-meta">📍 {job.location}<br/>🕐 {job.type}<br/>{company && <>🏢 {company.size} employees</>}</div>
        </div>
      </div>
    </div>
  );
}

function CompaniesPage({ onCompanyClick }) {
  return (
    <div className="page-stage">
      <div className="section">
        <div className="sec-head"><div><div className="sec-title">Top Companies <em>Hiring Now</em></div><div className="sec-sub">Culture, mission and open roles</div></div></div>
        <div className="co-grid">
          {COMPANIES.map((co, i) => (
            <div key={co.id} className="co-card" style={{animationDelay:`${i*0.07}s`}} onClick={() => onCompanyClick(co)}>
              <div className="co-banner" style={{background:co.bannerBg}}>
                <img src={BANNER_IMGS[co.id]} alt="" className="co-banner-bg" onError={e => e.target.style.display="none"}/>
                <div className="co-banner-overlay"/>
              </div>
              <div className="co-body">
                <div className="co-header">
                  <CoLogo companyId={co.id} fallback={co.logo} color={co.color} bg={co.bg} size={48} radius={12}/>
                  <div style={{marginTop:".2rem"}}><div className="co-name">{co.name}</div><div className="co-ind">{co.industry}</div></div>
                </div>
                <div className="co-desc">{co.about.slice(0,115)}…</div>
                <div className="co-foot"><span className="roles-badge">{co.openRoles} open roles</span><span className="co-size">{co.size} emp.</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompanyDetailPage({ company, jobs, onJobClick }) {
  const cjobs = jobs.filter(j => j.companyId === company.id);
  return (
    <div style={{maxWidth:"1020px",margin:"0 auto",padding:"2rem 2.5rem"}} className="fade-in">
      <div className="dsec" style={{marginBottom:"1.2rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"1.4rem",marginBottom:"1.5rem",flexWrap:"wrap"}}>
          <CoLogo companyId={company.id} fallback={company.logo} color={company.color} bg={company.bg} size={76} radius={20}/>
          <div><div style={{fontFamily:"var(--serif)",fontSize:"1.95rem",fontWeight:700}}>{company.name}</div><div style={{color:"var(--silver)",fontSize:".88rem"}}>{company.industry} · Founded {company.founded} · {company.hq}</div></div>
        </div>
        <p style={{fontSize:".9rem",lineHeight:1.85,color:"#4a4862",marginBottom:"1rem"}}>{company.about}</p>
        <div style={{display:"flex",gap:".65rem",flexWrap:"wrap"}}>
          <div className="fact">🏢 {company.size}</div>
          <div className="fact">📍 {company.hq}</div>
          <div className="fact">📅 Founded {company.founded}</div>
        </div>
      </div>
      <div className="dsec" style={{marginBottom:"1.2rem"}}><h3>Culture & Values</h3><div style={{display:"flex",gap:".75rem",flexWrap:"wrap",marginTop:".5rem"}}>{company.culture.map(c => <div key={c} style={{background:"var(--cream)",padding:".45rem 1rem",borderRadius:"100px",fontSize:".83rem",fontWeight:600}}>{c}</div>)}</div></div>
      <div className="dsec"><h3>Open Roles at {company.name}</h3>
        {cjobs.length ? cjobs.map(job => (
          <div key={job.id} className="list-card" onClick={() => onJobClick(job)} style={{marginTop:".7rem"}}>
            <CoLogo companyId={job.companyId} fallback={job.logo} color={job.color} bg={job.bg} size={44} radius={11}/>
            <div className="list-info"><div style={{fontFamily:"var(--display)",fontWeight:700,fontSize:".94rem"}}>{job.title}</div><div className="list-meta"><span>📍 {job.location}</span><Badge v="type">{job.type}</Badge></div></div>
            <div className="list-right"><div className="j-salary">{job.salary}</div></div>
          </div>
        )) : <p style={{color:"var(--silver)",fontSize:".85rem"}}>No open roles right now.</p>}
      </div>
    </div>
  );
}

function ResumePage({ onUploadDone }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();
  const STAGES = ["Uploading","Parsing","Analysing","Indexing"];

  const handleFile = (f) => {
    if (!f) return;
    setFile({ name:f.name, size:(f.size/1024).toFixed(0)+"KB" });
    setStage(1); setProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 15 + 7;
      if (p >= 100) { clearInterval(iv); setProgress(100); setTimeout(() => { setStage(2); onUploadDone(f.name); }, 450); }
      else setProgress(Math.min(Math.round(p), 99));
    }, 200);
  };

  const curStage = stage === 1 ? Math.floor(progress / 25) : 4;

  return (
    <div className="resume-wrap">
      <div className="pg-h2 fade-in">Upload Your Resume</div>
      <p className="pg-sub fade-in-1">Go live to 1,200+ hiring companies. Upload once — apply everywhere in one click.</p>
      {stage === 0 && (
        <div className={`upload-stage${drag?" drag":""}`}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current.click()}>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{display:"none"}} onChange={e => handleFile(e.target.files[0])}/>
          <div className="up-mesh"/><div className="up-orb up-orb-1"/><div className="up-orb up-orb-2"/>
          <div className="up-grid"/><div className="up-scan-line"/>
          <div className="up-content">
            <div className="up-icon-ring"><span className="up-icon-inner">📄</span></div>
            <div className="up-title">{drag?"Drop it here!":"Drag & Drop Resume"}</div>
            <div className="up-hint">or click to browse your files</div>
            <div className="up-formats">{["PDF","DOC","DOCX"].map(f => <span key={f} className="up-fmt">{f}</span>)}<span className="up-fmt">Max 5MB</span></div>
          </div>
        </div>
      )}
      {stage === 1 && (
        <div className="upload-progress">
          <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.5rem"}}>
            <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,var(--gold-pale),var(--emerald-pale))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",flexShrink:0}}>📎</div>
            <div style={{flex:1}}><div style={{fontFamily:"var(--display)",fontWeight:700,fontSize:".95rem",color:"#fff",marginBottom:2}}>{file?.name}</div><div style={{fontSize:".72rem",color:"rgba(255,255,255,0.3)"}}>{file?.size}</div></div>
            <div style={{fontFamily:"var(--serif)",fontWeight:700,fontSize:"1.2rem",color:"var(--gold-light)"}}>{progress}%</div>
          </div>
          <div className="up-prog-bar"><div className="up-prog-fill" style={{width:`${progress}%`}}/></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:".71rem",color:"rgba(255,255,255,0.28)",marginBottom:".5rem"}}><span>Processing…</span><span style={{color:"var(--gold-light)"}}>AI-powered scan</span></div>
          <div className="up-stages">{STAGES.map((s, i) => <div key={s} className={`up-stage-pill${i===curStage?" active":i<curStage?" done":""}`}><span className="up-stage-dot"/>{i<curStage?"✓ ":""}{s}</div>)}</div>
        </div>
      )}
      {stage === 2 && (
        <div className="upload-success">
          <div className="up-success-icon">✅</div>
          <div className="up-success-title">Resume is Live!</div>
          <div className="up-success-sub">{file?.name} · AI-parsed · Profile updated</div>
          <div className="up-chips">
            <span className="up-chip up-chip-green">✓ Recruiter visible</span>
            <span className="up-chip up-chip-green">✓ Skills extracted</span>
            <span className="up-chip up-chip-gold">⭐ 72% profile strength</span>
            <span className="up-chip">14 matches found</span>
          </div>
          <button style={{background:"none",border:"none",color:"rgba(255,255,255,0.22)",fontFamily:"var(--sans)",fontSize:".74rem",cursor:"pointer",marginTop:".8rem"}} onClick={() => { setStage(0); setFile(null); }}>Upload different file</button>
        </div>
      )}
      <div className="resume-form fade-in-3">
        <div className="rf-title">Profile Details</div>
        <div className="fgrid">
          <div className="fg2"><label>First Name</label><input placeholder="Priya"/></div>
          <div className="fg2"><label>Last Name</label><input placeholder="Sharma"/></div>
          <div className="fg2"><label>Email</label><input type="email" placeholder="priya@example.com"/></div>
          <div className="fg2"><label>Phone</label><input placeholder="+91 98765 43210"/></div>
          <div className="fg2"><label>Current Role</label><input placeholder="Senior Product Designer"/></div>
          <div className="fg2"><label>Desired CTC</label><input placeholder="₹25,00,000"/></div>
          <div className="fg2 fcol2"><label>Brief Bio</label><textarea placeholder="A short intro about yourself…"/></div>
          <div className="fg2"><label>LinkedIn</label><input placeholder="linkedin.com/in/priyasharma"/></div>
          <div className="fg2"><label>Portfolio</label><input placeholder="priyasharma.com"/></div>
        </div>
        <button className="sub-btn" onClick={() => onUploadDone("profile_resume.pdf")}>Save & Go Live →</button>
      </div>
    </div>
  );
}

function SavedPage({ savedJobs, jobs, onJobClick, onSave }) {
  const saved = jobs.filter(j => savedJobs.includes(j.id));
  if (!saved.length) return (
    <div className="empty-state"><span className="empty-icon">♡</span><h3>No saved roles yet</h3><p>Bookmark roles and they'll appear here.</p></div>
  );
  return (
    <div className="section page-stage">
      <div className="sec-head"><div><div className="sec-title"><em>Saved</em> Roles</div><div className="sec-sub">{saved.length} role{saved.length!==1?"s":""} bookmarked</div></div></div>
      <div className="jobs-grid">{saved.map((job, i) => <JobCard key={job.id} job={job} saved onSave={onSave} onClick={onJobClick} delay={i*0.07}/>)}</div>
    </div>
  );
}

function ContactPage({ onToast }) {
  const [tab, setTab] = useState("seeker");
  return (
    <div className="contact-wrap">
      <div className="pg-h2 fade-in">Get in Touch</div>
      <p className="pg-sub fade-in-1">Whether you're hiring or searching — we're here to help.</p>
      <div className="ctabs">
        <button className={`ctab${tab==="seeker"?" active":""}`} onClick={() => setTab("seeker")}>Job Seeker</button>
        <button className={`ctab${tab==="employer"?" active":""}`} onClick={() => setTab("employer")}>Employer</button>
      </div>
      {tab === "seeker" && (
        <div className="contact-box fade-in">
          <div className="cb-h3">Need help with your search?</div>
          <p className="cb-desc">Tell us about your account or a listing issue.</p>
          <div className="fgrid">
            <div className="fg2"><label>Name</label><input placeholder="Your name"/></div>
            <div className="fg2"><label>Email</label><input placeholder="your@email.com"/></div>
            <div className="fg2 fcol2"><label>Subject</label><select><option>General Inquiry</option><option>Account Issue</option><option>Report a Listing</option><option>Other</option></select></div>
            <div className="fg2 fcol2"><label>Message</label><textarea placeholder="Tell us what's on your mind…" rows="5"/></div>
          </div>
          <button className="sub-btn" onClick={() => onToast("✉️ Message sent! We'll reply within 24h.")}>Send Message</button>
        </div>
      )}
      {tab === "employer" && (
        <div className="contact-box fade-in">
          <div className="cb-h3">Post a job or partner with us</div>
          <p className="cb-desc">Reach thousands of qualified candidates.</p>
          <div className="fgrid">
            <div className="fg2"><label>Your Name</label><input placeholder="Jane Smith"/></div>
            <div className="fg2"><label>Company</label><input placeholder="Acme Corp"/></div>
            <div className="fg2"><label>Work Email</label><input placeholder="jane@company.com"/></div>
            <div className="fg2"><label>Team Size</label><select><option>1–10</option><option>11–50</option><option>51–200</option><option>201–1000</option><option>1000+</option></select></div>
            <div className="fg2 fcol2"><label>Inquiry</label><select><option>Post a Job</option><option>Bulk Listings</option><option>Sponsorship</option><option>Other</option></select></div>
            <div className="fg2 fcol2"><label>Details</label><textarea placeholder="Describe your hiring needs…" rows="4"/></div>
          </div>
          <button className="sub-btn" onClick={() => onToast("🏢 Thanks! Our team will reach out shortly.")}>Submit Inquiry</button>
        </div>
      )}
    </div>
  );
}

function SocialPage({ onToast, visible }) {
  return (
    <div className="social-wrap">
      <div className="pg-h2 fade-in">Connect with Us</div>
      <p className="pg-sub fade-in-1">Follow us for job drops, career tips, and community updates.</p>
      <div className="ads-banner fade-in-2">
        <div className="ads-badge">⚡ Advertise with Us</div>
        <div className="ads-title">Reach 200K+ active job seekers</div>
        <div className="ads-sub">Promote open roles and employer brand to qualified candidates across India and globally.</div>
        <div className="ads-grid">
          {[["200K+","Monthly Reach"],["8.4%","Avg. CTR"],["94K","Hires Tracked"],["₹3,200","Avg. CPL"]].map(([n,l]) => (
            <div key={l} className="ads-stat-card"><span className="ads-stat-num">{n}</span><span className="ads-stat-lbl">{l}</span></div>
          ))}
        </div>
        <button className="ads-cta" onClick={() => onToast("📣 Our ads team will be in touch!")}>Get Media Kit →</button>
      </div>
      <div className="social-grid">
        {SOCIALS.map((s, i) => (
          <a key={s.name} className="social-card" href={s.url} target="_blank" rel="noopener noreferrer"
            style={{background:s.gradient,border:`1px solid ${s.border}`,color:"#fff",animationDelay:`${i*0.07}s`}}
            onClick={e => { e.preventDefault(); onToast(`Opening ${s.name}…`); setTimeout(() => window.open(s.url,"_blank"), 300); }}>
            <div className="sc-logo" style={{background:s.logoBg,color:"#fff"}}>{s.logo}</div>
            <div className="sc-name">{s.name}</div>
            <div className="sc-handle">{s.handle}</div>
            <div className="sc-stats">
              <div className="sc-stat"><strong>{s.followers}</strong>Followers</div>
              <div className="sc-stat"><strong>{s.posts}</strong>{s.name==="Discord"?"Online":"Posts"}</div>
            </div>
            <div className="sc-follow">Follow →</div>
          </a>
        ))}
      </div>
      <div className="nl-box fade-in-3">
        <div style={{fontSize:"2rem",marginBottom:".5rem"}}>📬</div>
        <div className="nl-title">Weekly Job Digest</div>
        <p className="nl-sub">Top 10 curated roles every Monday. No noise, ever.</p>
        <div className="nl-form">
          <input className="nl-input" placeholder="your@email.com" type="email"/>
          <button className="nl-btn" onClick={() => onToast("🎉 Subscribed to weekly digest!")}>Subscribe</button>
        </div>
      </div>
      <div className="community-strip fade-in-4">
        {[["48200","Twitter"],["112000","LinkedIn"],["14900","Discord"],["6100","GitHub"]].map(([n,l]) => (
          <div key={l} className="comm-item">
            <span className="comm-num"><CountUp value={parseInt(n)} suffix={parseInt(n)>=1000?"K":""} duration={1600} start={visible}/></span>
            <span className="comm-label">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlansPage({ onToast, visible }) {
  const [billing, setBilling] = useState("annual");
  const [faqOpen, setFaqOpen] = useState(null);
  const [confirmPlan, setConfirmPlan] = useState(null);

  const prices = { free:{monthly:0,annual:0}, pro:{monthly:19,annual:14}, elite:{monthly:39,annual:29}, recruiter:{monthly:99,annual:74} };
  const pr = (k) => prices[k][billing];

  const PLANS = [
    { key:"free", tier:"Starter", name:"Free", desc:"Everything to kickstart your search.", btn:"Get Started", btnCls:"btn-outline", features:[{y:true,t:"Browse all 8,400+ roles"},{y:true,t:"Save up to 5 jobs"},{y:true,t:"Basic profile & resume upload"},{y:true,t:"Weekly email alerts"},{y:false,t:"Priority application badge",d:true},{y:false,t:"Recruiter visibility",d:true},{y:false,t:"AI resume match score",d:true},{y:false,t:"Salary insights",d:true}] },
    { key:"pro", tier:"Most Popular", name:"Pro", featured:true, desc:"AI-powered tools to accelerate your search.", btn:"Start Free Trial", btnCls:"btn-gold", features:[{y:true,t:"Everything in Free"},{y:true,t:"Unlimited saved jobs"},{y:true,t:"Priority application badge"},{y:true,t:"Recruiter profile visibility"},{y:true,t:"AI resume match score"},{y:true,t:"Daily email & SMS alerts"},{y:false,t:"1-click apply",d:true},{y:false,t:"Dedicated career coach",d:true}] },
    { key:"elite", tier:"Power User", name:"Elite", desc:"Complete career toolkit for serious professionals.", btn:"Go Elite", btnCls:"btn-emerald", features:[{y:true,t:"Everything in Pro"},{y:true,t:"1-click apply"},{y:true,t:"Salary insights & benchmarks"},{y:true,t:"Application tracker dashboard"},{y:true,t:"Interview prep resources"},{y:true,t:"LinkedIn optimizer"},{y:true,t:"Monthly career coach call"},{y:false,t:"Custom talent branding",d:true}] },
    { key:"recruiter", tier:"For Teams", name:"Recruiter", desc:"Post jobs, search candidates, manage pipelines.", btn:"Start Hiring", btnCls:"btn-dark", features:[{y:true,t:"Post unlimited listings"},{y:true,t:"Full candidate database"},{y:true,t:"Advanced search & filters"},{y:true,t:"Branded company page"},{y:true,t:"ATS integrations"},{y:true,t:"Analytics & reports"},{y:true,t:"Dedicated account manager"},{y:true,t:"Custom talent branding"}] },
  ];

  const CAREER_PLANS = [
    {icon:"🚀",title:"Launchpad",desc:"For freshers & career starters",price:"Free"},
    {icon:"📈",title:"Growth Track",desc:"1–5 year professionals",price:"₹999/mo"},
    {icon:"🏆",title:"Leadership Path",desc:"Senior to Director transitions",price:"₹2,499/mo"},
    {icon:"🌍",title:"Global Mobility",desc:"International job hunting",price:"₹3,999/mo"},
    {icon:"🔄",title:"Career Switch",desc:"Industry change specialists",price:"₹1,999/mo"},
    {icon:"💼",title:"Executive Suite",desc:"C-suite & VP placement",price:"Custom"},
  ];

  const COMPARE_ROWS = [
    {feat:"Job access",free:"Limited",pro:"All 8,400+",elite:"All 8,400+",rec:"Post + browse"},
    {feat:"Saved jobs",free:"5",pro:"Unlimited",elite:"Unlimited",rec:"N/A"},
    {feat:"AI resume match",free:false,pro:true,elite:true,rec:true},
    {feat:"Priority badge",free:false,pro:true,elite:true,rec:false},
    {feat:"1-click apply",free:false,pro:false,elite:true,rec:false},
    {feat:"Job alerts",free:"Weekly",pro:"Daily",elite:"Instant",rec:"N/A"},
    {feat:"Salary insights",free:false,pro:false,elite:true,rec:true},
    {feat:"Interview prep",free:false,pro:false,elite:true,rec:false},
    {feat:"Job post credits",free:false,pro:false,elite:false,rec:"Unlimited"},
    {feat:"Candidate search",free:false,pro:false,elite:false,rec:true},
    {feat:"ATS integration",free:false,pro:false,elite:false,rec:true},
  ];

  const FAQS = [
    {q:"Can I cancel anytime?",a:"Yes — no lock-ins, no fees. Cancel from your account settings in seconds."},
    {q:"Is there a free trial for Pro?",a:"Yes! Pro comes with a 14-day free trial, no credit card required."},
    {q:"How does AI resume matching work?",a:"Our AI analyses your resume against each listing, scoring fit across 12 dimensions including skills, seniority, and cultural fit."},
    {q:"What payment methods are accepted?",a:"All major cards (Visa, Mastercard, Amex), UPI (PhonePe, GPay, Paytm, BHIM), and Net Banking for HDFC, SBI, ICICI, and Axis Bank."},
    {q:"Can I switch plans mid-cycle?",a:"Upgrades are prorated and instant. Downgrades take effect at the next billing cycle."},
    {q:"Are there student discounts?",a:"Students with a .edu email get 50% off Pro. Non-profits get 30% off all plans."},
  ];

  const handlePlan = (plan) => {
    if (plan.key === "free") { onToast("🚀 You're already on the Free plan!"); return; }
    setConfirmPlan(plan);
  };

  return (
    <div className="plans-wrap">
      <div className="plans-hero fade-in">
        <div className="plans-badge">✦ Simple, Transparent Pricing</div>
        <div className="plans-h1">Invest in your <em>career</em></div>
        <p className="plans-p">Plans that grow with you — from first job search to hiring at scale.</p>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:".6rem",marginBottom:"3rem"}}>
          <div className="billing-toggle">
            <button className={`billing-opt${billing==="monthly"?" active":""}`} onClick={() => setBilling("monthly")}>Monthly</button>
            <button className={`billing-opt${billing==="annual"?" active":""}`} onClick={() => setBilling("annual")}>Annual <span className="billing-save">Save 25%</span></button>
          </div>
          {billing === "annual" && <div style={{fontSize:".77rem",color:"var(--emerald-dark)",fontWeight:600}}>✓ Billed annually · Cancel anytime</div>}
        </div>
      </div>

      <div style={{display:"flex",justifyContent:"center",gap:"3rem",marginBottom:"3rem",flexWrap:"wrap"}} className="fade-in-1">
        {[["8400","Jobs Listed","+"],[" 94","K Hires",""],[" 200","K Users","+"],[" 99","% Uptime",""]].map(([n,l,s]) => (
          <div key={l} style={{textAlign:"center"}}>
            <div style={{fontFamily:"var(--serif)",fontSize:"2.2rem",fontStyle:"italic",color:"var(--gold-dark)",lineHeight:1,fontWeight:700}}>
              <CountUp value={parseInt(n.trim())} suffix={s} duration={1600} start={visible}/>
            </div>
            <div style={{fontSize:".71rem",color:"var(--silver)",textTransform:"uppercase",letterSpacing:".09em",fontWeight:700,marginTop:"5px",fontFamily:"var(--display)"}}>{l}</div>
          </div>
        ))}
      </div>

      <div className="plans-grid">
        {PLANS.map((plan, i) => (
          <div key={plan.key} className={`plan-card${plan.featured?" featured":""}`} style={{animationDelay:`${i*0.09}s`}}>
            {plan.featured && <div className="plan-badge">⭐ Most Popular</div>}
            <div className="plan-tier">{plan.tier}</div>
            <div className="plan-name">{plan.name}</div>
            <div className="plan-desc">{plan.desc}</div>
            <div className="plan-price-row">
              {pr(plan.key) > 0 && <span className="plan-currency">$</span>}
              <span className="plan-amount">
                {pr(plan.key) === 0 ? "Free" : <CountUp value={pr(plan.key)} duration={700} start={visible}/>}
              </span>
              {pr(plan.key) > 0 && <span className="plan-period">/mo</span>}
            </div>
            {pr(plan.key) > 0 && billing === "annual" && <div className="plan-save-note">Billed ${pr(plan.key)*12}/yr · Save ${(prices[plan.key].monthly-prices[plan.key].annual)*12}/yr</div>}
            {pr(plan.key) === 0 && <div className="plan-save-note" style={{visibility:"hidden"}}>_</div>}
            <hr className="plan-divider"/>
            <ul className="plan-features">
              {plan.features.map((f, j) => (
                <li key={j} className="plan-feature">
                  <span className={`plan-check ${f.y?"yes":"no"}`}>{f.y?"✓":"×"}</span>
                  <span className={`feat-text${f.d?" dim":""}`}>{f.t}</span>
                </li>
              ))}
            </ul>
            <button className={`plan-btn ${plan.btnCls}`} onClick={() => handlePlan(plan)}>{plan.btn}</button>
          </div>
        ))}
      </div>

      <div className="career-plans-strip">
        <div style={{position:"relative",zIndex:1}}>
          <div className="cp-title">Specialised <em>Career Plans</em></div>
          <div className="cp-sub">Beyond job listings — personalised coaching, mentorship, and career acceleration programmes.</div>
          <div className="cp-grid">
            {CAREER_PLANS.map((cp, i) => (
              <div key={cp.title} className="cp-card" onClick={() => onToast(`Opening ${cp.title} details…`)}>
                <span className="cp-card-icon">{cp.icon}</span>
                <div className="cp-card-title">{cp.title}</div>
                <div className="cp-card-desc">{cp.desc}</div>
                <div className="cp-card-price">{cp.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="plans-compare fade-in-2">
        <div className="compare-head"><h3>Full Feature Comparison</h3></div>
        <div style={{overflowX:"auto"}}>
          <table className="compare-table">
            <thead><tr><th style={{width:"34%"}}>Feature</th><th>Free</th><th className="ct-gold">Pro</th><th>Elite</th><th>Recruiter</th></tr></thead>
            <tbody>
              {COMPARE_ROWS.map((row, i) => (
                <tr key={i}>
                  <td style={{fontWeight:500}}>{row.feat}</td>
                  {["free","pro","elite","rec"].map(k => (
                    <td key={k} className={k==="pro"?"ct-gold":""}>
                      {row[k]===true?<span className="ct-check">✓</span>:row[k]===false?<span className="ct-x">—</span>:<span style={{fontSize:".79rem",color:"var(--silver)"}}>{row[k]}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="fade-in-3" style={{marginBottom:"3rem"}}>
        <div className="faq-title">Frequently Asked Questions</div>
        {FAQS.map((f, i) => (
          <div key={i} className="faq-item">
            <div className="faq-q" onClick={() => setFaqOpen(faqOpen===i?null:i)}>
              <span>{f.q}</span>
              <span className={`faq-arrow${faqOpen===i?" open":""}`}>▾</span>
            </div>
            {faqOpen===i && <div className="faq-a">{f.a}</div>}
          </div>
        ))}
      </div>

      <div className="enterprise-strip fade-in-4">
        <div className="enterprise-text">
          <h3>Need a custom enterprise plan?</h3>
          <p>SSO, custom integrations, volume hiring, and dedicated account management. Trusted by 200+ enterprises.</p>
        </div>
        <button className="enterprise-btn" onClick={() => onToast("📞 Enterprise team will reach out within 24h!")}>Talk to Sales →</button>
      </div>

      {confirmPlan && (
        <PlanConfirmModal
          plan={confirmPlan} billing={billing}
          price={billing==="annual" ? pr(confirmPlan.key)*12 : pr(confirmPlan.key)}
          onClose={() => setConfirmPlan(null)}
          onSuccess={() => { setConfirmPlan(null); onToast(`🎉 Welcome to ${confirmPlan.name}! All features unlocked.`); }}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════
// APP SHELL
// ══════════════════════════════════════════
export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [pendingPage, setPendingPage] = useState(null);
  const [pageVisible, setPageVisible] = useState(false);

  const [page, setPage] = useState("home");
  const [selJob, setSelJob] = useState(null);
  const [selCo, setSelCo] = useState(null);
  const [savedJobs, setSavedJobs] = useState([1,4]);
  const [toast, setToast] = useState(null);
  const [applyModal, setApplyModal] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const toastRef = useRef();
  const notifRef = useRef();

  useEffect(() => () => { if (toastRef.current) clearTimeout(toastRef.current); }, []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    const fn = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenu]);

  const showToast = (msg) => {
    if (toastRef.current) clearTimeout(toastRef.current);
    setToast(msg);
    toastRef.current = setTimeout(() => setToast(null), 3800);
  };

  const nav = useCallback((newPage, jobArg, coArg) => {
    if (transitioning) return;
    if (newPage === page && !jobArg && !coArg) return;
    setMobileMenu(false); setNotifOpen(false);
    setPendingPage({ page:newPage, job:jobArg, co:coArg });
    setTransitioning(true); setPageVisible(false);
  }, [page, transitioning]);

  const onTransitionDone = useCallback(() => {
    if (!pendingPage) return;
    setPage(pendingPage.page);
    if (pendingPage.job) setSelJob(pendingPage.job);
    else if (pendingPage.co) setSelCo(pendingPage.co);
    else { setSelJob(null); setSelCo(null); }
    setTransitioning(false); setPendingPage(null);
    window.scrollTo({ top:0, behavior:"auto" });
    setTimeout(() => setPageVisible(true), 120);
  }, [pendingPage]);

  const onInitialDone = useCallback(() => {
    setInitialLoading(false);
    setTimeout(() => setPageVisible(true), 200);
  }, []);

  const toggleSave = (id) => {
    const was = savedJobs.includes(id);
    setSavedJobs(prev => was ? prev.filter(x => x !== id) : [...prev, id]);
    showToast(was ? "Removed from saved ♡" : "Saved to bookmarks ♥");
  };

  const goJob = (job) => nav("detail", job, null);
  const goCo  = (co)  => nav("company", null, co);

  const NAV_ITEMS = [{key:"home",l:"Home"},{key:"listings",l:"Jobs"},{key:"companies",l:"Companies"},{key:"social",l:"Community"},{key:"contact",l:"Contact"}];
  const isListActive = page === "listings" || page === "detail";

  const renderPage = () => {
    switch(page) {
      case "home":      return <HomePage onJobClick={goJob} onNav={nav} savedJobs={savedJobs} onSave={toggleSave} visible={pageVisible}/>;
      case "listings":  return <ListingsPage onJobClick={goJob} savedJobs={savedJobs} onSave={toggleSave}/>;
      case "detail":    return selJob ? <JobDetailPage job={selJob} savedJobs={savedJobs} onSave={toggleSave} onApply={() => setApplyModal(selJob)} onCompanyClick={goCo}/> : null;
      case "companies": return <CompaniesPage onCompanyClick={goCo}/>;
      case "company":   return selCo ? <CompanyDetailPage company={selCo} jobs={JOBS} onJobClick={goJob}/> : null;
      case "resume":    return <ResumePage onUploadDone={() => showToast("📄 Resume is live to 1,200+ recruiters!")}/>;
      case "saved":     return <SavedPage savedJobs={savedJobs} jobs={JOBS} onJobClick={goJob} onSave={toggleSave}/>;
      case "contact":   return <ContactPage onToast={showToast}/>;
      case "social":    return <SocialPage onToast={showToast} visible={pageVisible}/>;
      case "plans":     return <PlansPage onToast={showToast} visible={pageVisible}/>;
      default:          return <HomePage onJobClick={goJob} onNav={nav} savedJobs={savedJobs} onSave={toggleSave} visible={pageVisible}/>;
    }
  };

  return (
    <>
      <style>{css}</style>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>

      {initialLoading && <InitialLoader onDone={onInitialDone}/>}
      {transitioning && pendingPage && <PageTransition pageName={pendingPage.page} onDone={onTransitionDone}/>}

      <div className="app" style={{ opacity:initialLoading?0:1, transition:"opacity 0.6s ease" }}>
        {/* NAVBAR */}
        <nav className={`nav${scrolled?" scrolled":""}`}>
          <div className="nav-logo" onClick={() => nav("home")}>
            <div className="logo-gem"><span className="logo-gem-icon">💎</span></div>
            <div className="logo-name">Work<em>Board</em></div>
          </div>
          <div className="nav-search-wrap">
            <div className="nav-search-inner">
              <span className="nav-search-icon">🔍</span>
              <input className="nav-search-input" placeholder="Search roles, companies…"/>
              <span className="nav-search-kbd">⌘K</span>
            </div>
          </div>
          <div className="nav-center">
            {NAV_ITEMS.map(item => (
              <button key={item.key} className={`nav-item${(item.key==="listings"?isListActive:page===item.key)?" active":""}`} onClick={() => nav(item.key)}>{item.l}</button>
            ))}
          </div>
          <div className="nav-right">
            <div style={{position:"relative"}} ref={notifRef}>
              <div className="nav-bell" onClick={() => setNotifOpen(v => !v)}>🔔<span className="bell-dot"/></div>
              {notifOpen && (
                <div className="notif-dropdown">
                  <div className="notif-header"><span className="notif-title">Notifications</span><button className="notif-clear" onClick={() => setNotifOpen(false)}>Mark all read</button></div>
                  {NOTIFICATIONS.map((n, i) => (
                    <div key={i} className="notif-item" onClick={() => setNotifOpen(false)}>
                      <div className="notif-dot" style={{background:n.color}}/><div><div className="notif-text">{n.text}</div><span className="notif-time">{n.time}</span></div>
                    </div>
                  ))}
                  <div className="notif-footer"><button className="notif-footer-btn" onClick={() => setNotifOpen(false)}>View all →</button></div>
                </div>
              )}
            </div>
            <div className="saved-pill" onClick={() => nav("saved")}><div className="saved-count">{savedJobs.length}</div><span>Saved</span></div>
            <button className="nav-plans-btn" onClick={() => nav("plans")}>💎 Plans</button>
            <button className="nav-cta" onClick={() => nav("resume")}>Upload Resume</button>
            <button className="nav-mobile-toggle" onClick={() => setMobileMenu(v => !v)} aria-label="Menu">
              {mobileMenu ? "✕" : "☰"}
            </button>
          </div>
        </nav>

        {/* MOBILE MENU */}
        <div className={`nav-mobile-menu${mobileMenu?" open":""}`}>
          {NAV_ITEMS.map(item => (
            <button key={item.key} className={`nav-mobile-item${(item.key==="listings"?isListActive:page===item.key)?" active":""}`} onClick={() => nav(item.key)}>{item.l}</button>
          ))}
          <button className="nav-mobile-item" onClick={() => nav("saved")}>Saved Roles ({savedJobs.length})</button>
          <div className="nav-mobile-divider"/>
          <div style={{display:"flex",flexDirection:"column",gap:".7rem"}}>
            <button className="nav-mobile-plans" onClick={() => nav("plans")}>💎 View Plans</button>
            <button className="nav-mobile-cta" onClick={() => nav("resume")}>Upload Resume</button>
          </div>
        </div>

        {/* PAGE */}
        <div className="page-wrap">
          {(page==="detail"||page==="company") && (
            <div className="breadcrumb">
              <button className="bc-btn" onClick={() => nav("home")}>Home</button><span>›</span>
              {page==="detail" && <><button className="bc-btn" onClick={() => nav("listings")}>Jobs</button><span>›</span><span>{selJob?.title}</span></>}
              {page==="company" && <><button className="bc-btn" onClick={() => nav("companies")}>Companies</button><span>›</span><span>{selCo?.name}</span></>}
            </div>
          )}
          {renderPage()}
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-top">
              <div className="footer-brand">
                <div className="footer-logo">Work<em>Board</em></div>
                <p>Connecting exceptional talent with companies building the future. No ghost jobs, no spam.</p>
              </div>
              <div className="footer-links"><h4>Job Seekers</h4><a onClick={() => nav("listings")}>Browse Jobs</a><a onClick={() => nav("resume")}>Upload Resume</a><a onClick={() => nav("saved")}>Saved Roles</a><a onClick={() => nav("plans")}>Pricing Plans</a></div>
              <div className="footer-links"><h4>Employers</h4><a onClick={() => nav("plans")}>Post a Job</a><a onClick={() => nav("contact")}>Contact Sales</a><a>Talent Search</a><a>Recruiter Plan</a></div>
              <div className="footer-links"><h4>Community</h4><a onClick={() => nav("social")}>Social Media</a><a href="https://discord.gg" target="_blank" rel="noopener noreferrer">Discord Server</a><a onClick={() => nav("social")}>Newsletter</a><a>Career Blog</a></div>
            </div>
            <div className="footer-bottom">
              <span>© 2026 WorkBoard · Built with intention · All rights reserved</span>
              <div className="footer-socials">
                {[{i:"𝕏",u:"https://twitter.com"},{i:"in",u:"https://linkedin.com"},{i:"▶",u:"https://youtube.com"},{i:"📸",u:"https://instagram.com"}].map(({i,u},idx) => (
                  <a key={idx} className="fsoc" href={u} target="_blank" rel="noopener noreferrer" onClick={e => { e.preventDefault(); showToast("Opening…"); setTimeout(() => window.open(u,"_blank"), 250); }}>{i}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>

        {/* TOAST */}
        {toast && (
          <div className="toast">
            <div className="toast-icon">✦</div>
            <span>{toast}</span>
            <button className="toast-dismiss" onClick={() => setToast(null)}>✕</button>
          </div>
        )}

        {applyModal && <ApplyModal job={applyModal} onClose={() => { setApplyModal(null); showToast("🎉 Application submitted!"); }}/>}
      </div>
    </>
  );
}