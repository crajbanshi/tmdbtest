import Joi from '@hapi/joi';
import { datavalidate } from '../helpers';

let getUserSchema = Joi.object().keys({
    userid: Joi.string().alphanum().min(3).max(100).optional()
});

let saveUserSchema = Joi.object().keys({
    fname: Joi.string().min(3).max(100).required(),
    lname: Joi.string().min(3).max(100).optional(),
    username: Joi.string().alphanum().min(5).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(50).required(),
    profileimage: Joi.string().optional()
});

let loginSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(5).max(30).required(),
    password: Joi.string().min(8).max(50).required()
});

let getUserValidate = (req, res, next) => {
    req.validateSchema = getUserSchema;
    datavalidate(req, res, next);
}

let saveUserValidate = (req, res, next) => {
    req.validateSchema = saveUserSchema;
    datavalidate(req, res, next);
}

let loginValidate = (req, res, next) => {
    req.validateSchema = loginSchema;
    datavalidate(req, res, next);
}

export { getUserValidate, saveUserValidate, loginValidate };