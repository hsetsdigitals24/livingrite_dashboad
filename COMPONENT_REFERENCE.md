# Phase 2 UI Component Reference

## Component Features by Page

### 📋 Care Updates (/portal/updates)
```
Header with Gradient Title
├── Filter Buttons (All, Daily, Health, Medication, Incident)
├── Update Cards
│   ├── Icon + Title + Author
│   ├── Timestamp + Urgent Badge (pulsing)
│   ├── Expandable Content
│   └── Attachment Buttons (on expand)
└── Empty State Message
```

**Colors**: Blue → Cyan gradient
**Key Feature**: Pulsing urgent indicator animation

---

### ❤️ Health Logs (/portal/health)
```
Header with Gradient Title
├── Sidebar (Date Selection)
│   └── Date Buttons (animated selection)
└── Main Panel
    ├── Vital Signs Cards (4-column grid)
    │   ├── Blood Pressure (blue-cyan)
    │   ├── Heart Rate (red-pink)
    │   ├── Weight (yellow-orange)
    │   └── Temperature (purple-pink)
    ├── Mood & Sleep (2-column)
    ├── Medications (with ✓ checkmarks)
    ├── Meals (categorized)
    └── Notes (gradient background)
```

**Colors**: Green → Emerald gradient
**Key Feature**: Multi-section expandable layout with color-coded vital signs

---

### 📄 Documents (/portal/documents)
```
Header with Gradient Title
├── Search Bar + Upload Button
├── Filter Buttons (All, Prescription, Test, Medical, Insurance)
└── Document Grid (3 columns)
    └── Document Cards
        ├── Icon (large, centered)
        ├── Filename (truncated)
        ├── Metadata (Category, Size, Uploader)
        ├── Upload Date & Time
        └── Action Buttons (Download, Preview)
```

**Colors**: Orange → Amber gradient
**Key Feature**: Hover-to-reveal action buttons, gradient card backgrounds

---

### 💬 Messaging (/portal/messaging)
```
Header with Gradient Title
├── Left Panel (1/3 width on desktop)
│   ├── Conversations List Header
│   └── Conversation Cards
│       ├── Avatar + Online Indicator (pulsing green dot)
│       ├── Name + Role
│       └── Unread Badge (animating scale)
└── Right Panel (2/3 width on desktop)
    ├── Chat Header (with Call/Video buttons)
    ├── Messages Area
    │   ├── Message Bubbles (user vs. team)
    │   ├── Timestamps
    │   └── Avatars
    └── Input Area
        ├── Attachment Button
        ├── Message Input
        └── Send Button
```

**Colors**: Pink → Rose gradient
**Key Features**: Online status pulses, unread badges animate, message bubbles with different colors

---

### 📊 Care Plan (/portal/care-plan)
```
Header with Gradient Title
├── Plan Overview Card
│   ├── Title, Care Level, Start Date, Coordinator
│   └── Gradient background
├── Care Goals Section
│   └── Goal Cards (4 per page)
│       ├── Status Badge (On Track, At Risk, Completed)
│       ├── Goal Title + Description
│       ├── Progress Bar (animated fill)
│       ├── Target Date
│       └── Expandable Details (on click)
└── Weekly Schedule Section
    ├── Day Tabs (Monday-Sunday)
    └── Activity List (for selected day)
        ├── Icon + Activity Name
        ├── Time + Assigned To
        └── Notes
```

**Colors**: Indigo → Purple gradient
**Key Features**: Progress bar animations, expandable goals, day-based schedule switching

---

## Global Design Elements

### Animations Used
- **Entrance**: Staggered fade-in + slide (children appear in sequence)
- **Hover**: Subtle lift effect (y: -4px)
- **Interactions**: Smooth expand/collapse with height animation
- **Emphasis**: Pulsing scale for badges and indicators
- **Transitions**: 200-300ms duration for smooth UX

### Color Palette by Section
| Page | Primary | Secondary |
|------|---------|-----------|
| Updates | Blue-600 | Cyan-600 |
| Health | Green-600 | Emerald-600 |
| Documents | Orange-600 | Amber-600 |
| Messaging | Pink-600 | Rose-600 |
| Care Plan | Indigo-600 | Purple-600 |

### Component Patterns
- **Cards**: Gradient background + border + shadow on hover
- **Buttons**: Gradient background, scale on hover/tap
- **Inputs**: Border focus with ring effect
- **Badges**: Solid color background with text
- **Progress**: Animated bar fill from 0% to target%
- **Lists**: Staggered animations, hover effects

---

## Responsive Breakpoints

### Mobile (< 768px)
- Single column layouts
- Sidebar hidden/drawer mode
- Cards stack vertically
- Touch-friendly tap targets

### Tablet (768px - 1024px)
- Two column layouts possible
- Sidebar always visible (narrow)
- Grid adjusts to 2 columns

### Desktop (> 1024px)
- Full multi-column layouts
- Wide sidebar
- 3-4 column grids
- All features visible

---

## Performance Optimizations
- Motion libraries lazy-loaded
- Animations disabled on reduced-motion preference
- SVG icons and emoji for lightweight rendering
- CSS gradients (hardware accelerated)
- Smooth 60fps animations

---

## Accessibility Features
- Semantic HTML structure
- Keyboard navigation support
- ARIA labels on interactive elements
- Color contrast ratios meet WCAG AA
- Focus states visible on all interactive elements
- Reduced motion support via prefers-reduced-motion

