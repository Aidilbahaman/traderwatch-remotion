import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {PAChart} from './PAChart';
import {EURUSD_M1} from './eurusdM1';

export const TVR_FRAMES = 1520;

const W = 1080;
const H = 1920;
const SCENE = 190;
const COUNT = 8;
const NAVY_BG = 'linear-gradient(180deg,#01080f 0%,#030f1d 26%,#051a30 46%,#041324 68%,#030f1d 86%,#01090f 100%)';
const SKY = '#1685cf';
const LIME = '#b7f34b';
const GOLD = '#d89c1d';
const RED = '#e0555a';
const NAVY = '#09284c';
const FONT = 'Arial, Helvetica, sans-serif';
const MONO = 'Courier New, monospace';
const CANDLE_COUNT = Math.min(30, Math.max(1, EURUSD_M1.length - 6));
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);

const anim = (l: number, start: number, end: number, easing = easeOut) =>
  interpolate(l, [start, end], [0, 1], {...clamp, easing});
const fade = (l: number) => Math.min(
  interpolate(l, [0, 14], [0, 1], clamp),
  interpolate(l, [170, 190], [1, 0], clamp),
);

const Pill: React.FC<{n: string; label: string; color: string; p?: number}> = ({n, label, color, p = 1}) => (
  <div style={{display:'flex', alignItems:'center', gap:16, opacity:p, transform:`translateY(${(1-p)*18}px)`}}>
    <div style={{minWidth:58, height:58, borderRadius:999, padding:'0 10px', display:'flex', alignItems:'center', justifyContent:'center', background:color, color:'#fff', fontSize:26, fontWeight:900, fontFamily:'Arial', boxShadow:`0 8px 26px ${color}44`}}>{n}</div>
    <div style={{padding:'12px 22px', borderRadius:999, background:`${color}24`, border:`2px solid ${color}70`, color:'#f5fbff', fontSize:20, fontWeight:900, letterSpacing:'.18em', fontFamily:FONT}}>{label}</div>
  </div>
);

