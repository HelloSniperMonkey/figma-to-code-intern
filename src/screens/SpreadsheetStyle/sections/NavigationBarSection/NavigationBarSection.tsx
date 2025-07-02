import { useState, Fragment } from "react";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

export const NavigationBarSection = (): JSX.Element => {
  const [searchValue, setSearchValue] = useState("");

  const breadcrumbItems = [
    { label: "Workspace", href: "#", active: false },
    { label: "Folder 2", href: "#", active: false },
    { label: "Spreadsheet 3", href: "#", active: true },
  ];

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    console.log("Search value:", value);
  };

  const handleButtonClick = (action: string, data?: unknown) => {
    console.log(`Navigation button clicked: ${action}`, data);
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 relative self-stretch w-full flex-[0_0_auto] z-[3] bg-white border-b [border-bottom-style:solid] border-[#eeeeee]">
      <div className="inline-flex items-center justify-center gap-4 relative flex-[0_0_auto]">
        <Button 
          variant="ghost" 
          size="icon" 
          className="p-0 h-6 w-6"
          onClick={() => handleButtonClick("panel")}
        >
          <img
            className="w-6 h-6"
            alt="Panel"
            src="https://c.animaapp.com/mclmkdkf288FZk/img/panel.svg"
          />
        </Button>

        <Breadcrumb>
          <BreadcrumbList className="inline-flex items-center gap-1">
            {breadcrumbItems.map((item, index) => (
              <Fragment key={index}>
                {index > 0 && (
                  <BreadcrumbSeparator>
                    <img
                      className="w-3 h-3"
                      alt="Chevron"
                      src="https://c.animaapp.com/mclmkdkf288FZk/img/chevron-1.svg"
                    />
                  </BreadcrumbSeparator>
                )}
                <BreadcrumbItem>                    <BreadcrumbLink
                      href={item.href}
                      className={`inline-flex items-center justify-center gap-2 relative flex-[0_0_auto] ${
                        item.active ? "" : "hover:text-[#121212]"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleButtonClick("breadcrumb", item);
                      }}
                    >
                    <span
                      className={`relative w-fit mt-[-1.00px] font-paragraph-14-s-medium-14-20 font-[number:var(--paragraph-14-s-medium-14-20-font-weight)] ${
                        item.active ? "text-[#121212]" : "text-[#afafaf]"
                      } text-[length:var(--paragraph-14-s-medium-14-20-font-size)] tracking-[var(--paragraph-14-s-medium-14-20-letter-spacing)] leading-[var(--paragraph-14-s-medium-14-20-line-height)] whitespace-nowrap [font-style:var(--paragraph-14-s-medium-14-20-font-style)]`}
                    >
                      {item.label}
                    </span>                      {item.active && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 p-0 justify-center gap-2 rounded flex items-center"
                          onClick={(e) => {
                            e.preventDefault();
                            handleButtonClick("more", item);
                          }}
                        >
                          <img
                            className="w-5 h-5"
                            alt="More"
                            src="https://c.animaapp.com/mclmkdkf288FZk/img/more.svg"
                          />
                        </Button>
                      )}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
        <div className="inline-flex items-center gap-2 p-3 relative flex-[0_0_auto] bg-[#f6f6f6] rounded-md overflow-hidden">
          <div className="relative w-4 h-4">
            <img
              className="absolute w-[13px] h-[13px] top-px left-px"
              alt="Search"
              src="https://c.animaapp.com/mclmkdkf288FZk/img/group.png"
            />
          </div>
          <Input
            placeholder="Search within sheet"
            className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 font-paragraph-12-XS-regular-12-16 font-[number:var(--paragraph-12-XS-regular-12-16-font-weight)] text-[#757575] text-[length:var(--paragraph-12-XS-regular-12-16-font-size)] tracking-[var(--paragraph-12-XS-regular-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-regular-12-16-line-height)] [font-style:var(--paragraph-12-XS-regular-12-16-font-style)]"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <Button
          variant="ghost"
          className="inline-flex items-center gap-3 p-2 relative flex-[0_0_auto] bg-white rounded-lg h-auto"
          onClick={() => handleButtonClick("notifications")}
        >
          <div className="relative">
            <img
              className="relative w-6 h-6"
              alt="Alert"
              src="https://c.animaapp.com/mclmkdkf288FZk/img/alert.svg"
            />
            <Badge className="flex flex-col w-5 h-5 items-center justify-center absolute top-0 left-5 bg-[#4b6a4f] rounded-[100px] border-2 border-solid border-white p-0">
              <span className="font-paragraph-10-XXS-medium-10-16 font-[number:var(--paragraph-10-XXS-medium-10-16-font-weight)] text-[#f6f6f6] text-[length:var(--paragraph-10-XXS-medium-10-16-font-size)] tracking-[var(--paragraph-10-XXS-medium-10-16-letter-spacing)] leading-[var(--paragraph-10-XXS-medium-10-16-line-height)] [font-style:var(--paragraph-10-XXS-medium-10-16-font-style)]">
                2
              </span>
            </Badge>
          </div>
        </Button>

        <Button
          variant="ghost"
          className="inline-flex items-center gap-2 pl-2 pr-3 py-1.5 relative flex-[0_0_auto] bg-white rounded-lg h-auto"
          onClick={() => handleButtonClick("user-menu")}
        >
          <Avatar className="w-7 h-7">
            <AvatarImage
              src="https://c.animaapp.com/mclmkdkf288FZk/img/ellipse-1.png"
              alt="John Doe"
              className="object-cover"
            />
          </Avatar>
          <div className="inline-flex flex-col max-w-[120px] items-start relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] font-paragraph-12-XS-regular-12-16 font-[number:var(--paragraph-12-XS-regular-12-16-font-weight)] text-[#121212] text-[length:var(--paragraph-12-XS-regular-12-16-font-size)] tracking-[var(--paragraph-12-XS-regular-12-16-letter-spacing)] leading-[var(--paragraph-12-XS-regular-12-16-line-height)] whitespace-nowrap [font-style:var(--paragraph-12-XS-regular-12-16-font-style)]">
              John Doe
            </div>
            <div className="relative self-stretch -mt-0.5 font-label-10-XXS-regular font-[number:var(--label-10-XXS-regular-font-weight)] text-[#757575] text-[length:var(--label-10-XXS-regular-font-size)] tracking-[var(--label-10-XXS-regular-letter-spacing)] leading-[var(--label-10-XXS-regular-line-height)] [font-style:var(--label-10-XXS-regular-font-style)]">
              john.doe@companyname.com
            </div>
          </div>
        </Button>
      </div>
    </header>
  );
};
