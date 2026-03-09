import { useState, useEffect, useRef, useCallback } from "react";

// ── THEME ─────────────────────────────────────────────────
const C = {
  bg: "#03000d", bgCard: "#07041a", bgHover: "#0e0a24",
  pink: "#ff2d78", cyan: "#00f5ff", purple: "#b44dff",
  white: "#f0eaff", muted: "#6a5a8a", border: "#1e1035",
};

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html{font-size:16px;}
body{background:${C.bg};overflow-x:hidden;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:${C.bg};}
::-webkit-scrollbar-thumb{background:${C.pink}66;border-radius:2px;}

@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes neon-flicker{0%,19%,21%,23%,25%,54%,56%,100%{opacity:1}20%,24%,55%{opacity:.3}}
@keyframes spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes spin-rev{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}
@keyframes pulse-glow{0%,100%{box-shadow:0 0 10px ${C.pink}44,0 0 30px ${C.pink}22}50%{box-shadow:0 0 20px ${C.pink}88,0 0 60px ${C.pink}44}}
@keyframes slide-in-up{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
@keyframes slide-in-left{from{opacity:0;transform:translateX(-32px)}to{opacity:1;transform:translateX(0)}}
@keyframes slide-in-right{from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)}}
@keyframes fade-in{from{opacity:0}to{opacity:1}}
@keyframes scanline-move{0%{top:-10%}100%{top:110%}}
@keyframes card-enter{from{opacity:0;transform:translateY(20px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
`;

// ── DATA ─────────────────────────────────────────────────
const PROJECTS = [
  { id:"01", name:"ChatConnect",       stack:["Kotlin","Firebase Auth","Firestore","FCM"],             desc:"Real-time chat app with secure Firebase Authentication, live messaging with timestamps, user presence, and read receipts. Integrated FCM for push notifications.", status:"SHIPPED",      year:"2025", type:"MOBILE",     icon:"💬" },
  { id:"02", name:"AptiKid",           stack:["Kotlin","Firebase","Android Jetpack"],                  desc:"Interactive Android platform assessing children's aptitude through adaptive UI. Firebase Realtime Database improved data retrieval speed by 35%.",                  status:"SHIPPED",      year:"2025", type:"MOBILE",     icon:"🧠" },
  { id:"03", name:"EcoTrace",          stack:["Kotlin","Android Studio","Firebase"],                   desc:"Award-winning Android app to track carbon footprint and eco-friendly habits. Real-time dashboards visualize weekly progress. Humble Hackathon Winner.",             status:"AWARD WINNER", year:"2024", type:"MOBILE",     icon:"🌿" },
  { id:"04", name:"DevDash",           stack:["React.js","Node.js","Express.js","MongoDB","Tailwind"], desc:"Full-stack developer productivity dashboard. Task management, project tracking, REST API backend with JWT authentication and MongoDB persistence.",                   status:"SHIPPED",      year:"2025", type:"FULL-STACK", icon:"📊" },
  { id:"05", name:"AgroAssist",        stack:["Kotlin","Android Studio","Firebase","REST APIs"],       desc:"Smart agriculture app enabling farmers to access crop recommendations and weather insights. Real-time weather APIs, location-based suggestions, smart alerts.",       status:"SHIPPED",      year:"2025", type:"FULL-STACK", icon:"🌾" },
  { id:"06", name:"WaveFare Delights", stack:["React.js","Node.js","Firebase Firestore","Tailwind"],   desc:"Complete online food ordering platform with listings, filtering, and cart system. Secure authentication, order tracking, and responsive UI.",                         status:"SHIPPED",      year:"2025", type:"FULL-STACK", icon:"🍜" },
];

const SKILLS = {
  LANGUAGES: ["Kotlin","Python","Java","JavaScript","C"],
  MOBILE:    ["Android SDK","Android Jetpack","Firebase","REST APIs"],
  FRONTEND:  ["React.js","Tailwind CSS","HTML","CSS"],
  BACKEND:   ["Node.js","Express.js","RESTful APIs","SaaS Architecture"],
  DATABASES: ["Firebase","MySQL","MongoDB"],
  TOOLS:     ["Git","Android Studio","VS Code","IntelliJ IDEA"],
};

const EXPERIENCE = [{
  role:"React.js Intern", company:"Celebal Technologies",
  period:"May 2025 – Present", type:"INTERNSHIP",
  points:[
    "Contributing to front-end development using React.js and Tailwind CSS.",
    "Collaborating with senior developers on dashboards and enterprise-grade applications.",
    "Gaining hands-on experience in API integration and UI/UX optimization.",
  ],
}];

const CERTIFICATIONS = [
  { id:"C1", name:"Salesforce Certified AI Associate",   issuer:"Salesforce",       date:"Oct 17, 2024", badge:"AI",    color:"#00f5ff" },
  { id:"C2", name:"IBM DevOps and Software Engineering", issuer:"IBM",              date:"Jan 23, 2025", badge:"DEVOPS",color:"#b44dff" },
  { id:"C3", name:"Java Full Stack Developer",           issuer:"Allsoft Solutions", date:"Jul 15, 2024", badge:"JAVA",  color:"#ff2d78" },
];

// ── PARTICLE CANVAS ───────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = [C.pink, C.cyan, C.purple];
    for (let i = 0; i < 80; i++) {
      particlesRef.current.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.1,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.6 + 0.1,
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    // Connection lines between close particles
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ps = particlesRef.current;

      // Draw connections
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `${C.purple}${Math.floor((1 - dist/120) * 30).toString(16).padStart(2,"0")}`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      ps.forEach(p => {
        p.twinkle += 0.03;
        const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.twinkle));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "18";
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      });

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position:"fixed", inset:0, zIndex:0, pointerEvents:"none", opacity:0.6,
    }} />
  );
}

// ── SCANLINE EFFECT ───────────────────────────────────────
function Scanline() {
  return (
    <>
      <div style={{
        position:"fixed", inset:0, zIndex:1, pointerEvents:"none",
        background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px)",
      }} />
      <div style={{
        position:"fixed", left:0, right:0, height:"3px", zIndex:2, pointerEvents:"none",
        background:`linear-gradient(90deg,transparent,${C.cyan}44,transparent)`,
        animation:"scanline-move 8s linear infinite",
        top:0,
      }} />
    </>
  );
}

// ── HELPERS ───────────────────────────────────────────────
function Badge({ children, color }) {
  return (
    <span style={{
      fontSize:11, padding:"4px 10px",
      background:`${color}18`, border:`1px solid ${color}55`,
      color, fontFamily:"'Share Tech Mono',monospace", letterSpacing:2,
      textShadow:`0 0 6px ${color}88`, whiteSpace:"nowrap",
      fontWeight:600,
    }}>{children}</span>
  );
}

function SectionHeader({ label, count }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:32, animation:"slide-in-left 0.5s ease both" }}>
      <div style={{ width:4, height:24, background:`linear-gradient(180deg,${C.pink},${C.purple})`, boxShadow:`0 0 8px ${C.pink}` }} />
      <span style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:20, fontWeight:700, color:C.pink, letterSpacing:3, textShadow:`0 0 10px ${C.pink}` }}>
        // {label.toUpperCase()}
      </span>
      {count && <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:12, color:C.muted, letterSpacing:2 }}>— {count}</span>}
      <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${C.pink}44,transparent)` }} />
    </div>
  );
}

