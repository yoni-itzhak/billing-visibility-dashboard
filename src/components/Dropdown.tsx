import { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  id: string;
  value: string;
  suggestions: string[];
  placeholder: string;
  onChange: (value: string) => void;
}

export default function Dropdown({
  id,
  value,
  suggestions,
  placeholder,
  onChange,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();
    onChange(e.target.value);
    
    if (inputValue.length === 0) {
      setFilteredSuggestions(suggestions);
      setIsOpen(true);
      return;
    }

    const filtered = suggestions.filter(s => s.toLowerCase().includes(inputValue));
    setFilteredSuggestions(filtered);
    setIsOpen(filtered.length > 0);
  };

  const handleInputClick = () => {
    const inputValue = value.toLowerCase();
    if (inputValue.length === 0) {
      setFilteredSuggestions(suggestions);
    } else {
      const filtered = suggestions.filter(s => s.toLowerCase().includes(inputValue));
      setFilteredSuggestions(filtered);
    }
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        id={id}
        value={value}
        onChange={handleInputChange}
        onClick={handleInputClick}
        placeholder={placeholder}
        autoComplete="off"
        className="px-3 py-2.5 border border-gray-300 rounded-md text-sm min-w-[200px] bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-2.5 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

