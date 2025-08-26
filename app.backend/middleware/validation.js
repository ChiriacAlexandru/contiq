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
  .pattern(new RegExp('^(RO)?[0-9]{2,10}$'))
  .allow('') // Allow empty strings
  .optional()
  .messages({
    'string.pattern.base': 'CUI-ul trebuie să aibă formatul RO urmărit de 2-10 cifre (sau doar cifre)'
  });

// Function to clean and trim string values recursively
const cleanData = (obj) => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    const cleaned = obj.trim();
    return cleaned === '' ? undefined : cleaned;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(cleanData);
  }
  
  if (typeof obj === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = cleanData(value);
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    }
    return cleaned;
  }
  
  return obj;
};

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    // Clean data before validation
    req.body = cleanData(req.body);
    
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
  nume_firma: Joi.string().min(2).max(255).allow('').optional(),
  cui: cuiSchema,
  nr_reg_comert: Joi.string().max(100).allow('').optional(),
  adresa_sediu: Joi.string().max(500).allow('').optional(),
  oras: Joi.string().max(100).allow('').optional(),
  judet: Joi.string().max(100).allow('').optional(),
  cod_postal: Joi.string().pattern(new RegExp('^[0-9]{4,6}$')).allow('').optional().messages({
    'string.pattern.base': 'Codul poștal trebuie să conțină între 4 și 6 cifre'
  }),
  tara: Joi.string().max(100).allow('').optional(),
  telefon: Joi.string().pattern(new RegExp('^\\+?[0-9\\s\\-\\(\\)]{10,15}$')).allow('').optional().messages({
    'string.pattern.base': 'Numărul de telefon nu este valid'
  }),
  email: Joi.string().email().allow('').optional(),
  website: Joi.string().uri().allow('').optional(),
  capital_social: Joi.number().min(0).optional(),
  cont_bancar: Joi.string().max(34).allow('').optional().messages({
    'string.max': 'Contul bancar trebuie să aibă maxim 34 caractere'
  }),
  banca: Joi.string().max(255).allow('').optional(),
  platitor_tva: Joi.boolean().optional(),
  reprezentant_legal: Joi.string().min(2).max(100).pattern(new RegExp('^[a-zA-ZăâîșțĂÂÎȘȚ\\s\\-\\.]*$')).allow('').optional().messages({
    'string.min': 'Numele trebuie să aibă minim 2 caractere',
    'string.max': 'Numele trebuie să aibă maxim 100 caractere', 
    'string.pattern.base': 'Numele poate conține doar litere, spații, cratime și puncte'
  }),
  functie_reprezentant: Joi.string().valid('Administrator', 'Director General', 'Manager', 'Asociat').allow('').optional(),
  cnp_reprezentant: Joi.string().pattern(new RegExp('^[0-9]{13}$')).allow('').optional().messages({
    'string.pattern.base': 'CNP-ul trebuie să conțină exact 13 cifre'
  }),
  an_fiscal: Joi.string().pattern(new RegExp('^[0-9]{4}$')).allow('').optional(),
  moneda_principala: Joi.string().valid('RON', 'EUR', 'USD').allow('').optional(),
  limba_implicita: Joi.string().valid('RO', 'EN', 'FR').allow('').optional(),
  timp_zona: Joi.string().max(50).allow('').optional()
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