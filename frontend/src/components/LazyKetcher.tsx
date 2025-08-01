import { Loader2Icon } from "lucide-react";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
type EditorProps = {
  disableMacromoleculesEditor?: boolean;
  staticResourcesUrl: string;
  errorHandler: (message: string) => void;
  onInit: (k: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  buttons: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};
/**

 * Loads everything Ketcher needs in one chunk.
 */
const LazyKetcher = lazy(async () => {
  // This stays – makes sure side-effects run before Editor is evaluated
  await import("ketcher-core");

  const { Editor } = await import("ketcher-react");
  const { StandaloneStructServiceProvider } = await import(
    "ketcher-standalone"
  );
  await import("ketcher-react/dist/index.css");

  const provider = new StandaloneStructServiceProvider();
  return {
    default: (props: EditorProps) => (
      <ErrorBoundary
        fallback="An unexpected error occurred"
        onError={(err, info) => {
          console.error("Ketcher error", { err, info });
        }}
      >
        <div className="pomelo-ketcher">
          <Editor
            disableMacromoleculesEditor
            structServiceProvider={provider}
            {...props}
          />
        </div>
      </ErrorBoundary>
    ),
  };
});
export default function KetcherEditor(props: EditorProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <Loader2Icon className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <LazyKetcher {...props} />
    </Suspense>
  );
}
