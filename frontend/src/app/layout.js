import "./globals.css";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Phoneme Activity Builder",
  description: "Create phoneme-based Wordle and Word Search activities",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                const cookies = document.cookie.split("; ");

                const themeCookie = cookies.find(function (item) {
                  return item.startsWith("theme=");
                });

                if (!themeCookie) {
                  document.documentElement.setAttribute(
                    "data-theme",
                    "light"
                  );
                  return;
                }

                const savedTheme = themeCookie.split("=")[1];

                if (savedTheme === "system") {
                  const prefersDark = window.matchMedia(
                    "(prefers-color-scheme: dark)"
                  ).matches;

                  document.documentElement.setAttribute(
                    "data-theme",
                    prefersDark ? "dark" : "light"
                  );
                } else {
                  document.documentElement.setAttribute(
                    "data-theme",
                    savedTheme
                  );
                }
              })();
            `,
          }}
        />

        <Header />
        <Navbar />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}