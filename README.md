# harry.dev — SSH Portfolio Server

A real SSH server that serves a terminal portfolio. Connect with:

```sh
ssh harry@harry.dev
```

---

## Setup

### 1. Install dependencies

```sh
npm install
```

### 2. Generate a host key

```sh
ssh-keygen -t rsa -b 2048 -f host_key -N ""
```

This creates `host_key` (private) and `host_key.pub` in the project root.
The server reads `host_key` on startup — don't commit it.

### 3. Run locally

```sh
npm start
# or
npm run dev   # auto-restarts on changes
```

Then connect:

```sh
ssh -p 2222 harry@localhost
```

---

## Deploy (recommended: fly.io or Railway)

### fly.io

```sh
fly launch
fly secrets set PORT=22
fly deploy
```

Set `internal_port = 2222` and `protocol = "tcp"` in `fly.toml`.

### Railway / Render

Set env var `PORT=2222`, expose a TCP port, connect your domain.

---

## Custom domain

Point an A record at your server IP, then:

```sh
# Users connect with:
ssh harry@harry.dev
# (if running on port 22, no -p flag needed)
```

To run on port 22 without root, use `authbind` or redirect with iptables:

```sh
sudo iptables -t nat -A PREROUTING -p tcp --dport 22 -j REDIRECT --to-port 2222
```

---

## Security notes

- The server accepts **all SSH auth** (no password/key required) — this is intentional for a public portfolio
- It's read-only: no file system access, no shell execution
- Rate-limit connections at the firewall level if you get hammered
- Keep `host_key` out of version control (already in `.gitignore` below)

---

## .gitignore

```
host_key
host_key.pub
node_modules/
```

---

## Adding commands

In `server.js`, add to the `COMMANDS` object:

```js
mycommand(stream) {
  stream.write('Hello from mycommand!\r\n');
},
```

That's it — it's available immediately as `mycommand` in the terminal.
