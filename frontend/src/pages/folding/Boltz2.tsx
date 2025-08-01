import { useBoltz2Mutation } from "@/api/protein_folding/hooks";
import {
  Boltz2RequestSchema,
  type Boltz2Request,
} from "@/api/protein_folding/schemas";
import { ChemicalFormInput } from "@/components/ChemicalFormInput";
import { FoldingCard } from "@/components/FoldingCard";
import Shell from "@/components/Shell";
import { Button } from "@/components/ui/button/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { STRUCTURE_HEX_COLOR } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function Boltz2(): React.ReactElement {
  const { foldBoltz2, isFolding, foldingError, foldingResult } =
    useBoltz2Mutation();

  const [showKetcher, setShowKetcher] = useState(false);

  const form = useForm<Boltz2Request>({
    resolver: zodResolver(Boltz2RequestSchema),
    defaultValues: {
      sequence:
        "MKTVRQERLKSIVRILERSKEPVSGAQLAEELSVSRQVIVQDIAYLRSLGYNIVATPRGYVLAGG",
      ligandSmiles: "CC(=O)OC1=CC=CC=C1C(=O)O",
    },
  });

  const onSubmit = (data: Boltz2Request) => {
    foldBoltz2(data);
  };

  return (
    <Shell>
      <div className="flex min-h-screen flex-col items-center justify-start p-8">
        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Boltz-2</h1>
            <p className="text-muted-foreground text-lg">
              Predicts protein structures and their interactions with small
              molecule ligands using advanced AI models.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="sequence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Protein Sequence <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter amino acid sequence..."
                        className="min-h-[120px] font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ligandSmiles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ligand Structure (Optional)</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-4">
                        {showKetcher ? (
                          <ChemicalFormInput
                            initialSmiles={field.value}
                            onSmilesChange={(smiles) => {
                              field.onChange(smiles);
                              setShowKetcher(false);
                            }}
                          />
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Input
                              placeholder="Enter SMILES notation..."
                              className="font-mono text-sm"
                              disabled={showKetcher}
                              {...field}
                            />

                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowKetcher(!showKetcher)}
                            >
                              {showKetcher ? "Hide Editor" : "Structure Editor"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" disabled={isFolding}>
                {isFolding ? "Processing..." : "Run Boltz-2"}
              </Button>
            </form>
          </Form>

          <div className="flex flex-col items-center gap-4">
            {foldingError && (
              <div className="text-destructive text-sm">
                Error: {foldingError.message}
              </div>
            )}

            <div className="flex w-full flex-col gap-4">
              {isFolding && (
                <FoldingCard
                  foldingData={null}
                  isFetchingFolding={true}
                  foldingError={null}
                  structureHexColor={STRUCTURE_HEX_COLOR}
                  className="h-full"
                  sequence={form.getValues("sequence")}
                />
              )}

              {foldingResult?.results.map((result, index) => (
                <FoldingCard
                  key={index}
                  foldingData={result}
                  isFetchingFolding={false}
                  foldingError={null}
                  structureHexColor="#FF0000"
                  className="h-full"
                  sequence={form.getValues("sequence")}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
