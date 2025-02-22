import React from 'react';

// export const siteConfig = {
//   name: 'hov - links',
//   description: '',
//   // ogImage: 'https://linknode.vercel.app/og-image.png',
//   url: '',
// };

export default function Home() {
  return (
    <main className="relative h-screen px-2 md:container lg:grid-cols-3 lg:px-0">
      {/* <section className="flex h-screen flex-col items-center justify-center gap-6 pb-6 lg:col-span-2 lg:px-20 lg:pb-0"></section> */}

      <section className="relative overflow-hidden border-b">
        <div className="max-w-screen-xl px-8 pt-24 mx-auto md:px-12 lg:px-32">
          <div className="text-center">
            <span className="font-mono text-xs font-medium tracking-tight text-blue-600 uppercase">
              Your next FinTech startup
            </span>
            <h1 className="mt-8 text-4xl font-semibold tracking-tighter text-blue-950 md:text-6xl">
              Innovating financial
              <span className="md:block">solutions for tomorrow</span>
            </h1>
            <p className="max-w-sm mt-4 text-base text-gray-700 lg:mx-auto lg:text-base">
              Revolutionizing the financial landscape with cutting-edge
              technology and expertise
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
              <a
                href=""
                className="flex items-center justify-center h-10 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600 hover:to-indigo-700 shadow-button shadow-blue-600/50 focus:ring-2 focus:ring-blue-950 focus:ring-offset-2 ring-offset-gray-200 hover:shadow-none"
              >
                Buy Alfred
              </a>
              <a
                href="/"
                className="flex items-center justify-center h-10 px-4 py-2 text-sm font-semibold text-gray-500 transition-all duration-200 bg-white border border-gray-300 rounded-full hover:text-blue-700 focus:ring-2 shadow-button shadow-gray-500/5 focus:ring-blue-950 focus:ring-offset-2 ring-offset-gray-200 hover:shadow-none"
              >
                See all pages
              </a>
            </div>
          </div>
          <img
            alt="#_"
            className="w-full mt-24 -mb-24 scale-150 md:mt-48 md:-mb-64 drop-shadow-box"
            src="/cards.svg"
          />
        </div>
      </section>

      <FinancialFeatures />
    </main>
  );
}

