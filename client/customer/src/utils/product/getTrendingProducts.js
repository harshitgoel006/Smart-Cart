export const getTrendingProducts = (products) => {
  if (!products?.length) return []

  return [...products]
    .map(product => {
      const score =
        (product.ratings * 2) +
        (product.sold || 0) +
        (product.featured ? 20 : 0) +
        (product.flashSale?.isActive ? 30 : 0)

      return { ...product, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
}
