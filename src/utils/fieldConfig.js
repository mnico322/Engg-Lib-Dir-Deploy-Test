// src/utils/fieldConfig.js

export const communityOptions = [
  'College Archives',
  'Faculty Publications',
  'Student Works',
];

export const collectionMap = {
  'College Archives': [
    'Permanent Records',
    'Publications',
    'Personal Collections',
    'Distinguished Alumni Lecture Series (DALS)',
    'Multimedia Files (Activities, events and others)',
  ],
  'Faculty Publications': [
    'Book Chapters',
    'Conference Proceedings/Symposium',
    'Journal Articles',
    'Professional Chair Colloquium Proceedings',
    'Reviews',
    'Technical Project Reports',
  ],
  'Student Works': ['All Student Works'],
};

export const subCollectionMap = {
  'Permanent Records': ['Minutes of the Meetings', 'Reports'],
  'Publications': ['College of Engineering (COE)', 'University of the Philippines (UP)', 'Non-UP/Other Publications'],
  'Personal Collections': ['Deans', 'Faculty', 'Notable Alumni'],
};

export const subSubCollectionMap = {
  'Minutes of the Meetings': [
    'College Executive Board (CEB)',
    'College Academic Personnel Committee (CAPC)',
    'Graduate Faculty Council',
    'Others'
  ],
};

const defaultMaterialOptions = [
  'Yearbooks', 'Directories', 'Course Catalogs', 'Handbooks', 'Conference Proceedings', 'Reports', 'Journals', 'Magazines', 'Newspaper', 'Clippings', 'Newsletter', 'Gazettes'
];

const commonMinutesFields = [
  { name: 'accessCode', label: 'Access Code' },
  { name: 'locationCode', label: 'Location Code' },
  { name: 'boxNo', label: 'Box No.' },
  { name: 'creator', label: 'Creator/Author' },
  { name: 'provenance', label: 'Provenance (Office/Unit/Department)' },
  { name: 'title', label: 'Title' },
  {
    name: 'materialType',
    label: 'Material Type',
    type: 'select',
    options: [
      'College Executive Board (CEB)',
      'College Academic Personnel Committee (CAPC)',
      'Graduate Faculty Council',
      'Others'
    ],
  },
  { name: 'physicalDescription', label: 'Physical Description' },
  { name: 'dateEncoded', label: 'Date Encoded', type: 'date' },
  { name: 'contentDescription', label: 'Content Description' },
];

const publicationFields = [
  { name: 'accessionNumbers', label: 'Accession Number/s' },
  { name: 'callNo', label: 'Call No.' },
  { name: 'boxNo', label: 'Box No.' },
  { name: 'title', label: 'Title' },
  { name: 'author', label: 'Author' },
  { name: 'keywords', label: 'Keywords' },
  { name: 'publisher', label: 'Publisher' },
  { name: 'placeOfPublication', label: 'Place of Publication' },
  { name: 'yearPublished', label: 'Year Published' },
  { name: 'physicalDescription', label: 'Physical Description' },
  { name: 'provenance', label: 'Provenance (Office/Unit/Department)' },
  {
    name: 'materialType',
    label: 'Material Type',
    type: 'select',
    options: defaultMaterialOptions,
  },
  { name: 'dateEncoded', label: 'Date Encoded', type: 'date' },
  { name: 'contentDescription', label: 'Content Description' },
];

export const nestedFieldMap = {
  'College Archives': {
    'Permanent Records': {
      'Minutes of the Meetings': {
        'College Executive Board (CEB)': commonMinutesFields,
        'College Academic Personnel Committee (CAPC)': commonMinutesFields,
        'Graduate Faculty Council': commonMinutesFields,
        'Others': commonMinutesFields
      },
      'Reports': commonMinutesFields
    },
    'Publications': {
      'College of Engineering (COE)': publicationFields,
      'University of the Philippines (UP)': publicationFields,
      'Non-UP/Other Publications': publicationFields
    },
    'Personal Collections': {
      'Deans': [
        { name: 'accessCode', label: 'Access Code' },
        { name: 'locationCode', label: 'Location Code' },
        { name: 'boxNo', label: 'Box No.' },
        { name: 'creator', label: 'Creator/Author' },
        { name: 'contributor', label: 'Contributor (Person/Office/Unit/Department)' },
        { name: 'dateCreated', label: 'Date Created', type: 'date' },
        { name: 'title', label: 'Title' },
        {
          name: 'materialType',
          label: 'Material Type',
          type: 'select',
          options: [
            'Personal Paper', 'Advertisements', 'Posters', 'Broadsides', 'Cards', 'Flyers', 'Brochures',
            'Memorabilia such Photographs, Drawings, Plaque, Pins and other objects associated with memorable people'
          ]
        },
        { name: 'physicalDescription', label: 'Physical Description' },
        { name: 'remarks', label: 'Remarks' },
        { name: 'dateEncoded', label: 'Date Encoded', type: 'date' },
        { name: 'contentDescription', label: 'Content Description' },
      ],
      'Faculty': [],
      'Notable Alumni': []
    },
    'Distinguished Alumni Lecture Series (DALS)': [
      { name: 'title', label: 'Title' },
      { name: 'lecturers', label: 'Lecturer/s' },
      { name: 'keywords', label: 'Keywords' },
      { name: 'organizer', label: 'Organizer' },
      { name: 'remarks', label: 'Remarks' },
      { name: 'format', label: 'Format' },
      { name: 'event', label: 'Event' },
      { name: 'venue', label: 'Venue' },
      { name: 'date', label: 'Date', type: 'date' },
    ],
    'Multimedia Files (Activities, events and others)': [
      { name: 'title', label: 'Title' },
      { name: 'creators', label: 'Creator/Author/s' },
      { name: 'keywords', label: 'Keywords' },
      { name: 'faculty', label: 'Faculty' },
      { name: 'remarks', label: 'Remarks' },
      { name: 'format', label: 'Format' },
      { name: 'event', label: 'Event' },
      { name: 'venue', label: 'Venue' },
      { name: 'date', label: 'Date', type: 'date' },
    ]
  },
  'Faculty Publications': {
    'Book Chapters': [],
    'Conference Proceedings/Symposium': [],
    'Journal Articles': [],
    'Professional Chair Colloquium Proceedings': [],
    'Reviews': [],
    'Technical Project Reports': [],
  },
  'Student Works': {
    'All Student Works': []
  }
};
