import './globals.css';

export const metadata = {
  title: 'ApinnAI - Gemini Clone',
  description: 'AI Web Application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
