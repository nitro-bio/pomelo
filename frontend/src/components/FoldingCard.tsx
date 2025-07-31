import { FoldResult } from "@/api/protein_folding/schemas";
import { Button } from "@/components/ui/button/button";
import { cn } from "@/lib/utils";
import { MoleculePayload, MoleculeViewer } from "@nitro-bio/molstar-easy";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";

export const FoldingCard = ({
  foldingData,
  isFetchingFolding,
  foldingError,
  structureHexColor = "#FF0000",
  className,
}: {
  foldingData: FoldResult | null;
  isFetchingFolding: boolean;
  foldingError: Error | null;
  structureHexColor?: string;
  className?: string;
}) => {
  const [mode, setMode] = useState<"default" | "plddt">("default");

  let payloads: MoleculePayload[] = [];
  if (foldingData) {
    const pdbString = foldingData.pdb;
    const plddt = foldingData.plddt;
    console.log(plddt);
    payloads = [
      {
        structureString: pdbString,
        format: "pdb" as const,
        indexToColor: new Map(
          plddt.map((plddtValue, i) => {
            if (mode === "default") {
              return [i, structureHexColor];
            } else {
              return [i, plddtToColor(plddtValue)];
            }
          }),
        ),
      },
    ];
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border px-4 py-2",
        "bg-background",
        "relative",
        className,
      )}
    >
      <div className={cn("relative flex h-full flex-col")}>
        {isFetchingFolding && (
          <p className="bg-background absolute inset-0 flex animate-pulse items-center justify-center gap-1">
            <LoaderCircleIcon className="my-auto h-4 w-4 animate-spin" />
            Folding protein...
          </p>
        )}
        {foldingError && (
          <p className="text-xs text-red-500">
            {foldingError?.message ??
              "An internal error occured during folding."}
          </p>
        )}
        <div className="absolute top-0 right-0 z-[10] flex h-12 w-fit gap-1">
          <Button
            size="xs"
            onClick={() => {
              setMode(mode === "default" ? "plddt" : "default");
            }}
            variant={mode === "plddt" ? "default" : "outline"}
          >
            pLDDT
          </Button>
        </div>
        <MoleculeViewer
          moleculePayloads={payloads}
          className="min-h-80 w-full flex-1"
          backgroundHexColor="#FCFBFA"
        />
      </div>
    </div>
  );
};

// make sure this is sorted in descending order so that our color mapping works
const plddtColorLegend: [number, string, string][] = [
  [90, "#0053D6", "> 90%"],
  [70, "#65CBF3", "> 70%"],
  [50, "#FFDB13", "> 50%"],
  [0, "#FF7D45", "< 50%"],
];

const plddtToColor = (plddt: number) => {
  for (const [threshold, color] of plddtColorLegend) {
    if (plddt >= threshold) {
      return color;
    }
  }
  console.error("No color found for pLDDT", plddt);
  return "#F1F1F1";
};