const Chrome: React.FC<{label: string; accent: string}> = ({label, accent}) => (
  <>
    <div style={{position:'absolute', zIndex:29, top:46, left:54, right:54, height:92, background:`linear-gradient(90deg,rgba(1,8,15,.92),${NAVY}cc,rgba(1,8,15,.86))`, border:'1px solid rgba(255,255,255,.16)', boxShadow:'0 12px 34px rgba(0,0,0,.28)'}}/>
    <div style={{position:'absolute', zIndex:30, top:56, left:66, right:66, height:70, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <div style={{display:'flex', alignItems:'center', gap:15}}>
        <div style={{width:62, height:62, borderRadius:15, display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(145deg,rgba(255,255,255,.22),rgba(255,255,255,.04))', border:'1px solid rgba(255,255,255,.24)', boxShadow:`0 0 26px ${accent}35`}}>
          <Img src={staticFile('logo-mark.png')} style={{width:51, height:51, objectFit:'contain'}}/>
        </div>
        <div>
          <div style={{fontFamily:FONT, color:'#f6fbff', fontSize:21, fontWeight:900, letterSpacing:'.15em'}}>TRADERWATCH</div>
          <div style={{fontFamily:MONO, color:'#7f9bb5', fontSize:13, marginTop:4, letterSpacing:'.12em'}}>MARKET MODE / 08</div>
        </div>
      </div>
      <div style={{fontFamily:FONT, color:accent, fontSize:18, fontWeight:900, letterSpacing:'.18em', padding:'12px 18px', border:`1px solid ${accent}70`, background:'rgba(1,8,15,.62)'}}>{label}</div>
    </div>
    <div style={{position:'absolute', zIndex:30, top:143, left:66, right:66, height:2, background:`linear-gradient(90deg,${accent},${accent}18,transparent)`}}/>
  </>
);

const Footer: React.FC<{index: number; accent: string; frame: number}> = ({index, accent, frame}) => (
  <>
    <div style={{position:'absolute', zIndex:40, left:0, right:0, bottom:76, display:'flex', justifyContent:'center', gap:12}}>
      {Array.from({length:COUNT}).map((_, i) => (
        <div key={i} style={{width:i===index?45:12, height:12, borderRadius:99, background:i===index?accent:'rgba(255,255,255,.25)', border:'1px solid rgba(255,255,255,.22)', boxShadow:i===index?`0 0 18px ${accent}`:'none'}}/>
      ))}
    </div>
    <div style={{position:'absolute', zIndex:50, left:0, right:0, bottom:0, height:8, background:'rgba(255,255,255,.10)'}}>
      <div style={{height:'100%', width:`${interpolate(frame,[0,TVR_FRAMES-1],[0,100],clamp)}%`, background:`linear-gradient(90deg,${SKY},${accent})`, boxShadow:`0 0 20px ${accent}`}}/>
    </div>
  </>
);

const Stage: React.FC<{children: React.ReactNode; width?: number; style?: React.CSSProperties}> = ({children, width=936, style}) => (
  <AbsoluteFill style={{justifyContent:'center', alignItems:'center', paddingTop:125, paddingBottom:120}}>
    <div style={{width, display:'flex', flexDirection:'column', ...style}}>{children}</div>
  </AbsoluteFill>
);

const Grid: React.FC<{color: string; size?: number; opacity?: number; offset?: number}> = ({color,size=58,opacity=.18,offset=0}) => (
  <AbsoluteFill style={{opacity, backgroundImage:`linear-gradient(${color} 1px,transparent 1px),linear-gradient(90deg,${color} 1px,transparent 1px)`, backgroundSize:`${size}px ${size}px`, backgroundPosition:`${offset}px ${offset}px`}}/>
);

const ChartWrap: React.FC<{children: React.ReactNode; p: number; accent: string; style?: React.CSSProperties}> = ({children,p,accent,style}) => (
  <div style={{position:'relative', width:936, height:470, marginTop:28, opacity:p, transform:`translateY(${(1-p)*28}px)`, filter:`drop-shadow(0 18px 38px ${accent}22)`, ...style}}>{children}</div>
);

const Headline: React.FC<{children: React.ReactNode; p: number; color?: string; size?: number; style?: React.CSSProperties}> = ({children,p,color='#fff',size=82,style}) => (
  <div style={{fontFamily:FONT, fontWeight:900, fontSize:size, lineHeight:.98, letterSpacing:'-.045em', color, opacity:p, transform:`translateY(${(1-p)*34}px)`, ...style}}>{children}</div>
);

const Scene0: React.FC<{l:number}> = ({l}) => {
  const p1=anim(l,2,25), p2=anim(l,13,44), p3=anim(l,31,67), p4=anim(l,56,92);
  const sweep=interpolate(l,[0,SCENE],[ -420, 1120],clamp);
  const rot=interpolate(l,[0,SCENE],[-7,5],clamp);
  return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 38%,#4f5963 0%,#17232e 28%,#050b10 68%,#010305 100%)'}}>
    <Grid color="rgba(255,145,0,.24)" size={72} opacity={.18} offset={interpolate(l,[0,SCENE],[0,35],clamp)}/>
    <div style={{position:'absolute',left:-170,top:260,width:1420,height:220,transform:`rotate(${rot}deg)`,background:'linear-gradient(180deg,#111 0%,#e8edf1 16%,#4b555c 31%,#f8fbff 47%,#333c43 60%,#c9d0d4 75%,#171d21 100%)',opacity:.58,border:'3px solid #ff8a00',boxShadow:'0 0 70px rgba(255,111,0,.38)'}}/>
    <div style={{position:'absolute',left:sweep,top:0,bottom:0,width:190,background:'linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent)',transform:'skewX(-15deg)'}}/>
    <div style={{position:'absolute',right:-110,bottom:260,width:480,height:480,borderRadius:'50%',border:'36px solid #ff6f00',boxShadow:'0 0 0 15px #ffd000,0 0 80px #ff6f0066',opacity:.8,transform:`scale(${interpolate(l,[0,95,190],[.84,1.04,.94],clamp)})`}}/>
    <Stage width={950} style={{alignItems:'flex-start'}}>
      <Pill n="01" label="INTRO" color="#ff6f00" p={p1}/>
      <div style={{marginTop:58,position:'relative'}}>
        <div style={{fontFamily:FONT,fontSize:132,fontWeight:1000,lineHeight:.86,letterSpacing:'-.075em',color:'#f7fbff',textShadow:'0 5px 0 #5e6870,0 12px 28px #000',opacity:p2,transform:`translateX(${(1-p2)*-60}px)`}}>TREND</div>
        <div style={{fontFamily:FONT,fontSize:132,fontWeight:1000,lineHeight:.86,letterSpacing:'-.075em',color:'#ff7900',textShadow:'0 5px 0 #7e2d00,0 12px 28px #000',opacity:p3,transform:`translateX(${(1-p3)*60}px)`}}>VS RANGE</div>
        <div style={{position:'absolute',height:8,left:4,right:18,bottom:-26,background:'linear-gradient(90deg,#ff6f00,#ffe600,#ff6f00)',transform:`scaleX(${p3})`,transformOrigin:'left'}}/>
      </div>
      <div style={{marginTop:68,fontFamily:FONT,fontSize:34,lineHeight:1.35,color:'#f4f7fa',fontWeight:700,opacity:p4}}>Know which game <span style={{color:'#ffd000'}}>price</span> is playing.</div>
      <div style={{marginTop:55,display:'flex',alignItems:'center',gap:18,opacity:p4}}><Img src={staticFile('logo-mark.png')} style={{width:78,height:78,objectFit:'contain'}}/><div style={{fontFamily:FONT,fontWeight:900,fontSize:29,letterSpacing:'.12em',color:'#fff'}}>@TRADERWATCH</div></div>
    </Stage>
  </AbsoluteFill>;
};

const IsoMini: React.FC<{type:'up'|'down'; p:number}> = ({type,p}) => {
  const col=type==='up'?'#00e5ff':'#ff6b6b';
  const pts=type==='up'?'20,142 86,110 136,121 205,76 268,91 342,31':'20,31 82,61 142,49 208,96 274,83 342,143';
  return <svg viewBox="0 0 360 175" style={{width:'100%',height:170}}>
    {[0,1,2,3].map(i=><path key={i} d={`M${20+i*16} ${160-i*9} L${190+i*16} ${76-i*9} L${345+i*2} ${153-i*9}`} fill="none" stroke="rgba(0,229,255,.15)" strokeWidth="2"/>)}
    <polyline points={pts} fill="none" stroke={col} strokeWidth="8" strokeLinejoin="bevel" strokeLinecap="square" pathLength={1} strokeDasharray={1} strokeDashoffset={1-p} style={{filter:`drop-shadow(0 0 8px ${col})`}}/>
    <polygon points={type==='up'?'330,19 354,27 342,48':'330,130 354,148 328,158'} fill={col} opacity={p}/>
  </svg>;
};

const Scene1: React.FC<{l:number}> = ({l}) => {
  const pill=anim(l,1,20),head=anim(l,7,35),panels=anim(l,24,62),chart=anim(l,48,91),note=anim(l,90,125);
  const reveal=interpolate(l,[44,135],[3,CANDLE_COUNT],clamp);
  return <AbsoluteFill style={{background:'radial-gradient(circle at 75% 22%,#0c5970 0%,#053747 24%,#01171f 66%,#00090d 100%)'}}>
    <Grid color="rgba(0,229,255,.22)" size={64} opacity={.24} offset={interpolate(l,[0,SCENE],[0,-24],clamp)}/>
    <div style={{position:'absolute',left:-260,top:440,width:1600,height:720,transform:'rotateX(58deg) rotateZ(-16deg)',background:'repeating-linear-gradient(0deg,transparent 0 58px,rgba(0,229,255,.16) 59px 61px),repeating-linear-gradient(90deg,transparent 0 58px,rgba(0,229,255,.13) 59px 61px)',opacity:.55}}/>
    <Stage>
      <Pill n="02" label="TREND" color="#00e5ff" p={pill}/>
      <Headline p={head} size={80} style={{marginTop:24}}>TREND = <span style={{color:'#00e5ff'}}>intent.</span></Headline>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14,marginTop:28,opacity:panels}}>
        <div style={{gridColumn:'span 2',height:198,background:'rgba(0,20,28,.86)',border:'4px solid #00e5ff',boxShadow:'10px 10px 0 #033a45',padding:12,transform:`translateX(${(1-panels)*-30}px)`}}><IsoMini type="up" p={panels}/></div>
        <div style={{height:198,background:'#00e5ff',border:'4px solid #001a21',padding:17,display:'flex',flexDirection:'column',justifyContent:'space-between',transform:`translateY(${(1-panels)*-22}px)`}}><div style={{fontFamily:FONT,fontSize:22,fontWeight:1000,color:'#00151a'}}>UPTREND</div><div style={{fontFamily:FONT,fontSize:38,fontWeight:1000,lineHeight:.94,color:'#00151a'}}>HH<br/>+ HL</div><div style={{fontFamily:MONO,fontSize:14,color:'#00333d'}}>BUYERS LEAD →</div></div>
        <div style={{height:176,background:'#082a34',border:'4px solid #9bf6ff',padding:15,transform:`translateY(${(1-panels)*24}px)`}}><div style={{fontFamily:FONT,fontSize:22,fontWeight:1000,color:'#9bf6ff'}}>DOWNTREND</div><div style={{fontFamily:FONT,fontSize:36,fontWeight:1000,color:'#fff',marginTop:18}}>LH + LL</div></div>
        <div style={{gridColumn:'span 2',height:176,background:'rgba(0,20,28,.86)',border:'4px solid #ff6b6b',padding:2,transform:`translateX(${(1-panels)*30}px)`}}><IsoMini type="down" p={panels}/></div>
      </div>
      <ChartWrap p={chart} accent="#00e5ff" style={{marginTop:20,transform:`translateY(${(1-chart)*24}px) scale(.82)`,transformOrigin:'top left',height:386}}><PAChart reveal={reveal} showTrend={chart} variant="blueprint" caption="EUR/USD · M1 · TREND STRUCTURE"/></ChartWrap>
      <div style={{fontFamily:FONT,fontSize:25,lineHeight:1.35,color:'#c7f8ff',fontWeight:700,opacity:note}}>Higher highs + higher lows = uptrend. Lower highs + lower lows = downtrend.</div>
    </Stage>
  </AbsoluteFill>;
};

const Scene2: React.FC<{l:number}> = ({l}) => {
  const pill=anim(l,2,21),head=anim(l,8,35),diagram=anim(l,24,65),chart=anim(l,58,100),note=anim(l,98,132);
  const bounce=interpolate(l,[30,60,88,116,144],[0,1,0,1,0],clamp);
  return <AbsoluteFill style={{background:'#031a2a'}}>
    <Grid color="rgba(0,212,255,.36)" size={42} opacity={.35} offset={interpolate(l,[0,SCENE],[0,18],clamp)}/>
    <div style={{position:'absolute',inset:34,border:'2px solid rgba(0,212,255,.38)'}}/><div style={{position:'absolute',left:52,top:175,fontFamily:MONO,fontSize:13,color:'#00d4ff'}}>DWG: MARKET-RANGE / SCALE 1:1</div>
    <Stage>
      <Pill n="03" label="RANGE" color="#00d4ff" p={pill}/>
      <Headline p={head} size={79} style={{marginTop:24}}>RANGE = <span style={{color:'#00d4ff'}}>pause.</span></Headline>
      <div style={{height:318,marginTop:34,position:'relative',border:'3px solid #00d4ff',background:'rgba(0,18,34,.72)',opacity:diagram,transform:`scale(${.94+.06*diagram})`}}>
        <div style={{position:'absolute',left:36,right:36,top:55,height:4,background:'#fff',boxShadow:'0 0 15px #00d4ff'}}/><div style={{position:'absolute',left:36,top:18,fontFamily:MONO,fontSize:20,color:'#fff'}}>CEILING / RESISTANCE</div>
        <div style={{position:'absolute',left:36,right:36,bottom:55,height:4,background:'#fff',boxShadow:'0 0 15px #00d4ff'}}/><div style={{position:'absolute',right:36,bottom:18,fontFamily:MONO,fontSize:20,color:'#fff'}}>FLOOR / SUPPORT</div>
        <svg width="100%" height="100%" viewBox="0 0 930 318" style={{position:'absolute',inset:0}}><polyline points="60,238 175,65 286,234 405,67 526,236 647,66 770,235 874,79" fill="none" stroke="#00d4ff" strokeWidth="9" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-diagram} style={{filter:'drop-shadow(0 0 10px #00d4ff)'}}/><circle cx={60+814*bounce} cy={238-160*bounce} r={14} fill="#fff" stroke="#00d4ff" strokeWidth={7}/></svg>
      </div>
      <ChartWrap p={chart} accent="#00d4ff" style={{marginTop:22,transform:`scale(.82) translateY(${(1-chart)*20}px)`,transformOrigin:'top left',height:386}}><PAChart showLevel={chart} scanPulse={interpolate(l,[66,138],[0,1],clamp)} variant="blueprint" caption="EUR/USD · M1 · BOXED PRICE"/></ChartWrap>
      <div style={{fontFamily:FONT,fontSize:25,lineHeight:1.4,color:'#cceefa',fontWeight:700,opacity:note}}>Price bounces between ceiling and floor. <span style={{color:'#00d4ff'}}>Two players taking turns.</span></div>
    </Stage>
  </AbsoluteFill>;
};

const Scene3: React.FC<{l:number}> = ({l}) => {
  const pill=anim(l,1,18),title=anim(l,5,31,Easing.out(Easing.back(1.6))),cols=anim(l,26,66),chart=anim(l,67,108),note=anim(l,105,136);
  return <AbsoluteFill style={{background:'radial-gradient(circle at 20% 34%,#4a092a 0%,#17091f 35%,#05040c 76%)'}}>
    <AbsoluteFill style={{opacity:.22,backgroundImage:'radial-gradient(#ff4b98 2px,transparent 2px)',backgroundSize:'17px 17px',transform:`translateX(${interpolate(l,[0,SCENE],[0,20],clamp)}px)`}}/>
    <div style={{position:'absolute',right:-130,top:240,width:520,height:520,borderRadius:'50%',background:'#e91e63',opacity:.17,boxShadow:'0 0 120px #e91e63'}}/>
    <Stage>
      <Pill n="04" label="IDENTIFY" color="#e91e63" p={pill}/>
      <Headline p={title} size={88} style={{marginTop:24,textShadow:'6px 6px 0 #4d0926'}}>HOW TO <span style={{color:'#ff4b98'}}>TELL.</span></Headline>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginTop:32,opacity:cols}}>
        <div style={{height:332,padding:24,background:'#f5f1e9',border:'7px solid #12030b',boxShadow:'12px 12px 0 #e91e63',transform:`rotate(${interpolate(l,[0,75],[ -4,0],clamp)}deg)`}}><div style={{display:'inline-block',background:'#101018',color:'#fff',fontFamily:FONT,fontWeight:1000,fontSize:36,padding:'8px 14px'}}>TREND</div><div style={{fontFamily:FONT,color:'#17121a',fontWeight:900,fontSize:29,lineHeight:1.12,marginTop:34}}>STRUCTURE<br/><span style={{fontSize:63,color:'#e91e63'}}>BREAKS</span><br/>confirm direction.</div><div style={{height:12,marginTop:24,background:'repeating-linear-gradient(90deg,#17121a 0 18px,transparent 18px 28px)'}}/></div>
        <div style={{height:332,padding:24,background:'#e91e63',border:'7px solid #12030b',boxShadow:'12px 12px 0 #fff',transform:`rotate(${interpolate(l,[0,75],[4,0],clamp)}deg)`}}><div style={{display:'inline-block',background:'#fff',color:'#17121a',fontFamily:FONT,fontWeight:1000,fontSize:36,padding:'8px 14px'}}>RANGE</div><div style={{fontFamily:FONT,color:'#fff',fontWeight:900,fontSize:29,lineHeight:1.12,marginTop:34}}>SAME<br/><span style={{fontSize:63,color:'#12030b'}}>LEVELS</span><br/>confirm the box.</div><div style={{height:12,marginTop:24,background:'repeating-linear-gradient(90deg,#fff 0 18px,transparent 18px 28px)'}}/></div>
      </div>
      <ChartWrap p={chart} accent="#e91e63" style={{marginTop:28,transform:`scale(.86) translateY(${(1-chart)*25}px)`,transformOrigin:'top left',height:404,border:'5px solid #e91e63',boxShadow:'12px 12px 0 rgba(255,255,255,.78)'}}><PAChart showTrend={cols} showLevel={cols} scanPulse={interpolate(l,[74,144],[0,1],clamp)} variant="neon" caption="COMPARE THE STRUCTURE, NOT ONE CANDLE"/></ChartWrap>
      <div style={{fontFamily:MONO,fontSize:22,color:'#ffc7df',fontWeight:700,opacity:note}}>BREAKING LEVELS = DIRECTION  /  REPEATING LEVELS = BOX</div>
    </Stage>
  </AbsoluteFill>;
};

