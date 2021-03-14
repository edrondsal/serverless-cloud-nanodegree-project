import { APIGatewayProxyEvent} from 'aws-lambda'
import {getUserId} from '../lambda/utils'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'


export class ApiGatewayAdapter {

    private readonly event:APIGatewayProxyEvent

    constructor(event:APIGatewayProxyEvent){
        this.event = event
    }

    getCreateTodoRequest():CreateTodoRequest{
        const newTodo: CreateTodoRequest = JSON.parse(this.event.body)
        return newTodo
    }

    getUpdateTodoRequest():UpdateTodoRequest{
        const updatedTodo: UpdateTodoRequest = JSON.parse(this.event.body)
        return updatedTodo
    }

    getUserIdFromRequest():string {
        return getUserId(this.event)
    }
}

