import React from "react";
import Shell from "@/components/Shell";
import { FoldingModelsGrid } from "@/components/FoldingModelsGrid";

export default function Home(): React.ReactElement {
  return (
    <Shell>
      <div className="flex min-h-screen flex-col items-center p-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Pomelo
          </h1>
          <p className="text-muted-foreground text-lg">
            An open-source platform for molecular visualization and analysis
          </p>
        </div>

        <div className="w-full max-w-6xl">
          <FoldingModelsGrid />
        </div>
      </div>
    </Shell>
  );
}
