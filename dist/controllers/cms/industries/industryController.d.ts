import { Request, Response } from "express";
export declare const getIndustries: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getIndustryById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createIndustry: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateIndustry: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteIndustry: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=industryController.d.ts.map