function Cursor({ color = C.pink }) {
  const [v, setV] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setV(x => !x), 530);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{
      display:"inline-block",
      opacity: v ? 1 : 0,
      color,
      textShadow:`0 0 8px ${color}`,
      transition:"opacity 0.1s",
      userSelect:"none",
    }}>█</span>
  );
}

// ── BOOT SCREEN ───────────────────────────────────────────
const BOOT_LINES = [
  "NEURAL_OS v9.1 — CYBERDECK INITIALIZED",
  "Scanning neural pathways............. OK",
  "Loading CHANDRAKANTH.exe............. OK",
  "Decrypting developer profile......... OK",
  "Injecting project database........... OK",
  "Calibrating holographic interface.... OK",
];

function BootScreen({ onDone }) {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines(p => [...p, BOOT_LINES[i]]);
        setProgress(Math.round(((i+1)/BOOT_LINES.length)*100));
        i++;
      } else { clearInterval(t); setTimeout(onDone, 600); }
    }, 280);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position:"fixed", inset:0, background:C.bg, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", zIndex:200, fontFamily:"'Share Tech Mono',monospace" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C.pink}06 1px,transparent 1px),linear-gradient(90deg,${C.pink}06 1px,transparent 1px)`, backgroundSize:"40px 40px" }} />

      {/* Spinning rings */}
      <div style={{ position:"absolute", width:300, height:300, border:`1px solid ${C.pink}22`, borderRadius:"50%", animation:"spin-slow 20s linear infinite" }} />
      <div style={{ position:"absolute", width:200, height:200, border:`1px solid ${C.cyan}22`, borderRadius:"50%", animation:"spin-rev 14s linear infinite" }} />

      <div style={{ width:560, maxWidth:"90vw", position:"relative", zIndex:1 }}>
        <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:26, fontWeight:700, color:C.pink, textShadow:`0 0 30px ${C.pink},0 0 60px ${C.pink}44`, letterSpacing:5, marginBottom:4 }}>◈ PORTFOLIO_OS</div>
        <div style={{ fontSize:10, color:C.muted, letterSpacing:4, marginBottom:32 }}>NEURAL INTERFACE — TOKYO NODE — {new Date().getFullYear()}</div>
        <div style={{ marginBottom:24 }}>
          {lines.map((line, i) => (
            <div key={i} style={{ fontSize:12, lineHeight:"2", color:i===lines.length-1?C.cyan:C.muted+"88", textShadow:i===lines.length-1?`0 0 8px ${C.cyan}`:"none", transition:"all 0.3s" }}>
              <span style={{ color:C.pink }}>▶</span> {line}
            </div>
          ))}
        </div>
        {lines.length > 0 && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.muted, marginBottom:8, letterSpacing:2 }}>
              <span>LOADING PORTFOLIO</span>
              <span style={{ color:C.cyan }}>{progress}%</span>
            </div>
            <div style={{ height:2, background:"#1a0a2a", position:"relative" }}>
              <div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${C.purple},${C.pink},${C.cyan})`, transition:"width 0.3s ease", boxShadow:`0 0 16px ${C.pink}` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────
function NavBar({ active, setActive }) {
  const tabs = ["HOME","PROJECTS","EXPERIENCE","SKILLS","CERTS","CONTACT"];
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-US",{hour12:false}));
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const t = setInterval(()=>setTime(new Date().toLocaleTimeString("en-US",{hour12:false})),1000);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return()=>{ clearInterval(t); window.removeEventListener("scroll",onScroll); };
  },[]);

  return (
    <div style={{
      borderBottom:`1px solid ${scrolled ? C.pink+"33" : C.border}`,
      display:"flex", alignItems:"center", padding:"0 32px",
      background:scrolled ? `${C.bg}f0` : `${C.bg}cc`,
      backdropFilter:"blur(20px)",
      position:"sticky", top:0, zIndex:50,
      transition:"all 0.3s",
      boxShadow: scrolled ? `0 4px 40px ${C.pink}11` : "none",
    }}>
      <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:20, fontWeight:700, color:C.pink, textShadow:`0 0 16px ${C.pink}`, letterSpacing:3, marginRight:36, padding:"16px 0", animation:"neon-flicker 7s infinite", cursor:"pointer" }} onClick={()=>setActive("HOME")}>
        ⬡ CK
      </div>
      <div style={{ display:"flex", gap:0, flex:1 }}>
        {tabs.map(tab => {
          const isActive = active===tab;
          return (
            <button key={tab} onClick={()=>setActive(tab)} style={{
              background:"transparent", border:"none",
              borderBottom:isActive?`2px solid ${C.pink}`:"2px solid transparent",
      color:isActive?C.pink:C.muted,
              fontFamily:"'Rajdhani',sans-serif", fontSize:15, fontWeight:700, letterSpacing:3,
              padding:"16px 14px", cursor:"pointer", transition:"all 0.2s",
              textShadow:isActive?`0 0 10px ${C.pink}`:"none",
              position:"relative",
            }}
              onMouseEnter={e=>{ if(!isActive){ e.currentTarget.style.color=C.cyan; e.currentTarget.style.textShadow=`0 0 8px ${C.cyan}`; }}}
              onMouseLeave={e=>{ if(!isActive){ e.currentTarget.style.color=C.muted; e.currentTarget.style.textShadow="none"; }}}
            >{tab}</button>
          );
        })}
      </div>
      <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:C.muted }}>
        {time} <span style={{ color:C.cyan, animation:"blink 2s infinite" }}>◈</span>
      </div>
    </div>
  );
}

// ── PAGE TRANSITION WRAPPER ───────────────────────────────
function PageTransition({ children, id }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [id]);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
    }}>{children}</div>
  );
}

// ── HOME ──────────────────────────────────────────────────
function HomeSection() {
  const [typed, setTyped] = useState("");
  const [namesDone, setNamesDone] = useState(false);
  const roles = ["Mobile Developer", "Full Stack Engineer", "Android Specialist", "React Developer"];
  const [roleIdx, setRoleIdx] = useState(0);
  const [roleTyped, setRoleTyped] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Type the name first
  useEffect(() => {
    const full = "Chandrakanth Cherukuri";
    if (typed.length < full.length) {
      const t = setTimeout(() => setTyped(full.slice(0, typed.length + 1)), 55);
      return () => clearTimeout(t);
    } else {
      setNamesDone(true);
    }
  }, [typed]);

  // Then cycle roles
  useEffect(() => {
    if (!namesDone) return;
    const role = roles[roleIdx];
    if (!deleting) {
      if (roleTyped.length < role.length) {
        const t = setTimeout(() => setRoleTyped(role.slice(0, roleTyped.length + 1)), 80);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setDeleting(true), 1800);
        return () => clearTimeout(t);
      }
    } else {
      if (roleTyped.length > 0) {
        const t = setTimeout(() => setRoleTyped(roleTyped.slice(0, -1)), 45);
        return () => clearTimeout(t);
      } else {
        setDeleting(false);
        setRoleIdx(i => (i + 1) % roles.length);
      }
    }
  }, [roleTyped, deleting, roleIdx, namesDone]);

  const stats = [
    { label:"EDUCATION", value:"LPU – B.Tech CSE", icon:"🎓" },
    { label:"EXPERIENCE", value:"Celebal Technologies", icon:"💼" },
    { label:"PROJECTS",   value:"6 Shipped", icon:"🚀" },
    { label:"STATUS",     value:"Open to Work", icon:"✅" },
  ];

  return (
    <div style={{ padding:"80px 48px 60px", maxWidth:1000, position:"relative" }}>
      {/* Decorative rotating element */}
      <div style={{ position:"absolute", right:60, top:80, width:220, height:220, pointerEvents:"none" }}>
        <div style={{ position:"absolute", inset:0, border:`1px solid ${C.pink}22`, borderRadius:"50%", animation:"spin-slow 25s linear infinite" }} />
        <div style={{ position:"absolute", inset:20, border:`1px dashed ${C.cyan}18`, borderRadius:"50%", animation:"spin-rev 18s linear infinite" }} />
        <div style={{ position:"absolute", inset:40, border:`1px solid ${C.purple}22`, borderRadius:"50%", animation:"spin-slow 12s linear infinite" }} />
        <div style={{ position:"absolute", inset:"50%", transform:"translate(-50%,-50%)", width:16, height:16, background:C.pink, borderRadius:"50%", boxShadow:`0 0 20px ${C.pink},0 0 40px ${C.pink}88`, animation:"pulse-glow 2s ease-in-out infinite" }} />
      </div>

      {/* Tag */}
      <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"5px 14px", border:`1px solid ${C.cyan}44`, background:`${C.cyan}0a`, marginBottom:24, animation:"fade-in 0.6s ease both" }}>
        <div style={{ width:6, height:6, background:C.cyan, borderRadius:"50%", boxShadow:`0 0 8px ${C.cyan}`, animation:"pulse-glow 1.5s ease-in-out infinite" }} />
        <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:C.cyan, letterSpacing:3 }}>AVAILABLE FOR HIRE</span>
      </div>

      {/* Main name */}
      <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:"clamp(44px,6.5vw,80px)", fontWeight:700, color:C.white, lineHeight:1.0, marginBottom:6, letterSpacing:-1, animation:"slide-in-up 0.6s ease 0.1s both" }}>
        {typed.split(" ")[0] || ""}
      </div>
      <div style={{
        fontFamily:"'Rajdhani',sans-serif", fontSize:"clamp(44px,6.5vw,80px)", fontWeight:700,
        lineHeight:1.0, marginBottom:32, letterSpacing:-1,
        background:`linear-gradient(135deg,${C.pink} 0%,${C.purple} 50%,${C.cyan} 100%)`,
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        filter:`drop-shadow(0 0 30px ${C.pink}66)`,
        animation:"slide-in-up 0.6s ease 0.2s both, float 5s ease-in-out 1s infinite",
      }}>
        {typed.split(" ")[1] || ""}
      </div>

      {/* Role typewriter */}
      <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"clamp(16px,2.2vw,22px)", color:C.cyan, marginBottom:48, letterSpacing:2 }}>
        <span style={{ color:C.muted }}>$ </span>
        {roleTyped}<Cursor color={C.cyan} />
      </div>

      {/* Stats grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:2, marginBottom:48, animation:"slide-in-up 0.6s ease 0.5s both" }}>
        {stats.map(({ label, value, icon }) => (
          <div key={label} style={{
            background:C.bgCard, border:`1px solid ${C.border}`,
            padding:"14px 16px", cursor:"default",
            transition:"all 0.2s",
          }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${C.pink}66`; e.currentTarget.style.background=C.bgHover; e.currentTarget.style.boxShadow=`0 0 20px ${C.pink}11`; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.bgCard; e.currentTarget.style.boxShadow="none"; }}
          >
            <div style={{ fontSize:16, marginBottom:6 }}>{icon}</div>
            <div style={{ fontSize:10, color:C.muted, letterSpacing:2, fontFamily:"'Share Tech Mono',monospace", marginBottom:5 }}>{label}</div>
            <div style={{ fontSize:15, color:C.pink, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, textShadow:`0 0 6px ${C.pink}88` }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Bio */}
      <p style={{ fontFamily:"'Share Tech Mono',monospace", color:C.muted, fontSize:15, lineHeight:2.1, maxWidth:580, marginBottom:48, borderLeft:`2px solid ${C.pink}44`, paddingLeft:20, animation:"fade-in 0.8s ease 0.6s both" }}>
        Mobile and Full Stack Developer building Android apps and scalable web platforms.
        Skilled in API integration, Firebase backends, and modern UI. Currently interning
        at Celebal Technologies — passionate about SaaS and startups where technical
        ownership drives real impact.
      </p>

      {/* CTAs */}
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", animation:"slide-in-up 0.6s ease 0.7s both" }}>
        {[{label:"VIEW PROJECTS ›",primary:true},{label:"DOWNLOAD CV",primary:false},{label:"CONTACT ME",primary:false}].map(({label,primary})=>(
          <button key={label} style={{
            fontFamily:"'Share Tech Mono',monospace", fontSize:11, letterSpacing:2, padding:"13px 28px",
            background:primary?`linear-gradient(135deg,${C.pink},${C.purple})`:"transparent",
            color:primary?C.white:C.pink, border:primary?"none":`1px solid ${C.pink}66`,
            cursor:"pointer", transition:"all 0.25s",
            boxShadow:primary?`0 0 30px ${C.pink}44,0 4px 20px ${C.pink}22`:"none",
            position:"relative", overflow:"hidden",
          }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=primary?`0 0 40px ${C.pink}66,0 8px 30px ${C.pink}33`:`0 0 20px ${C.pink}33`; if(!primary)e.currentTarget.style.background=`${C.pink}18`; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=primary?`0 0 30px ${C.pink}44`:"none"; if(!primary)e.currentTarget.style.background="transparent"; }}
          >{label}</button>
        ))}
      </div>
    </div>
  );
}

