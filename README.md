# RouterOS Dashboard

MikroTik RouterOS v7 实时管理仪表盘。

## 功能

- **系统监控** — CPU、内存、运行时间、版本信息
- **实时流量** — WAN 接口上下行速率，2 分钟面积图
- **客户端列表** — DHCP 租约 + ARP 表自动合并，支持搜索/排序
- **每客户端带宽** — 通过 mangle 规则计数器追踪每个客户端的实时上下行速率
- **客户端域名访问** — 连接追踪 + DNS 缓存匹配，显示每个 IP 访问的域名
- **DNS 缓存** — 路由器 DNS 缓存查看，支持类型过滤和搜索

## 技术栈

- **后端**: Node.js + TypeScript + Express + Socket.IO
- **前端**: React + TypeScript + Vite + TailwindCSS + Recharts
- **通信**: RouterOS v7 REST API (`/rest`)

## 环境要求

- Node.js 18+
- MikroTik RouterOS v7.1+（需要 REST API 支持）

## 快速开始

### 1. 路由器配置

在 RouterOS 终端（Winbox / SSH / WebFig Terminal）执行：

```routeros
# 创建 API 用户
/user add name=dashboard password=你的密码 group=full

# 确保 www 服务已启用（REST API 通过 HTTP/HTTPS 提供）
/ip service print
# 如果 www 被禁用：
/ip service set www disabled=no

# （可选）禁用 FastTrack，否则每客户端带宽数据不准确
/ip firewall filter print where action=fasttrack-connection
/ip firewall filter set [find action=fasttrack-connection] disabled=yes

# 确保 DNS 缓存开启
/ip dns set allow-remote-requests=yes
```

### 2. 项目安装

```bash
git clone https://github.com/baoeig/routeros-dashboard.git
cd routeros-dashboard
cp .env.example .env
```

编辑 `.env` 填入路由器信息：

```env
ROUTER_HOST=192.168.88.1    # 路由器 IP
ROUTER_PORT=80              # 80=HTTP, 443=HTTPS
ROUTER_USER=dashboard       # API 用户名
ROUTER_PASSWORD=你的密码     # API 密码
WAN_INTERFACE=ether1        # WAN 接口名称
SERVER_PORT=3001            # 后端端口
```

> **如何确认 WAN 接口名称？** 在路由器终端执行 `/interface print`，找到连接外网的接口。

安装依赖：

```bash
npm install
```

### 3. 启动

```bash
# 启动后端（终端 1）
npm run dev -w server

# 启动前端（终端 2）
npm run dev -w client
```

打开浏览器访问 `http://localhost:5173`。

## 配置项

| 环境变量 | 默认值 | 说明 |
|---------|--------|------|
| `ROUTER_HOST` | `192.168.88.1` | 路由器 IP 地址 |
| `ROUTER_PORT` | `443` | REST API 端口（80=HTTP, 443=HTTPS） |
| `ROUTER_USER` | `admin` | 登录用户名 |
| `ROUTER_PASSWORD` | | 登录密码 |
| `WAN_INTERFACE` | `ether1` | WAN 接口名称 |
| `SERVER_PORT` | `3001` | 后端监听端口 |
| `TRAFFIC_POLL_MS` | `2000` | 总流量轮询间隔 (ms) |
| `BANDWIDTH_POLL_MS` | `5000` | 每客户端带宽轮询间隔 (ms) |
| `CLIENTS_POLL_MS` | `10000` | 客户端列表轮询间隔 (ms) |
| `DNS_POLL_MS` | `30000` | DNS 缓存轮询间隔 (ms) |
| `SYSTEM_POLL_MS` | `10000` | 系统信息轮询间隔 (ms) |
| `AUTO_CREATE_MANGLE` | `true` | 自动创建 mangle 规则 |

## 工作原理

### 每客户端带宽

为每个客户端自动创建 2 条 mangle passthrough 规则（上行 TX + 下行 RX），通过定时轮询计数器差值计算实时速率。

> **注意**: 需要禁用 FastTrack，否则快速通道流量绕过 mangle 计数器，带宽数据不准确。

### 客户端域名追踪

将路由器的**连接追踪表**（`/ip/firewall/connection`）与 **DNS 缓存**交叉匹配：连接追踪记录每个客户端 IP 的目标 IP，DNS 缓存提供 IP 到域名的映射。

限制：
- 只能匹配 DNS 缓存中仍存在的域名（已过期的不可见）
- HTTPS 只能看到域名，看不到完整 URL
- 使用 DoH/DoT 的客户端 DNS 查询无法捕获

## 项目结构

```
├── server/src/
│   ├── index.ts              # Express + Socket.IO 入口
│   ├── config.ts             # 环境变量配置
│   ├── router/client.ts      # RouterOS REST API 封装
│   ├── services/             # 数据服务层
│   │   ├── system.service.ts
│   │   ├── clients.service.ts
│   │   ├── traffic.service.ts
│   │   ├── bandwidth.service.ts
│   │   └── dns.service.ts
│   ├── routes/               # REST API 路由
│   └── ws/server.ts          # WebSocket 实时推送
└── client/src/
    ├── components/           # React 组件
    ├── hooks/                # 数据获取 hooks
    └── api/                  # HTTP + WebSocket 客户端
```

## License

MIT
