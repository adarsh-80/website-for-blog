const cards=[...document.querySelectorAll(".system-card")];
const title=document.getElementById("featureTitle");
const text=document.getElementById("featureText");
const num=document.getElementById("slideNum");
const data=[
 ["From Ideas<br>to Interfaces","How design systems turn<br>abstract ideas into meaningful<br>experiences."],
 ["Color is<br>an atmosphere","How contrast, palette and<br>temperature shape perception."],
 ["Structure<br>creates rhythm","How grids and spacing turn<br>content into a readable system."],
 ["Small parts,<br>big systems","How reusable components make<br>interfaces consistent and clear."],
 ["Motion<br>with intention","How transitions, scroll and<br>interaction create continuity."]
];
let current=0;
function show(i){
 current=(i+5)%5;
 cards.forEach((c,n)=>c.classList.toggle("active",n===current));
 title.innerHTML=data[current][0];
 text.innerHTML=data[current][1];
 num.textContent=String(current+1).padStart(2,"0");
}
cards.forEach((c,i)=>c.addEventListener("click",()=>show(i)));
document.getElementById("prev").addEventListener("click",()=>show(current-1));
document.getElementById("next").addEventListener("click",()=>show(current+1));

const overlay=document.getElementById("searchOverlay");
const input=document.getElementById("searchInput");
document.getElementById("searchBtn").addEventListener("click",()=>{
 overlay.classList.add("open"); overlay.setAttribute("aria-hidden","false"); input.focus();
});
document.getElementById("closeSearch").addEventListener("click",()=>{
 overlay.classList.remove("open"); overlay.setAttribute("aria-hidden","true");
});
document.addEventListener("keydown",e=>{
 if(e.key==="Escape") overlay.classList.remove("open");
 if(e.key==="/" && document.activeElement!==input){e.preventDefault();overlay.classList.add("open");input.focus();}
});
document.getElementById("themeToggle").addEventListener("click",()=>{
 document.body.classList.toggle("dark");
});
document.getElementById("menuBtn").addEventListener("click",()=>{
 document.querySelector(".topnav").classList.toggle("expanded");
});
show(0);
