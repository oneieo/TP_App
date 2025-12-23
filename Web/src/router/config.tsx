import type { RouteObject } from "react-router-dom";
import Home from "../pages/home/page";
import Map from "../pages/map/page";
import StoreDetail from "../pages/store/[id]/page"; // ← 여기 수정!
import Coupons from "../pages/coupons/page";
import Profile from "../pages/profile/page";
import Stamps from "../pages/stamps/page";
import Favorites from "../pages/favorites/page";
import History from "../pages/history/page";
import MerchantHome from "../pages/merchant/home/page";
import MerchantDashboard from "../pages/merchant/dashboard/page";
import MerchantCoupons from "../pages/merchant/coupons/page";
import MerchantReviews from "../pages/merchant/reviews/page";
import MerchantSettings from "../pages/merchant/settings/page";
import MerchantMenu from "../pages/merchant/menu/page";
import MerchantOrders from "../pages/merchant/orders/page";
import Onboarding from "../pages/onboarding/page";
import Login from "../pages/auth/login/page";
import Signup from "../pages/auth/signup/page";
import NotFound from "../pages/NotFound";
import { ProtectedRoute } from "../components/feature/ProtectedRoute";
import StoreSearch from "../pages/store/search";

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  // {
  //   path: "/onboarding",
  //   element: <Onboarding />,
  // },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/signup",
    element: <Signup />,
  },
  {
    path: "/map",
    element: (
      <ProtectedRoute>
        <Map />
      </ProtectedRoute>
    ),
  },
  {
    path: "/coupons",
    element: (
      <ProtectedRoute>
        <Coupons />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/stamps",
    element: <Stamps />,
  },
  {
    path: "/favorites",
    element: <Favorites />,
  },
  {
    path: "/history",
    element: <History />,
  },
  {
    path: "/store/:id",
    element: (
      <ProtectedRoute>
        <StoreDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/store",
    element: (
      <ProtectedRoute>
        <StoreSearch />
      </ProtectedRoute>
    ),
  },
  {
    path: "/merchant",
    element: <MerchantHome />,
  },
  {
    path: "/merchant/home",
    element: <MerchantHome />,
  },
  {
    path: "/merchant/dashboard",
    element: <MerchantDashboard />,
  },
  {
    path: "/merchant/coupons",
    element: <MerchantCoupons />,
  },
  {
    path: "/merchant/reviews",
    element: <MerchantReviews />,
  },
  {
    path: "/merchant/settings",
    element: <MerchantSettings />,
  },
  {
    path: "/merchant/menu",
    element: <MerchantMenu />,
  },
  {
    path: "/merchant/orders",
    element: <MerchantOrders />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
