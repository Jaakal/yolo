import { useLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { cabin } from '@/utils/fontLoader';

export async function generateMetadata() {
  const t = await getTranslations('general');

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    ['theme-color']: '#161616',
  };
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const locale = useLocale();

  // Show a 404 error if the user requests an unknown locale
  if (params?.locale !== locale) {
    notFound();
  }

  return (
    <html lang={locale.split('-')[0]}>
      <body className={cabin.variable}>{children}</body>
    </html>
  );
}
