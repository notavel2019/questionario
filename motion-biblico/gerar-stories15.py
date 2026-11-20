import re
s=open('/home/user/questionario/motion-biblico/index.html').read()
a=s.index("const LINES=[");b=s.index("LINES.forEach(L=>{const d=document.createElement('div');d.className='t';")
lines=r'''const LINES=[
 ['T1','QUEM COLOCOU\nESSES <b>NÚMEROS</b>\nNA SUA BÍBLIA?',150,138,.05,3.2,0,-1],
 ['T2','ENTRE ELAS, AS DOS\n<b>MASSORETAS</b>',170,122,3.27,5.6,-1,1],
 ['T3','<b>STEPHEN LANGTON</b>\nCRIOU O SISTEMA\nDE <b>CAPÍTULOS</b>',150,100,5.74,10.3,1,-1],
 ['T4','FAÇA COM CUIDADO\nA PARTE QUE ESTÁ\nNAS SUAS <b>MÃOS</b>',170,126,10.46,14.2,0,1]];
'''
s=s[:a]+lines+s[b:]
a=s.index("/* ===== S1 0,3–4,4 gancho ===== */");b=s.index("/* funções puras do tempo */")
tl=r'''/* ===== gancho 0–3 ===== */
gsap.set('#artBottom',{opacity:1});
tl.fromTo('#artBottom',{scale:1.12},{scale:1.0,duration:3.0,ease:'power2.out',immediateRender:true},0);
tl.to('.nf',{opacity:1,duration:.6,stagger:.1},.2);
tl.to('.nf',{y:'-=30',duration:1.2,yoyo:true,repeat:1,ease:'sine.inOut',stagger:.08},.5);
tl.to('.nf',{opacity:0,y:'-=80',duration:.35,stagger:.03},2.75);
tl.to('#artBottom',{opacity:0,scale:1.04,duration:.35},2.9);
/* ===== massoretas 3–5,5 ===== */
tl.fromTo('#handImg',{opacity:0,scale:1.12},{opacity:1,scale:1.0,duration:.6,ease:'power2.out',immediateRender:false},3.2);
tl.to('#handImg',{scale:1.06,duration:4.2,ease:'none'},3.8);
tl.to('#hud',{opacity:1,duration:.4},3.3);
tl.fromTo('#hudline',{scaleX:0},{scaleX:1,duration:.7,ease:'power3.out',immediateRender:false},3.3);
[0,1,2,3].forEach((i,k)=>tl.fromTo('#nd'+i+',#nl'+i,{opacity:0,y:20},{opacity:1,y:0,duration:.35,ease:EO,immediateRender:false},3.4+k*.2));
tl.fromTo('#masorah',{opacity:0,scale:1.2},{opacity:1,scale:1,duration:.6,ease:'power2.out',immediateRender:false},4.4);
flash(4.6);
tl.fromTo('#ribbon',{opacity:0,scale:1.6,rotation:-4},{opacity:1,scale:1,rotation:0,duration:.4,ease:'power4.in',immediateRender:false},4.6);
tl.to('#ribbon',{x:'+=10',duration:.04,yoyo:true,repeat:5},5.0);
node(0,4.6,true);
tl.to(['#ribbon','#masorah','#handImg'],{opacity:0,duration:.35},5.5);
/* ===== Langton 5,7–10,3 ===== */
node(0,5.7,false);node(1,5.75,true);
tl.fromTo('#lang',{opacity:0},{opacity:1,duration:.3,immediateRender:false},5.7);
tl.fromTo('#lcol',{opacity:0,y:80},{opacity:1,y:0,duration:.5,ease:'back.out(1.3)',immediateRender:false},5.8);
tl.fromTo('#xiii',{opacity:0,scale:.6},{opacity:1,scale:1,duration:.5,ease:'back.out(1.8)',immediateRender:false},6.4);
[['#cp1',6.9],['#cp2',7.5],['#cp3',8.1]].forEach(c=>tl.fromTo(c[0],{opacity:0,x:-120,scale:1.6},{opacity:1,x:0,scale:1,duration:.4,ease:'power3.out',immediateRender:false},c[1]));
tl.fromTo('#lcol',{boxShadow:'0 0 0 rgba(249,122,8,0)'},{boxShadow:'0 0 100px rgba(249,122,8,.5)',duration:.4,yoyo:true,repeat:1,immediateRender:false},9.8);
tl.to('#lang',{opacity:0,y:-40,duration:.3,ease:'power2.in'},10.2);
/* ===== fecho 10,3–15 ===== */
node(1,10.3,false);node(3,10.35,true);
tl.fromTo('#handImg',{opacity:0,scale:1.12},{opacity:1,scale:1.0,duration:.6,ease:'power2.out',immediateRender:false},10.3);
tl.to('#handImg',{scale:1.07,duration:3.2,ease:'none'},10.9);
tl.to('#hud',{opacity:0,duration:.35},13.7);
tl.to('#poster',{opacity:1,duration:.7,ease:'power2.inOut'},14.1);
tl.to(['#handImg','#vig'],{opacity:0,duration:.4},14.2);
tl.fromTo('#poster',{scale:1.05},{scale:1,duration:1.4,ease:'power1.out',immediateRender:false},14.1);
tl.to('#stage',{opacity:1,duration:.01},14.99);

'''
s=s[:a]+tl+s[b:]
s=s.replace("DURATION=109,","DURATION=15,").replace('max="109"','max="15"').replace("if(t1<108)","if(t1<15)")
s=s.replace("<title>Quem Dividiu a Bíblia — Rogério Wilbert</title>","<title>Quem Dividiu a Bíblia — Stories 15s</title>")
open('/home/user/questionario/motion-biblico/stories15.html','w').write(s)
print('ok')
