export const Order = {
  ASCENDING: "ASCENDING",
  DESCENDING: "DESCENDING"
};

export function paginationParams(page, size, order, orderBy) {
  return {
    params: {
      page: page,
      size: size,
      order: order,
      orderBy: orderBy.join(",")
    }
  }
}