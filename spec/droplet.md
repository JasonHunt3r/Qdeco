# The Qdeco droplet

**Status:** Set up 2026-10-14 (night): the base by Jason, by hand, with App
Claude; SharkAttack's home by Shakedown's `server/deploy/qdeco-setup.sh`
(B-31 step 3, `~/Projects/Shakedown/spec/sharkattack-silo.md`), run by
Jason with sudo. **Open work:** none here (SharkAttack's steps are in
Shakedown's backlog).

Qdeco's own server, on Jason's DigitalOcean account. qdeco.com itself stays
on GitHub Pages (`spec/publishing.md`); only `shakedown.qdeco.com` points
here. No passwords or keys in this page, ever.

| What | It |
|---|---|
| The droplet | `Qdeco`, Ubuntu 24.04 LTS, Basic 1 GB, IPv4 and IPv6; weekly DigitalOcean backups on |
| Names | `shakedown.qdeco.com`: an A and an AAAA record at GoDaddy (2026-10-14); the domain's other records (his email) untouched |
| Logins | `jason` (sudo, asks his password), by the Mac's own key; root and password logins off (`/etc/ssh/sshd_config.d/00-qdeco.conf`). `sharkdeploy`: deploys only (below). No passwordless sudo for `jason` |
| Firewall (ufw) | OpenSSH, 80/tcp, 443/tcp; nothing else |
| Upgrades | Unattended security upgrades on |

## What runs

| Service | What it does | Where |
|---|---|---|
| `caddy` | Serves `https://shakedown.qdeco.com`: the page from `/srv/shakedown/page`, `/api/shakedown/*` to SharkAttack (streams unbuffered), `apps.js` always 404. Fetches and renews its certificate itself | `/etc/caddy/Caddyfile` (from Shakedown's `server/deploy/Caddyfile`; the first one kept as `Caddyfile.orig`); log `/var/log/caddy/shakedown.log` |
| `sharkattack` | Shakedown's server (SharkAttack), as the user `sharkattack`, on 127.0.0.1:8788 only | binary `/srv/shakedown/bin/sharkattack`; data `/var/lib/sharkattack/shark.db`; env `/etc/sharkattack/env` (root:sharkattack, 640: the sign-in key, made on the droplet, never copied off) |

## Deploys

Only from Shakedown's `tools/deploy-shark.sh` on the Mac (a GitHub job,
started by hand). They log in as `sharkdeploy`, whose one key's one door
(`/usr/local/bin/sharkdeploy-gate`) allows: rsync into `/srv/shakedown`
(`page/`, `bin/`), `restart` (its one sudo line: `systemctl restart
sharkattack`) and `health`. No shell, no other folder, no other sudo.

## By hand (Jason, with sudo)

- Restart: `sudo systemctl restart sharkattack` (or `caddy`); status and
  log: `systemctl status sharkattack`, `journalctl -u sharkattack -e`.
- A login for Shakedown: `sudo -u sharkattack
  DATABASE_PATH=/var/lib/sharkattack/shark.db
  /srv/shakedown/bin/sharkattack adduser <name>` (asks the password, typed
  there; never in a file).
- Setting it up again: Shakedown's `server/deploy/qdeco-setup.sh`, safe to
  run twice; it keeps the env file's key.

## Backups

- **Shakedown's data:** `tools/backup-db.sh` on the Mac, through
  SharkAttack's backup route, into `~/Projects/SharkAttack-Backups/` (the
  newest 30); after the cutover, every deploy runs it first.
- **The whole droplet:** DigitalOcean's weekly backups.
