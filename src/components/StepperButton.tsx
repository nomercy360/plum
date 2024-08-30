import Icons from '@/components/Icons';

export default function StepperButton(props: { onIncrease: () => void; onDecrease: () => void }) {
  return (
    <div className="flex h-8 min-w-[74px] flex-row items-center justify-center rounded-lg bg-gray text-lg">
      <button className="flex h-8 w-full items-center justify-center" onClick={props.onDecrease}>
        <Icons.minus className="h-[18px] w-[14px]" />
      </button>
      <div className="h-[18px] w-px rounded bg-lighter-gray" />
      <button className="flex h-8 w-full items-center justify-center" onClick={props.onIncrease}>
        <Icons.plus className="h-[18px] w-[14px]" />
      </button>
    </div>
  );
}
