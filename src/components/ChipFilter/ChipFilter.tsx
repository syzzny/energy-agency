import { Chip, ChipGroup } from '@/components/Badge';
import { useToast } from '@/components/Toast';
import type { Category } from '@/data/types';

export interface ChipFilterProps {
  label: string;
  items: Category[];
  active: string;
  onSelect: (key: string) => void;
  className?: string;
}

/** 카테고리 칩 필터 — `components/chip-filter.hbs` 대응. 선택 시 결과 건수를 토스트(aria-live)로 알린다 */
export function ChipFilter({ label, items, active, onSelect, className }: ChipFilterProps) {
  const { show } = useToast();

  return (
    <ChipGroup label={label} className={className}>
      {items.map((item) => (
        <Chip
          key={item.key}
          active={item.key === active}
          count={item.count}
          onClick={() => {
            onSelect(item.key);
            show(`${item.label} ${item.count}건이 표시됩니다.`);
          }}
        >
          {item.label}
        </Chip>
      ))}
    </ChipGroup>
  );
}
