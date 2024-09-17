import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

export const useDotButton = (emblaApi: any) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

export const DotButton = (props: any) => {
  const { children, ...restProps } = props;

  return (
    <button type="button" {...restProps}>
      {children}
    </button>
  );
};

const EmblaCarousel = (props: { slides: string[]; options: any }) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  return (
    <section className="embla">
      <div className="embla__viewport relative flex justify-center" ref={emblaRef}>
        <div className="embla__container gap-2">
          {slides.map(index => (
            <div className="embla__slide" key={index}>
              <Image
                src={index}
                alt={index}
                width={360}
                height={640}
                className="aspect-[5/7] w-full rounded-lg object-cover"
                sizes="(max-width: 600px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-5 flex flex-row items-center justify-center space-x-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'size-2 rounded-full border border-dark-gray bg-transparent'.concat(
                index === selectedIndex ? 'border-dark-gray bg-dark-gray' : '',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
