# Android Development Guide

## Supported Browser Targets

The goal is to have full coverage against all modern Android versions against all devices; however, we select a reasonable subset which we believe will have a high likelihood of full interoperability across modern devices.

The following Android versions are targeted.

*   Android 6.0
*   Android 7.1

## Development Setup Overview

To work on Slate with Android, we recommend using the official integrated develpment environment for Google's Android operating system which is available on Windows, Mac and Linux.

## Installation

### Warning: State of Android Studio

At time of writing, Android Studio does not _just work_ out of the box like a typical application. Expect to go through a process which can be difficult if you've never used Android Studio before; however, with this development guide you should be able to get through this process as quickly as possible.

### Download and Install Android Studio

Download and install Android Studio from here:

[Android Studio Download](https://developer.android.com/studio/index.html)

Start downloading Android Studio by clicking the installation button on the web page. This is the button for a Mac. Your button may look slightly different.

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-L8JXHs8PXJ0eKaHRdu5%2F-L8Zh9yTQ9CrlhuOV_Uj%2F-L8ZkfIszoO_FIBkudRs%2FScreen%20Shot%202018-03-26%20at%205.01.15%20PM.png?alt=media&token=959afbdb-2475-4ee6-b1a8-683d87057e64)

After clicking you will be redirected to an instruction page on how to **Install Android Studio**. Follow the process but:

**IMPORTANT!** During the installation process, do a custom install instead of the default installation.

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-L8JXHs8PXJ0eKaHRdu5%2F-L8ZnNJfpscAPw2JGQnQ%2F-L8ZuOVNmYGJZTYTYSOT%2FScreen%20Shot%202018-03-26%20at%205.42.30%20PM.png?alt=media&token=c073d6bf-5bf3-4c98-837a-646c8efedd71)

Select "Custom" when choosing the "Install Type"

After selecting **Install Type** you will be asked to **Select UI Theme**. Choose the one you prefer.

Next, at the SDK Components Setup, make sure to select **Android Virtual Device**. Also **Performance (Intel HAXM)** should be selected already but if not, make sure to select it.

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-L8JXHs8PXJ0eKaHRdu5%2F-L8ZnNJfpscAPw2JGQnQ%2F-L8Zuzr-OCBhoBqO9Cqt%2FScreen%20Shot%202018-03-26%20at%205.46.18%20PM.png?alt=media&token=2d0211f0-99c2-41d1-b9a4-c8d80190fef5)

Make sure everything is checked here

Complete the rest of the installation process. There are no other special changes required.

It may take some time to complete the installation process.

During the installation process, you may get a request for security credentials. This is normal.

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-L8JXHs8PXJ0eKaHRdu5%2F-L8Zvkyw0GoGa1miE-OZ%2F-L8ZxBatICJ7zYoed8Yq%2FScreen%20Shot%202018-03-26%20at%205.54.53%20PM.png?alt=media&token=7d27c826-058a-49c2-85c8-f63c4d9c6310)

On a Mac, you may get a warning **System Extension Blocked**

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-L8JXHs8PXJ0eKaHRdu5%2F-L8Zvkyw0GoGa1miE-OZ%2F-L8ZxeK1lHLVMJn9e5Yl%2FScreen%20Shot%202018-03-26%20at%205.55.18%20PM.png?alt=media&token=fbe3669e-d826-42e0-994f-504a7dc58e67)

When you do, click **Open Security Preferences** and in the **Security & Privacy** window that opens up, click the **Allow** buton next to the text **System Software from developer "Intel Corporation Apps" was blocked from loading**.

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-L8JXHs8PXJ0eKaHRdu5%2F-L8Zvkyw0GoGa1miE-OZ%2F-L8ZxkmbWCe22blR9t_J%2FScreen%20Shot%202018-03-26%20at%205.55.28%20PM.png?alt=media&token=fdaec540-dc17-4b84-b6dc-850ba89f1960)

## Setup Android Studio for Emulation

### Start a Project

In order to access the emulator, we are going to setup an Android Studio project and launch the emulator from there. There are other ways that don't require creating an Android Studio project but for now we haven't documented these methods.

After the installation process completes, select **Start a new Android Studio project** from the **Welcome to Android Studio** window.

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-L8JXHs8PXJ0eKaHRdu5%2F-L8Zy98ry9w4qPMIuDGz%2F-L8_-qnb6nQlBpuO1rGo%2FScreen%20Shot%202018-03-26%20at%206.02.46%20PM.png?alt=media&token=591334d0-07bc-4aac-81ba-d8d766deee32)

