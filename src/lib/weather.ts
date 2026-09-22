// রবীন্দ্র সরোবর ঢাকা পর্যটক নির্দেশিকা — আবহাওয়া উপাদান
// ডেটা উৎস: Open-Meteo (সার্ভার পক্ষ থেকে নেওয়া, স্থির HTML-এ ক্যাশে করা হয়)।
// সাধারণ দর্শনার্থীর জন্য “আবহাওয়া কেমন” নয়, “এর জন্য কী করা উচিত” সরাসরি পরামর্শ তৈরি করা হয়।

const OPEN_METEO = 'https://api.open-meteo.com/v1/forecast';

export interface NowWeather {
  temp: number;
  feels: number;
  humidity: number;
  code: number;
  windKmh: number;
  windDir: number;
  uv: number;
  isDay: boolean;
}

export interface DayWeather {
  date: string;
  code: number;
  tmax: number;
  tmin: number;
  pop: number;
}

export interface AlertItem {
  name: string;
  severity?: string;
}

export interface WeatherData {
  now: NowWeather;
  today: { tmax: number; tmin: number; pop: number; code: number };
  days: DayWeather[];
  alerts: AlertItem[];
}

export interface Advice {
  summary: string;
  outfit: string[];
  activity: string[];
  items: string[];
  alerts: string[];
}

export interface WmoInfo {
  label: string;
  glyph: string;
  umbrella: boolean;
}

const wmoMap: Record<number, WmoInfo> = {
  0: { label: 'পরিষ্কার আকাশ', glyph: '☀', umbrella: false },
  1: { label: 'মেঘলা কম', glyph: '🌤', umbrella: false },
  2: { label: 'আংশিক মেঘলা', glyph: '⛅', umbrella: false },
  3: { label: 'মেঘলা', glyph: '☁', umbrella: false },
  45: { label: 'কুয়াশা', glyph: '🌫', umbrella: false },
  48: { label: 'কুয়াশা', glyph: '🌫', umbrella: false },
  51: { label: 'হালকা শিশির বৃষ্টি', glyph: '🌦', umbrella: true },
  53: { label: 'শিশির বৃষ্টি', glyph: '🌦', umbrella: true },
  55: { label: 'ঘন শিশির বৃষ্টি', glyph: '🌧', umbrella: true },
  56: { label: 'হিম শিশির', glyph: '🌧', umbrella: true },
  57: { label: 'হিম শিশির', glyph: '🌧', umbrella: true },
  61: { label: 'হালকা বৃষ্টি', glyph: '🌧', umbrella: true },
  63: { label: 'বৃষ্টি', glyph: '🌧', umbrella: true },
  65: { label: 'ভারী বৃষ্টি', glyph: '🌧', umbrella: true },
  66: { label: 'হিম বৃষ্টি', glyph: '🌧', umbrella: true },
  67: { label: 'হিম বৃষ্টি', glyph: '🌧', umbrella: true },
  71: { label: 'হালকা তুষার', glyph: '🌨', umbrella: true },
  73: { label: 'তুষার', glyph: '🌨', umbrella: true },
  75: { label: 'ভারী তুষার', glyph: '🌨', umbrella: true },
  77: { label: 'তুষারকণা', glyph: '🌨', umbrella: true },
  80: { label: 'বৃষ্টির ঝলক', glyph: '🌦', umbrella: true },
  81: { label: 'বৃষ্টির ঝলক', glyph: '🌧', umbrella: true },
  82: { label: 'তীব্র বৃষ্টির ঝলক', glyph: '⛈', umbrella: true },
  85: { label: 'তুষারের ঝলক', glyph: '🌨', umbrella: true },
  86: { label: 'তুষারের ঝলক', glyph: '🌨', umbrella: true },
  95: { label: 'বজ্রঝড়', glyph: '⛈', umbrella: true },
  96: { label: 'বজ্রঝড় ও শিলাবৃষ্টি', glyph: '⛈', umbrella: true },
  99: { label: 'তীব্র বজ্রঝড় ও শিলাবৃষ্টি', glyph: '⛈', umbrella: true },
};

export function wmoBn(code: number): WmoInfo {
  return wmoMap[code] ?? { label: 'অজানা আবহাওয়া', glyph: '🌡', umbrella: false };
}

