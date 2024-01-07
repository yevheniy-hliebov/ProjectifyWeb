export interface TaskDto {
  name: string,
  description?: string;
  status?: string;
  priority?: string;
  start_date?: string;
  end_date?: string;
  project_id?: string;
  user_id?: string;
  number?: number;
}