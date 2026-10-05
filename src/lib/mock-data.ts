export interface MockUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isPro: boolean;
}

export interface MockItemType {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  isSystem: boolean;
  count: number;
}

export interface MockCollection {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  itemCount: number;
  itemTypeIds: string[];
  updatedAt: string;
}

export interface MockItem {
  id: string;
  title: string;
  description: string;
  content: string | null;
  url: string | null;
  language: string | null;
  itemTypeId: string;
  collectionIds: string[];
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export const currentUser: MockUser = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  image: null,
  isPro: false,
};

export const itemTypes: MockItemType[] = [
  { id: "type_snippet", name: "Snippets", slug: "snippets", icon: "Code", color: "#3b82f6", isSystem: true, count: 4 },
  { id: "type_prompt", name: "Prompts", slug: "prompts", icon: "Sparkles", color: "#8b5cf6", isSystem: true, count: 2 },
  { id: "type_command", name: "Commands", slug: "commands", icon: "Terminal", color: "#f97316", isSystem: true, count: 2 },
  { id: "type_note", name: "Notes", slug: "notes", icon: "StickyNote", color: "#fde047", isSystem: true, count: 1 },
  { id: "type_file", name: "Files", slug: "files", icon: "File", color: "#6b7280", isSystem: true, count: 0 },
  { id: "type_image", name: "Images", slug: "images", icon: "Image", color: "#ec4899", isSystem: true, count: 0 },
  { id: "type_link", name: "Links", slug: "links", icon: "Link", color: "#10b981", isSystem: true, count: 2 },
];

export const collections: MockCollection[] = [
  {
    id: "col_react",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    isFavorite: true,
    itemCount: 4,
    itemTypeIds: ["type_snippet", "type_link"],
    updatedAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "col_python",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    isFavorite: false,
    itemCount: 1,
    itemTypeIds: ["type_snippet"],
    updatedAt: "2026-01-06T16:45:00Z",
  },
  {
    id: "col_context",
    name: "Context Files",
    description: "AI context files for projects",
    isFavorite: true,
    itemCount: 1,
    itemTypeIds: ["type_prompt"],
    updatedAt: "2026-01-03T09:00:00Z",
  },
  {
    id: "col_interview",
    name: "Interview Prep",
    description: "Technical interview preparation",
    isFavorite: false,
    itemCount: 4,
    itemTypeIds: ["type_snippet", "type_note", "type_link"],
    updatedAt: "2026-01-14T12:00:00Z",
  },
  {
    id: "col_git",
    name: "Git Commands",
    description: "Frequently used git commands",
    isFavorite: true,
    itemCount: 1,
    itemTypeIds: ["type_command"],
    updatedAt: "2026-01-10T14:20:00Z",
  },
  {
    id: "col_ai",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    isFavorite: false,
    itemCount: 2,
    itemTypeIds: ["type_prompt"],
    updatedAt: "2026-01-09T08:15:00Z",
  },
];

