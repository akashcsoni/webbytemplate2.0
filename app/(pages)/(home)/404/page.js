import PageNotFound from "@/components/PageNotFound/PageNotFound";
import { notFound } from 'next/navigation';

export const metadata = {
  title: '404 - Page Not Found | WebbyTemplate',
  description: 'The page you are looking for does not exist.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPage() {
  // Use notFound() to ensure proper 404 status code
  notFound();
}

