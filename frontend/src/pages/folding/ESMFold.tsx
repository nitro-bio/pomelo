import { useFoldProteinMutation } from "@/api/protein_folding/hooks";
import {
  ProteinSequenceRequestSchema,
  type ProteinSequenceRequest,
} from "@/api/protein_folding/schemas";
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
import { Textarea } from "@/components/ui/textarea";
import { STRUCTURE_HEX_COLOR } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

export default function ESMFold(): React.ReactElement {
  const { foldProtein, isFolding, foldingError, foldingResult } =
    useFoldProteinMutation();

  const form = useForm<ProteinSequenceRequest>({
    resolver: zodResolver(ProteinSequenceRequestSchema),
    defaultValues: {
      sequence:
        "MAGEGDQQDAAAHNMGNHLPLLPAESEEDEMEVEDQDKEAKKPNIINFMTSLPTSHTYLGADMI",
    },
  });

  const onSubmit = (data: ProteinSequenceRequest) => {
    foldProtein(data);
  };

  return (
    <Shell>
      <div className="flex min-h-screen flex-col items-center justify-start p-8">
        <div className="flex w-full max-w-4xl flex-col gap-8">
          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight">ESMFold</h1>
            <p className="text-muted-foreground text-lg">
              Predicts the 3D structure of a protein from its amino acid
              sequence using language model embeddings.
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
                      Amino Acid Sequence{" "}
                      <span className="text-red-500">*</span>
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

              <Button type="submit" size="lg" disabled={isFolding}>
                {isFolding ? "Folding Protein..." : "Fold Protein"}
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
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
