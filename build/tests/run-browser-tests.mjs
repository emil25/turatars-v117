import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const browserPath=process.env.TT_EDGE_PATH||chromium.executablePath();
assert.ok(fs.existsSync(browserPath),'Browser gate requires Chromium: install it before running the tests');
const playwrightPath=fileURLToPath(import.meta.resolve('playwright'));
const env={...process.env,TT_PLAYWRIGHT_PATH:playwrightPath,TT_EDGE_PATH:browserPath,
  V130_PLAYWRIGHT_PATH:playwrightPath,V130_EDGE_PATH:browserPath,V120_PLAYWRIGHT_PATH:playwrightPath,V120_EDGE_PATH:browserPath};
const base=process.env.TT_PREVIEW_URL||'http://127.0.0.1:4175/';
env.TT_PREVIEW_URL=base;
let preview;
const run=file=>new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,[path.join(root,'tests',file)],{cwd:root,env,stdio:'inherit',windowsHide:true});
  const timer=setTimeout(()=>{child.kill();reject(Error(file+' timed out'));},180000);
  child.on('error',e=>{clearTimeout(timer);reject(e);});
  child.on('exit',code=>{clearTimeout(timer);code===0?resolve():reject(Error(file+' failed: '+code));});
});
try{
  if(!process.env.TT_PREVIEW_URL){
    preview=spawn(process.execPath,[path.join(root,'node_modules/vite/bin/vite.js'),'preview','--host','127.0.0.1','--port','4175','--strictPort'],{cwd:root,env,stdio:'inherit',windowsHide:true});
    preview.on('error',e=>console.error(e));
    let ready=false;
    for(let n=0;n<100;n++){
      if(preview.exitCode!=null)throw Error('Preview server failed: '+preview.exitCode);
      try{ready=(await fetch(base)).ok;}catch{}
      if(ready)break;
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    assert.ok(ready,'Preview did not start');
  }
  for(const file of ['home-browser.test.mjs','navigation-browser.test.mjs','catalog-browser.test.mjs',
    'design-browser.test.mjs','event-browser.test.mjs','tour-center-browser.test.mjs','v130-browser.test.mjs'])await run(file);
  console.log('BROWSER RELEASE GATE: PASS (7 suites; desktop + mobile + GPS)');
}finally{if(preview)preview.kill();}
