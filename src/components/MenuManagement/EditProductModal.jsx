import { useState } from "react";
import { LuX, LuPlus } from "react-icons/lu";
import styles from "./EditProductModal.module.css";
import { uploadImage } from "../../services/productService";
import { useRef } from "react";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";

export const EditProductModal = ({ product, onClose, onSave }) => {
  useLockBodyScroll();
  const [form, setForm] = useState({
    title: product?.title,
    image: product?.image,
    description: product?.description,
    category: product?.category,
    isVeg: product?.isVeg,
    prepTime: product?.prepTime,
    rating: product?.rating,
    price: product?.price,
    variants: product?.variants,
    isChefSpecial: product?.isChefSpecial,
    isPopular: product?.isPopular,
    isCraving: product?.isCraving,
  });
  const abortControllerRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [useVariants, setUseVariants] = useState(product?.variants?.length > 0);

  const fileInputRef = useRef(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = useVariants
      ? { ...form, price: undefined }
      : { ...form, variants: [] };

    setIsSaving(true);

    try {
      await onSave(product._id, payload);
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
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Edit product</h3>
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
              {isUploading ? "Uploading..." : "Change image"}
            </button>
          </div>

          <label className={styles.label}>Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange}
          />

          <label className={styles.label}>Description</label>
          <textarea
            rows={2}
            name="description"
            value={form.description}
            onChange={handleInputChange}
          />

          <div className={styles.row2}>
            <div>
              <label className={styles.label}>Category</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className={styles.label}>Type</label>
              <select
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
              <label className={styles.label}>Prep time (mins)</label>
              <input
                type="number"
                name="prepTime"
                value={form.prepTime}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className={styles.label}>Rating</label>
              <input
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
                <div key={index} className={styles.variantRow}>
                  <input
                    type="text"
                    placeholder="Label (e.g. Small)"
                    name="label"
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
          ) : (
            <input
              type="number"
              placeholder="Price"
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
