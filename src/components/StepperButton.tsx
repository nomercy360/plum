import Icons from '@/components/Icons';

export default function StepperButton(props: { onIncrease: () => void; onDecrease: () => void }) {
  return (
    <div className="flex w-24 flex-row items-center justify-center rounded-lg bg-gray text-lg">
      <button className="flex h-8 w-full items-center justify-center" onClick={props.onDecrease}>
        <Icons.minus className="h-[20px] w-[16px]" />
      </button>
      <div className="h-[18px] w-px rounded bg-[#EBEBEB]" />
      <button className="flex h-8 w-full items-center justify-center" onClick={props.onIncrease}>
        <Icons.plus className="h-[20px] w-[16px]" />
      </button>
    </div>
  );
}
