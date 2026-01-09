import type { Location } from '@/entities/location';

interface SearchResultListProps {
  results: Location[];
  onSelect: (location: Location) => void;
  activeIndex: number;
}

export function SearchResultList({ results, onSelect, activeIndex }: SearchResultListProps) {
  if (results.length === 0) return null;

  return (
    <ul 
      className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-2xl glass-panel shadow-lg z-50 border border-slate-200 dark:border-slate-800"
    >
      {results.map((location, index) => {
        const displayPath = location.parts.join(' > ');
        
        return (
          <li key={location.id}>
            <button
              type="button"
              onClick={() => onSelect(location)}
              className={`w-full px-5 py-3 text-left transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
                index === activeIndex 
                  ? 'bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-light' 
                  : 'text-slate-700 dark:text-slate-200 hover:bg-primary/10'
              }`}
            >
              <div className="text-sm font-bold truncate">{location.parts[location.parts.length - 1]}</div>
              <div className="text-[11px] opacity-60 truncate">{displayPath}</div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
