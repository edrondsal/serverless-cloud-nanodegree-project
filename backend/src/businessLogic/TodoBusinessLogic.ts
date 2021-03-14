import {TodoAccess} from '../adapters/TodoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import {TodoItem} from '../models/TodoItem'
import {TodoUpdate} from '../models/TodoUpdate'
import {pushKey} from '../lambda/utils'


export async function createTodoItem(newTodo:CreateTodoRequest,userId:string):Promise<TodoItem>{
    const todoAccess = new TodoAccess()
    
    const timestamp = new Date().toISOString()
    const todoId = pushKey()
    
    const todoItem:TodoItem  = {
        userId: userId,
        todoId: todoId,
        createdAt: timestamp,
        done: false,
        ...newTodo
      }

    await todoAccess.createTodo(todoItem)
    return todoItem
}

export async function getAllTodosForUser(userId:string):Promise<TodoItem[]>{
  const todoAccess = new TodoAccess()
  return todoAccess.getAllTodosByUser(userId)
}

export async function updateTodoItem(userId:string,todoId:string,updateTodo:UpdateTodoRequest):Promise<Object>{
  const todoAccess = new TodoAccess()
  const todoUpdate:TodoUpdate = {
    ...updateTodo
  }
  return todoAccess.updateTodo(userId,todoId,todoUpdate)
}

export async function addAttachmentUrl(userId:string,todoId:string):Promise<Object>{
  const todoAccess = new TodoAccess()
  return todoAccess.updateTodoAttachment(userId,todoId)
}

export async function deleteTodoItem(userId:string,todoId:string):Promise<Object>{
  const todoAccess = new TodoAccess()
  return todoAccess.deleteTodo(userId,todoId)
}