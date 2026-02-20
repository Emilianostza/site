import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ProjectsProvider } from '@/services/dataProvider';
import {
  ChefHat,
  X,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  RotateCcw,
  Maximize2,
  Minimize2,
  Settings,
  Search,
  SlidersHorizontal,
  Phone,
  MapPin,
  Share2,
  QrCode,
  Copy,
  Download,
  Box,
  Clock,
} from 'lucide-react';
import { Project } from '@/types';
import { MenuSettingsModal } from '@/components/portal/MenuSettingsModal';
import { useToast } from '@/contexts/ToastContext';

// ─── Types ───────────────────────────────────────────────────────────────────

interface MenuItem {
  id: string;
  name: string;
  category: string;
  desc: string;
  price: string;
  image: string;
  calories: string;
  tags: string[];
  allergens: string[];
  modelUrl: string;
  pairsWell: string[];
}

interface Category {
  id: string;
  label: string;
  desc: string;
}

interface MenuSettings {
  title: string;
  brandColor: string;
  font: string;
  showPrices: boolean;
  currency: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  { id: 'starters', label: 'Starters', desc: 'Shareable small plates' },
  { id: 'mains', label: 'Main Courses', desc: 'Signature dishes' },
  { id: 'desserts', label: 'Desserts', desc: 'Sweet finales' },
];

const RESTAURANT_INFO = {
  cuisine: 'Contemporary European',
  neighborhood: 'Old Town',
  phone: '+1 555 0100',
  address: '12 Harbor Lane',
  hours: 'Mon–Sun 12:00–23:00',
  isOpen: true,
};

const INITIAL_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Wagyu Tartare',
    category: 'starters',
    desc: 'A5 wagyu, quail egg yolk, capers, shallots, dijon, served with crostini.',
    price: '$28',
    image: 'https://picsum.photos/seed/tartare/400/300',
    calories: '380 kcal',
    tags: ['Raw', "Chef's Pick"],
    allergens: ['Egg', 'Gluten'],
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    pairsWell: ['2', '3'],
  },
  {
    id: '2',
    name: 'Truffle Fries',
    category: 'starters',
    desc: 'Hand-cut Kennebec potatoes, parmesan dust, fresh herbs, drizzled with black truffle oil.',
    price: '$12',
    image: 'https://picsum.photos/seed/fries/400/300',
    calories: '450 kcal',
    tags: ['Vegetarian', 'Shareable'],
    allergens: ['Dairy'],
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    pairsWell: ['5'],
  },
  {
    id: '3',
    name: 'Signature Burger',
    category: 'mains',
    desc: 'Wagyu beef patty, aged white cheddar, house-made truffle aioli, caramelized onions on a toasted brioche bun.',
    price: '$24',
    image: 'https://picsum.photos/seed/burger/400/300',
    calories: '850 kcal',
    tags: ["Chef's Pick", 'Bestseller'],
    allergens: ['Gluten', 'Dairy', 'Egg'],
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    pairsWell: ['2', '4'],
  },
  {
    id: '4',
    name: 'Lobster Roll',
    category: 'mains',
    desc: 'Maine lobster, lemon-herb butter, chives, served on a toasted New England split-top roll.',
    price: '$32',
    image: 'https://picsum.photos/seed/lobster/400/300',
    calories: '520 kcal',
    tags: ['Premium', 'Seasonal'],
    allergens: ['Shellfish', 'Gluten', 'Dairy'],
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    pairsWell: ['2'],
  },
  {
    id: '5',
    name: 'Artisan Shake',
    category: 'desserts',
    desc: 'Tahitian vanilla bean, house salted caramel swirl, whipped cream, edible gold leaf.',
    price: '$16',
    image: 'https://picsum.photos/seed/shake/400/300',
    calories: '600 kcal',
    tags: ['Signature', 'Sweet'],
    allergens: ['Dairy', 'Egg'],
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    pairsWell: ['6'],
  },
  {
    id: '6',
    name: 'Crème Brûlée',
    category: 'desserts',
    desc: 'Classic Tahitian vanilla custard, torched sugar crust, fresh berries.',
    price: '$14',
    image: 'https://picsum.photos/seed/creme/400/300',
    calories: '420 kcal',
    tags: ['Dessert', 'Classic'],
    allergens: ['Dairy', 'Egg'],
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    pairsWell: ['5'],
  },
];

