import AppKit
import ApplicationServices
import Carbon
import Foundation

let letterCodes: [Character: CGKeyCode] = [
  "a": 0, "s": 1, "d": 2, "f": 3, "h": 4, "g": 5, "z": 6, "x": 7, "c": 8, "v": 9,
  "b": 11, "q": 12, "w": 13, "e": 14, "r": 15, "y": 16, "t": 17, "1": 18, "2": 19,
  "3": 20, "4": 21, "6": 22, "5": 23, "=": 24, "9": 25, "7": 26, "-": 27, "8": 28,
  "0": 29, "]": 30, "o": 31, "u": 32, "[": 33, "i": 34, "p": 35, "l": 37, "j": 38,
  "'": 39, "k": 40, ";": 41, "\\": 42, ",": 43, "/": 44, "n": 45, "m": 46, ".": 47,
  "`": 50, " ": 49,
]

let namedCodes: [String: CGKeyCode] = [
  "return": 36, "tab": 48, "space": 49, "delete": 51, "escape": 53,
  "forwarddelete": 117, "left": 123, "right": 124, "down": 125, "up": 126,
]

let modifierFlags: [String: CGEventFlags] = [
  "cmd": .maskCommand, "shift": .maskShift, "alt": .maskAlternate, "ctrl": .maskControl,
]

func fail(_ message: String) -> Never {
  FileHandle.standardError.write("\(message)\n".data(using: .utf8)!)
  exit(1)
}

func inputSource(_ id: String) -> TISInputSource {
  let filter = [kTISPropertyInputSourceID as String: id] as CFDictionary
  guard
    let sources = TISCreateInputSourceList(filter, true)?.takeRetainedValue()
      as? [TISInputSource],
    let source = sources.first
  else { fail("unknown input source \(id)") }
  return source
}

func currentSourceID() -> String {
  let source = TISCopyCurrentKeyboardInputSource().takeRetainedValue()
  return Unmanaged<CFString>.fromOpaque(
    TISGetInputSourceProperty(source, kTISPropertyInputSourceID)
  ).takeUnretainedValue() as String
}

func select(_ id: String) {
  let source = inputSource(id)
  let parts = id.split(separator: ".")
  for length in stride(from: 4, to: parts.count, by: 1) {
    let parentID = parts.prefix(length).joined(separator: ".")
    let filter = [kTISPropertyInputSourceID as String: parentID] as CFDictionary
    if let parents = TISCreateInputSourceList(filter, true)?.takeRetainedValue()
      as? [TISInputSource]
    {
      parents.forEach { TISEnableInputSource($0) }
    }
  }
  TISEnableInputSource(source)
  let status = TISSelectInputSource(source)
  if status != noErr { fail("could not select \(id): \(status)") }
  for _ in 0..<40 where currentSourceID() != id { usleep(50_000) }
  if currentSourceID() != id { fail("input source is \(currentSourceID()), not \(id)") }
  usleep(400_000)
}

var requiredFrontmostPID: pid_t?
var targetPID: pid_t?

func requireFrontmost() {
  if targetPID != nil { return }
  guard let pid = requiredFrontmostPID else { return }
  let frontmost = NSWorkspace.shared.frontmostApplication
  if frontmost?.processIdentifier != pid {
    fail("frontmost app is \(frontmost?.localizedName ?? "none"), not pid \(pid); no key sent")
  }
}

func press(_ code: CGKeyCode, flags: CGEventFlags = [], delay: useconds_t) {
  requireFrontmost()
  let source = CGEventSource(stateID: .hidSystemState)
  for down in [true, false] {
    guard let event = CGEvent(keyboardEventSource: source, virtualKey: code, keyDown: down)
    else { fail("could not create key event") }
    event.flags = flags
    if let pid = targetPID { event.postToPid(pid) } else { event.post(tap: .cghidEventTap) }
    usleep(delay / 2)
  }
}

func parseChord(_ chord: String) -> (CGKeyCode, CGEventFlags) {
  var parts = chord.lowercased().split(separator: "+").map(String.init)
  let keyName = parts.removeLast()
  var flags: CGEventFlags = []
  for part in parts {
    guard let flag = modifierFlags[part] else { fail("unknown modifier \(part)") }
    flags.insert(flag)
  }
  if let code = namedCodes[keyName] { return (code, flags) }
  if keyName.count == 1, let code = letterCodes[Character(keyName)] { return (code, flags) }
  fail("unknown key \(keyName)")
}

var arguments = Array(CommandLine.arguments.dropFirst())
var delay: useconds_t = 60_000
if let index = arguments.firstIndex(of: "--delay"), index + 1 < arguments.count {
  delay = useconds_t(arguments[index + 1])! * 1000
  arguments.removeSubrange(index...index + 1)
}
if let index = arguments.firstIndex(of: "--to-pid"), index + 1 < arguments.count {
  targetPID = pid_t(arguments[index + 1])!
  arguments.removeSubrange(index...index + 1)
}
if let index = arguments.firstIndex(of: "--pid"), index + 1 < arguments.count {
  requiredFrontmostPID = pid_t(arguments[index + 1])!
  arguments.removeSubrange(index...index + 1)
}
guard let command = arguments.first else {
  fail("usage: ime-key current | select <id> | type <text> | key <chord> [count]")
}

switch command {
case "current":
  print(currentSourceID())
case "activate":
  guard let pid = requiredFrontmostPID,
    let app = NSRunningApplication(processIdentifier: pid)
  else { fail("activate needs --pid of a running app") }
  app.activate()
  for _ in 0..<40 where NSWorkspace.shared.frontmostApplication?.processIdentifier != pid {
    usleep(50_000)
  }
  requireFrontmost()
case "click":
  guard arguments.count == 3, let x = Double(arguments[1]), let y = Double(arguments[2])
  else { fail("click needs x and y in screen points") }
  requireFrontmost()
  let point = CGPoint(x: x, y: y)
  let source = CGEventSource(stateID: .hidSystemState)
  for type in [CGEventType.leftMouseDown, .leftMouseUp] {
    CGEvent(mouseEventSource: source, mouseType: type, mouseCursorPosition: point, mouseButton: .left)?
      .post(tap: .cghidEventTap)
    usleep(delay / 2)
  }
case "trusted":
  print(AXIsProcessTrusted())
case "select":
  guard arguments.count == 2 else { fail("select needs an input source id") }
  select(arguments[1])
case "type":
  guard arguments.count == 2 else { fail("type needs text") }
  for character in arguments[1] {
    let lower = Character(character.lowercased())
    guard let code = letterCodes[lower] else { fail("no key for \(character)") }
    press(code, flags: character.isUppercase ? .maskShift : [], delay: delay)
  }
case "key":
  guard arguments.count >= 2 else { fail("key needs a chord") }
  let (code, flags) = parseChord(arguments[1])
  let count = arguments.count > 2 ? Int(arguments[2])! : 1
  for _ in 0..<count { press(code, flags: flags, delay: delay) }
default:
  fail("unknown command \(command)")
}
