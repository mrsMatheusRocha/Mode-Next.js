# Styling Marketing and Auth Pages

## Styling in Next.js

So many ways to add styles in Next.js. Pretty much everything you can do in React + some conventions around things like CSS modules.

- CSS modules (who uses this anymore?)
- Global CSS (great for themes)
- Tailwind (just use this, trust me)
- CSS-in-JS (styled components, many component libs, styled jsx?)
- CSS preprocessers (again, why?)

For most people, to keep it easy for yourself, just use global CSS for your global stuff ofcource, and if you can, use tailwind. If you can't, use CSS modules for your pages and components. CSS-in-JS can get messy when it comes to the different rendering modes and runtimes, and environmnets. Not to mention potential peformance hits. Although, most component libs of yesterday use css-in-js. You'll just end up using `use-client` everywhere.

We're going to use tailwind because I value my time and sanity, but check out the [docs](https://nextjs.org/docs/app/building-your-application/styling) for other approaches!

## Pages

/(marketing)/page.tsx

```tsx
import Link from 'next/link'
import { Timestamp } from '../components/Timestamp'
import Button from '../components/ui/Button'

export default async function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Issue tracking <br className="hidden sm:block" />
              <span className="text-purple-600 dark:text-purple-400">
                simplified
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              A minimal and elegant issue tracking tool for modern teams. Manage
              your projects with ease.
            </p>
            <div className="mt-10">
              <Link href="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-dark-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              © <Timestamp /> Mode. Built for Next.js Fundamentals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
```

/(marketing)/layout.tsx

```tsx
import Link from 'next/link'
import { Timestamp } from '../components/Timestamp'
import Button from '../components/ui/Button'

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-base">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              Mode
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="/features"
                className="text-sm font-medium hover:text-purple-600"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium hover:text-purple-600"
              >
                Pricing
              </Link>
              <Link
                href="/faq"
                className="text-sm font-medium hover:text-purple-600"
              >
                FAQ
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/signin">
                <Button variant="outline">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-base">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Mode</h3>
              <p className="text-sm text-gray-600">
                A modern project management tool built with Next.js.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/features"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/docs"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/yourusername/mode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center">
            <p className="text-sm text-gray-600">
              &copy; <Timestamp /> Mode. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
```

/(marketing)/pricing/page.tsx

```tsx
import React from 'react'
import Link from 'next/link'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-white">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-400 dark:text-gray-300">
          Choose the plan that&apos;s right for you and your team
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Free Plan */}
        <PricingCard
          title="Free"
          price="$0"
          description="Perfect for individuals and small teams getting started."
          features={[
            { name: 'Up to 3 team members', included: true },
            { name: 'Unlimited issues', included: true },
            { name: 'Basic issue tracking', included: true },
            { name: 'Email support', included: true },
            { name: 'API access', included: false },
            { name: 'Custom fields', included: false },
            { name: 'Advanced integrations', included: false },
          ]}
          buttonText="Sign Up Free"
          buttonLink="/auth/signup"
        />

        {/* Pro Plan */}
        <PricingCard
          title="Pro"
          price="$10"
          period="per user / month"
          description="For growing teams that need more features and flexibility."
          features={[
            { name: 'Unlimited team members', included: true },
            { name: 'Unlimited issues', included: true },
            { name: 'Advanced issue tracking', included: true },
            { name: 'Priority support', included: true },
            { name: 'API access', included: true },
            { name: 'Custom fields', included: true },
            { name: 'Advanced integrations', included: false },
          ]}
          buttonText="Coming Soon"
          buttonLink="#"
          highlighted
          badge="Popular"
        />

        {/* Enterprise Plan */}
        <PricingCard
          title="Enterprise"
          price="Custom"
          description="For organizations that need advanced security and support."
          features={[
            { name: 'Unlimited team members', included: true },
            { name: 'Unlimited issues', included: true },
            { name: 'Advanced issue tracking', included: true },
            { name: 'Dedicated support', included: true },
            { name: 'API access', included: true },
            { name: 'Custom fields', included: true },
            { name: 'Advanced integrations', included: true },
          ]}
          buttonText="Contact Sales"
          buttonLink="mailto:sales@linearclone.com"
        />
      </div>

      <div className="max-w-3xl mx-auto mt-16 text-center bg-gray-800 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Need a custom solution?
        </h2>
        <p className="text-lg text-gray-400 dark:text-gray-300 mb-8">
          Contact our sales team to discuss your specific requirements.
        </p>
        <a
          href="mailto:sales@linearclone.com"
          className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-8 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700"
        >
          Contact Sales
        </a>
      </div>
    </div>
  )
}

interface PricingFeature {
  name: string
  included: boolean
}

interface PricingCardProps {
  title: string
  price: string
  period?: string
  description: string
  features: PricingFeature[]
  buttonText: string
  buttonLink: string
  highlighted?: boolean
  badge?: string
}

function PricingCard({
  title,
  price,
  period = 'per month',
  description,
  features,
  buttonText,
  buttonLink,
  highlighted = false,
  badge,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-lg p-6 ${
        highlighted
          ? 'bg-blue-900 border-2 border-blue-700 shadow-md relative'
          : 'bg-gray-800 border border-gray-700 shadow-sm'
      }`}
    >
      {badge && (
        <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          {badge}
        </div>
      )}
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold text-white">{price}</span>
        {price !== 'Custom' && (
          <span className="text-gray-400 dark:text-gray-300"> {period}</span>
        )}
      </div>
      <p className="text-gray-400 dark:text-gray-300 mb-6">{description}</p>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            {feature.included ? (
              <CheckCircle2 className="h-5 w-5 text-green-300 mr-2 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
            )}
            <span
              className={
                feature.included
                  ? 'text-white'
                  : 'text-gray-500 dark:text-gray-600'
              }
            >
              {feature.name}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href={buttonLink}
        className={`w-full inline-flex h-10 items-center justify-center rounded-md px-8 py-2 text-sm font-medium shadow transition-colors ${
          highlighted
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white'
        }`}
      >
        {buttonText}
      </Link>
    </div>
  )
}
```

/(marketing)/features/page.tsx

```tsx
import React from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-white">Features</h1>
        <p className="text-xl text-gray-400">
          Discover how Linear Clone can help you manage your projects more
          efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <FeatureCard
          title="Issue Tracking"
          description="Create, assign, and track issues with ease. Set priorities, due dates, and statuses to keep your team on track."
        />
        <FeatureCard
          title="Intuitive UI"
          description="A clean, modern interface that makes project management a breeze. No clutter, just what you need to get work done."
        />
        <FeatureCard
          title="Collaboration"
          description="Work together seamlessly. Comment on issues, mention team members, and keep everyone in the loop."
        />
        <FeatureCard
          title="Custom Workflows"
          description="Create workflows that match your team's process. Customize statuses, labels, and more."
        />
        <FeatureCard
          title="Real-time Updates"
          description="See changes as they happen. No need to refresh or wait for updates."
        />
        <FeatureCard
          title="Powerful Search"
          description="Find anything instantly with our powerful search. Filter by assignee, status, priority, and more."
        />
      </div>
    </div>
  )
}

