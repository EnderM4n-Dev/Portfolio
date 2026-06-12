# EnderDev Portfolio — Mohammad Hossein Nouri

پورتفولیو شخصی محمدحسین نوری · چندصفحه‌ای، دوزبانه (FA/EN)، موبایل‌فرندلی.

## ساختار

```
EnderDev-Portfolio/
├── Home.html          # صفحه خانه (هیرو + نمایش کارها)
├── Projects.html      # صفحه پروژه‌ها
├── Contact.html       # صفحه تماس با من
├── styles.css         # استایل کل سایت
├── app.js             # تعاملات مشترک (زبان، منوی موبایل، scroll reveal)
├── home-fx.js         # افکت‌های صفحه خانه (intro، ذرات، دکمه مغناطیسی)
├── projects-bg.js     # شیدر WebGL پس‌زمینه
├── image-slot.js      # کامپوننت drag-and-drop عکس
└── assets/            # تصاویر و آیکون‌ها
```

## اجرا

برای دیدن سایت کافیه `Home.html` رو با یک مرورگر باز کنی، یا از یک سرور محلی استفاده کنی:

```bash
# Python
python -m http.server 8080

# یا با Node
npx serve .
```

سپس به `http://localhost:8080/Home.html` برو.

## پالت رنگی

- `#213555` Navy
- `#4F709C` Blue
- `#E5D283` Gold
- `#F0F0F1` Light

## ویژگی‌ها

- **چندصفحه‌ای** با منوی کناری عمودی (راست برای فارسی، چپ برای انگلیسی)
- **موبایل** با نوار ناوبری پایین صفحه
- **دوزبانه** (FA/EN) با ذخیره‌ی انتخاب در localStorage
- **انیمیشن‌ها**: intro loader، شبکه ذرات تعاملی، آب روی متن، scroll reveal، شیدر WebGL
- **دکمه مغناطیسی** برای CTA
- **drag-and-drop عکس** که در localStorage مرورگر ذخیره می‌شه

## تماس

- Telegram: [@EnderM4n](https://t.me/EnderM4n)
- Bale: [@EnderM4n](https://ble.ir/EnderM4n)
- Gmail: noori.sec@gmail.com
- Instagram: [@ender_dev_](https://instagram.com/ender_dev_)
- Phone: 09912795515
- GitHub: [EnderM4n-Dev](https://github.com/EnderM4n-Dev)
