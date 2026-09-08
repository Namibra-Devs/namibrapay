# NamibraPay Platform

> **Three-Tier Payment Operations Platform**  
> Next.js 16 · React 19 · TypeScript · Tailwind CSS 4

A comprehensive payment operations platform for Ghana's mobile money ecosystem, featuring three distinct dashboards for Platform Operations, Merchant Management, and Sub-Merchant Operations.

---

## Overview

NamibraPay is a **three-tier payment operations platform** designed for managing mobile money and payment infrastructure in Ghana. The system provides completely separate dashboards for three different user contexts, each with tailored functionality and access controls.

### Platform Tiers

| Tier | Route | Users | Primary Color | Purpose |
|------|-------|-------|---------------|---------|
| **Platform** | `/platform` | Internal NamibraPay staff | Teal `#64c6c3` | Treasury, compliance, merchant oversight |
| **Merchant** | `/merchant` | Business customers | Navy `#263b8e` | Transaction management, settlements, API integration |
| **Sub-Merchant** | `/sub-merchant` | Merchant sub-accounts | Mint `#a3ffe2` | Transaction visibility, settlement tracking |

---

## Key Features

### Platform Dashboard (`/platform`)
- **Treasury Management**: NSP balance monitoring, prefunding workflows, reconciliation
- **Merchant Oversight**: KYC review, merchant management, impersonation mode
- **Financial Operations**: Fee ledger, payout batches, financial reporting
- **Compliance & Audit**: KYC approval workflows, audit logging
- **Role-Based Access**: 5 distinct roles (Super Admin, Finance, Compliance, Support, Platform Engineer)

### Merchant Dashboard (`/merchant`)
- **Transaction Management**: Real-time transaction monitoring with detailed views
- **Settlement Tracking**: Automated settlements, payout history, reconciliation tools
- **Sub-Merchant Management**: Create and manage sub-merchant accounts
- **API Integration**: API key management, webhook configuration, sandbox console
- **Team Management**: Invite members, role assignment, access control
- **Account Settings**: Profile management, payout configuration, security settings

### Sub-Merchant Dashboard (`/sub-merchant`)
- **Transaction Visibility**: View transactions, raise disputes, track fees
- **Settlement Overview**: Payout history, fee breakdowns, balance tracking
- **Team Collaboration**: Invite viewers, manage access (Admin only)
- **Profile Management**: Update business information, notification preferences

---

## Tech Stack

