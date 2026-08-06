// Lister nøglerne i et MotorAPI-svar, så feltnavnene kan låses fast.
//
//   node scripts/inspect-sample.mjs samples/vehicle.json
//
// Formålet: fieldMap.ts gætter i dag på tværs af en liste kandidatnavne, fordi
// MotorAPI's felter ikke er dokumenterede. Når der ligger et rigtigt svar i
// samples/, viser dette script præcis hvilke nøgler der findes, så listerne
// kan skiftes ud med det ene rigtige navn.

import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Brug: node scripts/inspect-sample.mjs <fil.json>");
  process.exit(1);
}

const data = JSON.parse(readFileSync(file, "utf8"));

/** Flad struktur ud til "sti: type = eksempelværdi". */
function walk(value, prefix = "") {
  if (Array.isArray(value)) {
    if (value.length === 0) return [`${prefix}: tomt array`];
    return walk(value[0], `${prefix}[0]`);
  }
  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([key, v]) =>
      walk(v, prefix ? `${prefix}.${key}` : key),
    );
  }
  const preview =
    typeof value === "string" && value.length > 40
      ? `${value.slice(0, 40)}…`
      : String(value);
  return [`${prefix}: ${value === null ? "null" : typeof value} = ${preview}`];
}

for (const line of walk(data)) console.log(line);
