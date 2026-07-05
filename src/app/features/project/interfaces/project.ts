export interface Project {
  id: string | number;
  name: string;
  description: string;
  created_at: string;
}

export interface PaginatedProjects {
  data: Project[];
  total: number;
}