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
import Pharmacy from './pages/Healthcare/Pharmacy.jsx';
import MedicalRecords from './pages/Healthcare/MedicalRecords.jsx';
import ProfilePage from './pages/Profile/Profile.jsx';
import FinanceAccounting from './pages/FinanceAccounting.jsx';

// Wholesale Pages
import BulkOrdering from './pages/Wholesale/BulkOrdering.jsx';
import CreditManagement from './pages/Wholesale/CreditManagement.jsx';
import Logistics from './pages/Wholesale/Logistics.jsx';
import WholesaleSuppliers from './pages/Wholesale/Suppliers.jsx';
import WarehouseManagement from './pages/Wholesale/WarehouseManagement.jsx';

// Construction Pages
import ConstructionProjects from './pages/Construction/Projects.jsx';
import Budgets from './pages/Construction/Budgets.jsx';
import Contracts from './pages/Construction/Contracts.jsx';
import Equipment from './pages/Construction/Equipment.jsx';
import Workers from './pages/Construction/Workers.jsx';

// Manufacturing Pages
import BillOfMaterials from './pages/Manufacturing/BillOfMaterials.jsx';
import ProductionOrders from './pages/Manufacturing/ProductionOrders.jsx';
import QualityManagement from './pages/Manufacturing/QualityManagement.jsx';
import ManufacturingProducts from './pages/Manufacturing/Products.jsx';
import Machines from './pages/Manufacturing/Machines.jsx';
import RawMaterials from './pages/Manufacturing/RawMaterials.jsx';
import SupplyChain from './pages/Manufacturing/SupplyChain.jsx';

// Education Pages
import Students from './pages/Education/Students.jsx';
import Teachers from './pages/Education/Teachers.jsx';
import Courses from './pages/Education/Courses.jsx';
import Exams from './pages/Education/Exams.jsx';
import Attendance from './pages/Education/Attendance.jsx';

// Hospitality Pages
import Bookings from './pages/Hospitality/Bookings.jsx';
import Rooms from './pages/Hospitality/Rooms.jsx';
import Guests from './pages/Hospitality/Guests.jsx';
import Services from './pages/Hospitality/Services.jsx';

// Business Pages
import Accounting from './pages/Business/Accounting.jsx';
import CRM from './pages/Business/CRM.jsx';
import Billing from './pages/Business/Billing.jsx'; // Corrected path for the main billing component
import Expenses from './pages/Business/Expenses.jsx';
import ProjectManagement from './pages/Business/ProjectManagement.jsx';

// Components
import Layout from './components/Layout.jsx';
import SystemLogs from './pages/Admin/SystemLogs';
import ProtectedRoute from './components/ProtectedRoute.jsx';

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
            <Route 
              path="finance" 
              element={
                <ProtectedRoute roles={['admin', 'manager']}><FinanceDashboard /></ProtectedRoute>
              } 
            />
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
            <Route path="accounting" element={<FinanceAccounting />} />
            <Route path="profile" element={<ProfilePage />} />
            {/* This route should be protected and likely restricted to admins */}
            <Route path="admin/system-logs" element={<ProtectedRoute roles={['admin', 'super_admin']}><SystemLogs /></ProtectedRoute>}/>

            {/* Wholesale Routes */}
            <Route path="wholesale/bulk-ordering" element={<BulkOrdering />} />
            <Route path="wholesale/warehouse" element={<WarehouseManagement />} />
            <Route path="wholesale/logistics" element={<Logistics />} />
            <Route path="wholesale/suppliers" element={<WholesaleSuppliers />} />
            <Route path="wholesale/credit" element={<CreditManagement />} />

            {/* Construction Routes */}
            <Route path="construction/projects" element={<ConstructionProjects />} />
            <Route path="construction/budgets" element={<Budgets />} />
            <Route path="construction/contracts" element={<Contracts />} />
            <Route path="construction/equipment" element={<Equipment />} />
            <Route path="construction/workers" element={<Workers />} />

            {/* Manufacturing Routes */}
            <Route path="manufacturing/products" element={<ManufacturingProducts />} />
            <Route path="manufacturing/boms" element={<BillOfMaterials />} />
            <Route path="manufacturing/production" element={<ProductionOrders />} />
            <Route path="manufacturing/quality" element={<QualityManagement />} />
            <Route path="manufacturing/machines" element={<Machines />} />
            <Route path="manufacturing/raw-materials" element={<RawMaterials />} />
            <Route path="manufacturing/supply-chain" element={<SupplyChain />} />

            {/* Education Routes */}
            <Route path="education/students" element={<Students />} />
            <Route path="education/teachers" element={<Teachers />} />
            <Route path="education/courses" element={<Courses />} />
            <Route path="education/exams" element={<Exams />} />
            <Route path="education/attendance" element={<Attendance />} />

            {/* Hospitality Routes */}
            <Route path="hospitality/bookings" element={<Bookings />} />
            <Route path="hospitality/rooms" element={<Rooms />} />
            <Route path="hospitality/guests" element={<Guests />} />
            <Route path="hospitality/services" element={<Services />} />

            {/* Business Routes */}
            <Route path="business/accounting" element={<Accounting />} />
            <Route path="business/crm" element={<CRM />} />
            <Route path="business/expenses" element={<Expenses />} />
            <Route path="business/projects" element={<ProjectManagement />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;