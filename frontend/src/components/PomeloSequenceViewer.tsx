import {
  AnnotatedBase,
  Annotation,
  AriadneSelection,
  SequenceViewer,
} from "@nitro-bio/sequence-viewers";

export const PomeloSequenceViewer = ({
  sequences,
  setSequences,
  selection,
  setSelection,
  annotations,
  charClassName,
}: {
  sequences: string[];
  setSequences?: (sequences: string[]) => void;
  selection: AriadneSelection | null;
  setSelection: (selection: AriadneSelection | null) => void;
  annotations?: Annotation[];
  charClassName?: ({
    base,
    sequenceIdx,
  }: {
    base: AnnotatedBase;
    sequenceIdx: number;
  }) => string;
}) => {
  const defaultCharClassName = () => {
    return "text-sequences-primary";
  };
  return (
    <div className="flex max-h-[600px] overflow-y-auto">
      <SequenceViewer
        sequences={sequences}
        setSequences={setSequences}
        annotations={annotations ?? []}
        selection={selection}
        setSelection={setSelection}
        charClassName={charClassName ?? defaultCharClassName}
        selectionClassName="!bg-secondary/80"
        noValidate
      />
    </div>
  );
};
