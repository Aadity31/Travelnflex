import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRightIcon,
  GlobeAltIcon,
  SparklesIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  GlobeAmericasIcon,
  HandRaisedIcon,
  ShieldCheckIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

// ============================================================================
// METADATA - SEO optimization for the About page
// ============================================================================
export const metadata: Metadata = {
  title: 'About Us | TravelnFlex – Explore India Authentically',
  description:
    'Discover spiritual, cultural, and nature-based travel experiences across India. Trusted local partnerships since 2012.',
  openGraph: {
    title: 'About Us | TravelnFlex – India Travel Experts',
    description:
      'Curated journeys across Uttarakhand, Himachal, Rajasthan, Kerala, and more with trusted local experts.',
    type: 'website',
  },
};

// ============================================================================
// CONSTANTS
// ============================================================================
const HERO_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCwWQWzNIXXXUXw2F9Wr5qKHX9eLCyQgEgikG9AKKFMVGEaBK7jQKsYKIvaZHgcgzTbPm2MxPRD4JORIAJ1XBxu8kGNA1VjfYt5XXwCH2A2k7A7G5EQb0KyUQDaU5YA3BN2WKm5A9n77O7bRt1Bfvsa4orqFtMeXq-uT1RNVAQS1RmtgpcL7xmFArJhEHyJUzaTSgH1ywSbjir03JHsBkfy9IHy3XNmpyN2f2IrCoz-LW2Ke0fXmd8X9ZokjQzEQLuhmnJuhg8eqDQb';

const STORY_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC0K6axucs470J3Y1_RJTininId0ktyrG7WgD-P-nYNnxqz8jtA4PnBrkTr3hjRm3Zie1JU2lEIQ2jyO8I1UlPnBa0UCnlCN-6WZeNC_AD22VLnkOG5zS2p-dhUwTiljKb6u_qGxZwAJHMNCyzyGAOp6lSu3uds2l4J8KaoRK1RE5k_s-LMZXdIt6qfcoklzV501gfIbWxK8U1UIu-VrCVb2R55Z2hD_5zSk-QUAeV_zmOnpD6vFRpWJ_5iFEaTK4jltfFMudua1Xh8';

type HeroIconComponent = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
    title?: string;
    titleId?: string;
  } & React.RefAttributes<SVGSVGElement>
>;

interface Feature {
  Icon: HeroIconComponent;
  title: string;
  description: string;
  colorClass: 'primary' | 'success' | 'accent';
}

const FEATURES: Feature[] = [
  {
    Icon: SparklesIcon,
    title: 'Spiritual Focus',
    description:
      'Curated trips designed to nourish the soul, featuring meditative retreats and visits to sacred historical sites.',
    colorClass: 'primary',
  },
  {
    Icon: UserGroupIcon,
    title: 'Local Experts Only',
    description:
      'We work directly with community leaders to ensure your experience is ethical, authentic, and truly immersive.',
    colorClass: 'success',
  },
  {
    Icon: BuildingOfficeIcon,
    title: 'Direct Hotel Bookings',
    description:
      'No middleman fees. We book directly with our boutique hotel partners to guarantee the best rates and personalized service.',
    colorClass: 'accent',
  },
] as const;

interface Value {
  Icon: HeroIconComponent;
  title: string;
  description: string;
}

const VALUES: Value[] = [
  {
    Icon: GlobeAmericasIcon,
    title: 'Sustainable Bharat',
    description:
      'We promote eco-conscious travel across India, respecting local ecosystems and traditional practices.',
  },
  {
    Icon: HandRaisedIcon,
    title: 'Empowering Communities',
    description:
      'We work directly with Indian artisans, homestays, and local families to keep tourism income within communities.',
  },
  {
    Icon: ShieldCheckIcon,
    title: 'Uncompromising Trust',
    description:
      'Safety and integrity are our bedrocks. Every partner agency is vetted through a rigorous 20-point quality check.',
  },
  {
    Icon: BookOpenIcon,
    title: 'Authentic Storytelling',
    description:
      "We don't just visit monuments; we hear the stories behind them from the people who live there.",
  },
] as const;

const CORE_PRINCIPLES = [
  'Radical Transparency',
  'Sustainable Stewardship',
  'Cultural Celebration',
] as const;

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

interface CTAButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  onClick?: () => void;
}

const CTAButton: React.FC<CTAButtonProps> = ({
  children,
  href,
  variant = 'primary',
  className = '',
  onClick,
}) => {
  const baseStyles =
    'px-8 py-4 rounded-xl font-bold transition-all duration-300 inline-flex items-center gap-2 group relative overflow-hidden';

  const variantStyles = {
    primary:
      'bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    secondary:
      'bg-white text-primary hover:bg-gray-50 shadow-lg hover:shadow-xl ',
    outline:
      'bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">
  {children}
</span>

      {variant === 'primary' && (
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={combinedClassName}>
      {content}
    </button>
  );
};

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, className = '', id }) => (
  <section id={id} className={`py-20 ${className}`}>
    <div className="max-w-7xl mx-auto px-6 lg:px-10">{children}</div>
  </section>
);

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  showDecorator?: boolean;
  centered?: boolean;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  showDecorator = false,
  centered = false,
}) => (
  <div className={`space-y-4 mb-16 ${centered ? 'text-center max-w-3xl mx-auto' : ''}`}>
    {showDecorator && (
      <div className="inline-flex items-center justify-center size-12 bg-primary/10 rounded-2xl mb-4 animate-pulse">
        <div className="size-6 bg-primary/20 rounded-lg" />
      </div>
    )}
    <h2 className="text-4xl lg:text-5xl font-extrabold text-[--foreground] leading-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="text-lg text-[--foreground-secondary] leading-relaxed max-w-2xl">
        {subtitle}
      </p>
    )}
  </div>
);

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

