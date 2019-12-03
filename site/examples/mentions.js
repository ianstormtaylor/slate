import ReactDOM from 'react-dom'
import React, { useMemo, useRef, useEffect, useState } from 'react'
import { Slate, Editable, withReact, useSlate, ReactEditor } from 'slate-react'
import { Editor, createEditor, Node, Range, Path } from 'slate'
import { css } from 'emotion'
import { withHistory } from 'slate-history'

import { Menu, Portal } from '../components'

// --- GENERIC SUGGESTIONS LIST ---

const menuStyles = css`
  padding: 8px 7px 6px;
  position: absolute;
  z-index: 1;
  margin-top: -6px;
  background-color: #fff;
  border: 1px solid #999;
  border-radius: 4px;
`

const mentionStyles = css`
  background-color: lightblue;
  padding: 0px 6px;
  border-radius: 100px;
`

// SuggestionsList will set onKeyDown in these global callbacks when it's open,
// and remove them when it's closed.

const suggestionCallbacks = {}

// This needs to be called from the Editable's onKeyDown event

const handleSuggestionsKeys = event => {
  if (suggestionCallbacks.onKeyDown) suggestionCallbacks.onKeyDown(event)
}

// A generic list for displaying suggestions and intercepting the arrow keys

const SuggestionsList = ({ suggestions, addSuggestion, position }) => {
  const [escaped, setEscaped] = useState(false)
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0)

  useEffect(() => {
    const escape = () => {
      setEscaped(true)
      suggestionCallbacks.onKeyDown = undefined
    }

    const commitSelection = () => {
      addSuggestion(suggestions[focusedOptionIndex])
    }

    const onKeyDown = event => {
      switch (event.key) {
        case 'Down':
        case 'ArrowDown': {
          event.preventDefault()
          const newIndex = focusedOptionIndex + 1
          setFocusedOptionIndex(newIndex >= suggestions.length ? 0 : newIndex)
          break
        }

        case 'Up':
        case 'ArrowUp': {
          event.preventDefault()
          const newIndex = focusedOptionIndex - 1
          setFocusedOptionIndex(
            newIndex < 0 ? suggestions.length - 1 : newIndex
          )
          break
        }

        case 'Tab':
        case 'Enter':
          event.preventDefault()
          commitSelection()
          break

        case 'Esc':
        case 'Escape': {
          event.preventDefault()
          escape()
          break
        }
      }
    }

    suggestionCallbacks.onKeyDown = onKeyDown

    return () => {
      suggestionCallbacks.onKeyDown = undefined
    }
  }, [suggestions, focusedOptionIndex])

  useEffect(() => {
    const size = suggestions.length
    if (size > 0 && focusedOptionIndex >= size) {
      setFocusedOptionIndex(size - 1)
    }
  }, [suggestions])

  const onSelect = (e, suggestion) => {
    e.preventDefault()
    addSuggestion(suggestion)
  }

  if (escaped) return null
  if (suggestions.length === 0) return null

  return (
    <Menu contentEditable={false} className={menuStyles} style={position}>
      <ol style={{ listStyle: 'none', margin: '0', padding: '5px' }}>
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            onMouseDown={e => onSelect(e, suggestion)}
            style={{
              padding: '10px',
              borderRadius: '5px',
              background:
                index === focusedOptionIndex ? 'lightblue' : 'transparent',
            }}
          >
            {suggestion}
          </li>
        ))}
      </ol>
    </Menu>
  )
}

// `useSuggestion` searches for a trigger, and returns search the current search value,
// the position of the trigger (to pass to SuggestionLists) and the range (so that you
// can replace it in your insert code)

const useSuggestions = ({ trigger }) => {
  const editor = useSlate()

  const { selection } = editor
  if (!selection || !Range.isCollapsed(selection)) return []
  const { anchor } = selection
  const { path, offset } = anchor

  // Check if we're at the trigger
  const currentText = Node.get(editor, path).text
  const previousText = currentText.substr(0, offset)
  const startIndex = Math.max(previousText.lastIndexOf(' ') + 1, 0)
  const lastWord = previousText.substr(startIndex)

  if (!lastWord.startsWith(trigger)) return []

  const searchValue = lastWord.substr(1)

  // Calculate portal position
  const triggerAnchor = { ...anchor, offset: anchor.offset - lastWord.length }
  const triggerDomRange = ReactEditor.toDOMRange(editor, {
    anchor: triggerAnchor,
    focus: triggerAnchor,
  })
  const rect = triggerDomRange.getBoundingClientRect()

  const position = {
    top: `${rect.top + window.pageYOffset + 10}px`,
    left: `${rect.left + window.pageXOffset - 10 - rect.width}px`,
  }

  const range = {
    anchor,
    focus: triggerAnchor,
  }

  return [searchValue, range, position]
}

