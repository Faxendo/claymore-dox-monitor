# claymore-dox-monitor
Monitoring tool for Claymore Dual Miner. Work in progress !

## Requirements

Even if you can modify a bit of code to use this tool on your own monitor interface, it has been coded mainly to be used with DoxMinerMonitor.
In this case, you'll need :
- Claymore Dual Miner <https://github.com/nanopool/Claymore-Dual-Miner/releases>
- An account on DoxMinerMonitor
- Node.JS <https://nodejs.org>

## Installation

1. `git clone https://github.com/Faxendo/claymore-dox-monitor`
2. `npm install`
3. Copy `config.example.json` to `config.json` and edit with your informations
4. Run your miner
5. Run monitoring tool with `npm start`

## Configuration

- `name` = The name of your Rig
- `apiKey` = The API Key of your Rig
- `claymore` = IP address and port of the Claymore instance you want to monitor

## Restart and reboot capability

Claymore Dual Miner comes with a *restart* function and a *reboot* function on its remote management system, but these are **disabled by default** !
If you want to restart/reboot your rig through DMM, you need to put the following argument on your Claymore start command `-mport <PORT>` *(where <PORT> is any available port, 3333 by default)*

Also notice that Claymore's **reboot** function needs a `reboot.bat` (or `reboot.sh` on Linux) file on its folder, which specifies the system reboot command (`shutdown -r -t 0` on Windows, `sudo reboot` on Linux). Without this file, the **reboot** function will fail.