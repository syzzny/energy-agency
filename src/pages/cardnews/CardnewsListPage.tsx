import { ListInfo } from '@/components/ListInfo';
import { GalleryItem } from '@/components/GalleryItem';
import { Pagination } from '@/components/Pagination';
import { cardnews } from '@/data/cardnews';
import galleryStyles from '@/components/GalleryItem/GalleryItem.module.scss';

export default function CardnewsListPage() {
  return (
    <>
      <ListInfo total="54" pages="9" sort />
      <ul className={galleryStyles.list}>
        {cardnews.map((item) => (
          <GalleryItem key={item.id} item={item} />
        ))}
      </ul>
      <Pagination />
    </>
  );
}