const Scene4: React.FC<{l:number}> = ({l}) => {
  const springEase=Easing.elastic(1.25);
  const pill=anim(l,0,26,springEase),head=anim(l,8,36,springEase),focus=anim(l,25,69,springEase),chart=anim(l,66,108),note=anim(l,105,136);
  const float=interpolate(l,[0,55,110,170],[0,-8,5,0],clamp);
  return <AbsoluteFill style={{background:'radial-gradient(circle at 70% 25%,#653512 0%,#25160d 35%,#080706 78%)'}}>
    <div style={{position:'absolute',left:-100,top:250,width:540,height:760,background:'#efc66f',transform:`rotate(-12deg) translateY(${float}px)`,clipPath:'polygon(8% 0,100% 4%,94% 94%,0 100%)',boxShadow:'28px 32px 0 #8e4415',opacity:.19}}/>
    <div style={{position:'absolute',right:-80,bottom:250,width:580,height:620,background:'#ff8b18',transform:`rotate(9deg) translateY(${-float}px)`,clipPath:'polygon(0 7%,92% 0,100% 92%,8% 100%)',opacity:.13}}/>
    <Stage>
      <Pill n="05" label="SIGNAL" color="#ff9800" p={pill}/>
      <Headline p={head} size={78} style={{marginTop:23}}>THE KEY <span style={{color:'#ffad33'}}>SIGNAL.</span></Headline>
      <div style={{marginTop:31,padding:'24px 30px',background:'#f4e4bc',border:'5px solid #231207',boxShadow:'14px 14px 0 #ff9800',opacity:focus,transform:`translateY(${(1-focus)*36+float}px) rotate(${(1-focus)*-3}deg)`}}><div style={{fontFamily:FONT,fontWeight:1000,fontSize:53,lineHeight:1,color:'#271305'}}>CLOSE OUTSIDE<br/><span style={{color:'#d95d00'}}>THE ZONE</span></div></div>
      <ChartWrap p={chart} accent="#ff9800" style={{marginTop:34,transform:`scale(.88) translateY(${(1-chart)*25}px)`,transformOrigin:'top left',height:414,padding:10,background:'#20150d',boxShadow:'16px 18px 0 rgba(255,152,0,.40)'}}><PAChart showLevel={1} showReaction={chart} scanPulse={interpolate(l,[70,135],[0,1],clamp)} variant="holographic" caption="LEVEL BREAK · CLOSE CONFIRMATION"/></ChartWrap>
      <div style={{marginTop:4,padding:'20px 24px',background:'#1c1009',border:'2px dashed #ffad33',fontFamily:FONT,fontSize:25,lineHeight:1.38,color:'#ffe4bf',opacity:note}}>Range breaks when price <b style={{color:'#ffad33'}}>CLOSES outside the zone.</b> That close is the signal. Everything before is context.</div>
    </Stage>
  </AbsoluteFill>;
};

