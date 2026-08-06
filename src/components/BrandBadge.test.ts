import { describe, expect, it } from "vitest";

import { brandLabel } from "./BrandBadge";

describe("brandLabel", () => {
  it("bruger kendte kortnavne", () => {
    expect(brandLabel("VOLKSWAGEN")).toBe("VW");
    expect(brandLabel("MERCEDES-BENZ")).toBe("MB");
  });

  it("lader korte forkortelser stå", () => {
    expect(brandLabel("BMW")).toBe("BMW");
    expect(brandLabel("KIA")).toBe("KIA");
  });

  it("sætter lange navne med stort begyndelsesbogstav", () => {
    // API'et svarer i VERSALER. Uredigeret ser det ud, som om data råber.
    expect(brandLabel("VOLVO")).toBe("Volvo");
    expect(brandLabel("PEUGEOT")).toBe("Peugeot");
  });

  it("forkorter navne, der er for lange til badgen", () => {
    expect(brandLabel("LAND ROVER")).toBe("LR");
    expect(brandLabel("ALFA ROMEO")).toBe("Alfa");
  });

  it("klarer mellemrum og skæve store bogstaver", () => {
    expect(brandLabel(" volkswagen ")).toBe("VW");
    expect(brandLabel("land rover")).toBe("LR");
  });

  it("klarer hårde og dobbelte mellemrum", () => {
    // \u00a0 er et hårdt mellemrum. Det forekommer i registerdata og ser ud
    // præcis som et almindeligt mellemrum uden at være det — uden
    // normalisering rammer opslaget i tabellen ved siden af.
    expect(brandLabel("LAND\u00a0ROVER")).toBe("LR");
    expect(brandLabel("LAND  ROVER")).toBe("LR");
  });

  it("falder tilbage til forbogstaver for ukendte, lange navne", () => {
    expect(brandLabel("SOMETHING VERY LONG")).toBe("SVL");
  });
});
