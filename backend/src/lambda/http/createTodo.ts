import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {TodoItem} from '../../models/TodoItem'
import {createTodoItem} from '../../businessLogic/TodoBusinessLogic'
import {ApiGatewayAdapter} from '../../adapters/AwsApiGatewayAdapter'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const apiGatewayAdapter = new ApiGatewayAdapter(event)
  const newTodo:CreateTodoRequest = apiGatewayAdapter.getCreateTodoRequest()
  const userId:string = apiGatewayAdapter.getUserIdFromRequest()
  
  try{
    let todoItem:TodoItem  = await createTodoItem(newTodo,userId)
    logger.info('Todo Created',userId)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: todoItem
      })
    }
  }catch(error){
    logger.info('Todo Creation Error', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: 'Internal Server Error'
    }
  }
  
 
 
}
