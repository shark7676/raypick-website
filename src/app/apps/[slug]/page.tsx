import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apps, getApp } from '../../../data/apps';
import AppDetail from '../../../components/AppDetail';

export function generateStaticParams() {
  return apps.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const app = getApp((await params).slug);
  if (!app) return {};
  const title = `${app.name.ko} — ${app.tagline.ko}`;
  return {
    title,
    description: app.description.ko,
    openGraph: { title, description: app.description.ko, images: [{ url: app.icon }] },
  };
}

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getApp(slug)) notFound();
  return <AppDetail slug={slug} />;
}