// ── PROJECT CARDS ─────────────────────────────────────────
function ProjectCard({ p, idx }) {
  const [hov, setHov] = useState(false);
  const typeColor = p.type==="FULL-STACK" ? C.cyan : C.purple;
  const statusColor = p.status==="AWARD WINNER" ? "#ffd700" : C.pink;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.bgHover : C.bgCard,
        border:`1px solid ${hov ? C.pink+"55" : C.border}`,
        padding:"24px", cursor:"default",
        transition:"all 0.25s",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? `0 8px 40px ${C.pink}22,0 0 0 1px ${C.pink}22` : "none",
        animation:`card-enter 0.5s ease ${idx * 0.08}s both`,
        position:"relative", overflow:"hidden",
      }}
    >
      {/* Corner accent */}
      <div style={{ position:"absolute", top:0, right:0, width:40, height:40, borderLeft:`1px solid ${C.pink}33`, borderBottom:`1px solid ${C.pink}33`, pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:0, left:0, width:40, height:40, borderRight:`1px solid ${C.cyan}22`, borderTop:`1px solid ${C.cyan}22`, pointerEvents:"none" }} />

      {/* Glow on hover */}
      {hov && <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 50% 0%,${C.pink}08,transparent 70%)`, pointerEvents:"none" }} />}

      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
        <div style={{ fontSize:28, lineHeight:1 }}>{p.icon}</div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"flex-end" }}>
          <Badge color={typeColor}>{p.type}</Badge>
          <Badge color={statusColor}>{p.status}</Badge>
        </div>
      </div>

      {/* Title */}
      <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:30, fontWeight:700, color: hov ? C.white : C.white, letterSpacing:1, marginBottom:6, transition:"color 0.2s", textShadow: hov ? `0 0 20px ${C.pink}44` : "none" }}>
        {p.name}
      </div>
      <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:14, color:C.muted, marginBottom:16, letterSpacing:2 }}>{p.year}</div>

      {/* Desc */}
      <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:15, color:C.muted, lineHeight:2, marginBottom:20, minHeight:60 }}>
        {p.desc}
      </p>

      {/* Stack */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {p.stack.map(s => <Badge key={s} color={C.purple}>{s}</Badge>)}
      </div>
    </div>
  );
}

function ProjectsSection() {
  const [filter, setFilter] = useState("ALL");
  const visible = filter==="ALL" ? PROJECTS : PROJECTS.filter(p=>p.type===filter);

  return (
    <div style={{ padding:"48px" }}>
      <SectionHeader label="projects.db" count={`${visible.length} / ${PROJECTS.length}`} />
      <div style={{ display:"flex", gap:8, marginBottom:32 }}>
        {["ALL","MOBILE","FULL-STACK"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            fontFamily:"'Rajdhani',sans-serif", fontSize:15, fontWeight:700, letterSpacing:3, padding:"9px 22px",
            background:filter===f?`${C.cyan}20`:"transparent",
            border:`1px solid ${filter===f?C.cyan:C.border}`,
            color:filter===f?C.cyan:C.muted, cursor:"pointer",
            textShadow:filter===f?`0 0 8px ${C.cyan}`:"none", transition:"all 0.2s",
            boxShadow:filter===f?`0 0 16px ${C.cyan}22`:"none",
          }}
            onMouseEnter={e=>{ if(filter!==f){ e.currentTarget.style.borderColor=C.muted; e.currentTarget.style.color=C.white; }}}
            onMouseLeave={e=>{ if(filter!==f){ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.muted; }}}
          >{f}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:3 }}>
        {visible.map((p, i) => <ProjectCard key={p.id} p={p} idx={i} />)}
      </div>
    </div>
  );
}

// ── SKILLS ────────────────────────────────────────────────
function SkillsSection() {
  const skillColors = { LANGUAGES:C.pink, MOBILE:C.purple, FRONTEND:C.cyan, BACKEND:C.pink, DATABASES:C.purple, TOOLS:C.cyan };
  return (
    <div style={{ padding:"48px" }}>
      <SectionHeader label="skills.manifest" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:3, marginBottom:32 }}>
        {Object.entries(SKILLS).map(([cat, items], ci) => {
          const color = skillColors[cat] || C.pink;
          return (
            <div key={cat} style={{ background:C.bgCard, border:`1px solid ${C.border}`, padding:"24px", transition:"all 0.2s", animation:`card-enter 0.5s ease ${ci*0.07}s both`, cursor:"default" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${color}55`; e.currentTarget.style.boxShadow=`0 0 20px ${color}11`; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow="none"; }}
            >
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:16, color, letterSpacing:3, marginBottom:16, borderBottom:`1px solid ${C.border}`, paddingBottom:10, textShadow:`0 0 8px ${color}` }}>/{cat}</div>
              {items.map((skill,i) => (
                <div key={skill} style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:15, color:C.muted, padding:"8px 0", borderBottom:i<items.length-1?`1px solid ${C.border}33`:"none", display:"flex", alignItems:"center", gap:10, transition:"all 0.15s", cursor:"default" }}
                  onMouseEnter={e=>{ e.currentTarget.style.color=C.white; e.currentTarget.style.paddingLeft="6px"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.color=C.muted; e.currentTarget.style.paddingLeft="0"; }}
                ><span style={{ color:`${color}88`, fontSize:10 }}>▸</span>{skill}</div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Proficiency bars */}
      <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, padding:32 }}>
        <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:16, color:C.cyan, letterSpacing:3, marginBottom:28, textShadow:`0 0 8px ${C.cyan}` }}>// PROFICIENCY MATRIX</div>
        {[
          ["Android / Mobile Dev",88,C.purple],
          ["React.js / Frontend", 82,C.cyan],
          ["Firebase / Cloud",    85,C.pink],
          ["Node.js / Backend",   75,C.purple],
          ["Kotlin / Java",       87,C.cyan],
        ].map(([label,pct,color],i) => (
          <div key={label} style={{ marginBottom:i<4?22:0, animation:`slide-in-right 0.5s ease ${i*0.1}s both` }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"'Share Tech Mono',monospace", fontSize:15, fontWeight:600, marginBottom:8 }}>
              <span style={{ color:C.muted }}>{label}</span>
              <span style={{ color, textShadow:`0 0 6px ${color}` }}>{pct}%</span>
            </div>
            <div style={{ height:3, background:"#1a0a2a", position:"relative" }}>
              <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${C.purple},${color})`, boxShadow:`0 0 10px ${color}88`, position:"relative" }}>
                <div style={{ position:"absolute", right:0, top:-3, width:8, height:8, background:color, borderRadius:"50%", boxShadow:`0 0 8px ${color}` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── EXPERIENCE ────────────────────────────────────────────
function ExperienceSection() {
  return (
    <div style={{ padding:"48px" }}>
      <SectionHeader label="work_experience.log" />
      {EXPERIENCE.map((exp,ei) => (
        <div key={exp.company} style={{ background:C.bgCard, border:`1px solid ${C.border}`, marginBottom:16, overflow:"hidden", transition:"all 0.2s", animation:`card-enter 0.5s ease ${ei*0.1}s both`, cursor:"default" }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${C.pink}55`; e.currentTarget.style.boxShadow=`0 0 30px ${C.pink}11`; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow="none"; }}
        >
          {/* Top accent line */}
          <div style={{ height:2, background:`linear-gradient(90deg,${C.pink},${C.purple},${C.cyan})` }} />
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 24px", borderBottom:`1px solid ${C.border}` }}>
            <div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:28, fontWeight:700, color:C.white, letterSpacing:1 }}>{exp.role}</div>
              <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:15, color:C.pink, marginTop:4, textShadow:`0 0 8px ${C.pink}88` }}>@ {exp.company}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <Badge color={C.cyan}>{exp.type}</Badge>
              <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:13, color:C.muted, marginTop:8 }}>{exp.period}</div>
            </div>
          </div>
          <div style={{ padding:"18px 24px" }}>
            {exp.points.map((pt,i) => (
              <div key={i} style={{ display:"flex", gap:12, fontFamily:"'Share Tech Mono',monospace", fontSize:15, color:C.muted, lineHeight:2, marginBottom:10 }}>
                <span style={{ color:C.pink, marginTop:3, flexShrink:0 }}>▸</span><span>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Education timeline */}
      <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, padding:28, marginTop:8 }}>
        <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:C.purple, letterSpacing:3, marginBottom:24, textShadow:`0 0 8px ${C.purple}` }}>EDUCATION.dat</div>
        {[
          { degree:"B.Tech – CSE (Hons.)", school:"Lovely Professional University", period:"2022 – 2026", score:"CGPA: 7.18", active:true },
          { degree:"Intermediate",         school:"City Central Jr College, Kodad",  period:"2020 – 2022", score:"92.5%",     active:false },
          { degree:"Matriculation",         school:"City Central School, Kodad",      period:"2019 – 2020", score:"100%",      active:false },
        ].map((edu,i) => (
          <div key={i} style={{ display:"flex", gap:16, paddingBottom:i<2?24:0, marginBottom:i<2?24:0, borderBottom:i<2?`1px solid ${C.border}`:"none" }}>
            {/* Timeline dot */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0, paddingTop:4 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:edu.active?C.pink:C.border, boxShadow:edu.active?`0 0 12px ${C.pink}`:C.muted, border:`2px solid ${edu.active?C.pink:C.muted}` }} />
              {i<2 && <div style={{ width:1, flex:1, background:`linear-gradient(${edu.active?C.pink:C.border},${C.border})`, marginTop:4 }} />}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:22, fontWeight:700, color:C.white }}>{edu.degree}</div>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:14, color:C.muted, marginTop:3 }}>{edu.school}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:18, color:edu.active?C.cyan:C.muted, textShadow:edu.active?`0 0 8px ${C.cyan}`:"none" }}>{edu.score}</div>
                  <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:13, color:C.muted, marginTop:3 }}>{edu.period}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CERTS ─────────────────────────────────────────────────
