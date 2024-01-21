import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/ReduxProvider";
import { SocketProvider } from "@/contexts/SocketContext";
import ToasterContext from "@/contexts/ToasterContext";
import AudioNotification from "@/NotificationSound/AudioNotification";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import ThemeProvider from "@/theme";
import SettingsProvider from "@/contexts/SettingsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tawk",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <SocketProvider>
          <AudioNotification/>
            <ToasterContext />
            
            {/* <StyledEngineProvider injectFirst> */}
              <ThemeProvider>
                <SettingsProvider>
                  {/* <ThemeSettings> */}
                  {children}
                  {/* </ThemeSettings> */}
                </SettingsProvider>
              </ThemeProvider>
            {/* </StyledEngineProvider> */}
          </SocketProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
