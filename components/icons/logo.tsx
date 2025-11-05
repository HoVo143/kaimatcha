import Image from "next/image";

export default function LogoIcon(props: React.ComponentProps<"svg">) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/Logo_kaimatcha.png?v=1762419539"
      alt="kaimatcha"
    />
  );
}
