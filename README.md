# Gbana Market 🛍️

A modern two-sided marketplace platform for buying and selling items in Liberia. Sellers can list items with multiple images, and buyers can browse, search, and contact sellers directly via WhatsApp.

**Live:** [gbanamarket.vercel.app](https://gbanamarket.vercel.app)

## Features

✅ **For Sellers:**
- List items with up to 5 images
- Set prices and mark as negotiable
- Real-time notifications via WhatsApp
- Track listing history

✅ **For Buyers:**
- Browse marketplace with categories (Electronics, Vehicles, Fashion, etc.)
- Search and filter by location and category
- View detailed product information with image carousel
- Contact sellers directly on WhatsApp
- Share listings with others

✅ **For Admins:**
- Review and approve pending listings
- Bulk approve/reject listings
- Edit listing details
- Mark items as sold
- View marketplace statistics

## Tech Stack

**Frontend:**
- [Next.js 15](https://nextjs.org) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Icons

**Backend & Database:**
- [Supabase](https://supabase.com/) - PostgreSQL database + Auth
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) - Backend

**Storage & Services:**
- [Cloudinary](https://cloudinary.com/) - Image hosting & optimization
- [WhatsApp API](https://www.whatsapp.com/business) - Seller notifications

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Cloudinary account

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/gbana-market.git
cd gbana-market
npm install
```

### 2. Setup Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset

# Admin
ADMIN_PASSWORD=your_secure_admin_password

# Contact Information
NEXT_PUBLIC_ADMIN_WHATSAPP=+231XXXXXXXXX
NEXT_PUBLIC_MOMO_NUMBER=+231XXXXXXXXX
```

See [.env.example](.env.example) for all required variables.

### 3. Setup Database

1. Create a new Supabase project
2. Run the SQL from [schema.sql](schema.sql) in your Supabase SQL Editor
3. Update your `.env.local` with the Supabase credentials

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
gbana-market/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin-portal/      # Admin dashboard
│   ├── listings/          # Public listing pages
│   ├── sell/              # Seller listing form
│   └── page.tsx           # Homepage
├── components/            # React components
├── lib/                   # Utilities (Supabase client)
├── types/                 # TypeScript types
├── public/                # Static assets
├── schema.sql             # Database schema
└── package.json           # Dependencies
```

## Database Schema

### Listings Table
- `id` - UUID primary key
- `title` - Item title
- `description` - Item description
- `price` - Price (text for flexibility)
- `category` - Category (Electronics, Vehicles, Fashion, Property, Home)
- `image_urls` - Array of image URLs (supports up to 5 images)
- `seller_whatsapp` - Seller's WhatsApp number
- `location` - Liberian location
- `is_negotiable` - Price negotiation allowed
- `is_approved` - Listed publicly
- `is_sold` - Marked as sold
- `payment_status` - Payment tracking
- `created_at` - Timestamp

## Environment Variables

See [.env.example](.env.example) and [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md) for details on:
- Which variables are safe to expose (`NEXT_PUBLIC_*`)
- Which must remain secret (backend only)
- Security best practices

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Select your repository
4. Add all environment variables from `.env.example`
5. Click Deploy

See [Vercel Deployment Docs](https://vercel.com/docs/frameworks/nextjs) for details.

## Security

⚠️ **Before deploying**, read [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md) for:
- Environment variable setup
- Sensitive data protection
- Admin authentication
- Pre-deployment verification

## API Routes

### Admin Authentication
- `POST /api/admin/auth` - Authenticate admin with password

### Listings Management
- `POST /api/listings/approve/:id` - Approve listing
- `POST /api/listings/bulk-approve` - Bulk approve listings
- `POST /api/listings/reject` - Reject listing
- `PUT /api/listings/update` - Update listing
- `POST /api/listings/sold/:id` - Mark as sold
- `POST /api/listings/relist/:id` - Relist sold item

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

Need help? Open an issue on GitHub or contact the team.

## Roadmap

- [ ] Payment integration (MTN MoMo, Orange Money)
- [ ] Seller ratings & reviews
- [ ] Wishlist functionality
- [ ] Mobile app (React Native)
- [ ] Item inspections & delivery options
- [ ] Marketing dashboard for sellers

---

**Made with ❤️ for Liberia** 🇱🇷

