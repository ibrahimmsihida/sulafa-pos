# استخدام Node.js 18
FROM node:18-alpine

# تعيين مجلد العمل
WORKDIR /app

# نسخ ملفات package
COPY package*.json ./

# تثبيت التبعيات
RUN npm install

# نسخ باقي الملفات
COPY . .

# بناء المشروع
RUN npm run build

# إنشاء مجلد الرفع
RUN mkdir -p uploads

# تعيين المنفذ
EXPOSE 3000 5000

# تشغيل التطبيق
CMD ["node", "server.js"]