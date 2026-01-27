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
  title: 'About Us | Devbhoomi Darshan',
  description:
    'Learn about our journey connecting curious travelers with soulful experiences through deep local expertise and ethical partnerships since 2012.',
  openGraph: {
    title: 'About Us | Devbhoomi Darshan',
    description:
      'Connecting curious travelers with soulful experiences through deep local expertise.',
    type: 'website',
  },
};

// ============================================================================
// CONSTANTS - Extracted for maintainability and reusability
// ============================================================================
const HERO_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCwWQWzNIXXXUXw2F9Wr5qKHX9eLCyQgEgikG9AKKFMVGEaBK7jQKsYKIvaZHgcgzTbPm2MxPRD4JORIAJ1XBxu8kGNA1VjfYt5XXwCH2A2k7A7G5EQb0KyUQDaU5YA3BN2WKm5A9n77O7bRt1Bfvsa4orqFtMeXq-uT1RNVAQS1RmtgpcL7xmFArJhEHyJUzaTSgH1ywSbjir03JHsBkfy9IHy3XNmpyN2f2IrCoz-LW2Ke0fXmd8X9ZokjQzEQLuhmnJuhg8eqDQb';

const STORY_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC0K6axucs470J3Y1_RJTininId0ktyrG7WgD-P-nYNnxqz8jtA4PnBrkTr3hjRm3Zie1JU2lEIQ2jyO8I1UlPnBa0UCnlCN-6WZeNC_AD22VLnkOG5zS2p-dhUwTiljKb6u_qGxZwAJHMNCyzyGAOp6lSu3uds2l4J8KaoRK1RE5k_s-LMZXdIt6qfcoklzV501gfIbWxK8U1UIu-VrCVb2R55Z2hD_5zSk-QUAeV_zmOnpD6vFRpWJ_5iFEaTK4jltfFMudua1Xh8';

// Type for Heroicon components
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
  colorClass: 'primary' | 'success';
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
    colorClass: 'primary',
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
    title: 'Planet First',
    description:
      'We prioritize eco-friendly accommodations and carbon-neutral transit options for every planned journey.',
  },
  {
    Icon: HandRaisedIcon,
    title: 'Empowering Communities',
    description:
      'By booking direct, we ensure that your travel spend stays within the local economy and supports small businesses.',
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
// REUSABLE COMPONENTS - Extracted for better organization and reusability
// ============================================================================

/**
 * Primary CTA button with consistent styling using theme variables
 */
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
    'px-8 py-4 rounded-lg font-bold transition-all inline-flex items-center gap-2';

  const variantStyles = {
    primary:
      'bg-[var(--color-primary)] hover:bg-white hover:text-[var(--color-primary)] text-white',
    secondary:
      'bg-white text-[var(--color-primary)] hover:bg-[var(--background-secondary)] transform hover:-translate-y-1 shadow-[var(--shadow-xl)]',
    outline:
      'bg-[var(--color-primary-dark)]/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/10',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={combinedClassName}>
      {children}
    </button>
  );
};

/**
 * Section wrapper with consistent padding and max-width
 */
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

/**
 * Section heading with optional subtitle and decorative line
 */
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
  <div className={`space-y-4 ${centered ? 'text-center max-w-2xl mx-auto mb-16' : ''}`}>
    <h2 className="text-3xl lg:text-4xl font-extrabold text-[var(--foreground)]">{title}</h2>
    {showDecorator && (
      <div className="h-1.5 w-20 bg-[var(--color-primary)] mx-auto rounded-full" />
    )}
    {subtitle && <p className="text-[var(--foreground-secondary)]">{subtitle}</p>}
  </div>
);

// ============================================================================
// SECTION COMPONENTS - Each section as a separate component for clarity
// ============================================================================

/**
 * Hero section with background image and CTA
 */
const HeroSection: React.FC = () => (
  <section className="relative w-full" aria-labelledby="hero-heading">
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
      <div
        className="relative overflow-hidden rounded-[var(--radius-xl)] h-[520px] lg:h-[600px] flex items-center justify-center text-center px-4 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url("${HERO_IMAGE_URL}")`,
        }}
        role="img"
        aria-label="Scenic mountain landscape representing our travel experiences"
      >
        <div className="max-w-3xl space-y-6">
          <h1
            id="hero-heading"
            className="text-white text-5xl lg:text-7xl font-black leading-tight tracking-tight"
          >
            About Our Journey
          </h1>
          <p className="text-white/90 text-lg lg:text-xl font-medium leading-relaxed">
            Connecting curious travelers with soulful experiences through deep local expertise and
            direct, ethical partnerships.
          </p>
          <div className="pt-4">
            <CTAButton href="/destinations" className="mx-auto">
              Start Your Adventure
              <ArrowRightIcon className="w-5 h-5" aria-hidden="true" />
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/**
 * Our Story section with image and text content
 */
