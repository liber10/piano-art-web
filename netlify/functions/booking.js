const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  // 1. Проверяем, что запрос правильный (POST)
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, phone, comment, date, time } = data;

    // 2. Инициализируем Supabase и Telegram
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 3. Сохраняем в Базу Данных (Supabase)
    // Мы объединяем дату и время в один формат для базы
    // Предполагаем, что date приходит как ISO строка
    const fullDateISO = new Date(date).toISOString(); // Упрощение, можно доработать работу с часовыми поясами
    
    const { error: dbError } = await supabase
      .from('bookings')
      .insert([
        { 
          client_name: name, 
          client_contact: phone, 
          comment: comment,
          start_time: fullDateISO, // В базе это поле start_time
          status: 'pending' // Статус "На проверке"
        }
      ]);

    if (dbError) throw dbError;

    // 4. Отправляем уведомление в Telegram
    const telegramText = `
🎹 *Новая заявка на урок!*

👤 *Имя:* ${name}
📱 *Связь:* ${phone}
📅 *Дата:* ${new Date(date).toLocaleDateString('ru-RU')}
⏰ *Время:* ${time}
💬 *Комментарий:* ${comment || "Нет"}
    `;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramText,
        parse_mode: 'Markdown'
      })
    });

    // 5. Успех!
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Заявка принята!" }),
    };

  } catch (error) {
    console.error("Ошибка:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Ошибка на сервере" }),
    };
  }
};