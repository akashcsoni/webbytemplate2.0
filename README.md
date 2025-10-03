# WebbyTemplate 2.0

A modern, feature-rich e-commerce template built with Next.js 15, designed for digital product marketplaces. This template provides a complete solution for selling web templates, themes, and digital products with advanced features like shopping cart, wishlist, user authentication, and more.

## 🚀 Features

### Core Features
- **Modern E-commerce Platform** - Complete digital marketplace solution
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Next.js 15** - Latest Next.js with App Router and Turbopack
- **Strapi CMS Integration** - Headless CMS for content management
- **User Authentication** - Login/signup with session management
- **Shopping Cart** - Persistent cart with cookie-based storage
- **Wishlist System** - Save favorite products for later
- **Product Management** - Advanced product creation and management
- **Search & Filtering** - Powerful search functionality
- **Payment Integration** - Ready for payment gateway integration
- **SEO Optimized** - Built-in SEO features and meta tags

### UI/UX Features
- **Dark/Light Theme** - Theme switching capability
- **Mega Menu** - Advanced navigation with dropdown menus
- **Product Galleries** - Image swipers and galleries
- **Review System** - Product reviews and ratings
- **Author Dashboard** - Seller/author management panel
- **Blog System** - Content marketing capabilities
- **FAQ Section** - Customer support features

### Technical Features
- **TypeScript Support** - Full TypeScript implementation
- **API Routes** - Custom API endpoints
- **Middleware** - Request handling and authentication
- **Context Providers** - State management with React Context
- **Form Validation** - Comprehensive form handling
- **Error Handling** - Robust error management
- **Loading States** - Skeleton loaders and loading indicators

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18.3.1** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **HeroUI/NextUI** - Component library
- **Framer Motion** - Animation library
- **Swiper** - Touch slider component

### Backend & CMS
- **Strapi CMS** - Headless content management
- **API Routes** - Next.js API endpoints
- **Axios** - HTTP client for API calls

### Development Tools
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundler

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd webbytemplate2.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_STRAPI_URL=https://studio.webbytemplate.com
   STRAPI_TOKEN=your_strapi_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
webbytemplate2.0/
├── app/                          # Next.js App Router
│   ├── (pages)/                 # Route groups
│   │   ├── (home)/             # Home page routes
│   │   └── (author)/           # Author dashboard routes
│   ├── api/                    # API routes
│   └── providers.jsx           # Context providers
├── components/                  # React components
│   ├── header/                 # Header components
│   ├── footer/                 # Footer components
│   ├── product/                # Product-related components
│   ├── pageSections/           # Page section components
│   └── ui/                     # UI components
├── contexts/                    # React contexts
│   ├── AuthContext.js          # Authentication context
│   ├── CartContext.js          # Shopping cart context
│   ├── WishListContext.js      # Wishlist context
│   └── ThemeContext.js         # Theme context
├── lib/                        # Utility libraries
│   ├── api/                    # API utilities
│   ├── hooks/                  # Custom hooks
│   └── utils.js                # General utilities
├── config/                     # Configuration files
│   ├── site.js                 # Site configuration
│   ├── theamConfig.js          # Theme configuration
│   └── fonts.js                # Font configuration
├── public/                     # Static assets
│   ├── images/                 # Image assets
│   └── logo/                   # Logo files
└── styles/                     # Global styles
    └── globals.css             # Global CSS
```

## 🔧 Configuration

### Strapi CMS Setup
The template integrates with Strapi CMS for content management. Configure your Strapi instance with the following content types:

- **Pages** - Home page content
- **Products** - Digital products
- **Categories** - Product categories
- **Users** - User management
- **Orders** - Order management
- **Reviews** - Product reviews

### Theme Configuration
Update `config/theamConfig.js` with your Strapi configuration:

```javascript
const URL = "https://your-strapi-instance.com"
const STRAPI_URL = `${URL}/api`
const themeConfig = {
    TOKEN: "your_strapi_token",
    CATEGORY_API_ROUTE: 'categories'
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The template can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📱 Features Overview

### Shopping Experience
- **Product Browsing** - Browse products by category
- **Product Details** - Detailed product pages with galleries
- **Search** - Advanced search functionality
- **Filters** - Category and tag-based filtering
- **Reviews** - Customer reviews and ratings

### User Management
- **Authentication** - Secure login/signup
- **User Profiles** - User account management
- **Order History** - Purchase history tracking
- **Downloads** - Digital product downloads

### Seller Features
- **Author Dashboard** - Seller management panel
- **Product Creation** - Advanced product creation forms
- **Sales Analytics** - Sales tracking and analytics
- **Order Management** - Order processing

### Admin Features
- **Content Management** - CMS integration
- **User Management** - User administration
- **Order Processing** - Order fulfillment
- **Analytics** - Sales and user analytics

## 🎨 Customization

### Styling
- Modify `styles/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.js`
- Customize component styles in individual component files

### Content
- Configure content through Strapi CMS
- Update site configuration in `config/site.js`
- Modify navigation and menu items

### Features
- Add new components in `components/` directory
- Create new pages in `app/` directory
- Extend API routes in `app/api/` directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

## 🔄 Updates

Stay updated with the latest features and improvements:
- Watch the repository for updates
- Check the changelog for version history
- Follow the development roadmap

---

**WebbyTemplate 2.0** - Building beautiful digital marketplaces with modern web technologies.