# LandingVille

A powerful Angular application that transforms GitHub repositories and organizations into beautiful, interactive landing pages showcasing developers and their projects.

## ✨ Features

### 🏢 Organization & Repository Support
- **Dual Mode**: Automatically detects and handles both GitHub organization and repository URLs
- **Organization View**: Displays all members, repositories, and aggregated statistics
- **Repository View**: Shows contributors and project details

### 👤 Enhanced Developer Profiles
- **Real GitHub Statistics**: Live data including repositories, followers, and contributions
- **Technology Stack**: Visual breakdown of programming languages with percentages
- **GitHub Experience**: Account age and activity metrics
- **Contact Information**: Email, website, location, company, and social media links
- **Downloadable CV**: Export developer profiles as text files

### 📊 Accurate KPIs
- All statistics pulled directly from GitHub API
- No fictional or placeholder data
- Real-time metrics for repositories, contributors, and projects

### 📦 Repository Details
Each project card expands to show:
- **Languages**: Top programming languages with color-coded percentage bars
- **Topics**: All repository tags and topics
- **Releases**: Recent releases with dates
- **Contributors**: Top contributors with avatars

### 🌐 Multi-language Support
- Spanish (Español)
- English
- Easy to extend with additional languages

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ManuFerrer094/landingville.git
cd landingville
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm start
```

4. Navigate to `http://localhost:4200/`

### Build

Build the project for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📖 Usage

### View Organization Members
1. Enter an organization URL: `https://github.com/turing-challenge`
2. Browse all organization members
3. Click on any member to view their detailed profile

### View Repository Contributors
1. Enter a repository URL: `https://github.com/facebook/react`
2. See all contributors
3. Explore individual developer profiles

### Explore Developer Profiles
- View comprehensive GitHub statistics
- See technology stack breakdown
- Download profile as CV
- View all public repositories
- Expand projects to see languages, releases, and contributors

## 🛠️ Technology Stack

- **Framework**: Angular 15
- **UI Components**: Angular Material
- **Styling**: Custom CSS with CSS variables
- **HTTP Client**: Angular HttpClient
- **State Management**: RxJS
- **API**: GitHub REST API v3

## 📁 Project Structure

```
src/
├── app/
│   ├── home/                 # Home page component
│   ├── landing/              # Developer profile page
│   ├── portfolio/            # Projects showcase
│   ├── services/
│   │   └── i18n.service.ts  # Internationalization
│   ├── csv.service.ts        # GitHub API service
│   └── app-routing.module.ts
├── assets/                   # Static assets
└── styles.css               # Global styles
```

## 🔌 API Integration

The application uses the following GitHub API endpoints:

- `/users/{username}` - User profile data
- `/users/{username}/repos` - User repositories
- `/repos/{owner}/{repo}/languages` - Repository languages
- `/repos/{owner}/{repo}/contributors` - Repository contributors
- `/repos/{owner}/{repo}/releases` - Repository releases
- `/repos/{owner}/{repo}/topics` - Repository topics
- `/orgs/{org}/members` - Organization members
- `/orgs/{org}/repos` - Organization repositories

## 🎨 Customization

### Theme Colors
Edit CSS variables in `src/styles.css`:
```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
  /* ... more variables */
}
```

### Add Translations
Edit `src/app/services/i18n.service.ts`:
```typescript
private translations: Translations = {
  'key.name': { es: 'Spanish', en: 'English' }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

- **ManuFerrer094** - [GitHub Profile](https://github.com/ManuFerrer094)

## 🙏 Acknowledgments

- GitHub API for providing comprehensive developer data
- Angular team for the excellent framework
- Material Design for UI components

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ using Angular
