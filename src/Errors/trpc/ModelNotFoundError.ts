import { ModelName } from '~/database/schema'
import NotFoundError from './NotFoundError'

export default class ModelNotFoundError extends NotFoundError {
  constructor(modelName: ModelName) {
    super(`model.${modelName}`)
  }
}
