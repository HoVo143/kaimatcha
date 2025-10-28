import clsx from "clsx";
import LogoIcon from "./icons/logo";

export default function LogoSquare({ size }: { size?: "sm" | undefined }) {
  return (
    <div
      className={clsx(
        "flex flex-none items-center justify-center",
        "h-[50px] w-[100px] md:h-[50px] md:w-[140px] rounded-xl"
      )}
    >
      <LogoIcon className="h-4 w-4 md:h-5 md:w-5" />
    </div>
  );
}