const HeroSection: React.FC = () => (
  <section className="relative w-full" aria-labelledby="hero-heading">
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
      <div
        className="relative overflow-hidden rounded-3xl h-112 lg:h-136 flex items-center justify-center text-center px-4 bg-cover bg-center group"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url("${HERO_IMAGE_URL}")`,
        }}
        role="img"
        aria-label="Scenic mountain landscape representing our travel experiences"
      >
        {/* Animated overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="max-w-4xl space-y-8 relative z-10 animate-[fadeIn_1s_ease-out]">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white/90 text-sm font-medium border border-white/20">
            <SparklesIcon className="size-4" />
            <span>Trusted Since 2012</span>
          </div>

          <h1
            id="hero-heading"
            className="text-white text-3xl lg:text-5xl font-black leading-tight tracking-tight"
          >
            Crafting Meaningful Journeys Across India
          </h1>

          <p className="text-white/90 text-lg lg:text-xl font-medium leading-relaxed max-w-3xl mx-auto">
            Discover India through authentic spiritual, cultural, and nature experiences curated by trusted local experts.
          </p>

          <div className="pt-4 flex flex-wrap gap-4 justify-center">
            <CTAButton href="/destinations">
              Start Your Adventure
              <ArrowRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
            </CTAButton>
            <CTAButton href="/activities" variant="outline">
              View Packages
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const StorySection: React.FC = () => (
  <SectionWrapper className="overflow-hidden bg-linear-to-b from-white to-gray-50" id="our-story">
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="inline-block">
            <span className="text-primary font-bold tracking-widest uppercase text-sm bg-primary/10 px-4 py-2 rounded-full">
              Where it began
            </span>
          </div>

          <h2 className="text-3xl lg:text-5xl font-extrabold text-[--foreground] leading-tight">
            Crafting meaningful
            <span className="block text-primary mt-2">paths since 2012</span>
          </h2>

          <div className="space-y-4">
            <p className="text-[--foreground-secondary] text-lg leading-relaxed">
              Our journey started with a simple observation: travel had become a commodity, focused on
              checkboxes rather than connections. We wanted to build a bridge back to authenticity.
            </p>
            <p className="text-[--foreground-secondary] text-lg leading-relaxed">
              What began as a small initiative in Uttarakhand has grown into a trusted India-wide network of local guides, boutique stays, and spiritual retreat partners.
            </p>
          </div>
        </div>

        {/* Enhanced stat card */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-linear-to-r from-primary to-primary-dark rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-300" />
          <div className="relative flex items-center gap-6 p-6 bg-white rounded-2xl">
            <div className="size-12 rounded-2xl bg-linear-to-br from-primary to-primary-dark flex items-center justify-center text-white shrink-0 shadow-xl">
              <GlobeAltIcon className="size-6" />
            </div>
            <div>
              <h4 className="font-bold text-xl text-[--foreground]">India-Wide Presence</h4>
              <p className="text-sm text-[--foreground-muted]">
                Partnering with verified local agencies across 20+ Indian states.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced image with better hover effect */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-linear-to-br from-primary/20 to-orange-500/20 rounded-3xl transform rotate-3 group-hover:rotate-1 transition-transform duration-500" />
        <div className="relative rounded-3xl overflow-hidden aspect-4/5 shadow-2xl">
          <Image
            alt="Travelers connecting with local artisans in a traditional marketplace"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            src={STORY_IMAGE_URL}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={false}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>
    </div>
  </SectionWrapper>
);

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
  const { Icon, title, description, colorClass } = feature;

  const colorClasses = {
  primary: {
    bg: 'bg-primary/10',
    text: 'text-primary',
  },
  success: {
    bg: 'bg-primary/10',
    text: 'text-primary',
  },
  accent: {
    bg: 'bg-primary/10',
    text: 'text-primary',
  },
};


  const colors = colorClasses[colorClass];
  const delay = index * 100;

  return (
    <article 
      className="group relative animate-[fadeInUp_0.6s_ease-out_both]"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient border effect */}
      <div className={`absolute -inset-0.5 bg-primary text-white flex items-center justify-center rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-500`} />

      {/* Card content */}
      <div className="relative bg-white p-6 rounded-3xl border-2 border-gray-100 hover:border-transparent transition-all duration-500 h-full">
        {/* Icon container with gradient */}
        <div className="relative mb-6">
          <div className={`size-16 rounded-2xl bg-linear-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-500`}>
            <Icon className="size-8" />
          </div>
          {/* Decorative circle */}
          <div className={`absolute -top-2 -right-2 size-6 ${colors.bg} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        </div>

        <h3 className="text-2xl font-bold mb-4 text-[--foreground] group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        <p className="text-[--foreground-secondary] leading-relaxed">
          {description}
        </p>

        {/* Hover indicator */}
        <div className="mt-6 flex items-center gap-2 text-primary font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="text-sm">Learn more</span>
          <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </article>
  );
};

