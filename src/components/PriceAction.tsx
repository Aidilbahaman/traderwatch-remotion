import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {PAChart} from './PAChart';

const SKY='#1685cf',LIME='#b7f34b',GOLD='#d89c1d';
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const easeOut=Easing.out(Easing.cubic),easeInOut=Easing.inOut(Easing.cubic);
const SCENE=190,COUNT=8;
export const PA_FRAMES=SCENE*COUNT;
const N=30;

const Backdrop:React.FC=()=>{
  const f=useCurrentFrame();
  const d=interpolate(f,[0,PA_FRAMES],[0,-180],clamp);
  return <AbsoluteFill style={{background:'linear-gradient(180deg,#01080f 0%,#030f1d 26%,#051a30 46%,#041324 68%,#030f1d 86%,#01090f 100%)'}}>
    <AbsoluteFill style={{backgroundImage:'repeating-linear-gradient(0deg,rgba(255,255,255,.020) 0 1px,transparent 1px 72px),repeating-linear-gradient(90deg,rgba(255,255,255,.014) 0 1px,transparent 1px 72px)',backgroundPosition:`${d}px ${d}px`}}/>
    <div style={{position:'absolute',left:540,top:820,width:1500,height:1500,marginLeft:-750,marginTop:-750,borderRadius:'50%',background:'radial-gradient(circle,rgba(9,48,81,.55),rgba(6,31,54,.22) 48%,transparent 72%)'}}/>
  </AbsoluteFill>;
};

