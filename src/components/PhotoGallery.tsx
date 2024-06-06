import { useEffect, useState } from 'react';
import ExportedImage from 'next-image-export-optimizer';

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
          <ExportedImage
            alt="Product Image"
            width={740}
            priority={true}
            height={1040}
            className="size-full"
            src={props.images[activeIndex]}
          />
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
          <ExportedImage
            alt=""
            className="w-full rounded-lg object-cover"
            src={props.images[0]}
            width={740}
            height={1040}
          />
        ) : (

          <div className="grid w-full flex-shrink-0 grid-cols-2 gap-4">
            {props.images.map((image) => (
                <ExportedImage
                  key={image}
                  alt=""
                  className="w-full rounded-lg object-cover"
                  src={image}
                  width={370}
                  height={520}
                />
              ),
            )}
          </div>
        )
      )}
    </div>
  );
}
