import { useState, useEffect, useCallback } from "react";
import useSampleRecords from "./hooks/useSampleRecords.js";
import useApplicationForm from "./hooks/useApplicationForm.js";
import useSearch from "./hooks/useSearch.js";

const C = {
  bg:"#FFFBF5", surface:"#FFFFFF", surfAlt:"#F9F5EE",
  text:"#1C1917", textMid:"#44403C", textSoft:"#78716C", textFade:"#A8A29E",
  accent:"#16785E", accentLt:"#ECFDF5", accentDk:"#0F5C47",
  warm:"#D97706",
  border:"#E7E0D6", borderLt:"#F0EBE3",
};

function DashboardMockup({ liveRecords }) {
  const [tab, setTab] = useState("records");
  const search = useSearch();
  const isRecordsTab = tab === "records";
  const showSearchResults = isRecordsTab && search.results !== null;

  const tabData = {
    records: liveRecords,
    contractors: [
      { c1:"DBPR-88412", c2:"Brister Signs Inc.", c3:"Electrical Sign", c4:"Active", st:"active", c6:"\u2014" },
      { c1:"DBPR-74291", c2:"Gulf Coast Roofing LLC", c3:"Roofing", c4:"Active", st:"active", c6:"\u2014" },
      { c1:"DBPR-61038", c2:"Sunshine HVAC Corp", c3:"Mechanical", c4:"Active", st:"active", c6:"\u2014" },
      { c1:"DBPR-55417", c2:"Atlantic Plumbing Co", c3:"Plumbing", c4:"Expired", st:"review", c6:"\u2014" },
      { c1:"DBPR-49823", c2:"Coastal Electric Inc", c3:"Electrical", c4:"Active", st:"active", c6:"\u2014" },
    ],
    analytics: [
      { c1:"FL-Q1-26", c2:"Florida Statewide", c3:"New Construction", c4:"+18%", st:"active", c6:"Q1" },
      { c1:"FL-Q1-26", c2:"Indian River County", c3:"Re-Roof Permits", c4:"+34%", st:"active", c6:"Q1" },
      { c1:"FL-Q1-26", c2:"Brevard County", c3:"Commercial Filing", c4:"+12%", st:"active", c6:"Q1" },
      { c1:"FL-Q1-26", c2:"Miami-Dade County", c3:"Code Violations", c4:"-8%", st:"review", c6:"Q1" },
      { c1:"TX-Q1-26", c2:"Texas Statewide", c3:"Residential New", c4:"+22%", st:"active", c6:"Q1" },
    ],
    api: [
      { c1:"GET", c2:"/v1/records?county=indian_river", c3:"200 OK", c4:"42ms", st:"active", c6:"Live" },
      { c1:"GET", c2:"/v1/contractors?license=ES12*", c3:"200 OK", c4:"38ms", st:"active", c6:"Live" },
      { c1:"POST", c2:"/v1/webhooks/subscribe", c3:"201 Created", c4:"55ms", st:"active", c6:"Live" },
      { c1:"GET", c2:"/v1/analytics/trends?state=FL", c3:"200 OK", c4:"120ms", st:"active", c6:"Live" },
      { c1:"GET", c2:"/v1/records/stream", c3:"SSE", c4:"\u2014", st:"active", c6:"Live" },
    ],
  };
  const hdrs = {
    records:["Record","Address","Type","Value","Status","Age"],
    contractors:["License","Company","Trade","Status","Standing","\u2014"],
    analytics:["Region","Jurisdiction","Category","Change","Trend","Period"],
    api:["Method","Endpoint","Response","Latency","Status","\u2014"],
  };
  const searchHdrs = ["ID", "Name / Address", "Type", "Detail", "Status", "Date"];
  const stC = { active:C.accent, review:C.warm, complete:C.textFade };
  const rows = showSearchResults ? search.results : tabData[tab];
  const h = showSearchResults ? searchHdrs : hdrs[tab];

  // Determine search bar display state
  const showAutoType = isRecordsTab && !search.autoTypeDone && !search.query;
  const searchActive = isRecordsTab && search.query.length > 0;

  return (
    <div style={{
      background:C.surface, borderRadius:16, border:`1px solid ${C.border}`,
      boxShadow:"0 24px 80px rgba(28,25,23,0.07), 0 2px 4px rgba(28,25,23,0.03)",
      overflow:"hidden", maxWidth:840, width:"100%", margin:"0 auto",
      transform:"perspective(1400px) rotateY(-1.5deg) rotateX(1.5deg)",
      transition:"transform 0.6s cubic-bezier(0.23,1,0.32,1)",
    }}
      onMouseEnter={e=>e.currentTarget.style.transform="perspective(1400px) rotateY(0deg) rotateX(0deg)"}
      onMouseLeave={e=>e.currentTarget.style.transform="perspective(1400px) rotateY(-1.5deg) rotateX(1.5deg)"}
    >
      <div style={{ padding:"12px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:C.surfAlt }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", gap:6 }}>
            {["#FF5F57","#FFBD2E","#28CA42"].map((c,i)=><div key={i} style={{ width:11,height:11,borderRadius:"50%",background:c }} />)}
          </div>
          <div style={{ marginLeft:12,padding:"4px 12px",background:C.surface,borderRadius:6,border:`1px solid ${C.borderLt}`,fontSize:12,color:C.textSoft }}>
            app.nuoxo.com/{tab}
          </div>
        </div>
        <div style={{ display:"flex", gap:0 }}>
          {[{k:"records",l:"Records"},{k:"contractors",l:"Contractors"},{k:"analytics",l:"Analytics"},{k:"api",l:"API"}].map(t=>(
            <span key={t.k} onClick={()=>setTab(t.k)}
              style={{
                padding:"4px 12px", fontSize:12, cursor:"pointer", transition:"all 0.2s",
                color:tab===t.k?C.accent:C.textSoft, fontWeight:tab===t.k?700:400,
                borderBottom:tab===t.k?`2px solid ${C.accent}`:"2px solid transparent",
              }}
              onMouseEnter={e=>{if(tab!==t.k)e.currentTarget.style.color=C.textMid;}}
              onMouseLeave={e=>{if(tab!==t.k)e.currentTarget.style.color=C.textSoft;}}
            >{t.l}</span>
          ))}
        </div>
      </div>
      <div style={{ padding:"10px 20px", borderBottom:`1px solid ${C.borderLt}`, display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ position:"relative", flex:"1 1 200px" }}>
          {showAutoType ? (
            <div style={{ padding:"7px 14px",background:C.surfAlt,border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,color:C.accent,fontWeight:500,minHeight:33,display:"flex",alignItems:"center" }}>
              {search.autoTypeText}<span style={{ display:"inline-block",width:1,height:14,background:C.accent,marginLeft:1,animation:"pulse 1s ease-in-out infinite" }} />
            </div>
          ) : (
            <input
              type="text"
              value={search.query}
              onChange={e => search.setQuery(e.target.value)}
              placeholder={isRecordsTab ? "Search permits, addresses, entities..." : `Search ${tab}, addresses, entities...`}
              readOnly={!isRecordsTab}
              style={{
                padding:"7px 14px",paddingRight:searchActive ? 32 : 14,
                background:C.surfAlt,
                border:`1px solid ${searchActive ? C.accent : C.border}`,
                borderRadius:8,fontSize:13,
                color:isRecordsTab ? C.text : C.textSoft,
                width:"100%",outline:"none",
                transition:"border-color 0.2s",
                cursor:isRecordsTab ? "text" : "default",
              }}
              onFocus={e => { if (isRecordsTab) e.target.style.borderColor = C.accent; }}
              onBlur={e => { if (!searchActive) e.target.style.borderColor = C.border; }}
            />
          )}
          {searchActive && (
            <span
              onClick={search.clear}
              style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",cursor:"pointer",fontSize:16,color:C.textSoft,lineHeight:1,fontWeight:700 }}
              onMouseEnter={e => e.currentTarget.style.color = C.text}
              onMouseLeave={e => e.currentTarget.style.color = C.textSoft}
            >&times;</span>
          )}
        </div>
        <select
          value={search.jurisdiction}
          onChange={e => search.setJurisdiction(e.target.value)}
          style={{
            padding:"7px 14px",background:C.surfAlt,border:`1px solid ${search.jurisdiction ? C.accent : C.border}`,
            borderRadius:8,fontSize:13,color:search.jurisdiction ? C.accent : C.textMid,fontWeight:500,
            cursor:"pointer",outline:"none",appearance:"auto",
            transition:"border-color 0.2s",
          }}
        >
          <option value="">All Jurisdictions</option>
          {search.jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}
        </select>
        <div style={{ padding:"7px 14px",background:C.accent,borderRadius:8,fontSize:13,color:"#FFF",fontWeight:600 }}>Export</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"100px 1fr 130px 70px 68px 44px", padding:"9px 20px", fontSize:11, color:C.textFade, fontWeight:700, textTransform:"uppercase", letterSpacing:0.8, borderBottom:`1px solid ${C.borderLt}` }}>
        {h.map((x,i)=><span key={i}>{x}</span>)}
      </div>
      {isRecordsTab && search.isLoading && (
        <div style={{ padding:"28px 20px",textAlign:"center",fontSize:13,color:C.accent }}>
          <span style={{ animation:"pulse 1.5s ease-in-out infinite",display:"inline-block" }}>Searching records...</span>
        </div>
      )}
      {isRecordsTab && search.error && (
        <div style={{ padding:"28px 20px",textAlign:"center",fontSize:13,color:C.warm }}>{search.error}</div>
      )}
      {isRecordsTab && !search.isLoading && !search.error && search.results !== null && search.results.length === 0 && (
        <div style={{ padding:"28px 20px",textAlign:"center",fontSize:13,color:C.textSoft }}>
          No records found for &ldquo;{search.query}&rdquo;
        </div>
      )}
      {!(isRecordsTab && (search.isLoading || search.error || (search.results !== null && search.results.length === 0))) && rows.map((p,i)=>(
        <div key={`${tab}-${i}`} style={{
          display:"grid", gridTemplateColumns:"100px 1fr 130px 70px 68px 44px",
          padding:"11px 20px", fontSize:13, alignItems:"center",
          borderBottom:i<rows.length-1?`1px solid ${C.borderLt}`:"none",
          transition:"background 0.15s",
        }}
          onMouseEnter={e=>e.currentTarget.style.background=C.surfAlt}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}
        >
          <span style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:tab==="api"?C.warm:C.accent,fontWeight:500 }}>{p.c1}</span>
          <span style={{ fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.c2}</span>
          <span style={{ color:C.textSoft,fontSize:12 }}>
            {showSearchResults && p.typeColor ? (
              <span style={{
                display:"inline-block",
                padding:"2px 8px",
                borderRadius:4,
                fontSize:10,
                fontWeight:600,
                color:"#FFF",
                background:p.typeColor,
                letterSpacing:0.3,
              }}>{p.c3}</span>
            ) : p.c3}
          </span>
          <span style={{ fontWeight:700,color:tab==="analytics"?(p.c4.startsWith("+") ? C.accent : p.c4.startsWith("-") ? C.warm : C.text) : C.text }}>{p.c4}</span>
          <span style={{ display:"flex",alignItems:"center",gap:5 }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:stC[p.st] }} />
            <span style={{ fontSize:11,color:C.textSoft,textTransform:"capitalize" }}>{p.st}</span>
          </span>
          <span style={{ fontSize:12,color:C.textFade }}>{p.c6}</span>
        </div>
      ))}
      <div style={{ padding:"10px 20px",background:C.surfAlt,display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:`1px solid ${C.borderLt}` }}>
        <span style={{ fontSize:12,color:C.textSoft }}>{showSearchResults ? `${search.resultCount} result${search.resultCount !== 1 ? "s" : ""} found` : `Sample of indexed ${tab}`}</span>
        <span style={{ fontSize:12,color:C.accent,fontWeight:600,cursor:"pointer" }}>View all &#8594;</span>
      </div>
    </div>
  );
}

