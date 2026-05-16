import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IMAGE_SRC, TAB_IMAGE_SRC, BACKGROUND_SRC,
  IMAGE_PILOT_VERSION, IMAGE_PART_VERSION, IMAGE_PART_THROW_VERSION,
  IMAGE_PROJECTILE_VERSION, IMAGE_DRONE_VERSION,
  TAB_PILOT_VERSION, TAB_PART_VERSION, TAB_DRONE_VERSION,
} from '../data/resource';
import { Part, Pilot, Drone, TacticCard } from '../data/types';

type Lang = 'zh' | 'en' | 'jp';

interface ImageUrlGroups {
  fullParts: string[];
  fullPilots: string[];
  fullDrones: string[];
  fullProjectiles: string[];
  fullThrow: string[];
  fullCards: string[];
  tabParts: string[];
  tabPilots: string[];
  tabDrones: string[];
}

interface CacheGroup {
  cacheName: string;
  urls: string[];
}

const CACHE_PREFIX = 'ember-img-';

export function getCacheNames(): Record<string, string> {
  return {
    fullParts: `${CACHE_PREFIX}full-parts-v${IMAGE_PART_VERSION}`,
    fullPilots: `${CACHE_PREFIX}full-pilots-v${IMAGE_PILOT_VERSION}`,
    fullDrones: `${CACHE_PREFIX}full-drones-v${IMAGE_DRONE_VERSION}`,
    fullProjectiles: `${CACHE_PREFIX}full-projectiles-v${IMAGE_PROJECTILE_VERSION}`,
    fullThrow: `${CACHE_PREFIX}throw-v${IMAGE_PART_THROW_VERSION}`,
    fullCards: `${CACHE_PREFIX}full-cards`,
    tabParts: `${CACHE_PREFIX}tab-parts-v${TAB_PART_VERSION}`,
    tabPilots: `${CACHE_PREFIX}tab-pilots-v${TAB_PILOT_VERSION}`,
    tabDrones: `${CACHE_PREFIX}tab-drones-v${TAB_DRONE_VERSION}`,
  };
}

function buildImageUrl(imageSrc: string, id: string, ext: string, version?: string): string {
  return version ? `${imageSrc}/${id}.${ext}?v=${version}` : `${imageSrc}/${id}.${ext}`;
}

function collectIds<T extends { id: string; hasImage?: boolean }>(items: T[]): string[] {
  return items.filter(item => item.hasImage !== false).map(item => item.id);
}

export function buildAllImageUrls(data: any, lang: Lang): ImageUrlGroups {
  const imageSrc = IMAGE_SRC[lang];
  const tabSrc = TAB_IMAGE_SRC[lang];

  // Destructure all data arrays
  const {
    gofTorso = [], gofChasis = [], gofLeftHand = [], gofRightHand = [], gofBackpack = [],
    pdTorso = [], pdChasis = [], pdLeftHand = [], pdRightHand = [], pdBackpack = [],
    rdlTorso = [], rdlChasis = [], rdlLeftHand = [], rdlRightHand = [], rdlBackpack = [],
    unTorso = [], unChasis = [], unLeftHand = [], unRightHand = [], unBackpack = [],
    gofPilots = [], pdPilots = [], rdlPilots = [], unPilots = [],
    gofDrones = [], pdDrones = [], rdlDrones = [], unDrones = [],
    gofProjectiles = [], pdProjectiles = [], rdlProjectiles = [], unProjectiles = [],
    allTacticCards = [],
  } = data;

  // Collect all parts, pilots, drones
  const allParts: Part[] = [
    ...gofTorso, ...gofChasis, ...gofLeftHand, ...gofRightHand, ...gofBackpack,
    ...pdTorso, ...pdChasis, ...pdLeftHand, ...pdRightHand, ...pdBackpack,
    ...rdlTorso, ...rdlChasis, ...rdlLeftHand, ...rdlRightHand, ...rdlBackpack,
    ...unTorso, ...unChasis, ...unLeftHand, ...unRightHand, ...unBackpack,
  ];

  const allPilots: Pilot[] = [...gofPilots, ...pdPilots, ...rdlPilots, ...unPilots];
  const allDrones: Drone[] = [...gofDrones, ...pdDrones, ...rdlDrones, ...unDrones];
  const allProjectiles = [...gofProjectiles, ...pdProjectiles, ...rdlProjectiles, ...unProjectiles];

  const partIds = collectIds(allParts);
  const pilotIds = collectIds(allPilots);
  const droneIds = collectIds(allDrones);
  const projectileIds = collectIds(allProjectiles);

  // Collect throwIndex and projectile IDs from parts
  const throwIds = new Set<string>();
  const partProjectileIds = new Set<string>();
  for (const part of allParts) {
    if (part.hasImage === false) continue;
    if (part.throwIndex) throwIds.add(part.throwIndex);
    if (part.projectile) part.projectile.forEach(id => partProjectileIds.add(id));
  }

  // Also collect projectile IDs from drones
  for (const drone of allDrones) {
    if (drone.hasImage === false) continue;
    if (drone.projectile) drone.projectile.forEach(id => partProjectileIds.add(id));
  }

  // Merge projectile IDs from data arrays + part/drone references
  const allProjectileIds = [...new Set([...projectileIds, ...partProjectileIds])];

  // ── Full-size URLs ──
  const fullParts = partIds.map(id => buildImageUrl(imageSrc, id, 'webp', IMAGE_PART_VERSION));
  const fullPilots = pilotIds.map(id => buildImageUrl(imageSrc, id, 'webp', IMAGE_PILOT_VERSION));
  const fullDrones = droneIds.map(id => buildImageUrl(imageSrc, id, 'webp', IMAGE_DRONE_VERSION));
  const fullProjectiles = allProjectileIds.map(id => buildImageUrl(imageSrc, id, 'webp', IMAGE_PROJECTILE_VERSION));
  const fullThrow = [...throwIds].map(id => buildImageUrl(imageSrc, id, 'webp', IMAGE_PART_THROW_VERSION));
  const fullCards = (allTacticCards as TacticCard[]).map((card: TacticCard) => buildImageUrl(imageSrc, card.id, 'webp'));

  // ── Tab-size URLs ──
  const tabParts = partIds.map(id => buildImageUrl(tabSrc, id, 'webp', TAB_PART_VERSION));
  const tabPilots = pilotIds.map(id => buildImageUrl(tabSrc, id, 'webp', TAB_PILOT_VERSION));
  const tabDrones = droneIds.map(id => buildImageUrl(tabSrc, id, 'webp', TAB_DRONE_VERSION));

  return {
    fullParts, fullPilots, fullDrones, fullProjectiles, fullThrow, fullCards,
    tabParts, tabPilots, tabDrones,
  };
}

