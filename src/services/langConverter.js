const languageConverter = (
  obj,
  lang,
  fallbackLang = "uz",
  visited = new WeakSet()
) => {
  if (!obj || typeof obj !== "object") return obj;

  if (visited.has(obj)) return obj;
  visited.add(obj);

  if (Array.isArray(obj)) {
    return obj.map((item) =>
      languageConverter(item, lang, fallbackLang, visited)
    );
  }

  const translated = {};
  const exceptionKeys = ["_id", "date", "time", "startTime", "endTime", "createdAt", "updatedAt", "user"];
  for (const key in obj) {
    const value = obj[key];

    if (
      exceptionKeys.includes(key) ||
      (value && typeof value === "object" && value.type === "Buffer")
    ) {
      translated[key] = value;
      continue;
    }

    if (typeof value === "object" && value !== null) {
      if (value[lang] || value[fallbackLang]) {
        translated[key] = value[lang] || value[fallbackLang];
      } else {
        translated[key] = languageConverter(value, lang, fallbackLang, visited);
      }
    } else {
      translated[key] = value;
    }
  }
  return translated;
};

module.exports = { languageConverter };
