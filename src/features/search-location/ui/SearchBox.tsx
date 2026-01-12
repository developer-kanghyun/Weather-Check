import { useState, useRef, useEffect } from 'react';
import type { Location } from '@/entities/location';
import { useLocationSearch } from '../model/use-location-search';
import { SearchResultList } from './SearchResultList';

interface SearchBoxProps {
  onSelect: (location: Location) => void;
  placeholder?: string;
}

export const SearchBox = ({ onSelect, placeholder = '지역을 검색하세요' }: SearchBoxProps) => {
  const { query, setQuery, results } = useLocationSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isComposing, setIsComposing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  }

  const handleSelect = (location: Location) => {
    onSelect(location);
    setQuery('');
    setIsOpen(false);
    setActiveIndex(-1);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((isComposing || e.nativeEvent.isComposing) && e.key === 'Enter') return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') setIsOpen(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > -1 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        const targetIdx = activeIndex >= 0 ? activeIndex : 0;
        if (results[targetIdx]) {
          handleSelect(results[targetIdx]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }

  return (
    <div ref={containerRef} className="relative flex-1 max-w-lg">
      <div className="relative flex w-full items-center">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 pointer-events-none">
          <span className="material-symbols-outlined">search</span>
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="glass-input h-12 w-full rounded-full pl-11 pr-12 text-base text-[#111618] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white dark:placeholder:text-slate-400 border border-slate-200 shadow-sm"
        />
        <button
          type="button"
          onClick={() => results.length > 0 && handleSelect(results[activeIndex >= 0 ? activeIndex : 0])}
          className="absolute inset-y-0 right-1.5 my-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
      {isOpen && query.trim() !== '' && (
        <SearchResultList 
          results={results} 
          onSelect={handleSelect} 
          activeIndex={activeIndex}
        />
      )}
    </div>
  );
}
