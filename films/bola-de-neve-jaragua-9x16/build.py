import json
segs = json.load(open("segments.json"))
# scene groups: (name, first segment index, last segment index, start s, end s)
groups = [("s1",0,0,0.0,8.4),("s2",1,1,8.4,16.9),("s3",2,4,16.9,32.6),("s4",5,6,32.6,46.3),("s5",7,8,46.3,54.5)]
HERO = {"semente","sementes","terra","florestas","Gênesis","plantado","raízes","tempestade","tomba","seca","orgulhosa","rígidos","curva","pesado","servir","começos","pequenos","fruto"}
def norm(w): return w.strip(" ,.?!").replace("”","").replace("“","")
scenes_html = []
word_js = []
cap_js = []
for gi,(name,a,b,t0,t1) in enumerate(groups):
    words = []
    for si in range(a,b+1):
        for (w,ws,we) in segs[si]["words"]:
            words.append((w,ws,we))
    spans = []
    for wi,(w,ws,we) in enumerate(words):
        cls = "w hero" if norm(w) in HERO else "w"
        spans.append(f'<span id="{name}w{wi}" class="{cls}">{w}</span>')
        word_js.append((f"#{name}w{wi}", ws))
    caps = []
    for wi,(w,ws,we) in enumerate(words):
        yc = " you" if norm(w).lower() in ("você","voce","seu","sua","te","seus") else ""
        caps.append(f'<span id="{name}c{wi}" class="cap{yc}">{w}</span>')
        cap_js.append((f"#{name}c{wi}", ws, we, bool(yc)))
    dense = " dense" if name in ("s2","s3","s4") else ""
    scenes_html.append(f'<div id="{name}" class="scene{dense}"><div class="stack">{" ".join(spans)}</div><div class="capband">{" ".join(caps)}</div></div>')
    globals()[name+"_t"] = (t0,t1)
