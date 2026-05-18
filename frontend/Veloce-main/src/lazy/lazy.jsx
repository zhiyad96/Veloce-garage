
import React, { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import Loader from "../lazy/loader";

const App = lazy(() => import("../App"));

export default function LazyLoadPage() {
  return (
    <Suspense
fallback={<Loader/> }
    >
      <App />
    </Suspense>
  );
}
