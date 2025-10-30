import OpengraphImage from "../components/og/opengraph-image";

export const runtime = "edge";

export default async function Image() {
  return await OpengraphImage();
}
