function toCamelCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase()),
        toCamelCase(value)
      ])
    );
  }
  return obj;
}

module.exports = toCamelCase;