import { useEffect, useMemo, useRef, useState } from 'react';
import { Globe, ChevronDown, Check, Search } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'af', label: 'Afrikaans' },
  { code: 'sq', label: 'Albanian' },
  { code: 'am', label: 'Amharic' },
  { code: 'ar', label: 'Arabic' },
  { code: 'hy', label: 'Armenian' },
  { code: 'as', label: 'Assamese' },
  { code: 'ay', label: 'Aymara' },
  { code: 'az', label: 'Azerbaijani' },
  { code: 'bm', label: 'Bambara' },
  { code: 'eu', label: 'Basque' },
  { code: 'be', label: 'Belarusian' },
  { code: 'bn', label: 'Bengali' },
  { code: 'bho', label: 'Bhojpuri' },
  { code: 'bs', label: 'Bosnian' },
  { code: 'bg', label: 'Bulgarian' },
  { code: 'ca', label: 'Catalan' },
  { code: 'ceb', label: 'Cebuano' },
  { code: 'ny', label: 'Chichewa' },
  { code: 'zh-CN', label: 'Chinese (Simplified)' },
  { code: 'zh-TW', label: 'Chinese (Traditional)' },
  { code: 'co', label: 'Corsican' },
  { code: 'hr', label: 'Croatian' },
  { code: 'cs', label: 'Czech' },
  { code: 'da', label: 'Danish' },
  { code: 'dv', label: 'Dhivehi' },
  { code: 'doi', label: 'Dogri' },
  { code: 'nl', label: 'Dutch' },
  { code: 'eo', label: 'Esperanto' },
  { code: 'et', label: 'Estonian' },
  { code: 'ee', label: 'Ewe' },
  { code: 'tl', label: 'Filipino' },
  { code: 'fi', label: 'Finnish' },
  { code: 'fr', label: 'French' },
  { code: 'fy', label: 'Frisian' },
  { code: 'gl', label: 'Galician' },
  { code: 'ka', label: 'Georgian' },
  { code: 'de', label: 'German' },
  { code: 'el', label: 'Greek' },
  { code: 'gn', label: 'Guarani' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'ht', label: 'Haitian Creole' },
  { code: 'ha', label: 'Hausa' },
  { code: 'haw', label: 'Hawaiian' },
  { code: 'iw', label: 'Hebrew' },
  { code: 'hi', label: 'Hindi' },
  { code: 'hmn', label: 'Hmong' },
  { code: 'hu', label: 'Hungarian' },
  { code: 'is', label: 'Icelandic' },
  { code: 'ig', label: 'Igbo' },
  { code: 'ilo', label: 'Ilocano' },
  { code: 'id', label: 'Indonesian' },
  { code: 'ga', label: 'Irish' },
  { code: 'it', label: 'Italian' },
  { code: 'ja', label: 'Japanese' },
  { code: 'jw', label: 'Javanese' },
  { code: 'kn', label: 'Kannada' },
  { code: 'kk', label: 'Kazakh' },
  { code: 'km', label: 'Khmer' },
  { code: 'rw', label: 'Kinyarwanda' },
  { code: 'gom', label: 'Konkani' },
  { code: 'ko', label: 'Korean' },
  { code: 'kri', label: 'Krio' },
  { code: 'ku', label: 'Kurdish (Kurmanji)' },
  { code: 'ckb', label: 'Kurdish (Sorani)' },
  { code: 'ky', label: 'Kyrgyz' },
  { code: 'lo', label: 'Lao' },
  { code: 'la', label: 'Latin' },
  { code: 'lv', label: 'Latvian' },
  { code: 'ln', label: 'Lingala' },
  { code: 'lt', label: 'Lithuanian' },
  { code: 'lg', label: 'Luganda' },
  { code: 'lb', label: 'Luxembourgish' },
  { code: 'mk', label: 'Macedonian' },
  { code: 'mai', label: 'Maithili' },
  { code: 'mg', label: 'Malagasy' },
  { code: 'ms', label: 'Malay' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'mt', label: 'Maltese' },
  { code: 'mi', label: 'Maori' },
  { code: 'mr', label: 'Marathi' },
  { code: 'mni-Mtei', label: 'Meiteilon (Manipuri)' },
  { code: 'lus', label: 'Mizo' },
  { code: 'mn', label: 'Mongolian' },
  { code: 'my', label: 'Myanmar (Burmese)' },
  { code: 'ne', label: 'Nepali' },
  { code: 'no', label: 'Norwegian' },
  { code: 'or', label: 'Odia (Oriya)' },
  { code: 'om', label: 'Oromo' },
  { code: 'ps', label: 'Pashto' },
  { code: 'fa', label: 'Persian' },
  { code: 'pl', label: 'Polish' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'pa', label: 'Punjabi' },
  { code: 'qu', label: 'Quechua' },
  { code: 'ro', label: 'Romanian' },
  { code: 'ru', label: 'Russian' },
  { code: 'sm', label: 'Samoan' },
  { code: 'sa', label: 'Sanskrit' },
  { code: 'gd', label: 'Scots Gaelic' },
  { code: 'nso', label: 'Sepedi' },
  { code: 'sr', label: 'Serbian' },
  { code: 'st', label: 'Sesotho' },
  { code: 'sn', label: 'Shona' },
  { code: 'sd', label: 'Sindhi' },
  { code: 'si', label: 'Sinhala' },
  { code: 'sk', label: 'Slovak' },
  { code: 'sl', label: 'Slovenian' },
  { code: 'so', label: 'Somali' },
  { code: 'es', label: 'Spanish' },
  { code: 'su', label: 'Sundanese' },
  { code: 'sw', label: 'Swahili' },
  { code: 'sv', label: 'Swedish' },
  { code: 'tg', label: 'Tajik' },
  { code: 'ta', label: 'Tamil' },
  { code: 'tt', label: 'Tatar' },
  { code: 'te', label: 'Telugu' },
  { code: 'th', label: 'Thai' },
  { code: 'ti', label: 'Tigrinya' },
  { code: 'ts', label: 'Tsonga' },
  { code: 'tr', label: 'Turkish' },
  { code: 'tk', label: 'Turkmen' },
  { code: 'ak', label: 'Twi' },
  { code: 'uk', label: 'Ukrainian' },
  { code: 'ur', label: 'Urdu' },
  { code: 'ug', label: 'Uyghur' },
  { code: 'uz', label: 'Uzbek' },
  { code: 'vi', label: 'Vietnamese' },
  { code: 'cy', label: 'Welsh' },
  { code: 'xh', label: 'Xhosa' },
  { code: 'yi', label: 'Yiddish' },
  { code: 'yo', label: 'Yoruba' },
  { code: 'zu', label: 'Zulu' }
];

