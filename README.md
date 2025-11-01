# Sanity Blog

A modern, full-stack blog application built with **Next.js** and **Sanity CMS**, featuring static site generation, an integrated content studio, and a clean, responsive design powered by Tailwind CSS.

---

## 🚀 Features

- ✅ **Headless CMS** – Powered by Sanity.io with a customizable content studio
- ✅ **Static Site Generation (SSG)** – Pre-rendered pages for optimal performance and SEO
- ✅ **Content Management** – Create, edit, and manage posts, authors, and categories
- ✅ **Responsive Design** – Built with Tailwind CSS for mobile-first layouts
- ✅ **Type-Safe** – Full TypeScript support across the stack
- ✅ **React 19 & Next.js 16** – Latest React features including the React Compiler
- ✅ **Sanity Vision** – Query and test GROQ queries directly in the studio
- ✅ **Hot Module Replacement** – Fast refresh during development

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** – React framework with SSG/SSR capabilities
- **[React 19](https://react.dev/)** – Latest React with compiler optimizations
- **[TypeScript](https://www.typescriptlang.org/)** – Type-safe JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** – Utility-first CSS framework
- **[Styled Components](https://styled-components.com/)** – CSS-in-JS styling

### Backend & CMS
- **[Sanity.io v4](https://www.sanity.io/)** – Headless CMS with real-time collaboration
- **[next-sanity](https://github.com/sanity-io/next-sanity)** – Official Sanity toolkit for Next.js
- **[Sanity Vision](https://www.sanity.io/docs/the-vision-plugin)** – GROQ query testing tool
- **[Sanity Image URL](https://www.sanity.io/docs/image-url)** – Image optimization and transformations

### Development Tools
- **ESLint** – Code linting and quality checks
- **PostCSS** – CSS transformations
- **React Compiler** – Automatic optimization of React components

---

## 📁 Project Structure

```
sanity-blog/
├── pages/                    # Next.js pages (Pages Router)
│   ├── _app.tsx             # App wrapper with global styles
│   ├── _document.tsx        # Custom document
│   ├── index.tsx            # Home page - lists all posts
│   ├── blog/
│   │   └── [slug].tsx       # Dynamic blog post page
│   └── api/
│       └── hello.ts         # API route example
├── src/
│   ├── app/
│   │   └── studio/          # Sanity Studio (App Router)
│   │       └── [[...tool]]/
│   │           └── page.tsx # Studio page at /studio
│   └── sanity/
│       ├── env.ts           # Environment variables
│       ├── structure.ts     # Studio structure config
│       ├── lib/
│       │   ├── client.ts    # Sanity client instance
│       │   ├── image.ts     # Image URL builder
│       │   └── live.ts      # Live preview utilities
│       └── schemaTypes/
│           ├── index.ts     # Schema exports
│           ├── postType.ts  # Post content type
│           ├── authorType.ts # Author content type
│           ├── categoryType.ts # Category type
│           └── blockContentType.ts # Rich text blocks
├── public/                   # Static assets
├── styles/
│   └── globals.css          # Global styles & Tailwind imports
├── sanity.config.ts         # Sanity Studio configuration
├── sanity.cli.ts            # Sanity CLI configuration
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies & scripts
```

---

## 📦 Installation

### Prerequisites
- **Node.js** 18+ and npm/yarn/pnpm
- **Sanity Account** – [Sign up for free](https://www.sanity.io/)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/shivanshtiwari2005/shikhar-s-assignment.git
   cd sanity-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2025-10-31
   ```

   > **Note**: If you don't provide these, the app will use default values from `src/sanity/env.ts`.

4. **Initialize Sanity project** (optional if starting fresh)
   ```bash
   npx sanity init
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   - **Blog frontend**: [http://localhost:3000](http://localhost:3000)
   - **Sanity Studio**: [http://localhost:3000/studio](http://localhost:3000/studio)

---

## 🎯 Usage

### Content Management

1. **Access Sanity Studio**
   - Navigate to `http://localhost:3000/studio`
   - Sign in with your Sanity account

2. **Create Content**
   - **Posts**: Add blog posts with title, slug, and description
   - **Authors**: Create author profiles with bio and image
   - **Categories**: Organize posts by category
   - **Block Content**: Rich text editing with custom blocks

3. **Query Content**
   - Use **Sanity Vision** tool in the studio to test GROQ queries
   - Example query: `*[_type == "post"]{title, slug, description}`

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🗄️ Content Schemas

### Post Schema
```typescript
{
  name: 'post',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', required: true },
    { name: 'slug', type: 'slug', required: true },
    { name: 'description', type: 'text' }
  ]
}
```

### Author Schema
```typescript
{
  name: 'author',
  type: 'document',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'image', type: 'image' },
    { name: 'bio', type: 'array' }
  ]
}
```

---

## 🚢 Deployment

### Deploy to Vercel

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Set environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Deploy Sanity Studio

```bash
# Deploy studio separately (optional)
npx sanity deploy
```

---

## 🧪 Key Files Explained

| File | Purpose |
|------|---------|
| `src/sanity/lib/client.ts` | Sanity client instance for fetching content |
| `src/sanity/env.ts` | Environment variable configuration |
| `sanity.config.ts` | Studio configuration (plugins, schemas, structure) |
| `pages/index.tsx` | Home page that lists all blog posts |
| `pages/blog/[slug].tsx` | Dynamic route for individual blog posts |
| `src/app/studio/[[...tool]]/page.tsx` | Sanity Studio mounted at `/studio` |

---

## 🔧 Configuration

### Next.js Config
- **React Compiler** enabled for automatic optimizations
- **Strict Mode** enabled for development safety

### Sanity Config
- **Base Path**: `/studio`
- **Plugins**: Structure Tool, Vision Tool
- **API Version**: `2025-10-31`

