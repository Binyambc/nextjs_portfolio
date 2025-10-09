# Portfolio Website

A modern, responsive portfolio website built with Next.js and powered by Drupal CMS. This is a school project demonstrating headless CMS architecture using Drupal as the content management system and Next.js as the frontend framework. The project showcases projects, pages, and content managed through Drupal's JSON:API, with a custom contact form that integrates with Drupal's contact system.

## Features

- **Headless CMS Integration**: All content (projects, pages, images) is managed through Drupal
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Dark/Light Theme**: Toggle between themes with persistent user preference
- **Dynamic Routing**: Automatic page generation based on Drupal content
- **Image Galleries**: Multi-image support with navigation for projects
- **Contact Form**: Custom contact form that sends data to Drupal
- **SEO Optimized**: Server-side rendering with Next.js

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS with custom CSS variables
- **CMS**: Drupal with JSON:API

## Project Structure

```
src/
├── app/
│   ├── _components/          # Reusable components
│   │   ├── Footer.tsx       # Site footer with social links
│   │   ├── ImageGallery.tsx # Multi-image gallery component
│   │   ├── Navigation.tsx   # Main navigation
│   │   └── ThemeToggle.tsx  # Dark/light theme toggle
│   ├── api/                 # API routes
│   │   ├── contact/        # Contact form endpoint
│   │   ├── pages/          # Dynamic pages API
│   │   ├── projects/       # Projects API
│   │   └── test-drupal/    # Drupal connection test
│   ├── (site)/             # Dynamic site pages
│   ├── contact/            # Contact page
│   ├── projects/           # Projects pages
│   └── globals.css         # Global styles
├── lib/
│   └── drupal.ts           # Drupal integration utilities
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- Drupal site with JSON:API enabled
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nextjs_portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_DRUPAL_BASE_URL=http://your-drupal-site.com
   DRUPAL_JSONAPI_USERNAME=your-username
   DRUPAL_JSONAPI_PASSWORD=your-password
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Customization

### Theme Colors

The project uses CSS custom properties for theming. Edit `src/app/globals.css`:

```css
:root {
  --color-gunmetal: #122932;
  --color-paynes_gray: #576066;
  --color-mountbatten_pink: #95818d;
  --color-thistle: #e3c0d3;
  --color-almost-white: #fefefe;
}
```

### Drupal Content Types

The app expects these Drupal content types:

- **Projects**: `node--projects` with fields:
  - `title` (text)
  - `field_slug` (text) - **Required for frontend display**
  - `body` (text with summary)
  - `field_image` (image)
  - `field_category` (taxonomy reference)

- **Pages**: `node--pages` with fields:
  - `title` (text)
  - `field_slug` (text) - **Required for frontend display**
  - `body` (text with summary)
  - `field_image` (image)

## API Endpoints

- `GET /api/projects` - List all projects
- `GET /api/projects/[slug]` - Get specific project
- `GET /api/pages/[slug]` - Get specific page
- `POST /api/contact` - Submit contact form
- `GET /api/test-drupal` - Test Drupal connection

## Pages

- **Home** (`/`) - Dynamic home page from Drupal
- **Projects** (`/projects`) - Project listing with filtering
- **Project Detail** (`/projects/[slug]`) - Individual project pages
- **Category Pages** (`/projects/category/[category]`) - Filtered by category
- **Dynamic Pages** (`/[slug]`) - Any page from Drupal
- **Contact** (`/contact`) - Contact form

## Key Features Explained

### Drupal Integration

All content is fetched from Drupal using JSON:API. The `lib/drupal.ts` file handles:
- API authentication
- Data fetching and caching
- Image URL resolution
- Category relationships

### Contact Form

The contact form (`/contact`) sends data to Drupal's contact system:
- Client-side validation
- Server-side processing
- Drupal integration via JSON:API
- Error handling and user feedback

### Image Handling

- Automatic image optimization
- Multiple image support for projects
- Responsive image loading
- Alt text support for accessibility

## Troubleshooting

### Common Issues

1. **Projects not showing**: Ensure all projects have a `field_slug` value in Drupal
2. **Images not loading**: Check Drupal file permissions and CORS settings
3. **Contact form not working**: Verify Drupal contact module is enabled
4. **API errors**: Check `NEXT_PUBLIC_DRUPAL_BASE_URL` environment variable

### Testing Drupal Connection

Visit `/api/test-drupal` to test your Drupal connection and see available endpoints.

## Content Management

### Adding New Projects

1. Create a new project in Drupal
2. **Important**: Add a slug in the `field_slug` field
3. Add content, images, and categories
4. Publish the project
5. It will appear on the frontend automatically

### Adding New Pages

1. Create a new page in Drupal
2. **Important**: Add a slug in the `field_slug` field
3. Add content and images
4. Publish the page
5. Access via `/[slug]` URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Drupal](https://drupal.org/)