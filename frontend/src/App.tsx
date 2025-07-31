import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const Home = lazy(() => import("@/pages/Home"));
const ESMFold = lazy(() => import("@/pages/folding/ESMFold"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App(): React.ReactElement {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app/" element={<Home />} />
        <Route path="/app/folding/esmfold" element={<ESMFold />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
