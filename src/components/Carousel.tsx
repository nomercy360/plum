import { useCallback, useEffect, useState } from 'react';

export const useDotButton = emblaApi => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const onDotButtonClick = useCallback(
    index => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onInit = useCallback(emblaApi => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback(emblaApi => {
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

export const DotButton = (props: { children: React.ReactNode } & React.HTMLProps<HTMLButtonElement>) => {
  const { children, ...restProps } = props;

  return (
    <button type="button" {...restProps}>
      {children}
    </button>
  );
};
import useEmblaCarousel from 'embla-carousel-react';
import ExportedImage from 'next-image-export-optimizer';

const EmblaCarousel = (props: { slides: string[]; options: any }) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container gap-2">
          {slides.map(index => (
            <div className="embla__slide" key={index}>
              <ExportedImage src={index} width={740} height={1040} alt="" className="rounded-lg object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2">
        <div className="flex flex-row items-center justify-center space-x-2">
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
