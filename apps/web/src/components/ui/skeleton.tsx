import React from 'react';
import { cn } from '@/lib/utils';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse rounded-md bg-gray-200",
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

export { Skeleton };

// Skeleton patterns for different components
export const TaskCardSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-3">
    <div className="flex justify-between items-start">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-5 w-16" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="flex justify-between items-center pt-2">
      <div className="flex space-x-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
);

export const TaskDetailSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <div className="flex space-x-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="h-20 w-full" />
    </div>

    <div className="space-y-3">
      <Skeleton className="h-6 w-40" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-3 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  </div>
);
