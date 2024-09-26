import Image from 'next/image';
import SearchBar from './SearchBar';
import HeroCarousel from './HeroCarousel';

const Hero = () => {
  return (
    <>
      <section className="px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Smart shopping starts here
              <Image 
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={17}
                height={17}
              />
            </p>

            <h1 className="head-text">
              Unleash the power of
              <span className="head-text"> Price<span className="text-primary">Eye</span></span>
            </h1>

            <p className="mt-6">
              Powerful, self-serve product and growth analytics to help you convert, 
              engage, and retain more.
            </p>
            <SearchBar />
          </div>
          <HeroCarousel/>
        </div>
      </section>
    </>
  );
};

export default Hero;