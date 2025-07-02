import { useState, useCallback, useEffect } from "react";

interface TableRow {
  id: number;
  jobRequest: string;
  submitted: string;
  status: { label: string; type: string };
  submitter: string;
  url: string;
  assigned: string;
  priority: { label: string; type: string };
  dueDate: string;
  estValue: string;
}

interface ColumnConfig {
  id: string;
  width: number;
  visible: boolean;
  minWidth: number;
}

/*
interface ColumnHeader {
  id: string;
  icon?: string;
  label: string;
  highlight?: boolean;
  section?: string;
  sectionColor?: string;
  textColor?: string;
}
*/

export const DataTableSection = (): JSX.Element => {
  // Selected cell tracking
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    column: string;
  } | null>(null);

  // Column configuration for resize/hide functionality
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>([
    { id: "jobRequest", width: 256, visible: true, minWidth: 120 },
    { id: "submitted", width: 124, visible: true, minWidth: 80 },
    { id: "status", width: 124, visible: true, minWidth: 80 },
    { id: "submitter", width: 124, visible: true, minWidth: 80 },
    { id: "url", width: 124, visible: true, minWidth: 80 },
    { id: "assigned", width: 124, visible: true, minWidth: 80 },
    { id: "priority", width: 126, visible: true, minWidth: 80 },
    { id: "dueDate", width: 125, visible: true, minWidth: 80 },
    { id: "estValue", width: 124, visible: true, minWidth: 80 },
  ]);

  // Row numbers data
  const rowNumbers = Array.from({ length: 25 }, (_, i) => i + 1);

  // Table data with state management
  const [tableData, setTableData] = useState<TableRow[]>([
    {
      id: 1,
      jobRequest: "Launch social media campaign for product XYZ",
      submitted: "15-11-2024",
      status: { label: "In-process", type: "warning" },
      submitter: "Aisha Patel",
      url: "www.aishapatel.com",
      assigned: "Sophie Choudhury",
      priority: { label: "Medium", type: "medium" },
      dueDate: "20-11-2024",
      estValue: "6,200,000",
    },
    {
      id: 2,
      jobRequest: "Update press kit for company redesign",
      submitted: "28-10-2024",
      status: { label: "Need to start", type: "neutral" },
      submitter: "Irfan Khan",
      url: "www.irfankhanportfolio.com",
      assigned: "Tejas Pandey",
      priority: { label: "High", type: "high" },
      dueDate: "30-10-2024",
      estValue: "3,500,000",
    },
    {
      id: 3,
      jobRequest: "Finalize user testing feedback for app update",
      submitted: "05-12-2024",
      status: { label: "In-process", type: "warning" },
      submitter: "Mark Johnson",
      url: "www.markjohnsondesigns.com",
      assigned: "Rachel Lee",
      priority: { label: "Medium", type: "medium" },
      dueDate: "10-12-2024",
      estValue: "4,750,000",
    },
    {
      id: 4,
      jobRequest: "Design new features for the website",
      submitted: "10-01-2025",
      status: { label: "Complete", type: "success" },
      submitter: "Emily Green",
      url: "www.emilygreenart.com",
      assigned: "Tom Wright",
      priority: { label: "Low", type: "low" },
      dueDate: "15-01-2025",
      estValue: "5,900,000",
    },
    {
      id: 5,
      jobRequest: "Prepare financial report for Q4",
      submitted: "25-01-2025",
      status: { label: "Blocked", type: "error" },
      submitter: "Jessica Brown",
      url: "www.jessicabrowncreative.com",
      assigned: "Kevin Smith",
      priority: { label: "Low", type: "low" },
      dueDate: "30-01-2025",
      estValue: "2,800,000",
    },
  ]);

  // Column headers - for future dynamic header generation
  /*
  const columnHeaders: ColumnHeader[] = [
    { id: "jobRequest", icon: "briefcase", label: "Job Request" },
    { id: "submitted", icon: "calendar", label: "Submitted" },
    { id: "status", icon: "chevron-circle", label: "Status" },
    { id: "submitter", icon: "person", label: "Submitter" },
    { id: "url", icon: "globe", label: "URL" },
    { id: "assigned", icon: "emoji", label: "Assigned", highlight: true },
    {
      id: "priority",
      label: "Priority",
      section: "Answer a question",
      sectionColor: "#dccffc",
      textColor: "#645c7f",
    },
    {
      id: "dueDate",
      label: "Due Date",
      section: "Answer a question",
      sectionColor: "#dccffc",
      textColor: "#645c7f",
    },
    {
      id: "estValue",
      label: "Est. Value",
      section: "Extract",
      sectionColor: "#fac2af",
      textColor: "#8c6b61",
    },
  ];
  */

  // Handle cell click for selection
  const handleCellClick = useCallback((rowIndex: number, columnId: string) => {
    setSelectedCell({ row: rowIndex, column: columnId });
    console.log(`Cell clicked: Row ${rowIndex + 1}, Column ${columnId}`);
  }, []);

  // Handle cell double-click for editing
  const handleCellDoubleClick = useCallback((rowIndex: number, columnId: string) => {
    console.log(`Cell double-clicked for editing: Row ${rowIndex + 1}, Column ${columnId}`);
    // Demonstrate setTableData usage with a simple edit
    if (columnId === "jobRequest") {
      setTableData(prev => 
        prev.map((row, index) => 
          index === rowIndex 
            ? { ...row, jobRequest: row.jobRequest + " (edited)" }
            : row
        )
      );
    }
  }, []);

  // Keyboard navigation functionality
  const getVisibleColumns = useCallback(() => {
    return columnConfigs.filter(col => col.visible).map(col => col.id);
  }, [columnConfigs]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!selectedCell) return;

    const visibleColumns = getVisibleColumns();
    const currentColIndex = visibleColumns.indexOf(selectedCell.column);
    
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        if (selectedCell.row > 0) {
          setSelectedCell(prev => prev ? { ...prev, row: prev.row - 1 } : null);
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        if (selectedCell.row < tableData.length - 1) {
          setSelectedCell(prev => prev ? { ...prev, row: prev.row + 1 } : null);
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (currentColIndex > 0) {
          setSelectedCell(prev => prev ? { ...prev, column: visibleColumns[currentColIndex - 1] } : null);
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        if (currentColIndex < visibleColumns.length - 1) {
          setSelectedCell(prev => prev ? { ...prev, column: visibleColumns[currentColIndex + 1] } : null);
        }
        break;
      case "Enter":
        event.preventDefault();
        if (selectedCell) {
          handleCellDoubleClick(selectedCell.row, selectedCell.column);
        }
        break;
      case "Escape":
        event.preventDefault();
        setSelectedCell(null);
        break;
    }
  }, [selectedCell, tableData.length, getVisibleColumns, handleCellDoubleClick]);

  // Add keyboard event listeners
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Column resize functionality
  const handleColumnResize = useCallback((columnId: string, newWidth: number) => {
    setColumnConfigs(prev => 
      prev.map(col => 
        col.id === columnId 
          ? { ...col, width: Math.max(newWidth, col.minWidth) }
          : col
      )
    );
    console.log(`Column ${columnId} resized to ${newWidth}px`);
  }, []);

  // Column hide/show functionality
  const toggleColumnVisibility = useCallback((columnId: string) => {
    setColumnConfigs(prev => 
      prev.map(col => 
        col.id === columnId 
          ? { ...col, visible: !col.visible }
          : col
      )
    );
    console.log(`Column ${columnId} visibility toggled`);
  }, []);

  // Get column configuration
  const getColumnConfig = useCallback((columnId: string) => {
    return columnConfigs.find(col => col.id === columnId);
  }, [columnConfigs]);

  // Handle button clicks with console logging
  const handleButtonClick = useCallback((action: string, data?: unknown) => {
    console.log(`Button clicked: ${action}`, data);
  }, []);

  // Helper function to get status style
  const getStatusStyle = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-[#fff3d6] text-[#84640a]";
      case "neutral":
        return "bg-slate-200 text-slate-600";
      case "success":
        return "bg-[#d2f2e2] text-[#0a6d3c]";
      case "error":
        return "bg-[#ffe1dd] text-[#c12119]";
      default:
        return "bg-slate-200 text-slate-600";
    }
  };

  // Helper function to get priority style
  const getPriorityStyle = (type: string) => {
    switch (type) {
      case "high":
        return "text-[#ef4c43]";
      case "medium":
        return "text-[#c1920f]";
      case "low":
        return "text-[#1a8cff]";
      default:
        return "text-[#1a8cff]";
    }
  };

  return (
    <div className="flex h-[872px] items-start gap-px relative self-stretch w-full z-[1] bg-[#f6f6f6] overflow-hidden">
      {/* Keyboard navigation instructions */}
      {/* {selectedCell && (
        <div className="absolute top-2 left-2 z-50 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          ↑↓←→ Navigate | Enter: Edit | Esc: Deselect | Double-click: Edit
        </div>
      )} */}
      
      {/* Column visibility panel */}
      
      {/* <div className="absolute top-12 left-2 z-40 bg-white border rounded shadow-lg p-2 text-xs">
        <div className="font-semibold mb-2">Column Visibility</div>
        {columnConfigs.map(col => (
          <div key={col.id} className="flex items-center gap-2 mb-1">
            <input 
              type="checkbox" 
              checked={col.visible}
              onChange={() => toggleColumnVisibility(col.id)}
              className="w-3 h-3"
            />
            <span className={col.visible ? "text-black" : "text-gray-400"}>
              {col.id.charAt(0).toUpperCase() + col.id.slice(1)}
            </span>
            <span className="text-gray-400 ml-auto">{col.width}px</span>
          </div>
        ))}
        <div className="text-xs text-gray-500 mt-2">
          Hover column headers to see hide buttons<br/>
          Drag column edges to resize
        </div>
      </div> */}
      
      {/* Row numbers column */}
      <div className="w-8 self-stretch flex flex-col items-start gap-px relative">
        <div className="relative self-stretch w-full h-8 bg-white" />
        <div className="flex h-8 items-center gap-1 pl-2 pr-1 py-0 relative self-stretch w-full bg-[#eeeeee]">
          <div className="gap-1 flex-1 grow flex items-center relative">
            <img
              className="relative w-4 h-4"
              alt="Number symbol"
              src="https://c.animaapp.com/mclmkdkf288FZk/img/number-symbol.svg"
            />
          </div>
        </div>

        {rowNumbers.map((num) => (
          <div key={`row-${num}`} className="relative w-8 h-8 bg-white">
            <div
              className={`absolute h-5 top-[5px] ${num < 10 ? "left-3" : num < 20 ? "left-[9px]" : "left-2"} font-paragraph-14-s-regular-14-20 font-[number:var(--paragraph-14-s-regular-14-20-font-weight)] text-[#757575] text-[length:var(--paragraph-14-s-regular-14-20-font-size)] text-center tracking-[var(--paragraph-14-s-regular-14-20-letter-spacing)] leading-[var(--paragraph-14-s-regular-14-20-line-height)] whitespace-nowrap [font-style:var(--paragraph-14-s-regular-14-20-font-style)]`}
            >
              {num}
            </div>
          </div>
        ))}
      </div>

      <div className="inline-flex items-center gap-px relative self-stretch flex-[0_0_auto]">
        {/* Header with link */}
        <div className="flex w-[631px] h-8 items-center gap-2 p-2 absolute top-0 left-0 z-[4] bg-[#e2e2e2]">
          <div className="inline-flex items-center gap-1 p-1 relative flex-[0_0_auto] mt-[-4.00px] mb-[-4.00px] bg-[#eeeeee] rounded">
            <img
              className="relative w-4 h-4"
              alt="Link"
              src="https://c.animaapp.com/mclmkdkf288FZk/img/link.svg"
            />
            <div className="relative w-fit mt-[-1.00px] font-paragraph-12-XS-regular-12-16 font-[number:var(--paragraph-12-XS-regular-12-16-font-weight)] text-[#545454] text-[length:var(--paragraph-12-XS-regular-12-16-font-size)] tracking-[var(--paragraph-12-XS-regular-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-regular-12-16-line-height)] whitespace-nowrap [font-style:var(--paragraph-12-XS-regular-12-16-font-style)]">
              Q3 Financial Overview
            </div>
          </div>
          <img
            className="relative w-4 h-4"
            alt="Arrow sync"
            src="https://c.animaapp.com/mclmkdkf288FZk/img/arrow-sync.svg"
          />
        </div>

        {/* Job Request Column */}
        {getColumnConfig("jobRequest")?.visible && (
          <div 
            className="self-stretch z-[3] flex flex-col items-start gap-px relative group"
            style={{ width: `${getColumnConfig("jobRequest")?.width}px` }}
          >
            <div className="relative self-stretch w-full h-8 bg-white" />
            <div className="flex h-8 items-center gap-1 pl-2 pr-1 py-0 relative self-stretch w-full bg-[#eeeeee]">
              <div className="gap-1 flex-1 grow flex items-center relative">
                <img
                  className="relative w-4 h-4"
                  alt="Briefcase"
                  src="https://c.animaapp.com/mclmkdkf288FZk/img/briefcase.svg"
                />
                <div className="relative flex-1 mt-[-1.00px] font-paragraph-12-XS-semi-bold-12-16 font-[number:var(--paragraph-12-XS-semi-bold-12-16-font-weight)] text-[#757575] text-[length:var(--paragraph-12-XS-semi-bold-12-16-font-size)] tracking-[var(--paragraph-12-XS-semi-bold-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-semi-bold-12-16-line-height)] [font-style:var(--paragraph-12-XS-semi-bold-12-16-font-style)]">
                  Job Request
                </div>
                <button 
                  className="text-xs px-1 py-0.5 bg-gray-200 hover:bg-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => toggleColumnVisibility("jobRequest")}
                  title="Hide column"
                >
                  ×
                </button>
              </div>
              <button 
                className="inline-flex items-center gap-2 p-1 relative flex-[0_0_auto] rounded hover:bg-gray-100"
                onClick={() => handleButtonClick("sort", "jobRequest")}
              >
                <img
                  className="relative w-3 h-3"
                  alt="Chevron"
                  src="https://c.animaapp.com/mclmkdkf288FZk/img/chevron.svg"
                />
              </button>
            </div>
            
            {/* Resize handle */}
            <div 
              className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-blue-300 z-10"
              onMouseDown={(e) => {
                const startX = e.clientX;
                const startWidth = getColumnConfig("jobRequest")?.width || 256;
                
                const handleMouseMove = (e: MouseEvent) => {
                  const diff = e.clientX - startX;
                  const newWidth = startWidth + diff;
                  handleColumnResize("jobRequest", newWidth);
                };
                
                const handleMouseUp = () => {
                  document.removeEventListener("mousemove", handleMouseMove);
                  document.removeEventListener("mouseup", handleMouseUp);
                };
                
                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
              }}
              title="Resize column"
            />

            {tableData.map((row, index) => (
              <div
                key={`job-${index}`}
                className={`flex h-8 items-center justify-center gap-2 px-2 py-0 relative self-stretch w-full cursor-pointer hover:bg-gray-50 ${
                  selectedCell?.row === index && selectedCell?.column === "jobRequest"
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "bg-white"
                }`}
                onClick={() => handleCellClick(index, "jobRequest")}
                onDoubleClick={() => handleCellDoubleClick(index, "jobRequest")}
              >
                <div className="relative flex-1 font-paragraph-12-XS-regular-12-16 font-[number:var(--paragraph-12-XS-regular-12-16-font-weight)] text-[#121212] text-[length:var(--paragraph-12-XS-regular-12-16-font-size)] tracking-[var(--paragraph-12-XS-regular-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-regular-12-16-line-height)] [font-style:var(--paragraph-12-XS-regular-12-16-font-style)]">
                  {row.jobRequest}
                </div>
              </div>
            ))}

            {/* Empty rows */}
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={`empty-job-${i}`}
                className="relative self-stretch w-full h-8 bg-white"
              />
            ))}
          </div>
        )}

        {/* Submitted Column */}
        {getColumnConfig("submitted")?.visible && (
          <div 
            className="self-stretch z-[2] flex flex-col items-start gap-px relative group"
            style={{ width: `${getColumnConfig("submitted")?.width}px` }}
          >
            <div className="relative self-stretch w-full h-8 bg-white" />
            <div className="flex h-8 items-center gap-1 pl-2 pr-1 py-0 relative self-stretch w-full bg-[#eeeeee]">
              <div className="gap-1 flex-1 grow flex items-center relative">
                <img
                  className="relative w-4 h-4"
                  alt="Calendar"
                  src="https://c.animaapp.com/mclmkdkf288FZk/img/calendar.svg"
                />
                <div className="relative flex-1 mt-[-1.00px] font-paragraph-12-XS-semi-bold-12-16 font-[number:var(--paragraph-12-XS-semi-bold-12-16-font-weight)] text-[#757575] text-[length:var(--paragraph-12-XS-semi-bold-12-16-font-size)] tracking-[var(--paragraph-12-XS-semi-bold-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-semi-bold-12-16-line-height)] [font-style:var(--paragraph-12-XS-semi-bold-12-16-font-style)]">
                  Submitted
                </div>
                <button 
                  className="text-xs px-1 py-0.5 bg-gray-200 hover:bg-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => toggleColumnVisibility("submitted")}
                  title="Hide column"
                >
                  ×
                </button>
              </div>
              <button 
                className="inline-flex items-center gap-2 p-1 relative flex-[0_0_auto] rounded hover:bg-gray-100"
                onClick={() => handleButtonClick("sort", "submitted")}
              >
                <img
                  className="relative w-3 h-3"
                  alt="Chevron"
                  src="https://c.animaapp.com/mclmkdkf288FZk/img/chevron.svg"
                />
              </button>
            </div>
            
            {/* Resize handle */}
            <div 
              className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-blue-300 z-10"
              onMouseDown={(e) => {
                const startX = e.clientX;
                const startWidth = getColumnConfig("submitted")?.width || 124;
                
                const handleMouseMove = (e: MouseEvent) => {
                  const diff = e.clientX - startX;
                  const newWidth = startWidth + diff;
                  handleColumnResize("submitted", newWidth);
                };
                
                const handleMouseUp = () => {
                  document.removeEventListener("mousemove", handleMouseMove);
                  document.removeEventListener("mouseup", handleMouseUp);
                };
                
                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
              }}
              title="Resize column"
            />

            {tableData.map((row, index) => (
              <div
                key={`submitted-${index}`}
                className={`flex h-8 items-center justify-center gap-2 px-2 py-0 relative self-stretch w-full cursor-pointer hover:bg-gray-50 ${
                  selectedCell?.row === index && selectedCell?.column === "submitted"
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "bg-white"
                }`}
                onClick={() => handleCellClick(index, "submitted")}
              >
                <div className="relative flex-1 font-paragraph-12-XS-regular-12-16 font-[number:var(--paragraph-12-XS-regular-12-16-font-weight)] text-[#121212] text-[length:var(--paragraph-12-XS-regular-12-16-font-size] text-right tracking-[var(--paragraph-12-XS-regular-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-regular-12-16-line-height)] [font-style:var(--paragraph-12-XS-regular-12-16-font-style)]">
                  {row.submitted}
                </div>
              </div>
            ))}

            {/* Empty rows with one highlighted */}
            <div className="relative self-stretch w-full h-8 bg-white" />
            <div className="relative self-stretch w-full h-8 bg-white" />
            <div className="relative self-stretch w-full h-8 bg-white border border-solid border-[#6b8b6f] shadow-[0px_0px_12px_#0a6e3d38,0px_0px_4px_-2px_#0a6d3c99]" />

            {Array.from({ length: 17 }, (_, i) => (
              <div
                key={`empty-submitted-${i}`}
                className="relative self-stretch w-full h-8 bg-white"
              />
            ))}
          </div>
        )}

        {/* Status Column */}
        <div className="w-[128px] self-stretch z-[1] flex flex-col items-start gap-px relative">
          <div className="relative self-stretch w-full h-8 bg-white" />
          <div className="flex h-8 items-center gap-1 pl-2 pr-1 py-0 relative self-stretch w-full bg-[#eeeeee]">
            <div className="gap-1 flex-1 grow flex items-center relative">
              <img
                className="relative w-4 h-4"
                alt="Chevron circle"
                src="https://c.animaapp.com/mclmkdkf288FZk/img/chevron-circle.svg"
              />
              <div className="relative flex-1 mt-[-1.00px] font-paragraph-12-XS-semi-bold-12-16 font-[number:var(--paragraph-12-XS-semi-bold-12-16-font-weight)] text-[#757575] text-[length:var(--paragraph-12-XS-semi-bold-12-16-font-size)] tracking-[var(--paragraph-12-XS-semi-bold-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-semi-bold-12-16-line-height)] [font-style:var(--paragraph-12-XS-semi-bold-12-16-font-style)]">
                Status
              </div>
            </div>
            <button 
              className="inline-flex items-center gap-2 p-1 relative flex-[0_0_auto] rounded hover:bg-gray-100"
              onClick={() => handleButtonClick("sort", "status")}
            >
              <img
                className="relative w-3 h-3"
                alt="Chevron"
                src="https://c.animaapp.com/mclmkdkf288FZk/img/chevron.svg"
              />
            </button>
          </div>

          {tableData.map((row, index) => (
            <div
              key={`status-${index}`}
              className={`flex h-8 items-center justify-center gap-2 px-2 py-0 relative self-stretch w-full cursor-pointer hover:bg-gray-50 ${
                selectedCell?.row === index && selectedCell?.column === "status"
                  ? "bg-blue-100 border-2 border-blue-500"
                  : "bg-white"
              }`}
              onClick={() => handleCellClick(index, "status")}
            >
              <button
                className={`inline-flex items-center justify-center gap-2 px-2 py-1 relative flex-[0_0_auto] ${getStatusStyle(row.status.type)} rounded-[100px] hover:opacity-80`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleButtonClick("change-status", { row: index, currentStatus: row.status });
                }}
              >
                <div className="relative w-fit mt-[-1.00px] font-paragraph-12-XS-medium-12-16 font-[number:var(--paragraph-12-XS-medium-12-16-font-weight)] text-[length:var(--paragraph-12-XS-medium-12-16-font-size)] tracking-[var(--paragraph-12-XS-medium-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-medium-12-16-line-height)] whitespace-nowrap [font-style:var(--paragraph-12-XS-medium-12-16-font-style)]">
                  {row.status.label}
                </div>
              </button>
            </div>
          ))}

          {/* Empty rows */}
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={`empty-status-${i}`}
              className="relative self-stretch w-full h-8 bg-white"
            />
          ))}
        </div>

        {/* Submitter Column */}
        <div className="w-[128px] self-stretch z-0 flex flex-col items-start gap-px relative">
          <div className="relative self-stretch w-full h-8 bg-white" />
          <div className="flex h-8 items-center gap-1 pl-2 pr-1 py-0 relative self-stretch w-full bg-[#eeeeee]">
            <div className="gap-1 flex-1 grow flex items-center relative">
              <img
                className="relative w-4 h-4"
                alt="Person"
                src="https://c.animaapp.com/mclmkdkf288FZk/img/person.svg"
              />
              <div className="relative flex-1 mt-[-1.00px] font-paragraph-12-XS-semi-bold-12-16 font-[number:var(--paragraph-12-XS-semi-bold-12-16-font-weight)] text-[#757575] text-[length:var(--paragraph-12-XS-semi-bold-12-16-font-size)] tracking-[var(--paragraph-12-XS-semi-bold-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-semi-bold-12-16-line-height)] [font-style:var(--paragraph-12-XS-semi-bold-12-16-font-style)]">
                Submitter
              </div>
            </div>
            <button 
              className="inline-flex items-center gap-2 p-1 relative flex-[0_0_auto] rounded hover:bg-gray-100"
              onClick={() => handleButtonClick("sort", "submitter")}
            >
              <img
                className="relative w-3 h-3"
                alt="Chevron"
                src="https://c.animaapp.com/mclmkdkf288FZk/img/chevron.svg"
              />
            </button>
          </div>

          {tableData.map((row, index) => (
            <div
              key={`submitter-${index}`}
              className={`flex h-8 items-center justify-center gap-2 px-2 py-0 relative self-stretch w-full cursor-pointer hover:bg-gray-50 ${
                selectedCell?.row === index && selectedCell?.column === "submitter"
                  ? "bg-blue-100 border-2 border-blue-500"
                  : "bg-white"
              }`}
              onClick={() => handleCellClick(index, "submitter")}
            >
              <div className="relative flex-1 font-paragraph-12-XS-regular-12-16 font-[number:var(--paragraph-12-XS-regular-12-16-font-weight)] text-[#121212] text-[length:var(--paragraph-12-XS-regular-12-16-font-size)] tracking-[var(--paragraph-12-XS-regular-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-regular-12-16-line-height)] [font-style:var(--paragraph-12-XS-regular-12-16-font-style)]">
                {row.submitter}
              </div>
            </div>
          ))}

          {/* Empty rows */}
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={`empty-submitter-${i}`}
              className="relative self-stretch w-full h-8 bg-white"
            />
          ))}
        </div>
      </div>

      {/* URL Column */}
      <div className="flex flex-col w-[128px] items-start gap-px relative self-stretch">
        <div className="relative self-stretch w-full h-8 bg-white" />
        <div className="flex h-8 items-center gap-1 pl-2 pr-1 py-0 relative self-stretch w-full bg-[#eeeeee]">
          <div className="gap-1 flex-1 grow flex items-center relative">
            <img
              className="relative w-4 h-4"
              alt="Globe"
              src="https://c.animaapp.com/mclmkdkf288FZk/img/globe.svg"
            />
            <div className="relative flex-1 mt-[-1.00px] font-paragraph-12-XS-semi-bold-12-16 font-[number:var(--paragraph-12-XS-semi-bold-12-16-font-weight)] text-[#757575] text-[length:var(--paragraph-12-XS-semi-bold-12-16-font-size)] tracking-[var(--paragraph-12-XS-semi-bold-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-semi-bold-12-16-line-height)] [font-style:var(--paragraph-12-XS-semi-bold-12-16-font-style)]">
              URL
            </div>
          </div>
          <button 
            className="inline-flex items-center gap-2 p-1 relative flex-[0_0_auto] rounded hover:bg-gray-100"
            onClick={() => handleButtonClick("sort", "url")}
          >
            <img
              className="relative w-3 h-3"
              alt="Chevron"
              src="https://c.animaapp.com/mclmkdkf288FZk/img/chevron.svg"
            />
          </button>
        </div>

        {tableData.map((row, index) => (
          <div
            key={`url-${index}`}
            className={`flex h-8 items-center justify-center gap-2 px-2 py-0 relative self-stretch w-full cursor-pointer hover:bg-gray-50 ${
              selectedCell?.row === index && selectedCell?.column === "url"
                ? "bg-blue-100 border-2 border-blue-500"
                : "bg-white"
            }`}
            onClick={() => handleCellClick(index, "url")}
          >
            <button
              className="relative flex-1 [font-family:'Work_Sans',Helvetica] font-normal text-[#121212] text-xs tracking-[0] leading-4 underline hover:text-blue-600 text-left"
              onClick={(e) => {
                e.stopPropagation();
                handleButtonClick("open-url", { url: row.url, row: index });
              }}
            >
              {row.url}
            </button>
          </div>
        ))}

        {/* Empty rows */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`empty-url-${i}`}
            className="relative self-stretch w-full h-8 bg-white"
          />
        ))}
      </div>

      {/* Assigned Column */}
      <div className="flex flex-col w-[128px] items-start gap-px relative self-stretch">
        <div className="justify-center gap-2 px-4 py-2 bg-[#d2e0d4] flex h-8 items-center relative self-stretch w-full">
          <button 
            className="inline-flex items-center gap-1 px-1 py-0.5 relative flex-[0_0_auto] rounded hover:bg-green-200"
            onClick={() => handleButtonClick("abc-action")}
          >
            <img
              className="relative w-4 h-4"
              alt="Arrow split"
              src="https://c.animaapp.com/mclmkdkf288FZk/img/arrow-split.svg"
            />
            <div className="relative w-fit mt-[-1.00px] font-paragraph-14-s-medium-14-20 font-[number:var(--paragraph-14-s-medium-14-20-font-weight)] text-[#505450] text-[length:var(--paragraph-14-s-medium-14-20-font-size)] tracking-[var(--paragraph-14-s-medium-14-20-letter-spacing)] leading-[var(--paragraph-14-s-medium-14-20-line-height)] whitespace-nowrap [font-style:var(--paragraph-14-s-medium-14-20-font-style)]">
              ABC
            </div>
            <button 
              className="flex w-5 h-5 items-center justify-center gap-2 relative rounded hover:bg-green-300"
              onClick={(e) => {
                e.stopPropagation();
                handleButtonClick("abc-more");
              }}
            >
              <img
                className="relative w-4 h-4"
                alt="More"
                src="https://c.animaapp.com/mclmkdkf288FZk/img/more.svg"
              />
            </button>
          </button>
        </div>
        <div className="gap-1 pl-2 pr-1 py-0 bg-[#e8f0e9] flex h-8 items-center relative self-stretch w-full">
          <div className="gap-1 flex-1 grow flex items-center relative">
            <img
              className="relative w-4 h-4"
              alt="Emoji"
              src="https://c.animaapp.com/mclmkdkf288FZk/img/emoji.svg"
            />
            <div className="text-[#666c66] relative flex-1 mt-[-1.00px] font-paragraph-12-XS-semi-bold-12-16 font-[number:var(--paragraph-12-XS-semi-bold-12-16-font-weight)] text-[length:var(--paragraph-12-XS-semi-bold-12-16-font-size)] tracking-[var(--paragraph-12-XS-semi-bold-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-semi-bold-12-16-line-height)] [font-style:var(--paragraph-12-XS-semi-bold-12-16-font-style)]">
              Assigned
            </div>
          </div>
        </div>

        {tableData.map((row, index) => (
          <div
            key={`assigned-${index}`}
            className={`flex h-8 items-center justify-center gap-2 px-2 py-0 relative self-stretch w-full cursor-pointer hover:bg-gray-50 ${
              selectedCell?.row === index && selectedCell?.column === "assigned"
                ? "bg-blue-100 border-2 border-blue-500"
                : "bg-white"
            }`}
            onClick={() => handleCellClick(index, "assigned")}
          >
            <div className="relative flex-1 font-paragraph-12-XS-regular-12-16 font-[number:var(--paragraph-12-XS-regular-12-16-font-weight)] text-[#121212] text-[length:var(--paragraph-12-XS-regular-12-16-font-size)] tracking-[var(--paragraph-12-XS-regular-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-regular-12-16-line-height)] [font-style:var(--paragraph-12-XS-regular-12-16-font-style)]">
              {row.assigned}
            </div>
          </div>
        ))}

        {/* Empty rows */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`empty-assigned-${i}`}
            className="relative self-stretch w-full h-8 bg-white"
          />
        ))}
      </div>

      {/* Priority and Due Date Columns */}
      <div className="flex flex-col w-[256px] items-start gap-px relative self-stretch">
        <div className="justify-center gap-2 px-4 py-2 bg-[#dccffc] flex h-8 items-center relative self-stretch w-full">
          <button 
            className="inline-flex items-center gap-1 px-1 py-0.5 relative flex-[0_0_auto] rounded hover:bg-purple-200"
            onClick={() => handleButtonClick("answer-question-action")}
          >
            <img
              className="relative w-4 h-4"
              alt="Arrow split"
              src="https://c.animaapp.com/mclmkdkf288FZk/img/arrow-split.svg"
            />
            <div className="text-[#463e59] relative w-fit mt-[-1.00px] font-paragraph-14-s-medium-14-20 font-[number:var(--paragraph-14-s-medium-14-20-font-weight)] text-[length:var(--paragraph-14-s-medium-14-20-font-size)] tracking-[var(--paragraph-14-s-medium-14-20-letter-spacing)] leading-[var(--paragraph-14-s-medium-14-20-line-height)] whitespace-nowrap [font-style:var(--paragraph-14-s-medium-14-20-font-style)]">
              Answer a question
            </div>
            <button 
              className="flex w-5 h-5 items-center justify-center gap-2 relative rounded hover:bg-purple-300"
              onClick={(e) => {
                e.stopPropagation();
                handleButtonClick("answer-question-more");
              }}
            >
              <img
                className="relative w-4 h-4"
                alt="More"
                src="https://c.animaapp.com/mclmkdkf288FZk/img/more.svg"
              />
            </button>
          </button>
        </div>
        <div className="flex items-center gap-px relative flex-1 self-stretch w-full grow">
          {/* Priority Column */}
          <div className="flex-1 self-stretch grow flex flex-col items-start gap-px relative">
            <div className="gap-1 pl-2 pr-1 py-0 bg-[#eae3fc] flex h-8 items-center relative self-stretch w-full">
              <div className="gap-1 flex-1 grow flex items-center relative">
                <div className="text-[#645c7f] relative flex-1 mt-[-1.00px] font-paragraph-12-XS-semi-bold-12-16 font-[number:var(--paragraph-12-XS-semi-bold-12-16-font-weight)] text-[length:var(--paragraph-12-XS-semi-bold-12-16-font-size)] tracking-[var(--paragraph-12-XS-semi-bold-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-semi-bold-12-16-line-height)] [font-style:var(--paragraph-12-XS-semi-bold-12-16-font-style)]">
                  Priority
                </div>
              </div>
            </div>

            {tableData.map((row, index) => (
              <div
                key={`priority-${index}`}
                className={`flex h-8 items-center justify-center gap-2 px-2 py-0 relative self-stretch w-full cursor-pointer hover:bg-gray-50 ${
                  selectedCell?.row === index && selectedCell?.column === "priority"
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "bg-white"
                }`}
                onClick={() => handleCellClick(index, "priority")}
              >
                <button
                  className={`relative w-fit font-paragraph-12-XS-semi-bold-12-16 font-[number:var(--paragraph-12-XS-semi-bold-12-16-font-weight)] ${getPriorityStyle(row.priority.type)} text-[length:var(--paragraph-12-XS-semi-bold-12-16-font-size)] text-center tracking-[var(--paragraph-12-XS-semi-bold-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-semi-bold-12-16-line-height)] whitespace-nowrap [font-style:var(--paragraph-12-XS-semi-bold-12-16-font-style)] hover:opacity-80`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleButtonClick("change-priority", { row: index, currentPriority: row.priority });
                  }}
                >
                  {row.priority.label}
                </button>
              </div>
            ))}

            {/* Empty rows */}
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={`empty-priority-${i}`}
                className="relative self-stretch w-full h-8 bg-white"
              />
            ))}
          </div>

          {/* Due Date Column */}
          <div className="flex-1 self-stretch grow flex flex-col items-start gap-px relative">
            <div className="gap-1 pl-2 pr-1 py-0 bg-[#eae3fc] flex h-8 items-center relative self-stretch w-full">
              <div className="gap-1 flex-1 grow flex items-center relative">
                <div className="text-[#645c7f] relative flex-1 mt-[-1.00px] font-paragraph-12-XS-semi-bold-12-16 font-[number:var(--paragraph-12-XS-semi-bold-12-16-font-weight)] text-[length:var(--paragraph-12-XS-semi-bold-12-16-font-size)] tracking-[var(--paragraph-12-XS-semi-bold-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-semi-bold-12-16-line-height)] [font-style:var(--paragraph-12-XS-semi-bold-12-16-font-style)]">
                  Due Date
                </div>
              </div>
            </div>

            {tableData.map((row, index) => (
              <div
                key={`dueDate-${index}`}
                className={`flex h-8 items-center justify-center gap-2 px-2 py-0 relative self-stretch w-full cursor-pointer hover:bg-gray-50 ${
                  selectedCell?.row === index && selectedCell?.column === "dueDate"
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "bg-white"
                }`}
                onClick={() => handleCellClick(index, "dueDate")}
              >
                <div className="relative flex-1 font-paragraph-12-XS-regular-12-16 font-[number:var(--paragraph-12-XS-regular-12-16-font-weight)] text-[#121212] text-[length:var(--paragraph-12-XS-regular-12-16-font-size)] text-right tracking-[var(--paragraph-12-XS-regular-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-regular-12-16-line-height)] [font-style:var(--paragraph-12-XS-regular-12-16-font-style)]">
                  {row.dueDate}
                </div>
              </div>
            ))}

            {/* Empty rows */}
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={`empty-dueDate-${i}`}
                className="relative self-stretch w-full h-8 bg-white"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Estimated Value Column */}
      <div className="flex flex-col w-[128px] items-start gap-px relative self-stretch">
        <div className="justify-center gap-2 px-4 py-2 bg-[#fac2af] flex h-8 items-center relative self-stretch w-full">
          <button 
            className="inline-flex items-center gap-1 px-1 py-0.5 relative flex-[0_0_auto] rounded hover:bg-orange-200"
            onClick={() => handleButtonClick("extract-action")}
          >
            <img
              className="relative w-4 h-4"
              alt="Arrow split"
              src="https://c.animaapp.com/mclmkdkf288FZk/img/arrow-split.svg"
            />
            <div className="text-[#695149] relative w-fit mt-[-1.00px] font-paragraph-14-s-medium-14-20 font-[number:var(--paragraph-14-s-medium-14-20-font-weight)] text-[length:var(--paragraph-14-s-medium-14-20-font-size)] tracking-[var(--paragraph-14-s-medium-14-20-letter-spacing)] leading-[var(--paragraph-14-s-medium-14-20-line-height)] whitespace-nowrap [font-style:var(--paragraph-14-s-medium-14-20-font-style)]">
              Extract
            </div>
            <button 
              className="flex w-5 h-5 items-center justify-center gap-2 relative rounded hover:bg-orange-300"
              onClick={(e) => {
                e.stopPropagation();
                handleButtonClick("extract-more");
              }}
            >
              <img
                className="relative w-4 h-4"
                alt="More"
                src="https://c.animaapp.com/mclmkdkf288FZk/img/more.svg"
              />
            </button>
          </button>
        </div>
        <div className="w-[128px] flex-1 grow flex flex-col items-start gap-px relative">
          <div className="gap-1 pl-2 pr-1 py-0 bg-[#ffe9e0] flex h-8 items-center relative self-stretch w-full">
            <div className="gap-1 flex-1 grow flex items-center relative">
              <div className="text-[#8c6b61] relative flex-1 mt-[-1.00px] font-paragraph-12-XS-semi-bold-12-16 font-[number:var(--paragraph-12-XS-semi-bold-12-16-font-weight)] text-[length:var(--paragraph-12-XS-semi-bold-12-16-font-size)] tracking-[var(--paragraph-12-XS-semi-bold-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-semi-bold-12-16-line-height)] [font-style:var(--paragraph-12-XS-semi-bold-12-16-font-style)]">
                Est. Value
              </div>
            </div>
          </div>

          {tableData.map((row, index) => (
            <div
              key={`estValue-${index}`}
              className={`flex h-8 items-center justify-center gap-1 px-2 py-0 relative self-stretch w-full cursor-pointer hover:bg-gray-50 ${
                selectedCell?.row === index && selectedCell?.column === "estValue"
                  ? "bg-blue-100 border-2 border-blue-500"
                  : "bg-white"
              }`}
              onClick={() => handleCellClick(index, "estValue")}
            >
              <div className="relative flex-1 font-paragraph-12-XS-regular-12-16 font-[number:var(--paragraph-12-XS-regular-12-16-font-weight)] text-[#121212] text-[length:var(--paragraph-12-XS-regular-12-16-font-size)] text-right tracking-[var(--paragraph-12-XS-regular-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-regular-12-16-line-height)] [font-style:var(--paragraph-12-XS-regular-12-16-font-style)]">
                {row.estValue}
              </div>
              <div className="relative w-fit font-paragraph-12-XS-medium-12-16 font-[number:var(--paragraph-12-XS-medium-12-16-font-weight)] text-[#afafaf] text-[length:var(--paragraph-12-XS-medium-12-16-font-size)] text-right tracking-[var(--paragraph-12-XS-medium-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-medium-12-16-line-height)] whitespace-nowrap [font-style:var(--paragraph-12-XS-medium-12-16-font-style)]">
                ₹
              </div>
            </div>
          ))}

          {/* Empty rows */}
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={`empty-estValue-${i}`}
              className="relative self-stretch w-full h-8 bg-white"
            />
          ))}
        </div>
      </div>

      {/* Add Column Button */}
      <div className="w-[126px] self-stretch mt-[-1.00px] mb-[-1.00px] overflow-hidden border border-dashed border-[#cbcbcb] flex flex-col items-start gap-px relative">
        <button 
          className="flex h-8 items-center justify-center gap-2 px-2 py-4 relative self-stretch w-full bg-[#eeeeee] hover:bg-gray-200 cursor-pointer"
          onClick={() => handleButtonClick("add-column")}
        >
          <img
            className="relative w-6 h-6"
            alt="Add"
            src="https://c.animaapp.com/mclmkdkf288FZk/img/add.svg"
          />
        </button>

        {/* Empty rows */}
        {Array.from({ length: 26 }, (_, i) => (
          <div
            key={`empty-add-${i}`}
            className="relative self-stretch w-full h-8 bg-white"
          />
        ))}
      </div>
    </div>
  );
};
