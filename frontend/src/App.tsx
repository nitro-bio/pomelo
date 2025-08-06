import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const Home = lazy(() => import("@/pages/Home"));
const ESMFold = lazy(() => import("@/pages/folding/ESMFold"));
const Boltz2 = lazy(() => import("@/pages/folding/Boltz2"));
const Jobs = lazy(() => import("@/pages/Jobs"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App(): React.ReactElement {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app/" element={<Home />} />
        <Route path="/app/folding/esmfold" element={<ESMFold />} />
        <Route path="/app/folding/boltz2" element={<Boltz2 />} />
        <Route path="/app/jobs" element={<Jobs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
