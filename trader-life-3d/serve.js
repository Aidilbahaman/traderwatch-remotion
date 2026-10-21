// Minimal static server so the ES-module importmap works (file:// blocks CORS).
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=__dirname;
const PORT=Number(process.env.PORT||8920);
const MIME={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript',
            '.json':'application/json','.png':'image/png','.jpg':'image/jpeg',
            '.mp3':'audio/mpeg','.bin':'application/octet-stream'};
http.createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split('?')[0]);
  if(p==='/') p='/index.html';
  const f=path.join(ROOT,p);
  if(!f.startsWith(ROOT)){res.writeHead(403);return res.end('no');}
  fs.readFile(f,(e,buf)=>{
    if(e){res.writeHead(404);return res.end('404');}
    res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream',
                       'Cache-Control':'no-store'});
    res.end(buf);
  });
}).listen(PORT,()=>console.log('serving '+ROOT+' on '+PORT));
