import clsx from "clsx";
import LogoIcon from "./icons/logo";

export default function LogoSquare({ size }: { size?: "sm" | undefined }) {
  return (
    <div
      className={clsx(
        "flex flex-none items-center justify-center  ",
        {
          "h-[50px] w-[140px] rounded-xl": !size,
          "h-[30px] w-[30px] rounded-lg": size === "sm",
        }
      )}
    >
      <LogoIcon
        className={clsx({
          "h-4 w-4": !size,
          "h-2.5 w-2.5": size === "sm",
        })}
      />
    </div>
  );
}