import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';

const NAVY='#09284c', BLUE='#0d4f91', SKY='#1685cf', LIME='#b7f34b', RED='#c65349';
const INK='#10243b', MUTED='#60758d', PALE='#f5f9fc', LINE='#d9e5ef';
const ISOBG='#061222', ISOGRID='#0d2a45', ISO1='#0e3a66', ISO2='#1685cf', ISO3='#1a9fdf', ISOHI='#b7f34b';
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const out=Easing.out(Easing.cubic),inOut=Easing.inOut(Easing.cubic);
const SCENE=190,COUNT=8; export const PROMO_ISO_FRAMES=SCENE*COUNT;

/* ===== isometric helpers ===== */
// 30-degree isometric projection
const ISO = 0.866; // cos(30°)
const ISO_SIN = 0.5;  // sin(30°)

const isoX = (x: number, y: number, z: number, ox: number, oy: number) =>
  ox + (x - y) * ISO;
const isoY = (x: number, y: number, z: number, ox: number, oy: number) =>
  oy + (x + y) * ISO_SIN - z;

// Draw isometric tile (top + left face + right face)
const IsoTile: React.FC<{
  x: number; y: number; z: number; w: number; h: number; d: number;
  top: string; left: string; right: string; ox: number; oy: number; opacity?: number;
}> = ({x,y,z,w,h,d,top,left,right,ox,oy,opacity=1}) => {
  const pts = (dx:number,dy:number,dz:number)=>[isoX(x+dx,y+dy,z+dz,ox,oy),isoY(x+dx,y+dy,z+dz,ox,oy)] as [number,number];
  const tl=pts(0,0,d), tr=pts(w,0,d), br=pts(w,h,d), bl=pts(0,h,d);
  const tb=pts(0,0,0),rb=pts(w,0,0),bb=pts(w,h,0),lb=pts(0,h,0);
  return (
    <g opacity={opacity}>
      {/* top face */}
      <polygon points={[tl,tr,br,bl].map(p=>p.join(',')).join(' ')} fill={top} />
      {/* left face */}
      <polygon points={[bl,br,rb,lb].map(p=>p.join(',')).join(' ')} fill={left} />
      {/* right face */}
      <polygon points={[lb,rb,tb,tl].map(p=>p.join(',')).join(' ')} fill={right} />
    </g>
  );
};

// Animated bar that grows up
const IsoBar: React.FC<{
  x: number; y: number; ox: number; oy: number;
  targetH: number; color: string; p: number; w?: number;
}> = ({x,y,ox,oy,targetH,color,p,w=0.5}) => {
  const h = targetH * p;
  const top = color + 'cc';
  const left = color + '88';
  const right = color + '44';
  return (
    <IsoTile x={x} y={y} z={0} w={w} h={w} d={h} top={top} left={left} right={right} ox={ox} oy={oy} />
  );
};

