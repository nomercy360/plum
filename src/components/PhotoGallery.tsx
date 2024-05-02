import { useEffect, useState } from 'react';

export default function PhotoGallery(props: { images: string[] }) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', () => {
      setIsMobile(window.innerWidth < 768);
    });
  }, []);

  return (
    <div className="max-w-full">
      {isMobile ? (
        <div
          className="relative flex w-full flex-col items-center justify-end"
          onClick={() => {
            setActiveIndex(
              (prevIndex) => (prevIndex + 1) % props.images.length,
            );
          }}>
          <img alt="" className="size-full" src={props.images[activeIndex]} />
          <div className="absolute z-10 my-5 flex items-center justify-center gap-2">
            {props.images.length > 1 && (
              props.images.map((image, index) => (
                <div
                  key={image}
                  className={`w-2 h-2 bg-white rounded-full ${
                    index === activeIndex ? 'bg-black' : ''
                  }`}
                />
              ))
            )}
          </div>
        </div>) : (
        props.images.length === 1 ? (
          <img
            alt=""

            className="w-full rounded-lg object-cover"
            src={props.images[0]}
          />
        ) : (

          <div className="grid w-full flex-shrink-0 grid-cols-2 gap-4">
            {props.images.map((image) => (
                <img
                  key={image}
                  alt="" className="rounded-lg object-cover" src={image} />
              ),
            )}
          </div>
        )
      )}
    </div>
  );
}