(() => {
 'use strict';
 const $=s=>document.querySelector(s), all=s=>[...document.querySelectorAll(s)];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
 // Horizontal discipline rail, with keyboard, touch and explicit controls.
 const rail=$('#prog'),prev=$('#programPrev'),next=$('#programNext');
 const step=()=>rail.querySelector('.pr').getBoundingClientRect().width+20;
 const shift=n=>rail.scrollBy({left:n*step(),behavior:reduced?'instant':'smooth'});
 prev.addEventListener('click',()=>shift(-1));next.addEventListener('click',()=>shift(1));
 const controls=()=>{prev.disabled=rail.scrollLeft<2;next.disabled=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-2};
 rail.addEventListener('scroll',controls,{passive:true});addEventListener('resize',controls);controls();
 rail.addEventListener('keydown',e=>{if(e.target===rail&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();shift(e.key==='ArrowLeft'?-1:1)}});
 // Auto-advance the rail while it is on screen. Any touch, hover, wheel or
 // arrow press pauses it; it resumes after a short idle so it never fights the user.
 let autoTimer=0,idleTimer=0,paused=false;
 const onScreen=()=>{const b=rail.getBoundingClientRect();return b.bottom>innerHeight*.25&&b.top<innerHeight*.75};
 const atEnd=()=>rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-2;
 const autoStep=()=>{if(paused||document.hidden||!onScreen())return;atEnd()?rail.scrollTo({left:0,behavior:'smooth'}):shift(1)};
 const resumeIn=ms=>{clearTimeout(idleTimer);idleTimer=setTimeout(()=>{paused=false},ms)};
 const pauseAuto=()=>{paused=true;resumeIn(7000)};
 ['pointerdown','pointerenter','touchstart','focusin','wheel'].forEach(t=>rail.addEventListener(t,pauseAuto,{passive:true}));
 rail.addEventListener('pointerleave',()=>resumeIn(2500));
 [prev,next].forEach(b=>b.addEventListener('click',pauseAuto));
 if(!reduced)autoTimer=setInterval(autoStep,3800);
 // Octagonal category explorer from the supplied prototype. Not a physical floor plan.
 const NS='http://www.w3.org/2000/svg';
 const points=r=>Array.from({length:8},(_,i)=>[Math.cos(i*Math.PI/4)*r,Math.sin(i*Math.PI/4)*r]);
 const vertices=points(215),sectors=[];
 const element=(tag,attrs,parent)=>{const e=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));parent.append(e);return e};
 vertices.forEach((p,i)=>sectors.push(element('polygon',{points:`0,0 ${p} ${vertices[(i+1)%8]}`,class:'oct-sector'},$('#octSectors'))));
 [75,120,165,215].forEach(r=>element('polygon',{points:points(r).join(' '),stroke:r===215?'#e60000':'#393939'},$('#octLines')));
 const descriptions=['MMA · BJJ · Wrestling','Bags · Pads · Striking','Free weights · Racks · Machines','Treadmills · Bikes · Rowers','Battle ropes · Kettlebells · Sleds','Sauna · Recovery beds · Compression'];
 const mapping=[0,1,3,4,6,7],buttons=all('[data-zone]');
 const zonePhotos=['images/programs/mma.jpg','images/programs/boxing.jpg','images/programs/gym.jpg','images/photos/cardio.jpg','images/photos/functional.jpg','images/programs/recovery.jpg'];
 const choose=button=>{const n=+button.dataset.zone;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));sectors.forEach((s,i)=>s.classList.toggle('on',i===mapping[n]));$('#zoneLetter').textContent=String(n+1).padStart(2,'0');$('#zoneTitle').textContent=button.textContent.replace(/^\s*\d+\s*/,'');$('#zoneDetail').textContent=descriptions[n];
  // Swap the photo showing through the octagon ring: fade out, change, fade in.
  const vis=$('.oct-visual');if(vis){vis.classList.add('swap');clearTimeout(vis._t);vis._t=setTimeout(()=>{vis.style.setProperty('--zone-img','url("'+zonePhotos[n]+'")');vis.classList.remove('swap')},180)}};
 buttons.forEach(b=>{b.addEventListener('click',()=>choose(b));b.addEventListener('focus',()=>choose(b));if(fine)b.addEventListener('pointerenter',()=>choose(b))});choose(buttons[0]);
 // Live preview follows the existing calculator without generating fake credentials.
 const card=$('#memberPreview');
 const syncCard=()=>{const age=$('input[name=age]:checked').value,sport=$('input[name=sport]:checked').value;$('#memberTier').textContent=sport==='none'?'Gym only':age+' / '+(sport==='one'?'One sport':'Unlimited');$('#memberExtras').textContent=[$('#x-gym').checked&&sport!=='none'?'Gym access':'', $('#x-rec').checked?'10 recovery sessions':''].filter(Boolean).join(' · ')||'Eagles Gym / Punchbowl';$('#memberPrice').textContent=$('#rTotal').textContent+' / month'};
 new MutationObserver(syncCard).observe($('#rTotal'),{childList:true,characterData:true,subtree:true});all('#finder input').forEach(i=>i.addEventListener('change',syncCard));syncCard();
 if(fine&&!reduced){card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.transform=`perspective(900px) rotateY(${(x-.5)*14}deg) rotateX(${(.5-y)*14}deg)`;card.style.setProperty('--shine',x*100+'%')});card.addEventListener('pointerleave',()=>card.style.transform='');
 all('.hero .cta .btn').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.2}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')})}
 // Pointer-reactive particle lettering, adapted from the new prototype.
 const canvas=$('#particleWord'),ctx=canvas.getContext('2d');if(!ctx)return;
 let width=0,height=0,particles=[],visible=false,frame=0;const pointer={x:-9999,y:-9999,down:false};
 function build(){width=canvas.clientWidth;height=canvas.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);const off=document.createElement('canvas');off.width=width;off.height=height;const c=off.getContext('2d',{willReadFrequently:true});let size=Math.min(height*.8,width*.26);c.font=`700 ${size}px "Barlow Condensed",sans-serif`;size*=Math.min(1,width*.88/c.measureText('EAGLES').width);c.font=`700 ${size}px "Barlow Condensed",sans-serif`;c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';c.fillText('EAGLES',width/2,height*.45);const data=c.getImageData(0,0,width,height).data;particles=[];const gap=width<700?4:5;for(let y=0;y<height;y+=gap)for(let x=0;x<width;x+=gap)if(data[(y*width+x)*4+3]>128)particles.push({x,y,tx:x,ty:y,vx:0,vy:0,red:Math.random()>.93});paint(0)}
 function paint(time){ctx.clearRect(0,0,width,height);for(const p of particles){if(!reduced){const dx=p.x-pointer.x,dy=p.y-pointer.y,d=Math.hypot(dx,dy)||1;if(d<100){const force=(1-d/100)*(pointer.down?9:3);p.vx+=dx/d*force;p.vy+=dy/d*force}p.vx=(p.vx+(p.tx-p.x)*.045)*.84;p.vy=(p.vy+(p.ty+Math.sin(time*.001+p.tx*.012)*1.2-p.y)*.045)*.84;p.x+=p.vx;p.y+=p.vy}ctx.fillStyle=p.red||Math.hypot(p.vx,p.vy)>2?'#ff2626':'#e8e8e8';ctx.fillRect(p.x,p.y,2,2)}}
 function tick(t){frame=0;if(!visible||document.hidden||reduced)return;paint(t);frame=requestAnimationFrame(tick)}
 function start(){if(visible&&!document.hidden&&!reduced&&!frame)frame=requestAnimationFrame(tick)}
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;start()}).observe(canvas);
 canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top});canvas.addEventListener('pointerleave',()=>{pointer.x=pointer.y=-9999;pointer.down=false});canvas.addEventListener('pointerdown',()=>pointer.down=true);addEventListener('pointerup',()=>pointer.down=false);document.addEventListener('visibilitychange',start);
 let resize;addEventListener('resize',()=>{clearTimeout(resize);resize=setTimeout(build,150)});document.fonts.ready.then(()=>{build();start()});
})();
