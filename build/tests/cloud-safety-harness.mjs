// Isolated real Store + complete V54 module. No network, production accounts or SQL.
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
const read=name=>fs.readFileSync(new URL('../../app/js/'+name+'.js',import.meta.url),'utf8');
export const clone=value=>JSON.parse(JSON.stringify(value));
export function backend(snapshot=null,version=snapshot?3:0){
  return {snapshot:clone(snapshot),version,loads:0,writes:[],commits:[],
    async load(){this.loads++;if(this.loadHook)await this.loadHook();return this.snapshot?{snap:clone(this.snapshot),version:this.version}:{error:'empty',version:0};},
    async save(token,snapshot,expected){
      const payload=clone(snapshot);this.writes.push({token,snapshot:payload,expected});
      if(this.saveHook)await this.saveHook();
      if(expected!==this.version)throw {error:'version_conflict'};
      this.snapshot=payload;this.version++;this.commits.push(clone(payload));return {ok:true,version:this.version};
    }
  };
}
export async function harness({remote=backend(),values=new Map(),uid=null}={}){
  const fault={};const localStorage={
    getItem:k=>values.get(k)??null,
    setItem:(k,v)=>{if(fault.write===k)throw Error('Injected quota failure');if(fault.silent!==k)values.set(k,String(v));},
    removeItem:k=>values.delete(k)
  };
  const window={addEventListener(){}};
  const c=vm.createContext({window,localStorage,self:{crypto:webcrypto},TextEncoder,Uint8Array,
    navigator:{onLine:true},document:{getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[]},
    VIEWS:{profile:()=>''},setInterval:()=>0,setTimeout:()=>0,clearInterval(){},console,
    toast(){},confirm:()=>true,openModal(){},closeModal(){},App:{render(){}},crypto:webcrypto,btoa,atob});
  vm.runInContext(read('data')+'\n'+read('store'),c);
  const store=vm.runInContext('Store',c);
  if(!store.me()){store.signup('Audit owner','owner@test.invalid','isolated-test-password','Csíkszereda');store.me().onboarded=true;store.save();}
  const user=store.me();uid=uid||user.id;
  store.adoptCloudUser({uid,email:user.email,name:user.name});
  window.__TT_SUPABASE_ADAPTER={name:'supabase-snapshot',
    load:()=>remote.load(),save:(...args)=>remote.save(...args),
    whoami:async()=>({uid,email:user.email,token:'test-session'}),profile:async()=>null,logout:async()=>true};
  // Expose only the private UI closures in this test VM, never in production.
  const source=read('v54').replace(/\}\)\(\);\s*$/,
    'window.testCloud={doSave:doSave,doLoad:doLoad,finishIntent:finishIntent};})();');
  vm.runInContext(source,c);
  await new Promise(resolve=>setImmediate(resolve));
  const api=window.__V54;
  Object.assign(api.st(),{uid,token:'test-session',email:user.email,provider:'supabase-snapshot'});
  return {api,ui:window.testCloud,store,remote,values,fault,c,
    snapshot:()=>clone(api.build(user.email)),local:()=>store.exportData(),
    edit:()=>{const t=store.myData().tours[0];store.updateTour(t.id,{notes:'Checked local edit'});return t;}};
}
export async function existing(){
  const h=await harness();h.store.newTourFromDraft({title:'Existing cloud tour',lengthKm:8,ascent:100});
  h.store.myData();h.store.save(); // The existing Store normalizes legacy gear on read.
  h.remote.snapshot=h.snapshot();h.remote.version=3;return h;
}
export async function restored(){const h=await existing();await h.ui.doLoad(false);return h;}
