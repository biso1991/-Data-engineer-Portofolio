/* eslint-disable camelcase */
export class File {
  id: number
  file_name: string
  extension: string
  project_f: number
  file_f: string
  create_date: string
  update_date: string
  file_size: number
  // Custom fields
  Project_name: string
}

export class FileQA {
  id: number
  name: string
  score: number
}
