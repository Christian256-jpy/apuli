import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import UserManagement from "./pages/UserManagement";
import { DashboardLayout } from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Transactions from "./pages/Transactions";
import CashManagement from "./pages/CashManagement";
import Debts from "./pages/Debts";
import Payments from "./pages/Payments";
import Analytics from "./pages/Analytics";
import { StoreLayout } from "./components/store/StoreLayout";
import HomePage from "./pages/store/HomePage";
import ShopPage from "./pages/store/ShopPage";
import ProductPage from "./pages/store/ProductPage";
import VisitPage from "./pages/store/VisitPage";
import NotFoundPage from "./pages/store/NotFoundPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="cash" element={<CashManagement />} />
            <Route path="debts" element={<Debts />} />
            <Route path="payments" element={<Payments />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
          <Route path="/users" element={<UserManagement />} />
          <Route element={<StoreLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:slug" element={<ProductPage />} />
            <Route path="/visit" element={<VisitPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