function RecordChart() {
  const data = [180,220,195,310,270,380,340,420,390,510,460,580,520,640,590,720,680,750,710,820,780,860,830,910];
  const max = Math.max(...data); const w=560, h=140, px=w/(data.length-1);
  const pts = data.map((v,i)=>`${i*px},${h-(v/max)*h}`).join(" ");
  return (
    <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:"24px 28px",boxShadow:"0 4px 20px rgba(28,25,23,0.04)" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:20 }}>
        <div>
          <div style={{ fontSize:15,fontWeight:700,color:C.text }}>Record Volume Trend</div>
          <div style={{ fontSize:12,color:C.textSoft,marginTop:2 }}>Sample jurisdiction &#8212; trailing 6 months</div>
        </div>
        <span style={{ fontSize:20,fontWeight:400,fontFamily:"'Instrument Serif',serif",color:C.accent,fontStyle:"italic" }}>&#8593; trending up</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width:"100%",height:140,display:"block" }}>
        <defs><linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity="0.15"/><stop offset="100%" stopColor={C.accent} stopOpacity="0"/></linearGradient></defs>
        <polygon points={`0,${h} ${pts} ${w},${h}`} fill="url(#aGrad)"/>
        <polyline points={pts} fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
        <circle cx={w} cy={h-(data[data.length-1]/max)*h} r="4" fill={C.accent}/><circle cx={w} cy={h-(data[data.length-1]/max)*h} r="7" fill={C.accent} opacity="0.15"/>
      </svg>
    </div>
  );
}

