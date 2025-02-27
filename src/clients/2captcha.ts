import axios from 'axios'
import { Promise } from 'bluebird'
import logger from '~/helpers/logger'
import { _brand } from '~/helpers/types'

const {
  TWO_CAPTCHA_API_KEY,
} = process.env

const client = axios.create({
  baseURL: 'https://api.2captcha.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

type TaskID = number & { [_brand]: '2CAPTCHA_TaskID' }

type CreateTaskResponse = {
  errorId: number
  taskId: TaskID
}

type GetTaskResultResponse = {
  errorId: number
  status?: 'ready' | 'processing'
  solution?: {
    gRecaptchaResponse: string
    token: string
  }
}

const RETRIES = 10
const RETRY_DELAY = 5 // Attempt * RETRY_DELAY between attempts

export const solveRecaptchaV2 = async (key: string, url: string, attempt = 1): Promise<string> => {
  if (!TWO_CAPTCHA_API_KEY) {
    throw new Error('2Captcha API key not found')
  }

  const {
    data: createTaskResponse,
  } = await client.post<CreateTaskResponse>('/createTask', {
    clientKey: TWO_CAPTCHA_API_KEY,
    task: {
      type: 'RecaptchaV2TaskProxyless',
      websiteURL: url,
      websiteKey: key,
    },
  })

  const {
    errorId,
    taskId,
  } = createTaskResponse

  if (errorId !== 0) {
    throw new Error(`Error creating task: ${errorId}`)
  }

  const {
    data: getTaskResultResponse,
  } = await client.post<GetTaskResultResponse>('/getTaskResult', {
    clientKey: TWO_CAPTCHA_API_KEY,
    taskId,
  })

  if (getTaskResultResponse.errorId !== 0) {
    throw new Error(`Error getting task result: ${getTaskResultResponse.errorId}`)
  }

  if (getTaskResultResponse.status === 'processing') {
    if (attempt >= RETRIES) {
      logger.error({
        taskId,
      }, `Recaptcha task not ready after ${RETRIES} attempts`)
      throw new Error(`Recaptcha task not ready after ${RETRIES} attempts`)
    }

    const seconds = RETRY_DELAY * attempt
    logger.debug(`Recaptcha task not ready, retrying in ${seconds} seconds`)
    await Promise.delay(seconds * 1000)
    return solveRecaptchaV2(key, url, attempt + 1)
  }

  if (!getTaskResultResponse.solution) {
    throw new Error('No solution found')
  }

  return getTaskResultResponse.solution.gRecaptchaResponse
}
