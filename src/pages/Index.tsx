import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "dashboard" | "clients" | "visits" | "services" | "schedule" | "stats";

interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  notes: string;
  visits: number;
  lastVisit: string;
}

interface Visit {
  id: number;
  clientId: number;
  clientName: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  notes: string;
  status: "Завершён" | "Предстоящий" | "Отменён";
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

const INITIAL_CLIENTS: Client[] = [
  { id: 1, name: "Анна Петрова", phone: "+7 (985) 123-45-67", email: "anna@mail.ru", birthday: "1990-03-15", notes: "Предпочитает лёгкое давление, аллергия на лаванду", visits: 12, lastVisit: "2026-03-20" },
  { id: 2, name: "Мария Иванова", phone: "+7 (916) 234-56-78", email: "maria@mail.ru", birthday: "1985-07-22", notes: "Проблемы с поясницей", visits: 5, lastVisit: "2026-03-18" },
  { id: 3, name: "Елена Соколова", phone: "+7 (977) 345-67-89", email: "elena@gmail.com", birthday: "1995-11-08", notes: "Любит ароматерапию с эвкалиптом", visits: 3, lastVisit: "2026-03-10" },
  { id: 4, name: "Ольга Новикова", phone: "+7 (903) 456-78-90", email: "", birthday: "1988-02-14", notes: "", visits: 8, lastVisit: "2026-03-22" },
];

const INITIAL_VISITS: Visit[] = [
  { id: 1, clientId: 1, clientName: "Анна Петрова", service: "Классический массаж", date: "2026-03-27", time: "10:00", duration: 60, price: 2500, notes: "Акцент на шею и плечи", status: "Предстоящий" },
  { id: 2, clientId: 4, clientName: "Ольга Новикова", service: "Антицеллюлитный массаж", date: "2026-03-27", time: "12:00", duration: 90, price: 3500, notes: "", status: "Предстоящий" },
  { id: 3, clientId: 2, clientName: "Мария Иванова", service: "Лечебный массаж спины", date: "2026-03-26", time: "14:00", duration: 60, price: 3000, notes: "Работа с поясничным отделом", status: "Завершён" },
  { id: 4, clientId: 3, clientName: "Елена Соколова", service: "Ароматерапевтический массаж", date: "2026-03-25", time: "11:00", duration: 75, price: 4000, notes: "", status: "Завершён" },
  { id: 5, clientId: 1, clientName: "Анна Петрова", service: "Классический массаж", date: "2026-03-20", time: "15:00", duration: 60, price: 2500, notes: "", status: "Завершён" },
];

const INITIAL_SERVICES: Service[] = [
  { id: 1, name: "Классический массаж", description: "Расслабляющий массаж всего тела, улучшает кровообращение и снимает мышечное напряжение", price: 2500, duration: 60, category: "Классика" },
  { id: 2, name: "Лечебный массаж спины", description: "Терапевтический массаж для проработки глубоких мышц спины, устранение болевых синдромов", price: 3000, duration: 60, category: "Лечебный" },
  { id: 3, name: "Антицеллюлитный массаж", description: "Интенсивный массаж для коррекции фигуры, улучшения лимфодренажа и упругости кожи", price: 3500, duration: 90, category: "Коррекция" },
  { id: 4, name: "Ароматерапевтический массаж", description: "Нежный расслабляющий массаж с натуральными эфирными маслами на выбор клиента", price: 4000, duration: 75, category: "Spa" },
  { id: 5, name: "Массаж головы и шеи", description: "Снятие напряжения, улучшение кровоснабжения головного мозга, помощь при мигренях", price: 1500, duration: 30, category: "Классика" },
  { id: 6, name: "Горячие камни", description: "Глубокое прогревание мышц вулканическими камнями, полное расслабление и восстановление", price: 5500, duration: 90, category: "Spa" },
];

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: "dashboard", label: "Главная", icon: "LayoutDashboard" },
  { id: "clients", label: "Клиенты", icon: "Users" },
  { id: "visits", label: "Визиты", icon: "ClipboardList" },
  { id: "services", label: "Услуги", icon: "Sparkles" },
  { id: "schedule", label: "Расписание", icon: "Calendar" },
  { id: "stats", label: "Статистика", icon: "BarChart3" },
];

