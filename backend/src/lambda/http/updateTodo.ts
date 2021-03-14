import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import {ApiGatewayAdapter} from '../../adapters/AwsApiGatewayAdapter'
import {updateTodoItem} from '../../businessLogic/TodoBusinessLogic'
import { createLogger } from '../../utils/logger'


const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const apiGatewayAdapter =  new ApiGatewayAdapter(event)
  const updatedTodo: UpdateTodoRequest = apiGatewayAdapter.getUpdateTodoRequest()
  const userId =apiGatewayAdapter.getUserIdFromRequest()

  try{
    await updateTodoItem(userId,todoId,updatedTodo)
    logger.info('Todo Updated',userId,todoId)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ''
    }
  }catch(error){
    logger.info('Todo Update Error', error)
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
