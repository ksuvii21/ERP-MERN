import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Landing/Home.jsx';
import Login from './pages/Auth/Login.jsx';
// The Register.jsx file exports the CreateCompany component, which is our main registration flow.
import CreateCompany from './pages/Auth/Register.jsx';
import ForgotPassword from './pages/Auth/ForgotPassword.jsx';
import AcceptInvitation from './pages/Auth/AcceptInvitation.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import ProjectList from './pages/Projects/ProjectList.jsx';
import KanbanBoard from './pages/Projects/KanbanBoard.jsx';
import Inventory from './pages/Inventory/Inventory.jsx';
import EmployeeManagement from './pages/HR/EmployeeManagement.jsx';
import Payroll from './pages/HR/Payroll.jsx';
import FinanceDashboard from './pages/Dashboard/FinanceDashboard.jsx';
import AIInsightsPage from './pages/AI/AIInsightsPage.jsx';
import Settings from './pages/General/Settings.jsx';
import POS from './pages/Finance/POS.jsx';
import GSTReports from './pages/Finance/GSTReports.jsx';
import Reports from './pages/General/Reports.jsx';
import Users from './pages/General/Users.jsx';
import Sales from './pages/Finance/Sales.jsx';
import Purchases from './pages/Finance/Purchases.jsx';
import Invoices from './pages/Finance/Invoices.jsx';
import StockManagement from './pages/Inventory/StockManagement.jsx';
import TeamWorkload from './pages/HR/TeamWorkload.jsx';
import DocumentUpload from './pages/AI/DocumentUpload.jsx';
import InvoiceDesign from './pages/Finance/InvoiceDesign.jsx';
import Customers from './pages/Retail/Customers.jsx';
import Suppliers from './pages/Retail/Suppliers.jsx';
import Orders from './pages/Retail/Orders.jsx';
import Patients from './pages/Healthcare/Patients.jsx';
import Doctors from './pages/Healthcare/Doctors.jsx';
import Appointments from './pages/Healthcare/Appointments.jsx';
import Billing from './pages/Business/Billing.jsx';
import Pharmacy from './pages/Healthcare/Pharmacy.jsx';
import MedicalRecords from './pages/Healthcare/MedicalRecords.jsx';
import ProfilePage from './pages/General/Profile.jsx';

// Components
import Layout from './components/Layout.jsx';

function App() {
  return (
    <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<CreateCompany />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/accept-invitation" element={<AcceptInvitation />} />
          
          {/* Protected Routes wrapped in Layout */}
          <Route path="/app" element={<Layout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
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
            <Route path="customers" element={<Customers />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="orders" element={<Orders />} />
            <Route path="patients" element={<Patients />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="billing" element={<Billing />} />
            <Route path="pharmacy" element={<Pharmacy />} />
            <Route path="records" element={<MedicalRecords />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;