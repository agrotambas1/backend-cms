import { Request, Response } from "express";
export declare const getEvents: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getEventById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const bulkDeleteEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=eventController.d.ts.map