export const items: MockItem[] = [
  {
    id: "item_1",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    content: `export function useAuth() {
  const { data: session, status } = useSession();
  return { user: session?.user, isLoading: status === "loading" };
}`,
    url: null,
    language: "typescript",
    itemTypeId: "type_snippet",
    collectionIds: ["col_react", "col_interview"],
    tags: ["react", "auth", "hooks"],
    isFavorite: true,
    isPinned: true,
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "item_2",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    content: `export async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(url);
    if (res.ok) return res;
    await new Promise((r) => setTimeout(r, 2 ** attempt * 500));
  }
  throw new Error(\`Request failed: \${url}\`);
}`,
    url: null,
    language: "typescript",
    itemTypeId: "type_snippet",
    collectionIds: ["col_react"],
    tags: ["api", "error-handling", "fetch"],
    isFavorite: false,
    isPinned: true,
    createdAt: "2026-01-12T09:30:00Z",
    updatedAt: "2026-01-12T09:30:00Z",
  },
  {
    id: "item_3",
    title: "Git Undo Last Commit",
    description: "Undo the last commit but keep the changes staged",
    content: "git reset --soft HEAD~1",
    url: null,
    language: "bash",
    itemTypeId: "type_command",
    collectionIds: ["col_git"],
    tags: ["git", "reset"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-01-10T14:20:00Z",
    updatedAt: "2026-01-10T14:20:00Z",
  },
  {
    id: "item_4",
    title: "Code Review Prompt",
    description: "Prompt for a thorough code review focused on bugs and security",
    content:
      "Review the following code for correctness, security issues, and performance problems. List each issue with a short explanation and a suggested fix.",
    url: null,
    language: null,
    itemTypeId: "type_prompt",
    collectionIds: ["col_ai"],
    tags: ["ai", "code-review"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-08T11:00:00Z",
    updatedAt: "2026-01-09T08:15:00Z",
  },
  {
    id: "item_5",
    title: "Python List Comprehension",
    description: "Filter and transform a list in one expression",
    content: "squares = [x * x for x in numbers if x % 2 == 0]",
    url: null,
    language: "python",
    itemTypeId: "type_snippet",
    collectionIds: ["col_python"],
    tags: ["python", "lists"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-06T16:45:00Z",
    updatedAt: "2026-01-06T16:45:00Z",
  },
  {
    id: "item_6",
    title: "Big O Cheat Sheet",
    description: "Time complexity of common data structure operations",
    content: "- Array access: O(1)\n- Hash map lookup: O(1) average\n- Binary search: O(log n)\n- Sorting: O(n log n)",
    url: null,
    language: null,
    itemTypeId: "type_note",
    collectionIds: ["col_interview"],
    tags: ["algorithms", "interview"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-04T12:00:00Z",
    updatedAt: "2026-01-05T09:00:00Z",
  },
  {
    id: "item_7",
    title: "React Docs",
    description: "Official React documentation",
    content: null,
    url: "https://react.dev",
    language: null,
    itemTypeId: "type_link",
    collectionIds: ["col_react", "col_interview"],
    tags: ["react", "docs"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-02T08:00:00Z",
    updatedAt: "2026-01-02T08:00:00Z",
  },
  {
    id: "item_8",
    title: "Docker Cleanup",
    description: "Remove unused containers, images, networks and volumes",
    content: "docker system prune -a --volumes",
    url: null,
    language: "bash",
    itemTypeId: "type_command",
    collectionIds: [],
    tags: ["docker", "cleanup"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-13T15:00:00Z",
    updatedAt: "2026-01-13T15:00:00Z",
  },
  {
    id: "item_9",
    title: "Project Context File",
    description: "Base context file template for AI coding assistants",
    content: "# Project\n\n## Stack\n\n## Coding Standards\n\n## Current Feature",
    url: null,
    language: null,
    itemTypeId: "type_prompt",
    collectionIds: ["col_ai", "col_context"],
    tags: ["ai", "context"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-01-11T10:30:00Z",
    updatedAt: "2026-01-14T09:45:00Z",
  },
  {
    id: "item_10",
    title: "useDebounce Hook",
    description: "React hook for delaying a value update",
    content: `export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}`,
    url: null,
    language: "typescript",
    itemTypeId: "type_snippet",
    collectionIds: ["col_react", "col_interview"],
    tags: ["react", "hooks", "performance"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-07T13:00:00Z",
    updatedAt: "2026-01-07T13:00:00Z",
  },
  {
    id: "item_11",
    title: "Tailwind CSS Docs",
    description: "Official Tailwind CSS v4 documentation",
    content: null,
    url: "https://tailwindcss.com/docs",
    language: null,
    itemTypeId: "type_link",
    collectionIds: [],
    tags: ["css", "docs"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-01T09:00:00Z",
    updatedAt: "2026-01-01T09:00:00Z",
  },
];
