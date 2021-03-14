import * as AWS from 'aws-sdk'


export class AttachmentAccess {

    private readonly s3:AWS.S3
    private readonly expirationLimit:number
    private readonly bucketName:string

    constructor(s3:AWS.S3 = new AWS.S3({
        signatureVersion: 'v4' // Use Sigv4 algorithm
      }),expirationLimit:number = parseInt(process.env.SIGNED_URL_EXPIRATION), 
      bucketName:string = process.env.ATTACHMENT_S3_BUCKET){
        this.s3 = s3
        this.expirationLimit = expirationLimit
        this.bucketName = bucketName
    }

    getUploadSignedUrl(todoId:string):string{
        return this.s3.getSignedUrl('putObject', { // The URL will allow to perform the PUT operation
            Bucket: this.bucketName, // Name of an S3 bucket
            Key: todoId, // id of an object this URL allows access to
            Expires: this.expirationLimit  // A URL is only valid for 5 minutes
          })
    }


}