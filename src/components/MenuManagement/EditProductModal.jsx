import { useRef, useState } from "react";
import { LuX, LuPlus } from "react-icons/lu";
import styles from "./EditProductModal.module.css";
import { uploadImage } from "../../services/productService";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { categories } from "../../Data/categories";
import {
  buildProductPayload,
  validateImageFile,
} from "../../utils/productForm";

const CATEGORY_OPTIONS = categories.filter((c) => c !== "All");

const errorStyle = { color: "#b91c1c", fontSize: "13px", margin: "6px 0 0" };

export const EditProductModal = ({ product, onClose, onSave }) => {
  useLockBodyScroll();

  const [form, setForm] = useState({
    title: product?.title ?? "",
    image: product?.image ?? "",
    description: product?.description ?? "",
    category: product?.category ?? "",
    isVeg: !!product?.isVeg,
    prepTime: product?.prepTime ?? "",
    rating: product?.rating ?? 0,
    price: product?.price ?? "",
    variants: (product?.variants || []).map((variant) => ({ ...variant })),
    isChefSpecial: !!product?.isChefSpecial,
    isPopular: !!product?.isPopular,
    isCraving: !!product?.isCraving,
  });
  const [useVariants, setUseVariants] = useState(product?.variants?.length > 0);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState("");

  const abortControllerRef = useRef(null);
  const fileInputRef = useRef(null);

  const categoryOptions =
    form.category && !CATEGORY_OPTIONS.includes(form.category)
      ? [form.category, ...CATEGORY_OPTIONS]
      : CATEGORY_OPTIONS;

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    const problem = validateImageFile(file);
    if (problem) {
      setFormError(problem);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setFormError("");
    setIsUploading(true);

    try {
      const res = await uploadImage(file, controller.signal);
      setForm((prev) => ({ ...prev, image: res.data.url }));
    } catch (error) {
      if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
        return;
      }
      console.error("Image upload failed", error);
      setFormError(
        error.response?.data?.message ||
          "Image upload failed. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant,
      ),
    }));
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { label: "", price: "" }],
    }));
  };

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploading || isSaving) return;

    const { payload, error } = buildProductPayload(form, useVariants);

    if (error) {
      setFormError(error);
      return;
    }

    setFormError("");
    setIsSaving(true);

    try {
      await onSave(product._id, payload);
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
          "Could not save the changes. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isUploading && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-product-title"
      >
        <div className={styles.header}>
          <h3 id="edit-product-title">Edit product</h3>
          <button
            type="button"
            aria-label="Close"
            disabled={isSaving}
            onClick={handleClose}
          >
            <LuX size={16} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.imageRow}>
            <img
              src={form.image || product?.image}
              alt={product?.title}
              className={styles.imagePreview}
            />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className={styles.changeImageBtn}
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Change image"}
            </button>
          </div>

          <label className={styles.label} htmlFor="edit-title">
            Title
          </label>
          <input
            id="edit-title"
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange}
          />

          <label className={styles.label} htmlFor="edit-description">
            Description
          </label>
          <textarea
            id="edit-description"
            rows={2}
            name="description"
            value={form.description}
            onChange={handleInputChange}
          />

          <div className={styles.row2}>
            <div>
              <label className={styles.label} htmlFor="edit-category">
                Category
              </label>
              <select
                id="edit-category"
                name="category"
                value={form.category}
                onChange={handleInputChange}
              >
                {!form.category && <option value="">Select category</option>}
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.label} htmlFor="edit-type">
                Type
              </label>
              <select
                id="edit-type"
                name="isVeg"
                value={form.isVeg ? "veg" : "nonveg"}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isVeg: e.target.value === "veg",
                  }))
                }
              >
                <option value="nonveg">Non-veg</option>
                <option value="veg">Veg</option>
              </select>
            </div>
          </div>

          <div className={styles.row2}>
            <div>
              <label className={styles.label} htmlFor="edit-prep">
                Prep time (mins)
              </label>
              <input
                id="edit-prep"
                type="number"
                name="prepTime"
                min="0"
                value={form.prepTime}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className={styles.label} htmlFor="edit-rating">
                Rating
              </label>
              <input
                id="edit-rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="rating"
                value={form.rating}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.pricingHeader}>
            <label className={styles.label}>Pricing</label>
            <label className={styles.checkboxInline}>
              <input
                type="checkbox"
                checked={useVariants}
                onChange={(e) => setUseVariants(e.target.checked)}
              />
              Multiple sizes
            </label>
          </div>

          {useVariants ? (
            <div className={styles.variantsBlock}>
              {form.variants.map((variant, index) => (
                <div key={variant._id || index} className={styles.variantRow}>
                  <input
                    type="text"
                    placeholder="Label (e.g. Small)"
                    aria-label="Size label"
                    value={variant.label}
                    onChange={(e) =>
                      handleVariantChange(index, "label", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Price"
                    aria-label="Size price"
                    value={variant.price}
                    onChange={(e) =>
                      handleVariantChange(index, "price", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    aria-label="Remove variant"
                    onClick={() => removeVariant(index)}
                  >
                    <LuX size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className={styles.addVariantBtn}
                onClick={addVariant}
              >
                <LuPlus size={14} />
                Add variant
              </button>
            </div>
          ) : (
            <input
              type="number"
              name="price"
              min="0"
              placeholder="Price"
              aria-label="Price"
              value={form.price}
              onChange={handleInputChange}
            />
          )}

          <p className={styles.label}>Tags</p>
          <div className={styles.tagsRow}>
            <label className={styles.checkboxInline}>
              <input
                type="checkbox"
                checked={form.isChefSpecial}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isChefSpecial: e.target.checked,
                  }))
                }
              />
              Chef special
            </label>
            <label className={styles.checkboxInline}>
              <input
                type="checkbox"
                checked={form.isPopular}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isPopular: e.target.checked,
                  }))
                }
              />
              Popular
            </label>
            <label className={styles.checkboxInline}>
              <input
                type="checkbox"
                checked={form.isCraving}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isCraving: e.target.checked,
                  }))
                }
              />
              Craving
            </label>
          </div>

          {formError && (
            <p role="alert" style={errorStyle}>
              {formError}
            </p>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              disabled={isSaving}
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={isUploading || isSaving}
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
