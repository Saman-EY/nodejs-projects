const { validate, Joi } = require("express-validation");
const { ProductTypes } = require("../../common/prodcut.const");

const assignPermissionToRoleValidation = validate({
  body: Joi.object({
    permissions: Joi.array().items(Joi.number()).optional(),
    roleId: Joi.number().required(),
  }),
});

module.exports = {
  assignPermissionToRoleValidation,
};
