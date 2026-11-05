/* UC11: registro de duração por aula, apenas no navegador e no relatório. */
(function(){
 'use strict';
 const match=location.pathname.match(/(?:^|\/)(aula-(?:assincrona-)?\d+)\.html$/i);
 if(!match)return;
 const lesson=match[1],key='uc11-duration-v1:'+lesson;
 let start=Number(UC11Storage.getItem(key))||0;
 const now=()=>Date.now();
 function begin(event){
  if(start)return;
  const target=event.target;
  if(!target||target.closest('header,nav,footer,.senac-institutional-bar'))return;
  if(target.closest('a[href]'))return;
  if(!target.closest('main,section,article,form,#app,.a6'))return;
  start=now();UC11Storage.setItem(key,String(start));
 }
 ['pointerdown','keydown','input','change'].forEach(type=>document.addEventListener(type,begin,{passive:true,capture:true}));
 function duration(){
  if(!start)return 'Não iniciado';
  const seconds=Math.max(0,Math.floor((now()-start)/1000));
  const h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=seconds%60;
  return (h?h+'h ':'')+m+'min '+String(s).padStart(2,'0')+'s';
 }
 function summary(){return 'Tempo decorrido desde o início da aula: '+duration()+' (registro aproximado, inclui intervalos e tempo com a página fechada).'}
 window.UC11LessonTime={duration,summary,startedAt:()=>start?new Date(start).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'}):'Não iniciado'};
 let inserted;
 window.addEventListener('beforeprint',()=>{
  if(inserted)inserted.remove();
  inserted=document.createElement('div');
  inserted.id='uc11-duration-print';
  inserted.style.cssText='display:block!important;visibility:visible!important;background:white!important;color:#172b3d!important;font:13px/1.5 Arial,sans-serif!important;border-top:1px solid #bccbd8!important;padding:12px!important;margin:15px 0!important;break-inside:avoid!important';
  inserted.textContent=summary();
  const report=document.querySelector('#print-report,#a2-report,#a3-report,#reportbody,#report,#a6-report');
  (report||document.body).appendChild(inserted);
 });
 window.addEventListener('afterprint',()=>{if(inserted){inserted.remove();inserted=null}});
})();
