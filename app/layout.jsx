import "../src/index.css";
import { Providers } from "./providers";

export const metadata = {
  title: "24mobiles - Smartphone Reviews & Specs",
  description: "Your ultimate destination for unbiased smartphone reviews, detailed specifications, and expert buying guides.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
