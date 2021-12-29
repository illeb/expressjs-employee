import { Application as ExpressApplication } from 'express';

/**
 * Represents a single, generic route
 */
export interface IApplicationRoute {
    app: ExpressApplication;

    addRoutes(): ExpressApplication;
}