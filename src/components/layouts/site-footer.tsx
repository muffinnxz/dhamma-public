import * as React from "react";
import { AppIcon } from "./app-icon";
import ChangeThemeButton from "./change-theme-button";

export function SiteFooter() {
  return (
    <div className="bg-primary-dark-blue">
      <div className="xl:container text-[#f5f2f0] justify-between text-lg flex px-12 py-2">
        <div className="flex gap-10">
          <AppIcon/>
          <div className="self-stretch my-auto font-medium">Dhamma</div>
        </div>

        <div className="flex text-center leading-loose items-center gap-2">
          <p className="self-stretch text-md my-auto">
             Built by{" "}
             <a
              href={"https://github.com/dekdao"}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              dekdao
            </a>
            .{" "}Hosted on{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Vercel
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
