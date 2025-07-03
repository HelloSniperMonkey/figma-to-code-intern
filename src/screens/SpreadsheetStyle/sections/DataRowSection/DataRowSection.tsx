import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { NewColumnModal } from "../../../../components/ui/NewColumnModal";

interface DataRowSectionProps {
  isToolbarVisible: boolean;
  onToolbarToggle: () => void;
  onAddColumn: (name: string) => void;
}

export const DataRowSection = ({ isToolbarVisible, onToolbarToggle, onAddColumn }: DataRowSectionProps): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = (action: string, data?: unknown) => {
    console.log(`DataRow button clicked: ${action}`, data);

    if (action === "toolbar-dropdown") {
      onToolbarToggle();
    }

    if (action === "new-action") {
      setIsModalOpen(true);
    }

    // Special handling for hide fields - this would integrate with the DataTableSection
    if (action === "hide fields") {
      // This would typically be handled by a parent component or context
      console.log("Opening column visibility panel...");
    }
  };

  const handleAddColumn = (name: string) => {
    onAddColumn(name);
    setIsModalOpen(false);
  };

  // Define toolbar actions for mapping
  const toolbarActions = [
    {
      icon: "https://c.animaapp.com/mclmkdkf288FZk/img/eye.svg",
      label: "Hide fields",
      alt: "Eye",
    },
    {
      icon: "https://c.animaapp.com/mclmkdkf288FZk/img/arrow-sort.svg",
      label: "Sort",
      alt: "Arrow sort",
    },
    {
      icon: "https://c.animaapp.com/mclmkdkf288FZk/img/filter.svg",
      label: "Filter",
      alt: "Filter",
    },
    {
      icon: "https://c.animaapp.com/mclmkdkf288FZk/img/arrow-autofit.svg",
      label: "Cell view",
      alt: "Arrow autofit",
    },
  ];

  // Define import/export actions for mapping
  const importExportActions = [
    {
      icon: "https://c.animaapp.com/mclmkdkf288FZk/img/arrow-download.svg",
      label: "Import",
      alt: "Arrow download",
    },
    {
      icon: "https://c.animaapp.com/mclmkdkf288FZk/img/arrow-upload.svg",
      label: "Export",
      alt: "Arrow upload",
    },
    {
      icon: "https://c.animaapp.com/mclmkdkf288FZk/img/share.svg",
      label: "Share",
      alt: "Share",
    },
  ];

  return (
    <>
      <div className="flex items-center gap-2 px-2 py-1.5 relative self-stretch w-full flex-[0_0_auto] z-[2] bg-white border-b [border-bottom-style:solid] border-[#eeeeee]">
        {/* Tool bar dropdown */}
        <Button
          variant="ghost"
          className="inline-flex items-center justify-center gap-1 p-2 relative flex-[0_0_auto] z-[3] bg-white rounded"
          onClick={() => handleButtonClick("toolbar-dropdown")}
        >
          <span className="relative w-fit mt-[-1.00px] font-paragraph-14-s-regular-14-20 font-[number:var(--paragraph-14-s-regular-14-20-font-weight)] text-[#121212] text-[length:var(--paragraph-14-s-regular-14-20-font-size)] tracking-[var(--paragraph-14-s-regular-14-20-letter-spacing)] leading-[var(--paragraph-14-s-regular-14-20-line-height)] whitespace-nowrap [font-style:var(--paragraph-14-s-regular-14-20-font-style)]">
            Tool bar
          </span>
          <img
            className={`relative w-4 h-4 transition-transform ${
              isToolbarVisible ? "" : "-rotate-180"
            }`}
            alt="Chevron double"
            src="https://c.animaapp.com/mclmkdkf288FZk/img/chevron-double.svg"
          />
        </Button>

        {/* Divider */}
        <div className="relative w-px h-6 z-[2] bg-[#eeeeee]" />

        {/* Toolbar actions */}
        <div className="flex items-center gap-1 relative flex-1 grow z-[1]">
          {toolbarActions.map((action, index) => (
            <Button
              key={`toolbar-action-${index}`}
              variant="ghost"
              className="inline-flex items-center gap-1 pl-2 pr-3 py-2 relative flex-[0_0_auto] bg-white rounded-md"
              onClick={() => handleButtonClick(action.label.toLowerCase(), action)}
            >
              <img
                className="relative w-5 h-5"
                alt={action.alt}
                src={action.icon}
              />
              <span className="relative w-fit mt-[-1.00px] font-paragraph-14-s-regular-14-20 font-[number:var(--paragraph-14-s-regular-14-20-font-weight)] text-[#121212] text-[length:var(--paragraph-14-s-regular-14-20-font-size)] tracking-[var(--paragraph-14-s-regular-14-20-letter-spacing)] leading-[var(--paragraph-14-s-regular-14-20-line-height)] whitespace-nowrap [font-style:var(--paragraph-14-s-regular-14-20-font-style)]">
                {action.label}
              </span>
            </Button>
          ))}
        </div>

        {/* Import/Export/Share actions */}
        <div className="inline-flex items-center justify-end gap-2 relative flex-[0_0_auto] z-0">
          <div className="inline-flex items-start gap-2 relative flex-[0_0_auto]">
            {importExportActions.map((action, index) => (
              <Button
                key={`import-export-action-${index}`}
                variant="outline"
                className="inline-flex items-center gap-1 pl-2 pr-3 py-2 relative flex-[0_0_auto] bg-white rounded-md border border-solid border-[#eeeeee]"
                onClick={() => handleButtonClick(action.label.toLowerCase(), action)}
              >
                <img
                  className="relative w-5 h-5"
                  alt={action.alt}
                  src={action.icon}
                />
                <span className="relative w-fit mt-[-1.00px] font-paragraph-14-s-regular-14-20 font-[number:var(--paragraph-14-s-regular-14-20-font-weight)] text-[#545454] text-[length:var(--paragraph-14-s-regular-14-20-font-size)] tracking-[var(--paragraph-14-s-regular-14-20-letter-spacing)] leading-[var(--paragraph-14-s-regular-14-20-line-height)] whitespace-nowrap [font-style:var(--paragraph-14-s-regular-14-20-font-style)]">
                  {action.label}
                </span>
              </Button>
            ))}
          </div>

          {/* New Action button */}
          <Button 
            className="inline-flex items-center justify-center gap-1 px-6 py-2 relative flex-[0_0_auto] bg-[#4b6a4f] rounded-md overflow-hidden"
            onClick={() => handleButtonClick("new-action")}
          >
            <img
              className="relative w-5 h-5"
              alt="Arrow split"
              src="https://c.animaapp.com/mclmkdkf288FZk/img/arrow-split.svg"
            />
            <span className="relative w-fit mt-[-1.00px] font-paragraph-14-s-medium-14-20 font-[number:var(--paragraph-14-s-medium-14-20-font-weight)] text-white text-[length:var(--paragraph-14-s-medium-14-20-font-size)] tracking-[var(--paragraph-14-s-medium-14-20-letter-spacing)] leading-[var(--paragraph-14-s-medium-14-20-line-height)] whitespace-nowrap [font-style:var(--paragraph-14-s-medium-14-20-font-style)]">
              New Action
            </span>
          </Button>
        </div>
      </div>
      <NewColumnModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddColumn={handleAddColumn} 
      />
    </>
  );
};
