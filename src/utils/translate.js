import axios from 'axios';
import querystring from 'querystring';
import cache from 'memory-cache';

const langs = {
  auto: 'Automatic',
  af: 'Afrikaans',
  sq: 'Albanian',
  am: 'Amharic',
  ar: 'Arabic',
  hy: 'Armenian',
  az: 'Azerbaijani',
  eu: 'Basque',
  be: 'Belarusian',
  bn: 'Bengali',
  bs: 'Bosnian',
  bg: 'Bulgarian',
  ca: 'Catalan',
  ceb: 'Cebuano',
  ny: 'Chichewa',
  'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  co: 'Corsican',
  hr: 'Croatian',
  cs: 'Czech',
  da: 'Danish',
  nl: 'Dutch',
  en: 'English',
  eo: 'Esperanto',
  et: 'Estonian',
  tl: 'Filipino',
  fi: 'Finnish',
  fr: 'French',
  fy: 'Frisian',
  gl: 'Galician',
  ka: 'Georgian',
  de: 'German',
  el: 'Greek',
  gu: 'Gujarati',
  ht: 'Haitian Creole',
  ha: 'Hausa',
  haw: 'Hawaiian',
  he: 'Hebrew',
  iw: 'Hebrew',
  hi: 'Hindi',
  hmn: 'Hmong',
  hu: 'Hungarian',
  is: 'Icelandic',
  ig: 'Igbo',
  id: 'Indonesian',
  ga: 'Irish',
  it: 'Italian',
  ja: 'Japanese',
  jw: 'Javanese',
  kn: 'Kannada',
  kk: 'Kazakh',
  km: 'Khmer',
  ko: 'Korean',
  ku: 'Kurdish (Kurmanji)',
  ky: 'Kyrgyz',
  lo: 'Lao',
  la: 'Latin',
  lv: 'Latvian',
  lt: 'Lithuanian',
  lb: 'Luxembourgish',
  mk: 'Macedonian',
  mg: 'Malagasy',
  ms: 'Malay',
  ml: 'Malayalam',
  mt: 'Maltese',
  mi: 'Maori',
  mr: 'Marathi',
  mn: 'Mongolian',
  my: 'Myanmar (Burmese)',
  ne: 'Nepali',
  no: 'Norwegian',
  ps: 'Pashto',
  fa: 'Persian',
  pl: 'Polish',
  pt: 'Portuguese',
  pa: 'Punjabi',
  ro: 'Romanian',
  ru: 'Russian',
  sm: 'Samoan',
  gd: 'Scots Gaelic',
  sr: 'Serbian',
  st: 'Sesotho',
  sn: 'Shona',
  sd: 'Sindhi',
  si: 'Sinhala',
  sk: 'Slovak',
  sl: 'Slovenian',
  so: 'Somali',
  es: 'Spanish',
  su: 'Sundanese',
  sw: 'Swahili',
  sv: 'Swedish',
  tg: 'Tajik',
  ta: 'Tamil',
  te: 'Telugu',
  th: 'Thai',
  tr: 'Turkish',
  uk: 'Ukrainian',
  ur: 'Urdu',
  uz: 'Uzbek',
  vi: 'Vietnamese',
  cy: 'Welsh',
  xh: 'Xhosa',
  yi: 'Yiddish',
  yo: 'Yoruba',
  zu: 'Zulu',
};

export const languages = Object.keys(langs);

function getCode(desiredLang) {
  if (!desiredLang) {
    return false;
  }

  if (langs[desiredLang]) {
    return desiredLang;
  }

  var keys = Object.keys(langs).filter(function (key) {
    if (typeof langs[key] !== 'string') {
      return false;
    }

    return langs[key].toLowerCase() === desiredLang.toLowerCase();
  });

  return keys[0] || false;
}

function isSupported(desiredLang) {
  return Boolean(getCode(desiredLang));
}

function extract(key, res) {
  var re = new RegExp(`"${key}":".*?"`);
  var result = re.exec(res.body);
  if (result !== null) {
    return result[0].replace(`"${key}":"`, '').slice(0, -1);
  }
  return '';
}

