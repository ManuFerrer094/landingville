# Navigation and Landing Creation Fix

## Problem Statement

The application had two main issues:

1. **Navigation Loop**: When navigating from an organization page back to home, users would immediately be redirected back to the organization page, creating an infinite loop.

2. **Missing Landing Creation**: The organization page showed popular repositories and members, but there was no way to create landings for them directly from the organization page.

## Changes Made

### 1. Fixed Navigation Loop (home.component.ts)

**Problem**: 
- When navigating to an organization page, the URL was stored in `sessionStorage`
- When returning to home, `ngOnInit` would read this sessionStorage value and automatically redirect back to the organization page

**Solution**:
Moved the `sessionStorage.setItem('repoUrl', this.repoUrl)` call to occur AFTER checking if it's an organization URL. For organization URLs, we now clear the sessionStorage before navigating:

```typescript
getRepoContributors() {
  if (this.repoUrl) {
    this.isLoading = true;

    // Check if it's an organization URL
    if (this.csvService.isOrganizationUrl(this.repoUrl)) {
      const orgName = this.csvService.extractOrgName(this.repoUrl);
      this.isLoading = false;
      // Clear sessionStorage to avoid navigation loop
      sessionStorage.removeItem('repoUrl');
      // Navigate to organization page
      this.router.navigate(['/organization', orgName]);
      return;
    }

    sessionStorage.setItem('repoUrl', this.repoUrl);
    // ... continue with repository processing
  }
}
```

### 2. Added Landing Creation Buttons (organization.component.ts)

Added three new methods to handle landing creation and GitHub navigation:

```typescript
createLandingFromRepo(repo: any): void {
  // Set the repo URL in sessionStorage and navigate to home
  // Home component will pick it up and process it automatically
  const repoUrl = repo.html_url;
  sessionStorage.setItem('repoUrl', repoUrl);
  this.router.navigate(['/']);
}

createLandingFromMember(member: any): void {
  // For members, navigate to home with their profile URL pre-filled
  const memberUrl = member.html_url;
  sessionStorage.setItem('repoUrl', memberUrl);
  this.router.navigate(['/']);
}

openInGitHub(url: string): void {
  window.open(url, '_blank');
}
```

### 3. Updated UI for Popular Repositories (organization.component.html)

**Before**: Repository names were simple links to GitHub

**After**: Added two action buttons for each repository:
- **Create Landing**: Navigates to home and automatically loads the repository's contributors
- **View on GitHub**: Opens the repository in a new tab

```html
<div class="repo-actions">
  <button mat-raised-button color="primary" (click)="createLandingFromRepo(repo)">
    <mat-icon>web</mat-icon>
    Create Landing
  </button>
  <button mat-raised-button (click)="openInGitHub(repo.html_url)" class="github-btn">
    <mat-icon>open_in_new</mat-icon>
    View on GitHub
  </button>
</div>
```

### 4. Updated UI for Members (organization.component.html)

**Before**: Member names were simple links to GitHub

**After**: Added two mini-fab buttons for each member:
- **Create Landing**: Navigates to home with the member's GitHub URL
- **View on GitHub**: Opens the member's GitHub profile in a new tab

```html
<div class="member-actions">
  <button mat-mini-fab color="primary" (click)="createLandingFromMember(member)" matTooltip="Create Landing">
    <mat-icon>web</mat-icon>
  </button>
  <button mat-mini-fab (click)="openInGitHub(member.html_url)" matTooltip="View on GitHub" class="github-btn">
    <mat-icon>open_in_new</mat-icon>
  </button>
</div>
```

### 5. Added Styling (organization.component.css)

Added CSS for the new button layouts:

```css
/* Repository Actions */
.repo-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  flex-wrap: wrap;
}

.repo-actions button {
  flex: 1;
  min-width: 120px;
}

/* Member Actions */
.member-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  margin-top: var(--spacing-sm);
}
```

## User Flow Examples

### Example 1: Creating a Landing from a Repository

1. User enters organization URL (e.g., `https://github.com/microsoft`)
2. Organization page loads showing popular repositories
3. User clicks "Create Landing" button on a repository
4. App navigates to home page
5. Home component automatically loads the repository's contributors
6. User can now browse contributors and view their landing pages

### Example 2: Navigating Back to Home

1. User is on organization page
2. User clicks "LandingVille" logo or navigates to home
3. Home page loads with empty search box (no navigation loop!)
4. User can enter a new URL

### Example 3: Creating a Landing from a Member

1. User is on organization page viewing members
2. User clicks "Create Landing" button on a member
3. App navigates to home with the member's GitHub URL pre-filled
4. User can view or modify the URL and proceed

## Testing

Navigation flow tested:
- ✅ Home → Enter org URL → Org page (works)
- ✅ Org page → Home (no navigation loop!)
- ✅ Home → Enter org URL → Org page → Home (no navigation loop!)
- ✅ Org page → Click "Create Landing" on repo → Home (URL populated)
- ✅ Org page → Click "View on GitHub" → Opens new tab

## Benefits

1. **Better UX**: Users can now navigate freely between home and organization pages
2. **Feature Complete**: Users can create landings directly from organization repositories and members
3. **Consistent Behavior**: "Create Landing" buttons behave exactly as if the URL was entered in the home search
4. **Dual Functionality**: Users can either create a landing OR view the item on GitHub directly

## Technical Notes

- The solution uses Angular Router for navigation (no page reloads)
- SessionStorage is used to pass data between components
- The fix is minimal and surgical - only the necessary logic was changed
- All navigation is handled client-side for better performance
