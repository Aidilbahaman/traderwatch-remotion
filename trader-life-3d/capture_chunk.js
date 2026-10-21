const fs=require('fs'),path=require('path');
const puppeteer=require('puppeteer-core');
const ROOT=__dirname;
const CHROME=process.env.CHROME||'/home/ubuntu/.cache/hyperframes/chrome/chrome-headless-shell/linux-152.0.7977.30/chrome-headless-shell-linux64/chrome-headless-shell';
const FPS=Number(process.env.FPS||30),W=1080,H=1920,DURATION=68;

async function main(){
 const ci=Number(process.argv[2]||0), chunks=Number(process.argv[3]||8);
 const N=Math.round(DURATION*FPS), start=Math.floor(ci*N/chunks), end=Math.floor((ci+1)*N/chunks);
 const dir=path.join(ROOT,'chunks',String(ci).padStart(2,'0'));fs.mkdirSync(dir,{recursive:true});
 const browser=await puppeteer.launch({headless:true,executablePath:CHROME,
   args:['--no-sandbox','--disable-dev-shm-usage','--hide-scrollbars',
         '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader',
         '--disable-gpu-sandbox'],
   protocolTimeout:600000});
 const page=await browser.newPage();
 page.on('pageerror',e=>console.log('PAGEERR:',e.message));
 await page.setViewport({width:W,height:H,deviceScaleFactor:1});
 await page.goto('http://localhost:8920/index.html',{waitUntil:'networkidle0',timeout:120000});
 await page.waitForFunction('window.__ready===true',{timeout:60000});
 const cdp=await page.createCDPSession();
 for(let n=start;n<end;n++){
   await page.evaluate(s=>window.seek(s),n/FPS);
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const shot=await cdp.send('Page.captureScreenshot',{format:'jpeg',quality:94,fromSurface:true,captureBeyondViewport:false});
   fs.writeFileSync(path.join(dir,String(n).padStart(5,'0')+'.jpg'),Buffer.from(shot.data,'base64'));
 }
 await cdp.detach();await browser.close();console.log(`CHUNK ${ci} ${start}-${end} DONE`);
}
main().catch(e=>{console.error(e);process.exit(1)});
