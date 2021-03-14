import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {ApiGatewayAdapter} from '../../adapters/AwsApiGatewayAdapter'
import {getAllTodosForUser} from '../../businessLogic/TodoBusinessLogic'
import {TodoItem} from '../../models/TodoItem'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
  const apiGatewayAdapter = new ApiGatewayAdapter(event) 
  const userId:string = apiGatewayAdapter.getUserIdFromRequest()

  try{
    const items:TodoItem[] = await getAllTodosForUser(userId)
    logger.info('Todos Read',userId)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items
      })
    }
  }catch(error){
    logger.info('Todo Read Error', error)
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
