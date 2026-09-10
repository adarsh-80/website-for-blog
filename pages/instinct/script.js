const sections=[...document.querySelectorAll('main section[data-title]')];
const drawer=document.getElementById('indexDrawer'), shade=document.getElementById('drawerShade'), indexBtn=document.getElementById('indexBtn'), closeDrawer=document.getElementById('closeDrawer');
const toc=document.getElementById('tocList'), searchInput=document.getElementById('searchInput'), searchStatus=document.getElementById('searchStatus');
const progressBar=document.getElementById('progressBar');
function openDrawer(){drawer.classList.add('open');shade.classList.add('open');drawer.setAttribute('aria-hidden','false');setTimeout(()=>searchInput.focus(),180)}
function close(){drawer.classList.remove('open');shade.classList.remove('open');drawer.setAttribute('aria-hidden','true')}
indexBtn.addEventListener('click',openDrawer);closeDrawer.addEventListener('click',close);shade.addEventListener('click',close);document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
sections.forEach((sec,i)=>{const a=document.createElement('a');a.href='#'+sec.id;a.dataset.text=(sec.dataset.title+' '+sec.textContent).toLowerCase();a.innerHTML=`<span>${String(i+1).padStart(2,'0')}</span><b>${sec.dataset.title}</b>`;a.addEventListener('click',close);toc.appendChild(a)});
searchInput.addEventListener('input',()=>{const q=searchInput.value.trim().toLowerCase();let shown=0;toc.querySelectorAll('a').forEach(a=>{const yes=!q||a.dataset.text.includes(q);a.classList.toggle('hidden',!yes);if(yes)shown++});searchStatus.textContent=q?`${shown} matching sections`:''});
window.addEventListener('scroll',()=>{const doc=document.documentElement;const max=doc.scrollHeight-window.innerHeight;progressBar.style.width=(max>0?(window.scrollY/max)*100:0)+'%'});

// Active section highlighting in the index.
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){toc.querySelectorAll('a').forEach(a=>a.removeAttribute('aria-current'));const a=toc.querySelector(`a[href="#${entry.target.id}"]`);if(a)a.setAttribute('aria-current','true')}}),{rootMargin:'-25% 0px -60% 0px',threshold:0});sections.forEach(s=>observer.observe(s));

// Fear demonstration from the research report concept.
const fearSlider=document.getElementById('fearSlider'), fearValue=document.getElementById('fearValue'), fearLine=document.getElementById('fearLine'), fearText=document.getElementById('fearText');
function updateFear(){const v=Number(fearSlider.value);fearValue.textContent=v+'%';fearLine.style.transform=`translateY(-50%) scaleX(${0.18+v/125})`;fearLine.style.opacity=.35+v/150;fearText.textContent=v<30?'At low intensity, the agent can approach the cue with relatively little defensive bias.':v<70?'At medium intensity, the agent rapidly biases away from the threat but retains room for contextual control.':'At high intensity, the defensive system strongly dominates action selection; context has less opportunity to redirect the first response.'}fearSlider.addEventListener('input',updateFear);updateFear();

// Simple artificial-instinct visualizer: not a scientific simulation, but an interactive rendering of the report's proposed idea.
const is=document.getElementById('instinctSlider'),ls=document.getElementById('learningSlider'),iw=document.getElementById('instinctWeight'),lw=document.getElementById('learningWeight'),readout=document.getElementById('aiReadout'),dot=document.getElementById('agentDot'),score=document.getElementById('agentScore'),run=document.getElementById('runAgent');
function updateAI(){const a=Number(is.value),l=Number(ls.value);iw.textContent=a+'%';lw.textContent=l+'%';if(a>l+20)readout.textContent='The agent is strongly biased toward its built-in danger heuristic. It avoids the predator earlier, even before much learning.';else if(l>a+20)readout.textContent='Learning dominates. The agent is more willing to explore and revise its behaviour from experience.';else readout.textContent='At roughly equal weights, the agent balances inherited danger avoidance with experience-based adaptation.';dot.style.left=(25+a*.45)+'%';dot.style.top=(70-l*.38)+'%';score.textContent='SURVIVAL '+Math.round(50+a*.28+l*.22)}is.addEventListener('input',updateAI);ls.addEventListener('input',updateAI);run.addEventListener('click',()=>{run.textContent='RUNNING…';dot.animate([{transform:'translate(-50%,-50%) scale(1)'},{transform:'translate(-50%,-50%) scale(1.7)'},{transform:'translate(-50%,-50%) scale(1)'}],{duration:700,iterations:3});setTimeout(()=>run.textContent='RUN AGENT',2100)});updateAI();

// Search button focuses the index search.
document.getElementById('searchBtn').addEventListener('click',()=>{openDrawer();searchInput.focus()});
