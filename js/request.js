export const request = async (url) => {
  const data = await (await fetch(url)).json();
  return data;
};
