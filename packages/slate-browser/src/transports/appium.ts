import {
  type BrowserMobileDescriptor,
  type BrowserMobileTarget,
  resolveBrowserMobileSurface,
} from './contracts'

export const ANDROID_SDK_ROOT_DEFAULT =
  '/opt/homebrew/Caskroom/android-platform-tools/37.0.0'
export const APPIUM_ANDROID_EMULATOR_DEFAULT = 'emulator-5554'
export const APPIUM_IOS_DEVICE_DEFAULT = 'iPhone 17 Pro'

export const createAppiumAndroidDescriptor = (
  target: BrowserMobileTarget,
  scenario: BrowserMobileDescriptor['scenario']
): BrowserMobileDescriptor => {
  const surface = resolveBrowserMobileSurface(target.example)

  return {
    ...target,
    ...surface,
    hostReadyUrl: `http://localhost:${target.port}/examples/${target.example}${
      target.debugQuery ? `?${target.debugQuery}` : ''
    }`,
    scenario,
    transport: 'appium-android',
    url: `http://10.0.2.2:${target.port}/examples/${target.example}${
      target.debugQuery ? `?${target.debugQuery}` : ''
    }`,
  }
}

export const createAppiumSessionPayload = (udid: string) => ({
  capabilities: {
    alwaysMatch: {
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': udid,
      'appium:newCommandTimeout': 60,
      'appium:udid': udid,
      browserName: 'Chrome',
      platformName: 'Android',
    },
    firstMatch: [{}],
  },
})

export const createAppiumIosDescriptor = (
  target: BrowserMobileTarget,
  scenario: BrowserMobileDescriptor['scenario']
): BrowserMobileDescriptor => {
  const surface = resolveBrowserMobileSurface(target.example)

  return {
    ...target,
    ...surface,
    hostReadyUrl: `http://localhost:${target.port}/examples/${target.example}${
      target.debugQuery ? `?${target.debugQuery}` : ''
    }`,
    scenario,
    transport: 'appium-ios',
    url: `http://localhost:${target.port}/examples/${target.example}${
      target.debugQuery ? `?${target.debugQuery}` : ''
    }`,
  }
}

export const createAppiumIosSessionPayload = ({
  deviceName,
  udid,
}: {
  deviceName: string
  udid?: string
}) => ({
  capabilities: {
    alwaysMatch: {
      'appium:automationName': 'XCUITest',
      'appium:deviceName': deviceName,
      'appium:newCommandTimeout': 60,
      'appium:noReset': true,
      ...(udid ? { 'appium:udid': udid } : {}),
      browserName: 'Safari',
      platformName: 'iOS',
    },
    firstMatch: [{}],
  },
})
