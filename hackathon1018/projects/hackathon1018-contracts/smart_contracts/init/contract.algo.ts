import { Contract } from '@algorandfoundation/algorand-typescript'

export class Init extends Contract {
  hello(name: string): string {
    return `Hello, ${name}`
  }
}
