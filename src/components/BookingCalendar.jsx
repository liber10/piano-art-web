import { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isBefore,
  startOfToday
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, X, Check, Loader2 } from 'lucide-react';

export default function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [currentMonth, setCurrentMonth] = useState(startOfToday());
  const [selectedTime, setSelectedTime] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const timeSlots = ["10:00", "11:30", "14:00", "15:30", "17:00", "18:30", "20:00"];
  const isPrevDisabled = isSameMonth(currentMonth, startOfToday());

  // === ЛОГИКА ОТПРАВКИ ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
        name: e.target[0].value,
        phone: e.target[1].value,
        comment: e.target[2].value,
        date: selectedDate,
        time: selectedTime
    };

    // --- СИМУЛЯЦИЯ (Пока не настроен .env) ---
    setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsSuccess(false);
            setSelectedTime(null);
        }, 5000); // Даем 5 секунд прочитать сообщение
    }, 1500);
    
    /* // --- НАСТОЯЩАЯ ОТПРАВКА (Раскомментировать, когда заполните .env) ---
    try {
        const response = await fetch('/.netlify/functions/booking', {
            method: 'POST', body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Ошибка');
        setIsSuccess(true);
        setTimeout(() => { setIsModalOpen(false); setIsSuccess(false); setSelectedTime(null); }, 5000);
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
    */
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-piano-dark p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative">
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-serif text-white flex items-center gap-3 capitalize">
              {format(currentMonth, 'LLLL yyyy', { locale: ru })}
            </h3>
            <div className="flex gap-2">
              <button onClick={prevMonth} disabled={isPrevDisabled} className={`p-2 rounded-full border border-white/10 transition-colors ${isPrevDisabled ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-white/10 hover:border-gold-accent'}`}>
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextMonth} className="p-2 rounded-full border border-white/10 text-white hover:bg-white/10 hover:border-gold-accent transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 mb-2">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
              <div key={day} className="text-center text-xs uppercase text-white/40 font-medium py-2">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isPast = isBefore(day, startOfToday());
              
              // === НОВАЯ ЛОГИКА: Блокировка дней ===
              // 0=Вс, 1=Пн, 2=Вт, 3=Ср, 4=Чт, 5=Пт, 6=Сб
              // Блокируем: Пн(1), Вт(2), Чт(4), Вс(0)
              const dayOfWeek = day.getDay();
              const isBlockedDay = [0, 1, 2, 4].includes(dayOfWeek);
              
              const isDisabled = isPast || isBlockedDay;

              return (
                <button
                  key={day.toString()}
                  disabled={isDisabled}
                  onClick={() => { setSelectedDate(day); setSelectedTime(null); }}
                  className={`
                    relative h-10 sm:h-14 rounded-lg flex items-center justify-center text-sm sm:text-base transition-all
                    ${!isCurrentMonth ? 'opacity-0 pointer-events-none' : ''} 
                    ${isDisabled ? 'text-white/5 cursor-not-allowed' : 'hover:bg-white/5 text-white'}
                    ${isSelected && !isDisabled ? 'bg-gold-accent text-piano-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:bg-gold-accent' : ''}
                    ${isSameDay(day, startOfToday()) && !isSelected && !isDisabled ? 'text-gold-accent font-bold border border-gold-accent/30' : ''}
                  `}
                >
                  {format(day, 'd')}
                  {/* Красная точка для заблокированных дней (опционально, можно убрать) */}
                  {isBlockedDay && isCurrentMonth && !isPast && (
                     <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/10 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 border-t lg:border-t-0 lg:border-l border-white/10 pt-10 lg:pt-0 lg:pl-10 flex flex-col">
          <h3 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
            <Clock className="text-gold-accent" size={24} />
            Доступное время
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-3 rounded-lg text-base border transition-all duration-200 ${selectedTime === time ? 'bg-white text-piano-black border-white font-medium scale-105' : 'bg-white/5 text-white/80 border-white/10 hover:border-gold-accent hover:text-gold-accent'}`}
              >
                {time}
              </button>
            ))}
          </div>
          <div className="mt-auto pt-8">
            <button 
              disabled={!selectedTime}
              onClick={() => setIsModalOpen(true)}
              className={`w-full py-4 text-center uppercase tracking-widest font-bold text-sm rounded-xl transition-all duration-300 ${selectedTime ? 'bg-gold-accent text-piano-black hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer' : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'}`}
            >
              {selectedTime ? `Записаться: ${format(selectedDate, 'd MMMM', { locale: ru })} в ${selectedTime}` : 'Выберите дату и время'}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>

          <div className="relative bg-piano-dark border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl animate-fade-in">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"><X size={24} /></button>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-serif text-white">Запись на урок</h3>
                  <p className="text-white/60 text-sm">{format(selectedDate, 'd MMMM yyyy', { locale: ru })} в {selectedTime}</p>
                </div>
                <div className="space-y-4">
                  <input type="text" required placeholder="Ваше имя" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold-accent focus:outline-none" />
                  <input type="text" required placeholder="Телефон / Telegram" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold-accent focus:outline-none" />
                  <textarea rows="2" placeholder="Комментарий" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold-accent focus:outline-none resize-none"></textarea>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-gold-accent text-piano-black font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2">
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Подтвердить запись'}
                </button>
              </form>
            ) : (
              // === НОВЫЙ ТЕКСТ УСПЕХА ===
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl font-serif text-white">Заявка отправлена!</h3>
                <p className="text-white/60 leading-relaxed px-4">
                  Спасибо! С Вами свяжутся и согласуют детали в ближайшее время.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}