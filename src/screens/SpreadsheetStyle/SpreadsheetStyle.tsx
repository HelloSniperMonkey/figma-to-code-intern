import { DataRowSection } from "./sections/DataRowSection";
import { DataTableSection } from "./sections/DataTableSection/DataTableSection";
import { HeaderSection } from "./sections/HeaderSection";
import { NavigationBarSection } from "./sections/NavigationBarSection";

export const SpreadsheetStyle = (): JSX.Element => {
  return (
    <main
      className="flex h-[1024px] items-start relative bg-white w-full min-w-[1440px]"
      data-model-id="2:2535"
    >
      <div className="flex flex-col w-[1440px] h-[1024px] items-start relative bg-slate-50">
        <NavigationBarSection />
        <DataRowSection />
        <DataTableSection />
        <HeaderSection />
      </div>
    </main>
  );
};
