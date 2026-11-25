export type MetricUnit = "rub" | "pct" | "count";

export type DashboardGroup =
  | "new_clients"
  | "current_clients"
  | "finance"
  | "personal";

export type ConveyorBlock = "change" | "run" | "staff";

export type ActionStatus = "todo" | "in_progress" | "done";

export type MonthId = "jan" | "feb" | "mar";

export interface Period {
  id: MonthId;
  label: string;
  short: string;
  year: number;
  /** Доля месяца, уже прошедшая (1 = месяц закрыт). */
  elapsed: number;
}

export interface Company {
  name: string;
  revenueYear: number;
  periodLabel: string;
  monthLabel: string;
  ownerName: string;
}

export interface Role {
  id: string;
  title: string;
  person: string;
  block: ConveyorBlock;
  ckp: string;
  working: boolean;
  risk: string;
  metricIds: string[];
}

export interface MonthPoint {
  plan: number;
  fact: number;
}

export interface MetricHistoryPoint {
  week: string;
  plan: number;
  fact: number;
}

export interface Metric {
  id: string;
  name: string;
  unit: MetricUnit;
  group: DashboardGroup;
  ownerId: string;
  higherIsBetter: boolean;
  formula: string;
  yearPlan: number;
  yearFact: number;
  month: MonthPoint;
  /** План/факт по месяцам демо */
  months: Record<MonthId, MonthPoint>;
  history: MetricHistoryPoint[];
  /** Цель, которую хотим преодолеть (точка Б) */
  pointB: number;
  /** Красная линия: ниже (или выше) нельзя */
  threshold: number;
  /** aliases for older helpers */
  plan: number;
  fact: number;
  zoneId: DashboardGroup;
  parentId?: string;
}

export interface DihaItem {
  id: string;
  data: string;
  metricId: string;
  insight: string;
  hypothesis: string;
  action: string;
  expected: string;
  ownerId: string;
  due: string;
  hours: number;
  progress: number;
  status: ActionStatus;
}

export const periods: Period[] = [
  { id: "jan", label: "Январь", short: "Янв", year: 2026, elapsed: 1 },
  { id: "feb", label: "Февраль", short: "Фев", year: 2026, elapsed: 1 },
  { id: "mar", label: "Март", short: "Мар", year: 2026, elapsed: 0.55 },
];

export const defaultMonthId: MonthId = "mar";

export function getPeriod(id: MonthId): Period {
  return periods.find((p) => p.id === id) ?? periods[2];
}

export const company: Company = {
  name: "Альфа‑Сервис",
  revenueYear: 180_000_000,
  periodLabel: "2026 · план на год",
  monthLabel: "Март",
  ownerName: "Игорь С.",
};

export const groupLabels: Record<DashboardGroup, string> = {
  new_clients: "Новые клиенты",
  current_clients: "Текущие клиенты",
  finance: "Финансы",
  personal: "Личная цель",
};

export const blockLabels: Record<ConveyorBlock, string> = {
  change: "Изменения (продукты и технологии)",
  run: "Операции (маркетинг, продажи, delivery)",
  staff: "Штаб (управление и финансы)",
};