export async function preloadImageCache(
  groups: ImageUrlGroups,
  onProgress: (loaded: number, total: number) => void
): Promise<void> {
  const cacheNames = getCacheNames();

  // Build flat task list: each task is { cacheName, url }
  const groupMap: [keyof ImageUrlGroups, string][] = [
    ['fullParts', cacheNames.fullParts],
    ['fullPilots', cacheNames.fullPilots],
    ['fullDrones', cacheNames.fullDrones],
    ['fullProjectiles', cacheNames.fullProjectiles],
    ['fullThrow', cacheNames.fullThrow],
    ['fullCards', cacheNames.fullCards],
    ['tabParts', cacheNames.tabParts],
    ['tabPilots', cacheNames.tabPilots],
    ['tabDrones', cacheNames.tabDrones],
  ];

  const tasks: { cacheName: string; url: string }[] = [];
  for (const [key, cacheName] of groupMap) {
    const urls = groups[key];
    if (!urls || urls.length === 0) continue;
    for (const url of urls) {
      tasks.push({ cacheName, url });
    }
  }

  const total = tasks.length;
  if (total === 0) {
    onProgress(1, 1);
    return;
  }

  let loaded = 0;
  const CONCURRENCY = 6;

  // Batch process URLs: use Image() to warm HTTP cache + try Cache API via fetch
  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY);

    // Open needed caches once per batch
    const neededCaches = [...new Set(batch.map(t => t.cacheName))];
    const cacheMap = new Map<string, Cache>();
    await Promise.all(neededCaches.map(async name => {
      cacheMap.set(name, await caches.open(name));
    }));

    await Promise.allSettled(batch.map(async ({ cacheName, url }) => {
      try {
        // Step 1: Try Cache API first (skip if already cached)
        const cache = cacheMap.get(cacheName)!;
        const cached = await cache.match(url);
        if (cached) {
          loaded++;
          onProgress(loaded, total);
          return;
        }

        // Step 2: Load image via Image() — always works, warms browser HTTP cache
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = url;
        });

        // Step 3: Best-effort Cache API PUT via CORS fetch
        // This populates Cache API for long-term persistence.
        // If CDN CORS is not configured, falls back to no-cors mode.
        try {
          const response = await fetch(url);
          if (response.ok) {
            // Validate content-type — prevents caching non-image responses
            // (e.g. jsDelivr HTML error pages for repos exceeding 50MB limit)
            const contentType = response.headers.get('content-type') || '';
            if (contentType.startsWith('image/')) {
              await cache.put(url, response);
            }
          }
        } catch {
          // CORS not available — try no-cors mode (e.g. raw.githubusercontent.com)
          try {
            const opaqueResponse = await fetch(url, { mode: 'no-cors' });
            if (opaqueResponse.type === 'opaque') {
              await cache.put(url, opaqueResponse);
            }
          } catch {
            // Both methods failed, HTTP cache from Image() is sufficient
          }
        }
      } catch {
        // Network error, skip
      }
      loaded++;
      onProgress(loaded, total);
    }));
  }
}

