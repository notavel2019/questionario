import numpy as np, wave
SR=44100; DUR=109.0; N=int(SR*DUR); BPM=70; B=60/BPM
L=np.zeros(N);R=np.zeros(N); rng=np.random.default_rng(11)
def add(sig,t,pan=0.0,g=1.0):
    i=int(t*SR)
    if i>=N or i<0: return
    s=sig[:N-i]*g
    L[i:i+len(s)]+=s*(1-max(pan,0)); R[i:i+len(s)]+=s*(1+min(pan,0))
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR); y=np.zeros_like(x); s=0.0
    for i in range(len(x)):
        s=(1-a)*x[i]+a*s; y[i]=s
    return y
def lpf_fast(x,fc):
    # filtro de um polo vetorizado por blocos (rápido): usa FFT
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); X*=1/(1+(f/fc)**2); return np.fft.irfft(X,len(x))
def saw(f,n,det=.004):
    t=np.arange(n)/SR; out=0
    for d in (-det,0,det): out=out+(2*((t*f*(1+d))%1)-1)
    return out/3
def pad(freqs,dur,g=.5):
    n=int(dur*SR); t=np.arange(n)/SR
    x=sum(saw(f,n,.006)+.4*np.sin(2*np.pi*f*t) for f in freqs)/len(freqs)
    e=np.minimum(t/1.6,1)*np.minimum((dur-t)/1.8,1)
    return lpf_fast(x,1400)*e*g
def pluck(f,dur=.9,g=.4):
    n=int(dur*SR); t=np.arange(n)/SR
    x=np.sin(2*np.pi*f*t)+.5*np.sin(2*np.pi*2*f*t)*np.exp(-t*6)+.25*np.sin(2*np.pi*3*f*t)*np.exp(-t*9)
    return x*np.exp(-t*3.2)*np.minimum(t/.004,1)*g
def kick(g=.7):
    n=int(.5*SR);t=np.arange(n)/SR;f=42+90*np.exp(-t*24);ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-t*8)*g
def heart(t,g=.55):
    add(kick(g*.8),t);add(kick(g*.55),t+.28)
def impact(g=.9,d=2.4):
    n=int(d*SR);t=np.arange(n)/SR
    sub=np.sin(2*np.pi*(34+60*np.exp(-t*5))*t)*np.exp(-t*1.8)
    nz=np.diff(rng.standard_normal(n),prepend=0);nz=lpf_fast(nz,2500)*np.exp(-t*3)*.35
    return (sub*.9+nz)*g
def bell(f,g=.25,d=2.4):
    n=int(d*SR);t=np.arange(n)/SR
    x=sum(a*np.sin(2*np.pi*f*r*t)*np.exp(-t*k) for a,r,k in [(1,1,1.4),(.5,2.76,2.2),(.3,5.4,3.2),(.2,8.9,4.5)])
    return x*g
def whoosh(t,d=.7,g=.35):
    n=int(d*SR);tt=np.arange(n)/SR;x=np.diff(rng.standard_normal(n),prepend=0);e=np.sin(np.pi*tt/d)**2
    add(lpf_fast(x,3500)*e*g,t)
def riser(t,d,g=.3):
    n=int(d*SR);tt=np.arange(n)/SR;x=np.diff(rng.standard_normal(n),prepend=0);add(lpf_fast(x,5000)*(tt/d)**2.2*g,t)
def scratch(t,d=.22,g=.12):
    n=int(d*SR);tt=np.arange(n)/SR;x=np.diff(rng.standard_normal(n),prepend=0);e=np.sin(np.pi*tt/d)
    add(lpf_fast(x,6000)*e*g*(0.6+0.4*np.sin(tt*180)),t,pan=(rng.random()-.5)*.4)
def thud(t,g=.7): add(impact(g,1.2),t)
def ping(t,f=1318.5,g=.2): add(bell(f,g,1.2),t,pan=.2)
def tick(t):
    n=int(.04*SR);tt=np.arange(n)/SR; add(np.sin(2*np.pi*2400*tt)*np.exp(-tt*120)*.16,t)
