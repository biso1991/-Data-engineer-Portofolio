import { Injectable } from '@angular/core'
import { map, Observable, Observer, Subject } from 'rxjs'
import { AnonymousSubject } from 'rxjs/internal/Subject'
import { environment } from '../../environments/environment'
import { UserService } from './user.service'
export interface Payload {
  type: string
  data: string
}
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private subject!: AnonymousSubject<MessageEvent>
  public payload: Subject<Payload>
  // private interval: any
  constructor(private userService: UserService) {
    this.payload = new Subject<Payload>()
    this.establishWebSocketConnection()
  }

  public establishWebSocketConnection() {
    // eslint-disable-next-line keyword-spacing
    this.payload = <Subject<Payload>>this.connect(
      environment.wsUrl + `monitoring/?token=${this.userService.getToken()}`
    ).pipe(
      map((response: MessageEvent): Payload => {
        const data = JSON.parse(response.data)
        return data
      })
    )
  }

  // Connect to the websocket server and return the observable
  public connect(url: string): AnonymousSubject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url)
    }
    return this.subject
  }

  // Create the websocket connection and return the observable
  private create(url: string): AnonymousSubject<MessageEvent> {
    const ws = new WebSocket(url)
    const observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onopen = () => {}
      ws.onmessage = obs.next.bind(obs)
      ws.onerror = obs.error.bind(obs)
      ws.onclose = obs.complete.bind(obs)
      return ws.close.bind(ws)
    })
    const observer = {
      error: () => {},
      complete: () => {},
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data))
        }
      }
    }
    return new AnonymousSubject<MessageEvent>(observer, observable)
  }
}
