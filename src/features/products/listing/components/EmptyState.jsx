import { PackageOpen } from "lucide-react";

const EmptyState = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <PackageOpen className="w-10 h-10 text-gray-300" />
      </div>
      <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">No matching items</h3>
      <p className="text-xs text-gray-500 font-medium max-w-xs">We couldn&apos;t find any products matching your current filters. Try adjusting them.</p>
      <button onClick={onReset} className="mt-8 px-8 py-3 bg-[#088395] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Clear Filters</button>
    </div>
  );
};

export default EmptyState;