const PixelIcon: React.FC<{kind:'entry'|'stop'|'target'; color:string; p:number}> = ({kind,color,p}) => {
  const symbol=kind==='entry'?'↳':kind==='stop'?'■':'◆';
  return <div style={{width:86,height:86,display:'flex',alignItems:'center',justifyContent:'center',background:color,color:'#070817',fontFamily:MONO,fontSize:47,fontWeight:900,border:'8px solid #070817',outline:`4px solid ${color}`,boxShadow:`10px 10px 0 ${color}55`,opacity:p,transform:`scale(${.72+.28*p})`}}>{symbol}</div>;
};

const Scene5: React.FC<{l:number}> = ({l}) => {
  const pill=anim(l,1,20),head=anim(l,8,35),rows=anim(l,27,75),chart=anim(l,70,111),note=anim(l,108,140);
  const shimmer=interpolate(l,[0,SCENE],[-250,1100],clamp);
  const data=[{k:'ENTRY',s:'Where the idea activates',c:'#67e8f9',kind:'entry' as const},{k:'STOP',s:'Where the idea is wrong',c:'#f472b6',kind:'stop' as const},{k:'TARGET',s:'Where reward is taken',c:'#c084fc',kind:'target' as const}];
  return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 28%,#262361 0%,#10102d 36%,#040716 76%)'}}>
    <Grid color="rgba(129,140,248,.22)" size={48} opacity={.18} offset={interpolate(l,[0,SCENE],[0,-20],clamp)}/>
    <div style={{position:'absolute',left:shimmer,top:0,bottom:0,width:260,background:'linear-gradient(90deg,transparent,rgba(103,232,249,.13),rgba(244,114,182,.15),transparent)',transform:'skewX(-17deg)'}}/>
    <Stage>
      <Pill n="06" label="RISK" color="#818cf8" p={pill}/>
      <Headline p={head} size={78} style={{marginTop:23}}>RISK <span style={{color:'#a5b4fc',textShadow:'0 0 25px #818cf8'}}>CHECK.</span></Headline>
      <div style={{display:'flex',gap:17,marginTop:34}}>{data.map((x,i)=>{const p=anim(l,30+i*10,61+i*10,Easing.out(Easing.back(1.4)));return <div key={x.k} style={{flex:1,minHeight:252,padding:'22px 18px',background:'linear-gradient(145deg,rgba(255,255,255,.15),rgba(255,255,255,.035))',border:`3px solid ${x.c}`,boxShadow:`inset 0 0 26px ${x.c}22,10px 12px 0 #050615`,opacity:rows,transform:`translateY(${(1-p)*36}px)`}}><PixelIcon kind={x.kind} color={x.c} p={p}/><div style={{fontFamily:MONO,fontSize:29,fontWeight:900,color:x.c,marginTop:27}}>{x.k}</div><div style={{fontFamily:FONT,fontSize:18,lineHeight:1.25,color:'#e8eaff',marginTop:8}}>{x.s}</div></div>})}</div>
      <ChartWrap p={chart} accent="#818cf8" style={{marginTop:30,transform:`scale(.85) translateY(${(1-chart)*22}px)`,transformOrigin:'top left',height:400}}><PAChart showLevel={1} showReaction={chart} variant="holographic" caption="PLAN THE TRADE · DEFINE THE RISK"/></ChartWrap>
      <div style={{fontFamily:FONT,fontSize:25,lineHeight:1.38,color:'#dadcff',fontWeight:700,opacity:note}}>Same rules work in trend and range. <span style={{color:'#67e8f9'}}>Entry.</span> <span style={{color:'#f472b6'}}>Stop.</span> <span style={{color:'#c084fc'}}>Target.</span> Never skip the checklist.</div>
    </Stage>
  </AbsoluteFill>;
};

