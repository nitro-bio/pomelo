import type { Ketcher } from "ketcher-core";
import { useState } from "react";

import KetcherEditor from "./LazyKetcher";
import { Button } from "./ui/button/button";
import { Input } from "./ui/input";
import { Labeled } from "./ui/Labeled";
import { SquarePenIcon } from "lucide-react";

// Default example SMILES for common chemical structures
export const defaultExampleSmiles = [
  "CCO", // Ethanol
  "CC(=O)OC1=CC=CC=C1C(=O)O", // Aspirin
  "CC(C)CC1=CC=C(C=C1)C(C)C(=O)O", // Ibuprofen
  "CCCC", // Butane
  "C1=CC=CC=C1", // Benzene
];

// Configuration for hiding specific Ketcher editor buttons
export const hiddenButtons = {
  // Hide specific tool buttons that aren't needed for basic chemical structure input
  onBondChanged: undefined,
  onAtomChanged: undefined,
  onStructChanged: undefined,
};
export const ChemicalFormInput = ({
  initialSmiles,
  onSmilesChange,
}: {
  initialSmiles?: string;
  onSmilesChange: (smiles: string) => void;
}) => {
  const [isKetcherInitialized, setIsKetcherInitialized] = useState(false);
  const [smilesInput, setSmilesInput] = useState(initialSmiles || "");

  const handleExampleClick = async (exampleSmiles: string) => {
    try {
      if (window.ketcher && isKetcherInitialized) {
        try {
          await window.ketcher.setMolecule(exampleSmiles);
          setSmilesInput(exampleSmiles);
        } catch (error) {
          console.error("Failed to load example structure:", error);
        }
      }
    } catch (error) {
      console.error("Failed to load example structure:", error);
    }
  };

  const handleSmilesUpdate = async () => {
    if (!isKetcherInitialized || !window.ketcher) {
      console.error("Ketcher is not initialized");
      return;
    }

    if (!smilesInput.trim()) {
      console.error("Please enter a SMILES string");
      return;
    }

    try {
      await window.ketcher.setMolecule(smilesInput);
    } catch (error) {
      console.error("Failed to update structure from SMILES:", error);
    }
  };

  const updateSmilesFromEditor = async () => {
    if (!isKetcherInitialized || !window.ketcher) {
      return;
    }
    try {
      const currentSmiles = await window.ketcher.getSmiles();
      if (currentSmiles) {
        setSmilesInput(currentSmiles);
        onSmilesChange(currentSmiles);
      }
    } catch (error) {
      console.error("Failed to get SMILES from editor:", error);
    }
  };

  const handleInsert = async () => {
    if (!isKetcherInitialized || !window.ketcher) {
      console.error("Ketcher is not initialized");
      return;
    }

    const structObj = await window.ketcher.getSmiles();
    if (!structObj) {
      console.error("No structure found in Ketcher");
      return;
    }

    setSmilesInput(structObj);

    // Call the callback to update the form field
    if (onSmilesChange) {
      onSmilesChange(structObj);
    }

    console.log("Updated SMILES structure");
  };

  return (
    <>
      <Button type="button" onClick={handleInsert} className="ml-auto">
        <SquarePenIcon className="size-4" />
        Apply
      </Button>

      <div className="flex gap-4 py-4">
        <section className="grid flex-1 gap-4">
          <div className="neobrut-border h-[400px] w-full overflow-hidden">
            <KetcherEditor
              staticResourcesUrl={(process.env.PUBLIC_URL ?? "") as string}
              buttons={hiddenButtons}
              errorHandler={(message: string | Error) => {
                console.error("Error in Ketcher:", message);
              }}
              onInit={(ketcher: Ketcher) => {
                window.ketcher = ketcher;
                window.parent.postMessage(
                  {
                    eventType: "init",
                  },
                  "*",
                );
                window.scrollTo(0, 0);

                try {
                  const moleculeToLoad = initialSmiles || "CCCC";
                  window.ketcher.setMolecule(moleculeToLoad);
                  setSmilesInput(moleculeToLoad);

                  if (window.ketcher && window.ketcher.editor) {
                    window.ketcher.editor.subscribe("change", () => {
                      setTimeout(updateSmilesFromEditor, 100);
                    });
                  }
                } catch (error) {
                  console.error(
                    "Error initializing Ketcher with empty molecule:",
                    error,
                  );
                }
                setIsKetcherInitialized(true);
              }}
            />
          </div>
        </section>

        <section className="flex h-full w-80 flex-col justify-between">
          <div className="flex flex-col gap-4">
            <Labeled label="SMILES Input" className="w-full">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={smilesInput}
                  onChange={(e) => setSmilesInput(e.target.value)}
                  placeholder="Enter SMILES string..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSmilesUpdate();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleSmilesUpdate}
                  variant="outline"
                >
                  Update
                </Button>
              </div>
            </Labeled>

            <Labeled label="Example Structures" className="w-full">
              <div className="flex flex-wrap gap-2">
                {defaultExampleSmiles.map((example) => (
                  <Button
                    key={example}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleExampleClick(example)}
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </Labeled>
          </div>
        </section>
      </div>
    </>
  );
};
