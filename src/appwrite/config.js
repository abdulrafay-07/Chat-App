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

    subscribe = async () => {
        try {
            return this.client;
        } catch (error) {
            console.log("Appwrite service :: subscribe :: error", error);
            return false;
        }
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

    deleteMessage = async (msgId) => {
        try {
            return await this.databases.deleteDocument(
                conf.appwriteDatabaseID,
                conf.appwriteCollectionID,
                msgId
            )
        } catch (error) {
            console.log("Appwrite service :: deleteMessage :: error", error);
        }
    }
}

const databaseService = new DatabaseService();

export default databaseService;