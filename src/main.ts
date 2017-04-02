import * as express from 'express';
import * as bodyParser from 'body-parser';
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express';
import {Schema} from './schema';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as morgan from 'morgan';

import { getLeaveDetail , applyLeave, changeStatus, userLeaveHistory} from './models/leave-model'
import { getUserDetail, signUp, logIn, matchOtp, currentUserStatus, compareUsers,compareDepartMents } from './models/user-model'

// Default port or given one.
export const GRAPHQL_ROUTE = "/graphql";
export const GRAPHIQL_ROUTE = "/graphiql";

interface IMainOptions {
  enableCors: boolean;
  enableGraphiql: boolean;
  env: string;
  port: number;
  verbose?: boolean;
}

/* istanbul ignore next: no need to test verbose print */
function verbosePrint(port, enableGraphiql) {
  if (true === enableGraphiql) {
    console.log(`GraphiQL Server is now running on http://localhost:${port}${GRAPHIQL_ROUTE}`);
  }
}

class TestConnector {
  public get testString() {
    return "it works from connector as well!";
  }
}

export function main(options: IMainOptions) {
  let app = express();
  
  app.use(helmet());

  app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
   });

   app.get('/', function(req, res, next) {
       // Handle the get for this route
   });

   app.post('/', function(req, res, next) {
       // Handle the post for this route
   });


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


  app.get('/getUserDetails', getUserDetail);
  app.get('/getLeaveDetails', getLeaveDetail)

  app.post('/signUp', signUp);
  app.post('/logIn', logIn);
  app.post('/matchOtp', matchOtp);

  // leave related APIs
  app.post('/applyLeave', applyLeave);
  app.post('/changeStatus', changeStatus);
  
  // statastics
  app.get('/stats',currentUserStatus);
    app.get('/moderator-stats',currentUserStatus);
  app.get('/user-leave-history', userLeaveHistory);

  app.get('/user/compare',compareUsers )
  app.get('/user/compare-department',compareDepartMents )

  











  
  app.use(morgan(options.env));
  
  if (true === options.enableCors) {
    app.use(GRAPHQL_ROUTE, cors());
  }
  
  let testConnector = new TestConnector();
  app.use(GRAPHQL_ROUTE, bodyParser.json(), graphqlExpress({
    context: {
      testConnector
    },
    schema: Schema,
  }));
  
  if (true === options.enableGraphiql) {
    app.use(GRAPHIQL_ROUTE, graphiqlExpress({endpointURL: GRAPHQL_ROUTE}));
  }
  
  return new Promise((resolve, reject) => {
    let server = app.listen(options.port, () => {
      /* istanbul ignore if: no need to test verbose print */
      if (options.verbose) {
        verbosePrint(options.port, options.enableGraphiql);
      }

      resolve(server);
    }).on("error", (err: Error) => {
      reject(err);
    });
  });
}

/* istanbul ignore if: main scope */
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  
  // Either to export GraphiQL (Debug Interface) or not.
  const NODE_ENV = process.env.NODE_ENV !== "production" ? "dev" : "production";
  
  const EXPORT_GRAPHIQL = NODE_ENV !== "production";
  
  // Enable cors (cross-origin HTTP request) or not.
  const ENABLE_CORS = NODE_ENV !== "production";
  
  main({
    enableCors: ENABLE_CORS,
    enableGraphiql: EXPORT_GRAPHIQL,
    env: NODE_ENV,
    port: PORT,
    verbose: true,
  });
}
