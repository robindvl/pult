export type BlockId =
  | "strategy"
  | "management"
  | "team"
  | "client"
  | "product"
  | "finance";

export type ToolSection = "system" | "scale";

export type PointAStatus = "missing" | "needs_work" | "exists";

export type ToolCurrentStatus =
  | "none"
  | "studied"
  | "in_progress"
  | "result";

export interface GrowthStage {
  id: number;
  title: string;
  items: Array<{ label: string; done: boolean }>;
}

export interface DiagnosticBlock {
  id: BlockId;
  name: string;
  score: 1 | 2 | 3;
  note: string;
}

export interface StrategyTool {
  id: number;
  section: ToolSection;
  name: string;
  plannedDate: string | null;
  pointA: PointAStatus;
  implement: boolean;
  current: ToolCurrentStatus;
  href?: string;
}

export const growthStages: GrowthStage[] = [
  {
    id: 1,
    title: "От идеи к MVP",
    items: [
      { label: "Есть идея", done: true },
      { label: "Сделаны интервью с клиентами", done: true },
      { label: "Собран MVP", done: true },
      { label: "Есть первый успешный кейс", done: true },
    ],
  },
  {
    id: 2,
    title: "От MVP к повторным прибыльным кейсам",
    items: [
      { label: "Кейс повторён несколько раз", done: true },
      { label: "Положительная юнит‑экономика", done: true },
      { label: "Найден стабильный канал", done: false },
    ],
  },
  {
    id: 3,
    title: "Систематизация",
    items: [
      { label: "Цель зафиксирована и декомпозирована", done: false },
      { label: "Внедрена система ключевых показателей", done: false },
      { label: "Собрана команда под функции", done: false },
      { label: "Описаны ключевые процессы", done: false },
      { label: "≥80% операционки делегировано", done: false },
    ],
  },
  {
    id: 4,
    title: "Масштабирование",
    items: [
      { label: "Подключены цифровые инструменты", done: false },
      { label: "Планы прибыли выполняются регулярно", done: false },
      { label: "Назначен гендиректор", done: false },
    ],
  },
  {
    id: 5,
    title: "Выход на новые рынки",
    items: [
      { label: "Идея нового рынка", done: false },
      { label: "MVP для нового рынка", done: false },
      { label: "Продажи на новом рынке", done: false },
    ],
  },
];

export const currentStageId = 2;

export const diagnosticBlocks: DiagnosticBlock[] = [
  {
    id: "strategy",
    name: "Стратегия",
    score: 2,
    note: "Цель есть, но слабо связана с еженедельным ритмом",
  },
  {
    id: "management",
    name: "Управление",
    score: 1,
    note: "Собственник в операционке, мало делегирования",
  },
  {
    id: "team",
    name: "Команда",
    score: 1,
    note: "У функций не везде описан ценный конечный продукт",
  },
  {
    id: "client",
    name: "Клиент",
    score: 2,
    note: "Воронка живая, но лиды и конверсия ниже плана",
  },
  {
    id: "product",
    name: "Продукт",
    score: 1,
    note: "Средний чек и маржа проседают на скидках",
  },
  {
    id: "finance",
    name: "Финансы",
    score: 2,
    note: "Отчётность понятна, но план‑факт заполняется неритмично",
  },
];

export const pointALabels: Record<PointAStatus, string> = {
  missing: "Инструмента нет",
  needs_work: "Требует доработки",
  exists: "Есть в работе",
};

export const currentStatusLabels: Record<ToolCurrentStatus, string> = {
  none: "Выберите вариант",
  studied: "Инструмент изучен",
  in_progress: "Внедряется",
  result: "Получен результат",
};

export const sectionLabels: Record<ToolSection, string> = {
  system: "Система",
  scale: "Масштаб",
};

