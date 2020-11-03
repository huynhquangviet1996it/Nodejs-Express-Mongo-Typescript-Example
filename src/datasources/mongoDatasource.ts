import environment from "../environment";
import * as mongoose from 'mongoose';

export class MongoDatasource {
   public mongoUrl: string = `mongodb://${environment.getCredentialInfo()}@localhost/${environment.getDBName()}`;

   constructor(mongoUrl?: string) {
      this.mongoUrl = mongoUrl ?? this.mongoUrl;
      this.mongoSetup()
   }

   private mongoSetup(): void {
      mongoose.connect(
         this.mongoUrl, 
         { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true, 
            useFindAndModify: false 
         }
      );
   }
}
