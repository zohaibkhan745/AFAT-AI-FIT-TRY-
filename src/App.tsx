import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { UploadPage } from "./pages/UploadPage";
import { ResultPage } from "./pages/ResultPage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { SizeMeasurementPage } from "./pages/SizeMeasurementPage";
import { CheckSizePage } from "./pages/CheckSizePage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { ThemeProvider } from "./contexts/ThemeContext";

// Layout wrapper to conditionally hide Navbar on auth pages
function Layout() {
  const location = useLocation();
  const isAuthPage = ["/signin", "/signup"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors">
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/measure" element={<SizeMeasurementPage />} />
        <Route path="/check-size" element={<CheckSizePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout />
      </Router>
    </ThemeProvider>
  );
}

export default App;
