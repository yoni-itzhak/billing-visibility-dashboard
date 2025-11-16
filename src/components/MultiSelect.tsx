import { useState, useRef, useEffect } from 'react';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}

export default function MultiSelect({ options, selected, onChange, placeholder }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const displayText = selected.length === 0
    ? placeholder
    : selected.length === 1
    ? selected[0]
    : `${selected.length} selected`;

  return (
    <div ref={wrapperRef} className="relative min-w-[180px]">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2 border rounded-md text-sm bg-white cursor-pointer transition-colors min-h-[38px] flex items-center ${
          isOpen ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {displayText}
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
          {options.map(option => (
            <label
              key={option}
              className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
                className="mr-2 cursor-pointer"
              />
              <span className="flex-1 select-none">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