### Frontend
- **Framework**: [Next.js 16.2.4](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) (strict mode)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Motion 13](https://motion.dev/) (formerly Framer Motion)
- **State Management**: React Context + Hooks
- **Forms**: [React Hook Form 7](https://react-hook-form.com/) + [Zod 4](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts 3](https://recharts.org/)

### Backend (To Be Determined)
- **Current State**: Frontend-only with mock data
- **Authentication**: Custom JWT-based auth system (placeholder)
- **API Integration**: Ready for REST or GraphQL backend
- **Database**: To be determined based on requirements

### Build Tools
- **Package Manager**: npm
- **Bundler**: Next.js with Turbopack (dev) / Webpack (production)
- **Linting**: ESLint 9
- **Type Checking**: TypeScript compiler

---

## Project Structure

```
namibrapay/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Authentication pages
│   │   │   ├── signin/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   ├── verify-mfa/
│   │   │   └── onboarding-status/
│   │   │
│   │   ├── platform/               # Tier 1: Platform Dashboard
│   │   │   ├── overview/           # ✅ KPIs, NSP monitoring, alerts
│   │   │   ├── merchants/          # ✅ Merchant management & oversight
│   │   │   ├── treasury/           # ✅ Treasury, reconciliation, reports
│   │   │   ├── compliance/         # ✅ KYC review workflows
│   │   │   ├── support/            # ✅ Ticket management
│   │   │   ├── providers/          # ✅ NSP health monitoring
│   │   │   ├── audit/              # ✅ Audit log viewer
│   │   │   ├── settings/           # ✅ Platform settings
│   │   │   └── _components/        # Shared platform components
│   │   │
│   │   ├── merchant/               # Tier 2: Merchant Dashboard
│   │   │   ├── overview/           # ✅ Dashboard with KPIs
│   │   │   ├── transactions/       # ✅ Transaction history & details
│   │   │   ├── settlements/        # ✅ Settlement management
│   │   │   ├── sub-merchants/      # ✅ Sub-merchant management
│   │   │   ├── api/                # ✅ API keys & webhooks
│   │   │   ├── team/               # ✅ Team management
│   │   │   ├── merchant-settings/  # ✅ Account settings
│   │   │   ├── compliance/         # ✅ KYC submission
│   │   │   └── _components/        # Shared merchant components
│   │   │
│   │   ├── sub-merchant/           # Tier 3: Sub-Merchant Dashboard
│   │   │   ├── overview/           # ✅ Dashboard with KPIs
│   │   │   ├── transactions/       # ✅ Transaction history
│   │   │   ├── settlements/        # ✅ Settlement tracking
│   │   │   ├── team/               # ✅ Team management (Admin only)
│   │   │   ├── settings/           # ✅ Settings (Admin only)
│   │   │   └── _components/        # Shared sub-merchant components
│   │   │
│   │   ├── client-providers.tsx    # Client-side providers wrapper
│   │   ├── globals.css             # Global styles, themes, fonts
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   └── not-found.tsx           # 404 page
│   │
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── select.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── form-field.tsx
│   │   │   ├── date-picker.tsx
│   │   │   ├── phone-input.tsx
│   │   │   └── ... (30+ components)
│   │   ├── landing-page/           # Landing page sections
│   │   │   ├── sections/
│   │   │   └── layout/
│   │   ├── merchant/               # Merchant-specific components
│   │   │   └── compliance/
│   │   └── ErrorBoundary.tsx       # Global error boundary
│   │
│   ├── hooks/
│   │   ├── use-role.tsx            # Platform role management
│   │   ├── use-merchant-role.tsx   # Merchant role management
│   │   ├── use-sub-merchant-role.tsx # Sub-merchant role management
│   │   ├── use-auth.ts             # Authentication hook
│   │   ├── use-debounce.ts         # Debounce utility
│   │   └── use-compliance-reminder.ts
│   │
│   ├── lib/
│   │   ├── constants.ts            # Platform constants & utilities
│   │   ├── utils.ts                # Helper functions (cn, etc.)
│   │   ├── logger.ts               # Logging utility
│   │   ├── api.ts                  # API client setup
│   │   ├── auth-api.ts             # Auth API functions
│   │   ├── schemas/                # Zod validation schemas
│   │   │   └── auth.ts
│   │   ├── constants/              # Constants & options
│   │   │   └── options.ts
│   │   ├── mock-data.ts            # Platform mock data
│   │   ├── treasury-mock-data.ts   # Treasury mock data
│   │   ├── merchant-mock-data.ts   # Merchant mock data
│   │   ├── sub-merchant-mock-data.ts # Sub-merchant mock data
│   │   ├── compliance-mock-data.ts # Compliance mock data
│   │   ├── merchant-constants.ts   # Merchant roles & permissions
│   │   └── sub-merchant-constants.ts # Sub-merchant roles
│   │
│   └── types/
│       └── auth.ts                 # Auth-related types
│
├── public/                         # Static assets
│   ├── logo.png
│   ├── logo-md.png
│   └── ... (partner logos, icons)
│
├── .env.local                      # Environment variables (gitignored)
├── .gitignore
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json
├── PROJECT_DOCS.md                 # Detailed project documentation
└── README.md                       # This file
```

---

## Design System

### Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Navy** | `#263b8e` | Primary buttons, Merchant accent |
| **Teal** | `#64c6c3` | Platform accent, success states |
| **Mint** | `#a3ffe2` | Sub-merchant accent, support |
| **Pink** | `#ffb4b0` | Error states, Super Admin badge |
| **Peach** | `#fedfb8` | Finance role, warnings |
| **Lavender** | `#bcbbee` | Compliance role, developer badge |

### Typography

- **Headings**: Space Grotesk Variable — `var(--font-heading)`
- **Body**: Manrope Variable — `var(--font-body)`

```tsx
<h1 style={{ fontFamily: "var(--font-heading)" }}>Heading</h1>
<p style={{ fontFamily: "var(--font-body)" }}>Body text</p>
```

### Theme Support

Both light and dark modes are fully implemented using CSS custom properties:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

---

## Role & Permission System

### Platform Roles (Tier 1)

| Role | Key | Permissions |
|------|-----|-------------|
| **Super Admin** | `super_admin` | Full platform access |
| **Finance** | `finance` | Treasury, settlements, fee management |
| **Compliance** | `compliance` | KYC review, merchant suspension, audit |
| **Support Lead** | `support` | Ticket management, merchant support |
| **Platform Engineer** | `platform_engineer` | Provider management, system settings |

```tsx
import { usePermission } from "@/hooks/use-role";

const canApprove = usePermission("treasury.approve");
const canSuspend = usePermission("merchants.suspend");
```

### Merchant Roles (Tier 2)

| Role | Key | Access Level |
|------|-----|-------------|
| **Owner** | `owner` | Full access including account deletion |
| **Admin** | `admin` | Full access except account deletion/transfer |
| **Developer** | `developer` | Dashboard, transactions, API management |
| **Finance** | `finance` | Transactions, settlements, reconciliation |
| **Support** | `support` | View transactions, request refunds |

```tsx
import { useMerchantRole } from "@/hooks/use-merchant-role";

const { can } = useMerchantRole();
if (can("api.manage")) {
  // Show API management features
}
```

### Sub-Merchant Roles (Tier 3)

| Role | Key | Access Level |
|------|-----|-------------|
| **Sub Admin** | `sub_admin` | Full access to sub-merchant account |
| **Sub Viewer** | `sub_viewer` | Read-only access to transactions |

---

## Getting Started

### Prerequisites

- **Node.js**: 20.x or later
- **npm**: 9.x or later (comes with Node.js)
- **Git**: For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd namibrapay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Configure your `.env.local` (when backend is ready):
   ```env
   NEXT_PUBLIC_API_URL=your_api_url
   NEXT_PUBLIC_AUTH_ENDPOINT=your_auth_endpoint
   # Add other environment variables as needed
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment (Optional)

Docker setup has been removed. Use standard Node.js deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Railway
- Render

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (uses webpack) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint for code quality checks |

---

## Configuration

### Next.js Configuration

The project uses a custom Next.js configuration to ensure reliable builds:

```typescript
// next.config.ts
export default {
  images: {
    unoptimized: true,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  turbopack: {}, // For development
  webpack: (config) => {
    // Custom webpack config for production
    config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js', '.json'];
    return config;
  },
};
```

### Build System

- **Development**: Uses Turbopack for fast rebuilds
- **Production**: Uses Webpack with `--webpack` flag for reliable module resolution
- **Module Resolution**: Configured to handle `.tsx` files without extensions

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Key Features by Dashboard

### Platform Dashboard Features

#### Treasury Management
- Real-time NSP (Network Service Provider) balance monitoring
- Prefunding request workflows with approval/rejection
- Automated reconciliation with discrepancy detection
- Payout batch management
- Fee ledger with bank/platform split tracking
- Financial report generation (PDF/CSV export)

#### Merchant Management
- Searchable merchant directory
- Split-panel detail view with tabs:
  - Overview (KYC status, quick actions)
  - Fee Schedule (per-channel rates)
  - Team (member list)
  - Internal Notes
- Merchant actions: Suspend, Reactivate, Deactivate
- Impersonation mode for support

#### Compliance Operations
- KYC application review queue
- Document viewer for uploaded credentials
- Approve/Request More Info/Reject workflows
- AML flag management
- Risk scoring per merchant

### Merchant Dashboard Features

#### Transaction Management
- Paginated transaction history
- Advanced filtering (date, status, channel, type)
- Slide-in transaction detail panel
- Transaction status tracking
- Export functionality

#### Settlement Operations
- Settlement summary dashboard
- Payout history with status tracking
- Reconciliation tools (Finance role)
- Fee breakdown analysis

#### Sub-Merchant Management
- Sub-merchant creation workflow
- Sub-merchant cards with metrics
- Status management (Active, Suspended, Pending)
- Fee rate configuration
- View details modal with full metrics

#### API Integration
- API key generation and management
- Webhook URL configuration
- Webhook log viewer
- Sandbox console (Developer role)
- Test transaction simulator

#### Team Collaboration
- Invite team members
- Role assignment (5 roles)
- 2FA status tracking
- Member removal
- Last login tracking

### Sub-Merchant Dashboard Features

#### Transaction Visibility
- Transaction history with filters
- Dispute raising workflow
- Fee breakdown per transaction
- Export capabilities

#### Settlement Tracking
- Payout history
- Fee breakdown analysis
- Balance monitoring
- Settlement schedule

---

## Internationalization

### Currency
All amounts are displayed in **Ghanaian Cedi (GHS)**.

```typescript
import { formatGHS } from "@/lib/constants";

formatGHS(1_240_000); // → "GH₵1,240,000.00"
```

### Date & Time
All timestamps use **ISO 8601 UTC format**, converted to local time for display.

```typescript
import { formatDate } from "@/lib/constants";

formatDate("2026-09-01T14:30:00Z"); // → "01 Sep 2026, 14:30"
```

---

## Testing Role Scenarios

### Platform Role Testing

Use the **Role Switcher** in the platform topbar to test different role perspectives:

1. Navigate to `/platform`
2. Click role badge in top-right
3. Select different role
4. Observe permission-gated features

### Merchant Role Testing

Merchant roles are set during sign-up:
- Owner: First account created for a business
- Other roles: Invited by Owner/Admin via Team page

### Sub-Merchant Role Testing

Sub-merchant roles:
- Sub Admin: Created when sub-merchant is added
- Sub Viewer: Invited by Sub Admin via Team page

---

## Mock Data Structure

All dashboards currently use **frontend-only mock data** for development. The backend integration is pending and will be implemented once the backend technology is decided.

| File | Contains |
|------|----------|
| `lib/mock-data.ts` | Platform: merchants, transactions, alerts, providers |
| `lib/treasury-mock-data.ts` | Platform: prefund requests, reconciliation, payouts, ledger |
| `lib/merchant-mock-data.ts` | Merchant: transactions, settlements, team, API keys |
| `lib/sub-merchant-mock-data.ts` | Sub-merchant: transactions, settlements, team |
| `lib/compliance-mock-data.ts` | Platform: KYC applications, documents |

### Backend Integration (Future)

When the backend is ready, the integration will follow these steps:

1. **API Client Setup**: Create API client utilities in `src/lib/api.ts`
2. **Replace Mock Data**: Replace static mock imports with API calls
3. **State Management**: Implement proper loading and error states
4. **Authentication**: Integrate with chosen auth provider
5. **Real-time Updates**: Add WebSocket/SSE for live data (if needed)

Example migration pattern:
```typescript
// Current (mock data)
import { mockTransactions } from "@/lib/merchant-mock-data";

// Future (API integration)
import { useQuery } from "@tanstack/react-query"; // or chosen library
import { api } from "@/lib/api";

const { data: transactions, isLoading } = useQuery({
  queryKey: ['transactions'],
  queryFn: () => api.transactions.list()
});

if (isLoading) return <Spinner />;
```

### Backend Technology Options

The platform is designed to work with various backend technologies:

- **RESTful API** (Node.js/Express, Python/FastAPI, etc.)
- **GraphQL** (Apollo, Hasura, etc.)
- **Serverless** (AWS Lambda, Azure Functions, etc.)
- **Real-time** (Socket.io, Pusher, Ably, etc.)

The frontend architecture is backend-agnostic and follows standard patterns that work with any backend choice.

---

## Security Considerations

### Authentication
- All routes except landing page require authentication
- Session management (implementation pending backend integration)
- Automatic session refresh
- MFA support for enhanced security (backend-dependent)

### Authorization
- Role-based access control (RBAC)
- Permission checks at component level
- Server-side permission validation (when backend is integrated)
- Audit logging for sensitive actions (backend implementation pending)

### Data Protection
- No sensitive data in localStorage
- Token storage (implementation depends on auth provider)
- Provider-blind architecture for Tier 2 & 3
- No NSP routing information exposed to merchants

---

## Important Rules

1. **Provider-Blind Tier 2 & 3**: Never expose NSP names, routing, or provider fees in `/merchant` or `/sub-merchant`
2. **No `any` types**: Use `unknown` with type guards instead
3. **No `@ts-ignore`**: Fix the actual type error
4. **Semantic color variables**: Use CSS vars for light/dark compatibility
5. **Webpack for production**: Build script uses `--webpack` flag for reliable module resolution
6. **Consistent file naming**: Use kebab-case for all UI component files
7. **TypeScript strict mode**: All type errors must be resolved

---

## Dependencies

### Core Dependencies
```json
{
  "next": "16.2.4",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "typescript": "^5"
}
```

### UI & Styling
```json
{
  "@tailwindcss/postcss": "^4",
  "tailwindcss": "^4",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.5.0",
  "lucide-react": "^1.9.0",
  "motion": "^13.1.1"
}
```

### Forms & Validation
```json
{
  "react-hook-form": "^7.73.1",
  "@hookform/resolvers": "^5.2.2",
  "zod": "^4.3.6"
}
```

### Charts & Visualization
```json
{
  "recharts": "^3.8.1"
}
```

### Utilities
```json
{
  "axios": "^1.15.2",
  "class-variance-authority": "^0.7.1"
}
```

**Note**: Additional dependencies may be added based on the chosen backend and state management solution (e.g., React Query, SWR, Redux Toolkit, etc.).

---

## Troubleshooting

### Common Issues

#### Module Resolution Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

#### TypeScript Errors After Pull
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Build Fails with Turbopack Error
The project is configured to use Webpack for production builds:
```bash
# This is already configured in package.json
npm run build  # Uses --webpack flag
```

#### Hydration Mismatch Errors
Ensure interactive elements are client-side only:
```tsx
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

// Render interactive elements only when mounted
{isMounted && <InteractiveButton />}
```

---

## Additional Documentation

- **PROJECT_DOCS.md**: Detailed project architecture, role system, data structures
- **CUSTOMER_JOURNEY_FLOW.md**: User flow documentation
- **IMPLEMENTATION_STATUS_COMPLETE.md**: Feature completion status
- **CODE_QUALITY_IMPROVEMENTS_COMPLETE.md**: Code quality standards

---

## Contributing

### Development Workflow

1. Create a feature branch from `main`
2. Make your changes with clear commit messages
3. Ensure all TypeScript errors are resolved
4. Test in all three dashboards
5. Create a pull request

### Code Style

- Use TypeScript strict mode
- Follow kebab-case for file names
- Use functional components with hooks
- Implement proper error boundaries
- Add proper keys to list items

### Commit Messages

```
feat: Add sub-merchant editing feature
fix: Resolve toast module resolution error
refactor: Standardize file naming to kebab-case
docs: Update README with deployment instructions
```

---

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

## Support

For questions or support:
- Technical issues: Create an issue in the repository
- Feature requests: Contact the product team
- Security concerns: Contact security@namibrapay.com

---

**Built with ❤️ for NamibraPay**

Last Updated: December 2024