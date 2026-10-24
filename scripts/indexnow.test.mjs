import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPayload,notify,waitForPublication} from './notify-indexnow.mjs';
const key='a'.repeat(32),config={host:'saververify.com',keyFile:key+'.txt',entries:[{files:['index.html'],url:'https://saververify.com/'},{files:['guide/index.html','guide/style.css'],url:'https://saververify.com/guide/'}]};
test('notification is limited to the owned host and changed public documents',()=>{
 assert.equal(buildPayload(config,key,['README.md']).urlList.length,0);
 assert.deepEqual(buildPayload(config,key,['guide/style.css']).urlList,['https://saververify.com/guide/']);
 assert.throws(()=>buildPayload({...config,entries:[{files:[],url:'https://external.example/'}]},key));
 assert.throws(()=>buildPayload({...config,host:'api.saververify.com'},key));
});
test('failed ownership verification never sends a notification',async()=>{
 const calls=[];await assert.rejects(()=>notify(buildPayload(config,key),async(url,options)=>{calls.push({url,options});return new Response('different-key',{status:200});}));
 assert.equal(calls.length,1);assert.equal(calls[0].options.redirect,'error');
});
test('successful ownership permits exactly one POST and does not claim indexing',async()=>{
 for(const status of [200,202]){
  const calls=[];const result=await notify(buildPayload(config,key),async(url,options)=>{calls.push({url,options});return new Response(calls.length===1?key:'',{status:calls.length===1?200:status});});
  assert.equal(calls.length,2);assert.equal(calls[1].url,'https://api.indexnow.org/indexnow');assert.equal(calls[1].options.method,'POST');assert.equal(JSON.parse(calls[1].options.body).urlList.length,2);assert.equal(result.indexingGuaranteed,false);
 }
});
test('no changed public URLs produces no network traffic',async()=>{
 const result=await notify(buildPayload(config,key,[]),()=>{throw Error('Unexpected network');});assert.equal(result.submitted,0);
});
test('notification waits for the actual changed document rather than merely a live site',async()=>{
 const checks=[{url:'https://saververify.com/guide/',content:'new guide'}];
 await assert.rejects(()=>waitForPublication(checks,async()=>new Response('old guide'),1));
 await waitForPublication(checks,async()=>new Response('new guide\n'),1);
});
