import { useState, useEffect } from "react";
import styles from "./Carousel.module.css";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=600&fit=crop&q=80",
    title: "Summer Sale",
    subtitle: "Up to 50% OFF on all products"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=600&fit=crop&q=80",
    title: "New Arrivals",
    subtitle: "Discover the latest fashion trends"
  },
 {
  id: 3,
  image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&h=600&fit=crop&q=80",
  title: "Electronics Deal",
  subtitle: "Best prices on gadgets & tech"
},

  {
    id: 4,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=600&fit=crop&q=80",
    title: "Fashion Week",
    subtitle: "Exclusive designer collections"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&h=600&fit=crop&q=80",
    title: "Mega Deals",
    subtitle: "Limited time offers on everything"
  }
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className={styles.carousel}>
      {/* Left Arrow */}
      <button 
        className={`${styles.arrow} ${styles.leftArrow}`}
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        &lt;
      </button>

      {/* Slides */}
      <div className={styles.slideContainer}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.slide} ${
              index === current ? styles.active : ""
            }`}
          >
            <img src={slide.image} alt={slide.title} />
            <div className={styles.overlay}>
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
              <button className={styles.shopBtn}>Shop Now</button>
            </div>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button 
        className={`${styles.arrow} ${styles.rightArrow}`}
        onClick={nextSlide}
        aria-label="Next slide"
      >
        &gt;
      </button>

      {/* Dots Navigation */}
      <div className={styles.dots}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === current ? styles.activeDot : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
