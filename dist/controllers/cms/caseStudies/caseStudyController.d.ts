import e, { Request, Response } from "express";
export declare const getCaseStudies: (req: Request, res: Response) => Promise<e.Response<any, Record<string, any>> | undefined>;
export declare const getCaseStudyById: (req: Request, res: Response) => Promise<e.Response<any, Record<string, any>> | undefined>;
export declare const createCaseStudy: (req: Request, res: Response) => Promise<e.Response<any, Record<string, any>>>;
export declare const updateCaseStudy: (req: Request, res: Response) => Promise<e.Response<any, Record<string, any>>>;
export declare const deleteCaseStudy: (req: Request, res: Response) => Promise<e.Response<any, Record<string, any>>>;
export declare const bulkDeleteCaseStudy: (req: Request, res: Response) => Promise<e.Response<any, Record<string, any>>>;
//# sourceMappingURL=caseStudyController.d.ts.map