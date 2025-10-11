# Organization Page 404 Fix

## Problem
Organization pages were returning 404 errors when directly accessed on Netlify (e.g., `https://landingville.netlify.app/organization/microsoft`).

## Root Cause
The issue had two components:

1. **Missing Netlify Redirect Configuration**: When deploying a Single Page Application (SPA) like Angular to Netlify, the server doesn't know how to handle routes like `/organization/microsoft`. Without proper configuration, Netlify tries to find a physical file at that path and returns a 404 error.

2. **Improper Navigation Method**: The application was using `window.location.href` for navigation, which causes a full page reload instead of using Angular's client-side routing.

## Solution

### 1. Added Netlify `_redirects` File
Created `src/_redirects` with the following content:
```
/*    /index.html   200
```

This tells Netlify to redirect all requests to `index.html` with a 200 status code, allowing Angular to handle the routing on the client side.

### 2. Updated Build Configuration
Modified `angular.json` to include `src/_redirects` in the assets array for both build and test configurations. This ensures the file is copied to the `dist/landcorp` folder during the build process.

### 3. Fixed Navigation in HomeComponent
Changed the navigation method from:
```typescript
window.location.href = `/organization/${orgName}`;
```

To:
```typescript
this.router.navigate(['/organization', orgName]);
```

This change:
- Uses Angular's Router service for proper client-side navigation
- Avoids full page reloads
- Ensures proper state management within the Angular application

## Files Modified

1. **src/_redirects** (new file)
   - Contains Netlify redirect rules for SPA routing

2. **angular.json**
   - Added `src/_redirects` to the assets array in both build and test configurations

3. **src/app/home/home.component.ts**
   - Added Router import
   - Injected Router service in constructor
   - Changed navigation from `window.location.href` to `this.router.navigate()`

## Testing

After deployment to Netlify, the following should work:

1. **Direct Navigation**: Accessing `https://landingville.netlify.app/organization/microsoft` directly in the browser should load the organization page without a 404 error.

2. **Search Navigation**: Entering `https://github.com/microsoft` in the search box on the home page should navigate to the organization page.

3. **Browser Back/Forward**: Using browser navigation buttons should work properly with the organization pages.

4. **Refresh**: Refreshing the page while on an organization route (e.g., `/organization/microsoft`) should reload the same page instead of showing a 404 error.

## Verification Steps

1. Build the application:
   ```bash
   npm run build
   ```

2. Verify that `_redirects` file exists in the dist folder:
   ```bash
   ls -la dist/landcorp/_redirects
   cat dist/landcorp/_redirects
   ```

3. Deploy to Netlify and test the organization pages:
   - Direct URL access: `https://landingville.netlify.app/organization/microsoft`
   - Navigation from home page
   - Browser refresh on organization page

## Expected Behavior

- ✅ Organization pages load correctly when accessed directly
- ✅ No 404 errors for organization routes
- ✅ Smooth client-side navigation without page reloads
- ✅ Browser history works correctly
- ✅ Page refresh preserves the current route

## Additional Notes

The `_redirects` file is a Netlify-specific configuration. For other hosting platforms:
- **Firebase**: Use `firebase.json` with rewrite rules
- **AWS S3/CloudFront**: Configure error document to `index.html`
- **Apache**: Use `.htaccess` with rewrite rules
- **Nginx**: Configure `try_files` directive
