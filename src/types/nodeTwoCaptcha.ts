declare module '@infosimples/node_two_captcha' {
  type DecodeResponse = {
    id: string
    text: string
  }

  export default class Client {
    constructor(apiKey: string, options: {
      timeout: number
      polling: number
      throwErrors: boolean
    })

    decodeRecaptchaV2(options: {
      googlekey: string
      pageurl: string
    }): Promise<DecodeResponse>
  }
}
