import { Connection, createConnection, getConnectionOptions } from "typeorm";


export default async (): Promise<Connection> =>{
    const defaultOpitions = await getConnectionOptions();

    return createConnection(
        Object.assign(defaultOpitions, {
            database: process.env.NODE_ENV === 'test' 
            ? "./src/database/database.test.sqlite" 
            : defaultOpitions.database
        })
    );
};