export const roles: Role[] = [
  {
    id: "product",
    title: "Создание и развитие продукта",
    person: "Елена Т.",
    block: "change",
    ckp: "Востребованные продукты для внешних и внутренних клиентов",
    working: true,
    risk: "Падает стабильность текущего функционала, обновления срываются",
    metricIds: ["avg_check", "margin"],
  },
  {
    id: "tech",
    title: "Технологическое развитие",
    person: "Павел Д.",
    block: "change",
    ckp: "Разработанные и протестированные технологии в срок",
    working: true,
    risk: "Операционные команды получают сырые решения, растёт техдолг",
    metricIds: [],
  },
  {
    id: "marketing",
    title: "Маркетинг",
    person: "Денис П.",
    block: "run",
    ckp: "Целевые лиды, готовые к покупке",
    working: true,
    risk: "Дорогие лиды, выгорание каналов, мало встреч с тёплыми лидами",
    metricIds: ["leads", "sql_leads", "sql_demo"],
  },
  {
    id: "sales",
    title: "Первичные продажи",
    person: "Марина К.",
    block: "run",
    ckp: "Новые клиенты, которые становятся повторными",
    working: true,
    risk: "Не закрываем сделки, падает выручка и cash flow",
    metricIds: ["cvr_client", "new_clients", "avg_check"],
  },
  {
    id: "account",
    title: "Повторные продажи и развитие клиента",
    person: "Кирилл Н.",
    block: "run",
    ckp: "Удержанная база и рост LTV",
    working: true,
    risk: "Деньги на привлечение сгорают: клиенты не остаются",
    metricIds: ["retention", "churn", "clients_end"],
  },
  {
    id: "delivery",
    title: "Производство / Delivery",
    person: "Анна В.",
    block: "run",
    ckp: "Сданный клиенту продукт в срок и в качестве",
    working: true,
    risk: "Нечего продавать / убытки по контрактам / негатив",
    metricIds: ["revenue", "margin"],
  },
  {
    id: "finance",
    title: "Финансы и учёт",
    person: "Олег Р.",
    block: "staff",
    ckp: "Прозрачный отчёт о прибылях и убытках и контроль расходов/доходов",
    working: true,
    risk: "Кассовые разрывы, убытки, нет оборотных",
    metricIds: ["revenue", "margin", "profit"],
  },
  {
    id: "ceo",
    title: "Генеральный директор",
    person: "Алексей М.",
    block: "staff",
    ckp: "База лояльных целевых клиентов и управляемый рост",
    working: true,
    risk: "Компания живёт в ручном режиме собственника",
    metricIds: ["profit", "share"],
  },
  {
    id: "owner",
    title: "Собственник",
    person: "Игорь С.",
    block: "staff",
    ckp: "Растущий управляемый прибыльный бизнес и личная прибыль",
    working: true,
    risk: "Нет дивидендов при формально «живой» компании",
    metricIds: ["personal_profit", "share", "profit"],
  },
];

const history = (
  plan: number,
  facts: number[],
  startWeek = 41,
): MetricHistoryPoint[] =>
  facts.map((fact, i) => ({
    week: `W${startWeek + i}`,
    plan,
    fact,
  }));

function roundMetric(value: number, unit: MetricUnit): number {
  if (unit === "pct") return Math.round(value * 10) / 10;
  if (unit === "rub") return Math.round(value / 1000) * 1000;
  return Math.round(value);
}

function m(input: {
  id: string;
  name: string;
  unit: MetricUnit;
  group: DashboardGroup;
  ownerId: string;
  higherIsBetter: boolean;
  formula: string;
  yearPlan: number;
  yearFact: number;
  monthPlan: number;
  monthFact: number;
  historyFacts: number[];
  parentId?: string;
  pointB?: number;
  threshold?: number;
  /** Январь = monthPlan/Fact; февраль/март можно переопределить */
  febFact?: number;
  marFact?: number;
}): Metric {
  const pointB = input.pointB ?? Math.round(input.yearPlan * 1.1);
  const threshold =
    input.threshold ??
    (input.higherIsBetter
      ? Math.round(input.monthPlan * 0.75)
      : Math.round(input.monthPlan * 1.3));

  const jan: MonthPoint = { plan: input.monthPlan, fact: input.monthFact };
  const febFact =
    input.febFact ??
    roundMetric(
      input.higherIsBetter ? input.monthFact * 1.08 : input.monthFact * 0.95,
      input.unit,
    );
  const marFact =
    input.marFact ??
    roundMetric(
      input.higherIsBetter ? input.monthFact * 0.97 : input.monthFact * 1.05,
      input.unit,
    );
  const months: Record<MonthId, MonthPoint> = {
    jan,
    feb: { plan: input.monthPlan, fact: febFact },
    mar: { plan: input.monthPlan, fact: marFact },
  };

  return {
    id: input.id,
    name: input.name,
    unit: input.unit,
    group: input.group,
    ownerId: input.ownerId,
    higherIsBetter: input.higherIsBetter,
    formula: input.formula,
    yearPlan: input.yearPlan,
    yearFact: input.yearFact,
    month: months.mar,
    months,
    history: history(input.monthPlan, input.historyFacts),
    pointB,
    threshold,
    plan: input.yearPlan,
    fact: input.yearFact,
    zoneId: input.group,
    parentId: input.parentId,
  };
}