function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

interface PlanCardProps {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  buttonLink: string
  highlighted?: boolean
}

function PlanCard({
  title,
  price,
  description,
  features,
  buttonText,
  buttonLink,
  highlighted = false,
}: PlanCardProps) {
  return (
    <div
      className={`rounded-lg p-6 ${
        highlighted
          ? 'bg-purple-900 border-2 border-purple-700 shadow-md'
          : 'bg-gray-800 border border-gray-700 shadow-sm'
      }`}
    >
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold text-white">{price}</span>
        {price !== 'Custom' && <span className="text-gray-400">/month</span>}
      </div>
      <p className="text-gray-400 mb-6">{description}</p>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-gray-400">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={buttonLink}
        className={`w-full inline-flex h-10 items-center justify-center rounded-md px-8 py-2 text-sm font-medium shadow transition-colors ${
          highlighted
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white'
        }`}
      >
        {buttonText}
      </Link>
    </div>
  )
}
```

/(marketing)/faq/page.tsx

```tsx
import React from 'react'

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-white">
      <h2 className="text-2xl font-bold mb-8 text-center text-white">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        <FAQItem
          question="What is Linear Clone?"
          answer="Linear Clone is a project management tool inspired by Linear. It helps teams organize, track, and manage their projects and issues in a simple and efficient way."
        />

        <FAQItem
          question="How do I create an account?"
          answer="You can create an account by clicking the 'Sign Up' button in the top navigation bar. You'll need to provide an email address and create a password."
        />

        <FAQItem
          question="Is it free to use?"
          answer="Yes, Linear Clone is completely free to use as it's an open-source project. You can even download the source code and host it yourself."
        />

        <FAQItem
          question="Can I contribute to the project?"
          answer={`Absolutely! Linear Clone is open-source and contributions are welcome. Check out our GitHub repository to get started.`}
        />

        <FAQItem
          question="How do I report bugs or request features?"
          answer="You can report bugs or request features by opening an issue on our GitHub repository. We appreciate your feedback and contributions!"
        />

        <FAQItem
          question="What technologies does Linear Clone use?"
          answer="Linear Clone is built with Next.js, TypeScript, Tailwind CSS, and uses a PostgreSQL database. It leverages the latest features of Next.js App Router for optimal performance."
        />
      </div>
    </div>
  )
}

interface FAQItemProps {
  question: string
  answer: string
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-2 text-white">{question}</h4>
      <p className="text-gray-400 dark:text-gray-300">{answer}</p>
    </div>
  )
}
```

/(auth)/signup/page.tsx

```tsx
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#121212]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Mode
        </h1>
        <h2 className="mt-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Create a new account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#1A1A1A] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 dark:border-dark-border-subtle">
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                href="/signin"
                className="font-medium text-gray-900 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

/(auth)/signin/page.tsx

```tsx
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#121212]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Mode
        </h1>
        <h2 className="mt-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#1A1A1A] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 dark:border-dark-border-subtle">
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-gray-900 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```
