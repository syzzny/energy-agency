import { SearchFilter } from '@/components/SearchFilter';
import { ListInfo } from '@/components/ListInfo';
import { PressItem } from '@/components/PressItem';
import pressStyles from '@/components/PressItem/PressItem.module.scss';
import { Pagination } from '@/components/Pagination';
import { press } from '@/data/press';

export default function PressListPage() {
  return (
    <>
      <SearchFilter id="pressKeyword" />
      <ListInfo total="386" pages="65" />
      <ul className={pressStyles.list}>
        {press.map((p) => (
          <PressItem key={p.id} item={p} />
        ))}
      </ul>
      <Pagination />
    </>
  );
}
