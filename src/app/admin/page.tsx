import DashboardCard from "@/app/admin/_components/dashboardCard";
import { getCustomersData } from "@/db/customers/getCustomers";
import { getProductsData } from "@/db/products/getProducts";
import { getSalesData } from "@/db/sales/getSales";
import { formatCurrency, formatNumber } from "@/lib/formatters";

export default async function AdminDashboard() {
  const [salesData, usersData, productsData] = await Promise.all([
    getSalesData(),
    getCustomersData(),
    getProductsData(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title="Customers"
        subtitle={`${formatCurrency(
          usersData.averageValuePerUser
        )} Average Value`}
        body={formatNumber(usersData.userCount)}
      />
      <DashboardCard
        title="Active Products"
        subtitle={`${formatNumber(productsData.inactiveProducts)} Inactive`}
        body={formatNumber(productsData.activeProducts)}
      />
    </div>
  );
}
