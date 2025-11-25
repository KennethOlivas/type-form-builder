# Type Form Builder

A powerful, modern form builder application built with Next.js 16, featuring advanced logic jumps, real-time analytics, and a beautiful drag-and-drop interface. Create sophisticated forms with conditional logic, track submissions, and analyze responses with comprehensive analytics.

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=flat-square&logo=postgresql)

## ✨ Features

### 🎨 Form Builder
- **Drag & Drop Interface**: Intuitive drag-and-drop question reordering using `@dnd-kit`
- **Multiple Question Types**: 
  - Short Text
  - Long Text
  - Multiple Choice
  - Checkboxes
  - Dropdown
  - Rating Scale
  - Date Picker
  - File Upload
- **Welcome Screen**: Customizable welcome screen with title, description, and call-to-action
- **Thank You Screen**: Personalized completion messages
- **Real-time Preview**: See changes instantly as you build
- **Form Templates**: Quick start with pre-built form templates or create from scratch
- **Mobile Responsive**: Fully responsive builder interface for all devices

### 🧠 Advanced Logic System
- **Logic Jumps**: Create conditional navigation based on user responses
- **Visual Logic Map**: Interactive node-based visualization of form flow using `@xyflow/react`
- **Conditional Rules**: 
  - Equals / Not Equals
  - Contains / Does Not Contain
  - Greater Than / Less Than
  - Between Range
  - Is Empty / Is Not Empty
- **Multiple Destinations**:
  - Jump to specific question
  - Skip to end
  - Continue to next question
- **Logic Panel**: Dedicated panel for configuring question logic with visual feedback

### 📊 Analytics Dashboard
- **Real-time Metrics**:
  - Total views and submissions
  - Completion rate tracking
  - Average completion time
  - Bounce rate analysis
- **Date Range Filtering**: 
  - Custom date ranges with calendar picker
  - Quick presets (Today, Last 7 Days, Last 30 Days, Last 90 Days)
  - Query parameter-based filtering with debouncing
- **Response Analytics**:
  - Question-by-question breakdown
  - Visual charts using Recharts
  - Response distribution
  - Individual response viewing
- **Device & Location Tracking**:
  - Device type (Desktop, Mobile, Tablet)
  - Browser information
  - Operating system
  - Geographic location
  - IP tracking
- **Export Capabilities**: Download response data for further analysis

### 🗂️ Workspace Management
- **Multiple Workspaces**: Organize forms into different workspaces
- **Personal & Team Workspaces**: Support for individual and collaborative environments
- **Workspace Icons**: Customizable icons for easy identification
- **URL-based Routing**: Shareable workspace links with query parameters
- **Form Organization**: Filter and view forms by active workspace

### 🎨 Design Customization
- **Theme System**: 
  - Pre-built themes (Modern, Classic, Minimal, Bold)
  - Custom theme creation
  - Live preview of theme changes
- **Color Customization**:
  - Primary and secondary colors
  - Background colors
  - Text colors
  - Advanced color picker with HSL support
- **Typography**: 
  - Font family selection
  - Font size controls
  - Line height adjustments
- **Layout Options**:
  - Question alignment
  - Spacing controls
  - Border radius
  - Shadow effects

### 🔐 Authentication & Security
- **Better Auth Integration**: Secure authentication using `better-auth`
- **Email/Password Authentication**: Traditional login system
- **Session Management**: Secure session handling with token-based authentication
- **User Profiles**: User account management and settings
- **Protected Routes**: Automatic route protection for authenticated pages

### 📱 Form Sharing & Publishing
- **Form Status Management**:
  - Draft: Work in progress
  - Published: Live and accepting responses
  - Closed: No longer accepting responses
- **Public Form Links**: Shareable URLs for form distribution
- **QR Code Generation**: Generate QR codes for easy mobile access
- **Embed Options**: Embed forms in external websites
- **Share Modal**: Comprehensive sharing interface with copy-to-clipboard

