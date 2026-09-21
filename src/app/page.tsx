import SubwayShell from "@/components/subway/SubwayShell";
import StaticNetworkOutline from "@/components/subway/StaticNetworkOutline";

/**
 * The outline is server-rendered and always in the HTML; the shell is the
 * client map that replaces it once it mounts (see globals.css `[data-map-ready]`).
 * Rendering both is what keeps the homepage readable without JavaScript.
 */
export default function Home() {
  return (
    <>
      <StaticNetworkOutline />
      <SubwayShell />
    </>
  );
}
