import conf from '../conf/conf';
import { Account, Client, Databases, ID, Query } from 'appwrite';

export class DatabaseService {
    client = new Client();
    account;
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectID);
        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
    }

    createAccount = async (email, password, name) => {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                return this.loginAccount(email, password);
            } else {
                return userAccount;
            }
        } catch (error) {
            console.log("Appwrite service :: createAccount :: error", error);
        }
    }

    loginAccount = async (email, password) => {
        try {
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            console.log("Appwrite service :: loginAccount :: error", error);
        }
    }

    logoutAccount = async () => {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logoutAccount :: error", error);
        }
    }

    getCurrentUser = async () => {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
        }

        return null;
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