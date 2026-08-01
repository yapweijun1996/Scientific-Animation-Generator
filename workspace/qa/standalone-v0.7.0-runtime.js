
globalThis["__SCIENCE_STANDALONE_CONFIG__"]={"version":"0.7.0","snapshot":{"protocolVersion":"1.0","templateId":"solar-system-3d","templateVersion":"0.7.0","simulationDays":-123.75,"seed":20260728,"playing":false,"focusedObject":"moon","clock":{"epochIso":"2026-01-01T00:00:00.000Z","playbackRateDaysPerSecond":-0.041666666666666664,"direction":-1,"complexity":"advanced"},"experience":"learn","observer":{"location":{"id":"singapore","name":"Singapore","latitudeDeg":1.3521,"longitudeDeg":103.8198,"timeZone":"Asia/Singapore"},"atmosphere":true,"lightPollution":false,"presentation":"enhanced-learning"},"selectedEvent":{"id":"test-event","type":"full-moon","simulationDays":-123.75},"parameters":{"distanceScale":1,"planetScale":1.15,"timeScale":-0.041666666666666664,"scaleMode":"real-distance","showOrbits":true,"showLabels":true,"showStars":true,"visualMode":"educational","quality":"high"}},"textures":{}};
(function(){"use strict";const Hl=`(function(){"use strict";function f(t){return Number.isFinite(t)?Math.max(-2048,Math.min(2048,t)):0}function h(t){return Number.isFinite(t)?Math.max(0,Math.min(3600,t)):0}function p(t,e,i,a){const o=Number.isFinite(t)?t:0,r=h(i),s=f(e),g=a&&s!==0&&r!==0?o+r*s:o;return{beforeSimulationDays:o,afterSimulationDays:g,appliedRealSeconds:r,playbackRateDaysPerSecond:s,playing:a}}const d=[{id:"mercury",name:"Mercury",color:11184034,radiusKm:2439.7,distanceAu:.387,orbitalPeriodDays:87.969,eccentricity:.2056,inclinationDeg:7,rotationHours:1407.6,phase:.4},{id:"venus",name:"Venus",color:14792042,radiusKm:6051.8,distanceAu:.723,orbitalPeriodDays:224.701,eccentricity:.0068,inclinationDeg:3.39,rotationHours:-5832.5,phase:1.7},{id:"earth",name:"Earth",color:3900150,radiusKm:6371,distanceAu:1,orbitalPeriodDays:365.256,eccentricity:.0167,inclinationDeg:0,rotationHours:23.934,phase:3.1},{id:"mars",name:"Mars",color:13131575,radiusKm:3389.5,distanceAu:1.524,orbitalPeriodDays:686.98,eccentricity:.0934,inclinationDeg:1.85,rotationHours:24.623,phase:4.25},{id:"jupiter",name:"Jupiter",color:14004362,radiusKm:69911,distanceAu:5.203,orbitalPeriodDays:4332.59,eccentricity:.0489,inclinationDeg:1.3,rotationHours:9.925,phase:5.2},{id:"saturn",name:"Saturn",color:14995346,radiusKm:58232,distanceAu:9.537,orbitalPeriodDays:10759.22,eccentricity:.0565,inclinationDeg:2.49,rotationHours:10.656,phase:.9},{id:"uranus",name:"Uranus",color:9099240,radiusKm:25362,distanceAu:19.191,orbitalPeriodDays:30688.5,eccentricity:.0472,inclinationDeg:.77,rotationHours:-17.24,phase:2.4},{id:"neptune",name:"Neptune",color:4681448,radiusKm:24622,distanceAu:30.069,orbitalPeriodDays:60182,eccentricity:.0086,inclinationDeg:1.77,rotationHours:16.11,phase:4.8}],l=Math.PI*2;function D(t){const e=t%l;return e<0?e+l:e}function S(t,e){let i=t;for(let a=0;a<6;a+=1)i-=(i-e*Math.sin(i)-t)/(1-e*Math.cos(i));return i}function M(t,e){const i=t.distanceAu*(Math.cos(e)-t.eccentricity),a=t.distanceAu*Math.sqrt(1-t.eccentricity*t.eccentricity)*Math.sin(e),o=t.inclinationDeg*Math.PI/180;return{x:i,y:a*Math.sin(o),z:a*Math.cos(o)}}function A(t,e){const i=D(e/t.orbitalPeriodDays*l+t.phase);return M(t,S(i,t.eccentricity))}function P(t,e){return e*24/t.rotationHours*l}const b=self;let m=!0,n=0,y=32,c=performance.now();function u(t){const e=new Float32Array(d.length*3),i=new Float32Array(d.length);d.forEach((o,r)=>{const s=A(o,n);e[r*3]=s.x,e[r*3+1]=s.y,e[r*3+2]=s.z,i[r]=P(o,n)});const a={type:"state",simulationDays:n,positions:e.buffer,rotations:i.buffer,step:t};b.postMessage(a,[e.buffer,i.buffer])}b.onmessage=t=>{const e=t.data;switch(e.type){case"configure":y=f(e.timeScale);break;case"play":m=!0,c=performance.now();break;case"pause":m=!1;break;case"reset":n=0,c=performance.now(),u();break;case"set-time":n=Number.isFinite(e.simulationDays)?e.simulationDays:0,c=performance.now(),u();break;case"step":{const i=p(n,y,e.realSeconds,m);n=i.afterSimulationDays,c=performance.now(),u({...i,requestId:e.requestId});break}case"snapshot":u();break}},setInterval(()=>{const t=performance.now(),e=Math.min(.1,Math.max(0,(t-c)/1e3));c=t;const i=p(n,y,e,m);i.afterSimulationDays!==i.beforeSimulationDays&&(n=i.afterSimulationDays,u())},1e3/30),u()})();
`,Gl=typeof self<"u"&&self.Blob&&new Blob(["(self.URL || self.webkitURL).revokeObjectURL(self.location.href);",Hl],{type:"text/javascript;charset=utf-8"});function qu(i){let e;try{if(e=Gl&&(self.URL||self.webkitURL).createObjectURL(Gl),!e)throw"";const t=new Worker(e,{name:i?.name});return t.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(e)}),t}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(Hl),{name:i?.name})}}const Jt="0.7.0",$u="Spacecraft Travel",Yu="1.0",Mr=20260728,yr="2026-01-01T00:00:00.000Z",Wl=Date.parse(yr),Xl=864e5,Ku=3600,Zu=[{id:"minute-1",label:"1 min/s",value:1,unit:"minute",daysPerSecond:1/1440,pinned:!0},{id:"minute-10",label:"10 min/s",value:10,unit:"minute",daysPerSecond:10/1440,pinned:!0},{id:"hour-1",label:"1 hour/s",value:1,unit:"hour",daysPerSecond:1/24,pinned:!0},{id:"hour-6",label:"6 hours/s",value:6,unit:"hour",daysPerSecond:.25,pinned:!0},{id:"day-1",label:"1 day/s",value:1,unit:"day",daysPerSecond:1,pinned:!0},{id:"week-1",label:"1 week/s",value:1,unit:"week",daysPerSecond:7},{id:"month-1",label:"1 month/s",value:1,unit:"month",daysPerSecond:30.436875},{id:"year-1",label:"1 year/s",value:1,unit:"year",daysPerSecond:365.2425}];function zi(i){const e=Number.isFinite(i)?i:0;return new Date(Wl+e*Xl)}function Sr(i){const e=i.getTime();return Number.isFinite(e)?(e-Wl)/Xl:0}function ju(i){const e=zi(i),t=e.getTimezoneOffset()*6e4;return new Date(e.getTime()-t).toISOString().slice(0,16)}function Ju(i){const e=new Date(i);if(!(!i||Number.isNaN(e.getTime())))return Sr(e)}function ei(i){return Number.isFinite(i)?Math.max(-2048,Math.min(2048,i)):0}function Qu(i,e){return ei(Math.abs(i)*e)}function ed(i){return Number.isFinite(i)?Math.max(0,Math.min(Ku,i)):0}function br(i,e,t,n){const s=Number.isFinite(i)?i:0,a=ed(t),r=ei(e),o=n&&r!==0&&a!==0?s+a*r:s;return{beforeSimulationDays:s,afterSimulationDays:o,appliedRealSeconds:a,playbackRateDaysPerSecond:r,playing:n}}function td(i){const e=Math.abs(i),t=i<0?"Reverse · ":"";return e===0?"Paused":e<1/24?`${t}${Math.round(e*1440)} min/s`:e<1?`${t}${Number((e*24).toFixed(2))} hour/s`:e<7?`${t}${Number(e.toFixed(2))} day/s`:e<30.436875?`${t}${Number((e/7).toFixed(2))} week/s`:e<365.2425?`${t}${Number((e/30.436875).toFixed(2))} month/s`:`${t}${Number((e/365.2425).toFixed(2))} year/s`}const Ge={id:"moon",name:"Moon",radiusKm:1737.4,orbitalPeriodDays:27.321661,inclinationDeg:5.145,phase:.92,visualRadiusEarthRadius:.285,visualOrbitEarthRadii:4.35},je=[{id:"mercury",name:"Mercury",color:11184034,radiusKm:2439.7,distanceAu:.387,orbitalPeriodDays:87.969,eccentricity:.2056,inclinationDeg:7,rotationHours:1407.6,phase:.4},{id:"venus",name:"Venus",color:14792042,radiusKm:6051.8,distanceAu:.723,orbitalPeriodDays:224.701,eccentricity:.0068,inclinationDeg:3.39,rotationHours:-5832.5,phase:1.7},{id:"earth",name:"Earth",color:3900150,radiusKm:6371,distanceAu:1,orbitalPeriodDays:365.256,eccentricity:.0167,inclinationDeg:0,rotationHours:23.934,phase:3.1},{id:"mars",name:"Mars",color:13131575,radiusKm:3389.5,distanceAu:1.524,orbitalPeriodDays:686.98,eccentricity:.0934,inclinationDeg:1.85,rotationHours:24.623,phase:4.25},{id:"jupiter",name:"Jupiter",color:14004362,radiusKm:69911,distanceAu:5.203,orbitalPeriodDays:4332.59,eccentricity:.0489,inclinationDeg:1.3,rotationHours:9.925,phase:5.2},{id:"saturn",name:"Saturn",color:14995346,radiusKm:58232,distanceAu:9.537,orbitalPeriodDays:10759.22,eccentricity:.0565,inclinationDeg:2.49,rotationHours:10.656,phase:.9},{id:"uranus",name:"Uranus",color:9099240,radiusKm:25362,distanceAu:19.191,orbitalPeriodDays:30688.5,eccentricity:.0472,inclinationDeg:.77,rotationHours:-17.24,phase:2.4},{id:"neptune",name:"Neptune",color:4681448,radiusKm:24622,distanceAu:30.069,orbitalPeriodDays:60182,eccentricity:.0086,inclinationDeg:1.77,rotationHours:16.11,phase:4.8}],On=new Map(je.map(i=>[i.id,i])),ql=On.get("earth");if(!ql)throw new Error("Earth is missing from the solar-system catalog.");const Wt=ql,Ss=[{id:"sun",name:"Sun",kind:"star"},...je.map(i=>({id:i.id,name:i.name,kind:"planet"})),{id:Ge.id,name:Ge.name,kind:"moon"}],$l=new Map(Ss.map(i=>[i.id,i]));function Yl(i){return On.has(i)}function nd(i){return $l.has(i)}function Kl(i){return $l.get(i)?.name??i}const Nt=Math.PI*2,na=1495978707e-1,id=696340,Zl=384400/na,ia=1.05;function Er(i){const e=i%Nt;return e<0?e+Nt:e}function sd(i,e){let t=i;for(let n=0;n<6;n+=1)t-=(t-e*Math.sin(t)-i)/(1-e*Math.cos(t));return t}function wr(i,e){const t=i.distanceAu*(Math.cos(e)-i.eccentricity),n=i.distanceAu*Math.sqrt(1-i.eccentricity*i.eccentricity)*Math.sin(e),s=i.inclinationDeg*Math.PI/180;return{x:t,y:n*Math.sin(s),z:n*Math.cos(s)}}function ki(i,e){const t=Er(e/i.orbitalPeriodDays*Nt+i.phase);return wr(i,sd(t,i.eccentricity))}function ad(i,e){return e*24/i.rotationHours*Nt}function jl(i,e,t){const n=Math.max(1e-4,i);return e==="scientific"?n*ia*t:Math.log1p(n*1.55)*6.8*t}function Jl(i,e,t){const n=Math.max(1e-4,Math.hypot(i.x,i.y,i.z)),s=jl(n,e,t);return{x:i.x/n*s,y:i.y/n*s,z:i.z/n*s}}function Tr(i,e){return(.16+Math.cbrt(i.radiusKm/6371)*.25)*e}function bs(i){return{perihelionAu:i.distanceAu*(1-i.eccentricity),aphelionAu:i.distanceAu*(1+i.eccentricity)}}function Es(i,e,t){return Math.max(...i.map(n=>jl(bs(n).aphelionAu,e,t)))}function Ql(i,e,t,n){const s=ia*n,a=i.radiusKm/na*s,r=Tr(i,t)*.78;if(i.id==="earth"){const x=Zl*s;return Math.max(a,Math.min(r,x*.14))}const o=[...e].sort((x,p)=>x.distanceAu-p.distanceAu),l=o.findIndex(x=>x.id===i.id),c=bs(i),h=l>0?bs(o[l-1]):void 0,d=l>=0&&l<o.length-1?bs(o[l+1]):void 0,u=Math.max(1e-6,c.perihelionAu-(h?.aphelionAu??0)),m=d?Math.max(1e-6,d.perihelionAu-c.aphelionAu):u,g=Math.min(u,m)*.12*s;return Math.max(a,Math.min(r,g))}function Ar(i,e){const t=ia*e,n=id/na*t,s=[...i].sort((o,l)=>o.distanceAu-l.distanceAu)[0],r=(s?bs(s).perihelionAu:.3)*.16*t;return Math.max(n,Math.min(.2*e,r))}function ec(i,e,t){const n=ia*t,s=i.radiusKm/na*n,a=Zl*n*.09;return Math.max(s,Math.min(sa(i,e),a))}function Rr(i,e){return Er(e/i.orbitalPeriodDays*Nt+i.phase)}function tc(i,e){return e*i.visualOrbitEarthRadii}function sa(i,e){return e*i.visualRadiusEarthRadius}const nc=384400/1495978707e-1,rd=23.4392911,Mi=180/Math.PI,ws=Math.PI/180;function od(i,e){return{x:i.x-e.x,y:i.y-e.y,z:i.z-e.z}}function ld(i,e){return{x:i.x+e.x,y:i.y+e.y,z:i.z+e.z}}function Ts(i){return Math.hypot(i.x,i.y,i.z)}function Cr(i,e,t){return Math.max(e,Math.min(t,i))}function yi(i){const e=i%360;return e<0?e+360:e}function cd(i){const e=rd*ws,t=i.x,n=i.z*Math.cos(e)-i.y*Math.sin(e),s=i.z*Math.sin(e)+i.y*Math.cos(e),a=Math.max(1e-12,Math.hypot(t,n,s));return{rightAscensionDeg:yi(Math.atan2(n,t)*Mi),declinationDeg:Math.asin(Cr(s/a,-1,1))*Mi}}function ic(i){const e=Math.max(1e-12,Ts(i));return{longitudeDeg:yi(Math.atan2(i.z,i.x)*Mi),latitudeDeg:Math.asin(Cr(i.y/e,-1,1))*Mi}}function hd(i){const e=Rr(Ge,i),t=Ge.inclinationDeg*ws,n=Math.sin(e)*nc;return{x:Math.cos(e)*nc,y:n*Math.sin(t),z:n*Math.cos(t)}}function ud(i){return["N","NE","E","SE","S","SW","W","NW"][Math.round(yi(i)/45)%8]}const dd={id:"project-kepler-educational-v1",name:"Project Baseline Kepler Provider",version:"1.0.0",source:"Project-maintained rounded planetary constants and deterministic Kepler solver",licence:"Project source; factual astronomical constants are not treated as proprietary content",supportedStartIso:"1900-01-01T00:00:00.000Z",supportedEndIso:"2100-12-31T23:59:59.999Z",coordinateSystem:"Simplified heliocentric ecliptic frame; project x/z orbital plane and y ecliptic north",epoch:"Simulation epoch 2026-01-01T00:00:00.000Z",expectedError:"Educational model only. Planet and event output is not suitable for navigation or civil eclipse prediction.",knownLimitations:["Uses fixed rounded orbital elements rather than time-varying osculating elements.","Does not include perturbations, precession, nutation, aberration or light-time correction.","Moon orbit uses a fixed inclination and simplified circular distance.","Eclipse results represent geometric teaching candidates, not authoritative local circumstances."],lastValidatedIso:"2026-07-30T00:00:00.000Z",precision:"educational",installed:!0};class fd{metadata=dd;earthPosition(e){return ki(Wt,e)}bodyState(e,t){const n=this.earthPosition(t);let s;if(e==="sun")s={x:0,y:0,z:0};else if(e==="moon")s=ld(n,hd(t));else if(Yl(e)){const l=On.get(e);if(!l)throw new Error(`Unknown planet: ${e}`);s=ki(l,t)}else throw new Error(`Unknown celestial object: ${e}`);const a=e==="earth"?{x:0,y:0,z:0}:od(s,n),r=ic(a),o=cd(a);return{id:e,simulationDays:t,heliocentricAu:s,geocentricAu:a,heliocentricDistanceAu:Ts(s),geocentricDistanceAu:Ts(a),eclipticLongitudeDeg:r.longitudeDeg,eclipticLatitudeDeg:r.latitudeDeg,rightAscensionDeg:o.rightAscensionDeg,declinationDeg:o.declinationDeg}}moonPhase(e){const t=this.bodyState("moon",e).geocentricAu,n=this.bodyState("sun",e).geocentricAu,s=t.x*n.x+t.y*n.y+t.z*n.z,a=Math.max(1e-12,Ts(t)),r=Math.max(1e-12,Ts(n)),o=Math.acos(Cr(s/(a*r),-1,1)),l=n.x*t.z-n.z*t.x,h=Er(l<0?Nt-o:o)*Mi,d=(1-Math.cos(o))/2;let u;return h<22.5||h>=337.5?u="New Moon":h<67.5?u="Waxing Crescent":h<112.5?u="First Quarter":h<157.5?u="Waxing Gibbous":h<202.5?u="Full Moon":h<247.5?u="Waning Gibbous":h<292.5?u="Last Quarter":u="Waning Crescent",{elongationDeg:h,illuminatedFraction:d,phaseName:u,eclipticLatitudeDeg:ic(t).latitudeDeg}}horizontalPosition(e,t,n){if(e==="earth")return{altitudeDeg:-90,azimuthDeg:0,hourAngleDeg:0,visibleAboveHorizon:!1,cardinal:"N"};const s=this.bodyState(e,t),r=zi(t).getTime()/864e5+24405875e-1,o=yi(280.46061837+360.98564736629*(r-2451545)),l=yi(o+n.longitudeDeg),c=yi(l-s.rightAscensionDeg+180)-180,h=n.latitudeDeg*ws,d=s.declinationDeg*ws,u=c*ws,m=Math.asin(Math.sin(h)*Math.sin(d)+Math.cos(h)*Math.cos(d)*Math.cos(u)),g=Math.atan2(-Math.sin(u),Math.tan(d)*Math.cos(h)-Math.sin(h)*Math.cos(u)),x=m*Mi,p=yi(g*Mi);return{altitudeDeg:x,azimuthDeg:p,hourAngleDeg:c,visibleAboveHorizon:x>=0,cardinal:ud(p)}}}const ut=new fd;class pd{activeProvider=ut;providerFactories=new Map;get provider(){return this.activeProvider}get metadata(){return this.activeProvider.metadata}registerProvider(e){this.providerFactories.set(e.id,e)}listProviders(){return[{id:ut.metadata.id,label:ut.metadata.name,installed:!0,active:this.activeProvider.metadata.id===ut.metadata.id},...[...this.providerFactories.values()].map(e=>({id:e.id,label:e.label,installed:!1,active:this.activeProvider.metadata.id===e.id}))]}async activateProvider(e){if(e===ut.metadata.id)return this.activeProvider=ut,this.activeProvider.metadata;const t=this.providerFactories.get(e);if(!t)throw new Error(`Astronomy provider is not registered: ${e}`);const n=await t.load();if(!n.metadata.installed)throw new Error(`${n.metadata.name} is not installed.`);return this.activeProvider=n,n.metadata}bodyState(e,t){return this.activeProvider.bodyState(e,t)}moonPhase(e){return this.activeProvider.moonPhase(e)}}const Ut=new pd;Ut.registerProvider({id:"high-precision-package",label:"High-precision ephemeris package",async load(){throw new Error("No high-precision ephemeris package is installed. The offline educational provider remains active.")}});const sc=180/Math.PI,ac=Math.PI/180;function rc(i){const e=i%Nt;return e<0?e+Nt:e}function aa(i){const e=rc(i+Math.PI)-Math.PI;return e===-Math.PI?Math.PI:e}function oc(i,e){let t=i;for(;t-e>Math.PI;)t-=Nt;for(;t-e<-Math.PI;)t+=Nt;return t}function md(i,e,t,n,s,a,r=30){let o=e,l=t,c=s,h=a,d=c-n;for(let u=0;u<r;u+=1){const m=(o+l)/2,g=(c+h)/2,x=oc(i(m),g),p=x-n;if(Math.abs(p)<1e-9)return m;Math.sign(p)===Math.sign(d)?(o=m,c=x,d=p):(l=m,h=x)}return(o+l)/2}function gd(i,e,t,n,s){const a=[];let o=t,l=i(o);for(let c=t+s;c<=n+1e-9;c+=s){const h=Math.min(c,n),d=oc(i(h),l),u=Math.min(l,d),m=Math.max(l,d),g=Math.ceil((u-e-1e-10)/Nt),x=Math.floor((m-e+1e-10)/Nt);for(let p=g;p<=x;p+=1){const f=e+p*Nt,S=d>l&&f>l+1e-10&&f<=d+1e-10,T=d<l&&f<l-1e-10&&f>=d-1e-10;if(!S&&!T)continue;const y=md(i,o,h,f,l,d);(!a.length||Math.abs(y-a[a.length-1])>s*.5)&&a.push(y)}o=h,l=d}return a}function ra(i,e,t){return`${i}-${e}-${t.toFixed(5)}`}function oa(i){return zi(i).toISOString()}function _d(i,e,t,n,s=30){let a=e,r=t,o=aa(i(a)-n);for(let l=0;l<s;l+=1){const c=(a+r)/2,h=aa(i(c)-n);if(Math.abs(h)<1e-9)return c;Math.sign(h)===Math.sign(o)?(a=c,o=h):r=c}return(a+r)/2}function lc(i,e,t,n,s){const a=[];let r=t,o=aa(i(r)-e);for(let l=t+s;l<=n+1e-9;l+=s){const c=Math.min(l,n),h=aa(i(c)-e);if(Math.abs(o-h)<Math.PI&&(o<=0&&h>0||o>=0&&h<0)){const u=_d(i,r,c,e);(!a.length||Math.abs(u-a[a.length-1])>s*.5)&&a.push(u)}r=c,o=h}return a}function la(i,e){const t=Ut.bodyState(i,e).eclipticLongitudeDeg*ac,n=Ut.bodyState("sun",e).eclipticLongitudeDeg*ac;return rc(t-n)}function vd(i){return la("moon",i)}function cc(i,e,t){const n=On.get(i);if(!n)return;const s=t/n.orbitalPeriodDays*Nt+n.phase,a=Math.ceil((s-e)/Nt);let r=(e+a*Nt-n.phase)/Nt*n.orbitalPeriodDays;return r<t-1e-8&&(r+=n.orbitalPeriodDays),r}function xd(i,e,t){const n=Ut.moonPhase(t),s=la("moon",t)*sc,a={"new-moon":"New Moon","first-quarter":"First Quarter Moon","full-moon":"Full Moon","last-quarter":"Last Quarter Moon"};return{id:ra(i,"moon",t),type:i,objectId:"moon",secondaryObjectId:"sun",simulationDays:t,dateIso:oa(t),title:a[i]??"Moon phase",summary:`${n.phaseName} at ${(n.illuminatedFraction*100).toFixed(1)}% illuminated in the installed educational model.`,accuracy:"Educational Accuracy",confidence:"educational",details:{phaseLongitudeDeg:Number(s.toFixed(6)),targetPhaseLongitudeDeg:Number((e*sc).toFixed(6)),elongationDeg:Number(n.elongationDeg.toFixed(4)),illuminatedFraction:Number(n.illuminatedFraction.toFixed(6)),lunarEclipticLatitudeDeg:Number(n.eclipticLatitudeDeg.toFixed(4))}}}function Md(i,e){const t=Ut.moonPhase(e);Math.abs(t.eclipticLatitudeDeg);const n=i==="solar-eclipse";return{id:ra(i,"moon",e),type:i,objectId:"moon",secondaryObjectId:"sun",simulationDays:e,dateIso:oa(e),title:n?"Solar Eclipse Geometry":"Lunar Eclipse Geometry",summary:n?"The model places the Moon near the Sun and close to an orbital node. Local visibility requires a higher-precision provider.":"The model places the Moon opposite the Sun and close to an orbital node. Local visibility requires a higher-precision provider.",accuracy:"Educational Accuracy",confidence:"educational",details:{lunarEclipticLatitudeDeg:Number(t.eclipticLatitudeDeg.toFixed(4)),nodeThresholdDeg:1.65,localCircumstancesAuthoritative:!1}}}function hc(i,e,t){const n=Ut.bodyState(e,t),s=i==="conjunction"?0:180,a=On.get(e)?.name??e;return{id:ra(i,e,t),type:i,objectId:e,secondaryObjectId:"sun",simulationDays:t,dateIso:oa(t),title:`${a} ${i==="conjunction"?"Conjunction":"Opposition"}`,summary:`${a} reaches an educational-model Sun separation near ${s}°.`,accuracy:"Educational Accuracy",confidence:"educational",details:{geocentricDistanceAu:Number(n.geocentricDistanceAu.toFixed(6)),targetSeparationDeg:s}}}function uc(i,e,t){const n=On.get(e),s=Ut.bodyState(e,t),a=n?.name??e;return{id:ra(i,e,t),type:i,objectId:e,secondaryObjectId:"sun",simulationDays:t,dateIso:oa(t),title:`${a} ${i==="perihelion"?"Perihelion":"Aphelion"}`,summary:`${a} reaches its ${i==="perihelion"?"minimum":"maximum"} modelled distance from the Sun.`,accuracy:"Educational Accuracy",confidence:"educational",details:{heliocentricDistanceAu:Number(s.heliocentricDistanceAu.toFixed(6)),eccentricity:n?.eccentricity??0}}}class yd{moonPhaseEvents(e,t=120){return[["new-moon",0],["first-quarter",Math.PI/2],["full-moon",Math.PI],["last-quarter",Math.PI*3/2]].flatMap(([s,a])=>gd(vd,a,e,e+t,.25).map(r=>xd(s,a,r))).sort((s,a)=>s.simulationDays-a.simulationDays)}eclipseEvents(e,t=1100){return this.moonPhaseEvents(e,t).filter(s=>s.type==="new-moon"||s.type==="full-moon").filter(s=>Math.abs(Number(s.details.lunarEclipticLatitudeDeg))<=1.65).map(s=>Md(s.type==="new-moon"?"solar-eclipse":"lunar-eclipse",s.simulationDays))}conjunctionOppositionEvents(e,t,n=1200){if(!On.has(e)||e==="earth")return[];const s=On.get(e),a=s&&s.orbitalPeriodDays<700?.5:2,r=lc(l=>la(e,l),0,t,t+n,a).map(l=>hc("conjunction",e,l)),o=s&&s.distanceAu>1?lc(l=>la(e,l),Math.PI,t,t+n,a).map(l=>hc("opposition",e,l)):[];return[...r,...o].sort((l,c)=>l.simulationDays-c.simulationDays)}apsisEvents(e,t,n=2){const s=cc(e,0,t),a=cc(e,Math.PI,t),r=On.get(e);if(!r||s===void 0||a===void 0)return[];const o=[];for(let l=0;l<n;l+=1)o.push(uc("perihelion",e,s+l*r.orbitalPeriodDays)),o.push(uc("aphelion",e,a+l*r.orbitalPeriodDays));return o.sort((l,c)=>l.simulationDays-c.simulationDays)}catalogue(e,t="earth"){const n=t!=="sun"&&t!=="earth"&&t!=="moon"?t:"mars",s=this.moonPhaseEvents(e,80),a=this.eclipseEvents(e,1100).slice(0,4),r=this.conjunctionOppositionEvents(n,e,1200).slice(0,4),o=this.apsisEvents("earth",e,2);return[...s,...a,...r,...o].filter(l=>l.simulationDays>=e-1e-7).sort((l,c)=>l.simulationDays-c.simulationDays).slice(0,24)}}const Vi=new yd,Sd={mercury:{id:"mercury",name:"Mercury",objectType:"Terrestrial planet",description:"The smallest planet and the closest planet to the Sun.",massKg:33011e19,surfaceGravityMs2:3.7,rotationPeriod:"58.6 Earth days",meanTemperature:"About 167 °C mean surface temperature",axialTiltDeg:.034,atmosphere:"Extremely thin exosphere, mainly oxygen, sodium, hydrogen, helium and potassium.",exploration:"Visited by Mariner 10 and MESSENGER; BepiColombo is designed for detailed Mercury science.",sourceNote:"Rounded educational constants compiled for the project baseline."},venus:{id:"venus",name:"Venus",objectType:"Terrestrial planet",description:"A cloud-covered planet with a dense carbon-dioxide atmosphere and extreme greenhouse heating.",massKg:48675e20,surfaceGravityMs2:8.87,rotationPeriod:"243 Earth days, retrograde",meanTemperature:"About 464 °C at the surface",axialTiltDeg:177.4,atmosphere:"Mostly carbon dioxide with nitrogen and sulfuric-acid cloud layers.",exploration:"Studied by Venera landers, Magellan radar mapping and several atmospheric missions.",sourceNote:"Rounded educational constants compiled for the project baseline."},earth:{id:"earth",name:"Earth",objectType:"Terrestrial planet",description:"The ocean-rich planet that supports known life and serves as the observer reference for this release.",massKg:597237e19,surfaceGravityMs2:9.80665,rotationPeriod:"23 h 56 min sidereal day",meanTemperature:"About 15 °C global mean surface temperature",axialTiltDeg:23.44,atmosphere:"Mostly nitrogen and oxygen, with water vapour and trace gases.",exploration:"Continuously observed by ground networks and Earth-observing spacecraft.",sourceNote:"Rounded educational constants compiled for the project baseline."},mars:{id:"mars",name:"Mars",objectType:"Terrestrial planet",description:"A cold desert planet with iron-rich terrain, polar caps and evidence of ancient water activity.",massKg:64171e19,surfaceGravityMs2:3.721,rotationPeriod:"24 h 37 min",meanTemperature:"About −63 °C mean surface temperature",axialTiltDeg:25.19,atmosphere:"Thin atmosphere dominated by carbon dioxide, with nitrogen and argon.",exploration:"Explored by orbiters, landers and rovers including long-running surface science missions.",sourceNote:"Rounded educational constants compiled for the project baseline."},jupiter:{id:"jupiter",name:"Jupiter",objectType:"Gas giant",description:"The largest planet, with powerful storms, rapid rotation and a strong magnetic environment.",massKg:18982e23,surfaceGravityMs2:24.79,rotationPeriod:"About 9 h 55 min",meanTemperature:"About −110 °C near the 1-bar cloud level",axialTiltDeg:3.13,atmosphere:"Mostly hydrogen and helium with ammonia, methane, water and complex cloud chemistry.",exploration:"Studied by fly-bys, the Galileo orbiter and the Juno mission.",sourceNote:"Rounded educational constants compiled for the project baseline."},saturn:{id:"saturn",name:"Saturn",objectType:"Gas giant",description:"A low-density giant planet surrounded by a broad and complex ring system.",massKg:56834e22,surfaceGravityMs2:10.44,rotationPeriod:"About 10 h 42 min",meanTemperature:"About −140 °C near the 1-bar cloud level",axialTiltDeg:26.73,atmosphere:"Mostly hydrogen and helium, with ammonia, methane and layered clouds.",exploration:"Observed by multiple fly-bys and studied in depth by the Cassini orbiter.",sourceNote:"Rounded educational constants compiled for the project baseline."},uranus:{id:"uranus",name:"Uranus",objectType:"Ice giant",description:"An ice giant rotating on its side, with a subdued atmosphere, rings and an unusual magnetic field.",massKg:8681e22,surfaceGravityMs2:8.69,rotationPeriod:"About 17 h 14 min, retrograde",meanTemperature:"About −195 °C near the cloud tops",axialTiltDeg:97.77,atmosphere:"Hydrogen, helium and methane above water, ammonia and methane-rich interior layers.",exploration:"Visited closely by Voyager 2 and observed remotely by space and ground telescopes.",sourceNote:"Rounded educational constants compiled for the project baseline."},neptune:{id:"neptune",name:"Neptune",objectType:"Ice giant",description:"A distant blue ice giant with fast winds, storms and an active atmosphere.",massKg:102413e21,surfaceGravityMs2:11.15,rotationPeriod:"About 16 h 7 min",meanTemperature:"About −200 °C near the cloud tops",axialTiltDeg:28.32,atmosphere:"Hydrogen, helium and methane with deeper volatile-rich layers.",exploration:"Visited by Voyager 2 and monitored remotely for atmospheric change.",sourceNote:"Rounded educational constants compiled for the project baseline."}},dc={id:"sun",name:"Sun",objectType:"G-type main-sequence star",description:"The central star whose gravity and radiation dominate the Solar System.",radiusKm:696340,massKg:19885e26,surfaceGravityMs2:274,rotationPeriod:"About 25 days at the equator",orbitalPeriod:"Solar System reference centre",meanTemperature:"About 5,772 K effective photosphere temperature",distanceFromSun:"0 AU",axialTiltDeg:7.25,atmosphere:"Photosphere, chromosphere, transition region and corona above the convective surface layers.",exploration:"Observed continuously from Earth and by dedicated solar observatories and heliophysics missions.",sourceNote:"Rounded educational constants compiled for the project baseline."},bd={id:"moon",name:"Moon",objectType:"Natural satellite",description:"Earth’s natural satellite, responsible for familiar phase cycles and a major influence on tides.",radiusKm:Ge.radiusKm,massKg:7342e19,surfaceGravityMs2:1.62,rotationPeriod:"27.3 days, tidally locked",orbitalPeriod:`${Ge.orbitalPeriodDays.toFixed(3)} days`,meanTemperature:"Large day–night range; roughly −20 °C global mean estimate",distanceFromSun:"Travels with Earth near 1 AU",axialTiltDeg:6.68,atmosphere:"Extremely tenuous exosphere.",exploration:"Visited by robotic orbiters and landers and by human Apollo surface missions.",sourceNote:"Rounded educational constants compiled for the project baseline."},Ed=new Map([["sun",dc],...je.map(i=>{const e=Sd[i.id],t=i.distanceAu*(1-i.eccentricity),n=i.distanceAu*(1+i.eccentricity);return[i.id,{...e,radiusKm:i.radiusKm,orbitalPeriod:`${i.orbitalPeriodDays.toLocaleString("en-US",{maximumFractionDigits:3})} days`,distanceFromSun:`${i.distanceAu.toFixed(3)} AU mean orbital distance`,perihelionAu:t,aphelionAu:n}]}),["moon",bd]]);function wd(i){return Ed.get(i)??dc}const fc="solar-explorer-v06-observer-locations",ca="solar-explorer-v06-active-location",ha=[{id:"singapore",name:"Singapore",latitudeDeg:1.3521,longitudeDeg:103.8198,timeZone:"Asia/Singapore",builtin:!0},{id:"tokyo",name:"Tokyo",latitudeDeg:35.6762,longitudeDeg:139.6503,timeZone:"Asia/Tokyo",builtin:!0},{id:"london",name:"London",latitudeDeg:51.5074,longitudeDeg:-.1278,timeZone:"Europe/London",builtin:!0},{id:"new-york",name:"New York",latitudeDeg:40.7128,longitudeDeg:-74.006,timeZone:"America/New_York",builtin:!0},{id:"sydney",name:"Sydney",latitudeDeg:-33.8688,longitudeDeg:151.2093,timeZone:"Australia/Sydney",builtin:!0}];function Td(i){if(!i||typeof i!="object")return!1;const e=i;return typeof e.id=="string"&&typeof e.name=="string"&&Number.isFinite(e.latitudeDeg)&&Number.isFinite(e.longitudeDeg)&&typeof e.timeZone=="string"&&Math.abs(e.latitudeDeg??999)<=90&&Math.abs(e.longitudeDeg??999)<=180}function pc(i){try{return new Intl.DateTimeFormat("en",{timeZone:i}).format(new Date),i}catch{return"UTC"}}function Ad(){if(typeof localStorage>"u")return[];try{return JSON.parse(localStorage.getItem(fc)??"[]").filter(Td).map(e=>({...e,builtin:!1}))}catch{return[]}}class Rd{savedLocations=Ad();list(){return[...ha,...this.savedLocations]}active(){const e=typeof localStorage>"u"?null:localStorage.getItem(ca);return this.list().find(t=>t.id===e)??ha[0]}setActive(e){const t=this.list().find(n=>n.id===e);if(!t)throw new Error("Observer location was not found.");return typeof localStorage<"u"&&localStorage.setItem(ca,t.id),t}save(e,t,n,s="UTC"){const a=e.trim();if(!a)throw new Error("Location name is required.");if(!Number.isFinite(t)||t<-90||t>90)throw new Error("Latitude must be between -90 and 90 degrees.");if(!Number.isFinite(n)||n<-180||n>180)throw new Error("Longitude must be between -180 and 180 degrees.");const r=`custom-${Date.now().toString(36)}-${Math.abs(Math.round(t*1e3)).toString(36)}`,o={id:r,name:a,latitudeDeg:t,longitudeDeg:n,timeZone:pc(s),builtin:!1};return this.savedLocations=[...this.savedLocations,o],this.persist(),this.setActive(r),o}remove(e){ha.some(t=>t.id===e)||(this.savedLocations=this.savedLocations.filter(t=>t.id!==e),this.persist(),typeof localStorage<"u"&&localStorage.getItem(ca)===e&&localStorage.setItem(ca,ha[0].id))}fromDevice(e){return this.save("Device location",e.coords.latitude,e.coords.longitude,Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC")}compare(e,t,n=this.list()){const s=zi(t);return n.map(a=>({location:a,horizontal:ut.horizontalPosition(e,t,a),localTimeLabel:new Intl.DateTimeFormat("en",{dateStyle:"medium",timeStyle:"short",timeZone:pc(a.timeZone)}).format(s)}))}persist(){typeof localStorage<"u"&&localStorage.setItem(fc,JSON.stringify(this.savedLocations))}}const As=new Rd;function mc(i,e){return Math.hypot(i.x-e.x,i.y-e.y,i.z-e.z)}function Qt(i,e,t,n,s){return{id:i,title:e,passed:t,measured:n,threshold:s}}function gc(i){return i.length?i.reduce((e,t)=>e+t,0)/i.length:0}function Bn(i){return i.length?Math.max(...i):0}function Cd(i){const e=i%360;return e<0?e+360:e}function Pr(i,e){return Math.abs((i-e+540)%360-180)}function _c(i){const e=ut.bodyState(i.objectId,i.simulationDays),t=ut.bodyState("sun",i.simulationDays);return Cd(e.eclipticLongitudeDeg-t.eclipticLongitudeDeg)}function vc(i,e){const t=new Intl.DateTimeFormat("en-US",{timeZone:e,hour:"2-digit",hourCycle:"h23"}).formatToParts(i).find(n=>n.type==="hour")?.value;return Number(t)}function Pd(i,e){const t=ut.bodyState(i,e);return[t.heliocentricAu.x,t.heliocentricAu.y,t.heliocentricAu.z,t.geocentricAu.x,t.geocentricAu.y,t.geocentricAu.z,t.heliocentricDistanceAu,t.geocentricDistanceAu,t.eclipticLongitudeDeg,t.eclipticLatitudeDeg,t.rightAscensionDeg,t.declinationDeg].every(Number.isFinite)}let ua;function Dd(){return ua||(ua=Ld(),ua)}function Ld(){const i=ki(Wt,0),e=ki(Wt,Wt.orbitalPeriodDays),t=mc(i,e),n=ut.bodyState("moon",0).geocentricAu,s=ut.bodyState("moon",Ge.orbitalPeriodDays).geocentricAu,a=mc(n,s),r=Vi.moonPhaseEvents(0,80),o=r.filter(ae=>ae.type==="new-moon"),l=o.length>=2?o[1].simulationDays-o[0].simulationDays:Number.NaN,c=r.slice(0,4).map(ae=>ae.type).join(" → "),h=["new-moon","first-quarter","full-moon","last-quarter"],d=h.every(ae=>r.some(Le=>Le.type===ae)),u=r.every((ae,Le)=>{if(Le===0)return!0;const Oe=h.indexOf(r[Le-1].type);return h[(Oe+1)%h.length]===ae.type}),m={"new-moon":0,"first-quarter":90,"full-moon":180,"last-quarter":270},g=r.filter(ae=>ae.type in m).map(ae=>Pr(Number(ae.details.phaseLongitudeDeg),m[ae.type])),x=Vi.eclipseEvents(0,1100),p=x.map(ae=>Math.abs(Number(ae.details.lunarEclipticLatitudeDeg))),f=x.some(ae=>ae.type==="solar-eclipse")&&x.some(ae=>ae.type==="lunar-eclipse")&&p.every(ae=>ae<=1.65+1e-9),S=x.every(ae=>ae.details.localCircumstancesAuthoritative===!1&&ae.confidence==="educational"),T=Vi.conjunctionOppositionEvents("mars",0,1200),y=T.filter(ae=>ae.type==="conjunction"),R=T.filter(ae=>ae.type==="opposition"),b=y.map(ae=>Pr(_c(ae),0)),C=R.map(ae=>Pr(_c(ae),180)),v={id:"sg",name:"Singapore",latitudeDeg:1.3521,longitudeDeg:103.8198,timeZone:"Asia/Singapore"},w={id:"lon",name:"London",latitudeDeg:51.5074,longitudeDeg:-.1278,timeZone:"Europe/London"},D=ut.horizontalPosition("moon",100,v),P=ut.horizontalPosition("moon",100,w),U=Math.abs(D.altitudeDeg-P.altitudeDeg),X=new Date("2026-01-01T00:00:00.000Z"),q=vc(X,v.timeZone),B=vc(X,w.timeZone),W=(q-B+24)%24,H=Vi.apsisEvents("earth",0,1),Z=H.find(ae=>ae.type==="perihelion"),J=H.find(ae=>ae.type==="aphelion"),oe=!!(Z&&J&&Number(Z.details.heliocentricDistanceAu)<Number(J.details.heliocentricDistanceAu)),ne=Vi.catalogue(0,"mars"),fe=ne.every((ae,Le)=>Le===0||ae.simulationDays>=ne[Le-1].simulationDays),Ne=ne.every(ae=>Number.isFinite(ae.simulationDays)&&!Number.isNaN(Date.parse(ae.dateIso))),Ze=Sr(new Date(ut.metadata.supportedStartIso)),Ve=Sr(new Date(ut.metadata.supportedEndIso)),K=[Ze,Ve].flatMap(ae=>Ss.map(Le=>Pd(Le.id,ae))),re=K.length===Ss.length*2&&K.every(Boolean),te=[...b,...C],Ee=[t,a],Re=[...g,...te],xe=[Qt("earth-period-repeat","Earth returns to its modelled orbital position after one period",t<1e-9,`${t.toExponential(3)} AU vector error`,"< 1e-9 AU"),Qt("moon-period-repeat","Moon returns to its modelled geocentric orbital position after one period",a<1e-9,`${a.toExponential(3)} AU vector error`,"< 1e-9 AU"),Qt("moon-synodic-cycle","Successive New Moon events fall within the expected synodic-cycle range",Number.isFinite(l)&&l>27&&l<32,Number.isFinite(l)?`${l.toFixed(5)} days`:"Missing successive New Moon events","27–32 days"),Qt("moon-phase-catalogue","Moon phase event catalogue contains all four principal phases",d&&u&&Bn(g)<.001,`${c||"No events"}; max phase-longitude residual ${Bn(g).toExponential(3)}°`,`Cyclic ${h.join(" → ")}; residual < 0.001°`),Qt("eclipse-geometry-candidates","Eclipse teaching candidates require principal phase and proximity to a modelled orbital node",x.length>0&&f,`${x.length} candidates; max |lunar latitude| ${Bn(p).toFixed(4)}°`,"Solar and lunar candidates; |latitude| ≤ 1.65°"),Qt("eclipse-local-authority-guard","Eclipse candidates remain explicitly non-authoritative for local circumstances",x.length>0&&S,`${x.length}/${x.length} marked educational and localCircumstancesAuthoritative=false`,"All candidates non-authoritative"),Qt("mars-conjunction-residual","Mars conjunction events converge on the modelled Sun longitude",y.length>0&&Bn(b)<.001,`${y.length} events; max residual ${Bn(b).toExponential(3)}°`,"At least 1 event; residual < 0.001°"),Qt("mars-opposition-residual","Mars opposition events converge on 180° modelled Sun separation",R.length>0&&Bn(C)<.001,`${R.length} events; max residual ${Bn(C).toExponential(3)}°`,"At least 1 event; residual < 0.001°"),Qt("earth-apsis-order","Earth perihelion distance is smaller than aphelion distance",oe,Z&&J?`${Z.details.heliocentricDistanceAu} AU < ${J.details.heliocentricDistanceAu} AU`:"Missing apsis event","Perihelion < aphelion"),Qt("observer-location-difference","Different observer locations produce different altitude results",U>.01,`${U.toFixed(3)}° altitude difference`,"> 0.01°"),Qt("time-zone-conversion","Observer local-time conversion respects IANA time zones",q===8&&B===0&&W===8,`2026-01-01 00:00 UTC → Singapore ${String(q).padStart(2,"0")}:00, London ${String(B).padStart(2,"0")}:00`,"Singapore UTC+8 and London UTC+0 on test date"),Qt("event-catalogue-sorted","Event catalogue is finite and chronological",fe&&Ne&&ne.length>=8,`${ne.length} finite chronological events`,"At least 8 events, all finite and sorted"),Qt("verified-range-boundaries","Provider date-range boundaries produce finite states for every supported celestial object",Date.parse(ut.metadata.supportedStartIso)<Date.parse(ut.metadata.supportedEndIso)&&re,`${K.filter(Boolean).length}/${K.length} finite boundary states from ${ut.metadata.supportedStartIso.slice(0,10)} to ${ut.metadata.supportedEndIso.slice(0,10)}`,`${Ss.length*2} finite states at both boundaries`)],Ye=xe.filter(ae=>!ae.passed).length;return{version:Jt,generatedAtIso:new Date().toISOString(),provider:ut.metadata,checks:xe,passed:Ye===0,passCount:xe.length-Ye,failCount:Ye,testEventCount:r.length+x.length+T.length+H.length,verifiedDateRange:`${ut.metadata.supportedStartIso.slice(0,10)} to ${ut.metadata.supportedEndIso.slice(0,10)}`,errorMetrics:[{id:"orbital-repeat-vector-residual",title:"Orbital-period repeat vector residual",unit:"AU",sampleCount:Ee.length,average:gc(Ee),maximum:Bn(Ee),applicability:"Internal deterministic repetition check for the modelled Earth and Moon orbits."},{id:"event-angular-residual",title:"Principal-phase longitude and relative-event angular residual",unit:"degrees",sampleCount:Re.length,average:gc(Re),maximum:Bn(Re),applicability:"Internal solver residual only; not an absolute error against an external ephemeris dataset."}],sourceConflictStatus:"None detected — one installed baseline provider was active and no competing external ephemeris dataset was bundled.",changesFromV05:["Added Explore and Learn modes with Basic and Advanced scientific layers.","Added Moon phases, eclipse geometry, seasons and astronomical event lessons.","Added provider provenance, verified range, expected-error and limitation disclosures.","Added observer locations, altitude/azimuth, local time and multi-location comparison.","Added Learning Scale, Real Distance and Real Scale presentation modes.","Added deterministic forward/reverse Worker stepping with equivalent Canvas fallback behaviour."],visualSimplifications:["Learning Scale enlarges planets and compresses orbital distances.","Real Distance uses linear AU spacing and safety-bounded body enhancement; inner objects necessarily cluster in a full-system overview and become readable through Focus and locator labels.","Real Scale uses physical radius-to-AU ratios and relies on locator labels for visibility.","Eclipse graphics and candidate events are educational geometry, not authoritative local predictions."],knownLimitations:[...ut.metadata.knownLimitations]}}function xc(i){const e=zi(i).getTime();return e>=Date.parse(ut.metadata.supportedStartIso)&&e<=Date.parse(ut.metadata.supportedEndIso)}const Dr={unlimitedFuel:!0,fuelSimulation:!1,assistedNavigation:!0,launchWindowRestrictions:!1,autoPauseKeyEvents:!0,availableDeltaVKmS:18},Hi=Math.PI*2,Rs=1495978707e-1,Id=86400,Lr=132712440018,Mc=je.find(i=>i.id==="earth");if(!Mc)throw new Error("Earth is required by the trajectory engine.");const Si=Mc;function Ir(i,e,t){return Math.max(e,Math.min(t,i))}function zn(i){const e=i%Hi;return e<0?e+Hi:e}function Nd(i){const e=zn(i+Math.PI)-Math.PI;return e===-Math.PI?Math.PI:e}function Cs(i){return zn(Math.atan2(i.z,i.x))}function Nr(i){return Math.hypot(i.x,i.y,i.z)}function Ur(i,e){return Math.hypot(i.x-e.x,i.y-e.y,i.z-e.z)}function Ud(i){const e=je.find(t=>t.id===i);if(!e)throw new Error(`Unknown destination planet: ${i}`);return e}function da(i,e){const t=(i+e)/2*Rs;return Math.PI*Math.sqrt(t**3/Lr)/Id}function yc(i){return Math.sqrt(Lr/(i*Rs))}function Sc(i,e){const t=i*Rs,n=e*Rs;return Math.sqrt(Lr*(2/t-1/n))}function bi(i,e){const n={...Ut.bodyState("earth",i).heliocentricAu},s=Nr(n);let a=da(s,e.distanceAu),r=Ut.bodyState(e.id,i+a).heliocentricAu,o=Nr(r);for(let u=0;u<5;u+=1)a=da(s,o),r=Ut.bodyState(e.id,i+a).heliocentricAu,o=Nr(r);const l=Cs(n),c=Cs(r),h=zn(l+Math.PI),d=Nd(c-h);return{departureSimulationDays:i,durationDays:a,earthDeparture:n,destinationArrival:{...r},startRadiusAu:s,destinationRadiusAu:o,departureAngleRad:l,destinationArrivalAngleRad:c,phaseResidualRad:d}}function Fd(i){const e=Math.abs(1/Si.orbitalPeriodDays-1/i.orbitalPeriodDays);return e>0?1/e:Si.orbitalPeriodDays}function bc(i,e){return zn(Math.PI-Hi/i.orbitalPeriodDays*e)}function Od(i,e){if(e.id==="earth")return 0;const t=da(Si.distanceAu,e.distanceAu),n=bc(e,t),s=Ut.bodyState("earth",i).heliocentricAu,a=Ut.bodyState(e.id,i).heliocentricAu,r=zn(Cs(a)-Cs(s)),o=Hi/e.orbitalPeriodDays-Hi/Si.orbitalPeriodDays;return Math.abs(o)<1e-12?0:o>0?zn(n-r)/o:zn(r-n)/-o}function Bd(i,e){const t=bi(i,e);if(Math.abs(t.phaseResidualRad)<1e-5)return t;const n=Fd(e),s=Ir(n/240,.25,15),a=i+n*1.08+s;let r=t,o=Math.abs(t.phaseResidualRad);for(let p=i+s;p<=a;p+=s){const f=bi(p,e),S=Math.abs(f.phaseResidualRad);S<o&&(r=f,o=S)}let l=Math.max(i,r.departureSimulationDays-s),c=r.departureSimulationDays+s;const h=(Math.sqrt(5)-1)/2;let d=c-(c-l)*h,u=l+(c-l)*h,m=Math.abs(bi(d,e).phaseResidualRad),g=Math.abs(bi(u,e).phaseResidualRad);for(let p=0;p<42;p+=1)m<=g?(c=u,u=d,g=m,d=c-(c-l)*h,m=Math.abs(bi(d,e).phaseResidualRad)):(l=d,d=u,m=g,u=l+(c-l)*h,g=Math.abs(bi(u,e).phaseResidualRad));const x=bi((l+c)/2,e);return Math.abs(x.phaseResidualRad)<o?x:r}function zd(i,e=181){const t=i.destinationRadiusAu>=i.startRadiusAu,n=(i.startRadiusAu+i.destinationRadiusAu)/2,s=Math.abs(i.destinationRadiusAu-i.startRadiusAu)/(i.destinationRadiusAu+i.startRadiusAu),a=n*(1-s**2),r=t?i.departureAngleRad:i.departureAngleRad-Math.PI,o=[];let l=0,c,h=i.destinationArrival;for(let d=0;d<e;d+=1){const u=d/(e-1),m=t?Math.PI*u:Math.PI+Math.PI*u,g=a/Math.max(1e-9,1+s*Math.cos(m)),x=r+m,p={x:Math.cos(x)*g,y:i.earthDeparture.y+(i.destinationArrival.y-i.earthDeparture.y)*u,z:Math.sin(x)*g};d===e-1&&(h=p);const f=d===0?i.earthDeparture:d===e-1?i.destinationArrival:p;c&&(l+=Ur(c,f)),c=f,o.push({progress:u,simulationDays:i.departureSimulationDays+i.durationDays*u,positionAu:{...f}})}return{points:o,interceptResidualAu:Ur(h,i.destinationArrival),distanceAu:l}}function kd(i,e=97){const t=Ut.bodyState("earth",i).heliocentricAu,n=42164/Rs,s=.5;return Array.from({length:e},(a,r)=>{const o=r/(e-1),l=o*Hi;return{progress:o,simulationDays:i+s*o,positionAu:{x:t.x+Math.cos(l)*n,y:t.y+Math.sin(l*2)*n*.08,z:t.z+Math.sin(l)*n}}})}function Ec(i){return i==="earth"?"introductory":i==="mercury"||i==="venus"||i==="mars"?"inner-system":i==="jupiter"||i==="saturn"?"outer-system":"deep-space"}function Vd(i,e){return i.id==="earth"?"Local Earth-orbit systems demonstration before interplanetary departure.":e==="inner-system"?"Shorter transfer with a comparatively frequent launch opportunity.":e==="outer-system"?"Multi-year robotic mission requiring a larger heliocentric energy change.":"Long-duration deep-space robotic mission with sparse launch opportunities."}function wc(i,e,t,n){return i.id==="earth"?[{kind:"earth-orbit",label:"Earth Orbit Demonstration",supported:e==="orbiter",selected:!0,summary:"A deterministic local orbital rehearsal using the shared Simulation Clock.",scientificReason:e==="flyby"?"A fly-by mission is not meaningful when launch origin and destination are both Earth.":void 0,durationDays:t,requiredDeltaVKmS:n},{kind:"direct",label:"Direct Transfer",supported:!1,selected:!1,summary:"Not applicable to the local Earth-orbit rehearsal."},{kind:"gravity-assist",label:"Gravity Assist",supported:!1,selected:!1,summary:"Not applicable to the local Earth-orbit rehearsal."}]:[{kind:"hohmann",label:"Hohmann Transfer",supported:!0,selected:!0,summary:"Two-impulse minimum-energy transfer in an idealised heliocentric two-body model.",durationDays:t,requiredDeltaVKmS:n},{kind:"direct",label:"Direct Transfer",supported:!1,selected:!1,summary:"Unavailable in the installed offline baseline.",scientificReason:"A valid direct intercept requires a Lambert boundary-value solver and propulsion model; v0.7 does not invent that trajectory."},{kind:"gravity-assist",label:"Gravity Assist",supported:!1,selected:!1,summary:"Unavailable in the installed offline baseline.",scientificReason:"A valid gravity-assist route requires patched-conic or N-body encounter solving and body-specific fly-by constraints."}]}function Tc(i,e,t){return[{id:"departure",label:"Departure burn",simulationDays:i,progress:0,autoPauseRecommended:!0},{id:"course-correction",label:"Mid-course correction",simulationDays:i+e*.5,progress:.5,autoPauseRecommended:!0},{id:"approach",label:"Destination approach",simulationDays:i+e*.9,progress:.9,autoPauseRecommended:!0},{id:"arrival",label:t==="orbiter"?"Orbital insertion":"Closest approach",simulationDays:i+e,progress:1,autoPauseRecommended:!0}]}class Hd{destinationCatalogue(e){return je.map(t=>{const n=Ec(t.id);return{id:t.id,name:t.name,distanceAu:t.distanceAu,estimatedDurationDays:t.id==="earth"?.5:da(Si.distanceAu,t.distanceAu),nextLaunchWindowDays:Od(e,t),complexity:n,description:Vd(t,n)}})}plan(e){const t=Ud(e.destinationId),n={...Dr,...e.realism};if(t.id==="earth")return this.planEarthOrbit(e,t,n);const s=Bd(e.simulationDays,t),a=zd(s),r=(s.startRadiusAu+s.destinationRadiusAu)/2,o=Math.abs(Sc(s.startRadiusAu,r)-yc(s.startRadiusAu)),l=Math.abs(yc(s.destinationRadiusAu)-Sc(s.destinationRadiusAu,r)),c=Math.max(.05,(o+(e.missionType==="orbiter"?l:0))*.08),h=o+(e.missionType==="orbiter"?l:0)+c,d=n.unlimitedFuel||!n.fuelSimulation?100:Ir((1-h/n.availableDeltaVKmS)*100,0,100),u=n.unlimitedFuel||!n.fuelSimulation||h<=n.availableDeltaVKmS,m=bc(t,s.durationDays),g=Ut.bodyState(t.id,s.departureSimulationDays).heliocentricAu,x=zn(Cs(g)-s.departureAngleRad),p=u&&Math.abs(s.phaseResidualRad)<Math.PI/180,f=u?Math.abs(s.phaseResidualRad)>=Math.PI/180?"No Hohmann launch solution converged within the installed educational model threshold.":void 0:`The simplified ${n.availableDeltaVKmS.toFixed(1)} km/s mission budget is below the ${h.toFixed(2)} km/s requirement.`,S=s.departureSimulationDays,T=S+s.durationDays;return{id:`mission-earth-${t.id}-${e.missionType}-${S.toFixed(5)}`,version:"1.0",valid:p,rejectionReason:f,originId:"earth",destinationId:t.id,destinationName:t.name,missionType:e.missionType,routeKind:"hohmann",complexity:Ec(t.id),plannedAtSimulationDays:e.simulationDays,departureSimulationDays:S,arrivalSimulationDays:T,durationDays:s.durationDays,launchWindowWaitDays:Math.max(0,S-e.simulationDays),transferDistanceAu:a.distanceAu,startRadiusAu:s.startRadiusAu,destinationRadiusAu:s.destinationRadiusAu,requiredPhaseAngleDeg:zn(m)*180/Math.PI,actualPhaseAngleDeg:x*180/Math.PI,launchPhaseResidualDeg:Math.abs(s.phaseResidualRad)*180/Math.PI,interceptResidualAu:a.interceptResidualAu,departureDeltaVKmS:o,arrivalDeltaVKmS:l,correctionReserveDeltaVKmS:c,requiredDeltaVKmS:h,fuelRemainingPercent:d,realism:n,routeOptions:wc(t,e.missionType,s.durationDays,h),trajectory:a.points,keyEvents:Tc(S,s.durationDays,e.missionType),calculationModel:"Idealised heliocentric two-body Hohmann transfer using modelled departure/arrival radii and a solved launch phase.",accuracyLabel:"Educational Accuracy",limitations:["The route omits planetary perturbations, plane-change optimisation, finite burn duration, launch-site geometry and atmospheric launch.","Delta-v values are ideal heliocentric impulsive changes and do not include a real launch vehicle or parking-orbit escape model.","Direct and gravity-assist routes are rejected until dedicated Lambert and patched-conic solvers are installed.","The spacecraft path is suitable for education and deterministic simulation, not operational mission design or navigation."]}}planEarthOrbit(e,t,n){const r=e.missionType==="orbiter"&&(n.unlimitedFuel||!n.fuelSimulation||.15<=n.availableDeltaVKmS),o=e.missionType!=="orbiter"?"Earth is available as an orbital rehearsal; select Orbiter rather than Fly-by.":r?void 0:"The selected simplified fuel budget is insufficient for the Earth-orbit rehearsal.",l=kd(e.simulationDays);return{id:`mission-earth-earth-orbiter-${e.simulationDays.toFixed(5)}`,version:"1.0",valid:r,rejectionReason:o,originId:"earth",destinationId:t.id,destinationName:t.name,missionType:e.missionType,routeKind:"earth-orbit",complexity:"introductory",plannedAtSimulationDays:e.simulationDays,departureSimulationDays:e.simulationDays,arrivalSimulationDays:e.simulationDays+.5,durationDays:.5,launchWindowWaitDays:0,transferDistanceAu:l.reduce((c,h,d)=>d===0?0:c+Ur(h.positionAu,l[d-1].positionAu),0),startRadiusAu:Si.distanceAu,destinationRadiusAu:Si.distanceAu,requiredPhaseAngleDeg:0,actualPhaseAngleDeg:0,launchPhaseResidualDeg:0,interceptResidualAu:0,departureDeltaVKmS:.1,arrivalDeltaVKmS:0,correctionReserveDeltaVKmS:.05,requiredDeltaVKmS:.15,fuelRemainingPercent:n.unlimitedFuel||!n.fuelSimulation?100:Ir((1-.15/n.availableDeltaVKmS)*100,0,100),realism:n,routeOptions:wc(t,e.missionType,.5,.15),trajectory:l,keyEvents:Tc(e.simulationDays,.5,"orbiter"),calculationModel:"Deterministic Earth-orbit educational rehearsal anchored to the modelled Earth position.",accuracyLabel:"Educational Accuracy",limitations:["The local rehearsal is not a launch-site or atmospheric ascent simulation.","The visible orbit is enhanced for readability and does not represent a specific certified spacecraft orbit."]}}}const Gd=new Hd;function fa(i,e,t){return Math.max(e,Math.min(t,i))}function Ac(i,e){return Math.hypot(i.x-e.x,i.y-e.y,i.z-e.z)}function Wd(i,e,t){return{x:i.x+(e.x-i.x)*t,y:i.y+(e.y-i.y)*t,z:i.z+(e.z-i.z)*t}}function Rc(i,e){if(!i.length)return{x:0,y:0,z:0};if(e<=0)return{...i[0].positionAu};if(e>=1)return{...i[i.length-1].positionAu};const t=e*(i.length-1),n=Math.floor(t),s=Math.min(i.length-1,n+1);return Wd(i[n].positionAu,i[s].positionAu,t-n)}function Xd(i,e){if(i.length<2||e>=1)return 0;const t=fa(e,0,1)*(i.length-1),n=Math.floor(t),s=Rc(i,e);let a=Ac(s,i[Math.min(i.length-1,n+1)].positionAu);for(let r=n+2;r<i.length;r+=1)a+=Ac(i[r-1].positionAu,i[r].positionAu);return a}function qd(i,e,t){return i.valid?e<i.departureSimulationDays?"waiting-launch":e>=i.arrivalSimulationDays-1e-9?i.missionType==="orbiter"?"orbit-achieved":"flyby-complete":t<=.025?"departure-burn":t<.46?"cruise":t<=.54?"course-correction":t<.9?"cruise":t<.985?"approach":t<1?i.missionType==="orbiter"?"arrival-burn":"approach":i.missionType==="orbiter"?"orbit-achieved":"flyby-complete":"invalid"}function $d(i,e){const t=Math.max(.01,i.durationDays*.008);return i.keyEvents.find(n=>Math.abs(n.simulationDays-e)<=t)}class Yd{stateAt(e,t){const n=Math.max(1e-9,e.durationDays),s=fa((t-e.departureSimulationDays)/n,0,1),a=Rc(e.trajectory,s),r=t>=e.arrivalSimulationDays,o=e.realism.unlimitedFuel||!e.realism.fuelSimulation?0:fa(s*(1-e.fuelRemainingPercent/100),0,1);return{planId:e.id,status:qd(e,t,s),progress:s,simulationDays:t,positionAu:a,remainingDays:Math.max(0,e.arrivalSimulationDays-t),remainingDistanceAu:Xd(e.trajectory,s),fuelRemainingPercent:e.realism.unlimitedFuel||!e.realism.fuelSimulation?100:fa(100-o*100,e.fuelRemainingPercent,100),activeEvent:$d(e,t),completed:r}}crossedEvents(e,t,n){if(!Number.isFinite(t)||!Number.isFinite(n))return[];if(n===t)return[];const s=Math.min(t,n),a=Math.max(t,n);return e.keyEvents.filter(r=>r.simulationDays>s&&r.simulationDays<=a)}}const pa=new Yd;const Fr="185",Gi={ROTATE:0,DOLLY:1,PAN:2},Wi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Kd=0,Cc=1,Zd=2,ma=1,jd=2,Ps=3,kn=0,Xt=1,on=2,Vn=0,Xi=1,ga=2,Pc=3,Dc=4,Jd=5,Ei=100,Qd=101,ef=102,tf=103,nf=104,sf=200,af=201,rf=202,of=203,Or=204,Br=205,lf=206,cf=207,hf=208,uf=209,df=210,ff=211,pf=212,mf=213,gf=214,zr=0,kr=1,Vr=2,qi=3,Hr=4,Gr=5,Wr=6,Xr=7,Lc=0,_f=1,vf=2,bn=0,Ic=1,Nc=2,Uc=3,qr=4,Fc=5,Oc=6,Bc=7,zc=300,wi=301,$i=302,$r=303,Yr=304,_a=306,Ti=1e3,en=1001,Kr=1002,Ft=1003,xf=1004,va=1005,wt=1006,Zr=1007,un=1008,tn=1009,kc=1010,Vc=1011,Ds=1012,jr=1013,En=1014,wn=1015,Hn=1016,Jr=1017,Qr=1018,Ls=1020,Hc=35902,Gc=35899,Wc=1021,Xc=1022,dn=1023,Gn=1026,Ai=1027,qc=1028,eo=1029,Ri=1030,to=1031,no=1033,xa=33776,Ma=33777,ya=33778,Sa=33779,io=35840,so=35841,ao=35842,ro=35843,oo=36196,lo=37492,co=37496,ho=37488,uo=37489,ba=37490,fo=37491,po=37808,mo=37809,go=37810,_o=37811,vo=37812,xo=37813,Mo=37814,yo=37815,So=37816,bo=37817,Eo=37818,wo=37819,To=37820,Ao=37821,Ro=36492,Co=36494,Po=36495,Do=36283,Lo=36284,Ea=36285,Io=36286,Mf=3200,No=0,yf=1,fn="",Ot="srgb",wa="srgb-linear",Ta="linear",Qe="srgb",Yi=7680,$c=519,Sf=512,bf=513,Ef=514,Uo=515,wf=516,Tf=517,Fo=518,Af=519,Oo=35044,Yc="300 es",Tn=2e3,Is=2001;function Rf(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Ns(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Cf(){const i=Ns("canvas");return i.style.display="block",i}const Kc={};function Aa(...i){const e="THREE."+i.shift();console.log(e,...i)}function Zc(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Pe(...i){i=Zc(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function qe(...i){i=Zc(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Ki(...i){const e=i.join(" ");e in Kc||(Kc[e]=!0,Pe(...i))}function Pf(i,e,t){return new Promise(function(n,s){function a(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:n()}}setTimeout(a,t)})}const Df={[zr]:kr,[Vr]:Wr,[Hr]:Xr,[qi]:Gr,[kr]:zr,[Wr]:Vr,[Xr]:Hr,[Gr]:qi};class ti{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const a=s.indexOf(t);a!==-1&&s.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,e);e.target=null}}}const zt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let jc=1234567;const Us=Math.PI/180,Fs=180/Math.PI;function Wn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(zt[i&255]+zt[i>>8&255]+zt[i>>16&255]+zt[i>>24&255]+"-"+zt[e&255]+zt[e>>8&255]+"-"+zt[e>>16&15|64]+zt[e>>24&255]+"-"+zt[t&63|128]+zt[t>>8&255]+"-"+zt[t>>16&255]+zt[t>>24&255]+zt[n&255]+zt[n>>8&255]+zt[n>>16&255]+zt[n>>24&255]).toLowerCase()}function We(i,e,t){return Math.max(e,Math.min(t,i))}function Bo(i,e){return(i%e+e)%e}function Lf(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function If(i,e,t){return i!==e?(t-i)/(e-i):0}function Os(i,e,t){return(1-t)*i+t*e}function Nf(i,e,t,n){return Os(i,e,1-Math.exp(-t*n))}function Uf(i,e=1){return e-Math.abs(Bo(i,e*2)-e)}function Ff(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Of(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Bf(i,e){return i+Math.floor(Math.random()*(e-i+1))}function zf(i,e){return i+Math.random()*(e-i)}function kf(i){return i*(.5-Math.random())}function Vf(i){i!==void 0&&(jc=i);let e=jc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Hf(i){return i*Us}function Gf(i){return i*Fs}function Wf(i){return(i&i-1)===0&&i!==0}function Xf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function qf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function $f(i,e,t,n,s){const a=Math.cos,r=Math.sin,o=a(t/2),l=r(t/2),c=a((e+n)/2),h=r((e+n)/2),d=a((e-n)/2),u=r((e-n)/2),m=a((n-e)/2),g=r((n-e)/2);switch(s){case"XYX":i.set(o*h,l*d,l*u,o*c);break;case"YZY":i.set(l*u,o*h,l*d,o*c);break;case"ZXZ":i.set(l*d,l*u,o*h,o*c);break;case"XZX":i.set(o*h,l*g,l*m,o*c);break;case"YXY":i.set(l*m,o*h,l*g,o*c);break;case"ZYZ":i.set(l*g,l*m,o*h,o*c);break;default:Pe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function pn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function et(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Zt={DEG2RAD:Us,RAD2DEG:Fs,generateUUID:Wn,clamp:We,euclideanModulo:Bo,mapLinear:Lf,inverseLerp:If,lerp:Os,damp:Nf,pingpong:Uf,smoothstep:Ff,smootherstep:Of,randInt:Bf,randFloat:zf,randFloatSpread:kf,seededRandom:Vf,degToRad:Hf,radToDeg:Gf,isPowerOfTwo:Wf,ceilPowerOfTwo:Xf,floorPowerOfTwo:qf,setQuaternionFromProperEuler:$f,normalize:et,denormalize:pn};class Te{static{Te.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(We(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),a=this.x-e.x,r=this.y-e.y;return this.x=a*n-r*s+e.x,this.y=a*s+r*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ni{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,a,r,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],u=a[r+0],m=a[r+1],g=a[r+2],x=a[r+3];if(d!==x||l!==u||c!==m||h!==g){let p=l*u+c*m+h*g+d*x;p<0&&(u=-u,m=-m,g=-g,x=-x,p=-p);let f=1-o;if(p<.9995){const S=Math.acos(p),T=Math.sin(S);f=Math.sin(f*S)/T,o=Math.sin(o*S)/T,l=l*f+u*o,c=c*f+m*o,h=h*f+g*o,d=d*f+x*o}else{l=l*f+u*o,c=c*f+m*o,h=h*f+g*o,d=d*f+x*o;const S=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=S,c*=S,h*=S,d*=S}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,a,r){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=a[r],u=a[r+1],m=a[r+2],g=a[r+3];return e[t]=o*g+h*d+l*m-c*u,e[t+1]=l*g+h*u+c*d-o*m,e[t+2]=c*g+h*m+o*u-l*d,e[t+3]=h*g-o*d-l*u-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,a=e._z,r=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(a/2),u=l(n/2),m=l(s/2),g=l(a/2);switch(r){case"XYZ":this._x=u*h*d+c*m*g,this._y=c*m*d-u*h*g,this._z=c*h*g+u*m*d,this._w=c*h*d-u*m*g;break;case"YXZ":this._x=u*h*d+c*m*g,this._y=c*m*d-u*h*g,this._z=c*h*g-u*m*d,this._w=c*h*d+u*m*g;break;case"ZXY":this._x=u*h*d-c*m*g,this._y=c*m*d+u*h*g,this._z=c*h*g+u*m*d,this._w=c*h*d-u*m*g;break;case"ZYX":this._x=u*h*d-c*m*g,this._y=c*m*d+u*h*g,this._z=c*h*g-u*m*d,this._w=c*h*d+u*m*g;break;case"YZX":this._x=u*h*d+c*m*g,this._y=c*m*d+u*h*g,this._z=c*h*g-u*m*d,this._w=c*h*d-u*m*g;break;case"XZY":this._x=u*h*d-c*m*g,this._y=c*m*d-u*h*g,this._z=c*h*g+u*m*d,this._w=c*h*d+u*m*g;break;default:Pe("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],a=t[8],r=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=n+o+d;if(u>0){const m=.5/Math.sqrt(u+1);this._w=.25/m,this._x=(h-l)*m,this._y=(a-c)*m,this._z=(r-s)*m}else if(n>o&&n>d){const m=2*Math.sqrt(1+n-o-d);this._w=(h-l)/m,this._x=.25*m,this._y=(s+r)/m,this._z=(a+c)/m}else if(o>d){const m=2*Math.sqrt(1+o-n-d);this._w=(a-c)/m,this._x=(s+r)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+d-n-o);this._w=(r-s)/m,this._x=(a+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(We(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,a=e._z,r=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+r*o+s*c-a*l,this._y=s*h+r*l+a*o-n*c,this._z=a*h+r*c+n*l-s*o,this._w=r*h-n*o-s*l-a*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,a=e._z,r=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,a=-a,r=-r,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+a*t,this._w=this._w*l+r*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+a*t,this._w=this._w*l+r*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{static{L.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Jc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Jc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[3]*n+a[6]*s,this.y=a[1]*t+a[4]*n+a[7]*s,this.z=a[2]*t+a[5]*n+a[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,a=e.elements,r=1/(a[3]*t+a[7]*n+a[11]*s+a[15]);return this.x=(a[0]*t+a[4]*n+a[8]*s+a[12])*r,this.y=(a[1]*t+a[5]*n+a[9]*s+a[13])*r,this.z=(a[2]*t+a[6]*n+a[10]*s+a[14])*r,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,a=e.x,r=e.y,o=e.z,l=e.w,c=2*(r*s-o*n),h=2*(o*t-a*s),d=2*(a*n-r*t);return this.x=t+l*c+r*d-o*h,this.y=n+l*h+o*c-a*d,this.z=s+l*d+a*h-r*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s,this.y=a[1]*t+a[5]*n+a[9]*s,this.z=a[2]*t+a[6]*n+a[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,a=e.z,r=t.x,o=t.y,l=t.z;return this.x=s*l-a*o,this.y=a*r-n*l,this.z=n*o-s*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return zo.copy(this).projectOnVector(e),this.sub(zo)}reflect(e){return this.sub(zo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(We(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const zo=new L,Jc=new ni;class Ie{static{Ie.prototype.isMatrix3=!0}constructor(e,t,n,s,a,r,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,a,r,o,l,c)}set(e,t,n,s,a,r,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=a,h[5]=l,h[6]=n,h[7]=r,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,a=this.elements,r=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],m=n[5],g=n[8],x=s[0],p=s[3],f=s[6],S=s[1],T=s[4],y=s[7],R=s[2],b=s[5],C=s[8];return a[0]=r*x+o*S+l*R,a[3]=r*p+o*T+l*b,a[6]=r*f+o*y+l*C,a[1]=c*x+h*S+d*R,a[4]=c*p+h*T+d*b,a[7]=c*f+h*y+d*C,a[2]=u*x+m*S+g*R,a[5]=u*p+m*T+g*b,a[8]=u*f+m*y+g*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*r*h-t*o*c-n*a*h+n*o*l+s*a*c-s*r*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*r-o*c,u=o*l-h*a,m=c*a-r*l,g=t*d+n*u+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return e[0]=d*x,e[1]=(s*c-h*n)*x,e[2]=(o*n-s*r)*x,e[3]=u*x,e[4]=(h*t-s*l)*x,e[5]=(s*a-o*t)*x,e[6]=m*x,e[7]=(n*l-c*t)*x,e[8]=(r*t-n*a)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,a,r,o){const l=Math.cos(a),c=Math.sin(a);return this.set(n*l,n*c,-n*(l*r+c*o)+r+e,-s*c,s*l,-s*(-c*r+l*o)+o+t,0,0,1),this}scale(e,t){return Ki("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ko.makeScale(e,t)),this}rotate(e){return Ki("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ko.makeRotation(-e)),this}translate(e,t){return Ki("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ko.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ko=new Ie,Qc=new Ie().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),eh=new Ie().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Yf(){const i={enabled:!0,workingColorSpace:wa,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===Qe&&(s.r=Xn(s.r),s.g=Xn(s.g),s.b=Xn(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===Qe&&(s.r=Zi(s.r),s.g=Zi(s.g),s.b=Zi(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===fn?Ta:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return Ki("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return Ki("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[wa]:{primaries:e,whitePoint:n,transfer:Ta,toXYZ:Qc,fromXYZ:eh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ot},outputColorSpaceConfig:{drawingBufferColorSpace:Ot}},[Ot]:{primaries:e,whitePoint:n,transfer:Qe,toXYZ:Qc,fromXYZ:eh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ot}}}),i}const $e=Yf();function Xn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Zi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ji;class Kf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ji===void 0&&(ji=Ns("canvas")),ji.width=e.width,ji.height=e.height;const s=ji.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=ji}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ns("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=Xn(a[r]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Xn(t[n]/255)*255):t[n]=Xn(t[n]);return{data:t,width:e.width,height:e.height}}else return Pe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Zf=0;class Vo{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Zf++}),this.uuid=Wn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Ho(s[r].image)):a.push(Ho(s[r]))}else a=Ho(s);n.url=a}return t||(e.images[this.uuid]=n),n}}function Ho(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Kf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Pe("Texture: Unable to serialize Texture."),{})}let jf=0;const Go=new L;class Bt extends ti{constructor(e=Bt.DEFAULT_IMAGE,t=Bt.DEFAULT_MAPPING,n=en,s=en,a=wt,r=un,o=dn,l=tn,c=Bt.DEFAULT_ANISOTROPY,h=fn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:jf++}),this.uuid=Wn(),this.name="",this.source=new Vo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Te(0,0),this.repeat=new Te(1,1),this.center=new Te(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ie,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Go).x}get height(){return this.source.getSize(Go).y}get depth(){return this.source.getSize(Go).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Pe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Pe(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==zc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ti:e.x=e.x-Math.floor(e.x);break;case en:e.x=e.x<0?0:1;break;case Kr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ti:e.y=e.y-Math.floor(e.y);break;case en:e.y=e.y<0?0:1;break;case Kr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Bt.DEFAULT_IMAGE=null,Bt.DEFAULT_MAPPING=zc,Bt.DEFAULT_ANISOTROPY=1;class _t{static{_t.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,a=this.w,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s+r[12]*a,this.y=r[1]*t+r[5]*n+r[9]*s+r[13]*a,this.z=r[2]*t+r[6]*n+r[10]*s+r[14]*a,this.w=r[3]*t+r[7]*n+r[11]*s+r[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,a;const l=e.elements,c=l[0],h=l[4],d=l[8],u=l[1],m=l[5],g=l[9],x=l[2],p=l[6],f=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-x)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+x)<.1&&Math.abs(g+p)<.1&&Math.abs(c+m+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(c+1)/2,y=(m+1)/2,R=(f+1)/2,b=(h+u)/4,C=(d+x)/4,v=(g+p)/4;return T>y&&T>R?T<.01?(n=0,s=.707106781,a=.707106781):(n=Math.sqrt(T),s=b/n,a=C/n):y>R?y<.01?(n=.707106781,s=0,a=.707106781):(s=Math.sqrt(y),n=b/s,a=v/s):R<.01?(n=.707106781,s=.707106781,a=0):(a=Math.sqrt(R),n=C/a,s=v/a),this.set(n,s,a,t),this}let S=Math.sqrt((p-g)*(p-g)+(d-x)*(d-x)+(u-h)*(u-h));return Math.abs(S)<.001&&(S=1),this.x=(p-g)/S,this.y=(d-x)/S,this.z=(u-h)/S,this.w=Math.acos((c+m+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this.w=We(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this.w=We(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Jf extends ti{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:wt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new _t(0,0,e,t),this.scissorTest=!1,this.viewport=new _t(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:n.depth},a=new Bt(s),r=n.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:wt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Vo(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class An extends Jf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class th extends Bt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ft,this.minFilter=Ft,this.wrapR=en,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Qf extends Bt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ft,this.minFilter=Ft,this.wrapR=en,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class at{static{at.prototype.isMatrix4=!0}constructor(e,t,n,s,a,r,o,l,c,h,d,u,m,g,x,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,a,r,o,l,c,h,d,u,m,g,x,p)}set(e,t,n,s,a,r,o,l,c,h,d,u,m,g,x,p){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=s,f[1]=a,f[5]=r,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=d,f[14]=u,f[3]=m,f[7]=g,f[11]=x,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new at().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,s=1/Ji.setFromMatrixColumn(e,0).length(),a=1/Ji.setFromMatrixColumn(e,1).length(),r=1/Ji.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*a,t[5]=n[5]*a,t[6]=n[6]*a,t[7]=0,t[8]=n[8]*r,t[9]=n[9]*r,t[10]=n[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,a=e.z,r=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(a),d=Math.sin(a);if(e.order==="XYZ"){const u=r*h,m=r*d,g=o*h,x=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=m+g*c,t[5]=u-x*c,t[9]=-o*l,t[2]=x-u*c,t[6]=g+m*c,t[10]=r*l}else if(e.order==="YXZ"){const u=l*h,m=l*d,g=c*h,x=c*d;t[0]=u+x*o,t[4]=g*o-m,t[8]=r*c,t[1]=r*d,t[5]=r*h,t[9]=-o,t[2]=m*o-g,t[6]=x+u*o,t[10]=r*l}else if(e.order==="ZXY"){const u=l*h,m=l*d,g=c*h,x=c*d;t[0]=u-x*o,t[4]=-r*d,t[8]=g+m*o,t[1]=m+g*o,t[5]=r*h,t[9]=x-u*o,t[2]=-r*c,t[6]=o,t[10]=r*l}else if(e.order==="ZYX"){const u=r*h,m=r*d,g=o*h,x=o*d;t[0]=l*h,t[4]=g*c-m,t[8]=u*c+x,t[1]=l*d,t[5]=x*c+u,t[9]=m*c-g,t[2]=-c,t[6]=o*l,t[10]=r*l}else if(e.order==="YZX"){const u=r*l,m=r*c,g=o*l,x=o*c;t[0]=l*h,t[4]=x-u*d,t[8]=g*d+m,t[1]=d,t[5]=r*h,t[9]=-o*h,t[2]=-c*h,t[6]=m*d+g,t[10]=u-x*d}else if(e.order==="XZY"){const u=r*l,m=r*c,g=o*l,x=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+x,t[5]=r*h,t[9]=m*d-g,t[2]=g*d-m,t[6]=o*h,t[10]=x*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ep,e,tp)}lookAt(e,t,n){const s=this.elements;return nn.subVectors(e,t),nn.lengthSq()===0&&(nn.z=1),nn.normalize(),ii.crossVectors(n,nn),ii.lengthSq()===0&&(Math.abs(n.z)===1?nn.x+=1e-4:nn.z+=1e-4,nn.normalize(),ii.crossVectors(n,nn)),ii.normalize(),Ra.crossVectors(nn,ii),s[0]=ii.x,s[4]=Ra.x,s[8]=nn.x,s[1]=ii.y,s[5]=Ra.y,s[9]=nn.y,s[2]=ii.z,s[6]=Ra.z,s[10]=nn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,a=this.elements,r=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],m=n[13],g=n[2],x=n[6],p=n[10],f=n[14],S=n[3],T=n[7],y=n[11],R=n[15],b=s[0],C=s[4],v=s[8],w=s[12],D=s[1],P=s[5],U=s[9],X=s[13],q=s[2],B=s[6],W=s[10],H=s[14],Z=s[3],J=s[7],oe=s[11],ne=s[15];return a[0]=r*b+o*D+l*q+c*Z,a[4]=r*C+o*P+l*B+c*J,a[8]=r*v+o*U+l*W+c*oe,a[12]=r*w+o*X+l*H+c*ne,a[1]=h*b+d*D+u*q+m*Z,a[5]=h*C+d*P+u*B+m*J,a[9]=h*v+d*U+u*W+m*oe,a[13]=h*w+d*X+u*H+m*ne,a[2]=g*b+x*D+p*q+f*Z,a[6]=g*C+x*P+p*B+f*J,a[10]=g*v+x*U+p*W+f*oe,a[14]=g*w+x*X+p*H+f*ne,a[3]=S*b+T*D+y*q+R*Z,a[7]=S*C+T*P+y*B+R*J,a[11]=S*v+T*U+y*W+R*oe,a[15]=S*w+T*X+y*H+R*ne,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],a=e[12],r=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],m=e[14],g=e[3],x=e[7],p=e[11],f=e[15],S=l*m-c*u,T=o*m-c*d,y=o*u-l*d,R=r*m-c*h,b=r*u-l*h,C=r*d-o*h;return t*(x*S-p*T+f*y)-n*(g*S-p*R+f*b)+s*(g*T-x*R+f*C)-a*(g*y-x*b+p*C)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],s=e[8],a=e[1],r=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(r*h-o*c)-n*(a*h-o*l)+s*(a*c-r*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],m=e[11],g=e[12],x=e[13],p=e[14],f=e[15],S=t*o-n*r,T=t*l-s*r,y=t*c-a*r,R=n*l-s*o,b=n*c-a*o,C=s*c-a*l,v=h*x-d*g,w=h*p-u*g,D=h*f-m*g,P=d*p-u*x,U=d*f-m*x,X=u*f-m*p,q=S*X-T*U+y*P+R*D-b*w+C*v;if(q===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/q;return e[0]=(o*X-l*U+c*P)*B,e[1]=(s*U-n*X-a*P)*B,e[2]=(x*C-p*b+f*R)*B,e[3]=(u*b-d*C-m*R)*B,e[4]=(l*D-r*X-c*w)*B,e[5]=(t*X-s*D+a*w)*B,e[6]=(p*y-g*C-f*T)*B,e[7]=(h*C-u*y+m*T)*B,e[8]=(r*U-o*D+c*v)*B,e[9]=(n*D-t*U-a*v)*B,e[10]=(g*b-x*y+f*S)*B,e[11]=(d*y-h*b-m*S)*B,e[12]=(o*w-r*P-l*v)*B,e[13]=(t*P-n*w+s*v)*B,e[14]=(x*T-g*R-p*S)*B,e[15]=(h*R-d*T+u*S)*B,this}scale(e){const t=this.elements,n=e.x,s=e.y,a=e.z;return t[0]*=n,t[4]*=s,t[8]*=a,t[1]*=n,t[5]*=s,t[9]*=a,t[2]*=n,t[6]*=s,t[10]*=a,t[3]*=n,t[7]*=s,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),a=1-n,r=e.x,o=e.y,l=e.z,c=a*r,h=a*o;return this.set(c*r+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*r,0,c*l-s*o,h*l+s*r,a*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,a,r){return this.set(1,n,a,0,e,1,r,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,a=t._x,r=t._y,o=t._z,l=t._w,c=a+a,h=r+r,d=o+o,u=a*c,m=a*h,g=a*d,x=r*h,p=r*d,f=o*d,S=l*c,T=l*h,y=l*d,R=n.x,b=n.y,C=n.z;return s[0]=(1-(x+f))*R,s[1]=(m+y)*R,s[2]=(g-T)*R,s[3]=0,s[4]=(m-y)*b,s[5]=(1-(u+f))*b,s[6]=(p+S)*b,s[7]=0,s[8]=(g+T)*C,s[9]=(p-S)*C,s[10]=(1-(u+x))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const a=this.determinantAffine();if(a===0)return n.set(1,1,1),t.identity(),this;let r=Ji.set(s[0],s[1],s[2]).length();const o=Ji.set(s[4],s[5],s[6]).length(),l=Ji.set(s[8],s[9],s[10]).length();a<0&&(r=-r),mn.copy(this);const c=1/r,h=1/o,d=1/l;return mn.elements[0]*=c,mn.elements[1]*=c,mn.elements[2]*=c,mn.elements[4]*=h,mn.elements[5]*=h,mn.elements[6]*=h,mn.elements[8]*=d,mn.elements[9]*=d,mn.elements[10]*=d,t.setFromRotationMatrix(mn),n.x=r,n.y=o,n.z=l,this}makePerspective(e,t,n,s,a,r,o=Tn,l=!1){const c=this.elements,h=2*a/(t-e),d=2*a/(n-s),u=(t+e)/(t-e),m=(n+s)/(n-s);let g,x;if(l)g=a/(r-a),x=r*a/(r-a);else if(o===Tn)g=-(r+a)/(r-a),x=-2*r*a/(r-a);else if(o===Is)g=-r/(r-a),x=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,a,r,o=Tn,l=!1){const c=this.elements,h=2/(t-e),d=2/(n-s),u=-(t+e)/(t-e),m=-(n+s)/(n-s);let g,x;if(l)g=1/(r-a),x=r/(r-a);else if(o===Tn)g=-2/(r-a),x=-(r+a)/(r-a);else if(o===Is)g=-1/(r-a),x=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ji=new L,mn=new at,ep=new L(0,0,0),tp=new L(1,1,1),ii=new L,Ra=new L,nn=new L,nh=new at,ih=new ni;class si{constructor(e=0,t=0,n=0,s=si.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,a=s[0],r=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(We(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-We(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,a),this._z=0);break;case"ZXY":this._x=Math.asin(We(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-We(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,m),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(We(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,a)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-We(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,m),this._y=0);break;default:Pe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return nh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(nh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ih.setFromEuler(this),this.setFromQuaternion(ih,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}si.DEFAULT_ORDER="XYZ";class Wo{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let np=0;const sh=new L,Qi=new ni,qn=new at,Ca=new L,Bs=new L,ip=new L,sp=new ni,ah=new L(1,0,0),rh=new L(0,1,0),oh=new L(0,0,1),lh={type:"added"},ap={type:"removed"},es={type:"childadded",child:null},Xo={type:"childremoved",child:null};class Tt extends ti{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:np++}),this.uuid=Wn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Tt.DEFAULT_UP.clone();const e=new L,t=new si,n=new ni,s=new L(1,1,1);function a(){n.setFromEuler(t,!1)}function r(){t.setFromQuaternion(n,void 0,!1)}t._onChange(a),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new at},normalMatrix:{value:new Ie}}),this.matrix=new at,this.matrixWorld=new at,this.matrixAutoUpdate=Tt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Tt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Wo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Qi.setFromAxisAngle(e,t),this.quaternion.multiply(Qi),this}rotateOnWorldAxis(e,t){return Qi.setFromAxisAngle(e,t),this.quaternion.premultiply(Qi),this}rotateX(e){return this.rotateOnAxis(ah,e)}rotateY(e){return this.rotateOnAxis(rh,e)}rotateZ(e){return this.rotateOnAxis(oh,e)}translateOnAxis(e,t){return sh.copy(e).applyQuaternion(this.quaternion),this.position.add(sh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ah,e)}translateY(e){return this.translateOnAxis(rh,e)}translateZ(e){return this.translateOnAxis(oh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(qn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ca.copy(e):Ca.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Bs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?qn.lookAt(Bs,Ca,this.up):qn.lookAt(Ca,Bs,this.up),this.quaternion.setFromRotationMatrix(qn),s&&(qn.extractRotation(s.matrixWorld),Qi.setFromRotationMatrix(qn),this.quaternion.premultiply(Qi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(qe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(lh),es.child=e,this.dispatchEvent(es),es.child=null):qe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ap),Xo.child=e,this.dispatchEvent(Xo),Xo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),qn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),qn.multiply(e.parent.matrixWorld)),e.applyMatrix4(qn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(lh),es.child=e,this.dispatchEvent(es),es.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bs,e,ip),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bs,sp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,s=e.z,a=this.matrix.elements;a[12]+=t-a[0]*t-a[4]*n-a[8]*s,a[13]+=n-a[1]*t-a[5]*n-a[9]*s,a[14]+=s-a[2]*t-a[6]*n-a[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const a=this.children;for(let r=0,o=a.length;r<o;r++)a[r].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];a(e.shapes,d)}else a(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(e.materials,this.material[l]));s.material=o}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(a(e.animations,l))}}if(t){const o=r(e.geometries),l=r(e.materials),c=r(e.textures),h=r(e.images),d=r(e.shapes),u=r(e.skeletons),m=r(e.animations),g=r(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function r(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Tt.DEFAULT_UP=new L(0,1,0),Tt.DEFAULT_MATRIX_AUTO_UPDATE=!0,Tt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class gn extends Tt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const rp={type:"move"};class qo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new gn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new gn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new gn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,a=null,r=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){r=!0;for(const x of e.hand.values()){const p=t.getJointPose(x,n),f=this._getHandJoint(c,x);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),m=.02,g=.005;c.inputState.pinching&&u>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,n),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(rp)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new gn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const ch={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ai={h:0,s:0,l:0},Pa={h:0,s:0,l:0};function $o(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class ze{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ot){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,$e.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=$e.workingColorSpace){return this.r=e,this.g=t,this.b=n,$e.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=$e.workingColorSpace){if(e=Bo(e,1),t=We(t,0,1),n=We(n,0,1),t===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+t):n+t-n*t,r=2*n-a;this.r=$o(r,a,e+1/3),this.g=$o(r,a,e),this.b=$o(r,a,e-1/3)}return $e.colorSpaceToWorking(this,s),this}setStyle(e,t=Ot){function n(a){a!==void 0&&parseFloat(a)<1&&Pe("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:Pe("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(a,16),t);Pe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ot){const n=ch[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Pe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Xn(e.r),this.g=Xn(e.g),this.b=Xn(e.b),this}copyLinearToSRGB(e){return this.r=Zi(e.r),this.g=Zi(e.g),this.b=Zi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ot){return $e.workingToColorSpace(kt.copy(this),e),Math.round(We(kt.r*255,0,255))*65536+Math.round(We(kt.g*255,0,255))*256+Math.round(We(kt.b*255,0,255))}getHexString(e=Ot){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=$e.workingColorSpace){$e.workingToColorSpace(kt.copy(this),t);const n=kt.r,s=kt.g,a=kt.b,r=Math.max(n,s,a),o=Math.min(n,s,a);let l,c;const h=(o+r)/2;if(o===r)l=0,c=0;else{const d=r-o;switch(c=h<=.5?d/(r+o):d/(2-r-o),r){case n:l=(s-a)/d+(s<a?6:0);break;case s:l=(a-n)/d+2;break;case a:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=$e.workingColorSpace){return $e.workingToColorSpace(kt.copy(this),t),e.r=kt.r,e.g=kt.g,e.b=kt.b,e}getStyle(e=Ot){$e.workingToColorSpace(kt.copy(this),e);const t=kt.r,n=kt.g,s=kt.b;return e!==Ot?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(ai),this.setHSL(ai.h+e,ai.s+t,ai.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ai),e.getHSL(Pa);const n=Os(ai.h,Pa.h,t),s=Os(ai.s,Pa.s,t),a=Os(ai.l,Pa.l,t);return this.setHSL(n,s,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,a=e.elements;return this.r=a[0]*t+a[3]*n+a[6]*s,this.g=a[1]*t+a[4]*n+a[7]*s,this.b=a[2]*t+a[5]*n+a[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const kt=new ze;ze.NAMES=ch;class Yo{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ze(e),this.density=t}clone(){return new Yo(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class op extends Tt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new si,this.environmentIntensity=1,this.environmentRotation=new si,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const _n=new L,$n=new L,Ko=new L,Yn=new L,ts=new L,ns=new L,hh=new L,Zo=new L,jo=new L,Jo=new L,Qo=new _t,el=new _t,tl=new _t;class ln{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),_n.subVectors(e,t),s.cross(_n);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(e,t,n,s,a){_n.subVectors(s,t),$n.subVectors(n,t),Ko.subVectors(e,t);const r=_n.dot(_n),o=_n.dot($n),l=_n.dot(Ko),c=$n.dot($n),h=$n.dot(Ko),d=r*c-o*o;if(d===0)return a.set(0,0,0),null;const u=1/d,m=(c*l-o*h)*u,g=(r*h-o*l)*u;return a.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Yn)===null?!1:Yn.x>=0&&Yn.y>=0&&Yn.x+Yn.y<=1}static getInterpolation(e,t,n,s,a,r,o,l){return this.getBarycoord(e,t,n,s,Yn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Yn.x),l.addScaledVector(r,Yn.y),l.addScaledVector(o,Yn.z),l)}static getInterpolatedAttribute(e,t,n,s,a,r){return Qo.setScalar(0),el.setScalar(0),tl.setScalar(0),Qo.fromBufferAttribute(e,t),el.fromBufferAttribute(e,n),tl.fromBufferAttribute(e,s),r.setScalar(0),r.addScaledVector(Qo,a.x),r.addScaledVector(el,a.y),r.addScaledVector(tl,a.z),r}static isFrontFacing(e,t,n,s){return _n.subVectors(n,t),$n.subVectors(e,t),_n.cross($n).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return _n.subVectors(this.c,this.b),$n.subVectors(this.a,this.b),_n.cross($n).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ln.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return ln.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,a){return ln.getInterpolation(e,this.a,this.b,this.c,t,n,s,a)}containsPoint(e){return ln.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ln.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,a=this.c;let r,o;ts.subVectors(s,n),ns.subVectors(a,n),Zo.subVectors(e,n);const l=ts.dot(Zo),c=ns.dot(Zo);if(l<=0&&c<=0)return t.copy(n);jo.subVectors(e,s);const h=ts.dot(jo),d=ns.dot(jo);if(h>=0&&d<=h)return t.copy(s);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return r=l/(l-h),t.copy(n).addScaledVector(ts,r);Jo.subVectors(e,a);const m=ts.dot(Jo),g=ns.dot(Jo);if(g>=0&&m<=g)return t.copy(a);const x=m*c-l*g;if(x<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(ns,o);const p=h*g-m*d;if(p<=0&&d-h>=0&&m-g>=0)return hh.subVectors(a,s),o=(d-h)/(d-h+(m-g)),t.copy(s).addScaledVector(hh,o);const f=1/(p+x+u);return r=x*f,o=u*f,t.copy(n).addScaledVector(ts,r).addScaledVector(ns,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class zs{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(vn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(vn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=vn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const a=n.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,vn):vn.fromBufferAttribute(a,r),vn.applyMatrix4(e.matrixWorld),this.expandByPoint(vn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Da.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Da.copy(n.boundingBox)),Da.applyMatrix4(e.matrixWorld),this.union(Da)}const s=e.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,vn),vn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ks),La.subVectors(this.max,ks),is.subVectors(e.a,ks),ss.subVectors(e.b,ks),as.subVectors(e.c,ks),ri.subVectors(ss,is),oi.subVectors(as,ss),Ci.subVectors(is,as);let t=[0,-ri.z,ri.y,0,-oi.z,oi.y,0,-Ci.z,Ci.y,ri.z,0,-ri.x,oi.z,0,-oi.x,Ci.z,0,-Ci.x,-ri.y,ri.x,0,-oi.y,oi.x,0,-Ci.y,Ci.x,0];return!nl(t,is,ss,as,La)||(t=[1,0,0,0,1,0,0,0,1],!nl(t,is,ss,as,La))?!1:(Ia.crossVectors(ri,oi),t=[Ia.x,Ia.y,Ia.z],nl(t,is,ss,as,La))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,vn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(vn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Kn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Kn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Kn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Kn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Kn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Kn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Kn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Kn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Kn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Kn=[new L,new L,new L,new L,new L,new L,new L,new L],vn=new L,Da=new zs,is=new L,ss=new L,as=new L,ri=new L,oi=new L,Ci=new L,ks=new L,La=new L,Ia=new L,Pi=new L;function nl(i,e,t,n,s){for(let a=0,r=i.length-3;a<=r;a+=3){Pi.fromArray(i,a);const o=s.x*Math.abs(Pi.x)+s.y*Math.abs(Pi.y)+s.z*Math.abs(Pi.z),l=e.dot(Pi),c=t.dot(Pi),h=n.dot(Pi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const At=new L,Na=new Te;let lp=0;class qt extends ti{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:lp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Oo,this.updateRanges=[],this.gpuType=wn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Na.fromBufferAttribute(this,t),Na.applyMatrix3(e),this.setXY(t,Na.x,Na.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.applyMatrix3(e),this.setXYZ(t,At.x,At.y,At.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.applyMatrix4(e),this.setXYZ(t,At.x,At.y,At.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.applyNormalMatrix(e),this.setXYZ(t,At.x,At.y,At.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.transformDirection(e),this.setXYZ(t,At.x,At.y,At.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=pn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=et(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=pn(t,this.array)),t}setX(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=pn(t,this.array)),t}setY(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=pn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=pn(t,this.array)),t}setW(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),n=et(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),n=et(n,this.array),s=et(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,a){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),n=et(n,this.array),s=et(s,this.array),a=et(a,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Oo&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class uh extends qt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class dh extends qt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class vt extends qt{constructor(e,t,n){super(new Float32Array(e),t,n)}}const cp=new zs,Vs=new L,il=new L;class Hs{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):cp.setFromPoints(e).getCenter(n);let s=0;for(let a=0,r=e.length;a<r;a++)s=Math.max(s,n.distanceToSquared(e[a]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Vs.subVectors(e,this.center);const t=Vs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Vs,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(il.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Vs.copy(e.center).add(il)),this.expandByPoint(Vs.copy(e.center).sub(il))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let hp=0;const cn=new at,sl=new Tt,rs=new L,sn=new zs,Gs=new zs,Lt=new L;class St extends ti{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:hp++}),this.uuid=Wn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Rf(e)?dh:uh)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Ie().getNormalMatrix(e);n.applyNormalMatrix(a),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return cn.makeRotationFromQuaternion(e),this.applyMatrix4(cn),this}rotateX(e){return cn.makeRotationX(e),this.applyMatrix4(cn),this}rotateY(e){return cn.makeRotationY(e),this.applyMatrix4(cn),this}rotateZ(e){return cn.makeRotationZ(e),this.applyMatrix4(cn),this}translate(e,t,n){return cn.makeTranslation(e,t,n),this.applyMatrix4(cn),this}scale(e,t,n){return cn.makeScale(e,t,n),this.applyMatrix4(cn),this}lookAt(e){return sl.lookAt(e),sl.updateMatrix(),this.applyMatrix4(sl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(rs).negate(),this.translate(rs.x,rs.y,rs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,a=e.length;s<a;s++){const r=e[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new vt(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const a=e[s];t.setXYZ(s,a.x,a.y,a.z||0)}e.length>t.count&&Pe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new zs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){qe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const a=t[n];sn.setFromBufferAttribute(a),this.morphTargetsRelative?(Lt.addVectors(this.boundingBox.min,sn.min),this.boundingBox.expandByPoint(Lt),Lt.addVectors(this.boundingBox.max,sn.max),this.boundingBox.expandByPoint(Lt)):(this.boundingBox.expandByPoint(sn.min),this.boundingBox.expandByPoint(sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&qe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Hs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){qe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const n=this.boundingSphere.center;if(sn.setFromBufferAttribute(e),t)for(let a=0,r=t.length;a<r;a++){const o=t[a];Gs.setFromBufferAttribute(o),this.morphTargetsRelative?(Lt.addVectors(sn.min,Gs.min),sn.expandByPoint(Lt),Lt.addVectors(sn.max,Gs.max),sn.expandByPoint(Lt)):(sn.expandByPoint(Gs.min),sn.expandByPoint(Gs.max))}sn.getCenter(n);let s=0;for(let a=0,r=e.count;a<r;a++)Lt.fromBufferAttribute(e,a),s=Math.max(s,n.distanceToSquared(Lt));if(t)for(let a=0,r=t.length;a<r;a++){const o=t[a],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Lt.fromBufferAttribute(o,c),l&&(rs.fromBufferAttribute(e,c),Lt.add(rs)),s=Math.max(s,n.distanceToSquared(Lt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&qe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){qe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,a=t.uv;let r=this.getAttribute("tangent");(r===void 0||r.count!==n.count)&&(r=new qt(new Float32Array(4*n.count),4),this.setAttribute("tangent",r));const o=[],l=[];for(let v=0;v<n.count;v++)o[v]=new L,l[v]=new L;const c=new L,h=new L,d=new L,u=new Te,m=new Te,g=new Te,x=new L,p=new L;function f(v,w,D){c.fromBufferAttribute(n,v),h.fromBufferAttribute(n,w),d.fromBufferAttribute(n,D),u.fromBufferAttribute(a,v),m.fromBufferAttribute(a,w),g.fromBufferAttribute(a,D),h.sub(c),d.sub(c),m.sub(u),g.sub(u);const P=1/(m.x*g.y-g.x*m.y);isFinite(P)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(d,-m.y).multiplyScalar(P),p.copy(d).multiplyScalar(m.x).addScaledVector(h,-g.x).multiplyScalar(P),o[v].add(x),o[w].add(x),o[D].add(x),l[v].add(p),l[w].add(p),l[D].add(p))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let v=0,w=S.length;v<w;++v){const D=S[v],P=D.start,U=D.count;for(let X=P,q=P+U;X<q;X+=3)f(e.getX(X+0),e.getX(X+1),e.getX(X+2))}const T=new L,y=new L,R=new L,b=new L;function C(v){R.fromBufferAttribute(s,v),b.copy(R);const w=o[v];T.copy(w),T.sub(R.multiplyScalar(R.dot(w))).normalize(),y.crossVectors(b,w);const P=y.dot(l[v])<0?-1:1;r.setXYZW(v,T.x,T.y,T.z,P)}for(let v=0,w=S.length;v<w;++v){const D=S[v],P=D.start,U=D.count;for(let X=P,q=P+U;X<q;X+=3)C(e.getX(X+0)),C(e.getX(X+1)),C(e.getX(X+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new qt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,m=n.count;u<m;u++)n.setXYZ(u,0,0,0);const s=new L,a=new L,r=new L,o=new L,l=new L,c=new L,h=new L,d=new L;if(e)for(let u=0,m=e.count;u<m;u+=3){const g=e.getX(u+0),x=e.getX(u+1),p=e.getX(u+2);s.fromBufferAttribute(t,g),a.fromBufferAttribute(t,x),r.fromBufferAttribute(t,p),h.subVectors(r,a),d.subVectors(s,a),h.cross(d),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,p),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,m=t.count;u<m;u+=3)s.fromBufferAttribute(t,u+0),a.fromBufferAttribute(t,u+1),r.fromBufferAttribute(t,u+2),h.subVectors(r,a),d.subVectors(s,a),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Lt.fromBufferAttribute(e,t),Lt.normalize(),e.setXYZ(t,Lt.x,Lt.y,Lt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h);let m=0,g=0;for(let x=0,p=l.length;x<p;x++){o.isInterleavedBufferAttribute?m=l[x]*o.data.stride+o.offset:m=l[x]*h;for(let f=0;f<h;f++)u[g++]=c[m++]}return new qt(u,h,d)}if(this.index===null)return Pe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new St,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const a=this.morphAttributes;for(const o in a){const l=[],c=a[o];for(let h=0,d=c.length;h<d;h++){const u=c[h],m=e(u,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,l=r.length;o<l;o++){const c=r[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const m=c[d];h.push(m.toJSON(e.data))}h.length>0&&(s[l]=h,a=!0)}a&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const a=e.morphAttributes;for(const c in a){const h=[],d=a[c];for(let u=0,m=d.length;u<m;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let c=0,h=r.length;c<h;c++){const d=r[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class up{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Oo,this.updateRanges=[],this.version=0,this.uuid=Wn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,a=this.stride;s<a;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Wn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Wn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const $t=new L;class Ua{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyMatrix4(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyNormalMatrix(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.transformDirection(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=pn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=et(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=pn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=pn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=pn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=pn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),n=et(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),n=et(n,this.array),s=et(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,a){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),n=et(n,this.array),s=et(s,this.array),a=et(a,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=a,this}clone(e){if(e===void 0){Aa("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[s+a])}return new qt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ua(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Aa("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let dp=0;class li extends ti{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:dp++}),this.uuid=Wn(),this.name="",this.type="Material",this.blending=Xi,this.side=kn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Or,this.blendDst=Br,this.blendEquation=Ei,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ze(0,0,0),this.blendAlpha=0,this.depthFunc=qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=$c,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Yi,this.stencilZFail=Yi,this.stencilZPass=Yi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Pe(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Pe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Xi&&(n.blending=this.blending),this.side!==kn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Or&&(n.blendSrc=this.blendSrc),this.blendDst!==Br&&(n.blendDst=this.blendDst),this.blendEquation!==Ei&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==qi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==$c&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Yi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Yi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Yi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(a){const r=[];for(const o in a){const l=a[o];delete l.metadata,r.push(l)}return r}if(t){const a=s(e.textures),r=s(e.images);a.length>0&&(n.textures=a),r.length>0&&(n.images=r)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new ze().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Te().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Te().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let a=0;a!==s;++a)n[a]=t[a].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class fh extends li{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ze(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let os;const Ws=new L,ls=new L,cs=new L,hs=new Te,Xs=new Te,ph=new at,Fa=new L,qs=new L,Oa=new L,mh=new Te,al=new Te,gh=new Te;class _h extends Tt{constructor(e=new fh){if(super(),this.isSprite=!0,this.type="Sprite",os===void 0){os=new St;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new up(t,5);os.setIndex([0,1,2,0,2,3]),os.setAttribute("position",new Ua(n,3,0,!1)),os.setAttribute("uv",new Ua(n,2,3,!1))}this.geometry=os,this.material=e,this.center=new Te(.5,.5),this.count=1}raycast(e,t){e.camera===null&&qe('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ls.setFromMatrixScale(this.matrixWorld),ph.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),cs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ls.multiplyScalar(-cs.z);const n=this.material.rotation;let s,a;n!==0&&(a=Math.cos(n),s=Math.sin(n));const r=this.center;Ba(Fa.set(-.5,-.5,0),cs,r,ls,s,a),Ba(qs.set(.5,-.5,0),cs,r,ls,s,a),Ba(Oa.set(.5,.5,0),cs,r,ls,s,a),mh.set(0,0),al.set(1,0),gh.set(1,1);let o=e.ray.intersectTriangle(Fa,qs,Oa,!1,Ws);if(o===null&&(Ba(qs.set(-.5,.5,0),cs,r,ls,s,a),al.set(0,1),o=e.ray.intersectTriangle(Fa,Oa,qs,!1,Ws),o===null))return;const l=e.ray.origin.distanceTo(Ws);l<e.near||l>e.far||t.push({distance:l,point:Ws.clone(),uv:ln.getInterpolation(Ws,Fa,qs,Oa,mh,al,gh,new Te),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Ba(i,e,t,n,s,a){hs.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Xs.x=a*hs.x-s*hs.y,Xs.y=s*hs.x+a*hs.y):Xs.copy(hs),i.copy(e),i.x+=Xs.x,i.y+=Xs.y,i.applyMatrix4(ph)}const Zn=new L,rl=new L,za=new L,ci=new L,ol=new L,ka=new L,ll=new L;class $s{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Zn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Zn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Zn.copy(this.origin).addScaledVector(this.direction,t),Zn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){rl.copy(e).add(t).multiplyScalar(.5),za.copy(t).sub(e).normalize(),ci.copy(this.origin).sub(rl);const a=e.distanceTo(t)*.5,r=-this.direction.dot(za),o=ci.dot(this.direction),l=-ci.dot(za),c=ci.lengthSq(),h=Math.abs(1-r*r);let d,u,m,g;if(h>0)if(d=r*l-o,u=r*o-l,g=a*h,d>=0)if(u>=-g)if(u<=g){const x=1/h;d*=x,u*=x,m=d*(d+r*u+2*o)+u*(r*d+u+2*l)+c}else u=a,d=Math.max(0,-(r*u+o)),m=-d*d+u*(u+2*l)+c;else u=-a,d=Math.max(0,-(r*u+o)),m=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-r*a+o)),u=d>0?-a:Math.min(Math.max(-a,-l),a),m=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-a,-l),a),m=u*(u+2*l)+c):(d=Math.max(0,-(r*a+o)),u=d>0?a:Math.min(Math.max(-a,-l),a),m=-d*d+u*(u+2*l)+c);else u=r>0?-a:a,d=Math.max(0,-(r*u+o)),m=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(rl).addScaledVector(za,u),m}intersectSphere(e,t){Zn.subVectors(e.center,this.origin);const n=Zn.dot(this.direction),s=Zn.dot(Zn)-n*n,a=e.radius*e.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=n-r,l=n+r;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,a,r,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,s=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,s=(e.min.x-u.x)*c),h>=0?(a=(e.min.y-u.y)*h,r=(e.max.y-u.y)*h):(a=(e.max.y-u.y)*h,r=(e.min.y-u.y)*h),n>r||a>s||((a>n||isNaN(n))&&(n=a),(r<s||isNaN(s))&&(s=r),d>=0?(o=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Zn)!==null}intersectTriangle(e,t,n,s,a){ol.subVectors(t,e),ka.subVectors(n,e),ll.crossVectors(ol,ka);let r=this.direction.dot(ll),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;ci.subVectors(this.origin,e);const l=o*this.direction.dot(ka.crossVectors(ci,ka));if(l<0)return null;const c=o*this.direction.dot(ol.cross(ci));if(c<0||l+c>r)return null;const h=-o*ci.dot(ll);return h<0?null:this.at(h/r,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ys extends li{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new si,this.combine=Lc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const vh=new at,Di=new $s,Va=new Hs,xh=new L,Ha=new L,Ga=new L,Wa=new L,cl=new L,Xa=new L,Mh=new L,qa=new L;class rt extends Tt{constructor(e=new St,t=new Ys){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,a=n.morphAttributes.position,r=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(a&&o){Xa.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const h=o[l],d=a[l];h!==0&&(cl.fromBufferAttribute(d,e),r?Xa.addScaledVector(cl,h):Xa.addScaledVector(cl.sub(t),h))}t.add(Xa)}return t}raycast(e,t){const n=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Va.copy(n.boundingSphere),Va.applyMatrix4(a),Di.copy(e.ray).recast(e.near),!(Va.containsPoint(Di.origin)===!1&&(Di.intersectSphere(Va,xh)===null||Di.origin.distanceToSquared(xh)>(e.far-e.near)**2))&&(vh.copy(a).invert(),Di.copy(e.ray).applyMatrix4(vh),!(n.boundingBox!==null&&Di.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Di)))}_computeIntersections(e,t,n){let s;const a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,d=a.attributes.normal,u=a.groups,m=a.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,x=u.length;g<x;g++){const p=u[g],f=r[p.materialIndex],S=Math.max(p.start,m.start),T=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let y=S,R=T;y<R;y+=3){const b=o.getX(y),C=o.getX(y+1),v=o.getX(y+2);s=$a(this,f,e,n,c,h,d,b,C,v),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),x=Math.min(o.count,m.start+m.count);for(let p=g,f=x;p<f;p+=3){const S=o.getX(p),T=o.getX(p+1),y=o.getX(p+2);s=$a(this,r,e,n,c,h,d,S,T,y),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(r))for(let g=0,x=u.length;g<x;g++){const p=u[g],f=r[p.materialIndex],S=Math.max(p.start,m.start),T=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let y=S,R=T;y<R;y+=3){const b=y,C=y+1,v=y+2;s=$a(this,f,e,n,c,h,d,b,C,v),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),x=Math.min(l.count,m.start+m.count);for(let p=g,f=x;p<f;p+=3){const S=p,T=p+1,y=p+2;s=$a(this,r,e,n,c,h,d,S,T,y),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function fp(i,e,t,n,s,a,r,o){let l;if(e.side===Xt?l=n.intersectTriangle(r,a,s,!0,o):l=n.intersectTriangle(s,a,r,e.side===kn,o),l===null)return null;qa.copy(o),qa.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(qa);return c<t.near||c>t.far?null:{distance:c,point:qa.clone(),object:i}}function $a(i,e,t,n,s,a,r,o,l,c){i.getVertexPosition(o,Ha),i.getVertexPosition(l,Ga),i.getVertexPosition(c,Wa);const h=fp(i,e,t,n,Ha,Ga,Wa,Mh);if(h){const d=new L;ln.getBarycoord(Mh,Ha,Ga,Wa,d),s&&(h.uv=ln.getInterpolatedAttribute(s,o,l,c,d,new Te)),a&&(h.uv1=ln.getInterpolatedAttribute(a,o,l,c,d,new Te)),r&&(h.normal=ln.getInterpolatedAttribute(r,o,l,c,d,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new L,materialIndex:0};ln.getNormal(Ha,Ga,Wa,u.normal),h.face=u,h.barycoord=d}return h}class pp extends Bt{constructor(e=null,t=1,n=1,s,a,r,o,l,c=Ft,h=Ft,d,u){super(null,r,o,l,c,h,s,a,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const hl=new L,mp=new L,gp=new Ie;class hi{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=hl.subVectors(n,t).cross(mp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const s=e.delta(hl),a=this.normal.dot(s);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/a;return n===!0&&(r<0||r>1)?null:t.copy(e.start).addScaledVector(s,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||gp.getNormalMatrix(e),s=this.coplanarPoint(hl).applyMatrix4(e),a=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Li=new Hs,_p=new Te(.5,.5),Ya=new L;class ul{constructor(e=new hi,t=new hi,n=new hi,s=new hi,a=new hi,r=new hi){this.planes=[e,t,n,s,a,r]}set(e,t,n,s,a,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Tn,n=!1){const s=this.planes,a=e.elements,r=a[0],o=a[1],l=a[2],c=a[3],h=a[4],d=a[5],u=a[6],m=a[7],g=a[8],x=a[9],p=a[10],f=a[11],S=a[12],T=a[13],y=a[14],R=a[15];if(s[0].setComponents(c-r,m-h,f-g,R-S).normalize(),s[1].setComponents(c+r,m+h,f+g,R+S).normalize(),s[2].setComponents(c+o,m+d,f+x,R+T).normalize(),s[3].setComponents(c-o,m-d,f-x,R-T).normalize(),n)s[4].setComponents(l,u,p,y).normalize(),s[5].setComponents(c-l,m-u,f-p,R-y).normalize();else if(s[4].setComponents(c-l,m-u,f-p,R-y).normalize(),t===Tn)s[5].setComponents(c+l,m+u,f+p,R+y).normalize();else if(t===Is)s[5].setComponents(l,u,p,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Li.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Li.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Li)}intersectsSprite(e){Li.center.set(0,0,0);const t=_p.distanceTo(e.center);return Li.radius=.7071067811865476+t,Li.applyMatrix4(e.matrixWorld),this.intersectsSphere(Li)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Ya.x=s.normal.x>0?e.max.x:e.min.x,Ya.y=s.normal.y>0?e.max.y:e.min.y,Ya.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ya)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ka extends li{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ze(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Za=new L,ja=new L,yh=new at,Ks=new $s,Ja=new Hs,dl=new L,Sh=new L;class Zs extends Tt{constructor(e=new St,t=new Ka){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,a=t.count;s<a;s++)Za.fromBufferAttribute(t,s-1),ja.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Za.distanceTo(ja);e.setAttribute("lineDistance",new vt(n,1))}else Pe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,a=e.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ja.copy(n.boundingSphere),Ja.applyMatrix4(s),Ja.radius+=a,e.ray.intersectsSphere(Ja)===!1)return;yh.copy(s).invert(),Ks.copy(e.ray).applyMatrix4(yh);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const m=Math.max(0,r.start),g=Math.min(h.count,r.start+r.count);for(let x=m,p=g-1;x<p;x+=c){const f=h.getX(x),S=h.getX(x+1),T=Qa(this,e,Ks,l,f,S,x);T&&t.push(T)}if(this.isLineLoop){const x=h.getX(g-1),p=h.getX(m),f=Qa(this,e,Ks,l,x,p,g-1);f&&t.push(f)}}else{const m=Math.max(0,r.start),g=Math.min(u.count,r.start+r.count);for(let x=m,p=g-1;x<p;x+=c){const f=Qa(this,e,Ks,l,x,x+1,x);f&&t.push(f)}if(this.isLineLoop){const x=Qa(this,e,Ks,l,g-1,m,g-1);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function Qa(i,e,t,n,s,a,r){const o=i.geometry.attributes.position;if(Za.fromBufferAttribute(o,s),ja.fromBufferAttribute(o,a),t.distanceSqToSegment(Za,ja,dl,Sh)>n)return;dl.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(dl);if(!(c<e.near||c>e.far))return{distance:c,point:Sh.clone().applyMatrix4(i.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:i}}class bh extends Zs{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class fl extends li{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ze(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Eh=new at,pl=new $s,er=new Hs,tr=new L;class ml extends Tt{constructor(e=new St,t=new fl){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,a=e.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),er.copy(n.boundingSphere),er.applyMatrix4(s),er.radius+=a,e.ray.intersectsSphere(er)===!1)return;Eh.copy(s).invert(),pl.copy(e.ray).applyMatrix4(Eh);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){const u=Math.max(0,r.start),m=Math.min(c.count,r.start+r.count);for(let g=u,x=m;g<x;g++){const p=c.getX(g);tr.fromBufferAttribute(d,p),wh(tr,p,l,s,e,t,this)}}else{const u=Math.max(0,r.start),m=Math.min(d.count,r.start+r.count);for(let g=u,x=m;g<x;g++)tr.fromBufferAttribute(d,g),wh(tr,g,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function wh(i,e,t,n,s,a,r){const o=pl.distanceSqToPoint(i);if(o<t){const l=new L;pl.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;a.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:r})}}class Th extends Bt{constructor(e=[],t=wi,n,s,a,r,o,l,c,h){super(e,t,n,s,a,r,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class nr extends Bt{constructor(e,t,n,s,a,r,o,l,c){super(e,t,n,s,a,r,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class us extends Bt{constructor(e,t,n=En,s,a,r,o=Ft,l=Ft,c,h=Gn,d=1){if(h!==Gn&&h!==Ai)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:d};super(u,s,a,r,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Vo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class vp extends us{constructor(e,t=En,n=wi,s,a,r=Ft,o=Ft,l,c=Gn){const h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,n,s,a,r,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Ah extends Bt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ii extends St{constructor(e=1,t=1,n=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const l=[],c=[],h=[],d=[];let u=0,m=0;g("z","y","x",-1,-1,n,t,e,r,a,0),g("z","y","x",1,-1,n,t,-e,r,a,1),g("x","z","y",1,1,e,n,t,s,r,2),g("x","z","y",1,-1,e,n,-t,s,r,3),g("x","y","z",1,-1,e,t,n,s,a,4),g("x","y","z",-1,-1,e,t,-n,s,a,5),this.setIndex(l),this.setAttribute("position",new vt(c,3)),this.setAttribute("normal",new vt(h,3)),this.setAttribute("uv",new vt(d,2));function g(x,p,f,S,T,y,R,b,C,v,w){const D=y/C,P=R/v,U=y/2,X=R/2,q=b/2,B=C+1,W=v+1;let H=0,Z=0;const J=new L;for(let oe=0;oe<W;oe++){const ne=oe*P-X;for(let fe=0;fe<B;fe++){const Ne=fe*D-U;J[x]=Ne*S,J[p]=ne*T,J[f]=q,c.push(J.x,J.y,J.z),J[x]=0,J[p]=0,J[f]=b>0?1:-1,h.push(J.x,J.y,J.z),d.push(fe/C),d.push(1-oe/v),H+=1}}for(let oe=0;oe<v;oe++)for(let ne=0;ne<C;ne++){const fe=u+ne+B*oe,Ne=u+ne+B*(oe+1),Ze=u+(ne+1)+B*(oe+1),Ve=u+(ne+1)+B*oe;l.push(fe,Ne,Ve),l.push(Ne,Ze,Ve),Z+=6}o.addGroup(m,Z,w),m+=Z,u+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ii(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class gl extends St{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const a=[],r=[],o=[],l=[],c=new L,h=new Te;r.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){const m=n+d/t*s;c.x=e*Math.cos(m),c.y=e*Math.sin(m),r.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(r[u]/e+1)/2,h.y=(r[u+1]/e+1)/2,l.push(h.x,h.y)}for(let d=1;d<=t;d++)a.push(d,d+1,0);this.setIndex(a),this.setAttribute("position",new vt(r,3)),this.setAttribute("normal",new vt(o,3)),this.setAttribute("uv",new vt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gl(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ds extends St{constructor(e=1,t=1,n=1,s=32,a=1,r=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),a=Math.floor(a);const h=[],d=[],u=[],m=[];let g=0;const x=[],p=n/2;let f=0;S(),r===!1&&(e>0&&T(!0),t>0&&T(!1)),this.setIndex(h),this.setAttribute("position",new vt(d,3)),this.setAttribute("normal",new vt(u,3)),this.setAttribute("uv",new vt(m,2));function S(){const y=new L,R=new L;let b=0;const C=(t-e)/n;for(let v=0;v<=a;v++){const w=[],D=v/a,P=D*(t-e)+e;for(let U=0;U<=s;U++){const X=U/s,q=X*l+o,B=Math.sin(q),W=Math.cos(q);R.x=P*B,R.y=-D*n+p,R.z=P*W,d.push(R.x,R.y,R.z),y.set(B,C,W).normalize(),u.push(y.x,y.y,y.z),m.push(X,1-D),w.push(g++)}x.push(w)}for(let v=0;v<s;v++)for(let w=0;w<a;w++){const D=x[w][v],P=x[w+1][v],U=x[w+1][v+1],X=x[w][v+1];(e>0||w!==0)&&(h.push(D,P,X),b+=3),(t>0||w!==a-1)&&(h.push(P,U,X),b+=3)}c.addGroup(f,b,0),f+=b}function T(y){const R=g,b=new Te,C=new L;let v=0;const w=y===!0?e:t,D=y===!0?1:-1;for(let U=1;U<=s;U++)d.push(0,p*D,0),u.push(0,D,0),m.push(.5,.5),g++;const P=g;for(let U=0;U<=s;U++){const q=U/s*l+o,B=Math.cos(q),W=Math.sin(q);C.x=w*W,C.y=p*D,C.z=w*B,d.push(C.x,C.y,C.z),u.push(0,D,0),b.x=B*.5+.5,b.y=W*.5*D+.5,m.push(b.x,b.y),g++}for(let U=0;U<s;U++){const X=R+U,q=P+U;y===!0?h.push(q,q+1,X):h.push(q+1,q,X),v+=3}c.addGroup(f,v,y===!0?1:2),f+=v}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ds(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ir extends ds{constructor(e=1,t=1,n=32,s=1,a=!1,r=0,o=Math.PI*2){super(0,e,t,n,s,a,r,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:a,thetaStart:r,thetaLength:o}}static fromJSON(e){return new ir(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class sr extends St{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const a=e/2,r=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=e/o,u=t/l,m=[],g=[],x=[],p=[];for(let f=0;f<h;f++){const S=f*u-r;for(let T=0;T<c;T++){const y=T*d-a;g.push(y,-S,0),x.push(0,0,1),p.push(T/o),p.push(1-f/l)}}for(let f=0;f<l;f++)for(let S=0;S<o;S++){const T=S+c*f,y=S+c*(f+1),R=S+1+c*(f+1),b=S+1+c*f;m.push(T,y,b),m.push(y,R,b)}this.setIndex(m),this.setAttribute("position",new vt(g,3)),this.setAttribute("normal",new vt(x,3)),this.setAttribute("uv",new vt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new sr(e.width,e.height,e.widthSegments,e.heightSegments)}}class _l extends St{constructor(e=.5,t=1,n=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:a,thetaLength:r},n=Math.max(3,n),s=Math.max(1,s);const o=[],l=[],c=[],h=[];let d=e;const u=(t-e)/s,m=new L,g=new Te;for(let x=0;x<=s;x++){for(let p=0;p<=n;p++){const f=a+p/n*r;m.x=d*Math.cos(f),m.y=d*Math.sin(f),l.push(m.x,m.y,m.z),c.push(0,0,1),g.x=(m.x/t+1)/2,g.y=(m.y/t+1)/2,h.push(g.x,g.y)}d+=u}for(let x=0;x<s;x++){const p=x*(n+1);for(let f=0;f<n;f++){const S=f+p,T=S,y=S+n+1,R=S+n+2,b=S+1;o.push(T,y,b),o.push(y,R,b)}}this.setIndex(o),this.setAttribute("position",new vt(l,3)),this.setAttribute("normal",new vt(c,3)),this.setAttribute("uv",new vt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _l(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class ui extends St{constructor(e=1,t=32,n=16,s=0,a=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:a,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(r+o,Math.PI);let c=0;const h=[],d=new L,u=new L,m=[],g=[],x=[],p=[];for(let f=0;f<=n;f++){const S=[],T=f/n,y=r+T*o,R=e*Math.cos(y),b=Math.sqrt(e*e-R*R);let C=0;f===0&&r===0?C=.5/t:f===n&&l===Math.PI&&(C=-.5/t);for(let v=0;v<=t;v++){const w=v/t,D=s+w*a;d.x=-b*Math.cos(D),d.y=R,d.z=b*Math.sin(D),g.push(d.x,d.y,d.z),u.copy(d).normalize(),x.push(u.x,u.y,u.z),p.push(w+C,1-T),S.push(c++)}h.push(S)}for(let f=0;f<n;f++)for(let S=0;S<t;S++){const T=h[f][S+1],y=h[f][S],R=h[f+1][S],b=h[f+1][S+1];(f!==0||r>0)&&m.push(T,y,b),(f!==n-1||l<Math.PI)&&m.push(y,R,b)}this.setIndex(m),this.setAttribute("position",new vt(g,3)),this.setAttribute("normal",new vt(x,3)),this.setAttribute("uv",new vt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ui(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function fs(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];if(Rh(s))s.isRenderTargetTexture?(Pe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Rh(s[0])){const a=[];for(let r=0,o=s.length;r<o;r++)a[r]=s[r].clone();e[t][n]=a}else e[t][n]=s.slice();else e[t][n]=s}}return e}function Yt(i){const e={};for(let t=0;t<i.length;t++){const n=fs(i[t]);for(const s in n)e[s]=n[s]}return e}function Rh(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function xp(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Ch(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:$e.workingColorSpace}const Mp={clone:fs,merge:Yt};var yp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Sp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class xn extends li{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=yp,this.fragmentShader=Sp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=fs(e.uniforms),this.uniformsGroups=xp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?t.uniforms[s]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[s]={type:"m4",value:r.toArray()}:t.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new ze().setHex(s.value);break;case"v2":this.uniforms[n].value=new Te().fromArray(s.value);break;case"v3":this.uniforms[n].value=new L().fromArray(s.value);break;case"v4":this.uniforms[n].value=new _t().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Ie().fromArray(s.value);break;case"m4":this.uniforms[n].value=new at().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class bp extends xn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class jn extends li{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=No,this.normalScale=new Te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new si,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ep extends li{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Mf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class wp extends li{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const vl={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(Ph(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!Ph(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function Ph(i){try{const e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class Tp{constructor(e,t,n){const s=this;let a=!1,r=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,a===!1&&s.onStart!==void 0&&s.onStart(h,r,o),a=!0},this.itemEnd=function(h){r++,s.onProgress!==void 0&&s.onProgress(h,r,o),r===o&&(a=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){const d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){const m=c[d],g=c[d+1];if(m.global&&(m.lastIndex=0),m.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const Ap=new Tp;class xl{constructor(e){this.manager=e!==void 0?e:Ap,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(s,a){n.load(e,s,t,a)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}xl.DEFAULT_MATERIAL_NAME="__DEFAULT";const ps=new WeakMap;class Rp extends xl{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const a=this,r=vl.get(`image:${e}`);if(r!==void 0){if(r.complete===!0)a.manager.itemStart(e),setTimeout(function(){t&&t(r),a.manager.itemEnd(e)},0);else{let d=ps.get(r);d===void 0&&(d=[],ps.set(r,d)),d.push({onLoad:t,onError:s})}return r}const o=Ns("img");function l(){h(),t&&t(this);const d=ps.get(this)||[];for(let u=0;u<d.length;u++){const m=d[u];m.onLoad&&m.onLoad(this)}ps.delete(this),a.manager.itemEnd(e)}function c(d){h(),s&&s(d),vl.remove(`image:${e}`);const u=ps.get(this)||[];for(let m=0;m<u.length;m++){const g=u[m];g.onError&&g.onError(d)}ps.delete(this),a.manager.itemError(e),a.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),vl.add(`image:${e}`,o),a.manager.itemStart(e),o.src=e,o}}class Cp extends xl{constructor(e){super(e)}load(e,t,n,s){const a=new Bt,r=new Rp(this.manager);return r.setCrossOrigin(this.crossOrigin),r.setPath(this.path),r.load(e,function(o){a.image=o,a.needsUpdate=!0,t!==void 0&&t(a)},n,s),a}}class Ml extends Tt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ze(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class Pp extends Ml{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Tt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ze(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const yl=new at,Dh=new L,Lh=new L;class Ih{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Te(512,512),this.mapType=tn,this.map=null,this.mapPass=null,this.matrix=new at,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ul,this._frameExtents=new Te(1,1),this._viewportCount=1,this._viewports=[new _t(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Dh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Dh),Lh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Lh),t.updateMatrixWorld(),yl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(yl,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Is||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(yl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const ar=new L,rr=new ni,Rn=new L;class Nh extends Tt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new at,this.projectionMatrix=new at,this.projectionMatrixInverse=new at,this.coordinateSystem=Tn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ar,rr,Rn),Rn.x===1&&Rn.y===1&&Rn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ar,rr,Rn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ar,rr,Rn),Rn.x===1&&Rn.y===1&&Rn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ar,rr,Rn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const di=new L,Uh=new Te,Fh=new Te;class an extends Nh{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Fs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Us*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Fs*2*Math.atan(Math.tan(Us*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(di.x,di.y).multiplyScalar(-e/di.z),di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(di.x,di.y).multiplyScalar(-e/di.z)}getViewSize(e,t){return this.getViewBounds(e,Uh,Fh),t.subVectors(Fh,Uh)}setViewOffset(e,t,n,s,a,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Us*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,c=r.fullHeight;a+=r.offsetX*s/l,t-=r.offsetY*n/c,s*=r.width/l,n*=r.height/c}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Dp extends Ih{constructor(){super(new an(90,1,.5,500)),this.isPointLightShadow=!0}}class Lp extends Ml{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Dp}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Sl extends Nh{constructor(e=-1,t=1,n=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=n-e,r=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,r=a+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Ip extends Ih{constructor(){super(new Sl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Np extends Ml{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Tt.DEFAULT_UP),this.updateMatrix(),this.target=new Tt,this.shadow=new Ip}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}const ms=-90,gs=1;class Up extends Tt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new an(ms,gs,e,t);s.layers=this.layers,this.add(s);const a=new an(ms,gs,e,t);a.layers=this.layers,this.add(a);const r=new an(ms,gs,e,t);r.layers=this.layers,this.add(r);const o=new an(ms,gs,e,t);o.layers=this.layers,this.add(o);const l=new an(ms,gs,e,t);l.layers=this.layers,this.add(l);const c=new an(ms,gs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,a,r,o,l]=t;for(const c of t)this.remove(c);if(e===Tn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Is)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(d,u,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Fp extends an{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Oh=new at;class Op{constructor(e,t,n=0,s=1/0){this.ray=new $s(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Wo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):qe("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Oh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Oh),this}intersectObject(e,t=!0,n=[]){return bl(e,this,n,t),n.sort(Bh),n}intersectObjects(e,t=!0,n=[]){for(let s=0,a=e.length;s<a;s++)bl(e[s],this,n,t);return n.sort(Bh),n}}function Bh(i,e){return i.distance-e.distance}function bl(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const a=i.children;for(let r=0,o=a.length;r<o;r++)bl(a[r],e,t,!0)}}class zh{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=We(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(We(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class kh{static{kh.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){const a=this.elements;return a[0]=e,a[2]=t,a[1]=n,a[3]=s,this}}class Bp extends ti{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Pe("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Vh(i,e,t,n){const s=zp(n);switch(t){case Wc:return i*e;case qc:return i*e/s.components*s.byteLength;case eo:return i*e/s.components*s.byteLength;case Ri:return i*e*2/s.components*s.byteLength;case to:return i*e*2/s.components*s.byteLength;case Xc:return i*e*3/s.components*s.byteLength;case dn:return i*e*4/s.components*s.byteLength;case no:return i*e*4/s.components*s.byteLength;case xa:case Ma:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ya:case Sa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case so:case ro:return Math.max(i,16)*Math.max(e,8)/4;case io:case ao:return Math.max(i,8)*Math.max(e,8)/2;case oo:case lo:case ho:case uo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case co:case ba:case fo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case po:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case mo:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case go:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case _o:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case vo:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case xo:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Mo:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case yo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case So:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case bo:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Eo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case wo:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case To:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Ao:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Ro:case Co:case Po:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Do:case Lo:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Ea:case Io:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function zp(i){switch(i){case tn:case kc:return{byteLength:1,components:1};case Ds:case Vc:case Hn:return{byteLength:2,components:1};case Jr:case Qr:return{byteLength:2,components:4};case En:case jr:case wn:return{byteLength:4,components:1};case Hc:case Gc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Fr}})),typeof window<"u"&&(window.__THREE__?Pe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Fr);function Hh(){let i=null,e=!1,t=null,n=null;function s(a,r){t(a,r),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){i=a}}}function kp(i){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((m,g)=>m.start-g.start);let u=0;for(let m=1;m<d.length;m++){const g=d[u],x=d[m];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++u,d[u]=x)}d.length=u+1;for(let m=0,g=d.length;m<g;m++){const x=d[m];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:a,update:r}}var Vp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Hp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Gp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Wp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Xp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,qp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$p=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Yp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Kp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Zp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,jp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Jp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Qp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,em=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,tm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,nm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,im=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,sm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,am=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,rm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,om=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,lm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,cm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,hm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,um=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,dm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,fm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,pm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,mm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,gm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,_m="gl_FragColor = linearToOutputTexel( gl_FragColor );",vm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,xm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Mm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,ym=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Sm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,bm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Em=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,wm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Tm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Am=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Rm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Cm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Pm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Dm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Lm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Im=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Nm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Um=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Fm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Om=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Bm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,zm=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,km=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Vm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Hm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Gm=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Wm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Xm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$m=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ym=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Km=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Zm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,jm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Jm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Qm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,eg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,tg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ng=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ig=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,sg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ag=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,rg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,og=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,hg=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,ug=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,dg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,fg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,pg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,mg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,gg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,_g=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,vg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,xg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Mg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,yg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Sg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,bg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Eg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,wg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Tg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Ag=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Rg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Cg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Pg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Dg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Lg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ig=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ng=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ug=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Fg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Og=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Bg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,zg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,kg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ke={alphahash_fragment:Vp,alphahash_pars_fragment:Hp,alphamap_fragment:Gp,alphamap_pars_fragment:Wp,alphatest_fragment:Xp,alphatest_pars_fragment:qp,aomap_fragment:$p,aomap_pars_fragment:Yp,batching_pars_vertex:Kp,batching_vertex:Zp,begin_vertex:jp,beginnormal_vertex:Jp,bsdfs:Qp,iridescence_fragment:em,bumpmap_pars_fragment:tm,clipping_planes_fragment:nm,clipping_planes_pars_fragment:im,clipping_planes_pars_vertex:sm,clipping_planes_vertex:am,color_fragment:rm,color_pars_fragment:om,color_pars_vertex:lm,color_vertex:cm,common:hm,cube_uv_reflection_fragment:um,defaultnormal_vertex:dm,displacementmap_pars_vertex:fm,displacementmap_vertex:pm,emissivemap_fragment:mm,emissivemap_pars_fragment:gm,colorspace_fragment:_m,colorspace_pars_fragment:vm,envmap_fragment:xm,envmap_common_pars_fragment:Mm,envmap_pars_fragment:ym,envmap_pars_vertex:Sm,envmap_physical_pars_fragment:Im,envmap_vertex:bm,fog_vertex:Em,fog_pars_vertex:wm,fog_fragment:Tm,fog_pars_fragment:Am,gradientmap_pars_fragment:Rm,lightmap_pars_fragment:Cm,lights_lambert_fragment:Pm,lights_lambert_pars_fragment:Dm,lights_pars_begin:Lm,lights_toon_fragment:Nm,lights_toon_pars_fragment:Um,lights_phong_fragment:Fm,lights_phong_pars_fragment:Om,lights_physical_fragment:Bm,lights_physical_pars_fragment:zm,lights_fragment_begin:km,lights_fragment_maps:Vm,lights_fragment_end:Hm,lightprobes_pars_fragment:Gm,logdepthbuf_fragment:Wm,logdepthbuf_pars_fragment:Xm,logdepthbuf_pars_vertex:qm,logdepthbuf_vertex:$m,map_fragment:Ym,map_pars_fragment:Km,map_particle_fragment:Zm,map_particle_pars_fragment:jm,metalnessmap_fragment:Jm,metalnessmap_pars_fragment:Qm,morphinstance_vertex:eg,morphcolor_vertex:tg,morphnormal_vertex:ng,morphtarget_pars_vertex:ig,morphtarget_vertex:sg,normal_fragment_begin:ag,normal_fragment_maps:rg,normal_pars_fragment:og,normal_pars_vertex:lg,normal_vertex:cg,normalmap_pars_fragment:hg,clearcoat_normal_fragment_begin:ug,clearcoat_normal_fragment_maps:dg,clearcoat_pars_fragment:fg,iridescence_pars_fragment:pg,opaque_fragment:mg,packing:gg,premultiplied_alpha_fragment:_g,project_vertex:vg,dithering_fragment:xg,dithering_pars_fragment:Mg,roughnessmap_fragment:yg,roughnessmap_pars_fragment:Sg,shadowmap_pars_fragment:bg,shadowmap_pars_vertex:Eg,shadowmap_vertex:wg,shadowmask_pars_fragment:Tg,skinbase_vertex:Ag,skinning_pars_vertex:Rg,skinning_vertex:Cg,skinnormal_vertex:Pg,specularmap_fragment:Dg,specularmap_pars_fragment:Lg,tonemapping_fragment:Ig,tonemapping_pars_fragment:Ng,transmission_fragment:Ug,transmission_pars_fragment:Fg,uv_pars_fragment:Og,uv_pars_vertex:Bg,uv_vertex:zg,worldpos_vertex:kg,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},de={common:{diffuse:{value:new ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ie},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ie}},envmap:{envMap:{value:null},envMapRotation:{value:new Ie},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ie}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ie}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ie},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ie},normalScale:{value:new Te(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ie},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ie}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ie}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ie}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0},uvTransform:{value:new Ie}},sprite:{diffuse:{value:new ze(16777215)},opacity:{value:1},center:{value:new Te(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ie},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0}}},Cn={basic:{uniforms:Yt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:ke.meshbasic_vert,fragmentShader:ke.meshbasic_frag},lambert:{uniforms:Yt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new ze(0)},envMapIntensity:{value:1}}]),vertexShader:ke.meshlambert_vert,fragmentShader:ke.meshlambert_frag},phong:{uniforms:Yt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new ze(0)},specular:{value:new ze(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ke.meshphong_vert,fragmentShader:ke.meshphong_frag},standard:{uniforms:Yt([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag},toon:{uniforms:Yt([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new ze(0)}}]),vertexShader:ke.meshtoon_vert,fragmentShader:ke.meshtoon_frag},matcap:{uniforms:Yt([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:ke.meshmatcap_vert,fragmentShader:ke.meshmatcap_frag},points:{uniforms:Yt([de.points,de.fog]),vertexShader:ke.points_vert,fragmentShader:ke.points_frag},dashed:{uniforms:Yt([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ke.linedashed_vert,fragmentShader:ke.linedashed_frag},depth:{uniforms:Yt([de.common,de.displacementmap]),vertexShader:ke.depth_vert,fragmentShader:ke.depth_frag},normal:{uniforms:Yt([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:ke.meshnormal_vert,fragmentShader:ke.meshnormal_frag},sprite:{uniforms:Yt([de.sprite,de.fog]),vertexShader:ke.sprite_vert,fragmentShader:ke.sprite_frag},background:{uniforms:{uvTransform:{value:new Ie},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ke.background_vert,fragmentShader:ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ie}},vertexShader:ke.backgroundCube_vert,fragmentShader:ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ke.cube_vert,fragmentShader:ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ke.equirect_vert,fragmentShader:ke.equirect_frag},distance:{uniforms:Yt([de.common,de.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ke.distance_vert,fragmentShader:ke.distance_frag},shadow:{uniforms:Yt([de.lights,de.fog,{color:{value:new ze(0)},opacity:{value:1}}]),vertexShader:ke.shadow_vert,fragmentShader:ke.shadow_frag}};Cn.physical={uniforms:Yt([Cn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ie},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ie},clearcoatNormalScale:{value:new Te(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ie},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ie},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ie},sheen:{value:0},sheenColor:{value:new ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ie},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ie},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ie},transmissionSamplerSize:{value:new Te},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ie},attenuationDistance:{value:0},attenuationColor:{value:new ze(0)},specularColor:{value:new ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ie},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ie},anisotropyVector:{value:new Te},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ie}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag};const or={r:0,b:0,g:0},Vg=new at,Gh=new Ie;Gh.set(-1,0,0,0,1,0,0,0,1);function Hg(i,e,t,n,s,a){const r=new ze(0);let o=s===!0?0:1,l,c,h=null,d=0,u=null;function m(S){let T=S.isScene===!0?S.background:null;if(T&&T.isTexture){const y=S.backgroundBlurriness>0;T=e.get(T,y)}return T}function g(S){let T=!1;const y=m(S);y===null?p(r,o):y&&y.isColor&&(p(y,1),T=!0);const R=i.xr.getEnvironmentBlendMode();R==="additive"?t.buffers.color.setClear(0,0,0,1,a):R==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,a),(i.autoClear||T)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(S,T){const y=m(T);y&&(y.isCubeTexture||y.mapping===_a)?(c===void 0&&(c=new rt(new Ii(1,1,1),new xn({name:"BackgroundCubeMaterial",uniforms:fs(Cn.backgroundCube.uniforms),vertexShader:Cn.backgroundCube.vertexShader,fragmentShader:Cn.backgroundCube.fragmentShader,side:Xt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(R,b,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Vg.makeRotationFromEuler(T.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Gh),c.material.toneMapped=$e.getTransfer(y.colorSpace)!==Qe,(h!==y||d!==y.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=y,d=y.version,u=i.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new rt(new sr(2,2),new xn({name:"BackgroundMaterial",uniforms:fs(Cn.background.uniforms),vertexShader:Cn.background.vertexShader,fragmentShader:Cn.background.fragmentShader,side:kn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=$e.getTransfer(y.colorSpace)!==Qe,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||d!==y.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=y,d=y.version,u=i.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function p(S,T){S.getRGB(or,Ch(i)),t.buffers.color.setClear(or.r,or.g,or.b,T,a)}function f(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(S,T=1){r.set(S),o=T,p(r,o)},getClearAlpha:function(){return o},setClearAlpha:function(S){o=S,p(r,o)},render:g,addToRenderList:x,dispose:f}}function Gg(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let a=s,r=!1;function o(P,U,X,q,B){let W=!1;const H=d(P,q,X,U);a!==H&&(a=H,c(a.object)),W=m(P,q,X,B),W&&g(P,q,X,B),B!==null&&e.update(B,i.ELEMENT_ARRAY_BUFFER),(W||r)&&(r=!1,y(P,U,X,q),B!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function l(){return i.createVertexArray()}function c(P){return i.bindVertexArray(P)}function h(P){return i.deleteVertexArray(P)}function d(P,U,X,q){const B=q.wireframe===!0;let W=n[U.id];W===void 0&&(W={},n[U.id]=W);const H=P.isInstancedMesh===!0?P.id:0;let Z=W[H];Z===void 0&&(Z={},W[H]=Z);let J=Z[X.id];J===void 0&&(J={},Z[X.id]=J);let oe=J[B];return oe===void 0&&(oe=u(l()),J[B]=oe),oe}function u(P){const U=[],X=[],q=[];for(let B=0;B<t;B++)U[B]=0,X[B]=0,q[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:X,attributeDivisors:q,object:P,attributes:{},index:null}}function m(P,U,X,q){const B=a.attributes,W=U.attributes;let H=0;const Z=X.getAttributes();for(const J in Z)if(Z[J].location>=0){const ne=B[J];let fe=W[J];if(fe===void 0&&(J==="instanceMatrix"&&P.instanceMatrix&&(fe=P.instanceMatrix),J==="instanceColor"&&P.instanceColor&&(fe=P.instanceColor)),ne===void 0||ne.attribute!==fe||fe&&ne.data!==fe.data)return!0;H++}return a.attributesNum!==H||a.index!==q}function g(P,U,X,q){const B={},W=U.attributes;let H=0;const Z=X.getAttributes();for(const J in Z)if(Z[J].location>=0){let ne=W[J];ne===void 0&&(J==="instanceMatrix"&&P.instanceMatrix&&(ne=P.instanceMatrix),J==="instanceColor"&&P.instanceColor&&(ne=P.instanceColor));const fe={};fe.attribute=ne,ne&&ne.data&&(fe.data=ne.data),B[J]=fe,H++}a.attributes=B,a.attributesNum=H,a.index=q}function x(){const P=a.newAttributes;for(let U=0,X=P.length;U<X;U++)P[U]=0}function p(P){f(P,0)}function f(P,U){const X=a.newAttributes,q=a.enabledAttributes,B=a.attributeDivisors;X[P]=1,q[P]===0&&(i.enableVertexAttribArray(P),q[P]=1),B[P]!==U&&(i.vertexAttribDivisor(P,U),B[P]=U)}function S(){const P=a.newAttributes,U=a.enabledAttributes;for(let X=0,q=U.length;X<q;X++)U[X]!==P[X]&&(i.disableVertexAttribArray(X),U[X]=0)}function T(P,U,X,q,B,W,H){H===!0?i.vertexAttribIPointer(P,U,X,B,W):i.vertexAttribPointer(P,U,X,q,B,W)}function y(P,U,X,q){x();const B=q.attributes,W=X.getAttributes(),H=U.defaultAttributeValues;for(const Z in W){const J=W[Z];if(J.location>=0){let oe=B[Z];if(oe===void 0&&(Z==="instanceMatrix"&&P.instanceMatrix&&(oe=P.instanceMatrix),Z==="instanceColor"&&P.instanceColor&&(oe=P.instanceColor)),oe!==void 0){const ne=oe.normalized,fe=oe.itemSize,Ne=e.get(oe);if(Ne===void 0)continue;const Ze=Ne.buffer,Ve=Ne.type,K=Ne.bytesPerElement,re=Ve===i.INT||Ve===i.UNSIGNED_INT||oe.gpuType===jr;if(oe.isInterleavedBufferAttribute){const te=oe.data,Ee=te.stride,Re=oe.offset;if(te.isInstancedInterleavedBuffer){for(let xe=0;xe<J.locationSize;xe++)f(J.location+xe,te.meshPerAttribute);P.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let xe=0;xe<J.locationSize;xe++)p(J.location+xe);i.bindBuffer(i.ARRAY_BUFFER,Ze);for(let xe=0;xe<J.locationSize;xe++)T(J.location+xe,fe/J.locationSize,Ve,ne,Ee*K,(Re+fe/J.locationSize*xe)*K,re)}else{if(oe.isInstancedBufferAttribute){for(let te=0;te<J.locationSize;te++)f(J.location+te,oe.meshPerAttribute);P.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let te=0;te<J.locationSize;te++)p(J.location+te);i.bindBuffer(i.ARRAY_BUFFER,Ze);for(let te=0;te<J.locationSize;te++)T(J.location+te,fe/J.locationSize,Ve,ne,fe*K,fe/J.locationSize*te*K,re)}}else if(H!==void 0){const ne=H[Z];if(ne!==void 0)switch(ne.length){case 2:i.vertexAttrib2fv(J.location,ne);break;case 3:i.vertexAttrib3fv(J.location,ne);break;case 4:i.vertexAttrib4fv(J.location,ne);break;default:i.vertexAttrib1fv(J.location,ne)}}}}S()}function R(){w();for(const P in n){const U=n[P];for(const X in U){const q=U[X];for(const B in q){const W=q[B];for(const H in W)h(W[H].object),delete W[H];delete q[B]}}delete n[P]}}function b(P){if(n[P.id]===void 0)return;const U=n[P.id];for(const X in U){const q=U[X];for(const B in q){const W=q[B];for(const H in W)h(W[H].object),delete W[H];delete q[B]}}delete n[P.id]}function C(P){for(const U in n){const X=n[U];for(const q in X){const B=X[q];if(B[P.id]===void 0)continue;const W=B[P.id];for(const H in W)h(W[H].object),delete W[H];delete B[P.id]}}}function v(P){for(const U in n){const X=n[U],q=P.isInstancedMesh===!0?P.id:0,B=X[q];if(B!==void 0){for(const W in B){const H=B[W];for(const Z in H)h(H[Z].object),delete H[Z];delete B[W]}delete X[q],Object.keys(X).length===0&&delete n[U]}}}function w(){D(),r=!0,a!==s&&(a=s,c(a.object))}function D(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:w,resetDefaultState:D,dispose:R,releaseStatesOfGeometry:b,releaseStatesOfObject:v,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:p,disableUnusedAttributes:S}}function Wg(i,e,t){let n;function s(l){n=l}function a(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function r(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let m=0;m<h;m++)u+=c[m];t.update(u,n,1)}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o}function Xg(i,e,t,n){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(C){return!(C!==dn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const v=C===Hn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==tn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==wn&&!v)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Pe("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&Pe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),T=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),R=i.getParameter(i.MAX_SAMPLES),b=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:m,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:p,maxAttributes:f,maxVertexUniforms:S,maxVaryings:T,maxFragmentUniforms:y,maxSamples:R,samples:b}}function qg(i){const e=this;let t=null,n=0,s=!1,a=!1;const r=new hi,o=new Ie,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const m=d.length!==0||u||n!==0||s;return s=u,n=d.length,m},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,m){const g=d.clippingPlanes,x=d.clipIntersection,p=d.clipShadows,f=i.get(d);if(!s||g===null||g.length===0||a&&!p)a?h(null):c();else{const S=a?0:n,T=S*4;let y=f.clippingState||null;l.value=y,y=h(g,u,T,m);for(let R=0;R!==T;++R)y[R]=t[R];f.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,m,g){const x=d!==null?d.length:0;let p=null;if(x!==0){if(p=l.value,g!==!0||p===null){const f=m+x*4,S=u.matrixWorldInverse;o.getNormalMatrix(S),(p===null||p.length<f)&&(p=new Float32Array(f));for(let T=0,y=m;T!==x;++T,y+=4)r.copy(d[T]).applyMatrix4(S,o),r.normal.toArray(p,y),p[y+3]=r.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,p}}const fi=4,Wh=[.125,.215,.35,.446,.526,.582],Ni=20,$g=256,js=new Sl,Xh=new ze;let El=null,wl=0,Tl=0,Al=!1;const Yg=new L;class qh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,a={}){const{size:r=256,position:o=Yg}=a;El=this._renderer.getRenderTarget(),wl=this._renderer.getActiveCubeFace(),Tl=this._renderer.getActiveMipmapLevel(),Al=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Kh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Yh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(El,wl,Tl),this._renderer.xr.enabled=Al,e.scissorTest=!1,_s(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===wi||e.mapping===$i?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),El=this._renderer.getRenderTarget(),wl=this._renderer.getActiveCubeFace(),Tl=this._renderer.getActiveMipmapLevel(),Al=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:wt,minFilter:wt,generateMipmaps:!1,type:Hn,format:dn,colorSpace:wa,depthBuffer:!1},s=$h(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=$h(e,t,n);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Kg(a)),this._blurMaterial=jg(a,e,t),this._ggxMaterial=Zg(a,e,t)}return s}_compileMaterial(e){const t=new rt(new St,e);this._renderer.compile(t,js)}_sceneToCubeUV(e,t,n,s,a){const l=new an(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,m=d.toneMapping;d.getClearColor(Xh),d.toneMapping=bn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new rt(new Ii,new Ys({name:"PMREM.Background",side:Xt,depthWrite:!1,depthTest:!1})));const x=this._backgroundBox,p=x.material;let f=!1;const S=e.background;S?S.isColor&&(p.color.copy(S),e.background=null,f=!0):(p.color.copy(Xh),f=!0);for(let T=0;T<6;T++){const y=T%3;y===0?(l.up.set(0,c[T],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x+h[T],a.y,a.z)):y===1?(l.up.set(0,0,c[T]),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y+h[T],a.z)):(l.up.set(0,c[T],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y,a.z+h[T]));const R=this._cubeSize;_s(s,y*R,T>2?R:0,R,R),d.setRenderTarget(s),f&&d.render(x,l),d.render(e,l)}d.toneMapping=m,d.autoClear=u,e.background=S}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===wi||e.mapping===$i;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Kh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Yh());const a=s?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;const o=a.uniforms;o.envMap.value=e;const l=this._cubeSize;_s(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(r,js)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let a=1;a<s;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,a=this._pingPongRenderTarget,r=this._ggxMaterial,o=this._lodMeshes[n];o.material=r;const l=r.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=0+c*1.25,m=d*u,{_lodMax:g}=this,x=this._sizeLods[n],p=3*x*(n>g-fi?n-g+fi:0),f=4*(this._cubeSize-x);l.envMap.value=e.texture,l.roughness.value=m,l.mipInt.value=g-t,_s(a,p,f,3*x,2*x),s.setRenderTarget(a),s.render(o,js),l.envMap.value=a.texture,l.roughness.value=0,l.mipInt.value=g-n,_s(e,p,f,3*x,2*x),s.setRenderTarget(e),s.render(o,js)}_blur(e,t,n,s,a){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,n,s,"latitudinal",a),this._halfBlur(r,e,n,n,s,"longitudinal",a)}_halfBlur(e,t,n,s,a,r,o){const l=this._renderer,c=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&qe("blur direction must be either latitudinal or longitudinal!");const h=3,d=this._lodMeshes[s];d.material=c;const u=c.uniforms,m=this._sizeLods[n]-1,g=isFinite(a)?Math.PI/(2*m):2*Math.PI/(2*Ni-1),x=a/g,p=isFinite(a)?1+Math.floor(h*x):Ni;p>Ni&&Pe(`sigmaRadians, ${a}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Ni}`);const f=[];let S=0;for(let C=0;C<Ni;++C){const v=C/x,w=Math.exp(-v*v/2);f.push(w),C===0?S+=w:C<p&&(S+=2*w)}for(let C=0;C<f.length;C++)f[C]=f[C]/S;u.envMap.value=e.texture,u.samples.value=p,u.weights.value=f,u.latitudinal.value=r==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:T}=this;u.dTheta.value=g,u.mipInt.value=T-n;const y=this._sizeLods[s],R=3*y*(s>T-fi?s-T+fi:0),b=4*(this._cubeSize-y);_s(t,R,b,3*y,2*y),l.setRenderTarget(t),l.render(d,js)}}function Kg(i){const e=[],t=[],n=[];let s=i;const a=i-fi+1+Wh.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let l=1/o;r>i-fi?l=Wh[r-i+fi-1]:r===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],m=6,g=6,x=3,p=2,f=1,S=new Float32Array(x*g*m),T=new Float32Array(p*g*m),y=new Float32Array(f*g*m);for(let b=0;b<m;b++){const C=b%3*2/3-1,v=b>2?0:-1,w=[C,v,0,C+2/3,v,0,C+2/3,v+1,0,C,v,0,C+2/3,v+1,0,C,v+1,0];S.set(w,x*g*b),T.set(u,p*g*b);const D=[b,b,b,b,b,b];y.set(D,f*g*b)}const R=new St;R.setAttribute("position",new qt(S,x)),R.setAttribute("uv",new qt(T,p)),R.setAttribute("faceIndex",new qt(y,f)),n.push(new rt(R,null)),s>fi&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function $h(i,e,t){const n=new An(i,e,t);return n.texture.mapping=_a,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function _s(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Zg(i,e,t){return new xn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:$g,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:lr(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function jg(i,e,t){const n=new Float32Array(Ni),s=new L(0,1,0);return new xn({name:"SphericalGaussianBlur",defines:{n:Ni,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:lr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function Yh(){return new xn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:lr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function Kh(){return new xn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:lr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function lr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class Zh extends An{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Th(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Ii(5,5,5),a=new xn({name:"CubemapFromEquirect",uniforms:fs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Xt,blending:Vn});a.uniforms.tEquirect.value=t;const r=new rt(s,a),o=t.minFilter;return t.minFilter===un&&(t.minFilter=wt),new Up(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const a=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,n,s);e.setRenderTarget(a)}}function Jg(i){let e=new WeakMap,t=new WeakMap,n=null;function s(u,m=!1){return u==null?null:m?r(u):a(u)}function a(u){if(u&&u.isTexture){const m=u.mapping;if(m===$r||m===Yr)if(e.has(u)){const g=e.get(u).texture;return o(g,u.mapping)}else{const g=u.image;if(g&&g.height>0){const x=new Zh(g.height);return x.fromEquirectangularTexture(i,u),e.set(u,x),u.addEventListener("dispose",c),o(x.texture,u.mapping)}else return null}}return u}function r(u){if(u&&u.isTexture){const m=u.mapping,g=m===$r||m===Yr,x=m===wi||m===$i;if(g||x){let p=t.get(u);const f=p!==void 0?p.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==f)return n===null&&(n=new qh(i)),p=g?n.fromEquirectangular(u,p):n.fromCubemap(u,p),p.texture.pmremVersion=u.pmremVersion,t.set(u,p),p.texture;if(p!==void 0)return p.texture;{const S=u.image;return g&&S&&S.height>0||x&&S&&l(S)?(n===null&&(n=new qh(i)),p=g?n.fromEquirectangular(u):n.fromCubemap(u),p.texture.pmremVersion=u.pmremVersion,t.set(u,p),u.addEventListener("dispose",h),p.texture):null}}}return u}function o(u,m){return m===$r?u.mapping=wi:m===Yr&&(u.mapping=$i),u}function l(u){let m=0;const g=6;for(let x=0;x<g;x++)u[x]!==void 0&&m++;return m===g}function c(u){const m=u.target;m.removeEventListener("dispose",c);const g=e.get(m);g!==void 0&&(e.delete(m),g.dispose())}function h(u){const m=u.target;m.removeEventListener("dispose",h);const g=t.get(m);g!==void 0&&(t.delete(m),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function Qg(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Ki("WebGLRenderer: "+n+" extension not supported."),s}}}function e0(i,e,t,n){const s={},a=new WeakMap;function r(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",r),delete s[u.id];const m=a.get(u);m&&(e.remove(m),a.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",r),s[u.id]=!0,t.memory.geometries++),u}function l(d){const u=d.attributes;for(const m in u)e.update(u[m],i.ARRAY_BUFFER)}function c(d){const u=[],m=d.index,g=d.attributes.position;let x=0;if(g===void 0)return;if(m!==null){const S=m.array;x=m.version;for(let T=0,y=S.length;T<y;T+=3){const R=S[T+0],b=S[T+1],C=S[T+2];u.push(R,b,b,C,C,R)}}else{const S=g.array;x=g.version;for(let T=0,y=S.length/3-1;T<y;T+=3){const R=T+0,b=T+1,C=T+2;u.push(R,b,b,C,C,R)}}const p=new(g.count>=65535?dh:uh)(u,1);p.version=x;const f=a.get(d);f&&e.remove(f),a.set(d,p)}function h(d){const u=a.get(d);if(u){const m=d.index;m!==null&&u.version<m.version&&c(d)}else c(d);return a.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function t0(i,e,t){let n;function s(d){n=d}let a,r;function o(d){a=d.type,r=d.bytesPerElement}function l(d,u){i.drawElements(n,u,a,d*r),t.update(u,n,1)}function c(d,u,m){m!==0&&(i.drawElementsInstanced(n,u,a,d*r,m),t.update(u,n,m))}function h(d,u,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,a,d,0,m);let x=0;for(let p=0;p<m;p++)x+=u[p];t.update(x,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function n0(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,r,o){switch(t.calls++,r){case i.TRIANGLES:t.triangles+=o*(a/3);break;case i.LINES:t.lines+=o*(a/2);break;case i.LINE_STRIP:t.lines+=o*(a-1);break;case i.LINE_LOOP:t.lines+=o*a;break;case i.POINTS:t.points+=o*a;break;default:qe("WebGLInfo: Unknown draw mode:",r);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function i0(i,e,t){const n=new WeakMap,s=new _t;function a(r,o,l){const c=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==d){let w=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",w)};u!==void 0&&u.texture.dispose();const m=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let T=0;m===!0&&(T=1),g===!0&&(T=2),x===!0&&(T=3);let y=o.attributes.position.count*T,R=1;y>e.maxTextureSize&&(R=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const b=new Float32Array(y*R*4*d),C=new th(b,y,R,d);C.type=wn,C.needsUpdate=!0;const v=T*4;for(let D=0;D<d;D++){const P=p[D],U=f[D],X=S[D],q=y*R*4*D;for(let B=0;B<P.count;B++){const W=B*v;m===!0&&(s.fromBufferAttribute(P,B),b[q+W+0]=s.x,b[q+W+1]=s.y,b[q+W+2]=s.z,b[q+W+3]=0),g===!0&&(s.fromBufferAttribute(U,B),b[q+W+4]=s.x,b[q+W+5]=s.y,b[q+W+6]=s.z,b[q+W+7]=0),x===!0&&(s.fromBufferAttribute(X,B),b[q+W+8]=s.x,b[q+W+9]=s.y,b[q+W+10]=s.z,b[q+W+11]=X.itemSize===4?s.w:1)}}u={count:d,texture:C,size:new Te(y,R)},n.set(o,u),o.addEventListener("dispose",w)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",r.morphTexture,t);else{let m=0;for(let x=0;x<c.length;x++)m+=c[x];const g=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:a}}function s0(i,e,t,n,s){let a=new WeakMap;function r(c){const h=s.render.frame,d=c.geometry,u=e.get(c,d);if(a.get(u)!==h&&(e.update(u),a.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),a.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),a.set(c,h))),c.isSkinnedMesh){const m=c.skeleton;a.get(m)!==h&&(m.update(),a.set(m,h))}return u}function o(){a=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:o}}const a0={[Ic]:"LINEAR_TONE_MAPPING",[Nc]:"REINHARD_TONE_MAPPING",[Uc]:"CINEON_TONE_MAPPING",[qr]:"ACES_FILMIC_TONE_MAPPING",[Oc]:"AGX_TONE_MAPPING",[Bc]:"NEUTRAL_TONE_MAPPING",[Fc]:"CUSTOM_TONE_MAPPING"};function r0(i,e,t,n,s,a){const r=new An(e,t,{type:i,depthBuffer:s,stencilBuffer:a,samples:n?4:0,depthTexture:s?new us(e,t):void 0}),o=new An(e,t,{type:Hn,depthBuffer:!1,stencilBuffer:!1}),l=new St;l.setAttribute("position",new vt([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new vt([0,2,0,0,2,0],2));const c=new bp({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new rt(l,c),d=new Sl(-1,1,1,-1,0,1);let u=null,m=null,g=!1,x,p=null,f=[],S=!1;this.setSize=function(T,y){r.setSize(T,y),o.setSize(T,y);for(let R=0;R<f.length;R++){const b=f[R];b.setSize&&b.setSize(T,y)}},this.setEffects=function(T){f=T,S=f.length>0&&f[0].isRenderPass===!0;const y=r.width,R=r.height;for(let b=0;b<f.length;b++){const C=f[b];C.setSize&&C.setSize(y,R)}},this.begin=function(T,y){if(g||T.toneMapping===bn&&f.length===0)return!1;if(p=y,y!==null){const R=y.width,b=y.height;(r.width!==R||r.height!==b)&&this.setSize(R,b)}return S===!1&&T.setRenderTarget(r),x=T.toneMapping,T.toneMapping=bn,!0},this.hasRenderPass=function(){return S},this.end=function(T,y){T.toneMapping=x,g=!0;let R=r,b=o;for(let C=0;C<f.length;C++){const v=f[C];if(v.enabled!==!1&&(v.render(T,b,R,y),v.needsSwap!==!1)){const w=R;R=b,b=w}}if(u!==T.outputColorSpace||m!==T.toneMapping){u=T.outputColorSpace,m=T.toneMapping,c.defines={},$e.getTransfer(u)===Qe&&(c.defines.SRGB_TRANSFER="");const C=a0[m];C&&(c.defines[C]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=R.texture,T.setRenderTarget(p),T.render(h,d),p=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){r.depthTexture&&r.depthTexture.dispose(),r.dispose(),o.dispose(),l.dispose(),c.dispose()}}const jh=new Bt,Rl=new us(1,1),Jh=new th,Qh=new Qf,eu=new Th,tu=[],nu=[],iu=new Float32Array(16),su=new Float32Array(9),au=new Float32Array(4);function vs(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let a=tu[s];if(a===void 0&&(a=new Float32Array(s),tu[s]=a),e!==0){n.toArray(a,0);for(let r=1,o=0;r!==e;++r)o+=t,i[r].toArray(a,o)}return a}function Ct(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Pt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function cr(i,e){let t=nu[e];t===void 0&&(t=new Int32Array(e),nu[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function o0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function l0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ct(t,e))return;i.uniform2fv(this.addr,e),Pt(t,e)}}function c0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ct(t,e))return;i.uniform3fv(this.addr,e),Pt(t,e)}}function h0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ct(t,e))return;i.uniform4fv(this.addr,e),Pt(t,e)}}function u0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ct(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Pt(t,e)}else{if(Ct(t,n))return;au.set(n),i.uniformMatrix2fv(this.addr,!1,au),Pt(t,n)}}function d0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ct(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Pt(t,e)}else{if(Ct(t,n))return;su.set(n),i.uniformMatrix3fv(this.addr,!1,su),Pt(t,n)}}function f0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ct(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Pt(t,e)}else{if(Ct(t,n))return;iu.set(n),i.uniformMatrix4fv(this.addr,!1,iu),Pt(t,n)}}function p0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function m0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ct(t,e))return;i.uniform2iv(this.addr,e),Pt(t,e)}}function g0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ct(t,e))return;i.uniform3iv(this.addr,e),Pt(t,e)}}function _0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ct(t,e))return;i.uniform4iv(this.addr,e),Pt(t,e)}}function v0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function x0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ct(t,e))return;i.uniform2uiv(this.addr,e),Pt(t,e)}}function M0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ct(t,e))return;i.uniform3uiv(this.addr,e),Pt(t,e)}}function y0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ct(t,e))return;i.uniform4uiv(this.addr,e),Pt(t,e)}}function S0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let a;this.type===i.SAMPLER_2D_SHADOW?(Rl.compareFunction=t.isReversedDepthBuffer()?Fo:Uo,a=Rl):a=jh,t.setTexture2D(e||a,s)}function b0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Qh,s)}function E0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||eu,s)}function w0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Jh,s)}function T0(i){switch(i){case 5126:return o0;case 35664:return l0;case 35665:return c0;case 35666:return h0;case 35674:return u0;case 35675:return d0;case 35676:return f0;case 5124:case 35670:return p0;case 35667:case 35671:return m0;case 35668:case 35672:return g0;case 35669:case 35673:return _0;case 5125:return v0;case 36294:return x0;case 36295:return M0;case 36296:return y0;case 35678:case 36198:case 36298:case 36306:case 35682:return S0;case 35679:case 36299:case 36307:return b0;case 35680:case 36300:case 36308:case 36293:return E0;case 36289:case 36303:case 36311:case 36292:return w0}}function A0(i,e){i.uniform1fv(this.addr,e)}function R0(i,e){const t=vs(e,this.size,2);i.uniform2fv(this.addr,t)}function C0(i,e){const t=vs(e,this.size,3);i.uniform3fv(this.addr,t)}function P0(i,e){const t=vs(e,this.size,4);i.uniform4fv(this.addr,t)}function D0(i,e){const t=vs(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function L0(i,e){const t=vs(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function I0(i,e){const t=vs(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function N0(i,e){i.uniform1iv(this.addr,e)}function U0(i,e){i.uniform2iv(this.addr,e)}function F0(i,e){i.uniform3iv(this.addr,e)}function O0(i,e){i.uniform4iv(this.addr,e)}function B0(i,e){i.uniform1uiv(this.addr,e)}function z0(i,e){i.uniform2uiv(this.addr,e)}function k0(i,e){i.uniform3uiv(this.addr,e)}function V0(i,e){i.uniform4uiv(this.addr,e)}function H0(i,e,t){const n=this.cache,s=e.length,a=cr(t,s);Ct(n,a)||(i.uniform1iv(this.addr,a),Pt(n,a));let r;this.type===i.SAMPLER_2D_SHADOW?r=Rl:r=jh;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||r,a[o])}function G0(i,e,t){const n=this.cache,s=e.length,a=cr(t,s);Ct(n,a)||(i.uniform1iv(this.addr,a),Pt(n,a));for(let r=0;r!==s;++r)t.setTexture3D(e[r]||Qh,a[r])}function W0(i,e,t){const n=this.cache,s=e.length,a=cr(t,s);Ct(n,a)||(i.uniform1iv(this.addr,a),Pt(n,a));for(let r=0;r!==s;++r)t.setTextureCube(e[r]||eu,a[r])}function X0(i,e,t){const n=this.cache,s=e.length,a=cr(t,s);Ct(n,a)||(i.uniform1iv(this.addr,a),Pt(n,a));for(let r=0;r!==s;++r)t.setTexture2DArray(e[r]||Jh,a[r])}function q0(i){switch(i){case 5126:return A0;case 35664:return R0;case 35665:return C0;case 35666:return P0;case 35674:return D0;case 35675:return L0;case 35676:return I0;case 5124:case 35670:return N0;case 35667:case 35671:return U0;case 35668:case 35672:return F0;case 35669:case 35673:return O0;case 5125:return B0;case 36294:return z0;case 36295:return k0;case 36296:return V0;case 35678:case 36198:case 36298:case 36306:case 35682:return H0;case 35679:case 36299:case 36307:return G0;case 35680:case 36300:case 36308:case 36293:return W0;case 36289:case 36303:case 36311:case 36292:return X0}}class $0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=T0(t.type)}}class Y0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=q0(t.type)}}class K0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(e,t[o.id],n)}}}const Cl=/(\w+)(\])?(\[|\.)?/g;function ru(i,e){i.seq.push(e),i.map[e.id]=e}function Z0(i,e,t){const n=i.name,s=n.length;for(Cl.lastIndex=0;;){const a=Cl.exec(n),r=Cl.lastIndex;let o=a[1];const l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===s){ru(t,c===void 0?new $0(o,i,e):new Y0(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new K0(o),ru(t,d)),t=d}}}class hr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const o=e.getActiveUniform(t,r),l=e.getUniformLocation(t,o.name);Z0(o,l,this)}const s=[],a=[];for(const r of this.seq)r.type===e.SAMPLER_2D_SHADOW||r.type===e.SAMPLER_CUBE_SHADOW||r.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(r):a.push(r);s.length>0&&(this.seq=s.concat(a))}setValue(e,t,n,s){const a=this.map[t];a!==void 0&&a.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let a=0,r=t.length;a!==r;++a){const o=t[a],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,a=e.length;s!==a;++s){const r=e[s];r.id in t&&n.push(r)}return n}}function ou(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const j0=37297;let J0=0;function Q0(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let r=s;r<a;r++){const o=r+1;n.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return n.join(`
`)}const lu=new Ie;function e_(i){$e._getMatrix(lu,$e.workingColorSpace,i);const e=`mat3( ${lu.elements.map(t=>t.toFixed(4))} )`;switch($e.getTransfer(i)){case Ta:return[e,"LinearTransferOETF"];case Qe:return[e,"sRGBTransferOETF"];default:return Pe("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function cu(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),a=(i.getShaderInfoLog(e)||"").trim();if(n&&a==="")return"";const r=/ERROR: 0:(\d+)/.exec(a);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+a+`

`+Q0(i.getShaderSource(e),o)}else return a}function t_(i,e){const t=e_(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const n_={[Ic]:"Linear",[Nc]:"Reinhard",[Uc]:"Cineon",[qr]:"ACESFilmic",[Oc]:"AgX",[Bc]:"Neutral",[Fc]:"Custom"};function i_(i,e){const t=n_[e];return t===void 0?(Pe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ur=new L;function s_(){$e.getLuminanceCoefficients(ur);const i=ur.x.toFixed(4),e=ur.y.toFixed(4),t=ur.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function a_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Js).join(`
`)}function r_(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function o_(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const a=i.getActiveAttrib(e,s),r=a.name;let o=1;a.type===i.FLOAT_MAT2&&(o=2),a.type===i.FLOAT_MAT3&&(o=3),a.type===i.FLOAT_MAT4&&(o=4),t[r]={type:a.type,location:i.getAttribLocation(e,r),locationSize:o}}return t}function Js(i){return i!==""}function hu(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function uu(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const l_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Pl(i){return i.replace(l_,h_)}const c_=new Map;function h_(i,e){let t=ke[e];if(t===void 0){const n=c_.get(e);if(n!==void 0)t=ke[n],Pe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Pl(t)}const u_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function du(i){return i.replace(u_,d_)}function d_(i,e,t,n){let s="";for(let a=parseInt(e);a<parseInt(t);a++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function fu(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const f_={[ma]:"SHADOWMAP_TYPE_PCF",[Ps]:"SHADOWMAP_TYPE_VSM"};function p_(i){return f_[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const m_={[wi]:"ENVMAP_TYPE_CUBE",[$i]:"ENVMAP_TYPE_CUBE",[_a]:"ENVMAP_TYPE_CUBE_UV"};function g_(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":m_[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const __={[$i]:"ENVMAP_MODE_REFRACTION"};function v_(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":__[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const x_={[Lc]:"ENVMAP_BLENDING_MULTIPLY",[_f]:"ENVMAP_BLENDING_MIX",[vf]:"ENVMAP_BLENDING_ADD"};function M_(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":x_[i.combine]||"ENVMAP_BLENDING_NONE"}function y_(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function S_(i,e,t,n){const s=i.getContext(),a=t.defines;let r=t.vertexShader,o=t.fragmentShader;const l=p_(t),c=g_(t),h=v_(t),d=M_(t),u=y_(t),m=a_(t),g=r_(a),x=s.createProgram();let p,f,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Js).join(`
`),p.length>0&&(p+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Js).join(`
`),f.length>0&&(f+=`
`)):(p=[fu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Js).join(`
`),f=[fu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==bn?"#define TONE_MAPPING":"",t.toneMapping!==bn?ke.tonemapping_pars_fragment:"",t.toneMapping!==bn?i_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ke.colorspace_pars_fragment,t_("linearToOutputTexel",t.outputColorSpace),s_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Js).join(`
`)),r=Pl(r),r=hu(r,t),r=uu(r,t),o=Pl(o),o=hu(o,t),o=uu(o,t),r=du(r),o=du(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,f=["#define varying in",t.glslVersion===Yc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Yc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const T=S+p+r,y=S+f+o,R=ou(s,s.VERTEX_SHADER,T),b=ou(s,s.FRAGMENT_SHADER,y);s.attachShader(x,R),s.attachShader(x,b),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function C(P){if(i.debug.checkShaderErrors){const U=s.getProgramInfoLog(x)||"",X=s.getShaderInfoLog(R)||"",q=s.getShaderInfoLog(b)||"",B=U.trim(),W=X.trim(),H=q.trim();let Z=!0,J=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(Z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,R,b);else{const oe=cu(s,R,"vertex"),ne=cu(s,b,"fragment");qe("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+B+`
`+oe+`
`+ne)}else B!==""?Pe("WebGLProgram: Program Info Log:",B):(W===""||H==="")&&(J=!1);J&&(P.diagnostics={runnable:Z,programLog:B,vertexShader:{log:W,prefix:p},fragmentShader:{log:H,prefix:f}})}s.deleteShader(R),s.deleteShader(b),v=new hr(s,x),w=o_(s,x)}let v;this.getUniforms=function(){return v===void 0&&C(this),v};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let D=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=s.getProgramParameter(x,j0)),D},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=J0++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=R,this.fragmentShader=b,this}let b_=0;class E_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new w_(e),t.set(e,n)),n}}class w_{constructor(e){this.id=b_++,this.code=e,this.usedTimes=0}}function T_(i){return i===Ri||i===ba||i===Ea}function A_(i,e,t,n,s,a){const r=new Wo,o=new E_,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer;let u=n.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(v){return l.add(v),v===0?"uv":`uv${v}`}function x(v,w,D,P,U,X){const q=P.fog,B=U.geometry,W=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?P.environment:null,H=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,Z=e.get(v.envMap||W,H),J=Z&&Z.mapping===_a?Z.image.height:null,oe=m[v.type];v.precision!==null&&(u=n.getMaxPrecision(v.precision),u!==v.precision&&Pe("WebGLProgram.getParameters:",v.precision,"not supported, using",u,"instead."));const ne=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,fe=ne!==void 0?ne.length:0;let Ne=0;B.morphAttributes.position!==void 0&&(Ne=1),B.morphAttributes.normal!==void 0&&(Ne=2),B.morphAttributes.color!==void 0&&(Ne=3);let Ze,Ve,K,re;if(oe){const Me=Cn[oe];Ze=Me.vertexShader,Ve=Me.fragmentShader}else{Ze=v.vertexShader,Ve=v.fragmentShader;const Me=o.getVertexShaderStage(v),Mt=o.getFragmentShaderStage(v);o.update(v,Me,Mt),K=Me.id,re=Mt.id}const te=i.getRenderTarget(),Ee=i.state.buffers.depth.getReversed(),Re=U.isInstancedMesh===!0,xe=U.isBatchedMesh===!0,Ye=!!v.map,ae=!!v.matcap,Le=!!Z,Oe=!!v.aoMap,Be=!!v.lightMap,nt=!!v.bumpMap&&v.wireframe===!1,ot=!!v.normalMap,dt=!!v.displacementMap,gt=!!v.emissiveMap,it=!!v.metalnessMap,lt=!!v.roughnessMap,I=v.anisotropy>0,xt=v.clearcoat>0,Xe=v.dispersion>0,A=v.iridescence>0,_=v.sheen>0,E=v.transmission>0,O=I&&!!v.anisotropyMap,V=xt&&!!v.clearcoatMap,ee=xt&&!!v.clearcoatNormalMap,ie=xt&&!!v.clearcoatRoughnessMap,$=A&&!!v.iridescenceMap,Y=A&&!!v.iridescenceThicknessMap,se=_&&!!v.sheenColorMap,ye=_&&!!v.sheenRoughnessMap,ce=!!v.specularMap,he=!!v.specularColorMap,Ce=!!v.specularIntensityMap,De=E&&!!v.transmissionMap,Ue=E&&!!v.thicknessMap,N=!!v.gradientMap,le=!!v.alphaMap,j=v.alphaTest>0,ue=!!v.alphaHash,ge=!!v.extensions;let Q=bn;v.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Q=i.toneMapping);const be={shaderID:oe,shaderType:v.type,shaderName:v.name,vertexShader:Ze,fragmentShader:Ve,defines:v.defines,customVertexShaderID:K,customFragmentShaderID:re,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:u,batching:xe,batchingColor:xe&&U._colorsTexture!==null,instancing:Re,instancingColor:Re&&U.instanceColor!==null,instancingMorph:Re&&U.morphTexture!==null,outputColorSpace:te===null?i.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:$e.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Ye,matcap:ae,envMap:Le,envMapMode:Le&&Z.mapping,envMapCubeUVHeight:J,aoMap:Oe,lightMap:Be,bumpMap:nt,normalMap:ot,displacementMap:dt,emissiveMap:gt,normalMapObjectSpace:ot&&v.normalMapType===yf,normalMapTangentSpace:ot&&v.normalMapType===No,packedNormalMap:ot&&v.normalMapType===No&&T_(v.normalMap.format),metalnessMap:it,roughnessMap:lt,anisotropy:I,anisotropyMap:O,clearcoat:xt,clearcoatMap:V,clearcoatNormalMap:ee,clearcoatRoughnessMap:ie,dispersion:Xe,iridescence:A,iridescenceMap:$,iridescenceThicknessMap:Y,sheen:_,sheenColorMap:se,sheenRoughnessMap:ye,specularMap:ce,specularColorMap:he,specularIntensityMap:Ce,transmission:E,transmissionMap:De,thicknessMap:Ue,gradientMap:N,opaque:v.transparent===!1&&v.blending===Xi&&v.alphaToCoverage===!1,alphaMap:le,alphaTest:j,alphaHash:ue,combine:v.combine,mapUv:Ye&&g(v.map.channel),aoMapUv:Oe&&g(v.aoMap.channel),lightMapUv:Be&&g(v.lightMap.channel),bumpMapUv:nt&&g(v.bumpMap.channel),normalMapUv:ot&&g(v.normalMap.channel),displacementMapUv:dt&&g(v.displacementMap.channel),emissiveMapUv:gt&&g(v.emissiveMap.channel),metalnessMapUv:it&&g(v.metalnessMap.channel),roughnessMapUv:lt&&g(v.roughnessMap.channel),anisotropyMapUv:O&&g(v.anisotropyMap.channel),clearcoatMapUv:V&&g(v.clearcoatMap.channel),clearcoatNormalMapUv:ee&&g(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ie&&g(v.clearcoatRoughnessMap.channel),iridescenceMapUv:$&&g(v.iridescenceMap.channel),iridescenceThicknessMapUv:Y&&g(v.iridescenceThicknessMap.channel),sheenColorMapUv:se&&g(v.sheenColorMap.channel),sheenRoughnessMapUv:ye&&g(v.sheenRoughnessMap.channel),specularMapUv:ce&&g(v.specularMap.channel),specularColorMapUv:he&&g(v.specularColorMap.channel),specularIntensityMapUv:Ce&&g(v.specularIntensityMap.channel),transmissionMapUv:De&&g(v.transmissionMap.channel),thicknessMapUv:Ue&&g(v.thicknessMap.channel),alphaMapUv:le&&g(v.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(ot||I),vertexNormals:!!B.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!B.attributes.uv&&(Ye||le),fog:!!q,useFog:v.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||B.attributes.normal===void 0&&ot===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Ee,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:B.attributes.position!==void 0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:fe,morphTextureStride:Ne,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:X.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:Q,decodeVideoTexture:Ye&&v.map.isVideoTexture===!0&&$e.getTransfer(v.map.colorSpace)===Qe,decodeVideoTextureEmissive:gt&&v.emissiveMap.isVideoTexture===!0&&$e.getTransfer(v.emissiveMap.colorSpace)===Qe,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===on,flipSided:v.side===Xt,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:ge&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ge&&v.extensions.multiDraw===!0||xe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return be.vertexUv1s=l.has(1),be.vertexUv2s=l.has(2),be.vertexUv3s=l.has(3),l.clear(),be}function p(v){const w=[];if(v.shaderID?w.push(v.shaderID):(w.push(v.customVertexShaderID),w.push(v.customFragmentShaderID)),v.defines!==void 0)for(const D in v.defines)w.push(D),w.push(v.defines[D]);return v.isRawShaderMaterial===!1&&(f(w,v),S(w,v),w.push(i.outputColorSpace)),w.push(v.customProgramCacheKey),w.join()}function f(v,w){v.push(w.precision),v.push(w.outputColorSpace),v.push(w.envMapMode),v.push(w.envMapCubeUVHeight),v.push(w.mapUv),v.push(w.alphaMapUv),v.push(w.lightMapUv),v.push(w.aoMapUv),v.push(w.bumpMapUv),v.push(w.normalMapUv),v.push(w.displacementMapUv),v.push(w.emissiveMapUv),v.push(w.metalnessMapUv),v.push(w.roughnessMapUv),v.push(w.anisotropyMapUv),v.push(w.clearcoatMapUv),v.push(w.clearcoatNormalMapUv),v.push(w.clearcoatRoughnessMapUv),v.push(w.iridescenceMapUv),v.push(w.iridescenceThicknessMapUv),v.push(w.sheenColorMapUv),v.push(w.sheenRoughnessMapUv),v.push(w.specularMapUv),v.push(w.specularColorMapUv),v.push(w.specularIntensityMapUv),v.push(w.transmissionMapUv),v.push(w.thicknessMapUv),v.push(w.combine),v.push(w.fogExp2),v.push(w.sizeAttenuation),v.push(w.morphTargetsCount),v.push(w.morphAttributeCount),v.push(w.numDirLights),v.push(w.numPointLights),v.push(w.numSpotLights),v.push(w.numSpotLightMaps),v.push(w.numHemiLights),v.push(w.numRectAreaLights),v.push(w.numDirLightShadows),v.push(w.numPointLightShadows),v.push(w.numSpotLightShadows),v.push(w.numSpotLightShadowsWithMaps),v.push(w.numLightProbes),v.push(w.shadowMapType),v.push(w.toneMapping),v.push(w.numClippingPlanes),v.push(w.numClipIntersection),v.push(w.depthPacking)}function S(v,w){r.disableAll(),w.instancing&&r.enable(0),w.instancingColor&&r.enable(1),w.instancingMorph&&r.enable(2),w.matcap&&r.enable(3),w.envMap&&r.enable(4),w.normalMapObjectSpace&&r.enable(5),w.normalMapTangentSpace&&r.enable(6),w.clearcoat&&r.enable(7),w.iridescence&&r.enable(8),w.alphaTest&&r.enable(9),w.vertexColors&&r.enable(10),w.vertexAlphas&&r.enable(11),w.vertexUv1s&&r.enable(12),w.vertexUv2s&&r.enable(13),w.vertexUv3s&&r.enable(14),w.vertexTangents&&r.enable(15),w.anisotropy&&r.enable(16),w.alphaHash&&r.enable(17),w.batching&&r.enable(18),w.dispersion&&r.enable(19),w.batchingColor&&r.enable(20),w.gradientMap&&r.enable(21),w.packedNormalMap&&r.enable(22),w.vertexNormals&&r.enable(23),v.push(r.mask),r.disableAll(),w.fog&&r.enable(0),w.useFog&&r.enable(1),w.flatShading&&r.enable(2),w.logarithmicDepthBuffer&&r.enable(3),w.reversedDepthBuffer&&r.enable(4),w.skinning&&r.enable(5),w.morphTargets&&r.enable(6),w.morphNormals&&r.enable(7),w.morphColors&&r.enable(8),w.premultipliedAlpha&&r.enable(9),w.shadowMapEnabled&&r.enable(10),w.doubleSided&&r.enable(11),w.flipSided&&r.enable(12),w.useDepthPacking&&r.enable(13),w.dithering&&r.enable(14),w.transmission&&r.enable(15),w.sheen&&r.enable(16),w.opaque&&r.enable(17),w.pointsUvs&&r.enable(18),w.decodeVideoTexture&&r.enable(19),w.decodeVideoTextureEmissive&&r.enable(20),w.alphaToCoverage&&r.enable(21),w.numLightProbeGrids>0&&r.enable(22),w.hasPositionAttribute&&r.enable(23),v.push(r.mask)}function T(v){const w=m[v.type];let D;if(w){const P=Cn[w];D=Mp.clone(P.uniforms)}else D=v.uniforms;return D}function y(v,w){let D=h.get(w);return D!==void 0?++D.usedTimes:(D=new S_(i,w,v,s),c.push(D),h.set(w,D)),D}function R(v){if(--v.usedTimes===0){const w=c.indexOf(v);c[w]=c[c.length-1],c.pop(),h.delete(v.cacheKey),v.destroy()}}function b(v){o.remove(v)}function C(){o.dispose()}return{getParameters:x,getProgramCacheKey:p,getUniforms:T,acquireProgram:y,releaseProgram:R,releaseShaderCache:b,programs:c,dispose:C}}function R_(){let i=new WeakMap;function e(r){return i.has(r)}function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function n(r){i.delete(r)}function s(r,o,l){i.get(r)[o]=l}function a(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:a}}function C_(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function pu(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function mu(){const i=[];let e=0;const t=[],n=[],s=[];function a(){e=0,t.length=0,n.length=0,s.length=0}function r(u){let m=0;return u.isInstancedMesh&&(m+=2),u.isSkinnedMesh&&(m+=1),m}function o(u,m,g,x,p,f){let S=i[e];return S===void 0?(S={id:u.id,object:u,geometry:m,material:g,materialVariant:r(u),groupOrder:x,renderOrder:u.renderOrder,z:p,group:f},i[e]=S):(S.id=u.id,S.object=u,S.geometry=m,S.material=g,S.materialVariant=r(u),S.groupOrder=x,S.renderOrder=u.renderOrder,S.z=p,S.group=f),e++,S}function l(u,m,g,x,p,f){const S=o(u,m,g,x,p,f);g.transmission>0?n.push(S):g.transparent===!0?s.push(S):t.push(S)}function c(u,m,g,x,p,f){const S=o(u,m,g,x,p,f);g.transmission>0?n.unshift(S):g.transparent===!0?s.unshift(S):t.unshift(S)}function h(u,m,g){t.length>1&&t.sort(u||C_),n.length>1&&n.sort(m||pu),s.length>1&&s.sort(m||pu),g&&(t.reverse(),n.reverse(),s.reverse())}function d(){for(let u=e,m=i.length;u<m;u++){const g=i[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:a,push:l,unshift:c,finish:d,sort:h}}function P_(){let i=new WeakMap;function e(n,s){const a=i.get(n);let r;return a===void 0?(r=new mu,i.set(n,[r])):s>=a.length?(r=new mu,a.push(r)):r=a[s],r}function t(){i=new WeakMap}return{get:e,dispose:t}}function D_(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new ze};break;case"SpotLight":t={position:new L,direction:new L,color:new ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new ze,groundColor:new ze};break;case"RectAreaLight":t={color:new ze,position:new L,halfWidth:new L,halfHeight:new L};break}return i[e.id]=t,t}}}function L_(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let I_=0;function N_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function U_(i){const e=new D_,t=L_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);const s=new L,a=new at,r=new at;function o(c){let h=0,d=0,u=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let m=0,g=0,x=0,p=0,f=0,S=0,T=0,y=0,R=0,b=0,C=0;c.sort(N_);for(let w=0,D=c.length;w<D;w++){const P=c[w],U=P.color,X=P.intensity,q=P.distance;let B=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Ri?B=P.shadow.map.texture:B=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=U.r*X,d+=U.g*X,u+=U.b*X;else if(P.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(P.sh.coefficients[W],X);C++}else if(P.isDirectionalLight){const W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const H=P.shadow,Z=t.get(P);Z.shadowIntensity=H.intensity,Z.shadowBias=H.bias,Z.shadowNormalBias=H.normalBias,Z.shadowRadius=H.radius,Z.shadowMapSize=H.mapSize,n.directionalShadow[m]=Z,n.directionalShadowMap[m]=B,n.directionalShadowMatrix[m]=P.shadow.matrix,S++}n.directional[m]=W,m++}else if(P.isSpotLight){const W=e.get(P);W.position.setFromMatrixPosition(P.matrixWorld),W.color.copy(U).multiplyScalar(X),W.distance=q,W.coneCos=Math.cos(P.angle),W.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),W.decay=P.decay,n.spot[x]=W;const H=P.shadow;if(P.map&&(n.spotLightMap[R]=P.map,R++,H.updateMatrices(P),P.castShadow&&b++),n.spotLightMatrix[x]=H.matrix,P.castShadow){const Z=t.get(P);Z.shadowIntensity=H.intensity,Z.shadowBias=H.bias,Z.shadowNormalBias=H.normalBias,Z.shadowRadius=H.radius,Z.shadowMapSize=H.mapSize,n.spotShadow[x]=Z,n.spotShadowMap[x]=B,y++}x++}else if(P.isRectAreaLight){const W=e.get(P);W.color.copy(U).multiplyScalar(X),W.halfWidth.set(P.width*.5,0,0),W.halfHeight.set(0,P.height*.5,0),n.rectArea[p]=W,p++}else if(P.isPointLight){const W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),W.distance=P.distance,W.decay=P.decay,P.castShadow){const H=P.shadow,Z=t.get(P);Z.shadowIntensity=H.intensity,Z.shadowBias=H.bias,Z.shadowNormalBias=H.normalBias,Z.shadowRadius=H.radius,Z.shadowMapSize=H.mapSize,Z.shadowCameraNear=H.camera.near,Z.shadowCameraFar=H.camera.far,n.pointShadow[g]=Z,n.pointShadowMap[g]=B,n.pointShadowMatrix[g]=P.shadow.matrix,T++}n.point[g]=W,g++}else if(P.isHemisphereLight){const W=e.get(P);W.skyColor.copy(P.color).multiplyScalar(X),W.groundColor.copy(P.groundColor).multiplyScalar(X),n.hemi[f]=W,f++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=de.LTC_FLOAT_1,n.rectAreaLTC2=de.LTC_FLOAT_2):(n.rectAreaLTC1=de.LTC_HALF_1,n.rectAreaLTC2=de.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const v=n.hash;(v.directionalLength!==m||v.pointLength!==g||v.spotLength!==x||v.rectAreaLength!==p||v.hemiLength!==f||v.numDirectionalShadows!==S||v.numPointShadows!==T||v.numSpotShadows!==y||v.numSpotMaps!==R||v.numLightProbes!==C)&&(n.directional.length=m,n.spot.length=x,n.rectArea.length=p,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=T,n.pointShadowMap.length=T,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=T,n.spotLightMatrix.length=y+R-b,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=C,v.directionalLength=m,v.pointLength=g,v.spotLength=x,v.rectAreaLength=p,v.hemiLength=f,v.numDirectionalShadows=S,v.numPointShadows=T,v.numSpotShadows=y,v.numSpotMaps=R,v.numLightProbes=C,n.version=I_++)}function l(c,h){let d=0,u=0,m=0,g=0,x=0;const p=h.matrixWorldInverse;for(let f=0,S=c.length;f<S;f++){const T=c[f];if(T.isDirectionalLight){const y=n.directional[d];y.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(p),d++}else if(T.isSpotLight){const y=n.spot[m];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(p),y.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(p),m++}else if(T.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(p),r.identity(),a.copy(T.matrixWorld),a.premultiply(p),r.extractRotation(a),y.halfWidth.set(T.width*.5,0,0),y.halfHeight.set(0,T.height*.5,0),y.halfWidth.applyMatrix4(r),y.halfHeight.applyMatrix4(r),g++}else if(T.isPointLight){const y=n.point[u];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(p),u++}else if(T.isHemisphereLight){const y=n.hemi[x];y.direction.setFromMatrixPosition(T.matrixWorld),y.direction.transformDirection(p),x++}}}return{setup:o,setupView:l,state:n}}function gu(i){const e=new U_(i),t=[],n=[],s=[];function a(u){d.camera=u,t.length=0,n.length=0,s.length=0}function r(u){t.push(u)}function o(u){n.push(u)}function l(u){s.push(u)}function c(){e.setup(t)}function h(u){e.setupView(t,u)}const d={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:c,setupLightsView:h,pushLight:r,pushShadow:o,pushLightProbeGrid:l}}function F_(i){let e=new WeakMap;function t(s,a=0){const r=e.get(s);let o;return r===void 0?(o=new gu(i),e.set(s,[o])):a>=r.length?(o=new gu(i),r.push(o)):o=r[a],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const O_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,B_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,z_=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],k_=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],_u=new at,Qs=new L,Dl=new L;function V_(i,e,t){let n=new ul;const s=new Te,a=new Te,r=new _t,o=new Ep,l=new wp,c={},h=t.maxTextureSize,d={[kn]:Xt,[Xt]:kn,[on]:on},u=new xn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Te},radius:{value:4}},vertexShader:O_,fragmentShader:B_}),m=u.clone();m.defines.HORIZONTAL_PASS=1;const g=new St;g.setAttribute("position",new qt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new rt(g,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ma;let f=this.type;this.render=function(b,C,v){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||b.length===0)return;this.type===jd&&(Pe("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=ma);const w=i.getRenderTarget(),D=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),U=i.state;U.setBlending(Vn),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const X=f!==this.type;X&&C.traverse(function(q){q.material&&(Array.isArray(q.material)?q.material.forEach(B=>B.needsUpdate=!0):q.material.needsUpdate=!0)});for(let q=0,B=b.length;q<B;q++){const W=b[q],H=W.shadow;if(H===void 0){Pe("WebGLShadowMap:",W,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const Z=H.getFrameExtents();s.multiply(Z),a.copy(H.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/Z.x),s.x=a.x*Z.x,H.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/Z.y),s.y=a.y*Z.y,H.mapSize.y=a.y));const J=i.state.buffers.depth.getReversed();if(H.camera._reversedDepth=J,H.map===null||X===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===Ps){if(W.isPointLight){Pe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new An(s.x,s.y,{format:Ri,type:Hn,minFilter:wt,magFilter:wt,generateMipmaps:!1}),H.map.texture.name=W.name+".shadowMap",H.map.depthTexture=new us(s.x,s.y,wn),H.map.depthTexture.name=W.name+".shadowMapDepth",H.map.depthTexture.format=Gn,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Ft,H.map.depthTexture.magFilter=Ft}else W.isPointLight?(H.map=new Zh(s.x),H.map.depthTexture=new vp(s.x,En)):(H.map=new An(s.x,s.y),H.map.depthTexture=new us(s.x,s.y,En)),H.map.depthTexture.name=W.name+".shadowMap",H.map.depthTexture.format=Gn,this.type===ma?(H.map.depthTexture.compareFunction=J?Fo:Uo,H.map.depthTexture.minFilter=wt,H.map.depthTexture.magFilter=wt):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Ft,H.map.depthTexture.magFilter=Ft);H.camera.updateProjectionMatrix()}const oe=H.map.isWebGLCubeRenderTarget?6:1;for(let ne=0;ne<oe;ne++){if(H.map.isWebGLCubeRenderTarget)i.setRenderTarget(H.map,ne),i.clear();else{ne===0&&(i.setRenderTarget(H.map),i.clear());const fe=H.getViewport(ne);r.set(a.x*fe.x,a.y*fe.y,a.x*fe.z,a.y*fe.w),U.viewport(r)}if(W.isPointLight){const fe=H.camera,Ne=H.matrix,Ze=W.distance||fe.far;Ze!==fe.far&&(fe.far=Ze,fe.updateProjectionMatrix()),Qs.setFromMatrixPosition(W.matrixWorld),fe.position.copy(Qs),Dl.copy(fe.position),Dl.add(z_[ne]),fe.up.copy(k_[ne]),fe.lookAt(Dl),fe.updateMatrixWorld(),Ne.makeTranslation(-Qs.x,-Qs.y,-Qs.z),_u.multiplyMatrices(fe.projectionMatrix,fe.matrixWorldInverse),H._frustum.setFromProjectionMatrix(_u,fe.coordinateSystem,fe.reversedDepth)}else H.updateMatrices(W);n=H.getFrustum(),y(C,v,H.camera,W,this.type)}H.isPointLightShadow!==!0&&this.type===Ps&&S(H,v),H.needsUpdate=!1}f=this.type,p.needsUpdate=!1,i.setRenderTarget(w,D,P)};function S(b,C){const v=e.update(x);u.defines.VSM_SAMPLES!==b.blurSamples&&(u.defines.VSM_SAMPLES=b.blurSamples,m.defines.VSM_SAMPLES=b.blurSamples,u.needsUpdate=!0,m.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new An(s.x,s.y,{format:Ri,type:Hn})),u.uniforms.shadow_pass.value=b.map.depthTexture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(C,null,v,u,x,null),m.uniforms.shadow_pass.value=b.mapPass.texture,m.uniforms.resolution.value=b.mapSize,m.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(C,null,v,m,x,null)}function T(b,C,v,w){let D=null;const P=v.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(P!==void 0)D=P;else if(D=v.isPointLight===!0?l:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const U=D.uuid,X=C.uuid;let q=c[U];q===void 0&&(q={},c[U]=q);let B=q[X];B===void 0&&(B=D.clone(),q[X]=B,C.addEventListener("dispose",R)),D=B}if(D.visible=C.visible,D.wireframe=C.wireframe,w===Ps?D.side=C.shadowSide!==null?C.shadowSide:C.side:D.side=C.shadowSide!==null?C.shadowSide:d[C.side],D.alphaMap=C.alphaMap,D.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,D.map=C.map,D.clipShadows=C.clipShadows,D.clippingPlanes=C.clippingPlanes,D.clipIntersection=C.clipIntersection,D.displacementMap=C.displacementMap,D.displacementScale=C.displacementScale,D.displacementBias=C.displacementBias,D.wireframeLinewidth=C.wireframeLinewidth,D.linewidth=C.linewidth,v.isPointLight===!0&&D.isMeshDistanceMaterial===!0){const U=i.properties.get(D);U.light=v}return D}function y(b,C,v,w,D){if(b.visible===!1)return;if(b.layers.test(C.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&D===Ps)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,b.matrixWorld);const X=e.update(b),q=b.material;if(Array.isArray(q)){const B=X.groups;for(let W=0,H=B.length;W<H;W++){const Z=B[W],J=q[Z.materialIndex];if(J&&J.visible){const oe=T(b,J,w,D);b.onBeforeShadow(i,b,C,v,X,oe,Z),i.renderBufferDirect(v,null,X,oe,b,Z),b.onAfterShadow(i,b,C,v,X,oe,Z)}}}else if(q.visible){const B=T(b,q,w,D);b.onBeforeShadow(i,b,C,v,X,B,null),i.renderBufferDirect(v,null,X,B,b,null),b.onAfterShadow(i,b,C,v,X,B,null)}}const U=b.children;for(let X=0,q=U.length;X<q;X++)y(U[X],C,v,w,D)}function R(b){b.target.removeEventListener("dispose",R);for(const v in c){const w=c[v],D=b.target.uuid;D in w&&(w[D].dispose(),delete w[D])}}}function H_(i,e){function t(){let N=!1;const le=new _t;let j=null;const ue=new _t(0,0,0,0);return{setMask:function(ge){j!==ge&&!N&&(i.colorMask(ge,ge,ge,ge),j=ge)},setLocked:function(ge){N=ge},setClear:function(ge,Q,be,Me,Mt){Mt===!0&&(ge*=Me,Q*=Me,be*=Me),le.set(ge,Q,be,Me),ue.equals(le)===!1&&(i.clearColor(ge,Q,be,Me),ue.copy(le))},reset:function(){N=!1,j=null,ue.set(-1,0,0,0)}}}function n(){let N=!1,le=!1,j=null,ue=null,ge=null;return{setReversed:function(Q){if(le!==Q){const be=e.get("EXT_clip_control");Q?be.clipControlEXT(be.LOWER_LEFT_EXT,be.ZERO_TO_ONE_EXT):be.clipControlEXT(be.LOWER_LEFT_EXT,be.NEGATIVE_ONE_TO_ONE_EXT),le=Q;const Me=ge;ge=null,this.setClear(Me)}},getReversed:function(){return le},setTest:function(Q){Q?te(i.DEPTH_TEST):Ee(i.DEPTH_TEST)},setMask:function(Q){j!==Q&&!N&&(i.depthMask(Q),j=Q)},setFunc:function(Q){if(le&&(Q=Df[Q]),ue!==Q){switch(Q){case zr:i.depthFunc(i.NEVER);break;case kr:i.depthFunc(i.ALWAYS);break;case Vr:i.depthFunc(i.LESS);break;case qi:i.depthFunc(i.LEQUAL);break;case Hr:i.depthFunc(i.EQUAL);break;case Gr:i.depthFunc(i.GEQUAL);break;case Wr:i.depthFunc(i.GREATER);break;case Xr:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ue=Q}},setLocked:function(Q){N=Q},setClear:function(Q){ge!==Q&&(ge=Q,le&&(Q=1-Q),i.clearDepth(Q))},reset:function(){N=!1,j=null,ue=null,ge=null,le=!1}}}function s(){let N=!1,le=null,j=null,ue=null,ge=null,Q=null,be=null,Me=null,Mt=null;return{setTest:function(ft){N||(ft?te(i.STENCIL_TEST):Ee(i.STENCIL_TEST))},setMask:function(ft){le!==ft&&!N&&(i.stencilMask(ft),le=ft)},setFunc:function(ft,Nn,Un){(j!==ft||ue!==Nn||ge!==Un)&&(i.stencilFunc(ft,Nn,Un),j=ft,ue=Nn,ge=Un)},setOp:function(ft,Nn,Un){(Q!==ft||be!==Nn||Me!==Un)&&(i.stencilOp(ft,Nn,Un),Q=ft,be=Nn,Me=Un)},setLocked:function(ft){N=ft},setClear:function(ft){Mt!==ft&&(i.clearStencil(ft),Mt=ft)},reset:function(){N=!1,le=null,j=null,ue=null,ge=null,Q=null,be=null,Me=null,Mt=null}}}const a=new t,r=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},d={},u={},m=new WeakMap,g=[],x=null,p=!1,f=null,S=null,T=null,y=null,R=null,b=null,C=null,v=new ze(0,0,0),w=0,D=!1,P=null,U=null,X=null,q=null,B=null;const W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,Z=0;const J=i.getParameter(i.VERSION);J.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(J)[1]),H=Z>=1):J.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),H=Z>=2);let oe=null,ne={};const fe=i.getParameter(i.SCISSOR_BOX),Ne=i.getParameter(i.VIEWPORT),Ze=new _t().fromArray(fe),Ve=new _t().fromArray(Ne);function K(N,le,j,ue){const ge=new Uint8Array(4),Q=i.createTexture();i.bindTexture(N,Q),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let be=0;be<j;be++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(le,0,i.RGBA,1,1,ue,0,i.RGBA,i.UNSIGNED_BYTE,ge):i.texImage2D(le+be,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ge);return Q}const re={};re[i.TEXTURE_2D]=K(i.TEXTURE_2D,i.TEXTURE_2D,1),re[i.TEXTURE_CUBE_MAP]=K(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),re[i.TEXTURE_2D_ARRAY]=K(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),re[i.TEXTURE_3D]=K(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),te(i.DEPTH_TEST),r.setFunc(qi),nt(!1),ot(Cc),te(i.CULL_FACE),Oe(Vn);function te(N){h[N]!==!0&&(i.enable(N),h[N]=!0)}function Ee(N){h[N]!==!1&&(i.disable(N),h[N]=!1)}function Re(N,le){return u[N]!==le?(i.bindFramebuffer(N,le),u[N]=le,N===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=le),N===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=le),!0):!1}function xe(N,le){let j=g,ue=!1;if(N){j=m.get(le),j===void 0&&(j=[],m.set(le,j));const ge=N.textures;if(j.length!==ge.length||j[0]!==i.COLOR_ATTACHMENT0){for(let Q=0,be=ge.length;Q<be;Q++)j[Q]=i.COLOR_ATTACHMENT0+Q;j.length=ge.length,ue=!0}}else j[0]!==i.BACK&&(j[0]=i.BACK,ue=!0);ue&&i.drawBuffers(j)}function Ye(N){return x!==N?(i.useProgram(N),x=N,!0):!1}const ae={[Ei]:i.FUNC_ADD,[Qd]:i.FUNC_SUBTRACT,[ef]:i.FUNC_REVERSE_SUBTRACT};ae[tf]=i.MIN,ae[nf]=i.MAX;const Le={[sf]:i.ZERO,[af]:i.ONE,[rf]:i.SRC_COLOR,[Or]:i.SRC_ALPHA,[df]:i.SRC_ALPHA_SATURATE,[hf]:i.DST_COLOR,[lf]:i.DST_ALPHA,[of]:i.ONE_MINUS_SRC_COLOR,[Br]:i.ONE_MINUS_SRC_ALPHA,[uf]:i.ONE_MINUS_DST_COLOR,[cf]:i.ONE_MINUS_DST_ALPHA,[ff]:i.CONSTANT_COLOR,[pf]:i.ONE_MINUS_CONSTANT_COLOR,[mf]:i.CONSTANT_ALPHA,[gf]:i.ONE_MINUS_CONSTANT_ALPHA};function Oe(N,le,j,ue,ge,Q,be,Me,Mt,ft){if(N===Vn){p===!0&&(Ee(i.BLEND),p=!1);return}if(p===!1&&(te(i.BLEND),p=!0),N!==Jd){if(N!==f||ft!==D){if((S!==Ei||R!==Ei)&&(i.blendEquation(i.FUNC_ADD),S=Ei,R=Ei),ft)switch(N){case Xi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ga:i.blendFunc(i.ONE,i.ONE);break;case Pc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Dc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:qe("WebGLState: Invalid blending: ",N);break}else switch(N){case Xi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ga:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Pc:qe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Dc:qe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:qe("WebGLState: Invalid blending: ",N);break}T=null,y=null,b=null,C=null,v.set(0,0,0),w=0,f=N,D=ft}return}ge=ge||le,Q=Q||j,be=be||ue,(le!==S||ge!==R)&&(i.blendEquationSeparate(ae[le],ae[ge]),S=le,R=ge),(j!==T||ue!==y||Q!==b||be!==C)&&(i.blendFuncSeparate(Le[j],Le[ue],Le[Q],Le[be]),T=j,y=ue,b=Q,C=be),(Me.equals(v)===!1||Mt!==w)&&(i.blendColor(Me.r,Me.g,Me.b,Mt),v.copy(Me),w=Mt),f=N,D=!1}function Be(N,le){N.side===on?Ee(i.CULL_FACE):te(i.CULL_FACE);let j=N.side===Xt;le&&(j=!j),nt(j),N.blending===Xi&&N.transparent===!1?Oe(Vn):Oe(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),r.setFunc(N.depthFunc),r.setTest(N.depthTest),r.setMask(N.depthWrite),a.setMask(N.colorWrite);const ue=N.stencilWrite;o.setTest(ue),ue&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),gt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?te(i.SAMPLE_ALPHA_TO_COVERAGE):Ee(i.SAMPLE_ALPHA_TO_COVERAGE)}function nt(N){P!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),P=N)}function ot(N){N!==Kd?(te(i.CULL_FACE),N!==U&&(N===Cc?i.cullFace(i.BACK):N===Zd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ee(i.CULL_FACE),U=N}function dt(N){N!==X&&(H&&i.lineWidth(N),X=N)}function gt(N,le,j){N?(te(i.POLYGON_OFFSET_FILL),(q!==le||B!==j)&&(q=le,B=j,r.getReversed()&&(le=-le),i.polygonOffset(le,j))):Ee(i.POLYGON_OFFSET_FILL)}function it(N){N?te(i.SCISSOR_TEST):Ee(i.SCISSOR_TEST)}function lt(N){N===void 0&&(N=i.TEXTURE0+W-1),oe!==N&&(i.activeTexture(N),oe=N)}function I(N,le,j){j===void 0&&(oe===null?j=i.TEXTURE0+W-1:j=oe);let ue=ne[j];ue===void 0&&(ue={type:void 0,texture:void 0},ne[j]=ue),(ue.type!==N||ue.texture!==le)&&(oe!==j&&(i.activeTexture(j),oe=j),i.bindTexture(N,le||re[N]),ue.type=N,ue.texture=le)}function xt(){const N=ne[oe];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function Xe(){try{i.compressedTexImage2D(...arguments)}catch(N){qe("WebGLState:",N)}}function A(){try{i.compressedTexImage3D(...arguments)}catch(N){qe("WebGLState:",N)}}function _(){try{i.texSubImage2D(...arguments)}catch(N){qe("WebGLState:",N)}}function E(){try{i.texSubImage3D(...arguments)}catch(N){qe("WebGLState:",N)}}function O(){try{i.compressedTexSubImage2D(...arguments)}catch(N){qe("WebGLState:",N)}}function V(){try{i.compressedTexSubImage3D(...arguments)}catch(N){qe("WebGLState:",N)}}function ee(){try{i.texStorage2D(...arguments)}catch(N){qe("WebGLState:",N)}}function ie(){try{i.texStorage3D(...arguments)}catch(N){qe("WebGLState:",N)}}function $(){try{i.texImage2D(...arguments)}catch(N){qe("WebGLState:",N)}}function Y(){try{i.texImage3D(...arguments)}catch(N){qe("WebGLState:",N)}}function se(N){return d[N]!==void 0?d[N]:i.getParameter(N)}function ye(N,le){d[N]!==le&&(i.pixelStorei(N,le),d[N]=le)}function ce(N){Ze.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),Ze.copy(N))}function he(N){Ve.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),Ve.copy(N))}function Ce(N,le){let j=c.get(le);j===void 0&&(j=new WeakMap,c.set(le,j));let ue=j.get(N);ue===void 0&&(ue=i.getUniformBlockIndex(le,N.name),j.set(N,ue))}function De(N,le){const ue=c.get(le).get(N);l.get(le)!==ue&&(i.uniformBlockBinding(le,ue,N.__bindingPointIndex),l.set(le,ue))}function Ue(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},oe=null,ne={},u={},m=new WeakMap,g=[],x=null,p=!1,f=null,S=null,T=null,y=null,R=null,b=null,C=null,v=new ze(0,0,0),w=0,D=!1,P=null,U=null,X=null,q=null,B=null,Ze.set(0,0,i.canvas.width,i.canvas.height),Ve.set(0,0,i.canvas.width,i.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:te,disable:Ee,bindFramebuffer:Re,drawBuffers:xe,useProgram:Ye,setBlending:Oe,setMaterial:Be,setFlipSided:nt,setCullFace:ot,setLineWidth:dt,setPolygonOffset:gt,setScissorTest:it,activeTexture:lt,bindTexture:I,unbindTexture:xt,compressedTexImage2D:Xe,compressedTexImage3D:A,texImage2D:$,texImage3D:Y,pixelStorei:ye,getParameter:se,updateUBOMapping:Ce,uniformBlockBinding:De,texStorage2D:ee,texStorage3D:ie,texSubImage2D:_,texSubImage3D:E,compressedTexSubImage2D:O,compressedTexSubImage3D:V,scissor:ce,viewport:he,reset:Ue}}function G_(i,e,t,n,s,a,r){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Te,h=new WeakMap,d=new Set;let u;const m=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(A,_){return g?new OffscreenCanvas(A,_):Ns("canvas")}function p(A,_,E){let O=1;const V=Xe(A);if((V.width>E||V.height>E)&&(O=E/Math.max(V.width,V.height)),O<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const ee=Math.floor(O*V.width),ie=Math.floor(O*V.height);u===void 0&&(u=x(ee,ie));const $=_?x(ee,ie):u;return $.width=ee,$.height=ie,$.getContext("2d").drawImage(A,0,0,ee,ie),Pe("WebGLRenderer: Texture has been resized from ("+V.width+"x"+V.height+") to ("+ee+"x"+ie+")."),$}else return"data"in A&&Pe("WebGLRenderer: Image in DataTexture is too big ("+V.width+"x"+V.height+")."),A;return A}function f(A){return A.generateMipmaps}function S(A){i.generateMipmap(A)}function T(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(A,_,E,O,V,ee=!1){if(A!==null){if(i[A]!==void 0)return i[A];Pe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let ie;O&&(ie=e.get("EXT_texture_norm16"),ie||Pe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=_;if(_===i.RED&&(E===i.FLOAT&&($=i.R32F),E===i.HALF_FLOAT&&($=i.R16F),E===i.UNSIGNED_BYTE&&($=i.R8),E===i.UNSIGNED_SHORT&&ie&&($=ie.R16_EXT),E===i.SHORT&&ie&&($=ie.R16_SNORM_EXT)),_===i.RED_INTEGER&&(E===i.UNSIGNED_BYTE&&($=i.R8UI),E===i.UNSIGNED_SHORT&&($=i.R16UI),E===i.UNSIGNED_INT&&($=i.R32UI),E===i.BYTE&&($=i.R8I),E===i.SHORT&&($=i.R16I),E===i.INT&&($=i.R32I)),_===i.RG&&(E===i.FLOAT&&($=i.RG32F),E===i.HALF_FLOAT&&($=i.RG16F),E===i.UNSIGNED_BYTE&&($=i.RG8),E===i.UNSIGNED_SHORT&&ie&&($=ie.RG16_EXT),E===i.SHORT&&ie&&($=ie.RG16_SNORM_EXT)),_===i.RG_INTEGER&&(E===i.UNSIGNED_BYTE&&($=i.RG8UI),E===i.UNSIGNED_SHORT&&($=i.RG16UI),E===i.UNSIGNED_INT&&($=i.RG32UI),E===i.BYTE&&($=i.RG8I),E===i.SHORT&&($=i.RG16I),E===i.INT&&($=i.RG32I)),_===i.RGB_INTEGER&&(E===i.UNSIGNED_BYTE&&($=i.RGB8UI),E===i.UNSIGNED_SHORT&&($=i.RGB16UI),E===i.UNSIGNED_INT&&($=i.RGB32UI),E===i.BYTE&&($=i.RGB8I),E===i.SHORT&&($=i.RGB16I),E===i.INT&&($=i.RGB32I)),_===i.RGBA_INTEGER&&(E===i.UNSIGNED_BYTE&&($=i.RGBA8UI),E===i.UNSIGNED_SHORT&&($=i.RGBA16UI),E===i.UNSIGNED_INT&&($=i.RGBA32UI),E===i.BYTE&&($=i.RGBA8I),E===i.SHORT&&($=i.RGBA16I),E===i.INT&&($=i.RGBA32I)),_===i.RGB&&(E===i.UNSIGNED_SHORT&&ie&&($=ie.RGB16_EXT),E===i.SHORT&&ie&&($=ie.RGB16_SNORM_EXT),E===i.UNSIGNED_INT_5_9_9_9_REV&&($=i.RGB9_E5),E===i.UNSIGNED_INT_10F_11F_11F_REV&&($=i.R11F_G11F_B10F)),_===i.RGBA){const Y=ee?Ta:$e.getTransfer(V);E===i.FLOAT&&($=i.RGBA32F),E===i.HALF_FLOAT&&($=i.RGBA16F),E===i.UNSIGNED_BYTE&&($=Y===Qe?i.SRGB8_ALPHA8:i.RGBA8),E===i.UNSIGNED_SHORT&&ie&&($=ie.RGBA16_EXT),E===i.SHORT&&ie&&($=ie.RGBA16_SNORM_EXT),E===i.UNSIGNED_SHORT_4_4_4_4&&($=i.RGBA4),E===i.UNSIGNED_SHORT_5_5_5_1&&($=i.RGB5_A1)}return($===i.R16F||$===i.R32F||$===i.RG16F||$===i.RG32F||$===i.RGBA16F||$===i.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function R(A,_){let E;return A?_===null||_===En||_===Ls?E=i.DEPTH24_STENCIL8:_===wn?E=i.DEPTH32F_STENCIL8:_===Ds&&(E=i.DEPTH24_STENCIL8,Pe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===En||_===Ls?E=i.DEPTH_COMPONENT24:_===wn?E=i.DEPTH_COMPONENT32F:_===Ds&&(E=i.DEPTH_COMPONENT16),E}function b(A,_){return f(A)===!0||A.isFramebufferTexture&&A.minFilter!==Ft&&A.minFilter!==wt?Math.log2(Math.max(_.width,_.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?_.mipmaps.length:1}function C(A){const _=A.target;_.removeEventListener("dispose",C),w(_),_.isVideoTexture&&h.delete(_),_.isHTMLTexture&&d.delete(_)}function v(A){const _=A.target;_.removeEventListener("dispose",v),P(_)}function w(A){const _=n.get(A);if(_.__webglInit===void 0)return;const E=A.source,O=m.get(E);if(O){const V=O[_.__cacheKey];V.usedTimes--,V.usedTimes===0&&D(A),Object.keys(O).length===0&&m.delete(E)}n.remove(A)}function D(A){const _=n.get(A);i.deleteTexture(_.__webglTexture);const E=A.source,O=m.get(E);delete O[_.__cacheKey],r.memory.textures--}function P(A){const _=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let O=0;O<6;O++){if(Array.isArray(_.__webglFramebuffer[O]))for(let V=0;V<_.__webglFramebuffer[O].length;V++)i.deleteFramebuffer(_.__webglFramebuffer[O][V]);else i.deleteFramebuffer(_.__webglFramebuffer[O]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[O])}else{if(Array.isArray(_.__webglFramebuffer))for(let O=0;O<_.__webglFramebuffer.length;O++)i.deleteFramebuffer(_.__webglFramebuffer[O]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let O=0;O<_.__webglColorRenderbuffer.length;O++)_.__webglColorRenderbuffer[O]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[O]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const E=A.textures;for(let O=0,V=E.length;O<V;O++){const ee=n.get(E[O]);ee.__webglTexture&&(i.deleteTexture(ee.__webglTexture),r.memory.textures--),n.remove(E[O])}n.remove(A)}let U=0;function X(){U=0}function q(){return U}function B(A){U=A}function W(){const A=U;return A>=s.maxTextures&&Pe("WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),U+=1,A}function H(A){const _=[];return _.push(A.wrapS),_.push(A.wrapT),_.push(A.wrapR||0),_.push(A.magFilter),_.push(A.minFilter),_.push(A.anisotropy),_.push(A.internalFormat),_.push(A.format),_.push(A.type),_.push(A.generateMipmaps),_.push(A.premultiplyAlpha),_.push(A.flipY),_.push(A.unpackAlignment),_.push(A.colorSpace),_.join()}function Z(A,_){const E=n.get(A);if(A.isVideoTexture&&I(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&E.__version!==A.version){const O=A.image;if(O===null)Pe("WebGLRenderer: Texture marked for update but no image data found.");else if(O.complete===!1)Pe("WebGLRenderer: Texture marked for update but image is incomplete");else{Ee(E,A,_);return}}else A.isExternalTexture&&(E.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,E.__webglTexture,i.TEXTURE0+_)}function J(A,_){const E=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&E.__version!==A.version){Ee(E,A,_);return}else A.isExternalTexture&&(E.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,E.__webglTexture,i.TEXTURE0+_)}function oe(A,_){const E=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&E.__version!==A.version){Ee(E,A,_);return}t.bindTexture(i.TEXTURE_3D,E.__webglTexture,i.TEXTURE0+_)}function ne(A,_){const E=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&E.__version!==A.version){Re(E,A,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+_)}const fe={[Ti]:i.REPEAT,[en]:i.CLAMP_TO_EDGE,[Kr]:i.MIRRORED_REPEAT},Ne={[Ft]:i.NEAREST,[xf]:i.NEAREST_MIPMAP_NEAREST,[va]:i.NEAREST_MIPMAP_LINEAR,[wt]:i.LINEAR,[Zr]:i.LINEAR_MIPMAP_NEAREST,[un]:i.LINEAR_MIPMAP_LINEAR},Ze={[Sf]:i.NEVER,[Af]:i.ALWAYS,[bf]:i.LESS,[Uo]:i.LEQUAL,[Ef]:i.EQUAL,[Fo]:i.GEQUAL,[wf]:i.GREATER,[Tf]:i.NOTEQUAL};function Ve(A,_){if(_.type===wn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===wt||_.magFilter===Zr||_.magFilter===va||_.magFilter===un||_.minFilter===wt||_.minFilter===Zr||_.minFilter===va||_.minFilter===un)&&Pe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,fe[_.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,fe[_.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,fe[_.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,Ne[_.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,Ne[_.minFilter]),_.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,Ze[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Ft||_.minFilter!==va&&_.minFilter!==un||_.type===wn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const E=e.get("EXT_texture_filter_anisotropic");i.texParameterf(A,E.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function K(A,_){let E=!1;A.__webglInit===void 0&&(A.__webglInit=!0,_.addEventListener("dispose",C));const O=_.source;let V=m.get(O);V===void 0&&(V={},m.set(O,V));const ee=H(_);if(ee!==A.__cacheKey){V[ee]===void 0&&(V[ee]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,E=!0),V[ee].usedTimes++;const ie=V[A.__cacheKey];ie!==void 0&&(V[A.__cacheKey].usedTimes--,ie.usedTimes===0&&D(_)),A.__cacheKey=ee,A.__webglTexture=V[ee].texture}return E}function re(A,_,E){return Math.floor(Math.floor(A/E)/_)}function te(A,_,E,O){const ee=A.updateRanges;if(ee.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,E,O,_.data);else{ee.sort((ye,ce)=>ye.start-ce.start);let ie=0;for(let ye=1;ye<ee.length;ye++){const ce=ee[ie],he=ee[ye],Ce=ce.start+ce.count,De=re(he.start,_.width,4),Ue=re(ce.start,_.width,4);he.start<=Ce+1&&De===Ue&&re(he.start+he.count-1,_.width,4)===De?ce.count=Math.max(ce.count,he.start+he.count-ce.start):(++ie,ee[ie]=he)}ee.length=ie+1;const $=t.getParameter(i.UNPACK_ROW_LENGTH),Y=t.getParameter(i.UNPACK_SKIP_PIXELS),se=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let ye=0,ce=ee.length;ye<ce;ye++){const he=ee[ye],Ce=Math.floor(he.start/4),De=Math.ceil(he.count/4),Ue=Ce%_.width,N=Math.floor(Ce/_.width),le=De,j=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Ue),t.pixelStorei(i.UNPACK_SKIP_ROWS,N),t.texSubImage2D(i.TEXTURE_2D,0,Ue,N,le,j,E,O,_.data)}A.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,$),t.pixelStorei(i.UNPACK_SKIP_PIXELS,Y),t.pixelStorei(i.UNPACK_SKIP_ROWS,se)}}function Ee(A,_,E){let O=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(O=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(O=i.TEXTURE_3D);const V=K(A,_),ee=_.source;t.bindTexture(O,A.__webglTexture,i.TEXTURE0+E);const ie=n.get(ee);if(ee.version!==ie.__version||V===!0){if(t.activeTexture(i.TEXTURE0+E),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){const j=$e.getPrimaries($e.workingColorSpace),ue=_.colorSpace===fn?null:$e.getPrimaries(_.colorSpace),ge=_.colorSpace===fn||j===ue?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ge)}t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment);let Y=p(_.image,!1,s.maxTextureSize);Y=xt(_,Y);const se=a.convert(_.format,_.colorSpace),ye=a.convert(_.type);let ce=y(_.internalFormat,se,ye,_.normalized,_.colorSpace,_.isVideoTexture);Ve(O,_);let he;const Ce=_.mipmaps,De=_.isVideoTexture!==!0,Ue=ie.__version===void 0||V===!0,N=ee.dataReady,le=b(_,Y);if(_.isDepthTexture)ce=R(_.format===Ai,_.type),Ue&&(De?t.texStorage2D(i.TEXTURE_2D,1,ce,Y.width,Y.height):t.texImage2D(i.TEXTURE_2D,0,ce,Y.width,Y.height,0,se,ye,null));else if(_.isDataTexture)if(Ce.length>0){De&&Ue&&t.texStorage2D(i.TEXTURE_2D,le,ce,Ce[0].width,Ce[0].height);for(let j=0,ue=Ce.length;j<ue;j++)he=Ce[j],De?N&&t.texSubImage2D(i.TEXTURE_2D,j,0,0,he.width,he.height,se,ye,he.data):t.texImage2D(i.TEXTURE_2D,j,ce,he.width,he.height,0,se,ye,he.data);_.generateMipmaps=!1}else De?(Ue&&t.texStorage2D(i.TEXTURE_2D,le,ce,Y.width,Y.height),N&&te(_,Y,se,ye)):t.texImage2D(i.TEXTURE_2D,0,ce,Y.width,Y.height,0,se,ye,Y.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){De&&Ue&&t.texStorage3D(i.TEXTURE_2D_ARRAY,le,ce,Ce[0].width,Ce[0].height,Y.depth);for(let j=0,ue=Ce.length;j<ue;j++)if(he=Ce[j],_.format!==dn)if(se!==null)if(De){if(N)if(_.layerUpdates.size>0){const ge=Vh(he.width,he.height,_.format,_.type);for(const Q of _.layerUpdates){const be=he.data.subarray(Q*ge/he.data.BYTES_PER_ELEMENT,(Q+1)*ge/he.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,Q,he.width,he.height,1,se,be)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,he.width,he.height,Y.depth,se,he.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,j,ce,he.width,he.height,Y.depth,0,he.data,0,0);else Pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else De?N&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,he.width,he.height,Y.depth,se,ye,he.data):t.texImage3D(i.TEXTURE_2D_ARRAY,j,ce,he.width,he.height,Y.depth,0,se,ye,he.data)}else{De&&Ue&&t.texStorage2D(i.TEXTURE_2D,le,ce,Ce[0].width,Ce[0].height);for(let j=0,ue=Ce.length;j<ue;j++)he=Ce[j],_.format!==dn?se!==null?De?N&&t.compressedTexSubImage2D(i.TEXTURE_2D,j,0,0,he.width,he.height,se,he.data):t.compressedTexImage2D(i.TEXTURE_2D,j,ce,he.width,he.height,0,he.data):Pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):De?N&&t.texSubImage2D(i.TEXTURE_2D,j,0,0,he.width,he.height,se,ye,he.data):t.texImage2D(i.TEXTURE_2D,j,ce,he.width,he.height,0,se,ye,he.data)}else if(_.isDataArrayTexture)if(De){if(Ue&&t.texStorage3D(i.TEXTURE_2D_ARRAY,le,ce,Y.width,Y.height,Y.depth),N)if(_.layerUpdates.size>0){const j=Vh(Y.width,Y.height,_.format,_.type);for(const ue of _.layerUpdates){const ge=Y.data.subarray(ue*j/Y.data.BYTES_PER_ELEMENT,(ue+1)*j/Y.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ue,Y.width,Y.height,1,se,ye,ge)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Y.width,Y.height,Y.depth,se,ye,Y.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ce,Y.width,Y.height,Y.depth,0,se,ye,Y.data);else if(_.isData3DTexture)De?(Ue&&t.texStorage3D(i.TEXTURE_3D,le,ce,Y.width,Y.height,Y.depth),N&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Y.width,Y.height,Y.depth,se,ye,Y.data)):t.texImage3D(i.TEXTURE_3D,0,ce,Y.width,Y.height,Y.depth,0,se,ye,Y.data);else if(_.isFramebufferTexture){if(Ue)if(De)t.texStorage2D(i.TEXTURE_2D,le,ce,Y.width,Y.height);else{let j=Y.width,ue=Y.height;for(let ge=0;ge<le;ge++)t.texImage2D(i.TEXTURE_2D,ge,ce,j,ue,0,se,ye,null),j>>=1,ue>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in i){const j=i.canvas;if(j.hasAttribute("layoutsubtree")||j.setAttribute("layoutsubtree","true"),Y.parentNode!==j){j.appendChild(Y),d.add(_),j.onpaint=ue=>{const ge=ue.changedElements;for(const Q of d)ge.includes(Q.image)&&(Q.needsUpdate=!0)},j.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,Y);else{const ge=i.RGBA,Q=i.RGBA,be=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,ge,Q,be,Y)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Ce.length>0){if(De&&Ue){const j=Xe(Ce[0]);t.texStorage2D(i.TEXTURE_2D,le,ce,j.width,j.height)}for(let j=0,ue=Ce.length;j<ue;j++)he=Ce[j],De?N&&t.texSubImage2D(i.TEXTURE_2D,j,0,0,se,ye,he):t.texImage2D(i.TEXTURE_2D,j,ce,se,ye,he);_.generateMipmaps=!1}else if(De){if(Ue){const j=Xe(Y);t.texStorage2D(i.TEXTURE_2D,le,ce,j.width,j.height)}N&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,se,ye,Y)}else t.texImage2D(i.TEXTURE_2D,0,ce,se,ye,Y);f(_)&&S(O),ie.__version=ee.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function Re(A,_,E){if(_.image.length!==6)return;const O=K(A,_),V=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+E);const ee=n.get(V);if(V.version!==ee.__version||O===!0){t.activeTexture(i.TEXTURE0+E);const ie=$e.getPrimaries($e.workingColorSpace),$=_.colorSpace===fn?null:$e.getPrimaries(_.colorSpace),Y=_.colorSpace===fn||ie===$?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Y);const se=_.isCompressedTexture||_.image[0].isCompressedTexture,ye=_.image[0]&&_.image[0].isDataTexture,ce=[];for(let Q=0;Q<6;Q++)!se&&!ye?ce[Q]=p(_.image[Q],!0,s.maxCubemapSize):ce[Q]=ye?_.image[Q].image:_.image[Q],ce[Q]=xt(_,ce[Q]);const he=ce[0],Ce=a.convert(_.format,_.colorSpace),De=a.convert(_.type),Ue=y(_.internalFormat,Ce,De,_.normalized,_.colorSpace),N=_.isVideoTexture!==!0,le=ee.__version===void 0||O===!0,j=V.dataReady;let ue=b(_,he);Ve(i.TEXTURE_CUBE_MAP,_);let ge;if(se){N&&le&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ue,Ue,he.width,he.height);for(let Q=0;Q<6;Q++){ge=ce[Q].mipmaps;for(let be=0;be<ge.length;be++){const Me=ge[be];_.format!==dn?Ce!==null?N?j&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,be,0,0,Me.width,Me.height,Ce,Me.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,be,Ue,Me.width,Me.height,0,Me.data):Pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?j&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,be,0,0,Me.width,Me.height,Ce,De,Me.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,be,Ue,Me.width,Me.height,0,Ce,De,Me.data)}}}else{if(ge=_.mipmaps,N&&le){ge.length>0&&ue++;const Q=Xe(ce[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ue,Ue,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(ye){N?j&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,ce[Q].width,ce[Q].height,Ce,De,ce[Q].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ue,ce[Q].width,ce[Q].height,0,Ce,De,ce[Q].data);for(let be=0;be<ge.length;be++){const Mt=ge[be].image[Q].image;N?j&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,be+1,0,0,Mt.width,Mt.height,Ce,De,Mt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,be+1,Ue,Mt.width,Mt.height,0,Ce,De,Mt.data)}}else{N?j&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Ce,De,ce[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ue,Ce,De,ce[Q]);for(let be=0;be<ge.length;be++){const Me=ge[be];N?j&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,be+1,0,0,Ce,De,Me.image[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,be+1,Ue,Ce,De,Me.image[Q])}}}f(_)&&S(i.TEXTURE_CUBE_MAP),ee.__version=V.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function xe(A,_,E,O,V,ee){const ie=a.convert(E.format,E.colorSpace),$=a.convert(E.type),Y=y(E.internalFormat,ie,$,E.normalized,E.colorSpace),se=n.get(_),ye=n.get(E);if(ye.__renderTarget=_,!se.__hasExternalTextures){const ce=Math.max(1,_.width>>ee),he=Math.max(1,_.height>>ee);V===i.TEXTURE_3D||V===i.TEXTURE_2D_ARRAY?t.texImage3D(V,ee,Y,ce,he,_.depth,0,ie,$,null):t.texImage2D(V,ee,Y,ce,he,0,ie,$,null)}t.bindFramebuffer(i.FRAMEBUFFER,A),lt(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,O,V,ye.__webglTexture,0,it(_)):(V===i.TEXTURE_2D||V>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&V<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,O,V,ye.__webglTexture,ee),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ye(A,_,E){if(i.bindRenderbuffer(i.RENDERBUFFER,A),_.depthBuffer){const O=_.depthTexture,V=O&&O.isDepthTexture?O.type:null,ee=R(_.stencilBuffer,V),ie=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;lt(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,it(_),ee,_.width,_.height):E?i.renderbufferStorageMultisample(i.RENDERBUFFER,it(_),ee,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ee,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ie,i.RENDERBUFFER,A)}else{const O=_.textures;for(let V=0;V<O.length;V++){const ee=O[V],ie=a.convert(ee.format,ee.colorSpace),$=a.convert(ee.type),Y=y(ee.internalFormat,ie,$,ee.normalized,ee.colorSpace);lt(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,it(_),Y,_.width,_.height):E?i.renderbufferStorageMultisample(i.RENDERBUFFER,it(_),Y,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,Y,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ae(A,_,E){const O=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,A),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const V=n.get(_.depthTexture);if(V.__renderTarget=_,(!V.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),O){if(V.__webglInit===void 0&&(V.__webglInit=!0,_.depthTexture.addEventListener("dispose",C)),V.__webglTexture===void 0){V.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture),Ve(i.TEXTURE_CUBE_MAP,_.depthTexture);const se=a.convert(_.depthTexture.format),ye=a.convert(_.depthTexture.type);let ce;_.depthTexture.format===Gn?ce=i.DEPTH_COMPONENT24:_.depthTexture.format===Ai&&(ce=i.DEPTH24_STENCIL8);for(let he=0;he<6;he++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,ce,_.width,_.height,0,se,ye,null)}}else Z(_.depthTexture,0);const ee=V.__webglTexture,ie=it(_),$=O?i.TEXTURE_CUBE_MAP_POSITIVE_X+E:i.TEXTURE_2D,Y=_.depthTexture.format===Ai?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(_.depthTexture.format===Gn)lt(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,$,ee,0,ie):i.framebufferTexture2D(i.FRAMEBUFFER,Y,$,ee,0);else if(_.depthTexture.format===Ai)lt(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,$,ee,0,ie):i.framebufferTexture2D(i.FRAMEBUFFER,Y,$,ee,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Le(A){const _=n.get(A),E=A.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==A.depthTexture){const O=A.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),O){const V=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,O.removeEventListener("dispose",V)};O.addEventListener("dispose",V),_.__depthDisposeCallback=V}_.__boundDepthTexture=O}if(A.depthTexture&&!_.__autoAllocateDepthBuffer)if(E)for(let O=0;O<6;O++)ae(_.__webglFramebuffer[O],A,O);else{const O=A.texture.mipmaps;O&&O.length>0?ae(_.__webglFramebuffer[0],A,0):ae(_.__webglFramebuffer,A,0)}else if(E){_.__webglDepthbuffer=[];for(let O=0;O<6;O++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[O]),_.__webglDepthbuffer[O]===void 0)_.__webglDepthbuffer[O]=i.createRenderbuffer(),Ye(_.__webglDepthbuffer[O],A,!1);else{const V=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ee=_.__webglDepthbuffer[O];i.bindRenderbuffer(i.RENDERBUFFER,ee),i.framebufferRenderbuffer(i.FRAMEBUFFER,V,i.RENDERBUFFER,ee)}}else{const O=A.texture.mipmaps;if(O&&O.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),Ye(_.__webglDepthbuffer,A,!1);else{const V=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ee=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ee),i.framebufferRenderbuffer(i.FRAMEBUFFER,V,i.RENDERBUFFER,ee)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Oe(A,_,E){const O=n.get(A);_!==void 0&&xe(O.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),E!==void 0&&Le(A)}function Be(A){const _=A.texture,E=n.get(A),O=n.get(_);A.addEventListener("dispose",v);const V=A.textures,ee=A.isWebGLCubeRenderTarget===!0,ie=V.length>1;if(ie||(O.__webglTexture===void 0&&(O.__webglTexture=i.createTexture()),O.__version=_.version,r.memory.textures++),ee){E.__webglFramebuffer=[];for(let $=0;$<6;$++)if(_.mipmaps&&_.mipmaps.length>0){E.__webglFramebuffer[$]=[];for(let Y=0;Y<_.mipmaps.length;Y++)E.__webglFramebuffer[$][Y]=i.createFramebuffer()}else E.__webglFramebuffer[$]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){E.__webglFramebuffer=[];for(let $=0;$<_.mipmaps.length;$++)E.__webglFramebuffer[$]=i.createFramebuffer()}else E.__webglFramebuffer=i.createFramebuffer();if(ie)for(let $=0,Y=V.length;$<Y;$++){const se=n.get(V[$]);se.__webglTexture===void 0&&(se.__webglTexture=i.createTexture(),r.memory.textures++)}if(A.samples>0&&lt(A)===!1){E.__webglMultisampledFramebuffer=i.createFramebuffer(),E.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,E.__webglMultisampledFramebuffer);for(let $=0;$<V.length;$++){const Y=V[$];E.__webglColorRenderbuffer[$]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,E.__webglColorRenderbuffer[$]);const se=a.convert(Y.format,Y.colorSpace),ye=a.convert(Y.type),ce=y(Y.internalFormat,se,ye,Y.normalized,Y.colorSpace,A.isXRRenderTarget===!0),he=it(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,he,ce,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+$,i.RENDERBUFFER,E.__webglColorRenderbuffer[$])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(E.__webglDepthRenderbuffer=i.createRenderbuffer(),Ye(E.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ee){t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture),Ve(i.TEXTURE_CUBE_MAP,_);for(let $=0;$<6;$++)if(_.mipmaps&&_.mipmaps.length>0)for(let Y=0;Y<_.mipmaps.length;Y++)xe(E.__webglFramebuffer[$][Y],A,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+$,Y);else xe(E.__webglFramebuffer[$],A,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);f(_)&&S(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ie){for(let $=0,Y=V.length;$<Y;$++){const se=V[$],ye=n.get(se);let ce=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ce=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ce,ye.__webglTexture),Ve(ce,se),xe(E.__webglFramebuffer,A,se,i.COLOR_ATTACHMENT0+$,ce,0),f(se)&&S(ce)}t.unbindTexture()}else{let $=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&($=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture($,O.__webglTexture),Ve($,_),_.mipmaps&&_.mipmaps.length>0)for(let Y=0;Y<_.mipmaps.length;Y++)xe(E.__webglFramebuffer[Y],A,_,i.COLOR_ATTACHMENT0,$,Y);else xe(E.__webglFramebuffer,A,_,i.COLOR_ATTACHMENT0,$,0);f(_)&&S($),t.unbindTexture()}A.depthBuffer&&Le(A)}function nt(A){const _=A.textures;for(let E=0,O=_.length;E<O;E++){const V=_[E];if(f(V)){const ee=T(A),ie=n.get(V).__webglTexture;t.bindTexture(ee,ie),S(ee),t.unbindTexture()}}}const ot=[],dt=[];function gt(A){if(A.samples>0){if(lt(A)===!1){const _=A.textures,E=A.width,O=A.height;let V=i.COLOR_BUFFER_BIT;const ee=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ie=n.get(A),$=_.length>1;if($)for(let se=0;se<_.length;se++)t.bindFramebuffer(i.FRAMEBUFFER,ie.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+se,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ie.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+se,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ie.__webglMultisampledFramebuffer);const Y=A.texture.mipmaps;Y&&Y.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ie.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ie.__webglFramebuffer);for(let se=0;se<_.length;se++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(V|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(V|=i.STENCIL_BUFFER_BIT)),$){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ie.__webglColorRenderbuffer[se]);const ye=n.get(_[se]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ye,0)}i.blitFramebuffer(0,0,E,O,0,0,E,O,V,i.NEAREST),l===!0&&(ot.length=0,dt.length=0,ot.push(i.COLOR_ATTACHMENT0+se),A.depthBuffer&&A.resolveDepthBuffer===!1&&(ot.push(ee),dt.push(ee),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,dt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ot))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),$)for(let se=0;se<_.length;se++){t.bindFramebuffer(i.FRAMEBUFFER,ie.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+se,i.RENDERBUFFER,ie.__webglColorRenderbuffer[se]);const ye=n.get(_[se]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ie.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+se,i.TEXTURE_2D,ye,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ie.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const _=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function it(A){return Math.min(s.maxSamples,A.samples)}function lt(A){const _=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function I(A){const _=r.render.frame;h.get(A)!==_&&(h.set(A,_),A.update())}function xt(A,_){const E=A.colorSpace,O=A.format,V=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||E!==wa&&E!==fn&&($e.getTransfer(E)===Qe?(O!==dn||V!==tn)&&Pe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):qe("WebGLTextures: Unsupported texture color space:",E)),_}function Xe(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=W,this.resetTextureUnits=X,this.getTextureUnits=q,this.setTextureUnits=B,this.setTexture2D=Z,this.setTexture2DArray=J,this.setTexture3D=oe,this.setTextureCube=ne,this.rebindTextures=Oe,this.setupRenderTarget=Be,this.updateRenderTargetMipmap=nt,this.updateMultisampleRenderTarget=gt,this.setupDepthRenderbuffer=Le,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=lt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function W_(i,e){function t(n,s=fn){let a;const r=$e.getTransfer(s);if(n===tn)return i.UNSIGNED_BYTE;if(n===Jr)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Qr)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Hc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Gc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===kc)return i.BYTE;if(n===Vc)return i.SHORT;if(n===Ds)return i.UNSIGNED_SHORT;if(n===jr)return i.INT;if(n===En)return i.UNSIGNED_INT;if(n===wn)return i.FLOAT;if(n===Hn)return i.HALF_FLOAT;if(n===Wc)return i.ALPHA;if(n===Xc)return i.RGB;if(n===dn)return i.RGBA;if(n===Gn)return i.DEPTH_COMPONENT;if(n===Ai)return i.DEPTH_STENCIL;if(n===qc)return i.RED;if(n===eo)return i.RED_INTEGER;if(n===Ri)return i.RG;if(n===to)return i.RG_INTEGER;if(n===no)return i.RGBA_INTEGER;if(n===xa||n===Ma||n===ya||n===Sa)if(r===Qe)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===xa)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ma)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ya)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Sa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===xa)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ma)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ya)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Sa)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===io||n===so||n===ao||n===ro)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===io)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===so)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ao)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ro)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===oo||n===lo||n===co||n===ho||n===uo||n===ba||n===fo)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(n===oo||n===lo)return r===Qe?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===co)return r===Qe?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(n===ho)return a.COMPRESSED_R11_EAC;if(n===uo)return a.COMPRESSED_SIGNED_R11_EAC;if(n===ba)return a.COMPRESSED_RG11_EAC;if(n===fo)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===po||n===mo||n===go||n===_o||n===vo||n===xo||n===Mo||n===yo||n===So||n===bo||n===Eo||n===wo||n===To||n===Ao)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(n===po)return r===Qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===mo)return r===Qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===go)return r===Qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===_o)return r===Qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===vo)return r===Qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===xo)return r===Qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Mo)return r===Qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===yo)return r===Qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===So)return r===Qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===bo)return r===Qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Eo)return r===Qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===wo)return r===Qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===To)return r===Qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ao)return r===Qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ro||n===Co||n===Po)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(n===Ro)return r===Qe?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Co)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Po)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Do||n===Lo||n===Ea||n===Io)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(n===Do)return a.COMPRESSED_RED_RGTC1_EXT;if(n===Lo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ea)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Io)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ls?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const X_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,q_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class $_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Ah(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new xn({vertexShader:X_,fragmentShader:q_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new rt(new sr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Y_ extends ti{constructor(e,t){super();const n=this;let s=null,a=1,r=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,m=null,g=null;const x=typeof XRWebGLBinding<"u",p=new $_,f={},S=t.getContextAttributes();let T=null,y=null;const R=[],b=[],C=new Te;let v=null;const w=new an;w.viewport=new _t;const D=new an;D.viewport=new _t;const P=[w,D],U=new Fp;let X=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let re=R[K];return re===void 0&&(re=new qo,R[K]=re),re.getTargetRaySpace()},this.getControllerGrip=function(K){let re=R[K];return re===void 0&&(re=new qo,R[K]=re),re.getGripSpace()},this.getHand=function(K){let re=R[K];return re===void 0&&(re=new qo,R[K]=re),re.getHandSpace()};function B(K){const re=b.indexOf(K.inputSource);if(re===-1)return;const te=R[re];te!==void 0&&(te.update(K.inputSource,K.frame,c||r),te.dispatchEvent({type:K.type,data:K.inputSource}))}function W(){s.removeEventListener("select",B),s.removeEventListener("selectstart",B),s.removeEventListener("selectend",B),s.removeEventListener("squeeze",B),s.removeEventListener("squeezestart",B),s.removeEventListener("squeezeend",B),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",H);for(let K=0;K<R.length;K++){const re=b[K];re!==null&&(b[K]=null,R[K].disconnect(re))}X=null,q=null,p.reset();for(const K in f)delete f[K];e.setRenderTarget(T),m=null,u=null,d=null,s=null,y=null,Ve.stop(),n.isPresenting=!1,e.setPixelRatio(v),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){a=K,n.isPresenting===!0&&Pe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,n.isPresenting===!0&&Pe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return u!==null?u:m},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(T=e.getRenderTarget(),s.addEventListener("select",B),s.addEventListener("selectstart",B),s.addEventListener("selectend",B),s.addEventListener("squeeze",B),s.addEventListener("squeezestart",B),s.addEventListener("squeezeend",B),s.addEventListener("end",W),s.addEventListener("inputsourceschange",H),S.xrCompatible!==!0&&await t.makeXRCompatible(),v=e.getPixelRatio(),e.getSize(C),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let te=null,Ee=null,Re=null;S.depth&&(Re=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,te=S.stencil?Ai:Gn,Ee=S.stencil?Ls:En);const xe={colorFormat:t.RGBA8,depthFormat:Re,scaleFactor:a};d=this.getBinding(),u=d.createProjectionLayer(xe),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),y=new An(u.textureWidth,u.textureHeight,{format:dn,type:tn,depthTexture:new us(u.textureWidth,u.textureHeight,Ee,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const te={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:a};m=new XRWebGLLayer(s,t,te),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),y=new An(m.framebufferWidth,m.framebufferHeight,{format:dn,type:tn,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await s.requestReferenceSpace(o),Ve.setContext(s),Ve.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function H(K){for(let re=0;re<K.removed.length;re++){const te=K.removed[re],Ee=b.indexOf(te);Ee>=0&&(b[Ee]=null,R[Ee].disconnect(te))}for(let re=0;re<K.added.length;re++){const te=K.added[re];let Ee=b.indexOf(te);if(Ee===-1){for(let xe=0;xe<R.length;xe++)if(xe>=b.length){b.push(te),Ee=xe;break}else if(b[xe]===null){b[xe]=te,Ee=xe;break}if(Ee===-1)break}const Re=R[Ee];Re&&Re.connect(te)}}const Z=new L,J=new L;function oe(K,re,te){Z.setFromMatrixPosition(re.matrixWorld),J.setFromMatrixPosition(te.matrixWorld);const Ee=Z.distanceTo(J),Re=re.projectionMatrix.elements,xe=te.projectionMatrix.elements,Ye=Re[14]/(Re[10]-1),ae=Re[14]/(Re[10]+1),Le=(Re[9]+1)/Re[5],Oe=(Re[9]-1)/Re[5],Be=(Re[8]-1)/Re[0],nt=(xe[8]+1)/xe[0],ot=Ye*Be,dt=Ye*nt,gt=Ee/(-Be+nt),it=gt*-Be;if(re.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(it),K.translateZ(gt),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Re[10]===-1)K.projectionMatrix.copy(re.projectionMatrix),K.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const lt=Ye+gt,I=ae+gt,xt=ot-it,Xe=dt+(Ee-it),A=Le*ae/I*lt,_=Oe*ae/I*lt;K.projectionMatrix.makePerspective(xt,Xe,A,_,lt,I),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function ne(K,re){re===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(re.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let re=K.near,te=K.far;p.texture!==null&&(p.depthNear>0&&(re=p.depthNear),p.depthFar>0&&(te=p.depthFar)),U.near=D.near=w.near=re,U.far=D.far=w.far=te,(X!==U.near||q!==U.far)&&(s.updateRenderState({depthNear:U.near,depthFar:U.far}),X=U.near,q=U.far),U.layers.mask=K.layers.mask|6,w.layers.mask=U.layers.mask&-5,D.layers.mask=U.layers.mask&-3;const Ee=K.parent,Re=U.cameras;ne(U,Ee);for(let xe=0;xe<Re.length;xe++)ne(Re[xe],Ee);Re.length===2?oe(U,w,D):U.projectionMatrix.copy(w.projectionMatrix),fe(K,U,Ee)};function fe(K,re,te){te===null?K.matrix.copy(re.matrixWorld):(K.matrix.copy(te.matrixWorld),K.matrix.invert(),K.matrix.multiply(re.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(re.projectionMatrix),K.projectionMatrixInverse.copy(re.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Fs*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(u===null&&m===null))return l},this.setFoveation=function(K){l=K,u!==null&&(u.fixedFoveation=K),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=K)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(U)},this.getCameraTexture=function(K){return f[K]};let Ne=null;function Ze(K,re){if(h=re.getViewerPose(c||r),g=re,h!==null){const te=h.views;m!==null&&(e.setRenderTargetFramebuffer(y,m.framebuffer),e.setRenderTarget(y));let Ee=!1;te.length!==U.cameras.length&&(U.cameras.length=0,Ee=!0);for(let ae=0;ae<te.length;ae++){const Le=te[ae];let Oe=null;if(m!==null)Oe=m.getViewport(Le);else{const nt=d.getViewSubImage(u,Le);Oe=nt.viewport,ae===0&&(e.setRenderTargetTextures(y,nt.colorTexture,nt.depthStencilTexture),e.setRenderTarget(y))}let Be=P[ae];Be===void 0&&(Be=new an,Be.layers.enable(ae),Be.viewport=new _t,P[ae]=Be),Be.matrix.fromArray(Le.transform.matrix),Be.matrix.decompose(Be.position,Be.quaternion,Be.scale),Be.projectionMatrix.fromArray(Le.projectionMatrix),Be.projectionMatrixInverse.copy(Be.projectionMatrix).invert(),Be.viewport.set(Oe.x,Oe.y,Oe.width,Oe.height),ae===0&&(U.matrix.copy(Be.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),Ee===!0&&U.cameras.push(Be)}const Re=s.enabledFeatures;if(Re&&Re.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){d=n.getBinding();const ae=d.getDepthInformation(te[0]);ae&&ae.isValid&&ae.texture&&p.init(ae,s.renderState)}if(Re&&Re.includes("camera-access")&&x){e.state.unbindTexture(),d=n.getBinding();for(let ae=0;ae<te.length;ae++){const Le=te[ae].camera;if(Le){let Oe=f[Le];Oe||(Oe=new Ah,f[Le]=Oe);const Be=d.getCameraImage(Le);Oe.sourceTexture=Be}}}}for(let te=0;te<R.length;te++){const Ee=b[te],Re=R[te];Ee!==null&&Re!==void 0&&Re.update(Ee,re,c||r)}Ne&&Ne(K,re),re.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:re}),g=null}const Ve=new Hh;Ve.setAnimationLoop(Ze),this.setAnimationLoop=function(K){Ne=K},this.dispose=function(){}}}const K_=new at,vu=new Ie;vu.set(-1,0,0,0,1,0,0,0,1);function Z_(i,e){function t(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function n(p,f){f.color.getRGB(p.fogColor.value,Ch(i)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function s(p,f,S,T,y){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?a(p,f):f.isMeshLambertMaterial?(a(p,f),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(a(p,f),d(p,f)):f.isMeshPhongMaterial?(a(p,f),h(p,f),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(a(p,f),u(p,f),f.isMeshPhysicalMaterial&&m(p,f,y)):f.isMeshMatcapMaterial?(a(p,f),g(p,f)):f.isMeshDepthMaterial?a(p,f):f.isMeshDistanceMaterial?(a(p,f),x(p,f)):f.isMeshNormalMaterial?a(p,f):f.isLineBasicMaterial?(r(p,f),f.isLineDashedMaterial&&o(p,f)):f.isPointsMaterial?l(p,f,S,T):f.isSpriteMaterial?c(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function a(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,t(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===Xt&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,t(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===Xt&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,t(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,t(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const S=e.get(f),T=S.envMap,y=S.envMapRotation;T&&(p.envMap.value=T,p.envMapRotation.value.setFromMatrix4(K_.makeRotationFromEuler(y)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(vu),p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap&&(p.lightMap.value=f.lightMap,p.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,p.lightMapTransform)),f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,p.aoMapTransform))}function r(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform))}function o(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function l(p,f,S,T){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*S,p.scale.value=T*.5,f.map&&(p.map.value=f.map,t(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function c(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function h(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function d(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function u(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,p.roughnessMapTransform)),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,S){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Xt&&p.clearcoatNormalScale.value.negate())),f.dispersion>0&&(p.dispersion.value=f.dispersion),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=S.texture,p.transmissionSamplerSize.value.set(S.width,S.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,f){f.matcap&&(p.matcap.value=f.matcap)}function x(p,f){const S=e.get(f).light;p.referencePosition.value.setFromMatrixPosition(S.matrixWorld),p.nearDistance.value=S.shadow.camera.near,p.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function j_(i,e,t,n){let s={},a={},r=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,R){const b=R.program;n.uniformBlockBinding(y,b)}function c(y,R){let b=s[y.id];b===void 0&&(p(y),b=h(y),s[y.id]=b,y.addEventListener("dispose",S));const C=R.program;n.updateUBOMapping(y,C);const v=e.render.frame;a[y.id]!==v&&(u(y),a[y.id]=v)}function h(y){const R=d();y.__bindingPointIndex=R;const b=i.createBuffer(),C=y.__size,v=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,C,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,R,b),b}function d(){for(let y=0;y<o;y++)if(r.indexOf(y)===-1)return r.push(y),y;return qe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){const R=s[y.id],b=y.uniforms,C=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,R);for(let v=0,w=b.length;v<w;v++){const D=b[v];if(Array.isArray(D))for(let P=0,U=D.length;P<U;P++)m(D[P],v,P,C);else m(D,v,0,C)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(y,R,b,C){if(x(y,R,b,C)===!0){const v=y.__offset,w=y.value;if(Array.isArray(w)){let D=0;for(let P=0;P<w.length;P++){const U=w[P],X=f(U);g(U,y.__data,D),typeof U!="number"&&typeof U!="boolean"&&!U.isMatrix3&&!ArrayBuffer.isView(U)&&(D+=X.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(w,y.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,v,y.__data)}}function g(y,R,b){typeof y=="number"||typeof y=="boolean"?R[0]=y:y.isMatrix3?(R[0]=y.elements[0],R[1]=y.elements[1],R[2]=y.elements[2],R[3]=0,R[4]=y.elements[3],R[5]=y.elements[4],R[6]=y.elements[5],R[7]=0,R[8]=y.elements[6],R[9]=y.elements[7],R[10]=y.elements[8],R[11]=0):ArrayBuffer.isView(y)?R.set(new y.constructor(y.buffer,y.byteOffset,R.length)):y.toArray(R,b)}function x(y,R,b,C){const v=y.value,w=R+"_"+b;if(C[w]===void 0)return typeof v=="number"||typeof v=="boolean"?C[w]=v:ArrayBuffer.isView(v)?C[w]=v.slice():C[w]=v.clone(),!0;{const D=C[w];if(typeof v=="number"||typeof v=="boolean"){if(D!==v)return C[w]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(D.equals(v)===!1)return D.copy(v),!0}}return!1}function p(y){const R=y.uniforms;let b=0;const C=16;for(let w=0,D=R.length;w<D;w++){const P=Array.isArray(R[w])?R[w]:[R[w]];for(let U=0,X=P.length;U<X;U++){const q=P[U],B=Array.isArray(q.value)?q.value:[q.value];for(let W=0,H=B.length;W<H;W++){const Z=B[W],J=f(Z),oe=b%C,ne=oe%J.boundary,fe=oe+ne;b+=ne,fe!==0&&C-fe<J.storage&&(b+=C-fe),q.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),q.__offset=b,b+=J.storage}}}const v=b%C;return v>0&&(b+=C-v),y.__size=b,y.__cache={},this}function f(y){const R={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(R.boundary=4,R.storage=4):y.isVector2?(R.boundary=8,R.storage=8):y.isVector3||y.isColor?(R.boundary=16,R.storage=12):y.isVector4?(R.boundary=16,R.storage=16):y.isMatrix3?(R.boundary=48,R.storage=48):y.isMatrix4?(R.boundary=64,R.storage=64):y.isTexture?Pe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(R.boundary=16,R.storage=y.byteLength):Pe("WebGLRenderer: Unsupported uniform value type.",y),R}function S(y){const R=y.target;R.removeEventListener("dispose",S);const b=r.indexOf(R.__bindingPointIndex);r.splice(b,1),i.deleteBuffer(s[R.id]),delete s[R.id],delete a[R.id]}function T(){for(const y in s)i.deleteBuffer(s[y]);r=[],s={},a={}}return{bind:l,update:c,dispose:T}}const J_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Pn=null;function Q_(){return Pn===null&&(Pn=new pp(J_,16,16,Ri,Hn),Pn.name="DFG_LUT",Pn.minFilter=wt,Pn.magFilter=wt,Pn.wrapS=en,Pn.wrapT=en,Pn.generateMipmaps=!1,Pn.needsUpdate=!0),Pn}class ev{constructor(e={}){const{canvas:t=Cf(),context:n=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:m=tn}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=r;const x=m,p=new Set([no,to,eo]),f=new Set([tn,En,Ds,Ls,Jr,Qr]),S=new Uint32Array(4),T=new Int32Array(4),y=new L;let R=null,b=null;const C=[],v=[];let w=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=bn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const D=this;let P=!1,U=null,X=null,q=null,B=null;this._outputColorSpace=Ot;let W=0,H=0,Z=null,J=-1,oe=null;const ne=new _t,fe=new _t;let Ne=null;const Ze=new ze(0);let Ve=0,K=t.width,re=t.height,te=1,Ee=null,Re=null;const xe=new _t(0,0,K,re),Ye=new _t(0,0,K,re);let ae=!1;const Le=new ul;let Oe=!1,Be=!1;const nt=new at,ot=new L,dt=new _t,gt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let it=!1;function lt(){return Z===null?te:1}let I=n;function xt(M,F){return t.getContext(M,F)}try{const M={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Fr}`),t.addEventListener("webglcontextlost",Mt,!1),t.addEventListener("webglcontextrestored",ft,!1),t.addEventListener("webglcontextcreationerror",Nn,!1),I===null){const F="webgl2";if(I=xt(F,M),I===null)throw xt(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(M){throw qe("WebGLRenderer: "+M.message),M}let Xe,A,_,E,O,V,ee,ie,$,Y,se,ye,ce,he,Ce,De,Ue,N,le,j,ue,ge,Q;function be(){Xe=new Qg(I),Xe.init(),ue=new W_(I,Xe),A=new Xg(I,Xe,e,ue),_=new H_(I,Xe),A.reversedDepthBuffer&&u&&_.buffers.depth.setReversed(!0),X=I.createFramebuffer(),q=I.createFramebuffer(),B=I.createFramebuffer(),E=new n0(I),O=new R_,V=new G_(I,Xe,_,O,A,ue,E),ee=new Jg(D),ie=new kp(I),ge=new Gg(I,ie),$=new e0(I,ie,E,ge),Y=new s0(I,$,ie,ge,E),N=new i0(I,A,V),Ce=new qg(O),se=new A_(D,ee,Xe,A,ge,Ce),ye=new Z_(D,O),ce=new P_,he=new F_(Xe),Ue=new Hg(D,ee,_,Y,g,l),De=new V_(D,Y,A),Q=new j_(I,E,A,_),le=new Wg(I,Xe,E),j=new t0(I,Xe,E),E.programs=se.programs,D.capabilities=A,D.extensions=Xe,D.properties=O,D.renderLists=ce,D.shadowMap=De,D.state=_,D.info=E}be(),x!==tn&&(w=new r0(x,t.width,t.height,o,s,a));const Me=new Y_(D,I);this.xr=Me,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const M=Xe.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=Xe.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return te},this.setPixelRatio=function(M){M!==void 0&&(te=M,this.setSize(K,re,!1))},this.getSize=function(M){return M.set(K,re)},this.setSize=function(M,F,G=!0){if(Me.isPresenting){Pe("WebGLRenderer: Can't change size while VR device is presenting.");return}K=M,re=F,t.width=Math.floor(M*te),t.height=Math.floor(F*te),G===!0&&(t.style.width=M+"px",t.style.height=F+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,M,F)},this.getDrawingBufferSize=function(M){return M.set(K*te,re*te).floor()},this.setDrawingBufferSize=function(M,F,G){K=M,re=F,te=G,t.width=Math.floor(M*G),t.height=Math.floor(F*G),this.setViewport(0,0,M,F)},this.setEffects=function(M){if(x===tn){qe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let F=0;F<M.length;F++)if(M[F].isOutputPass===!0){Pe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(ne)},this.getViewport=function(M){return M.copy(xe)},this.setViewport=function(M,F,G,z){M.isVector4?xe.set(M.x,M.y,M.z,M.w):xe.set(M,F,G,z),_.viewport(ne.copy(xe).multiplyScalar(te).round())},this.getScissor=function(M){return M.copy(Ye)},this.setScissor=function(M,F,G,z){M.isVector4?Ye.set(M.x,M.y,M.z,M.w):Ye.set(M,F,G,z),_.scissor(fe.copy(Ye).multiplyScalar(te).round())},this.getScissorTest=function(){return ae},this.setScissorTest=function(M){_.setScissorTest(ae=M)},this.setOpaqueSort=function(M){Ee=M},this.setTransparentSort=function(M){Re=M},this.getClearColor=function(M){return M.copy(Ue.getClearColor())},this.setClearColor=function(){Ue.setClearColor(...arguments)},this.getClearAlpha=function(){return Ue.getClearAlpha()},this.setClearAlpha=function(){Ue.setClearAlpha(...arguments)},this.clear=function(M=!0,F=!0,G=!0){let z=0;if(M){let k=!1;if(Z!==null){const me=Z.texture.format;k=p.has(me)}if(k){const me=Z.texture.type,ve=f.has(me),pe=Ue.getClearColor(),Se=Ue.getClearAlpha(),we=pe.r,Fe=pe.g,He=pe.b;ve?(S[0]=we,S[1]=Fe,S[2]=He,S[3]=Se,I.clearBufferuiv(I.COLOR,0,S)):(T[0]=we,T[1]=Fe,T[2]=He,T[3]=Se,I.clearBufferiv(I.COLOR,0,T))}else z|=I.COLOR_BUFFER_BIT}F&&(z|=I.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),G&&(z|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z!==0&&I.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),U=M},this.dispose=function(){t.removeEventListener("webglcontextlost",Mt,!1),t.removeEventListener("webglcontextrestored",ft,!1),t.removeEventListener("webglcontextcreationerror",Nn,!1),Ue.dispose(),ce.dispose(),he.dispose(),O.dispose(),ee.dispose(),Y.dispose(),ge.dispose(),Q.dispose(),se.dispose(),Me.dispose(),Me.removeEventListener("sessionstart",Bu),Me.removeEventListener("sessionend",zu),Bi.stop()};function Mt(M){M.preventDefault(),Aa("WebGLRenderer: Context Lost."),P=!0}function ft(){Aa("WebGLRenderer: Context Restored."),P=!1;const M=E.autoReset,F=De.enabled,G=De.autoUpdate,z=De.needsUpdate,k=De.type;be(),E.autoReset=M,De.enabled=F,De.autoUpdate=G,De.needsUpdate=z,De.type=k}function Nn(M){qe("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Un(M){const F=M.target;F.removeEventListener("dispose",Un),mx(F)}function mx(M){gx(M),O.remove(M)}function gx(M){const F=O.get(M).programs;F!==void 0&&(F.forEach(function(G){se.releaseProgram(G)}),M.isShaderMaterial&&se.releaseShaderCache(M))}this.renderBufferDirect=function(M,F,G,z,k,me){F===null&&(F=gt);const ve=k.isMesh&&k.matrixWorld.determinantAffine()<0,pe=xx(M,F,G,z,k);_.setMaterial(z,ve);let Se=G.index,we=1;if(z.wireframe===!0){if(Se=$.getWireframeAttribute(G),Se===void 0)return;we=2}const Fe=G.drawRange,He=G.attributes.position;let Ae=Fe.start*we,st=(Fe.start+Fe.count)*we;me!==null&&(Ae=Math.max(Ae,me.start*we),st=Math.min(st,(me.start+me.count)*we)),Se!==null?(Ae=Math.max(Ae,0),st=Math.min(st,Se.count)):He!=null&&(Ae=Math.max(Ae,0),st=Math.min(st,He.count));const bt=st-Ae;if(bt<0||bt===1/0)return;ge.setup(k,z,pe,G,Se);let yt,ct=le;if(Se!==null&&(yt=ie.get(Se),ct=j,ct.setIndex(yt)),k.isMesh)z.wireframe===!0?(_.setLineWidth(z.wireframeLinewidth*lt()),ct.setMode(I.LINES)):ct.setMode(I.TRIANGLES);else if(k.isLine){let Gt=z.linewidth;Gt===void 0&&(Gt=1),_.setLineWidth(Gt*lt()),k.isLineSegments?ct.setMode(I.LINES):k.isLineLoop?ct.setMode(I.LINE_LOOP):ct.setMode(I.LINE_STRIP)}else k.isPoints?ct.setMode(I.POINTS):k.isSprite&&ct.setMode(I.TRIANGLES);if(k.isBatchedMesh)if(Xe.get("WEBGL_multi_draw"))ct.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Gt=k._multiDrawStarts,_e=k._multiDrawCounts,rn=k._multiDrawCount,Ke=Se?ie.get(Se).bytesPerElement:1,hn=O.get(z).currentProgram.getUniforms();for(let Fn=0;Fn<rn;Fn++)hn.setValue(I,"_gl_DrawID",Fn),ct.render(Gt[Fn]/Ke,_e[Fn])}else if(k.isInstancedMesh)ct.renderInstances(Ae,bt,k.count);else if(G.isInstancedBufferGeometry){const Gt=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,_e=Math.min(G.instanceCount,Gt);ct.renderInstances(Ae,bt,_e)}else ct.render(Ae,bt)};function Ou(M,F,G){M.transparent===!0&&M.side===on&&M.forceSinglePass===!1?(M.side=Xt,M.needsUpdate=!0,xr(M,F,G),M.side=kn,M.needsUpdate=!0,xr(M,F,G),M.side=on):xr(M,F,G)}this.compile=function(M,F,G=null){G===null&&(G=M),b=he.get(G),b.init(F),v.push(b),G.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(b.pushLight(k),k.castShadow&&b.pushShadow(k))}),M!==G&&M.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(b.pushLight(k),k.castShadow&&b.pushShadow(k))}),b.setupLights();const z=new Set;return M.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const me=k.material;if(me)if(Array.isArray(me))for(let ve=0;ve<me.length;ve++){const pe=me[ve];Ou(pe,G,k),z.add(pe)}else Ou(me,G,k),z.add(me)}),b=v.pop(),z},this.compileAsync=function(M,F,G=null){const z=this.compile(M,F,G);return new Promise(k=>{function me(){if(z.forEach(function(ve){O.get(ve).currentProgram.isReady()&&z.delete(ve)}),z.size===0){k(M);return}setTimeout(me,10)}Xe.get("KHR_parallel_shader_compile")!==null?me():setTimeout(me,10)})};let kl=null;function _x(M){kl&&kl(M)}function Bu(){Bi.stop()}function zu(){Bi.start()}const Bi=new Hh;Bi.setAnimationLoop(_x),typeof self<"u"&&Bi.setContext(self),this.setAnimationLoop=function(M){kl=M,Me.setAnimationLoop(M),M===null?Bi.stop():Bi.start()},Me.addEventListener("sessionstart",Bu),Me.addEventListener("sessionend",zu),this.render=function(M,F){if(F!==void 0&&F.isCamera!==!0){qe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;U!==null&&U.renderStart(M,F);const G=Me.enabled===!0&&Me.isPresenting===!0,z=w!==null&&(Z===null||G)&&w.begin(D,Z);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Me.enabled===!0&&Me.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Me.cameraAutoUpdate===!0&&Me.updateCamera(F),F=Me.getCamera()),M.isScene===!0&&M.onBeforeRender(D,M,F,Z),b=he.get(M,v.length),b.init(F),b.state.textureUnits=V.getTextureUnits(),v.push(b),nt.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Le.setFromProjectionMatrix(nt,Tn,F.reversedDepth),Be=this.localClippingEnabled,Oe=Ce.init(this.clippingPlanes,Be),R=ce.get(M,C.length),R.init(),C.push(R),Me.enabled===!0&&Me.isPresenting===!0){const ve=D.xr.getDepthSensingMesh();ve!==null&&Vl(ve,F,-1/0,D.sortObjects)}Vl(M,F,0,D.sortObjects),R.finish(),D.sortObjects===!0&&R.sort(Ee,Re,F.reversedDepth),it=Me.enabled===!1||Me.isPresenting===!1||Me.hasDepthSensing()===!1,it&&Ue.addToRenderList(R,M),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Oe===!0&&Ce.beginShadows();const k=b.state.shadowsArray;if(De.render(k,M,F),Oe===!0&&Ce.endShadows(),(z&&w.hasRenderPass())===!1){const ve=R.opaque,pe=R.transmissive;if(b.setupLights(),F.isArrayCamera){const Se=F.cameras;if(pe.length>0)for(let we=0,Fe=Se.length;we<Fe;we++){const He=Se[we];Vu(ve,pe,M,He)}it&&Ue.render(M);for(let we=0,Fe=Se.length;we<Fe;we++){const He=Se[we];ku(R,M,He,He.viewport)}}else pe.length>0&&Vu(ve,pe,M,F),it&&Ue.render(M),ku(R,M,F)}Z!==null&&H===0&&(V.updateMultisampleRenderTarget(Z),V.updateRenderTargetMipmap(Z)),z&&w.end(D),M.isScene===!0&&M.onAfterRender(D,M,F),ge.resetDefaultState(),J=-1,oe=null,v.pop(),v.length>0?(b=v[v.length-1],V.setTextureUnits(b.state.textureUnits),Oe===!0&&Ce.setGlobalState(D.clippingPlanes,b.state.camera)):b=null,C.pop(),C.length>0?R=C[C.length-1]:R=null,U!==null&&U.renderEnd()};function Vl(M,F,G,z){if(M.visible===!1)return;if(M.layers.test(F.layers)){if(M.isGroup)G=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(F);else if(M.isLightProbeGrid)b.pushLightProbeGrid(M);else if(M.isLight)b.pushLight(M),M.castShadow&&b.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||Le.intersectsSprite(M)){z&&dt.setFromMatrixPosition(M.matrixWorld).applyMatrix4(nt);const ve=Y.update(M),pe=M.material;pe.visible&&R.push(M,ve,pe,G,dt.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||Le.intersectsObject(M))){const ve=Y.update(M),pe=M.material;if(z&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),dt.copy(M.boundingSphere.center)):(ve.boundingSphere===null&&ve.computeBoundingSphere(),dt.copy(ve.boundingSphere.center)),dt.applyMatrix4(M.matrixWorld).applyMatrix4(nt)),Array.isArray(pe)){const Se=ve.groups;for(let we=0,Fe=Se.length;we<Fe;we++){const He=Se[we],Ae=pe[He.materialIndex];Ae&&Ae.visible&&R.push(M,ve,Ae,G,dt.z,He)}}else pe.visible&&R.push(M,ve,pe,G,dt.z,null)}}const me=M.children;for(let ve=0,pe=me.length;ve<pe;ve++)Vl(me[ve],F,G,z)}function ku(M,F,G,z){const{opaque:k,transmissive:me,transparent:ve}=M;b.setupLightsView(G),Oe===!0&&Ce.setGlobalState(D.clippingPlanes,G),z&&_.viewport(ne.copy(z)),k.length>0&&vr(k,F,G),me.length>0&&vr(me,F,G),ve.length>0&&vr(ve,F,G),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function Vu(M,F,G,z){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[z.id]===void 0){const Ae=Xe.has("EXT_color_buffer_half_float")||Xe.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[z.id]=new An(1,1,{generateMipmaps:!0,type:Ae?Hn:tn,minFilter:un,samples:Math.max(4,A.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$e.workingColorSpace})}const me=b.state.transmissionRenderTarget[z.id],ve=z.viewport||ne;me.setSize(ve.z*D.transmissionResolutionScale,ve.w*D.transmissionResolutionScale);const pe=D.getRenderTarget(),Se=D.getActiveCubeFace(),we=D.getActiveMipmapLevel();D.setRenderTarget(me),D.getClearColor(Ze),Ve=D.getClearAlpha(),Ve<1&&D.setClearColor(16777215,.5),D.clear(),it&&Ue.render(G);const Fe=D.toneMapping;D.toneMapping=bn;const He=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),b.setupLightsView(z),Oe===!0&&Ce.setGlobalState(D.clippingPlanes,z),vr(M,G,z),V.updateMultisampleRenderTarget(me),V.updateRenderTargetMipmap(me),Xe.has("WEBGL_multisampled_render_to_texture")===!1){let Ae=!1;for(let st=0,bt=F.length;st<bt;st++){const yt=F[st],{object:ct,geometry:Gt,material:_e,group:rn}=yt;if(_e.side===on&&ct.layers.test(z.layers)){const Ke=_e.side;_e.side=Xt,_e.needsUpdate=!0,Hu(ct,G,z,Gt,_e,rn),_e.side=Ke,_e.needsUpdate=!0,Ae=!0}}Ae===!0&&(V.updateMultisampleRenderTarget(me),V.updateRenderTargetMipmap(me))}D.setRenderTarget(pe,Se,we),D.setClearColor(Ze,Ve),He!==void 0&&(z.viewport=He),D.toneMapping=Fe}function vr(M,F,G){const z=F.isScene===!0?F.overrideMaterial:null;for(let k=0,me=M.length;k<me;k++){const ve=M[k],{object:pe,geometry:Se,group:we}=ve;let Fe=ve.material;Fe.allowOverride===!0&&z!==null&&(Fe=z),pe.layers.test(G.layers)&&Hu(pe,F,G,Se,Fe,we)}}function Hu(M,F,G,z,k,me){M.onBeforeRender(D,F,G,z,k,me),M.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),k.onBeforeRender(D,F,G,z,M,me),k.transparent===!0&&k.side===on&&k.forceSinglePass===!1?(k.side=Xt,k.needsUpdate=!0,D.renderBufferDirect(G,F,z,k,M,me),k.side=kn,k.needsUpdate=!0,D.renderBufferDirect(G,F,z,k,M,me),k.side=on):D.renderBufferDirect(G,F,z,k,M,me),M.onAfterRender(D,F,G,z,k,me)}function xr(M,F,G){F.isScene!==!0&&(F=gt);const z=O.get(M),k=b.state.lights,me=b.state.shadowsArray,ve=k.state.version,pe=se.getParameters(M,k.state,me,F,G,b.state.lightProbeGridArray),Se=se.getProgramCacheKey(pe);let we=z.programs;z.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?F.environment:null,z.fog=F.fog;const Fe=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;z.envMap=ee.get(M.envMap||z.environment,Fe),z.envMapRotation=z.environment!==null&&M.envMap===null?F.environmentRotation:M.envMapRotation,we===void 0&&(M.addEventListener("dispose",Un),we=new Map,z.programs=we);let He=we.get(Se);if(He!==void 0){if(z.currentProgram===He&&z.lightsStateVersion===ve)return Wu(M,pe),He}else pe.uniforms=se.getUniforms(M),U!==null&&M.isNodeMaterial&&U.build(M,G,pe),M.onBeforeCompile(pe,D),He=se.acquireProgram(pe,Se),we.set(Se,He),z.uniforms=pe.uniforms;const Ae=z.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Ae.clippingPlanes=Ce.uniform),Wu(M,pe),z.needsLights=yx(M),z.lightsStateVersion=ve,z.needsLights&&(Ae.ambientLightColor.value=k.state.ambient,Ae.lightProbe.value=k.state.probe,Ae.directionalLights.value=k.state.directional,Ae.directionalLightShadows.value=k.state.directionalShadow,Ae.spotLights.value=k.state.spot,Ae.spotLightShadows.value=k.state.spotShadow,Ae.rectAreaLights.value=k.state.rectArea,Ae.ltc_1.value=k.state.rectAreaLTC1,Ae.ltc_2.value=k.state.rectAreaLTC2,Ae.pointLights.value=k.state.point,Ae.pointLightShadows.value=k.state.pointShadow,Ae.hemisphereLights.value=k.state.hemi,Ae.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Ae.spotLightMatrix.value=k.state.spotLightMatrix,Ae.spotLightMap.value=k.state.spotLightMap,Ae.pointShadowMatrix.value=k.state.pointShadowMatrix),z.lightProbeGrid=b.state.lightProbeGridArray.length>0,z.currentProgram=He,z.uniformsList=null,He}function Gu(M){if(M.uniformsList===null){const F=M.currentProgram.getUniforms();M.uniformsList=hr.seqWithValue(F.seq,M.uniforms)}return M.uniformsList}function Wu(M,F){const G=O.get(M);G.outputColorSpace=F.outputColorSpace,G.batching=F.batching,G.batchingColor=F.batchingColor,G.instancing=F.instancing,G.instancingColor=F.instancingColor,G.instancingMorph=F.instancingMorph,G.skinning=F.skinning,G.morphTargets=F.morphTargets,G.morphNormals=F.morphNormals,G.morphColors=F.morphColors,G.morphTargetsCount=F.morphTargetsCount,G.numClippingPlanes=F.numClippingPlanes,G.numIntersection=F.numClipIntersection,G.vertexAlphas=F.vertexAlphas,G.vertexTangents=F.vertexTangents,G.toneMapping=F.toneMapping}function vx(M,F){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;y.setFromMatrixPosition(F.matrixWorld);for(let G=0,z=M.length;G<z;G++){const k=M[G];if(k.texture!==null&&k.boundingBox.containsPoint(y))return k}return null}function xx(M,F,G,z,k){F.isScene!==!0&&(F=gt),V.resetTextureUnits();const me=F.fog,ve=z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial?F.environment:null,pe=Z===null?D.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:$e.workingColorSpace,Se=z.isMeshStandardMaterial||z.isMeshLambertMaterial&&!z.envMap||z.isMeshPhongMaterial&&!z.envMap,we=ee.get(z.envMap||ve,Se),Fe=z.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,He=!!G.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Ae=!!G.morphAttributes.position,st=!!G.morphAttributes.normal,bt=!!G.morphAttributes.color;let yt=bn;z.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(yt=D.toneMapping);const ct=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Gt=ct!==void 0?ct.length:0,_e=O.get(z),rn=b.state.lights;if(Oe===!0&&(Be===!0||M!==oe)){const pt=M===oe&&z.id===J;Ce.setState(z,M,pt)}let Ke=!1;z.version===_e.__version?(_e.needsLights&&_e.lightsStateVersion!==rn.state.version||_e.outputColorSpace!==pe||k.isBatchedMesh&&_e.batching===!1||!k.isBatchedMesh&&_e.batching===!0||k.isBatchedMesh&&_e.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&_e.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&_e.instancing===!1||!k.isInstancedMesh&&_e.instancing===!0||k.isSkinnedMesh&&_e.skinning===!1||!k.isSkinnedMesh&&_e.skinning===!0||k.isInstancedMesh&&_e.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&_e.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&_e.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&_e.instancingMorph===!1&&k.morphTexture!==null||_e.envMap!==we||z.fog===!0&&_e.fog!==me||_e.numClippingPlanes!==void 0&&(_e.numClippingPlanes!==Ce.numPlanes||_e.numIntersection!==Ce.numIntersection)||_e.vertexAlphas!==Fe||_e.vertexTangents!==He||_e.morphTargets!==Ae||_e.morphNormals!==st||_e.morphColors!==bt||_e.toneMapping!==yt||_e.morphTargetsCount!==Gt||!!_e.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(Ke=!0):(Ke=!0,_e.__version=z.version);let hn=_e.currentProgram;Ke===!0&&(hn=xr(z,F,k),U&&z.isNodeMaterial&&U.onUpdateProgram(z,hn,_e));let Fn=!1,_i=!1,Ms=!1;const ht=hn.getUniforms(),Et=_e.uniforms;if(_.useProgram(hn.program)&&(Fn=!0,_i=!0,Ms=!0),z.id!==J&&(J=z.id,_i=!0),_e.needsLights){const pt=vx(b.state.lightProbeGridArray,k);_e.lightProbeGrid!==pt&&(_e.lightProbeGrid=pt,_i=!0)}if(Fn||oe!==M){_.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),ht.setValue(I,"projectionMatrix",M.projectionMatrix),ht.setValue(I,"viewMatrix",M.matrixWorldInverse);const xi=ht.map.cameraPosition;xi!==void 0&&xi.setValue(I,ot.setFromMatrixPosition(M.matrixWorld)),A.logarithmicDepthBuffer&&ht.setValue(I,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&ht.setValue(I,"isOrthographic",M.isOrthographicCamera===!0),oe!==M&&(oe=M,_i=!0,Ms=!0)}if(_e.needsLights&&(rn.state.directionalShadowMap.length>0&&ht.setValue(I,"directionalShadowMap",rn.state.directionalShadowMap,V),rn.state.spotShadowMap.length>0&&ht.setValue(I,"spotShadowMap",rn.state.spotShadowMap,V),rn.state.pointShadowMap.length>0&&ht.setValue(I,"pointShadowMap",rn.state.pointShadowMap,V)),k.isSkinnedMesh){ht.setOptional(I,k,"bindMatrix"),ht.setOptional(I,k,"bindMatrixInverse");const pt=k.skeleton;pt&&(pt.boneTexture===null&&pt.computeBoneTexture(),ht.setValue(I,"boneTexture",pt.boneTexture,V))}k.isBatchedMesh&&(ht.setOptional(I,k,"batchingTexture"),ht.setValue(I,"batchingTexture",k._matricesTexture,V),ht.setOptional(I,k,"batchingIdTexture"),ht.setValue(I,"batchingIdTexture",k._indirectTexture,V),ht.setOptional(I,k,"batchingColorTexture"),k._colorsTexture!==null&&ht.setValue(I,"batchingColorTexture",k._colorsTexture,V));const vi=G.morphAttributes;if((vi.position!==void 0||vi.normal!==void 0||vi.color!==void 0)&&N.update(k,G,hn),(_i||_e.receiveShadow!==k.receiveShadow)&&(_e.receiveShadow=k.receiveShadow,ht.setValue(I,"receiveShadow",k.receiveShadow)),(z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial)&&z.envMap===null&&F.environment!==null&&(Et.envMapIntensity.value=F.environmentIntensity),Et.dfgLUT!==void 0&&(Et.dfgLUT.value=Q_()),_i){if(ht.setValue(I,"toneMappingExposure",D.toneMappingExposure),_e.needsLights&&Mx(Et,Ms),me&&z.fog===!0&&ye.refreshFogUniforms(Et,me),ye.refreshMaterialUniforms(Et,z,te,re,b.state.transmissionRenderTarget[M.id]),_e.needsLights&&_e.lightProbeGrid){const pt=_e.lightProbeGrid;Et.probesSH.value=pt.texture,Et.probesMin.value.copy(pt.boundingBox.min),Et.probesMax.value.copy(pt.boundingBox.max),Et.probesResolution.value.copy(pt.resolution)}hr.upload(I,Gu(_e),Et,V)}if(z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(hr.upload(I,Gu(_e),Et,V),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&ht.setValue(I,"center",k.center),ht.setValue(I,"modelViewMatrix",k.modelViewMatrix),ht.setValue(I,"normalMatrix",k.normalMatrix),ht.setValue(I,"modelMatrix",k.matrixWorld),z.uniformsGroups!==void 0){const pt=z.uniformsGroups;for(let xi=0,ys=pt.length;xi<ys;xi++){const Xu=pt[xi];Q.update(Xu,hn),Q.bind(Xu,hn)}}return hn}function Mx(M,F){M.ambientLightColor.needsUpdate=F,M.lightProbe.needsUpdate=F,M.directionalLights.needsUpdate=F,M.directionalLightShadows.needsUpdate=F,M.pointLights.needsUpdate=F,M.pointLightShadows.needsUpdate=F,M.spotLights.needsUpdate=F,M.spotLightShadows.needsUpdate=F,M.rectAreaLights.needsUpdate=F,M.hemisphereLights.needsUpdate=F}function yx(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return H},this.getRenderTarget=function(){return Z},this.setRenderTargetTextures=function(M,F,G){const z=O.get(M);z.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),O.get(M.texture).__webglTexture=F,O.get(M.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:G,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,F){const G=O.get(M);G.__webglFramebuffer=F,G.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(M,F=0,G=0){Z=M,W=F,H=G;let z=null,k=!1,me=!1;if(M){const pe=O.get(M);if(pe.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(I.FRAMEBUFFER,pe.__webglFramebuffer),ne.copy(M.viewport),fe.copy(M.scissor),Ne=M.scissorTest,_.viewport(ne),_.scissor(fe),_.setScissorTest(Ne),J=-1;return}else if(pe.__webglFramebuffer===void 0)V.setupRenderTarget(M);else if(pe.__hasExternalTextures)V.rebindTextures(M,O.get(M.texture).__webglTexture,O.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const Fe=M.depthTexture;if(pe.__boundDepthTexture!==Fe){if(Fe!==null&&O.has(Fe)&&(M.width!==Fe.image.width||M.height!==Fe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");V.setupDepthRenderbuffer(M)}}const Se=M.texture;(Se.isData3DTexture||Se.isDataArrayTexture||Se.isCompressedArrayTexture)&&(me=!0);const we=O.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(we[F])?z=we[F][G]:z=we[F],k=!0):M.samples>0&&V.useMultisampledRTT(M)===!1?z=O.get(M).__webglMultisampledFramebuffer:Array.isArray(we)?z=we[G]:z=we,ne.copy(M.viewport),fe.copy(M.scissor),Ne=M.scissorTest}else ne.copy(xe).multiplyScalar(te).floor(),fe.copy(Ye).multiplyScalar(te).floor(),Ne=ae;if(G!==0&&(z=X),_.bindFramebuffer(I.FRAMEBUFFER,z)&&_.drawBuffers(M,z),_.viewport(ne),_.scissor(fe),_.setScissorTest(Ne),k){const pe=O.get(M.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+F,pe.__webglTexture,G)}else if(me){const pe=F;for(let Se=0;Se<M.textures.length;Se++){const we=O.get(M.textures[Se]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Se,we.__webglTexture,G,pe)}}else if(M!==null&&G!==0){const pe=O.get(M.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,pe.__webglTexture,G)}J=-1},this.readRenderTargetPixels=function(M,F,G,z,k,me,ve,pe=0){if(!(M&&M.isWebGLRenderTarget)){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=O.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ve!==void 0&&(Se=Se[ve]),Se){_.bindFramebuffer(I.FRAMEBUFFER,Se);try{const we=M.textures[pe],Fe=we.format,He=we.type;if(M.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+pe),!A.textureFormatReadable(Fe)){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!A.textureTypeReadable(He)){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=M.width-z&&G>=0&&G<=M.height-k&&I.readPixels(F,G,z,k,ue.convert(Fe),ue.convert(He),me)}finally{const we=Z!==null?O.get(Z).__webglFramebuffer:null;_.bindFramebuffer(I.FRAMEBUFFER,we)}}},this.readRenderTargetPixelsAsync=async function(M,F,G,z,k,me,ve,pe=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=O.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ve!==void 0&&(Se=Se[ve]),Se)if(F>=0&&F<=M.width-z&&G>=0&&G<=M.height-k){_.bindFramebuffer(I.FRAMEBUFFER,Se);const we=M.textures[pe],Fe=we.format,He=we.type;if(M.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+pe),!A.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!A.textureTypeReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ae=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Ae),I.bufferData(I.PIXEL_PACK_BUFFER,me.byteLength,I.STREAM_READ),I.readPixels(F,G,z,k,ue.convert(Fe),ue.convert(He),0);const st=Z!==null?O.get(Z).__webglFramebuffer:null;_.bindFramebuffer(I.FRAMEBUFFER,st);const bt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Pf(I,bt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Ae),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,me),I.deleteBuffer(Ae),I.deleteSync(bt),me}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,F=null,G=0){const z=Math.pow(2,-G),k=Math.floor(M.image.width*z),me=Math.floor(M.image.height*z),ve=F!==null?F.x:0,pe=F!==null?F.y:0;V.setTexture2D(M,0),I.copyTexSubImage2D(I.TEXTURE_2D,G,0,0,ve,pe,k,me),_.unbindTexture()},this.copyTextureToTexture=function(M,F,G=null,z=null,k=0,me=0){let ve,pe,Se,we,Fe,He,Ae,st,bt;const yt=M.isCompressedTexture?M.mipmaps[me]:M.image;if(G!==null)ve=G.max.x-G.min.x,pe=G.max.y-G.min.y,Se=G.isBox3?G.max.z-G.min.z:1,we=G.min.x,Fe=G.min.y,He=G.isBox3?G.min.z:0;else{const Et=Math.pow(2,-k);ve=Math.floor(yt.width*Et),pe=Math.floor(yt.height*Et),M.isDataArrayTexture?Se=yt.depth:M.isData3DTexture?Se=Math.floor(yt.depth*Et):Se=1,we=0,Fe=0,He=0}z!==null?(Ae=z.x,st=z.y,bt=z.z):(Ae=0,st=0,bt=0);const ct=ue.convert(F.format),Gt=ue.convert(F.type);let _e;F.isData3DTexture?(V.setTexture3D(F,0),_e=I.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(V.setTexture2DArray(F,0),_e=I.TEXTURE_2D_ARRAY):(V.setTexture2D(F,0),_e=I.TEXTURE_2D),_.activeTexture(I.TEXTURE0),_.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,F.flipY),_.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),_.pixelStorei(I.UNPACK_ALIGNMENT,F.unpackAlignment);const rn=_.getParameter(I.UNPACK_ROW_LENGTH),Ke=_.getParameter(I.UNPACK_IMAGE_HEIGHT),hn=_.getParameter(I.UNPACK_SKIP_PIXELS),Fn=_.getParameter(I.UNPACK_SKIP_ROWS),_i=_.getParameter(I.UNPACK_SKIP_IMAGES);_.pixelStorei(I.UNPACK_ROW_LENGTH,yt.width),_.pixelStorei(I.UNPACK_IMAGE_HEIGHT,yt.height),_.pixelStorei(I.UNPACK_SKIP_PIXELS,we),_.pixelStorei(I.UNPACK_SKIP_ROWS,Fe),_.pixelStorei(I.UNPACK_SKIP_IMAGES,He);const Ms=M.isDataArrayTexture||M.isData3DTexture,ht=F.isDataArrayTexture||F.isData3DTexture;if(M.isDepthTexture){const Et=O.get(M),vi=O.get(F),pt=O.get(Et.__renderTarget),xi=O.get(vi.__renderTarget);_.bindFramebuffer(I.READ_FRAMEBUFFER,pt.__webglFramebuffer),_.bindFramebuffer(I.DRAW_FRAMEBUFFER,xi.__webglFramebuffer);for(let ys=0;ys<Se;ys++)Ms&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,O.get(M).__webglTexture,k,He+ys),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,O.get(F).__webglTexture,me,bt+ys)),I.blitFramebuffer(we,Fe,ve,pe,Ae,st,ve,pe,I.DEPTH_BUFFER_BIT,I.NEAREST);_.bindFramebuffer(I.READ_FRAMEBUFFER,null),_.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(k!==0||M.isRenderTargetTexture||O.has(M)){const Et=O.get(M),vi=O.get(F);_.bindFramebuffer(I.READ_FRAMEBUFFER,q),_.bindFramebuffer(I.DRAW_FRAMEBUFFER,B);for(let pt=0;pt<Se;pt++)Ms?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Et.__webglTexture,k,He+pt):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Et.__webglTexture,k),ht?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,vi.__webglTexture,me,bt+pt):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,vi.__webglTexture,me),k!==0?I.blitFramebuffer(we,Fe,ve,pe,Ae,st,ve,pe,I.COLOR_BUFFER_BIT,I.NEAREST):ht?I.copyTexSubImage3D(_e,me,Ae,st,bt+pt,we,Fe,ve,pe):I.copyTexSubImage2D(_e,me,Ae,st,we,Fe,ve,pe);_.bindFramebuffer(I.READ_FRAMEBUFFER,null),_.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else ht?M.isDataTexture||M.isData3DTexture?I.texSubImage3D(_e,me,Ae,st,bt,ve,pe,Se,ct,Gt,yt.data):F.isCompressedArrayTexture?I.compressedTexSubImage3D(_e,me,Ae,st,bt,ve,pe,Se,ct,yt.data):I.texSubImage3D(_e,me,Ae,st,bt,ve,pe,Se,ct,Gt,yt):M.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,me,Ae,st,ve,pe,ct,Gt,yt.data):M.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,me,Ae,st,yt.width,yt.height,ct,yt.data):I.texSubImage2D(I.TEXTURE_2D,me,Ae,st,ve,pe,ct,Gt,yt);_.pixelStorei(I.UNPACK_ROW_LENGTH,rn),_.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Ke),_.pixelStorei(I.UNPACK_SKIP_PIXELS,hn),_.pixelStorei(I.UNPACK_SKIP_ROWS,Fn),_.pixelStorei(I.UNPACK_SKIP_IMAGES,_i),me===0&&F.generateMipmaps&&I.generateMipmap(_e),_.unbindTexture()},this.initRenderTarget=function(M){O.get(M).__webglFramebuffer===void 0&&V.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?V.setTextureCube(M,0):M.isData3DTexture?V.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?V.setTexture2DArray(M,0):V.setTexture2D(M,0),_.unbindTexture()},this.resetState=function(){W=0,H=0,Z=null,_.reset(),ge.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Tn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=$e._getDrawingBufferColorSpace(e),t.unpackColorSpace=$e._getUnpackColorSpace()}}const xu={type:"change"},Ll={type:"start"},Mu={type:"end"},dr=new $s,yu=new hi,tv=Math.cos(70*Zt.DEG2RAD),Dt=new L,jt=2*Math.PI,tt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Il=1e-6;class nv extends Bp{constructor(e,t=null){super(e,t),this.state=tt.NONE,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Gi.ROTATE,MIDDLE:Gi.DOLLY,RIGHT:Gi.PAN},this.touches={ONE:Wi.ROTATE,TWO:Wi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new ni,this._lastTargetPosition=new L,this._quat=new ni().setFromUnitVectors(e.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new zh,this._sphericalDelta=new zh,this._scale=1,this._panOffset=new L,this._rotateStart=new Te,this._rotateEnd=new Te,this._rotateDelta=new Te,this._panStart=new Te,this._panEnd=new Te,this._panDelta=new Te,this._dollyStart=new Te,this._dollyEnd=new Te,this._dollyDelta=new Te,this._dollyDirection=new L,this._mouse=new Te,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=sv.bind(this),this._onPointerDown=iv.bind(this),this._onPointerUp=av.bind(this),this._onContextMenu=dv.bind(this),this._onMouseWheel=lv.bind(this),this._onKeyDown=cv.bind(this),this._onTouchStart=hv.bind(this),this._onTouchMove=uv.bind(this),this._onMouseDown=rv.bind(this),this._onMouseMove=ov.bind(this),this._interceptControlDown=fv.bind(this),this._interceptControlUp=pv.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(xu),this.update(),this.state=tt.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;Dt.copy(t).sub(this.target),Dt.applyQuaternion(this._quat),this._spherical.setFromVector3(Dt),this.autoRotate&&this.state===tt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=jt:n>Math.PI&&(n-=jt),s<-Math.PI?s+=jt:s>Math.PI&&(s-=jt),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let a=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const r=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),a=r!=this._spherical.radius}if(Dt.setFromSpherical(this._spherical),Dt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Dt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let r=null;if(this.object.isPerspectiveCamera){const o=Dt.length();r=this._clampDistance(o*this._scale);const l=o-r;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),a=!!l}else if(this.object.isOrthographicCamera){const o=new L(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),a=l!==this.object.zoom;const c=new L(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),r=Dt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;r!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(r).add(this.object.position):(dr.origin.copy(this.object.position),dr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(dr.direction))<tv?this.object.lookAt(this.target):(yu.setFromNormalAndCoplanarPoint(this.object.up,this.target),dr.intersectPlane(yu,this.target))))}else if(this.object.isOrthographicCamera){const r=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),r!==this.object.zoom&&(this.object.updateProjectionMatrix(),a=!0)}return this._scale=1,this._performCursorZoom=!1,a||this._lastPosition.distanceToSquared(this.object.position)>Il||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Il||this._lastTargetPosition.distanceToSquared(this.target)>Il?(this.dispatchEvent(xu),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?jt/60*this.autoRotateSpeed*e:jt/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Dt.setFromMatrixColumn(t,0),Dt.multiplyScalar(-e),this._panOffset.add(Dt)}_panUp(e,t){this.screenSpacePanning===!0?Dt.setFromMatrixColumn(t,1):(Dt.setFromMatrixColumn(t,0),Dt.crossVectors(this.object.up,Dt)),Dt.multiplyScalar(e),this._panOffset.add(Dt)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Dt.copy(s).sub(this.target);let a=Dt.length();a*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*a/n.clientHeight,this.object.matrix),this._panUp(2*t*a/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=e-n.left,a=t-n.top,r=n.width,o=n.height;this._mouse.x=s/r*2-1,this._mouse.y=-(a/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(jt*this._rotateDelta.x/t.clientHeight),this._rotateUp(jt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,a=Math.sqrt(n*n+s*s);this._dollyStart.set(0,a)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),a=.5*(e.pageY+n.y);this._rotateEnd.set(s,a)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(jt*this._rotateDelta.x/t.clientHeight),this._rotateUp(jt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,a=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,a),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const r=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(r,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Te,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function iv(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function sv(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function av(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Mu),this.state=tt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function rv(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Gi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=tt.DOLLY;break;case Gi.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=tt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=tt.ROTATE}break;case Gi.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=tt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=tt.PAN}break;default:this.state=tt.NONE}this.state!==tt.NONE&&this.dispatchEvent(Ll)}function ov(i){switch(this.state){case tt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case tt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case tt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function lv(i){this.enabled===!1||this.enableZoom===!1||this.state!==tt.NONE||(i.preventDefault(),this.dispatchEvent(Ll),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Mu))}function cv(i){this.enabled!==!1&&this._handleKeyDown(i)}function hv(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Wi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=tt.TOUCH_ROTATE;break;case Wi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=tt.TOUCH_PAN;break;default:this.state=tt.NONE}break;case 2:switch(this.touches.TWO){case Wi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=tt.TOUCH_DOLLY_PAN;break;case Wi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=tt.TOUCH_DOLLY_ROTATE;break;default:this.state=tt.NONE}break;default:this.state=tt.NONE}this.state!==tt.NONE&&this.dispatchEvent(Ll)}function uv(i){switch(this._trackPointer(i),this.state){case tt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case tt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case tt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case tt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=tt.NONE}}function dv(i){this.enabled!==!1&&i.preventDefault()}function fv(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function pv(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Su(i){return Object.fromEntries(Object.entries(i.parameters).map(([e,t])=>[e,t.default]))}const ea={protocolVersion:Yu,id:"solar-system-3d",version:Jt,name:"3D Solar System",description:"Explore, learn and observe a deterministic educational Solar System with Earth’s Moon.",renderer:"three",category:"planet",accuracyProfile:{mode:"educational",note:"Uses rounded orbital constants through the installed baseline Astronomy Engine. Visual scale can be enhanced for teaching and is not suitable for navigation or authoritative eclipse prediction."},capabilities:{focusableObjects:!0,interactiveCamera:!0,standaloneHtmlExport:!0,deterministic:!0},parameters:{timeScale:{type:"range",label:"Simulation speed",min:-2048,max:2048,step:.001,default:1,unit:"days/s",description:"Signed simulated Earth days advanced per real second. Reverse time is exposed only in Advanced Mode."},scaleMode:{type:"select",label:"Visual scale",default:"learning",options:[{label:"Learning Scale",value:"learning"},{label:"Real Distance",value:"real-distance"},{label:"Real Scale",value:"real-scale"}],description:"Scientific positions are unchanged. Learning Scale compresses spacing; Real Distance uses linear AU spacing with overlap-safe sizes and locator labels; Real Scale uses physical radius-to-AU ratios."},planetScale:{type:"range",label:"Planet size",min:.6,max:2.4,step:.05,default:1.15,unit:"×"},distanceScale:{type:"range",label:"Orbit spacing",min:.65,max:1.45,step:.05,default:1,unit:"×"},visualMode:{type:"select",label:"Legacy distance model",default:"educational",options:[{label:"Teaching compression",value:"educational"},{label:"Linear AU spacing",value:"scientific"}],description:"Retained for backward-compatible v0.5 snapshots. Linear AU spacing now applies Real Distance overlap guards and automatic full-system framing."},showOrbits:{type:"toggle",label:"Orbit lines",default:!0},showLabels:{type:"toggle",label:"Planet and Moon labels",default:!0},showStars:{type:"toggle",label:"Star field",default:!0},quality:{type:"select",label:"Render quality",default:"auto",options:[{label:"Auto",value:"auto"},{label:"Battery saver",value:"low"},{label:"High detail",value:"high"}]}}};function Je(i,e,t){const n=i[e];return typeof n=="number"&&Number.isFinite(n)?n:t}function Mn(i,e,t){const n=i[e];return typeof n=="boolean"?n:t}function Ui(i,e,t){const n=i[e];return typeof n=="string"?n:t}function Vt(i){const e=Ui(i,"quality","auto");return e==="low"||e==="high"?e:"auto"}function mt(i){const e=Ui(i,"scaleMode","learning");return e==="real-distance"||e==="real-scale"?e:Ui(i,"visualMode","educational")==="scientific"?"real-distance":"learning"}function Jn(i){const e=Ui(i,"scaleMode","learning");return e==="real-distance"||e==="real-scale"||Ui(i,"visualMode","educational")==="scientific"?"scientific":"educational"}const Fi=Math.PI*2;function Oi(i){return Math.max(0,Math.min(255,Math.round(i)))}function mv(i){let e=i>>>0;return()=>{e+=1831565813;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function gv(i,e){const t=Math.sin((i*4.1+Math.sin(e*8.7)*.08)*Fi),n=Math.sin((i*11.8-e*5.4)*Fi)*.48,s=Math.cos((i*27.2+e*17.9)*Fi)*.23,a=Math.sin((i*61.3-e*39.1)*Fi)*.11;return(t+n+s+a)/1.82}function Nl(i,e){const t=document.createElement("canvas");t.width=i,t.height=e;const n=t.getContext("2d",{willReadFrequently:!0});if(!n)throw new Error("Canvas 2D is unavailable for Moon texture generation.");return{canvas:t,context:n}}function bu(i,e,t,n,s,a,r){for(const o of[-e,0,e]){i.save(),i.translate(t+o,n),i.scale(1,a/Math.max(.01,s));const l=i.createRadialGradient(-s*.2,-s*.24,s*.06,0,0,s);r?(l.addColorStop(0,"rgba(250,248,238,0.34)"),l.addColorStop(.38,"rgba(176,172,163,0.12)"),l.addColorStop(.66,"rgba(30,29,28,0.42)"),l.addColorStop(.82,"rgba(232,228,216,0.25)"),l.addColorStop(1,"rgba(255,255,255,0)")):(l.addColorStop(0,"rgba(198,198,198,0.5)"),l.addColorStop(.5,"rgba(72,72,72,0.44)"),l.addColorStop(.72,"rgba(24,24,24,0.72)"),l.addColorStop(.86,"rgba(222,222,222,0.64)"),l.addColorStop(1,"rgba(128,128,128,0)")),i.fillStyle=l,i.beginPath(),i.arc(0,0,s,0,Fi),i.fill(),i.restore()}}function _v(i,e,t,n){const s=Nl(i,e),a=Nl(i,e),r=s.context.createImageData(i,e),o=a.context.createImageData(i,e);for(let g=0;g<e;g+=1){const x=g/Math.max(1,e-1),p=Math.abs(x-.5)*2;for(let f=0;f<i;f+=1){const S=f/Math.max(1,i-1),T=gv(S,x),y=Math.sin((S*143.7+x*89.3)*Fi)*.035,R=p*5,b=166+T*20+y*255-R,C=Math.max(0,T)*4,v=(g*i+f)*4;r.data[v]=Oi(b+7+C),r.data[v+1]=Oi(b+5+C*.6),r.data[v+2]=Oi(b+1),r.data[v+3]=255;const w=Oi(130+T*34+y*215);o.data[v]=w,o.data[v+1]=w,o.data[v+2]=w,o.data[v+3]=255}}s.context.putImageData(r,0,0),a.context.putImageData(o,0,0);const l=[[.31,.43,.12,.065,-.18],[.39,.55,.1,.078,.14],[.48,.39,.085,.058,-.08],[.58,.52,.11,.07,.18],[.67,.42,.075,.052,-.22]];for(const[g,x,p,f,S]of l){s.context.save(),s.context.translate(g*i,x*e),s.context.rotate(S);const T=s.context.createRadialGradient(0,0,0,0,0,p*i);T.addColorStop(0,"rgba(50,51,51,0.32)"),T.addColorStop(.7,"rgba(63,64,64,0.25)"),T.addColorStop(1,"rgba(82,82,82,0)"),s.context.fillStyle=T,s.context.scale(1,f*e/Math.max(1,p*i)),s.context.beginPath(),s.context.arc(0,0,p*i,0,Fi),s.context.fill(),s.context.restore()}const c=mv(1297043278+i);for(let g=0;g<t;g+=1){const x=c(),p=.035+c()*.93,f=Math.max(.28,Math.cos((p-.5)*Math.PI)),T=g<Math.max(7,Math.round(t*.055))?i*(.018+c()*.026):i*(.0024+Math.pow(c(),2.4)*.015),y=T*f;bu(s.context,i,x*i,p*e,T,y,!0),bu(a.context,i,x*i,p*e,T,y,!1)}const h=(g,x)=>{const p=new nr(g);return p.colorSpace=x,p.wrapS=Ti,p.wrapT=en,p.minFilter=un,p.magFilter=wt,p.generateMipmaps=!0,p.needsUpdate=!0,p},d=h(s.canvas,Ot),u=h(a.canvas,fn),m={albedo:d,height:u};if(n){const g=Nl(i,e),x=a.context.getImageData(0,0,i,e),p=g.context.createImageData(i,e),f=(T,y)=>{const R=(T+i)%i,b=Math.max(0,Math.min(e-1,y));return x.data[(b*i+R)*4]/255},S=2.45;for(let T=0;T<e;T+=1)for(let y=0;y<i;y+=1){let R=(f(y-1,T)-f(y+1,T))*S,b=(f(y,T-1)-f(y,T+1))*S,C=1;const v=Math.hypot(R,b,C)||1;R/=v,b/=v,C/=v;const w=(T*i+y)*4;p.data[w]=Oi((R*.5+.5)*255),p.data[w+1]=Oi((b*.5+.5)*255),p.data[w+2]=Oi((C*.5+.5)*255),p.data[w+3]=255}g.context.putImageData(p,0,0),m.normal=h(g.canvas,fn)}return m}class vv{renderer;mesh;materials=new Map;textureBundles=new Map;constructor(e,t){this.renderer=e,this.mesh=t,this.applyQuality("auto","earth")}applyQuality(e,t){const n=e==="high"||e==="auto"&&t==="moon"?"high":e,s=this.materialFor(n);this.mesh.material!==s&&(this.mesh.material=s)}materialFor(e){const t=this.materials.get(e);if(t)return t;const n=e==="low"?{width:256,height:128,craters:48,normal:!1,bumpScale:.026}:e==="high"?{width:1024,height:512,craters:280,normal:!0,bumpScale:.09}:{width:512,height:256,craters:132,normal:!1,bumpScale:.06},s=_v(n.width,n.height,n.craters,n.normal),a=Math.min(e==="high"?12:6,this.renderer.capabilities.getMaxAnisotropy());s.albedo.anisotropy=a,s.height.anisotropy=a,s.normal&&(s.normal.anisotropy=a);const r=new jn({map:s.albedo,bumpMap:s.height,bumpScale:n.bumpScale,roughness:e==="high"?.94:.98,metalness:0,color:16777215});return r.userData.resourceOwner="moon-visual-system",s.normal&&(r.normalMap=s.normal,r.normalScale.set(.58,.58)),this.textureBundles.set(e,s),this.materials.set(e,r),r}dispose(){this.materials.forEach(e=>e.dispose()),this.textureBundles.forEach(e=>{e.albedo.dispose(),e.height.dispose(),e.normal?.dispose()}),this.materials.clear(),this.textureBundles.clear()}}const Rt=Math.PI*2,fr=1495978707e-1,xv=696340,Mv=384400/fr;function yv(i){let e=1831565813;const t=()=>(e=Math.imul(e^e>>>15,1|e),e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296);return Array.from({length:i},()=>({x:t(),y:t(),size:.4+t()*1.35,alpha:.24+t()*.72}))}function Sv(i){let e=5370206;const t=()=>(e=Math.imul(e^e>>>15,1|e),e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296);return Array.from({length:i},()=>({radiusAu:2.08+t()*1.22,angle:t()*Rt,vertical:(t()-.5)*.18,size:.45+t()*1.4,alpha:.25+t()*.5}))}function Ul(i){const e=Math.hypot(i.x,i.y)||1;return{x:i.x/e,y:i.y/e}}class Eu{context;canvas;drawing;parameters=Su(ea);viewport={width:1,height:1,pixelRatio:1};simulationDays=0;playing=!0;playbackRate=1;focusedObject="sun";viewMode="overview";animationFrame=0;destroyed=!1;lastFrame=performance.now();performanceWindowStartedAt=0;performanceWindowFrames=0;performanceWindowFrameMs=0;measuredFps=0;averageFrameMs=0;backgroundLayer;backgroundSignature="";stars=yv(420);asteroids=Sv(900);positionedPlanets=[];positionedMoon;dragging=!1;lastPointer={x:0,y:0};pointerDown={x:0,y:0};manualOffset={x:0,y:0};zoom=1;orbitCacheKey="";orbitPointCache=new Map;orbitPathCache=new Map;mission;missionState;mount(e,t){if(this.context=e,this.viewport=e.viewport,this.canvas=document.createElement("canvas"),this.canvas.className="solar-canvas canvas-fallback",this.canvas.setAttribute("aria-label","Interactive Canvas 2D solar system fallback with Earth Moon"),this.drawing=this.canvas.getContext("2d")??void 0,!this.drawing)throw new Error("Canvas 2D is unavailable.");t.prepend(this.canvas),this.canvas.addEventListener("pointerdown",this.handlePointerDown),this.canvas.addEventListener("pointermove",this.handlePointerMove),this.canvas.addEventListener("pointerup",this.handlePointerUp),this.canvas.addEventListener("pointercancel",this.handlePointerUp),this.canvas.addEventListener("wheel",this.handleWheel,{passive:!1}),this.resize(e.viewport),this.lastFrame=performance.now(),this.requestRender(),e.onStatus?.("Canvas 2D compatibility mode · Moon and asteroid belt enabled"),e.onFocusChange?.(this.focusedObject)}setParameters(e){const t=Vt(this.parameters),n=Mn(this.parameters,"showStars",!0),s=mt(this.parameters),a=Jn(this.parameters),r=Je(this.parameters,"distanceScale",1);this.parameters={...this.parameters,...e},this.playbackRate=ei(Je(this.parameters,"timeScale",this.playbackRate)),t!==Vt(this.parameters)&&this.resize(this.viewport),(s!==mt(this.parameters)||a!==Jn(this.parameters)||r!==Je(this.parameters,"distanceScale",1))&&(this.orbitCacheKey="",this.orbitPointCache.clear(),this.orbitPathCache.clear(),this.manualOffset={x:0,y:0},this.viewMode==="overview"?this.zoom=1:this.viewMode==="focus"&&this.focusObject(this.focusedObject)),(t!==Vt(this.parameters)||n!==Mn(this.parameters,"showStars",!0))&&(this.backgroundSignature=""),this.requestRender()}setPlaybackRate(e){this.playbackRate=ei(e),this.parameters={...this.parameters,timeScale:this.playbackRate}}setSimulationTime(e){this.simulationDays=Number.isFinite(e)?e:0,this.updateMissionState(),this.context?.onSimulationTime?.(this.simulationDays),this.requestRender()}async stepSimulation(e){const t=br(this.simulationDays,this.playbackRate,e,this.playing);return this.simulationDays=t.afterSimulationDays,this.lastFrame=performance.now(),this.updateMissionState(),this.context?.onSimulationTime?.(this.simulationDays),this.draw(),t}resize(e){if(this.viewport=e,!this.canvas)return;const t=Vt(this.parameters),s=Math.min(t==="low"?1:t==="high"?2:1.5,Math.max(1,e.pixelRatio||1));this.canvas.width=Math.max(1,Math.round(e.width*s)),this.canvas.height=Math.max(1,Math.round(e.height*s)),this.canvas.style.width=`${Math.max(1,e.width)}px`,this.canvas.style.height=`${Math.max(1,e.height)}px`,this.drawing?.setTransform(s,0,0,s,0,0),this.backgroundSignature="",this.requestRender()}play(){this.playing=!0,this.lastFrame=performance.now(),this.requestRender()}pause(){this.playing=!1}reset(){this.simulationDays=0,this.frameOverview()}zoomCamera(e){if(!Number.isFinite(e)||e<=0)return;this.viewMode==="overview"&&(this.viewMode="free");const t=mt(this.parameters)==="learning"?22:8e4;this.zoom=Math.max(.55,Math.min(t,this.zoom/e)),this.requestRender()}frameOverview(){this.viewMode="overview",this.focusedObject="sun",this.manualOffset={x:0,y:0},this.zoom=1,this.requestRender(),this.context?.onFocusChange?.("sun"),this.context?.onStatus?.("Framed whole solar system · Canvas 2D mode")}getViewDiagnostics(){return{cameraDistance:1/Math.max(1e-5,this.zoom),measuredFps:this.measuredFps,averageFrameMs:this.averageFrameMs,effectiveQuality:Vt(this.parameters),focusedObject:this.focusedObject,viewMode:this.viewMode,focusDecorationsHidden:this.viewMode==="focus"}}focusObject(e){if(!nd(e))return;this.viewMode="focus",this.focusedObject=e,this.manualOffset={x:0,y:0};const t=Math.max(1,this.viewport.width),n=Math.max(1,this.viewport.height),s=Jn(this.parameters)==="scientific"?Es(je,"scientific",Je(this.parameters,"distanceScale",1))*1.08:26.4,a=Math.min(t,n)*.43/s,r=e==="sun"?this.sunRadius():e===Ge.id?this.moonRadius():this.planetRadius(je.find(l=>l.id===e)??Wt)*(e==="saturn"?2.45:1),o=Math.min(t,n)*(e==="saturn"?.11:e==="sun"?.1:.09);this.zoom=Math.max(.55,Math.min(8e4,o/Math.max(1e-6,r*a))),this.requestRender(),this.context?.onFocusChange?.(e),this.context?.onStatus?.(`Focused on ${Kl(e)} · Canvas 2D mode`)}setMission(e){this.mission=e?.plan?{...e,realism:{...e.realism}}:void 0,e?.active&&(this.viewMode="free"),this.updateMissionState(),this.requestRender()}setMissionCamera(e,t=this.mission?.followDistance??"standard"){this.mission&&(this.mission={...this.mission,cameraMode:e,followDistance:t},this.requestRender(),this.context?.onStatus?.(`${e==="follow"?"Follow":"Free"} spacecraft camera active · Canvas 2D mode`))}getMissionState(){return this.missionState?{...this.missionState,positionAu:{...this.missionState.positionAu}}:void 0}getMissionDiagnostics(){return{active:!!this.mission?.active,planId:this.mission?.plan?.id,destinationId:this.mission?.plan?.destinationId,status:this.missionState?.status,progress:this.missionState?.progress??0,cameraMode:this.mission?.cameraMode,followDistance:this.mission?.followDistance,trajectoryPointCount:this.mission?.plan?.trajectory.length??0,renderer:"canvas-2d"}}createSnapshot(){return{protocolVersion:"1.0",templateId:ea.id,templateVersion:ea.version,parameters:{...this.parameters},simulationDays:this.simulationDays,seed:this.context?.seed??Mr,focusedObject:this.focusedObject,viewMode:this.viewMode,playing:this.playing,mission:this.mission,clock:{epochIso:yr,playbackRateDaysPerSecond:this.playbackRate,direction:this.playbackRate<0?-1:1,complexity:"basic"}}}restoreSnapshot(e){this.parameters={...this.parameters,...e.parameters},this.playbackRate=ei(e.clock?.playbackRateDaysPerSecond??Je(e.parameters,"timeScale",1)),this.simulationDays=e.simulationDays,this.playing=e.playing!==!1,this.setMission(e.mission);const t=e.focusedObject??"sun";e.viewMode==="overview"||!e.viewMode&&t==="sun"?this.frameOverview():this.focusObject(t),this.lastFrame=performance.now(),this.requestRender()}validate(){const e=!!(this.mission?.active&&!this.mission.plan?.valid);return{valid:Number.isFinite(this.simulationDays)&&!e,issues:[...e?[{severity:"error",code:"MISSION_PLAN_INVALID",message:this.mission?.plan?.rejectionReason??"The active mission plan is invalid."}]:[],{severity:"warning",code:"CANVAS_FALLBACK_ACTIVE",message:"WebGL is unavailable. The project is running with the Canvas 2D compatibility renderer."}]}}destroy(){this.destroyed=!0,cancelAnimationFrame(this.animationFrame),this.animationFrame=0,this.canvas?.removeEventListener("pointerdown",this.handlePointerDown),this.canvas?.removeEventListener("pointermove",this.handlePointerMove),this.canvas?.removeEventListener("pointerup",this.handlePointerUp),this.canvas?.removeEventListener("pointercancel",this.handlePointerUp),this.canvas?.removeEventListener("wheel",this.handleWheel),this.orbitPointCache.clear(),this.orbitPathCache.clear(),this.canvas?.remove()}requestRender=()=>{this.animationFrame||this.destroyed||(this.animationFrame=requestAnimationFrame(this.animate))};animate=(e=performance.now())=>{this.animationFrame=0;const t=e-this.lastFrame;if(this.playing&&t<30){this.requestRender();return}const n=Math.min(.1,Math.max(0,(e-this.lastFrame)/1e3));this.lastFrame=e;const s=br(this.simulationDays,this.playbackRate,n,this.playing);s.afterSimulationDays!==s.beforeSimulationDays&&(this.simulationDays=s.afterSimulationDays,this.updateMissionState(),this.context?.onSimulationTime?.(this.simulationDays));const a=performance.now();this.draw(),this.recordDrawPerformance(performance.now()-a,e),this.context?.onFrameRendered?.(),this.playing&&this.requestRender()};recordDrawPerformance(e,t){this.performanceWindowStartedAt===0&&(this.performanceWindowStartedAt=t),this.performanceWindowFrames+=1,this.performanceWindowFrameMs+=e;const n=t-this.performanceWindowStartedAt;n<2e3||(this.measuredFps=this.performanceWindowFrames/Math.max(.001,n/1e3),this.averageFrameMs=this.performanceWindowFrameMs/Math.max(1,this.performanceWindowFrames),this.performanceWindowStartedAt=t,this.performanceWindowFrames=0,this.performanceWindowFrameMs=0)}orbitPosition(e,t=this.simulationDays){const n=ki(e,t);return this.mapAu(n.x,n.z)}moonOrbitRadius(){return mt(this.parameters)==="learning"?tc(Ge,this.planetRadius(Wt)):Mv*1.05*Je(this.parameters,"distanceScale",1)}moonPosition(e=this.orbitPosition(Wt)){const t=Rr(Ge,this.simulationDays),n=this.moonOrbitRadius();return{x:e.x+Math.cos(t)*n,y:e.y+Math.sin(t)*n*Math.cos(Ge.inclinationDeg*Math.PI/180)}}moonIllumination(e,t){const n=Ul({x:t.x-e.x,y:t.y-e.y}),s=Ul({x:-e.x,y:-e.y}),a=n.x*s.x+n.y*s.y;return Math.max(.03,Math.min(1,(1-a)*.5))}mapAu(e,t){const n=Jl({x:e,y:0,z:t},Jn(this.parameters),Je(this.parameters,"distanceScale",1));return{x:n.x,y:n.z}}planetRadius(e){const t=mt(this.parameters),n=Je(this.parameters,"distanceScale",1);return t==="real-scale"?e.radiusKm/fr*1.05*n:t==="real-distance"?Ql(e,je,Je(this.parameters,"planetScale",1.15),n):Tr(e,Je(this.parameters,"planetScale",1.15))}moonRadius(){const e=mt(this.parameters),t=Je(this.parameters,"distanceScale",1);return e==="real-scale"?Ge.radiusKm/fr*1.05*t:e==="real-distance"?ec(Ge,this.planetRadius(Wt),t):sa(Ge,this.planetRadius(Wt))}sunRadius(){const e=mt(this.parameters),t=Je(this.parameters,"distanceScale",1);return e==="real-scale"?xv/fr*1.05*t:e==="real-distance"?Ar(je,t):1.35}draw(){const e=this.drawing;if(!e)return;const t=Math.max(1,this.viewport.width),n=Math.max(1,this.viewport.height);e.clearRect(0,0,t,n),this.drawCachedBackground(e,t,n);const s=Wt,a=this.orbitPosition(s),r=this.moonPosition(a);this.updateMissionState();let o={x:0,y:0};this.mission?.active&&this.mission.cameraMode==="follow"&&this.missionState?o=this.mapMissionAu(this.missionState.positionAu):this.focusedObject===Ge.id?o=r:this.focusedObject!=="sun"&&(o=this.orbitPosition(je.find(p=>p.id===this.focusedObject)??je[0]));const l=Jn(this.parameters)==="scientific"?Es(je,"scientific",Je(this.parameters,"distanceScale",1))*1.08:26.4,h=Math.min(t,n)*.43/l*this.zoom,d={x:t*.5-o.x*h+this.manualOffset.x,y:n*.52-o.y*h+this.manualOffset.y};this.viewMode!=="focus"&&(this.drawAsteroidBelt(e,d,h),Mn(this.parameters,"showOrbits",!0)&&this.drawOrbits(e,d,h,a),this.drawMissionTrajectory(e,d,h)),this.positionedPlanets=je.map(p=>{const f=this.orbitPosition(p);return{planet:p,world:f,screen:{x:d.x+f.x*h,y:d.y+f.y*h},radius:mt(this.parameters)==="learning"?Math.max(2.2,this.planetRadius(p)*h):mt(this.parameters)==="real-scale"?Math.max(.32,this.planetRadius(p)*h):Math.max(.12,this.planetRadius(p)*h)}});const u=this.positionedPlanets.find(p=>p.planet.id==="earth");this.positionedMoon={world:r,screen:{x:d.x+r.x*h,y:d.y+r.y*h},radius:mt(this.parameters)==="learning"?Math.max(1.9,sa(Ge,u.radius)):mt(this.parameters)==="real-scale"?Math.max(.3,this.moonRadius()*h):Math.max(.1,this.moonRadius()*h),illumination:this.moonIllumination(a,r)};const m=mt(this.parameters)==="learning"?Math.max(11,this.sunRadius()*h):mt(this.parameters)==="real-scale"?Math.max(.55,this.sunRadius()*h):Math.max(.35,this.sunRadius()*h);(this.viewMode!=="focus"||this.focusedObject==="sun")&&this.drawSun(e,d,m);const x=(this.viewMode==="focus"?this.positionedPlanets.filter(p=>p.planet.id===this.focusedObject):this.positionedPlanets).map(p=>({y:p.screen.y,draw:()=>this.drawPlanet(e,p)}));(this.viewMode!=="focus"||this.focusedObject===Ge.id)&&x.push({y:this.positionedMoon.screen.y,draw:()=>this.drawMoon(e,this.positionedMoon,d)}),x.sort((p,f)=>p.y-f.y).forEach(p=>p.draw()),this.drawSpacecraft(e,d,h)}drawCachedBackground(e,t,n){const s=`${Math.round(t)}:${Math.round(n)}:${Mn(this.parameters,"showStars",!0)}`;if(!this.backgroundLayer||this.backgroundSignature!==s){this.backgroundLayer=document.createElement("canvas"),this.backgroundLayer.width=Math.max(1,Math.round(t)),this.backgroundLayer.height=Math.max(1,Math.round(n));const a=this.backgroundLayer.getContext("2d");if(a){const r=a.createRadialGradient(t*.5,n*.45,0,t*.5,n*.45,Math.max(t,n)*.72);r.addColorStop(0,"#07152a"),r.addColorStop(.5,"#030914"),r.addColorStop(1,"#01030a"),a.fillStyle=r,a.fillRect(0,0,t,n),Mn(this.parameters,"showStars",!0)&&this.drawStars(a,t,n)}this.backgroundSignature=s}this.backgroundLayer&&e.drawImage(this.backgroundLayer,0,0,t,n)}updateMissionState(){const e=this.mission,t=e?.plan;this.missionState=t?pa.stateAt(t,e.active?this.simulationDays:Math.min(this.simulationDays,t.departureSimulationDays)):void 0}mapMissionAu(e){return this.mapAu(e.x,e.z)}drawMissionTrajectory(e,t,n){const s=this.mission?.plan;s?.trajectory.length&&(e.save(),e.strokeStyle=s.valid?"rgba(99,212,255,0.78)":"rgba(255,120,109,0.54)",e.lineWidth=1.5,e.setLineDash([5,4]),e.beginPath(),s.trajectory.forEach((a,r)=>{const o=this.mapMissionAu(a.positionAu),l=t.x+o.x*n,c=t.y+o.y*n;r===0?e.moveTo(l,c):e.lineTo(l,c)}),e.stroke(),e.restore())}drawSpacecraft(e,t,n){if(!this.missionState||!this.mission?.plan)return;const s=this.mapMissionAu(this.missionState.positionAu),a=t.x+s.x*n,r=t.y+s.y*n;if(a<-24||a>this.viewport.width+24||r<-24||r>this.viewport.height+24)return;const o=this.mission.cameraMode==="follow"?9:6;e.save(),e.translate(a,r);const l=Math.min(this.mission.plan.trajectory.length-1,Math.ceil((this.missionState.progress+.01)*(this.mission.plan.trajectory.length-1))),c=this.mapMissionAu(this.mission.plan.trajectory[l].positionAu);e.rotate(Math.atan2(c.y-s.y,c.x-s.x)),e.strokeStyle="#63d4ff",e.fillStyle="#d6e1ee",e.lineWidth=1.2,e.beginPath(),e.moveTo(o,0),e.lineTo(-o*.72,o*.48),e.lineTo(-o*.45,0),e.lineTo(-o*.72,-o*.48),e.closePath(),e.fill(),e.stroke(),e.fillStyle="#245ea8",e.fillRect(-o*.35,-o*1.05,o*.25,o*2.1),e.restore(),this.drawLabel(e,`Probe · ${Math.round(this.missionState.progress*100)}%`,a,r-o-10)}drawStars(e,t,n){e.save(),this.stars.forEach(s=>{e.globalAlpha=s.alpha,e.fillStyle=s.x>.72?"#ffe9c5":"#cde4ff",e.beginPath(),e.arc(s.x*t,s.y*n,s.size,0,Rt),e.fill()}),e.restore()}drawAsteroidBelt(e,t,n){const s=Vt(this.parameters),a=s==="low"?160:s==="high"?900:420;e.save();for(let r=0;r<a;r+=1){const o=this.asteroids[r],l=o.angle+this.simulationDays*8e-5,c=this.mapAu(Math.cos(l)*o.radiusAu,Math.sin(l)*o.radiusAu),h=t.x+c.x*n,d=t.y+(c.y+o.vertical)*n;h<-4||h>this.viewport.width+4||d<-4||d>this.viewport.height+4||(e.globalAlpha=o.alpha*(s==="low"?.7:1),e.fillStyle=r%3===0?"#b7a384":"#827565",e.beginPath(),e.arc(h,d,Math.max(.45,o.size*Math.min(1.35,n*.11)),0,Rt),e.fill())}e.restore()}orbitPointsFor(e){const t=`${mt(this.parameters)}:${Jn(this.parameters)}:${Je(this.parameters,"distanceScale",1)}`;t!==this.orbitCacheKey&&(this.orbitCacheKey=t,this.orbitPointCache.clear(),this.orbitPathCache.clear());const n=this.orbitPointCache.get(e.id);if(n)return n;const s=Array.from({length:161},(a,r)=>{const o=wr(e,r/160*Rt);return this.mapAu(o.x,o.z)});return this.orbitPointCache.set(e.id,s),s}drawOrbits(e,t,n,s){e.save(),e.strokeStyle="rgba(109,139,173,0.25)",e.translate(t.x,t.y),e.scale(n,n),e.lineWidth=1/Math.max(1e-5,n),je.forEach(o=>{let l=this.orbitPathCache.get(o.id);l||(l=new Path2D,this.orbitPointsFor(o).forEach((c,h)=>{h===0?l?.moveTo(c.x,c.y):l?.lineTo(c.x,c.y)}),l.closePath(),this.orbitPathCache.set(o.id,l)),e.stroke(l)}),e.restore();const a=this.moonOrbitRadius()*n,r={x:t.x+s.x*n,y:t.y+s.y*n};e.strokeStyle="rgba(190,207,225,0.34)",e.beginPath(),e.ellipse(r.x,r.y,a,a*Math.cos(Ge.inclinationDeg*Math.PI/180),0,0,Rt),e.stroke()}drawSun(e,t,n){const s=e.createRadialGradient(t.x,t.y,n*.2,t.x,t.y,n*3.2);s.addColorStop(0,"rgba(255,245,184,0.72)"),s.addColorStop(.32,"rgba(255,167,42,0.24)"),s.addColorStop(1,"rgba(255,95,12,0)"),e.fillStyle=s,e.beginPath(),e.arc(t.x,t.y,n*3.2,0,Rt),e.fill();const a=e.createRadialGradient(t.x-n*.3,t.y-n*.34,n*.1,t.x,t.y,n);a.addColorStop(0,"#fff3a2"),a.addColorStop(.55,"#ffc342"),a.addColorStop(1,"#e96c13"),e.fillStyle=a,e.beginPath(),e.arc(t.x,t.y,n,0,Rt),e.fill(),this.shouldDrawLabel("sun")&&this.drawLabel(e,"Sun",t.x,t.y-n-8)}drawPlanet(e,t){const{planet:n,screen:s,radius:a}=t;if(s.x+a*3<0||s.x-a*3>this.viewport.width||s.y+a*3<0||s.y-a*3>this.viewport.height)return;e.save(),n.id==="saturn"&&this.drawSaturnRings(e,s,a,!0),e.beginPath(),e.arc(s.x,s.y,a,0,Rt),e.clip();const r={mercury:["#c6c0b8","#655f5a"],venus:["#ffe2a1","#a86128"],earth:["#58b5ff","#092d75"],mars:["#e27a47","#6e261c"],jupiter:["#f0d6ae","#8f5c48"],saturn:["#f1dba6","#a78355"],uranus:["#b8ece7","#4dabbc"],neptune:["#5294f3","#142f8f"]},[o,l]=r[n.id]??["#ddd","#555"],c=e.createRadialGradient(s.x-a*.36,s.y-a*.38,a*.08,s.x,s.y,a*1.12);c.addColorStop(0,o),c.addColorStop(.62,o),c.addColorStop(1,l),e.fillStyle=c,e.fillRect(s.x-a,s.y-a,a*2,a*2),n.id==="earth"?this.drawEarthDetail(e,s,a):n.id==="jupiter"||n.id==="saturn"?this.drawGasBands(e,s,a,n.id==="jupiter"):n.id==="mercury"||n.id==="mars"?this.drawRockyDetail(e,s,a,n.id):n.id==="venus"?this.drawVenusClouds(e,s,a):n.id==="neptune"?(this.drawSoftBands(e,s,a),this.drawNeptuneStorm(e,s,a)):this.drawSoftBands(e,s,a),e.restore(),n.id==="saturn"&&this.drawSaturnRings(e,s,a,!1),["venus","earth","mars","uranus","neptune"].includes(n.id)&&this.drawAtmosphere(e,s,a,n.id),mt(this.parameters)!=="learning"&&a<2&&this.drawLocator(e,s,a),this.shouldDrawLabel(n.id)&&this.drawLabel(e,n.name,s.x,s.y-Math.max(a,4)-7)}drawMoon(e,t,n){const{screen:s,radius:a,illumination:r}=t;if(s.x+a*2<0||s.x-a*2>this.viewport.width||s.y+a*2<0||s.y-a*2>this.viewport.height)return;const o=Ul({x:n.x-s.x,y:n.y-s.y});e.save(),e.beginPath(),e.arc(s.x,s.y,a,0,Rt),e.clip(),e.fillStyle="#17191b",e.fillRect(s.x-a,s.y-a,a*2,a*2);const l={x:s.x-o.x*a,y:s.y-o.y*a},c={x:s.x+o.x*a,y:s.y+o.y*a},h=e.createLinearGradient(l.x,l.y,c.x,c.y),d=Math.max(.03,Math.min(.97,1-r));h.addColorStop(0,"rgba(24,25,26,0.96)"),h.addColorStop(Math.max(0,d-.18),"rgba(37,38,39,0.92)"),h.addColorStop(d,"rgba(145,143,138,0.82)"),h.addColorStop(Math.min(1,d+.24),"rgba(220,216,205,0.96)"),h.addColorStop(1,"rgba(242,238,226,1)"),e.fillStyle=h,e.fillRect(s.x-a,s.y-a,a*2,a*2);const u=e.createRadialGradient(s.x+o.x*a*.35,s.y+o.y*a*.35,a*.04,s.x,s.y,a);u.addColorStop(0,`rgba(255,252,239,${.18+r*.34})`),u.addColorStop(1,"rgba(60,60,58,0.12)"),e.fillStyle=u,e.fillRect(s.x-a,s.y-a,a*2,a*2),this.drawMoonCraters(e,s,a),e.restore(),e.strokeStyle="rgba(236,239,243,0.24)",e.lineWidth=Math.max(.55,a*.025),e.beginPath(),e.arc(s.x,s.y,a,0,Rt),e.stroke(),mt(this.parameters)!=="learning"&&a<2&&this.drawLocator(e,s,a),this.shouldDrawLabel(Ge.id)&&this.drawLabel(e,Ge.name,s.x,s.y-Math.max(a,4)-7)}drawLocator(e,t,n){e.save(),e.strokeStyle="rgba(99,212,255,0.74)",e.lineWidth=1,e.setLineDash([3,3]),e.beginPath(),e.arc(t.x,t.y,Math.max(4.5,n*3.5),0,Rt),e.stroke(),e.restore()}drawMoonCraters(e,t,n){const s=Vt(this.parameters)==="low"?9:Vt(this.parameters)==="high"?22:15;for(let a=0;a<s;a+=1){const r=a*2.399963,o=n*(.16+a*31%67/100),l=t.x+Math.cos(r)*o,c=t.y+Math.sin(r)*o,h=Math.max(.55,n*(.035+a%4*.014)),d=e.createRadialGradient(l-h*.22,c-h*.22,h*.08,l,c,h);d.addColorStop(0,"rgba(245,242,231,0.34)"),d.addColorStop(.52,"rgba(69,68,66,0.28)"),d.addColorStop(.78,"rgba(24,24,23,0.44)"),d.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=d,e.beginPath(),e.arc(l,c,h,0,Rt),e.fill()}}drawEarthDetail(e,t,n){e.fillStyle="#4c9c52",[[-.35,-.22,.28],[.18,.04,.3],[.42,-.33,.16],[-.12,.42,.2]].forEach(([s,a,r])=>{e.beginPath(),e.ellipse(t.x+s*n,t.y+a*n,n*r,n*r*.58,s,0,Rt),e.fill()}),e.strokeStyle="rgba(255,255,255,0.72)",e.lineWidth=Math.max(.7,n*.065);for(let s=-1;s<=1;s+=1)e.beginPath(),e.arc(t.x+s*n*.18,t.y-s*n*.2,n*.72,.2,2.5),e.stroke()}drawGasBands(e,t,n,s){const a=s?15:18;for(let r=0;r<a;r+=1){const o=r/(a-1),l=t.y-n+o*n*2,c=r%3===0,h=r%3===1;e.fillStyle=c?s?"rgba(255,238,205,0.34)":"rgba(255,239,196,0.28)":h?s?"rgba(105,52,38,0.29)":"rgba(113,83,54,0.2)":"rgba(210,156,104,0.18)",e.fillRect(t.x-n,l,n*2,Math.max(.7,n*.1))}if(s){const r=e.createRadialGradient(t.x+n*.3,t.y+n*.26,n*.025,t.x+n*.35,t.y+n*.3,n*.27);r.addColorStop(0,"rgba(244,154,111,0.92)"),r.addColorStop(.5,"rgba(174,62,43,0.9)"),r.addColorStop(1,"rgba(105,47,41,0.14)"),e.fillStyle=r,e.beginPath(),e.ellipse(t.x+n*.35,t.y+n*.3,n*.29,n*.14,-.08,0,Rt),e.fill()}}drawSoftBands(e,t,n){e.strokeStyle="rgba(255,255,255,0.13)",e.lineWidth=Math.max(.6,n*.05);for(let s=-2;s<=2;s+=1)e.beginPath(),e.ellipse(t.x,t.y+s*n*.22,n,n*.15,0,0,Rt),e.stroke()}drawRockyDetail(e,t,n,s){if(this.drawRockCraters(e,t,n,s==="mercury"?12:8),s==="mars"){e.fillStyle="rgba(91,34,24,0.24)",[[-.34,-.18,.28,.13,-.25],[.24,.06,.34,.12,.18],[-.12,.42,.25,.1,-.08]].forEach(([o,l,c,h,d])=>{e.beginPath(),e.ellipse(t.x+o*n,t.y+l*n,c*n,h*n,d,0,Rt),e.fill()});const r=e.createLinearGradient(t.x,t.y-n,t.x,t.y+n);r.addColorStop(0,"rgba(250,239,222,0.92)"),r.addColorStop(.18,"rgba(250,239,222,0)"),r.addColorStop(.82,"rgba(238,224,209,0)"),r.addColorStop(1,"rgba(238,224,209,0.78)"),e.fillStyle=r,e.fillRect(t.x-n,t.y-n,n*2,n*2)}}drawVenusClouds(e,t,n){for(let s=-4;s<=4;s+=1){const a=t.y+s*n*.19;e.strokeStyle=`rgba(255,239,190,${.09+(4-Math.abs(s))*.025})`,e.lineWidth=Math.max(.55,n*.055),e.beginPath(),e.moveTo(t.x-n,a),e.bezierCurveTo(t.x-n*.35,a-n*.13,t.x+n*.28,a+n*.12,t.x+n,a-n*.035),e.stroke()}}drawNeptuneStorm(e,t,n){const s=e.createRadialGradient(t.x+n*.3,t.y+n*.08,n*.02,t.x+n*.36,t.y+n*.12,n*.27);s.addColorStop(0,"rgba(4,13,66,0.76)"),s.addColorStop(.68,"rgba(12,32,107,0.58)"),s.addColorStop(1,"rgba(25,69,169,0)"),e.fillStyle=s,e.beginPath(),e.ellipse(t.x+n*.36,t.y+n*.12,n*.3,n*.12,-.12,0,Rt),e.fill()}drawRockCraters(e,t,n,s){for(let a=0;a<s;a+=1){const r=a*2.399,o=n*(.18+a*37%61/100),l=t.x+Math.cos(r)*o,c=t.y+Math.sin(r)*o,h=Math.max(.8,n*(.045+a%3*.018));e.fillStyle="rgba(35,25,20,0.25)",e.beginPath(),e.arc(l,c,h,0,Rt),e.fill()}}drawSaturnRings(e,t,n,s){e.save(),e.translate(t.x,t.y),e.rotate(-.25),e.scale(1,.34),[[2.4,.12,"rgba(151,126,87,0.3)","rgba(244,224,181,0.62)"],[2.23,.13,"rgba(181,151,99,0.4)","rgba(235,207,153,0.76)"],[2.03,.1,"rgba(132,107,75,0.3)","rgba(210,180,132,0.62)"],[1.86,.045,"rgba(42,33,29,0.56)","rgba(48,37,31,0.74)"],[1.72,.09,"rgba(168,139,93,0.32)","rgba(226,202,157,0.68)"],[1.55,.07,"rgba(129,105,76,0.26)","rgba(194,169,128,0.55)"]].forEach(([r,o,l,c])=>{e.lineWidth=Math.max(.45,n*o),e.strokeStyle=s?l:c,e.beginPath(),s?e.ellipse(0,0,n*r,n*r,0,Math.PI,Rt):e.ellipse(0,0,n*r,n*r,0,0,Math.PI),e.stroke()}),e.restore()}drawAtmosphere(e,t,n,s){const a={venus:"255,190,89",earth:"72,170,255",mars:"224,116,69",uranus:"140,236,255",neptune:"57,124,255"},r=e.createRadialGradient(t.x,t.y,n*.78,t.x,t.y,n*1.2);r.addColorStop(0,`rgba(${a[s]??"100,150,255"},0)`),r.addColorStop(.75,`rgba(${a[s]??"100,150,255"},0.16)`),r.addColorStop(1,`rgba(${a[s]??"100,150,255"},0)`),e.fillStyle=r,e.beginPath(),e.arc(t.x,t.y,n*1.2,0,Rt),e.fill()}drawLabel(e,t,n,s){e.save(),e.font="10px Inter, system-ui, sans-serif",e.textAlign="center",e.textBaseline="middle";const a=e.measureText(t).width+12;e.fillStyle="rgba(4,11,20,0.82)",e.strokeStyle="rgba(255,255,255,0.16)",e.lineWidth=1,e.beginPath(),e.roundRect(n-a/2,s-8,a,16,8),e.fill(),e.stroke(),e.fillStyle="#e9f3ff",e.fillText(t,n,s),e.restore()}shouldDrawLabel(e){return Mn(this.parameters,"showLabels",!0)?this.viewMode==="focus"?e===this.focusedObject:this.viewport.width>=1e3?!0:["sun","earth","jupiter","saturn","uranus","neptune"].includes(e):!1}handlePointerDown=e=>{this.canvas&&(this.viewMode==="overview"&&(this.viewMode="free"),this.dragging=!0,this.lastPointer={x:e.clientX,y:e.clientY},this.pointerDown={...this.lastPointer},this.canvas.setPointerCapture(e.pointerId))};handlePointerMove=e=>{this.dragging&&(this.manualOffset.x+=e.clientX-this.lastPointer.x,this.manualOffset.y+=e.clientY-this.lastPointer.y,this.lastPointer={x:e.clientX,y:e.clientY},this.requestRender())};handlePointerUp=e=>{if(!this.canvas)return;const t=Math.hypot(e.clientX-this.pointerDown.x,e.clientY-this.pointerDown.y)>4;if(this.dragging=!1,t)return;const n=this.canvas.getBoundingClientRect(),s={x:e.clientX-n.left,y:e.clientY-n.top},a=this.positionedMoon;if(a&&Math.hypot(s.x-a.screen.x,s.y-a.screen.y)<=a.radius*1.8){this.focusObject(Ge.id);return}const r=this.positionedPlanets.slice().reverse().find(o=>Math.hypot(s.x-o.screen.x,s.y-o.screen.y)<=o.radius*1.5);r&&this.focusObject(r.planet.id)};handleWheel=e=>{e.preventDefault(),this.viewMode==="overview"&&(this.viewMode="free");const t=mt(this.parameters)==="real-scale"?12e4:9;this.zoom=Math.max(.55,Math.min(t,this.zoom*Math.exp(-e.deltaY*.001))),this.requestRender()}}const Ht=Math.PI*2;function pi(i){return Math.max(0,Math.min(255,Math.round(i)))}function Kt(i,e,t){const n=Math.max(0,Math.min(1,t));return{r:i.r+(e.r-i.r)*n,g:i.g+(e.g-i.g)*n,b:i.b+(e.b-i.b)*n}}function mi(i){let e=2166136261;for(let t=0;t<i.length;t+=1)e^=i.charCodeAt(t),e=Math.imul(e,16777619);return e>>>0}function bv(i){let e=i>>>0;return()=>{e+=1831565813;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function Dn(i,e,t){const n=t%997/997,s=Math.sin((i*3+n)*Ht+Math.sin(e*Ht*2.1)*1.7),a=Math.sin((i*8-n*2)*Ht+e*Ht*5.3)*.5,r=Math.cos((i*17+n*4)*Ht-e*Ht*11.7)*.25,o=Math.sin((i*31-n)*Ht+e*Ht*23.9)*.125;return(s+a+r+o)/1.875}function pr(i,e,t,n=Ot){const s=document.createElement("canvas");s.width=i,s.height=e;const a=s.getContext("2d",{willReadFrequently:!0});if(!a)throw new Error("Canvas 2D is unavailable for procedural planet textures.");t(a,s);const r=new nr(s);return r.colorSpace=n,r.wrapS=Ti,r.wrapT=en,r.minFilter=un,r.magFilter=wt,r.generateMipmaps=!0,r.needsUpdate=!0,r}function Ln(i,e,t){return pr(i,e,n=>{const s=n.createImageData(i,e);for(let a=0;a<e;a+=1){const r=a/Math.max(1,e-1);for(let o=0;o<i;o+=1){const l=o/Math.max(1,i-1),c=t(l,r,o,a),h=(a*i+o)*4;s.data[h]=pi(c.r),s.data[h+1]=pi(c.g),s.data[h+2]=pi(c.b),s.data[h+3]=255}}n.putImageData(s,0,0)})}function wu(i,e,t,n,s){const a=bv(n);for(let r=0;r<s;r+=1){const o=a()*e,l=a()*t,c=1.5+a()*Math.min(e,t)*.035,h=i.createRadialGradient(o-c*.25,l-c*.25,c*.1,o,l,c);h.addColorStop(0,"rgba(245,240,225,0.16)"),h.addColorStop(.45,"rgba(25,22,20,0.16)"),h.addColorStop(.72,"rgba(0,0,0,0.28)"),h.addColorStop(1,"rgba(255,255,255,0)"),i.fillStyle=h,i.beginPath(),i.arc(o,l,c,0,Ht),i.fill()}}function Ev(){const i=mi("mercury"),e=Ln(768,384,(s,a)=>{const r=Dn(s,a,i),o=Math.abs(a-.5)*2,l=134+r*31-o*8;return{r:l+9,g:l+6,b:l+2}}),t=e.image,n=t.getContext("2d");return n&&wu(n,t.width,t.height,i,115),e.needsUpdate=!0,e}function wv(){return Ln(768,384,(i,e)=>{const t=Math.sin((e*5.5+Math.sin(i*Ht)*.12)*Ht)*.5+.5,n=Math.sin((i*2.2+e*1.4)*Ht)*.5+.5,s=Kt({r:197,g:132,b:62},{r:247,g:213,b:139},t*.34+.42);return Kt(s,{r:255,g:235,b:184},n*.08)})}function Tv(){const i=mi("earth");return Ln(1024,512,(e,t)=>{const n=Math.abs(t-.5)*2,s=Dn(e,t,i)+Dn(e*2.1%1,t*1.7,i+17)*.38,a=Math.max(0,(n-.82)/.18);if(a>.08)return Kt({r:188,g:218,b:229},{r:250,g:252,b:248},a);const r=.16+Math.sin(t*Math.PI)*.04;if(s>r){const l=Math.max(0,Math.min(1,(s-r)*2.3)),c=Kt({r:42,g:104,b:52},{r:137,g:117,b:66},n*.75+l*.25);return Kt(c,{r:207,g:194,b:156},l*.42)}const o=Math.max(0,Math.min(1,(r-s)*1.7));return Kt({r:27,g:107,b:178},{r:4,g:31,b:91},o)})}function Av(){const i=mi("mars"),e=Ln(768,384,(s,a)=>{const r=Dn(s,a,i),o=Math.abs(a-.5)*2,l=Kt({r:93,g:37,b:24},{r:208,g:105,b:62},r*.32+.58);return o>.9?Kt(l,{r:235,g:221,b:205},(o-.9)*7.5):l}),t=e.image,n=t.getContext("2d");return n&&wu(n,t.width,t.height,i,48),e.needsUpdate=!0,e}function Rv(){const i=Ln(1024,512,(n,s)=>{const a=Math.sin(n*Ht*2)*.018+Math.sin(n*Ht*5)*.007,r=Math.sin((s+a)*Math.PI*22),o=Math.sin((s-a*.45)*Math.PI*48)*.18,l=r*.44+o,c={r:226,g:209,b:181},h={r:190,g:139,b:99},d={r:164,g:147,b:132};return l>=0?Kt(c,h,Math.min(.52,l*.5)):Kt(c,d,Math.min(.28,-l*.32))}),e=i.image,t=e.getContext("2d");if(t){t.save(),t.translate(e.width*.72,e.height*.63),t.rotate(-.08);const n=t.createRadialGradient(0,0,4,0,0,58);n.addColorStop(0,"rgba(178,68,47,0.95)"),n.addColorStop(.55,"rgba(174,78,53,0.85)"),n.addColorStop(1,"rgba(127,77,61,0)"),t.fillStyle=n,t.scale(1.8,.72),t.beginPath(),t.arc(0,0,52,0,Ht),t.fill(),t.restore()}return i.needsUpdate=!0,i}function Cv(){const i=mi("saturn");return Ln(1024,512,(e,t)=>{const n=Dn(e,t*1.25,i)*.06,s=Math.sin((t*46+n)*Math.PI)*.5+.5,a=Math.sin((t*122-n)*Math.PI)*.5+.5,r=Kt({r:188,g:156,b:104},{r:239,g:218,b:163},s*.65+.2);return Kt(r,{r:139,g:112,b:82},a*.11)})}function Pv(){const i=mi("uranus");return Ln(768,384,(e,t)=>{const n=Math.sin((t*24+Dn(e,t,i)*.08)*Math.PI)*.5+.5;return Kt({r:91,g:181,b:194},{r:187,g:231,b:224},n*.22+.2)})}function Dv(){const i=mi("neptune"),e=Ln(768,384,(s,a)=>{const r=Dn(s,a*1.8,i),o=Math.sin((a*31+r*.12)*Math.PI)*.5+.5;return Kt({r:22,g:55,b:145},{r:66,g:126,b:221},o*.42+.2)}),t=e.image,n=t.getContext("2d");return n&&(n.fillStyle="rgba(19,31,89,0.72)",n.beginPath(),n.ellipse(t.width*.68,t.height*.55,42,16,-.12,0,Ht),n.fill()),e.needsUpdate=!0,e}function Lv(i){switch(i){case"mercury":return Ev();case"venus":return wv();case"earth":return Tv();case"mars":return Av();case"jupiter":return Rv();case"saturn":return Cv();case"uranus":return Pv();case"neptune":return Dv();default:return Ln(512,256,()=>({r:180,g:180,b:180}))}}function Iv(i){const e=mi(`${i}-bump`);return Ln(512,256,(t,n)=>{const s=Dn(t,n,e)*.5+.5,a=i==="mercury"||i==="mars"?.82:i==="earth"?.58:.3,r=128+(s-.5)*255*a;return{r,g:r,b:r}})}function Nv(){const i=mi("earth-clouds");return pr(1024,512,(e,t)=>{const n=e.createImageData(t.width,t.height);for(let s=0;s<t.height;s+=1){const a=s/Math.max(1,t.height-1);for(let r=0;r<t.width;r+=1){const o=r/Math.max(1,t.width-1),l=Dn((o+a*.07)%1,a*1.3,i)*.68+Dn(o*2,a*2,i+31)*.32,c=Math.max(0,Math.min(1,(l-.18)*2.15)),h=(s*t.width+r)*4;n.data[h]=246,n.data[h+1]=250,n.data[h+2]=255,n.data[h+3]=pi(c*205)}}e.putImageData(n,0,0)})}function Uv(){return pr(1024,1024,(i,e)=>{i.clearRect(0,0,e.width,e.height);const t=e.width/2,n=i.createImageData(e.width,e.height);for(let s=0;s<e.height;s+=1)for(let a=0;a<e.width;a+=1){const r=(a-t)/t,o=(s-t)/t,c=(Math.sqrt(r*r+o*o)-.49)/.43,h=(s*e.width+a)*4;if(c<0||c>1)continue;const d=Math.sin(c*118*Math.PI)*.5+.5,u=Math.sin(c*17*Math.PI)*.5+.5,m=c>.52&&c<.61?.18:1,g=(.32+d*.45+u*.18)*m,x=Kt({r:137,g:113,b:76},{r:235,g:214,b:170},u*.65+d*.22);n.data[h]=pi(x.r),n.data[h+1]=pi(x.g),n.data[h+2]=pi(x.b),n.data[h+3]=pi(g*255)}i.putImageData(n,0,0)})}function Fv(){return pr(512,512,(i,e)=>{const t=e.width/2,n=i.createRadialGradient(t,t,0,t,t,t);n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.12,"rgba(255,244,190,0.92)"),n.addColorStop(.32,"rgba(255,167,42,0.48)"),n.addColorStop(.62,"rgba(255,101,18,0.12)"),n.addColorStop(1,"rgba(255,80,10,0)"),i.fillStyle=n,i.fillRect(0,0,e.width,e.height)})}function Ov(i,e=.7,t=2.35){return new xn({uniforms:{glowColor:{value:new ze(i)},glowStrength:{value:e},rimPower:{value:t}},vertexShader:`
      varying float vIntensity;
      uniform float rimPower;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vec3 transformedNormal = normalize(normalMatrix * normal);
        vec3 viewDirection = normalize(-mvPosition.xyz);
        vIntensity = pow(max(0.0, 1.0 - dot(transformedNormal, viewDirection)), rimPower);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,fragmentShader:`
      uniform vec3 glowColor;
      uniform float glowStrength;
      varying float vIntensity;
      void main() {
        gl_FragColor = vec4(glowColor, clamp(vIntensity * glowStrength, 0.0, 1.0));
      }
    `,transparent:!0,side:Xt,blending:ga,depthWrite:!1,toneMapped:!1})}function Bv(i,e){const t=[],n=[],s=Math.min(8,i.capabilities.getMaxAnisotropy()),a=new Map,r=new Map;e.forEach(x=>{const p=Lv(x.id);p.anisotropy=s,t.push(p);const f=new jn({map:p,color:16777215,roughness:x.id==="earth"?.74:x.id==="venus"?.93:x.id==="jupiter"||x.id==="saturn"?.86:.8,metalness:0});if((x.id==="venus"||x.id==="jupiter"||x.id==="saturn")&&(f.emissiveMap=p,f.emissive.setHex(16777215),f.emissiveIntensity=x.id==="venus"?.5:x.id==="jupiter"?.48:.42),x.id==="mercury"||x.id==="earth"||x.id==="mars"){const S=Iv(x.id);S.colorSpace=fn,S.anisotropy=s,t.push(S),f.bumpMap=S,f.bumpScale=x.id==="mercury"?.085:x.id==="mars"?.055:.025}a.set(x.id,f),n.push(f)});const o=Nv();o.anisotropy=s,t.push(o);const l=new jn({map:o,transparent:!0,opacity:.83,depthWrite:!1,roughness:1,metalness:0,alphaTest:.035});n.push(l);const c=Uv();c.anisotropy=s,t.push(c);const h=new jn({map:c,transparent:!0,alphaTest:.025,opacity:.94,side:on,roughness:.92,metalness:0,depthWrite:!1});n.push(h),Object.entries({venus:{color:16761709,strength:.78,power:2.2},earth:{color:4762367,strength:.86,power:2.35},mars:{color:14711109,strength:.48,power:2.5},jupiter:{color:16763037,strength:.43,power:2.55},saturn:{color:15914400,strength:.36,power:2.65},uranus:{color:9235711,strength:.5,power:2.45},neptune:{color:3767551,strength:.62,power:2.35}}).forEach(([x,p])=>{const f=Ov(p.color,p.strength,p.power);r.set(x,f),n.push(f)});const u=new Ys({color:16764759,toneMapped:!1});n.push(u);const m=Fv();t.push(m);const g=new fh({map:m,color:16751407,transparent:!0,opacity:.92,blending:ga,depthWrite:!1,toneMapped:!1});return n.push(g),n.forEach(x=>{x.userData.resourceOwner="solar-visual-assets"}),{planetMaterials:a,atmosphereMaterials:r,earthCloudMaterial:l,saturnRingMaterial:h,sunMaterial:u,sunHaloMaterial:g,dispose(){t.forEach(x=>x.dispose()),n.forEach(x=>x.dispose())}}}const In={mercury:"mercury.jpg",venusSurface:"venus-surface.jpg",venusAtmosphere:"venus-atmosphere.jpg",earthDay:"earth-day.jpg",earthNight:"earth-night.jpg",earthClouds:"earth-clouds.jpg",mars:"mars.jpg",jupiter:"jupiter.jpg",saturn:"saturn.jpg",saturnRing:"saturn-ring.png",uranus:"uranus.jpg",neptune:"neptune.jpg"},Fl={mercury:In.mercury,venus:In.venusAtmosphere,earth:In.earthDay,mars:In.mars,jupiter:In.jupiter,saturn:In.saturn,uranus:In.uranus,neptune:In.neptune},zv=Object.keys(Fl);function kv(i){return new URL(`assets/planets/high/${i}`,document.baseURI).href}function mr(i){return Math.max(0,Math.min(255,Math.round(i)))}function Tu(i){return Math.max(0,Math.min(1,i))}function xs(i,e,t){const n=Tu((t-i)/Math.max(1e-5,e-i));return n*n*(3-2*n)}function Ol(i){return{map:i.map,bumpMap:i.bumpMap,normalMap:i.normalMap,roughnessMap:i.roughnessMap,metalnessMap:i.metalnessMap,emissiveMap:i.emissiveMap,alphaMap:i.alphaMap,color:i.color.clone(),opacity:i.opacity,transparent:i.transparent,alphaTest:i.alphaTest,depthWrite:i.depthWrite,roughness:i.roughness,metalness:i.metalness,bumpScale:i.bumpScale,normalScale:i.normalScale.clone(),emissive:i.emissive.clone(),emissiveIntensity:i.emissiveIntensity,premultipliedAlpha:i.premultipliedAlpha,side:i.side,blending:i.blending}}function Qn(i,e){i.map=e.map,i.bumpMap=e.bumpMap,i.normalMap=e.normalMap,i.roughnessMap=e.roughnessMap,i.metalnessMap=e.metalnessMap,i.emissiveMap=e.emissiveMap,i.alphaMap=e.alphaMap,i.color.copy(e.color),i.opacity=e.opacity,i.transparent=e.transparent,i.alphaTest=e.alphaTest,i.depthWrite=e.depthWrite,i.roughness=e.roughness,i.metalness=e.metalness,i.bumpScale=e.bumpScale,i.normalScale.copy(e.normalScale),i.emissive.copy(e.emissive),i.emissiveIntensity=e.emissiveIntensity,i.premultipliedAlpha=e.premultipliedAlpha,i.side=e.side,i.blending=e.blending,i.needsUpdate=!0}function Au(i,e){return i.colorSpace=Ot,i.wrapS=Ti,i.wrapT=en,i.minFilter=un,i.magFilter=wt,i.anisotropy=e,i.generateMipmaps=!0,i.needsUpdate=!0,i}function Vv(i,e=1024){const t=i instanceof HTMLImageElement?i.naturalWidth:i instanceof HTMLVideoElement?i.videoWidth:Number(i.width??1),n=i instanceof HTMLImageElement?i.naturalHeight:i instanceof HTMLVideoElement?i.videoHeight:Number(i.height??1),s=Math.min(1,e/Math.max(1,t)),a=document.createElement("canvas");a.width=Math.max(2,Math.round(t*s)),a.height=Math.max(2,Math.round(n*s));const r=a.getContext("2d",{willReadFrequently:!0});if(!r)throw new Error("Canvas 2D is unavailable for texture derivation.");return r.drawImage(i,0,0,a.width,a.height),a}function Hv(i,e){const t=Vv(i.image,2048),n=t.getContext("2d",{willReadFrequently:!0});if(!n)throw new Error("Unable to read Saturn ring texture.");const s=n.getImageData(0,0,t.width,t.height),a=1024,r=document.createElement("canvas");r.width=a,r.height=a;const o=r.getContext("2d");if(!o)throw new Error("Unable to create Saturn ring texture.");const l=o.createImageData(a,a),c=a/2,h=.49,d=.96,u=[.42,.47,.5,.53,.58];for(let g=0;g<a;g+=1)for(let x=0;x<a;x+=1){const p=(x-c)/c,f=(g-c)/c,S=Math.hypot(p,f),T=(g*a+x)*4;if(S<h||S>d)continue;const y=(S-h)/(d-h),R=Math.min(t.width-1,Math.floor(y*t.width));let b=0,C=0,v=0;u.forEach(H=>{const J=(Math.min(t.height-1,Math.floor(t.height*H))*t.width+R)*4;b+=s.data[J],C+=s.data[J+1],v+=s.data[J+2]}),b/=u.length,C/=u.length,v/=u.length;const w=(b*.2126+C*.7152+v*.0722)/255,D=.86+Math.sin(y*Math.PI*154)*.08,P=.9+Math.sin(y*Math.PI*23)*.09,U=1-xs(.525,.555,y)*(1-xs(.61,.635,y))*.91,X=1-xs(.828,.838,y)*(1-xs(.852,.862,y))*.62,q=xs(0,.018,y),B=1-xs(.975,1,y),W=Tu(Math.pow(w,.66)*D*P*U*X*q*B);l.data[T]=mr((b-128)*1.1+132),l.data[T+1]=mr((C-128)*1.08+130),l.data[T+2]=mr((v-128)*1.05+126),l.data[T+3]=mr(W*248)}o.putImageData(l,0,0);const m=new nr(r);return Au(m,e),m}class Gv{constructor(e,t,n,s=kv){this.renderer=e,this.targets=t,this.onStatus=n,this.textureSource=s,this.anisotropy=Math.min(8,e.capabilities.getMaxAnisotropy()),t.planetMaterials.forEach((a,r)=>this.originals.set(r,Ol(a))),this.originals.set("earth-clouds",Ol(t.earthCloudMaterial)),this.originals.set("saturn-ring",Ol(t.saturnRingMaterial))}renderer;targets;onStatus;textureSource;loader=new Cp;anisotropy;originals=new Map;loaded=new Map;derived=new Map;inFlight=new Map;quality="low";focusedId="sun";requestToken=0;appliedSignature="";applyingSignature="";disposed=!1;async applyQuality(e,t){if(this.disposed)return;const n=t==="sun"?"earth":t,s=e==="auto"?`auto:${n}`:e;if(this.quality=e,this.focusedId=t,s===this.appliedSignature||s===this.applyingSignature)return;this.applyingSignature=s;const a=++this.requestToken;if(this.restoreProcedural(),e==="low"){this.isCurrent(a)&&(this.appliedSignature=s),this.applyingSignature="";return}if(e==="auto"){await this.ensurePlanet(n,a),this.isCurrent(a,"auto")&&(this.appliedSignature=s),this.applyingSignature===s&&(this.applyingSignature="");return}this.onStatus?.("Loading v0.4.1 high-detail planet polish…"),await Promise.allSettled(zv.map(r=>this.ensurePlanet(r,a))),this.isCurrent(a,"high")&&(this.appliedSignature=s,this.onStatus?.("v0.4.1 planet polish ready · Offline cached")),this.applyingSignature===s&&(this.applyingSignature="")}async focus(e){this.focusedId=e,this.quality==="auto"&&await this.applyQuality("auto",e)}isCurrent(e,t){return!this.disposed&&e===this.requestToken&&(!t||t===this.quality)}restoreProcedural(){this.targets.planetMaterials.forEach((n,s)=>{const a=this.originals.get(s);a&&Qn(n,a),delete n.userData.realTextureApplied});const e=this.originals.get("earth-clouds");e&&Qn(this.targets.earthCloudMaterial,e);const t=this.originals.get("saturn-ring");t&&Qn(this.targets.saturnRingMaterial,t),delete this.targets.saturnRingMaterial.userData.realTextureApplied}async load(e){const t=this.loaded.get(e);if(t)return t;const n=this.inFlight.get(e);if(n)return n;const s=this.textureSource(e);if(!s)throw new Error(`Texture source is unavailable for ${e}.`);const a=this.loader.loadAsync(s).then(r=>{if(this.inFlight.delete(e),this.disposed)throw r.dispose(),new Error(`Texture manager disposed before ${e} finished loading.`);return Au(r,this.anisotropy),this.loaded.set(e,r),r}).catch(r=>{throw this.inFlight.delete(e),r});return this.inFlight.set(e,a),a}derivedTexture(e,t){const n=this.derived.get(e);if(n)return n;const s=t();return this.derived.set(e,s),s}async ensurePlanet(e,t){if(!this.isCurrent(t)||!Fl[e])return;const n=this.targets.planetMaterials.get(e);if(n)try{if(e==="earth")await this.applyEarth(n,t);else if(e==="venus")await this.applyVenus(n,t);else{const a=await this.load(Fl[e]);if(!this.isCurrent(t))return;const r=this.originals.get(e);r&&Qn(n,r),n.map=a,n.emissiveMap=null,n.metalness=0,this.applyPlanetMaterialTuning(e,n,a)}if(!this.isCurrent(t))return;n.userData.realTextureApplied=!0,n.needsUpdate=!0;const s=e.charAt(0).toUpperCase()+e.slice(1);this.onStatus?.(`${s} precomputed real map ready`)}catch(s){if(!this.isCurrent(t))return;console.warn(`Real texture for ${e} failed; procedural fallback retained.`,s);const a=this.originals.get(e);a&&Qn(n,a),this.onStatus?.(`${e} map unavailable · Procedural fallback retained`)}}applyPlanetMaterialTuning(e,t,n){e==="mercury"?(t.bumpMap=n,t.bumpScale=.105,t.roughness=.98,t.emissive.setHex(525828),t.emissiveIntensity=.025):e==="mars"?(t.bumpMap=n,t.bumpScale=.078,t.roughness=.96,t.emissive.setHex(1443332),t.emissiveIntensity=.035):e==="jupiter"?(t.roughness=.94,t.emissiveMap=n,t.emissive.setHex(16777215),t.emissiveIntensity=.5):e==="saturn"?(t.roughness=.96,t.emissiveMap=n,t.emissive.setHex(16777215),t.emissiveIntensity=.44):e==="uranus"?(t.roughness=.91,t.emissive.setHex(464153),t.emissiveIntensity=.055):e==="neptune"&&(t.roughness=.89,t.emissive.setHex(199205),t.emissiveIntensity=.075)}async applyVenus(e,t){const n=await this.load("venus-atmosphere.jpg");if(!this.isCurrent(t))return;const s=this.originals.get("venus");s&&Qn(e,s),e.map=n,e.bumpMap=null,e.bumpScale=0,e.roughness=.985,e.metalness=0,e.emissiveMap=n,e.emissive.setHex(16777215),e.emissiveIntensity=.52}async applyEarth(e,t){const[n,s,a]=await Promise.all([this.load("earth-day.jpg"),this.load("earth-night.jpg"),this.load("earth-clouds.jpg")]);if(!this.isCurrent(t))return;const r=this.originals.get("earth");r&&Qn(e,r),e.map=n,e.emissiveMap=s,e.emissive.setHex(16765834),e.emissiveIntensity=.56,e.roughness=.92,e.metalness=.02;const o=this.originals.get("earth-clouds"),l=this.targets.earthCloudMaterial;o&&Qn(l,o),l.map=a,l.alphaMap=a,l.color.setHex(16777215),l.opacity=.84,l.alphaTest=.08,l.transparent=!0,l.depthWrite=!1,l.needsUpdate=!0}async applySaturnRing(e){const t=await this.load("saturn-ring.png");if(!this.isCurrent(e))return;const n=this.derivedTexture("saturn-ring-radial-v041",()=>Hv(t,this.anisotropy)),s=this.originals.get("saturn-ring"),a=this.targets.saturnRingMaterial;s&&Qn(a,s),a.map=n,a.alphaMap=n,a.color.setHex(16777215),a.opacity=.97,a.alphaTest=.006,a.transparent=!0,a.premultipliedAlpha=!0,a.depthWrite=!1,a.roughness=.78,a.metalness=0,a.side=on,a.needsUpdate=!0,a.userData.realTextureApplied=!0}dispose(){this.disposed=!0,this.requestToken+=1,this.loaded.forEach(e=>e.dispose()),this.derived.forEach(e=>e.dispose()),this.loaded.clear(),this.derived.clear(),this.inFlight.clear()}}const gi=Math.PI*2,Wv=[],Xv={venus:1.09,earth:1.105,mars:1.075,jupiter:1.062,saturn:1.058,uranus:1.085,neptune:1.09},qv={venus:.78,earth:.86,mars:.48,jupiter:.43,saturn:.36,uranus:.5,neptune:.62};function gr(i){return Math.max(0,Math.min(255,Math.round(i)))}function $v(i){let e=2166136261;for(let t=0;t<i.length;t+=1)e^=i.charCodeAt(t),e=Math.imul(e,16777619);return e>>>0}function Yv(i,e,t){const n=t%997/997,s=Math.sin((i*3+n)*gi+Math.sin(e*gi*2.1)*1.7),a=Math.sin((i*8-n*2)*gi+e*gi*5.3)*.5,r=Math.cos((i*17+n*4)*gi-e*gi*11.7)*.25;return(s+a+r)/1.75}function Kv(i,e){const s=document.createElement("canvas");s.width=512,s.height=256;const a=s.getContext("2d",{willReadFrequently:!0});if(!a)throw new Error("Canvas 2D is unavailable for planet polish overlays.");const r=a.createImageData(512,256),o=$v(`${i}-polish`);for(let c=0;c<256;c+=1){const h=c/Math.max(1,255);for(let d=0;d<512;d+=1){const u=d/Math.max(1,511),m=Yv(u,h,o),g=(c*512+d)*4;let x=255,p=255,f=255,S=0;if(i==="jupiter"){const T=Math.sin((h*31+m*.09)*Math.PI),y=Math.sin((h*77-m*.12)*Math.PI),R=T>0?T:0;x=226+R*25,p=181+R*22,f=139+R*14,S=14+Math.abs(T)*22+Math.abs(y)*9}else if(i==="saturn"){const T=Math.sin((h*58+m*.035)*Math.PI);x=238,p=216,f=165,S=8+Math.abs(T)*17}else if(i==="venus"){const T=Math.sin((h*24+m*.8+u*1.5)*Math.PI);x=255,p=229,f=165,S=12+Math.max(0,T)*34+Math.max(0,m)*16}else if(i==="uranus"){const T=Math.sin((h*27+m*.03)*Math.PI);x=210,p=247,f=244,S=5+Math.max(0,T)*14}else if(i==="neptune"){const T=Math.sin((h*36+m*.12)*Math.PI);x=T>0?125:15,p=T>0?177:42,f=T>0?255:124,S=8+Math.abs(T)*18+Math.max(0,m)*10}r.data[g]=gr(x),r.data[g+1]=gr(p),r.data[g+2]=gr(f),r.data[g+3]=gr(S)}}if(a.putImageData(r,0,0),i==="jupiter"){a.save(),a.translate(512*.72,256*.625),a.rotate(-.07),a.scale(1.8,.72);const c=a.createRadialGradient(-5,-4,2,0,0,32);c.addColorStop(0,"rgba(243,155,116,0.76)"),c.addColorStop(.42,"rgba(190,73,50,0.84)"),c.addColorStop(.78,"rgba(137,55,44,0.58)"),c.addColorStop(1,"rgba(117,62,55,0)"),a.fillStyle=c,a.beginPath(),a.arc(0,0,31,0,gi),a.fill(),a.restore()}else if(i==="neptune"){a.save(),a.translate(512*.68,256*.57),a.rotate(-.12),a.scale(2.2,.78);const c=a.createRadialGradient(-4,-2,2,0,0,22);c.addColorStop(0,"rgba(7,19,77,0.72)"),c.addColorStop(.68,"rgba(15,34,108,0.56)"),c.addColorStop(1,"rgba(20,53,143,0)"),a.fillStyle=c,a.beginPath(),a.arc(0,0,22,0,gi),a.fill(),a.restore()}const l=new nr(s);return l.colorSpace=Ot,l.wrapS=Ti,l.wrapT=en,l.minFilter=un,l.magFilter=wt,l.generateMipmaps=!0,l.anisotropy=e,l.needsUpdate=!0,l}function Ru(i){return Xv[i]??1.08}class Zv{constructor(e,t,n,s,a){this.planetMeshes=n,this.atmosphereMeshes=s,this.atmosphereMaterials=a;const r=Math.min(8,e.capabilities.getMaxAnisotropy());Wv.forEach(o=>{const l=t.get(o.id);if(!l)return;const c=Kv(o.id,r),h=new jn({map:c,transparent:!0,opacity:o.opacity,alphaTest:.006,depthWrite:!1,roughness:1,metalness:0,side:kn});h.userData.baseOpacity=o.opacity;const d=new rt(this.geometry,h);d.name=`${o.id}-polish-layer`,d.renderOrder=2,d.visible=!1,l.add(d),this.textures.push(c),this.materials.push(h),this.layers.set(o.id,{mesh:d,profile:o})})}planetMeshes;atmosphereMeshes;atmosphereMaterials;geometry=new ui(1,64,48);layers=new Map;textures=[];materials=[];focusedId="sun";quality="low";setPlanetRadius(e,t){const n=this.layers.get(e);n&&n.mesh.scale.setScalar(t*n.profile.scale);const s=this.atmosphereMeshes.get(e);s&&s.scale.setScalar(t*Ru(e))}applyQuality(e,t){this.quality=e,this.focusedId=t;const n=t==="sun"?"earth":t;this.layers.forEach(({mesh:s,profile:a},r)=>{if(e==="low"){s.visible=!1;return}const l=e==="high"||r===n||t==="sun"&&(r==="jupiter"||r==="saturn");s.visible=l,s.material.opacity=a.opacity*(e==="high"||r===n?1:.58),s.material.needsUpdate=!0}),this.atmosphereMeshes.forEach((s,a)=>{const o=a==="earth"||a===n||e==="high"||e==="auto"&&(t==="sun"&&(a==="jupiter"||a==="saturn"));s.visible=o;const l=this.atmosphereMaterials.get(a),c=qv[a]??.5,h=e==="low"?.58:e==="auto"&&a!==n?.72:1;l?.uniforms.glowStrength&&(l.uniforms.glowStrength.value=c*h)})}update(e){this.layers.forEach(({mesh:t,profile:n},s)=>{const a=this.planetMeshes.get(s);a&&(t.rotation.y=a.rotation.y+e*n.driftPerDay)})}dispose(){this.layers.forEach(({mesh:e})=>e.removeFromParent()),this.textures.forEach(e=>e.dispose()),this.materials.forEach(e=>e.dispose()),this.geometry.dispose(),this.layers.clear()}}const jv={near:.7,standard:1.55,far:3.1};function Bl(i){i.traverse(e=>{if(!(e instanceof rt||e instanceof Zs))return;e.geometry.dispose(),(Array.isArray(e.material)?e.material:[e.material]).forEach(n=>n.dispose())})}function Jv(){const i=new gn;i.name="spacecraft-mission-root";const e=new jn({color:13621478,metalness:.64,roughness:.34}),t=new jn({color:1516339,metalness:.48,roughness:.48}),n=new jn({color:2383528,emissive:398374,metalness:.24,roughness:.56,side:on}),s=new Ys({color:6542591}),a=new rt(new ds(.12,.16,.62,20),e);a.rotation.x=Math.PI/2,a.position.z=-.12,i.add(a);const r=new rt(new ds(.18,.18,.28,20),t);r.rotation.x=Math.PI/2,r.position.z=.34,i.add(r);const o=new rt(new ir(.18,.3,20),e);o.rotation.x=Math.PI/2,o.position.z=.63,i.add(o);const l=new rt(new ir(.12,.26,18,1,!0),s);l.rotation.x=-Math.PI/2,l.position.z=-.56,i.add(l);const c=new rt(new Ii(.94,.035,.035),t);i.add(c);for(const u of[-1,1]){const m=new rt(new Ii(.62,.015,.28),n);m.position.x=u*.75,i.add(m)}const h=new rt(new ds(.008,.008,.32,8),t);h.position.y=.25,i.add(h);const d=new rt(new gl(.12,20),e);return d.rotation.x=-Math.PI/2,d.position.y=.42,i.add(d),i.scale.setScalar(.22),i}class Qv{constructor(e){this.options=e,this.spacecraft.visible=!1,e.scene.add(this.spacecraft),this.label=document.createElement("span"),this.label.className="planet-label spacecraft-label",this.label.textContent="Probe",this.label.hidden=!0,e.labelLayer.append(this.label)}options;mission;state;spacecraft=Jv();trajectory;label;lastWorldPosition;scratchVector=new L;labelLayerWidth=0;labelLayerHeight=0;labelLayerMeasuredAt=-1/0;labelVisible=null;labelText="";labelLeft=Number.NaN;labelTop=Number.NaN;labelFocused=!1;setMission(e){this.mission=e?.plan?{plan:e.plan,active:!!e.active,cameraMode:e.cameraMode,followDistance:e.followDistance,realism:{...e.realism}}:void 0,this.state=void 0,this.lastWorldPosition=void 0,this.rebuildTrajectory(),this.update(this.mission?.plan?.plannedAtSimulationDays??0)}setCamera(e,t=this.mission?.followDistance??"standard"){this.mission&&(this.mission={...this.mission,cameraMode:e,followDistance:t},this.lastWorldPosition=void 0,this.options.onStatus?.(`${e==="follow"?"Follow":"Free"} spacecraft camera active`))}update(e){const t=this.mission?.plan;if(!t){this.spacecraft.visible=!1,this.label.hidden=!0,this.state=void 0;return}const n=this.mission?.active?e:Math.min(e,t.departureSimulationDays);this.state=pa.stateAt(t,n);const s=this.options.mapAu(this.state.positionAu);return this.spacecraft.position.copy(s),this.spacecraft.visible=!0,this.label.hidden=!1,this.orientSpacecraft(s),this.mission?.active&&this.mission.cameraMode==="follow"&&this.updateFollowCamera(s),this.lastWorldPosition=s.clone(),this.state}updateFrame(e=!0){if(!this.spacecraft.visible||(this.updateLabel(),!e))return;const t=.96+Math.sin(performance.now()*.004)*.035;this.spacecraft.children.forEach(n=>{n instanceof rt&&n.material instanceof Ys&&n.scale.setScalar(t)})}rebuild(){this.rebuildTrajectory(),this.state&&this.update(this.state.simulationDays)}getState(){return this.state?{...this.state,positionAu:{...this.state.positionAu}}:void 0}getSnapshot(){if(this.mission?.plan)return{plan:this.mission.plan,active:this.mission.active,cameraMode:this.mission.cameraMode,followDistance:this.mission.followDistance,realism:{...this.mission.realism}}}getDiagnostics(){const e=this.spacecraft.getWorldPosition(new L),t=e.clone().project(this.options.camera);return{active:!!this.mission?.active,planId:this.mission?.plan?.id,destinationId:this.mission?.plan?.destinationId,status:this.state?.status,progress:this.state?.progress??0,cameraMode:this.mission?.cameraMode,followDistance:this.mission?.followDistance,worldX:e.x,worldY:e.y,worldZ:e.z,inViewport:Math.abs(t.x)<=.96&&Math.abs(t.y)<=.96&&t.z>=-1&&t.z<=1,trajectoryPointCount:this.mission?.plan?.trajectory.length??0}}dispose(){this.trajectory&&(this.options.scene.remove(this.trajectory),Bl(this.trajectory)),this.options.scene.remove(this.spacecraft),Bl(this.spacecraft),this.label.remove()}rebuildTrajectory(){this.trajectory&&(this.options.scene.remove(this.trajectory),Bl(this.trajectory),this.trajectory=void 0);const e=this.mission?.plan;if(!e?.trajectory.length)return;const t=e.trajectory.map(a=>this.options.mapAu(a.positionAu)),n=new St().setFromPoints(t),s=new Ka({color:e.valid?6542591:16742509,transparent:!0,opacity:e.valid?.78:.44});this.trajectory=new Zs(n,s),this.trajectory.name="spacecraft-transfer-trajectory",this.trajectory.renderOrder=4,this.options.scene.add(this.trajectory)}orientSpacecraft(e){const t=this.mission?.plan,n=this.state;if(!t||!n||t.trajectory.length<2)return;const s=Math.min(1,n.progress+1/Math.max(2,t.trajectory.length-1)),a=Math.min(t.trajectory.length-1,Math.ceil(s*(t.trajectory.length-1))),r=this.options.mapAu(t.trajectory[a].positionAu);if(r.distanceToSquared(e)<1e-12)return;const o=r.clone().sub(e).normalize();this.spacecraft.quaternion.setFromUnitVectors(new L(0,0,1),o)}updateFollowCamera(e){const t=jv[this.mission?.followDistance??"standard"],n=this.options.controls.target.clone();let s=this.options.camera.position.clone().sub(n);s.lengthSq()<1e-8&&s.set(.4,.3,1),s.normalize(),this.options.controls.target.copy(e),this.options.camera.position.copy(e.clone().add(s.multiplyScalar(t))),this.options.camera.lookAt(e),this.options.controls.update()}updateLabel(){const e=performance.now();e-this.labelLayerMeasuredAt>500&&(this.labelLayerWidth=this.options.labelLayer.clientWidth,this.labelLayerHeight=this.options.labelLayer.clientHeight,this.labelLayerMeasuredAt=e);const t=this.spacecraft.getWorldPosition(this.scratchVector).project(this.options.camera),n=t.z<1&&t.z>-1&&Math.abs(t.x)<=.98&&Math.abs(t.y)<=.98;if(this.labelVisible!==n&&(this.label.style.display=n?"block":"none",this.labelVisible=n),!n)return;const s=this.state?.completed?this.state.status==="orbit-achieved"?"Probe · Orbit achieved":"Probe · Fly-by complete":`Probe · ${Math.round((this.state?.progress??0)*100)}%`;this.labelText!==s&&(this.label.textContent=s,this.labelText=s);const a=(t.x*.5+.5)*this.labelLayerWidth,r=(-t.y*.5+.5)*this.labelLayerHeight-22;this.labelLeft!==a&&(this.label.style.left=`${a}px`,this.labelLeft=a),this.labelTop!==r&&(this.label.style.top=`${r}px`,this.labelTop=r),this.labelFocused||(this.label.classList.add("is-focused"),this.labelFocused=!0)}}const ex=2e3,tx=1e4,nx=15e3,zl=["safe","low","normal"];function ix(i){return/swiftshader|llvmpipe|software rasterizer|software renderer/i.test(i)}function sx(i,e,t){const n=Math.max(.5,Number.isFinite(t)?t:1);return Math.min(i==="low"?1:i==="high"?2.25:e==="normal"?1.5:e==="low"?1:.75,n)}class Cu{softwareRenderer;tier;windowStartedAt=0;windowFrames=0;windowFrameMs=0;slowWindows=0;fastDurationMs=0;lastChangedAt=Number.NEGATIVE_INFINITY;fps=0;averageFrameMs=0;constructor(e){this.softwareRenderer=e,this.tier=e?"low":"normal"}reset(e=0){this.windowStartedAt=e,this.windowFrames=0,this.windowFrameMs=0,this.slowWindows=0,this.fastDurationMs=0,this.fps=0,this.averageFrameMs=0}recordFrame(e,t){if(!Number.isFinite(e)||e<0||!Number.isFinite(t))return;this.windowStartedAt===0&&(this.windowStartedAt=t),this.windowFrames+=1,this.windowFrameMs+=e;const n=t-this.windowStartedAt;if(n<ex)return;this.fps=this.windowFrames/Math.max(.001,n/1e3),this.averageFrameMs=this.windowFrameMs/Math.max(1,this.windowFrames);const s=this.fps<30||this.averageFrameMs>33.34,a=this.fps>50&&this.averageFrameMs<20;if(this.slowWindows=s?this.slowWindows+1:0,this.fastDurationMs=a?this.fastDurationMs+n:0,this.windowStartedAt=t,this.windowFrames=0,this.windowFrameMs=0,!(t-this.lastChangedAt<nx)){if(this.slowWindows>=2)return this.slowWindows=0,this.fastDurationMs=0,this.changeTier(-1,t);if(this.fastDurationMs>=tx)return this.slowWindows=0,this.fastDurationMs=0,this.changeTier(1,t)}}snapshot(){return{tier:this.tier,fps:this.fps,averageFrameMs:this.averageFrameMs,softwareRenderer:this.softwareRenderer}}changeTier(e,t){const n=zl.indexOf(this.tier),s=Math.max(0,Math.min(zl.length-1,n+e));if(s!==n)return this.tier=zl[s],this.lastChangedAt=t,this.tier}}const ax={mercury:.034,venus:177.4,earth:23.44,mars:25.19,jupiter:3.13,saturn:26.73,uranus:97.77,neptune:28.32},ta=1495978707e-1,Pu=696340,rx=384400/ta;class ox{constructor(e){this.options=e}options;manifest=ea;context;parameters=Su(ea);scene;camera;renderer;controls;stage;labelLayer;worker;visualAssets;realTextures;planetPolish;moonVisual;fallback;spacecraftMission;resizeState={width:1,height:1,pixelRatio:1};animationFrame=0;destroyed=!1;adaptiveQuality=new Cu(!1);softwareRenderer=!1;lastRenderedAt=0;scratchVector=new L;labelCandidates=[];labelOccupied=[];labelStyleState=new Map;simulationDays=0;playing=!0;pausedSimulationDays;playbackRate=32;focusedObject="sun";viewMode="overview";planetRoots=new Map;planetAxes=new Map;planetMeshes=new Map;cloudMeshes=new Map;atmosphereMeshes=new Map;saturnRing;moonOrbitPlane;moonOrbitPivot;moonMesh;moonOrbit;labels=new Map;orbitGroup=new gn;stars;asteroidBelt;sun;sunHalo;sunInnerHalo;raycaster=new Op;pointer=new Te;latestPositions=new Float32Array(je.length*3);latestRotations=new Float32Array(je.length);workerReported=!1;workerWatchdog;stepRequestSequence=0;pendingSimulationSteps=new Map;async mount(e){this.context=e,this.resizeState=e.viewport,this.stage=document.createElement("div"),this.stage.className="runtime-stage",this.labelLayer=document.createElement("div"),this.labelLayer.className="planet-label-layer",this.stage.append(this.labelLayer),e.container.replaceChildren(this.stage);const t=document.createElement("canvas");if(!!!(t.getContext("webgl2")||t.getContext("webgl"))){this.fallback=new Eu,this.fallback.mount(e,this.stage);return}this.scene=new op,this.scene.background=new ze(132624),this.scene.fog=new Yo(132624,.009),this.camera=new an(46,1,1e-6,1200),this.camera.position.set(0,18,32);try{this.renderer=new ev({antialias:!0,alpha:!1,powerPreference:"high-performance"})}catch{this.fallback=new Eu,this.fallback.mount(e,this.stage);return}this.renderer.outputColorSpace=Ot,this.renderer.toneMapping=qr,this.renderer.toneMappingExposure=1.04,this.renderer.domElement.className="solar-canvas",this.renderer.domElement.setAttribute("aria-label","Interactive 3D solar system preview"),this.stage.prepend(this.renderer.domElement);const s=this.renderer.getContext(),a=s.getExtension("WEBGL_debug_renderer_info"),r=String(a?s.getParameter(a.UNMASKED_RENDERER_WEBGL):s.getParameter(s.RENDERER));this.softwareRenderer=ix(r),this.adaptiveQuality=new Cu(this.softwareRenderer),this.visualAssets=Bv(this.renderer,je),this.controls=new nv(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.065,this.controls.minDistance=1e-5,this.controls.maxDistance=260,this.controls.target.set(0,0,0),this.controls.addEventListener("change",this.requestRender),this.controls.addEventListener("start",this.handleControlsStart),this.scene.add(new Pp(7904767,329486,.46));const o=new Lp(16773319,120,220,1.55);o.position.set(0,0,0),this.scene.add(o);const l=new Np(7310591,.18);l.position.set(-18,12,16),this.scene.add(l),this.createSun(),this.createPlanets(),this.createMoon();const c=this.visualAssets;if(!c)throw new Error("Planet visual assets were not initialized.");this.planetPolish=new Zv(this.renderer,this.planetAxes,this.planetMeshes,this.atmosphereMeshes,c.atmosphereMaterials),this.updatePlanetSizes(),this.realTextures=new Gv(this.renderer,{planetMaterials:c.planetMaterials,earthCloudMaterial:c.earthCloudMaterial,saturnRingMaterial:c.saturnRingMaterial},h=>e.onStatus?.(h),this.options.textureSource),this.createStars(),this.rebuildAsteroidBelt(),this.rebuildOrbits(),this.seedOrbitalStateFromModel(),this.applyOrbitalStateToScene(),this.resize(e.viewport),this.renderer.domElement.addEventListener("pointerup",this.handlePointerUp),window.addEventListener("mcp:set-3d-view",this.handleQaView),this.worker=this.options.createSimulationWorker(),this.worker.onmessage=h=>this.handleWorkerState(h.data),this.worker.onerror=()=>e.onStatus?.("Simulation Worker failed. Reload the project to retry."),this.playbackRate=ei(Je(this.parameters,"timeScale",1)),this.worker.postMessage({type:"configure",timeScale:this.playbackRate}),this.worker.postMessage({type:"snapshot"}),this.workerWatchdog=window.setTimeout(()=>{this.workerReported||this.destroyed||(console.warn("Simulation Worker has not reported within 4s; scene is running on main-thread seeded positions."),e.onStatus?.("Simulation Worker slow to start · using main-thread positions"))},4e3),e.onFocusChange?.(this.focusedObject),this.requestRender(),e.onStatus?.(`Solar System v${Jt} runtime ready`)}createSun(){if(!this.scene||!this.labelLayer||!this.visualAssets)return;const e=new ui(1.35,72,48);this.sun=new rt(e,this.visualAssets.sunMaterial),this.sun.name="sun",this.scene.add(this.sun),this.sunHalo=new _h(this.visualAssets.sunHaloMaterial),this.sunHalo.scale.set(7.4,7.4,1),this.sun.add(this.sunHalo);const t=this.visualAssets.sunHaloMaterial.clone();delete t.userData.resourceOwner,t.opacity=.68,t.color.setHex(16761423);const n=new _h(t);n.scale.set(4.6,4.6,1),this.sun.add(n),this.sunInnerHalo=n,this.createLabel("sun","Sun")}createPlanets(){const e=this.scene,t=this.visualAssets;!e||!t||(je.forEach(n=>{const s=new gn;s.name=`${n.id}-root`,s.userData.planetId=n.id;const a=new gn;a.name=`${n.id}-axis`,a.rotation.z=Zt.degToRad(ax[n.id]??0),s.add(a),this.planetAxes.set(n.id,a);const r=new ui(1,64,48),o=t.planetMaterials.get(n.id);if(!o)return;const l=new rt(r,o);if(l.name=n.id,l.userData.planetId=n.id,a.add(l),this.planetRoots.set(n.id,s),this.planetMeshes.set(n.id,l),e.add(s),this.createLabel(n.id,n.name),n.id==="earth"){const h=new rt(new ui(1,64,48),t.earthCloudMaterial);h.name="earth-clouds",h.renderOrder=2,a.add(h),this.cloudMeshes.set(n.id,h)}const c=t.atmosphereMaterials.get(n.id);if(c){const h=new rt(new ui(1,64,48),c);h.name=`${n.id}-atmosphere`,h.renderOrder=3,a.add(h),this.atmosphereMeshes.set(n.id,h)}n.id==="saturn"&&(this.saturnRing=new rt(new _l(1.34,2.45,160,4),t.saturnRingMaterial),this.saturnRing.name="saturn-rings",this.saturnRing.rotation.x=Math.PI/2,this.saturnRing.renderOrder=1,a.add(this.saturnRing))}),this.updatePlanetSizes())}createMoon(){if(!this.renderer)return;const e=this.planetRoots.get("earth");if(!e)return;const t=new gn;t.name="moon-orbit-plane",t.rotation.x=Zt.degToRad(Ge.inclinationDeg);const n=[];for(let l=0;l<160;l+=1){const c=l/160*Math.PI*2;n.push(new L(Math.cos(c),0,Math.sin(c)))}const s=new bh(new St().setFromPoints(n),new Ka({color:12043992,transparent:!0,opacity:.34}));s.name="moon-orbit",t.add(s);const a=new gn;a.name="moon-orbit-pivot",t.add(a);const r=new jn({color:12434098,roughness:.98,metalness:0}),o=new rt(new ui(1,72,48),r);o.name=Ge.id,o.userData.planetId=Ge.id,o.rotation.y=Math.PI/2,a.add(o),e.add(t),this.moonOrbitPlane=t,this.moonOrbitPivot=a,this.moonOrbit=s,this.moonMesh=o,this.moonVisual=new vv(this.renderer,o),r.dispose(),this.createLabel(Ge.id,Ge.name),this.updateMoonScale(),this.updateMoonTransform()}createLabel(e,t){if(!this.labelLayer)return;const n=document.createElement("span");n.className="planet-label",n.textContent=t,n.dataset.objectId=e,this.labelLayer.append(n),this.labels.set(e,n)}createStars(){if(!this.scene)return;const e=1900,t=new Float32Array(e*3),n=new Float32Array(e*3);let s=1831565813;const a=()=>(s=Math.imul(s^s>>>15,1|s),s^=s+Math.imul(s^s>>>7,61|s),((s^s>>>14)>>>0)/4294967296);for(let o=0;o<e;o+=1){const l=80+a()*95,c=a()*Math.PI*2,h=Math.acos(2*a()-1);t[o*3]=l*Math.sin(h)*Math.cos(c),t[o*3+1]=l*Math.cos(h),t[o*3+2]=l*Math.sin(h)*Math.sin(c);const d=a();n[o*3]=.72+d*.28,n[o*3+1]=.78+d*.18,n[o*3+2]=.9+(1-d)*.1}const r=new St;r.setAttribute("position",new qt(t,3)),r.setAttribute("color",new qt(n,3)),this.stars=new ml(r,new fl({vertexColors:!0,size:.19,sizeAttenuation:!0,transparent:!0,opacity:.82,depthWrite:!1})),this.scene.add(this.stars)}rebuildAsteroidBelt(){if(!this.scene)return;if(this.asteroidBelt&&this.scene.remove(this.asteroidBelt),this.asteroidBelt?.geometry.dispose(),this.asteroidBelt){const c=this.asteroidBelt.material;Array.isArray(c)?c.forEach(h=>h.dispose()):c.dispose()}this.asteroidBelt=void 0;const e=Vt(this.parameters),t=e==="low"?220:e==="high"?1700:520,n=new Float32Array(t*3),s=new Float32Array(t*3);let a=5370206;const r=()=>(a=Math.imul(a^a>>>15,1|a),a^=a+Math.imul(a^a>>>7,61|a),((a^a>>>14)>>>0)/4294967296);for(let c=0;c<t;c+=1){const h=2.08+r()*1.22+(r()-.5)*.08,d=r()*Math.PI*2,u=(r()-.5)*.23,m=this.mapAuVector(Math.cos(d)*h,Math.sin(u)*h*.13,Math.sin(d)*h);n[c*3]=m.x,n[c*3+1]=m.y,n[c*3+2]=m.z;const g=.48+r()*.34;s[c*3]=g*1.04,s[c*3+1]=g*.92,s[c*3+2]=g*.78}const o=new St;o.setAttribute("position",new qt(n,3)),o.setAttribute("color",new qt(s,3));const l=new fl({vertexColors:!0,size:e==="high"?.075:e==="low"?.045:.058,sizeAttenuation:!0,transparent:!0,opacity:e==="low"?.48:e==="high"?.7:.56,depthWrite:!1});this.asteroidBelt=new ml(o,l),this.asteroidBelt.name="main-asteroid-belt",this.scene.add(this.asteroidBelt),this.applyViewVisibility()}applyViewVisibility(){const e=this.viewMode!=="focus",t=e&&Mn(this.parameters,"showOrbits",!0);this.orbitGroup.visible=t,this.moonOrbit&&(this.moonOrbit.visible=t),this.asteroidBelt&&(this.asteroidBelt.visible=e),this.sun&&(this.sun.visible=e||this.focusedObject==="sun"),this.sunHalo&&(this.sunHalo.visible=this.viewMode!=="focus"),this.sunInnerHalo&&(this.sunInnerHalo.visible=this.viewMode!=="focus"),this.planetAxes.forEach((n,s)=>{n.visible=e||s===this.focusedObject}),this.moonMesh&&(this.moonMesh.visible=e||this.focusedObject===Ge.id)}mapAuVector(e,t,n){const s=Jl({x:e,y:t,z:n},Jn(this.parameters),Je(this.parameters,"distanceScale",1));return new L(s.x,s.y,s.z)}systemVisualRadius(){return Es(je,Jn(this.parameters),Je(this.parameters,"distanceScale",1))}systemContentRadius(){const e=Jn(this.parameters),t=Je(this.parameters,"distanceScale",1),n=Math.max(...je.map(r=>Es([r],e,t)+this.planetVisualRadius(r)*(r.id==="saturn"?2.45:1.12))),s=this.planetVisualRadius(Wt),a=Es([Wt],e,t)+this.moonOrbitVisualRadius(s)+this.moonBodyVisualRadius(s);return Math.max(this.sunVisualScale()*1.35,n,a)}frameSolarOverview(){if(!this.camera||!this.controls)return;const e=this.systemContentRadius()*1.08,t=Zt.degToRad(this.camera.fov/2),n=Math.atan(Math.tan(t)*Math.max(.1,this.camera.aspect)),s=Math.max(Zt.degToRad(8),Math.min(t,n)),a=Math.max(30,e/Math.sin(s)),r=this.camera.position.clone().sub(this.controls.target);r.lengthSq()<1e-8&&r.set(0,.48,.88),r.normalize(),this.controls.target.set(0,0,0),this.camera.position.copy(r.multiplyScalar(a)),this.camera.lookAt(this.controls.target),this.controls.maxDistance=Math.max(260,a*1.5),this.camera.far=Math.max(1200,a+e*4),this.camera.updateProjectionMatrix(),this.controls.update()}objectVisualRadius(e){if(e==="sun")return this.sunVisualScale()*1.35;if(e===Ge.id)return this.moonBodyVisualRadius(this.planetVisualRadius(Wt));const t=je.find(n=>n.id===e);return t?this.planetVisualRadius(t)*(e==="saturn"?2.45:1.12):.1}planetVisualRadius(e){const t=mt(this.parameters),n=Je(this.parameters,"distanceScale",1);return t==="real-scale"?e.radiusKm/ta*1.05*n:t==="real-distance"?Ql(e,je,Je(this.parameters,"planetScale",1.15),n):Tr(e,Je(this.parameters,"planetScale",1.15))}sunVisualScale(){const e=mt(this.parameters),t=Je(this.parameters,"distanceScale",1);return e==="real-scale"?Pu/ta*1.05*t/1.35:e==="real-distance"?Ar(je,t)/1.35:.92+Je(this.parameters,"planetScale",1.15)*.08}moonOrbitVisualRadius(e){return mt(this.parameters)==="learning"?tc(Ge,e):rx*1.05*Je(this.parameters,"distanceScale",1)}moonBodyVisualRadius(e){const t=mt(this.parameters),n=Je(this.parameters,"distanceScale",1);return t==="real-scale"?Ge.radiusKm/ta*1.05*n:t==="real-distance"?ec(Ge,e,n):sa(Ge,e)}updatePlanetSizes(){const e=mt(this.parameters);this.stage?.setAttribute("data-scale-mode",e),this.labels.forEach(t=>t.classList.toggle("is-locator",e!=="learning")),je.forEach(t=>{const n=this.planetVisualRadius(t);this.planetMeshes.get(t.id)?.scale.setScalar(n),this.cloudMeshes.get(t.id)?.scale.setScalar(n*1.018),this.atmosphereMeshes.get(t.id)?.scale.setScalar(n*Ru(t.id)),this.planetPolish?.setPlanetRadius(t.id,n),t.id==="saturn"&&this.saturnRing?.scale.setScalar(n)}),this.sun?.scale.setScalar(this.sunVisualScale()),this.updateMoonScale()}updateMoonScale(){if(!this.moonMesh||!this.moonOrbit)return;const e=this.planetVisualRadius(Wt),t=this.moonOrbitVisualRadius(e);this.moonMesh.position.set(t,0,0),this.moonMesh.scale.setScalar(this.moonBodyVisualRadius(e)),this.moonOrbit.scale.setScalar(t)}updateMoonTransform(){if(!this.moonOrbitPivot||!this.moonMesh)return;const e=Rr(Ge,this.simulationDays);if(this.moonOrbitPivot.rotation.y=e,this.moonMesh.rotation.y=Math.PI/2,this.focusedObject===Ge.id&&this.camera&&this.controls){const n=this.moonMesh.getWorldPosition(new L).clone().sub(this.controls.target);this.controls.target.add(n),this.camera.position.add(n)}}rebuildOrbits(){this.scene&&(this.scene.remove(this.orbitGroup),this.orbitGroup.traverse(e=>{if(e instanceof Zs){e.geometry.dispose();const t=e.material;Array.isArray(t)?t.forEach(n=>n.dispose()):t.dispose()}}),this.orbitGroup=new gn,je.forEach(e=>this.orbitGroup.add(this.createOrbit(e))),this.orbitGroup.visible=Mn(this.parameters,"showOrbits",!0),this.moonOrbit&&(this.moonOrbit.visible=Mn(this.parameters,"showOrbits",!0)),this.scene.add(this.orbitGroup))}createOrbit(e){const t=[];for(let a=0;a<240;a+=1){const r=wr(e,a/240*Math.PI*2);t.push(this.mapAuVector(r.x,r.y,r.z))}const n=new St().setFromPoints(t),s=new Ka({color:7179181,transparent:!0,opacity:.24});return new bh(n,s)}handleWorkerState(e){if(e.type!=="state"||!this.playing&&e.step===void 0&&this.pausedSimulationDays!==void 0&&Math.abs(e.simulationDays-this.pausedSimulationDays)>1e-10)return;this.simulationDays=e.simulationDays,this.workerReported=!0,window.clearTimeout(this.workerWatchdog),this.latestPositions=new Float32Array(e.positions),this.latestRotations=new Float32Array(e.rotations),this.applyOrbitalStateToScene(),this.requestRender(),this.context?.onSimulationTime?.(this.simulationDays);const t=e.step?.requestId??[...this.pendingSimulationSteps.entries()].find(([,n])=>Math.abs(e.simulationDays-n.expected.afterSimulationDays)<1e-10)?.[0];if(t){const n=this.pendingSimulationSteps.get(t);if(n)if(this.pendingSimulationSteps.delete(t),e.step){const{requestId:s,...a}=e.step;n.resolve(a)}else n.resolve(n.expected)}}seedOrbitalStateFromModel(e=this.simulationDays){je.forEach((t,n)=>{const s=ki(t,e);this.latestPositions[n*3]=s.x,this.latestPositions[n*3+1]=s.y,this.latestPositions[n*3+2]=s.z,this.latestRotations[n]=ad(t,e)})}applyOrbitalStateToScene(){je.forEach((e,t)=>{const n=this.planetRoots.get(e.id),s=this.planetMeshes.get(e.id);if(!n||!s)return;const a=this.mapAuVector(this.latestPositions[t*3],this.latestPositions[t*3+1],this.latestPositions[t*3+2]);n.position.copy(a),s.rotation.y=this.latestRotations[t];const r=this.cloudMeshes.get(e.id);r&&(r.rotation.y=this.latestRotations[t]*1.035+this.simulationDays*.008)}),this.updateMoonTransform(),this.planetPolish?.update(this.simulationDays),this.spacecraftMission?.update(this.simulationDays)}requestRender=()=>{this.animationFrame||this.destroyed||this.fallback||(this.animationFrame=requestAnimationFrame(this.animate))};handleControlsStart=()=>{this.viewMode==="overview"&&(this.viewMode="free")};needsContinuousRender(){return this.playing}animate=(e=performance.now())=>{this.animationFrame=0;const t=Vt(this.parameters),n=this.adaptiveQuality.snapshot().tier,s=t==="auto"&&n!=="normal"?1e3/30:0;if(s>0&&e-this.lastRenderedAt<s){this.needsContinuousRender()&&this.requestRender();return}this.lastRenderedAt=e;const a=performance.now(),r=this.controls?.update()??!1;if(this.playing&&!(t==="auto"&&n==="safe")&&(this.sun&&(this.sun.rotation.y+=.0011),this.sunHalo&&(this.sunHalo.material.rotation+=15e-5),this.stars&&(this.stars.rotation.y+=3e-6)),this.asteroidBelt&&(this.asteroidBelt.rotation.y=this.simulationDays*8e-5),this.spacecraftMission?.updateFrame(this.playing),this.updateLabels(),this.renderer&&this.scene&&this.camera&&this.renderer.render(this.scene,this.camera),this.context?.onFrameRendered?.(),t==="auto"){const o=this.adaptiveQuality.recordFrame(performance.now()-a,e);o&&(this.applyQuality(),this.context?.onStatus?.(`Adaptive quality · ${o}`))}(r||this.needsContinuousRender())&&this.requestRender()};commitLabelStyle(e,t,n,s=0,a=0){let r=this.labelStyleState.get(e);if(r||(r={visible:null,x:Number.NaN,y:Number.NaN,focused:null,hidden:null},this.labelStyleState.set(e,r)),r.visible!==n&&(t.style.display=n?"block":"none",r.visible=n),!n)return;r.x!==s&&(t.style.left=`${s}px`,r.x=s),r.y!==a&&(t.style.top=`${a}px`,r.y=a);const o=e===this.focusedObject;r.focused!==o&&(t.classList.toggle("is-focused",o),r.focused=o)}updateLabels(){if(!this.camera||!this.stage)return;const e=this.resizeState.width>1?this.resizeState.width:this.stage.clientWidth,t=this.resizeState.height>1?this.resizeState.height:this.stage.clientHeight,n=Mn(this.parameters,"showLabels",!0),s=this.labelCandidates;if(s.length=0,this.labels.forEach((c,h)=>{let d=this.labelStyleState.get(h);if(d&&d.hidden!==!n?(c.hidden=!n,d.hidden=!n):d||(c.hidden=!n),!n)return;const u=h==="sun"?this.sun:h===Ge.id?this.moonMesh:this.planetRoots.get(h);if(!u)return;const m=u.getWorldPosition(this.scratchVector),g=Math.max(1e-5,m.distanceTo(this.camera.position)),x=Math.max(2,this.objectVisualRadius(h)/g*(t/(2*Math.tan(Zt.degToRad(this.camera.fov/2))))),p=m.project(this.camera);if(!(p.z>=-1&&p.z<=1&&Math.abs(p.x)<=1+x*2/e&&Math.abs(p.y)<=1+x*2/t)){this.commitLabelStyle(h,c,!1);return}s.push({id:h,label:c,x:(p.x*.5+.5)*e,y:(-p.y*.5+.5)*t,radiusPx:x,priority:h===this.focusedObject?0:h==="sun"?1:h==="earth"?2:["jupiter","saturn","uranus","neptune"].includes(h)?3:["venus","mars"].includes(h)?4:5})}),!n)return;s.sort((c,h)=>c.priority-h.priority);const a=this.labelOccupied;a.length=0;const r=this.adaptiveQuality.snapshot().tier,o=this.viewMode==="focus"?1:Vt(this.parameters)==="auto"&&r==="safe"?3:e<1e3?6:Number.POSITIVE_INFINITY;let l=0;for(const{id:c,label:h,x:d,y:u,radiusPx:m}of s){if(Vt(this.parameters)==="auto"&&r==="safe"&&c!==this.focusedObject&&c!=="sun"&&c!=="earth"){this.commitLabelStyle(c,h,!1);continue}if(l>=o){this.commitLabelStyle(c,h,!1);continue}const g=Math.max(42,(h.textContent?.length??4)*7+16),x=22,p=10,f=[{x:d,y:u-m-p-x/2},{x:d+m+p+g/2,y:u},{x:d,y:u+m+p+x/2},{x:d-m-p-g/2,y:u}];let S=!1;for(const T of f){const y=Zt.clamp(T.x,g/2+6,e-g/2-6),R=Zt.clamp(T.y,x/2+6,t-x/2-6),b=y-g/2,C=y+g/2,v=R-x/2,w=R+x/2;let D=!1;for(const P of a)if(b<P.right+4&&C>P.left-4&&v<P.bottom+4&&w>P.top-4){D=!0;break}if(!D){for(const P of s){const U=Zt.clamp(P.x,b,C),X=Zt.clamp(P.y,v,w);if(Math.hypot(P.x-U,P.y-X)<P.radiusPx+5){D=!0;break}}if(!D){this.commitLabelStyle(c,h,!0,y,R),a.push({left:b,right:C,top:v,bottom:w}),l+=1,S=!0;break}}}S||this.commitLabelStyle(c,h,!1)}}handlePointerUp=e=>{if(!this.renderer||!this.camera)return;const t=this.renderer.domElement.getBoundingClientRect();this.pointer.x=(e.clientX-t.left)/t.width*2-1,this.pointer.y=-((e.clientY-t.top)/t.height)*2+1,this.raycaster.setFromCamera(this.pointer,this.camera);const n=[...this.planetMeshes.values(),...this.moonMesh?[this.moonMesh]:[],...this.sun?[this.sun]:[]],s=this.raycaster.intersectObjects(n,!1)[0];s?.object.name&&this.focusObject(s.object.name)};handleQaView=e=>{if(!this.camera||!this.controls)return;this.viewMode="free",this.applyViewVisibility();const t=e.detail?.preset??e.detail?.viewPreset??"isometric";this.controls.target.set(0,0,0),t==="top"?this.camera.position.set(0,42,.01):t==="front"?this.camera.position.set(0,4,38):t==="left"?this.camera.position.set(-38,8,0):t==="right"?this.camera.position.set(38,8,0):this.camera.position.set(25,18,28),this.camera.lookAt(this.controls.target),this.controls.update()};setParameters(e){const t=Ui(this.parameters,"visualMode","educational"),n=mt(this.parameters),s=Je(this.parameters,"distanceScale",1),a=Vt(this.parameters);if(this.parameters={...this.parameters,...e},this.playbackRate=ei(Je(this.parameters,"timeScale",this.playbackRate)),this.fallback){this.fallback.setParameters(this.parameters),this.fallback.setPlaybackRate(this.playbackRate);return}this.worker?.postMessage({type:"configure",timeScale:this.playbackRate}),this.updatePlanetSizes(),this.applyViewVisibility(),this.stars&&(this.stars.visible=Mn(this.parameters,"showStars",!0)),this.applyQuality();const r=t!==Ui(this.parameters,"visualMode","educational"),o=n!==mt(this.parameters),l=s!==Je(this.parameters,"distanceScale",1),c=a!==Vt(this.parameters);(r||o||l)&&(this.rebuildOrbits(),this.spacecraftMission?.rebuild(),this.applyOrbitalStateToScene(),this.viewMode==="overview"?this.frameSolarOverview():this.viewMode==="focus"&&this.focusObject(this.focusedObject)),(r||o||l||c)&&this.rebuildAsteroidBelt(),this.requestRender()}applyQuality(){if(!this.renderer)return;const e=Vt(this.parameters),t=this.adaptiveQuality.snapshot().tier,n=sx(e,t,window.devicePixelRatio||1);this.renderer.setPixelRatio(n),this.renderer.setSize(this.resizeState.width,this.resizeState.height,!1);const s=e==="auto"&&t!=="normal"?"low":e;this.planetPolish?.applyQuality(s,this.focusedObject),this.moonVisual?.applyQuality(s,this.focusedObject),this.realTextures?.applyQuality(s,this.focusedObject).then(this.requestRender),this.requestRender()}setSimulationTime(e){if(this.fallback){this.fallback.setSimulationTime(e);return}this.playing||(this.pausedSimulationDays=Number.isFinite(e)?e:0),this.worker?.postMessage({type:"set-time",simulationDays:e})}setPlaybackRate(e){if(this.playbackRate=ei(e),this.parameters={...this.parameters,timeScale:this.playbackRate},this.fallback){this.fallback.setPlaybackRate(this.playbackRate);return}this.worker?.postMessage({type:"configure",timeScale:this.playbackRate})}stepSimulation(e){if(this.fallback)return this.fallback.stepSimulation(e);if(!this.worker)return Promise.reject(new Error("Simulation Worker is not ready."));const t=`step-${++this.stepRequestSequence}`,n=br(this.simulationDays,this.playbackRate,e,this.playing);return new Promise((s,a)=>{this.pendingSimulationSteps.set(t,{expected:n,resolve:s,reject:a}),this.worker?.postMessage({type:"step",realSeconds:e,requestId:t})})}resize(e){if(this.resizeState=e,this.fallback){this.fallback.resize(e);return}!this.camera||!this.renderer||(this.camera.aspect=Math.max(.1,e.width/Math.max(1,e.height)),this.camera.updateProjectionMatrix(),this.viewMode==="overview"?this.frameSolarOverview():this.viewMode==="focus"&&this.frameFocusedObject(this.focusedObject),this.applyQuality(),this.requestRender())}play(){if(this.playing=!0,this.pausedSimulationDays=void 0,this.adaptiveQuality.reset(performance.now()),this.lastRenderedAt=0,this.fallback){this.fallback.play();return}this.worker?.postMessage({type:"play"}),this.requestRender()}pause(){if(this.playing=!1,this.fallback){this.fallback.pause();return}this.pausedSimulationDays=this.simulationDays,this.worker?.postMessage({type:"pause"}),this.worker?.postMessage({type:"set-time",simulationDays:this.pausedSimulationDays})}reset(){if(this.simulationDays=0,this.playing||(this.pausedSimulationDays=0),this.fallback){this.fallback.reset();return}this.worker?.postMessage({type:"reset"}),this.frameOverview()}zoomCamera(e){if(this.fallback){this.fallback.zoomCamera(e);return}if(!this.camera||!this.controls||!Number.isFinite(e)||e<=0)return;this.viewMode==="overview"&&(this.viewMode="free");const t=this.camera.position.clone().sub(this.controls.target),n=Zt.clamp(t.length()*e,this.controls.minDistance,this.controls.maxDistance);this.camera.position.copy(this.controls.target).add(t.setLength(n)),this.controls.update(),this.requestRender()}frameOverview(){if(this.fallback){this.fallback.frameOverview();return}this.viewMode="overview",this.focusedObject="sun",this.applyViewVisibility(),this.context?.onFocusChange?.("sun"),this.frameSolarOverview(),this.context?.onStatus?.("Framed whole solar system"),this.requestRender()}focusObject(e){if(this.fallback){this.fallback.focusObject(e);return}!this.camera||!this.controls||!(e==="sun"?this.sun:e===Ge.id?this.moonMesh:this.planetRoots.get(e))||(this.viewMode="focus",this.focusedObject=e,this.context?.onFocusChange?.(e),Yl(e)&&this.realTextures?.focus(e),this.applyViewVisibility(),this.frameFocusedObject(e),this.applyQuality(),this.requestRender(),this.context?.onStatus?.(`Focused on ${Kl(e)}`))}frameFocusedObject(e){if(!this.camera||!this.controls)return;const t=e==="sun"?this.sun:e===Ge.id?this.moonMesh:this.planetRoots.get(e);if(!t)return;const n=t.getWorldPosition(new L),s=Zt.degToRad(this.camera.fov/2),a=Math.atan(Math.tan(s)*Math.max(.1,this.camera.aspect)),r=Math.max(Zt.degToRad(8),Math.min(s,a)),o=e==="sun"?.2:e==="saturn"?.22:.18,l=Math.max(12e-5,this.objectVisualRadius(e)/(o*Math.tan(r))),c=e==="sun"?new L(0,.28,1).normalize():(()=>{const h=n.clone();return h.lengthSq()<1e-8&&h.set(1,0,0),h.normalize(),new L(-h.z,.22,h.x).normalize()})();this.controls.target.copy(n),this.camera.position.copy(n).add(c.multiplyScalar(l)),this.camera.lookAt(n),this.controls.update()}ensureSpacecraftMission(){if(this.spacecraftMission)return this.spacecraftMission;if(!(!this.scene||!this.camera||!this.controls||!this.labelLayer))return this.spacecraftMission=new Qv({scene:this.scene,camera:this.camera,controls:this.controls,labelLayer:this.labelLayer,mapAu:e=>this.mapAuVector(e.x,e.y,e.z),onStatus:e=>this.context?.onStatus?.(e)}),this.spacecraftMission}setMission(e){if(this.fallback){this.fallback.setMission(e);return}if(!e?.plan){this.spacecraftMission?.setMission(void 0),this.requestRender();return}e.active&&(this.viewMode="free",this.applyViewVisibility()),this.ensureSpacecraftMission()?.setMission(e),this.requestRender()}setMissionCamera(e,t){if(this.fallback){this.fallback.setMissionCamera(e,t);return}this.spacecraftMission?.setCamera(e,t),this.requestRender()}getMissionState(){return this.fallback?.getMissionState()??this.spacecraftMission?.getState()}createSnapshot(){return this.fallback?this.fallback.createSnapshot():{protocolVersion:"1.0",templateId:this.manifest.id,templateVersion:this.manifest.version,parameters:{...this.parameters},simulationDays:this.simulationDays,seed:this.context?.seed??Mr,focusedObject:this.focusedObject,viewMode:this.viewMode,playing:this.playing,mission:this.spacecraftMission?.getSnapshot(),clock:{epochIso:yr,playbackRateDaysPerSecond:this.playbackRate,direction:this.playbackRate<0?-1:1,complexity:"basic"},camera:this.camera&&this.controls?{position:this.camera.position.toArray(),target:this.controls.target.toArray()}:void 0}}async restoreSnapshot(e){if(e.templateId!==this.manifest.id)throw new Error("Project template is not compatible with this runtime.");if(this.fallback){this.parameters={...this.parameters,...e.parameters},this.fallback.restoreSnapshot(e);return}this.setParameters(e.parameters),this.setPlaybackRate(e.clock?.playbackRateDaysPerSecond??Je(e.parameters,"timeScale",1)),this.setSimulationTime(e.simulationDays),this.setMission(e.mission),this.focusedObject=e.focusedObject??"sun",e.playing===!1?this.pause():this.play();const t=e.viewMode??(this.focusedObject!=="sun"||e.camera&&Math.hypot(...e.camera.position.map((n,s)=>n-e.camera.target[s]))<35?"focus":"overview");t==="free"&&e.camera&&this.camera&&this.controls?(this.viewMode="free",this.camera.position.fromArray(e.camera.position),this.controls.target.fromArray(e.camera.target),this.controls.update(),this.applyViewVisibility(),this.context?.onFocusChange?.(this.focusedObject),this.applyQuality()):t==="overview"?this.frameOverview():this.focusObject(this.focusedObject),this.requestRender()}getVisualDiagnostics(){const e=mt(this.parameters),t=Je(this.parameters,"distanceScale",1),n=this.planetVisualRadius(Wt),s=e==="real-scale"?Pu/ta*1.05*t:e==="real-distance"?Ar(je,t):1.35*this.sunVisualScale(),a=Vt(this.parameters),r=this.adaptiveQuality.snapshot(),o=this.fallback?.getViewDiagnostics(),l={renderer:this.fallback?"canvas-2d":"webgl",requestedQuality:a,effectiveQuality:this.fallback?o?.effectiveQuality??a:a==="auto"?r.tier:a,autoQualityTier:this.fallback?"normal":r.tier,softwareRenderer:this.fallback?!1:r.softwareRenderer,measuredFps:this.fallback?o?.measuredFps??0:r.fps,averageFrameMs:this.fallback?o?.averageFrameMs??0:r.averageFrameMs,scaleMode:e,focusedObject:this.fallback?o?.focusedObject??this.focusedObject:this.focusedObject,viewMode:this.fallback?o?.viewMode??this.viewMode:this.viewMode,focusDecorationsHidden:this.fallback?o?.focusDecorationsHidden??!1:this.viewMode!=="focus"||!this.orbitGroup.visible&&!this.moonOrbit?.visible&&!this.asteroidBelt?.visible,systemVisualRadius:this.systemVisualRadius(),sunVisualRadius:s,earthVisualRadius:n,moonVisualRadius:this.moonBodyVisualRadius(n),moonOrbitVisualRadius:this.moonOrbitVisualRadius(n),cameraDistance:this.camera&&this.controls?this.camera.position.distanceTo(this.controls.target):o?.cameraDistance??0,cameraAspect:this.camera?.aspect??0,mission:this.fallback?.getMissionDiagnostics()??this.spacecraftMission?.getDiagnostics()};if(this.fallback||!this.camera)return{...l,objects:[]};this.scene?.updateMatrixWorld(!0),this.camera.updateMatrixWorld(!0);const h=[{id:"sun",object:this.sun,visualRadius:s},...je.map(d=>({id:d.id,object:this.planetRoots.get(d.id),visualRadius:this.planetVisualRadius(d)})),{id:Ge.id,object:this.moonMesh,visualRadius:this.moonBodyVisualRadius(n)}].flatMap(({id:d,object:u,visualRadius:m})=>{if(!u)return[];const g=u.getWorldPosition(new L),x=g.clone().project(this.camera),p=this.objectVisualRadius(d),f=Math.max(1e-5,g.distanceTo(this.camera.position)),S=p/f*(this.resizeState.height/(2*Math.tan(Zt.degToRad(this.camera.fov/2)))),T=S*2/Math.max(1,this.resizeState.width),y=S*2/Math.max(1,this.resizeState.height);return[{id:d,worldX:g.x,worldY:g.y,worldZ:g.z,distanceFromOrigin:g.length(),visualRadius:m,visualExtent:p,ndcX:x.x,ndcY:x.y,ndcZ:x.z,inViewport:Math.abs(x.x)<=.96&&Math.abs(x.y)<=.96&&x.z>=-1&&x.z<=1,projectedRadiusNdcX:T,projectedRadiusNdcY:y,fullyInViewport:Math.abs(x.x)+T<=.96&&Math.abs(x.y)+y<=.96&&x.z>=-1&&x.z<=1}]});return{...l,objects:h}}validate(){if(this.fallback)return this.fallback.validate();const e=[];this.renderer?.capabilities.isWebGL2||e.push({severity:"warning",code:"WEBGL2_UNAVAILABLE",message:"WebGL2 is unavailable. The preview is running with reduced compatibility."}),Number.isFinite(this.simulationDays)||e.push({severity:"error",code:"INVALID_TIME",message:"Simulation time is invalid."});const t=this.spacecraftMission?.getSnapshot();t?.active&&!t.plan?.valid&&e.push({severity:"error",code:"MISSION_PLAN_INVALID",message:t.plan?.rejectionReason??"The active mission plan is invalid."});const n=this.planetRoots.get("earth");return(!this.moonMesh||this.moonMesh.parent!==this.moonOrbitPivot||this.moonOrbitPlane?.parent!==n)&&e.push({severity:"error",code:"MOON_HIERARCHY_INVALID",message:"The Moon is not attached to the Earth system."}),{valid:!e.some(s=>s.severity==="error"),issues:e}}destroy(){this.destroyed=!0,window.clearTimeout(this.workerWatchdog),this.fallback?.destroy(),this.controls?.removeEventListener("change",this.requestRender),this.controls?.removeEventListener("start",this.handleControlsStart),cancelAnimationFrame(this.animationFrame),this.animationFrame=0,this.worker?.terminate(),this.pendingSimulationSteps.forEach(e=>{e.reject(new Error("Simulation runtime was destroyed before the deterministic step completed."))}),this.pendingSimulationSteps.clear(),this.renderer?.domElement.removeEventListener("pointerup",this.handlePointerUp),window.removeEventListener("mcp:set-3d-view",this.handleQaView),this.controls?.dispose(),this.spacecraftMission?.dispose(),this.planetPolish?.dispose(),this.moonVisual?.dispose(),this.scene?.traverse(e=>{if(e instanceof rt||e instanceof Zs||e instanceof ml){e.geometry.dispose();const t=e.material;(Array.isArray(t)?t:[t]).forEach(s=>{s.userData.resourceOwner||s.dispose()})}}),this.realTextures?.dispose(),this.visualAssets?.dispose(),this.renderer?.dispose(),this.context?.container.replaceChildren()}}const Du="scientific-standalone-style",lx=`
:root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--line:#9dbfe22a;--accent:#63d4ff;--muted:#91a8c1}
*{box-sizing:border-box}html,body,#app{width:100%;height:100%;margin:0;overflow:hidden;background:#020610;color:#eef6ff}
button,input,select{font:inherit;color:inherit}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.standalone-shell{position:relative;width:100%;height:100%;overflow:hidden;background:#020610}.standalone-scene{position:absolute;inset:0}.runtime-stage{position:relative;width:100%;height:100%;overflow:hidden}
.solar-canvas{display:block;width:100%;height:100%;touch-action:none}.planet-label-layer{position:absolute;inset:0;pointer-events:none;z-index:2}.planet-label{position:absolute;padding:4px 7px;border:1px solid #ffffff20;border-radius:999px;background:#07111fd4;color:#eef6ff;font-size:9px;line-height:1;white-space:nowrap;transform:translate(-50%,-50%);backdrop-filter:blur(8px)}.planet-label.is-focused{border-color:#63d4ff88;background:#071d30ee}
.standalone-control-button{position:absolute;z-index:8;right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));display:flex;min-width:118px;height:48px;padding:0 16px;align-items:center;justify-content:center;border:1px solid #63d4ff66;border-radius:16px;background:linear-gradient(145deg,#123a59f5,#071829f5);box-shadow:0 16px 42px #0009,0 0 28px #2d9cff20;cursor:pointer;font-size:13px;font-weight:800}
.standalone-chip{position:absolute;z-index:6;top:max(12px,env(safe-area-inset-top));left:50%;max-width:calc(100% - 100px);padding:7px 10px;border:1px solid #ffffff18;border-radius:999px;background:#07111fc7;color:#b7cae0;font-size:9px;transform:translateX(-50%);backdrop-filter:blur(10px);pointer-events:none}
.standalone-panel{position:fixed;z-index:10;inset:0;display:grid;width:100vw;max-width:none;height:100dvh;max-height:none;margin:0;padding:12px;border:0;background:transparent;color:#eef6ff}.standalone-panel:not([open]){display:none}.standalone-panel::backdrop{background:#000815c9}
.standalone-surface{position:relative;display:grid;grid-template-rows:auto minmax(0,1fr) auto;width:min(760px,calc(100% - 24px));height:min(780px,calc(100% - 24px));margin:auto;overflow:hidden;border:1px solid #80bce83b;border-radius:24px;background:radial-gradient(circle at 85% -10%,#2c8fe329,transparent 32%),linear-gradient(180deg,#081423fc,#040c17fc);box-shadow:0 40px 120px #000c}
.standalone-header{display:grid;grid-template-columns:minmax(0,1fr) 44px;align-items:center;gap:10px;padding:15px 17px;border-bottom:1px solid var(--line)}.standalone-header small{display:block;color:var(--muted);font-size:8px;letter-spacing:.1em;text-transform:uppercase}.standalone-header strong{display:block;margin-top:3px;font-size:15px}.standalone-close{display:grid;width:44px;height:44px;padding:0;place-items:center;border:1px solid var(--line);border-radius:10px;background:#ffffff0a;cursor:pointer;font-size:22px}
.standalone-body{min-height:0;overflow:auto;padding:13px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;align-items:start;scrollbar-width:thin}.standalone-card{min-width:0;padding:13px;border:1px solid var(--line);border-radius:15px;background:linear-gradient(145deg,#ffffff09,#ffffff03)}.standalone-card.is-wide{grid-column:1/-1}.standalone-card small{display:block;color:var(--muted);font-size:8px}.standalone-card strong{display:block;margin-top:4px;font-size:12px}.standalone-date{font-size:16px!important}.standalone-utc{margin-top:5px!important}.standalone-actions{display:flex;gap:7px;margin-top:11px}.standalone-actions button,.standalone-card select,.standalone-card input:not([type=range]),.standalone-apply{min-height:44px;border:1px solid var(--line);border-radius:10px;background:#ffffff0a;padding:0 10px}.standalone-actions button{flex:1;cursor:pointer}.standalone-primary{border-color:#63d4ff77!important;background:linear-gradient(135deg,#2ca7ff,#43c5dd)!important;color:#00111d!important;font-weight:800}.standalone-label{display:grid;gap:6px;margin-top:10px;color:var(--muted);font-size:8px}.standalone-label select,.standalone-label input{width:100%}
.standalone-presets{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:10px}.standalone-presets button{min-height:40px;padding:0 6px;border:1px solid var(--line);border-radius:9px;background:#ffffff08;color:#dcecff;cursor:pointer;font-size:8px}.standalone-rate{display:flex;align-items:center;justify-content:space-between;gap:8px}.standalone-rate output{color:var(--accent);font-size:9px}.standalone-card input[type=range]{width:100%;min-height:44px;accent-color:var(--accent)}.standalone-apply{width:100%;margin-top:8px;cursor:pointer}.standalone-direction{width:100%;margin-top:9px;cursor:pointer}.standalone-direction.is-reverse{border-color:#f6c56666;color:#f6c566}
.standalone-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:58px;padding:9px 13px calc(9px + env(safe-area-inset-bottom));border-top:1px solid var(--line);background:#030a12b8}.standalone-status{overflow:hidden;color:var(--muted);font-size:8px;text-overflow:ellipsis;white-space:nowrap}.standalone-footer button{min-height:40px;padding:0 14px;border:1px solid #63d4ff77;border-radius:10px;background:linear-gradient(135deg,#2ca7ff,#43c5dd);color:#00111d;font-weight:800;cursor:pointer}
.standalone-science-summary{margin-top:10px;padding:10px;border:1px solid var(--line);border-radius:10px;background:#020a14;color:#cfe2f5;font-size:9px;line-height:1.55}.standalone-science-summary strong{font-size:11px}.standalone-science-summary small{margin-top:4px}.standalone-event-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px;align-items:end}.standalone-event-row button{min-height:44px;padding:0 11px}.standalone-reading-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:10px}.standalone-reading-grid div{padding:9px;border:1px solid var(--line);border-radius:9px;background:#020a14}.standalone-reading-grid span{display:block;color:var(--muted);font-size:7px}.standalone-reading-grid strong{display:block;margin-top:4px;font-size:9px}.standalone-travel-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.standalone-travel-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:9px}.standalone-travel-actions button{min-height:44px;border:1px solid var(--line);border-radius:10px;background:#ffffff0a;cursor:pointer}.standalone-travel-actions .standalone-primary{border-color:#72e8be77!important;background:linear-gradient(135deg,#36b894,#72e8be)!important}.standalone-mission-progress{height:8px;margin:9px 0;overflow:hidden;border:1px solid var(--line);border-radius:999px;background:#020811}.standalone-mission-progress i{display:block;height:100%;background:linear-gradient(90deg,#2d9cff,#63d4ff,#72e8be)}.standalone-error{display:grid;place-items:center;width:100%;height:100%;padding:24px;color:#d8e7f8;text-align:center}
@media(max-width:720px){.standalone-panel{align-items:end;padding:0}.standalone-surface{align-self:end;width:100%;height:min(85dvh,760px);margin:0;border-width:1px 0 0;border-radius:22px 22px 0 0}.standalone-header{padding-top:calc(12px + env(safe-area-inset-top));padding-right:calc(12px + env(safe-area-inset-right));padding-left:calc(12px + env(safe-area-inset-left))}.standalone-body{grid-template-columns:1fr;padding-right:calc(12px + env(safe-area-inset-right));padding-left:calc(12px + env(safe-area-inset-left))}.standalone-card.is-wide{grid-column:auto}.standalone-footer{padding-right:calc(12px + env(safe-area-inset-right));padding-left:calc(12px + env(safe-area-inset-left))}.standalone-presets{grid-template-columns:repeat(2,minmax(0,1fr))}.standalone-date{font-size:14px!important}}
@media(prefers-reduced-motion:reduce){*{transition-duration:.01ms!important;animation-duration:.01ms!important}}
`;function Lu(){if(document.getElementById(Du))return;const i=document.createElement("style");i.id=Du,i.textContent=lx,document.head.append(i)}function It(i,e){const t=document.createElement("option");return t.value=i,t.textContent=e,t}function yn(i,e){const t=document.createElement("button");return t.type="button",t.textContent=i,e&&(t.id=e),t}function cx(i){Lu();const e=document.createElement("main");e.className="standalone-shell";const t=document.createElement("div");t.className="standalone-scene",t.id="standalone-scene";const n=document.createElement("div");n.className="standalone-chip",n.textContent=`Solar System Explorer · v${Jt}`;const s=yn("☰ Controls","standalone-control-button");s.className="standalone-control-button",s.setAttribute("aria-label","Open Solar System controls");const a=document.createElement("dialog");a.className="standalone-panel",a.setAttribute("aria-labelledby","standalone-control-title");const r=document.createElement("div");r.className="standalone-surface";const o=document.createElement("header");o.className="standalone-header";const l=document.createElement("div");l.innerHTML=`<small>Single-file offline runtime</small><strong>Control Center · ${$u}</strong>`;const c=l.querySelector("strong");c&&(c.id="standalone-control-title");const h=yn("×","standalone-close");h.className="standalone-close",h.setAttribute("aria-label","Close controls"),o.append(l,h);const d=document.createElement("div");d.className="standalone-body";const u=document.createElement("article");u.className="standalone-card is-wide";const m=document.createElement("strong");m.className="standalone-date",m.textContent="01 Jan 2026, 00:00:00";const g=document.createElement("small");g.className="standalone-utc",g.textContent="UTC";const x=document.createElement("div");x.className="standalone-actions";const p=yn("Pause","standalone-play");p.className="standalone-primary";const f=yn("Reset","standalone-reset");x.append(p,f),u.append(m,g,x);const S=document.createElement("article");S.className="standalone-card";const T=document.createElement("div");T.className="standalone-rate",T.innerHTML="<div><small>Simulation Clock</small><strong>Quick time presets</strong></div>";const y=document.createElement("output");y.textContent="1 day/s",T.append(y);const R=document.createElement("div");R.className="standalone-presets";const b=Zu.map(Y=>{const se=yn(Y.label);return se.dataset.rate=String(Y.daysPerSecond),R.append(se),se}),C=yn("Direction · Forward","standalone-direction");C.className="standalone-direction";const v=document.createElement("input");v.type="range",v.id="standalone-timeline",v.min="-36525",v.max="36525",v.step="0.001",v.value="0",v.setAttribute("aria-label","Simulation timeline"),S.append(T,R,C,v);const w=document.createElement("article");w.className="standalone-card",w.innerHTML="<small>Exact time</small><strong>Jump to date and time</strong>";const D=document.createElement("label");D.className="standalone-label",D.textContent="Local date and time";const P=document.createElement("input");P.type="datetime-local",P.step="1",D.append(P);const U=yn("Jump to selected time","standalone-date-apply");U.className="standalone-apply",w.append(D,U);const X=document.createElement("article");X.className="standalone-card",X.innerHTML="<small>Objects & View</small><strong>Focus and render quality</strong>";const q=document.createElement("label");q.className="standalone-label",q.textContent="Focus object";const B=document.createElement("select");B.id="standalone-focus",B.setAttribute("aria-label","Focus celestial object"),B.append(...Ss.map(Y=>It(Y.id,Y.name))),q.append(B);const W=document.createElement("label");W.className="standalone-label",W.textContent="Render quality";const H=document.createElement("select");H.id="standalone-quality",H.setAttribute("aria-label","Render quality"),H.append(It("low","Low"),It("auto","Auto"),It("high","High")),W.append(H);const Z=document.createElement("label");Z.className="standalone-label",Z.textContent="Visual scale";const J=document.createElement("select");J.id="standalone-scale",J.setAttribute("aria-label","Visual scale"),J.append(It("learning","Learning Scale"),It("real-distance","Real Distance"),It("real-scale","Real Scale")),Z.append(J);const oe=document.createElement("div");oe.className="standalone-science-summary",X.append(q,W,Z,oe);const ne=document.createElement("article");ne.className="standalone-card",ne.innerHTML="<small>Learn Mode</small><strong>Phases, events and guided observation</strong>";const fe=document.createElement("label");fe.className="standalone-label",fe.textContent="Experience";const Ne=document.createElement("select");Ne.id="standalone-experience",Ne.append(It("explore","Explore"),It("learn","Learn"),It("travel","Travel")),fe.append(Ne);const Ze=document.createElement("div");Ze.className="standalone-science-summary";const Ve=document.createElement("label");Ve.className="standalone-label",Ve.textContent="Upcoming event";const K=document.createElement("select");K.id="standalone-event",Ve.append(K);const re=yn("Jump to event","standalone-event-jump");re.className="standalone-apply",ne.append(fe,Ze,Ve,re);const te=document.createElement("article");te.className="standalone-card is-wide",te.innerHTML="<small>Travel Mode</small><strong>Earth-origin robotic mission</strong>";const Ee=document.createElement("div");Ee.className="standalone-travel-grid";const Re=document.createElement("label");Re.className="standalone-label",Re.textContent="Destination";const xe=document.createElement("select");xe.id="standalone-mission-destination",xe.append(...je.map(Y=>It(Y.id,Y.name))),Re.append(xe);const Ye=document.createElement("label");Ye.className="standalone-label",Ye.textContent="Mission type";const ae=document.createElement("select");ae.id="standalone-mission-type",ae.append(It("flyby","Fly-by"),It("orbiter","Orbiter")),Ye.append(ae);const Le=document.createElement("label");Le.className="standalone-label",Le.textContent="Camera";const Oe=document.createElement("select");Oe.id="standalone-mission-camera",Oe.append(It("follow","Follow"),It("free","Free")),Le.append(Oe);const Be=document.createElement("label");Be.className="standalone-label",Be.textContent="Follow distance";const nt=document.createElement("select");nt.id="standalone-mission-follow",nt.append(It("near","Near"),It("standard","Standard"),It("far","Far")),Be.append(nt),Ee.append(Re,Ye,Le,Be);const ot=document.createElement("div");ot.className="standalone-science-summary",ot.id="standalone-mission-summary";const dt=document.createElement("div");dt.className="standalone-reading-grid",dt.id="standalone-mission-dashboard";const gt=document.createElement("div");gt.className="standalone-travel-actions";const it=yn("Plan route","standalone-mission-plan"),lt=yn("Start mission","standalone-mission-start");lt.className="standalone-primary",gt.append(it,lt),te.append(Ee,ot,dt,gt);const I=document.createElement("article");I.className="standalone-card",I.innerHTML="<small>Ground Observer</small><strong>Altitude, azimuth and local visibility</strong>";const xt=document.createElement("label");xt.className="standalone-label",xt.textContent="Observer location";const Xe=document.createElement("select");Xe.id="standalone-observer",xt.append(Xe);const A=document.createElement("div");A.className="standalone-reading-grid",I.append(xt,A);const _=document.createElement("article");_.className="standalone-card is-wide",_.innerHTML="<small>Sources & Accuracy</small><strong>Installed offline astronomy provider</strong>";const E=document.createElement("div");E.className="standalone-science-summary",_.append(E),d.append(u,S,w,X,ne,te,I,_);const O=document.createElement("footer");O.className="standalone-footer";const V=document.createElement("div");V.className="standalone-status",V.id="standalone-status",V.setAttribute("role","status"),V.textContent="Starting offline runtime…";const ee=yn("Close");O.append(V,ee),r.append(o,d,O),a.append(r),e.append(t,n,s,a),i.replaceChildren(e);const ie=()=>{a.open||a.showModal(),a.classList.add("is-open"),requestAnimationFrame(()=>h.focus())},$=()=>{a.classList.remove("is-open"),a.open&&a.close()};return s.addEventListener("click",ie),h.addEventListener("click",$),a.addEventListener("click",Y=>{Y.target===a&&$()}),a.addEventListener("close",()=>a.classList.remove("is-open")),ee.addEventListener("click",$),{scene:t,controlButton:s,panel:a,closeButton:h,playButton:p,resetButton:f,focusSelect:B,qualitySelect:H,scaleSelect:J,experienceSelect:Ne,eventSelect:K,eventJumpButton:re,moonPhase:Ze,objectSummary:oe,missionDestinationSelect:xe,missionTypeSelect:ae,missionPlanButton:it,missionStartButton:lt,missionCameraSelect:Oe,missionFollowSelect:nt,missionSummary:ot,missionDashboard:dt,observerSelect:Xe,observerReading:A,accuracySummary:E,dateInput:P,dateApplyButton:U,directionButton:C,timelineInput:v,rateOutput:y,simulationDate:m,simulationUtc:g,presetButtons:b,status:V,open:ie,close:$,setStatus(Y){V.textContent=Y},destroy(){e.remove()}}}function Iu(i,e){Lu();const t=document.createElement("div");t.className="standalone-error",t.textContent=e,i.replaceChildren(t)}const hx="__SCIENCE_STANDALONE_CONFIG__",Nu="__SCIENCE_STANDALONE_RUNTIME__",ux="__SCIENCE_STANDALONE_RUNTIME_VERSION__";function Uu(i){return{width:Math.max(1,i.clientWidth||window.innerWidth),height:Math.max(1,i.clientHeight||window.innerHeight),pixelRatio:Math.max(1,window.devicePixelRatio||1)}}function dx(i){const e=new Map;for(const[t,n]of Object.entries(i.textures)){if(!n||!(t in In))continue;const s=t;e.set(In[s],n)}return t=>e.get(t)}function Sn(i,e){const t=document.createElement("div"),n=document.createElement("span");n.textContent=i;const s=document.createElement("strong");return s.textContent=e,t.append(n,s),t}function fx(i){return`${new Intl.DateTimeFormat("en-US",{dateStyle:"medium",timeZone:"UTC"}).format(new Date(i.dateIso))} · ${i.title}`}async function px(i,e,t){if(e.version!==Jt)throw new Error(`Standalone bundle version ${Jt} does not match export version ${e.version}.`);if(e.snapshot.templateVersion!==Jt)throw new Error(`Snapshot version ${e.snapshot.templateVersion} does not match standalone runtime ${Jt}.`);const n=cx(i),s=new ox({createSimulationWorker:t.createSimulationWorker,textureSource:dx(e)});let a=e.snapshot.playing!==!1,r=!1,o=e.snapshot.simulationDays;const l=e.snapshot.clock?.playbackRateDaysPerSecond??(Number(e.snapshot.parameters.timeScale)||1);let c=l<0?-1:1,h=Math.max(1/1440,Math.abs(l)),d=e.snapshot.experience==="travel"?"travel":e.snapshot.experience==="learn"?"learn":"explore",u=e.snapshot.observer?.location??As.active(),m=e.snapshot.observer?.atmosphere??!0,g=e.snapshot.observer?.lightPollution??!1,x=e.snapshot.observer?.presentation??"enhanced-learning",p=[],f,S=e.snapshot.mission,T=o;const y=new Set;let R=0,b,C=0,v;const w=new Intl.DateTimeFormat("en-SG",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1,timeZone:"UTC"}),D=Dd(),P=()=>s.resize(Uu(n.scene)),U=E=>{n.qualitySelect.value=E,s.setParameters({quality:E})},X=E=>{n.scaleSelect.value=E,s.setParameters({scaleMode:E,visualMode:E==="learning"?"educational":"scientific"}),document.documentElement.dataset.scaleMode=E},q=E=>{d=E,n.experienceSelect.value=E,document.documentElement.dataset.experience=E},B=E=>{c=E<0?-1:1,h=Math.max(1/1440,Math.abs(E)),s.setPlaybackRate(Qu(h,c)),n.rateOutput.value=td(c*h),n.directionButton.textContent=c===-1?"Direction · Reverse":"Direction · Forward",n.directionButton.classList.toggle("is-reverse",c===-1)},W=E=>{a=E,n.playButton.textContent=a?"Pause":"Play",a?s.play():s.pause()},H=E=>{S=E?.plan?{...E,realism:{...E.realism}}:void 0,s.setMission(S),S?.plan&&(n.missionDestinationSelect.value=S.plan.destinationId,n.missionTypeSelect.value=S.plan.missionType,n.missionCameraSelect.value=S.cameraMode,n.missionFollowSelect.value=S.followDistance),ne()},Z=(E,O=S?.followDistance??"standard")=>{S&&(S={...S,cameraMode:E,followDistance:O},s.setMissionCamera(E,O),s.setMission(S),n.missionCameraSelect.value=E,n.missionFollowSelect.value=O,ne())},J=()=>{const E=n.missionDestinationSelect.value,O=E==="earth"?"orbiter":n.missionTypeSelect.value==="flyby"?"flyby":"orbiter";n.missionTypeSelect.value=O;const V=Gd.plan({destinationId:E,missionType:O,simulationDays:o,realism:S?.realism??Dr});y.clear(),H({plan:V,active:!1,cameraMode:S?.cameraMode??"follow",followDistance:S?.followDistance??"standard",realism:{...S?.realism??Dr}}),n.setStatus(V.valid?`Route planned · Earth to ${V.destinationName}.`:`Route rejected · ${V.rejectionReason??"No valid route"}`)},oe=()=>{const E=S?.plan;if(!E?.valid||!S){n.setStatus(E?.rejectionReason??"Plan a valid mission first.");return}S={...S,active:!0},s.setMission(S),s.setMissionCamera(S.cameraMode,S.followDistance),o<E.departureSimulationDays&&s.setSimulationTime(E.departureSimulationDays),B(Math.max(1/24,Math.min(2048,E.durationDays/58))),q("travel"),W(!0),n.setStatus(`Mission started · ${E.destinationName}.`),ne()};function ne(){const E=S?.plan;if(n.missionSummary.replaceChildren(),n.missionDashboard.replaceChildren(),!E){const se=document.createElement("small");se.textContent="Choose a destination and plan a supported route.",n.missionSummary.append(se),n.missionStartButton.disabled=!0;return}const O=document.createElement("strong");O.textContent=E.valid?`Earth → ${E.destinationName} · ${E.routeKind==="earth-orbit"?"Earth orbit":"Hohmann transfer"}`:"Route rejected";const V=document.createElement("small");V.textContent=E.valid?`${E.durationDays.toFixed(1)} days · ${E.requiredDeltaVKmS.toFixed(2)} km/s Delta-v · phase residual ${E.launchPhaseResidualDeg.toFixed(4)}°. Direct and gravity-assist routes are unavailable without dedicated solvers.`:E.rejectionReason??"No valid route.",n.missionSummary.append(O,V);const ee=s.getMissionState()??pa.stateAt(E,o),ie=Math.round(ee.progress*1e3)/10,$=document.createElement("div");$.className="standalone-mission-progress";const Y=document.createElement("i");Y.style.width=`${ie}%`,$.append(Y),n.missionDashboard.append(Sn("Status",ee.status.replaceAll("-"," ")),Sn("Progress",`${ie.toFixed(1)}%`),Sn("Remaining",`${ee.remainingDays.toFixed(1)} days`),Sn("Path left",`${ee.remainingDistanceAu.toFixed(3)} AU`)),n.missionSummary.append($),n.missionStartButton.disabled=!E.valid,n.missionStartButton.textContent=S?.active?"Restart mission":"Start mission",document.documentElement.dataset.missionActive=String(!!S?.active),document.documentElement.dataset.missionDestination=E.destinationId,document.documentElement.dataset.missionStatus=ee.status}const fe=()=>{p=Vi.catalogue(o,n.focusSelect.value||"earth"),n.eventSelect.replaceChildren(...p.map(E=>{const O=new Option(fx(E),E.id);return O.dataset.simulationDays=String(E.simulationDays),O.dataset.objectId=E.objectId,O})),f&&p.some(E=>E.id===f?.id)&&(n.eventSelect.value=f.id)},Ne=()=>{const E=n.focusSelect.value||"sun",O=wd(E),V=Ut.bodyState(E,o),ee=Ut.moonPhase(o);n.moonPhase.replaceChildren(Sn("Moon phase",ee.phaseName),Sn("Illuminated",`${(ee.illuminatedFraction*100).toFixed(1)}%`),Sn("Elongation",`${ee.elongationDeg.toFixed(1)}°`)),n.moonPhase.className="standalone-reading-grid",n.objectSummary.replaceChildren();const ie=document.createElement("strong");ie.textContent=`${O.name} · ${O.objectType}`;const $=document.createElement("small");$.textContent=`${O.description} Radius ${O.radiusKm.toLocaleString("en-US")} km · current Sun distance ${V.heliocentricDistanceAu.toFixed(5)} AU.`,n.objectSummary.append(ie,$);const Y=As.compare(E,o,[u])[0];n.observerReading.replaceChildren(Sn("Altitude",`${Y.horizontal.altitudeDeg.toFixed(1)}°`),Sn("Azimuth",`${Y.horizontal.azimuthDeg.toFixed(1)}° ${Y.horizontal.cardinal}`),Sn("Visibility",Y.horizontal.visibleAboveHorizon?"Above horizon":"Below horizon"),Sn("Local time",Y.localTimeLabel));const se=Ut.metadata;n.accuracySummary.replaceChildren();const ye=document.createElement("strong");ye.textContent=`${xc(o)?"Educational Accuracy":"Outside Verified Range"} · ${se.name} ${se.version}`;const ce=document.createElement("small");ce.textContent=`${se.supportedStartIso.slice(0,10)} to ${se.supportedEndIso.slice(0,10)} · ${D.passCount}/${D.checks.length} internal regression checks passed. ${se.expectedError}`,n.accuracySummary.append(ye,ce),document.documentElement.dataset.accuracy=xc(o)?"educational":"outside-range",document.documentElement.dataset.observerAtmosphere=String(m),document.documentElement.dataset.observerLightPollution=String(g),document.documentElement.dataset.observerPresentation=x},Ze=()=>{C=typeof performance>"u"?Date.now():performance.now();const E=zi(o);n.simulationDate.textContent=w.format(E),n.simulationUtc.textContent=`UTC · ${E.toISOString()}`,n.timelineInput.value=String(Math.max(-36525,Math.min(36525,o))),document.activeElement!==n.dateInput&&(n.dateInput.value=ju(o)),document.documentElement.dataset.simulationDays=o.toFixed(6),n.panel.open&&Ne()},Ve=()=>{const O=(typeof performance>"u"?Date.now():performance.now())-C;O>=250?(window.clearTimeout(v),v=void 0,Ze()):v===void 0&&(v=window.setTimeout(()=>{v=void 0,Ze()},Math.max(0,250-O)))},K=E=>{const O=T;if(T=E,o=E,S?.active&&S.plan&&S.realism.autoPauseKeyEvents){const ie=pa.crossedEvents(S.plan,O,E).find($=>$.id!=="departure"&&!y.has($.id));ie&&(y.add(ie.id),W(!1),n.setStatus(`Mission paused · ${ie.label}.`))}Ve();const V=typeof performance>"u"?Date.now():performance.now();if(n.panel.open){const ee=V-R;ee>=250?(window.clearTimeout(b),b=void 0,R=V,ne()):b===void 0&&(b=window.setTimeout(()=>{b=void 0,R=typeof performance>"u"?Date.now():performance.now(),n.panel.open&&ne()},Math.max(0,250-ee)))}};await s.mount({container:n.scene,viewport:Uu(n.scene),seed:e.snapshot.seed??Mr,onStatus:E=>n.setStatus(E),onSimulationTime:K,onFocusChange:E=>{n.focusSelect.value=E,document.documentElement.dataset.focusedObject=E,fe(),Ne()}}),await s.restoreSnapshot(e.snapshot),n.controlButton.addEventListener("click",()=>{Ze(),ne()});const re=String(e.snapshot.parameters.quality??"auto");U(re==="low"||re==="high"?re:"auto");const te=String(e.snapshot.parameters.scaleMode??"learning");if(X(te==="real-distance"||te==="real-scale"?te:"learning"),q(d),n.missionDestinationSelect.value=S?.plan?.destinationId??"mars",n.missionTypeSelect.value=S?.plan?.missionType??"orbiter",n.missionCameraSelect.value=S?.cameraMode??"follow",n.missionFollowSelect.value=S?.followDistance??"standard",S?.plan?H(S):ne(),n.focusSelect.value=e.snapshot.focusedObject??"sun",n.observerSelect.replaceChildren(...As.list().map(E=>new Option(E.name,E.id))),!As.list().some(E=>E.id===u.id)){const E=new Option(u.name,u.id);n.observerSelect.append(E)}n.observerSelect.value=u.id,B(l),W(a),fe(),e.snapshot.selectedEvent&&(f=p.find(E=>E.id===e.snapshot.selectedEvent?.id),f&&(n.eventSelect.value=f.id)),K(e.snapshot.simulationDays);const Ee=()=>{R=0,ne()},Re=()=>W(!a),xe=()=>{s.reset(),o=0,n.focusSelect.value="sun",f=void 0,fe(),K(0)},Ye=()=>s.focusObject(n.focusSelect.value),ae=()=>U(n.qualitySelect.value),Le=()=>X(n.scaleSelect.value),Oe=()=>q(n.experienceSelect.value==="travel"?"travel":n.experienceSelect.value==="learn"?"learn":"explore"),Be=()=>B(c===1?-h:h),nt=()=>s.setSimulationTime(Number(n.timelineInput.value)),ot=()=>{const E=Ju(n.dateInput.value);if(E===void 0){n.setStatus("Choose a valid date and time.");return}s.setSimulationTime(E),fe(),n.setStatus("Simulation time updated.")},dt=()=>{const E=p.find(O=>O.id===n.eventSelect.value);E&&(f=E,s.setSimulationTime(E.simulationDays),s.focusObject(E.objectId),n.setStatus(`Jumped to ${E.title}.`))},gt=()=>{n.missionDestinationSelect.value==="earth"&&(n.missionTypeSelect.value="orbiter"),J()},it=()=>J(),lt=()=>Z(n.missionCameraSelect.value==="free"?"free":"follow",n.missionFollowSelect.value),I=()=>Z("follow",n.missionFollowSelect.value),xt=()=>{u=As.list().find(E=>E.id===n.observerSelect.value)??u,Ne()};n.controlButton.addEventListener("click",Ee),n.playButton.addEventListener("click",Re),n.resetButton.addEventListener("click",xe),n.focusSelect.addEventListener("change",Ye),n.qualitySelect.addEventListener("change",ae),n.scaleSelect.addEventListener("change",Le),n.experienceSelect.addEventListener("change",Oe),n.directionButton.addEventListener("click",Be),n.timelineInput.addEventListener("input",nt),n.dateApplyButton.addEventListener("click",ot),n.eventJumpButton.addEventListener("click",dt),n.missionDestinationSelect.addEventListener("change",gt),n.missionTypeSelect.addEventListener("change",it),n.missionPlanButton.addEventListener("click",J),n.missionStartButton.addEventListener("click",oe),n.missionCameraSelect.addEventListener("change",lt),n.missionFollowSelect.addEventListener("change",I),n.observerSelect.addEventListener("change",xt),n.presetButtons.forEach(E=>{E.addEventListener("click",()=>B(c*(Number(E.dataset.rate)||1)))}),window.addEventListener("resize",P);const Xe=typeof ResizeObserver>"u"?void 0:new ResizeObserver(P);Xe?.observe(n.scene),P();const A=()=>{r||(r=!0,window.clearTimeout(b),b=void 0,window.clearTimeout(v),v=void 0,Xe?.disconnect(),window.removeEventListener("resize",P),n.controlButton.removeEventListener("click",Ee),n.playButton.removeEventListener("click",Re),n.resetButton.removeEventListener("click",xe),n.focusSelect.removeEventListener("change",Ye),n.qualitySelect.removeEventListener("change",ae),n.scaleSelect.removeEventListener("change",Le),n.experienceSelect.removeEventListener("change",Oe),n.directionButton.removeEventListener("click",Be),n.timelineInput.removeEventListener("input",nt),n.dateApplyButton.removeEventListener("click",ot),n.eventJumpButton.removeEventListener("click",dt),n.missionDestinationSelect.removeEventListener("change",gt),n.missionTypeSelect.removeEventListener("change",it),n.missionPlanButton.removeEventListener("click",J),n.missionStartButton.removeEventListener("click",oe),n.missionCameraSelect.removeEventListener("change",lt),n.missionFollowSelect.removeEventListener("change",I),n.observerSelect.removeEventListener("change",xt),s.destroy(),n.destroy(),delete window[Nu])},_={version:Jt,focus(E){n.focusSelect.value=E,s.focusObject(E)},setQuality:U,setScaleMode:X,setExperience:q,setMission:H,setMissionCamera:Z,setSimulationTime(E){R=0,s.setSimulationTime(E),ne()},setPlaybackRate:B,play(){W(!0)},pause(){W(!1)},reset:xe,getMissionState:()=>s.getMissionState(),getSnapshot:()=>{const E=s.createSnapshot();return E.playing=a,E.clock={epochIso:e.snapshot.clock?.epochIso??"2026-01-01T00:00:00.000Z",playbackRateDaysPerSecond:c*h,direction:c,complexity:e.snapshot.clock?.complexity??"basic"},E.simulationDays=o,E.experience=d,E.mission=S,E.observer={location:{...u},atmosphere:m,lightPollution:g,presentation:x},E.selectedEvent=f?{id:f.id,type:f.type,simulationDays:f.simulationDays}:void 0,E},validate:()=>s.validate(),destroy:A};return window[Nu]=_,window.addEventListener("pagehide",E=>{E.persisted||A()}),document.documentElement.dataset.standaloneReady="true",document.documentElement.dataset.standaloneVersion=Jt,window.dispatchEvent(new CustomEvent("scientific-standalone-ready",{detail:{version:Jt}})),n.setStatus(`Solar System v${Jt} ready · Spacecraft Travel`),_}const _r=document.getElementById("app");if(window[ux]=Jt,!_r)throw new Error("Standalone application root #app is missing.");const Fu=window[hx];Fu?px(_r,Fu,{createSimulationWorker:()=>new qu}).catch(i=>{const e=i instanceof Error?i.message:String(i);console.error("Standalone runtime failed to start.",i),Iu(_r,`Standalone runtime failed to start: ${e}`),document.documentElement.dataset.standaloneReady="error"}):Iu(_r,"The embedded standalone configuration is missing. Export the animation again.")})();