const RAIN_LIGHT = [51, 53, 55, 56, 57, 61, 80];
const RAIN_HEAVY = [63, 65, 66, 67, 71, 73, 75, 77, 81, 82, 85, 86];
const RAIN_THUNDER = [95, 96, 99];
const isRain = (c: number) =>
  [...RAIN_LIGHT, ...RAIN_HEAVY, ...RAIN_THUNDER].includes(c);

// বিউফোর্ট স্কেল (কিমি/ঘ) → দফা ও বাংলা বিবরণ
export function beaufort(kmh: number): { level: number; text: string } {
  const k = Math.max(0, Number(kmh) || 0);
  const upper = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117];
  let level = 0;
  for (let i = 0; i < upper.length; i++) if (k > upper[i]) level = i + 1;
  let text = 'হাওয়া শান্ত';
  if (level >= 1 && level <= 2) text = 'হালকা হাওয়া';
  else if (level >= 3 && level <= 4) text = 'মাঝারি হাওয়া';
  else if (level >= 5 && level <= 6) text = `${level} দফা হাওয়া`;
  else if (level >= 7) text = `${level} দফা জোর হাওয়া`;
  return { level, text };
}

const DIRS = [
  'উত্তর',
  'উত্তর-পূর্ব',
  'পূর্ব',
  'দক্ষিণ-পূর্ব',
  'দক্ষিণ',
  'দক্ষিণ-পশ্চিম',
  'পশ্চিম',
  'উত্তর-পশ্চিম',
];
export function windDirText(deg: number): string {
  const d = ((Number(deg) || 0) % 360 + 360) % 360;
  return DIRS[Math.round(d / 45) % 8];
}

export function bnDay(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('bn-BD', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function buildWeatherUrl(lat: number, lon: number): string {
  const p = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,is_day',
    hourly: 'uv_index',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7',
    wind_speed_unit: 'kmh',
  });
  return `${OPEN_METEO}?${p.toString()}`;
}

// কাঁচা Open-Meteo JSON → আমাদের WeatherData আকৃতি (সার্ভার ও ক্লায়েন্ট উভয়ে ব্যবহৃত)।
export function parseWeather(raw: any): WeatherData {
  const cur = raw?.current ?? {};
  const daily = raw?.daily ?? {};
  const hourly = raw?.hourly ?? {};

  const times: string[] = Array.isArray(hourly.time) ? hourly.time : [];
  const uvs: number[] = Array.isArray(hourly.uv_index) ? hourly.uv_index : [];
  let uv = 0;
  if (times.length && uvs.length) {
    const t = new Date(cur.time ?? Date.now()).getTime();
    let best = 0;
    let bestDiff = Infinity;
    for (let i = 0; i < times.length; i++) {
      const d = Math.abs(new Date(times[i]).getTime() - t);
      if (d < bestDiff) {
        bestDiff = d;
        best = i;
      }
    }
    uv = uvs[best] ?? 0;
  }

  const dTime: string[] = Array.isArray(daily.time) ? daily.time : [];
  const days: DayWeather[] = dTime.map((date, i) => ({
    date,
    code: daily.weather_code?.[i] ?? 0,
    tmax: daily.temperature_2m_max?.[i] ?? 0,
    tmin: daily.temperature_2m_min?.[i] ?? 0,
    pop: daily.precipitation_probability_max?.[i] ?? 0,
  }));

  const today = days[0] ?? { tmax: 0, tmin: 0, pop: 0, code: 0 };

  return {
    now: {
      temp: cur.temperature_2m ?? 0,
      feels: cur.apparent_temperature ?? cur.temperature_2m ?? 0,
      humidity: cur.relative_humidity_2m ?? 0,
      code: cur.weather_code ?? 0,
      windKmh: cur.wind_speed_10m ?? 0,
      windDir: cur.wind_direction_10m ?? 0,
      uv,
      isDay: cur.is_day === 1,
    },
    today,
    days,
    alerts: [],
  };
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = buildWeatherUrl(lat, lon);
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': 'RobindroSoroborGuide/1.0' },
  });
  if (!res.ok) throw new Error(`weather ${res.status}`);
  return parseWeather(await res.json());
}

