# 使用 Node.js 20 官方镜像
FROM node:20

# 创建工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果有）
COPY package*.json ./

# 安装所有依赖
RUN npm install

# 设置 PATH
ENV PATH /app/node_modules/.bin:$PATH

# 调试：列出 node_modules 目录
RUN ls -la node_modules && ls -la node_modules/.bin

RUN npm i --save-dev @types/react-syntax-highlighter
RUN npm install xml2js
RUN npm install react-slick slick-carousel
RUN npm i --save-dev @types/react-slick
RUN npm install --save-dev framer-motion
RUN npm install -D tailwindcss postcss autoprefixer
RUN npm install browser-image-compression jszip react-dropzone
# 复制项目文件
COPY next* postcss.config.js tailwind.config.js tsconfig.json tsconfig.app.json tsconfig.node.json ./src/index.css ./src/vite-env.d.ts vite.config.ts ./
RUN npx shadcn@latest init -d
RUN npx shadcn@latest add button
RUN npx shadcn@latest add input
RUN npx shadcn@latest add tabs
RUN npx shadcn@latest add card
RUN npx shadcn@latest add sheet
RUN npx shadcn@latest add dropdown-menu
RUN npx shadcn@latest add tooltip
RUN npx shadcn@latest add alert
RUN npx shadcn@latest add badge
RUN npx shadcn@latest add form
RUN npx shadcn@latest add label switch slider scroll-area toast
RUN npm install @next/third-parties
RUN npm install react-markdown remark-gfm react-syntax-highlighter rehype-raw
RUN npm install react-toastify
RUN npm install axios
RUN npm install @react-three/fiber three
RUN npm install --save-dev @types/three
RUN npm install simplex-noise
RUN npm install react-intersection-observer
RUN npm install react-window react-virtualized-auto-sizer lodash
RUN npm i --save-dev @types/react-window
RUN npm i --save-dev @types/lodash
RUN npm install puppeteer
RUN npm install canvas
RUN npm install js-yaml
RUN npm i --save-dev @types/js-yaml

COPY . .
RUN cp -r components/ui/* src/components/ui

# 调试：列出 .shadcn 目录和组件目录
#RUN ls -la .shadcn
#RUN ls -la components
# RUN ls -la src/components
# RUN ls -la src/components/ui

# 暴露端口
EXPOSE 3000

# 构建项目
RUN npm run build

# 启动服务器
CMD ["npm", "run", "start"]