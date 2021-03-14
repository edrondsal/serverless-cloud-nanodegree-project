import {TodoItem} from '../models/TodoItem'
import {TodoUpdate} from '../models/TodoUpdate'
import * as AWS from 'aws-sdk'


function createDynamoDbDocumentClient():AWS.DynamoDB.DocumentClient{
    if(process.env.IS_OFFLINE){
        console.log('Creating DocumentClient for Offline test')
        return new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: `http://localhost:${process.env.DYNAMODB_OFFLINE_PORT}/`
        })
    }

    return new AWS.DynamoDB.DocumentClient()
}

export class TodoAccess {

    private readonly docClient:AWS.DynamoDB.DocumentClient
    private readonly tableName:string
    private readonly indexName:string 

    constructor(docClient:AWS.DynamoDB.DocumentClient = createDynamoDbDocumentClient(),tableName:string = process.env.TODOS_TABLE, 
    indexName:string = process.env.INDEX_NAME){
        this.docClient = docClient
        this.tableName = tableName
        this.indexName = indexName
    }

    async getAllTodosByUser(userId:string):Promise<TodoItem[]>{
        const result = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.indexName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
              ':userId': userId
            }
          }).promise()
        
        const items = result.Items as TodoItem[]
        return items
    }

    async createTodo(todoItem:TodoItem):Promise<Object>{
        return this.docClient.put({ 
            TableName: this.tableName,
            Item: todoItem
          }).promise()
    }

    async updateTodo(userId:string,todoId:string,updatedTodo:TodoUpdate):Promise<Object>{
        const params = {
            TableName: this.tableName,
            Key:{
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: "set #nm = :name, dueDate=:dueDate, done=:done",
            ExpressionAttributeNames:{
                "#nm": "name"
            }, 
            ExpressionAttributeValues:{
                ":name": updatedTodo.name,
                ":dueDate": updatedTodo.dueDate,
                ":done": updatedTodo.done
            },
            ReturnValues:"UPDATED_NEW"
          };
        
        return this.docClient.update(params).promise()        
    }

    async updateTodoAttachment(userId:string,todoId:string):Promise<Object>{
        const params = {
            TableName: this.tableName,
            Key:{
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues:{
                ":attachmentUrl": `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.eu-west-3.amazonaws.com/${todoId}.jpg`
            },
            ReturnValues:"UPDATED_NEW"
          };
        return this.docClient.update(params).promise()   
    }

    async deleteTodo(userId:string,todoId:string):Promise<Object>{
        const params = {
            TableName: this.tableName,
            Key:{
                "userId": userId,
                "todoId": todoId
            }
          };
        
        return this.docClient.delete(params).promise()
    }

}

