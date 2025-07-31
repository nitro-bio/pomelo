import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const Home = lazy(() => import("@/pages/Home"));
const AppLayout = lazy(() => import("@/pages/AppLayout"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App(): React.ReactElement {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<AppLayout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
