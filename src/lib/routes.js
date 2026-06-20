/** Central route helpers — use these instead of hardcoded paths */

export const productDetailRoute = (productOrId) => {
  const id =
    typeof productOrId === "string" || typeof productOrId === "number"
      ? productOrId
      : productOrId?._id ?? productOrId?.id;
  return id ? `/product-details/${id}` : "/products";
};

export const productsRoute = (params = {}) => {
  const search = new URLSearchParams();
  if (params.search) search.set("search", params.search);
  if (params.category) search.set("category", params.category);
  const q = search.toString();
  return q ? `/products?${q}` : "/products";
};