const TAG_STYLES: Record<string, string> = {
  "Chef's Pick": 'bg-amber-900/40 text-amber-300 border-amber-800/50',
  Bestseller: 'bg-orange-900/40 text-orange-300 border-orange-800/50',
  Vegetarian: 'bg-green-900/40 text-green-300 border-green-800/50',
  Shareable: 'bg-sky-900/40 text-sky-300 border-sky-800/50',
  Premium: 'bg-purple-900/40 text-purple-300 border-purple-800/50',
  Seasonal: 'bg-teal-900/40 text-teal-300 border-teal-800/50',
  Signature: 'bg-rose-900/40 text-rose-300 border-rose-800/50',
  Sweet: 'bg-pink-900/40 text-pink-300 border-pink-800/50',
  Dessert: 'bg-pink-900/40 text-pink-300 border-pink-800/50',
  Classic: 'bg-stone-700/60 text-stone-300 border-stone-600/40',
  Raw: 'bg-red-900/40 text-red-300 border-red-800/50',
  New: 'bg-blue-900/40 text-blue-300 border-blue-800/50',
  Popular: 'bg-amber-900/40 text-amber-300 border-amber-800/50',
};
const tagStyle = (tag: string) =>
  TAG_STYLES[tag] ?? 'bg-stone-800/60 text-stone-300 border-stone-700/40';

// ─── SkeletonCard ─────────────────────────────────────────────────────────────

const SkeletonCard: React.FC = () => (
  <div className="flex gap-3 bg-stone-900/60 border border-stone-800/60 rounded-xl overflow-hidden animate-pulse">
    <div className="w-20 h-20 bg-stone-800 flex-shrink-0" />
    <div className="flex-1 py-3 pr-3 space-y-2">
      <div className="h-4 bg-stone-800 rounded w-3/4" />
      <div className="h-3 bg-stone-800 rounded w-full" />
      <div className="h-3 bg-stone-800 rounded w-1/2" />
    </div>
  </div>
);

// ─── MenuHeader ───────────────────────────────────────────────────────────────

