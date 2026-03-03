import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog – Word Game Tips, News & Insights',
    description: 'Read the FillWords blog for word puzzle tips, brain-boosting benefits, game history, and the latest updates from our community.',
    keywords: ['FillWords blog', 'word game tips', 'brain games blog', 'word puzzle articles'],
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
