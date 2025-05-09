
'use client';

import { useRouter, usePathname, useSearchParams as useNextSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EntitySelectorProps {
  defaultValue: string;
  allEntities: string[];
  currentSearchParams?: Record<string, string | string[] | undefined>; 
  paramName?: string; 
  placeholder?: string;
}

export function EntitySelector({ 
  defaultValue, 
  allEntities, 
  paramName = "individualEntity", 
  placeholder = "Select Entity"
}: EntitySelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const nextSearchParams = useNextSearchParams();

  const handleEntityChange = (value: string) => {
    const newSearchParams = new URLSearchParams(nextSearchParams.toString());
    newSearchParams.set(paramName, value);
    router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <Select value={defaultValue} onValueChange={handleEntityChange}>
      <SelectTrigger className="w-full sm:w-[250px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allEntities.map(name => (
          <SelectItem key={name} value={name}>{name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
