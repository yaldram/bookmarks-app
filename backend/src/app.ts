import 'dotenv/config'
import "./aliases"
import * as http from 'http'

import { logger } from "@utils/logger"
import expressServer from "./server"
import { mongoClient, DB_NAME } from './utils/dbClient';

class Main {
  private readonly port = process.env.SERVER_PORT || 8080;
  private server: http.Server;

  constructor() {
    this.server = http.createServer(expressServer);
    this.startServer();
    this.handleServerShutDown();
  }

  private stopServer() {
    // stop the express server
    this.server.close(async () => {
      logger.info('Express server is closed.');
      try {
        // close the database connection
        await mongoClient.close()
        logger.info('Mongo DB disconnected')
      } catch (error) {
        logger.fatal('Error disconnecting mongo db', error)
      } finally {
        // exit the node.js process
        process.exit(0);
      }
    });
  }

  private async startServer() {
    try {
      // connnect to atlas cluster  
      await mongoClient.connect();
      logger.info('Connected to Mongo Cluster');
      // ping the bookmarks db
      await mongoClient.db(DB_NAME).command({ ping: 1 });
      logger.info('Pinged the Database');
      // start the express server
      this.server.listen(this.port, () => {
        logger.info(`Server started on port ${this.port}`);
      })
    } catch (error) {
      logger.fatal(`Error connecting to Database - ${error}`);
    }
  }

  private handleServerShutDown() {
    // Ctrl + C
    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down server');
      this.stopServer();
    });

    // kill command
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down server');
      this.stopServer();
    });
  }
}

new Main()