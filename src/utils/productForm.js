export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const validateImageFile = (file) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPG, PNG or WebP images are allowed";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "Image must be under 5 MB";
  }
  return "";
};

export const buildProductPayload = (form, useVariants) => {
  const title = (form.title || "").trim();

  if (!title) return { error: "Title is required" };
  if (!form.image) return { error: "Please upload an image" };
  if (!form.category) return { error: "Please choose a category" };

  const rating =
    form.rating === "" || form.rating == null ? 0 : Number(form.rating);
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    return { error: "Rating must be between 0 and 5" };
  }

  let prepTime;
  if (form.prepTime !== "" && form.prepTime != null) {
    prepTime = Number(form.prepTime);
    if (!Number.isFinite(prepTime) || prepTime < 0) {
      return { error: "Prep time must be a positive number" };
    }
  }

  const base = {
    title,
    image: form.image,
    description: (form.description || "").trim(),
    category: form.category,
    isVeg: !!form.isVeg,
    prepTime,
    rating,
    isChefSpecial: !!form.isChefSpecial,
    isPopular: !!form.isPopular,
    isCraving: !!form.isCraving,
  };

  if (useVariants) {
    if (!form.variants || form.variants.length === 0) {
      return { error: "Add at least one size" };
    }

    const variants = [];

    for (const variant of form.variants) {
      const label = (variant.label || "").trim();
      const price = Number(variant.price);

      if (!label) return { error: "Every size needs a label" };
      if (!Number.isFinite(price) || price <= 0) {
        return { error: "Every size needs a price above 0" };
      }

      variants.push({ ...variant, label, price });
    }

    return {
      payload: {
        ...base,
        variants,
        price: Math.min(...variants.map((v) => v.price)),
      },
    };
  }

  const price = Number(form.price);

  if (
    form.price === "" ||
    form.price == null ||
    !Number.isFinite(price) ||
    price <= 0
  ) {
    return { error: "Price must be above 0" };
  }

  return { payload: { ...base, price, variants: [] } };
};
