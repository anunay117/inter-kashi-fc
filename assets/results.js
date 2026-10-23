// Renders Inter Kashi results from ESPN's public feed; each result links to live.html?id=<match>
(function(){
const API='https://site.api.espn.com/apis/site/v2/sports/soccer/ind.1/teams/22069/schedule';
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const num=s=>parseInt(s&&s.displayValue!==undefined?s.displayValue:s,10);
function card(e){
  const c=e.competitions[0],t=c.status.type;
  const cs=c.competitors,h=cs.find(x=>x.homeAway==='home')||cs[0],a=cs.find(x=>x.homeAway==='away')||cs[1];
  const me=cs.find(x=>x.team.displayName==='Inter Kashi'),op=cs.find(x=>x!==me);
  const hs=num(h.score),as=num(a.score),ms=num(me.score),os=num(op.score);
  const r=t.state==='in'?'LIVE':(ms>os?'W':ms<os?'L':'D');
  const d=new Date(e.date).toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata',weekday:'short',day:'numeric',month:'short',year:'numeric'});
  const v=c.venue&&c.venue.fullName?c.venue.fullName:'';
  return '<a class="fx '+(r==='LIVE'?'next':r)+'" href="live.html?id='+esc(e.id)+'"><div class="d">'+d+'<small>'+esc(t.state==='in'?'In progress':t.description)+'</small></div>'+
    '<div class="t"><b>'+esc(h.team.displayName)+' '+hs+' - '+as+' '+esc(a.team.displayName)+'</b><small>'+esc(v)+' · tap for match stats</small></div><div class="k">'+r+'</div></a>';
}
window.loadResults=async function(id,season,opts){
  const el=document.getElementById(id);if(!el)return;
  try{
    const r=await fetch(API+(season?'?season='+season:'')+(season?'&':'?')+'_='+Date.now(),{cache:'no-store'});
    const d=await r.json();
    const done=(d.events||[]).filter(e=>e.competitions[0].status.type.state!=='pre').sort((a,b)=>new Date(b.date)-new Date(a.date));
    if(!done.length)return;
    el.innerHTML=done.map(card).join('');
    if(opts&&opts.summary){
      let w=0,dr=0,l=0,gf=0,ga=0;
      done.forEach(e=>{const cs=e.competitions[0].competitors,me=cs.find(x=>x.team.displayName==='Inter Kashi'),op=cs.find(x=>x!==me),m=num(me.score),o=num(op.score);gf+=m;ga+=o;m>o?w++:m<o?l++:dr++});
      const s=document.getElementById(opts.summary);if(s)s.textContent='Played '+done.length+' · W '+w+' D '+dr+' L '+l+' · GF '+gf+' GA '+ga+' · '+(w*3+dr)+' points';
    }
  }catch(e){/* keep static fallback */}
};
})();
