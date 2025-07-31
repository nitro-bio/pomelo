import { useDebounce } from "@uidotdev/usehooks";
import { FoldResult } from "@/api/protein_folding/schemas";
import { PomeloSequenceViewer } from "@/components/PomeloSequenceViewer";
import { PomeloMoleculeViewer } from "@/components/PomeloMoleculeViewer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { AriadneSelection } from "@nitro-bio/sequence-viewers";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { plddtColorLegend } from "@/constants";

export const FoldingCard = ({
  foldingData,
  isFetchingFolding,
  foldingError,
  structureHexColor = "#FF0000",
  className,
  sequence,
}: {
  foldingData: FoldResult | null;
  isFetchingFolding: boolean;
  foldingError: Error | null;
  structureHexColor?: string;
  className?: string;
  sequence: string;
}) => {
  const [selection, setSelection] = useState<AriadneSelection | null>(null);
  const debouncedSelection = useDebounce(selection, 200);
  const [viewMode, setViewMode] = useState<("sequence" | "protein")[]>([
    "protein",
  ]);
  const [showPlddt, setShowPlddt] = useState<boolean>(false);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border px-4 py-2",
        "bg-white",
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

        <ToggleGroup
          type="multiple"
          defaultValue={["protein"]}
          value={viewMode}
          variant="outline"
          onValueChange={(value) => {
            if (value.length > 0) {
              setViewMode(value as ("sequence" | "protein")[]);
            }
          }}
          className="-mt-2 -ml-4"
        >
          <ToggleGroupItem
            className="text-xs"
            variant="outline"
            value="protein"
          >
            Protein
          </ToggleGroupItem>
          <ToggleGroupItem
            className="text-xs"
            variant="outline"
            value="sequence"
          >
            Sequence
          </ToggleGroupItem>
        </ToggleGroup>

        <span
          className={cn(
            "grid grid-cols-1 gap-4 py-2",
            viewMode.length > 1 ? "md:grid-cols-2" : "grid-cols-1",
          )}
        >
          {viewMode.includes("protein") && (
            <PomeloMoleculeViewer
              pdb={foldingData?.pdb}
              plddt={foldingData?.plddt}
              structureHexColor={structureHexColor}
              showPlddt={showPlddt}
              setShowPlddt={setShowPlddt}
              sequence={sequence}
              selection={debouncedSelection}
            />
          )}
          {viewMode.includes("sequence") && (
            <div className="min-h-80 w-full flex-1">
              <PomeloSequenceViewer
                sequences={[sequence]}
                selection={selection}
                setSelection={setSelection}
                charClassName={({ base }) => {
                  if (showPlddt && foldingData?.plddt) {
                    const plddt = foldingData?.plddt[base.index];
                    return plddtToClassName(plddt);
                  }
                  return "text-primary";
                }}
              />
            </div>
          )}
        </span>
      </div>
    </div>
  );
};

export const plddtToClassName = (plddt: number) => {
  for (const [threshold, _, className] of plddtColorLegend) {
    if (plddt >= threshold) {
      return className;
    }
  }
  console.error("No class name found for pLDDT", plddt);
  return "text-muted-foreground";
};