const StorySection: React.FC = () => (
  <SectionWrapper className="overflow-hidden" id="our-story">
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-sm">
            Where it began
          </h3>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-[var(--foreground)] leading-tight">
            Crafting meaningful <br /> paths since 2012.
          </h2>
          <p className="text-[var(--foreground-secondary)] text-lg leading-relaxed">
            Our journey started with a simple observation: travel had become a commodity, focused on
            checkboxes rather than connections. We wanted to build a bridge back to authenticity.
          </p>
          <p className="text-[var(--foreground-secondary)] text-lg leading-relaxed">
            From a small team of two backpackers in Nepal to a global network, our mission remains
            the same: to make travel transformative, accessible, and deeply respectful of local
            cultures.
          </p>
        </div>
        <div className="flex items-center gap-6 p-6 bg-[var(--background)] rounded-[var(--radius-xl)] border border-[var(--border-light)] shadow-[var(--shadow-sm)]">
          <div className="h-14 w-14 rounded-full bg-gradient-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-[var(--color-primary)]/20">
            <GlobeAltIcon className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h4 className="font-bold text-[var(--foreground)]">Global Reach, Local Depth</h4>
            <p className="text-sm text-[var(--foreground-muted)]">
              Partnering with over 200 local agencies worldwide.
            </p>
          </div>
        </div>
      </div>
      <div className="relative group">
        <div
          className="absolute -inset-4 bg-[var(--color-primary)]/10 rounded-[var(--radius-xl)] transform rotate-3 transition-transform group-hover:rotate-1"
          aria-hidden="true"
        />
        <div className="relative rounded-[var(--radius-xl)] overflow-hidden aspect-[4/5] shadow-[var(--shadow-xl)]">
          <Image
            alt="Travelers connecting with local artisans in a traditional marketplace"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={STORY_IMAGE_URL}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={false}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </SectionWrapper>
);

/**
 * Feature card component for the "Why Choose Us" section
 */
interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const { Icon, title, description, colorClass } = feature;

  const colorClasses = {
    primary: {
      bg: 'bg-[var(--color-primary)]/10',
      text: 'text-[var(--color-primary)]',
      hoverBg: 'group-hover:bg-[var(--color-primary)]',
    },
    success: {
      bg: 'bg-[var(--color-success)]/10',
      text: 'text-[var(--color-success)]',
      hoverBg: 'group-hover:bg-[var(--color-success)]',
    },
  };

  const colors = colorClasses[colorClass];

  return (
    <article className="bg-[var(--background)] p-8 rounded-[var(--radius-xl)] border border-[var(--border-light)] hover:shadow-[var(--shadow-xl)] transition-all duration-300 group">
      <div
        className={`w-16 h-16 rounded-[var(--radius-xl)] ${colors.bg} flex items-center justify-center ${colors.text} mb-6 transition-colors ${colors.hoverBg} group-hover:text-white`}
      >
        <Icon className="w-8 h-8" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-[var(--foreground)]">{title}</h3>
      <p className="text-[var(--foreground-secondary)] leading-relaxed">{description}</p>
    </article>
  );
};

/**
 * Why Choose Us section with feature cards
 */
const FeaturesSection: React.FC = () => (
  <SectionWrapper
    className="py-24 bg-[var(--background-secondary)]"
    id="why-choose-us"
  >
    <SectionHeading
      title="Why Travelers Choose Us"
      subtitle="We prioritize depth over distance, ensuring every itinerary is more than just a trip."
      showDecorator
      centered
    />
    <div className="grid md:grid-cols-3 gap-8" role="list">
      {FEATURES.map((feature) => (
        <FeatureCard key={feature.title} feature={feature} />
      ))}
    </div>
  </SectionWrapper>
);

/**
 * Value card component for the "Our Values" section
 */
interface ValueCardProps {
  value: Value;
}

const ValueCard: React.FC<ValueCardProps> = ({ value }) => {
  const { Icon, title, description } = value;

  return (
    <article className="space-y-4 p-8 rounded-[var(--radius-xl)] bg-[var(--background)] border border-[var(--border-light)]">
      <Icon className="w-10 h-10 text-[var(--color-primary)]" aria-hidden="true" />
      <h4 className="text-xl font-bold text-[var(--foreground)]">{title}</h4>
      <p className="text-[var(--foreground-secondary)]">{description}</p>
    </article>
  );
};

/**
 * Our Values section with sticky sidebar and value cards
 */
const ValuesSection: React.FC = () => (
  <SectionWrapper className="py-24" id="our-values">
    <div className="flex flex-col lg:flex-row gap-16 items-start">
      <aside className="lg:w-1/3 lg:sticky lg:top-32">
        <h2 className="text-4xl font-extrabold mb-6 text-[var(--foreground)]">Our Values</h2>
        <p className="text-[var(--foreground-secondary)] mb-8">
          These principles guide every decision we make, from the destinations we choose to the
          partners we collaborate with.
        </p>
        <ul className="space-y-4" aria-label="Core principles">
          {CORE_PRINCIPLES.map((principle) => (
            <li
              key={principle}
              className="flex items-center gap-4 text-[var(--color-primary)] font-bold"
            >
              <CheckCircleIcon className="w-6 h-6" aria-hidden="true" />
              <span>{principle}</span>
            </li>
          ))}
        </ul>
      </aside>
      <div className="lg:w-2/3 grid sm:grid-cols-2 gap-8" role="list">
        {VALUES.map((value) => (
          <ValueCard key={value.title} value={value} />
        ))}
      </div>
    </div>
  </SectionWrapper>
);

/**
 * Final CTA section with gradient background
 */
const CTASection: React.FC = () => (
  <SectionWrapper id="get-started">
    <div className="bg-gradient-primary rounded-[var(--radius-2xl)] p-12 lg:p-20 text-center relative overflow-hidden shadow-[var(--shadow-xl)]">
      {/* Abstract Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-2xl mx-auto space-y-8">
        <h2 className="text-white text-4xl lg:text-6xl font-black tracking-tight">
          Ready to start your own story?
        </h2>
        <p className="text-white/80 text-lg lg:text-xl font-medium">
          Let&apos;s design a journey that resonates with your soul. Your next adventure is just a
          consultation away.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <CTAButton href="/destinations" variant="secondary" className="text-lg px-10">
            Plan My Trip
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
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
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
