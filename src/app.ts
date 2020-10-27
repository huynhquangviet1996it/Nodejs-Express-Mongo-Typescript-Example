import { CommonRoutes } from './routes/common_routes';
import { UserRoutes } from './routes/user_routes';
import { TestRoutes } from './routes/test_routes';

import * as express from "express";
import * as bodyParser from "body-parser";
import { MongoDatasource } from './datasources/mongoDatasource'
class App {
   public app: express.Application;
   private test_routes: TestRoutes = new TestRoutes();
   private common_routes: CommonRoutes = new CommonRoutes();
   private user_routes: UserRoutes = new UserRoutes();
   private mongo_datasource: MongoDatasource = new MongoDatasource()
   constructor() {
      this.app = express();
      this.config();
      this.test_routes.route(this.app);
      this.user_routes.route(this.app);
      this.common_routes.route(this.app);
   }

   private config(): void {
      // support application/json type post data
      this.app.use(bodyParser.json());
      //support application/x-www-form-urlencoded post data
      this.app.use(bodyParser.urlencoded({ extended: false }));
   }
}

export default new App().app;