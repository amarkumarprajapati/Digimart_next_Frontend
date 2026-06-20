import { PackageOpen } from "lucide-react";

const EmptyState = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-surface-2">
        <PackageOpen className="h-8 w-8 text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-ink">No matching items</h3>
      <p className="mt-1 max-w-xs text-sm text-muted">
        We couldn&apos;t find any products matching your filters. Try adjusting them.
      </p>
      <button onClick={onReset} className="btn-primary mt-6 h-10 px-5 text-sm">
        Clear filters
      </button>
    </div>
  );
};

export default EmptyState;
