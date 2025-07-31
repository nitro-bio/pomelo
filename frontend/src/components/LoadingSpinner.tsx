import React from "react";

export function LoadingSpinner(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="border-muted border-t-primary h-12 w-12 animate-spin rounded-full border-4"></div>
    </div>
  );
}
