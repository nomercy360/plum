import Icons from '@/components/Icons';

export default function StepperButton(props: {
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div className="flex w-24 flex-row items-center justify-center rounded-lg bg-gray text-lg">
      <button
        className="flex h-8 w-full items-center justify-center"
        onClick={props.onDecrease}>
        <Icons.minus className="h-4 w-4" />
      </button>
      <div className="h-4 w-[3px] bg-neutral-200" />
      <button
        className="h-8 w-full flex items-center justify-center"
        onClick={props.onIncrease}>
        <Icons.plus className="size-6" />
      </button>
    </div>
  );
}
