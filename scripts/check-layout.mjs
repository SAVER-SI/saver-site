import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,sep,extname} from 'node:path';
import {spawn} from 'node:child_process';

const root=fileURLToPath(new URL('../',import.meta.url));
const server=createServer(async(req,res)=>{
  try {
    let path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(path.endsWith('/'))path+='index.html';
    const file=resolve(root,'.'+path);
    if(!file.startsWith(root.endsWith(sep)?root:root+sep))throw Error('Outside preview root');
    const data=await readFile(file);
    res.setHeader('content-type',({'.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.js':'text/javascript'})[extname(file)]||'text/plain');res.end(data);
  }catch{res.statusCode=404;res.end('Not found');}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const driver=spawn(process.env.CHROMEWEBDRIVER?resolve(process.env.CHROMEWEBDRIVER,'chromedriver'):'chromedriver',['--port=9515','--allowed-ips=127.0.0.1'],{stdio:'ignore'});
let session;
async function command(path,body,method='POST') {
 const response=await fetch('http://127.0.0.1:9515'+path,{method,signal:AbortSignal.timeout(25000),...(body?{headers:{'content-type':'application/json'},body:JSON.stringify(body)}:{})});
 const data=await response.json();if(data.value?.error)throw Error(data.value.error+': '+data.value.message);return data.value;
}
try {
 let ready=false;for(let i=0;i<40;i++){try{await command('/status',null,'GET');ready=true;break;}catch{await new Promise(r=>setTimeout(r,100));}}
 assert.ok(ready,'ChromeDriver unavailable');
 const created=await command('/session',{capabilities:{alwaysMatch:{browserName:'chrome',pageLoadStrategy:'eager','goog:chromeOptions':{args:['--headless=new','--no-sandbox','--disable-dev-shm-usage']}}}});session=created.sessionId;
 for(const [name,width,height] of [['desktop',1440,1100],['mobile',390,844]]) {
  await command(`/session/${session}/goog/cdp/execute`,{cmd:'Emulation.setDeviceMetricsOverride',params:{width,height,deviceScaleFactor:1,mobile:false}});
  await command(`/session/${session}/url`,{url:`http://127.0.0.1:${server.address().port}/fact-checking-api/`});
  const state=await command(`/session/${session}/execute/sync`,{script:'return {width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll("h1").length,radius:getComputedStyle(document.querySelector(".guide-panel")).borderRadius,title:document.title}',args:[]});
  assert.equal(state.width,width);assert.equal(state.overflow,false);assert.equal(state.h1,1);assert.equal(state.radius,'24px');
  console.log(JSON.stringify({viewport:name,...state}));
  const shot=await command(`/session/${session}/goog/cdp/execute`,{cmd:'Page.captureScreenshot',params:{format:'jpeg',quality:45,captureBeyondViewport:false}});
  console.log('LAYOUT_PREVIEW_'+name+'='+shot.data);
 }
}finally {
 if(session)await command('/session/'+session,null,'DELETE').catch(()=>{});
 driver.kill();await new Promise(r=>server.close(r));
}