// প্রধান পরামর্শ ইঞ্জিন: শর্ত অনুযায়ী বিভাগভিত্তিক পরামর্শ তৈরি করে (অপ্রাসঙ্গিক বিষয় লুকিয়ে রাখে)।
export function buildAdvice(w: WeatherData): Advice {
  const out: string[] = [];
  const act: string[] = [];
  const items: string[] = [];
  const alerts: string[] = [];

  const now = w.now;
  const today = w.today;
  const code = now.code;
  const info = wmoBn(code);
  const wind = beaufort(now.windKmh);
  const uv = now.uv;
  const tmax = today.tmax;
  const tmin = today.tmin;
  const isLight = RAIN_LIGHT.includes(code);
  const isHeavy = RAIN_HEAVY.includes(code);
  const isThunder = RAIN_THUNDER.includes(code);

  // --- বৃষ্টি / জলবিজ্ঞান ---
  if (today.pop >= 60 || isLight || isHeavy || isThunder) {
    if (today.pop >= 60 && !isHeavy && !isThunder) {
      out.push('বৃষ্টির সম্ভাবনা বেশি—ছাতা বা রেইনকোট সঙ্গে রাখুন।');
      act.push('বৃষ্টি থাকলে উন্মুক্ত মঞ্চের বদলে ছায়াযুক্ত বা ঢাকা জায়গায় বসুন; লেকপাড়ে দীর্ঘ হাঁটা কমিয়ে রাখুন।');
      items.push('ছাতা / রেইনকোট');
    }
    if (isLight) {
      out.push('হালকা বৃষ্টিতে পাড় পিচ্ছিল হতে পারে—সাবধানে হাঁটুন।');
      act.push('খোলা মঞ্চে দাঁড়ানোর চেয়ে ছায়ায় থাকুন।');
      items.push('ভাঁজ করা ছাতা');
    }
    if (isHeavy) {
      alerts.push('বৃষ্টি তুলনামূলক বেশি—নিচু ও জলাবদ্ধ জায়গা এড়িয়ে চলুন।');
      act.push('ভারী বৃষ্টিতে লেকে নৌকাবিহার বা উন্মুক্ত অনুষ্ঠান বন্ধ থাকতে পারে; ঢাকা জায়গায় অপেক্ষা করুন।');
      items.push('রেইনকোট (বাতাসে লম্বা ছাতা সুবিধাজনক নয়)');
    }
    if (isThunder) {
      alerts.push('বজ্রঝড়ের সময় উন্মুক্ত মঞ্চ, গাছতলা বা জলের ধার থেকে দূরে থাকুন।');
      act.push('জলবিনোদন বা উন্মুক্ত খেলা এড়িয়ে নিরাপদ ঢাকা জায়গায় থাকুন।');
    }
  }

  // --- তাপ ও অতিনীল রশ্মি ---
  if (now.temp >= 32 || tmax >= 32) {
    out.push('তাপমাত্রা বেশি—হালকা, ঢিলেঢালা সুতির পোশাক পরুন।');
    act.push('দুপুরের তাপ এড়াতে সকাল বা সন্ধ্যায় ঘুরুন; উন্মুক্ত মঞ্চে বেশিক্ষণ না থেকে ছায়ায় বিশ্রাম নিন।');
    items.push('সানস্ক্রিন, টুপি, পর্যাপ্ত পানি');
  }
  if (uv >= 5) {
    out.push('অতিনীল রশ্মি (UV) বেশি—ত্বক ঢাকা রাখুন।');
    items.push('সানস্ক্রিন, সানগ্লাস, ছাতা/টুপি');
  }
  if (tmax - tmin > 8) {
    out.push('দিন–রাতের তাপমাত্রার ফারাক বেশি—সঙ্গে একটি হালকা জামা/জ্যাকেট রাখুন।');
  }
  if (tmax <= 10) {
    out.push('শীত বেশি—গরম জ্যাকেট ও স্কার্ফ নিন।');
    items.push('গরম জ্যাকেট, স্কার্ফ');
  }

  // --- বাতাস ---
  if (wind.level >= 5 && wind.level <= 6) {
    out.push('হাওয়া বেশি—টুপি উড়ে যেতে পারে, ঢিলেঢালা পোশাক এড়িয়ে জামা শক্ত রাখুন।');
    act.push('লেকের নৌকাবিহার ও খোলা মঞ্চের অনুষ্ঠান বন্ধ থাকতে পারে।');
  }
  if (wind.level >= 7) {
    alerts.push('বাতাস বেশি জোর—বিজ্ঞাপন বোর্ড বা উঁচু ডাল থেকে দূরে থাকুন।');
    act.push('লেকের ধারের খোলা জায়গা ও নৌকাবিহার এড়িয়ে চলুন।');
  }

  // --- পরিষ্কার / মেঘলা ---
  if (code === 0 || code === 1) {
    act.push('আকাশ পরিষ্কার—হাঁটা ও ছবি তোলার দারুণ সময়; সূর্যোদয় বা সূর্যাস্ত দেখুন।');
  }
  if (code === 2 || code === 3) {
    act.push('মেঘলা আকাশে আলো নরম—আলোকচিত্র ও দীর্ঘ হাঁটার জন্য আরামদায়ক।');
  }

  // --- কুয়াশা ---
  if (code === 45 || code === 48) {
    alerts.push('কুয়াশায় দৃশ্যমানতা কম—লেকপাড়ে সাবধানে হাঁটুন।');
    act.push('কুয়াশায় দূরের দৃশ্য ও জলপৃষ্ঠ পরিষ্কার দেখা যাবে না।');
    items.push('মাস্ক (ধুলো/কুয়াশায়)');
  }

  // --- ডেটাভিত্তিক সতর্কতা (যদি থাকে) ---
  for (const a of w.alerts) {
    alerts.push(
      `⚠️ আবহাওয়া সতর্কতা: ${a.name} জারি আছে। যাত্রা পুনর্বিবেচনা করুন ও নিরাপদ জায়গায় থাকুন; পরিবর্তনের জন্য আবহাওয়ার খবর রাখুন।`,
    );
  }

  // সবুজ/সাধারণ অবস্থার জন্য ফলব্যাক
  if (out.length === 0 && act.length === 0 && items.length === 0) {
    act.push('আবহাওয়া সাধারণত সহনীয়—হালকা হাঁটা ও ছবি তোলার জন্য ভালো সময়।');
  }

  const summary = `আজ ${info.label}, এখন ${Math.round(now.temp)}° · ${Math.round(tmin)}–${Math.round(tmax)}° · UV ${Math.round(uv)} · ${wind.text}`;
  return {
    summary,
    outfit: [...new Set(out)],
    activity: [...new Set(act)],
    items: [...new Set(items)],
    alerts: [...new Set(alerts)],
  };
}

