import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {ApiGatewayAdapter} from '../../adapters/AwsApiGatewayAdapter'
import {deleteTodoItem} from '../../businessLogic/TodoBusinessLogic'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const apiGatewayAdapter =  new ApiGatewayAdapter(event)
  const userId =apiGatewayAdapter.getUserIdFromRequest()

  try{
    await deleteTodoItem(userId,todoId)
    logger.info('Todo Deleted',userId,todoId)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ''
    }
  }catch(error){
    logger.info('Delete Todo Error', error)
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
