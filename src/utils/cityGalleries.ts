import type { GalleryImageItem } from '../components/CityGallerySlider';

export type GalleryCity = 'shanghai' | 'beijing' | 'tokyo';

const shanghaiModules = import.meta.glob(
  '../../galleries/shanghai/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' }
) as Record<string, string>;

const beijingModules = import.meta.glob(
  '../../galleries/beijing/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' }
) as Record<string, string>;

const tokyoModules = import.meta.glob(
  '../../galleries/tokyo/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' }
) as Record<string, string>;

const galleryModules: Record<GalleryCity, Record<string, string>> = {
  shanghai: shanghaiModules,
  beijing: beijingModules,
  tokyo: tokyoModules
};

const toGalleryItems = (
  modules: Record<string, string>,
  altPrefix: string
): GalleryImageItem[] =>
  Object.entries(modules)
    .filter(([, src]) => typeof src === 'string' && src.length > 0)
    .sort(([left], [right]) =>
      left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' })
    )
    .map(([, src], index) => ({
      src,
      alt: `${altPrefix} ${index + 1}`
    }));

export const getCityGalleryImages = (
  city: GalleryCity,
  altPrefix: string
): GalleryImageItem[] => toGalleryItems(galleryModules[city], altPrefix);
