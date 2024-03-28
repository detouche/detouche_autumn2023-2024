export interface ICourseTemplate {
  id: number;
  title: string;
  type: string;
  category: string;
  date: Date;
  author: string;
}

export interface ICourseTemplateSidebar {
  id: number;
  title: string;
  type: string;
  category: string;
  description: string;
  educationCenter: string;
  cost: number;
}
