import { User } from './user.model'

/* eslint-disable camelcase */
export class Project {
  id: number
  name: string
  description: string
  owner: User
  uuid: string
  create_date: string
  update_date: string
  model: any
  store_name: string
  elastic_index: string
  elastic_index_answers: string
  elastic_index_eval_docs: string
  elastic_index_labels: string
  trained_model_ref_url: string
  trained_model_path: string
  retreiver_count: number
  reader_count: number
  files_hash: string
  files_ready: boolean
  vote: boolean
  preprocessing_options: string
  split_overlap: number
  split_length: number
  split_respect_sentence_boundary: boolean
  split_by: string
  // Custom fields
  training_job_status_project: any
  latest_training: string
  model_name: string
  nb_files: number
  nb_Answers: any
}
