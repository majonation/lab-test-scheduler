import { Router } from 'express';

export class BaseRouter {
  private router: Router;
  private basePath: string;

  constructor(basePath: string = '/api/v1') {
    this.router = Router();
    this.basePath = basePath;
  }

  public getRouter(): Router {
    return this.router;
  }

  public addRouter(path: string, router: Router): void {
    this.router.use(`${this.basePath}${path}`, router);
  }
} 