import '@/shared/styles/index.scss';
import Header from '@/shared/components/Header';
import { RootStoreProvider } from '@/shared/store/RootStore';
import '@/shared/config/configureMobX'; 
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['400', '500', '700'], 
  subsets: ['latin'],
  variable: '--font-roboto'
});

const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('app-theme') || 'light';
      document.body.setAttribute('data-theme', theme);
    } catch (e) {}
  })();
`;

export const metadata = {
  title: 'Food Client',
  description: 'Recipes App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.variable} suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{__html: themeScript}}/>
        <RootStoreProvider>
          <Header />
          <main>
            {children}
          </main>
        </RootStoreProvider>
      </body>
    </html>
  );
}