export const Direction = {
  ASCENDING: "ASCENDING",
  DESCENDING: "DESCENDING"
};

export function paginationParams(page, size, properties, directions) {
  return {
    params: {
      page: page,
      size: size,
      property: properties.join(","),
      direction: directions.join(",")
    }
  }
}