// সার্ভার ও ক্লায়েন্ট উভয়ে ব্যবহৃত একই HTML জেনারেটর (রূপ এক রাখতে)।
export function renderWeatherHTML(w: WeatherData): string {
  const a = buildAdvice(w);
  const info = wmoBn(w.now.code);
  const wind = beaufort(w.now.windKmh);
  const dir = windDirText(w.now.windDir);

  const now = `
    <div class="weather-now">
      <div class="wnow-glyph">${info.glyph}</div>
      <div class="wnow-main">
        <span class="wnow-temp">${Math.round(w.now.temp)}°সে</span>
        <span class="wnow-cond">${info.label}</span>
        <span class="wnow-meta">অনুভূত ${Math.round(w.now.feels)}° · আর্দ্রতা ${Math.round(w.now.humidity)}% · হাওয়া ${wind.text} (${dir} ${Math.round(w.now.windKmh)} কিমি/ঘ)</span>
        <span class="wnow-summary">${a.summary}</span>
      </div>
    </div>`;

  const alertHTML = a.alerts.length
    ? `<div class="advice-alert" role="alert">${a.alerts.map((x) => `<p>${x}</p>`).join('')}</div>`
    : '';

  const col = (title: string, list: string[]) =>
    list.length
      ? `<div class="advice-col"><h4>${title}</h4><ul>${list.map((i) => `<li>${i}</li>`).join('')}</ul></div>`
      : '';

  const advice = `
    <div class="weather-advice">
      ${alertHTML}
      <div class="advice-grid">
        ${col('যাত্রার পোশাক', a.outfit)}
        ${col('ঘুরে দেখার ব্যবস্থা', a.activity)}
        ${col('সঙ্গে রাখুন', a.items)}
      </div>
    </div>`;

  const cards = w.days
    .map((d, i) => {
      const di = wmoBn(d.code);
      const lab = i === 0 ? 'আজ' : bnDay(d.date);
      return `<article class="wday"><span class="wday-name">${lab}</span><span class="wday-glyph">${di.glyph}</span><span class="wday-cond">${di.label}</span><span class="wday-temp">${Math.round(d.tmax)}° / ${Math.round(d.tmin)}°</span><span class="wday-pop">বৃষ্টি ${Math.round(d.pop)}%</span></article>`;
    })
    .join('');

  return `${now}${advice}<div class="weather-days">${cards}</div>`;
}
