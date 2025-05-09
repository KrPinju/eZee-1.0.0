
'use client';

import { useRouter, usePathname, useSearchParams as useNextSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { OccupancyPageSearchParams } from '@/app/(app)/occupancy/page'; // Ensure this path and type are correct

interface EntitySelectorProps {
  defaultValue: string;
  allEntities: string[];
  currentSearchParams?: OccupancyPageSearchParams;
}

export function EntitySelector({ defaultValue, allEntities, currentSearchParams: pageSearchParams }: EntitySelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Use useNextSearchParams hook to get current search params on the client side
  // This is more reliable in client components than passing them down if they might be stale
  const nextSearchParams = useNextSearchParams();

  const handleEntityChange = (value: string) => {
    // Create a new URLSearchParams object from the client-side hook's result
    const newSearchParams = new URLSearchParams(nextSearchParams.toString());
    newSearchParams.set("individualEntity", value);
    router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <Select value={defaultValue} onValueChange={handleEntityChange}>
      <SelectTrigger className="w-full sm:w-[250px]">
        <SelectValue placeholder="Select Hotel or Restaurant" />
      </SelectTrigger>
      <SelectContent>
        {allEntities.map(name => (
          <SelectItem key={name} value={name}>{name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
