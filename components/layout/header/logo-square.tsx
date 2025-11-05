import clsx from "clsx";
import LogoIcon from "../../icons/logo";
import LogoIconScroll from "../../icons/logo_scroll";

export default function LogoSquare({
  size,
  scrolled,
}: {
  size?: "sm" | undefined;
  scrolled?: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex flex-none items-center justify-center transition-all duration-300",
        "h-[50px] w-[100px] md:h-[50px] md:w-[140px] rounded-xl"
      )}
    >
      {scrolled ? (
        <LogoIconScroll className="h-4 w-4 md:h-5 md:w-5" />
      ) : (
        <LogoIcon className="h-4 w-4 md:h-5 md:w-5" />
      )}
    </div>
  );
}
