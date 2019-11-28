import React, { useMemo } from 'react'
import { Editor, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import {
  Slate,
  Editable,
  withReact,
  useSlate,
  useSelected,
  useFocused,
} from 'slate-react'

import { Button, Icon, Toolbar } from '../components'

const MentionExample = () => {
  const editor = useMemo(
    () => withMentions(withReact(withHistory(createEditor()))),
    []
  )

  const promptMention = () => {
    const name = window.prompt('Who would you like to mention?')
    if (!name) return
    const regex = new RegExp(`^${name}`, 'i')
    const match = Object.entries(USERS).find(([, name]) => regex.test(name))
    const id = match ? match[0] : 57
    editor.exec({ type: 'insert_mention', id })
  }

  return (
    <Slate editor={editor} defaultValue={initialValue}>
      <Toolbar>
        <MentionButton />
      </Toolbar>
      <Editable
        renderElement={props => <Element {...props} />}
        placeholder="Enter some text..."
        onKeyDown={event => {
          if (event.key === '@') {
            event.preventDefault()
            promptMention()
          }
        }}
      />
    </Slate>
  )
}

const withMentions = editor => {
  const { exec, isInline, isVoid } = editor

  editor.isInline = element => {
    return element.type === 'mention' ? true : isInline(element)
  }

  editor.isVoid = element => {
    return element.type === 'mention' ? true : isVoid(element)
  }

  editor.exec = command => {
    if (command.type === 'insert_mention') {
      const { id } = command
      const mention = {
        type: 'mention',
        id,
        children: [{ text: '', marks: [] }],
      }
      Editor.insertNodes(editor, mention)
    } else {
      exec(command)
    }
  }

  return editor
}

const isMentionActive = editor => {
  const match = Editor.match(editor, editor.selection, {
    type: 'mention',
  })
  return !!match
}

const Element = props => {
  const { attributes, children, element } = props

  switch (element.type) {
    case 'mention':
      return <MentionElement {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

const MentionElement = ({ attributes, children, element }) => {
  const selected = useSelected()
  const focused = useFocused()
  return (
    <span
      {...attributes}
      contentEditable={false}
      style={{
        padding: '3px 3px 2px',
        margin: '0 1px',
        verticalAlign: 'baseline',
        display: 'inline-block',
        borderRadius: '4px',
        backgroundColor: '#eee',
        fontSize: '0.9em',
        boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
      }}
    >
      @{USERS[element.id]}
      {children}
    </span>
  )
}

const MentionButton = () => {
  const editor = useSlate()
  return (
    <Button
      active={isMentionActive(editor)}
      onMouseDown={event => {
        event.preventDefault()
        promptMention()
      }}
    >
      <Icon>person_pin</Icon>
    </Button>
  )
}

const initialValue = [
  {
    children: [
      {
        text: 'Try mentioning some people, like ',
        marks: [],
      },
      {
        type: 'mention',
        id: 324,
        children: [{ text: '', marks: [] }],
      },
      {
        text: ' or ',
        marks: [],
      },
      {
        type: 'mention',
        id: 253,
        children: [{ text: '', marks: [] }],
      },
      {
        text: '.',
        marks: [],
      },
    ],
  },
]

const USERS = {
  1: '2-1B',
  2: '4-LOM',
  3: '8D8',
  4: '99',
  5: '0-0-0',
  6: "A'Koba",
  7: 'Admiral Gial Ackbar',
  8: 'Sim Aloo',
  9: 'Almec',
  10: 'Mas Amedda',
  11: 'Amee',
  12: 'Padmé Amidala',
  13: 'Cassian Andor',
  14: 'Fodesinbeed Annodue',
  15: 'Raymus Antilles',
  16: 'Wedge Antilles',
  17: 'AP-5',
  18: 'Queen Apailana',
  19: 'Doctor Aphra',
  20: 'Faro Argyus',
  21: 'Aiolin and Morit Astarte',
  22: 'Ello Asty',
  23: 'AZI-3',
  24: 'Walrus Man',
  25: 'Kitster Banai',
  26: 'Cad Bane',
  27: 'Darth Bane',
  28: 'Barada',
  29: 'Jom Barell',
  30: 'Moradmin Bast',
  31: 'BB-8',
  32: 'BB-9E',
  33: 'Tobias Beckett',
  34: 'Val Beckett',
  35: 'The Bendu',
  36: 'Shara Bey',
  37: 'Sio Bibble',
  38: 'Depa Billaba',
  39: 'Jar Jar Binks',
  40: 'Temiri Blagg',
  41: 'Commander Bly',
  42: 'Bobbajo',
  43: 'Dud Bolt',
  44: 'Mister Bones',
  45: 'Lux Bonteri',
  46: 'Mina Bonteri',
  47: 'Borvo the Hutt',
  48: 'Bossk',
  49: 'Ezra Bridger',
  50: 'BT-1',
  51: 'Sora Bulq',
  52: 'C1-10P',
  53: 'C-3PO',
  54: 'Lando Calrissian',
  55: 'Moden Canady',
  56: 'Ransolm Casterfo',
  57: 'Chewbacca',
  58: 'Chief Chirpa',
  59: 'Rush Clovis',
  60: 'Commander Cody (CC-2224)',
  61: 'Lieutenant Kaydel Ko Connix',
  62: 'Jeremoch Colton',
  63: 'Cordé',
  64: 'Salacious B. Crumb',
  65: 'Arvel Crynyd',
  66: 'Dr. Cylo',
  67: "Larma D'Acy",
  68: "Figrin D'an",
  69: 'Kes Dameron',
  70: 'Poe Dameron',
  71: 'Vober Dand',
  72: 'Joclad Danva',
  73: 'Dapp',
  74: 'Biggs Darklighter',
  75: 'Oro Dassyne',
  76: 'Gizor Dellso',
  77: 'Dengar',
  78: 'Bren Derlin',
  79: 'Ima-Gun Di',
  80: 'Rinnriyin Di',
  81: 'DJ',
  82: 'Lott Dod',
  83: 'Jan Dodonna',
  84: 'Daultay Dofine',
  85: 'Dogma',
  86: 'Darth Tyranus',
  87: 'Dormé',
  88: 'Cin Drallig',
  89: 'Garven Dreis',
  90: 'Droidbait',
  91: 'Rio Durant',
  92: 'Lok Durd',
  93: 'Eirtaé',
  94: 'Dineé Ellberger',
  95: 'Ellé',
  96: 'Caluan Ematt',
  97: 'Embo',
  98: "Emperor's Royal Guard",
  99: 'Jas Emari',
  100: 'Ebe E. Endocott',
  101: 'Galen Erso',
  102: 'Jyn Erso',
  103: 'Lyra Erso',
  104: 'EV-9D9',
  105: 'Moralo Eval',
  106: 'Doctor Evazan',
  107: 'Onaconda Farr',
  108: 'Boba Fett',
  109: 'Jango Fett',
  110: 'Feral',
  111: 'Commander Fil (CC-3714)',
  112: 'Finn',
  113: 'Kit Fisto',
  114: 'Fives',
  115: 'FN-1824',
  116: 'FN-2003',
  117: 'Nines',
  118: 'Bib Fortuna',
  119: 'Commander Fox',
  120: 'FX-7',
  121: 'GA-97',
  122: 'Adi Gallia',
  123: 'Gardulla the Hutt',
  124: "Yarna d'al' Gargan",
  125: 'Gonk droid',
  126: 'Commander Gree',
  127: 'Greedo',
  128: 'Janus Greejatus',
  129: 'Captain Gregor',
  130: 'Grievous',
  131: 'Grummgar',
  132: 'Gungi',
  133: 'Nute Gunray',
  134: 'Mars Guo',
  135: 'Rune Haako',
  136: 'Rako Hardeen',
  137: 'Gideon Hask',
  138: 'Hevy',
  139: 'San Hill',
  140: 'Clegg Holdfast',
  141: 'Vice Admiral Amilyn Holdo',
  142: 'Tey How',
  143: 'Huyang',
  144: 'Armitage Hux',
  145: 'Brendol Hux',
  146: 'IG-88',
  147: 'Chirrut Îmwe',
  148: 'Inquisitors',
  149: 'Grand Inquisitor',
  150: 'Fifth Brother',
  151: 'Sixth Brother',
  152: 'Seventh Sister',
  153: 'Eighth Brother',
  154: 'Sidon Ithano',
  155: 'Jabba',
  156: 'Queen Jamillia',
  157: 'Wes Janson',
  158: 'Kanan Jarrus',
  159: 'Jaxxon',
  160: 'Greeata Jendowanian',
  161: 'Tiaan Jerjerrod',
  162: 'Commander Jet',
  163: 'Dexter Jettster',
  164: 'Qui-Gon Jinn',
  165: 'Jira',
  166: 'Jubnuk',
  167: 'K-2SO',
  168: 'Tee Watt Kaa',
  169: 'Agent Kallus',
  170: 'Harter Kalonia',
  171: 'Maz Kanata',
  172: 'Colonel Kaplan',
  173: 'Karbin',
  174: 'Karina the Great',
  175: 'Alton Kastle',
  176: 'King Katuunko',
  177: 'Coleman Kcaj',
  178: 'Obi-Wan Kenobi',
  179: 'Ki-Adi-Mundi',
  180: 'Klaatu',
  181: 'Klik-Klak',
  182: 'Derek Klivian',
  183: 'Agen Kolar',
  184: 'Plo Koon',
  185: 'Eeth Koth',
  186: 'Sergeant Kreel',
  187: 'Pong Krell',
  188: 'Black Krrsantan',
  189: 'Bo-Katan Kryze',
  190: 'Satine Kryze',
  191: 'Conder Kyl',
  192: 'Thane Kyrell',
  193: 'L3-37',
  194: "L'ulo",
  195: 'Beru Lars',
  196: 'Cliegg Lars',
  197: 'Owen Lars',
  198: 'Cut Lawquane',
  199: 'Tasu Leech',
  200: 'Xamuel Lennox',
  201: 'Tallissan Lintra',
  202: 'Slowen Lo',
  203: 'Lobot',
  204: 'Logray',
  205: 'Lumat',
  206: 'Crix Madine',
  207: 'Shu Mai',
  208: 'Malakili',
  209: 'Baze Malbus',
  210: 'Mama the Hutt',
  211: 'Ody Mandrell',
  212: 'Darth Maul',
  213: 'Saelt-Marae',
  214: 'Mawhonic',
  215: 'Droopy McCool',
  216: 'Pharl McQuarrie',
  217: 'ME-8D9',
  218: 'Lyn Me',
  219: 'Tion Medon',
  220: 'Del Meeko',
  221: 'Aks Moe',
  222: 'Sly Moore',
  223: 'Morley',
  224: 'Delian Mors',
  225: 'Mon Mothma',
  226: 'Conan Antonio Motti',
  227: 'Jobal Naberrie',
  228: 'Pooja Naberrie',
  229: 'Ruwee Naberrie',
  230: 'Ryoo Naberrie',
  231: 'Sola Naberrie',
  232: 'Hammerhead',
  233: 'Boss Nass',
  234: 'Lorth Needa',
  235: 'Queen Neeyutnee',
  236: 'Enfys Nest',
  237: 'Bazine Netal',
  238: 'Niima the Hutt',
  239: 'Jocasta Nu',
  240: 'Po Nudo',
  241: 'Nien Nunb',
  242: 'Has Obbit',
  243: 'Barriss Offee',
  244: 'Hondo Ohnaka',
  245: 'Ric Olié',
  246: 'Omi',
  247: 'Ketsu Onyo',
  248: 'Oola',
  249: 'OOM-9',
  250: 'Savage Opress',
  251: 'Senator Organa',
  252: 'Breha Antilles-Organa',
  253: 'Leia Organa',
  254: 'Garazeb "Zeb" Orrelios',
  255: 'Orrimarko',
  256: 'Admiral Ozzel',
  257: 'Odd Ball',
  258: 'Pablo-Jill',
  259: 'Teemto Pagalies',
  260: 'Captain Quarsh Panaka',
  261: 'Casca Panzoro',
  262: 'Reeve Panzoro',
  263: 'Baron Papanoida',
  264: 'Che Amanwe Papanoida',
  265: 'Chi Eekway Papanoida',
  266: 'Paploo',
  267: 'Captain Phasma',
  268: 'Even Piell',
  269: 'Admiral Firmus Piett',
  270: 'Sarco Plank',
  271: 'Unkar Plutt',
  272: 'Poggle the Lesser',
  273: 'Yarael Poof',
  274: 'Jek Tono Porkins',
  275: 'Nahdonnis Praji',
  276: 'PZ-4CO',
  277: 'Ben Quadinaros',
  278: "Qi'ra",
  279: 'Quarrie',
  280: 'Quiggold',
  281: 'Artoo',
  282: 'R2-KT',
  283: 'R3-S6',
  284: 'R4-P17',
  285: 'R5-D4',
  286: 'RA-7',
  287: 'Rabé',
  288: 'Admiral Raddus',
  289: 'Dak Ralter',
  290: 'Oppo Rancisis',
  291: 'Admiral Dodd Rancit',
  292: 'Rappertunie',
  293: 'Siniir Rath Velus',
  294: 'Gallius Rax',
  295: 'Eneb Ray',
  296: 'Max Rebo',
  297: 'Ciena Ree',
  298: 'Ree-Yees',
  299: 'Kylo Ren',
  300: 'Captain Rex',
  301: 'Rey',
  302: 'Carlist Rieekan',
  303: 'Riley',
  304: 'Rogue Squadron',
  305: 'Romba',
  306: 'Bodhi Rook',
  307: 'Pagetti Rook',
  308: 'Rotta the Hutt',
  309: 'Rukh',
  310: 'Sabé',
  311: 'Saché',
  312: 'Sarkli',
  313: 'Admiral U.O. Statura',
  314: 'Joph Seastriker',
  315: 'Miraj Scintel',
  316: 'Admiral Terrinald Screed',
  317: 'Sebulba',
  318: 'Aayla Secura',
  319: 'Korr Sella',
  320: 'Zev Senesca',
  321: 'Echuu Shen-Jon',
  322: 'Sifo-Dyas',
  323: 'Aurra Sing',
  324: 'Luke Skywalker',
  325: 'Shmi Skywalker',
  326: 'The Smuggler',
  327: 'Snaggletooth',
  328: 'Snoke',
  329: 'Sy Snootles',
  330: 'Osi Sobeck',
  331: 'Han Solo',
  332: 'Greer Sonnel',
  333: 'Sana Starros',
  334: 'Lama Su',
  335: 'Mercurial Swift',
  336: 'Gavyn Sykes',
  337: 'Cham Syndulla',
  338: 'Hera Syndulla',
  339: 'Jacen Syndulla',
  340: 'Orn Free Taa',
  341: 'Cassio Tagge',
  342: 'Mother Talzin',
  343: 'Wat Tambor',
  344: 'Riff Tamson',
  345: 'Fulcrum',
  346: 'Tarfful',
  347: 'Jova Tarkin',
  348: 'Wilhuff Tarkin',
  349: 'Roos Tarpals',
  350: 'TC-14',
  351: 'Berch Teller',
  352: 'Teebo',
  353: 'Teedo',
  354: 'Mod Terrik',
  355: 'Tessek',
  356: 'Lor San Tekka',
  357: 'Petty Officer Thanisson',
  358: 'Inspector Thanoth',
  359: 'Lieutenant Thire',
  360: 'Thrawn',
  361: "C'ai Threnalli",
  362: 'Shaak Ti',
  363: 'Paige Tico',
  364: 'Rose Tico',
  365: 'Saesee Tiin',
  366: 'Bala-Tik',
  367: 'Meena Tills',
  368: 'Quay Tolsite',
  369: 'Bargwill Tomder',
  370: 'Wag Too',
  371: 'Coleman Trebor',
  372: 'Admiral Trench',
  373: 'Strono Tuggs',
  374: 'Tup',
  375: 'Letta Turmond',
  376: 'Longo Two-Guns',
  377: 'Cpatain Typho',
  378: 'Ratts Tyerell',
  379: 'U9-C4',
  380: 'Luminara Unduli',
  381: 'Finis Valorum',
  382: 'Eli Vanto',
  383: 'Nahdar Vebb',
  384: 'Maximilian Veers',
  385: 'Asajj Ventress',
  386: 'Evaan Verlaine',
  387: 'Garrick Versio',
  388: 'Iden Versio',
  389: 'Lanever Villecham',
  390: 'Nuvo Vindi',
  391: 'Tulon Voidgazer',
  392: 'Dryden Vos',
  393: 'Quinlan Vos',
  394: 'WAC-47',
  395: 'Wald',
  396: 'Warok',
  397: 'Wicket W. Warrick',
  398: 'Watto',
  399: 'Taun We',
  400: 'Zam Wesell',
  401: 'Norra Wexley',
  402: 'Snap Wexley',
  403: 'Vanden Willard',
  404: 'Mace Windu',
  405: 'Commander Wolffe',
  406: 'Wollivan',
  407: 'Sabine Wren',
  408: 'Wuher',
  409: 'Yaddle',
  410: 'Yoda',
  411: 'Joh Yowza',
  412: 'Wullf Yularen',
  413: 'Ziro the Hutt',
  414: 'Zuckuss',
  415: 'Constable Zuvio',
}

export default MentionExample
