import Link from "next/link"

export default function MegaMenu({ category, menuData = [] }) {
  // First, try to find the category in the provided menuData
  const findMenuData = () => {
    if (!menuData || !menuData.length) return null

    // Find the category in the main menu data
    const menuItem = menuData.find(
      (item) =>
        item.name === category ||
        (item.label && item.label.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and") === category),
    )

    if (!menuItem || !menuItem.menu) return null

    return (
      <div className="mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {menuItem.menu.map((section) => (
            <div key={section.id}>
              <h3 className="text-lg font-semibold mb-4">{section.label}</h3>
              <ul className="space-y-2">
                {section.sub_menu &&
                  section.sub_menu.map((item) => (
                    <li key={item.id}>
                      <div className="flex items-center">
                        <Link href={item.slug || "#"} className="text-gray-600 hover:text-blue-600 text-sm">
                          {item.label}
                        </Link>
                        {item.tag && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">{item.tag}</span>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>  
          ))}
        </div>
      </div>
    )
  }

  // Try to use the dynamic menu first
  const dynamicMenu = findMenuData()
  if (dynamicMenu) return dynamicMenu

  // // Fallback for templates category

  // if (category === "templates-and-themes" || category === "templates") {
  //   return (
  //     <div className="mx-auto py-6 px-4">
  //       <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
  //         <div>
  //           <h3 className="text-lg font-semibold mb-4">WordPress Themes</h3>
  //           <ul className="space-y-2">
  //             <li>
  //               <Link href="/wordpress-themes/premium" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Premium Themes
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/wordpress-themes/free" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Free Themes
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/wordpress-themes/multipurpose" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Multipurpose Themes
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/wordpress-themes/blog" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Blog Themes
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/wordpress-themes/portfolio" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Portfolio Themes
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/wordpress-themes/creative" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Creative Themes
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/wordpress-themes/woocommerce" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 WooCommerce Themes
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/wordpress-themes/minimalist" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Minimalist Themes
  //               </Link>
  //             </li>
  //           </ul>
  //         </div>
  //         <div>
  //           <h3 className="text-lg font-semibold mb-4">Elementor Kits</h3>
  //           <ul className="space-y-2">
  //             <li>
  //               <Link href="/elementor-kits/landing-page" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Landing Page Kits
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/elementor-kits/business" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Business Kits
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/elementor-kits/personal" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Personal Kits
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/elementor-kits/creative" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Creative Kits
  //               </Link>
  //             </li>
  //           </ul>
  //         </div>
  //         <div>
  //           <h3 className="text-lg font-semibold mb-4">Jamstack Templates</h3>
  //           <ul className="space-y-2">
  //             <li>
  //               <Link href="/jamstack-templates" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Jamstack Templates
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/jamstack-templates/blog" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Blog Templates
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/jamstack-templates/portfolio" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Portfolio Templates
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/jamstack-templates/ecommerce" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 eCommerce Templates
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/jamstack-templates/saas" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 SaaS Templates
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/jamstack-templates/admin-dashboards" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Admin Dashboards
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/jamstack-templates/corporate" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Corporate Templates
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/jamstack-templates/landing-page" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Landing Page Templates
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/jamstack-templates/documentation" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Documentation Templates
  //               </Link>
  //             </li>
  //           </ul>
  //         </div>
  //         <div>
  //           <h3 className="text-lg font-semibold mb-4">Shopify Skins</h3>
  //           <ul className="space-y-2">
  //             <li>
  //               <Link href="/shopify-skins" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Shopify Skins
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/shopify-skins/fashion" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Fashion Skins
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/shopify-skins/electronics" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Electronics Skins
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/shopify-skins/furniture" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Furniture Skins
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/shopify-skins/beauty" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Beauty Skins
  //               </Link>
  //             </li>
  //             <li>
  //               <div className="flex items-center">
  //                 <Link href="/shopify-skins/jewelry" className="text-gray-600 hover:text-blue-600 text-sm">
  //                   Jewelry Skins
  //                 </Link>
  //                 <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">NEW</span>
  //               </div>
  //             </li>
  //             <li>
  //               <Link href="/shopify-skins/health" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Health Skins
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/shopify-skins/food-beverage" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Food & Beverage Skins
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/shopify-skins/sports" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Sports Skins
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/shopify-skins/multi-purpose" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Multi-purpose Skins
  //               </Link>
  //             </li>
  //           </ul>
  //         </div>
  //         <div>
  //           <h3 className="text-lg font-semibold mb-4">HTML Designs</h3>
  //           <ul className="space-y-2">
  //             <li>
  //               <Link href="/html-designs" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 HTML Designs
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/html-designs/corporate" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Corporate HTML Templates
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/html-designs/agency" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Agency HTML Templates
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/html-designs/portfolio" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Portfolio HTML Templates
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/html-designs/landing-pages" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Landing Pages
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/html-designs/one-page" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 One Page Templates
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/html-designs/blog" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Blog Templates
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/html-designs/ecommerce" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 eCommerce HTML Templates
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/html-designs/multi-page" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Multi-Page Templates
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/html-designs/admin-dashboards" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Admin Dashboards
  //               </Link>
  //             </li>
  //           </ul>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // // Fallback for plugins category
  // if (category === "plugins") {
  //   return (
  //     <div className="mx-auto py-6 px-4">
  //       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  //         <div>
  //           <h3 className="text-lg font-semibold mb-4">WordPress Plugins</h3>
  //           <ul className="space-y-2">
  //             <li>
  //               <Link href="/seo-plugins" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 SEO Plugins
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/security-plugins" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Security Plugins
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/performance-optimization" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Performance Optimization
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/contact-forms" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Contact Forms
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/page-builders" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Page Builders
  //               </Link>
  //             </li>
  //           </ul>
  //         </div>
  //         <div>
  //           <h3 className="text-lg font-semibold mb-4">PrestaShop Modules</h3>
  //           <ul className="space-y-2">
  //             <li>
  //               <Link href="/payment-gateways" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Payment Gateways
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/shipping-and-logistics" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Shipping & Logistics
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/marketing-and-promotions" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Marketing & Promotions
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/customer-support" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Customer Support
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/inventory-management" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Inventory Management
  //               </Link>
  //             </li>
  //           </ul>
  //         </div>
  //         <div>
  //           <h3 className="text-lg font-semibold mb-4">Popular Plugins</h3>
  //           <ul className="space-y-2">
  //             <li>
  //               <Link href="/popular-plugins/woocommerce" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 WooCommerce
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/popular-plugins/yoast-seo" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Yoast SEO
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/popular-plugins/elementor" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Elementor
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/popular-plugins/contact-form-7" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Contact Form 7
  //               </Link>
  //             </li>
  //             <li>
  //               <Link href="/popular-plugins/wordfence" className="text-gray-600 hover:text-blue-600 text-sm">
  //                 Wordfence Security
  //               </Link>
  //             </li>
  //           </ul>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // For other categories, return a placeholder
  return (
    <div className="mx-auto py-6 px-4">
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">Menu for {category} is coming soon</h3>
        <p className="text-gray-600">Please check back later for more options.</p>
      </div>
    </div>
  )
}
