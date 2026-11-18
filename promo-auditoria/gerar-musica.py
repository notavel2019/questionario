import numpy as np, wave
SR=44100; DUR=81.0; N=int(SR*DUR); BPM=120; B=60/BPM
L=np.zeros(N);R=np.zeros(N)
rng=np.random.default_rng(7)
def add(sig,t,pan=0.0,g=1.0):
    i=int(t*SR); 
    if i>=N: return
    s=sig[:N-i]*g
    L[i:i+len(s)]+=s*(1-max(pan,0)); R[i:i+len(s)]+=s*(1+min(pan,0))
def env(n,a=.002,d=.2,sus=0.0):
    t=np.arange(n)/SR; e=np.minimum(t/a,1)*np.exp(-t/d); return e
def kick():
    n=int(.35*SR);t=np.arange(n)/SR;f=45+110*np.exp(-t*28);ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-t*9)*1.0+ (rng.standard_normal(n)*np.exp(-t*200))*.15
def clap():
    n=int(.2*SR);t=np.arange(n)/SR;x=rng.standard_normal(n)
    x=np.diff(x,prepend=0); return x*(np.exp(-t*30)+.5*np.exp(-((t-.012)**2)*8e4))*.35
def hat(open_=False):
    n=int((.25 if open_ else .06)*SR);t=np.arange(n)/SR;x=np.diff(rng.standard_normal(n),prepend=0)
    return x*np.exp(-t*(18 if open_ else 80))*.22
def saw(f,n,det=0.004):
    t=np.arange(n)/SR; out=0
    for d in (-det,0,det):
        out=out+(2*((t*f*(1+d))%1)-1)
    return out/3
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR); y=np.zeros_like(x); s=0
    for i in range(len(x)):
        s=(1-a)*x[i]+a*s; y[i]=s
    return y
def bass(f,dur):
    n=int(dur*SR); x=saw(f,n,.001)+np.sin(2*np.pi*f*np.arange(n)/SR)
    return lp(x,500)*env(n,.005,dur*.8)*.5
def stab(freqs,dur=.28):
    n=int(dur*SR); x=sum(saw(f,n) for f in freqs)/len(freqs)
    return lp(x,2800)*env(n,.004,.14)*.55
def pluck(f,dur=.25):
    n=int(dur*SR); t=np.arange(n)/SR
    x=saw(f,n,.002)+0.5*np.sin(2*np.pi*2*f*t)
    return lp(x,3500)*env(n,.002,.09)*.38
def noise_sweep(dur,up=True,g=.5):
    n=int(dur*SR);t=np.arange(n)/SR;x=rng.standard_normal(n)
    x=np.diff(x,prepend=0)
    e=(t/dur)**2 if up else (1-t/dur)**2
    return x*e*g
def impact():
    n=int(1.4*SR);t=np.arange(n)/SR
    sub=np.sin(2*np.pi*(38+70*np.exp(-t*7))*t)*np.exp(-t*3.2)*.9
    nz=np.diff(rng.standard_normal(n),prepend=0)*np.exp(-t*5)*.22
    return sub+nz
# acordes (Am, F, C, G) com raízes de baixo
chords=[(220.0,[220.0,261.63,329.63]),(174.61,[174.61,220.0,261.63]),(261.63,[261.63,329.63,392.0]),(196.0,[196.0,246.94,293.66])]
bassroot=[55.0,43.65,65.41,49.0]
arp_notes=[[440,523.25,659.25,523.25],[349.23,440,523.25,440],[523.25,659.25,784,659.25],[392,493.88,587.33,493.88]]
beats=int(DUR/B)
def groove_t(t): return (3.3<=t<35.9) or (46.1<=t<69.1) or (t>=72.6)
for bi in range(beats):
    t=bi*B; bar=bi//4; ch=bar%4; inbar=bi%4
    groove = (3.3<=t<35.9) or (46.1<=t<69.1) or (t>=72.6)
    dropb  = (15.1<=t<35.9) or (59.3<=t<69.1) or (t>=72.6)
    soft   = (35.9<=t<46.1) or (69.1<=t<72.6)
    # intro: arp suave
    for s in range(2):
        tt=t+s*B/2
        if tt<30: 
            note=arp_notes[ch][(bi*2+s)%4]
            g=.55 if not groove else .5
            add(pluck(note),tt,pan=(-.3 if s else .3),g=g)
    if groove and not soft:
        add(kick(),t,g=.95)
        add(hat(),t+B/2,g=1.0,pan=.2)
        if inbar in (1,3): add(clap(),t,g=1.0)
        if inbar==3: add(hat(True),t+B*.75,g=.8,pan=-.2)
        add(bass(bassroot[ch],B*.9),t+B/2,g=1.0)
        add(bass(bassroot[ch],B*.4),t,g=.9)
    if soft:
        if inbar in(0,2): add(kick(),t,g=.7)
        add(hat(),t+B/2,g=.7)
    if dropb:
        add(stab(chords[ch][1]),t,g=.8,pan=-.15)
        add(stab(chords[ch][1]),t+B*.75,g=.6,pan=.15)
        for s in range(4): add(hat(),t+s*B/4,g=.5,pan=.3*(-1)**s)