interface MenuHeaderProps {
  title: string;
  brandColor: string;
  isEditMode: boolean;
  isOwner: boolean;
  isSaving: boolean;
  onSettings: () => void;
  onSave: () => void;
  onShowQR: () => void;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({
  title,
  brandColor,
  isEditMode,
  isOwner,
  isSaving,
  onSettings,
  onSave,
  onShowQR,
}) => (
  <header className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur-xl border-b border-stone-800/60">
    <div className="px-4 md:px-6 h-14 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold tracking-wider"
          style={{
            backgroundColor: `${brandColor}20`,
            color: brandColor,
            border: `1px solid ${brandColor}40`,
          }}
        >
          {title.slice(0, 2).toUpperCase()}
        </div>
        <span className="font-semibold text-sm text-white truncate">{title}</span>
        {isEditMode && (
          <span
            className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
            style={{
              color: brandColor,
              borderColor: `${brandColor}50`,
              backgroundColor: `${brandColor}15`,
            }}
          >
            Editing
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <a
          href={`tel:${RESTAURANT_INFO.phone}`}
          className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label="Call restaurant"
        >
          <Phone className="w-4 h-4" />
        </a>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(RESTAURANT_INFO.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label="Get directions"
        >
          <MapPin className="w-4 h-4" />
        </a>
        {isOwner && (
          <>
            <button
              onClick={onShowQR}
              className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="QR code"
            >
              <QrCode className="w-4 h-4" />
            </button>
            {isEditMode && (
              <>
                <button
                  onClick={onSettings}
                  className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label="Menu settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={onSave}
                  disabled={isSaving}
                  className="ml-1 px-3 py-1.5 rounded-lg text-sm font-bold text-white transition-all disabled:opacity-50 hover:brightness-110 active:scale-95"
                  style={{ backgroundColor: brandColor }}
                >
                  {isSaving ? 'Saving…' : 'Save'}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  </header>
);

// ─── MenuHero ─────────────────────────────────────────────────────────────────

interface MenuHeroProps {
  title: string;
  brandColor: string;
  onViewSignature: () => void;
  onHowAR: () => void;
}

const MenuHero: React.FC<MenuHeroProps> = ({ title, brandColor, onViewSignature, onHowAR }) => (
  <section
    className="relative h-[56vw] min-h-[260px] max-h-[460px] overflow-hidden"
    aria-label="Hero"
  >
    <img
      src="https://picsum.photos/seed/restaurant-hero/1200/600"
      alt="Restaurant ambiance"
      className="w-full h-full object-cover"
      loading="eager"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/55 to-stone-950/10" />
    <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
      <p className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-1.5">
        {RESTAURANT_INFO.cuisine} · {RESTAURANT_INFO.neighborhood}
      </p>
      <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3 leading-tight">
        {title}
      </h1>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
            RESTAURANT_INFO.isOpen
              ? 'bg-green-900/50 text-green-300 border-green-800/50'
              : 'bg-red-900/50 text-red-300 border-red-800/50'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${RESTAURANT_INFO.isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}
          />
          {RESTAURANT_INFO.isOpen ? 'Open now' : 'Closed'}
        </span>
        <span className="text-xs text-stone-400 flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          {RESTAURANT_INFO.hours}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onViewSignature}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={{ backgroundColor: brandColor, boxShadow: `0 8px 24px -4px ${brandColor}60` }}
        >
          <Box className="w-4 h-4" />
          View signature dish in 3D
        </button>
        <button
          onClick={onHowAR}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-stone-200 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <Smartphone className="w-4 h-4" />
          How AR works
        </button>
      </div>
    </div>
  </section>
);

// ─── CategoryTabs ─────────────────────────────────────────────────────────────

interface CategoryTabsProps {
  categories: Category[];
  items: MenuItem[];
  active: string;
  onSelect: (id: string) => void;
  onSearchToggle: () => void;
  onFilterToggle: () => void;
  brandColor: string;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  items,
  active,
  onSelect,
  onSearchToggle,
  onFilterToggle,
  brandColor,
}) => {
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tabsRef.current?.querySelector(`[data-cat="${active}"]`) as HTMLElement | null;
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [active]);

  return (
    <nav
      className="sticky z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800/50"
      style={{ top: '56px' }}
      aria-label="Menu categories"
    >
      <div className="flex items-center gap-1 px-4 md:px-6">
        <div
          ref={tabsRef}
          className="flex-1 flex gap-0.5 overflow-x-auto scrollbar-none py-1.5"
          role="tablist"
        >
          {categories.map((cat) => {
            const count = items.filter((i) => i.category === cat.id).length;
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                data-cat={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelect(cat.id)}
                className="relative flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                style={{ color: isActive ? brandColor : undefined }}
              >
                <span
                  className={isActive ? 'font-semibold' : 'text-stone-500 hover:text-stone-300'}
                >
                  {cat.label}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${isActive ? 'bg-stone-800 text-stone-400' : 'text-stone-600'}`}
                >
                  {count}
                </span>
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-t-full"
                    style={{ backgroundColor: brandColor }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0 py-1.5">
          <button
            onClick={onSearchToggle}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-300 hover:bg-stone-800/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Search menu"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={onFilterToggle}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-300 hover:bg-stone-800/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Filter menu"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

// ─── MenuItemCard ─────────────────────────────────────────────────────────────

interface MenuItemCardProps {
  item: MenuItem;
  brandColor: string;
  showPrices: boolean;
  currency: string;
  isEditMode: boolean;
  onDetails: () => void;
  onView3D: () => void;
  onUpdate: (field: keyof MenuItem, value: string) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  brandColor,
  showPrices,
  currency,
  isEditMode,
  onDetails,
  onView3D,
  onUpdate,
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const has3D = Boolean(item.modelUrl);

  return (
    <article className="group flex gap-3 bg-stone-900/60 border border-stone-800/60 rounded-xl overflow-hidden hover:border-stone-700 hover:bg-stone-900 transition-all duration-200">
      <div className="relative w-20 h-20 flex-shrink-0 bg-stone-800 overflow-hidden">
        {!imgLoaded && <div className="absolute inset-0 bg-stone-800 animate-pulse" />}
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        {has3D && (
          <div
            className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded text-white uppercase tracking-wider"
            style={{ backgroundColor: `${brandColor}e0` }}
          >
            3D
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 py-3 pr-3 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            {isEditMode ? (
              <input
                value={item.name}
                onChange={(e) => onUpdate('name', e.target.value)}
                className="bg-stone-800 text-white font-semibold text-sm rounded px-2 py-0.5 w-full border border-stone-700 focus:border-amber-500 outline-none"
              />
            ) : (
              <h3 className="text-sm font-semibold text-white leading-snug truncate">
                {item.name}
              </h3>
            )}
            {showPrices && (
              <span
                className="text-sm font-bold font-mono flex-shrink-0"
                style={{ color: brandColor }}
              >
                {item.price.replace('$', currency)}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 mb-2">{item.desc}</p>
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {item.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className={`text-[10px] px-1.5 py-0.5 rounded-md border font-medium ${tagStyle(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onDetails}
            className="text-xs font-medium text-stone-500 hover:text-stone-200 transition-colors underline underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 rounded"
          >
            Details
          </button>
          {has3D && (
            <button
              onClick={onView3D}
              className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full text-white transition-all active:scale-95 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-900"
              style={{ backgroundColor: brandColor }}
            >
              <Box className="w-3 h-3" />
              3D / AR
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

// ─── MenuSection ──────────────────────────────────────────────────────────────

interface MenuSectionProps {
  category: Category;
  items: MenuItem[];
  brandColor: string;
  showPrices: boolean;
  currency: string;
  isEditMode: boolean;
  sectionRef: (el: HTMLElement | null) => void;
  onDetails: (item: MenuItem) => void;
  onView3D: (item: MenuItem) => void;
  onUpdate: (id: string, field: keyof MenuItem, value: string) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  category,
  items,
  brandColor,
  showPrices,
  currency,
  isEditMode,
  sectionRef,
  onDetails,
  onView3D,
  onUpdate,
}) => (
  <section
    ref={sectionRef}
    id={`cat-${category.id}`}
    aria-labelledby={`heading-${category.id}`}
    className="scroll-mt-28"
  >
    <div className="mb-4">
      <h2 id={`heading-${category.id}`} className="text-lg font-bold text-white">
        {category.label}
      </h2>
      <p className="text-xs text-stone-500 mt-0.5">{category.desc}</p>
    </div>
    <div className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          brandColor={brandColor}
          showPrices={showPrices}
          currency={currency}
          isEditMode={isEditMode}
          onDetails={() => onDetails(item)}
          onView3D={() => onView3D(item)}
          onUpdate={(field, value) => onUpdate(item.id, field, value)}
        />
      ))}
    </div>
  </section>
);

// ─── ItemDetailsSheet ─────────────────────────────────────────────────────────

interface ItemDetailsSheetProps {
  item: MenuItem | null;
  allItems: MenuItem[];
  brandColor: string;
  showPrices: boolean;
  currency: string;
  onClose: () => void;
  onView3D: () => void;
  onSelectItem: (item: MenuItem) => void;
}

const ItemDetailsSheet: React.FC<ItemDetailsSheetProps> = ({
  item,
  allItems,
  brandColor,
  showPrices,
  currency,
  onClose,
  onView3D,
  onSelectItem,
}) => {
  const open = Boolean(item);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: item?.name ?? '', url });
    else navigator.clipboard.writeText(url);
  };

  const relatedItems = item
    ? (item.pairsWell.map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as MenuItem[])
    : [];

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item?.name ?? 'Item details'}
        className={`fixed z-[70] bg-stone-950 border-stone-800 flex flex-col transition-transform duration-300
          bottom-0 left-0 right-0 max-h-[90dvh] rounded-t-2xl border-t
          md:top-0 md:right-0 md:left-auto md:bottom-0 md:w-[420px] md:max-h-none md:rounded-none md:rounded-l-2xl md:border-l md:border-t-0
          ${open ? 'translate-y-0 md:translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}
      >
        <div className="flex justify-center pt-3 pb-1 md:hidden flex-shrink-0">
          <div className="w-10 h-1 bg-stone-700 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-stone-800 flex-shrink-0">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-white truncate mx-3">{item?.name}</span>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {item && (
            <>
              <div className="aspect-video w-full bg-stone-800 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="p-5 space-y-5">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <h2 className="text-xl font-bold text-white font-serif leading-snug">
                      {item.name}
                    </h2>
                    {showPrices && (
                      <span
                        className="text-xl font-bold font-mono flex-shrink-0"
                        style={{ color: brandColor }}
                      >
                        {item.price.replace('$', currency)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${tagStyle(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-stone-400 leading-relaxed">{item.desc}</p>

                <div className="flex items-center justify-between text-sm py-3 border-y border-stone-800/60">
                  <span className="text-stone-500">Calories</span>
                  <span className="text-stone-300 font-mono">{item.calories}</span>
                </div>

                {item.allergens.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">
                      Allergens
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {item.allergens.map((a) => (
                        <span
                          key={a}
                          className="text-xs px-2.5 py-1 rounded-full bg-stone-800 text-stone-300 border border-stone-700"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {relatedItems.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">
                      Pairs well with
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                      {relatedItems.map((rel) => (
                        <button
                          key={rel.id}
                          onClick={() => onSelectItem(rel)}
                          className="flex-shrink-0 flex flex-col items-center gap-1.5 w-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-stone-800">
                            <img
                              src={rel.image}
                              alt={rel.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-[11px] text-stone-400 text-center line-clamp-2 leading-tight">
                            {rel.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-1 pb-4">
                  {item.modelUrl && (
                    <button
                      onClick={onView3D}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950"
                      style={{ backgroundColor: brandColor }}
                    >
                      <Box className="w-4 h-4" />
                      View in 3D / AR
                    </button>
                  )}
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// ─── ModelViewerOverlay ───────────────────────────────────────────────────────

interface ModelViewerOverlayProps {
  item: MenuItem;
  items: MenuItem[];
  currentIndex: number;
  brandColor: string;
  onClose: () => void;
  onNavigate: (dir: 1 | -1) => void;
}

const ModelViewerOverlay: React.FC<ModelViewerOverlayProps> = ({
  item,
  items,
  currentIndex,
  brandColor,
  onClose,
  onNavigate,
}) => {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lighting, setLighting] = useState<'studio' | 'natural'>('studio');
  const [showHints, setShowHints] = useState(() => !sessionStorage.getItem('mv-hints-shown'));

  useEffect(() => {
    setModelLoaded(false);
    setModelError(false);
  }, [item.id]);

  useEffect(() => {
    if (!showHints) return;
    const t = setTimeout(() => {
      sessionStorage.setItem('mv-hints-shown', '1');
      setShowHints(false);
    }, 4500);
    return () => clearTimeout(t);
  }, [showHints]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(-1);
      if (e.key === 'ArrowRight') onNavigate(1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onNavigate]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleAR = () => {
    const viewer = document.querySelector('model-viewer') as HTMLElement & {
      activateAR?: () => void;
    };
    viewer?.activateAR?.();
  };

  const handleReset = () => {
    const viewer = document.querySelector('model-viewer') as HTMLElement;
    viewer?.setAttribute('camera-orbit', '45deg 75deg 1.5m');
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-stone-950 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`3D viewer: ${item.name}`}
    >
      {/* 3D viewport */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, #292524 0%, #0c0a09 70%)' }}
      >
        {!modelError ? (
          <model-viewer
            key={item.id}
            src={item.modelUrl}
            alt={`3D model of ${item.name}`}
            auto-rotate
            auto-rotate-delay="600"
            rotation-per-second="18deg"
            camera-controls
            camera-orbit="45deg 75deg 1.5m"
            shadow-intensity="1"
            shadow-softness="0.6"
            exposure={lighting === 'studio' ? '0.9' : '1.4'}
            ar
            ar-modes="webxr scene-viewer quick-look"
            touch-action="pan-y"
            interaction-prompt="none"
            loading="eager"
            style={{ width: '100%', height: '100%' }}
            onLoad={() => setModelLoaded(true)}
            onError={() => setModelError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-40 h-40 rounded-2xl object-cover opacity-50"
            />
            <p className="text-stone-400 text-sm">3D preview unavailable</p>
            <button
              onClick={() => {
                setModelError(false);
                setModelLoaded(false);
              }}
              className="text-xs text-stone-500 hover:text-stone-300 underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}

        {!modelLoaded && !modelError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-stone-950/70 pointer-events-none">
            <div
              className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: `${brandColor} transparent transparent transparent` }}
            />
            <p className="text-stone-400 text-sm font-mono">Loading model…</p>
          </div>
        )}

        {showHints && modelLoaded && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none">
            {[
              { icon: '↺', text: 'Drag to rotate' },
              { icon: '⊕', text: 'Pinch to zoom' },
              { icon: '📱', text: 'Tap AR to place' },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-1.5 text-xs text-stone-300 bg-stone-900/90 backdrop-blur px-3 py-1.5 rounded-full border border-stone-800 animate-pulse"
              >
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        )}

        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-stone-950/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-stone-950/80 to-transparent pointer-events-none" />
      </div>

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 h-14">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-800 text-stone-300 hover:text-white transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label="Close viewer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Back</span>
        </button>

        <span className="text-sm font-semibold text-white truncate max-w-[45%] text-center">
          {item.name}
        </span>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-stone-500 font-mono bg-stone-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-stone-800">
            {currentIndex + 1}/{items.length}
          </span>
          <button
            onClick={() => setIsFullscreen((v) => !v)}
            className="p-2 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-800 text-stone-400 hover:text-white transition-colors hidden md:flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Nav arrows */}
      <button
        onClick={() => onNavigate(-1)}
        disabled={currentIndex === 0}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-800 text-stone-300 hover:text-white transition-all disabled:opacity-20 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        aria-label="Previous item"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => onNavigate(1)}
        disabled={currentIndex === items.length - 1}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-800 text-stone-300 hover:text-white transition-all disabled:opacity-20 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        aria-label="Next item"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Controls row */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-stone-900/90 backdrop-blur-md border border-stone-800 text-stone-300 hover:text-white transition-colors text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label="Reset camera"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
        <button
          onClick={() => setLighting((l) => (l === 'studio' ? 'natural' : 'studio'))}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-stone-900/90 backdrop-blur-md border border-stone-800 text-stone-300 hover:text-white transition-colors text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label="Toggle lighting"
        >
          <span className="hidden sm:inline">
            {lighting === 'studio' ? '☀ Natural' : '💡 Studio'}
          </span>
          <span className="sm:hidden">Light</span>
        </button>
        <button
          onClick={handleAR}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold transition-all hover:brightness-110 active:scale-95 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950"
          style={{ backgroundColor: brandColor, boxShadow: `0 8px 20px -4px ${brandColor}60` }}
          aria-label="View in AR"
        >
          <Smartphone className="w-4 h-4" />
          AR
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="absolute bottom-5 right-5 z-10 hidden lg:flex items-center gap-2 text-stone-600 text-[10px] font-mono">
        <kbd className="px-1.5 py-0.5 border border-stone-800 rounded">ESC</kbd> close
        <kbd className="px-1.5 py-0.5 border border-stone-800 rounded">← →</kbd> navigate
      </div>
    </div>
  );
};

// ─── FilterSheet ──────────────────────────────────────────────────────────────

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  brandColor: string;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ open, onClose, brandColor }) => {
  const FILTERS = ['Vegetarian', 'Vegan', 'Gluten-free', 'Spicy', "Chef's Pick", 'New'];
  const [active, setActive] = useState<string[]>([]);
  const toggle = (f: string) =>
    setActive((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter menu"
        className={`fixed bottom-0 left-0 right-0 z-[70] bg-stone-950 border-t border-stone-800 rounded-t-2xl transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-stone-700 rounded-full" />
        </div>
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Filter</h2>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white transition-colors"
              aria-label="Close filter"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => toggle(f)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  active.includes(f)
                    ? 'text-white border-transparent'
                    : 'text-stone-400 border-stone-700 hover:border-stone-600'
                }`}
                style={
                  active.includes(f) ? { backgroundColor: brandColor, borderColor: brandColor } : {}
                }
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
            style={{ backgroundColor: brandColor }}
          >
            Apply{active.length > 0 ? ` (${active.length})` : ''}
          </button>
        </div>
      </div>
    </>
  );
};

// ─── HowARSheet ───────────────────────────────────────────────────────────────

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  brandColor: string;
}

const HowARSheet: React.FC<BottomSheetProps> = ({ open, onClose, brandColor }) => (
  <>
    <div
      className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      aria-hidden="true"
    />
    <div
      role="dialog"
      aria-modal="true"
      aria-label="How AR works"
      className={`fixed bottom-0 left-0 right-0 z-[70] bg-stone-950 border-t border-stone-800 rounded-t-2xl transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 bg-stone-700 rounded-full" />
      </div>
      <div className="px-5 py-4 pb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white">How AR works</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {[
            {
              step: '1',
              title: 'Tap "3D / AR" on any dish',
              desc: 'Look for the 3D badge on menu cards — tap View in 3D / AR to open the immersive viewer.',
            },
            {
              step: '2',
              title: 'Tap the AR button',
              desc: 'Point your phone at any flat surface. The dish appears at real scale, right on your table.',
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4 items-start">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ backgroundColor: brandColor }}
              >
                {step}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

// ─── QRPanel ──────────────────────────────────────────────────────────────────

const QRPanel: React.FC<BottomSheetProps> = ({ open, onClose, brandColor }) => {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&bgcolor=0c0a09&color=ffffff&margin=2`;

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu QR code"
        className={`fixed bottom-0 left-0 right-0 z-[70] bg-stone-950 border-t border-stone-800 rounded-t-2xl transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-stone-700 rounded-full" />
        </div>
        <div className="px-5 py-4 pb-8 flex flex-col items-center gap-5">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-base font-bold text-white">QR Code</h2>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="w-44 h-44 rounded-xl overflow-hidden border border-stone-800 bg-stone-900">
            <img src={qrSrc} alt="Menu QR code" className="w-full h-full" />
          </div>
          <p className="text-xs text-stone-500 text-center">Scan to open this menu on any device</p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => navigator.clipboard.writeText(url)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 transition-colors"
            >
              <Copy className="w-4 h-4" /> Copy link
            </button>
            <a
              href={qrSrc}
              download="menu-qr.png"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110"
              style={{ backgroundColor: brandColor }}
            >
              <Download className="w-4 h-4" /> Download QR
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── RestaurantMenu (main) ────────────────────────────────────────────────────

const RestaurantMenu: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { success } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_ITEMS);

  const isEditMode = location.pathname.endsWith('/edit');
  const isOwner = isEditMode;
  const [isSaving, setIsSaving] = useState(false);

  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [viewerItem, setViewerItem] = useState<MenuItem | null>(null);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showHowAR, setShowHowAR] = useState(false);
  const [showQRPanel, setShowQRPanel] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [menuSettings, setMenuSettings] = useState<MenuSettings>({
    title: 'Restaurant Menu',
    brandColor: '#d97706',
    font: 'serif',
    showPrices: true,
    currency: '$',
  });

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projects = (await ProjectsProvider.list()) as unknown as Project[];
        const found = projects.find((p) => p.id === id);
        if (found) setProject(found);
      } catch {
        console.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (project) setMenuSettings((prev) => ({ ...prev, title: project.name }));
  }, [project]);

  // Intersection observer → active category
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const catId = entry.target.id.replace('cat-', '');
            setActiveCategory(catId);
          }
        });
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  // Load model-viewer lazily
  useEffect(() => {
    if (viewerItem) import('@google/model-viewer');
  }, [viewerItem]);

  const handleUpdateItem = (itemId: string, field: keyof MenuItem, value: string) => {
    setMenuItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, [field]: value } : i)));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      success('Changes saved!');
    }, 1000);
  };

  const handleCategorySelect = (catId: string) => {
    setActiveCategory(catId);
    const el = document.getElementById(`cat-${catId}`);
    if (el) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const openViewer = (item: MenuItem) => {
    setSelectedItem(null);
    setViewerItem(item);
  };

  const navigateViewer = useCallback(
    (dir: 1 | -1) => {
      if (!viewerItem) return;
      const idx = menuItems.findIndex((i) => i.id === viewerItem.id);
      const next = idx + dir;
      if (next >= 0 && next < menuItems.length) setViewerItem(menuItems[next]);
    },
    [viewerItem, menuItems]
  );

  const filteredItems = searchQuery.trim()
    ? menuItems.filter(
        (i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : menuItems;

  const brand = menuSettings.brandColor;

  // CSS tokens
  const cssVars = {
    '--brand': brand,
    '--bg': '#0c0a09',
    '--surface': '#1c1917',
    '--text': '#fafaf9',
    '--muted': '#78716c',
    '--border': '#292524',
    '--radius': '12px',
  } as React.CSSProperties;

  if (loading) {
    return (
      <div
        className="min-h-screen bg-stone-950 text-white"
        aria-busy="true"
        aria-label="Loading menu"
      >
        <div className="h-14 bg-stone-900 border-b border-stone-800 animate-pulse" />
        <div className="h-64 bg-stone-900 animate-pulse" />
        <div className="h-11 bg-stone-900/80 border-b border-stone-800 animate-pulse" />
        <div className="px-4 py-6 space-y-3 max-w-2xl mx-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-stone-950 min-h-screen text-amber-50 flex flex-col items-center justify-center gap-4">
        <ChefHat className="w-12 h-12 text-stone-600" />
        <p className="text-stone-400">Menu not found</p>
        <button
          onClick={() => navigate(-1)}
          className="text-amber-500 hover:text-amber-400 text-sm underline underline-offset-4"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-900 selection:text-white"
      style={cssVars}
      {...(import.meta.env.DEV && {
        'data-component': 'RestaurantMenu',
        'data-file': 'src/pages/templates/RestaurantMenu.tsx',
      })}
    >
      <MenuSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentSettings={menuSettings}
        onSave={(s) => {
          setMenuSettings(s);
          if (project) setProject({ ...project, name: s.title });
        }}
      />

      {/* Owner preview badge */}
      {isOwner && (
        <div className="fixed z-30 top-16 left-1/2 -translate-x-1/2 mt-1 pointer-events-none">
          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-900/50 text-amber-400 border border-amber-800/40 backdrop-blur-sm">
            Owner Preview
          </span>
        </div>
      )}

      <MenuHeader
        title={menuSettings.title}
        brandColor={brand}
        isEditMode={isEditMode}
        isOwner={isOwner}
        isSaving={isSaving}
        onSettings={() => setIsSettingsOpen(true)}
        onSave={handleSave}
        onShowQR={() => setShowQRPanel(true)}
      />

      <MenuHero
        title={menuSettings.title}
        brandColor={brand}
        onViewSignature={() => {
          const first = menuItems.find((i) => i.modelUrl);
          if (first) openViewer(first);
        }}
        onHowAR={() => setShowHowAR(true)}
      />

      <CategoryTabs
        categories={CATEGORIES}
        items={filteredItems}
        active={activeCategory}
        onSelect={handleCategorySelect}
        onSearchToggle={() => {
          setShowSearch((v) => !v);
          setSearchQuery('');
        }}
        onFilterToggle={() => setShowFilterSheet(true)}
        brandColor={brand}
      />

      {/* Search bar */}
      {showSearch && (
        <div
          className="sticky z-30 bg-stone-950/95 backdrop-blur-md border-b border-stone-800/50 px-4 py-2.5"
          style={{ top: '96px' }}
        >
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
            <input
              autoFocus
              type="search"
              placeholder="Search dishes…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-9 pr-9 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-10" id="menu-content">
        {searchQuery.trim() ? (
          <section aria-label="Search results">
            <p className="text-xs text-stone-500 mb-4">
              {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for &ldquo;
              {searchQuery}&rdquo;
            </p>
            <div className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  brandColor={brand}
                  showPrices={menuSettings.showPrices}
                  currency={menuSettings.currency}
                  isEditMode={isEditMode}
                  onDetails={() => setSelectedItem(item)}
                  onView3D={() => openViewer(item)}
                  onUpdate={(field, value) => handleUpdateItem(item.id, field, value)}
                />
              ))}
            </div>
          </section>
        ) : (
          CATEGORIES.map((cat) => {
            const catItems = filteredItems.filter((i) => i.category === cat.id);
            if (catItems.length === 0) return null;
            return (
              <MenuSection
                key={cat.id}
                category={cat}
                items={catItems}
                brandColor={brand}
                showPrices={menuSettings.showPrices}
                currency={menuSettings.currency}
                isEditMode={isEditMode}
                sectionRef={(el) => {
                  sectionRefs.current[cat.id] = el;
                }}
                onDetails={(item) => setSelectedItem(item)}
                onView3D={(item) => openViewer(item)}
                onUpdate={handleUpdateItem}
              />
            );
          })
        )}
      </main>

      <footer className="mt-4 pt-6 pb-10 text-center text-stone-700 text-xs font-mono border-t border-stone-900">
        Powered by Managed Capture 3D
      </footer>

      {/* ── Sheets & Overlays ── */}
      <ItemDetailsSheet
        item={selectedItem}
        allItems={menuItems}
        brandColor={brand}
        showPrices={menuSettings.showPrices}
        currency={menuSettings.currency}
        onClose={() => setSelectedItem(null)}
        onView3D={() => {
          if (selectedItem) openViewer(selectedItem);
        }}
        onSelectItem={(item) => setSelectedItem(item)}
      />

      {viewerItem && (
        <ModelViewerOverlay
          item={viewerItem}
          items={menuItems}
          currentIndex={menuItems.findIndex((i) => i.id === viewerItem.id)}
          brandColor={brand}
          onClose={() => setViewerItem(null)}
          onNavigate={navigateViewer}
        />
      )}

      <FilterSheet
        open={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        brandColor={brand}
      />
      <HowARSheet open={showHowAR} onClose={() => setShowHowAR(false)} brandColor={brand} />
      <QRPanel open={showQRPanel} onClose={() => setShowQRPanel(false)} brandColor={brand} />
    </div>
  );
};

export default RestaurantMenu;
