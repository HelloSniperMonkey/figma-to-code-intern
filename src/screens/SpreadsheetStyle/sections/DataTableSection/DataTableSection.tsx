"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Copy,
  ClipboardPasteIcon as Paste,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Tabs } from "./Tabs";

interface CellData {
  value: string;
  formula?: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    align?: "left" | "center" | "right";
    fontSize?: number;
    fontFamily?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

interface SpreadsheetData {
  [key: string]: CellData;
}

interface Sheet {
  data: SpreadsheetData;
  history: SpreadsheetData[];
  historyIndex: number;
}

interface Sheets {
  [key: string]: Sheet;
}

interface DataTableSectionProps {
  isToolbarVisible: boolean;
  cols: number;
  columnNames: { [key: number]: string };
  onColumnRename: (colIndex: number, newName: string) => void;
}

export const DataTableSection = ({ isToolbarVisible, cols, columnNames, onColumnRename }: DataTableSectionProps): JSX.Element => {
  const [sheets, setSheets] = useState<Sheets>({
    Sheet1: { data: {}, history: [{}], historyIndex: 0 },
  });
  const [activeSheet, setActiveSheet] = useState<string>("Sheet1");
  const [selectedCell, setSelectedCell] = useState<string>("A1");
  const [formulaBarValue, setFormulaBarValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [clipboard, setClipboard] = useState<string>("");

  const [columnWidths, setColumnWidths] = useState<{ [key: number]: number }>({});
  const [rowHeights, setRowHeights] = useState<{ [key: number]: number }>({});
  const [rows, setRows] = useState(50);
  const [numRowsToAdd, setNumRowsToAdd] = useState(1);
  const [editingColumn, setEditingColumn] = useState<number | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<{ [key: string]: HTMLInputElement }>({});

  const { data, history, historyIndex } = sheets[activeSheet];

  // Generate column letters (A, B, C, ..., Z)
  const getColumnLetter = (index: number): string => {
    return String.fromCharCode(65 + index);
  };

  // Parse cell reference (e.g., "A1" -> {col: 0, row: 0})
  const parseCellRef = (cellRef: string) => {
    const match = cellRef.match(/^([A-Z]+)(\d+)$/);
    if (!match) return null;
    const col = match[1].charCodeAt(0) - 65;
    const row = Number.parseInt(match[2]) - 1;
    return { col, row };
  };

  // Get cell reference from coordinates
  const getCellRef = (col: number, row: number): string => {
    return `${getColumnLetter(col)}${row + 1}`;
  };

  // Evaluate formula
  const evaluateFormula = useCallback((formula: string, currentData: SpreadsheetData): string => {
    if (!formula.startsWith("=")) return formula;

    try {
      let expression = formula.slice(1);

      // Replace cell references with their values
      expression = expression.replace(/[A-Z]+\d+/g, (cellRef) => {
        const cellData = currentData[cellRef];
        if (!cellData) return "0";
        const value = cellData.formula ? evaluateFormula(cellData.formula, currentData) : cellData.value;
        return isNaN(Number(value)) ? "0" : value;
      });

      // Basic math evaluation (simplified)
      const result = Function(`"use strict"; return (${expression})`)();
      return isNaN(result) ? "#ERROR" : result.toString();
    } catch {
      return "#ERROR";
    }
  }, []);

  // Update cell data
  const updateCell = useCallback(
    (cellRef: string, value: string, isFormula = false) => {
      setSheets((prevSheets) => {
        const newSheets = { ...prevSheets };
        const newSheet = { ...newSheets[activeSheet] };
        const newData = { ...newSheet.data };
        const cellData = newData[cellRef] || { value: "" };

        if (isFormula) {
          cellData.formula = value;
          cellData.value = evaluateFormula(value, newData);
        } else {
          cellData.value = value;
          delete cellData.formula;
        }

        newData[cellRef] = cellData;

        // Recalculate all formulas
        Object.keys(newData).forEach((key) => {
          const cell = newData[key];
          if (cell.formula) {
            cell.value = evaluateFormula(cell.formula, newData);
          }
        });

        newSheet.data = newData;
        newSheets[activeSheet] = newSheet;
        return newSheets;
      });
    },
    [activeSheet, evaluateFormula],
  );

  // Handle cell selection
  const handleCellSelect = (cellRef: string) => {
    if (isEditing) return;
    setSelectedCell(cellRef);
    const cellData = data[cellRef];
    setFormulaBarValue(cellData?.formula || cellData?.value || "");
  };

  // Handle cell edit
  const handleCellEdit = (cellRef: string, value: string) => {
    const isFormula = value.startsWith("=");
    updateCell(cellRef, value, isFormula);

    // Add to history
    setSheets((prev) => {
      const newSheets = { ...prev };
      const newSheet = { ...newSheets[activeSheet] };
      const newHistory = newSheet.history.slice(0, newSheet.historyIndex + 1);
      newHistory.push({ ...newSheet.data });
      newSheet.history = newHistory;
      newSheet.historyIndex = newSheet.historyIndex + 1;
      newSheets[activeSheet] = newSheet;
      return newSheets;
    });
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, cellRef: string) => {
    if (isEditing) return;

    const parsed = parseCellRef(cellRef);
    if (!parsed) return;

    let newCol = parsed.col;
    let newRow = parsed.row;

    switch (e.key) {
      case "ArrowUp":
        newRow = Math.max(0, newRow - 1);
        break;
      case "ArrowDown":
        newRow = Math.min(rows - 1, newRow + 1);
        break;
      case "ArrowLeft":
        newCol = Math.max(0, newCol - 1);
        break;
      case "ArrowRight":
        newCol = Math.min(cols - 1, newCol + 1);
        break;
      case "Enter":
        setIsEditing(true);
        return;
      case "Delete":
        updateCell(cellRef, "");
        return;
      default:
        return;
    }

    e.preventDefault();
    const newCellRef = getCellRef(newCol, newRow);
    handleCellSelect(newCellRef);
    cellRefs.current[newCellRef]?.focus();
  };

  // Handle formula bar change
  const handleFormulaBarChange = (value: string) => {
    setFormulaBarValue(value);
    const isFormula = value.startsWith("=");
    updateCell(selectedCell, value, isFormula);
  };

  // Apply formatting
    const applyFormatting = (property: string, value: boolean | string | number | "left" | "center" | "right") => {
    setSheets((prevSheets) => {
      const newSheets = { ...prevSheets };
      const newSheet = { ...newSheets[activeSheet] };
      const newData = { ...newSheet.data };
      const cellData = newData[selectedCell] || { value: "" };
      cellData.style = { ...cellData.style, [property]: value };
      newData[selectedCell] = cellData;
      newSheet.data = newData;
      newSheets[activeSheet] = newSheet;
      return newSheets;
    });
  };

  // Copy/Paste functionality
  const handleCopy = () => {
    const cellData = data[selectedCell];
    setClipboard(cellData?.value || "");
  };

  const handlePaste = () => {
    if (clipboard) {
      updateCell(selectedCell, clipboard);
    }
  };

  // Undo/Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setSheets((prev) => {
        const newSheets = { ...prev };
        const newSheet = { ...newSheets[activeSheet] };
        newSheet.historyIndex = newSheet.historyIndex - 1;
        newSheet.data = newSheet.history[newSheet.historyIndex];
        newSheets[activeSheet] = newSheet;
        return newSheets;
      });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setSheets((prev) => {
        const newSheets = { ...prev };
        const newSheet = { ...newSheets[activeSheet] };
        newSheet.historyIndex = newSheet.historyIndex + 1;
        newSheet.data = newSheet.history[newSheet.historyIndex];
        newSheets[activeSheet] = newSheet;
        return newSheets;
      });
    }
  };

  // Handle column resize
  const handleColumnResize = (colIndex: number, newWidth: number) => {
    setColumnWidths((prev) => ({
      ...prev,
      [colIndex]: Math.max(50, newWidth), // Minimum width of 50px
    }));
  };

  // Handle row resize
  const handleRowResize = (rowIndex: number, newHeight: number) => {
    setRowHeights((prev) => ({
      ...prev,
      [rowIndex]: Math.max(20, newHeight), // Minimum height of 20px
    }));
  };

  // Handle mouse down on resize handle
  const handleResizeStart = (e: React.MouseEvent, type: "column" | "row", index: number) => {
    e.preventDefault();

    const startPos = type === "column" ? e.clientX : e.clientY;
    const startSize =
      type === "column"
        ? columnWidths[index] || 96 // Default 24 * 4 = 96px (w-24)
        : rowHeights[index] || 32; // Default 8 * 4 = 32px (h-8)

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = type === "column" ? e.clientX : e.clientY;
      const diff = currentPos - startPos;
      const newSize = startSize + diff;

      if (type === "column") {
        handleColumnResize(index, newSize);
      } else {
        handleRowResize(index, newSize);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleColumnRename = (colIndex: number, newName: string) => {
    onColumnRename(colIndex, newName);
    setEditingColumn(null);
  };

  const handleAddSheet = () => {
    const newSheetName = `Sheet${Object.keys(sheets).length + 1}`;
    setSheets((prev) => ({
      ...prev,
      [newSheetName]: { data: {}, history: [{}], historyIndex: 0 },
    }));
    setActiveSheet(newSheetName);
  };

  const handleSheetRename = (oldName: string, newName: string) => {
    const trimmedNewName = newName.trim();
    if (oldName === trimmedNewName || !trimmedNewName || sheets[trimmedNewName]) {
      return; // Name is the same, empty, or already exists
    }

    const newSheets = { ...sheets };
    const sheetData = newSheets[oldName];
    delete newSheets[oldName];
    newSheets[trimmedNewName] = sheetData;

    setSheets(newSheets);

    if (activeSheet === oldName) {
      setActiveSheet(trimmedNewName);
    }
  };

  const handleAddRows = () => {
    if (numRowsToAdd > 0) {
      setRows((prevRows) => prevRows + numRowsToAdd);
    }
  };

  const handleSheetDelete = (sheetName: string) => {
    if (Object.keys(sheets).length <= 1) {
      return; // Don't delete the last sheet
    }

    const newSheets = { ...sheets };
    delete newSheets[sheetName];

    let newActiveSheet = activeSheet;
    if (activeSheet === sheetName) {
      newActiveSheet = Object.keys(newSheets)[0];
    }

    setSheets(newSheets);
    setActiveSheet(newActiveSheet);
  };

  return (
    <div className="flex flex-col bg-background" style={{ height: 'calc(100vh - 120px)' }}>
      {isToolbarVisible && (
        <>
          {/* Toolbar */}
          <div className="border-b p-2 flex items-center gap-2 flex-wrap">
            <Button variant="ghost" size="sm" onClick={handleUndo}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRedo}>
              <Redo className="w-4 h-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />

            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handlePaste}>
              <Paste className="w-4 h-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />

            <Select defaultValue="Arial" onValueChange={(font: string) => applyFormatting("fontFamily", font)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Times">Times</SelectItem>
                <SelectItem value="Courier">Courier</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="12" onValueChange={(size: string) => applyFormatting("fontSize", parseInt(size))}>
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="14">14</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="18">18</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6" />

            <Toggle
              pressed={data[selectedCell]?.style?.bold}
              onPressedChange={(pressed: boolean) => applyFormatting("bold", pressed)}
            >
              <Bold className="w-4 h-4" />
            </Toggle>
            <Toggle
              pressed={data[selectedCell]?.style?.italic}
              onPressedChange={(pressed: boolean) => applyFormatting("italic", pressed)}
            >
              <Italic className="w-4 h-4" />
            </Toggle>
            <Toggle
              pressed={data[selectedCell]?.style?.underline}
              onPressedChange={(pressed: boolean) => applyFormatting("underline", pressed)}
            >
              <Underline className="w-4 h-4" />
            </Toggle>

            <Separator orientation="vertical" className="h-6" />

            <Toggle
              pressed={data[selectedCell]?.style?.align === "left"}
              onPressedChange={() => applyFormatting("align", "left")}
            >
              <AlignLeft className="w-4 h-4" />
            </Toggle>
            <Toggle
              pressed={data[selectedCell]?.style?.align === "center"}
              onPressedChange={() => applyFormatting("align", "center")}
            >
              <AlignCenter className="w-4 h-4" />
            </Toggle>
            <Toggle
              pressed={data[selectedCell]?.style?.align === "right"}
              onPressedChange={() => applyFormatting("align", "right")}
            >
              <AlignRight className="w-4 h-4" />
            </Toggle>
          </div>

          {/* Formula Bar */}
          <div className="border-b p-2 flex items-center gap-2">
            <div className="w-20 text-sm font-medium">{selectedCell}</div>
            <Input
              value={formulaBarValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormulaBarChange(e.target.value)}
              placeholder="Enter formula or value"
              className="flex-1"
            />
          </div>
        </>
      )}

      {/* Spreadsheet Grid */}
      <div
        className="flex-1 overflow-auto w-full relative"
        ref={gridRef}
        style={{
          scrollBehavior: 'smooth',
          overscrollBehavior: 'contain',
          maxWidth: '100vw'
        }}
      >
        <div className="inline-block">
          {/* Header Row */}
          <div className="flex sticky top-0 bg-muted z-10">
            <div className="w-12 h-8 border border-border bg-muted flex items-center justify-center text-xs font-medium"></div>
            {Array.from({ length: cols }, (_, colIndex) => (
              <div
                key={colIndex}
                className="relative flex items-center justify-center border border-border text-xs font-medium cursor-pointer select-none"
                style={{ width: columnWidths[colIndex] || 96 }} // w-24
                onDoubleClick={() => setEditingColumn(colIndex)}
              >
                {editingColumn === colIndex ? (
                  <Input
                    type="text"
                    defaultValue={columnNames[colIndex] || getColumnLetter(colIndex)}
                    onBlur={(e) => handleColumnRename(colIndex, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleColumnRename(colIndex, e.currentTarget.value);
                      } else if (e.key === "Escape") {
                        setEditingColumn(null);
                      }
                    }}
                    autoFocus
                    className="w-full h-full text-center"
                  />
                ) : (
                  <>
                    {columnNames[colIndex] || getColumnLetter(colIndex)}
                    <div
                      className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-blue-500"
                      onMouseDown={(e) => handleResizeStart(e, "column", colIndex)}
                    />
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Data Rows */}
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className="flex relative">
              {/* Row Header */}
              <div className="relative w-12 h-8 flex items-center justify-center border border-border text-xs font-medium cursor-pointer select-none bg-muted sticky left-0 z-10">
                {rowIndex + 1}
                <div
                  className="absolute bottom-0 left-0 w-full h-1 cursor-row-resize bg-transparent hover:bg-blue-500"
                  onMouseDown={(e) => handleResizeStart(e, "row", rowIndex)}
                />
              </div>

              {/* Cells */}
              {Array.from({ length: cols }, (_, colIndex) => {
                const cellRef = getCellRef(colIndex, rowIndex);
                const cellData = data[cellRef];
                const isSelected = selectedCell === cellRef;

                return (
                  <input
                    key={cellRef}
                    ref={(el) => {
                      if (el) cellRefs.current[cellRef] = el;
                    }}
                    className={`px-1 text-xs outline-none ${isSelected ? "border-2 border-blue-500 bg-blue-50" : "border border-border bg-background"
                      }`}
                    style={{
                      width: columnWidths[colIndex] || 96,
                      height: rowHeights[rowIndex] || 32,
                      fontWeight: cellData?.style?.bold ? "bold" : "normal",
                      fontStyle: cellData?.style?.italic ? "italic" : "normal",
                      textDecoration: cellData?.style?.underline ? "underline" : "none",
                      textAlign: cellData?.style?.align || "left",
                      fontSize: cellData?.style?.fontSize ? `${cellData.style.fontSize}px` : "12px",
                      fontFamily: cellData?.style?.fontFamily || "Arial",
                      backgroundColor: cellData?.style?.backgroundColor,
                      color: cellData?.style?.textColor,
                    }}
                    value={cellData?.value || ""}
                    onChange={(e) => handleCellEdit(cellRef, e.target.value)}
                    onFocus={() => handleCellSelect(cellRef)}
                    onKeyDown={(e) => handleKeyDown(e, cellRef)}
                    onDoubleClick={() => setIsEditing(true)}
                    onBlur={() => setIsEditing(false)}
                  />
                );
              })}
            </div>
          ))}
          {/* Add Rows Section */}
          <div className="relative py-2 px-12 border-t flex items-center gap-2 sticky left-0 z-10 bg-muted">
            <Input
              type="number"
              min="1"
              value={numRowsToAdd}
              onChange={(e) => setNumRowsToAdd(Number(e.target.value))}
              className="w-24"
              aria-label="Number of rows to add"
            />
            <Button className="bg-[#4b6a4f]" onClick={handleAddRows}>Add Rows</Button>
            <span className="text-sm text-gray-500">number of rows to add</span>
          </div>
        </div>
      </div>



      {/* Status Bar */}
      <Tabs
        sheets={Object.keys(sheets)}
        activeSheet={activeSheet}
        onSheetChange={setActiveSheet}
        onAddSheet={handleAddSheet}
        onSheetRename={handleSheetRename}
        onSheetDelete={handleSheetDelete}
      />
    </div>
  );
};