// --- MENTIONS ---

// The mention portal that pops up when there's an active trigger. It's responsible
// for performing the search based on the current value, providing a function to add
// the selected suggestion to the editor, and displaying the generic SuggestionsList.

export const MentionsPortal = () => {
  const editor = useSlate()
  const [searchValue, range, position] = useSuggestions({ trigger: '@' })

  if (searchValue === undefined) return null

  const addSuggestion = user => {
    Editor.select(editor, range)
    editor.exec({ type: 'insert_mention', user })
  }

  const value = searchValue.toLowerCase()
  const filteredSuggestions = USERS.filter(
    mentionable => value === '' || mentionable.toLowerCase().indexOf(value) > -1
  )
  const length = filteredSuggestions.length < 5 ? filteredSuggestions.length : 5
  const suggestions = filteredSuggestions.slice(0, length)

  return (
    <Portal>
      <SuggestionsList
        position={position}
        suggestions={suggestions}
        addSuggestion={addSuggestion}
      />
    </Portal>
  )
}

const withMentions = editor => {
  const { exec, isInline, isVoid } = editor

  editor.isInline = element =>
    element.type === 'mention' ? true : isInline(element)

  editor.isVoid = element =>
    element.type === 'mention' ? true : isVoid(element)

  editor.exec = command => {
    if (command.type === 'insert_mention') {
      const { user } = command
      Editor.insertFragment(editor, [
        {
          type: 'mention',
          mention: { text: `@${user}` },
          children: [{ text: '', marks: [] }],
        },
        { text: ' ', marks: [] },
      ])
    }

    exec(command)
  }

  return editor
}

// --- EXAMPLE EDITOR ---

const MentionExample = () => {
  const editor = useMemo(
    () => withHistory(withMentions(withReact(createEditor()))),
    []
  )

  const renderElement = ({ attributes, element, children }) => {
    if (element.type === 'mention') {
      const { mention } = element
      return (
        <span {...attributes} className={mentionStyles}>
          {mention.text}
          {children}
        </span>
      )
    }

    return <div {...attributes}>{children}</div>
  }

  return (
    <Slate editor={editor} defaultValue={initialValue}>
      <MentionsPortal />
      <Editable
        placeholder="Enter some text..."
        onKeyDown={handleSuggestionsKeys}
        renderElement={renderElement}
      />
    </Slate>
  )
}

const initialValue = [
  {
    children: [
      {
        text: 'This example shows how you can mention keywords using @ sign.',
        marks: [],
      },
    ],
  },
  {
    children: [
      {
        text:
          'Try it out yourself! Just type @ directly followed by a word (for example "a").',
        marks: [],
      },
    ],
  },
  {
    children: [
      {
        text:
          'Try also to place the cursor after an existing @ sign, or pressing the Escape key to dismiss the dropdown.',
        marks: [],
      },
    ],
  },
]

