# iOS Development Guide

## Overview

To work on Slate with iOS, we recommend using a software program on the Mac by Apple called Simulator. Simulator allows you to emulate different iOS devices and different versions of iOS on a Mac.

We do not currently have instructions on developing for iOS using Windows or Linux.

## Outline of Steps

* Installation
  * Install Xcode
* Development
  * Open Simulator
  * IMPORTANT! Disconnect Hardware Keyboard in Simulator
  * Open Safari
  * Enter Debug for Simulator

## Installation

### Install Xcode

Simulator is part of Xcode so you will need to install Xcode to get access to Simulator.

If you don't have Xcode installed already, install it now by following these instruction.

* From your Mac, open the **App Store**. One way to do this is to type `CMD+SPACE` to open Spotlight then type `app store`. 
* From the **App Store** window, type `xcode` in the search box near the top of the window.
* In the search results, you will see **Xcode**. Next to **Xcode**, there is a button that says **GET**. Click the button. Do not click the drop-down arrow.
* The word **GET** will change to **INSTALL APP**. Click this button.
* You will need to enter your **Apple ID** and **Password** to continue with the installation.
* The button will read **INSTALLING** during the installation process.

![App Store with search results for &quot;xcode&quot; \(Xcode already installed here\)](../.gitbook/assets/image%20%282%29.png)

## Development

### Open Simulator

### Start a Device in Simulator

To start a Device:

* Click the **Hardware** menu
* Select the **Device** sub-menu
* Select the iOS version you wish to start \(try iOS 11.2 to start\)
* Select the specific device \(try iPhone 8 to start\)

![Opening a device in Simulator](../.gitbook/assets/image%20%281%29.png)

After starting the device, you will see a working simulation of the device on the screen.

![Simulator running iOS 11.2 on an iPhone 8](../.gitbook/assets/image%20%286%29.png)

Open the Safari app on the device by clicking the Safari icon \(it's the blue circle that looks like a compass in the lower left of the screen\).

Once Safari is open, enter the URL you wish to work on. For now, try entering `slatejs.org` to visite the Slate Examples page on the Internet.

![slatejs.org on Safari for iOS](../.gitbook/assets/image.png)

### IMPORTANT! Disconnect Hardware Keyboard

In order to test iOS with Slate, you must disconnect the hardware keyboard.

> If you do not do this, the virtual keyboard that usually appears on iOS when you are editing will not appear. iOS will behave as if a hardware keyboard has been attached to the device.
>
> It is important to display the virtual keyboard because some important bugs and edge cases do not present themselves when a hardware keyboard is attached.

To disconnect the hardware keyboard in Simulator

* Open the **Hardware** menu
* Select **Keyboard** from the sub-menu
* Make sure **Connect Hardware Keyboard** is unchecked
* If it is checked \(like in the screenshot below\) then click it to toggle it off.
* If it is already unchecked, then exit the menu.

![](../.gitbook/assets/image%20%283%29.png)

You can confirm that you have successfully disconnected the hardware keyboard by clicking in the editor from the SlateJS Examples site at http://slatejs.org. You should see the virtual keyboard appear as in the screenshot below.

![iOS Virtual Keyboard confirms hardware keyboard is disconnected](../.gitbook/assets/image%20%285%29.png)

