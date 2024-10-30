class FormWorker {
  formatString(value, lowerCase = false) {
    if (typeof value === "string") {
      value = value.trim().replace(/\s+/g, " ");
      return lowerCase ? value.toLowerCase() : value;
    }
    if (Array.isArray(value)) {
      return value.map((item) => {
        item = item.trim().replace(/\s+/g, " ");
        return lowerCase ? item.toLowerCase() : item;
      });
    }
    if (typeof value === "object") {
      return Object.keys(value).reduce((acc, key) => {
        acc[key] = value[key].trim().replace(/\s+/g, " ");
        acc[key] = lowerCase ? acc[key].toLowerCase() : acc[key];
        return acc;
      }, {});
    }
  }
  getErrors(errors, target, form) {
    const validator = {
      ref: (value) => {
        if (/^[A-Z0-9]+/.test(value)) {
          return null;
        } else {
          return "invalid ref";
        }
      },
      date: (value) => {
        const date = new Date(value);
        if (date instanceof Date && !isNaN(date)) {
          return null;
        } else {
          return "invalid date";
        }
      },
    };

    if (!String(target.value).length) {
      return { ...errors, [target.name]: "required" };
    }

    if (validator[target.name]) {
      const result = validator[target.name](target.value, form);
      if (result) {
        return {
          ...errors,
          [target.name]: result,
        };
      }
    }
    const { [target.name]: value, ...rest } = errors;
    return rest;
  }
}
export default FormWorker;
