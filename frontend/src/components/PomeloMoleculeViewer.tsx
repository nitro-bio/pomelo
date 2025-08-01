import { plddtColorLegend } from "@/constants";
import { cn } from "@/lib/utils";
import { MoleculePayload, MoleculeViewer } from "@nitro-bio/molstar-easy";
import { AriadneSelection, baseInSelection } from "@nitro-bio/sequence-viewers";
import { useMemo } from "react";

interface PomeloMoleculeViewerProps {
  structure_string?: string;
  structure_format?: "pdb" | "mmcif";
  plddt?: number[];
  structureHexColor?: string;
  className?: string;
  showPlddt: boolean;
  selection: AriadneSelection | null;
  sequence: string;
}

export const PomeloMoleculeViewer = ({
  structure_string,
  structure_format = "pdb",
  plddt,
  sequence,
  selection,
  structureHexColor = "#FF0000",
  showPlddt,
  className,
}: PomeloMoleculeViewerProps) => {
  const payloads: MoleculePayload[] = useMemo(() => {
    if (!structure_string || !plddt) {
      return [];
    }
    return [
      {
        structureString: structure_string,
        format: structure_format,
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
  }, [
    plddt,
    structure_string,
    structure_format,
    showPlddt,
    structureHexColor,
    selection,
  ]);

  return (
    <div className={cn("relative", className)}>
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
