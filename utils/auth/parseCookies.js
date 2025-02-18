module.exports = (headerCookie) => {
  const cookies = {};
  headerCookie &&
    String(headerCookie)
      .split("; ")
      .forEach((cookie) => {
        const [key, value] = cookie.split("=");
        cookies[key] = value;
      });
  return cookies;
};
