import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { Trash2, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SelectionListProps {
  items: string[];
  selectedItems: string[];
  onChange: (items: string[]) => void;
  variant?: 'pill' | 'grid';
  color?: 'indigo' | 'rose' | 'amber' | 'emerald';
  placeholder?: string;
  gridCols?: string;
  readOnly?: boolean;
}

export function SelectionList({ 
  items, 
  selectedItems, 
  onChange, 
  variant = 'pill',
  color = 'indigo', 
  placeholder = 'Add other...',
  gridCols = "grid-cols-2 md:grid-cols-3",
  readOnly = false
}: SelectionListProps) {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState('');

  const toggleItem = (item: string) => {
    if (readOnly) return;
    if (selectedItems.includes(item)) {
      onChange(selectedItems.filter(i => i !== item));
    } else {
      onChange([...selectedItems, item]);
    }
  };

  const handleAddCustom = () => {
    if (readOnly) return;
    const trimmed = inputValue.trim();
    if (trimmed && !selectedItems.includes(trimmed)) {
      onChange([...selectedItems, trimmed]);
      setInputValue('');
    }
  };

  const colorClasses = {
    indigo: "bg-indigo-600 text-white",
    rose: "bg-rose-600 text-white",
    amber: "bg-amber-600 text-white",
    emerald: "bg-emerald-600 text-white",
  };

  const gridSelectedClasses = {
    indigo: "border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
    rose: "border-rose-600 dark:border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
    amber: "border-amber-600 dark:border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    emerald: "border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  };

  return (
    <div className="space-y-4">
      {readOnly && selectedItems.length === 0 && (
        <p className="text-slate-400 dark:text-slate-500 text-sm italic">
          {t ? t('notSpecified') : 'Not specified'}
        </p>
      )}
      <div className={cn(variant === 'grid' ? cn("grid gap-3", gridCols) : "flex flex-wrap gap-2")}>
        {items.map(item => (
          <button
            key={item}
            onClick={() => toggleItem(item)}
            disabled={readOnly}
            className={cn(
              variant === 'grid' 
                ? "p-3 rounded-xl text-sm font-medium border transition-all text-left break-words"
                : "px-4 py-2 rounded-full text-sm font-medium transition-all",
              selectedItems.includes(item)
                ? (variant === 'grid' ? gridSelectedClasses[color] : colorClasses[color])
                : (variant === 'grid' 
                    ? "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-500"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"),
              readOnly && !selectedItems.includes(item) && "hidden"
            )}
          >
            {item}
          </button>
        ))}
        {selectedItems.filter(i => !items.includes(i)).map((item, index) => (
          <span 
            key={`custom-${index}`} 
            className={cn(
              variant === 'grid'
                ? "p-3 rounded-xl text-sm font-medium border transition-all text-left flex items-center justify-between"
                : "px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2",
              variant === 'grid' ? gridSelectedClasses[color] : colorClasses[color]
            )}
          >
            {item}
            {!readOnly && (
              <button onClick={() => toggleItem(item)} className="hover:opacity-80 shrink-0">
                <Trash2 size={14} />
              </button>
            )}
          </span>
        ))}
      </div>
      {!readOnly && (
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustom();
              }
            }}
            className={cn(
              "flex-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none transition-all text-sm dark:text-white focus:ring-2 outline-none",
              color === 'indigo' && "focus:ring-indigo-500",
              color === 'rose' && "focus:ring-rose-500",
              color === 'amber' && "focus:ring-amber-500",
              color === 'emerald' && "focus:ring-emerald-500"
            )}
            placeholder={placeholder}
          />
          <button
            onClick={handleAddCustom}
            className={cn(
              "p-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center",
              colorClasses[color]
            )}
          >
            <Plus size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
