import { useDebounce } from "@uidotdev/usehooks";
import { FoldResult, Boltz2Result } from "@/api/protein_folding/schemas";
import { PomeloSequenceViewer } from "@/components/PomeloSequenceViewer";
import { PomeloMoleculeViewer } from "@/components/PomeloMoleculeViewer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { AriadneSelection } from "@nitro-bio/sequence-viewers";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { plddtColorLegend } from "@/constants";
import { buttonVariants } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const FoldingCard = ({
  foldingData,
  isFetchingFolding,
  foldingError,
  structureHexColor = "#FF0000",
  className,
  sequence,
}: {
  foldingData: FoldResult | Boltz2Result | null;
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

  const structure_format: "pdb" | "mmcif" =
    foldingData && "mmcif_string" in foldingData ? "mmcif" : "pdb";
  const structure_string =
    foldingData && "mmcif_string" in foldingData
      ? foldingData.mmcif_string
      : foldingData?.pdb;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border px-4 py-2",
        "bg-white",
        className,
      )}
    >
      <div className={cn("flex h-full min-h-80 flex-col")}>
        {isFetchingFolding && (
          <p className="bg-background absolute -inset-x-4 -inset-y-2 flex animate-pulse items-center justify-center gap-1">
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
          className="flex gap-2"
        >
          <ToggleGroupItem
            variant={showPlddt ? "default" : "outline"}
            className="text-xs"
            value="protein"
          >
            Protein
          </ToggleGroupItem>
          <ToggleGroupItem
            variant={showPlddt ? "default" : "outline"}
            className="px-4 text-xs"
            value="sequence"
          >
            Sequence
          </ToggleGroupItem>
          <Tooltip>
            <TooltipTrigger
              onClick={() => {
                setShowPlddt((prev) => !prev);
              }}
              className={cn(
                showPlddt
                  ? buttonVariants({ variant: "default" })
                  : buttonVariants({ variant: "outline" }),
              )}
            >
              pLDDT
            </TooltipTrigger>
            <TooltipContent className="bg-input text-foreground ml-2">
              <p>pLDDT is a per-residue measure of model confidence.</p>
              <ul className="flex gap-4">
                {Array.from(plddtColorLegend.entries()).map(
                  ([, [threshold, color, _, label]]) => (
                    <li
                      key={threshold.toString()}
                      className="mt-1 flex items-center gap-1"
                    >
                      <div
                        className="inline-block size-3"
                        style={{ backgroundColor: color }}
                      />
                      {label}
                    </li>
                  ),
                )}
              </ul>
            </TooltipContent>
          </Tooltip>
        </ToggleGroup>

        {foldingData && (
          <span
            className={cn(
              "grid grid-cols-1 gap-4 py-2",
              viewMode.length > 1 ? "md:grid-cols-2" : "grid-cols-1",
            )}
          >
            {viewMode.includes("protein") && (
              <PomeloMoleculeViewer
                structure_string={structure_string}
                structure_format={structure_format}
                plddt={foldingData?.plddt}
                structureHexColor={structureHexColor}
                showPlddt={showPlddt}
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
        )}
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
