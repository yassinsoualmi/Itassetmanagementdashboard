import { createBrowserRouter } from "react-router";
import { ProtectedDashboardLayout } from "./components/ProtectedDashboardLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { EquipmentManagement } from "./pages/EquipmentManagement";
import { EquipmentDetails } from "./pages/EquipmentDetails";
import { Interventions } from "./pages/Interventions";
import { Reports } from "./pages/Reports";
import { PeripheralManagement } from "./pages/PeripheralManagement";
import { ManageUsers } from "./pages/ManageUsers";
import { ManageHelpdesk } from "./pages/ManageHelpdesk";
import { InventoryRedirect } from "./pages/InventoryRedirect";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: ProtectedDashboardLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "equipment-management",
        Component: EquipmentManagement,
      },
      {
        path: "equipment",
        Component: EquipmentManagement,
      },
      {
        path: "equipment/:id",
        Component: EquipmentDetails,
      },
      {
        path: "interventions",
        Component: Interventions,
      },
      {
        path: "manage-users",
        Component: ManageUsers,
      },
      {
        path: "manage-helpdesk",
        Component: ManageHelpdesk,
      },
      {
        path: "peripherals",
        Component: PeripheralManagement,
      },
      {
        path: "reports",
        Component: Reports,
      },
      {
        path: "inventory",
        Component: InventoryRedirect,
      },
    ],
  },
]);