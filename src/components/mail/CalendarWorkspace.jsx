import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Plus, Calendar, Clock, 
  Trash2, X, AlertCircle, Tag
} from 'lucide-react';

const mockInitialEvents = [
  {
    id: 'e1',
    title: 'Reunión de Proyectos: Faguade',
    date: '2026-06-25',
    time: '10:00',
    color: 'emerald',
    description: 'Revisión final de cotizaciones y brochure.'
  },
  {
    id: 'e2',
    title: 'Presentación de Ventas Corporativas',
    date: '2026-06-28',
    time: '14:30',
    color: 'blue',
    description: 'Llamada con el equipo de ventas para la nueva campaña.'
  },
  {
    id: 'e3',
    title: 'Soporte Técnico de Servidores',
    date: '2026-06-26',
    time: '09:00',
    color: 'amber',
    description: 'Mantenimiento preventivo e IMAP sync performance.'
  }
];

const CalendarWorkspace = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('mail_calendar_events');
    return saved ? JSON.parse(saved) : mockInitialEvents;
  });

  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('09:00');
  const [newEventColor, setNewEventColor] = useState('blue');
  const [newEventDesc, setNewEventDesc] = useState('');

  useEffect(() => {
    localStorage.setItem('mail_calendar_events', JSON.stringify(events));
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const totalDays = getDaysInMonth(year, month);
  const startDayIndex = getFirstDayOfMonth(year, month); // Day of week (0-6) starting Sunday. Let's adjust for Monday start.
  const adjustedStartDayIndex = startDayIndex === 0 ? 6 : startDayIndex - 1; // Monday=0, Sunday=6

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getFormattedDateStr = (day) => {
    const d = day < 10 ? `0${day}` : day;
    const m = (month + 1) < 10 ? `0${month + 1}` : month + 1;
    return `${year}-${m}-${d}`;
  };

  const getEventsForDay = (day) => {
    const dateStr = getFormattedDateStr(day);
    return events.filter(e => e.date === dateStr);
  };

  const handleDayClick = (day) => {
    const dateStr = getFormattedDateStr(day);
    setSelectedDateStr(dateStr);
    setShowEventModal(true);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEvent = {
      id: Math.random().toString(36).substring(2, 9),
      title: newEventTitle,
      date: selectedDateStr,
      time: newEventTime,
      color: newEventColor,
      description: newEventDesc
    };

    setEvents(prev => [...prev, newEvent]);
    setNewEventTitle('');
    setNewEventTime('09:00');
    setNewEventColor('blue');
    setNewEventDesc('');
    setShowEventModal(false);
  };

  const handleDeleteEvent = (id, e) => {
    e.stopPropagation();
    setEvents(prev => prev.filter(evt => evt.id !== id));
  };

  const getColorClass = (color) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'blue': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'amber': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'rose': return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      default: return 'bg-slate-500/10 border-slate-500/30 text-slate-400';
    }
  };

  const getColorDotClass = (color) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-500 shadow-[0_0_8px_#10b981]';
      case 'blue': return 'bg-blue-500 shadow-[0_0_8px_#3b82f6]';
      case 'amber': return 'bg-amber-500 shadow-[0_0_8px_#f58a07]';
      case 'rose': return 'bg-rose-500 shadow-[0_0_8px_#f43f5e]';
      default: return 'bg-slate-400';
    }
  };

  const renderDaysGrid = () => {
    const days = [];
    
    // Fill empty spots for starting day offset
    for (let i = 0; i < adjustedStartDayIndex; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-[90px] border border-white/[0.02] bg-white/[0.005] opacity-20 rounded-xl" />
      );
    }

    // Month days
    for (let d = 1; d <= totalDays; d++) {
      const dayEvents = getEventsForDay(d);
      const dateStr = getFormattedDateStr(d);
      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

      days.push(
        <div
          key={`day-${d}`}
          onClick={() => handleDayClick(d)}
          className={`min-h-[90px] border border-white/[0.04] rounded-xl p-3 flex flex-col justify-between transition-all duration-300 cursor-pointer hover:bg-white/[0.03] hover:border-slate-700/60
            ${isToday ? 'bg-[#3CB4FF]/5 border-[#3CB4FF]/30 shadow-[inset_0_0_12px_rgba(60,180,255,0.05)]' : 'bg-[#0B1220]/40'}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isToday ? 'text-[#3CB4FF] bg-[#3CB4FF]/10 px-2 py-0.5 rounded-full' : 'text-slate-400'}`}>
              {d}
            </span>
            {dayEvents.length > 0 && (
              <span className="text-[10px] bg-slate-800 text-[#3CB4FF] px-1.5 py-0.5 rounded-md font-extrabold">
                {dayEvents.length}
              </span>
            )}
          </div>

          <div className="space-y-1 mt-2 flex-1 flex flex-col justify-end">
            {dayEvents.slice(0, 2).map(evt => (
              <div
                key={evt.id}
                className="text-[9px] truncate px-2 py-0.5 rounded-md border font-semibold flex items-center gap-1.5"
                style={{
                  backgroundColor: evt.color === 'emerald' ? 'rgba(16,185,129,0.08)' : evt.color === 'blue' ? 'rgba(59,130,246,0.08)' : evt.color === 'amber' ? 'rgba(245,158,11,0.08)' : 'rgba(244,63,94,0.08)',
                  borderColor: evt.color === 'emerald' ? 'rgba(16,185,129,0.2)' : evt.color === 'blue' ? 'rgba(59,130,246,0.2)' : evt.color === 'amber' ? 'rgba(245,158,11,0.2)' : 'rgba(244,63,94,0.2)',
                  color: evt.color === 'emerald' ? '#34d399' : evt.color === 'blue' ? '#60a5fa' : evt.color === 'amber' ? '#fbbf24' : '#f87171',
                }}
              >
                <div className={`w-1 h-1 rounded-full shrink-0 ${getColorDotClass(evt.color)}`} />
                <span className="truncate">{evt.title}</span>
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-[8px] text-slate-500 font-extrabold text-right pr-1">
                +{dayEvents.length - 2} más
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10 w-full h-full gap-6">
      {/* Calendar Grid Section */}
      <div className="flex-1 bg-[#0B1220]/80 border border-slate-800/80 backdrop-blur-xl rounded-2xl flex flex-col h-full shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Calendar Header */}
        <div className="px-6 py-4.5 border-b border-white/[0.04] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3CB4FF]/10 flex items-center justify-center border border-[#3CB4FF]/30 text-[#3CB4FF] shadow-[0_0_12px_rgba(60,180,255,0.08)]">
              <Calendar size={18} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white leading-none">
                {monthNames[month]} {year}
              </h2>
              <p className="text-[10px] text-slate-500 mt-1 font-bold tracking-wider uppercase">
                Agenda de Actividades
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/60 rounded-xl transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3.5 py-2 bg-slate-900/40 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white border border-slate-800/60 rounded-xl transition-all cursor-pointer"
            >
              Hoy
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/60 rounded-xl transition-all cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Days of the week header */}
        <div className="grid grid-cols-7 gap-1 text-center py-3 bg-slate-950/20 border-b border-white/[0.02] shrink-0">
          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
            <span key={day} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {day.substring(0, 3)}
            </span>
          ))}
        </div>

        {/* Grid Days Area */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-7 gap-2.5"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#3CB4FF #0B1220',
          }}
        >
          {renderDaysGrid()}
        </div>
      </div>

      {/* Events Details Sidebar */}
      <div className="w-full lg:w-[350px] xl:w-[380px] bg-[#050B14]/75 border border-slate-800/80 backdrop-blur-xl rounded-2xl flex flex-col h-full shrink-0 shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04] bg-slate-900/10 shrink-0">
          <h3 className="text-xs font-extrabold text-[#3CB4FF] uppercase tracking-widest">
            Próximos Eventos
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#3CB4FF #0B1220',
          }}
        >
          {events.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-555 text-center py-10">
              <AlertCircle size={28} className="text-slate-700 mb-2" />
              <p className="text-xs font-bold text-slate-400">Sin eventos en la agenda</p>
              <p className="text-[10px] text-slate-600 mt-1 max-w-[200px]">Haz clic en cualquier día del calendario para programar una actividad.</p>
            </div>
          ) : (
            [...events]
              .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
              .map(evt => {
                const dateParts = evt.date.split('-');
                const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

                return (
                  <div
                    key={evt.id}
                    className={`p-4 rounded-2xl border flex flex-col gap-2 relative group transition-all duration-300 bg-[#0F1726]/40 border-slate-800/60 hover:bg-[#162237]/60 hover:border-slate-700/65 shadow-md`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border shrink-0 tracking-wide uppercase ${getColorClass(evt.color)}`}>
                          {evt.color}
                        </span>
                        <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold">
                          <Clock size={11} />
                          <span>{evt.time}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => handleDeleteEvent(evt.id, e)}
                        className="p-1 text-slate-550 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Eliminar evento"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-snug">
                      {evt.title}
                    </h4>

                    {evt.description && (
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        {evt.description}
                      </p>
                    )}

                    <div className="text-[9px] font-extrabold text-[#3CB4FF] mt-1 bg-[#3CB4FF]/5 border border-[#3CB4FF]/10 px-2 py-0.5 rounded-md inline-block self-start">
                      {formattedDate}
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>

      {/* Add Event Modal overlay */}
      <AnimatePresence>
        {showEventModal && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]" onClick={() => setShowEventModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0B1220]/95 backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-2xl z-[90] overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-[#3CB4FF]" />
                  <h3 className="font-semibold text-sm text-slate-200">
                    Añadir Evento ({selectedDateStr.split('-').reverse().join('/')})
                  </h3>
                </div>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="p-5 space-y-4 text-xs">
                {/* Event Title */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-450 uppercase tracking-wider">Título del evento</label>
                  <input
                    type="text"
                    required
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="Ej. Reunión de cotizaciones"
                    className="input-dark w-full font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Time */}
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-450 uppercase tracking-wider">Hora</label>
                    <input
                      type="time"
                      required
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      className="input-dark w-full font-semibold"
                    />
                  </div>

                  {/* Color tag */}
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-450 uppercase tracking-wider">Categoría (Color)</label>
                    <select
                      value={newEventColor}
                      onChange={(e) => setNewEventColor(e.target.value)}
                      className="input-dark w-full font-semibold"
                    >
                      <option value="blue" className="bg-[#0B1220]">Proyecto (Azul)</option>
                      <option value="emerald" className="bg-[#0B1220]">Ventas (Verde)</option>
                      <option value="amber" className="bg-[#0B1220]">Soporte (Amarillo)</option>
                      <option value="rose" className="bg-[#0B1220]">Urgente (Rojo)</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-450 uppercase tracking-wider">Descripción (Opcional)</label>
                  <textarea
                    value={newEventDesc}
                    onChange={(e) => setNewEventDesc(e.target.value)}
                    placeholder="Detalles sobre el evento..."
                    rows={3}
                    className="input-dark w-full resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="px-4 py-2 hover:bg-slate-800 rounded-lg font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-[#D21414] to-[#3CB4FF] hover:brightness-110 text-white rounded-lg font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Crear Evento
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarWorkspace;
