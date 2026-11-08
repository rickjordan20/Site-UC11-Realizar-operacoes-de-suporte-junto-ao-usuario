const aulas=[["21/10","Introdução ao Suporte Técnico e à Central de Serviços","I1"],["22/10","Identificação das Necessidades e Perfis dos Usuários","I1"],["26/10","Tipos de Chamados: Solicitações, Dúvidas, Incidentes e Problemas","I1"],["27/10","Registro, Categorização e Diagnóstico Inicial de Chamados","I1"],["29/10","Comunicação Profissional e Atendimento Humanizado","I2"],["03/11","Canais de Atendimento: E-mail, Chat, Telefone e WhatsApp","I1 · I2"],["05/11","Elaboração de Respostas e Devolutivas ao Usuário","I2"],["09/11","Simulação Prática de Atendimento e Resolução de Solicitações","I1 · I2"],["10/11","Processos de Suporte e Fluxo de Atendimento","I3"],["12/11","Triagem, Priorização e Encaminhamento de Demandas","I3"],["16/11","Escalonamento e Comunicação entre Equipes","I2 · I3"],["17/11","Simulação de Central de Serviços e Gestão de Chamados","I1 · I2 · I3"],["19/11","Fundamentos da Capacitação de Usuários","I4"],["23/11","Elaboração de Manuais, Tutoriais e Materiais de Apoio","I4"],["25/11","Planejamento e Execução de Treinamentos para Usuários","I4"],["26/11","Avaliação Final | Central de Suporte de Software","I1–I4"],["01/12","Recuperação Final e Encerramento da UC11","I1–I4"]];const remotas=[["28/10","Aula Assíncrona 1 — Identificação e classificação de chamados","I1"],["04/11","Aula Assíncrona 2 — Escrever três devolutivas ao usuário","I2"],["11/11","Atividade Remota 3 — Encaminhando Demandas para os Setores Responsáveis","I3"],["18/11","Aula Assíncrona 4 — Criar um guia de uso com pelo menos cinco etapas","I4"]];const especiais=[["02/11","Feriado — Dia de Finados"],["24/11","Projeto Integrador — Apresentação do PI"],["30/11","Data sem aula da UC11 — indicada no planejamento como feriado"]];const agenda=[...aulas.map((a,i)=>({data:a[0],titulo:'Aula '+(i+1)+' — '+a[1],tipo:'presencial',excepcional:i===7})),...remotas.map(a=>({data:a[0],titulo:a[1],tipo:'remota'})),...especiais.map(a=>({data:a[0],titulo:a[1],tipo:'especial'}))].sort((a,b)=>{const p=s=>{const[d,m]=s.split('/').map(Number);return (m===12?12: m)*100+d};return p(a.data)-p(b.data)});const calendarToday=()=>{const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));return p.year+'-'+p.month+'-'+p.day};
const calendarTodayInRange=()=>{const today=calendarToday();return today>='2026-10-01'&&today<='2026-12-31'?today:null};
let calSelected=calendarTodayInRange()||'2026-11-09',calMonth=Number(calSelected.slice(5,7))-1;
const calPad=n=>String(n).padStart(2,'0');
const calDate=day=>'2026-'+day.slice(3,5)+'-'+day.slice(0,2);
const calEvents=agenda.map(item=>({...item,iso:calDate(item.data)}));
function calendarPreview(){
 const panel=document.querySelector('#uc-cal-preview');
 const events=calEvents.filter(e=>e.iso===calSelected);
 const date=new Date(calSelected+'T12:00:00');
 const label=new Intl.DateTimeFormat('pt-BR',{day:'numeric',month:'long',year:'numeric',timeZone:'America/Sao_Paulo'}).format(date);
 if(!events.length){panel.innerHTML='<p><strong>'+label+'</strong> · Nenhuma atividade prevista para esta data.</p>';return}
 const now=brasilNow();
 panel.innerHTML='<strong>'+label+'</strong>'+events.map(e=>{
  const number=e.tipo==='presencial'?Number(e.titulo.match(/^Aula (\d+)/)?.[1]):null;
  const remoteIndex=e.tipo==='remota'?remotas.findIndex(x=>x[0]===e.data)+1:0;
  const path=number?lessonFiles[number]:remoteFiles[remoteIndex];
  const released=now>=releaseAt(e.data);
  const type=e.excepcional?'Assíncrona excepcional · aula regular':e.tipo==='presencial'?'Aula regular presencial':e.tipo==='remota'?'Atividade assíncrona prevista':'Data especial';
  const info=number?aulas[number-1][2]:remoteIndex?remotas[remoteIndex-1][2]:'';
  const summary=e.tipo==='especial'?'Data institucional prevista no calendário da UC11.':e.excepcional?'Realização individual excepcional devido a reunião interna; não integra as quatro atividades assíncronas previstas.':remoteIndex?'Atividade remota orientada para praticar o indicador '+info+'.':'Encontro de 4 horas com atividades práticas sobre '+e.titulo.replace(/^Aula \d+ — /,'')+'.';
  const status=e.tipo==='especial'?'<p class="uc-cal-status">Data do evento: '+e.data+'/2026 · Sem horário de liberação de material.</p>':released?'<p class="uc-cal-status"><strong>Data e horário de disponibilização:</strong> '+dateLabel(e.data)+'</p><p class="uc-cal-status">✓ Data de liberação alcançada'+(path?' · Material liberado.':' · Material ainda não publicado.')+'</p>':'<p class="uc-cal-status"><strong>Data e horário de disponibilização:</strong> '+dateLabel(e.data)+'</p><p class="uc-cal-status">⏳ Ainda não liberada.</p>';
  const action=e.tipo==='especial'?'':path&&released?'<a href="'+path+'">Abrir material da aula</a>':path?'<small>O acesso será habilitado no horário indicado.</small>':'<small>Sem material publicado para acesso direto.</small>';
  return '<article><small>'+type+(e.tipo==='especial'?'':' · 4h')+(info?' · '+info:'')+'</small><h4>'+e.titulo+'</h4><p>'+summary+'</p>'+status+action+'</article>'
 }).join('');
}
function renderCalendar(){
 const grid=document.querySelector('#uc-cal-grid');
 const todayButton=document.querySelector('#uc-cal-today');todayButton.disabled=!calendarTodayInRange();todayButton.textContent=calendarTodayInRange()?'Ir para hoje':'Hoje fora do período';
 document.querySelector('#uc-cal-title').textContent=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'][calMonth]+' de 2026';
 document.querySelector('#uc-cal-prev').disabled=calMonth===9;
 document.querySelector('#uc-cal-next').disabled=calMonth===11;
 const start=new Date(2026,calMonth,1).getDay(),days=new Date(2026,calMonth+1,0).getDate();
 let html=Array.from({length:start},()=>'<span aria-hidden="true"></span>').join('');
 for(let d=1;d<=days;d++){const iso='2026-'+calPad(calMonth+1)+'-'+calPad(d),events=calEvents.filter(e=>e.iso===iso),active=iso===calSelected,today=iso===calendarToday();html+='<button type="button" class="uc-calendar-day'+(events.length?' has-event':'')+(today?' is-today':'')+'" data-cal-date="'+iso+'" aria-pressed="'+active+'"'+(today?' aria-current="date"':'')+' aria-label="'+d+' de '+document.querySelector('#uc-cal-title').textContent+', '+events.length+' atividade(s)"><span>'+d+'</span><span class="uc-day-dots">'+events.map(e=>'<i class="uc-dot uc-dot-'+(e.tipo==='remota'?'remote':e.tipo==='especial'?'special':'lesson')+'"></i>').join('')+'</span></button>'}
 grid.innerHTML=html;calendarPreview();
}
document.querySelector('#uc-cal-grid').addEventListener('click',e=>{const button=e.target.closest('[data-cal-date]');if(!button)return;calSelected=button.dataset.calDate;renderCalendar()});
document.querySelector('#uc-cal-prev').addEventListener('click',()=>{if(calMonth>9){calMonth--;calSelected='2026-'+calPad(calMonth+1)+'-01';renderCalendar()}});
document.querySelector('#uc-cal-next').addEventListener('click',()=>{if(calMonth<11){calMonth++;calSelected='2026-'+calPad(calMonth+1)+'-01';renderCalendar()}});
document.querySelector('#uc-cal-today').addEventListener('click',()=>{const today=calendarTodayInRange();if(today){calSelected=today;calMonth=Number(today.slice(5,7))-1;renderCalendar()}});
// Horário oficial da turma em Brasília (UTC-3): 14h00.
// O bloqueio visual funciona no navegador; não substitui controle de acesso no servidor.
const TZ='America/Sao_Paulo';
function brasilNow(){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());const x=Object.fromEntries(parts.map(p=>[p.type,p.value]));return x.year+x.month+x.day+x.hour+x.minute}
function releaseAt(day){const [d,m]=day.split('/');return '2026'+m+d+'1400'}
function dateLabel(day){return day+'/2026 às 14h (Brasília)'}
// O horário é a única condição de liberação para aulas com arquivo publicado.
// A lista representa os arquivos efetivamente existentes no repositório.
const lessonFiles={1:"lessons/aula-01.html",2:"lessons/aula-02.html",3:"lessons/aula-03.html",4:"lessons/aula-04.html",5:"lessons/aula-05.html",6:"lessons/aula-06.html",7:"lessons/aula-07.html",8:"lessons/aula-08.html",9:"lessons/aula-09.html",10:"lessons/aula-10.html"};
function renderLessons(){
 const now=brasilNow();
 const term=(document.querySelector('#lesson-search')?.value||'').trim().toLocaleLowerCase('pt-BR');
 const matching=aulas.map((a,i)=>({a,i})).filter(({a,i})=>!term||('aula '+(i+1)+' '+a.join(' ')).toLocaleLowerCase('pt-BR').includes(term));
 document.querySelector('#lesson-count').textContent=matching.length+' de '+aulas.length+' aulas';
 document.querySelector('#lessons').innerHTML=matching.length?matching.map(({a,i})=>{
  const released=now>=releaseAt(a[0]);
  const lessonPath=lessonFiles[i+1];
  const exists=Boolean(lessonPath);
  const common='<div class="lesson-card-top"><span class="lesson-number">Aula '+String(i+1).padStart(2,'0')+'</span><time class="lesson-date" datetime="2026-'+a[0].slice(3,5)+'-'+a[0].slice(0,2)+'">'+a[0]+'/2026</time></div><h3>'+a[1]+'</h3><p class="lesson-indicator">'+a[2]+'</p>'+(i===7?'<p class="lesson-indicator">Assíncrona excepcional em 09/11 · aula regular da UC11</p>':'');
  if(released&&exists)return '<a class="lesson-card lesson-link released" href="'+lessonPath+'" aria-label="Abrir aula '+(i+1)+': '+a[1]+'">'+common+'<div class="lesson-card-bottom"><span class="lesson-status"><span class="status-dot" aria-hidden="true"></span>Disponível</span><span class="lesson-cta">Acessar aula <span aria-hidden="true">↗</span></span></div></a>';
  if(!released)return '<article class="lesson-card locked" aria-disabled="true">'+common+'<div class="lesson-card-bottom"><span class="lesson-status">Agendada · 14h</span><span class="lesson-pending">Disponível em '+a[0]+'</span></div></article>';
  return '<article class="lesson-card pending" aria-disabled="true">'+common+'<div class="lesson-card-bottom"><span class="lesson-status">Data alcançada</span><span class="lesson-pending">Material em preparação</span></div></article>';
 }).join(''):'<p class="empty-state">Nenhuma aula encontrada. Tente outra busca.</p>';
}
renderLessons();setInterval(renderLessons,60000);document.querySelector("#lesson-search").addEventListener("input",renderLessons);
const remoteDetails=[['Revise os conceitos, classifique quatro situações e registre dois casos da TechEduca e quatro do Café Central.','Atividade individual com identificação, backup JSON e relatório em PDF.'],['Analise três solicitações e escreva respostas claras, respeitosas e úteis.','Três devolutivas profissionais ao usuário.'],['Avalie quatro demandas, organize a prioridade e indique a equipe ou fluxo adequado.','Ficha de triagem e encaminhamento de quatro chamados.'],['Escolha uma funcionalidade do sistema fictício e explique como utilizá-la em linguagem acessível.','Guia de uso com no mínimo cinco etapas.']];
const remoteFiles={1:"lessons/aula-assincrona-01.html",2:"lessons/aula-assincrona-02.html",3:"lessons/aula-assincrona-03.html"};
function renderRemoteActivities(){
 const now=brasilNow();
 document.querySelector('#remote').innerHTML=remotas.map((a,i)=>{
  const released=now>=releaseAt(a[0]),remotePath=remoteFiles[i+1],exists=Boolean(remotePath);
  const availability=!released?'<p class="hint">🔒 Atividade bloqueada. Disponível automaticamente a partir de '+dateLabel(a[0])+'.</p>':exists?'<p><a class="outline-action" href="'+remotePath+'">Acessar Aula Assíncrona '+(i+1)+' →</a></p><p class="hint">Gere o PDF e anexe na atividade correspondente do Google Classroom.</p>':'<p class="hint">Data de liberação atingida, mas o material desta atividade ainda não existe no site.</p>';
  return '<details class="remote-item"><summary><time>'+a[0]+'/2026</time><strong>'+a[1]+'</strong><small>'+a[2]+' · 4h · '+(released?'Data liberada':'Bloqueada até 14h')+'</small><span aria-hidden="true">⌄</span></summary><div class="remote-detail">'+(released?'<p><strong>Desafio:</strong> '+remoteDetails[i][0]+'</p><p><strong>Evidência:</strong> '+remoteDetails[i][1]+'</p>':'<p>O conteúdo e as orientações serão exibidos após a liberação.</p>')+availability+'</div></details>';
 }).join('');
}renderRemoteActivities();setInterval(renderRemoteActivities,60000);
renderCalendar();
function updateNextEvent(){const now=brasilNow();const upcoming=agenda.filter(a=>('2026'+a.data.slice(3,5)+a.data.slice(0,2)+'1400')>=now).sort((a,b)=>a.data.slice(3,5).localeCompare(b.data.slice(3,5))||a.data.slice(0,2).localeCompare(b.data.slice(0,2)))[0];const el=document.querySelector('#next-event');if(!el)return;el.textContent=upcoming?'Próximo encontro: '+upcoming.data+'/2026 · '+upcoming.titulo:'Calendário da UC11 concluído.';}updateNextEvent();setInterval(updateNextEvent,60000);
const topButton=document.querySelector('#back-to-top');function updateTopButton(){topButton.classList.toggle('visible',window.scrollY>500)}window.addEventListener('scroll',updateTopButton,{passive:true});updateTopButton();topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
document.querySelector('#theme').addEventListener('click',()=>{document.body.classList.toggle('light');document.querySelector('#theme').textContent=document.body.classList.contains('light')?'☾':'☀'});