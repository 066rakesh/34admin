import { useState } from "react";
import styles from "./AdminLayout.module.css";
import { Header } from "./components/Header/Header";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { OrderProvider } from "./context/OrderContext";
import { ProductProvider } from "./context/ProductContext";
import { UserProvider } from "./context/UserContext";
import { ScrollTop } from "./hooks/scrollTop";

export const AdminLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <OrderProvider>
      <ProductProvider>
        <UserProvider>
          <div className={styles.page}>
            <ScrollTop />
            <Header setOpenSidebar={setOpenSidebar} />
            <Sidebar
              openSidebar={openSidebar}
              onClose={() => setOpenSidebar(false)}
            />

            {openSidebar && (
              <div
                className={styles.overlay}
                onClick={() => setOpenSidebar(false)}
              />
            )}

            <main className={styles.content}>
              <Outlet />
            </main>
          </div>
        </UserProvider>
      </ProductProvider>
    </OrderProvider>
  );
};
