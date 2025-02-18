const db = require("../../../../config/db");

module.exports = (req, res, next) => {
  try {
    let path = req.path.split("/").slice(2);

    if (path[path.length - 1] === "") {
      path = path.slice(0, -1);
    }

    req.slicedPath = path;

    if (path.length) {
      path = "/items/" + path.join("/items/");
    } else if (req.path.startsWith(`/add`)) {
      path = "/";
    } else {
      throw new Error(`Invalid budget item path`);
    }

    const docPath = `users/${req.user.id}/budget/info${path}`;
    req.itemRef = db.doc(docPath);

    next();
  } catch (error) {
    next(error);
  }
};