// Grid floor
const IsoGrid: React.FC<{ox: number; oy: number; cols: number; rows: number; cell: number}> = ({ox,oy,cols,rows,cell}) => (
  <g opacity={0.25}>
    {Array.from({length:cols+1}).map((_,i)=>{
      const x1=isoX(i*cell,0,0,ox,oy),y1=isoY(i*cell,0,0,ox,oy),x2=isoX(i*cell,rows*cell,0,ox,oy),y2=isoY(i*cell,rows*cell,0,ox,oy);
      return <line key={`v${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ISOGRID} strokeWidth={0.6}/>;
    })}
    {Array.from({length:rows+1}).map((_,j)=>{
      const x1=isoX(0,j*cell,0,ox,oy),y1=isoY(0,j*cell,0,ox,oy),x2=isoX(cols*cell,j*cell,0,ox,oy),y2=isoY(cols*cell,j*cell,0,ox,oy);
      return <line key={`h${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ISOGRID} strokeWidth={0.6}/>;
    })}
  </g>
);

/* ===== backdrop with isometric grid ===== */
const IsoBg: React.FC<{l:number}> = ({l}) => {
  const gridP = interpolate(l,[0,SCENE],[0,1],clamp);
  return (
    <AbsoluteFill>
      {/* dark iso background */}
      <svg width={1080} height={1920} style={{position:'absolute'}}>
        {/* diagonal stripe grid for depth */}
        {Array.from({length:14}).map((_,i)=>{
          const x = -200 + i * 120;
          return <line key={i} x1={x} y1={0} x2={x+900} y2={1920}
            stroke={`rgba(13,42,69,${0.3 + 0.1*Math.sin(l*0.005+i)})`} strokeWidth={40}/>;
        })}
        {/* ground grid */}
        <IsoGrid ox={540} oy={1200} cols={8} rows={8} cell={52} />
      </svg>
    </AbsoluteFill>
  );
};

const Chrome: React.FC<{section:string}>=()=>null; // no chrome for iso — full bleed
const Dots: React.FC<{index:number}>=({index})=><div style={{position:'absolute',bottom:88,left:0,right:0,display:'flex',justifyContent:'center',gap:9}}>
  {Array.from({length:COUNT}).map((_,i)=><div key={i} style={{width:i===index?42:10,height:10,borderRadius:99,background:i===index?ISOHI:'rgba(255,255,255,.22)'}}/>)}
</div>;
const Stage: React.FC<{children:React.ReactNode}>=({children})=><AbsoluteFill style={{justifyContent:'center',alignItems:'center'}}>
  <div style={{width:936,display:'flex',flexDirection:'column'}}>{children}</div>
</AbsoluteFill>;
const Kicker:React.FC<{p:number;children:React.ReactNode}>=({p,children})=><div style={{alignSelf:'flex-start',padding:'9px 15px',borderRadius:999,background:ISOHI,color:INK,font:'800 15px Arial',letterSpacing:'.16em',opacity:p,transform:`translateY(${(1-p)*14}px)`}}>{children}</div>;
const Head:React.FC<{p:number;children:React.ReactNode;size?:number}>=({p,children,size=76})=><div style={{marginTop:24,font:`800 ${size}px/1.04 Arial`,letterSpacing:'-.05em',color:'#fff',opacity:p,transform:`translateY(${(1-p)*24}px)`}}>{children}</div>;
const Sub:React.FC<{p:number;children:React.ReactNode}>=({p,children})=><div style={{marginTop:22,maxWidth:820,font:'500 26px/1.45 Arial',color:'#7ab8d4',opacity:p,transform:`translateY(${(1-p)*16}px)`}}>{children}</div>;
const Card:React.FC<{p:number;children:React.ReactNode;dark?:boolean}>=({p,children,dark=false})=><div style={{marginTop:40,padding:30,borderRadius:24,background:dark?'rgba(6,18,34,.92)':'rgba(9,40,76,.88)',border:`1px solid ${dark?'#0d2a45':'#173b5e'}`,boxShadow:'0 24px 60px rgba(0,0,0,.5)',opacity:p,transform:`translateY(${(1-p)*30}px)`}}>{children}</div>;

/* ===== scene: isometric chart bars ===== */
const IsoChart: React.FC<{l:number;ox:number;oy:number}> = ({l,ox,oy}) => {
  const heights = [1.2, 2.1, 1.8, 3.0, 2.5, 4.1, 3.5, 5.2, 4.0, 5.8, 5.1, 6.4];
  return (
    <g>
      <IsoGrid ox={ox} oy={oy} cols={12} rows={1} cell={44} />
      {heights.map((h,i)=>{
        const p = interpolate(l,[0+i*6, 20+i*6],[0,1],clamp);
        return <IsoBar key={i} x={i*44} y={0} ox={ox} oy={oy} targetH={h*28} color={i>=8?ISOHI:ISOGRID.includes('') ? ISO2 : ISO3} p={p} w={0.9}/>;
      })}
      {/* label */}
      <text x={ox-20} y={oy+18} fill={ISOGRID} fontSize={12} fontFamily="Arial" fontWeight={700}>EUR/USD M1</text>
    </g>
  );
};

/* ===== cover ===== */
const Cover:React.FC<{l:number}>=({l})=>{
  const a=interpolate(l,[3,32],[0,1],{...clamp,easing:out}),b=interpolate(l,[18,58],[0,1],{...clamp,easing:out}),c=interpolate(l,[52,100],[0,1],clamp),spin=interpolate(l,[0,SCENE],[0,Math.PI*2],clamp);
  return <AbsoluteFill style={{justifyContent:'center',alignItems:'center'}}>
    <svg width={1080} height={1920} style={{position:'absolute'}}>
      {/* isometric platform under text */}
      <IsoTile x={-4} y={-4} z={0} w={8} h={8} d={0.4} top={ISO2+'44'} left={ISO2+'33'} right={ISO2+'22'} ox={540} oy={960} opacity={0.6}/>
      {/* floating cubes */}
      {[[0,1,3],[2,4,5],[1,3,2],[3,2,4],[4,1,3],[5,0,2]].map(([dx,dy,dz],i)=>{
        const bx=540+Math.sin(l*0.008+i*1.3)*60+(dx-2)*120;
        const by=760+Math.cos(l*0.01+i*1.7)*40+(dy-2)*80;
        const bz=50+dz*40+Math.sin(l*0.006+i)*30;
        const s=0.5+i%2*0.3;
        const col=[ISOHI,ISO3,ISOGRID,ISO1][i%4]+(i%3===0?'cc':'99');
        return <IsoTile key={i} x={0} y={0} z={0} w={s} h={s} d={s} top={col} left={col} right={col} ox={bx} oy={by}/>;
      })}
      {/* isometric chart */}
      <IsoChart l={l} ox={540} oy={1100}/>
    </svg>
    <div style={{position:'relative',width:900,textAlign:'center',marginTop:-80}}>
      <div style={{font:'900 17px Arial',letterSpacing:'.30em',color:ISOHI,opacity:a}}>TRADERWATCH</div>
      <div style={{marginTop:28,font:'800 96px/1.02 Arial',letterSpacing:'-.055em',color:'#fff',opacity:a}}>Read the market.</div>
      <div style={{font:'800 96px/1.02 Arial',letterSpacing:'-.055em',color:ISOHI,opacity:b}}>Trade with a plan.</div>
      <div style={{marginTop:30,font:'500 26px/1.5 Arial',color:'#7ab8d4',opacity:c}}>Education. Context. Risk tools.<br/>All in one place.</div>
    </div>
  </AbsoluteFill>;
};

/* ===== hub ===== */
const Hub:React.FC<{l:number}>=({l})=>{
  const k=interpolate(l,[4,28],[0,1],clamp),h=interpolate(l,[10,44],[0,1],{...clamp,easing:out}),p=interpolate(l,[34,80],[0,1],{...clamp,easing:out});
  return <><IsoBg l={l}/>
    <svg width={1080} height={1920} style={{position:'absolute'}}>
      {/* isometric book/library stacks */}
      {[[0,2],[2,0],[4,2],[0,4],[2,4],[4,0]].map(([bx,by],i)=>{
        const col=ISO3+'99';
        return <IsoTile key={i} x={bx} y={by} z={0} w={1} h={1} d={0.4+i*0.25} top={col} left={ISO1+'99'} right={ISO1+'66'} ox={280+i*80} oy={700} opacity={interpolate(l,[40+i*8,80+i*8],[0,1],clamp)}/>;
      })}
    </svg>
    <Stage>
      <Kicker p={k}>NEW · EDUCATION HUB</Kicker>
      <Head p={h}>Short lessons.<br/><span style={{color:ISOHI}}>Plain English.</span></Head>
      <Card p={p} dark>
        <div style={{color:ISOHI,font:'800 14px Arial',letterSpacing:'.16em'}}>LEARNING HUB</div>
        <div style={{marginTop:14,color:'#fff',font:'800 38px Arial'}}>Choose a topic. Learn in minutes.</div>
        <div style={{marginTop:18,display:'flex',gap:10,flexWrap:'wrap'}}>
          {['Basics','Charts & price action','Fundamentals','Strategy'].map((t,i)=><div key={t} style={{padding:'9px 16px',borderRadius:999,border:'1px solid rgba(183,243,75,.35)',background:'rgba(183,243,75,.10)',color:ISOHI,font:'800 17px Arial'}}>{t}</div>)}
        </div>
      </Card>
    </Stage>
  </>;
};

/* ===== library ===== */
const Library:React.FC<{l:number}>=({l})=>{
  const k=interpolate(l,[4,28],[0,1],clamp),h=interpolate(l,[10,44],[0,1],{...clamp,easing:out});
  const items=[['What is forex?','5 min'],['Pips, lots and leverage','6 min'],['Risk management 101','8 min'],['Reading candlesticks','7 min']];
  return <><IsoBg l={l}/>
    <svg width={1080} height={1920} style={{position:'absolute'}}>
      {/* isometric stacked plates */}
      {items.map((_,i)=>{
        const ox=120+i*230;
        const h2=0.6+i*0.35;
        return <IsoTile key={i} x={0} y={0} z={0} w={2} h={2} d={h2} top={ISO3+'bb'} left={ISO1+'cc'} right={ISO2+'88'} ox={ox} oy={900+i*60}/>;
      })}
    </svg>
    <Stage>
      <Kicker p={k}>LESSON LIBRARY</Kicker>
      <Head p={h} size={70}>Start where<br/><span style={{color:ISOHI}}>you are.</span></Head>
      <div style={{marginTop:44,display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {items.map((it,i)=>{const q=interpolate(l,[32+i*14,66+i*14],[0,1],{...clamp,easing:out});return(
          <div key={it[0]} style={{padding:22,borderRadius:22,background:'rgba(9,40,76,.90)',border:'1px solid #173b5e',boxShadow:'0 18px 40px rgba(0,0,0,.45)',opacity:q,transform:`translateY(${(1-q)*24}px)`}}>
            <div style={{color:ISOHI,font:'800 12px Arial',letterSpacing:'.14em'}}>LESSON</div>
            <div style={{marginTop:14,color:'#fff',font:'800 26px/1.15 Arial'}}>{it[0]}</div>
            <div style={{marginTop:16,color:'#7ab8d4',font:'700 17px Arial'}}>{it[1]} →</div>
          </div>
        )})}
      </div>
    </Stage>
  </>;
};

/* ===== practice ===== */
const Practice:React.FC<{l:number}>=({l})=>{
  const k=interpolate(l,[4,28],[0,1],clamp),h=interpolate(l,[10,44],[0,1],{...clamp,easing:out}),p=interpolate(l,[32,78],[0,1],{...clamp,easing:out});
  const games=['Read a candle','Count pips','Size position','Match terms','Session times','R:R ratio','Spot a zone'];
  return <><IsoBg l={l}/>
    <svg width={1080} height={1920} style={{position:'absolute'}}>
      {/* isometric game dice/cubes */}
      {games.map((_,i)=>{
        const ox=80+i*138;
        const bh=0.6+0.3*(i%3);
        const tilt=Math.sin(l*0.015+i*0.8)*5;
        return <g key={i} transform={`rotate(${tilt} ${ox} 1200)`}>
          <IsoTile x={0} y={0} z={0} w={0.8} h={0.8} d={bh} top={ISOHI+'cc'} left={ISO1+'99'} right={ISO2+'66'} ox={ox} oy={1200} opacity={interpolate(l,[46+i*10,76+i*10],[0,1],clamp)}/>
        </g>;
      })}
    </svg>
    <Stage>
      <Kicker p={k}>PRACTICE GAMES</Kicker>
      <Head p={h} size={70}>Seven games.<br/><span style={{color:ISOHI}}>Two minutes each.</span></Head>
      <div style={{display:'flex',flexWrap:'wrap',gap:12,marginTop:48}}>
        {games.map((g,i)=>{const q=interpolate(l,[36+i*12,66+i*12],[0,1],{...clamp,easing:out});return(
          <div key={g} style={{padding:'15px 20px',borderRadius:999,background:'rgba(13,42,69,.80)',border:'1px solid rgba(22,133,207,.45)',color:'#fff',font:'800 20px Arial',opacity:q,transform:`scale(${0.92+0.08*q}) translateY(${(1-q)*18}px)`}}>{g}</div>
        )})}
      </div>
      <Sub p={p}>Learn by doing, not by watching someone else do it.</Sub>
    </Stage>
  </>;
};

/* ===== process ===== */
const Process:React.FC<{l:number}>=({l})=>{
  const k=interpolate(l,[4,28],[0,1],clamp),h=interpolate(l,[10,44],[0,1],{...clamp,easing:out});
  const rows=[['01','Learn the context'],['02','Review structured setups'],['03','Manage risk first'],['04','Keep decisions yours']];
  return <><IsoBg l={l}/>
    <svg width={1080} height={1920} style={{position:'absolute'}}>
      {/* isometric staircase */}
      {rows.map((_,i)=>{
        const ox=120,oy=520+i*180;
        const bh=0.5+i*0.4;
        return <IsoTile key={i} x={0} y={0} z={0} w={3} h={1.2} d={bh} top={ISO3+'bb'} left={ISO1+'cc'} right={ISO2+'88'} ox={ox} oy={oy} opacity={interpolate(l,[34+i*16,68+i*16],[0,1],{...clamp,easing:out})}/>;
      })}
      {/* connecting path */}
      {rows.slice(0,-1).map((_,i)=>{
        const x1=540,y1=520+i*180+80,x2=540,y2=520+(i+1)*180-80;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ISOHI} strokeWidth={2} strokeDasharray="8 6" opacity={0.5}/>;
      })}
    </svg>
    <Stage>
      <Kicker p={k}>A CLEARER PROCESS</Kicker>
      <Head p={h} size={70}>A path that<br/><span style={{color:ISOHI}}>makes sense.</span></Head>
      <div style={{marginTop:42,display:'flex',flexDirection:'column',gap:12}}>
        {rows.map((r,i)=>{const q=interpolate(l,[34+i*16,68+i*16],[0,1],{...clamp,easing:out});return(
          <div key={r[0]} style={{display:'flex',alignItems:'center',gap:18,padding:'18px 22px',borderRadius:20,background:'rgba(9,40,76,.88)',border:'1px solid #173b5e',boxShadow:'0 14px 34px rgba(0,0,0,.4)',opacity:q,transform:`translateX(${(1-q)*28}px)`}}>
            <div style={{width:52,height:52,borderRadius:999,display:'grid',placeItems:'center',background:'rgba(183,243,75,.14)',border:'1px solid rgba(183,243,75,.4)',color:ISOHI,font:'900 17px Arial'}}>{r[0]}</div>
            <div style={{font:'800 26px Arial',color:'#fff'}}>{r[1]}</div>
          </div>
        )})}
      </div>
    </Stage>
  </>;
};

/* ===== tools ===== */
const Tools:React.FC<{l:number}>=({l})=>{
  const k=interpolate(l,[4,28],[0,1],clamp),h=interpolate(l,[10,44],[0,1],{...clamp,easing:out}),p=interpolate(l,[34,78],[0,1],{...clamp,easing:out});
  const tools=[['EDUCATION','Build the foundation'],['SETUPS','See risk levels clearly'],['CHARTS','Read market structure'],['TOOLKIT','Plan before acting']];
  return <><IsoBg l={l}/>
    <svg width={1080} height={1920} style={{position:'absolute'}}>
      {/* isometric layered blocks */}
      {tools.map((_,i)=>{
        const ox=100+i*240;
        const bh=0.4+i*0.3;
        return <IsoTile key={i} x={0} y={0} z={0} w={2.5} h={1.5} d={bh} top={ISOHI+'cc'} left={ISO1+'99'} right={ISO1+'66'} ox={ox} oy={1050} opacity={interpolate(l,[46+i*12,76+i*12],[0,1],clamp)}/>;
      })}
    </svg>
    <Stage>
      <Kicker p={k}>ONE MEMBER AREA</Kicker>
      <Head p={h} size={70}>Learn. Review.<br/><span style={{color:ISOHI}}>Check the risk.</span></Head>
      <Card p={p} dark>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
          {tools.map((t,i)=><div key={t[0]} style={{padding:20,borderRadius:18,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.10)'}}>
            <div style={{color:ISOHI,font:'800 12px Arial',letterSpacing:'.15em'}}>{t[0]}</div>
            <div style={{marginTop:10,color:'#fff',font:'800 23px Arial'}}>{t[1]}</div>
          </div>)}
        </div>
      </Card>
    </Stage>
  </>;
};

/* ===== plans ===== */
const Plans:React.FC<{l:number}>=({l})=>{
  const k=interpolate(l,[4,28],[0,1],clamp),h=interpolate(l,[10,44],[0,1],{...clamp,easing:out});
  const plans=[['Free','$0','3 signals daily'],['Pro','$20','10 signals daily'],['Max','$50','Unlimited access']];
  return <><IsoBg l={l}/>
    <svg width={1080} height={1920} style={{position:'absolute'}}>
      {/* isometric towers */}
      {plans.map((_,i)=>{
        const bh=1.0+i*1.2;
        const ox=180+i*300;
        return <IsoTile key={i} x={0} y={0} z={0} w={2.2} h={2.2} d={bh}
          top={i===0?ISO1+'cc':i===1?ISOHI+'cc':ISO3+'cc'}
          left={i===0?ISO1+'99':i===1?ISOHI+'99':ISO3+'99'}
          right={i===0?ISO1+'66':i===1?ISOHI+'66':ISO3+'66'}
          ox={ox} oy={1100} opacity={interpolate(l,[34+i*18,70+i*18],[0,1],{...clamp,easing:out})}/>;
      })}
    </svg>
    <Stage>
      <Kicker p={k}>MEMBERSHIP</Kicker>
      <Head p={h} size={70}>Start free.<br/><span style={{color:ISOHI}}>Upgrade when ready.</span></Head>
      <div style={{marginTop:44,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
        {plans.map((pl,i)=>{const q=interpolate(l,[34+i*18,70+i*18],[0,1],{...clamp,easing:out});return(
          <div key={pl[0]} style={{minHeight:240,padding:24,borderRadius:22,background:'rgba(9,40,76,.88)',border:`2px solid ${i===0?'#0d2a45':i===1?'rgba(183,243,75,.4)':'#173b5e'}`,boxShadow:'0 18px 40px rgba(0,0,0,.45)',opacity:q,transform:`translateY(${(1-q)*28}px)`}}>
            <div style={{font:'800 22px Arial',color:i===1?ISOHI:'#fff'}}>{pl[0]}</div>
            <div style={{marginTop:18,font:'800 48px Arial',letterSpacing:'-.04em',color:i===1?ISOHI:'#cfe1f2'}}>{pl[1]}</div>
            <div style={{marginTop:16,font:'600 17px/1.45 Arial',color:'#7ab8d4'}}>{pl[2]}</div>
          </div>
        )})}
      </div>
    </Stage>
  </>;
};

/* ===== outro ===== */
const Outro:React.FC<{l:number}>=({l})=>{
  const a=interpolate(l,[4,36],[0,1],{...clamp,easing:out}),b=interpolate(l,[22,62],[0,1],{...clamp,easing:out}),c=interpolate(l,[58,104],[0,1],clamp);
  return <AbsoluteFill style={{justifyContent:'center',alignItems:'center'}}>
    <svg width={1080} height={1920} style={{position:'absolute'}}>
      <IsoBg l={l}/>
      {/* big iso platform */}
      <IsoTile x={-6} y={-6} z={0} w={12} h={12} d={0.5} top={ISO2+'33'} left={ISO1+'22'} right={ISO1+'11'} ox={540} oy={960} opacity={0.7}/>
      {/* floating cubes in ring */}
      {Array.from({length:8}).map((_,i)=>{
        const a2=(i/8)*Math.PI*2+l*0.01;
        const r=260;
        const bx=540+Math.cos(a2)*r;
        const by=860+Math.sin(a2)*r*0.5;
        const s=0.4+0.2*Math.sin(l*0.02+i);
        return <IsoTile key={i} x={0} y={0} z={0} w={s} h={s} d={s} top={ISOHI+'cc'} left={ISO1+'99'} right={ISO1+'66'} ox={bx} oy={by}/>;
      })}
    </svg>
    <div style={{position:'relative',width:920,textAlign:'center'}}>
      <div style={{font:'800 88px/1.04 Arial',letterSpacing:'-.055em',color:'#fff',opacity:a}}>Learn first.</div>
      <div style={{font:'800 88px/1.04 Arial',letterSpacing:'-.055em',color:ISOHI,opacity:b}}>Then decide.</div>
      <div style={{marginTop:30,opacity:c}}>
        <div style={{display:'inline-flex',padding:'18px 36px',borderRadius:999,background:ISOHI,color:INK,font:'900 24px Arial'}}>Start free →</div>
        <Img src={staticFile('logo-mark.png')} style={{width:84,height:84,objectFit:'contain',display:'block',margin:'34px auto 14px'}}/>
        <div style={{font:'900 29px Arial',letterSpacing:'.08em',color:'#fff'}}>@TRADERWATCH</div>
        <div style={{marginTop:18,font:'500 17px/1.5 Arial',color:'#7ab8d4'}}>Educational information only.<br/>Trading is risky; no outcome is guaranteed.</div>
      </div>
    </div>
  </AbsoluteFill>;
};

const op=(f:number,i:number)=>{const s=i*SCENE,e=s+SCENE;if(i===0)return interpolate(f,[e-16,e],[1,0],clamp);return Math.min(interpolate(f,[s,s+16],[0,1],clamp),interpolate(f,[e-16,e],[1,0],clamp));};
const SECTIONS=['INTRO','EDUCATION','LIBRARY','PRACTICE','PROCESS','TOOLS','PLANS','OUTRO'];

export const IsoPromo:React.FC=()=>{
  const f=useCurrentFrame(),idx=Math.min(COUNT-1,Math.floor(f/SCENE)),l=f-idx*SCENE;
  return <AbsoluteFill style={{overflow:'hidden',background:ISOBG}}>
    {idx===0&&<AbsoluteFill style={{opacity:op(f,0)}}><Cover l={l}/></AbsoluteFill>}
    {idx===1&&<AbsoluteFill style={{opacity:op(f,1)}}><Hub l={l}/></AbsoluteFill>}
    {idx===2&&<AbsoluteFill style={{opacity:op(f,2)}}><Library l={l}/></AbsoluteFill>}
    {idx===3&&<AbsoluteFill style={{opacity:op(f,3)}}><Practice l={l}/></AbsoluteFill>}
    {idx===4&&<AbsoluteFill style={{opacity:op(f,4)}}><Process l={l}/></AbsoluteFill>}
    {idx===5&&<AbsoluteFill style={{opacity:op(f,5)}}><Tools l={l}/></AbsoluteFill>}
    {idx===6&&<AbsoluteFill style={{opacity:op(f,6)}}><Plans l={l}/></AbsoluteFill>}
    {idx===7&&<AbsoluteFill style={{opacity:op(f,7)}}><Outro l={l}/></AbsoluteFill>}
    <Dots index={idx}/>
    <div style={{position:'absolute',bottom:0,left:0,right:0,height:6,background:'rgba(255,255,255,.10)'}}>
      <div style={{height:'100%',width:`${f/PROMO_ISO_FRAMES*100}%`,background:`linear-gradient(90deg,${ISO2},${ISOHI})`}}/>
    </div>
  </AbsoluteFill>;
};
