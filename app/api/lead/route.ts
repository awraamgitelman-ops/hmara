import { NextResponse } from 'next/server';
import https from 'https';

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN || '7412359419:AAF97N43sZqD4f6K2JqN1wP8sL7vR9tY1x0';
const TG_CHAT_ID = process.env.TG_CHAT_ID || '-1002234567890';

function sendTelegramNotification(text: string): Promise<void> {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      chat_id: TG_CHAT_ID,
      text: text,
      parse_mode: 'HTML',
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${TG_BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, () => resolve());
    req.on('error', () => resolve());
    req.write(payload);
    req.end();
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = (body.name || 'Клієнт').trim();
    const phone = (body.phone || '').trim();
    const email = (body.email || '').trim();
    const tariff = (body.tariff || 'Індивідуальна конфігурація').trim();
    const comment = (body.comment || '-').trim();
    const source = (body.source || 'Сайт LIKEMARK CLOUD').trim();
    const dateStr = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' });

    if (!phone && !email) {
      return NextResponse.json(
        { success: false, error: 'Вкажіть номер телефону або Email для зв’язку' },
        { status: 400 }
      );
    }

    const tgMessage =
      `<b>НОВА ЗАЯВКА LIKEMARK CLOUD (Next.js)</b>\n\n` +
      ` <b>Клієнт:</b> ${name}\n` +
      ` <b>Телефон:</b> ${phone}\n` +
      ` <b>Email:</b> ${email || 'не вказано'}\n` +
      ` <b>Тариф:</b> ${tariff}\n` +
      ` <b>Коментар:</b> ${comment}\n` +
      ` <b>Джерело:</b> ${source}\n` +
      `⏰ <b>Час:</b> ${dateStr}`;

    await sendTelegramNotification(tgMessage);

    return NextResponse.json({
      success: true,
      message: 'Дякуємо! Вашу заявку прийнято. Черговий інженер зв’яжеться з вами протягом 15 хвилин.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Помилка обробки заявки' },
      { status: 500 }
    );
  }
}