// ── React Component ──

interface ImagePreloaderProps {
  data: any;
  lang: Lang;
  translations: { t137: string; t138: string };
  onComplete: () => void;
  onSetLanguage: (lang: Lang) => void;
}

export function ImagePreloader({ data, lang, translations, onComplete, onSetLanguage }: ImagePreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'preparing' | 'loading'>('preparing');
  const [logoFaction, setLogoFaction] = useState(0);
  const mountedRef = useRef(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const backgroundImgsrc = BACKGROUND_SRC[lang];
  const factions = ['RDL', 'UN', 'GOF'];

  useEffect(() => {
    const interval = setInterval(() => {
      setLogoFaction(prev => (prev + 1) % factions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    setPhase('preparing');
    setProgress(0);

    const urls = buildAllImageUrls(data, lang);
    const cb = onCompleteRef.current;
    const timerStart = Date.now();

    // Small delay to let the component mount and show the animation
    const timer = setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase('loading');
      preloadImageCache(urls, (loaded, total) => {
        if (!mountedRef.current) return;
        setProgress(total > 0 ? loaded / total : 1);
      }).then(() => {
        if (!mountedRef.current) return;
        // 预加载完成后至少显示 2s 动画，让用户看到 UI
        const elapsed = Date.now() - timerStart;
        const remaining = Math.max(0,0 - elapsed);
        setTimeout(() => { if (mountedRef.current) cb(); }, remaining);
      });
    }, 300);

    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
    };
  }, [data, lang]);

  const percent = Math.round(progress * 100);

  return (
    <div
      className="fixed inset-0 flex overflow-hidden"
      style={{
        backgroundColor: "white",
        backgroundImage: `url(${backgroundImgsrc}/background.svg)`,
        backgroundSize: "cover", backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)' }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
        gap: 24,
      }}>
        {/* Logo area - cycling through factions */}
        <AnimatePresence mode="wait">
          <motion.img
            key={factions[logoFaction]}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            src={`${backgroundImgsrc}/logo_${factions[logoFaction]}.webp`}
            alt=""
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 'clamp(120px, 20vw, 280px)', height: 'auto',
              pointerEvents: 'none',
            }}
          />
        </AnimatePresence>

        {/* Glassmorphism card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            width: 'min(360px, 88vw)',
            padding: '36px 28px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}
        >
          {/* Logo */}
          <img
            src={`${backgroundImgsrc}/logo.webp`}
            alt="logo"
            style={{
              height: '8vh', width: 'auto',
            }}
          />

          {/* Language switcher */}
          <div style={{ display: 'flex', gap: 6 }}>
            {([
              { key: 'zh', label: '中文' },
              { key: 'en', label: 'EN' },
              { key: 'jp', label: 'JP' },
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onSetLanguage(key)}
                style={{
                  padding: '4px 14px',
                  borderRadius: 6,
                  border: '1px solid',
                  borderColor: lang === key ? 'white' : 'rgba(0,0,0,0.12)',
                  background: lang === key ? 'grey' : 'transparent',
                  color: lang === key ? '#fff' : '#666',
                  fontSize: 13,
                  fontWeight: lang === key ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {label}
              </button>
            ))}
          </div>

        
          {/* Progress bar track */}
          <div style={{ width: '100%' }}>
            <div style={{
              width: '100%',
              height: 6,
              borderRadius: 3,
              backgroundColor: 'rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}>
              <motion.div
                style={{
                  height: '100%',
                  borderRadius: 3,
                  background: '#666',
                }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Percentage */}
          <div style={{
            fontSize: 32,
            fontWeight: 800,
            color: '#1a1a2e',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}>
            {percent}%
          </div>

          {/* Status text */}
          <div style={{
            fontSize: 14,
            color: '#666',
            textAlign: 'center',
          }}>
            {translations.t137}
            <span style={{ animation: 'ember-preload-dot 1.4s infinite' }}>.</span>
            <span style={{ animation: 'ember-preload-dot 1.4s 0.2s infinite' }}>.</span>
            <span style={{ animation: 'ember-preload-dot 1.4s 0.4s infinite' }}>.</span>
          </div>

          {phase === 'loading' && (
            <div style={{
              fontSize: 12,
              color: '#999',
              textAlign: 'center',
            }}>
              {translations.t138}
            </div>
          )}
        </motion.div>
      </div>

      {/* Global keyframes */}
      <style>{`
        @keyframes ember-preload-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ember-preload-dot {
          0%, 20% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}