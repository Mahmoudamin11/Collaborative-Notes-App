import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

type Schemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

export const validate =
  (schema: Schemas) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) req.body = await schema.body.parseAsync(req.body);
      if (schema.params)
        await schema.params.parseAsync(req.params);
      if (schema.query) await schema.query.parseAsync(req.query);

      next();
    } catch (error) {
      next(error);
    }
  };
