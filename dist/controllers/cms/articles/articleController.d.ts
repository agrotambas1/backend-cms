import { Request, Response } from "express";
export declare const getArticles: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getArticleById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createArticle: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateArticle: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteArticle: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const bulkDeleteArticle: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=articleController.d.ts.map