import React from "react";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SideBar from "./SideBar";

const MobileSideBar = () => {
  return (
    <Sheet>
      <SheetTrigger className=" md:hidden pr-4">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-secondary pt-10 w-32">
        <SideBar isPro />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSideBar;
