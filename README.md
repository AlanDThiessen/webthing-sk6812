# webthing-sk6812

A [WebThings](https://webthings.io/) Thing for controlling a strip of SK6812 RGBW LEDs from a Raspberry Pi.

## Pre-Install

This script relies on the rpi-ws281x NPM module, which does not currently support the SK6812.
Until this [pull request](https://github.com/meg768/rpi-ws281x/pull/14) is approved, you will need to manually download [this forked copy of the rpi-ws281x module](https://github.com/AlanDThiessen/rpi-ws281x/tree/sk6812).

Run the following commands from one level above.

```
$ git clone https://github.com/AlanDThiessen/rpi-ws281x.git
$ cd rpi-ws281x
$ git checkout sk6812
```

## Install

```
$ npm install webthing-sk6812
```

## Run

Root/sudo privileges are required to write to PWM GPI line on a Raspberry Pi.

Start the following command on the Raspberry Pi.

```
$ sudo node ./index.js
```

## Control

1. Use the [WebThings Gateway](https://webthings.io/gateway/) to control this device.
2. Ensure the [Web Thing Adapter](https://github.com/WebThingsIO/thing-url-adapter) is installed.
3. On the Things screen, click the `+` button to search and add devices.  It should find the device `SK6812`.

