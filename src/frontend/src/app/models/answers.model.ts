/* eslint-disable camelcase */
export class Answers {
  id: string
  Date: string
  document_id: string
  query: string
  answer: string
  score: any
  chosen: any
  offsets_in_document_start: number
  offsets_in_document_end: number
  context: string
  index: string
  project_id: number
  project_name: string
  documentName: string
}

export class Answers_QA {
  answer: string
  context: string
  document_id: string
  meta: any
  score: number
  chosen: boolean
}