function CertsSection() {
  return (
    <div style={{ padding:"48px" }}>
      <SectionHeader label="certifications.dat" count={`${CERTIFICATIONS.length} VERIFIED`} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:2, marginBottom:32 }}>
        {CERTIFICATIONS.map((cert,ci) => (
          <div key={cert.id} style={{ background:C.bgCard, border:`1px solid ${C.border}`, padding:"24px", overflow:"hidden", transition:"all 0.25s", animation:`card-enter 0.5s ease ${ci*0.1}s both`, cursor:"default", position:"relative" }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${cert.color}55`; e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 8px 32px ${cert.color}22`; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
          >
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${cert.color},transparent)` }} />
            <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
              <div style={{ width:64, height:64, flexShrink:0, background:`${cert.color}12`, border:`1px solid ${cert.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:15, color:cert.color, textShadow:`0 0 10px ${cert.color}`, letterSpacing:1 }}>
                {cert.badge}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:22, fontWeight:700, color:C.white, marginBottom:4 }}>{cert.name}</div>
                <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:14, color:C.muted, marginBottom:14 }}>Issued by {cert.issuer}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:14, color:C.muted }}>{cert.date}</span>
                  <Badge color={cert.color}>VERIFIED ✓</Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievement */}
      <div style={{ background:C.bgCard, border:`1px solid #ffd70033`, padding:28, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,#ffd700,transparent)" }} />
        <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:16, fontWeight:700, color:"#ffd700", letterSpacing:3, marginBottom:20, textShadow:"0 0 8px #ffd700" }}>// ACHIEVEMENTS.log</div>
        <div style={{ display:"flex", gap:20, alignItems:"center" }}>
          <div style={{ width:64, height:64, flexShrink:0, background:"#ffd70012", border:"1px solid #ffd70044", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, animation:"pulse-glow 2s ease-in-out infinite" }}>🏆</div>
          <div>
            <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:24, fontWeight:700, color:C.white, marginBottom:6 }}>Humble Hackathon — Winner</div>
            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:14, color:C.muted, lineHeight:1.9 }}>
              Won the Humble Hackathon for developing EcoTrace, an environmental impact tracking app helping users monitor carbon footprint and eco-friendly habits.
            </div>
            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:"#ffd70077", marginTop:8, letterSpacing:2 }}>2024</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CONTACT ───────────────────────────────────────────────
