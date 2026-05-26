import AHDjsLib from 'ahdjs'
import { PAGE_PILOT_API_HOST } from '@/shared/constants/constants'

const AHDjs = (AHDjsLib as any).default ?? AHDjsLib

class AHDjsService {
  private static instance: AHDjsService | null = null
  private client: any = null
  private visitorId: string | null = null
  private applicationId: string | null = null

  private constructor() {}

  static getInstance(): AHDjsService {
    if (!AHDjsService.instance) {
      AHDjsService.instance = new AHDjsService()
    }
    return AHDjsService.instance
  }

  init(visitorId: string, applicationId: string): any {
    if (!this.client || this.visitorId !== visitorId || this.applicationId !== applicationId) {
      this.client = AHDjs(undefined, {
        applicationId,
        apiHost: PAGE_PILOT_API_HOST,
        visitorId,
        showProgressbar: false,
        
      })
      this.visitorId = visitorId
      this.applicationId = applicationId
    }
    return this.client
  }

  getClient(): any {
    return this.client
  }
}

export default AHDjsService
