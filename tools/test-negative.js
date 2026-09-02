/* Comprueba que las verificaciones rechazan respuestas incorrectas. */
const fs=require('fs'),path=require('path'),vm=require('vm'),initSqlJs=require('sql.js');
const root=path.join(__dirname,'..');const read=f=>fs.readFileSync(path.join(root,f),'utf8');
(async()=>{
const SQL=await initSqlJs({locateFile:f=>path.join(root,'public/assets/vendor',f)});
  const sb={console,initSqlJs:()=>Promise.resolve(SQL),localStorage:{getItem:()=>null,setItem(){}},document:{documentElement:{setAttribute(){}},dispatchEvent(){}}};sb.window=sb;vm.createContext(sb);
['public/data/datasets.js','public/assets/js/i18n.js','public/assets/js/registry.js','public/assets/js/engine.js','public/assets/js/checker.js'].forEach(f=>vm.runInContext(read(f),sb,{filename:f}));
  await sb.Engine.ready();
fs.readdirSync(path.join(root,'public/data/lessons')).sort().forEach(f=>vm.runInContext(read('public/data/lessons/'+f),sb,{filename:f}));
fs.readdirSync(path.join(root,'public/data/i18n')).sort().forEach(f=>vm.runInContext(read('public/data/i18n/'+f),sb,{filename:f}));
  const {CURSO,Engine,Checker}=sb;
  let checked=0, falsePositives=0;
  for(const lesson of CURSO.ordered()){
    const ex=lesson.exercise; if(!ex) continue;
    if(ex.type==='quiz') continue;
    for(let i=0;i<ex.tasks.length;i++){
      const task=ex.tasks[i];
      // base limpia por tarea: aplica las soluciones anteriores
      const db=Engine.create(ex.dataset);
      if(ex.preload) Object.values(ex.preload).forEach(s=>db.run(s));
      for(let k=0;k<i;k++){
        try{ db.run(ex.tasks[k].solution); }catch(e){}
        const pva=ex.tasks[k].postValidateAction;
        if(pva&&pva.runActionOnce){ try{db.run(pva.runActionOnce);}catch(e){} }
      }
      const bogus='SELECT 1 AS respuesta_incorrecta;';
      let userRes={columns:[],values:[]};
      try{ userRes=Engine.query(db,bogus); }catch(e){}
      const verdict=Checker.verify(task,{db,userRes,task,userSql:bogus});
      checked++;
      if(verdict.ok){
        console.log(`⚠ ${lesson.slug} · tarea ${i+1}: acepta una respuesta vacía/incorrecta`);
        falsePositives++;
      }
      db.close();
    }
  }
  console.log(`\n${checked} tareas comprobadas · ${falsePositives} aceptan respuestas incorrectas`);
})();
