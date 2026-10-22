import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parseWeather,renderWeatherHTML,buildAdvice,buildWeatherUrl,wmoBn,beaufort} from '../src/lib/weather.ts';
const fixture={current:{time:'2026-10-22T08:00',temperature_2m:34,apparent_temperature:37,relative_humidity_2m:75,weather_code:95,wind_speed_10m:40,wind_direction_10m:90,is_day:1},daily:{time:['2026-10-22','2026-10-23'],weather_code:[95,3],temperature_2m_max:[35,30],temperature_2m_min:[26,25],precipitation_probability_max:[90,40]},hourly:{time:['2026-10-22T08:00'],uv_index:[6]}};
const w=parseWeather(fixture),rendered=renderWeatherHTML(w),advice=buildAdvice(w);
assert.equal(w.observedAt,'2026-10-22T08:00');assert(rendered.includes('2026-10-22 08:00'));assert.equal(w.now.uv,6);assert.equal(w.days.length,2);assert(advice.alerts.length);assert(advice.items.length);assert.equal(wmoBn(999).glyph,'🌡');assert.equal(beaufort(40).level,6);
for(const raw of [null,{}, {current:{temperature_2m:22},daily:{time:[]}}, {...fixture,current:{temperature_2m:'34'}}])assert.throws(()=>parseWeather(raw),/unavailable/);
assert.equal(parseWeather({...fixture,current:{...fixture.current,time:'<img src=x onerror=alert(1)>'}}).observedAt,'');
const url=buildWeatherUrl(23.745263,90.3771729);assert.equal(new URL(url).searchParams.get('longitude'),'90.3771729');assert.equal(new URL(url).searchParams.get('forecast_days'),'7');
const filename=fs.readdirSync('dist/_astro').find(f=>/^WeatherSection.*\.js$/.test(f));assert(filename);const code=fs.readFileSync('dist/_astro/'+filename,'utf8');
async function run(kind){const root={innerHTML:'existing-server-fallback',getAttribute:k=>k==='data-weather-url'?url:null};let requested='';const ctx={document:{getElementById:id=>id==='weather-root'?root:null},fetch:async u=>{requested=u;if(kind==='network')throw Error('network');return{ok:kind!=='http',json:async()=>kind==='malformed'?{}:fixture}}};vm.runInNewContext(code,ctx);await new Promise(resolve=>setImmediate(resolve));assert.equal(requested,url);return root.innerHTML;}
assert.equal(await run('success'),rendered);for(const failure of ['network','http','malformed'])assert.equal(await run(failure),'existing-server-fallback');
const html=fs.readFileSync('dist/index.html','utf8');assert(html.includes('https://open-meteo.com/'));assert(html.includes('https://creativecommons.org/licenses/by/4.0/'));assert(html.includes('data-weather-url='));const css=fs.readdirSync('dist/_astro').filter(f=>f.endsWith('.css')).map(f=>fs.readFileSync('dist/_astro/'+f,'utf8')).join('');for(const cls of ['weather-now','weather-advice','weather-days','wday'])assert(css.includes('.'+cls));
console.log('PASS shared weather parser/time escaping/advice, actual compiled client success replaces fallback, network/HTTP/malformed failures retain fallback, corrected place coordinates, seven-day request and source/licence/CSS. Fixture tests do not establish live provider availability or current forecasts.');
