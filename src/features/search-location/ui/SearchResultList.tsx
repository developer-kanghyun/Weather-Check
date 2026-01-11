import type { Location } from '@/entities/location';

interface SearchResultListProps {
  results: Location[];
  onSelect: (location: Location) => void;
  activeIndex: number;
}

export function SearchResultList({ results, onSelect, activeIndex }: SearchResultListProps) {
  if (results.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 p-4 text-center glass-panel bg-white/[0.98] backdrop-blur-lg rounded-2xl shadow-xl z-50 border border-slate-200 text-slate-700 text-xs font-bold leading-relaxed">
        해당 장소의 정보가 제공되지 않습니다.
      </div>
    );
  }

  return (
    <ul 
      className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-3xl glass-panel bg-white/[0.98] backdrop-blur-lg shadow-2xl z-50 border border-slate-200 scrollbar-hide py-1.5"
    >
      {results.map((location, index) => {
        const isSelected = index === activeIndex || (activeIndex === -1 && index === 0);
        return (
          <li key={location.id} className="px-1.5">
            <button
              type="button"
              onClick={() => onSelect(location)}
              className={`w-full px-4 py-3 text-left transition-colors rounded-xl ${
                isSelected 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-slate-700 hover:bg-primary/10'
              }`}
            >
              <div className="flex flex-col gap-0.5 overflow-hidden">
                <span className="text-sm font-bold truncate text-[#111618]">
                  {location.parts[location.parts.length - 1]}
                </span>
                <span className="text-xs text-slate-500 truncate">
                  {location.fullAddress}
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
