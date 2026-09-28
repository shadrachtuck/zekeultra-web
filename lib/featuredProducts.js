export function getFeaturedNames(slice) {
  return (slice?.primary?.featured_product_names || [])
    .map((item) => item.product_name?.toLowerCase().trim())
    .filter(Boolean);
}

export function getFeaturedNamesFromHomepage(homepage) {
  const carousel = (homepage?.data?.slices || []).find(
    (slice) => slice.slice_type === 'product_carousel'
  );
  return getFeaturedNames(carousel);
}

export function productMatchesFeaturedName(productName, featuredName) {
  const name = (productName || '').toLowerCase();
  return name.includes(featuredName) || featuredName.includes(name);
}

export function filterAndOrderByFeaturedNames(products, featuredNames, getProductName) {
  if (!featuredNames.length) return products;

  const remaining = [...products];
  const ordered = [];

  for (const featuredName of featuredNames) {
    for (let i = 0; i < remaining.length; ) {
      if (productMatchesFeaturedName(getProductName(remaining[i]), featuredName)) {
        ordered.push(remaining[i]);
        remaining.splice(i, 1);
      } else {
        i += 1;
      }
    }
  }

  return ordered;
}
