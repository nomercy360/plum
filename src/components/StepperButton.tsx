export default function StepperButton(props: {
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div className="flex w-24 flex-row items-center justify-center rounded-lg bg-gray text-lg">
      <button
        className="flex h-8 w-full items-center justify-center"
        onClick={props.onDecrease}>
        -
      </button>
      <div className="h-4 w-[3px] bg-neutral-200" />
      <button
        className="h-8 w-full items-center justify-center"
        onClick={props.onIncrease}>
        +
      </button>
    </div>
  );
}
