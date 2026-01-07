import type { Location } from '@/entities/location';

interface SearchResultListProps {
  results: Location[];
  onSelect: (location: Location) => void;
}

export function SearchResultList({ results, onSelect }: SearchResultListProps) {
  if (results.length === 0) return null;

  return (
    <ul className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-2xl glass-panel shadow-lg z-50">
      {results.map((location) => (
        <li key={location.id}>
          <button
            type="button"
            onClick={() => onSelect(location)}
            className="w-full px-5 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-primary/10 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
          >
            {location.displayLabel}
          </button>
        </li>
      ))}
    </ul>
  );
}
