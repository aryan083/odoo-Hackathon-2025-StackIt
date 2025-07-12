/**
 * Joi request-validation helper.
 * Usage:
 *   router.post('/route', validate({ body: schema }), controller)
 */
import { Request, Response, NextFunction } from 'express';
import Joi, { ObjectSchema } from 'joi';

type Schemas = Partial<Record<'body' | 'params' | 'query', ObjectSchema>>;

export const validate =
  (schemas: Schemas) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      (['params', 'query', 'body'] as const).forEach((key) => {
        if (schemas[key]) {
          const { error, value } = schemas[key]!.validate(req[key], { abortEarly: false });
          if (error) throw error;
          // replace with the parsed/typed value
          Object.assign(req[key], value);
        }
      });
      next();
    } catch (err) {
      res.status(400).json({
        message: 'Validation error',
        details: (err as Joi.ValidationError).details.map((d) => d.message)
      });
    }
  };