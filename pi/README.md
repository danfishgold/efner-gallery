# Setting up the service on a pi

1. copy the service to /lib/systemd/system/gallery.service
2. `sudo systemctl daemon-reload` to make it recognize the service
3. `sudo systemctl enable gallery.service` to make it work on startup
4. `sudo reboot` to reboot

## Debugging

- `sudo systemctl start gallery.service` to start it right now (instead of on startup)
- `sudo systemctl status gallery.service` to check if it's alive or not
- `sudo systemctl stop gallery.service` to kill it
- `sudo journalctl -ex` to see a log of all services. `e` goes to the end of the log. `x` includes more explanations.