export const metrics: Metric[] = [
  m({
    id: "leads",
    name: "Лиды",
    unit: "count",
    group: "new_clients",
    ownerId: "marketing",
    higherIsBetter: true,
    formula: "Входящие квалифицируемые заявки",
    yearPlan: 1440,
    yearFact: 118,
    monthPlan: 120,
    monthFact: 94,
    historyFacts: [118, 110, 102, 98, 94],
  }),
  m({
    id: "sql_leads",
    name: "Квалифицированные лиды (принятые продажами)",
    unit: "count",
    group: "new_clients",
    ownerId: "marketing",
    higherIsBetter: true,
    formula: "Заявки, которые отдел продаж подтвердил как целевые и готовые к работе",
    yearPlan: 720,
    yearFact: 62,
    monthPlan: 60,
    monthFact: 48,
    historyFacts: [58, 55, 52, 50, 48],
    parentId: "leads",
  }),
  m({
    id: "sql_demo",
    name: "Демо‑встречи с квалифицированными лидами",
    unit: "count",
    group: "new_clients",
    ownerId: "sales",
    higherIsBetter: true,
    formula: "Сколько тёплых лидов дошли до демо или коммерческой встречи",
    yearPlan: 360,
    yearFact: 28,
    monthPlan: 30,
    monthFact: 22,
    historyFacts: [29, 27, 25, 24, 22],
    parentId: "sql_leads",
  }),
  m({
    id: "cvr_client",
    name: "Конверсия в клиента (доля закрытых сделок)",
    unit: "pct",
    group: "new_clients",
    ownerId: "sales",
    higherIsBetter: true,
    formula: "Новые клиенты / квалифицированные лиды × 100%",
    yearPlan: 28,
    yearFact: 24,
    monthPlan: 28,
    monthFact: 24,
    historyFacts: [27, 26, 25.5, 24.5, 24],
    parentId: "sql_demo",
  }),
  m({
    id: "new_clients",
    name: "Кол‑во новых клиентов",
    unit: "count",
    group: "new_clients",
    ownerId: "sales",
    higherIsBetter: true,
    formula: "Закрытые первые сделки за период",
    yearPlan: 96,
    yearFact: 7,
    monthPlan: 8,
    monthFact: 5,
    historyFacts: [8, 7, 6, 6, 5],
    parentId: "cvr_client",
  }),
  m({
    id: "clients_start",
    name: "Клиентов на начало периода",
    unit: "count",
    group: "current_clients",
    ownerId: "account",
    higherIsBetter: true,
    formula: "Активная база на старт месяца",
    yearPlan: 140,
    yearFact: 128,
    monthPlan: 128,
    monthFact: 128,
    historyFacts: [132, 130, 129, 128, 128],
  }),
  m({
    id: "retention",
    name: "% удержания",
    unit: "pct",
    group: "current_clients",
    ownerId: "account",
    higherIsBetter: true,
    formula: "Удержанные / база на начало",
    yearPlan: 92,
    yearFact: 88,
    monthPlan: 92,
    monthFact: 88,
    historyFacts: [91, 90, 89, 88.5, 88],
  }),
  m({
    id: "churn",
    name: "Отток",
    unit: "count",
    group: "current_clients",
    ownerId: "account",
    higherIsBetter: false,
    formula: "Ушедшие клиенты за период",
    yearPlan: 12,
    yearFact: 3,
    monthPlan: 1,
    monthFact: 2,
    historyFacts: [1, 1, 2, 2, 2],
  }),
  m({
    id: "clients_end",
    name: "Постоянных клиентов на конец",
    unit: "count",
    group: "current_clients",
    ownerId: "account",
    higherIsBetter: true,
    formula: "База на начало − отток + реактивации",
    yearPlan: 160,
    yearFact: 126,
    monthPlan: 132,
    monthFact: 126,
    historyFacts: [131, 130, 128, 127, 126],
  }),
  m({
    id: "avg_check",
    name: "Средний чек",
    unit: "rub",
    group: "current_clients",
    ownerId: "sales",
    higherIsBetter: true,
    formula: "Выручка / число сделок периода",
    yearPlan: 480_000,
    yearFact: 455_000,
    monthPlan: 480_000,
    monthFact: 455_000,
    historyFacts: [475_000, 470_000, 462_000, 458_000, 455_000],
  }),
  m({
    id: "revenue",
    name: "Выручка активированная",
    unit: "rub",
    group: "finance",
    ownerId: "finance",
    higherIsBetter: true,
    formula: "Новые + постоянные × средний чек",
    yearPlan: 180_000_000,
    yearFact: 13_800_000,
    monthPlan: 15_000_000,
    monthFact: 13_800_000,
    historyFacts: [14_600_000, 14_200_000, 14_000_000, 13_900_000, 13_800_000],
  }),
  m({
    id: "margin",
    name: "Маржинальность",
    unit: "pct",
    group: "finance",
    ownerId: "finance",
    higherIsBetter: true,
    formula: "(Выручка − прямые косты) / Выручка",
    yearPlan: 38,
    yearFact: 34.5,
    monthPlan: 38,
    monthFact: 34.5,
    historyFacts: [37.2, 36.5, 35.8, 35.0, 34.5],
    parentId: "revenue",
  }),
  m({
    id: "profit",
    name: "Прибыль компании",
    unit: "rub",
    group: "finance",
    ownerId: "ceo",
    higherIsBetter: true,
    formula: "Выручка − прямые затраты − операционные расходы",
    yearPlan: 50_400_000,
    yearFact: 3_700_000,
    monthPlan: 4_200_000,
    monthFact: 3_700_000,
    historyFacts: [4_050_000, 3_980_000, 3_850_000, 3_720_000, 3_700_000],
    parentId: "margin",
  }),
  m({
    id: "share",
    name: "Доля собственника",
    unit: "pct",
    group: "personal",
    ownerId: "owner",
    higherIsBetter: true,
    formula: "Доля в распределяемой прибыли",
    yearPlan: 60,
    yearFact: 60,
    monthPlan: 60,
    monthFact: 60,
    historyFacts: [60, 60, 60, 60, 60],
  }),
  m({
    id: "personal_profit",
    name: "Личная прибыль",
    unit: "rub",
    group: "personal",
    ownerId: "owner",
    higherIsBetter: true,
    formula: "Прибыль компании × доля собственника",
    yearPlan: 30_240_000,
    yearFact: 2_220_000,
    monthPlan: 2_520_000,
    monthFact: 2_220_000,
    historyFacts: [2_430_000, 2_388_000, 2_310_000, 2_232_000, 2_220_000],
    parentId: "profit",
  }),
];

