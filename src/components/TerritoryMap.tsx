"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import topo from "@/data/us-states-10m.json";

type Stat = { territory: string; openValue: number };

interface Props {
  stats: Stat[];
  onSelect: (territory: string) => void;
  selected?: string | null;
}

const WEST = [
  "02", "04", "06", "08", "15", "16", "30", "32", "35",
  "41", "49", "53", "56",
];
const CENTRAL = [
  "17", "18", "19", "20", "26", "27", "29", "31",
  "38", "39", "46",
  "40", "48",
];

export function fipsToTerritory(id: string): "US-West" | "US-Central" | "US-East" {
  if (WEST.includes(id)) return "US-West";
  if (CENTRAL.includes(id)) return "US-Central";
  return "US-East";
}

const TERR_COLOR: Record<string, string> = {
  "US-West": "#60a5fa", // blue-400
  "US-Central": "#fbbf24", // amber-400
  "US-East": "#34d399", // emerald-400
};

export default function TerritoryMap({ stats, onSelect, selected = null }: Props) {
  const lookup = Object.fromEntries(stats.map((s) => [s.territory, s.openValue]));

  function fillColor(territory: string) {
    if (selected && territory !== selected) return "#e5e7eb";
    return TERR_COLOR[territory] ?? "#cbd5e1";
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <ComposableMap
        projection="geoAlbersUsa"
        width={800}
        height={500}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={topo}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => {
              const terr = fipsToTerritory(geo.id);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor(terr)}
                  stroke="#ffffff"
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", cursor: "pointer", opacity: 1.0 },
                    pressed: { outline: "none" },
                  }}
                  onClick={() => onSelect(terr)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
