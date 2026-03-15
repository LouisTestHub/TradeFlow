import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-12 w-full max-w-lg rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-48 w-full max-w-2xl rounded-xl" />
        <Skeleton className="h-48 w-full max-w-2xl rounded-xl" />
      </div>
    </div>
  );
}
