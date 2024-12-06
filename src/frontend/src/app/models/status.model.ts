/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
enum StatusENUM {
  idle = 0,
  running = 1,
  finished = 2,
  failed = 3,
  aborted = 4
}

export class Status {
  status = StatusENUM
}
