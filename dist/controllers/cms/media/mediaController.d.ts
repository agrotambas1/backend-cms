import { Request, Response } from "express";
export declare const getMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMediaById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const uploadMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const bulkDeleteMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const downloadMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=mediaController.d.ts.map