class FormWorker {
  getErrors(errors, target, form) {
    const validator = {
      ref: (value, form) => {
        if (/^[A-Z0-9]+/.test(value)) {
          return null;
        } else {
          return "invalid ref";
        }
      },
      expense: (value) => {
        if (value.includes(",")) {
          if (value.trim().length > 1 && !value.startsWith(",")) {
            return null;
          } else {
            return "Expense must be before comma";
          }
        }
      },
    };

    if (!target.value.length) {
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