export const dihaItems: DihaItem[] = [
  {
    id: "d1",
    data: "Лиды 94 при плане 120 (−21,7%)",
    metricId: "leads",
    insight: "Два канала тянут стоимость лида вверх и дают мало тёплых заявок для продаж",
    hypothesis: "Отключение дорогих каналов вернёт качество лидов без роста бюджета",
    action: "Отключить 2 канала, где стоимость лида > 60 тыс, переложить бюджет в лучший + исходящие",
    expected: "Лиды ≥ 110, квалифицированных ≥ 55 до конца месяца",
    ownerId: "marketing",
    due: "20.01",
    hours: 6,
    progress: 40,
    status: "in_progress",
  },
  {
    id: "d2",
    data: "Конверсия в клиента 24% при плане 28%",
    metricId: "cvr_client",
    insight: "Просадка на этапе коммерческого предложения: долгий ответ и размытый оффер",
    hypothesis: "Норматив ответа ≤48ч и пакет без скидки поднимут конверсию",
    action: "Разбор 15 проигранных сделок + запрет скидки >7% без согласования",
    expected: "Конверсия → 26%+ за 2 недели",
    ownerId: "sales",
    due: "22.01",
    hours: 8,
    progress: 20,
    status: "todo",
  },
  {
    id: "d3",
    data: "Маржа 34,5% при плане 38%",
    metricId: "margin",
    insight: "2–3 проекта с перерасходом без раннего сигнала",
    hypothesis: "Weekly‑ревью маржи по проектам поймает утечку до закрытия месяца",
    action: "Внедрить пятничный разбор маржи по активным контрактам",
    expected: "Маржа месяца ≥ 36%",
    ownerId: "finance",
    due: "22.01",
    hours: 4,
    progress: 100,
    status: "done",
  },
  {
    id: "d4",
    data: "Отток 2 при плане 1",
    metricId: "churn",
    insight: "Уходят клиенты среднего сегмента без регулярных разборов успеха",
    hypothesis: "Ежемесячный разбор с топ‑20 клиентами снизит отток",
    action: "Запустить календарь встреч с ключевыми клиентами и закрепить менеджера за каждым",
    expected: "Отток ≤ 1 в феврале",
    ownerId: "account",
    due: "25.01",
    hours: 10,
    progress: 55,
    status: "in_progress",
  },
  {
    id: "d5",
    data: "Личная прибыль −11,9% к плану месяца",
    metricId: "personal_profit",
    insight: "Следствие связки лиды → конверсия → маржа, не отдельная проблема",
    hypothesis: "Фокус на 3 рычагах даст эффект быстрее, чем «чинить всё»",
    action: "Собственник: еженедельный разбор только по 3 красным метрикам + статусы трекинга",
    expected: "Личная прибыль ближе к 2,4 млн к концу февраля",
    ownerId: "owner",
    due: "31.01",
    hours: 2,
    progress: 30,
    status: "in_progress",
  },
];

