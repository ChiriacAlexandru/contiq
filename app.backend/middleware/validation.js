const Joi = require('joi');

// Password validation schema - strong password requirements
const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
  .required()
  .messages({
    'string.min': 'Parola trebuie să aibă minim 8 caractere',
    'string.max': 'Parola trebuie să aibă maxim 128 caractere',
    'string.pattern.base': 'Parola trebuie să conțină cel puțin: o literă mică, o literă mare, o cifră și un caracter special (!@#$%^&*)',
    'any.required': 'Parola este obligatorie'
  });

// Email validation schema
const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .max(255)
  .required()
  .messages({
    'string.email': 'Email-ul trebuie să fie valid',
    'string.max': 'Email-ul trebuie să aibă maxim 255 caractere',
    'any.required': 'Email-ul este obligatoriu'
  });

// Name validation schema
const nameSchema = Joi.string()
  .min(2)
  .max(100)
  .pattern(new RegExp('^[a-zA-ZăâîșțĂÂÎȘȚ\\s\\-\\.]+$'))
  .required()
  .messages({
    'string.min': 'Numele trebuie să aibă minim 2 caractere',
    'string.max': 'Numele trebuie să aibă maxim 100 caractere', 
    'string.pattern.base': 'Numele poate conține doar litere, spații, cratime și puncte',
    'any.required': 'Numele este obligatoriu'
  });

// User type validation schema
const userTypeSchema = Joi.string()
  .valid('user', 'administrator', 'contabil')
  .optional()
  .messages({
    'any.only': 'Tipul utilizatorului trebuie să fie: user, administrator sau contabil'
  });

// Phone validation schema
const phoneSchema = Joi.string()
  .pattern(new RegExp('^\\+?[0-9\\s\\-\\(\\)]{10,15}$'))
  .optional()
  .messages({
    'string.pattern.base': 'Numărul de telefon nu este valid'
  });

// CUI validation schema (Romanian tax identification number)
const cuiSchema = Joi.string()
  .pattern(new RegExp('^RO[0-9]{2,10}$'))
  .required()
  .messages({
    'string.pattern.base': 'CUI-ul trebuie să aibă formatul RO urmărit de 2-10 cifre',
    'any.required': 'CUI-ul este obligatoriu'
  });

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { 
      abortEarly: false, // Return all validation errors
      stripUnknown: true // Remove unknown fields
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({ 
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors 
      });
    }
    
    next();
  };
};

// Registration validation schema
const registrationSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  nume: nameSchema,
  userType: userTypeSchema
});

// Login validation schema  
const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required().messages({
    'any.required': 'Parola este obligatorie'
  })
});

// User details validation schema
const userDetailsSchema = Joi.object({
  nume: nameSchema.optional(),
  telefon: phoneSchema,
  pozitie: Joi.string().max(100).optional(),
  companie: Joi.string().max(255).optional(),
  locatie: Joi.string().max(255).optional(),
  bio: Joi.string().max(1000).optional(),
  website: Joi.string().uri().optional(),
  linkedin: Joi.string().uri().optional(),
  tema: Joi.string().valid('light', 'dark', 'auto').optional(),
  limba: Joi.string().valid('ro', 'en', 'fr').optional(),
  timezone: Joi.string().max(50).optional(),
  date_format: Joi.string().valid('dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd').optional(),
  currency: Joi.string().valid('RON', 'EUR', 'USD').optional(),
  sounds: Joi.boolean().optional(),
  animations: Joi.boolean().optional(),
  compact_mode: Joi.boolean().optional(),
  notifications_email: Joi.object().optional(),
  notifications_push: Joi.object().optional(),
  notifications_sms: Joi.object().optional()
});

// Company data validation schema
const companyDataSchema = Joi.object({
  nume_firma: Joi.string().min(2).max(255).optional(),
  cui: cuiSchema.optional(),
  nr_reg_comert: Joi.string().max(100).optional(),
  adresa_sediu: Joi.string().max(500).optional(),
  oras: Joi.string().max(100).optional(),
  judet: Joi.string().max(100).optional(),
  cod_postal: Joi.string().pattern(new RegExp('^[0-9]{6}$')).optional().messages({
    'string.pattern.base': 'Codul poștal trebuie să conțină exact 6 cifre'
  }),
  tara: Joi.string().max(100).optional(),
  telefon: phoneSchema,
  email: Joi.string().email().optional(),
  website: Joi.string().uri().optional(),
  capital_social: Joi.number().min(0).optional(),
  cont_bancar: Joi.string().pattern(new RegExp('^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$')).optional().messages({
    'string.pattern.base': 'IBAN-ul nu este valid'
  }),
  banca: Joi.string().max(255).optional(),
  platitor_tva: Joi.boolean().optional(),
  reprezentant_legal: nameSchema.optional(),
  functie_reprezentant: Joi.string().valid('Administrator', 'Director General', 'Manager', 'Asociat').optional(),
  cnp_reprezentant: Joi.string().pattern(new RegExp('^[0-9]{13}$')).optional().messages({
    'string.pattern.base': 'CNP-ul trebuie să conțină exact 13 cifre'
  }),
  an_fiscal: Joi.string().pattern(new RegExp('^[0-9]{4}$')).optional(),
  moneda_principala: Joi.string().valid('RON', 'EUR', 'USD').optional(),
  limba_implicita: Joi.string().valid('RO', 'EN', 'FR').optional(),
  timp_zona: Joi.string().max(50).optional()
});

// Middleware functions
const validateRegistration = validate(registrationSchema);
const validateLogin = validate(loginSchema);
const validateUserDetails = validate(userDetailsSchema);
const validateCompanyData = validate(companyDataSchema);

module.exports = {
  validate,
  validateRegistration,
  validateLogin,
  validateUserDetails,
  validateCompanyData,
  // Export schemas for reuse
  schemas: {
    passwordSchema,
    emailSchema,
    nameSchema,
    userTypeSchema,
    phoneSchema,
    cuiSchema,
    registrationSchema,
    loginSchema,
    userDetailsSchema,
    companyDataSchema
  }
};