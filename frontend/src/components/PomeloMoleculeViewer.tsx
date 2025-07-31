import { Button } from "@/components/ui/button/button";
import { plddtColorLegend } from "@/constants";
import { cn } from "@/lib/utils";
import { MoleculePayload, MoleculeViewer } from "@nitro-bio/molstar-easy";
import { AriadneSelection, baseInSelection } from "@nitro-bio/sequence-viewers";
import { useMemo } from "react";

interface PomeloMoleculeViewerProps {
  pdb?: string;
  plddt?: number[];
  structureHexColor?: string;
  className?: string;
  showPlddt: boolean;
  setShowPlddt: React.Dispatch<React.SetStateAction<boolean>>;
  selection: AriadneSelection | null;
  sequence: string;
}

export const PomeloMoleculeViewer = ({
  pdb,
  plddt,
  sequence,
  selection,
  structureHexColor = "#FF0000",
  showPlddt,
  setShowPlddt,
  className,
}: PomeloMoleculeViewerProps) => {
  const payloads: MoleculePayload[] = useMemo(() => {
    if (!pdb || !plddt) {
      return [];
    }
    return [
      {
        structureString: pdb,
        format: "pdb" as const,
        indexToColor: new Map(
          plddt.map((plddtValue: number, i: number) => {
            if (
              baseInSelection({
                baseIndex: i,
                selection,
                sequenceLength: sequence.length,
              })
            ) {
              console.log("in selection");

              return [i, "#D8F999"]; // Highlight selected residues in secondary
            }

            if (!showPlddt) {
              return [i, structureHexColor];
            } else {
              return [i, plddtToColor(plddtValue)];
            }
          }),
        ),
      },
    ];
  }, [plddt, pdb, showPlddt, structureHexColor, selection]);

  return (
    <div className={cn("relative", className)}>
      <div className="absolute right-2 bottom-0 z-[10] flex h-12 w-fit gap-1">
        <Button
          size="xs"
          onClick={() => {
            setShowPlddt((prev) => !prev);
          }}
          variant={showPlddt ? "default" : "outline"}
        >
          pLDDT
        </Button>
      </div>
      <MoleculeViewer
        moleculePayloads={payloads}
        className="min-h-80 w-full flex-1"
        backgroundHexColor="#FFFFFF"
      />
    </div>
  );
};

const plddtToColor = (plddt: number) => {
  for (const [threshold, color] of plddtColorLegend) {
    if (plddt >= threshold) {
      return color;
    }
  }
  console.error("No color found for pLDDT", plddt);
  return "#F1F1F1";
};
