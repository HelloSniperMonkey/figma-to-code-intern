import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";

export const HeaderSection = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("all-orders");

  const tabs = [
    { id: "all-orders", label: "All Orders" },
    { id: "pending", label: "Pending" },
    { id: "reviewed", label: "Reviewed" },
    { id: "arrived", label: "Arrived" },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    console.log("Tab changed to:", value);
  };

  const handleAddTab = () => {
    console.log("Add new tab clicked");
  };

  return (
    <header className="flex items-center gap-6 pl-8 pr-4 pt-1 pb-0 relative self-stretch w-full flex-[0_0_auto] z-0 bg-white border-t [border-top-style:solid] border-[#eeeeee]">        <Tabs
          defaultValue="all-orders"
          className="items-start inline-flex relative flex-[0_0_auto]"
          onValueChange={handleTabChange}
          value={activeTab}
        >
        <TabsList className="bg-transparent p-0 h-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={`gap-2 px-4 py-2.5 rounded-none ${
                activeTab === tab.id
                  ? "bg-[#e8f0e9] border-t-2 [border-top-style:solid] border-[#4b6a4f] font-paragraph-16-m-semi-bold-16-24 font-[number:var(--paragraph-16-m-semi-bold-16-24-font-weight)] text-[#3e5741] text-[length:var(--paragraph-16-m-semi-bold-16-24-font-size)] tracking-[var(--paragraph-16-m-semi-bold-16-24-letter-spacing)] leading-[var(--paragraph-16-m-semi-bold-16-24-line-height)] [font-style:var(--paragraph-16-m-semi-bold-16-24-font-style)]"
                  : "border-t-0 font-paragraph-16-m-medium-16-24 font-[number:var(--paragraph-16-m-medium-16-24-font-weight)] text-[#757575] text-[length:var(--paragraph-16-m-medium-16-24-font-size)] tracking-[var(--paragraph-16-m-medium-16-24-letter-spacing)] leading-[var(--paragraph-16-m-medium-16-24-line-height)] [font-style:var(--paragraph-16-m-medium-16-24-font-style)]"
              }`}
              data-state={activeTab === tab.id ? "active" : "inactive"}
            >
              {tab.label}
            </TabsTrigger>
          ))}

          <button
            className="gap-1 px-1 py-2 self-stretch inline-flex items-center justify-center relative flex-[0_0_auto]"
            aria-label="Add new tab"
            onClick={handleAddTab}
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
      </Tabs>
    </header>
  );
};
