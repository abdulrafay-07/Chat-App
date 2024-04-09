import conf from '../conf/conf';
import { Client, Databases, ID, Query } from 'appwrite';

export class DatabaseService {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectID);
        this.databases = new Databases(this.client);
    }

    getMessages = async () => {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseID, 
                conf.appwriteCollectionID,
                [
                    Query.orderAsc('$createdAt')
                ]
            );
        } catch (error) {
            console.log("Appwrite service :: getMessages :: error", error);
            return false;
        }
    }

    createMessage = async ({payload}) => {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                ID.unique(),
                payload
            )
        } catch (error) {
            console.log("Appwrite service :: createMessage :: error", error);
        }
    }
}

const databaseService = new DatabaseService();

export default databaseService;