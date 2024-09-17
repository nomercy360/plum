import EmblaCarousel from '@/components/Carousel';
import Image from 'next/image';

export default function PhotoGallery(props: { images: string[] }) {
  return (
    <div className="max-w-full">
      <div className="relative flex w-full flex-col items-center justify-end sm:hidden">
        <EmblaCarousel slides={props.images} options={{ loop: false }} />
      </div>
      <div className="hidden gap-4 sm:flex">
        {props.images.length === 1 ? (
          <Image
            src={props.images[0]}
            alt={props.images[0]}
            width={740}
            height={1040}
            className="aspect-[5/7] w-full rounded-lg object-cover"
            sizes="(max-width: 600px) 100vw, 50vw"
          />
        ) : (
          <div className="grid w-full flex-shrink-0 grid-cols-2 gap-4">
            {props.images.map(image => (
              <Image
                src={image}
                alt={image}
                key={image}
                width={370}
                height={520}
                className="aspect-[5/7] rounded-lg object-cover"
                sizes="(max-width: 600px) 100vw, 50vw"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
