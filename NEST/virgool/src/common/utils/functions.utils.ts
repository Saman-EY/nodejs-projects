export const createSlug = (str: string) => {
  return str.replace(/[><ءأإؤ»:"«ـُِّ\.\+_\-)(*^&#@!%$~:"'><;?`)]/g, "")?.replace(/[\s]+/g, "-");
};
