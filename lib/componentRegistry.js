// Component registry for reliable imports
export const componentRegistry = {
  // Blog-specific components
  'RichText': () => import('@/components/pageSections/RichText'),
  'SingleBlogImage': () => import('@/components/pageSections/SingleBlogImage'),
  'SingleBlogHeading': () => import('@/components/pageSections/SingleBlogHeading'),
  'SingleBlogText': () => import('@/components/pageSections/SingleBlogText'),
  
  // FAQ and other components
  'FaqSection': () => import('@/components/pageSections/FaqSection'),
  
  // All other page sections
  'AuthoreBenefits': () => import('@/components/pageSections/AuthoreBenefits'),
  'BecomeAuthore': () => import('@/components/pageSections/BecomeAuthore'),
  'BlogsList': () => import('@/components/pageSections/BlogsList'),
  'CategoryHome': () => import('@/components/pageSections/CategoryHome'),
  'CategoryTagList': () => import('@/components/pageSections/CategoryTagList'),
  'CreateProductForm': () => import('@/components/pageSections/CreateProductForm'),
  'CreateUserForm': () => import('@/components/pageSections/CreateUserForm'),
  'DashboardList': () => import('@/components/pageSections/DashboardList'),
  'DigitalSales': () => import('@/components/pageSections/DigitalSales'),
  'DownloadList': () => import('@/components/pageSections/DownloadList'),
  'FeatureProduct': () => import('@/components/pageSections/FeatureProduct'),
  'HomeHero': () => import('@/components/pageSections/HomeHero'),
  'ListProduct': () => import('@/components/pageSections/ListProduct'),
  'OrderList': () => import('@/components/pageSections/OrderList'),
  'ProductsList': () => import('@/components/pageSections/ProductsList'),
  'Review': () => import('@/components/pageSections/Review'),
  'ReviewModel': () => import('@/components/pageSections/ReviewModel'),
  'ServiceSection': () => import('@/components/pageSections/ServiceSection'),
  'SubscribeSection': () => import('@/components/pageSections/SubscribeSection'),
  'SupportList': () => import('@/components/pageSections/SupportList'),
  'TopAuthor': () => import('@/components/pageSections/TopAuthor')
};

// Helper function to load component
export const loadComponent = async (componentName) => {
  const loader = componentRegistry[componentName];
  if (loader) {
    try {
      const module = await loader();
      return module.default;
    } catch (error) {
      console.error(`Failed to load component "${componentName}":`, error);
      return null;
    }
  }
  return null;
};
