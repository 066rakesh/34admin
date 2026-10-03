import { useState, useRef } from "react";
import { LuX, LuPlus } from "react-icons/lu";
import styles from "./EditProductModal.module.css";
import { uploadImage } from "../../services/productService";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";

const initialForm = {
  title: "",
  image: "",
  description: "",
  category: "Mains",
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

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsUploading(true);
    try {
      const res = await uploadImage(file, controller.signal);
      setForm((prev) => ({ ...prev, image: res.data.url }));
    } catch (error) {
      if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
        console.log("Upload cancelled by user");
      } else {
        console.error("Image upload failed", error);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...form.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setForm((prev) => ({ ...prev, variants: updatedVariants }));
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

    const payload = useVariants
      ? { ...form, price: undefined }
      : { ...form, variants: [] };

    setIsSaving(true);
    try {
      await onSave(payload);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Add product</h3>
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
              accept="image/*"
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

          <label className={styles.label}>Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Cheesy Pupperoni Pizza"
            value={form.title}
            onChange={handleInputChange}
            required
          />

          <label className={styles.label}>Description</label>
          <textarea
            rows={2}
            name="description"
            placeholder="Short description of the dish"
            value={form.description}
            onChange={handleInputChange}
          />

          <div className={styles.row2}>
            <div>
              <label className={styles.label}>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleInputChange}
              >
                <option>Mains</option>
                <option>Beverages</option>
                <option>Breakfast</option>
              </select>
            </div>
            <div>
              <label className={styles.label}>Type</label>
              <select
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
              <label className={styles.label}>Prep time (mins)</label>
              <input
                type="number"
                name="prepTime"
                placeholder="e.g. 20"
                value={form.prepTime}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className={styles.label}>Rating</label>
              <input
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
              placeholder="Price"
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
                    value={variant.label}
                    onChange={(e) =>
                      handleVariantChange(index, "label", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={variant.price}
                    onChange={(e) =>
                      handleVariantChange(
                        index,
                        "price",
                        Number(e.target.value),
                      )
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
