import ExportedImage from 'next-image-export-optimizer';
import EmblaCarousel from '@/components/Carousel';

export default function PhotoGallery(props: { images: string[] }) {
  return (
    <div className="max-w-full">
      <div className="relative flex w-full flex-col items-center justify-end sm:hidden">
        <EmblaCarousel slides={props.images} options={{ loop: false }} />
      </div>
      <div className="hidden gap-4 sm:flex">
        {props.images.length === 1 ? (
          <ExportedImage
            alt=""
            className="w-full rounded-lg object-cover"
            src={props.images[0]}
            width={740}
            height={1040}
          />
        ) : (
          <div className="grid w-full flex-shrink-0 grid-cols-2 gap-4">
            {props.images.map(image => (
              <ExportedImage
                key={image}
                alt=""
                className="aspect-[5/7] rounded-lg object-cover"
                src={image}
                width={370}
                height={520}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
