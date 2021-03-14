// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'nqymnc0z53'
export const apiEndpoint = `https://${apiId}.execute-api.eu-west-3.amazonaws.com/dev`//'http://localhost:3003/dev'

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-sjf2wms9.eu.auth0.com',            // Auth0 domain
  clientId: '6RmhJ5rtXMUvY6R7l102ZTBTEWTsAW3E',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