export const strategyTools: StrategyTool[] = [
  {
    id: 0,
    section: "system",
    name: "Диагностика (личная / бизнес‑цель / план)",
    plannedDate: "03.04.2025",
    pointA: "needs_work",
    implement: true,
    current: "in_progress",
    href: "/diagnostics",
  },
  {
    id: 1,
    section: "system",
    name: "Декомпозиция пути развития клиента",
    plannedDate: "10.04.2025",
    pointA: "missing",
    implement: true,
    current: "result",
    href: "/",
  },
  {
    id: 2,
    section: "system",
    name: "Развитие клиента в CRM",
    plannedDate: "28.04.2025",
    pointA: "missing",
    implement: true,
    current: "studied",
  },
  {
    id: 3,
    section: "system",
    name: "Дашборд",
    plannedDate: "16.05.2025",
    pointA: "needs_work",
    implement: true,
    current: "in_progress",
    href: "/",
  },
  {
    id: 4,
    section: "system",
    name: "Оргструктура",
    plannedDate: "03.06.2025",
    pointA: "needs_work",
    implement: true,
    current: "in_progress",
    href: "/org",
  },
  {
    id: 5,
    section: "system",
    name: "KPI (ключевые показатели по функциям)",
    plannedDate: "21.06.2025",
    pointA: "missing",
    implement: true,
    current: "none",
    href: "/org",
  },
  {
    id: 6,
    section: "system",
    name: "Мотивация от KPI (зарплата и бонусы от показателей)",
    plannedDate: "09.07.2025",
    pointA: "needs_work",
    implement: true,
    current: "none",
  },
  {
    id: 7,
    section: "system",
    name: "Трекинг разрывов (журнал действий по метрикам)",
    plannedDate: "27.07.2025",
    pointA: "missing",
    implement: true,
    current: "in_progress",
    href: "/weekly",
  },
  {
    id: 8,
    section: "system",
    name: "Подбор руководителей (топ‑менеджеров)",
    plannedDate: null,
    pointA: "missing",
    implement: false,
    current: "none",
  },
  {
    id: 9,
    section: "system",
    name: "Оптимизатор прибыли",
    plannedDate: "14.08.2025",
    pointA: "missing",
    implement: true,
    current: "none",
  },
  {
    id: 10,
    section: "system",
    name: "P&L (прибыли и убытки по месяцам)",
    plannedDate: null,
    pointA: "missing",
    implement: false,
    current: "none",
  },
  {
    id: 11,
    section: "system",
    name: "Финмодель (сценарии доходов и расходов)",
    plannedDate: null,
    pointA: "missing",
    implement: false,
    current: "none",
  },
  {
    id: 12,
    section: "scale",
    name: "Сегментация",
    plannedDate: null,
    pointA: "missing",
    implement: false,
    current: "none",
  },
  {
    id: 13,
    section: "scale",
    name: "Исследование успеха ключевых клиентов",
    plannedDate: null,
    pointA: "missing",
    implement: false,
    current: "none",
  },
  {
    id: 14,
    section: "scale",
    name: "Экосистема продуктов",
    plannedDate: null,
    pointA: "missing",
    implement: false,
    current: "none",
  },
  {
    id: 15,
    section: "scale",
    name: "Калькулятор ценности",
    plannedDate: null,
    pointA: "missing",
    implement: false,
    current: "none",
  },
  {
    id: 16,
    section: "scale",
    name: "Customer Success Management",
    plannedDate: null,
    pointA: "missing",
    implement: false,
    current: "none",
  },
  {
    id: 17,
    section: "scale",
    name: "Фреймворк «7D»",
    plannedDate: null,
    pointA: "missing",
    implement: false,
    current: "none",
  },
];

export const trainingStartDate = "03.04.2025";

export const priorityBlockIds: BlockId[] = [
  "management",
  "team",
  "product",
];

export function scoreColor(score: 1 | 2 | 3): string {
  if (score === 3) return "bg-emerald-500";
  if (score === 2) return "bg-amber-400";
  return "bg-red-500";
}

export function scoreText(score: 1 | 2 | 3): string {
  if (score === 3) return "text-emerald-700";
  if (score === 2) return "text-amber-700";
  return "text-red-700";
}