async function translate_old(text, opts, gotopts) {
  opts = opts || {};
  gotopts = gotopts || {};
  var e;
  [opts.from, opts.to].forEach(function (lang) {
    if (lang && !isSupported(lang)) {
      e = new Error();
      e.code = 400;
      e.message = "The language '" + lang + "' is not supported";
    }
  });
  if (e) {
    return new Promise(function (resolve, reject) {
      reject(e);
    });
  }

  opts.from = opts.from || 'auto';
  opts.to = opts.to || 'en';
  opts.tld = opts.tld || 'com';
  opts.autoCorrect = opts.autoCorrect === undefined ? false : Boolean(opts.autoCorrect);

  // console.log({ opts });

  // return;

  opts.from = getCode(opts.from);
  opts.to = getCode(opts.to);

  var url = 'https://translate.google.' + opts.tld;

  // according to translate.google.com constant rpcids seems to have different values with different POST body format.
  // * MkEWBc - returns translation
  // * AVdN8 - return suggest
  // * exi25c - return some technical info
  var rpcids = 'MkEWBc';

  console.log({ url, gotopts });

  ////////////////////////////////////////////////////////////////

  const res = await axios.get(url);

  var data = {
    rpcids: rpcids,
    'source-path': '/',
    'f.sid': extract('FdrFJe', res),
    bl: extract('cfb2h', res),
    hl: 'en-US',
    'soc-app': 1,
    'soc-platform': 1,
    'soc-device': 1,
    _reqid: Math.floor(1000 + Math.random() * 9000),
    rt: 'c',
  };

  url = url + '/_/TranslateWebserverUi/data/batchexecute?' + querystring.stringify(data);

  // === format for freq below is only for rpcids = MkEWBc ===
  var freq = [
    [
      [
        rpcids,
        JSON.stringify([[text, opts.from, opts.to, opts.autoCorrect], [null]]),
        null,
        'generic',
      ],
    ],
  ];
  gotopts.body = 'f.req=' + encodeURIComponent(JSON.stringify(freq)) + '&';

  if (!gotopts.headers) {
    gotopts.headers = {};
  }

  gotopts.headers['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

  console.log({ body: gotopts.body });

  const { data: data2 } = await axios.post(url, gotopts.body, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'X-HTTP-Method-Override': 'GET',
    },
  });

  var json = data2.slice(6);
  var length = '';

  var result = {
    text: '',
    pronunciation: '',
    from: {
      language: {
        didYouMean: false,
        iso: '',
      },
      text: {
        autoCorrected: false,
        value: '',
        didYouMean: false,
      },
    },
    raw: '',
  };

  try {
    /* @ts-ignore */
    length = /^\d+/.exec(json)[0];
    json = JSON.parse(json.slice(length.length, parseInt(length, 10) + length.length));
    json = JSON.parse(json[0][2]);
    result.raw = json;
  } catch (e) {
    return result;
  }

  if (json[1][0][0][5] === undefined || json[1][0][0][5] === null) {
    // translation not found, could be a hyperlink or gender-specific translation?
    result.text = json[1][0][0][0];
  } else {
    result.text = json[1][0][0][5]
      /* @ts-ignore */
      .map(function (obj) {
        return obj[0];
      })
      .filter(Boolean)
      // Google api seems to split text per sentences by <dot><space>
      // So we join text back with spaces.
      // See: https://github.com/vitalets/google-translate-api/issues/73
      .join(' ');
  }
  result.pronunciation = json[1][0][0][1];

  // From language
  if (json[0] && json[0][1] && json[0][1][1]) {
    result.from.language.didYouMean = true;
    result.from.language.iso = json[0][1][1][0];
  } else if (json[1][3] === 'auto') {
    result.from.language.iso = json[2];
  } else {
    result.from.language.iso = json[1][3];
  }

  // Did you mean & autocorrect
  if (json[0] && json[0][1] && json[0][1][0]) {
    var str = json[0][1][0][0][1];

    str = str.replace(/<b>(<i>)?/g, '[');
    str = str.replace(/(<\/i>)?<\/b>/g, ']');

    result.from.text.value = str;
    /* @ts-ignore */
    if (json[0][1][0][2] === 1) {
      result.from.text.autoCorrected = true;
    } else {
      result.from.text.didYouMean = true;
    }
  }

  console.log(result);

  return result;
}

const base = 'https://translate.googleapis.com/translate_a/single';

/**
 *
 * @param {string} text text
 * @param {string} from original language (auto=none set)
 * @param {string} to target language
 * @returns {Promise<{lang:string,text:string[]}>} translated text
 */
async function translate(text, from, to) {
  if (from === to) return text;
  const key = JSON.stringify({ text, from, to });

  // retrun ASAP
  const get = cache.get(key);
  if (get) return get;

  const { data } = await axios.get(
    `${base}?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`,
  );

  cache.put(key, { lang: data[2], text: data[0]?.map((item) => item[0]) }, 1000 * 60 * 60);

  return { lang: data[8] ? data[8][3][0] : data[2], text: data[0]?.map((item) => item[0]) };
}

export { translate, langs };
