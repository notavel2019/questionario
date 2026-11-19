import numpy as np, wave
SR=44100; DUR=31.6; N=int(SR*DUR); BPM=70; B=60/BPM
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

def section_gain(t):
    if t<3.0: return .6
    if t<27.0: return .85
    return 1.0
nb=int(DUR/BAR)+1
for k in range(nb):
    t=k*BAR; ch=k%4; g=section_gain(t)
    add(pad(PROG[ch],BAR+.8,.34*g),t)
    add(pad([PROG[ch][0]/2],BAR+.4,.45*g),t)
for bi in range(int(DUR/B)):
    t=bi*B; k=int(t//BAR); ch=k%4; g=section_gain(t)
    if t>=3.0 and t<30.3:
        add(pluck(ARP[ch][bi%4],.9,.26*g),t+.02,pan=((-1)**bi)*.3)
        if bi%2==0: add(kick(.28*g),t)
for t in [0.4,1.3,2.2]: heart(t)
for t,g in [(0.1,.7),(6.99,1.0),(14.4,.6),(18.9,.6),(27.14,.6),(30.3,1.0)]: add(impact(g),t)
for t,d in [(6.2,.8),(13.6,.8),(18.2,.7),(26.4,.7),(29.6,.7)]: riser(t,d)
add(pad(D+[587.33],3.2,.55),30.3)
add(bell(587.33,.3,3.0),30.4)
for t in [3.1,8.15,14.5,18.95,27.1]: whoosh(t)
t=8.5
while t<11.6: scratch(t); t+=.33
for i,t in enumerate([12.6,12.8,13.0,13.2,13.4,13.6,13.8]): ping(t,[587.33,659.25,783.99,880.0,987.77,1174.66,1318.5][i],.14)
for t in [17.1,17.6,18.1,19.5]: thud(t,.7)
tick(23.0);tick(23.3);tick(23.6)
# master
M=np.stack([L,R],1)
M=np.tanh(M*1.2)/1.0
fade=np.ones(N);fo=int(1.5*SR);fade[-fo:]=np.linspace(1,0,fo);fi=int(.05*SR);fade[:fi]=np.linspace(0,1,fi)
M*=fade[:,None]*0.9
M=M/np.abs(M).max()*.89
with wave.open('/tmp/claude-0/audio/music7.wav','wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((M*32767).astype('<i2').tobytes())
print('ok')
