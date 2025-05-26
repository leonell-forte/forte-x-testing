import useEmblaCarousel, { EmblaViewportRefType } from "embla-carousel-react";
import React, {
  HTMLAttributes,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import DotPagination from "./dot-pagination";

const Container = ({ children }: PropsWithChildren) => {
  return <CarouselProvider>{children}</CarouselProvider>;
};

export function Carousel({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <Container>
      <div className="overflow-hidden" {...props}>
        {children}
      </div>
    </Container>
  );
}

export const CarouselSlides = ({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => {
  const { emblaRef } = useCarousel();

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-10" {...props}>
        {children}
      </div>
    </div>
  );
};

export const CarouselSlide = ({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => {
  return (
    <div className="min-w-full" {...props}>
      {children}
    </div>
  );
};

export const CarouselPagination = ({ total }: { total: number }) => {
  const { scrollTo, selectedIndex } = useCarousel();

  return (
    <DotPagination total={total} page={selectedIndex} onPageChange={scrollTo} />
  );
};

type CarouselContextType = {
  emblaRef?: EmblaViewportRefType;
  scrollTo: (index: number) => void;
  selectedIndex: number;
};

export const CarouselContext = createContext<CarouselContextType>({
  scrollTo: () => {},
  emblaRef: undefined,
  selectedIndex: 1,
});

export const CarouselProvider = ({
  children,
  options,
}: {
  children: React.ReactNode;
  options?: Parameters<typeof useEmblaCarousel>[0];
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index - 1),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap() + 1);
    emblaApi.on("select", onSelect);
    onSelect(); // Initial sync
  }, [emblaApi]);

  return (
    <CarouselContext.Provider value={{ emblaRef, scrollTo, selectedIndex }}>
      {children}
    </CarouselContext.Provider>
  );
};

export const useCarousel = () => {
  const context = useContext(CarouselContext);

  if (!context)
    throw new Error("useCarousel must be used within a CarouselProvider");

  return context;
};
