import { useState, useMemo, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';

interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  label?: string;
  hasValue?: boolean;
}

export function Autocomplete({
  value,
  onChange,
  options,
  placeholder = '请输入',
  label,
  hasValue = false
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const inputClass = `w-full bg-white border border-[#E8E2DA] rounded-[20px] py-[20px] px-[24px] outline-none transition-all text-sm font-medium ${
    hasValue ? 'bg-[#FDF8F3] border-[#7B3F00]/30 text-[#7B3F00]' : 'text-[#3D2B1F]'
  } focus:border-[#7B3F00] focus:ring-4 focus:ring-[#7B3F00]/10 placeholder-[#A9A29A]`;

  const fuse = useMemo(() => new Fuse(options, {
    threshold: 0.4,
    distance: 100,
  }), [options]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return options.slice(0, 8);
    return fuse.search(query).map(r => r.item).slice(0, 8);
  }, [query, fuse, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSelect = (item: string) => {
    setQuery(item);
    onChange(item);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        type="text"
        value={query}
        onChange={e => { setQuery(e.target.value); onChange(e.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className={inputClass}
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-[12px] shadow-lg max-h-60 overflow-auto">
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 cursor-pointer hover:bg-[#FDF8F3] text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
