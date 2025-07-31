import React from "react";
import { OrigamiIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button/button";

interface FoldingModel {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  href: string;
  isAvailable: boolean;
}

const foldingModels: FoldingModel[] = [
  {
    id: "esmfold",
    name: "ESMFold",
    description:
      "Predicts the 3D structure of a protein from its amino acid sequence using language model embeddings.",
    icon: OrigamiIcon,
    href: "/app/folding/esmfold",
    isAvailable: true,
  },
];

export function FoldingModelsGrid(): React.ReactElement {
  return (
    <div className="pt-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {foldingModels.map((model) => {
          const Icon = model.icon;
          return (
            <div
              key={model.id}
              className="flex flex-col gap-4 rounded-lg border p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Icon className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{model.name}</h3>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {model.description}
              </p>

              <div className="pt-2">
                {model.isAvailable ? (
                  <Link to={model.href}>
                    <Button className="w-full">Use {model.name}</Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full">
                    Coming Soon
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
