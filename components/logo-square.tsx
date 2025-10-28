import clsx from "clsx";
import LogoIcon from "./icons/logo";

export default function LogoSquare({ size }: { size?: "md" | undefined }) {
  return (
    <div
      className={clsx(
        "flex flex-none items-center justify-center  ",
        {
          "h-[50px] w-[140px] rounded-xl": size === "md",
          "h-[50px] w-[100px] rounded-lg": !size,
        }
      )}
    >
      <LogoIcon
        className={clsx({
          "h-4 w-4": size === "md",
          "h-2.5 w-2.5": !size ,
        })}
      />
    </div>
  );
}