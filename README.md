# TeamForge AI - Intelligent Project Management

TeamForge AI is a full-stack AI-powered project management platform built with Next.js, MongoDB, and Tailwind CSS.

## Features

- **AI-Powered Onboarding**: Parses GitHub profiles and Resumes to build dynamic skill maps.
- **Smart Task Allocation**: AI Chatbot analyzes project requirements and assigns tasks based on team member skills.
- **Real-time Collaboration**: Team chat with integrated AI project manager.
- **Visual Analytics**: Skill radar charts and project tracking dashboards.
- **Premium UI**: iOS-style Glassmorphism, Dark Mode, and smooth Framer Motion animations.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXTAUTH_SECRET=your_random_secret_string
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Visit**:
   Open [http://localhost:3000](http://localhost:3000) for the landing page.
   Go to `/dashboard` after signing in.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB (Mongoose)
- **Auth**: NextAuth.js (Google OAuth/Credentials)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
