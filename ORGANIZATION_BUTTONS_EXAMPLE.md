# Example: Organization Page with New Buttons

This document shows an example of how the organization page would look with the new buttons.

## Microsoft Organization Example

### Popular Repositories Section

```
┌─────────────────────────────────────────────────────────────────────┐
│  ★ Popular Repositories                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ vscode                                                         │  │
│  │ Visual Studio Code                                             │  │
│  │ ● TypeScript  ⭐ 142k  🔀 25.8k                                 │  │
│  │ #editor #vscode #electron #visual-studio-code                  │  │
│  │                                                                 │  │
│  │ ┌────────────────────────┐  ┌────────────────────────┐        │  │
│  │ │ 🌐  Create Landing     │  │ 🔗  View on GitHub     │        │  │
│  │ └────────────────────────┘  └────────────────────────┘        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ TypeScript                                                     │  │
│  │ TypeScript is a superset of JavaScript                        │  │
│  │ ● TypeScript  ⭐ 95k  🔀 12.3k                                  │  │
│  │ #typescript #language #typechecker                             │  │
│  │                                                                 │  │
│  │ ┌────────────────────────┐  ┌────────────────────────┐        │  │
│  │ │ 🌐  Create Landing     │  │ 🔗  View on GitHub     │        │  │
│  │ └────────────────────────┘  └────────────────────────┘        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ terminal                                                       │  │
│  │ The new Windows Terminal                                       │  │
│  │ ● C++  ⭐ 89k  🔀 7.8k                                          │  │
│  │ #windows #terminal #console #command-line                      │  │
│  │                                                                 │  │
│  │ ┌────────────────────────┐  ┌────────────────────────┐        │  │
│  │ │ 🌐  Create Landing     │  │ 🔗  View on GitHub     │        │  │
│  │ └────────────────────────┘  └────────────────────────┘        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Members Section

```
┌─────────────────────────────────────────────────────────────────────┐
│  👥 Members (150)                                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │    👤    │  │    👤    │  │    👤    │  │    👤    │  │   👤   ││
│  │  Avatar  │  │  Avatar  │  │  Avatar  │  │  Avatar  │  │ Avatar ││
│  │          │  │          │  │          │  │          │  │        ││
│  │ satya    │  │ scottgu  │  │  gblock  │  │  shansm  │  │ daveba ││
│  │          │  │          │  │          │  │          │  │        ││
│  │  [🌐][🔗] │  │  [🌐][🔗] │  │  [🌐][🔗] │  │  [🌐][🔗] │  │ [🌐][🔗]││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └────────┘│
│                                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │    👤    │  │    👤    │  │    👤    │  │    👤    │  │   👤   ││
│  │  Avatar  │  │  Avatar  │  │  Avatar  │  │  Avatar  │  │ Avatar ││
│  │          │  │          │  │          │  │          │  │        ││
│  │  felixr  │  │  olivia  │  │  yashg   │  │  marah   │  │ stevef ││
│  │          │  │          │  │          │  │          │  │        ││
│  │  [🌐][🔗] │  │  [🌐][🔗] │  │  [🌐][🔗] │  │  [🌐][🔗] │  │ [🌐][🔗]││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └────────┘│
│                                                                       │
│  + 140 more members                                                  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Button Interactions

### Repository Card Buttons

**Create Landing Button (Primary - Blue)**
- Click → Navigate to home page
- Home component loads repository URL
- Contributors are automatically fetched
- User sees list of contributors for that repository

**View on GitHub Button (Secondary - Gray)**
- Click → Opens new browser tab
- Loads repository page on github.com
- User can view repository details, code, issues, etc.

### Member Card Buttons

**Web Icon Button (🌐 - Blue mini-fab)**
- Click → Navigate to home page
- Member's GitHub profile URL is loaded
- User can view/edit URL and proceed
- Tooltip: "Create Landing"

**Link Icon Button (🔗 - Gray mini-fab)**
- Click → Opens new browser tab
- Loads member's profile on github.com
- User can view member's repositories, activity, etc.
- Tooltip: "View on GitHub"

## Real-World Usage Example

### Scenario 1: Exploring Microsoft's VSCode Contributors

1. User enters `https://github.com/microsoft` in home page
2. Organization page loads, showing popular repositories
3. User sees "vscode" repository card
4. User clicks **"Create Landing"** button
5. App navigates to home
6. Home automatically loads `https://github.com/microsoft/vscode`
7. List of VSCode contributors appears
8. User can click on any contributor to see their landing page

### Scenario 2: Checking Out a Microsoft Member

1. User is on Microsoft organization page
2. User scrolls to Members section
3. User sees Satya Nadella's card
4. User clicks the **web icon (🌐)** button
5. App navigates to home with Satya's GitHub URL
6. User can proceed to view Satya's profile or repositories

### Scenario 3: Quick GitHub Access

1. User is on organization page
2. User wants to see TypeScript repository on GitHub
3. User clicks **"View on GitHub"** button
4. New tab opens with TypeScript repository
5. User stays on organization page (main tab)
6. User can continue exploring other repositories

## Design Philosophy

The button layout follows these principles:

1. **Primary Action First**: "Create Landing" is the primary action (blue, prominent)
2. **Alternative Action Second**: "View on GitHub" is secondary (gray, less prominent)
3. **Consistent Layout**: Same button pattern across all repository cards
4. **Space Efficient**: Members use mini-fab buttons to save space
5. **Clear Icons**: Web icon (🌐) for landing, Link icon (🔗) for external
6. **Hover States**: Buttons elevate on hover for better feedback
7. **Responsive**: Buttons adapt to screen size (stack on mobile if needed)

## Benefits for Users

✅ **Quick Landing Creation**: One click from organization to landing
✅ **No Context Switching**: Navigate back to home seamlessly
✅ **Dual Options**: Create landing OR view on GitHub
✅ **Better Discovery**: Explore organization members and repos easily
✅ **Consistent UX**: Same patterns across the app
