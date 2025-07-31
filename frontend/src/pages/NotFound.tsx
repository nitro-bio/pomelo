import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button/button";

export default function NotFound(): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-6 text-center">
        <h1 className="text-muted-foreground text-9xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <Link to="/">
            <Button variant="outline">Go Home</Button>
          </Link>
          <Link to="/app">
            <Button>Go to App</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
