# NamibraPay Landing Page

A modern, responsive landing page for NamibraPay - a fintech platform providing seamless payment solutions across Africa. Built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- **Modern Design**: Clean, professional interface with smooth animations
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Performance Optimized**: Built with Next.js 16 for optimal loading speeds
- **Smooth Animations**: Powered by Framer Motion for engaging user interactions
- **TypeScript**: Full type safety and enhanced developer experience
- **Component Architecture**: Modular, reusable components for maintainability

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utilities**: [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/
│   ├── layout/            # Layout components
│   │   └── Navbar.tsx     # Navigation header
│   ├── sections/          # Page sections
│   │   ├── Hero.tsx       # Hero section with main CTA
│   │   ├── Features.tsx   # Features showcase grid
│   │   ├── Partners.tsx   # Partner logos display
│   │   ├── UseCases.tsx   # Use cases section
│   │   └── CTA.tsx        # Call-to-action section
│   └── ui/                # Reusable UI components
│       ├── Logo.tsx       # Brand logo component
│       └── SectionBadge.tsx # Section identifier badges
└── lib/
    └── utils.ts           # Utility functions
```

## Design System

### Brand Colors
- **Navy**: Primary brand color for headings and important elements
- **Teal**: Secondary color for CTAs and highlights
- **Mint**: Accent color for subtle highlights
- **Pink**: Accent color for decorative elements
- **Peach**: Warm accent for visual variety
- **Lavender**: Soft accent for backgrounds

### Typography
- **Headings**: Custom brand font family
- **Body**: System font stack for optimal readability

### Components
- **Hero Section**: Main landing area with value proposition
- **Features Grid**: Showcases key platform capabilities
- **Partners**: Displays trusted payment partners
- **Use Cases**: Real-world application scenarios
- **CTA Section**: Final conversion opportunity

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd namibrapay-lpg
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Key Sections

### Hero Section
- Compelling headline and value proposition
- Primary and secondary call-to-action buttons
- Animated background elements
- Responsive design for all devices

### Features Grid
- **Developer-First APIs**: RESTful, GraphQL, and gRPC support
- **Fortified Security**: PCI-DSS Level 1 compliance
- **Atomic Settlement**: Near-instant cross-currency settlements
- **Kinetic Dashboard**: Real-time analytics and monitoring

### Partners Integration
- Mobile money providers (MTN, Telecel, AirtelTigo)
- Payment platforms (Nsano, Zeepay)
- Optimized logo display with proper aspect ratios

### Use Cases
- E-commerce integration
- Mobile app payments
- Business-to-business transactions
- Cross-border payments

## Styling Guidelines

### Tailwind Configuration
- Custom color palette matching brand identity
- Responsive breakpoints for mobile-first design
- Custom font families for brand consistency

### Animation Patterns
- Entrance animations using Framer Motion
- Hover effects for interactive elements
- Staggered animations for list items
- Smooth transitions between states

## Development Guidelines

### Component Structure
- Use TypeScript for all components
- Implement proper prop interfaces
- Follow React best practices
- Maintain consistent naming conventions

### Performance Optimization
- Next.js Image component for optimized images
- Lazy loading for below-the-fold content
- Minimal bundle size with tree shaking
- Efficient animation performance

### Code Quality
- ESLint configuration for consistent code style
- TypeScript strict mode enabled
- Component-based architecture
- Reusable utility functions

## Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet**: Enhanced layout for medium screens
- **Desktop**: Full-featured experience for large screens
- **Touch Friendly**: Appropriate touch targets and interactions

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure build settings (auto-detected)
3. Deploy with automatic CI/CD

### Other Platforms
- **Netlify**: Static site deployment
- **AWS Amplify**: Full-stack deployment
- **Docker**: Containerized deployment

# Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary to NamibraPay.

## Support

For questions or support, please contact the development team.

---

Built with LOVE for NamibraPay