# tempestade timing for the quake
tempo = [ws for (w,ws,we) in sum([segs[i]["words"] for i in range(2,5)],[]) if norm(w)=="tempestade"]
tempo_t = tempo[0] if tempo else 29.0
cta = """
<div id="cta" class="scene"><div class="stack cta">
  <div id="c1" class="ctaline">Conheça o</div>
  <div id="c2" class="ctaline hero">Bola de Neve</div>
  <div id="c3" class="ctaline hero">Jaraguá</div>
  <div id="pill" class="pill">Venha conhecer</div>
  <div id="ctacap" class="capband" style="position:absolute;top:1420px;left:64px;right:64px;height:300px;font-size:52px">Você também pode começar pequeno. Venha conhecer.</div>
</div></div>"""
html = f"""<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Motion · Bola de Neve Jaraguá</title>
<meta name="viewport" content="width=1080, height=1920">
<style>
@font-face {{ font-family: 'Montserrat'; src: url(fonts/Montserrat.woff2) format('woff2'); font-weight: 100 900; font-display: block; }}
@font-face {{ font-family: 'Barlow Condensed'; src: url(fonts/BarlowCondensed-Bold.woff2) format('woff2'); font-weight: 700; font-display: block; }}
:root {{ --ink:#0c0d10; --paper:#f4f4ef; --accent:#c6ff3d; }}
* {{ box-sizing: border-box; }}
html, body {{ margin:0; width:1080px; height:1920px; overflow:hidden; background:var(--ink); }}
#main {{ position:absolute; left:0; top:0; width:1080px; height:1920px; overflow:hidden; background:var(--ink); color:var(--paper); }}
.blob {{ position:absolute; border-radius:50%; filter: blur(40px); }}
#b1 {{ left:-260px; top:-200px; width:900px; height:900px; background: radial-gradient(circle, rgba(198,255,61,.28), rgba(198,255,61,0) 65%); }}
#b2 {{ left:360px; top:1150px; width:1000px; height:1000px; background: radial-gradient(circle, rgba(90,120,255,.22), rgba(90,120,255,0) 65%); }}
.scene {{ position:absolute; inset:0; }}
.stack {{ position:absolute; left:70px; right:70px; top:150px; bottom:560px; display:flex; flex-wrap:wrap; align-content:center; justify-content:center; gap:14px 26px; text-align:center; }}
.w {{ display:inline-block; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:128px; line-height:.92; text-transform:uppercase; color:var(--paper); }}
.w.hero {{ font-size:200px; color:var(--accent); letter-spacing:-.01em; }}
.capband {{ position:absolute; left:64px; right:64px; top:1400px; height:360px; display:flex; flex-wrap:wrap; align-content:center; justify-content:center; gap:6px 14px; text-align:center; background:rgba(12,13,16,.72); border-radius:28px; padding:30px 34px; font-family:'Montserrat',sans-serif; font-weight:800; font-size:58px; line-height:1.14; color:var(--paper); }}
.scene.dense .w {{ font-size:86px; }}
.scene.dense .w.hero {{ font-size:128px; }}
.cap {{ display:inline-block; }}
.cap.you {{ color:#ffc857; }}
.cta {{ flex-direction:column; align-items:center; gap:20px; }}
.ctaline {{ font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:190px; line-height:.92; text-transform:uppercase; color:var(--paper); white-space:nowrap; }}
.ctaline.hero {{ color:var(--accent); }}
.pill {{ margin-top:70px; background:var(--accent); color:var(--ink); font-family:'Montserrat',sans-serif; font-weight:800; font-size:58px; padding:34px 70px; border-radius:999px; }}
</style></head>
<body><div id="main">
<div id="b1" class="blob"></div><div id="b2" class="blob"></div>
{''.join(scenes_html)}
{cta}
</div>
<script src="./runtime/vendor/gsap.min.js"></script>
<script src="./runtime/motion.js"></script>
<script>
const M = Motion.film({{ fps: 30, duration: 60, width: 1080, height: 1920, clock: 'smooth' }});
const F = s => Math.round(s * 30);
// background life: the blobs drift the whole film, so no held frame is dead
M.drift('#b1', {{ prop: 'scale', from: .9, to: 1.25, start: 0, end: 1800 }});
M.drift('#b2', {{ prop: 'scale', from: 1.1, to: .85, start: 0, end: 1800 }});
// scenes: hard cuts on sentence boundaries
const cuts = {json.dumps([[n, round(t0*30), round(t1*30)] for (n,_,_,t0,t1) in groups])};
cuts.forEach(([n,a,b]) => M.show('#'+n, a, b));
M.show('#cta', F(54.5), 1800);
// every spoken word slams in at its own timestamp
const CAPS = {json.dumps(cap_js)};
CAPS.forEach(([sel, ws, we, you]) => {{
  if (you) return;
  const a = Math.round(ws*30), b = Math.max(a+1, Math.round(we*30));
  M.kf(sel, 'color', [[0, '#f4f4ef'], [a, '#f4f4ef'], [a, '#c6ff3d'], [b, '#c6ff3d'], [b, '#f4f4ef']]);
}});
const WORDS = {json.dumps(word_js)};
WORDS.forEach(([sel, ws]) => M.enter(sel, {{ at: Math.max(0, F(ws) - 1), frames: 8, ease: 'crashIn', from: {{ scale: 1.5 }} }}));
// the storm: the whole sentence shakes on 'tempestade', the word itself holds
const q = F({tempo_t:.2f});
M.kf('#s3', 'x', [[q, 0], [q+2, -14], [q+4, 12], [q+6, -10], [q+8, 8], [q+10, -4], [q+12, 0]]);
// CTA: the call to know the church
M.enter('#c1', {{ at: F(54.5), frames: 10, ease: 'softLand', from: {{ y: 60 }} }});
M.enter('#c2', {{ at: F(55.0), frames: 10, ease: 'crashIn', from: {{ scale: 1.35 }} }});
M.enter('#c3', {{ at: F(55.4), frames: 10, ease: 'crashIn', from: {{ scale: 1.35 }} }});
M.enter('#pill', {{ at: F(58.5), frames: 12, ease: 'softLand', from: {{ y: 40 }} }});
M.enter('#ctacap', {{ at: F(57.0), frames: 12, ease: 'softLand', from: {{ y: 40 }} }});
window.__ready = Motion.loaded();
</script></body></html>"""
open("index.html","w",encoding="utf-8").write(html)
print("scenes", [(n,round(t0,1),round(t1,1)) for (n,_,_,t0,t1) in groups], "tempestade", round(tempo_t,2), "words", len(word_js))
