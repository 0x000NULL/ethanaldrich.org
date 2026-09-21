import SubwayShell from "@/components/subway/SubwayShell";

/**
 * The shell server-renders StaticNetworkOutline (real content: identity, links,
 * every station) and swaps in the interactive map once it mounts, so this route
 * is readable without JavaScript and to anything that does not run it.
 */
export default function Home() {
  return <SubwayShell />;
}