const Chrome:React.FC<{section:string}>=({section})=>
  <>
    <div style={{position:'absolute',top:62,left:72,right:72,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <div style={{display:'flex',alignItems:'center',gap:14}}>
        <Img src={staticFile('logo-mark.png')} style={{height:58,width:62,objectFit:'contain'}}/>
        <div style={{fontSize:20,fontWeight:900,letterSpacing:'.16em',color:'#eaf6ff',fontFamily:'Arial,sans-serif'}}>TRADERWATCH</div>
      </div>
      <div style={{fontSize:16,fontWeight:800,letterSpacing:'.18em',color:'#7fa3c4',fontFamily:'Arial,sans-serif'}}>{section}</div>
    </div>
    <div style={{position:'absolute',top:136,left:72,right:72,height:1,background:'rgba(255,255,255,.14)'}}/>
  </>;

const Dots:React.FC<{index:number}>=({index})=>
  <div style={{position:'absolute',bottom:92,left:0,right:0,display:'flex',justifyContent:'center',gap:10}}>
    {Array.from({length:COUNT}).map((_,i)=>
      <div key={i} style={{width:i===index?42:11,height:11,borderRadius:999,background:i===index?SKY:'rgba(255,255,255,.23)'}}/>
    )}
  </div>;

const Stage:React.FC<{children:React.ReactNode}>=({children})=>
  <AbsoluteFill style={{justifyContent:'center',alignItems:'center'}}>
    <div style={{width:936,display:'flex',flexDirection:'column'}}>{children}</div>
  </AbsoluteFill>;

const Pill:React.FC<{n:string;label:string;color?:string;p:number}>=({n,label,color=SKY,p})=>
  <div style={{display:'flex',alignItems:'center',gap:14,opacity:p,transform:`translateY(${(1-p)*18}px)`}}>
    <div style={{minWidth:58,height:58,borderRadius:999,padding:'0 10px',display:'flex',alignItems:'center',justifyContent:'center',background:color,color:'#08203a',fontSize:26,fontWeight:900,fontFamily:'Arial,sans-serif'}}>{n}</div>
    <div style={{fontSize:20,fontWeight:900,letterSpacing:'.2em',color:'#bcd6ea',fontFamily:'Arial,sans-serif'}}>{label}</div>
  </div>;

const Head:React.FC<{p:number;children:React.ReactNode}>=({p,children})=>
  <div style={{fontSize:68,lineHeight:1.06,letterSpacing:'-.045em',color:'#fff',fontWeight:800,marginTop:26,fontFamily:'Arial,sans-serif',opacity:p,transform:`translateY(${(1-p)*26}px)`}}>{children}</div>;

const Note:React.FC<{p:number;children:React.ReactNode}>=({p,children})=>
  <div style={{marginTop:38,fontSize:26,lineHeight:1.42,color:'#a9c1d6',fontFamily:'Arial,sans-serif',opacity:p,transform:`translateY(${(1-p)*16}px)`,borderLeft:`3px solid ${SKY}`,paddingLeft:20}}>{children}</div>;

const Check:React.FC<{p:number;color?:string}>=({p,color=LIME})=>
  <svg width={30} height={30} viewBox="0 0 30 30">
    <circle cx={15} cy={15} r={14} fill="none" stroke={color} strokeWidth={2} opacity={.35*p}/>
    <path d="M8.5 15.5L13 20L21.5 10.5" fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={26} strokeDashoffset={26*(1-p)}/>
  </svg>;

const Cover:React.FC<{l:number}>=({l})=>{
  const a=interpolate(l,[4,30],[0,1],{...clamp,easing:easeOut});
  const b=interpolate(l,[20,56],[0,1],{...clamp,easing:easeOut});
  const r=interpolate(l,[40,86],[0,1],{...clamp,easing:easeInOut});
  const s=interpolate(l,[62,112],[0,1],clamp);
  return <AbsoluteFill style={{justifyContent:'center',alignItems:'center'}}>
    <div style={{width:980,textAlign:'center',marginTop:-30}}>
      <div style={{fontSize:20,fontWeight:900,letterSpacing:'.24em',color:'#bcd6ea',fontFamily:'Arial,sans-serif',opacity:a}}>TRADERWATCH · EDUCATION</div>
      <div style={{fontSize:114,fontWeight:800,letterSpacing:'-.055em',color:'#fff',lineHeight:1,marginTop:28,opacity:a,fontFamily:'Arial,sans-serif'}}>What is</div>
      <div style={{fontSize:114,fontWeight:800,letterSpacing:'-.055em',color:LIME,lineHeight:1,opacity:b,fontFamily:'Arial,sans-serif'}}>price action?</div>
      <div style={{width:500*r,height:5,borderRadius:3,margin:'38px auto 0',background:`linear-gradient(90deg,${LIME},rgba(183,243,75,.06))`}}/>
      <div style={{fontSize:28,lineHeight:1.45,color:'#a9c1d6',marginTop:30,opacity:s,fontFamily:'Arial,sans-serif'}}>Reading the story<br/>inside the candles.</div>
    </div>
  </AbsoluteFill>;
};

const S1:React.FC<{l:number}>=({l})=>{
  const p=interpolate(l,[4,28],[0,1],clamp);
  const h=interpolate(l,[10,42],[0,1],{...clamp,easing:easeOut});
  const chart=interpolate(l,[34,100],[0,1],{...clamp,easing:easeInOut});
  const n=interpolate(l,[112,148],[0,1],clamp);
  // candles reveal one by one (1 → 30)
  const reveal=interpolate(l,[36,SCENE-20],[1,N],{...clamp,easing:easeInOut});
  return <Stage>
    <Pill n="01" label="PRICE = INFORMATION" p={p}/>
    <Head p={h}>Every candle is<br/>a <span style={{color:LIME}}>decision.</span></Head>
    <div style={{marginTop:40,opacity:chart}}>
      <PAChart reveal={reveal} showTrend={0} showLevel={0} showReaction={0} live zoom={interpolate(l,[0,80,SCENE],[1,1.10,1.02],{...clamp,easing:easeInOut})}/>
    </div>
    <Note p={n}>Each bar records a fight between buyers and sellers. Price action is reading who won.</Note>
  </Stage>;
};

const S2:React.FC<{l:number}>=({l})=>{
  const p=interpolate(l,[4,28],[0,1],clamp);
  const h=interpolate(l,[10,42],[0,1],{...clamp,easing:easeOut});
  const chart=interpolate(l,[34,100],[0,1],{...clamp,easing:easeInOut});
  const n=interpolate(l,[112,148],[0,1],clamp);
  return <Stage>
    <Pill n="02" label="ANATOMY" color={SKY} p={p}/>
    <Head p={h}>Body. Wick.<br/><span style={{color:SKY}}>Close.</span></Head>
    <div style={{marginTop:40,opacity:chart}}>
      <PAChart showTrend={0} showLevel={0} showReaction={0} live zoom={interpolate(l,[0,80,SCENE],[1,1.12,1.02],{...clamp,easing:easeInOut})} scanPulse={interpolate(l,[36,80,SCENE],[0,0.6,0],{...clamp,easing:easeInOut})} variant="blueprint"/>
    </div>
    <Note p={n}>A long body means conviction. A long wick means rejection. The close shows who held control.</Note>
  </Stage>;
};

const S3:React.FC<{l:number}>=({l})=>{
  const p=interpolate(l,[4,28],[0,1],clamp);
  const h=interpolate(l,[10,42],[0,1],{...clamp,easing:easeOut});
  const chart=interpolate(l,[34,100],[0,1],{...clamp,easing:easeInOut});
  const trend=interpolate(l,[46,88],[0,1],clamp);
  const n=interpolate(l,[112,148],[0,1],clamp);
  return <Stage>
    <Pill n="03" label="STRUCTURE" color={LIME} p={p}/>
    <Head p={h}>Higher highs.<br/><span style={{color:LIME}}>Higher lows.</span></Head>
    <div style={{marginTop:40,opacity:chart}}>
      <PAChart reveal={N} showTrend={trend} showLevel={0} showReaction={0} live zoom={interpolate(l,[0,80,SCENE],[1,1.10,1.02],{...clamp,easing:easeInOut})} variant="holographic"/>
    </div>
    <Note p={n}>Labels H and L mark the swings. When each high beats the last, buyers still control the chart.</Note>
  </Stage>;
};

const S4:React.FC<{l:number}>=({l})=>{
  const p=interpolate(l,[4,28],[0,1],clamp);
  const h=interpolate(l,[10,42],[0,1],{...clamp,easing:easeOut});
  const chart=interpolate(l,[34,100],[0,1],{...clamp,easing:easeInOut});
  const level=interpolate(l,[46,88],[0,1],clamp);
  const n=interpolate(l,[112,148],[0,1],clamp);
  return <Stage>
    <Pill n="04" label="THE LEVEL" color={GOLD} p={p}/>
    <Head p={h}>Where price<br/><span style={{color:GOLD}}>turned before.</span></Head>
    <div style={{marginTop:40,opacity:chart}}>
      <PAChart reveal={N} showTrend={1} showLevel={level} showReaction={0} live zoom={interpolate(l,[0,80,SCENE],[1,1.12,1.02],{...clamp,easing:easeInOut})} variant="neon"/>
    </div>
    <Note p={n}>The blue band is a support zone. The circles are the times price actually reacted there.</Note>
  </Stage>;
};

const S5:React.FC<{l:number}>=({l})=>{
  const p=interpolate(l,[4,28],[0,1],clamp);
  const h=interpolate(l,[10,42],[0,1],{...clamp,easing:easeOut});
  const chart=interpolate(l,[34,100],[0,1],{...clamp,easing:easeInOut});
  const react=interpolate(l,[50,92],[0,1],clamp);
  const n=interpolate(l,[116,152],[0,1],clamp);
  return <Stage>
    <Pill n="05" label="THE REACTION" color={GOLD} p={p}/>
    <Head p={h}>A level is not<br/>a <span style={{color:GOLD}}>signal.</span></Head>
    <div style={{marginTop:40,opacity:chart}}>
      <PAChart reveal={N} showTrend={1} showLevel={1} showReaction={react} live zoom={interpolate(l,[0,80,SCENE],[1,1.14,1.03],{...clamp,easing:easeInOut})} scanPulse={interpolate(l,[38,100],[0,1],{...clamp,easing:easeInOut})} variant="ascii"/>
    </div>
    <Note p={n}>The marked candle is buyers stepping in. That reaction — not the line itself — is the information.</Note>
  </Stage>;
};

const Checklist:React.FC<{l:number}>=({l})=>{
  const p=interpolate(l,[4,28],[0,1],clamp);
  const h=interpolate(l,[10,42],[0,1],{...clamp,easing:easeOut});
  const n=interpolate(l,[140,176],[0,1],clamp);
  const items=['Read the candle','Follow the structure','Mark the level','Wait for the reaction'];
  return <Stage>
    <Pill n="06" label="THE SEQUENCE" color={LIME} p={p}/>
    <Head p={h}>Price action is<br/>a <span style={{color:LIME}}>process.</span></Head>
    <div style={{display:'flex',flexDirection:'column',gap:13,marginTop:44}}>
      {items.map((t,i)=>{
        const q=interpolate(l,[34+i*18,60+i*18],[0,1],clamp);
        return <div key={t} style={{height:78,borderRadius:16,display:'flex',alignItems:'center',gap:17,padding:'0 22px',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.13)',opacity:q,transform:`translateX(${(1-q)*26}px)`}}>
          <Check p={q} color={LIME}/>
          <div style={{fontSize:27,fontWeight:700,color:'#eaf6ff',fontFamily:'Arial,sans-serif'}}>{t}</div>
        </div>;
      })}
    </div>
    <Note p={n}>No indicator required. Four steps, in this order, every time.</Note>
  </Stage>;
};

const Outro:React.FC<{l:number}>=({l})=>{
  const a=interpolate(l,[4,36],[0,1],{...clamp,easing:easeOut});
  const b=interpolate(l,[22,62],[0,1],{...clamp,easing:easeOut});
  const r=interpolate(l,[42,92],[0,1],{...clamp,easing:easeInOut});
  const c=interpolate(l,[72,112],[0,1],clamp);
  return <AbsoluteFill style={{justifyContent:'center',alignItems:'center'}}>
    <div style={{width:980,textAlign:'center',marginTop:-34}}>
      <div style={{fontSize:104,fontWeight:800,letterSpacing:'-.055em',color:'#fff',lineHeight:1,opacity:a,fontFamily:'Arial,sans-serif'}}>Read the chart.</div>
      <div style={{fontSize:104,fontWeight:800,letterSpacing:'-.055em',color:LIME,lineHeight:1,opacity:b,fontFamily:'Arial,sans-serif'}}>Read the risk.</div>
      <div style={{width:440*r,height:5,borderRadius:3,margin:'40px auto 0',background:`linear-gradient(90deg,${LIME},rgba(183,243,75,.06))`}}/>
      <div style={{fontSize:26,lineHeight:1.45,color:'#a9c1d6',marginTop:30,opacity:c,fontFamily:'Arial,sans-serif'}}>Price action is information,<br/>not a guarantee.</div>
      <div style={{marginTop:30,opacity:c}}>
        <Img src={staticFile('logo-mark.png')} style={{height:92,width:98,objectFit:'contain',display:'block',margin:'0 auto 20px'}}/>
        <div style={{fontSize:32,fontWeight:900,letterSpacing:'.08em',color:'#eaf6ff',fontFamily:'Arial,sans-serif'}}>@TRADERWATCH</div>
        <div style={{fontSize:18,color:'#6f8aa6',marginTop:22,fontFamily:'Arial,sans-serif'}}>Educational content only. Not financial advice.</div>
      </div>
    </div>
  </AbsoluteFill>;
};

const op=(f:number,i:number)=>{
  const s=i*SCENE,e=s+SCENE;
  if(i===0) return interpolate(f,[e-16,e],[1,0],clamp);
  return Math.min(interpolate(f,[s,s+16],[0,1],clamp),interpolate(f,[e-16,e],[1,0],clamp));
};

export const PriceAction:React.FC=()=>{
  const f=useCurrentFrame();
  const idx=Math.min(COUNT-1,Math.floor(f/SCENE));
  const l=f-idx*SCENE;
  const push=interpolate(l,[0,SCENE],[1,1.02],clamp);
  const sec=['INTRO','STEP 01','STEP 02','STEP 03','STEP 04','STEP 05','SEQUENCE','OUTRO'][idx];
  return <AbsoluteFill style={{overflow:'hidden'}}>
    <Backdrop/>
    <Chrome section={sec}/>
    <AbsoluteFill style={{transform:`scale(${push})`,transformOrigin:'center 42%'}}>
      {idx===0&&<AbsoluteFill style={{opacity:op(f,0)}}><Cover l={l}/></AbsoluteFill>}
      {idx===1&&<AbsoluteFill style={{opacity:op(f,1)}}><S1 l={l}/></AbsoluteFill>}
      {idx===2&&<AbsoluteFill style={{opacity:op(f,2)}}><S2 l={l}/></AbsoluteFill>}
      {idx===3&&<AbsoluteFill style={{opacity:op(f,3)}}><S3 l={l}/></AbsoluteFill>}
      {idx===4&&<AbsoluteFill style={{opacity:op(f,4)}}><S4 l={l}/></AbsoluteFill>}
      {idx===5&&<AbsoluteFill style={{opacity:op(f,5)}}><S5 l={l}/></AbsoluteFill>}
      {idx===6&&<AbsoluteFill style={{opacity:op(f,6)}}><Checklist l={l}/></AbsoluteFill>}
      {idx===7&&<AbsoluteFill style={{opacity:op(f,7)}}><Outro l={l}/></AbsoluteFill>}
    </AbsoluteFill>
    <Dots index={idx}/>
    <div style={{position:'absolute',bottom:0,left:0,right:0,height:6,background:'rgba(255,255,255,.10)'}}>
      <div style={{height:'100%',width:`${(f/PA_FRAMES)*100}%`,background:`linear-gradient(90deg,${SKY},${LIME})`}}/>
    </div>
  </AbsoluteFill>;
};