const features = [
  {
    id: 1,
    icon: (
      <svg
        className="size-4 icon icon-tabler icon-tabler-send"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M10 14l11 -11"></path>
        <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
      </svg>
    ),
    title: 'ACH TRANSACTIONS',
    description:
      'Initiate ACH credits and debits, verify account numbers through pre-notifications, and securely store frequently accessed account details.',
  },
  {
    id: 2,
    icon: (
      <svg
        className="size-4 icon icon-tabler icon-tabler-wallet"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12"></path>
        <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4"></path>
      </svg>
    ),
    title: 'BANKING SOLUTIONS',
    description:
      'Flexible account structures. Unlimited account numbers. Extended FDIC coverage.',
  },
  {
    id: 3,
    icon: (
      <svg
        className="size-4 icon icon-tabler icon-tabler-credit-card"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"></path>
        <path d="M3 10l18 0"></path>
        <path d="M7 15l.01 0"></path>
        <path d="M11 15l2 0"></path>
      </svg>
    ),
    title: 'CUSTOM CARDS',
    description:
      'Issue personalized cards for businesses or consumers with the option to approve authorizations in real-time or configure limits programmatically.',
  },
  {
    id: 4,
    icon: (
      <svg
        className="size-4 icon icon-tabler icon-tabler-checkup-list"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
        <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
        <path d="M9 14h.01"></path>
        <path d="M9 17h.01"></path>
        <path d="M12 16l1 1l3 -3"></path>
      </svg>
    ),
    title: 'CHECK HANDLING',
    description:
      'Send customized checks worldwide with a single API call or deposit checks through API or the user dashboard.',
  },
  {
    id: 5,
    icon: (
      <svg
        className="size-4 icon icon-tabler icon-tabler-world"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
        <path d="M3.6 9h16.8"></path>
        <path d="M3.6 15h16.8"></path>
        <path d="M11.5 3a17 17 0 0 0 0 18"></path>
        <path d="M12.5 3a17 17 0 0 1 0 18"></path>
      </svg>
    ),
    title: 'WIRE TRANSFERS',
    description:
      'Experience the original instant money transfer method. Send funds to any location at any time Fedwire is operational.',
  },
  {
    id: 6,
    icon: (
      <svg
        className="size-4 icon icon-tabler icon-tabler-transfer"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M20 10h-16l5.5 -6"></path>
        <path d="M4 14h16l-5.5 6"></path>
      </svg>
    ),
    title: 'REAL-TIME FUND TRANSFERS',
    description:
      'Effortlessly transfer money to accounts at most major banks within seconds, eliminating the need for multi-day waits.',
  },
  {
    id: 7,
    icon: (
      <svg
        className="size-4 icon icon-tabler icon-tabler-square-rounded-arrow-right"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 16l4 -4l-4 -4"></path>
        <path d="M8 12h8"></path>
        <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
      </svg>
    ),
    title: 'FEDNOW SERVICES',
    description:
      "Utilize the Federal Reserve's latest payment system for instantaneous 24/7/365 money transfers through participating banks.",
  },
  {
    id: 7,
    icon: (
      <svg
        className="size-4 icon icon-tabler icon-tabler-lifebuoy"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
        <path d="M15 15l3.35 3.35"></path> <path d="M9 15l-3.35 3.35"></path>
        <path d="M5.65 5.65l3.35 3.35"></path>
        <path d="M18.35 5.65l-3.35 3.35"></path>
      </svg>
    ),
    title: 'CUSTOMER SUPPORT',
    description:
      'Dedicated assistance for all your queries and concerns. Reach out to our customer support team 24/7 for prompt solutions and personalized guidance.',
  },
];
const FinancialFeatures = () => {
  return (
    <div className="relative max-w-screen-xl px-8 py-24 mx-auto md:px-12 lg:px-32">
      <div className="max-w-2xl">
        <span className="font-mono text-xs font-medium tracking-tight text-blue-600 uppercase">
          important features
        </span>
        <p className="mt-8 text-4xl font-semibold tracking-tighter text-blue-950">
          Comprehensive suite of financial
          <span className="md:block md:text-transparent md:bg-clip-text md:bg-gradient-to-r from-blue-500 to-indigo-600 py-2">
            services and solutions for your needs
          </span>
        </p>
        <p className="max-w-sm mt-4 text-base text-gray-700 lg:text-base">
          Explore a wide range of financial tools, features, and support for
          your financial goals and questions.
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-10">
          <a
            href="https://lexingtonthemes.lemonsqueezy.com/checkout/buy/95522c10-eed2-4620-84ab-5cbd34efc225"
            className="flex items-center justify-center h-10 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600 hover:to-indigo-700 shadow-button shadow-blue-600/50 focus:ring-2 focus:ring-blue-950 focus:ring-offset-2 ring-offset-gray-200 hover:shadow-none"
          >
            Buy Alfred
          </a>
          <a
            href="/system/overview"
            className="flex items-center justify-center h-10 px-4 py-2 text-sm font-semibold text-gray-500 transition-all duration-200 bg-white border border-gray-300 rounded-full hover:text-blue-700 focus:ring-2 shadow-button shadow-gray-500/5 focus:ring-blue-950 focus:ring-offset-2 ring-offset-gray-200 hover:shadow-none"
          >
            See all pages
          </a>
        </div>
      </div>

      <div className="relative z-10 grid gap-px mt-12 overflow-hidden bg-gray-200 rounded-xl shadow-box shadow-gray-500/30 sm:grid-cols-2 xl:grid-cols-4">
        {features.map((feature: any, index: number) => (
          <div
            key={index}
            className="group flex h-full flex-col bg-white px-5 pb-[30px] pt-6 text-sm transition-all sm:min-h-[250px] md:min-h-[200px] xl:min-h-[250px] hover:bg-gradient-to-b from-blue-500 to-indigo-600 duration-200"
          >
            <div className="inline-flex items-center text-blue-700 group-hover:text-white">
              {feature.icon}
            </div>
            <div className="mt-8 font-mono text-base font-medium tracking-tighter uppercase group-hover:text-white lg:mt-24">
              {feature.title}
            </div>
            <div className="mt-2 text-sm text-gray-700 group-hover:text-white">
              {feature.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
