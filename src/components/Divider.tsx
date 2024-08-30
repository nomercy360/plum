export default function Divider() {
  return (
    <div className="relative flex h-4 w-full flex-row justify-between divide-y-2 divide-dashed divide-lighter-gray">
      <div className="absolute -left-2 top-0 size-3 -translate-y-1/2 transform rounded-full bg-lighter-gray" />
      <div className="absolute -right-2 top-0 size-3 -translate-y-1/2 transform rounded-full bg-lighter-gray" />
      <div className="h-3 w-full"></div>
      <div className="h-3 w-full"></div>
    </div>
  );
}
