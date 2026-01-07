import { useState, useRef, useEffect } from 'react';
import type { Location } from '@/entities/location';
import { useLocationSearch } from '../model/use-location-search';
import { SearchResultList } from './SearchResultList';

interface SearchBoxProps {
  onSelect: (location: Location) => void;
  placeholder?: string;
}

export function SearchBox({ onSelect, placeholder = '도시 이름을 검색하세요...' }: SearchBoxProps) {
  const { query, setQuery, results } = useLocationSearch();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setIsOpen(true);
  }

  function handleSelect(location: Location) {
    onSelect(location);
    setQuery(''); // 선택 후 입력 초기화
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative flex-1 max-w-lg">
      <label className="relative flex w-full items-center">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 pointer-events-none">
          <span className="material-symbols-outlined">search</span>
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="glass-input h-12 w-full rounded-full pl-11 pr-12 text-base text-[#111618] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white dark:placeholder:text-slate-400 border border-slate-200 shadow-sm"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-1.5 my-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </label>
      {isOpen && <SearchResultList results={results} onSelect={handleSelect} />}
    </div>
  );
}
