import type { Location } from '@/entities/location';

interface SearchResultListProps {
  results: Location[];
  onSelect: (location: Location) => void;
  activeIndex: number;
}

export function SearchResultList({ results, onSelect, activeIndex }: SearchResultListProps) {
  if (results.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 p-5 text-center glass-panel bg-white/90 rounded-2xl shadow-lg z-50 border border-slate-200 text-slate-500 text-sm">
        해당 장소의 정보가 제공되지 않습니다.
      </div>
    );
  }

  return (
    <ul 
      className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-2xl glass-panel bg-white/90 shadow-lg z-50 border border-slate-200"
    >
      {results.map((location, index) => {
        return (
          <li key={location.id}>
            <button
              type="button"
              onClick={() => onSelect(location)}
              className={`w-full px-5 py-3 text-left transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
                index === activeIndex 
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
