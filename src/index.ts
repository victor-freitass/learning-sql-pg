import express, { Express } from 'express';
import cors from 'cors';
import client from './database/connection';
import routes from './api/routes';


class App {
    public express: Express;

    constructor () {
        this.express = express();
        this.middlewares();
        this.routes();
        this.appListen();
    };

    middlewares(): void {
        this.express.use(express.json());
        this.express.use(cors());     
    };

    routes() : void {
        this.express.use(routes);
    }; 

    async connection(): Promise<boolean> {
        try {
            await client.connect();
            return true;
        } catch (e) {
            console.log(e);
            return false;
        };
    };

    async appListen(): Promise<void> {
        if (await this.connection()){
            this.express.listen(3000, () => {
                console.log('Backend running...');
            });
        };
    };
};   

new App();