const USERS = [
  '2-1B',
  '4-LOM',
  '8D8',
  '99',
  '0-0-0',
  "A'Koba",
  'Admiral Gial Ackbar',
  'Sim Aloo',
  'Almec',
  'Mas Amedda',
  'Amee',
  'Padmé Amidala',
  'Cassian Andor',
  'Fodesinbeed Annodue',
  'Raymus Antilles',
  'Wedge Antilles',
  'AP-5',
  'Queen Apailana',
  'Doctor Aphra',
  'Faro Argyus',
  'Aiolin and Morit Astarte',
  'Ello Asty',
  'AZI-3',
  'Walrus Man',
  'Kitster Banai',
  'Cad Bane',
  'Darth Bane',
  'Barada',
  'Jom Barell',
  'Moradmin Bast',
  'BB-8',
  'BB-9E',
  'Tobias Beckett',
  'Val Beckett',
  'The Bendu',
  'Shara Bey',
  'Sio Bibble',
  'Depa Billaba',
  'Jar Jar Binks',
  'Temiri Blagg',
  'Commander Bly',
  'Bobbajo',
  'Dud Bolt',
  'Mister Bones',
  'Lux Bonteri',
  'Mina Bonteri',
  'Borvo the Hutt',
  'Bossk',
  'Ezra Bridger',
  'BT-1',
  'Sora Bulq',
  'C1-10P',
  'C-3PO',
  'Lando Calrissian',
  'Moden Canady',
  'Ransolm Casterfo',
  'Chewbacca',
  'Chief Chirpa',
  'Rush Clovis',
  'Commander Cody (CC-2224)',
  'Lieutenant Kaydel Ko Connix',
  'Jeremoch Colton',
  'Cordé',
  'Salacious B. Crumb',
  'Arvel Crynyd',
  'Dr. Cylo',
  "Larma D'Acy",
  "Figrin D'an",
  'Kes Dameron',
  'Poe Dameron',
  'Vober Dand',
  'Joclad Danva',
  'Dapp',
  'Biggs Darklighter',
  'Oro Dassyne',
  'Gizor Dellso',
  'Dengar',
  'Bren Derlin',
  'Ima-Gun Di',
  'Rinnriyin Di',
  'DJ',
  'Lott Dod',
  'Jan Dodonna',
  'Daultay Dofine',
  'Dogma',
  'Darth Tyranus',
  'Dormé',
  'Cin Drallig',
  'Garven Dreis',
  'Droidbait',
  'Rio Durant',
  'Lok Durd',
  'Eirtaé',
  'Dineé Ellberger',
  'Ellé',
  'Caluan Ematt',
  'Embo',
  "Emperor's Royal Guard",
  'Jas Emari',
  'Ebe E. Endocott',
  'Galen Erso',
  'Jyn Erso',
  'Lyra Erso',
  'EV-9D9',
  'Moralo Eval',
  'Doctor Evazan',
  'Onaconda Farr',
  'Boba Fett',
  'Jango Fett',
  'Feral',
  'Commander Fil (CC-3714)',
  'Finn',
  'Kit Fisto',
  'Fives',
  'FN-1824',
  'FN-2003',
  'Nines',
  'Bib Fortuna',
  'Commander Fox',
  'FX-7',
  'GA-97',
  'Adi Gallia',
  'Gardulla the Hutt',
  "Yarna d'al' Gargan",
  'Gonk droid',
  'Commander Gree',
  'Greedo',
  'Janus Greejatus',
  'Captain Gregor',
  'Grievous',
  'Grummgar',
  'Gungi',
  'Nute Gunray',
  'Mars Guo',
  'Rune Haako',
  'Rako Hardeen',
  'Gideon Hask',
  'Hevy',
  'San Hill',
  'Clegg Holdfast',
  'Vice Admiral Amilyn Holdo',
  'Tey How',
  'Huyang',
  'Armitage Hux',
  'Brendol Hux',
  'IG-88',
  'Chirrut Îmwe',
  'Inquisitors',
  'Grand Inquisitor',
  'Fifth Brother',
  'Sixth Brother',
  'Seventh Sister',
  'Eighth Brother',
  'Sidon Ithano',
  'Jabba',
  'Queen Jamillia',
  'Wes Janson',
  'Kanan Jarrus',
  'Jaxxon',
  'Greeata Jendowanian',
  'Tiaan Jerjerrod',
  'Commander Jet',
  'Dexter Jettster',
  'Qui-Gon Jinn',
  'Jira',
  'Jubnuk',
  'K-2SO',
  'Tee Watt Kaa',
  'Agent Kallus',
  'Harter Kalonia',
  'Maz Kanata',
  'Colonel Kaplan',
  'Karbin',
  'Karina the Great',
  'Alton Kastle',
  'King Katuunko',
  'Coleman Kcaj',
  'Obi-Wan Kenobi',
  'Ki-Adi-Mundi',
  'Klaatu',
  'Klik-Klak',
  'Derek Klivian',
  'Agen Kolar',
  'Plo Koon',
  'Eeth Koth',
  'Sergeant Kreel',
  'Pong Krell',
  'Black Krrsantan',
  'Bo-Katan Kryze',
  'Satine Kryze',
  'Conder Kyl',
  'Thane Kyrell',
  'L3-37',
  "L'ulo",
  'Beru Lars',
  'Cliegg Lars',
  'Owen Lars',
  'Cut Lawquane',
  'Tasu Leech',
  'Xamuel Lennox',
  'Tallissan Lintra',
  'Slowen Lo',
  'Lobot',
  'Logray',
  'Lumat',
  'Crix Madine',
  'Shu Mai',
  'Malakili',
  'Baze Malbus',
  'Mama the Hutt',
  'Ody Mandrell',
  'Darth Maul',
  'Saelt-Marae',
  'Mawhonic',
  'Droopy McCool',
  'Pharl McQuarrie',
  'ME-8D9',
  'Lyn Me',
  'Tion Medon',
  'Del Meeko',
  'Aks Moe',
  'Sly Moore',
  'Morley',
  'Delian Mors',
  'Mon Mothma',
  'Conan Antonio Motti',
  'Jobal Naberrie',
  'Pooja Naberrie',
  'Ruwee Naberrie',
  'Ryoo Naberrie',
  'Sola Naberrie',
  'Hammerhead',
  'Boss Nass',
  'Lorth Needa',
  'Queen Neeyutnee',
  'Enfys Nest',
  'Bazine Netal',
  'Niima the Hutt',
  'Jocasta Nu',
  'Po Nudo',
  'Nien Nunb',
  'Has Obbit',
  'Barriss Offee',
  'Hondo Ohnaka',
  'Ric Olié',
  'Omi',
  'Ketsu Onyo',
  'Oola',
  'OOM-9',
  'Savage Opress',
  'Senator Organa',
  'Breha Antilles-Organa',
  'Leia Organa',
  'Garazeb "Zeb" Orrelios',
  'Orrimarko',
  'Admiral Ozzel',
  'Odd Ball',
  'Pablo-Jill',
  'Teemto Pagalies',
  'Captain Quarsh Panaka',
  'Casca Panzoro',
  'Reeve Panzoro',
  'Baron Papanoida',
  'Che Amanwe Papanoida',
  'Chi Eekway Papanoida',
  'Paploo',
  'Captain Phasma',
  'Even Piell',
  'Admiral Firmus Piett',
  'Sarco Plank',
  'Unkar Plutt',
  'Poggle the Lesser',
  'Yarael Poof',
  'Jek Tono Porkins',
  'Nahdonnis Praji',
  'PZ-4CO',
  'Ben Quadinaros',
  "Qi'ra",
  'Quarrie',
  'Quiggold',
  'Artoo',
  'R2-KT',
  'R3-S6',
  'R4-P17',
  'R5-D4',
  'RA-7',
  'Rabé',
  'Admiral Raddus',
  'Dak Ralter',
  'Oppo Rancisis',
  'Admiral Dodd Rancit',
  'Rappertunie',
  'Siniir Rath Velus',
  'Gallius Rax',
  'Eneb Ray',
  'Max Rebo',
  'Ciena Ree',
  'Ree-Yees',
  'Kylo Ren',
  'Captain Rex',
  'Rey',
  'Carlist Rieekan',
  'Riley',
  'Rogue Squadron',
  'Romba',
  'Bodhi Rook',
  'Pagetti Rook',
  'Rotta the Hutt',
  'Rukh',
  'Sabé',
  'Saché',
  'Sarkli',
  'Admiral U.O. Statura',
  'Joph Seastriker',
  'Miraj Scintel',
  'Admiral Terrinald Screed',
  'Sebulba',
  'Aayla Secura',
  'Korr Sella',
  'Zev Senesca',
  'Echuu Shen-Jon',
  'Sifo-Dyas',
  'Aurra Sing',
  'Luke Skywalker',
  'Shmi Skywalker',
  'The Smuggler',
  'Snaggletooth',
  'Snoke',
  'Sy Snootles',
  'Osi Sobeck',
  'Han Solo',
  'Greer Sonnel',
  'Sana Starros',
  'Lama Su',
  'Mercurial Swift',
  'Gavyn Sykes',
  'Cham Syndulla',
  'Hera Syndulla',
  'Jacen Syndulla',
  'Orn Free Taa',
  'Cassio Tagge',
  'Mother Talzin',
  'Wat Tambor',
  'Riff Tamson',
  'Fulcrum',
  'Tarfful',
  'Jova Tarkin',
  'Wilhuff Tarkin',
  'Roos Tarpals',
  'TC-14',
  'Berch Teller',
  'Teebo',
  'Teedo',
  'Mod Terrik',
  'Tessek',
  'Lor San Tekka',
  'Petty Officer Thanisson',
  'Inspector Thanoth',
  'Lieutenant Thire',
  'Thrawn',
  "C'ai Threnalli",
  'Shaak Ti',
  'Paige Tico',
  'Rose Tico',
  'Saesee Tiin',
  'Bala-Tik',
  'Meena Tills',
  'Quay Tolsite',
  'Bargwill Tomder',
  'Wag Too',
  'Coleman Trebor',
  'Admiral Trench',
  'Strono Tuggs',
  'Tup',
  'Letta Turmond',
  'Longo Two-Guns',
  'Cpatain Typho',
  'Ratts Tyerell',
  'U9-C4',
  'Luminara Unduli',
  'Finis Valorum',
  'Eli Vanto',
  'Nahdar Vebb',
  'Maximilian Veers',
  'Asajj Ventress',
  'Evaan Verlaine',
  'Garrick Versio',
  'Iden Versio',
  'Lanever Villecham',
  'Nuvo Vindi',
  'Tulon Voidgazer',
  'Dryden Vos',
  'Quinlan Vos',
  'WAC-47',
  'Wald',
  'Warok',
  'Wicket W. Warrick',
  'Watto',
  'Taun We',
  'Zam Wesell',
  'Norra Wexley',
  'Snap Wexley',
  'Vanden Willard',
  'Mace Windu',
  'Commander Wolffe',
  'Wollivan',
  'Sabine Wren',
  'Wuher',
  'Yaddle',
  'Yoda',
  'Joh Yowza',
  'Wullf Yularen',
  'Ziro the Hutt',
  'Zuckuss',
  'Constable Zuvio',
]

export default MentionExample