# finale: acorde longo
fin=int(5.0*SR)
chord=sum(saw(f,fin,.006) for f in [220,261.63,329.63,440])/4
chord=lp(chord,2200)*np.minimum(np.arange(fin)/SR/.02,1)*np.exp(-np.arange(fin)/SR*1.1)*.6
add(chord,76.0,g=1.0)
# risers + impactos nas transições do vídeo
for t0,d in [(2.6,.6),(14.4,.7),(35.2,.7),(45.4,.7),(58.6,.7),(68.4,.7),(71.9,.7)]:
    x=noise_sweep(d,True,.45); add(x,t0,g=.9)
for t0 in [3.2,15.1,35.9,46.1,59.3,69.1,72.6]:
    add(impact(),t0,g=.85)
# efeitos sonoros (agenda)
def tap(t):
    n=int(.06*SR);tt=np.arange(n)/SR; add(np.sin(2*np.pi*1500*tt)*np.exp(-tt*70)*.35+np.diff(rng.standard_normal(n),prepend=0)*np.exp(-tt*90)*.08,t)
def ping(t,f=1318.5):
    n=int(.5*SR);tt=np.arange(n)/SR; add((np.sin(2*np.pi*f*tt)+.35*np.sin(2*np.pi*f*2.01*tt))*np.exp(-tt*8)*.22,t,pan=.2)
def buzz(t):
    n=int(.45*SR);tt=np.arange(n)/SR; add(np.sign(np.sin(2*np.pi*95*tt))*np.exp(-tt*5)*.25*(np.sin(2*np.pi*14*tt)>-.2),t)
def whoosh(t,d=.5):
    n=int(d*SR);tt=np.arange(n)/SR;x=np.diff(rng.standard_normal(n),prepend=0);e=np.sin(np.pi*tt/d)**2; add(lp(x,4000)*e*.5,t)
def coin(t):
    n=int(.35*SR);tt=np.arange(n)/SR; add(np.sin(2*np.pi*2093*tt)*np.exp(-tt*16)*.14,t,pan=(rng.random()-.5)*.8)
for t in [4.15,7.9,17.7,26.35,29.0,39.2,49.9,15.15]: tap(t)
for t in [18.0,19.0,21.2,22.8,24.0,28.2,32.6,50.6]: ping(t)
for t in [47.6,43.4,8.3]: buzz(t) if t==47.6 else ping(t,880)
for t in [6.9,33.8,47.3]: buzz(t)
for t in [3.2,17.9,26.5,29.2,45.6,53.7,59.6,72.7]: whoosh(t)
for k in range(5): coin(4.2+k*.14)
for k in range(6): coin(9.9+k*.22)
for k in range(5): coin(43.2+k*.18)
# master: sidechain leve + limiter + fades
M=np.stack([L,R],1)
sc=np.ones(N)
if True:
    for bi in range(beats):
        t=bi*B
        if groove_t(t):
            i=int(t*SR);m=int(.18*SR);k=np.arange(min(m,N-i))/m
            sc[i:i+len(k)]*=1-0.45*(1-k)**2
M*=sc[:,None]
M=np.tanh(M*1.3)/1.05
fade=np.ones(N);fo=int(1.2*SR);fade[-fo:]=np.linspace(1,0,fo);fi=int(.05*SR);fade[:fi]=np.linspace(0,1,fi)
M*=fade[:,None]*0.9
pk=np.abs(M).max(); M=M/pk*.89
with wave.open('/tmp/claude-0/audio/music4.wav','wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((M*32767).astype('<i2').tobytes())
print('ok',pk)
