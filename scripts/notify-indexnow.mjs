import {readFile,appendFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

export function buildPayload(config, key, changedFiles = null) {
  if(config.host !== 'saververify.com' || !/^[a-f0-9]{32}$/.test(key) || config.keyFile !== key+'.txt') throw Error('Invalid ownership configuration.');
  const entries=config.entries.filter(x=>changedFiles===null || x.files.some(f=>changedFiles.includes(f)));
  const urlList=[...new Set(entries.map(x=>x.url))];
  if(urlList.some(value=>{const u=new URL(value);return u.origin!=='https://saververify.com'||u.username||u.password||u.search||u.hash;})) throw Error('Only canonical public SAVER URLs may be submitted.');
  return {host:config.host,key,keyLocation:'https://saververify.com/'+config.keyFile,urlList};
}

export async function notify(payload, fetchImpl = fetch) {
  if(!payload.urlList.length) return {state:'no_changed_urls',submitted:0};
  const ownership=await fetchImpl(payload.keyLocation,{redirect:'error',signal:AbortSignal.timeout(20000)});
  if(ownership.status!==200 || (await ownership.text()).trim()!==payload.key) throw Error('Published ownership file not verified; nothing submitted.');
  const response=await fetchImpl('https://api.indexnow.org/indexnow',{method:'POST',headers:{'content-type':'application/json; charset=utf-8'},body:JSON.stringify(payload),redirect:'error',signal:AbortSignal.timeout(20000)});
  if(![200,202].includes(response.status)) throw Error('IndexNow did not accept notification: HTTP '+response.status);
  return {state:response.status===200?'received':'received_pending_key_verification',httpStatus:response.status,submitted:payload.urlList.length,urls:payload.urlList,indexingGuaranteed:false};
}

export async function waitForPublication(checks, fetchImpl = fetch, attempts = 6) {
  for(let i=0;i<attempts;i++) {
    const matches=await Promise.all(checks.map(async ({url,content})=>{
      try {const r=await fetchImpl(url,{redirect:'error',signal:AbortSignal.timeout(10000)});return r.status===200&&(await r.text()).trimEnd()===content.trimEnd();}catch{return false;}
    }));
    if(matches.every(Boolean))return;
    if(i+1<attempts)await new Promise(resolve=>setTimeout(resolve,5000));
  }
  throw Error('Changed documents are not published yet; nothing submitted.');
}

async function main(args) {
  const root=new URL('../',import.meta.url);
  const config=JSON.parse(await readFile(new URL('indexnow.json',root),'utf8'));
  const key=(await readFile(new URL(config.keyFile,root),'utf8')).trim();
  const changed=args.includes('--changed-only')?execFileSync('git',['diff','--name-only','HEAD^','HEAD'],{encoding:'utf8'}).trim().split('\n'):null;
  const payload=buildPayload(config,key,changed);
  if(!args.includes('--execute')) {console.log(JSON.stringify({state:'dry_run',submitted:0,urls:payload.urlList}));return;}
  if(args.includes('--wait-published')&&payload.urlList.length) {
    const checks=[];
    for(const entry of config.entries.filter(x=>payload.urlList.includes(x.url)))for(const file of entry.files.filter(x=>changed===null||changed.includes(x))) {
      checks.push({url:file.endsWith('index.html')?entry.url:'https://saververify.com/'+file,content:await readFile(new URL(file,root),'utf8')});
    }
    await waitForPublication(checks);
  }
  const result=await notify(payload);
  console.log(JSON.stringify(result));
  if(process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY,`IndexNow: ${result.state}; ${result.submitted} URLs submitted. This is not proof of indexing or ranking.\n`);
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)main(process.argv.slice(2)).catch(async error=>{
  console.error(error.message);
  if(process.env.GITHUB_STEP_SUMMARY)await appendFile(process.env.GITHUB_STEP_SUMMARY,'IndexNow notification failed; site deployment is unaffected. Inspect the step log.\n');
  process.exitCode=1;
});
