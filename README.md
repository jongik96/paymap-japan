# PayMap Japan

Payment Method Review Service for Japanese Restaurants

## Features

- 🗺️ **Google Maps Integration** - Interactive map with restaurant locations
- 🔍 **Restaurant Search** - Find restaurants using Google Places API
- 💳 **Payment Method Filtering** - Filter by available payment methods
- ✍️ **Anonymous Reviews** - Share payment experiences anonymously
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Google Maps JavaScript API
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
4. Run development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps JavaScript API key

## Deployment

This project is automatically deployed to Vercel on every push to the main branch.

---

**Last updated**: January 2025
