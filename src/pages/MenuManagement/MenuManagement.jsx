import {
  LuFlame,
  LuPencil,
  LuPlus,
  LuStar,
  LuTrash2,
  LuUtensils,
} from "react-icons/lu";
import styles from "./MenuManagement.module.css";
import { GiChefToque } from "react-icons/gi";
import { categories } from "../../Data/categories";
import {
  createProduct,
  deleteProductById,
  updateProduct,
} from "../../services/productService";
import { useContext, useState } from "react";
import { MenuManagementSkeleton } from "../../components/MenuManagement/MenuManagementSkeleton";
import { Search } from "lucide-react";
import { EditProductModal } from "../../components/MenuManagement/EditProductModal";
import { DeleteProductModal } from "../../components/MenuManagement/DeleteProductModal";
import { ErrorState } from "../../components/Common/ErrorState";
import { ProductContext } from "../../context/ProductContext";
import { AddProductModal } from "../../components/MenuManagement/AddProductModal";

export const MenuManagement = () => {
  const { products, loading, error, fetchAllProducts } =
    useContext(ProductContext);

  const [editModal, setEditModal] = useState(null);

  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [searchTerm, setSearchterm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All types");
  const [showAddModal, setShowAddModal] = useState(false);

  const filterProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLocaleLowerCase());

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const matchesType =
      selectedType === "All types" ||
      (selectedType === "Veg" && product.isVeg) ||
      (selectedType === "Non-veg" && !product.isVeg);

    return matchesSearch && matchesCategory && matchesType;
  });

  if (loading) {
    return <MenuManagementSkeleton />;
  }

  if (error) {
    return (
      <ErrorState msg={"Failed to load products"} onFetch={fetchAllProducts} />
    );
  }

  const popularCount = products.filter((product) => product.isPopular).length;

  const chefSpecialCount = products.filter(
    (product) => product.isChefSpecial,
  ).length;

  const cravingCount = products.filter((product) => product.isCraving).length;

  const handleSaveProduct = async (id, updatedData) => {
    try {
      await updateProduct(id, updatedData);
      setEditModal(null);
      fetchAllProducts();
    } catch (error) {
      console.error("Failed to update product", error);
    }
  };

  const handleDeleteProduct = async () => {
    setDeleteLoading(true);

    try {
      await deleteProductById(deleteProduct._id);
      setDeleteProduct(null);
      fetchAllProducts();
    } catch (error) {
      console.log("Failed to delete product", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddProduct = async (newProductData) => {
    try {
      await createProduct(newProductData);
      setShowAddModal(false);
      fetchAllProducts();
    } catch (error) {
      console.error("Failed to add product", error);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2>Products</h2>
          <p className={styles.subtitle}>Manage your menu catalog</p>
        </div>
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => setShowAddModal(true)}
        >
          <LuPlus size={16} />
          Add product
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.accent}`}>
            <LuUtensils size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>Total products</p>
            <p className={styles.statValue}>{products.length}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.success}`}>
            <LuStar size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>Popular</p>
            <p className={styles.statValue}>{popularCount}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.pro}`}>
            <GiChefToque size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>Chef specials</p>
            <p className={styles.statValue}>{chefSpecialCount}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.warning}`}>
            <LuFlame size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>Cravings</p>
            <p className={styles.statValue}>{cravingCount}</p>
          </div>
        </div>
      </div>

      <div className={styles.filtersRow}>
        <input
          type="text"
          placeholder="Search products..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchterm(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          className={styles.filterSelect}
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option>All types</option>
          <option>Veg</option>
          <option>Non-veg</option>
        </select>
      </div>

      <div className={styles.productList}>
        {filterProducts.length === 0 ? (
          <div className={styles.noResults}>
            <Search size={32} />
            <p className={styles.result}>No products found.</p>
          </div>
        ) : (
          filterProducts.map((product) => (
            <div key={product._id} className={styles.productRow}>
              <img src={product.image} alt={product.title} />
              <div className={styles.productInfo}>
                <div className={styles.titleRow}>
                  <span
                    className={`${styles.vegDot} ${product.isVeg ? styles.veg : styles.nonVeg}`}
                  />
                  <span className={styles.productTitle}>{product.title}</span>
                </div>
                <div className={styles.metaRow}>
                  <span>{product.category}</span>
                  <span className={styles.dot}>&middot;</span>
                  {product.rating && (
                    <span className={styles.ratingText}>
                      <LuStar size={12} /> {product.rating}
                    </span>
                  )}
                  {product.isChefSpecial && (
                    <span className={`${styles.tag} ${styles.tagChef}`}>
                      Chef Special
                    </span>
                  )}
                  {product.isPopular && (
                    <span className={`${styles.tag} ${styles.tagPopular}`}>
                      Popular
                    </span>
                  )}
                  {product.isCraving && (
                    <span className={`${styles.tag} ${styles.tagCraving}`}>
                      Craving
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.actionBtns}>
                <button
                  type="button"
                  aria-label="Edit product"
                  className={styles.iconBtn}
                  onClick={() => setEditModal(product._id)}
                >
                  <LuPencil size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Delete product"
                  className={styles.iconBtnDanger}
                  onClick={() => setDeleteProduct(product)}
                >
                  <LuTrash2 size={14} />
                </button>
              </div>

              {editModal === product._id && (
                <EditProductModal
                  product={product}
                  onClose={() => setEditModal(null)}
                  onSave={handleSaveProduct}
                />
              )}
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddProduct}
        />
      )}

      {deleteProduct && (
        <DeleteProductModal
          onClose={() => setDeleteProduct(null)}
          onConfirm={handleDeleteProduct}
          deleteLoading={deleteLoading}
        />
      )}
    </div>
  );
};