const Scene6: React.FC<{l:number}> = ({l}) => {
  const pill=anim(l,1,20),head=anim(l,7,34),term=anim(l,25,64),chart=anim(l,77,118),note=anim(l,115,143);
  const items=['Identify the mode.','Mark the levels.','Wait for confirmation.','Apply risk rules.'];
  return <AbsoluteFill style={{background:'#000803'}}>
    <AbsoluteFill style={{opacity:.22,background:'repeating-linear-gradient(0deg,rgba(0,255,0,.16) 0 2px,transparent 2px 7px)'}}/>
    <div style={{position:'absolute',left:100,top:245,fontFamily:MONO,fontSize:17,lineHeight:1.4,color:'rgba(0,255,0,.18)',whiteSpace:'pre'}}>{`01001101 01001111 01000100 01000101\n> scan.market_structure()\n> awaiting confirmation...`}</div>
    <Stage>
      <Pill n="07" label="CHECKLIST" color="#00aa28" p={pill}/>
      <Headline p={head} size={77} style={{marginTop:23,fontFamily:MONO,color:'#d9ffe0',textShadow:'0 0 15px #00ff00'}}>ASCII_CHECKLIST</Headline>
      <div style={{marginTop:32,border:'3px solid #00ff00',background:'rgba(0,18,5,.88)',padding:'23px 28px',boxShadow:'0 0 35px rgba(0,255,0,.28)',opacity:term,transform:`translateY(${(1-term)*24}px)`}}>
        <div style={{fontFamily:MONO,fontSize:20,color:'#00ff00',letterSpacing:'.04em'}}>+----------------------------------+</div>
        {items.map((x,i)=>{const p=anim(l,38+i*13,62+i*13);return <div key={x} style={{fontFamily:MONO,fontSize:27,lineHeight:1.62,color:'#d8ffdc',opacity:p,transform:`translateX(${(1-p)*28}px)`,textShadow:'0 0 9px rgba(0,255,0,.60)'}}>| [<span style={{color:'#00ff00'}}>X</span>] {i+1}. {x}</div>})}
        <div style={{fontFamily:MONO,fontSize:20,color:'#00ff00'}}>+----------------------------------+</div>
      </div>
      <ChartWrap p={chart} accent="#00ff00" style={{marginTop:29,transform:`scale(.85) translateY(${(1-chart)*22}px)`,transformOrigin:'top left',height:400,border:'2px solid #00ff00',boxShadow:'0 0 28px rgba(0,255,0,.22)'}}><PAChart showTrend={1} showLevel={1} scanPulse={interpolate(l,[78,145],[0,1],clamp)} variant="ascii" caption="> EURUSD_M1 :: MODE_SCAN ACTIVE"/></ChartWrap>
      <div style={{fontFamily:MONO,fontSize:21,color:'#00ff00',opacity:note,textShadow:'0 0 10px #00ff00'}}>STATUS: RULES LOADED / EMOTION DISABLED / RISK DEFINED</div>
    </Stage>
  </AbsoluteFill>;
};