/** @deprecated use dihaItems — kept for any leftover imports */
export const weeklyActions = dihaItems.map((d) => ({
  id: d.id,
  title: d.action,
  metricId: d.metricId,
  ownerId: d.ownerId,
  due: d.due,
  status: d.status,
  hypothesis: d.hypothesis,
}));

export const aiDraft = `Черновик трекинга по красным разрывам (январь)

D — Данные (что упало)
Лиды −21,7%, конверсия в клиента 24% vs 28%, маржа 34,5% vs 38%, личная прибыль ниже плана.

I — Инсайты (почему так думаем)
Воронка сверху узкая и дорогая; конверсия проседает на коммерческом предложении; маржа утекает в проектах.

H — Гипотезы (что пробуем)
1) Резать дорогие каналы важнее, чем лить бюджет.
2) Норматив ответа на КП и оффер без скидки вернут конверсию.
3) Еженедельный разбор маржи по проектам закроет дыру быстрее найма.

A — Действия на неделю
Маркетинг: отключить 2 канала. Продажи: разбор 15 проигрышей. Финансы: пятничный разбор маржи. Клиентский отдел: встречи с топ‑20.

Ожидаемый эффект: лиды ≥110, конверсия →26%+, маржа →36%, личная прибыль ближе к плану.`;

export function getRole(id: string): Role | undefined {
  return roles.find((r) => r.id === id);
}

export function getMetric(id: string): Metric | undefined {
  return metrics.find((m) => m.id === id);
}

export function childMetrics(parentId: string): Metric[] {
  return metrics.filter((m) => m.parentId === parentId);
}

export function metricsByGroup(group: DashboardGroup): Metric[] {
  return metrics.filter((m) => m.group === group);
}

export function completionPercent(
  plan: number,
  fact: number,
  higherIsBetter: boolean,
): number {
  if (plan === 0) {
    if (fact === 0) return 100;
    return higherIsBetter ? 100 : 0;
  }
  if (higherIsBetter) return (fact / plan) * 100;
  // for "lower is better": plan/fact style — if fact <= plan, >=100%
  return (plan / Math.max(fact, 0.0001)) * 100;
}

export function gapPercent(plan: number, fact: number): number {
  if (plan === 0) return fact === 0 ? 0 : 100;
  return ((fact - plan) / Math.abs(plan)) * 100;
}

export function sortedGaps(
  list: Metric[] = metrics,
): Array<Metric & { gap: number; negative: boolean }> {
  return list
    .map((metric) => {
      const gap = gapPercent(metric.month.plan, metric.month.fact);
      const negative = metric.higherIsBetter ? gap < 0 : gap > 0;
      return { ...metric, gap, negative };
    })
    .sort((a, b) => {
      const aScore = a.negative ? -Math.abs(a.gap) : Math.abs(a.gap);
      const bScore = b.negative ? -Math.abs(b.gap) : Math.abs(b.gap);
      return aScore - bScore;
    });
}

export const dashboardGroups: DashboardGroup[] = [
  "new_clients",
  "current_clients",
  "finance",
  "personal",
];

export const conveyorBlocks: ConveyorBlock[] = ["change", "run", "staff"];
