import PageNotFound from "@/components/PageNotFound/PageNotFound";

export default function NotFound() {
  return <PageNotFound />;
}

export const metadata = {
  title: '404 - Page Not Found | WebbyTemplate',
  description: 'The page you are looking for does not exist.',
  robots: {
    index: false,
    follow: false,
  },
};