D=[146.83,174.61,220.0,293.66]       # Dm
Bb=[116.54,146.83,174.61,233.08]
F=[174.61,220.0,261.63,349.23]
C=[130.81,164.81,196.0,261.63]
PROG=[Dm:=D,Bb,F,C]
ARP=[[293.66,349.23,440.0,349.23],[233.08,293.66,349.23,293.66],[349.23,440.0,523.25,440.0],[261.63,329.63,392.0,329.63]]
BAR=4*B
# pads: 4 compassos por ciclo, entra por seção
def section_gain(t):
    # 0 = mudo ... 1 = cheio
    if t<4.5: return .55
    if t<17.3: return .4
    if t<30.1: return .65
    if t<46.5: return .75
    if t<62.1: return .7
    if t<78.2: return .85
    if t<88.8: return .8
    if t<103.7: return 1.0
    return .9
nb=int(DUR/BAR)
for k in range(nb):
    t=k*BAR; ch=k%4; g=section_gain(t)
    add(pad(PROG[ch],BAR+.8,.34*g),t,pan=0)
    # baixo
    add(pad([PROG[ch][0]/2],BAR+.4,.45*g),t)
for bi in range(int(DUR/B)):
    t=bi*B; k=int(t//BAR); ch=k%4; g=section_gain(t)
    if t<4.5 or t>=103.7:
        pass
    else:
        if 17.3<=t<62.1 or 62.1<=t<=103.7 or 4.5<=t<17.3:
            if (bi%2==0 or t>=62.1):
                n=ARP[ch][bi%4]
                add(pluck(n,.9,.26*g),t+.02,pan=((-1)**bi)*.3)
    # pulso suave (coração) a partir das estações
    if 17.3<=t<103.7 and bi%4==0: add(kick(.28*g),t)
    if 62.1<=t<103.7 and bi%4==2: add(kick(.2*g),t)
# coração no gancho e pergunta
for t in [0.5,1.4,2.3,3.2]: heart(t)
for t in [15.0,16.0]: heart(t,.5)
# impactos / marcos
for t,g in [(0.35,.8),(15.0,.85),(30.7,1.0),(62.3,.6),(68.8,.6),(78.4,.55),(88.8,.55),(107.1,1.0)]:
    add(impact(g),t)
for t,d in [(29.4,1.3),(61.2,.9),(67.9,.8),(77.4,.9),(87.9,.9),(106.0,1.1),(14.0,.9)]: riser(t,d)
# acorde final
add(pad(D+[587.33],6.0,.55),103.7)
add(bell(587.33,.3,4.0),107.2)
# --- efeitos ---
for t in [4.6,17.5,33.0,51.3,62.3,68.7,81.2,96.0]: whoosh(t)
whoosh(11.5);whoosh(17.6,1.4,.3);whoosh(56.9,.9);whoosh(73.2,.8)
for i,t in enumerate([6.4,6.9]): ping(t,1046.5+i*260)
for i,t in enumerate([10.9,11.1,11.3,11.5,11.7,11.9]): tick(t)
for t in [12.3,13.1,14.0]: add(pluck(196.0,.7,.3),t)
for t in [21.0,22.4,23.8,25.2]: ping(t,880.0)
thud(30.8,.9)
t=33.8
while t<39.4: scratch(t); t+=.36
for i,t in enumerate([36.9,37.75,38.6,39.4]): tick(t)
for i,t in enumerate([42.9,43.18,43.46,43.74,44.02,44.3,44.58]): ping(t,[587.33,659.25,783.99,880.0,987.77,1174.66,1318.5][i],.14)
for t in [46.9,47.8,48.7]: add(bell(293.66,.3,2.4),t)
for t in [65.3,66.3,67.2,70.4]: thud(t,.7)
for t in [81.3,83.0,83.8]: ping(t,[659.25,783.99,987.77][[81.3,83.0,83.8].index(t)],.2)
for t in [84.8,85.7,86.6]: thud(t,.5)
for k in range(15): tick(96.0+k*.12)
for k in range(6): ping(100.4+k*.55,[587.33,698.46,880.0,1046.5,1174.66,1396.9][k],.16)
# master
M=np.stack([L,R],1)
M=np.tanh(M*1.2)/1.0
fade=np.ones(N);fo=int(1.5*SR);fade[-fo:]=np.linspace(1,0,fo);fi=int(.05*SR);fade[:fi]=np.linspace(0,1,fi)
M*=fade[:,None]*0.9
M=M/np.abs(M).max()*.89
with wave.open('/tmp/claude-0/audio/music6.wav','wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((M*32767).astype('<i2').tobytes())
print('ok')