function CoverageGrid() {
  const regions = [
    { name:"Florida", note:"Deepest coverage", hl:true },
    { name:"Texas", note:"Expanding" },
    { name:"California", note:"Expanding" },
    { name:"New York", note:"Expanding" },
    { name:"Georgia", note:"Expanding" },
    { name:"22+ more states", note:"Indexed" },
  ];
  return (
    <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
      {regions.map((c,i)=>(
        <div key={i} style={{ background:C.surface,border:`1px solid ${c.hl?C.accent:C.border}`,borderRadius:14,padding:"20px 20px 16px",transition:"border-color 0.3s,transform 0.3s,box-shadow 0.3s" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(22,120,94,0.08)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=c.hl?C.accent:C.border;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
          <div style={{ fontSize:15,fontWeight:600,color:C.text,marginBottom:6 }}>{c.name}</div>
          <div style={{ fontSize:13,fontWeight:500,color:C.textMid,lineHeight:1.4 }}>Public records<br/>indexed &amp; live</div>
          <div style={{ display:"flex",alignItems:"center",gap:5,marginTop:10 }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:C.accent,boxShadow:`0 0 6px ${C.accent}`,animation:"pulse 2.5s ease-in-out infinite" }}/>
            <span style={{ fontSize:11,color:C.accent,fontWeight:600 }}>{c.note}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function scrollTo(id) { document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" }); }

const VERTICALS = [
  "Home Services & Trades",
  "Specialty Contractors",
  "Real Estate & Investment",
  "Insurance & Lending",
  "Legal & Title",
  "Building Materials & Supply",
  "Energy & Climate",
  "Other",
];

export default function NuoxoFinal() {
  const liveRecords = useSampleRecords();
  const form = useApplicationForm();

  const [scrollY, setScrollY] = useState(0);
  useEffect(()=>{const h=()=>setScrollY(window.scrollY);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h);},[]);

  // Turnstile callback — invoked by the Turnstile widget when the user passes
  const onTurnstileCallback = useCallback((token) => {
    form.setTurnstileToken(token);
  }, [form.setTurnstileToken]);

  // Render Turnstile widget once the cf-turnstile div is mounted
  useEffect(() => {
    if (form.status === "success") return;
    const interval = setInterval(() => {
      const container = document.getElementById("turnstile-container");
      if (container && window.turnstile && !container.hasChildNodes()) {
        window.turnstile.render("#turnstile-container", {
          sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAACm7xdDQonaxMXy3",
          callback: onTurnstileCallback,
          theme: "light",
        });
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [onTurnstileCallback, form.status]);

  const inputStyle = {
    padding:"12px 16px",
    fontSize:15,
    background:C.surface,
    border:`2px solid ${C.border}`,
    borderRadius:12,
    color:C.text,
    outline:"none",
    transition:"border-color 0.2s",
    width:"100%",
  };

  return (
    <div style={{ background:C.bg,color:C.text,minHeight:"100vh",overflowX:"hidden",fontFamily:"'Satoshi','Inter',-apple-system,sans-serif" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        ::selection{background:rgba(22,120,94,0.12);color:#1C1917;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
      `}</style>

      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"14px 40px",background:scrollY>60?"rgba(255,251,245,0.92)":"transparent",backdropFilter:scrollY>60?"blur(16px)":"none",borderBottom:scrollY>60?`1px solid ${C.border}`:"1px solid transparent",transition:"all 0.3s ease",display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:1280,margin:"0 auto" }}>
        <img src="/logo.png" alt="Nuoxo" style={{ height:38,width:"auto",objectFit:"contain" }} />
        <div style={{ display:"flex",alignItems:"center",gap:28 }}>
          {[{l:"Platform",id:"platform"},{l:"Coverage",id:"coverage"},{l:"Use Cases",id:"usecases"}].map((n,i)=>(
            <span key={i} onClick={()=>scrollTo(n.id)} style={{ color:C.textSoft,fontSize:14,fontWeight:600,cursor:"pointer",transition:"color 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.color=C.text} onMouseLeave={e=>e.currentTarget.style.color=C.textSoft}>{n.l}</span>
          ))}
          <button onClick={()=>scrollTo("cta")} style={{ background:C.accent,color:"#FFF",border:"none",borderRadius:10,padding:"10px 22px",fontSize:14,fontWeight:700,cursor:"pointer",transition:"all 0.2s",boxShadow:"0 2px 8px rgba(22,120,94,0.15)" }}
            onMouseEnter={e=>{e.target.style.transform="translateY(-1px)";e.target.style.boxShadow="0 4px 16px rgba(22,120,94,0.25)";}}
            onMouseLeave={e=>{e.target.style.transform="translateY(0)";e.target.style.boxShadow="0 2px 8px rgba(22,120,94,0.15)";}}>Apply now</button>
        </div>
      </nav>

      <section style={{ position:"relative",maxWidth:1200,margin:"0 auto",padding:"140px 40px 60px",textAlign:"center",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-80,right:-120,width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(22,120,94,0.06),transparent 70%)",filter:"blur(60px)",pointerEvents:"none" }}/>
        <div style={{ position:"absolute",bottom:-200,left:-80,width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(217,119,6,0.04),transparent 70%)",filter:"blur(60px)",pointerEvents:"none" }}/>
        <div style={{ position:"relative",zIndex:1,animation:"fadeUp 0.7s ease-out" }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:8,marginBottom:28,background:C.accentLt,border:"1px solid rgba(22,120,94,0.12)",borderRadius:100,padding:"7px 18px" }}>
            <span style={{ width:7,height:7,borderRadius:"50%",background:C.accent,boxShadow:`0 0 8px ${C.accent}`,animation:"pulse 2.5s ease-in-out infinite" }}/>
            <span style={{ fontSize:13,color:C.accent,fontWeight:600 }}>Founding partner spots are limited &#8212; apply now</span>
          </div>
          <h1 style={{ fontSize:"clamp(40px,6vw,74px)",fontWeight:400,fontFamily:"'Instrument Serif',serif",lineHeight:1.08,letterSpacing:-1,marginBottom:22 }}>
            The market already moved.<br/><span style={{ color:C.accent,fontStyle:"italic" }}>Who told you?</span>
          </h1>
          <p style={{ fontSize:"clamp(16px,1.8vw,19px)",color:C.textSoft,maxWidth:540,margin:"0 auto 36px",lineHeight:1.75 }}>
            Every public record, every jurisdiction, continuously indexed. The companies on Nuoxo see the opportunities first. The rest compete for what's left.
          </p>
          <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
            <button onClick={()=>scrollTo("cta")} style={{ background:C.accent,color:"#FFF",border:"none",borderRadius:12,padding:"16px 36px",fontSize:16,fontWeight:700,cursor:"pointer",transition:"all 0.25s",boxShadow:"0 4px 24px rgba(22,120,94,0.2)" }}
              onMouseEnter={e=>{e.target.style.transform="translateY(-2px)";e.target.style.boxShadow="0 8px 32px rgba(22,120,94,0.28)";}}
              onMouseLeave={e=>{e.target.style.transform="translateY(0)";e.target.style.boxShadow="0 4px 24px rgba(22,120,94,0.2)";}}>Request access</button>
            <button onClick={()=>scrollTo("platform")} style={{ background:"transparent",color:C.text,border:`2px solid ${C.border}`,borderRadius:12,padding:"16px 36px",fontSize:16,fontWeight:700,cursor:"pointer",transition:"all 0.25s" }}
              onMouseEnter={e=>{e.target.style.borderColor=C.accent;e.target.style.color=C.accent;}}
              onMouseLeave={e=>{e.target.style.borderColor=C.border;e.target.style.color=C.text;}}>See what you're missing</button>
          </div>
        </div>
      </section>

      <section style={{ maxWidth:1200,margin:"0 auto",padding:"20px 40px 80px",animation:"fadeUp 0.9s ease-out 0.15s both" }}><DashboardMockup liveRecords={liveRecords}/></section>

      <section style={{ maxWidth:900,margin:"0 auto",padding:"48px 40px",display:"flex",justifyContent:"center",gap:64,flexWrap:"wrap" }}>
        {[{val:"Millions",label:"of records your competitors can see"},{val:"Nationwide",label:"coverage expanding weekly"},{val:"Minutes",label:"head start on every filing"},{val:"Limited",label:"partners accepted per market"}].map((s,i)=>(
          <div key={i} style={{ textAlign:"center",minWidth:130 }}>
            <div style={{ fontSize:40,fontWeight:400,fontFamily:"'Instrument Serif',serif",color:C.text,lineHeight:1.1,fontStyle:"italic" }}>{s.val}</div>
            <div style={{ fontSize:13,color:C.textSoft,marginTop:6,fontWeight:500 }}>{s.label}</div>
          </div>
        ))}
      </section>

      <section id="platform" style={{ maxWidth:1100,margin:"0 auto",padding:"40px 40px 0",scrollMarginTop:80 }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1.1fr",gap:60,alignItems:"center",padding:"72px 0",borderTop:`1px solid ${C.border}` }}>
          <div>
            <div style={{ fontSize:12,fontWeight:700,color:C.warm,textTransform:"uppercase",letterSpacing:1,marginBottom:14 }}>Live Analytics</div>
            <h2 style={{ fontSize:36,fontWeight:400,fontFamily:"'Instrument Serif',serif",lineHeight:1.2,marginBottom:16 }}>Watch the market move<br/><span style={{ fontStyle:"italic",color:C.accent }}>in real time</span></h2>
            <p style={{ fontSize:16,color:C.textSoft,lineHeight:1.8,maxWidth:420 }}>Track public record volume trends, identify hot markets, and spot opportunities the moment they emerge. Our proprietary infrastructure processes thousands of records daily across every jurisdiction we cover.</p>
          </div>
          <RecordChart/>
        </div>
        <div id="coverage" style={{ display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:60,alignItems:"center",padding:"72px 0",borderTop:`1px solid ${C.border}`,scrollMarginTop:80 }}>
          <CoverageGrid/>
          <div>
            <div style={{ fontSize:12,fontWeight:700,color:C.warm,textTransform:"uppercase",letterSpacing:1,marginBottom:14 }}>Coverage</div>
            <h2 style={{ fontSize:36,fontWeight:400,fontFamily:"'Instrument Serif',serif",lineHeight:1.2,marginBottom:16 }}>Live nationwide.<br/><span style={{ fontStyle:"italic",color:C.accent }}>Deepest in Florida.</span></h2>
            <p style={{ fontSize:16,color:C.textSoft,lineHeight:1.8,maxWidth:420 }}>Public records indexed across all 50 states with the deepest coverage in Florida. Our infrastructure automatically expands to new jurisdictions and record types without manual intervention.</p>
          </div>
        </div>
        <div style={{ padding:"72px 0",borderTop:`1px solid ${C.border}` }}>
          <div style={{ textAlign:"center",marginBottom:48 }}>
            <div style={{ fontSize:12,fontWeight:700,color:C.warm,textTransform:"uppercase",letterSpacing:1,marginBottom:14 }}>How It Works</div>
            <h2 style={{ fontSize:36,fontWeight:400,fontFamily:"'Instrument Serif',serif",lineHeight:1.2 }}>From public filing to <span style={{ fontStyle:"italic",color:C.accent }}>your dashboard</span></h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,maxWidth:900,margin:"0 auto" }}>
            {[
              {step:"01",title:"We collect",desc:"Our proprietary infrastructure monitors thousands of government portals continuously \u2014 collecting every public record the moment it\u2019s filed."},
              {step:"02",title:"We structure",desc:"Raw data from wildly different systems gets cleaned, normalized, and enriched. Addresses standardized. Entities identified. Values extracted."},
              {step:"03",title:"You act",desc:"Access structured intelligence via dashboard, API, or data feed. Search any address, track any entity, monitor any market."},
            ].map((s,i)=>(
              <div key={i} style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:"28px 24px",transition:"border-color 0.3s,transform 0.3s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.transform="translateY(-3px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="translateY(0)";}}>
                <div style={{ fontSize:32,fontFamily:"'Instrument Serif',serif",color:C.accent,marginBottom:16,fontStyle:"italic" }}>{s.step}</div>
                <div style={{ fontSize:18,fontWeight:700,marginBottom:8 }}>{s.title}</div>
                <div style={{ fontSize:14,color:C.textSoft,lineHeight:1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth:900,margin:"0 auto",padding:"20px 40px 60px" }}>
        <div style={{ background:"linear-gradient(135deg,rgba(22,120,94,0.04),rgba(217,119,6,0.03))",border:"1px solid rgba(22,120,94,0.1)",borderRadius:16,padding:"40px 36px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:32 }}>
          {[{big:"Minutes",sub:"not days",desc:"From public filing to your dashboard"},{big:"Thousands",sub:"of sources",desc:"Government portals monitored continuously"},{big:"Zero",sub:"manual entry",desc:"Fully automated collection and structuring"}].map((d,i)=>(
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:30,fontWeight:400,fontFamily:"'Instrument Serif',serif",color:C.accent,lineHeight:1 }}>{d.big}</div>
              <div style={{ fontSize:13,fontWeight:700,color:C.text,marginTop:4 }}>{d.sub}</div>
              <div style={{ fontSize:13,color:C.textSoft,marginTop:6,lineHeight:1.5 }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="usecases" style={{ maxWidth:900,margin:"0 auto",padding:"40px 40px 60px",scrollMarginTop:80 }}>
        <div style={{ textAlign:"center",marginBottom:44 }}>
          <div style={{ fontSize:12,fontWeight:700,color:C.warm,textTransform:"uppercase",letterSpacing:1,marginBottom:14 }}>Use Cases</div>
          <h2 style={{ fontSize:36,fontWeight:400,fontFamily:"'Instrument Serif',serif",lineHeight:1.2 }}>Built for everyone <span style={{ fontStyle:"italic",color:C.accent }}>who shapes</span></h2>
          <p style={{ fontSize:16,color:C.textSoft,marginTop:12,maxWidth:500,lineHeight:1.6 }}>From the homeowner hiring their first contractor to the enterprise underwriting thousands of properties. Real shapers need real data.</p>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
          {[
            {t:"Homeowners & Consumers",d:"Find verified, licensed contractors with real permit history. Check if past work was permitted, compare who\u2019s active in your area, and hire with confidence \u2014 not guesswork."},
            {t:"Home Services & Trades",d:"Find new construction, renovation, and re-roofing filings to generate qualified leads before your competitors know the project exists."},
            {t:"Specialty Contractors",d:"Know the moment a new commercial project files records. Whether you\u2019re in electrical, mechanical, fire protection, or facade work \u2014 show up first with the right proposal."},
            {t:"Real Estate & Investment",d:"Track construction velocity, development trends, and market signals at a granular, address-by-address level across entire regions."},
            {t:"Insurance & Lending",d:"Verify permit history for underwriting, flag unpermitted work during claims, and assess property risk with structured data instead of manual lookups."},
            {t:"Legal & Title",d:"Accelerate lien searches, uncover code violations, verify contractor licensing, and build stronger cases with comprehensive public record access."},
            {t:"Building Materials & Supply",d:"Understand where construction is happening and who\u2019s doing the work. Route your sales teams to the highest-activity markets."},
            {t:"Energy & Climate",d:"Monitor solar installations, EV infrastructure, and electrification filings to target high-value retrofit and incentive opportunities."},
          ].map((c,i)=>(
            <div key={i} style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:"22px 24px",transition:"border-color 0.3s,transform 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="translateY(0)";}}>
              <div style={{ fontSize:15,fontWeight:700,marginBottom:6 }}>{c.t}</div>
              <div style={{ fontSize:14,color:C.textSoft,lineHeight:1.65 }}>{c.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPETITIVE TENSION */}
      <section style={{ maxWidth:800,margin:"0 auto",padding:"40px 40px 20px",textAlign:"center" }}>
        <div style={{ background:`linear-gradient(135deg,${C.bg},rgba(22,120,94,0.03))`,border:`1px solid ${C.border}`,borderRadius:16,padding:"40px 36px" }}>
          <h3 style={{ fontSize:22,fontWeight:400,fontFamily:"'Instrument Serif',serif",lineHeight:1.4,color:C.text,marginBottom:12 }}>
            Right now, someone in your market is looking at a filing<br/>
            <span style={{ fontStyle:"italic",color:C.accent }}>you haven't seen yet.</span>
          </h3>
          <p style={{ fontSize:15,color:C.textSoft,lineHeight:1.7,maxWidth:520,margin:"0 auto" }}>
            Every day you're not on Nuoxo is a day your competitors have information you don't. The data compounds. The advantage doesn't wait.
          </p>
        </div>
      </section>

      {/* TRUST */}
      <section style={{ maxWidth:700,margin:"0 auto",padding:"30px 40px" }}>
        <div style={{ display:"flex",flexWrap:"wrap",justifyContent:"center",gap:32,padding:"28px 0",borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}` }}>
          {["Proprietary Technology","SOC 2 Roadmap","High Availability","Florida-Based"].map((item,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:7 }}>
              <span style={{ color:C.accent,fontSize:14,fontWeight:700 }}>&#10003;</span>
              <span style={{ fontSize:13,color:C.textSoft,fontWeight:600 }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA: Founding partner tier */}
      <section id="cta" style={{ maxWidth:740,margin:"0 auto",padding:"60px 40px 100px",textAlign:"center",scrollMarginTop:80 }}>
        <div style={{ background:C.accentLt,borderRadius:20,padding:"52px 44px",border:"1px solid rgba(22,120,94,0.1)" }}>
          <div style={{ display:"inline-block",background:C.warm,color:"#FFF",fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",borderRadius:6,padding:"5px 14px",marginBottom:20 }}>Founding Partners</div>
          <h2 style={{ fontSize:38,fontWeight:400,fontFamily:"'Instrument Serif',serif",lineHeight:1.2,marginBottom:10 }}>
            This tier <span style={{ fontStyle:"italic",color:C.accent }}>closes permanently.</span>
          </h2>
          <p style={{ color:C.textSoft,fontSize:16,marginBottom:32,lineHeight:1.7,maxWidth:520,margin:"0 auto 32px" }}>
            Founding partners lock in the lowest pricing forever, get priority access to new markets and data types, and receive dedicated onboarding. Once the cohort fills, this tier is gone.
          </p>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:32,maxWidth:560,margin:"0 auto 32px" }}>
            {[
              {icon:"\uD83D\uDD12",label:"Locked pricing",sub:"Guaranteed forever"},
              {icon:"\uD83C\uDFAF",label:"Market priority",sub:"Limited per vertical"},
              {icon:"\u26A1",label:"Early data access",sub:"New states first"},
            ].map((b,i)=>(
              <div key={i} style={{ background:C.surface,borderRadius:12,padding:"16px 14px",border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:20,marginBottom:6 }}>{b.icon}</div>
                <div style={{ fontSize:13,fontWeight:700,color:C.text }}>{b.label}</div>
                <div style={{ fontSize:11,color:C.textSoft,marginTop:2 }}>{b.sub}</div>
              </div>
            ))}
          </div>
          {form.status !== "success" ? (
            <div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,maxWidth:520,margin:"0 auto",marginBottom:10 }}>
                <input
                  type="email"
                  value={form.fields.email}
                  onChange={e => form.setField("email", e.target.value)}
                  placeholder="you@company.com"
                  style={inputStyle}
                  onFocus={e=>e.target.style.borderColor=C.accent}
                  onBlur={e=>e.target.style.borderColor=C.border}
                />
                <input
                  type="text"
                  value={form.fields.company_name}
                  onChange={e => form.setField("company_name", e.target.value)}
                  placeholder="Company name"
                  style={inputStyle}
                  onFocus={e=>e.target.style.borderColor=C.accent}
                  onBlur={e=>e.target.style.borderColor=C.border}
                />
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,maxWidth:520,margin:"0 auto",marginBottom:10 }}>
                <select
                  value={form.fields.vertical}
                  onChange={e => form.setField("vertical", e.target.value)}
                  style={{ ...inputStyle, appearance:"auto",cursor:"pointer",color:form.fields.vertical?C.text:C.textSoft }}
                >
                  <option value="" disabled>Select your vertical</option>
                  {VERTICALS.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <input
                  type="text"
                  value={form.fields.market}
                  onChange={e => form.setField("market", e.target.value)}
                  placeholder="Your market (e.g., South Florida)"
                  style={inputStyle}
                  onFocus={e=>e.target.style.borderColor=C.accent}
                  onBlur={e=>e.target.style.borderColor=C.border}
                />
              </div>
              {/* Honeypot field — hidden from real users */}
              <div style={{ position:"absolute",left:"-9999px",opacity:0,height:0,overflow:"hidden" }} aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.fields.website}
                  onChange={e => form.setField("website", e.target.value)}
                />
              </div>
              {/* Turnstile widget */}
              <div style={{ display:"flex",justifyContent:"center",marginBottom:12 }}>
                <div id="turnstile-container"></div>
              </div>
              {form.status === "error" && form.errorMessage && (
                <p style={{ fontSize:13,color:"#DC2626",marginBottom:10 }}>{form.errorMessage}</p>
              )}
              <button
                onClick={form.submit}
                disabled={!form.canSubmit}
                style={{
                  background:form.canSubmit ? C.accent : C.textFade,
                  color:"#FFF",
                  border:"none",
                  borderRadius:12,
                  padding:"14px 36px",
                  fontSize:15,
                  fontWeight:700,
                  cursor:form.canSubmit ? "pointer" : "not-allowed",
                  transition:"all 0.2s",
                  boxShadow:form.canSubmit ? "0 2px 12px rgba(22,120,94,0.15)" : "none",
                  opacity:form.status === "submitting" ? 0.7 : 1,
                }}
                onMouseEnter={e=>{if(form.canSubmit)e.target.style.boxShadow="0 4px 20px rgba(22,120,94,0.25)";}}
                onMouseLeave={e=>{if(form.canSubmit)e.target.style.boxShadow="0 2px 12px rgba(22,120,94,0.15)";}}
              >
                {form.status === "submitting" ? "Submitting..." : "Request access"}
              </button>
              <p style={{ fontSize:12,color:C.textFade,marginTop:10 }}>We review every application. Acceptance is not guaranteed.</p>
            </div>
          ) : (
            <div style={{ background:C.surface,borderRadius:14,padding:"20px 24px",border:"1px solid rgba(22,120,94,0.15)",animation:"fadeUp 0.4s ease-out" }}>
              <div style={{ color:C.accent,fontWeight:700,fontSize:16 }}>Application received &#10003;</div>
              <div style={{ color:C.textSoft,fontSize:14,marginTop:4 }}>We'll review your application and be in touch within 48 hours.</div>
            </div>
          )}
        </div>
      </section>

      <footer style={{ maxWidth:1200,margin:"0 auto",padding:"28px 40px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <img src="/logo.png" alt="Nuoxo" style={{ height:22,width:"auto",objectFit:"contain" }} />
          <span style={{ fontSize:13,color:C.textFade }}>&#169; 2026 Nuoxo &#8212; Public records intelligence, continuously delivered.</span>
        </div>
        <span style={{ fontSize:12,color:C.textFade }}>Vero Beach, Florida</span>
      </footer>
    </div>
  );
}