const FeaturesSection: React.FC = () => (
  <SectionWrapper className="py-16 lg:py-20 bg-linear-to-b from-gray-50 to-white" id="why-choose-us">
    <SectionHeading
      title="Why Travelers Choose Us"
      subtitle="We prioritize depth over distance, ensuring every itinerary is more than just a trip—it's a transformation."
      showDecorator
      centered
    />
    <div className="grid md:grid-cols-3 gap-8">
      {FEATURES.map((feature, index) => (
        <FeatureCard key={feature.title} feature={feature} index={index} />
      ))}
    </div>
  </SectionWrapper>
);

interface ValueCardProps {
  value: Value;
  index: number;
}

const ValueCard: React.FC<ValueCardProps> = ({ value, index }) => {
  const { Icon, title, description } = value;
  const delay = index * 100;

  return (
    <article 
  className="group relative animate-[fadeInUp_0.6s_ease-out_both]"
  style={{ animationDelay: `${delay}ms` }}
>
  <div className="relative p-6 rounded-2xl bg-white border border-gray-200 hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full">
    
    <div className="relative flex mb-6 w-fit">
      <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
      
      <div className="relative size-12 bg-linear-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-300">
        <Icon className="size-6 text-white" />
      </div>
    </div>

    <h4 className="text-lg font-bold text-[--foreground] mb-2 group-hover:text-primary transition-colors duration-300">
      {title}
    </h4>

    <p className="text-sm text-[--foreground-secondary] leading-relaxed">
      {description}
    </p>
  </div>

</article>

  );
};

const ValuesSection: React.FC = () => (
  <SectionWrapper className="py-16 lg:py-20 bg-linear-to-b from-white to-gray-50" id="our-values">
    <div className="flex flex-col lg:flex-row gap-16 items-start">
      {/* Sticky sidebar with enhanced styling */}
      <aside className="lg:w-1/3 lg:sticky lg:top-32">
        <div className="space-y-6">
          <div className="inline-block">
            <div className="size-12 bg-linear-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mb-6">
              <CheckCircleIcon className="size-6 text-white" />
            </div>
          </div>

          <h2 className="text-4xl lg:text-5xl font-extrabold text-[--foreground] leading-tight">
            Our Values
          </h2>

          <p className="text-lg text-[--foreground-secondary] leading-relaxed">
            These principles guide every decision we make, from the destinations we choose to the
            partners we collaborate with.
          </p>

          <div className="pt-4 space-y-4">
            {CORE_PRINCIPLES.map((principle, index) => {
              const delay = index * 100;
              return (
                <div
                  key={principle}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-primary/50 transition-all duration-300 group animate-[fadeInLeft_0.6s_ease-out_both]"
                  style={{ animationDelay: `${delay}ms` }}
                >
                  <div className="size-10 bg-linear-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircleIcon className="size-6 text-white" />
                  </div>
                  <span className="font-bold text-[--foreground] group-hover:text-primary transition-colors duration-300">
                    {principle}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Values grid */}
      <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6">
        {VALUES.map((value, index) => (
          <ValueCard key={value.title} value={value} index={index} />
        ))}
      </div>
    </div>
  </SectionWrapper>
);

const CTASection: React.FC = () => (
  <SectionWrapper id="get-started">
    <div className="relative bg-linear-to-br from-primary to-primary-dark rounded-3xl p-10 lg:p-14
 text-center overflow-hidden shadow-2xl group">
      {/* Animated background patterns */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-linear(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating shapes */}
      <div className="absolute top-10 left-10 size-24 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 size-28 bg-white/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/30">
          <SparklesIcon className="size-4" />
          <span>Start Your Journey Today</span>
        </div>

        <h2 className="text-white text-3xl lg:text-5xl font-black tracking-tight leading-tight">
          Ready to start your own story?
        </h2>

        <p className="text-white/90 text-lg lg:text-xl font-medium leading-relaxed">
          Let&apos;s design a journey that resonates with your soul. Your next adventure is just a
          consultation away.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <CTAButton href="/destinations" variant="secondary" className="text-lg px-10">
            Plan My Trip
            <ArrowRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
          </CTAButton>
          <CTAButton href="/activities" variant="outline" className="text-lg px-10">
            View Packages
          </CTAButton>
        </div>
      </div>
    </div>
  </SectionWrapper>
);

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white text-[--text-on-dark] min-h-screen">
      <main>
        <HeroSection />
        <StorySection />
        <FeaturesSection />
        <ValuesSection />
        <CTASection />
      </main>
    </div>
  );
};

export default AboutPage;