const DecoCorner: React.FC<{side:'left'|'right'; p:number}> = ({side,p}) => <div style={{position:'absolute',top:285,[side]:52,width:260,height:360,opacity:p,transform:`scale(${.8+.2*p})`}}><div style={{position:'absolute',top:0,[side]:0,width:220,height:5,background:GOLD}}/><div style={{position:'absolute',top:0,[side]:0,width:5,height:220,background:GOLD}}/><div style={{position:'absolute',top:42,[side]:42,width:145,height:145,border:`4px solid ${GOLD}`,transform:'rotate(45deg)'}}/><div style={{position:'absolute',top:93,[side]:93,width:45,height:45,background:GOLD,transform:'rotate(45deg)'}}/></div>;

const Scene7: React.FC<{l:number}> = ({l}) => {
  const pill=anim(l,1,22),a=anim(l,9,40),b=anim(l,24,58),brand=anim(l,59,96),disc=anim(l,92,126);
  const drift=interpolate(l,[0,SCENE],[-10,12],clamp);
  return <AbsoluteFill style={{background:'#0b0a08'}}>
    <div style={{position:'absolute',left:0,right:0,top:0,height:1060,background:'linear-gradient(160deg,#f4e9c7 0%,#fff9e8 52%,#efdfae 100%)'}}/>
    <div style={{position:'absolute',left:0,right:0,top:1058,height:16,background:`linear-gradient(90deg,${GOLD},#fff3c4,${GOLD})`}}/>
    <div style={{position:'absolute',left:0,right:0,top:1074,height:846,background:'radial-gradient(circle at 50% 0%,#191408 0%,#0b0a08 62%)'}}/>
    <DecoCorner side="left" p={a}/><DecoCorner side="right" p={a}/>
    <div style={{position:'absolute',left:55,right:55,top:214,bottom:200,border:`4px solid ${GOLD}`}}/><div style={{position:'absolute',left:75,right:75,top:234,bottom:220,border:'2px solid rgba(216,156,29,.55)'}}/>
    <div style={{position:'absolute',right:-160,bottom:300,width:650,height:650,border:`42px double ${GOLD}`,transform:`rotate(${45+drift}deg)`,opacity:.16}}/>
    <Stage width={900} style={{alignItems:'center',textAlign:'center'}}>
      <Pill n="08" label="OUTRO" color={GOLD} p={pill}/>
      <div style={{marginTop:62,background:'#080808',padding:'31px 37px',border:`8px solid ${GOLD}`,boxShadow:'18px 18px 0 #fff',opacity:a,transform:`translateX(${(1-a)*-48}px)`}}><div style={{fontFamily:FONT,fontSize:71,fontWeight:1000,lineHeight:.94,letterSpacing:'-.045em',color:'#fff'}}>Know the mode.</div></div>
      <div style={{background:GOLD,padding:'29px 38px',border:'8px solid #080808',boxShadow:'18px 18px 0 #fff',opacity:b,transform:`translateX(${(1-b)*48}px)`}}><div style={{fontFamily:FONT,fontSize:71,fontWeight:1000,lineHeight:.94,letterSpacing:'-.045em',color:'#080808'}}>Manage the risk.</div></div>
      <div style={{display:'flex',alignItems:'center',gap:23,marginTop:80,padding:'24px 34px',background:'#fff',border:'5px solid #080808',boxShadow:`12px 12px 0 ${GOLD}`,opacity:brand}}><Img src={staticFile('logo-mark.png')} style={{width:92,height:92,objectFit:'contain'}}/><div style={{textAlign:'left'}}><div style={{fontFamily:FONT,fontWeight:1000,fontSize:36,letterSpacing:'.08em',color:'#080808'}}>@TRADERWATCH</div><div style={{fontFamily:MONO,fontSize:17,color:'#755300',marginTop:7}}>READ STRUCTURE. DEFINE RISK.</div></div></div>
      <div style={{marginTop:56,fontFamily:FONT,fontSize:21,fontWeight:700,color:'#f4e9c7',background:'#080808',padding:'15px 25px',border:`2px solid ${GOLD}`,opacity:disc}}>Educational content only. Not financial advice.</div>
    </Stage>
  </AbsoluteFill>;
};

