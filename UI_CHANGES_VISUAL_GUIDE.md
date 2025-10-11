# Organization Page UI Changes - Visual Guide

## Popular Repositories Section

### Before:
```
┌─────────────────────────────────────────────────────────┐
│  Repository Name (clickable link to GitHub)             │
│  Description of the repository                          │
│  ⭐ 1.2k  🔀 345  Python                                 │
│  #topic1 #topic2 #topic3                                │
└─────────────────────────────────────────────────────────┘
```

### After:
```
┌─────────────────────────────────────────────────────────┐
│  Repository Name                                         │
│  Description of the repository                          │
│  ⭐ 1.2k  🔀 345  Python                                 │
│  #topic1 #topic2 #topic3                                │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ 🌐 Create Landing│  │ 🔗 View on GitHub│            │
│  └──────────────────┘  └──────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

**Changes:**
- Repository name is now plain text (not a link)
- Added two action buttons at the bottom:
  - **Create Landing** (Primary button, blue): Creates landing pages for repository contributors
  - **View on GitHub** (Secondary button, gray): Opens repository on GitHub

## Members Section

### Before:
```
┌────────┐  ┌────────┐  ┌────────┐
│  👤    │  │  👤    │  │  👤    │
│ Avatar │  │ Avatar │  │ Avatar │
│  User1 │  │  User2 │  │  User3 │
│ (link) │  │ (link) │  │ (link) │
└────────┘  └────────┘  └────────┘
```

### After:
```
┌────────┐  ┌────────┐  ┌────────┐
│  👤    │  │  👤    │  │  👤    │
│ Avatar │  │ Avatar │  │ Avatar │
│  User1 │  │  User2 │  │  User3 │
│        │  │        │  │        │
│ [🌐][🔗]│  │ [🌐][🔗]│  │ [🌐][🔗]│
└────────┘  └────────┘  └────────┘
```

**Changes:**
- Member name is now plain text (not a link)
- Added two mini-fab buttons:
  - **🌐** (Primary, blue): Create Landing - loads member's GitHub URL
  - **🔗** (Secondary, gray): View on GitHub - opens member profile

## Button Styles

### Primary Button (Create Landing)
- Color: Primary theme color (purple/blue)
- Icon: Web/globe icon
- Purpose: Main action - creates landing pages

### Secondary Button (View on GitHub)
- Color: Gray/neutral
- Icon: Open in new window icon
- Purpose: Alternative action - view source on GitHub

## Responsive Behavior

### Desktop (> 768px)
- Repository buttons: Full width, side by side
- Member buttons: Mini-fabs, horizontally aligned

### Mobile (< 768px)
- Repository buttons: Stack vertically if needed
- Member buttons: Remain as mini-fabs but may wrap

## User Interaction Flow

### For Repositories:
1. User hovers over repository card → Card elevates with shadow
2. User clicks "Create Landing" button
   - App navigates to home page
   - Repository URL is set in sessionStorage
   - Home component automatically processes the URL
   - Contributors list is displayed
3. OR User clicks "View on GitHub"
   - New tab opens with repository on GitHub

### For Members:
1. User hovers over member card → Card elevates with shadow
2. User clicks web icon (🌐)
   - App navigates to home page
   - Member's GitHub URL is set in sessionStorage
   - URL appears in search box for user to process
3. OR User clicks link icon (🔗)
   - New tab opens with member's profile on GitHub

## Material Design Components Used

- `mat-raised-button`: For repository action buttons
- `mat-mini-fab`: For member action buttons
- `mat-icon`: For all icons
- `matTooltip`: For member button tooltips

## Accessibility Features

- All buttons have clear labels or tooltips
- Icons are semantic and recognizable
- Color contrast meets WCAG AA standards
- Buttons are keyboard accessible
- Focus states are visible

## Color Scheme Integration

The buttons integrate with the existing theme system:
- Primary color: Used for "Create Landing" buttons
- Text color: Adapts to light/dark theme
- Hover states: Slightly darker shade of base color
- Shadows: Theme-appropriate depth
