import { Client, Account, Databases, Storage, ID } from 'appwrite';

const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint) {
  throw new Error('NEXT_PUBLIC_APPWRITE_ENDPOINT is not defined');
}
if (!projectId) {
  throw new Error('NEXT_PUBLIC_APPWRITE_PROJECT_ID is not defined');
}

client
  .setEndpoint(endpoint) // e.g. https://cloud.appwrite.io/v1
  .setProject(projectId); // Replace with your Appwrite project ID

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const users = new Account(client); // For user-related operations

export { client, account, databases, storage, ID, users };
