export type Role = "consultant" | "client";
export type EngagementStatus = "active" | "paused" | "completed";
export type EngagementStage = "discovery" | "assessment" | "recommendations" | "implementation" | "complete";

export const ENGAGEMENT_STAGES: EngagementStage[] = [
  "discovery",
  "assessment",
  "recommendations",
  "implementation",
  "complete",
];

export const ENGAGEMENT_STAGE_LABELS: Record<EngagementStage, string> = {
  discovery: "Discovery",
  assessment: "Assessment",
  recommendations: "Recommendations",
  implementation: "Implementation",
  complete: "Complete",
};

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: Role;
  created_at: string;
}

export interface Vertical {
  id: string;
  slug: string;
  name: string;
}

export interface Engagement {
  id: string;
  business_id: string;
  consultant_id: string;
  consultant?: { id: string; name: string };
  status: EngagementStatus;
  stage: EngagementStage;
  notes: string | null;
  started_at: string;
  created_at: string;
}

export interface Business {
  id: string;
  name: string;
  vertical_id: string;
  vertical?: Vertical;
  owner_client_id: string | null;
  created_by_consultant_id: string;
  created_at: string;
  engagements?: Engagement[];
}

export interface ClientOption {
  id: string;
  name: string;
  email: string;
}

export type QuestionType = "yes_no" | "text";

export interface ChecklistQuestion {
  id: string;
  label: string;
  type: QuestionType;
}

export interface ChecklistTemplate {
  id: string;
  vertical_id: string;
  vertical?: Vertical;
  title: string;
  description: string | null;
  questions: ChecklistQuestion[];
  created_by: string;
  created_at: string;
}

export interface ContentArticle {
  id: string;
  vertical_id: string | null;
  vertical?: Vertical;
  title: string;
  body: string;
  published_at: string | null;
  created_by: string;
  created_at: string;
}

export interface EngagementDocument {
  id: string;
  engagement_id: string;
  uploaded_by: string;
  uploader?: { id: string; name: string };
  file_name: string;
  storage_path: string;
  file_size: number;
  content_type: string;
  created_at: string;
  download_url: string | null;
}

export interface EngagementMessage {
  id: string;
  engagement_id: string;
  sender_id: string;
  sender?: { id: string; name: string };
  body: string;
  created_at: string;
}

export interface Assessment {
  id: string;
  engagement_id: string;
  template_id: string;
  template?: ChecklistTemplate;
  answers: Record<string, string | boolean>;
  score: number | null;
  completed_at: string | null;
  created_by: string;
  created_at: string;
}

export type TaskStatus = "open" | "in_progress" | "done";

export const TASK_STATUSES: TaskStatus[] = ["open", "in_progress", "done"];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  done: "Done",
};

export interface EngagementTask {
  id: string;
  engagement_id: string;
  title: string;
  status: TaskStatus;
  due_date: string | null;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  business_id: string;
  name: string;
  title: string | null;
  hourly_rate: number | null;
  status: "active" | "inactive";
  created_by: string;
  created_at: string;
}

export interface EmployeeShift {
  id: string;
  employee_id: string;
  employee?: { id: string; name: string };
  business_id: string;
  clock_in: string;
  clock_out: string | null;
  note: string | null;
  created_by: string;
  created_at: string;
}
