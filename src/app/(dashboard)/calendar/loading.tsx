import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-52" />
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}
