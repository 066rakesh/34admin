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

const initialForm = {
  title: "",
  image: "",
  description: "",
  category: CATEGORY_OPTIONS[0],
  isVeg: false,
  prepTime: "",
  rating: 0,
  price: "",
  variants: [],
  isChefSpecial: false,
  isPopular: false,
  isCraving: false,
};

export const AddProductModal = ({ onClose, onSave }) => {
  useLockBodyScroll();
  const [form, setForm] = useState(initialForm);
  const [useVariants, setUseVariants] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

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

  const handleClose = () => {
    if (isUploading && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    onClose();
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
      await onSave(payload);
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
          "Could not save the product. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
      >
        <div className={styles.header}>
          <h3 id="add-product-title">Add product</h3>
          <button
            type="button"
            aria-label="Close"
            disabled={isUploading || isSaving}
            onClick={handleClose}
          >
            <LuX size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.imageRow}>
            {form.image ? (
              <img
                src={form.image}
                alt="Preview"
                className={styles.imagePreview}
              />
            ) : (
              <div className={styles.imagePlaceholder} />
            )}
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
              {isUploading ? "Uploading..." : "Upload image"}
            </button>
          </div>

          <label className={styles.label} htmlFor="add-title">
            Title
          </label>
          <input
            id="add-title"
            type="text"
            name="title"
            placeholder="e.g. Cheesy Pupperoni Pizza"
            value={form.title}
            onChange={handleInputChange}
            required
          />

          <label className={styles.label} htmlFor="add-description">
            Description
          </label>
          <textarea
            id="add-description"
            rows={2}
            name="description"
            placeholder="Short description of the dish"
            value={form.description}
            onChange={handleInputChange}
          />

          <div className={styles.row2}>
            <div>
              <label className={styles.label} htmlFor="add-category">
                Category
              </label>
              <select
                id="add-category"
                name="category"
                value={form.category}
                onChange={handleInputChange}
              >
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.label} htmlFor="add-type">
                Type
              </label>
              <select
                id="add-type"
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
              <label className={styles.label} htmlFor="add-prep">
                Prep time (mins)
              </label>
              <input
                id="add-prep"
                type="number"
                name="prepTime"
                min="0"
                placeholder="e.g. 20"
                value={form.prepTime}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className={styles.label} htmlFor="add-rating">
                Rating
              </label>
              <input
                id="add-rating"
                type="number"
                name="rating"
                step="0.1"
                min="0"
                max="5"
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

          {!useVariants ? (
            <input
              type="number"
              name="price"
              min="0"
              placeholder="Price"
              aria-label="Price"
              value={form.price}
              onChange={handleInputChange}
            />
          ) : (
            <div className={styles.variantsBlock}>
              {form.variants.map((variant, index) => (
                <div key={index} className={styles.variantRow}>
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
                  setForm((prev) => ({ ...prev, isPopular: e.target.checked }))
                }
              />
              Popular
            </label>
            <label className={styles.checkboxInline}>
              <input
                type="checkbox"
                checked={form.isCraving}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isCraving: e.target.checked }))
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
              disabled={isUploading || isSaving}
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={isUploading || isSaving}
            >
              {isSaving ? "Adding..." : "Add product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
