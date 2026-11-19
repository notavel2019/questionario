import json,re
A=json.load(open('/tmp/claude-0/audio/anch.json'))
s=open('/home/user/questionario/motion-biblico/index.html').read()
a=s.index("const LINES=[");b=s.index("LINES.forEach(L=>{const d=document.createElement('div');d.className='t';")
lines=r'''const LINES=[
 ['T1','QUEM COLOCOU\nESSES <b>NÚMEROS</b>\nNA SUA BÍBLIA?',150,138,.05,3.0,0,-1],
 ['T2','ESSA HISTÓRIA\nPASSOU POR\n<b>MUITAS MÃOS</b>',170,122,3.1,5.9,-1,1],
 ['T4','ENTRE ELAS, AS DOS',560,86,5.95,8.0,0,1],
 ['T5','ESTUDIOSOS JUDEUS\nPRESERVANDO COM <b>PRECISÃO</b>\nA BÍBLIA HEBRAICA',150,92,8.1,14.3,1,-1],
 ['T9','<b>STEPHEN LANGTON</b>\nCRIOU O SISTEMA\nDE <b>CAPÍTULOS</b>',150,100,14.4,18.85,-1,1],
 ['T10','<b>ROBERT ESTIENNE</b>\nNUMEROU OS\n<b>VERSÍCULOS</b>',150,100,18.9,27.1,0,1],
 ['T14','FAÇA COM CUIDADO\nA PARTE QUE ESTÁ\nNAS SUAS <b>MÃOS</b>',170,126,27.14,30.4,0,1]];
'''
s=s[:a]+lines+s[b:]
a=s.index("/* ===== S1 0,3–4,4 gancho ===== */");b=s.index("/* funções puras do tempo */")
tlcode=r'''/* ===== 0–3 gancho ===== */
gsap.set('#artBottom',{opacity:1});
tl.fromTo('#artBottom',{scale:1.12},{scale:1.0,duration:3.2,ease:'power2.out',immediateRender:true},0);
tl.to('.nf',{opacity:1,duration:.6,stagger:.1},.2);
tl.to('.nf',{y:'-=30',duration:1.4,yoyo:true,repeat:1,ease:'sine.inOut',stagger:.08},.5);
tl.to('#artBottom',{opacity:0,scale:1.04,duration:.4},2.85);
tl.to('.nf',{opacity:0,y:'-=80',duration:.4,stagger:.03},2.7);
/* ===== B: muitas mãos → massoretas ===== */
tl.fromTo('#handImg',{opacity:0,scale:1.15},{opacity:1,scale:1.0,duration:.7,ease:'power2.out',immediateRender:false},3.1);
tl.to('#handImg',{scale:1.07,duration:5,ease:'none'},3.8);
tl.to('#hud',{opacity:1,duration:.5},3.3);
tl.fromTo('#hudline',{scaleX:0},{scaleX:1,duration:.9,ease:'power3.out',immediateRender:false},3.3);
[0,1,2,3].forEach((i,k)=>tl.fromTo('#nd'+i+',#nl'+i,{opacity:0,y:20},{opacity:1,y:0,duration:.4,ease:EO,immediateRender:false},3.6+k*.45));
tl.fromTo('#masorah',{opacity:0,scale:1.2},{opacity:1,scale:1,duration:.8,ease:'power2.out',immediateRender:false},@B_entre@);
flash(@B_mass@);
tl.fromTo('#ribbon',{opacity:0,scale:1.6,rotation:-4},{opacity:1,scale:1,rotation:0,duration:.45,ease:'power4.in',immediateRender:false},@B_mass@);
tl.to('#ribbon',{x:'+=10',duration:.04,yoyo:true,repeat:5},@B_mass@+.45);
node(0,@B_mass@,true);
tl.to('#ribbon',{opacity:0,y:-60,duration:.35,ease:'power2.in'},7.7);
tl.to(['#masorah','#handImg'],{opacity:0,duration:.4},7.8);
/* ===== C: texto hebraico ===== */
tl.fromTo('#hb',{opacity:0,y:100,scale:.94},{opacity:1,y:0,scale:1,duration:.7,ease:'back.out(1.3)',immediateRender:false},8.15);
gsap.set(['#hl1 .c','#hl2 .c'],{clipPath:'inset(0 0 0 100%)'});
tl.to('#hl1 .c',{clipPath:'inset(0 0 0 0%)',duration:.8,ease:'none',stagger:{each:.75,from:'start'}},8.7);
tl.to('#hl2 .c',{clipPath:'inset(0 0 0 0%)',duration:.7,ease:'none',stagger:{each:.6,from:'start'}},10.9);
tl.fromTo('#hbGuides',{opacity:0},{opacity:1,duration:.4,immediateRender:false},@C_prec@);
tl.to('#hbGuides',{opacity:0,duration:.3},12.7);
tl.fromTo('#sec',{opacity:0,y:-40,scale:.7},{opacity:1,y:0,scale:1,duration:.45,ease:'back.out(2)',immediateRender:false},9.0);
tl.to('#sec',{opacity:0,duration:.3},14.0);
['#a0','#a1','#a2','#b0','#b1','#b2','#b3'].forEach((id,i)=>{
 tl.to(id+' .p',{opacity:1,duration:.35},12.6+i*.2);
 tl.to(id+' .c',{opacity:0,duration:.35},12.6+i*.2);
});
tl.fromTo('#hb',{boxShadow:'0 0 0 rgba(242,178,74,0)'},{boxShadow:'0 0 120px rgba(242,178,74,.55)',duration:.7,yoyo:true,repeat:1,immediateRender:false},12.7);
tl.to('#hb',{opacity:0,scale:.92,y:40,duration:.35,ease:'power2.in'},14.0);
/* ===== D: Langton ===== */
node(0,14.4,false);node(1,14.45,true);
tl.fromTo('#lang',{opacity:0},{opacity:1,duration:.35,immediateRender:false},14.45);
tl.fromTo('#lcol',{opacity:0,y:80},{opacity:1,y:0,duration:.6,ease:'back.out(1.3)',immediateRender:false},14.55);
tl.fromTo('#xiii',{opacity:0,scale:.6},{opacity:1,scale:1,duration:.6,ease:'back.out(1.8)',immediateRender:false},15.3);
[['#cp1',@D_cap@],['#cp2',@D_cap@+.5],['#cp3',@D_cap@+1.0]].forEach(c=>{tl.fromTo(c[0],{opacity:0,x:-120,scale:1.6},{opacity:1,x:0,scale:1,duration:.4,ease:'power3.out',immediateRender:false},c[1]);});
tl.fromTo('#lcol',{boxShadow:'0 0 0 rgba(249,122,8,0)'},{boxShadow:'0 0 100px rgba(249,122,8,.5)',duration:.5,yoyo:true,repeat:1,immediateRender:false},@D_cap@);
tl.to('#lang',{opacity:0,y:-40,duration:.35,ease:'power2.in'},18.55);
/* ===== E: Estienne ===== */
node(1,18.9,false);node(2,18.95,true);
tl.fromTo('#est',{opacity:0},{opacity:1,duration:.5,immediateRender:false},18.9);
tl.fromTo('#estImg',{scale:1.18},{scale:1.04,duration:8,ease:'none',immediateRender:false},18.9);
tl.fromTo('#y1551',{opacity:0,scale:.6,y:40},{opacity:1,scale:1,y:0,duration:.6,ease:'back.out(1.8)',immediateRender:false},@E_1551@);
tl.fromTo('#gk',{opacity:0,y:100},{opacity:1,y:0,duration:.7,ease:'back.out(1.3)',immediateRender:false},@E_nt@);
tl.to('#gk .row sup',{scale:1.2,duration:.3,yoyo:true,repeat:3,ease:'sine.inOut'},@E_vers@);
tl.to('#est',{opacity:0,duration:.4},26.8);
/* ===== F: mãos + capa ===== */
node(2,26.9,false);node(3,27.1,true);
tl.fromTo('#handImg',{opacity:0,scale:1.12},{opacity:1,scale:1.0,duration:.8,ease:'power2.out',immediateRender:false},27.1);
tl.to('#handImg',{scale:1.07,duration:3.4,ease:'none'},27.9);
tl.to('#hud',{opacity:0,duration:.4},29.3);
tl.to('#poster',{opacity:1,duration:.8,ease:'power2.inOut'},30.2);
tl.to(['#handImg','#vig'],{opacity:0,duration:.5},30.4);
tl.fromTo('#poster',{scale:1.05},{scale:1,duration:1.6,ease:'power1.out',immediateRender:false},30.2);
tl.to('#stage',{opacity:1,duration:.01},31.59);

'''
tlcode=re.sub(r'@(\w+)@',lambda m:str(A[m.group(1)]),tlcode)
s=s[:a]+tlcode+s[b:]
s=s.replace("const W=1080,H=1920,DURATION=109,","const W=1080,H=1920,DURATION=31.6,").replace('max="109"','max="31.6"')
s=s.replace("if(t1<108)","if(t1<31)")
s=s.replace("<title>Quem Dividiu a Bíblia — Rogério Wilbert</title>","<title>Quem Dividiu a Bíblia — Reels 30s</title>")
open('/home/user/questionario/motion-biblico/reels30.html','w').write(s)
print('ok',len(s))
