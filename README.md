# Code Grabber

**Code Grabber** is a community-driven blogging platform designed for developers to create, share, and discover coding-related content, such as blog posts, code snippets, and tutorials. With a modern, responsive, and accessible UI, it offers features like user-specific asset management, markdown support for blog writing, and social sharing. Built with Next.js 15, TypeScript, Tailwind CSS, and Appwrite, Code Grabber provides a seamless experience for coders to engage with technical content.

## Features

- **Homepage**: A visually appealing landing page with a hero section and feature highlights (asset manager, markdown support).
- **Blogs Page**: Dynamic blog listing with infinite scroll, search by title, and clickable tags for filtering.
- **Asset Manager**: User-specific file uploads (images, PDFs, etc.) with up to 1GB free storage, restricted to authenticated users.
- **Markdown Support**: Write blogs in markdown, automatically converted to HTML.
- **Responsive Design**: Mobile-friendly layouts with Tailwind CSS (grid layouts, responsive typography).
- **Dark Mode**: Toggle between light and dark themes via a navbar switch.
- **Accessibility**: ARIA attributes, high-contrast colors (WCAG 2.1 AA), and focus management.
- **Social Sharing**: Share blog posts on Facebook, WhatsApp, and Twitter.
- **Animations**: Smooth transitions using `framer-motion` for banners, cards, and modals.
- **Performance**: Optimized with WebP images, skeleton loading, and Appwrite pagination.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with custom fonts (`Roboto Flex`, `Bebas Neue`)
- **Backend**: Appwrite (client-side SDK for database and storage)
- **Icons**: `lucide-react` for search, share, and file icons
- **Animations**: `framer-motion` for UI transitions
- **Deployment**: Vercel (assumed based on `codegrabber.vercel.app`)

## Project Structure

```
codegrabber/
├── app/
│   ├── layout.tsx              # Root layout with dark mode and fonts
│   ├── page.tsx               # Home page (landing)
│   ├── blogs/
│   │   ├── page.tsx           # Blogs page with infinite scroll and search
│   │   ├── [slug]/page.tsx    # Individual blog post page (inferred)
│   ├── assets/
│   │   ├── page.tsx           # Asset manager for user-specific files
├── public/
│   ├── Assets/
│   │   ├── code_bg_01.webp         # Hero background
│   │   ├── upload.webp             # Feature image
│   │   ├── markdown_support.webp   # Feature image
│   │   ├── placeholder.webp        # Fallback image
│   │   ├── avatar-placeholder.webp # Fallback avatar
│   │   ├── placeholder-asset.webp  # Fallback for assets
├── lib/
│   ├── appwrite.ts            # Appwrite client configuration
├── stores/
│   ├── use-asset-store.ts     # Zustand store for asset management
├── components/
│   ├── Navbar.tsx             # Navigation with theme toggle (inferred)
├── tailwind.config.ts         # Tailwind CSS configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
```

## Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v8 or higher
- **Appwrite**: Cloud or self-hosted instance with a project set up
- **Vercel**: For deployment (optional)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/SandipLow/codegrabber.git
cd codegrabber
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Appwrite project details:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
```

- Replace `your-project-id` with your Appwrite project ID.
- Obtain these from your Appwrite dashboard.

### 4. Set Up Appwrite

1. **Create a Project**: Set up a project in Appwrite Cloud or your self-hosted instance.
2. **Database**:
   - Create a database named `main`.
   - Create collections:
     - `blogposts` with attributes:
       - `title` (string, required)
       - `description` (string, required)
       - `content` (string, required)
       - `tags` (string array, optional)
       - `coverImage` (string, optional)
       - `slug` (string, required)
       - `author` (JSON, required, with `username`, `profilePicture`)
     - `assets` with attributes:
       - `name` (string, required)
       - `userId` (string, required)
       - `fileId` (string, required)
   - Set collection permissions to `read("any")`, `write("any")` for creation, with document-level permissions (`read("user:<userId>")`, `write("user:<userId>")`) for assets.
3. **Storage**:
   - Create a bucket named `assets` for file uploads.
   - Set default permissions to `read("any")`, `write("any")`, with file-level permissions set in `useAssetStore`.
4. **Authentication**:
   - Enable email/password authentication in Appwrite.
   - (Optional) Enable OAuth for social logins.

### 5. Run the Development Server

```bash
pnpm dev
```

Open http://localhost:3000 to view the app.

### 6. Build and Deploy

```bash
pnpm build
pnpm start
```

For Vercel deployment:

```bash
vercel
```

Follow Vercel’s CLI prompts to deploy.

## Usage

1. **Homepage**:

   - View the hero section with a background image and “Explore Blogs” CTA.
   - Explore features like the asset manager and markdown support.

2. **Blogs Page**:

   - Browse blog posts in a responsive grid with infinite scroll.
   - Search posts by title using the search bar.
   - Click tags to filter posts (e.g., `/blogs?tag=JavaScript`).
   - Share posts via Facebook, WhatsApp, or Twitter.

3. **Asset Manager**:

   - Log in to access the asset manager (`/assets`).
   - Upload images, PDFs, or text files (up to 1GB storage).
   - View, copy URLs/Markdown, or delete your assets.
   - Non-image files display file type icons.

4. **Authentication**:

   - Log in to create, view, or manage your assets and posts (inferred).
   - Unauthenticated users see a login prompt in the asset manager.

## Data Models

### BlogPostData

```ts
interface BlogPostData {
  id: string;
  createdAt: string;
  updatedAt: string;
  author: Partial<UserData>;
  title: string;
  description: string;
  content: string;
  tags: string[];
  coverImage: string;
  slug: string;
}
```

### UserData

```ts
interface UserData {
  id: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
}
```

### Asset

```ts
interface Asset {
  $id: string;
  name: string;
  userId: string;
  fileId: string;
}
```

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- **Next.js**: For the powerful App Router and image optimization.
- **Tailwind CSS**: For responsive and customizable styling.
- **Appwrite**: For backend database and storage.
- **framer-motion**: For smooth UI animations.
- **lucide-react**: For modern icons.