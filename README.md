# 🌍 Succevia Hub - Global Marketplace

**The world's trusted hub for jobs, scholarships, and buying & selling items safely via WhatsApp.**

![Succevia Hub](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.98.0-green?style=flat-square&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwindcss)
![PWA](https://img.shields.io/badge/PWA-Enabled-purple?style=flat-square)

**Live:** [succeviahub.vercel.app](https://succeviahub.vercel.app)

## ✨ Overview

Succevia Hub is a modern, global marketplace that connects buyers and sellers worldwide. The platform facilitates safe transactions through WhatsApp integration and provides opportunities for jobs and scholarships across 60+ countries.

## 🚀 Key Features

### 🛍️ **Global Marketplace**
- **60+ Countries Support** - Buy and sell items worldwide
- **Instant Publishing** - Listings go live immediately without admin approval
- **Country-specific Filtering** - Find items from specific countries
- **Category-based Organization** - Electronics, Vehicles, Fashion, Property, and more
- **Advanced Search** - Search across titles and descriptions
- **Image Optimization** - Cloudinary integration with automatic compression

### 💼 **Opportunities Platform**
- **Global Job Listings** - Browse jobs from around the world
- **International Scholarships** - Find educational opportunities globally
- **Application Tracking** - Direct links to application portals
- **Deadline Management** - Never miss important dates

### 📱 **Modern User Experience**
- **Progressive Web App (PWA)** - Install on mobile devices
- **Responsive Design** - Works perfectly on all screen sizes
- **Real-time Filtering** - Instant results with smooth animations
- **WhatsApp Integration** - Direct communication with sellers/employers
- **Optional Descriptions** - Quick listing creation with minimal requirements

### 🎨 **Stunning Visual Design**
- **Custom Animations** - Smooth hover effects and micro-interactions
- **Gradient Designs** - Modern glassmorphism and gradient effects
- **Loading States** - Shimmer effects for better UX
- **Focus Accessibility** - WCAG compliant focus indicators

### 🔧 **Technical Excellence**
- **TypeScript** - Full type safety throughout the application
- **Server-side Rendering** - Optimized for SEO and performance
- **Image Compression** - Automatic optimization for faster loading
- **Secure Authentication** - PIN-based seller authentication
- **Database Optimization** - Efficient queries with pagination

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PWA**: [Next PWA](https://github.com/shadowwalker/next-pwa)
- **Image Processing**: [Browser Image Compression](https://github.com/Donaldcwl/browser-image-compression)
- **Image Storage**: [Cloudinary](https://cloudinary.com/)

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Cloudinary account

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/succevia-hub.git
cd succevia-hub
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset

# Security
SELLER_PIN_SECRET=your_secure_random_string_for_pin_hashing
ADMIN_PASSWORD=your_secure_admin_password

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_google_analytics_id

# SEO
GOOGLE_SITE_VERIFICATION=your_google_site_verification_code
```

### 4. Database Setup

#### Supabase Tables

Create the following tables in your Supabase database:

```sql
-- Listings table
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT, -- Optional field
  price TEXT NOT NULL,
  category TEXT NOT NULL,
  image_urls TEXT[] NOT NULL,
  seller_whatsapp TEXT NOT NULL,
  seller_pin_hash TEXT NOT NULL,
  location TEXT NOT NULL, -- Now stores country names
  is_negotiable BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT TRUE, -- Auto-approved
  is_sold BOOLEAN DEFAULT FALSE,
  payment_status TEXT
);

-- Opportunities table
CREATE TABLE opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('job', 'scholarship')),
  organization TEXT NOT NULL,
  location TEXT NOT NULL,
  deadline TEXT,
  requirements TEXT,
  application_url TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- PIN Reset Requests table
CREATE TABLE pin_reset_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  listing_id UUID REFERENCES listings(id),
  seller_whatsapp TEXT NOT NULL,
  reason TEXT,
  reset_token TEXT NOT NULL,
  status TEXT DEFAULT 'pending'
);
```

#### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE pin_reset_requests ENABLE ROW LEVEL SECURITY;

-- Policies for listings (public read)
CREATE POLICY "Listings are viewable by everyone" ON listings
  FOR SELECT USING (is_approved = true);

-- Policies for opportunities (public read)
CREATE POLICY "Opportunities are viewable by everyone" ON opportunities
  FOR SELECT USING (is_active = true);
```

### 5. Cloudinary Setup

1. Create a Cloudinary account
2. Get your cloud name from the dashboard
3. Create an upload preset:
   - Go to Settings > Upload
   - Create a new upload preset
   - Set it to "Unsigned"
   - Configure auto-optimization settings

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### For Sellers
1. **Create Listings**: Upload photos, set prices, optionally add descriptions
2. **Global Reach**: Sell to buyers in 60+ countries
3. **Instant Publishing**: Listings go live immediately
4. **Manage Inventory**: Mark items as sold, relist items
5. **WhatsApp Integration**: Communicate directly with buyers

### For Buyers
1. **Browse Globally**: Filter by country, category, availability
2. **Search & Filter**: Find exactly what you're looking for
3. **Direct Contact**: Message sellers via WhatsApp
4. **Safe Transactions**: Trade with confidence

### For Job Seekers
1. **Global Opportunities**: Browse jobs and scholarships worldwide
2. **Filter by Type**: Jobs vs scholarships
3. **Direct Applications**: Apply through organization portals
4. **Deadline Tracking**: Never miss application deadlines

## 🔧 Configuration

### Supported Countries

The platform supports 60+ countries including:
- United States, United Kingdom, Canada
- Germany, France, Spain, Italy
- Nigeria, Ghana, Kenya, South Africa
- India, China, Japan, Australia
- Brazil, Argentina, Mexico
- And many more...

Countries can be modified in `types/index.ts`:

```typescript
export const GLOBAL_COUNTRIES = [
  // Add your countries here
];
```

### Categories

Product categories can be customized in `types/index.ts`:

```typescript
export const CATEGORIES: Category[] = [
  "All",
  "Electronics",
  "Vehicles",
  "Fashion",
  "Property",
  "Other"
];
```

## 📡 API Endpoints

### Listings
- `GET /api/listings/paginate` - Get paginated listings with filters
- `POST /api/listings/create` - Create new listing (auto-approved)
- `PATCH /api/listings/seller-update` - Update listing
- `PATCH /api/listings/seller-sold` - Mark as sold
- `POST /api/listings/seller-relist` - Relist item

### Opportunities
- `GET /api/opportunities/list` - Get opportunities
- `POST /api/opportunities/create` - Create opportunity (admin)
- `PATCH /api/opportunities/update` - Update opportunity (admin)

### Admin (Optional)
- `POST /api/admin/auth` - Admin authentication
- `POST /api/listings/bulk-approve` - Bulk approve listings

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production

Ensure all environment variables are configured:

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
SELLER_PIN_SECRET
ADMIN_PASSWORD
NEXT_PUBLIC_GA_MEASUREMENT_ID
GOOGLE_SITE_VERIFICATION
```

## 🎨 Customization

### Colors
Update the color scheme in `app/globals.css`:

```css
:root {
  --primary: #25D366; /* WhatsApp Green */
  --primary-dark: #1da851;
  --secondary: #002147; /* Navy Blue */
}
```

### Animations
Custom animations are defined in `app/globals.css`:
- `animate-spin-slow` - Slow spinning animation
- `animate-float` - Floating effect
- `animate-glow` - Glowing effect
- `shimmer` - Loading shimmer effect

## 🔒 Security Features

- **PIN-based Authentication**: Secure seller verification
- **Hash Protection**: All PINs are securely hashed
- **Input Validation**: All user inputs are sanitized
- **Rate Limiting**: Protected against spam and abuse
- **HTTPS Only**: Secure data transmission
- **Auto-moderation**: Built-in content filtering

## 📈 Performance

- **Lighthouse Score**: 95+ on all metrics
- **Image Optimization**: Automatic compression and format conversion
- **Server-side Rendering**: Optimized for SEO and initial load
- **Caching**: Intelligent caching strategies
- **Bundle Size**: Optimized with tree shaking
- **PWA Features**: Offline support and app-like experience

## 🔧 Troubleshooting

### Common Issues

**Build Errors**
- Check environment variables are properly set
- Ensure database schema matches the application

**Image Upload Issues**
- Verify Cloudinary configuration
- Check upload preset settings

**Database Connection**
- Confirm Supabase URL and keys
- Check RLS policies are correctly configured

**Country Filter Not Working**
- Ensure location field contains country names
- Verify API endpoints include country parameter

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design
- Test across different countries

## 🗺️ Roadmap

- [ ] Payment integration (PayPal, Stripe, local options)
- [ ] Seller ratings & reviews system
- [ ] Wishlist functionality
- [ ] Mobile app (React Native)
- [ ] Advanced filtering (price range, condition)
- [ ] Multi-language support
- [ ] Cryptocurrency payment options
- [ ] AI-powered recommendations
- [ ] Video listings support
- [ ] Shipping cost calculator
- [ ] Seller analytics dashboard

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by [Butty Saylee](https://butty-portfolio.vercel.app/)
- Powered by Next.js and Supabase
- Images optimized by Cloudinary
- Icons by Lucide React
- Inspired by global commerce needs

## 📞 Support

For support and inquiries:
- **Website**: [succeviahub.vercel.app](https://succeviahub.vercel.app)
- **Developer**: [Butty Saylee Portfolio](https://butty-portfolio.vercel.app/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/succevia-hub/issues)

## 📊 Stats

- **60+ Countries** supported
- **Auto-approval** for instant publishing
- **PWA enabled** for app-like experience
- **TypeScript** for type safety
- **Responsive design** for all devices
- **SEO optimized** for global reach

---

<div align="center">
  <strong>🌍 Connecting the world through commerce 🌍</strong>
  <br />
  <sub>Made with ❤️ for the global community</sub>
</div>