### 📋 Response Management
- **Response Table**: Sortable, filterable table of all submissions
- **Individual Response View**: Detailed view of each submission
- **Response Deletion**: Remove unwanted submissions
- **Response Count**: Real-time response count on dashboard cards
- **Submission Tracking**: Track submission timestamps and metadata

### 🎯 User Experience
- **Dark Mode**: Full dark mode support with `next-themes`
- **Responsive Design**: Mobile-first design approach
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: Comprehensive error messages and fallbacks
- **Toast Notifications**: User feedback with `sonner`
- **Animations**: Smooth transitions with `framer-motion` and GSAP
- **Accessibility**: WCAG compliant components from Radix UI

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19.2
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Component Library**: Radix UI (Comprehensive set of accessible components)
- **Animations**: Framer Motion, GSAP
- **Drag & Drop**: @dnd-kit
- **Flow Diagrams**: @xyflow/react
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table

### Backend
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **API**: Next.js API Routes (Server Actions)

### Additional Libraries
- **State Management**: Zustand
- **Date Handling**: date-fns, react-day-picker
- **QR Codes**: qrcode
- **Color Manipulation**: color
- **User Agent Parsing**: ua-parser-js
- **Debouncing**: use-debounce
- **Panels**: react-resizable-panels
- **Carousels**: embla-carousel-react

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or higher
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd type-form-builder
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/typeform_db

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Optional: External Services
# Add any additional API keys or configuration
```

4. **Set up the database**

Start PostgreSQL (using Docker Compose if available):
```bash
docker-compose up -d
```

Run database migrations:
```bash
pnpm drizzle-kit push
# or
npx drizzle-kit push
```

5. **Run the development server**
```bash
pnpm dev
# or
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
type-form-builder/
├── app/                          # Next.js App Router
│   ├── analytics/               # Analytics dashboard pages
│   ├── api/                     # API routes
│   ├── builder/                 # Form builder pages
│   ├── dashboard/               # Main dashboard
│   ├── form/                    # Public form pages
│   ├── login/                   # Authentication pages
│   └── signup/
├── components/                   # React components
│   ├── analytics/               # Analytics components
│   │   ├── analytics-controls/  # Date range, filters
│   │   ├── analytics-results.tsx
│   │   └── analytics-dashboard.tsx
│   ├── builder/                 # Form builder components
│   │   ├── logic-map/          # Visual logic editor
│   │   ├── question-card.tsx
│   │   ├── logic-panel.tsx
│   │   └── design-modal.tsx
│   ├── dashboard/               # Dashboard components
│   │   ├── dashboard-content.tsx
│   │   ├── form-card.tsx
│   │   └── sidebar.tsx
│   ├── form/                    # Public form components
│   │   ├── question-input.tsx
│   │   ├── welcome-screen.tsx
│   │   └── thank-you-screen.tsx
│   └── ui/                      # Reusable UI components
├── actions/                      # Server actions
│   ├── analytics-actions.ts
│   ├── form-actions.ts
│   ├── submission-actions.ts
│   └── workspace-actions.ts
├── db/                          # Database configuration
│   ├── schema.ts                # Drizzle schema definitions
│   └── index.ts                 # Database client
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
└── public/                      # Static assets
```

## 🗄️ Database Schema

### Core Tables

#### `user`
- User authentication and profile information
- Email verification status
- Creation and update timestamps

#### `workspace`
- Workspace organization
- Personal and team workspace types
- Custom icons and naming

#### `form`
- Form metadata (title, description)
- Status (draft, published, closed)
- Style configuration (JSONB)
- Welcome screen configuration

#### `question`
- Question content and configuration
- Question type and validation rules
- Position ordering
- Options for multiple choice questions

#### `logic_jump`
- Conditional navigation configuration
- Default destination settings
- Enable/disable toggle

#### `logic_rule`
- Conditional rules for logic jumps
- Operators (equals, contains, greater than, etc.)
- Destination question references

#### `submission`
- Form responses
- Answer data (JSONB)
- Device and location metadata
- Submission timestamps

#### `form_visit`
- Form view tracking
- Device, browser, OS information
- Geographic data
- Interaction timestamps

## 🔧 Configuration

### Drizzle Configuration
Database configuration is managed in `drizzle.config.ts`:
- Schema location: `./db/schema.ts`
- Migrations output: `./drizzle`
- Dialect: PostgreSQL

### Tailwind Configuration
Custom Tailwind configuration with:
- CSS variables for theming
- Custom animations
- Extended color palette
- Responsive breakpoints

## 📝 Usage Guide

### Creating a Form

1. **Navigate to Dashboard**: Click "Create New Form" or use a template
2. **Add Questions**: Use the "Add Item" panel to insert questions
3. **Configure Questions**: Set labels, placeholders, validation rules
4. **Reorder Questions**: Drag and drop to reorder
5. **Add Logic**: Use the Logic panel to create conditional flows
6. **Customize Design**: Apply themes or create custom styles
7. **Publish**: Change status to "Published" to accept responses

### Setting Up Logic Jumps

1. **Select Question**: Click on a question in the builder
2. **Open Logic Panel**: Navigate to the "Logic" tab
3. **Enable Logic**: Toggle logic jumps on
4. **Add Rules**: Create conditional rules based on responses
5. **Set Destinations**: Choose where to jump based on conditions
6. **Visualize**: Use the Logic Map to see the flow

### Viewing Analytics

1. **Access Analytics**: Click the analytics icon on a form card
2. **Select Date Range**: Use presets or custom date picker
3. **View Metrics**: See completion rates, views, and submissions
4. **Analyze Responses**: Review individual responses and charts
5. **Export Data**: Download response data for external analysis

### Managing Workspaces

1. **Create Workspace**: Use the sidebar to add new workspaces
2. **Switch Workspaces**: Click on workspace names to filter forms
3. **Organize Forms**: Forms are automatically filtered by active workspace
4. **Share Workspace**: Share workspace URLs with team members

## 🎨 Theming

The application supports comprehensive theming:

### Pre-built Themes
- **Modern**: Clean, contemporary design
- **Classic**: Traditional form styling
- **Minimal**: Simple, distraction-free
- **Bold**: High-contrast, vibrant colors

### Custom Themes
Create custom themes by configuring:
- Primary and secondary colors
- Background colors
- Text colors
- Font families
- Border radius
- Spacing

## 🔒 Security Features

- **Authentication**: Secure user authentication with Better Auth
- **Session Management**: Token-based session handling
- **CSRF Protection**: Built-in CSRF protection
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM
- **XSS Protection**: React's built-in XSS protection
- **Environment Variables**: Sensitive data stored in environment variables

## 🚢 Deployment

### Build for Production

```bash
pnpm build
# or
npm run build
```

### Start Production Server

```bash
pnpm start
# or
npm start
```

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Environment Variables for Production

Ensure all environment variables are set in your production environment:
- `DATABASE_URL`: Production PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Strong secret key for authentication
- `BETTER_AUTH_URL`: Production URL

## 🧪 Development

### Running Linter

```bash
pnpm lint
# or
npm run lint
```

### Database Migrations

Generate migrations:
```bash
pnpm drizzle-kit generate
```

Push schema changes:
```bash
pnpm drizzle-kit push
```

View database studio:
```bash
pnpm drizzle-kit studio
```

## 📦 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Radix UI](https://www.radix-ui.com/) - Accessible component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Better Auth](https://better-auth.com/) - Authentication library
- [Recharts](https://recharts.org/) - Charting library
- [React Flow](https://reactflow.dev/) - Node-based UI library

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ using Next.js and TypeScript
