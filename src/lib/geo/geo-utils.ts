import cityToState from "./city-to-state.json";

const WEST = ["CA", "OR", "WA", "NV", "ID", "AZ", "UT", "AK", "HI"];
const CNTRL = ["TX", "OK", "CO", "KS", "NE", "SD", "ND", "NM", "WY", "MT"];

export function stateToTerritory(state: string): string {
  if (WEST.includes(state)) return "US-West";
  if (CNTRL.includes(state)) return "US-Central";
  return "US-East";
}

export function cityToTerritory(cityRaw: string): string {
  const key = cityRaw.split(",")[0].trim().toLowerCase();
  const state = (cityToState as Record<string, string>)[key];
  if (!state) return "Unassigned";
  return stateToTerritory(state);
}

