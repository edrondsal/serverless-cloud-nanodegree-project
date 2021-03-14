import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {AttachmentAccess} from '../../adapters/AttachmentAccess'
import {ApiGatewayAdapter} from '../../adapters/AwsApiGatewayAdapter'
import {addAttachmentUrl} from '../../businessLogic/TodoBusinessLogic'
import { createLogger } from '../../utils/logger'


const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId:string = event.pathParameters.todoId
  const apiGatewayAdapter =  new ApiGatewayAdapter(event)
  const userId = apiGatewayAdapter.getUserIdFromRequest()
  const attachmentAccess:AttachmentAccess = new AttachmentAccess()
  const uploadUrl:string = attachmentAccess.getUploadSignedUrl(`${todoId}.jpg`)

  await addAttachmentUrl(userId,todoId)
  
  logger.info('Attachment added', todoId,uploadUrl)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}
