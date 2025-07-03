import React, { useState, useRef, useEffect } from 'react';
import { Tabs as UiTabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";

interface TabsProps {
  sheets: string[];
  activeSheet: string;
  onSheetChange: (sheet: string) => void;
  onAddSheet: () => void;
  onSheetRename: (oldName: string, newName: string) => void;
  onSheetDelete: (sheetName: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ sheets, activeSheet, onSheetChange, onAddSheet, onSheetRename, onSheetDelete }) => {
  const [editingSheet, setEditingSheet] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingSheet && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingSheet]);

  const handleDoubleClick = (sheet: string) => {
    setEditingSheet(sheet);
    setEditingValue(sheet);
  };

  const handleRename = () => {
    if (editingSheet && editingValue.trim() && editingSheet !== editingValue.trim()) {
      onSheetRename(editingSheet, editingValue.trim());
    }
    setEditingSheet(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditingSheet(null);
    }
  };

  return (
    <div className="flex items-center border-t bg-white px-12">
      <UiTabs value={activeSheet} onValueChange={onSheetChange} className="items-start inline-flex relative flex-[0_0_auto]">
        <TabsList className="bg-transparent p-0 h-auto">
          {sheets.map((sheet) => (
            <TabsTrigger
              key={sheet}
              value={sheet}
              onDoubleClick={() => handleDoubleClick(sheet)}
              className={`gap-2 px-4 py-2.5 rounded-none group relative ${
                activeSheet === sheet
                  ? "bg-[#e8f0e9] border-t-2 border-solid border-[#4b6a4f] text-[#3e5741] font-semibold"
                  : "text-[#757575]"
              }`}
            >
              {editingSheet === sheet ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-none focus:ring-0 focus:outline-none text-center"
                />
              ) : (
                <span className="px-1">{sheet}</span>
              )}
              {sheets.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSheetDelete(sheet);
                  }}
                  className="absolute top-1/2 right-1 transform -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-gray-300"
                  aria-label={`Delete ${sheet}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </TabsTrigger>
          ))}
          <button
            className="gap-1 px-1 py-2 self-stretch inline-flex items-center justify-center relative flex-[0_0_auto]"
            aria-label="Add new tab"
            onClick={onAddSheet}
          >
            <div className="inline-flex items-center gap-2 p-1 relative flex-[0_0_auto] bg-white rounded">
              <div className="relative w-5 h-5">
                <img
                  className="absolute w-[15px] h-[15px] top-0.5 left-0.5"
                  alt="Add tab"
                  src="https://c.animaapp.com/mclmkdkf288FZk/img/group-1.png"
                />
              </div>
            </div>
          </button>
        </TabsList>
      </UiTabs>
    </div>
  );
};
