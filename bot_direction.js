
const TelegramBot = require('node-telegram-bot-api');

// const token = '7436762406:AAHlkeqMQdalXJ3-OICv-Xw6Qc24faD8DQ0';
const token = '7097570929:AAHhYbNukz6gfruAq3S3DkYwqvmD-6CV2qM';
const bot = new TelegramBot(token, { polling: true });
let userData = {};
let photoIds = [];
let direction_chosen = '';


bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeText = 'Добро пожаловать, нажмите на кнопку отправить событие!';
  const keyboard = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Отправить событие', callback_data: 'send_event' }],
      ],
    }),
  };
  bot.sendMessage(chatId, welcomeText, keyboard);
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  
  if (query.data === 'send_event') {
   
    
 
    const directions = ['СХ ', 'СиНИ' , 'Прогнозирование', 'Электроника' , 'Приборка', 'КНТП', 'ПИАМ', 'СНО', 'Кадры и мс', 'Фарма', 'ГенТех', 'НаучПоп', 'ГЗ 2.0'  ];
  
    const keyboard = {
      reply_markup: JSON.stringify({
        inline_keyboard: directions.map(direction => [{ text: direction, callback_data: direction }]),
      }),
    };
    bot.sendMessage(chatId, 'Выберите направление события:', keyboard);
  } 

else {
    userData.direction = query.data;
    userData.topic = '';
    userData.text = '';
    userData.photos = [];
    bot.sendMessage(chatId, 'Введите тему:');
  }
});


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
  
    if (!userData.direction) {
      userData.direction = text;
      bot.sendMessage(chatId, 'Введите тему:');
    } else if (!userData.topic) {
      userData.topic = text;
      bot.sendMessage(chatId, 'Введите текст:');
    } else if (!userData.text) {
      userData.text = text;
      bot.sendMessage(chatId, 'Загрузите  фотографии или нажмите на кнопку "Нет больше фото":',
      {
        reply_markup: {
            keyboard: [['Нет больше фото']],
            one_time_keyboard: true
        }
    }
      );
    } else if (
        !userData.photos.length &&
         msg.photo
         ) {
      const photoId = msg.photo[0].file_id;
      if (!photoIds.includes(photoId)) {
        userData.photos.push(msg.photo[0]);
        photoIds.push(photoId);
      }
      console.log(userData.photos)
      bot.sendMessage(chatId, 'Загрузите еще фотографии или нажмите на кнопку "Нет больше фото":',
      {
        reply_markup: {
            keyboard: [['Нет больше фото']],
            one_time_keyboard: true
        }
    }
      );
    } 
    else if (
        userData.photos.length 
        && 
        msg.photo) {
        const photoId = msg.photo[0].file_id;
        if (!photoIds.includes(photoId)) {
          userData.photos.push(msg.photo[0]);
          photoIds.push(photoId);
        }
    
        bot.sendMessage(chatId, 'Загрузите еще фотографии или нажмите на кнопку "Нет больше фото":',
        {
          reply_markup: {
              keyboard: [['Нет больше фото']],
              one_time_keyboard: true
          }
      }
        );
      } 

   
  });

  bot.onText(/Нет больше фото/, (msg) => {

    const chatId = msg.chat.id;
    

    const userId = msg.from.username;
        const message = `Направление:\n${userData.direction}\n\nТема:\n${userData.topic}\n\nТекст:\n${userData.text}\n\nОтправитель:\n@${msg.chat.username}`;

        //админу
        bot.sendMessage(1046852462, message, { parse_mode: 'Markdown' });
  
        userData.photos.forEach((photo, index) => {
          bot.sendPhoto(1046852462, photo.file_id, { caption: `Фото ${index + 1}` });
        });

        //Модератору 
        // bot.sendMessage(764246420, message, { parse_mode: 'Markdown' });
  
        // userData.photos.forEach((photo, index) => {
        //   bot.sendPhoto(764246420, photo.file_id, { caption: `Фото ${index + 1}` });
        // });

        
  
        bot.sendMessage(chatId, 'Информация отправлена!', {
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [{ text: 'Отправить событие', callback_data: 'send_event' }],
            ],
          }),
        });
  
        userData = {};
        photoIds = [];
      

  })
  

// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     const text = msg.text;

//     if (!userData.direction) {
//         userData.direction = text;
//         bot.sendMessage(chatId, 'Введите тему:');
//     } else if (!userData.topic) {
//         userData.topic = text;
//         bot.sendMessage(chatId, 'Введите текст:');
//     } else if (!userData.text) {
//         userData.text = text;
//         bot.sendMessage(chatId, 'Загрузите фотографии (нажмите "Закончить", если готово):');
//     } else if (!userData.photos.length && msg.photo) {
//         const photoId = msg.photo[0].file_id;
//         if (!photoIds.includes(photoId)) {
//             userData.photos.push(msg.photo[0]);
//             photoIds.push(photoId);
//         }
//         bot.sendMessage(chatId, 'Загрузите еще фотографии или нажмите "Закончить", чтобы отправить событие:');
//     } else {
//         if (msg.photo) {
//             const photoId = msg.photo[0].file_id;
//             if (!photoIds.includes(photoId)) {
//                 userData.photos.push(msg.photo[0]);
//                 photoIds.push(photoId);
//             }
//             bot.sendMessage(chatId, 'Загрузите еще фотографии или нажмите "Закончить", чтобы отправить событие:');
//         } else {
//             bot.sendMessage(chatId, 'Вы уже ввели текст и добавили фотографии. Нажмите "Закончить", чтобы отправить событие:', {
//                 reply_markup: {
//                     inline_keyboard: [
//                         [{ text: 'Закончить', callback_data: 'finish_event' }]
//                     ]
//                 }
//             });
//         }
//     }
// });

// // Обработка callback_query
// bot.on('callback_query', (query) => {
//     const chatId = query.message.chat.id;
//     const data = query.data;

//     if (data === 'finish_event') {
//         const message = `Направление: ${userData.direction}\nТема: ${userData.topic}\nТекст: ${userData.text}`;

//         bot.sendMessage(1046852462, message, { parse_mode: 'Markdown' });

//         userData.photos.forEach((photo, index) => {
//             bot.sendPhoto(1046852462, photo.file_id, { caption: `Фото ${index + 1}` });
//         });

//         bot.sendMessage(chatId, 'Информация отправлена!', {
//             reply_markup: {
//                 inline_keyboard: [
//                     [{ text: 'Отправить событие', callback_data: 'send_event' }]
//                 ]
//             }
//         });

//         // Очищаем данные после отправки
//         userData = {};
//         photoIds = [];
//     }
// });







bot.on('polling_error', (error) => {
  console.log(error);
});
            