function formatDate(d: string) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

function StatusBadge({ status }: { status: Visit["status"] }) {
  const colors: Record<Visit["status"], string> = {
    "Завершён": "bg-emerald-50 text-emerald-700",
    "Предстоящий": "bg-blue-50 text-blue-600",
    "Отменён": "bg-red-50 text-red-500",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium font-body ${colors[status]}`}>
      {status}
    </span>
  );
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-display font-semibold flex-shrink-0`}
      style={{ background: "linear-gradient(135deg, #3d6b4f, #8b6347)" }}>
      {name[0]}
    </div>
  );
}

// ---- DASHBOARD ----
function Dashboard({ clients, visits }: { clients: Client[]; visits: Visit[] }) {
  const today = "2026-03-27";
  const todayVisits = visits.filter(v => v.date === today);
  const monthRevenue = visits
    .filter(v => v.status === "Завершён" && v.date.startsWith("2026-03"))
    .reduce((s, v) => s + v.price, 0);

  return (
    <div className="animate-fade-in space-y-7">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-5xl font-light" style={{ color: "var(--spa-green)" }}>Добро пожаловать</h1>
          <p className="text-muted-foreground font-body mt-1.5">Пятница, 27 марта 2026</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-white/80">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-body text-muted-foreground">Онлайн</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Всего клиентов", value: clients.length, icon: "Users", bg: "bg-emerald-50", fg: "text-emerald-700" },
          { label: "Записей сегодня", value: todayVisits.length, icon: "Calendar", bg: "bg-blue-50", fg: "text-blue-600" },
          { label: "Визитов за март", value: visits.filter(v => v.date.startsWith("2026-03")).length, icon: "ClipboardList", bg: "bg-amber-50", fg: "text-amber-600" },
          { label: "Выручка (март)", value: `${monthRevenue.toLocaleString()} ₽`, icon: "TrendingUp", bg: "bg-purple-50", fg: "text-purple-600" },
        ].map((stat, i) => (
          <div key={i} className="card-spa p-5 animate-slide-up" style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "both" }}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${stat.bg}`}>
              <Icon name={stat.icon} size={17} className={stat.fg} />
            </div>
            <p className="text-2xl font-display font-semibold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground font-body mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card-spa p-6">
          <h2 className="font-display text-xl mb-4">Сегодняшние записи</h2>
          {todayVisits.length === 0 ? (
            <p className="text-muted-foreground font-body text-sm py-4 text-center">На сегодня записей нет</p>
          ) : (
            <div className="space-y-3">
              {todayVisits.map(v => (
                <div key={v.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Avatar name={v.clientName} size="sm" />
                    <div>
                      <p className="font-body font-medium text-sm text-foreground">{v.clientName}</p>
                      <p className="text-xs text-muted-foreground">{v.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-body font-bold text-spa-green text-sm">{v.time}</p>
                    <p className="text-xs text-muted-foreground">{v.duration} мин</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-spa p-6">
          <h2 className="font-display text-xl mb-4">Уведомления</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Icon name="MessageSquare" size={14} className="text-emerald-700" />
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-foreground">SMS отправлен</p>
                <p className="text-xs text-muted-foreground mt-0.5">Анна Петрова — напоминание о визите сегодня в 10:00</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Icon name="Gift" size={14} className="text-amber-600" />
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-foreground">День рождения</p>
                <p className="text-xs text-muted-foreground mt-0.5">У Марии Ивановой ДР через 5 дней — поздравить?</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Icon name="Bell" size={14} className="text-blue-600" />
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-foreground">Напоминание</p>
                <p className="text-xs text-muted-foreground mt-0.5">Ольга Новикова — визит в 12:00. SMS отправлен ✓</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-spa p-6">
        <h2 className="font-display text-xl mb-4">Последние визиты</h2>
        <div className="space-y-1">
          {visits.filter(v => v.status === "Завершён").map(v => (
            <div key={v.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar name={v.clientName} size="sm" />
                <div>
                  <p className="font-body font-medium text-sm text-foreground">{v.clientName}</p>
                  <p className="text-xs text-muted-foreground">{v.service}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground hidden sm:block">{formatDate(v.date)}</p>
                <p className="font-body font-semibold text-sm" style={{ color: "var(--spa-green)" }}>{v.price.toLocaleString()} ₽</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- CLIENTS ----
function Clients({ clients, setClients }: { clients: Client[]; setClients: (c: Client[]) => void }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", birthday: "", notes: "" });

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const openAdd = () => { setForm({ name: "", phone: "", email: "", birthday: "", notes: "" }); setEditClient(null); setShowForm(true); };
  const openEdit = (c: Client) => { setForm({ name: c.name, phone: c.phone, email: c.email, birthday: c.birthday, notes: c.notes }); setEditClient(c); setShowForm(true); };

  const save = () => {
    if (!form.name || !form.phone) return;
    if (editClient) {
      setClients(clients.map(c => c.id === editClient.id ? { ...c, ...form } : c));
    } else {
      setClients([...clients, { id: Date.now(), ...form, visits: 0, lastVisit: "" }]);
    }
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-5xl font-light" style={{ color: "var(--spa-green)" }}>Клиенты</h1>
          <p className="text-muted-foreground text-sm font-body mt-1">{clients.length} клиентов в базе</p>
        </div>
        <button onClick={openAdd} className="btn-spa flex items-center gap-2">
          <Icon name="UserPlus" size={15} />
          Добавить
        </button>
      </div>

      <div className="relative">
        <Icon name="Search" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по имени или телефону..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all" />
      </div>

      <div className="space-y-3">
        {filtered.map((c, i) => (
          <div key={c.id} className="card-spa p-4 flex items-center justify-between group hover:shadow-md transition-all animate-slide-up"
            style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "both" }}>
            <div className="flex items-center gap-4">
              <Avatar name={c.name} size="md" />
              <div>
                <p className="font-body font-semibold text-foreground">{c.name}</p>
                <p className="text-sm text-muted-foreground font-body">{c.phone}</p>
                {c.notes && <p className="text-xs text-muted-foreground mt-0.5 max-w-xs truncate italic">{c.notes}</p>}
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold font-body text-foreground">{c.visits} визитов</p>
                <p className="text-xs text-muted-foreground">{c.lastVisit ? formatDate(c.lastVisit) : "—"}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(c)} className="w-8 h-8 rounded-lg bg-muted hover:bg-emerald-50 flex items-center justify-center transition-colors">
                  <Icon name="Pencil" size={13} className="text-muted-foreground" />
                </button>
                <button onClick={() => setDeleteId(c.id)} className="w-8 h-8 rounded-lg bg-muted hover:bg-red-50 flex items-center justify-center transition-colors">
                  <Icon name="Trash2" size={13} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground font-body">Клиенты не найдены</div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slide-up">
            <h2 className="font-display text-2xl mb-5 text-foreground">{editClient ? "Редактировать клиента" : "Новый клиент"}</h2>
            <div className="space-y-3">
              {[
                { label: "Имя и фамилия *", key: "name", type: "text", placeholder: "Анна Петрова" },
                { label: "Телефон *", key: "phone", type: "tel", placeholder: "+7 (900) 000-00-00" },
                { label: "Email", key: "email", type: "email", placeholder: "anna@mail.ru" },
                { label: "Дата рождения", key: "birthday", type: "date", placeholder: "" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-muted-foreground font-body mb-1 block">{f.label}</label>
                  <input type={f.type} value={form[f.key as keyof typeof form]} placeholder={f.placeholder}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all" />
                </div>
              ))}
              <div>
                <label className="text-xs text-muted-foreground font-body mb-1 block">Заметки мастера</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Предпочтения, противопоказания..." rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 resize-none transition-all" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-border font-body text-sm hover:bg-muted transition-colors">Отмена</button>
              <button onClick={save} className="flex-1 py-2.5 rounded-xl text-white font-body text-sm font-medium transition-colors" style={{ backgroundColor: "var(--spa-green)" }}>Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-slide-up text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Icon name="Trash2" size={20} className="text-red-500" />
            </div>
            <h2 className="font-display text-xl mb-2">Удалить клиента?</h2>
            <p className="text-sm text-muted-foreground font-body mb-5">Это действие нельзя отменить</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-border font-body text-sm hover:bg-muted">Отмена</button>
              <button onClick={() => { setClients(clients.filter(c => c.id !== deleteId)); setDeleteId(null); }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-body text-sm font-medium hover:bg-red-600">Удалить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- VISITS ----
function Visits({ visits }: { visits: Visit[] }) {
  const [filter, setFilter] = useState<"all" | Visit["status"]>("all");
  const filtered = filter === "all" ? visits : visits.filter(v => v.status === filter);

  const MONTHS = ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-5xl font-light" style={{ color: "var(--spa-green)" }}>Визиты</h1>
          <p className="text-muted-foreground text-sm font-body mt-1">История посещений</p>
        </div>
        <button className="btn-spa flex items-center gap-2">
          <Icon name="Plus" size={15} />
          Записать
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: "Все" },
          { key: "Предстоящий", label: "Предстоящие" },
          { key: "Завершён", label: "Завершённые" },
          { key: "Отменён", label: "Отменённые" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key as "all" | Visit["status"])}
            className={`px-4 py-1.5 rounded-xl text-sm font-body transition-all ${filter === f.key ? "text-white shadow-sm" : "bg-white border border-border hover:bg-muted"}`}
            style={filter === f.key ? { backgroundColor: "var(--spa-green)" } : {}}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((v, i) => (
          <div key={v.id} className="card-spa p-4 hover:shadow-md transition-all animate-slide-up"
            style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "both" }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0" style={{ background: "#e8f5ee" }}>
                  <span className="text-sm font-display font-bold leading-none" style={{ color: "var(--spa-green)" }}>{v.date.split("-")[2]}</span>
                  <span className="text-[10px] font-body" style={{ color: "var(--spa-green)", opacity: 0.7 }}>{MONTHS[parseInt(v.date.split("-")[1])-1]}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Avatar name={v.clientName} size="sm" />
                    <p className="font-body font-semibold text-foreground">{v.clientName}</p>
                  </div>
                  <p className="text-sm text-muted-foreground ml-9">{v.service}</p>
                  {v.notes && <p className="text-xs text-muted-foreground italic mt-1 ml-9">"{v.notes}"</p>}
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2 flex-shrink-0">
                <StatusBadge status={v.status} />
                <p className="font-display text-xl font-semibold" style={{ color: "var(--spa-green)" }}>{v.price.toLocaleString()} ₽</p>
                <p className="text-xs text-muted-foreground font-body">{v.time} · {v.duration} мин</p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground font-body">Визитов не найдено</div>
        )}
      </div>
    </div>
  );
}

// ---- SERVICES ----
function Services({ services }: { services: Service[] }) {
  const categories = [...new Set(services.map(s => s.category))];

  return (
    <div className="animate-fade-in space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-5xl font-light" style={{ color: "var(--spa-green)" }}>Услуги</h1>
          <p className="text-muted-foreground text-sm font-body mt-1">Каталог массажных программ</p>
        </div>
        <button className="btn-spa flex items-center gap-2">
          <Icon name="Plus" size={15} />
          Добавить
        </button>
      </div>

      {categories.map(cat => (
        <div key={cat}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display text-2xl" style={{ color: "var(--spa-brown)" }}>{cat}</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {services.filter(s => s.category === cat).map((s, i) => (
              <div key={s.id} className="card-spa p-5 hover:shadow-md transition-all group animate-slide-up"
                style={{ animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #e8f5ee, #d4ead9)" }}>
                    <Icon name="Leaf" size={18} className="text-emerald-700" />
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                    <Icon name="Pencil" size={12} className="text-muted-foreground" />
                  </button>
                </div>
                <h3 className="font-body font-semibold text-foreground mb-1.5">{s.name}</h3>
                <p className="text-xs text-muted-foreground font-body leading-relaxed mb-4">{s.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Icon name="Clock" size={13} />
                    <span className="text-xs font-body">{s.duration} мин</span>
                  </div>
                  <span className="font-display text-xl font-semibold" style={{ color: "var(--spa-green)" }}>{s.price.toLocaleString()} ₽</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- SCHEDULE ----
function Schedule({ visits }: { visits: Visit[] }) {
  const today = new Date(2026, 2, 27);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  const [activeDay, setActiveDay] = useState(0);
  const dayStr = days[activeDay].toISOString().split("T")[0];
  const dayVisits = visits.filter(v => v.date === dayStr);

  const DAYS_RU = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const MONTHS_RU = ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"];
  const hours = Array.from({ length: 10 }, (_, i) => i + 9);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-5xl font-light" style={{ color: "var(--spa-green)" }}>Расписание</h1>
          <p className="text-muted-foreground text-sm font-body mt-1">Планирование записей</p>
        </div>
        <button className="btn-spa flex items-center gap-2">
          <Icon name="Plus" size={15} />
          Записать
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((d, i) => (
          <button key={i} onClick={() => setActiveDay(i)}
            className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl transition-all ${activeDay === i ? "shadow-md text-white" : "bg-white border border-border hover:bg-muted"}`}
            style={activeDay === i ? { backgroundColor: "var(--spa-green)" } : {}}>
            <span className={`text-xs font-body ${activeDay === i ? "text-white/80" : "text-muted-foreground"}`}>{DAYS_RU[d.getDay()]}</span>
            <span className="text-xl font-display font-semibold leading-tight">{d.getDate()}</span>
            <span className={`text-xs font-body ${activeDay === i ? "text-white/80" : "text-muted-foreground"}`}>{MONTHS_RU[d.getMonth()]}</span>
          </button>
        ))}
      </div>

      <div className="card-spa overflow-hidden">
        <div className="space-y-0">
          {hours.map((h, idx) => {
            const timeStr = `${h.toString().padStart(2, "0")}:00`;
            const visit = dayVisits.find(v => v.time === timeStr);
            return (
              <div key={h} className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${idx !== hours.length - 1 ? "border-b border-border/50" : ""} ${visit ? "bg-emerald-50/50" : "hover:bg-muted/20"}`}>
                <span className="text-sm font-body text-muted-foreground w-12 flex-shrink-0 font-medium">{timeStr}</span>
                {visit ? (
                  <div className="flex items-center justify-between flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-10 rounded-full" style={{ backgroundColor: "var(--spa-green)" }} />
                      <div>
                        <p className="font-body font-semibold text-sm text-foreground">{visit.clientName}</p>
                        <p className="text-xs text-muted-foreground">{visit.service} · {visit.duration} мин</p>
                      </div>
                    </div>
                    <span className="font-body font-semibold text-sm" style={{ color: "var(--spa-green)" }}>{visit.price.toLocaleString()} ₽</span>
                  </div>
                ) : (
                  <button className="text-xs text-muted-foreground/40 hover:text-emerald-600 transition-colors font-body flex items-center gap-1">
                    <Icon name="Plus" size={11} />
                    Свободно
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-spa p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Bell" size={18} className="text-muted-foreground" />
          <h2 className="font-display text-xl text-foreground">Автоматические напоминания</h2>
        </div>
        <div className="space-y-2">
          {[
            { label: "SMS за 24 часа до визита", active: true },
            { label: "SMS за 2 часа до визита", active: true },
            { label: "Push-уведомление за 30 минут", active: false },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-muted/30 transition-colors">
              <span className="font-body text-sm text-foreground">{r.label}</span>
              <div className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${r.active ? "" : "bg-muted"}`}
                style={r.active ? { backgroundColor: "var(--spa-green)" } : {}}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${r.active ? "right-1" : "left-1"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- STATS ----
function Stats({ visits, clients }: { visits: Visit[]; clients: Client[] }) {
  const completed = visits.filter(v => v.status === "Завершён");
  const totalRevenue = completed.reduce((s, v) => s + v.price, 0);
  const avgCheck = completed.length ? Math.round(totalRevenue / completed.length) : 0;

  const serviceStats = visits.reduce((acc: Record<string, number>, v) => {
    acc[v.service] = (acc[v.service] || 0) + 1;
    return acc;
  }, {});
  const topServices = Object.entries(serviceStats).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCount = Math.max(...topServices.map(s => s[1]));

  const BAR_COLORS = ["#3d6b4f", "#5a8f70", "#8b6347", "#c4a882", "#a0b090"];

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-5xl font-light" style={{ color: "var(--spa-green)" }}>Статистика</h1>
        <p className="text-muted-foreground text-sm font-body mt-1">Аналитика вашего салона</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Общая выручка", value: `${totalRevenue.toLocaleString()} ₽`, icon: "Banknote", bg: "bg-emerald-50", fg: "text-emerald-700" },
          { label: "Средний чек", value: `${avgCheck.toLocaleString()} ₽`, icon: "Receipt", bg: "bg-amber-50", fg: "text-amber-600" },
          { label: "Завершено визитов", value: String(completed.length), icon: "CheckCircle", bg: "bg-blue-50", fg: "text-blue-600" },
        ].map((s, i) => (
          <div key={i} className="card-spa p-5 animate-slide-up" style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "both" }}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.bg}`}>
              <Icon name={s.icon} size={18} className={s.fg} />
            </div>
            <p className="font-display text-3xl font-semibold text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground font-body mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card-spa p-6">
        <h2 className="font-display text-xl text-foreground mb-6">Популярные услуги</h2>
        <div className="space-y-4">
          {topServices.map(([name, count], i) => (
            <div key={name} className="animate-slide-up" style={{ animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-body font-medium text-foreground">{name}</span>
                <span className="text-sm font-body font-semibold" style={{ color: BAR_COLORS[i] }}>{count}</span>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(count / maxCount) * 100}%`, backgroundColor: BAR_COLORS[i] }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-spa p-6">
        <h2 className="font-display text-xl text-foreground mb-4">Топ клиентов</h2>
        <div className="space-y-1">
          {clients.sort((a, b) => b.visits - a.visits).map((c, i) => (
            <div key={c.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm font-body w-5 text-center">{i + 1}</span>
                <Avatar name={c.name} size="sm" />
                <span className="font-body text-sm font-medium text-foreground">{c.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground font-body hidden sm:block">{c.lastVisit ? formatDate(c.lastVisit) : "—"}</span>
                <span className="font-body font-bold text-sm" style={{ color: "var(--spa-green)" }}>{c.visits} визитов</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- MAIN APP ----
export default function Index() {
  const [page, setPage] = useState<Page>("dashboard");
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [visits] = useState<Visit[]>(INITIAL_VISITS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "var(--spa-cream)" }}>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "hsl(var(--sidebar-background))" }}>
        <div className="px-6 py-7" style={{ borderBottom: "1px solid hsl(var(--sidebar-border))" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
              <Icon name="Leaf" size={20} style={{ color: "hsl(var(--sidebar-primary))" }} />
            </div>
            <div>
              <p className="font-display text-lg font-semibold" style={{ color: "hsl(var(--sidebar-primary))" }}>CRM Массаж</p>
              <p className="text-xs font-body" style={{ color: "hsl(var(--sidebar-foreground))", opacity: 0.55 }}>Управление салоном</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {navItems.map(item => (
            <div key={item.id} onClick={() => { setPage(item.id); setSidebarOpen(false); }}
              className={`sidebar-item ${page === item.id ? "active" : ""}`}>
              <Icon name={item.icon} size={18} />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="px-3 py-4" style={{ borderTop: "1px solid hsl(var(--sidebar-border))" }}>
          <div className="sidebar-item">
            <Icon name="Settings" size={18} />
            <span className="text-sm">Настройки</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md border-b border-border sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
            <Icon name="Menu" size={18} />
          </button>
          <div className="flex-1 lg:flex-none" />
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center relative">
              <Icon name="Bell" size={17} className="text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-display font-semibold"
                style={{ background: "linear-gradient(135deg, var(--spa-green), var(--spa-brown))" }}>М</div>
              <span className="text-sm font-body text-foreground hidden sm:block">Мастер</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {page === "dashboard" && <Dashboard clients={clients} visits={visits} />}
            {page === "clients" && <Clients clients={clients} setClients={setClients} />}
            {page === "visits" && <Visits visits={visits} />}
            {page === "services" && <Services services={services} />}
            {page === "schedule" && <Schedule visits={visits} />}
            {page === "stats" && <Stats visits={visits} clients={clients} />}
          </div>
        </main>
      </div>
    </div>
  );
}