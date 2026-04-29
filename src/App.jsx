import { useState, useRef, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #08070f; --surface: #ffffff; --paper: #f7f6fb; --cream: #efedf8;
    --violet: #5b36f2; --violet-mid: #7255f4; --violet-light: #9b7ff7; --violet-pale: #ede8ff;
    --teal: #00c9a7; --teal-pale: #d6fdf6; --rose: #f24b6e; --rose-pale: #fde8ed;
    --amber: #f5a623; --amber-pale: #fef3d8; --muted: #8b8899; --muted2: #b8b5c8;
    --border: #e8e5f2; --border2: #cdc9e8;
    --gold: #f59e0b; --gold-pale: #fef3c7;
    --serif: 'Fraunces', Georgia, serif;
    --display: 'Bricolage Grotesque', system-ui, sans-serif;
    --sans: 'DM Sans', system-ui, sans-serif;
    --r-sm: 8px; --r-md: 14px; --r-lg: 20px; --r-xl: 30px;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--paper); color: var(--ink); font-family: var(--sans); min-height: 100vh; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
  .app { display: flex; flex-direction: column; min-height: 100vh; }
  .page-wrap { flex: 1; position: relative; }

  /* ── PAGE STAGE ANIMATION ── */
  .page-stage {
    position: relative;
    animation: pageReveal 0.65s cubic-bezier(.22,1,.36,1) both;
    transform-origin: top center;
  }
  .page-stage::before {
    content:'';
    position:absolute;
    inset:0 auto auto 50%;
    width:min(72vw,920px);
    height:220px;
    transform:translateX(-50%);
    background:radial-gradient(circle,rgba(91,54,242,0.09),transparent 68%);
    pointer-events:none;
    filter:blur(24px);
    animation:pageGlow 4.5s ease-in-out infinite;
    z-index:0;
  }
  .page-stage > * { position: relative; z-index: 1; }

  /* ══════════════════════════════════════════
     ALL ANIMATIONS
  ══════════════════════════════════════════ */
  @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideRight { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
  @keyframes floatCard { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-12px) rotate(0.5deg)} }
  @keyframes logoGlow { 0%,100%{box-shadow:0 0 0 0 rgba(91,54,242,0.5)} 50%{box-shadow:0 0 0 10px rgba(91,54,242,0)} }
  @keyframes breathe { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.35;transform:scale(0.8)} }
  @keyframes toastIn { from{opacity:0;transform:translateX(70px) scale(0.88)} to{opacity:1;transform:translateX(0) scale(1)} }
  @keyframes modalIn { from{opacity:0;transform:scale(0.88) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes overlayIn { from{opacity:0} to{opacity:1} }
  @keyframes checkPop { 0%{transform:scale(0) rotate(-45deg);opacity:0} 60%{transform:scale(1.25) rotate(5deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
  @keyframes cardEntrance { from{opacity:0;transform:translateY(40px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes heartBeat { 0%,100%{transform:scale(1)} 14%{transform:scale(1.35)} 28%{transform:scale(1)} 42%{transform:scale(1.25)} 70%{transform:scale(1)} }
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes bellShake { 0%,100%{transform:rotate(0deg)} 20%{transform:rotate(-15deg)} 40%{transform:rotate(12deg)} 60%{transform:rotate(-8deg)} 80%{transform:rotate(5deg)} }
  @keyframes notifPop { from{opacity:0;transform:scale(0.7) translateY(-10px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes scanLine { 0%{top:5%} 100%{top:88%} }
  @keyframes uploadPulse { 0%,100%{box-shadow:0 0 0 0 rgba(91,54,242,0.4)} 50%{box-shadow:0 0 0 20px rgba(91,54,242,0)} }
  @keyframes progressShimmer { 0%{background-position:-200px 0} 100%{background-position:200px 0} }
  @keyframes fileFloat { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-8px) rotate(1deg)} }
  @keyframes orbFloat { 0%{transform:translate(0,0)} 33%{transform:translate(20px,-15px)} 66%{transform:translate(-15px,10px)} 100%{transform:translate(0,0)} }
  @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(91,54,242,0.3)} 50%{box-shadow:0 0 40px rgba(91,54,242,0.6)} }
  @keyframes priceIn { from{opacity:0;transform:scale(0.8) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes shimmerSlide { 0%{left:-100%} 100%{left:200%} }
  @keyframes dotPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:0.6} }
  @keyframes navbarIn { from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }
  @keyframes ringPop { 0%{transform:scale(0.5);opacity:1} 100%{transform:scale(2.5);opacity:0} }
  @keyframes pageReveal { from{opacity:0;transform:translateY(24px) scale(0.985);filter:blur(8px)} to{opacity:1;transform:translateY(0) scale(1);filter:blur(0)} }
  @keyframes pageGlow { 0%,100%{opacity:0.35;transform:translateX(-50%) scale(1)} 50%{opacity:0.7;transform:translateX(-50%) scale(1.08)} }
  @keyframes premiumSweep { 0%{transform:translateX(-130%) skewX(-18deg)} 100%{transform:translateX(260%) skewX(-18deg)} }
  @keyframes premiumHalo { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.85;transform:scale(1.18)} }
  @keyframes methodPulse { 0%,100%{box-shadow:0 0 0 0 rgba(91,54,242,0.12)} 50%{box-shadow:0 0 0 8px rgba(91,54,242,0)} }
  @keyframes successOrb { 0%{transform:translateY(0) scale(1)} 50%{transform:translateY(-10px) scale(1.04)} 100%{transform:translateY(0) scale(1)} }
  @keyframes cardFlip3D {
    0%   { opacity:0; transform:perspective(700px) rotateY(-22deg) translateY(32px) scale(0.93); }
    60%  { transform:perspective(700px) rotateY(4deg) translateY(-4px) scale(1.01); }
    100% { opacity:1; transform:perspective(700px) rotateY(0deg) translateY(0) scale(1); }
  }
  @keyframes featuredGlow {
    0%,100% { box-shadow:0 12px 40px rgba(91,54,242,0.10); }
    50%     { box-shadow:0 20px 64px rgba(91,54,242,0.30), 0 0 0 1px rgba(91,54,242,0.18); }
  }
  @keyframes tagSlideIn {
    0%   { opacity:0; transform:translateX(-14px) scale(0.8); }
    70%  { transform:translateX(3px) scale(1.05); }
    100% { opacity:1; transform:translateX(0) scale(1); }
  }
  @keyframes salaryReveal {
    0%   { opacity:0; transform:translateY(10px) scale(0.85); }
    100% { opacity:1; transform:translateY(0) scale(1); }
  }
  @keyframes topBarDraw {
    from { transform:scaleX(0); transform-origin:left; }
    to   { transform:scaleX(1); transform-origin:left; }
  }
  @keyframes kicherPulse {
    0%,100% { box-shadow:0 0 0 0 rgba(91,54,242,0.35); }
    50%     { box-shadow:0 0 0 6px rgba(91,54,242,0); }
  }
  @keyframes logoPopIn {
    0%   { opacity:0; transform:scale(0.5) rotate(-15deg); }
    65%  { transform:scale(1.12) rotate(4deg); }
    100% { opacity:1; transform:scale(1) rotate(0deg); }
  }
  @keyframes pageSlideUp {
    from { opacity:0; transform:translateY(40px) scale(0.97); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  @keyframes pageSlideLeft {
    from { opacity:0; transform:translateX(50px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes sectionFadeUp {
    from { opacity:0; transform:translateY(30px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes confirmRingExpand {
    0%   { transform:scale(0.3); opacity:0; }
    50%  { transform:scale(1.18); opacity:1; }
    100% { transform:scale(1); opacity:1; }
  }
  @keyframes confirmCheckDraw {
    from { stroke-dashoffset:80; }
    to   { stroke-dashoffset:0; }
  }
  @keyframes confirmParticle {
    0%   { opacity:1; transform:translate(0,0) scale(1); }
    100% { opacity:0; transform:translate(var(--px),var(--py)) scale(0.2) rotate(var(--pr)); }
  }
  @keyframes confirmStagger {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes confettiBurst {
    0%   { opacity:1; transform:translateY(0) rotate(0deg) scale(1); }
    100% { opacity:0; transform:translateY(var(--cy)) translateX(var(--cx)) rotate(var(--cr)) scale(0.3); }
  }
  @keyframes methodSlideIn {
    from { opacity:0; transform:translateY(16px) scale(0.92); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  @keyframes bankCardSlide {
    from { opacity:0; transform:translateX(-22px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes upiPopIn {
    0%   { opacity:0; transform:scale(0.4) rotate(-25deg); }
    60%  { transform:scale(1.18) rotate(5deg); }
    100% { opacity:1; transform:scale(1) rotate(0); }
  }
  @keyframes planConfirmIn {
    from { opacity:0; transform:scale(0.82) translateY(28px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }
  @keyframes statCardPop {
    0%   { opacity:0; transform:scale(0.7) translateY(10px); }
    65%  { transform:scale(1.06); }
    100% { opacity:1; transform:scale(1) translateY(0); }
  }
  @keyframes successPulseRing {
    0%   { transform:scale(1); opacity:0.7; }
    100% { transform:scale(2.2); opacity:0; }
  }

  .fade-in   { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
  .fade-in-1 { animation: fadeUp 0.5s 0.06s cubic-bezier(.22,1,.36,1) both; }
  .fade-in-2 { animation: fadeUp 0.5s 0.12s cubic-bezier(.22,1,.36,1) both; }
  .fade-in-3 { animation: fadeUp 0.5s 0.18s cubic-bezier(.22,1,.36,1) both; }
  .fade-in-4 { animation: fadeUp 0.5s 0.24s cubic-bezier(.22,1,.36,1) both; }

  /* ══════════════════════════════════════════
     PREMIUM NAVBAR
  ══════════════════════════════════════════ */
  .nav {
    position: sticky; top: 0; z-index: 300; height: 68px;
    background: rgba(4,2,12,0.92);
    backdrop-filter: blur(40px) saturate(220%);
    -webkit-backdrop-filter: blur(40px) saturate(220%);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; gap: 1rem;
    animation: navbarIn 0.6s cubic-bezier(.22,1,.36,1) both;
    transition: background 0.4s, box-shadow 0.4s;
  }
  .nav.scrolled { background:rgba(2,1,8,0.97); box-shadow:0 1px 0 rgba(255,255,255,0.05),0 8px 32px rgba(0,0,0,0.5); }
  .nav-logo { display:flex; align-items:center; gap:10px; cursor:pointer; user-select:none; flex-shrink:0; }
  .logo-mark { width:36px; height:36px; border-radius:11px; background:linear-gradient(135deg,var(--violet) 0%,#8f5cf7 50%,var(--teal) 100%); animation:logoGlow 3s ease-in-out infinite; display:flex; align-items:center; justify-content:center; flex-shrink:0; position:relative; overflow:hidden; transition:transform 0.3s cubic-bezier(.34,1.56,.64,1); }
  .logo-mark:hover { transform:scale(1.1) rotate(8deg); }
  .logo-mark::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.2),transparent); border-radius:inherit; }
  .logo-mark svg { width:18px; height:18px; position:relative; z-index:1; }
  .logo-name { font-family:var(--display); font-weight:800; font-size:1.1rem; color:#fff; letter-spacing:-0.03em; }
  .logo-name em { color:var(--violet-light); font-style:normal; }
  .nav-search-wrap { flex:1; max-width:260px; position:relative; }
  .nav-search-inner { display:flex; align-items:center; gap:0; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:100px; overflow:hidden; width:100%; transition:all 0.3s; }
  .nav-search-inner:focus-within { border-color:rgba(91,54,242,0.6); background:rgba(255,255,255,0.09); box-shadow:0 0 0 3px rgba(91,54,242,0.15); }
  .nav-search-icon { padding:0 10px; color:rgba(255,255,255,0.3); font-size:12px; flex-shrink:0; }
  .nav-search-input { background:none; border:none; outline:none; color:#fff; font-family:var(--sans); font-size:0.8rem; padding:0.5rem 0.5rem 0.5rem 0; width:100%; }
  .nav-search-input::placeholder { color:rgba(255,255,255,0.22); }
  .nav-search-kbd { flex-shrink:0; margin-right:8px; font-size:0.65rem; padding:2px 6px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); border-radius:4px; color:rgba(255,255,255,0.3); font-family:var(--display); }
  .nav-center { display:flex; gap:2px; }
  .nav-item { background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.42); font-family:var(--sans); font-size:0.83rem; font-weight:500; letter-spacing:0.01em; padding:0.42rem 1rem; border-radius:9px; transition:color 0.25s,background 0.25s; position:relative; overflow:hidden; }
  .nav-item::before { content:''; position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:0; height:2px; border-radius:2px; background:linear-gradient(90deg,var(--violet),var(--violet-light)); transition:width 0.3s cubic-bezier(.22,1,.36,1); }
  .nav-item:hover { color:rgba(255,255,255,0.9); background:rgba(255,255,255,0.06); }
  .nav-item:hover::before { width:60%; }
  .nav-item.active { color:#fff; }
  .nav-item.active::before { width:60%; background:linear-gradient(90deg,var(--violet),var(--teal)); }
  .nav-right { display:flex; align-items:center; gap:8px; flex-shrink:0; min-width:0; margin-left:auto; }
  .nav-bell { position:relative; width:34px; height:34px; border-radius:9px; flex-shrink:0; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); display:flex; align-items:center; justify-content:center; cursor:pointer; color:rgba(255,255,255,0.4); font-size:15px; transition:all 0.3s cubic-bezier(.34,1.56,.64,1); }
  .nav-bell:hover { background:rgba(91,54,242,0.2); border-color:rgba(91,54,242,0.45); color:#fff; transform:scale(1.05); animation:bellShake 0.5s ease; }
  .bell-badge { position:absolute; top:5px; right:5px; width:8px; height:8px; border-radius:50%; background:var(--rose); border:1.5px solid rgba(4,2,12,0.92); animation:dotPulse 2s ease-in-out infinite; }
  .bell-ring { position:absolute; top:5px; right:5px; width:8px; height:8px; border-radius:50%; border:1px solid var(--rose); animation:ringPop 2s ease-in-out infinite; }
  .notif-dropdown { position:absolute; top:calc(100% + 12px); right:0; width:320px; background:#12101e; border:1px solid rgba(255,255,255,0.1); border-radius:var(--r-lg); overflow:hidden; box-shadow:0 24px 64px rgba(0,0,0,0.45); animation:notifPop 0.3s cubic-bezier(.34,1.56,.64,1) both; z-index:99; }
  .notif-header { padding:1rem 1.25rem 0.75rem; border-bottom:1px solid rgba(255,255,255,0.07); display:flex; justify-content:space-between; align-items:center; }
  .notif-title { font-family:var(--display); font-size:0.88rem; font-weight:700; color:#fff; }
  .notif-clear { font-size:0.72rem; color:var(--violet-light); cursor:pointer; background:none; border:none; font-family:var(--sans); }
  .notif-item { display:flex; gap:0.75rem; padding:0.85rem 1.25rem; border-bottom:1px solid rgba(255,255,255,0.04); cursor:pointer; transition:background 0.2s; }
  .notif-item:hover { background:rgba(255,255,255,0.04); }
  .notif-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:4px; }
  .notif-text { font-size:0.78rem; color:rgba(255,255,255,0.65); line-height:1.5; flex:1; }
  .notif-time { font-size:0.68rem; color:rgba(255,255,255,0.25); margin-top:2px; display:block; }
  .notif-footer { padding:0.75rem 1.25rem; text-align:center; }
  .notif-footer-btn { font-size:0.78rem; color:var(--violet-light); cursor:pointer; background:none; border:none; font-family:var(--sans); }
  .saved-pill { display:flex; align-items:center; gap:7px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:100px; padding:5px 12px 5px 7px; cursor:pointer; transition:all 0.3s cubic-bezier(.22,1,.36,1); font-size:0.78rem; color:rgba(255,255,255,0.5); font-family:var(--sans); }
  .saved-pill:hover { background:rgba(91,54,242,0.18); border-color:rgba(91,54,242,0.4); color:#fff; transform:scale(1.03); }
  .saved-count { min-width:19px; height:19px; border-radius:10px; background:linear-gradient(135deg,var(--violet),var(--violet-light)); color:#fff; font-size:0.66rem; font-weight:700; display:flex; align-items:center; justify-content:center; animation:heartBeat 2s ease-in-out infinite; }
  .nav-plans-btn { background:rgba(245,158,11,0.12); border:1px solid rgba(245,158,11,0.3); color:var(--gold); font-family:var(--sans); font-size:0.78rem; font-weight:700; padding:0.42rem 0.85rem; border-radius:100px; cursor:pointer; transition:all 0.3s cubic-bezier(.34,1.56,.64,1); letter-spacing:0.02em; }
  .nav-plans-btn:hover { background:rgba(245,158,11,0.22); border-color:var(--gold); transform:scale(1.04); box-shadow:0 4px 20px rgba(245,158,11,0.25); }
  .nav-cta { background:linear-gradient(135deg,var(--violet) 0%,var(--violet-light) 100%); color:#fff; border:none; padding:0.48rem 1.2rem; font-family:var(--sans); font-size:0.8rem; font-weight:700; border-radius:100px; cursor:pointer; box-shadow:0 4px 20px rgba(91,54,242,0.4); transition:all 0.3s cubic-bezier(.34,1.56,.64,1); letter-spacing:0.01em; position:relative; overflow:hidden; }
  .nav-cta::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.2),transparent); opacity:0; transition:opacity 0.25s; }
  .nav-cta:hover { transform:translateY(-2px) scale(1.04); box-shadow:0 8px 32px rgba(91,54,242,0.55); }
  .nav-cta:hover::before { opacity:1; }

  /* ── MOBILE MENU ── */
  .nav-mobile-toggle {
    display:none; background:none; border:none; color:rgba(255,255,255,0.7);
    font-size:20px; cursor:pointer; padding:4px; line-height:1;
  }
  .nav-mobile-menu {
    display:none; position:fixed; inset:0; top:68px; z-index:299;
    background:rgba(4,2,12,0.97); backdrop-filter:blur(24px);
    flex-direction:column; padding:1.5rem; gap:0.35rem;
    border-top:1px solid rgba(255,255,255,0.07);
    overflow-y:auto;
  }
  .nav-mobile-menu.open { display:flex; }
  .nav-mobile-item {
    background:none; border:none; cursor:pointer;
    color:rgba(255,255,255,0.55); font-family:var(--sans);
    font-size:1rem; font-weight:500; padding:0.85rem 1rem;
    border-radius:12px; text-align:left; transition:all 0.2s;
  }
  .nav-mobile-item:hover, .nav-mobile-item.active {
    background:rgba(91,54,242,0.15); color:#fff;
  }
  .nav-mobile-divider {
    height:1px; background:rgba(255,255,255,0.07); margin:0.5rem 0;
  }
  .nav-mobile-actions {
    display:flex; flex-direction:column; gap:0.65rem; padding-top:0.5rem;
  }
  .nav-mobile-cta {
    background:linear-gradient(135deg,var(--violet),var(--violet-light));
    color:#fff; border:none; padding:0.85rem; font-family:var(--sans);
    font-size:0.9rem; font-weight:700; border-radius:var(--r-md); cursor:pointer;
    text-align:center;
  }
  .nav-mobile-plans {
    background:rgba(245,158,11,0.12); border:1px solid rgba(245,158,11,0.3);
    color:var(--gold); font-family:var(--sans); font-size:0.88rem; font-weight:700;
    padding:0.75rem; border-radius:var(--r-md); cursor:pointer; text-align:center;
  }

  /* ── HERO ── */
  .hero { position:relative; overflow:hidden; background:#06040f; padding:6.5rem 2.5rem 5.5rem; min-height:78vh; display:flex; align-items:center; }
  .hero-mesh { position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse 80% 80% at 60% -20%,rgba(91,54,242,0.28) 0%,transparent 55%),radial-gradient(ellipse 60% 70% at 2% 95%,rgba(0,201,167,0.12) 0%,transparent 50%),radial-gradient(ellipse 45% 45% at 98% 55%,rgba(242,75,110,0.09) 0%,transparent 50%); }
  .hero-grid { position:absolute; inset:0; pointer-events:none; background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px); background-size:60px 60px; mask-image:radial-gradient(ellipse at center,black 30%,transparent 80%); }
  .hero-inner { max-width:860px; margin:0 auto; position:relative; width:100%; }
  .hero-eyebrow { display:inline-flex; align-items:center; gap:9px; background:rgba(91,54,242,0.15); border:1px solid rgba(91,54,242,0.3); border-radius:100px; padding:7px 16px 7px 9px; margin-bottom:2rem; animation:fadeUp 0.7s 0.1s cubic-bezier(.22,1,.36,1) both; backdrop-filter:blur(8px); }
  .hero-eyebrow-dot { width:9px; height:9px; border-radius:50%; background:var(--teal); flex-shrink:0; box-shadow:0 0 12px var(--teal); animation:breathe 2.5s ease-in-out infinite; }
  .hero-eyebrow span { font-size:0.75rem; font-weight:600; color:rgba(255,255,255,0.78); letter-spacing:0.07em; text-transform:uppercase; }
  .hero h1 { font-family:var(--serif); font-size:clamp(3rem,6vw,5.2rem); font-weight:400; line-height:1.06; color:#fff; margin-bottom:1.5rem; letter-spacing:-0.02em; animation:fadeUp 0.7s 0.2s cubic-bezier(.22,1,.36,1) both; }
  .hero h1 .gradient { background:linear-gradient(100deg,var(--violet-light) 0%,var(--teal) 60%,#a8ff78 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .hero-sub { font-size:1.05rem; color:rgba(255,255,255,0.42); max-width:480px; line-height:1.8; margin-bottom:2.8rem; animation:fadeUp 0.7s 0.3s cubic-bezier(.22,1,.36,1) both; font-weight:300; }
  .search-container { animation:fadeUp 0.7s 0.4s cubic-bezier(.22,1,.36,1) both; }
  .search-glass { display:flex; align-items:center; background:rgba(255,255,255,0.055); border:1px solid rgba(255,255,255,0.11); border-radius:var(--r-xl); padding:6px; max-width:660px; backdrop-filter:blur(20px); transition:border-color 0.3s,box-shadow 0.3s; }
  .search-glass:focus-within { border-color:rgba(91,54,242,0.55); box-shadow:0 0 0 4px rgba(91,54,242,0.12),0 8px 32px rgba(91,54,242,0.15); }
  .search-icon { padding:0 0.9rem; font-size:1rem; opacity:0.35; flex-shrink:0; }
  .search-glass input { flex:1; background:none; border:none; outline:none; color:#fff; font-family:var(--sans); font-size:0.92rem; padding:0.7rem 0; }
  .search-glass input::placeholder { color:rgba(255,255,255,0.22); }
  .search-divider { width:1px; height:26px; background:rgba(255,255,255,0.09); flex-shrink:0; }
  .search-glass select { background:none; border:none; outline:none; color:rgba(255,255,255,0.45); font-family:var(--sans); font-size:0.85rem; padding:0.7rem 1rem; cursor:pointer; min-width:130px; }
  .search-glass select option { background:#1a1829; color:#fff; }
  .search-btn { background:linear-gradient(135deg,var(--violet),var(--violet-light)); color:#fff; border:none; padding:0.72rem 1.7rem; font-family:var(--sans); font-size:0.85rem; font-weight:700; border-radius:100px; cursor:pointer; white-space:nowrap; box-shadow:0 4px 20px rgba(91,54,242,0.45); transition:all 0.3s cubic-bezier(.34,1.56,.64,1); }
  .search-btn:hover { transform:scale(1.04); box-shadow:0 8px 32px rgba(91,54,242,0.55); }
  .hero-stats { display:flex; gap:3.5rem; margin-top:2.75rem; padding-top:2rem; border-top:1px solid rgba(255,255,255,0.07); animation:fadeUp 0.7s 0.5s cubic-bezier(.22,1,.36,1) both; }
  .hstat-num { font-family:var(--serif); font-size:2.1rem; font-weight:400; color:#fff; line-height:1; margin-bottom:5px; font-style:italic; }
  .hstat-label { font-size:0.72rem; color:rgba(255,255,255,0.28); text-transform:uppercase; letter-spacing:0.09em; font-weight:500; }
  .hero-cards { position:absolute; right:2.5rem; top:50%; transform:translateY(-50%); display:flex; flex-direction:column; gap:14px; pointer-events:none; }
  @media(max-width:960px){.hero-cards{display:none}}
  .float-card { background:rgba(255,255,255,0.055); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:13px 17px; backdrop-filter:blur(14px); display:flex; align-items:center; gap:11px; width:240px; animation:floatCard 5s ease-in-out infinite; }
  .float-card:nth-child(1){animation-delay:0s}
  .float-card:nth-child(2){animation-delay:-1.8s;margin-left:28px}
  .float-card:nth-child(3){animation-delay:-3.5s}
  .fc-title { font-size:0.8rem; font-weight:600; color:#fff; margin-bottom:2px; font-family:var(--display); }
  .fc-sub { font-size:0.7rem; color:rgba(255,255,255,0.42); }
  .fc-badge { margin-left:auto; flex-shrink:0; width:8px; height:8px; border-radius:50%; background:var(--teal); box-shadow:0 0 8px var(--teal); animation:breathe 2s ease-in-out infinite; }

  /* ── SECTION ── */
  .section { padding:5rem 2.5rem; max-width:1180px; margin:0 auto; width:100%; }
  .sec-head { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:2.5rem; }
  .sec-title { font-family:var(--serif); font-size:2rem; font-weight:400; letter-spacing:-0.02em; }
  .sec-title em { font-style:italic; color:var(--violet); }
  .sec-sub { font-size:0.84rem; color:var(--muted); margin-top:0.3rem; }
  .sec-link { font-size:0.82rem; color:var(--violet); font-weight:600; background:none; border:1px solid var(--border2); border-radius:100px; padding:0.42rem 0.9rem; cursor:pointer; font-family:var(--sans); transition:all 0.3s cubic-bezier(.22,1,.36,1); }
  .sec-link:hover { background:var(--violet-pale); border-color:var(--violet); transform:translateX(3px); }
  .divider { border:none; border-top:1px solid var(--border); }

  /* ── CATEGORY GRID ── */
  .cat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:0.9rem; }
  .cat-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); padding:1.5rem 0.8rem; text-align:center; cursor:pointer; transition:all 0.35s cubic-bezier(.22,1,.36,1); position:relative; overflow:hidden; }
  .cat-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,var(--violet-pale),transparent 65%); opacity:0; transition:opacity 0.3s; }
  .cat-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--violet),var(--teal)); transform:scaleX(0); transform-origin:left; transition:transform 0.35s cubic-bezier(.22,1,.36,1); }
  .cat-card:hover { border-color:var(--violet); transform:translateY(-6px) scale(1.02); box-shadow:0 16px 40px rgba(91,54,242,0.14); }
  .cat-card:hover::before { opacity:1; }
  .cat-card:hover::after { transform:scaleX(1); }
  .cat-icon { font-size:1.75rem; margin-bottom:0.6rem; display:block; transition:transform 0.3s cubic-bezier(.34,1.56,.64,1); }
  .cat-card:hover .cat-icon { transform:scale(1.2) rotate(8deg); }
  .cat-label { font-size:0.79rem; font-weight:700; color:var(--ink); letter-spacing:-0.01em; font-family:var(--display); }
  .cat-count { font-size:0.71rem; color:var(--muted); margin-top:0.18rem; }

  /* ════════════════════════════════════════
     ENHANCED FEATURED JOB CARDS
  ════════════════════════════════════════ */
  .jobs-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(330px,1fr)); gap:1.1rem; }

  .job-card {
    background:var(--surface); border:1px solid var(--border);
    border-radius:var(--r-lg); padding:1.65rem;
    cursor:pointer; position:relative; overflow:hidden;
    transition:all 0.42s cubic-bezier(.22,1,.36,1);
    animation:cardFlip3D 0.75s cubic-bezier(.22,1,.36,1) both;
  }
  .job-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:linear-gradient(90deg,var(--violet),var(--teal));
    transform:scaleX(0); transform-origin:left;
    transition:transform 0.55s cubic-bezier(.22,1,.36,1);
  }
  .job-card:hover { border-color:var(--border2); transform:translateY(-10px) scale(1.016); box-shadow:0 28px 60px rgba(91,54,242,0.15); }
  .job-card:hover::before { transform:scaleX(1); }

  .job-card.premium-card {
    background:radial-gradient(circle at top right,rgba(91,54,242,0.14),transparent 40%),linear-gradient(180deg,#ffffff 0%,#faf9ff 100%);
    border-color:rgba(91,54,242,0.22);
    animation:cardFlip3D 0.75s cubic-bezier(.22,1,.36,1) both, featuredGlow 4.5s 1s ease-in-out infinite;
  }
  .job-card.premium-card::after {
    content:''; position:absolute; top:-40%; left:-20%; width:45%; height:190%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.88),transparent);
    opacity:0; pointer-events:none;
  }
  .job-card.premium-card:hover { transform:translateY(-13px) scale(1.022); box-shadow:0 36px 80px rgba(91,54,242,0.22); }
  .job-card.premium-card:hover::after { opacity:1; animation:premiumSweep 1.1s ease; }

  .premium-orb { position:absolute; border-radius:50%; pointer-events:none; filter:blur(2px); opacity:0.9; }
  .premium-orb.one { width:82px; height:82px; top:-22px; right:-18px; background:radial-gradient(circle,rgba(91,54,242,0.2),transparent 70%); animation:premiumHalo 3.8s ease-in-out infinite; }
  .premium-orb.two { width:70px; height:70px; bottom:-18px; left:-12px; background:radial-gradient(circle,rgba(0,201,167,0.16),transparent 72%); animation:premiumHalo 4.6s ease-in-out infinite reverse; }

  .premium-kicker {
    display:inline-flex; align-items:center; gap:8px;
    padding:5px 12px; border-radius:100px;
    background:rgba(91,54,242,0.09); border:1px solid rgba(91,54,242,0.2);
    font-size:0.68rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;
    color:var(--violet); margin-bottom:0.9rem;
    animation:kicherPulse 2.5s ease-in-out infinite;
  }
  .premium-kicker-dot { width:7px; height:7px; border-radius:50%; background:var(--teal); animation:breathe 1.8s ease-in-out infinite; }

  .jc-top { display:flex; justify-content:space-between; margin-bottom:1rem; }
  .jc-logo-wrap { display:flex; align-items:flex-start; gap:0.9rem; }
  .jc-logo-anim { animation:logoPopIn 0.6s 0.15s cubic-bezier(.34,1.56,.64,1) both; }

  .job-title-text { font-family:var(--display); font-size:1rem; font-weight:700; margin-bottom:0.22rem; letter-spacing:-0.01em; }
  .job-co { font-size:0.79rem; color:var(--muted); font-weight:400; }
  .bk-btn { width:33px; height:33px; border-radius:9px; flex-shrink:0; background:none; border:1px solid var(--border); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:15px; color:var(--muted2); transition:all 0.3s cubic-bezier(.34,1.56,.64,1); }
  .bk-btn:hover, .bk-btn.saved { background:var(--violet-pale); border-color:var(--border2); color:var(--violet); transform:scale(1.1); }
  .bk-btn.saved { animation:heartBeat 0.8s ease; }

  .job-tags { display:flex; flex-wrap:wrap; gap:0.35rem; margin-bottom:1.1rem; }
  .tag { font-size:0.69rem; font-weight:600; padding:0.26rem 0.68rem; border-radius:100px; letter-spacing:0.03em; animation:tagSlideIn 0.5s cubic-bezier(.34,1.56,.64,1) both; }
  .tag:nth-child(1){animation-delay:0.18s}
  .tag:nth-child(2){animation-delay:0.26s}
  .tag:nth-child(3){animation-delay:0.34s}
  .tag:nth-child(4){animation-delay:0.42s}
  .t-full { background:var(--teal-pale); color:#006e5a; }
  .t-remote { background:var(--violet-pale); color:#4527a0; }
  .t-level { background:var(--cream); color:#5a5870; }
  .t-featured { background:linear-gradient(135deg,var(--violet),#8f5cf7); color:#fff; }

  .jc-foot { display:flex; align-items:center; justify-content:space-between; padding-top:0.9rem; border-top:1px solid var(--border); }
  .j-salary { font-family:var(--display); font-weight:700; font-size:0.96rem; animation:salaryReveal 0.6s 0.45s cubic-bezier(.22,1,.36,1) both; }
  .j-date { font-size:0.72rem; color:var(--muted); }

  /* ── COMPANY CARDS ── */
  .co-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(310px,1fr)); gap:1.1rem; }
  .co-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; cursor:pointer; transition:all 0.35s cubic-bezier(.22,1,.36,1); animation:cardEntrance 0.6s cubic-bezier(.22,1,.36,1) both; }
  .co-card:hover { border-color:var(--border2); transform:translateY(-7px); box-shadow:0 24px 56px rgba(91,54,242,0.13); }
  .co-banner { height:110px; position:relative; overflow:hidden; }
  .co-banner-bg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
  .co-banner-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.35); }
  .co-body { padding:1.2rem; }
  .co-header-row { display:flex; align-items:center; gap:0.9rem; margin-bottom:0.85rem; }
  .co-mini-logo { width:46px; height:46px; border-radius:11px; background:var(--surface); border:2px solid var(--surface); display:flex; align-items:center; justify-content:center; font-family:var(--display); font-weight:800; font-size:0.95rem; flex-shrink:0; margin-top:-30px; position:relative; z-index:1; box-shadow:0 4px 16px rgba(0,0,0,0.12); overflow:hidden; }
  .co-mini-logo img { width:100%; height:100%; object-fit:cover; }
  .co-name { font-family:var(--display); font-size:1rem; font-weight:700; letter-spacing:-0.01em; }
  .co-ind { font-size:0.75rem; color:var(--muted); }
  .co-desc { font-size:0.82rem; line-height:1.68; color:#5a5870; margin-bottom:1rem; }
  .co-foot { display:flex; justify-content:space-between; align-items:center; padding-top:0.75rem; border-top:1px solid var(--border); }
  .roles-badge { background:linear-gradient(135deg,var(--violet),var(--violet-light)); color:#fff; font-size:0.71rem; font-weight:700; padding:0.24rem 0.68rem; border-radius:100px; }
  .co-size-txt { font-size:0.75rem; color:var(--muted); }

  /* ── LISTINGS ── */
  .listings-wrap { display:flex; gap:1.6rem; max-width:1200px; margin:0 auto; padding:2rem 2.5rem; width:100%; }
  .sidebar { width:252px; flex-shrink:0; background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:1.65rem; height:fit-content; position:sticky; top:86px; animation:slideRight 0.5s cubic-bezier(.22,1,.36,1) both; }
  .sf-title { font-family:var(--display); font-size:1rem; font-weight:700; margin-bottom:1.5rem; }
  .fg { margin-bottom:1.5rem; }
  .fg > label { display:block; font-size:0.71rem; font-weight:700; letter-spacing:0.09em; text-transform:uppercase; color:var(--muted); margin-bottom:0.7rem; }
  .fopt { display:flex; align-items:center; gap:0.55rem; margin-bottom:0.4rem; cursor:pointer; }
  .fopt input[type=checkbox] { accent-color:var(--violet); width:14px; height:14px; cursor:pointer; }
  .fopt span { font-size:0.83rem; }
  .range-val { font-size:0.82rem; color:var(--violet); font-weight:700; margin-top:0.4rem; }
  input[type=range] { width:100%; accent-color:var(--violet); cursor:pointer; }
  .reset-btn { width:100%; padding:0.58rem; background:none; border:1px solid var(--border); font-family:var(--sans); font-size:0.78rem; font-weight:600; border-radius:var(--r-sm); cursor:pointer; transition:all 0.3s cubic-bezier(.22,1,.36,1); color:var(--muted); }
  .reset-btn:hover { border-color:var(--violet); color:var(--violet); background:var(--violet-pale); transform:scale(1.02); }
  .listings-main { flex:1; min-width:0; }
  .list-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.3rem; }
  .list-count { font-size:0.85rem; color:var(--muted); }
  .list-count strong { color:var(--ink); }
  .sort-sel { border:1px solid var(--border); background:var(--surface); padding:0.4rem 0.85rem; font-family:var(--sans); font-size:0.8rem; border-radius:var(--r-sm); cursor:pointer; outline:none; color:var(--ink); }
  .list-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); padding:1.15rem 1.45rem; cursor:pointer; transition:all 0.3s cubic-bezier(.22,1,.36,1); margin-bottom:0.75rem; display:flex; align-items:center; gap:1.1rem; position:relative; animation:fadeUp 0.4s cubic-bezier(.22,1,.36,1) both; }
  .list-card:hover { border-color:var(--border2); box-shadow:0 10px 32px rgba(91,54,242,0.1); transform:translateX(5px); }
  .list-info { flex:1; min-width:0; }
  .list-meta { display:flex; align-items:center; gap:0.6rem; margin-top:0.32rem; flex-wrap:wrap; }
  .list-meta span { font-size:0.78rem; color:var(--muted); }
  .list-right { text-align:right; flex-shrink:0; }

  /* ── JOB DETAIL ── */
  .detail-wrap { max-width:1100px; margin:0 auto; padding:2rem 2.5rem; display:flex; gap:1.85rem; }
  .detail-main { flex:1; min-width:0; }
  .detail-side { width:280px; flex-shrink:0; }
  .detail-hdr { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:2rem; margin-bottom:1.2rem; position:relative; overflow:hidden; }
  .detail-hdr::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--violet),var(--teal)); }
  .d-logo-row { display:flex; align-items:center; gap:1.1rem; margin-bottom:1.5rem; }
  .d-h1 { font-family:var(--serif); font-size:1.8rem; font-weight:400; margin-bottom:0.35rem; line-height:1.2; }
  .d-coname { font-size:0.9rem; color:var(--violet); cursor:pointer; font-weight:500; transition:color 0.2s; }
  .d-coname:hover { color:var(--violet-light); text-decoration:underline; }
  .d-facts { display:flex; flex-wrap:wrap; gap:0.6rem; margin-top:1.3rem; padding-top:1.3rem; border-top:1px solid var(--border); }
  .fact { display:flex; align-items:center; gap:0.4rem; font-size:0.79rem; background:var(--cream); padding:0.32rem 0.78rem; border-radius:100px; transition:all 0.2s; }
  .fact:hover { background:var(--violet-pale); color:var(--violet); }
  .dsec { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:1.7rem; margin-bottom:1.1rem; }
  .dsec h3 { font-family:var(--serif); font-size:1.12rem; font-weight:400; margin-bottom:0.95rem; }
  .dsec p { font-size:0.875rem; line-height:1.85; color:#4a4862; margin-bottom:0.8rem; }
  .req-list { list-style:none; }
  .req-list li { padding:0.4rem 0 0.4rem 1.3rem; position:relative; font-size:0.875rem; line-height:1.65; }
  .req-list li::before { content:'▸'; position:absolute; left:0; color:var(--violet); font-size:0.7rem; top:0.52rem; }
  .sticky-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:1.65rem; position:sticky; top:86px; }
  .sc-label { font-size:0.72rem; color:var(--muted); text-transform:uppercase; letter-spacing:0.09em; }
  .sc-salary { font-family:var(--serif); font-size:1.6rem; margin:0.25rem 0 1.1rem; }
  .apply-btn { width:100%; background:linear-gradient(135deg,var(--violet) 0%,var(--violet-light) 100%); color:#fff; border:none; padding:0.95rem; font-family:var(--sans); font-size:0.88rem; font-weight:700; border-radius:var(--r-sm); cursor:pointer; box-shadow:0 6px 28px rgba(91,54,242,0.35); transition:all 0.3s cubic-bezier(.34,1.56,.64,1); position:relative; overflow:hidden; }
  .apply-btn:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 12px 40px rgba(91,54,242,0.45); }
  .save-btn { width:100%; margin-top:0.68rem; background:none; border:1px solid var(--border); padding:0.78rem; font-family:var(--sans); font-size:0.84rem; font-weight:600; border-radius:var(--r-sm); cursor:pointer; transition:all 0.3s; color:var(--ink); }
  .save-btn:hover { border-color:var(--violet); color:var(--violet); background:var(--violet-pale); }
  .sc-deadline { font-size:0.73rem; color:var(--muted); text-align:center; margin-top:0.8rem; }
  .sc-meta { font-size:0.77rem; color:var(--muted); line-height:2.1; margin-top:1rem; padding-top:1rem; border-top:1px solid var(--border); }

  /* ── RESUME ── */
  .resume-wrap { max-width:700px; margin:0 auto; padding:3.5rem 2.5rem; animation:pageSlideUp 0.6s cubic-bezier(.22,1,.36,1) both; }
  .pg-h2 { font-family:var(--serif); font-size:2.4rem; font-weight:400; letter-spacing:-0.02em; margin-bottom:0.45rem; }
  .pg-sub { color:var(--muted); font-size:0.88rem; margin-bottom:2.5rem; line-height:1.65; font-weight:300; }
  .upload-stage { position:relative; border-radius:var(--r-xl); overflow:hidden; margin-bottom:1.5rem; background:#06040f; border:1px solid rgba(91,54,242,0.25); cursor:pointer; transition:all 0.4s cubic-bezier(.22,1,.36,1); min-height:280px; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .upload-stage:hover { border-color:rgba(91,54,242,0.6); box-shadow:0 0 0 4px rgba(91,54,242,0.1),0 16px 48px rgba(91,54,242,0.2); }
  .upload-stage.drag { border-color:var(--teal); box-shadow:0 0 0 4px rgba(0,201,167,0.15),0 16px 48px rgba(0,201,167,0.2); animation:uploadPulse 1s ease-in-out infinite; }
  .upload-bg-mesh { position:absolute; inset:0; background:radial-gradient(ellipse 70% 70% at 50% 30%,rgba(91,54,242,0.18) 0%,transparent 65%),radial-gradient(ellipse 40% 50% at 20% 80%,rgba(0,201,167,0.08) 0%,transparent 55%); pointer-events:none; }
  .upload-orb { position:absolute; border-radius:50%; pointer-events:none; }
  .upload-orb-1 { width:120px; height:120px; background:rgba(91,54,242,0.12); top:-20px; right:-20px; animation:orbFloat 8s ease-in-out infinite; }
  .upload-orb-2 { width:80px; height:80px; background:rgba(0,201,167,0.08); bottom:-10px; left:-10px; animation:orbFloat 6s ease-in-out infinite reverse; }
  .upload-grid-lines { position:absolute; inset:0; pointer-events:none; background-image:linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px); background-size:40px 40px; }
  .upload-content { position:relative; z-index:2; text-align:center; padding:3rem 2rem; }
  .upload-icon-wrap { position:relative; display:inline-block; margin-bottom:1.5rem; }
  .upload-icon-ring { width:88px; height:88px; border-radius:50%; border:2px dashed rgba(91,54,242,0.4); display:flex; align-items:center; justify-content:center; background:rgba(91,54,242,0.08); transition:all 0.4s cubic-bezier(.34,1.56,.64,1); animation:glowPulse 3s ease-in-out infinite; }
  .upload-stage:hover .upload-icon-ring { border-color:rgba(91,54,242,0.8); background:rgba(91,54,242,0.15); transform:scale(1.1); }
  .upload-icon-inner { font-size:2.2rem; transition:transform 0.3s cubic-bezier(.34,1.56,.64,1); }
  .upload-stage:hover .upload-icon-inner { transform:translateY(-4px) scale(1.1); }
  .upload-scan-line { position:absolute; left:0; right:0; height:1px; pointer-events:none; background:linear-gradient(90deg,transparent,var(--violet-light),transparent); box-shadow:0 0 8px var(--violet); animation:scanLine 2.5s ease-in-out infinite; opacity:0.6; }
  .upload-title { font-family:var(--serif); font-size:1.35rem; color:#fff; margin-bottom:0.5rem; }
  .upload-hint { font-size:0.82rem; color:rgba(255,255,255,0.35); margin-bottom:1.2rem; }
  .upload-formats { display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap; }
  .upload-fmt-badge { background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.1); border-radius:6px; padding:4px 10px; font-size:0.68rem; font-weight:700; color:rgba(255,255,255,0.4); letter-spacing:0.05em; }
  .upload-progress-stage { background:#06040f; border-radius:var(--r-xl); border:1px solid rgba(91,54,242,0.3); padding:2rem; margin-bottom:1.5rem; animation:fadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
  .up-file-row { display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem; }
  .up-file-icon { width:52px; height:52px; border-radius:14px; background:linear-gradient(135deg,var(--violet-pale),var(--teal-pale)); display:flex; align-items:center; justify-content:center; font-size:1.5rem; flex-shrink:0; animation:fileFloat 3s ease-in-out infinite; }
  .up-file-name { font-family:var(--display); font-weight:700; font-size:0.95rem; color:#fff; margin-bottom:2px; }
  .up-file-size { font-size:0.72rem; color:rgba(255,255,255,0.35); }
  .up-file-rm { background:none; border:none; color:rgba(255,255,255,0.25); cursor:pointer; font-size:16px; margin-left:auto; transition:color 0.2s; }
  .up-file-rm:hover { color:var(--rose); }
  .up-prog-bar { height:6px; background:rgba(255,255,255,0.08); border-radius:4px; overflow:hidden; margin-bottom:0.6rem; }
  .up-prog-fill { height:100%; border-radius:4px; background:linear-gradient(90deg,var(--violet),var(--violet-light),var(--teal),var(--violet)); background-size:200% 100%; transition:width 0.35s ease; animation:progressShimmer 1.5s linear infinite; }
  .up-prog-labels { display:flex; justify-content:space-between; font-size:0.72rem; color:rgba(255,255,255,0.3); }
  .up-stages { display:flex; gap:0.5rem; margin-top:1rem; flex-wrap:wrap; }
  .up-stage-pill { display:flex; align-items:center; gap:5px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:100px; padding:4px 10px; font-size:0.7rem; color:rgba(255,255,255,0.3); transition:all 0.4s; }
  .up-stage-pill.active { background:rgba(91,54,242,0.2); border-color:rgba(91,54,242,0.4); color:var(--violet-light); }
  .up-stage-pill.done { background:rgba(0,201,167,0.1); border-color:rgba(0,201,167,0.3); color:var(--teal); }
  .up-stage-dot { width:6px; height:6px; border-radius:50%; background:currentColor; }
  .up-stage-pill.active .up-stage-dot { animation:dotPulse 1s ease-in-out infinite; }
  .upload-success { background:#06040f; border-radius:var(--r-xl); border:1px solid rgba(0,201,167,0.3); padding:2rem; text-align:center; margin-bottom:1.5rem; animation:fadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
  .up-success-icon { width:72px; height:72px; border-radius:50%; background:linear-gradient(135deg,rgba(0,201,167,0.2),rgba(91,54,242,0.2)); display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; font-size:2rem; animation:checkPop 0.7s 0.1s cubic-bezier(.34,1.56,.64,1) both; }
  .up-success-title { font-family:var(--serif); font-size:1.3rem; color:#fff; margin-bottom:0.4rem; }
  .up-success-sub { font-size:0.82rem; color:rgba(255,255,255,0.4); margin-bottom:1rem; }
  .up-success-chips { display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap; }
  .up-chip { display:flex; align-items:center; gap:5px; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.1); border-radius:100px; padding:5px 12px; font-size:0.72rem; color:rgba(255,255,255,0.5); }
  .up-chip-green { background:rgba(0,201,167,0.1); border-color:rgba(0,201,167,0.25); color:var(--teal); }
  .up-change-btn { background:none; border:none; color:rgba(255,255,255,0.25); font-family:var(--sans); font-size:0.75rem; cursor:pointer; margin-top:0.75rem; transition:color 0.2s; }
  .up-change-btn:hover { color:rgba(255,255,255,0.6); }
  .resume-form { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:1.9rem; margin-top:1.6rem; }
  .rf-title { font-family:var(--serif); font-size:1.15rem; font-weight:400; margin-bottom:1.5rem; }
  .fgrid { display:grid; grid-template-columns:1fr 1fr; gap:0.95rem; margin-bottom:0.95rem; }
  .fg2 { display:flex; flex-direction:column; gap:0.42rem; }
  .fg2 label { font-size:0.71rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--muted); }
  .fg2 input,.fg2 select,.fg2 textarea { border:1px solid var(--border); border-radius:var(--r-sm); padding:0.65rem 0.88rem; font-family:var(--sans); font-size:0.86rem; outline:none; transition:border 0.25s,box-shadow 0.25s; background:var(--paper); color:var(--ink); }
  .fg2 input:focus,.fg2 select:focus,.fg2 textarea:focus { border-color:var(--violet); box-shadow:0 0 0 3px rgba(91,54,242,0.1); }
  .fg2 textarea { resize:vertical; min-height:82px; }
  .fcol2 { grid-column:1/-1; }
  .sub-btn { width:100%; background:var(--ink); color:var(--paper); border:none; padding:0.95rem; font-family:var(--sans); font-size:0.88rem; font-weight:700; border-radius:var(--r-sm); cursor:pointer; transition:all 0.3s cubic-bezier(.22,1,.36,1); margin-top:0.45rem; letter-spacing:0.02em; }
  .sub-btn:hover { background:var(--violet); box-shadow:0 10px 32px rgba(91,54,242,0.35); transform:translateY(-1px); }

  /* ── CONTACT ── */
  .contact-wrap { max-width:660px; margin:0 auto; padding:3.5rem 2.5rem; animation:pageSlideUp 0.6s cubic-bezier(.22,1,.36,1) both; }
  .ctabs { display:flex; border-bottom:1px solid var(--border); margin-bottom:2rem; }
  .ctab { background:none; border:none; padding:0.68rem 1.4rem; font-family:var(--sans); font-size:0.85rem; font-weight:500; cursor:pointer; color:var(--muted); border-bottom:2px solid transparent; margin-bottom:-1px; transition:all 0.25s; }
  .ctab.active { color:var(--violet); border-bottom-color:var(--violet); }
  .contact-box { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:2rem; }
  .cb-h3 { font-family:var(--serif); font-size:1.18rem; margin-bottom:0.42rem; }
  .cb-desc { font-size:0.83rem; color:var(--muted); margin-bottom:1.55rem; }

  /* ── SAVED ── */
  .empty-state { text-align:center; padding:6rem 2rem; color:var(--muted); }
  .empty-icon { font-size:3.5rem; margin-bottom:1rem; animation:bounce 2s ease-in-out infinite; display:block; }
  .empty-state h3 { font-family:var(--serif); font-size:1.5rem; color:var(--ink); margin-bottom:0.5rem; }

  /* ── COMPANY DETAIL ── */
  .cdwrap { max-width:1000px; margin:0 auto; padding:2rem 2.5rem; }

  /* ── BREADCRUMB ── */
  .breadcrumb { font-size:0.78rem; color:var(--muted); padding:1rem 2.5rem; max-width:1200px; margin:0 auto; display:flex; align-items:center; gap:0.45rem; animation:fadeIn 0.4s ease both; flex-wrap:wrap; }
  .bc-btn { background:none; border:none; color:var(--muted); cursor:pointer; font-family:var(--sans); font-size:0.78rem; transition:all 0.2s; padding:2px 4px; border-radius:4px; }
  .bc-btn:hover { color:var(--violet); background:var(--violet-pale); }

  /* ── TOAST ── */
  .toast { position:fixed; bottom:2rem; right:2rem; z-index:999; background:linear-gradient(135deg,#12101e,#1e1b30); color:#fff; padding:0.9rem 1.3rem; border-radius:16px; font-size:0.84rem; font-weight:500; box-shadow:0 20px 60px rgba(0,0,0,0.35),0 0 0 1px rgba(255,255,255,0.07); display:flex; align-items:center; gap:0.9rem; animation:toastIn 0.5s cubic-bezier(.34,1.56,.64,1) both; max-width:340px; font-family:var(--sans); }
  .toast-icon { width:30px; height:30px; border-radius:9px; background:linear-gradient(135deg,var(--violet),var(--violet-light)); display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; }
  .toast-dismiss { background:none; border:none; color:rgba(255,255,255,0.35); cursor:pointer; font-size:14px; margin-left:auto; padding:3px; border-radius:4px; }
  .toast-dismiss:hover { color:#fff; }

  /* ── MODAL ── */
  .modal-overlay { position:fixed; inset:0; z-index:500; background:rgba(6,4,18,0.7); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:1rem; animation:overlayIn 0.3s ease both; }
  .modal { background:var(--surface); border-radius:var(--r-xl); padding:2.5rem; max-width:460px; width:100%; box-shadow:0 32px 96px rgba(0,0,0,0.3); animation:modalIn 0.5s cubic-bezier(.34,1.56,.64,1) both; position:relative; overflow:hidden; border:1px solid var(--border); }
  .modal::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,var(--violet),var(--teal)); }
  .modal-icon-wrap { width:72px; height:72px; border-radius:50%; margin:0 auto 1.5rem; background:linear-gradient(135deg,var(--violet-pale),var(--teal-pale)); display:flex; align-items:center; justify-content:center; font-size:2.2rem; animation:checkPop 0.7s 0.2s cubic-bezier(.34,1.56,.64,1) both; }
  .modal-title { font-family:var(--serif); font-size:1.7rem; font-weight:400; text-align:center; margin-bottom:0.6rem; }
  .modal-body { font-size:0.88rem; color:var(--muted); text-align:center; line-height:1.75; margin-bottom:1.75rem; font-weight:300; }
  .modal-details { background:var(--paper); border:1px solid var(--border); border-radius:var(--r-md); padding:1rem 1.25rem; margin-bottom:1.75rem; }
  .modal-detail-row { display:flex; justify-content:space-between; align-items:center; padding:0.35rem 0; font-size:0.83rem; }
  .modal-detail-row:not(:last-child) { border-bottom:1px solid var(--border); }
  .modal-detail-label { color:var(--muted); }
  .modal-detail-value { font-weight:600; color:var(--ink); }
  .modal-confetti { position:absolute; pointer-events:none; border-radius:3px; }
  .modal-btn-primary { width:100%; background:linear-gradient(135deg,var(--violet),var(--violet-light)); color:#fff; border:none; padding:0.9rem; font-family:var(--sans); font-size:0.88rem; font-weight:700; border-radius:var(--r-sm); cursor:pointer; box-shadow:0 6px 28px rgba(91,54,242,0.35); transition:all 0.3s cubic-bezier(.34,1.56,.64,1); margin-bottom:0.65rem; }
  .modal-btn-primary:hover { transform:translateY(-2px); box-shadow:0 10px 40px rgba(91,54,242,0.45); }
  .modal-btn-secondary { width:100%; background:none; border:1px solid var(--border); padding:0.78rem; font-family:var(--sans); font-size:0.84rem; font-weight:500; border-radius:var(--r-sm); cursor:pointer; transition:all 0.25s; color:var(--muted); }
  .modal-btn-secondary:hover { border-color:var(--border2); color:var(--ink); }

  /* ── SOCIAL ── */
  .social-wrap { max-width:760px; margin:0 auto; padding:4rem 2.5rem; animation:pageSlideUp 0.6s cubic-bezier(.22,1,.36,1) both; }
  .social-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:2rem; }
  .social-card { border-radius:var(--r-lg); padding:1.6rem; cursor:pointer; position:relative; overflow:hidden; display:block; animation:cardEntrance 0.5s cubic-bezier(.22,1,.36,1) both; text-decoration:none; border:1px solid transparent; transition:transform 0.35s cubic-bezier(.22,1,.36,1),box-shadow 0.35s; }
  .social-card::before { content:''; position:absolute; inset:0; opacity:0; background:rgba(255,255,255,0.06); transition:opacity 0.25s; }
  .social-card:hover { transform:translateY(-8px) scale(1.025); }
  .social-card:hover::before { opacity:1; }
  .social-card::after { content:''; position:absolute; top:-50%; left:-100%; width:60%; height:200%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent); transform:skewX(-20deg); transition:left 0.6s ease; }
  .social-card:hover::after { left:180%; }
  .social-card-logo { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:1rem; font-size:1.1rem; font-weight:900; font-family:var(--display); flex-shrink:0; }
  .social-card-name { font-family:var(--display); font-weight:700; font-size:1.05rem; margin-bottom:0.25rem; }
  .social-card-sub { font-size:0.78rem; opacity:0.65; margin-bottom:0.75rem; }
  .social-card-stats { display:flex; gap:1rem; margin-bottom:0.9rem; }
  .social-stat { font-size:0.72rem; opacity:0.75; }
  .social-stat strong { font-weight:700; font-size:0.88rem; display:block; opacity:1; }
  .social-follow-btn { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.25); border-radius:100px; padding:6px 14px; font-size:0.72rem; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; transition:all 0.25s; }
  .social-card:hover .social-follow-btn { background:rgba(255,255,255,0.25); }
  .social-ads-banner { background:linear-gradient(135deg,#0f0c1e,#1a1533); border:1px solid rgba(91,54,242,0.3); border-radius:var(--r-lg); padding:1.75rem 2rem; margin-bottom:1.5rem; position:relative; overflow:hidden; animation:fadeUp 0.5s 0.2s cubic-bezier(.22,1,.36,1) both; }
  .social-ads-banner::before { content:''; position:absolute; top:-40px; right:-40px; width:160px; height:160px; background:radial-gradient(circle,rgba(91,54,242,0.2),transparent 70%); border-radius:50%; }
  .ads-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(245,158,11,0.15); border:1px solid rgba(245,158,11,0.3); border-radius:100px; padding:4px 12px; font-size:0.7rem; font-weight:700; color:var(--gold); letter-spacing:0.05em; text-transform:uppercase; margin-bottom:0.85rem; }
  .ads-title { font-family:var(--serif); font-size:1.25rem; color:#fff; margin-bottom:0.4rem; }
  .ads-sub { font-size:0.82rem; color:rgba(255,255,255,0.45); margin-bottom:1.2rem; font-weight:300; line-height:1.6; }
  .ads-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.65rem; margin-bottom:1.25rem; }
  .ads-stat-card { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:0.85rem 1rem; }
  .ads-stat-num { font-family:var(--serif); font-size:1.4rem; font-style:italic; color:#fff; display:block; }
  .ads-stat-lbl { font-size:0.69rem; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:0.07em; font-weight:600; }
  .ads-cta { background:linear-gradient(135deg,var(--violet),var(--violet-light)); color:#fff; border:none; padding:0.7rem 1.5rem; border-radius:100px; font-family:var(--sans); font-size:0.82rem; font-weight:700; cursor:pointer; box-shadow:0 4px 20px rgba(91,54,242,0.4); transition:all 0.3s cubic-bezier(.34,1.56,.64,1); }
  .ads-cta:hover { transform:scale(1.05); box-shadow:0 8px 32px rgba(91,54,242,0.55); }
  .social-newsletter { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:2rem; text-align:center; margin-bottom:1.5rem; }
  .nl-title { font-family:var(--serif); font-size:1.4rem; margin-bottom:0.4rem; }
  .nl-sub { font-size:0.84rem; color:var(--muted); margin-bottom:1.25rem; font-weight:300; }
  .nl-form { display:flex; gap:0.6rem; max-width:380px; margin:0 auto; }
  .nl-input { flex:1; border:1px solid var(--border); border-radius:100px; padding:0.65rem 1rem; font-family:var(--sans); font-size:0.85rem; outline:none; background:var(--paper); color:var(--ink); transition:border-color 0.25s,box-shadow 0.25s; }
  .nl-input:focus { border-color:var(--violet); box-shadow:0 0 0 3px rgba(91,54,242,0.1); }
  .nl-btn { background:linear-gradient(135deg,var(--violet),var(--violet-light)); color:#fff; border:none; padding:0.65rem 1.25rem; border-radius:100px; font-family:var(--sans); font-size:0.82rem; font-weight:700; cursor:pointer; white-space:nowrap; transition:all 0.3s cubic-bezier(.34,1.56,.64,1); box-shadow:0 4px 16px rgba(91,54,242,0.35); }
  .nl-btn:hover { transform:scale(1.05); box-shadow:0 6px 24px rgba(91,54,242,0.5); }
  .community-strip { display:flex; gap:0.75rem; flex-wrap:wrap; }
  .comm-item { flex:1; min-width:140px; background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); padding:1rem; text-align:center; transition:all 0.3s cubic-bezier(.22,1,.36,1); cursor:pointer; }
  .comm-item:hover { border-color:var(--violet); transform:translateY(-4px); box-shadow:0 12px 32px rgba(91,54,242,0.1); }
  .comm-num { font-family:var(--serif); font-size:1.4rem; font-style:italic; display:block; margin-bottom:0.2rem; }
  .comm-label { font-size:0.72rem; color:var(--muted); text-transform:uppercase; letter-spacing:0.07em; font-weight:600; }

  /* ════════════════════════════════════════
     PLANS PAGE — PREMIUM
  ════════════════════════════════════════ */
  .plans-wrap { max-width:1100px; margin:0 auto; padding:4rem 2.5rem; animation:pageSlideUp 0.6s cubic-bezier(.22,1,.36,1) both; }
  .plans-hero { text-align:center; margin-bottom:3.5rem; }
  .plans-hero-badge { display:inline-flex; align-items:center; gap:7px; background:var(--violet-pale); border:1px solid var(--border2); border-radius:100px; padding:6px 16px; font-size:0.73rem; font-weight:700; color:var(--violet); letter-spacing:0.06em; text-transform:uppercase; margin-bottom:1.25rem; }
  .plans-hero h1 { font-family:var(--serif); font-size:clamp(2rem,4vw,3.2rem); font-weight:400; letter-spacing:-0.02em; margin-bottom:0.75rem; }
  .plans-hero h1 em { font-style:italic; color:var(--violet); }
  .plans-hero p { font-size:1rem; color:var(--muted); max-width:480px; margin:0 auto 2rem; line-height:1.75; font-weight:300; }
  .billing-toggle { display:inline-flex; align-items:center; background:var(--surface); border:1px solid var(--border); border-radius:100px; padding:4px; margin-bottom:3rem; }
  .billing-opt { background:none; border:none; padding:0.5rem 1.25rem; border-radius:100px; font-family:var(--sans); font-size:0.82rem; font-weight:500; cursor:pointer; color:var(--muted); transition:all 0.3s; }
  .billing-opt.active { background:var(--ink); color:#fff; font-weight:700; }
  .billing-save { background:var(--teal-pale); color:#006e5a; font-size:0.68rem; font-weight:700; padding:3px 8px; border-radius:100px; margin-left:4px; }
  .plans-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:1.25rem; margin-bottom:3rem; }
  .plan-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-xl); padding:2rem; position:relative; overflow:hidden; transition:all 0.35s cubic-bezier(.22,1,.36,1); animation:priceIn 0.6s cubic-bezier(.22,1,.36,1) both; }
  .plan-card:hover { transform:translateY(-8px); box-shadow:0 24px 60px rgba(91,54,242,0.12); border-color:var(--border2); }
  .plan-card.featured { background:linear-gradient(135deg,#06040f 0%,#120f26 100%); border-color:rgba(91,54,242,0.5); color:#fff; box-shadow:0 16px 48px rgba(91,54,242,0.25); animation:glowPulse 4s ease-in-out infinite,priceIn 0.6s cubic-bezier(.22,1,.36,1) both; }
  .plan-card.featured:hover { transform:translateY(-10px); box-shadow:0 32px 80px rgba(91,54,242,0.35); }
  .plan-featured-badge { position:absolute; top:1.25rem; right:1.25rem; background:linear-gradient(135deg,var(--violet),var(--violet-light)); color:#fff; font-size:0.65rem; font-weight:800; padding:4px 10px; border-radius:100px; letter-spacing:0.06em; text-transform:uppercase; }
  .plan-card.featured::before { content:''; position:absolute; top:0; left:-100%; width:50%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent); animation:shimmerSlide 3s ease-in-out infinite; }
  .plan-tier { font-size:0.72rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--muted); margin-bottom:0.5rem; }
  .plan-card.featured .plan-tier { color:rgba(255,255,255,0.4); }
  .plan-name { font-family:var(--serif); font-size:1.5rem; font-weight:400; margin-bottom:0.35rem; }
  .plan-card.featured .plan-name { color:#fff; }
  .plan-desc { font-size:0.82rem; color:var(--muted); margin-bottom:1.75rem; line-height:1.6; }
  .plan-card.featured .plan-desc { color:rgba(255,255,255,0.45); }
  .plan-price-row { display:flex; align-items:baseline; gap:4px; margin-bottom:0.3rem; }
  .plan-currency { font-size:1.1rem; font-weight:700; color:var(--ink); }
  .plan-card.featured .plan-currency { color:#fff; }
  .plan-amount { font-family:var(--serif); font-size:3rem; font-weight:400; line-height:1; color:var(--ink); font-style:italic; }
  .plan-card.featured .plan-amount { color:#fff; }
  .plan-period { font-size:0.8rem; color:var(--muted); }
  .plan-card.featured .plan-period { color:rgba(255,255,255,0.4); }
  .plan-annual-note { font-size:0.72rem; color:var(--teal); font-weight:600; margin-bottom:1.75rem; }
  .plan-card:not(.featured) .plan-annual-note { color:var(--violet); }
  .plan-divider { border:none; border-top:1px solid var(--border); margin:1.5rem 0; }
  .plan-card.featured .plan-divider { border-color:rgba(255,255,255,0.1); }
  .plan-features { list-style:none; margin-bottom:2rem; }
  .plan-feature { display:flex; align-items:flex-start; gap:0.65rem; padding:0.38rem 0; font-size:0.83rem; line-height:1.5; }
  .plan-check { width:18px; height:18px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:10px; margin-top:1px; }
  .plan-check.yes { background:var(--teal-pale); color:var(--teal); }
  .plan-card.featured .plan-check.yes { background:rgba(0,201,167,0.2); color:var(--teal); }
  .plan-check.no { background:var(--cream); color:var(--muted2); }
  .plan-card.featured .plan-check.no { background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.2); }
  .feature-text { color:var(--ink); }
  .plan-card.featured .feature-text { color:rgba(255,255,255,0.8); }
  .feature-text.dimmed { color:var(--muted2); text-decoration:line-through; }
  .plan-card.featured .feature-text.dimmed { color:rgba(255,255,255,0.2); }
  .plan-btn { width:100%; padding:0.88rem; border-radius:var(--r-md); font-family:var(--sans); font-size:0.87rem; font-weight:700; cursor:pointer; transition:all 0.3s cubic-bezier(.34,1.56,.64,1); letter-spacing:0.02em; border:none; }
  .plan-btn-outline { background:none; border:1px solid var(--border); color:var(--ink); }
  .plan-btn-outline:hover { border-color:var(--violet); color:var(--violet); background:var(--violet-pale); transform:scale(1.02); }
  .plan-btn-primary { background:linear-gradient(135deg,var(--violet),var(--violet-light)); color:#fff; box-shadow:0 6px 28px rgba(91,54,242,0.4); }
  .plan-btn-primary:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 10px 40px rgba(91,54,242,0.55); }
  .plan-btn-gold { background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a0e00; box-shadow:0 6px 28px rgba(245,158,11,0.35); }
  .plan-btn-gold:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 10px 40px rgba(245,158,11,0.5); }
  .plans-compare { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; margin-bottom:3rem; }
  .compare-head { background:var(--paper); padding:1.5rem 2rem; border-bottom:1px solid var(--border); }
  .compare-head h3 { font-family:var(--serif); font-size:1.3rem; font-weight:400; }
  .compare-table { width:100%; border-collapse:collapse; }
  .compare-table th { padding:0.85rem 1.5rem; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--muted); text-align:left; border-bottom:1px solid var(--border); }
  .compare-table th:not(:first-child) { text-align:center; }
  .compare-table td { padding:0.85rem 1.5rem; font-size:0.84rem; border-bottom:1px solid var(--border); }
  .compare-table td:not(:first-child) { text-align:center; }
  .compare-table tr:last-child td { border-bottom:none; }
  .compare-table tr:hover td { background:var(--paper); }
  .ct-check { color:var(--teal); font-size:1rem; }
  .ct-x { color:var(--muted2); font-size:0.9rem; }
  .ct-feat-col { background:rgba(91,54,242,0.04); }
  .plans-faq { margin-bottom:3rem; }
  .faq-title { font-family:var(--serif); font-size:1.5rem; font-weight:400; margin-bottom:1.5rem; }
  .faq-item { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); margin-bottom:0.65rem; overflow:hidden; }
  .faq-q { display:flex; justify-content:space-between; align-items:center; padding:1.1rem 1.4rem; cursor:pointer; font-size:0.9rem; font-weight:600; transition:background 0.2s; }
  .faq-q:hover { background:var(--paper); }
  .faq-arrow { color:var(--muted); transition:transform 0.3s; flex-shrink:0; }
  .faq-arrow.open { transform:rotate(180deg); color:var(--violet); }
  .faq-a { padding:0 1.4rem 1.1rem; font-size:0.83rem; color:var(--muted); line-height:1.7; }
  .enterprise-strip { background:linear-gradient(135deg,#06040f,#120f26); border:1px solid rgba(91,54,242,0.25); border-radius:var(--r-xl); padding:2.5rem; display:flex; justify-content:space-between; align-items:center; gap:2rem; flex-wrap:wrap; }
  .enterprise-text h3 { font-family:var(--serif); font-size:1.5rem; color:#fff; margin-bottom:0.4rem; }
  .enterprise-text p { font-size:0.85rem; color:rgba(255,255,255,0.4); max-width:420px; line-height:1.65; }
  .enterprise-btn { background:none; border:1px solid rgba(255,255,255,0.2); color:#fff; padding:0.75rem 1.75rem; border-radius:100px; font-family:var(--sans); font-size:0.85rem; font-weight:700; cursor:pointer; transition:all 0.3s; white-space:nowrap; flex-shrink:0; }
  .enterprise-btn:hover { background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.4); transform:scale(1.04); }

  /* ════════════════════════════════════════
     PREMIUM PLAN CONFIRMATION MODAL
  ════════════════════════════════════════ */
  .plan-confirm-overlay {
    position:fixed; inset:0; z-index:600;
    background:rgba(4,2,14,0.75); backdrop-filter:blur(12px);
    display:flex; align-items:center; justify-content:center; padding:1rem;
    animation:overlayIn 0.35s ease both;
    overflow-y:auto;
  }
  .plan-confirm-modal {
    background:linear-gradient(180deg,#fcfbff 0%,#f4f1ff 100%);
    border-radius:28px; width:min(940px,100%);
    border:1px solid rgba(91,54,242,0.14);
    box-shadow:0 40px 100px rgba(14,8,33,0.28);
    overflow:hidden; position:relative;
    animation:planConfirmIn 0.55s cubic-bezier(.34,1.56,.64,1) both;
    margin:auto;
  }
  .plan-confirm-modal::before {
    content:''; position:absolute; inset:0;
    background:radial-gradient(circle at 80% 0%,rgba(91,54,242,0.1),transparent 30%),
               radial-gradient(circle at 10% 95%,rgba(0,201,167,0.08),transparent 25%);
    pointer-events:none;
  }
  .pcm-grid {
    position:relative; z-index:1;
    display:grid; grid-template-columns:1.1fr 0.9fr;
  }

  .pcm-left {
    background:linear-gradient(160deg,#060411 0%,#130e28 55%,#1d1640 100%);
    padding:2.2rem 2rem; position:relative; overflow:hidden; color:#fff;
  }
  .pcm-left::after {
    content:''; position:absolute; bottom:-60px; right:-50px;
    width:220px; height:220px; border-radius:50%;
    background:radial-gradient(circle,rgba(91,54,242,0.2),transparent 70%);
    animation:successOrb 6s ease-in-out infinite;
  }
  .pcm-badge {
    display:inline-flex; align-items:center; gap:8px;
    padding:6px 13px; border-radius:100px;
    background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.14);
    font-size:0.68rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;
    color:rgba(255,255,255,0.7); margin-bottom:1.2rem;
    animation:confirmStagger 0.5s 0.1s cubic-bezier(.22,1,.36,1) both;
  }
  .pcm-title {
    font-family:var(--serif); font-size:2rem; line-height:1.1;
    margin-bottom:0.5rem;
    animation:confirmStagger 0.5s 0.18s cubic-bezier(.22,1,.36,1) both;
  }
  .pcm-sub {
    color:rgba(255,255,255,0.55); font-size:0.86rem; line-height:1.7;
    margin-bottom:1.8rem;
    animation:confirmStagger 0.5s 0.26s cubic-bezier(.22,1,.36,1) both;
  }
  .pcm-summary {
    background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.1);
    border-radius:20px; padding:1.15rem 1.2rem;
    backdrop-filter:blur(16px); margin-bottom:1.2rem;
    animation:confirmStagger 0.5s 0.34s cubic-bezier(.22,1,.36,1) both;
  }
  .pcm-row { display:flex; justify-content:space-between; gap:1rem; padding:0.38rem 0; font-size:0.84rem; color:rgba(255,255,255,0.65); }
  .pcm-row strong { color:#fff; font-weight:700; }
  .pcm-row.total { border-top:1px solid rgba(255,255,255,0.1); margin-top:0.3rem; padding-top:0.7rem; font-size:0.95rem; }
  .pcm-secure-note {
    display:flex; align-items:center; gap:8px;
    background:rgba(0,201,167,0.1); border:1px solid rgba(0,201,167,0.2);
    border-radius:12px; padding:0.75rem 1rem;
    font-size:0.78rem; color:#00c9a7;
    animation:confirmStagger 0.5s 0.42s cubic-bezier(.22,1,.36,1) both;
  }

  .pcm-right { padding:2.2rem 2rem; background:#fff; }
  .pcm-right-title {
    font-family:var(--serif); font-size:1.2rem; font-weight:400;
    margin-bottom:0.4rem;
    animation:confirmStagger 0.5s 0.2s cubic-bezier(.22,1,.36,1) both;
  }
  .pcm-right-sub {
    font-size:0.8rem; color:var(--muted); margin-bottom:1.4rem;
    animation:confirmStagger 0.5s 0.28s cubic-bezier(.22,1,.36,1) both;
  }

  .pay-method-tabs {
    display:flex; gap:0; background:var(--paper);
    border:1px solid var(--border); border-radius:14px;
    padding:4px; margin-bottom:1.4rem;
    animation:confirmStagger 0.5s 0.36s cubic-bezier(.22,1,.36,1) both;
  }
  .pay-method-tab {
    flex:1; background:none; border:none; padding:0.55rem 0.5rem;
    font-family:var(--sans); font-size:0.78rem; font-weight:600;
    color:var(--muted); border-radius:10px; cursor:pointer;
    transition:all 0.3s cubic-bezier(.22,1,.36,1);
    display:flex; align-items:center; justify-content:center; gap:5px;
  }
  .pay-method-tab.active {
    background:#fff; color:var(--violet);
    box-shadow:0 2px 12px rgba(91,54,242,0.12);
  }
  .pay-method-tab-icon { font-size:14px; }

  .bank-panel { animation:bankCardSlide 0.45s cubic-bezier(.22,1,.36,1) both; }
  .bank-list { display:flex; flex-direction:column; gap:0.6rem; margin-bottom:1.2rem; }
  .bank-item {
    display:flex; align-items:center; gap:0.9rem;
    background:var(--paper); border:1.5px solid var(--border);
    border-radius:14px; padding:0.85rem 1rem; cursor:pointer;
    transition:all 0.3s cubic-bezier(.22,1,.36,1);
    animation:bankCardSlide 0.4s cubic-bezier(.22,1,.36,1) both;
  }
  .bank-item:nth-child(1){animation-delay:0.05s}
  .bank-item:nth-child(2){animation-delay:0.12s}
  .bank-item:nth-child(3){animation-delay:0.19s}
  .bank-item:nth-child(4){animation-delay:0.26s}
  .bank-item:hover { border-color:var(--violet); background:var(--violet-pale); transform:translateX(4px); }
  .bank-item.selected { border-color:var(--violet); background:linear-gradient(135deg,#f5f2ff,#fff); box-shadow:0 0 0 3px rgba(91,54,242,0.1); }
  .bank-logo { width:42px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:0.68rem; font-weight:800; font-family:var(--display); flex-shrink:0; }
  .bank-name { font-weight:600; font-size:0.88rem; flex:1; }
  .bank-type { font-size:0.7rem; color:var(--muted); }
  .bank-check { width:20px; height:20px; border-radius:50%; border:2px solid var(--border); flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all 0.25s; }
  .bank-item.selected .bank-check { background:var(--violet); border-color:var(--violet); color:#fff; font-size:11px; }

  .upi-panel { animation:confirmStagger 0.4s cubic-bezier(.22,1,.36,1) both; }
  .upi-logo-row { display:flex; gap:0.65rem; margin-bottom:1.2rem; flex-wrap:wrap; }
  .upi-app {
    display:flex; flex-direction:column; align-items:center; gap:5px;
    padding:0.7rem 0.9rem; border:1.5px solid var(--border); border-radius:14px;
    cursor:pointer; flex:1; min-width:70px; text-align:center;
    transition:all 0.3s cubic-bezier(.34,1.56,.64,1);
    animation:upiPopIn 0.5s cubic-bezier(.34,1.56,.64,1) both;
    background:var(--paper);
  }
  .upi-app:nth-child(1){animation-delay:0.05s}
  .upi-app:nth-child(2){animation-delay:0.12s}
  .upi-app:nth-child(3){animation-delay:0.19s}
  .upi-app:nth-child(4){animation-delay:0.26s}
  .upi-app:hover { border-color:var(--violet); transform:translateY(-4px) scale(1.05); box-shadow:0 10px 28px rgba(91,54,242,0.14); }
  .upi-app.selected { border-color:var(--violet); background:var(--violet-pale); box-shadow:0 0 0 3px rgba(91,54,242,0.1); }
  .upi-icon { font-size:1.5rem; }
  .upi-label { font-size:0.65rem; font-weight:700; color:var(--ink); }
  .upi-id-wrap { position:relative; margin-bottom:1.1rem; }
  .upi-id-input { width:100%; border:1.5px solid var(--border); border-radius:12px; padding:0.78rem 1rem 0.78rem 2.5rem; font-family:var(--sans); font-size:0.88rem; outline:none; background:var(--paper); color:var(--ink); transition:border-color 0.25s,box-shadow 0.25s; }
  .upi-id-input:focus { border-color:var(--violet); box-shadow:0 0 0 3px rgba(91,54,242,0.1); }
  .upi-id-prefix { position:absolute; left:0.8rem; top:50%; transform:translateY(-50%); font-size:1rem; pointer-events:none; }
  .upi-verify-btn { width:100%; background:linear-gradient(135deg,#4752c4,#7289da); color:#fff; border:none; padding:0.78rem; border-radius:12px; font-family:var(--sans); font-size:0.85rem; font-weight:700; cursor:pointer; transition:all 0.3s cubic-bezier(.34,1.56,.64,1); box-shadow:0 4px 16px rgba(71,82,196,0.35); }
  .upi-verify-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(71,82,196,0.45); }

  .card-panel { animation:confirmStagger 0.4s cubic-bezier(.22,1,.36,1) both; }
  .card-visual {
    background:linear-gradient(135deg,#5b36f2,#9b7ff7,#00c9a7);
    border-radius:18px; padding:1.5rem 1.4rem; margin-bottom:1.4rem;
    color:#fff; position:relative; overflow:hidden;
    animation:bankCardSlide 0.5s cubic-bezier(.22,1,.36,1) both;
    box-shadow:0 12px 40px rgba(91,54,242,0.35);
  }
  .card-visual::before {
    content:''; position:absolute; top:-30px; right:-30px;
    width:120px; height:120px; border-radius:50%;
    background:rgba(255,255,255,0.12);
  }
  .card-visual::after {
    content:''; position:absolute; bottom:-20px; left:60px;
    width:80px; height:80px; border-radius:50%;
    background:rgba(255,255,255,0.08);
  }
  .card-chip { width:34px; height:26px; background:rgba(255,255,255,0.3); border-radius:6px; margin-bottom:1.2rem; display:flex; align-items:center; justify-content:center; font-size:18px; }
  .card-number { font-family:monospace; font-size:1rem; letter-spacing:0.22em; margin-bottom:1rem; opacity:0.92; }
  .card-row { display:flex; justify-content:space-between; font-size:0.72rem; opacity:0.75; text-transform:uppercase; letter-spacing:0.07em; }
  .pay-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; }
  .pay-field { display:flex; flex-direction:column; gap:0.4rem; margin-bottom:0.85rem; }
  .pay-field.full { grid-column:1/-1; }
  .pay-field label { font-size:0.7rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--muted); }
  .pay-field input,.pay-field select { border:1.5px solid var(--border); background:var(--paper); border-radius:12px; padding:0.78rem 0.95rem; font-family:var(--sans); font-size:0.88rem; outline:none; transition:border-color 0.25s,box-shadow 0.25s,transform 0.25s; color:var(--ink); }
  .pay-field input:focus,.pay-field select:focus { border-color:var(--violet); box-shadow:0 0 0 3px rgba(91,54,242,0.1); transform:translateY(-1px); }

  .pcm-actions { display:flex; gap:0.75rem; margin-top:1.2rem; }
  .pcm-btn-cancel { flex:1; border:1.5px solid var(--border); background:#fff; color:var(--ink); border-radius:14px; padding:0.88rem 1rem; font-family:var(--sans); font-size:0.86rem; font-weight:700; cursor:pointer; transition:all 0.25s; }
  .pcm-btn-cancel:hover { border-color:var(--border2); color:var(--muted); }
  .pcm-btn-pay {
    flex:1.4; border:none;
    background:linear-gradient(135deg,var(--violet),var(--violet-light));
    color:#fff; border-radius:14px; padding:0.88rem 1rem;
    font-family:var(--sans); font-size:0.86rem; font-weight:700;
    cursor:pointer; box-shadow:0 8px 28px rgba(91,54,242,0.35);
    transition:all 0.3s cubic-bezier(.34,1.56,.64,1);
    position:relative; overflow:hidden;
  }
  .pcm-btn-pay::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.15),transparent); opacity:0; transition:opacity 0.25s; }
  .pcm-btn-pay:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 14px 40px rgba(91,54,242,0.48); }
  .pcm-btn-pay:hover::before { opacity:1; }

  .pcm-success {
    position:relative; z-index:1; text-align:center;
    padding:3rem 2.5rem 2.5rem; min-height:500px;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
  }
  .pcm-success-ring-wrap {
    position:relative; width:110px; height:110px; margin:0 auto 1.5rem;
  }
  .pcm-success-ring {
    width:110px; height:110px; border-radius:50%;
    background:linear-gradient(135deg,rgba(0,201,167,0.18),rgba(91,54,242,0.22));
    display:flex; align-items:center; justify-content:center;
    animation:confirmRingExpand 0.7s cubic-bezier(.34,1.56,.64,1) both;
  }
  .pcm-success-ring-pulse {
    position:absolute; inset:0; border-radius:50%;
    border:2px solid var(--teal); opacity:0;
    animation:successPulseRing 1.8s 0.6s ease-out infinite;
  }
  .pcm-success-check { animation:confirmRingExpand 0.6s 0.2s cubic-bezier(.34,1.56,.64,1) both; font-size:2.6rem; }
  .pcm-success-title {
    font-family:var(--serif); font-size:2.1rem; font-weight:400;
    margin-bottom:0.55rem;
    animation:confirmStagger 0.5s 0.35s cubic-bezier(.22,1,.36,1) both;
  }
  .pcm-success-sub {
    font-size:0.88rem; color:var(--muted); line-height:1.7;
    max-width:400px; margin:0 auto 1.8rem;
    animation:confirmStagger 0.5s 0.45s cubic-bezier(.22,1,.36,1) both;
  }
  .pcm-success-stats {
    display:grid; grid-template-columns:repeat(3,1fr); gap:0.85rem;
    width:100%; margin-bottom:1.8rem;
  }
  .pcm-stat {
    background:#fff; border:1px solid rgba(91,54,242,0.12);
    border-radius:18px; padding:1rem 0.8rem; text-align:center;
    animation:statCardPop 0.6s cubic-bezier(.34,1.56,.64,1) both;
  }
  .pcm-stat:nth-child(1){animation-delay:0.5s}
  .pcm-stat:nth-child(2){animation-delay:0.62s}
  .pcm-stat:nth-child(3){animation-delay:0.74s}
  .pcm-stat strong { display:block; font-family:var(--serif); font-size:1.3rem; font-style:italic; margin-bottom:0.2rem; }
  .pcm-stat span { font-size:0.7rem; color:var(--muted); text-transform:uppercase; letter-spacing:0.07em; font-weight:700; }
  .pcm-success-btn { background:linear-gradient(135deg,var(--violet),var(--violet-light)); color:#fff; border:none; padding:0.9rem 2.5rem; border-radius:100px; font-family:var(--sans); font-size:0.88rem; font-weight:700; cursor:pointer; box-shadow:0 8px 28px rgba(91,54,242,0.35); transition:all 0.3s cubic-bezier(.34,1.56,.64,1); animation:confirmStagger 0.5s 0.85s cubic-bezier(.22,1,.36,1) both; }
  .pcm-success-btn:hover { transform:translateY(-2px) scale(1.04); box-shadow:0 14px 40px rgba(91,54,242,0.48); }

  .pcm-confetti { position:absolute; pointer-events:none; border-radius:3px; }

  /* ── FOOTER ── */
  .footer { background:#06040f; color:rgba(255,255,255,0.28); padding:3rem 2.5rem 2rem; border-top:1px solid rgba(255,255,255,0.05); }
  .footer-inner { max-width:1160px; margin:0 auto; }
  .footer-top { display:flex; justify-content:space-between; align-items:flex-start; gap:2rem; flex-wrap:wrap; margin-bottom:2.5rem; }
  .footer-brand .footer-logo { font-family:var(--serif); font-size:1.35rem; color:rgba(255,255,255,0.72); margin-bottom:0.5rem; font-style:italic; }
  .footer-brand .footer-logo em { color:var(--violet-light); font-style:normal; }
  .footer-brand p { font-size:0.8rem; max-width:240px; line-height:1.7; }
  .footer-links h4 { font-family:var(--display); font-size:0.78rem; font-weight:700; color:rgba(255,255,255,0.5); text-transform:uppercase; letter-spacing:0.09em; margin-bottom:0.9rem; }
  .footer-links a { display:block; font-size:0.82rem; color:rgba(255,255,255,0.3); text-decoration:none; margin-bottom:0.42rem; transition:color 0.2s; cursor:pointer; }
  .footer-links a:hover { color:rgba(255,255,255,0.8); }
  .footer-bottom { display:flex; justify-content:space-between; align-items:center; padding-top:1.5rem; border-top:1px solid rgba(255,255,255,0.05); font-size:0.75rem; flex-wrap:wrap; gap:0.5rem; }
  .footer-socials { display:flex; gap:0.65rem; }
  .fsoc { width:32px; height:32px; border-radius:8px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; font-size:13px; cursor:pointer; transition:all 0.3s cubic-bezier(.34,1.56,.64,1); text-decoration:none; color:rgba(255,255,255,0.4); }
  .fsoc:hover { background:rgba(91,54,242,0.25); border-color:rgba(91,54,242,0.4); transform:translateY(-3px); color:#fff; }

  /* ══════════════════════════════════════════
     RESPONSIVE MEDIA QUERIES
  ══════════════════════════════════════════ */

  /* ── 1200px: Large screens tightening ── */
  @media (max-width: 1200px) {
    .plans-grid { grid-template-columns: repeat(2, 1fr); }
    .detail-wrap { padding: 2rem 1.5rem; }
    .listings-wrap { padding: 2rem 1.5rem; }
    .section { padding: 4rem 1.5rem; }
  }

  /* ── 1024px: Tablets landscape ── */
  @media (max-width: 1024px) {
    .nav-search-wrap { display: none; }
    .nav-center { gap: 0; }
    .nav-item { padding: 0.42rem 0.7rem; font-size: 0.78rem; }
    .nav-plans-btn { display: none; }

    .hero { padding: 5rem 2rem 4rem; min-height: 70vh; }
    .hero h1 { font-size: clamp(2.4rem, 5vw, 4rem); }

    .detail-wrap { flex-direction: column; }
    .detail-side { width: 100%; }
    .sticky-card { position: static; }

    .co-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
    .jobs-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }

    .pcm-grid { grid-template-columns: 1fr 1fr; }
  }

  /* ── 860px: Small tablets ── */
  @media (max-width: 860px) {
    /* Navbar: hide center links, show hamburger */
    .nav-center { display: none; }
    .nav-cta { display: none; }
    .nav-mobile-toggle { display: flex; align-items: center; justify-content: center; }
    .nav-right { gap: 0.55rem; }
    .saved-pill { padding-right: 0.8rem; }

    .hero { padding: 4.5rem 1.5rem 3.5rem; }
    .hero-sub { font-size: 0.95rem; }
    .search-glass { flex-wrap: wrap; border-radius: 18px; padding: 8px; gap: 4px; }
    .search-divider { display: none; }
    .search-glass select { min-width: unset; flex: 1; font-size: 0.8rem; }
    .search-glass input { min-width: 0; }
    .search-btn { width: 100%; border-radius: var(--r-md); padding: 0.7rem; margin-top: 4px; }
    .hero-stats { gap: 2rem; flex-wrap: wrap; }

    .listings-wrap { flex-direction: column; gap: 1rem; padding: 1.5rem; }
    .sidebar { width: 100%; position: static; }

    .pcm-grid { grid-template-columns: 1fr; }
    .pcm-left { border-radius: 0; }
    .pcm-right { border-radius: 0; }

    .social-grid { grid-template-columns: 1fr; }

    .plans-grid { grid-template-columns: 1fr 1fr; }

    .compare-table th, .compare-table td { padding: 0.65rem 0.85rem; font-size: 0.77rem; }

    .enterprise-strip { flex-direction: column; text-align: center; }
    .enterprise-strip p { max-width: 100%; }
  }

  /* ── 640px: Mobile landscape / large phones ── */
  @media (max-width: 640px) {
    :root { --r-xl: 22px; }

    .nav { padding: 0 1rem; height: 60px; }
    .nav-mobile-menu { top: 60px; }
    .logo-name { font-size: 1rem; }
    .nav-right { gap: 0.45rem; }
    .nav-bell { width: 32px; height: 32px; }
    .saved-pill { padding: 5px 10px 5px 7px; }

    .hero { padding: 3.5rem 1.25rem 3rem; min-height: unset; }
    .hero-eyebrow { display: none; }
    .hero h1 { font-size: clamp(2rem, 8vw, 3rem); margin-bottom: 1rem; }
    .hero-sub { font-size: 0.9rem; margin-bottom: 1.8rem; max-width: 100%; }
    .hero-stats { gap: 1.5rem; margin-top: 2rem; }
    .hstat-num { font-size: 1.7rem; }

    .section { padding: 3rem 1.25rem; }
    .sec-title { font-size: 1.6rem; }
    .sec-head { flex-direction: column; align-items: flex-start; gap: 0.75rem; }

    .cat-grid { grid-template-columns: repeat(4, 1fr); gap: 0.6rem; }
    .cat-card { padding: 1rem 0.5rem; }
    .cat-icon { font-size: 1.35rem; margin-bottom: 0.4rem; }
    .cat-label { font-size: 0.7rem; }
    .cat-count { font-size: 0.62rem; }

    .jobs-grid { grid-template-columns: 1fr; }
    .co-grid { grid-template-columns: 1fr; }

    .job-card { padding: 1.2rem; }
    .job-title-text { font-size: 0.92rem; }

    .list-card { flex-wrap: wrap; gap: 0.75rem; padding: 1rem; }
    .list-right { width: 100%; text-align: left; display: flex; gap: 1rem; align-items: center; }
    .bk-btn { margin-left: auto; }
    .list-header { flex-direction: column; align-items: stretch; gap: 0.75rem; }
    .sort-sel { width: 100%; }

    .detail-wrap { padding: 1rem 1.25rem; gap: 1rem; }
    .detail-hdr { padding: 1.35rem; }
    .d-h1 { font-size: 1.5rem; }
    .dsec { padding: 1.25rem; }

    .resume-wrap { padding: 2rem 1.25rem; }
    .pg-h2 { font-size: 1.8rem; }
    .fgrid { grid-template-columns: 1fr; }
    .fcol2 { grid-column: 1; }

    .contact-wrap { padding: 2rem 1.25rem; }
    .contact-box { padding: 1.35rem; }
    .fgrid { grid-template-columns: 1fr; }

    .breadcrumb { padding: 0.75rem 1.25rem; }

    .plans-wrap { padding: 2.5rem 1.25rem; }
    .billing-toggle { width: 100%; max-width: 340px; justify-content: space-between; }
    .billing-opt { flex: 1; }
    .plans-grid { grid-template-columns: 1fr; }
    .plan-card { padding: 1.5rem; }
    .plan-amount { font-size: 2.4rem; }

    .compare-table { font-size: 0.72rem; }
    .compare-table th, .compare-table td { padding: 0.5rem 0.6rem; }

    .modal { padding: 1.75rem 1.25rem; }
    .modal-title { font-size: 1.4rem; }
    .modal-detail-row { flex-wrap: wrap; align-items: flex-start; gap: 0.3rem 0.75rem; }

    .plan-confirm-modal { border-radius: 16px; }
    .pcm-left { padding: 1.5rem 1.25rem; }
    .pcm-right { padding: 1.5rem 1.25rem; }
    .pcm-title { font-size: 1.6rem; }
    .pcm-success { padding: 2rem 1.25rem; }
    .pcm-success-title { font-size: 1.7rem; }
    .pcm-success-stats { grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; }
    .pcm-stat strong { font-size: 1rem; }
    .pcm-stat span { font-size: 0.6rem; }

    .social-wrap { padding: 2.5rem 1.25rem; }
    .social-ads-banner { padding: 1.25rem; }
    .ads-grid { grid-template-columns: 1fr 1fr; gap: 0.5rem; }
    .nl-form { flex-direction: column; }
    .nl-btn { width: 100%; text-align: center; border-radius: var(--r-md); }
    .community-strip { gap: 0.5rem; }
    .comm-item { min-width: calc(50% - 0.25rem); }

    .footer { padding: 2rem 1.25rem 1.5rem; }
    .footer-top { gap: 1.5rem; }
    .footer-brand { width: 100%; }
    .footer-links { min-width: calc(50% - 0.75rem); }

    .toast { bottom: 1rem; right: 1rem; left: 1rem; max-width: unset; }

    .notif-dropdown { width: calc(100vw - 2rem); right: -0.5rem; }

    .cdwrap { padding: 1.5rem 1.25rem; }
  }

  /* ── 420px: Small phones ── */
  @media (max-width: 420px) {
    .nav { padding: 0 0.75rem; gap: 0.5rem; }
    .logo-name { display: none; }
    .nav-bell { display: none; }
    .saved-pill span:not(.saved-count) { display: none; }
    .saved-pill { padding: 5px 8px; }

    .hero { padding: 3rem 1rem 2.5rem; }
    .hero h1 { font-size: 1.9rem; }
    .hero-stats { flex-direction: column; gap: 1rem; padding-top: 1.25rem; }

    .section { padding: 2.5rem 1rem; }
    .cat-grid { grid-template-columns: repeat(4, 1fr); gap: 0.45rem; }
    .cat-card { padding: 0.75rem 0.3rem; }
    .cat-icon { font-size: 1.15rem; }
    .cat-label { font-size: 0.62rem; }

    .plans-grid { grid-template-columns: 1fr; }
    .billing-opt { padding: 0.55rem 0.7rem; font-size: 0.76rem; }
    .billing-save { display: none; }

    .pcm-actions { flex-direction: column; }
    .pcm-btn-cancel, .pcm-btn-pay { flex: none; width: 100%; }

    .pay-form-grid { grid-template-columns: 1fr; }
    .pay-field.full { grid-column: 1; }

    .ads-grid { grid-template-columns: 1fr; }
    .comm-item { min-width: 100%; }

    .detail-wrap { padding: 1rem; }
    .resume-wrap { padding: 1.75rem 1rem; }
    .plans-wrap { padding: 2rem 1rem; }
    .contact-wrap { padding: 1.75rem 1rem; }
    .social-wrap { padding: 2rem 1rem; }
    .cdwrap { padding: 1rem; }
    .listings-wrap { padding: 1rem; }

    .faq-q { font-size: 0.82rem; padding: 0.9rem 1rem; }
    .footer-links { min-width: 100%; }
    .compare-table th:nth-child(3), .compare-table td:nth-child(3) { display: none; }
  }
`;

// ─── DATA ───────────────────────────────────────────────────────────────
const COMPANY_IMGS = {
  1:"https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=80&h=80&fit=crop&q=80",
  2:"https://images.unsplash.com/photo-1563986768609-322da13575f3?w=80&h=80&fit=crop&q=80",
  3:"https://images.unsplash.com/photo-1555421689-491a97ff2040?w=80&h=80&fit=crop&q=80",
  4:"https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=80&h=80&fit=crop&q=80",
  5:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=80&fit=crop&q=80",
  6:"https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=80&h=80&fit=crop&q=80",
};
const BANNER_IMGS = {
  1:"https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=120&fit=crop&q=80",
  2:"https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=120&fit=crop&q=80",
  3:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=120&fit=crop&q=80",
  4:"https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=120&fit=crop&q=80",
  5:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=120&fit=crop&q=80",
  6:"https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=120&fit=crop&q=80",
};

const JOBS = [
  { id:1, title:"Senior Product Designer", company:"Figma Inc.", logo:"Fi", color:"#7c3aed", bg:"#ede9fe", location:"San Francisco, CA", type:"Full-time", remote:true, level:"Senior", salary:"$130k–$160k", salaryNum:145, date:"2d ago", featured:true, category:"Design", description:"Lead the design of next-generation collaborative tools used by millions of designers worldwide.", requirements:["5+ years product design experience","Proficiency in Figma and prototyping","Strong systems thinking","Experience with user research","Excellent communication skills"], companyId:1 },
  { id:2, title:"Full-Stack Engineer", company:"Stripe", logo:"St", color:"#0070f3", bg:"#e6f2ff", location:"Remote", type:"Full-time", remote:true, level:"Mid", salary:"$120k–$150k", salaryNum:135, date:"1d ago", featured:true, category:"Engineering", description:"Build the financial infrastructure of the internet. Work on APIs handling billions in transactions.", requirements:["3+ years full-stack experience","Strong TypeScript/Node.js skills","Experience with distributed systems","Familiarity with PostgreSQL","Interest in fintech"], companyId:2 },
  { id:3, title:"Marketing Manager", company:"Notion", logo:"No", color:"#1d1d1d", bg:"#f0f0f0", location:"New York, NY", type:"Full-time", remote:false, level:"Mid", salary:"$90k–$115k", salaryNum:102, date:"3d ago", featured:false, category:"Marketing", description:"Drive growth initiatives and brand storytelling for one of the fastest-growing productivity tools.", requirements:["4+ years in B2B/PLG marketing","Content strategy skills","Data-driven decision making","Experience with HubSpot/Mixpanel","Exceptional writing ability"], companyId:3 },
  { id:4, title:"Data Scientist", company:"Anthropic", logo:"Ai", color:"#c84b2f", bg:"#fde8e0", location:"San Francisco, CA", type:"Full-time", remote:true, level:"Senior", salary:"$140k–$180k", salaryNum:160, date:"5h ago", featured:true, category:"Data", description:"Work on safety research at the frontier of AI. Apply statistical modelling and interpretability research.", requirements:["PhD or 4+ years applied ML","Python, PyTorch, or JAX expertise","Experience with LLMs a strong plus","Research publication record","Passion for AI safety"], companyId:4 },
  { id:5, title:"UX Researcher", company:"Airbnb", logo:"Ab", color:"#ff5a5f", bg:"#ffe8e9", location:"Remote", type:"Contract", remote:true, level:"Mid", salary:"$80–$100/hr", salaryNum:90, date:"1w ago", featured:false, category:"Design", description:"Conduct mixed-methods research to uncover host and guest insights across the Airbnb platform.", requirements:["3+ years UX research","Strong qualitative & quantitative skills","Experience with Dovetail or similar","Clear written communication","Collaborative working style"], companyId:5 },
  { id:6, title:"DevOps Engineer", company:"HashiCorp", logo:"Ha", color:"#2d6a4f", bg:"#e0f7ec", location:"Austin, TX", type:"Full-time", remote:true, level:"Senior", salary:"$125k–$155k", salaryNum:140, date:"2d ago", featured:false, category:"Engineering", description:"Scale infrastructure for enterprise customers using Terraform, Vault, and Nomad.", requirements:["5+ years DevOps/SRE","Deep Kubernetes knowledge","Terraform & Vault experience","Strong scripting (Bash/Python)","Cloud certifications a plus"], companyId:6 },
];

const COMPANIES = [
  { id:1, name:"Figma Inc.", logo:"Fi", color:"#7c3aed", bg:"#ede9fe", bannerBg:"linear-gradient(135deg,#7c3aed,#a855f7)", industry:"Design Tools · SaaS", size:"1,000–5,000", about:"Figma is a collaborative interface design tool built for web-based workflows. On a mission to make design accessible to everyone.", openRoles:14, culture:["Remote-friendly","Design-led","Inclusive"], founded:"2012", hq:"San Francisco, CA" },
  { id:2, name:"Stripe", logo:"St", color:"#0070f3", bg:"#e6f2ff", bannerBg:"linear-gradient(135deg,#0070f3,#00a8e8)", industry:"Fintech · Infrastructure", size:"5,000–10,000", about:"Stripe builds economic infrastructure for the internet. Millions of businesses rely on Stripe's APIs to accept payments and scale operations.", openRoles:38, culture:["Data-driven","High performance","Global"], founded:"2010", hq:"San Francisco, CA" },
  { id:3, name:"Notion", logo:"No", color:"#1d1d1d", bg:"#f0f0f0", bannerBg:"linear-gradient(135deg,#1d1d1d,#4a4a4a)", industry:"Productivity · SaaS", size:"500–1,000", about:"Notion is an all-in-one workspace for notes, docs, and collaboration. Redefining how teams work together.", openRoles:22, culture:["Async-first","Transparent","Creative"], founded:"2016", hq:"New York, NY" },
  { id:4, name:"Anthropic", logo:"Ai", color:"#c84b2f", bg:"#fde8e0", bannerBg:"linear-gradient(135deg,#c84b2f,#e8703a)", industry:"AI Safety · Research", size:"500–1,000", about:"Anthropic is an AI safety company building reliable, interpretable, and steerable AI systems for the long-term benefit of humanity.", openRoles:31, culture:["Mission-driven","Rigorous","Open"], founded:"2021", hq:"San Francisco, CA" },
  { id:5, name:"Airbnb", logo:"Ab", color:"#ff5a5f", bg:"#ffe8e9", bannerBg:"linear-gradient(135deg,#ff5a5f,#fc7e81)", industry:"Travel · Marketplace", size:"5,000–10,000", about:"Airbnb connects people to unique travel experiences worldwide, creating a community of belonging for all.", openRoles:9, culture:["Belong anywhere","Entrepreneurial","Community"], founded:"2008", hq:"San Francisco, CA" },
  { id:6, name:"HashiCorp", logo:"Ha", color:"#2d6a4f", bg:"#e0f7ec", bannerBg:"linear-gradient(135deg,#2d6a4f,#40916c)", industry:"DevOps · Cloud", size:"1,000–5,000", about:"HashiCorp delivers infrastructure automation software enabling organizations to provision, secure, connect, and run any infrastructure.", openRoles:17, culture:["Open source","Remote-first","Engineering-led"], founded:"2012", hq:"San Francisco, CA" },
];

const CATEGORIES = [
  {icon:"💻",label:"Engineering",count:"2,143"},{icon:"🎨",label:"Design",count:"893"},
  {icon:"📊",label:"Data",count:"1,201"},{icon:"📣",label:"Marketing",count:"744"},
  {icon:"💰",label:"Finance",count:"623"},{icon:"🤝",label:"Sales",count:"1,055"},
  {icon:"⚕️",label:"Healthcare",count:"381"},{icon:"🏗️",label:"Operations",count:"502"},
];

const NOTIFICATIONS = [
  { color:"#5b36f2", text:"New match: Senior Designer at Figma — 97% fit for your profile", time:"2 min ago" },
  { color:"#00c9a7", text:"Stripe viewed your resume — apply now before it closes", time:"1 hr ago" },
  { color:"#f24b6e", text:"Job alert: 14 new Data roles in San Francisco this week", time:"3 hr ago" },
  { color:"#f5a623", text:"Your Pro trial expires in 3 days — upgrade to keep alerts", time:"1 day ago" },
];

const SOCIALS = [
  { name:"X / Twitter", handle:"@WorkBoardHQ", logo:"𝕏", logoColor:"#fff", logoBg:"#000", gradient:"linear-gradient(135deg,#000 0%,#222 100%)", border:"rgba(255,255,255,0.1)", followers:"48.2K", posts:"12.4K", url:"https://twitter.com", cta:"Follow", delay:"0s" },
  { name:"LinkedIn", handle:"WorkBoard Official", logo:"in", logoColor:"#fff", logoBg:"#0077b5", gradient:"linear-gradient(135deg,#0055a5 0%,#0077b5 100%)", border:"rgba(0,119,181,0.3)", followers:"112K", posts:"3.8K", url:"https://linkedin.com", cta:"Connect", delay:"0.06s" },
  { name:"YouTube", handle:"WorkBoard Careers", logo:"▶", logoColor:"#fff", logoBg:"#ff0000", gradient:"linear-gradient(135deg,#c00 0%,#ff2222 100%)", border:"rgba(255,0,0,0.2)", followers:"23.4K", posts:"284", url:"https://youtube.com", cta:"Subscribe", delay:"0.12s" },
  { name:"Instagram", handle:"@workboard.io", logo:"📸", logoColor:"#fff", logoBg:"#c13584", gradient:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", border:"rgba(193,53,132,0.3)", followers:"38.7K", posts:"1.2K", url:"https://instagram.com", cta:"Follow", delay:"0.18s" },
  { name:"Discord", handle:"Community Server", logo:"💬", logoColor:"#fff", logoBg:"#5865f2", gradient:"linear-gradient(135deg,#4752c4 0%,#7289da 100%)", border:"rgba(88,101,242,0.3)", followers:"14.9K", posts:"Online", url:"https://discord.com", cta:"Join", delay:"0.24s" },
  { name:"GitHub", handle:"workboard-hq", logo:"⌥", logoColor:"#fff", logoBg:"#24292e", gradient:"linear-gradient(135deg,#24292e 0%,#3a4049 100%)", border:"rgba(255,255,255,0.08)", followers:"6.1K", posts:"142", url:"https://github.com", cta:"Star", delay:"0.30s" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────
function Badge({ variant, children }) {
  const cls = { type:"t-full", remote:"t-remote", level:"t-level", featured:"t-featured" };
  return <span className={`tag ${cls[variant]||"t-level"}`}>{children}</span>;
}

function CoLogo({ companyId, fallback, color, bg, size=48, radius=13 }) {
  const [err,setErr]=useState(false);
  const img=COMPANY_IMGS[companyId];
  if(!err&&img) return <div style={{width:size,height:size,borderRadius:radius,overflow:"hidden",flexShrink:0}}><img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={()=>setErr(true)}/></div>;
  return <div style={{width:size,height:size,borderRadius:radius,background:bg,color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--display)",fontWeight:800,fontSize:size*0.35,flexShrink:0}}>{fallback}</div>;
}

function JobCard({ job, saved, onSave, onClick, delay=0, premium=false }) {
  return (
    <div className={`job-card${premium?" premium-card":""}`} style={{animationDelay:`${delay}s`}} onClick={()=>onClick(job)}>
      {premium&&<><div className="premium-orb one"/><div className="premium-orb two"/></>}
      <div className="jc-top">
        <div className="jc-logo-wrap">
          <div className="jc-logo-anim">
            <CoLogo companyId={job.companyId} fallback={job.logo} color={job.color} bg={job.bg}/>
          </div>
          <div>
            {premium&&<div className="premium-kicker"><span className="premium-kicker-dot"/>Signature Pick</div>}
            <div className="job-title-text">{job.title}</div>
            <div className="job-co">{job.company} · {job.location}</div>
          </div>
        </div>
        <button className={`bk-btn${saved?" saved":""}`} onClick={e=>{e.stopPropagation();onSave(job.id);}}>
          {saved?"♥":"♡"}
        </button>
      </div>
      <div className="job-tags">
        {job.featured&&<Badge variant="featured">⭐ Featured</Badge>}
        <Badge variant="type">{job.type}</Badge>
        {job.remote&&<Badge variant="remote">Remote</Badge>}
        <Badge variant="level">{job.level}</Badge>
      </div>
      <div className="jc-foot">
        <span className="j-salary">{job.salary}</span>
        <span className="j-date">{job.date}</span>
      </div>
    </div>
  );
}

// ─── APPLY MODAL ────────────────────────────────────────────────────────
function ConfettiPiece({style}){ return <div className="modal-confetti" style={{...style,width:"12px",height:"12px",animation:`confettiBurst ${0.7+Math.random()*0.5}s ${Math.random()*0.25}s ease-out both`}}/>; }

function ApplyModal({job,onClose}){
  const colors=["#5b36f2","#00c9a7","#f24b6e","#f5a623","#9b7ff7"];
  const pieces=Array.from({length:22},(_,i)=>({
    left:`${4+(i/22)*92}%`, top:`${55+Math.random()*35}%`,
    background:colors[i%colors.length],
    transform:`rotate(${Math.random()*360}deg)`,
    '--cx':`${(Math.random()-0.5)*80}px`,
    '--cy':`${-(40+Math.random()*80)}px`,
    '--cr':`${(Math.random()-0.5)*720}deg`,
    borderRadius:Math.random()>0.5?"50%":"3px",
  }));
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        {pieces.map((s,i)=><ConfettiPiece key={i} style={s}/>)}
        <div className="modal-icon-wrap">🎉</div>
        <div className="modal-title">Application Submitted!</div>
        <div className="modal-body">Your application for <strong>{job?.title}</strong> at <strong>{job?.company}</strong> has been sent. We'll notify you of updates.</div>
        <div className="modal-details">
          {[["Position",job?.title],["Company",job?.company],["Location",job?.location],["Status","✓ Under Review"]].map(([l,v],i)=>(
            <div key={i} className="modal-detail-row"><span className="modal-detail-label">{l}</span><span className="modal-detail-value" style={l==="Status"?{color:"#00c9a7"}:{}}>{v}</span></div>
          ))}
        </div>
        <button className="modal-btn-primary" onClick={onClose}>Back to Jobs</button>
        <button className="modal-btn-secondary" onClick={onClose}>View Application Tracker</button>
      </div>
    </div>
  );
}

function ResumeModal({fileName,onClose}){
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-icon-wrap" style={{background:"linear-gradient(135deg,#d6fdf6,#ede8ff)"}}>📄</div>
        <div className="modal-title">Resume Live!</div>
        <div className="modal-body">Your resume is now visible to recruiters at top companies. You can update anytime from your profile.</div>
        <div className="modal-details">
          {[["File",fileName||"resume.pdf"],["Visibility","✓ Public to Recruiters"],["Profile Strength","72%"]].map(([l,v],i)=>(
            <div key={i} className="modal-detail-row"><span className="modal-detail-label">{l}</span><span className="modal-detail-value" style={l==="Visibility"?{color:"#00c9a7"}:{}}>{v}</span></div>
          ))}
        </div>
        <button className="modal-btn-primary" onClick={onClose}>Continue to Profile</button>
        <button className="modal-btn-secondary" onClick={onClose}>Upload Different File</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PREMIUM PLAN CONFIRMATION MODAL
// ═══════════════════════════════════════════════════════════
const BANKS = [
  { name:"HDFC Bank",   type:"Net Banking / UPI", color:"#c13b2f", bg:"#fde8e7", abbr:"HD" },
  { name:"SBI",         type:"State Bank of India", color:"#003366", bg:"#e6eef7", abbr:"SB" },
  { name:"ICICI Bank",  type:"Net Banking / UPI", color:"#b5451b", bg:"#fceae5", abbr:"IC" },
  { name:"Axis Bank",   type:"Net Banking / UPI", color:"#97144d", bg:"#fce8f0", abbr:"AX" },
];
const UPI_APPS = [
  { icon:"📱", label:"PhonePe", color:"#5f259f" },
  { icon:"💚", label:"Google Pay", color:"#4285f4" },
  { icon:"🅿️", label:"Paytm", color:"#002970" },
  { icon:"🔵", label:"BHIM", color:"#0066cc" },
];

function PlanConfirmModal({ plan, billing, price, onClose, onSuccess }) {
  const [tab, setTab] = useState("card");
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedUpi, setSelectedUpi] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [paying, setPaying] = useState(false);
  const annual = billing === "annual";

  const confettiPieces = Array.from({length:28},(_,i)=>({
    left:`${4+(i/28)*92}%`, top:`${50+Math.random()*38}%`,
    background:["#5b36f2","#00c9a7","#f24b6e","#f5a623","#9b7ff7","#fff"][i%6],
    '--cx':`${(Math.random()-0.5)*120}px`,
    '--cy':`${-(50+Math.random()*100)}px`,
    '--cr':`${(Math.random()-0.5)*800}deg`,
    borderRadius:Math.random()>0.5?"50%":"3px",
    width:`${8+Math.random()*8}px`, height:`${8+Math.random()*8}px`,
  }));

  const handlePay = () => {
    setPaying(true);
    setTimeout(()=>{ setPaying(false); setConfirmed(true); }, 1800);
  };

  return (
    <div className="plan-confirm-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="plan-confirm-modal">
        {confirmed ? (
          <div className="pcm-success">
            {confettiPieces.map((s,i)=>(
              <div key={i} className="pcm-confetti" style={{...s, position:"absolute", animation:`confettiBurst ${0.7+Math.random()*0.6}s ${i*0.03}s ease-out both`}}/>
            ))}
            <div className="pcm-success-ring-wrap">
              <div className="pcm-success-ring">
                <span className="pcm-success-check">✅</span>
              </div>
              <div className="pcm-success-ring-pulse"/>
            </div>
            <div className="pcm-success-title">You're on {plan.name}!</div>
            <div className="pcm-success-sub">Your payment was processed successfully. All premium features are now unlocked and ready to use.</div>
            <div className="pcm-success-stats">
              {[
                [plan.name,"Plan"],
                [annual?"Annual":"Monthly","Billing"],
                ["Active","Status"],
              ].map(([v,l],i)=>(
                <div key={i} className="pcm-stat">
                  <strong>{v}</strong>
                  <span>{l}</span>
                </div>
              ))}
            </div>
            <button className="pcm-success-btn" onClick={onSuccess}>Start Using {plan.name} →</button>
          </div>
        ) : (
          <div className="pcm-grid">
            <div className="pcm-left">
              <div className="pcm-badge">✦ Secure Checkout</div>
              <div className="pcm-title">Upgrade to<br/><em style={{fontStyle:"italic",color:"var(--violet-light)"}}>{plan.name}</em></div>
              <div className="pcm-sub">Unlock all features instantly. Cancel anytime — no hidden fees, no long-term contracts.</div>
              <div className="pcm-summary">
                <div className="pcm-row"><span>Plan</span><strong>{plan.name} — {annual?"Annual":"Monthly"}</strong></div>
                <div className="pcm-row"><span>Billing</span><strong>{annual?"Billed annually":"Month-to-month"}</strong></div>
                {annual&&<div className="pcm-row"><span>Savings</span><strong style={{color:"#00c9a7"}}>Save 25% vs monthly</strong></div>}
                <div className="pcm-row total"><span>Total today</span><strong style={{fontSize:"1.05rem"}}>${price}{annual?"/yr":"/mo"}</strong></div>
              </div>
              <div className="pcm-secure-note">🔒 256-bit SSL · PCI-DSS compliant · Instant activation</div>
            </div>

            <div className="pcm-right">
              <div className="pcm-right-title">Complete Payment</div>
              <div className="pcm-right-sub">Choose your preferred payment method</div>

              <div className="pay-method-tabs">
                {[
                  {key:"card",  icon:"💳", label:"Card"},
                  {key:"upi",   icon:"📲", label:"UPI"},
                  {key:"bank",  icon:"🏦", label:"Net Banking"},
                ].map(t=>(
                  <button key={t.key} className={`pay-method-tab${tab===t.key?" active":""}`} onClick={()=>setTab(t.key)}>
                    <span className="pay-method-tab-icon">{t.icon}</span>{t.label}
                  </button>
                ))}
              </div>

              {tab==="card"&&(
                <div className="card-panel">
                  <div className="card-visual">
                    <div className="card-chip">💳</div>
                    <div className="card-number">•••• •••• •••• ••••</div>
                    <div className="card-row">
                      <div><div style={{marginBottom:"2px"}}>Card Holder</div><div style={{fontWeight:700,fontSize:"0.82rem"}}>Your Name</div></div>
                      <div><div style={{marginBottom:"2px"}}>Expires</div><div style={{fontWeight:700,fontSize:"0.82rem"}}>MM / YY</div></div>
                    </div>
                  </div>
                  <div className="pay-form-grid">
                    <div className="pay-field full"><label>Card Number</label><input placeholder="1234 5678 9012 3456" maxLength={19}/></div>
                    <div className="pay-field"><label>Expiry</label><input placeholder="MM / YY" maxLength={7}/></div>
                    <div className="pay-field"><label>CVV</label><input placeholder="•••" type="password" maxLength={4}/></div>
                    <div className="pay-field full"><label>Name on Card</label><input placeholder="As printed on card"/></div>
                  </div>
                </div>
              )}

              {tab==="upi"&&(
                <div className="upi-panel">
                  <div className="upi-logo-row">
                    {UPI_APPS.map((u,i)=>(
                      <div key={i} className={`upi-app${selectedUpi===i?" selected":""}`} onClick={()=>setSelectedUpi(i)}>
                        <div className="upi-icon">{u.icon}</div>
                        <div className="upi-label">{u.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{fontSize:"0.78rem",color:"var(--muted)",marginBottom:"0.85rem",textAlign:"center"}}>or enter your UPI ID</div>
                  <div className="upi-id-wrap">
                    <span className="upi-id-prefix">@</span>
                    <input className="upi-id-input" placeholder="yourname@upi"/>
                  </div>
                  <button className="upi-verify-btn" style={{marginBottom:"0.75rem"}}>💬 Verify & Generate Request</button>
                </div>
              )}

              {tab==="bank"&&(
                <div className="bank-panel">
                  <div className="bank-list">
                    {BANKS.map((b,i)=>(
                      <div key={i} className={`bank-item${selectedBank===i?" selected":""}`} onClick={()=>setSelectedBank(i)}>
                        <div className="bank-logo" style={{background:b.bg,color:b.color}}>{b.abbr}</div>
                        <div style={{flex:1}}>
                          <div className="bank-name">{b.name}</div>
                          <div className="bank-type">{b.type}</div>
                        </div>
                        <div className="bank-check">{selectedBank===i&&"✓"}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{fontSize:"0.75rem",color:"var(--muted)"}}>You'll be redirected to your bank's secure page to complete the transaction.</div>
                </div>
              )}

              <div className="pcm-actions">
                <button className="pcm-btn-cancel" onClick={onClose}>Cancel</button>
                <button className="pcm-btn-pay" onClick={handlePay} disabled={paying}>
                  {paying
                    ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
                        <span style={{display:"inline-block",width:"14px",height:"14px",border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
                        Processing…
                      </span>
                    : `Pay $${price} ${annual?"/yr":"/mo"} →`
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

// ─── PAGES ────────────────────────────────────────────────────────────────
function HomePage({onJobClick,onNav,savedJobs,onSave}){
  return (
    <div className="page-stage">
      <div className="hero">
        <div className="hero-mesh"/><div className="hero-grid"/>
        <div className="hero-inner">
          <div className="hero-eyebrow"><span className="hero-eyebrow-dot"/><span>8,400+ active listings this week</span></div>
          <h1>Find Work Worth<br/><span className="gradient">Waking Up</span> For</h1>
          <p className="hero-sub">Curated roles at companies building the future. No recruiter spam — only opportunities that matter.</p>
          <div className="search-container">
            <div className="search-glass">
              <span className="search-icon">🔍</span>
              <input placeholder="Job title, skill, keyword…"/>
              <span className="search-divider"/>
              <select><option>All Locations</option><option>Remote</option><option>San Francisco</option><option>New York</option><option>Austin</option><option>London</option></select>
              <button className="search-btn" onClick={()=>onNav("listings")}>Search →</button>
            </div>
          </div>
          <div className="hero-stats">
            {[["8,412","Live Jobs"],["1,203","Companies"],["94k","Hired"]].map(([n,l])=>(
              <div key={l}><div className="hstat-num">{n}</div><div className="hstat-label">{l}</div></div>
            ))}
          </div>
        </div>
        <div className="hero-cards">
          {[{id:1,logo:"Fi",bg:"#ede9fe",color:"#7c3aed",title:"Senior Designer",sub:"Figma Inc."},{id:2,logo:"St",bg:"#e6f2ff",color:"#0070f3",title:"Full-Stack Eng.",sub:"Stripe"},{id:4,logo:"Ai",bg:"#fde8e0",color:"#c84b2f",title:"Data Scientist",sub:"Anthropic"}].map((c,i)=>(
            <div className="float-card" key={i}>
              <CoLogo companyId={c.id} fallback={c.logo} color={c.color} bg={c.bg} size={42} radius={10}/>
              <div><div className="fc-title">{c.title}</div><div className="fc-sub">{c.sub}</div></div>
              <div className="fc-badge"/>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="sec-head"><div><div className="sec-title">Browse by <em>Category</em></div><div className="sec-sub">Explore roles across every discipline</div></div></div>
        <div className="cat-grid">
          {CATEGORIES.map((c,i)=>(
            <div key={c.label} className="cat-card fade-in" style={{animationDelay:`${i*0.05}s`}} onClick={()=>onNav("listings")}>
              <span className="cat-icon">{c.icon}</span>
              <div className="cat-label">{c.label}</div>
              <div className="cat-count">{c.count} jobs</div>
            </div>
          ))}
        </div>
      </div>

      <hr className="divider"/>

      <div className="section">
        <div className="sec-head">
          <div><div className="sec-title"><em>Featured</em> Opportunities</div><div className="sec-sub">Hand-picked roles updated daily</div></div>
          <button className="sec-link" onClick={()=>onNav("listings")}>View all →</button>
        </div>
        <div className="jobs-grid">
          {JOBS.filter(j=>j.featured).map((job,i)=>(
            <JobCard key={job.id} job={job} saved={savedJobs.includes(job.id)} onSave={onSave} onClick={onJobClick} delay={i*0.1} premium={i===0}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListingsPage({onJobClick,savedJobs,onSave}){
  const [salary,setSalary]=useState(200);
  const [types,setTypes]=useState([]);
  const [levels,setLevels]=useState([]);
  const [remoteOnly,setRemoteOnly]=useState(false);
  const [filtersOpen,setFiltersOpen]=useState(false);
  const toggleArr=(arr,setArr,val)=>setArr(arr.includes(val)?arr.filter(x=>x!==val):[...arr,val]);
  const filtered=JOBS.filter(j=>{
    if(j.salaryNum>salary)return false;
    if(types.length&&!types.includes(j.type))return false;
    if(levels.length&&!levels.includes(j.level))return false;
    if(remoteOnly&&!j.remote)return false;
    return true;
  });
  return (
    <div className="listings-wrap">
      <aside className="sidebar">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div className="sf-title">Refine Results</div>
          <button style={{display:"none"}} className="filter-toggle" onClick={()=>setFiltersOpen(v=>!v)}>
            {filtersOpen?"Hide ▲":"Show ▼"}
          </button>
        </div>
        <div className="fg"><label>Salary (up to)</label><input type="range" min="50" max="200" value={salary} step="1" onChange={e=>setSalary(+e.target.value)}/><div className="range-val">${salary}k / year</div></div>
        <div className="fg"><label>Job Type</label>{["Full-time","Part-time","Contract","Internship"].map(t=><div key={t} className="fopt"><input type="checkbox" checked={types.includes(t)} onChange={()=>toggleArr(types,setTypes,t)}/><span>{t}</span></div>)}</div>
        <div className="fg"><label>Experience</label>{["Junior","Mid","Senior","Lead"].map(l=><div key={l} className="fopt"><input type="checkbox" checked={levels.includes(l)} onChange={()=>toggleArr(levels,setLevels,l)}/><span>{l}</span></div>)}</div>
        <div className="fg"><label>Work Mode</label><div className="fopt"><input type="checkbox" checked={remoteOnly} onChange={e=>setRemoteOnly(e.target.checked)}/><span>Remote only</span></div></div>
        <button className="reset-btn" onClick={()=>{setSalary(200);setTypes([]);setLevels([]);setRemoteOnly(false);}}>Reset Filters</button>
      </aside>
      <main className="listings-main">
        <div className="list-header">
          <div className="list-count">Showing <strong>{filtered.length}</strong> of {JOBS.length} jobs</div>
          <select className="sort-sel"><option>Most Recent</option><option>Highest Salary</option><option>Most Relevant</option></select>
        </div>
        {filtered.map((job,i)=>(
          <div key={job.id} className="list-card" style={{animationDelay:`${i*0.06}s`}} onClick={()=>onJobClick(job)}>
            <CoLogo companyId={job.companyId} fallback={job.logo} color={job.color} bg={job.bg} size={44} radius={11}/>
            <div className="list-info">
              <div className="job-title-text" style={{fontSize:"0.94rem"}}>{job.title}</div>
              <div className="list-meta"><span>{job.company}</span><span>·</span><span>📍 {job.location}</span><Badge variant="type">{job.type}</Badge>{job.remote&&<Badge variant="remote">Remote</Badge>}</div>
            </div>
            <div className="list-right"><div className="j-salary" style={{fontSize:"0.9rem"}}>{job.salary}</div><div className="j-date">{job.date}</div></div>
            <button className={`bk-btn${savedJobs.includes(job.id)?" saved":""}`} style={{position:"static"}} onClick={e=>{e.stopPropagation();onSave(job.id);}}>{savedJobs.includes(job.id)?"♥":"♡"}</button>
          </div>
        ))}
        {!filtered.length&&<div className="empty-state"><span className="empty-icon">🔍</span><h3>No matches found</h3><p>Try relaxing your filter criteria.</p></div>}
      </main>
    </div>
  );
}

function JobDetailPage({job,savedJobs,onSave,onApply,onCompanyClick}){
  const company=COMPANIES.find(c=>c.id===job.companyId);
  const isSaved=savedJobs.includes(job.id);
  return (
    <div className="detail-wrap fade-in">
      <div className="detail-main">
        <div className="detail-hdr">
          <div className="d-logo-row">
            <CoLogo companyId={job.companyId} fallback={job.logo} color={job.color} bg={job.bg} size={64} radius={16}/>
            <div><div className="d-h1">{job.title}</div><div className="d-coname" onClick={()=>company&&onCompanyClick(company)}>{job.company} ↗</div></div>
          </div>
          <div className="job-tags">{job.featured&&<Badge variant="featured">⭐ Featured</Badge>}<Badge variant="type">{job.type}</Badge>{job.remote&&<Badge variant="remote">Remote</Badge>}<Badge variant="level">{job.level}</Badge></div>
          <div className="d-facts"><div className="fact">📍 {job.location}</div><div className="fact">🕐 {job.type}</div><div className="fact">📅 Posted {job.date}</div><div className="fact">🎯 {job.level}</div></div>
        </div>
        {/* Mobile sticky apply bar */}
        <div style={{display:"none"}} className="mobile-apply-bar">
          <button className="apply-btn" style={{borderRadius:"var(--r-md)"}} onClick={onApply}>Apply Now →</button>
        </div>
        <div className="dsec fade-in-1"><h3>About the Role</h3><p>{job.description}</p><p>You'll collaborate closely with engineering, product, and leadership. High-impact, high-autonomy — for someone who cares deeply about craft.</p></div>
        <div className="dsec fade-in-2"><h3>Requirements</h3><ul className="req-list">{job.requirements.map((r,i)=><li key={i}>{r}</li>)}</ul></div>
        <div className="dsec fade-in-3"><h3>What We Offer</h3><ul className="req-list"><li>Salary: {job.salary}</li><li>Equity package with 4-year vesting</li><li>Health, dental & vision coverage</li><li>$2,000 annual learning budget</li><li>Flexible PTO & remote culture</li></ul></div>
        {company&&<div className="dsec fade-in-4"><h3>About {company.name}</h3><p>{company.about}</p><div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",marginTop:"0.75rem"}}>{company.culture.map(c=><Badge key={c} variant="level">{c}</Badge>)}</div></div>}
      </div>
      <div className="detail-side">
        <div className="sticky-card">
          <div className="sc-label">Compensation</div>
          <div className="sc-salary">{job.salary}</div>
          <button className="apply-btn" onClick={onApply}>Apply Now →</button>
          <button className="save-btn" onClick={()=>onSave(job.id)}>{isSaved?"♥ Saved":"♡ Save Job"}</button>
          <div className="sc-deadline">⏰ Closes in ~2 weeks</div>
          <div className="sc-meta">📍 {job.location}<br/>🕐 {job.type}<br/>{company&&<>🏢 {company.size} employees</>}</div>
        </div>
      </div>
    </div>
  );
}

function CompaniesPage({onCompanyClick}){
  return (
    <div className="page-stage">
      <div className="section">
        <div className="sec-head"><div><div className="sec-title">Top Companies <em>Hiring Now</em></div><div className="sec-sub">Explore culture, mission and open roles</div></div></div>
        <div className="co-grid">
          {COMPANIES.map((co,i)=>(
            <div key={co.id} className="co-card" style={{animationDelay:`${i*0.07}s`}} onClick={()=>onCompanyClick(co)}>
              <div className="co-banner" style={{background:co.bannerBg}}>
                <img src={BANNER_IMGS[co.id]} alt="" className="co-banner-bg" onError={e=>e.target.style.display="none"}/>
                <div className="co-banner-overlay"/>
              </div>
              <div className="co-body">
                <div className="co-header-row">
                  <CoLogo companyId={co.id} fallback={co.logo} color={co.color} bg={co.bg} size={46} radius={11}/>
                  <div style={{marginTop:"0.2rem"}}><div className="co-name">{co.name}</div><div className="co-ind">{co.industry}</div></div>
                </div>
                <div className="co-desc">{co.about.slice(0,112)}…</div>
                <div className="co-foot"><span className="roles-badge">{co.openRoles} open roles</span><span className="co-size-txt">{co.size} emp.</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompanyDetailPage({company,jobs,onJobClick}){
  const cjobs=jobs.filter(j=>j.companyId===company.id);
  return (
    <div className="cdwrap fade-in">
      <div className="dsec" style={{marginBottom:"1.1rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"1.3rem",marginBottom:"1.5rem",flexWrap:"wrap"}}>
          <CoLogo companyId={company.id} fallback={company.logo} color={company.color} bg={company.bg} size={72} radius={18}/>
          <div><div style={{fontFamily:"var(--serif)",fontSize:"1.9rem",fontWeight:400}}>{company.name}</div><div style={{color:"var(--muted)",fontSize:"0.88rem"}}>{company.industry} · Founded {company.founded} · {company.hq}</div></div>
        </div>
        <p style={{fontSize:"0.9rem",lineHeight:1.82,color:"#4a4862",marginBottom:"1rem"}}>{company.about}</p>
        <div style={{display:"flex",gap:"0.65rem",flexWrap:"wrap"}}>
          <div className="fact">🏢 {company.size} employees</div>
          <div className="fact">📍 {company.hq}</div>
          <div className="fact">📅 Founded {company.founded}</div>
        </div>
      </div>
      <div className="dsec" style={{marginBottom:"1.1rem"}}><h3>Culture & Values</h3><div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap",marginTop:"0.5rem"}}>{company.culture.map(c=><div key={c} style={{background:"var(--cream)",padding:"0.45rem 1rem",borderRadius:"100px",fontSize:"0.83rem",fontWeight:600}}>{c}</div>)}</div></div>
      <div className="dsec"><h3>Open Roles at {company.name}</h3>
        {cjobs.length?cjobs.map(job=>(
          <div key={job.id} className="list-card" onClick={()=>onJobClick(job)} style={{marginTop:"0.65rem"}}>
            <CoLogo companyId={job.companyId} fallback={job.logo} color={job.color} bg={job.bg} size={42} radius={10}/>
            <div className="list-info"><div className="job-title-text" style={{fontSize:"0.94rem"}}>{job.title}</div><div className="list-meta"><span>📍 {job.location}</span><Badge variant="type">{job.type}</Badge></div></div>
            <div className="list-right"><div className="j-salary">{job.salary}</div></div>
          </div>
        )):<p style={{color:"var(--muted)",fontSize:"0.85rem"}}>No open roles right now.</p>}
      </div>
    </div>
  );
}

function ResumePage({onUploadDone}){
  const [file,setFile]=useState(null);
  const [progress,setProgress]=useState(0);
  const [stage,setStage]=useState(0);
  const [drag,setDrag]=useState(false);
  const fileRef=useRef();
  const STAGES=["Uploading","Parsing","Analysing","Indexing"];
  const handleFile=(f)=>{
    if(!f)return;
    setFile({name:f.name,size:(f.size/1024).toFixed(0)+" KB"});
    setStage(1); setProgress(0);
    let p=0;
    const iv=setInterval(()=>{
      p+=Math.random()*14+6;
      if(p>=100){clearInterval(iv);setProgress(100);setTimeout(()=>{setStage(2);onUploadDone(f.name);},400);}
      else setProgress(Math.min(Math.round(p),99));
    },200);
  };
  const currentStage=stage===1?Math.floor(progress/25):4;
  return (
    <div className="resume-wrap">
      <div className="pg-h2 fade-in">Upload Your Resume</div>
      <p className="pg-sub fade-in-1">Let employers find you. Upload once — apply everywhere with one click.</p>
      {stage===0&&(
        <div className={`upload-stage fade-in-2${drag?" drag":""}`} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}} onClick={()=>fileRef.current.click()}>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
          <div className="upload-bg-mesh"/><div className="upload-orb upload-orb-1"/><div className="upload-orb upload-orb-2"/><div className="upload-grid-lines"/><div className="upload-scan-line"/>
          <div className="upload-content">
            <div className="upload-icon-wrap"><div className="upload-icon-ring"><span className="upload-icon-inner">📄</span></div></div>
            <div className="upload-title">{drag?"Drop it here!":"Drag & Drop Your Resume"}</div>
            <div className="upload-hint" style={{marginBottom:"0.6rem"}}>or click to browse your files</div>
            <div className="upload-formats">{["PDF","DOC","DOCX"].map(f=><span key={f} className="upload-fmt-badge">{f}</span>)}<span className="upload-fmt-badge">Max 5MB</span></div>
          </div>
        </div>
      )}
      {stage===1&&(
        <div className="upload-progress-stage">
          <div className="up-file-row">
            <div className="up-file-icon">📎</div>
            <div style={{flex:1}}><div className="up-file-name">{file?.name}</div><div className="up-file-size">{file?.size}</div></div>
            <div style={{fontFamily:"var(--display)",fontWeight:700,fontSize:"1.2rem",color:"var(--violet-light)"}}>{progress}%</div>
          </div>
          <div className="up-prog-bar"><div className="up-prog-fill" style={{width:`${progress}%`}}/></div>
          <div className="up-prog-labels"><span>Processing…</span><span style={{color:"var(--violet-light)"}}>AI-powered scan</span></div>
          <div className="up-stages">{STAGES.map((s,i)=><div key={s} className={`up-stage-pill${i===currentStage?" active":i<currentStage?" done":""}`}><span className="up-stage-dot"/>{i<currentStage?"✓ ":""}{s}</div>)}</div>
        </div>
      )}
      {stage===2&&(
        <div className="upload-success">
          <div className="up-success-icon">✅</div>
          <div className="up-success-title">Resume is Live!</div>
          <div className="up-success-sub">{file?.name} · AI-parsed · Profile updated</div>
          <div className="up-success-chips"><span className="up-chip up-chip-green">✓ Recruiter visible</span><span className="up-chip up-chip-green">✓ Skills extracted</span><span className="up-chip">72% profile strength</span><span className="up-chip">14 matches found</span></div>
          <button className="up-change-btn" onClick={()=>{setStage(0);setFile(null);}}>Upload a different file</button>
        </div>
      )}
      <div className="resume-form fade-in-3">
        <div className="rf-title">Profile Details</div>
        <div className="fgrid">
          <div className="fg2"><label>First Name</label><input placeholder="Jane"/></div>
          <div className="fg2"><label>Last Name</label><input placeholder="Smith"/></div>
          <div className="fg2"><label>Email</label><input type="email" placeholder="jane@example.com"/></div>
          <div className="fg2"><label>Phone</label><input placeholder="+91 98765 43210"/></div>
          <div className="fg2"><label>Current Role</label><input placeholder="Senior Designer"/></div>
          <div className="fg2"><label>Desired Salary</label><input placeholder="₹25,00,000"/></div>
          <div className="fg2 fcol2"><label>Brief Bio</label><textarea placeholder="A short intro about yourself, your background, and what you're looking for…"/></div>
          <div className="fg2"><label>LinkedIn</label><input placeholder="linkedin.com/in/janesmith"/></div>
          <div className="fg2"><label>Portfolio</label><input placeholder="janesmith.com"/></div>
        </div>
        <button className="sub-btn" onClick={()=>onUploadDone("profile_resume.pdf")}>Save Profile & Go Live</button>
      </div>
    </div>
  );
}

function SavedPage({savedJobs,jobs,onJobClick,onSave}){
  const saved=jobs.filter(j=>savedJobs.includes(j.id));
  if(!saved.length) return <div className="empty-state"><span className="empty-icon">♡</span><h3>No saved jobs yet</h3><p>Bookmark roles — they'll appear here.</p></div>;
  return (
    <div className="section page-stage">
      <div className="sec-head"><div><div className="sec-title"><em>Saved</em> Jobs</div><div className="sec-sub">{saved.length} job{saved.length!==1?"s":""} bookmarked</div></div></div>
      <div className="jobs-grid">{saved.map((job,i)=><JobCard key={job.id} job={job} saved onSave={onSave} onClick={onJobClick} delay={i*0.07}/>)}</div>
    </div>
  );
}

function ContactPage({onToast}){
  const [tab,setTab]=useState("seeker");
  return (
    <div className="contact-wrap">
      <div className="pg-h2 fade-in">Get in Touch</div>
      <p className="pg-sub fade-in-1">Whether you're hiring or seeking — we're here to help.</p>
      <div className="ctabs">
        <button className={`ctab${tab==="seeker"?" active":""}`} onClick={()=>setTab("seeker")}>Job Seeker</button>
        <button className={`ctab${tab==="employer"?" active":""}`} onClick={()=>setTab("employer")}>Employer</button>
      </div>
      {tab==="seeker"&&(
        <div className="contact-box fade-in">
          <div className="cb-h3">Need help with your search?</div>
          <p className="cb-desc">Have a question about a listing or your account? Drop us a message.</p>
          <div className="fgrid">
            <div className="fg2"><label>Name</label><input placeholder="Your name"/></div>
            <div className="fg2"><label>Email</label><input placeholder="your@email.com"/></div>
            <div className="fg2 fcol2"><label>Subject</label><select><option>General Inquiry</option><option>Account Issue</option><option>Report a Listing</option><option>Other</option></select></div>
            <div className="fg2 fcol2"><label>Message</label><textarea placeholder="Tell us what's on your mind…" rows="5"/></div>
          </div>
          <button className="sub-btn" onClick={()=>onToast("✉️ Message sent! We'll respond within 24h.")}>Send Message</button>
        </div>
      )}
      {tab==="employer"&&(
        <div className="contact-box fade-in">
          <div className="cb-h3">Post a job or partner with us</div>
          <p className="cb-desc">Reach thousands of qualified candidates. Let's talk.</p>
          <div className="fgrid">
            <div className="fg2"><label>Your Name</label><input placeholder="Jane Smith"/></div>
            <div className="fg2"><label>Company</label><input placeholder="Acme Corp"/></div>
            <div className="fg2"><label>Work Email</label><input placeholder="jane@company.com"/></div>
            <div className="fg2"><label>Team Size</label><select><option>1–10</option><option>11–50</option><option>51–200</option><option>201–1000</option><option>1000+</option></select></div>
            <div className="fg2 fcol2"><label>Inquiry Type</label><select><option>Post a Job</option><option>Bulk Listings / API</option><option>Sponsorship</option><option>Other</option></select></div>
            <div className="fg2 fcol2"><label>Details</label><textarea placeholder="Tell us about your hiring needs…" rows="4"/></div>
          </div>
          <button className="sub-btn" onClick={()=>onToast("🏢 Thanks! Our team will reach out shortly.")}>Submit Inquiry</button>
        </div>
      )}
    </div>
  );
}

function SocialPage({onToast}){
  return (
    <div className="social-wrap">
      <div className="pg-h2 fade-in">Connect with Us</div>
      <p className="pg-sub fade-in-1">Follow us across platforms for job drops, career tips, and exclusive community updates.</p>
      <div className="social-ads-banner fade-in">
        <div className="ads-badge">⚡ Advertise with Us</div>
        <div className="ads-title">Reach 200K+ active job seekers</div>
        <div className="ads-sub">Promote your open roles, employer brand, or recruitment services directly to qualified candidates across our social channels and platform.</div>
        <div className="ads-grid">
          <div className="ads-stat-card"><span className="ads-stat-num">200K+</span><span className="ads-stat-lbl">Monthly Reach</span></div>
          <div className="ads-stat-card"><span className="ads-stat-num">8.4%</span><span className="ads-stat-lbl">Avg. Click Rate</span></div>
          <div className="ads-stat-card"><span className="ads-stat-num">94K</span><span className="ads-stat-lbl">Hires Tracked</span></div>
          <div className="ads-stat-card"><span className="ads-stat-num">$48</span><span className="ads-stat-lbl">Avg. CPL</span></div>
        </div>
        <button className="ads-cta" onClick={()=>onToast("📣 Our ads team will be in touch soon!")}>Get Media Kit →</button>
      </div>
      <div className="social-grid">
        {SOCIALS.map((s,i)=>(
          <a key={s.name} className="social-card" href={s.url} target="_blank" rel="noopener noreferrer"
            style={{background:s.gradient,border:`1px solid ${s.border}`,color:"#fff",animationDelay:s.delay}}
            onClick={e=>{e.preventDefault();onToast(`Opening ${s.name}…`);setTimeout(()=>window.open(s.url,"_blank"),300);}}>
            <div className="social-card-logo" style={{background:s.logoBg,color:s.logoColor}}>{s.logo}</div>
            <div className="social-card-name">{s.name}</div>
            <div className="social-card-sub">{s.handle}</div>
            <div className="social-card-stats">
              <div className="social-stat"><strong>{s.followers}</strong>Followers</div>
              <div className="social-stat"><strong>{s.posts}</strong>{s.name==="Discord"?"Online":"Posts"}</div>
            </div>
            <div className="social-follow-btn">{s.cta} →</div>
          </a>
        ))}
      </div>
      <div className="social-newsletter fade-in-2">
        <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>📬</div>
        <div className="nl-title">Weekly Job Digest</div>
        <p className="nl-sub">Top 10 hand-picked roles delivered every Monday. No spam, ever.</p>
        <div className="nl-form">
          <input className="nl-input" placeholder="your@email.com" type="email"/>
          <button className="nl-btn" onClick={()=>onToast("🎉 Subscribed to weekly digest!")}>Subscribe</button>
        </div>
      </div>
      <div className="community-strip fade-in-3">
        {[["48.2K","Twitter Followers"],["112K","LinkedIn Connections"],["14.9K","Discord Members"],["6.1K","GitHub Stars"]].map(([n,l])=>(
          <div key={l} className="comm-item"><span className="comm-num">{n}</span><span className="comm-label">{l}</span></div>
        ))}
      </div>
    </div>
  );
}

function PlansPage({onToast}){
  const [billing,setBilling]=useState("annual");
  const [faqOpen,setFaqOpen]=useState(null);
  const [confirmPlan,setConfirmPlan]=useState(null);

  const prices={free:{monthly:0,annual:0},pro:{monthly:19,annual:14},elite:{monthly:39,annual:29},recruiter:{monthly:99,annual:74}};
  const pr=(tier)=>prices[tier][billing];

  const PLANS=[
    { key:"free", tier:"Starter", name:"Free", featured:false, desc:"Everything you need to start your job search journey.", btnLabel:"Get Started", btnClass:"plan-btn-outline",
      features:[{yes:true,text:"Browse all 8,400+ job listings"},{yes:true,text:"Save up to 5 jobs"},{yes:true,text:"Basic profile & resume upload"},{yes:true,text:"Email job alerts (weekly)"},{yes:false,text:"Priority application badge",dimmed:true},{yes:false,text:"Recruiter profile visibility",dimmed:true},{yes:false,text:"AI resume match score",dimmed:true},{yes:false,text:"Salary insights & benchmarks",dimmed:true}] },
    { key:"pro", tier:"Most Popular", name:"Pro", featured:true, desc:"Accelerate your search with AI-powered tools and priority access.", btnLabel:"Start Free Trial", btnClass:"plan-btn-primary",
      features:[{yes:true,text:"Everything in Free"},{yes:true,text:"Unlimited saved jobs"},{yes:true,text:"Priority application badge"},{yes:true,text:"Recruiter profile visibility"},{yes:true,text:"AI resume match score"},{yes:true,text:"Daily email & SMS alerts"},{yes:false,text:"1-click apply to all jobs",dimmed:true},{yes:false,text:"Dedicated career coach",dimmed:true}] },
    { key:"elite", tier:"Power User", name:"Elite", featured:false, desc:"The complete career toolkit for serious professionals.", btnLabel:"Go Elite", btnClass:"plan-btn-outline",
      features:[{yes:true,text:"Everything in Pro"},{yes:true,text:"1-click apply to all jobs"},{yes:true,text:"Salary insights & benchmarks"},{yes:true,text:"Application tracker dashboard"},{yes:true,text:"Interview prep resources"},{yes:true,text:"LinkedIn profile optimizer"},{yes:true,text:"Dedicated career coach (monthly)"},{yes:false,text:"Custom talent branding",dimmed:true}] },
    { key:"recruiter", tier:"For Teams", name:"Recruiter", featured:false, desc:"Post jobs, search candidates, and manage pipelines at scale.", btnLabel:"Start Hiring", btnClass:"plan-btn-gold",
      features:[{yes:true,text:"Post unlimited job listings"},{yes:true,text:"Full candidate database access"},{yes:true,text:"Advanced search & filters"},{yes:true,text:"Branded company page"},{yes:true,text:"ATS integrations (Greenhouse, Lever)"},{yes:true,text:"Analytics & performance reports"},{yes:true,text:"Dedicated account manager"},{yes:true,text:"Custom talent branding"}] },
  ];

  const COMPARE_ROWS=[
    {feat:"Job listings access",free:"Limited",pro:"All 8,400+",elite:"All 8,400+",recruiter:"Post + browse"},
    {feat:"Saved jobs",free:"5",pro:"Unlimited",elite:"Unlimited",recruiter:"N/A"},
    {feat:"AI resume match",free:false,pro:true,elite:true,recruiter:true},
    {feat:"Priority badge",free:false,pro:true,elite:true,recruiter:false},
    {feat:"1-click apply",free:false,pro:false,elite:true,recruiter:false},
    {feat:"Job alerts",free:"Weekly",pro:"Daily",elite:"Instant",recruiter:"N/A"},
    {feat:"Salary insights",free:false,pro:false,elite:true,recruiter:true},
    {feat:"Interview prep",free:false,pro:false,elite:true,recruiter:false},
    {feat:"Job post credits",free:false,pro:false,elite:false,recruiter:"Unlimited"},
    {feat:"Candidate search",free:false,pro:false,elite:false,recruiter:true},
    {feat:"ATS integration",free:false,pro:false,elite:false,recruiter:true},
    {feat:"Account manager",free:false,pro:false,elite:false,recruiter:true},
  ];

  const FAQS=[
    {q:"Can I cancel anytime?",a:"Yes — no lock-ins, no cancellation fees. Cancel anytime from your account settings and you'll retain access until the end of your billing period."},
    {q:"Is there a free trial for Pro?",a:"Absolutely! Pro comes with a 14-day free trial, no credit card required. Explore all features risk-free before committing."},
    {q:"How does the AI resume match work?",a:"Our AI analyses your resume against each job posting, scoring your fit across 12 dimensions including skills, experience, location and salary alignment."},
    {q:"Can I switch plans mid-cycle?",a:"Yes. Upgrades are prorated and effective immediately. Downgrades take effect at the start of your next billing cycle."},
    {q:"What payment methods do you accept?",a:"We accept all major credit/debit cards (Visa, Mastercard, Amex), UPI (PhonePe, GPay, Paytm, BHIM), and Net Banking for all major Indian banks."},
    {q:"Do you offer discounts for students or non-profits?",a:"Yes! Students with a valid .edu email get 50% off Pro. Non-profits get 30% off all plans. Contact us to apply."},
  ];

  const handlePlanClick=(plan)=>{
    if(plan.key==="free"){ onToast("🚀 You're on the Free plan!"); return; }
    setConfirmPlan(plan);
  };

  return (
    <div className="plans-wrap">
      <div className="plans-hero fade-in">
        <div className="plans-hero-badge">✦ Simple Pricing</div>
        <h1>Invest in your <em>career</em></h1>
        <p>Plans that grow with you — from first job search to hiring at scale. Start free, upgrade when ready.</p>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.5rem"}}>
          <div className="billing-toggle">
            <button className={`billing-opt${billing==="monthly"?" active":""}`} onClick={()=>setBilling("monthly")}>Monthly</button>
            <button className={`billing-opt${billing==="annual"?" active":""}`} onClick={()=>setBilling("annual")}>Annual <span className="billing-save">Save 25%</span></button>
          </div>
          {billing==="annual"&&<div style={{fontSize:"0.78rem",color:"var(--teal)",fontWeight:600}}>✓ Billed annually · Cancel anytime</div>}
        </div>
      </div>

      <div className="plans-grid">
        {PLANS.map((plan,i)=>(
          <div key={plan.key} className={`plan-card${plan.featured?" featured":""}`} style={{animationDelay:`${i*0.08}s`}}>
            {plan.featured&&<div className="plan-featured-badge">⭐ Most Popular</div>}
            <div className="plan-tier">{plan.tier}</div>
            <div className="plan-name">{plan.name}</div>
            <div className="plan-desc">{plan.desc}</div>
            <div className="plan-price-row">
              {pr(plan.key)>0&&<span className="plan-currency">$</span>}
              <span className="plan-amount">{pr(plan.key)===0?"Free":pr(plan.key)}</span>
              {pr(plan.key)>0&&<span className="plan-period">/mo</span>}
            </div>
            {pr(plan.key)>0&&billing==="annual"&&<div className="plan-annual-note">Billed ${pr(plan.key)*12}/yr · Save ${(prices[plan.key].monthly-prices[plan.key].annual)*12}/yr</div>}
            {pr(plan.key)===0&&<div className="plan-annual-note" style={{visibility:"hidden"}}>_</div>}
            <hr className="plan-divider"/>
            <ul className="plan-features">
              {plan.features.map((f,j)=>(
                <li key={j} className="plan-feature">
                  <span className={`plan-check ${f.yes?"yes":"no"}`}>{f.yes?"✓":"×"}</span>
                  <span className={`feature-text${f.dimmed?" dimmed":""}`}>{f.text}</span>
                </li>
              ))}
            </ul>
            <button className={`plan-btn ${plan.btnClass}`} onClick={()=>handlePlanClick(plan)}>{plan.btnLabel}</button>
          </div>
        ))}
      </div>

      <div className="plans-compare fade-in-2">
        <div className="compare-head"><h3>Full Feature Comparison</h3></div>
        <div style={{overflowX:"auto"}}>
          <table className="compare-table">
            <thead><tr><th style={{width:"34%"}}>Feature</th><th>Free</th><th className="ct-feat-col">Pro</th><th>Elite</th><th>Recruiter</th></tr></thead>
            <tbody>
              {COMPARE_ROWS.map((row,i)=>(
                <tr key={i}>
                  <td style={{fontWeight:500}}>{row.feat}</td>
                  {["free","pro","elite","recruiter"].map(k=>(
                    <td key={k} className={k==="pro"?"ct-feat-col":""}>
                      {row[k]===true?<span className="ct-check">✓</span>:row[k]===false?<span className="ct-x">—</span>:<span style={{fontSize:"0.8rem",color:"var(--muted)"}}>{row[k]}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="plans-faq fade-in-3">
        <div className="faq-title">Frequently Asked Questions</div>
        {FAQS.map((f,i)=>(
          <div key={i} className="faq-item">
            <div className="faq-q" onClick={()=>setFaqOpen(faqOpen===i?null:i)}>
              <span>{f.q}</span>
              <span className={`faq-arrow${faqOpen===i?" open":""}`}>▾</span>
            </div>
            {faqOpen===i&&<div className="faq-a">{f.a}</div>}
          </div>
        ))}
      </div>

      <div className="enterprise-strip fade-in-4">
        <div className="enterprise-text">
          <h3>Need a custom enterprise plan?</h3>
          <p>For large teams, custom integrations, SSO, or volume hiring — let's build something together. Trusted by 200+ enterprise teams.</p>
        </div>
        <button className="enterprise-btn" onClick={()=>onToast("📞 Our enterprise team will reach out within 24h!")}>Talk to Sales →</button>
      </div>

      {confirmPlan&&(
        <PlanConfirmModal
          plan={confirmPlan}
          billing={billing}
          price={billing==="annual"?pr(confirmPlan.key)*12:pr(confirmPlan.key)}
          onClose={()=>setConfirmPlan(null)}
          onSuccess={()=>{setConfirmPlan(null);onToast(`🎉 Welcome to ${confirmPlan.name}! All features unlocked.`);}}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════
export default function App(){
  const [page,setPage]=useState("home");
  const [selJob,setSelJob]=useState(null);
  const [selCo,setSelCo]=useState(null);
  const [savedJobs,setSavedJobs]=useState([1,4]);
  const [toast,setToast]=useState(null);
  const [applyModal,setApplyModal]=useState(null);
  const [resumeModal,setResumeModal]=useState(null);
  const [scrolled,setScrolled]=useState(false);
  const [notifOpen,setNotifOpen]=useState(false);
  const [mobileMenuOpen,setMobileMenuOpen]=useState(false);
  const toastRef=useRef();
  const notifRef=useRef();

  useEffect(()=>{
    const onScroll=()=>setScrolled(window.scrollY>20);
    window.addEventListener("scroll",onScroll);
    return ()=>window.removeEventListener("scroll",onScroll);
  },[]);

  useEffect(()=>{
    const handler=(e)=>{if(notifRef.current&&!notifRef.current.contains(e.target))setNotifOpen(false);};
    document.addEventListener("mousedown",handler);
    return ()=>document.removeEventListener("mousedown",handler);
  },[]);

  useEffect(()=>{
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    if(mobileMenuOpen) setNotifOpen(false);
    return ()=>{ document.body.style.overflow = ""; };
  },[mobileMenuOpen]);

  // Close mobile menu on page change
  useEffect(()=>{ setMobileMenuOpen(false); },[page]);

  const showToast=(msg,icon="✓")=>{
    if(toastRef.current)clearTimeout(toastRef.current);
    setToast({msg,icon});
    toastRef.current=setTimeout(()=>setToast(null),3800);
  };

  const toggleSave=(id)=>{
    const was=savedJobs.includes(id);
    setSavedJobs(prev=>was?prev.filter(x=>x!==id):[...prev,id]);
    showToast(was?"Removed from saved":"Job saved!",was?"×":"♥");
  };

  const goToJob=(job)=>{setSelJob(job);setSelCo(null);setPage("detail");window.scrollTo({top:0,behavior:"smooth"});};
  const goToCo=(co)=>{setSelCo(co);setSelJob(null);setPage("company");window.scrollTo({top:0,behavior:"smooth"});};
  const nav=(p)=>{setPage(p);setSelJob(null);setSelCo(null);setNotifOpen(false);setMobileMenuOpen(false);window.scrollTo({top:0,behavior:"smooth"});};

  const navItems=[{key:"home",label:"Home"},{key:"listings",label:"Jobs"},{key:"companies",label:"Companies"},{key:"social",label:"Community"},{key:"contact",label:"Contact"}];
  const isListActive=page==="listings"||page==="detail";

  return (
    <>
      <style>{css}</style>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div className="app">
        <nav className={`nav${scrolled?" scrolled":""}`}>
          <div className="nav-logo" onClick={()=>nav("home")}>
            <div className="logo-mark">
              <svg viewBox="0 0 18 18" fill="none"><circle cx="6" cy="6" r="4" fill="white" opacity="0.9"/><circle cx="12" cy="12" r="4" fill="white" opacity="0.6"/><circle cx="12" cy="6" r="2" fill="white" opacity="0.5"/></svg>
            </div>
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
            {navItems.map((item,i)=>(
              <button key={item.key} className={`nav-item${(item.key==="listings"?isListActive:page===item.key)?" active":""}`} style={{animationDelay:`${0.15+i*0.05}s`}} onClick={()=>nav(item.key)}>{item.label}</button>
            ))}
          </div>
          <div className="nav-right">
            <div style={{position:"relative"}} ref={notifRef}>
              <div className="nav-bell" onClick={()=>setNotifOpen(v=>!v)}>🔔<span className="bell-badge"/><span className="bell-ring"/></div>
              {notifOpen&&(
                <div className="notif-dropdown">
                  <div className="notif-header"><span className="notif-title">Notifications</span><button className="notif-clear" onClick={()=>setNotifOpen(false)}>Mark all read</button></div>
                  {NOTIFICATIONS.map((n,i)=>(
                    <div key={i} className="notif-item" onClick={()=>setNotifOpen(false)}>
                      <div className="notif-dot" style={{background:n.color}}/><div><div className="notif-text">{n.text}</div><span className="notif-time">{n.time}</span></div>
                    </div>
                  ))}
                  <div className="notif-footer"><button className="notif-footer-btn" onClick={()=>setNotifOpen(false)}>View all notifications →</button></div>
                </div>
              )}
            </div>
            <div className="saved-pill" onClick={()=>nav("saved")}><div className="saved-count">{savedJobs.length}</div><span>Saved</span></div>
            <button className="nav-plans-btn" onClick={()=>nav("plans")}>⭐ Plans</button>
            <button className="nav-cta" onClick={()=>nav("resume")}>Upload Resume</button>
            <button className="nav-mobile-toggle" onClick={()=>setMobileMenuOpen(v=>!v)} aria-label="Menu" aria-expanded={mobileMenuOpen}>
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div className={`nav-mobile-menu${mobileMenuOpen?" open":""}`}>
          {navItems.map(item=>(
            <button key={item.key} className={`nav-mobile-item${(item.key==="listings"?isListActive:page===item.key)?" active":""}`} onClick={()=>nav(item.key)}>
              {item.label}
            </button>
          ))}
          <button className="nav-mobile-item" onClick={()=>nav("saved")}>Saved Jobs ({savedJobs.length})</button>
          <div className="nav-mobile-divider"/>
          <div className="nav-mobile-actions">
            <button className="nav-mobile-plans" onClick={()=>nav("plans")}>⭐ View Plans</button>
            <button className="nav-mobile-cta" onClick={()=>nav("resume")}>Upload Resume</button>
          </div>
        </div>

        <div className="page-wrap">
          {(page==="detail"||page==="company")&&(
            <div className="breadcrumb">
              <button className="bc-btn" onClick={()=>nav("home")}>Home</button><span>›</span>
              {page==="detail"&&<><button className="bc-btn" onClick={()=>nav("listings")}>Jobs</button><span>›</span><span>{selJob?.title}</span></>}
              {page==="company"&&<><button className="bc-btn" onClick={()=>nav("companies")}>Companies</button><span>›</span><span>{selCo?.name}</span></>}
            </div>
          )}
          {page==="home"&&<HomePage onJobClick={goToJob} onNav={nav} savedJobs={savedJobs} onSave={toggleSave}/>}
          {page==="listings"&&<ListingsPage onJobClick={goToJob} savedJobs={savedJobs} onSave={toggleSave}/>}
          {page==="detail"&&selJob&&<JobDetailPage job={selJob} savedJobs={savedJobs} onSave={toggleSave} onApply={()=>setApplyModal(selJob)} onCompanyClick={goToCo}/>}
          {page==="companies"&&<CompaniesPage onCompanyClick={goToCo}/>}
          {page==="company"&&selCo&&<CompanyDetailPage company={selCo} jobs={JOBS} onJobClick={goToJob} savedJobs={savedJobs} onSave={toggleSave}/>}
          {page==="resume"&&<ResumePage onUploadDone={(name)=>setResumeModal(name)}/>}
          {page==="saved"&&<SavedPage savedJobs={savedJobs} jobs={JOBS} onJobClick={goToJob} onSave={toggleSave}/>}
          {page==="contact"&&<ContactPage onToast={showToast}/>}
          {page==="social"&&<SocialPage onToast={showToast}/>}
          {page==="plans"&&<PlansPage onToast={showToast}/>}
        </div>

        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-top">
              <div className="footer-brand">
                <div className="footer-logo">Work<em>Board</em></div>
                <p>Connecting exceptional talent with companies building the future. No ghost jobs, no spam.</p>
              </div>
              <div className="footer-links"><h4>Job Seekers</h4><a onClick={()=>nav("listings")}>Browse Jobs</a><a onClick={()=>nav("resume")}>Upload Resume</a><a onClick={()=>nav("saved")}>Saved Jobs</a><a onClick={()=>nav("plans")}>Pricing Plans</a></div>
              <div className="footer-links"><h4>Employers</h4><a onClick={()=>nav("plans")}>Post a Job</a><a onClick={()=>nav("contact")}>Contact Sales</a><a>Talent Search</a><a>Recruiter Plan</a></div>
              <div className="footer-links"><h4>Community</h4><a onClick={()=>nav("social")}>Social Media</a><a href="https://discord.com" target="_blank" rel="noopener noreferrer">Discord Server</a><a onClick={()=>nav("social")}>Newsletter</a><a>Career Blog</a></div>
            </div>
            <div className="footer-bottom">
              <span>© 2026 WorkBoard · Built with intention · All rights reserved</span>
              <div className="footer-socials">
                {[{i:"𝕏",u:"https://twitter.com"},{i:"in",u:"https://linkedin.com"},{i:"▶",u:"https://youtube.com"},{i:"📸",u:"https://instagram.com"}].map(({i,u},idx)=>(
                  <a key={idx} className="fsoc" href={u} target="_blank" rel="noopener noreferrer" onClick={e=>{e.preventDefault();showToast("Opening…");setTimeout(()=>window.open(u,"_blank"),250);}}>{i}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>

        {toast&&(
          <div className="toast">
            <div className="toast-icon">{toast.icon}</div>
            <span>{toast.msg}</span>
            <button className="toast-dismiss" onClick={()=>setToast(null)}>✕</button>
          </div>
        )}

        {applyModal&&<ApplyModal job={applyModal} onClose={()=>{setApplyModal(null);showToast("🎉 Application sent!","🎉");}}/>}
        {resumeModal&&<ResumeModal fileName={resumeModal} onClose={()=>{setResumeModal(null);showToast("📄 Resume is live!");}}/>}
      </div>
    </>
  );
}
