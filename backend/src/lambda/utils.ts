import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}
/**
* @description Function to return database key from a timestamp. Firebase style of doing to have keys already ordered by creation date
* @returns {String} the database key string
*/
export function pushKey(): string{
  const PUSH_CHARS:string = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
  let lastPushTime:number = Date.now()
  let timeStampChars:string[] = Array.from('k'.repeat(8));
  for (let i=0;i<7;i++){
      let index = lastPushTime%64;
      timeStampChars[7-i] = PUSH_CHARS[index];
      lastPushTime=lastPushTime/64;
  }
  
  let result:string = timeStampChars.join("");
  for(let j=0;j<11;j++){
      result = result + PUSH_CHARS[Math.floor(Math.random() * PUSH_CHARS.length)];
  }
  return result;
}