// Loads Google Translate script and mounts a hidden widget. Re-triggers translation
// by directly setting the widget's language cookie / select value.
export default function LanguageSwitcher({ dark = false }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('en');
  const [query, setQuery] = useState('');
  const menuRef = useRef(null);

  // Google Translate loads lazily: only when the menu opens, or immediately
  // if a translation cookie already exists (returning translated visitor).
  const ensureGT = () => {
    if (window.__gtLoaded) return;
    window.__gtLoaded = true;

    window.googleTranslateElementInit = () => {
      /* global google */
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: LANGUAGES.map((l) => l.code).join(','),
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      );
    };

    const s = document.createElement('script');
    s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.body.appendChild(s);
  };

  useEffect(() => {
    if (document.cookie.match(/googtrans=\/en\/[a-z-]+/i)) ensureGT();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

 const selectLang = (code) => {
  setCurrent(code);
  setOpen(false);

  const setCookie = (val) => {
    document.cookie = `googtrans=${val};path=/`;
    document.cookie = `googtrans=${val};domain=${window.location.hostname};path=/`;
  };

  if (code === 'en') {
    // Clear Google Translate and return to the original English page
    document.cookie = 'googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=${window.location.hostname};path=/`;
  } else {
    setCookie(`/en/${code}`);
  }

  window.location.reload();
};

  // Detect current language from cookie on mount
  useEffect(() => {
    const m = document.cookie.match(/googtrans=\/en\/([a-z-]+)/i);
    if (m) setCurrent(m[1]);
  }, []);

  const currentLabel = LANGUAGES.find((l) => l.code === current)?.label || 'English';

  const filteredLanguages = useMemo(() => {
    if (!query.trim()) return LANGUAGES;
    const q = query.toLowerCase();
    return LANGUAGES.filter((l) => l.label.toLowerCase().includes(q) || l.code.toLowerCase().includes(q));
  }, [query]);

  return (
   <div ref={menuRef} className="relative notranslate">
      <div id="google_translate_element" style={{ position: 'absolute', top: -9999, left: -9999 }} />
      <button
        onClick={() => { ensureGT(); setOpen(!open); }}
        data-testid="language-switcher-btn"
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition ${dark ? 'border-white/20 text-white/80 hover:border-pink-400 hover:text-white' : 'border-slate-200 bg-white/80 text-slate-700 backdrop-blur hover:border-pink-300'}`}
        aria-label="Choose language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden md:inline">{currentLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 z-50 flex w-64 flex-col overflow-hidden rounded-2xl glass-card shadow-xl" data-testid="language-switcher-menu">
          <div className="relative p-2 border-b border-gray-100">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search language..."
              data-testid="language-switcher-search"
              className="w-full rounded-xl border border-slate-200 py-1.5 pl-8 pr-2 text-xs text-slate-800 focus:border-pink-400 focus:outline-none"
            />
          </div>
          <div className="py-1 max-h-80 overflow-y-auto">
            {filteredLanguages.length === 0 && (
              <p className="px-3 py-4 text-xs text-gray-500 text-center">No languages match "{query}"</p>
            )}
            {filteredLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => selectLang(lang.code)}
                data-testid={`language-option-${lang.code}`}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-pink-50 hover:text-pink-600"
              >
                <span>{lang.label}</span>
                {current === lang.code && <Check className="w-4 h-4 text-pink-600" />}
              </button>
            ))}
          </div>
          <div className="px-3 py-2 border-t border-gray-100 text-[10px] text-gray-500 tracking-wider uppercase">
            {LANGUAGES.length} Languages Available
          </div>
        </div>
      )}
    </div>
  );
}
