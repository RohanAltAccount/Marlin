# Marlin Design Guidelines

## Design Approach
**System-Based with Productivity References**
Drawing inspiration from Notion's clean organization, Linear's crisp typography, and Asana's task clarity. Focus on functional beauty—interfaces that are pleasant to use for hours of studying without visual fatigue.

## Typography System
**Font Family**: Inter (primary), JetBrains Mono (code/tags)
- Hero Headlines: text-5xl to text-6xl, font-bold
- Section Headers: text-3xl to text-4xl, font-semibold
- Page Titles: text-2xl, font-semibold
- Card Titles/Labels: text-lg, font-medium
- Body Text: text-base, font-normal
- Metadata/Timestamps: text-sm, font-normal
- Micro-labels: text-xs, font-medium uppercase tracking-wide

## Layout & Spacing System
**Tailwind Units**: Consistently use 2, 4, 6, 8, 12, 16, 20, 24 for spacing
- Component padding: p-4 to p-8
- Section spacing: py-12 to py-20 (landing), py-6 to py-8 (app)
- Card gaps: gap-4 to gap-6
- Container max-width: max-w-7xl (landing), max-w-6xl (app dashboard)

## Landing Page Structure

**Hero Section** (h-screen with centered content)
- Large hero image: Students collaborating with laptops, bright natural setting, modern aesthetic
- Overlaid centered content with backdrop-blur-md background on CTA container
- Headline + subheadline + dual CTAs (Sign Up + Learn More)
- Trust indicator: "Join 10,000+ students staying organized"

**Features Grid** (3-column on desktop, stacked mobile)
- Icon + Title + Description cards
- Icons: Heroicons outline style
- Features: Smart Notes, Task Dashboard, Quick Capture, Calendar Sync, Team Collaboration, Search Everything
- Even height cards with subtle borders

**How It Works** (Timeline/Step visualization)
- 4-step horizontal flow with connecting lines
- Step cards with numbers, icons, titles, descriptions
- Visual progression from chaos to organization

**Student Testimonials** (2-column grid)
- Profile image + quote + name + school cards
- 4 testimonials showcasing different use cases
- Real student scenarios: exam prep, group projects, thesis organization

**Pricing/CTA Section** (centered, generous padding)
- Clear value proposition
- Primary CTA with supporting text
- "Free for all students" messaging

**Footer** (comprehensive)
- Logo + tagline
- Quick links grid (Product, Resources, Company, Support)
- Social icons
- Newsletter signup inline
- Trust badges (Privacy-focused, Student-built)

## Application Interface

**Navigation Structure**
- Left sidebar (w-64, fixed): Logo, main navigation items with icons, user profile at bottom
- Nav items: Dashboard, Notes, Tasks, Calendar, Quick Capture, Search
- Active state: subtle background, bold text
- Top bar: breadcrumb navigation, search bar, notifications, profile dropdown

**Dashboard Layout** (3-column responsive grid)
- Left: Upcoming tasks widget (next 7 days)
- Center: Recent notes preview cards
- Right: Today's focus panel with quick stats
- Each widget has header with "View All" link

**Notes Interface**
- Two-pane: Left folder tree (w-1/4), Right note editor/list (w-3/4)
- Folder tree: collapsible hierarchy, drag-drop enabled
- Note list: card-based with title, preview, date, tags
- Rich text editor: toolbar with formatting options, clean editing canvas

**Tasks Interface**
- Filter bar: All, Today, Upcoming, Completed, By Priority
- Kanban-style columns OR list view toggle
- Task cards: checkbox, title, due date badge, priority indicator
- Quick add bar at top

**Calendar View**
- Month/week toggle
- Color-coded by type (task, deadline, event)
- Click date to quick-add
- Side panel with day details

## Component Library

**Cards**: Rounded corners (rounded-lg), subtle shadow (shadow-sm), white background, p-6 padding

**Buttons**:
- Primary: Solid, bold text, px-6 py-3
- Secondary: Outlined, medium weight
- Text buttons: No background, hover underline
- Icon buttons: Square, centered icon, hover background

**Forms**:
- Floating labels on inputs
- Input height: h-12
- Full-width in cards
- Helper text below: text-sm
- Error states: red accent, icon

**Tags/Badges**: Pill-shaped (rounded-full), px-3 py-1, text-xs uppercase

**Empty States**: Centered icon + message + action button

**Modals**: Centered, max-w-2xl, backdrop-blur overlay

## Images
- **Hero**: Wide shot of diverse students studying together in modern setting, laptops open, collaborative atmosphere, natural lighting
- **Feature icons**: Use Heroicons—BookOpen, CheckSquare, Lightning, Calendar, Users, Search
- **Testimonial photos**: Circular crops (rounded-full), w-12 h-12, student headshots
- **Empty state illustrations**: Simple line art representing each section's purpose

## Interactions & States
**Minimal animations**: Smooth transitions on hovers (transition-colors duration-200), subtle scale on card hover (hover:scale-105), smooth page transitions
**Loading states**: Skeleton screens for content, spinner for actions
**Focus states**: Clear ring-2 outline for keyboard navigation

## Responsive Breakpoints
- Mobile (<768px): Single column, collapsible sidebar, stacked cards
- Tablet (768-1024px): 2-column grids, visible sidebar toggle
- Desktop (>1024px): Full multi-column layouts, persistent sidebar

**Key Principle**: Clarity over decoration. Every element serves student productivity—no distracting flourishes, just clean, functional design that helps students focus on their work.