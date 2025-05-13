import "./App.css";
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useGlobalState } from "./Components/GlobalStateContext"; // Ensure this exists
import { ProtectedRoute } from "./Components/ProtectedRoute"; // Create this file as described earlier
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//components that arent lazy loaded
import Home from "./Components/Home/Home.js";
import Navbar from "./Components/Navbar/Navbar.js";
import Footer from "./Components/Footer/Footer.js";
import LoadingSpinner from "./Components/LoadingSpinner/LoadingSpinner.js"; // Loading component
import ScrollToTop from "./Components/ScrollToTop.js";

//components that are lazy loaded
const Products = lazy(() => import("./Components/Products/Products.js"));
const About = lazy(() => import("./Components/About/About.js"));
const Contact = lazy(() => import("./Components/Contact/Contact.js"));
const Signup = lazy(() => import("./Components/LoginSignup/Signup.js"));
const Login = lazy(() => import("./Components/LoginSignup/Login.js"));
const Gallery = lazy(() => import("./Components/Gallery/Gallery.js"));
const Visualizer = lazy(() => import("./Components/Products/Visualizer.js"));
const Kerbstone = lazy(() => import("./Components/Kerbstone/Kerbstone.js"));
const Cobble = lazy(() => import("./Components/Cobble/Cobble.js"));
const StoneCreation = lazy(() => import("./Components/StoneCreation/StoneCreation.js"));
const MyAccount = lazy(() => import("./Components/MyAccount/MyAccount.js"));
const ProductDetails = lazy(() => import("./Components/Products/ProductDetails.js"));
const Exports = lazy(() => import("./Components/Exports/Exports.js"));
const Packing = lazy(() => import("./Components/Packing/Packing.js"));
const Partners = lazy(() => import("./Components/Partners/Partners.js"));
const News = lazy(() => import("./Components/News/News.js"));
const Machinery = lazy(() => import("./Components/Machinery/Machinery.js"));
const Quarries = lazy(() => import("./Components/Quarries/Quarries.js"));
const Inspiration = lazy(() => import("./Components/Inspiration/Inspiration.js"));
const History = lazy(() => import("./Components/History/History.js"));
const Projects = lazy(() => import("./Components/Projects/Projects.js"));
const ProjectDetails = lazy(() => import("./Components/Projects/ProjectDetails.js"));
const Fairs = lazy(() => import("./Components/Fairs/Fairs.js"));
const Patterns = lazy(() => import("./Components/Patterns/Patterns.js"));
const Certificates = lazy(() => import("./Components/Certificates/Certificates.js"));
const NotFound404 = lazy(() => import("./Components/404/NotFound404.js")); // 404 page

function App() {
  const { globalState } = useGlobalState();
  const isLoggedIn = globalState.isLoggedIn;

  return (
    <BrowserRouter>
    <ScrollToTop /> {/* Ensures scrolling resets on page change */}
      <div className="main">
        <Navbar />
        <ToastContainer autoClose={5000} hideProgressBar />
        <div id="main-content" className="main-content">
        <Routes>
          {/* Public routes */}
          <Route exact path="/" element={<Home />} />
          <Route exact path="/history" element={<Suspense fallback={<LoadingSpinner />}><History /></Suspense>} />
          <Route exact path="/exports" element={<Suspense fallback={<LoadingSpinner />}><Exports /></Suspense>} />
          <Route exact path="/packing" element={<Suspense fallback={<LoadingSpinner />}><Packing /></Suspense>} />
          <Route exact path="/machinery" element={<Suspense fallback={<LoadingSpinner />}><Machinery /></Suspense>} />
          <Route exact path="/certificates" element={<Suspense fallback={<LoadingSpinner />}><Certificates /></Suspense>} />
          <Route exact path="/about" element={<Suspense fallback={<LoadingSpinner />}><About /></Suspense>} />
          <Route exact path="/gallery" element={<Suspense fallback={<LoadingSpinner />}><Gallery /></Suspense>} />
          <Route exact path="/inspiration" element={<Suspense fallback={<LoadingSpinner />}><Inspiration /></Suspense>} />
          <Route exact path="/quarries" element={<Suspense fallback={<LoadingSpinner />}><Quarries /></Suspense>} />
          <Route exact path="/partners" element={<Suspense fallback={<LoadingSpinner />}><Partners /></Suspense>} />
          <Route exact path="/news" element={<Suspense fallback={<LoadingSpinner />}><News /></Suspense>} />
          <Route exact path="*" element={<Suspense fallback={<LoadingSpinner />}><NotFound404 /></Suspense>} /> {/* Catch-all route for 404 */}
          <Route
            exact
            path="/products"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Products />
              </Suspense>
            }
          />
          <Route path="/products/:productId" element={<Suspense fallback={<LoadingSpinner />}><ProductDetails /></Suspense>} />
          <Route exact path="/visualizer" element={<Suspense fallback={<LoadingSpinner />}><Visualizer /></Suspense>} />
          <Route exact path="/kerbstone" element={<Suspense fallback={<LoadingSpinner />}><Kerbstone /></Suspense>} />
          <Route exact path="/Cobbles" element={<Suspense fallback={<LoadingSpinner />}><Cobble /></Suspense>} />
          <Route exact path="/Stone Creations" element={<Suspense fallback={<LoadingSpinner />}><StoneCreation /></Suspense>} />
          <Route exact path="/projects" element={<Suspense fallback={<LoadingSpinner />}><Projects /></Suspense>} />
          <Route exact path="/projects/:projectId" element={<Suspense fallback={<LoadingSpinner />}><ProjectDetails /></Suspense>} />
          <Route exact path="/fairs" element={<Suspense fallback={<LoadingSpinner />}><Fairs /></Suspense>} />
          <Route exact path="/patterns" element={<Suspense fallback={<LoadingSpinner />}><Patterns /></Suspense>} />
          <Route exact path="/contact" element={<Suspense fallback={<LoadingSpinner />}><Contact /></Suspense>} />

          {/* Protected routes for NOT logged-in users */}
          <Route
            exact
            path="/signup"
            element={<Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute condition={!isLoggedIn} redirectTo="/my account">
                <Signup />
              </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            exact
            path="/login"
            element={<Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute condition={!isLoggedIn} redirectTo="/my account">
                <Login />
              </ProtectedRoute>
              </Suspense>
            }
          />

          {/* Protected routes for logged-in users */}
          <Route
            exact
            path="/my account"
            element={<Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute condition={isLoggedIn} redirectTo="/login">
                <MyAccount />
              </ProtectedRoute>
              </Suspense>
            }
          />
        </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
