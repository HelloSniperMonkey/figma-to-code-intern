import React from 'react';

interface TabsProps {
  sheets: string[];
  activeSheet: string;
  onSheetChange: (sheet: string) => void;
  onAddSheet: () => void;
}

export const Tabs: React.FC<TabsProps> = ({ sheets, activeSheet, onSheetChange, onAddSheet }) => {
  return (
    <div className="flex items-center border-t bg-muted/40">
      <div className="flex items-center">
        {sheets.map((sheet) => (
          <button
            key={sheet}
            onClick={() => onSheetChange(sheet)}
            className={`px-4 py-2 text-sm font-medium ${
              activeSheet === sheet
                ? 'border-b-2 border-primary text-primary bg-background'
                : 'text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {sheet}
          </button>
        ))}
      </div>
      <button onClick={onAddSheet} className="px-3 py-2 text-muted-foreground hover:bg-muted/80">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </button>
    </div>
  );
};