function ContactSection() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { type:"sys", text:"NEURAL_MAIL v2.0 — SECURE TRANSMISSION PROTOCOL" },
    { type:"sys", text:'Type your message. Type "SEND" to transmit.' },
    { type:"prompt" },
  ]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleKey = (e) => {
    if (e.key !== "Enter") return;
    const val = input.trim();
    if (!val) return;
    if (val.toUpperCase()==="SEND" && message) {
      setHistory(h=>[...h.slice(0,-1),{type:"cmd",text:`> ${val}`},{type:"ok",text:"◈ ENCRYPTING MESSAGE..."},{type:"ok",text:"◈ SENT → cherukruichandrakanth@gmail.com"}]);
      setSent(true);
    } else {
      setMessage(m=>m+(m?"\n":"")+val);
      setHistory(h=>[...h.slice(0,-1),{type:"cmd",text:`> ${val}`},{type:"prompt"}]);
    }
    setInput("");
  };

  const contacts = [
    { label:"EMAIL",    value:"cherukruichandrakanth@gmail.com", icon:"✉" },
    { label:"PHONE",    value:"+91 9948507313",                  icon:"☎" },
    { label:"GITHUB",   value:"github.com/chandrakanthcherukuri", icon:"⌥" },
    { label:"LINKEDIN", value:"linkedin.com/in/c-ck",            icon:"in" },
    { label:"LOCATION", value:"India",                            icon:"◎" },
  ];

  return (
    <div style={{ padding:"48px" }}>
      <SectionHeader label="contact.interface" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2 }}>
        <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, padding:28, animation:"slide-in-left 0.5s ease both" }}>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:C.pink, letterSpacing:3, marginBottom:24, textShadow:`0 0 8px ${C.pink}` }}>CONTACT_INFO.txt</div>
          {contacts.map(({label,value,icon}) => (
            <div key={label} style={{ display:"flex", gap:16, padding:"12px 0", borderBottom:`1px solid ${C.border}`, fontFamily:"'Share Tech Mono',monospace", transition:"all 0.15s", cursor:"default" }}
              onMouseEnter={e=>{ e.currentTarget.style.paddingLeft="6px"; }}
              onMouseLeave={e=>{ e.currentTarget.style.paddingLeft="0"; }}
            >
              <span style={{ fontSize:14, color:C.pink, width:20, textAlign:"center", flexShrink:0 }}>{icon}</span>
              <span style={{ fontSize:11, color:C.muted, letterSpacing:2, width:76, flexShrink:0, alignSelf:"center" }}>{label}</span>
              <span style={{ fontSize:13, color:C.white }}>{value}</span>
            </div>
          ))}
        </div>

        <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, padding:24, animation:"slide-in-right 0.5s ease both" }}>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:C.cyan, letterSpacing:3, marginBottom:16, textShadow:`0 0 8px ${C.cyan}` }}>MAIL_COMPOSE.exe</div>
          <div style={{ minHeight:180, marginBottom:12, fontFamily:"'Share Tech Mono',monospace" }}>
            {history.map((line,i) => (
              <div key={i} style={{ fontSize:13, lineHeight:1.9, color:line.type==="ok"?C.cyan:line.type==="cmd"?C.white:C.muted, textShadow:line.type==="ok"?`0 0 6px ${C.cyan}`:"none" }}>
                {line.type==="prompt" && !sent
                  ? <span style={{ color:C.cyan }}>&gt;_{" "}<input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} autoFocus style={{ background:"transparent", border:"none", outline:"none", color:C.white, fontFamily:"'Share Tech Mono',monospace", fontSize:13, width:"80%" }} placeholder="type here..." /></span>
                  : line.text}
              </div>
            ))}
          </div>
          {!sent && <div style={{ fontSize:11, color:C.muted, borderTop:`1px solid ${C.border}`, paddingTop:10, fontFamily:"'Share Tech Mono',monospace", letterSpacing:1 }}>ENTER ↵ add line  │  SEND ↵ transmit</div>}
        </div>
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────
export default function Portfolio() {
  const [booted, setBooted] = useState(false);
  const [active, setActive] = useState("HOME");
  const [prevActive, setPrevActive] = useState(null);

  const navigate = (tab) => {
    if (tab === active) return;
    setPrevActive(active);
    setActive(tab);
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ minHeight:"100vh", background:C.bg, color:C.white, position:"relative" }}>
        <ParticleCanvas />
        <Scanline />

        {/* Grid bg */}
        <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", backgroundImage:`linear-gradient(${C.pink}04 1px,transparent 1px),linear-gradient(90deg,${C.pink}04 1px,transparent 1px)`, backgroundSize:"60px 60px" }} />
        {/* Corner glow */}
        <div style={{ position:"fixed", top:0, left:0, width:"40vw", height:"40vh", background:`radial-gradient(ellipse at 0% 0%,${C.purple}0c,transparent 70%)`, pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"fixed", bottom:0, right:0, width:"40vw", height:"40vh", background:`radial-gradient(ellipse at 100% 100%,${C.pink}0a,transparent 70%)`, pointerEvents:"none", zIndex:0 }} />

        {!booted && <BootScreen onDone={() => setBooted(true)} />}

        <div style={{ opacity:booted?1:0, transition:"opacity 0.7s", position:"relative", zIndex:10 }}>
          <NavBar active={active} setActive={navigate} />

          <div style={{ maxWidth:1100, margin:"0 auto", paddingBottom:72 }}>
            <PageTransition id={active}>
              {active==="HOME"       && <HomeSection />}
              {active==="PROJECTS"   && <ProjectsSection />}
              {active==="EXPERIENCE" && <ExperienceSection />}
              {active==="SKILLS"     && <SkillsSection />}
              {active==="CERTS"      && <CertsSection />}
              {active==="CONTACT"    && <ContactSection />}
            </PageTransition>
          </div>

          {/* Status bar */}
          <div style={{
            position:"fixed", bottom:0, left:0, right:0, zIndex:50,
            background:`${C.bg}f0`, borderTop:`1px solid ${C.border}`,
            backdropFilter:"blur(20px)",
            display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"6px 24px",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:6, height:6, background:C.cyan, borderRadius:"50%", boxShadow:`0 0 8px ${C.cyan}`, animation:"pulse-glow 2s infinite" }} />
              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:C.pink, textShadow:`0 0 8px ${C.pink}`, letterSpacing:2 }}>◈ {active}.exe</span>
            </div>
            <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:C.muted, letterSpacing:1 }}>CHANDRAKANTH CHERUKURI  //  PORTFOLIO_OS v9.1</span>
            <div style={{ display:"flex", gap:6 }}>
              {["HOME","PROJECTS","EXPERIENCE","SKILLS","CERTS","CONTACT"].map(t=>(
                <div key={t} style={{ width:4, height:4, borderRadius:"50%", background:active===t?C.pink:C.border, boxShadow:active===t?`0 0 6px ${C.pink}`:"none", transition:"all 0.2s" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}