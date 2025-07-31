import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button/button";

export default function Home(): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Pomelo</h1>
        <p className="text-muted-foreground text-lg">
          Your molecular visualization and analysis platform
        </p>
        <Link to="/app">
          <Button size="lg">Get Started</Button>
        </Link>
      </div>
    </div>
  );
}