const accents = ['#ff6f00','#00e5ff','#00d4ff','#e91e63','#ff9800','#818cf8','#00ff00',GOLD];
const labels = ['INTRO','TREND','RANGE','IDENTIFY','SIGNAL','RISK','CHECKLIST','OUTRO'];

export const TrendVsRange: React.FC = () => {
  const frame=useCurrentFrame();
  const index=Math.min(COUNT-1,Math.floor(frame/SCENE));
  const local=frame-index*SCENE;
  const opacity=fade(local);
  const accent=accents[index];
  return <AbsoluteFill style={{width:W,height:H,overflow:'hidden',background:NAVY_BG,color:'#fff'}}>
    <AbsoluteFill style={{opacity,background:NAVY_BG}}>
      {index===0&&<Scene0 l={local}/>} 
      {index===1&&<Scene1 l={local}/>} 
      {index===2&&<Scene2 l={local}/>} 
      {index===3&&<Scene3 l={local}/>} 
      {index===4&&<Scene4 l={local}/>} 
      {index===5&&<Scene5 l={local}/>} 
      {index===6&&<Scene6 l={local}/>} 
      {index===7&&<Scene7 l={local}/>} 
    </AbsoluteFill>
    <Chrome label={labels[index]} accent={accent}/>
    <Footer index={index} accent={accent} frame={frame}/>
  </AbsoluteFill>;
};
