/* eslint-disable camelcase */
export class TrainingJob {
  id: number
  name: string
  project: any
  status: number
  per_gpu_batch_size: number
  learning_rate: number
  warmup_steps: number
  num_epochs: number
  celery_task_id: string
  create_date: string
  update_date: string

  // Customized fields
  Project_name: string
}