Select "Start a new Android Studio project"

A Create Android Project window pops up. The information about your project isn't that important. We've used for **Application name** the name `Android Emulator` but you can name it whatever you like. You should enter your own **Company domain**.

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-L8JXHs8PXJ0eKaHRdu5%2F-L8Zy98ry9w4qPMIuDGz%2F-L8_0w1895zz13u6_f8_%2FScreen%20Shot%202018-03-26%20at%206.14.19%20PM.png?alt=media&token=68a20160-11e5-40e8-b2c8-7bdc75043738)

You can complete the rest of the steps using the defaults.

Once you have completed the steps, it will take some time to build the project.

### Configuring and Using Android Virtual Device Manager

Once your project is ready, you should see the project window.

There are two ways to open the Android Virtual Device Manager.

* Click the AVD Manager Icon in the interface (see higlighted item in screenshot below)

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-L8JXHs8PXJ0eKaHRdu5%2F-L8_1s17tZ5BwmKBB5Bn%2F-L8_3nRxU7f-FXWQmflZ%2Fimage.png?alt=media&token=ae7a50b1-9086-4e15-b9e6-e5284d1503f6)

* Or select **Tools** \> **AVD Manager** from the menu

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-L8JXHs8PXJ0eKaHRdu5%2F-L8_1s17tZ5BwmKBB5Bn%2F-L8_4bj-vgEVYOrpepYF%2FScreen%20Shot%202018-03-26%20at%206.32.06%20PM.png?alt=media&token=92f5ca63-3771-4bcf-b8d3-a3d01e510069)

This will launch AVD Manager

By default, there is a virtual device. Click the green triangle pointing right to start the emulator.

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-L8JXHs8PXJ0eKaHRdu5%2F-L8_GuDMrQIBb8eBzDHz%2F-L8_GwdMBE8KS3uZu2_d%2Fimage.png?alt=media&token=8daa3d8a-e9dc-4470-b95a-f12a3dafe71e)

This will launch the emulator. Click the **Chrome** icon to launch the browser.

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-L8JXHs8PXJ0eKaHRdu5%2F-L8_GuDMrQIBb8eBzDHz%2F-L8_HMKM-_QQznU0F_nK%2Fimage.png?alt=media&token=ab5302d4-4131-4661-84da-3b7970997015)

Use the browser to access Slate. For now, try navigating to slatejs.org:

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-L8JXHs8PXJ0eKaHRdu5%2F-L8_GuDMrQIBb8eBzDHz%2F-L8_HvXA3RG35ZOrmqIw%2FScreen%20Shot%202018-03-26%20at%207.30.29%20PM.png?alt=media&token=52ded0b9-50ad-4546-b108-0f68431580a6)

### Adding More Virtual Devices

Click **\+ Create Virtual Device** from Android Virtual Device Manager to add more devices. This includes the ability to select an installed Android version.

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-L8JXHs8PXJ0eKaHRdu5%2F-L8_GuDMrQIBb8eBzDHz%2F-L8_IGcyUp2mUdUYoRki%2Fimage.png?alt=media&token=26e2b6e5-0d02-4f54-b88b-f5f8c86a7d13)

For consistency, we are recommending installing virtual devices for:

*   Nexus 5X with Android 8.1
*   Nexus 5X with Android 7.1.1
*   Nexus 4 with Android 6.0

### Android Virtual Device Manager issues

Inside Android Studio, you are supposed to be able to access **AVD Manager** if it is installed but sometimes it may be missing from the menu and the AVD Manager icon is disabled.

The most common cause for this is that the Intel Hardware Accelerated Execution Manager (HAXM) was not installed properly.

Note: Android Studio **Preferences** may show that **Appearances & Behavior** \> **System Settings** \> **Intel x86 Emulator Accelrator (HAXM installer)** is marked as installed when in fact HAXM is not installed. This setting in ambiguoulsy indicates that the _installer_ is installed, not that HAXM itself is installed.

We recommend installing from the official Intel Download to be sure if you are having this problem:

[https://software.intel.com/en-us/articles/intel-hardware-accelerated-execution-manager-intel-haxm](https://software.intel.com/en-us/articles/intel-hardware-accelerated-execution-manager-intel-haxm)