import './globals.css';

export const metadata = {
  title: 'ApinnAI - Gemini Clone',
  description: 'AI Web Application built with Next.js and Gemini API',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-[#131314] text-[#E3E3E3]">{children}</body>
    </html>
  );
}