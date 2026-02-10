import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProjectList from './pages/ProjectList.jsx';
import KanbanBoard from './pages/KanbanBoard.jsx';
import Inventory from './pages/Inventory.jsx';
import EmployeeManagement from './pages/EmployeeManagement.jsx';
import Payroll from './pages/Payroll.jsx';
import FinanceDashboard from './pages/FinanceDashboard.jsx';
import AIInsightsPage from './pages/AIInsightsPage.jsx';
import Settings from './pages/Settings.jsx';
import POS from './pages/POS.jsx';
import GSTReports from './pages/GSTReports.jsx';
import Reports from './pages/Reports.jsx';
import Users from './pages/Users.jsx';
import Sales from './pages/Sales.jsx';
import Purchases from './pages/Purchases.jsx';
import Invoices from './pages/Invoices.jsx';
import StockManagement from './pages/StockManagement.jsx';
import TeamWorkload from './pages/TeamWorkload.jsx';
import DocumentUpload from './pages/DocumentUpload.jsx';
import InvoiceDesign from './pages/InvoiceDesign.jsx';

// Components
import Layout from './components/Layout.jsx';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes wrapped in Layout */}
            <Route path="/app" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<ProjectList />} />
              <Route path="kanban" element={<KanbanBoard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="hr/employees" element={<EmployeeManagement />} />
              <Route path="hr/payroll" element={<Payroll />} />
              <Route path="finance" element={<FinanceDashboard />} />
              <Route path="ai-insights" element={<AIInsightsPage />} />
              <Route path="settings" element={<Settings />} />
              <Route path="pos" element={<POS />} />
              <Route path="gst-reports" element={<GSTReports />} />
              <Route path="reports" element={<Reports />} />
              <Route path="users" element={<Users />} />
              <Route path="sales" element={<Sales />} />
              <Route path="purchases" element={<Purchases />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="stock" element={<StockManagement />} />
              <Route path="team-workload" element={<TeamWorkload />} />
              <Route path="document-upload" element={<DocumentUpload />} />
              <Route path="invoice-design" element={<InvoiceDesign />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;