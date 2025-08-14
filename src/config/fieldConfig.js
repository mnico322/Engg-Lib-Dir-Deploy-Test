// src/config/fieldConfig.js

export const fieldConfig = {
  "College Archives": {
    collections: {
      "Permanent Records": {
        subCollections: {
          "Minutes of the Meetings": {
            subSubCollections: {
              "College Executive Board (CEB)": [
                { name: "accessCode", label: "Access Code", type: "text" },
                { name: "locationCode", label: "Location Code", type: "text" },
                { name: "boxNo", label: "Box No.", type: "text" },
                { name: "creatorAuthor", label: "Creator/Author", type: "text" },
                { name: "provenance", label: "Provenance (Office/Unit/Department)", type: "text" },
                { name: "title", label: "Title", type: "text" },
                {
                  name: "materialType",
                  label: "Material Type",
                  type: "select",
                  options: [
                    "College Executive Board (CEB)",
                    "College Academic Personnel Committee (CAPC)",
                    "Graduate Faculty Council",
                    "Others"
                  ]
                },
                { name: "physicalDescription", label: "Physical Description", type: "text" },
                { name: "dateEncoded", label: "Date Encoded", type: "date" },
                { name: "contentDescription", label: "Content Description", type: "textarea" }
              ],
              "College Academic Personnel Committee (CAPC)": [
                { name: "accessCode", label: "Access Code", type: "text" },
                { name: "locationCode", label: "Location Code", type: "text" },
                { name: "boxNo", label: "Box No.", type: "text" },
                { name: "creatorAuthor", label: "Creator/Author", type: "text" },
                { name: "provenance", label: "Provenance (Office/Unit/Department)", type: "text" },
                { name: "title", label: "Title", type: "text" },
                {
                  name: "materialType",
                  label: "Material Type",
                  type: "select",
                  options: [
                    "College Executive Board (CEB)",
                    "College Academic Personnel Committee (CAPC)",
                    "Graduate Faculty Council",
                    "Others"
                  ]
                },
                { name: "physicalDescription", label: "Physical Description", type: "text" },
                { name: "dateEncoded", label: "Date Encoded", type: "date" },
                { name: "contentDescription", label: "Content Description", type: "textarea" }
              ],
              "Graduate Faculty Council": [
                { name: "accessCode", label: "Access Code", type: "text" },
                { name: "locationCode", label: "Location Code", type: "text" },
                { name: "boxNo", label: "Box No.", type: "text" },
                { name: "creatorAuthor", label: "Creator/Author", type: "text" },
                { name: "provenance", label: "Provenance (Office/Unit/Department)", type: "text" },
                { name: "title", label: "Title", type: "text" },
                {
                  name: "materialType",
                  label: "Material Type",
                  type: "select",
                  options: [
                    "College Executive Board (CEB)",
                    "College Academic Personnel Committee (CAPC)",
                    "Graduate Faculty Council",
                    "Others"
                  ]
                },
                { name: "physicalDescription", label: "Physical Description", type: "text" },
                { name: "dateEncoded", label: "Date Encoded", type: "date" },
                { name: "contentDescription", label: "Content Description", type: "textarea" }
              ],
              "Others": [
                { name: "accessCode", label: "Access Code", type: "text" },
                { name: "locationCode", label: "Location Code", type: "text" },
                { name: "boxNo", label: "Box No.", type: "text" },
                { name: "creatorAuthor", label: "Creator/Author", type: "text" },
                { name: "provenance", label: "Provenance (Office/Unit/Department)", type: "text" },
                { name: "title", label: "Title", type: "text" },
                {
                  name: "materialType",
                  label: "Material Type",
                  type: "select",
                  options: [
                    "College Executive Board (CEB)",
                    "College Academic Personnel Committee (CAPC)",
                    "Graduate Faculty Council",
                    "Others"
                  ]
                },
                { name: "physicalDescription", label: "Physical Description", type: "text" },
                { name: "dateEncoded", label: "Date Encoded", type: "date" },
                { name: "contentDescription", label: "Content Description", type: "textarea" }
              ]
            }
          },
          "Reports": [
            { name: "accessCode", label: "Access Code", type: "text" },
            { name: "locationCode", label: "Location Code", type: "text" },
            { name: "boxNo", label: "Box No.", type: "text" },
            { name: "creatorAuthor", label: "Creator/Author", type: "text" },
            { name: "provenance", label: "Provenance (Office/Unit/Department)", type: "text" },
            { name: "title", label: "Title", type: "text" },
            {
              name: "materialType",
              label: "Material Type",
              type: "select",
              options: [
                "College Executive Board (CEB)",
                "College Academic Personnel Committee (CAPC)",
                "Graduate Faculty Council",
                "Others"
              ]
            },
            { name: "physicalDescription", label: "Physical Description", type: "text" },
            { name: "dateEncoded", label: "Date Encoded", type: "date" },
            { name: "contentDescription", label: "Content Description", type: "textarea" }
          ]
        }
      },
      "Publications": {
        subCollections: {
          "College of Engineering (COE)": [
            { name: "accessionNumbers", label: "Accession Number/s", type: "text" },
            { name: "callNo", label: "Call No.", type: "text" },
            { name: "boxNo", label: "Box No.", type: "text" },
            { name: "title", label: "Title", type: "text" },
            { name: "author", label: "Author", type: "text" },
            { name: "keywords", label: "Keywords", type: "textarea" },
            { name: "publisher", label: "Publisher", type: "text" },
            { name: "placeOfPublication", label: "Place of Publication", type: "text" },
            { name: "yearPublished", label: "Year Published", type: "text" },
            { name: "physicalDescription", label: "Physical Description", type: "text" },
            { name: "provenance", label: "Provenance (Office/Unit/Department)", type: "text" },
            {
              name: "materialType",
              label: "Material Type",
              type: "select",
              options: [
                "Yearbooks",
                "Directories",
                "Course Catalogs",
                "Handbooks",
                "Conference Proceedings",
                "Reports",
                "Journals",
                "Magazines",
                "Newspaper",
                "Clippings",
                "Newsletter",
                "Gazettes"
              ]
            },
            { name: "dateEncoded", label: "Date Encoded", type: "date" },
            { name: "contentDescription", label: "Content Description", type: "textarea" }
          ],
          "University of the Philippines (UP)": [
            { name: "accessionNumbers", label: "Accession Number/s", type: "text" },
            { name: "callNo", label: "Call No.", type: "text" },
            { name: "boxNo", label: "Box No.", type: "text" },
            { name: "title", label: "Title", type: "text" },
            { name: "author", label: "Author", type: "text" },
            { name: "keywords", label: "Keywords", type: "textarea" },
            { name: "publisher", label: "Publisher", type: "text" },
            { name: "placeOfPublication", label: "Place of Publication", type: "text" },
            { name: "yearPublished", label: "Year Published", type: "text" },
            { name: "physicalDescription", label: "Physical Description", type: "text" },
            { name: "provenance", label: "Provenance (Office/Unit/Department)", type: "text" },
            {
              name: "materialType",
              label: "Material Type",
              type: "select",
              options: [
                "Yearbooks",
                "Directories",
                "Course Catalogs",
                "Handbooks",
                "Conference Proceedings",
                "Reports",
                "Journals",
                "Magazines",
                "Newspaper",
                "Clippings",
                "Newsletter",
                "Gazettes"
              ]
            },
            { name: "dateEncoded", label: "Date Encoded", type: "date" },
            { name: "contentDescription", label: "Content Description", type: "textarea" }
          ],
          "NoN-UP/Other Publications": [
            { name: "accessionNumbers", label: "Accession Number/s", type: "text" },
            { name: "callNo", label: "Call No.", type: "text" },
            { name: "boxNo", label: "Box No.", type: "text" },
            { name: "title", label: "Title", type: "text" },
            { name: "author", label: "Author", type: "text" },
            { name: "keywords", label: "Keywords", type: "textarea" },
            { name: "publisher", label: "Publisher", type: "text" },
            { name: "placeOfPublication", label: "Place of Publication", type: "text" },
            { name: "yearPublished", label: "Year Published", type: "text" },
            { name: "physicalDescription", label: "Physical Description", type: "text" },
            { name: "provenance", label: "Provenance (Office/Unit/Department)", type: "text" },
            {
              name: "materialType",
              label: "Material Type",
              type: "select",
              options: [
                "Yearbooks",
                "Directories",
                "Course Catalogs",
                "Handbooks",
                "Conference Proceedings",
                "Reports",
                "Journals",
                "Magazines",
                "Newspaper",
                "Clippings",
                "Newsletter",
                "Gazettes"
              ]
            },
            { name: "dateEncoded", label: "Date Encoded", type: "date" },
            { name: "contentDescription", label: "Content Description", type: "textarea" }
          ]
        }
      },
      "Personal Collections": {
        subCollections: {
          "Deans": [
            { name: "accessCode", label: "Access Code", type: "text" },
            { name: "locationCode", label: "Location Code", type: "text" },
            { name: "boxNo", label: "Box No.", type: "text" },
            { name: "creatorAuthor", label: "Creator/Author", type: "text" },
            { name: "contributor", label: "Contributor (Person/Office/Unit/Department)", type: "text" },
            { name: "dateCreated", label: "Date Created", type: "date" },
            { name: "title", label: "Title", type: "text" },
            {
              name: "materialType",
              label: "Material Type",
              type: "select",
              options: [
                "Personal Paper",
                "Advertisements",
                "Posters",
                "Broadsides",
                "Cards",
                "Flyers",
                "Brochures",
                "Memorabilia such Photographs, Drawings, Plaque, Pins and other objects associated with memorable people"
              ]
            },
            { name: "physicalDescription", label: "Physical Description", type: "text" },
            { name: "remarks", label: "Remarks", type: "textarea" },
            { name: "dateEncoded", label: "Date Encoded", type: "date" },
            { name: "contentDescription", label: "Content Description", type: "textarea" }
          ],
          "Faculty": [
            { name: "accessCode", label: "Access Code", type: "text" },
            { name: "locationCode", label: "Location Code", type: "text" },
            { name: "boxNo", label: "Box No.", type: "text" },
            { name: "creatorAuthor", label: "Creator/Author", type: "text" },
            { name: "contributor", label: "Contributor (Person/Office/Unit/Department)", type: "text" },
            { name: "dateCreated", label: "Date Created", type: "date" },
            { name: "title", label: "Title", type: "text" },
            {
              name: "materialType",
              label: "Material Type",
              type: "select",
              options: [
                "Personal Paper",
                "Advertisements",
                "Posters",
                "Broadsides",
                "Cards",
                "Flyers",
                "Brochures",
                "Memorabilia such Photographs, Drawings, Plaque, Pins and other objects associated with memorable people"
              ]
            },
            { name: "physicalDescription", label: "Physical Description", type: "text" },
            { name: "remarks", label: "Remarks", type: "textarea" },
            { name: "dateEncoded", label: "Date Encoded", type: "date" },
            { name: "contentDescription", label: "Content Description", type: "textarea" }
          ],
          "Notable Alumni": [
            { name: "accessCode", label: "Access Code", type: "text" },
            { name: "locationCode", label: "Location Code", type: "text" },
            { name: "boxNo", label: "Box No.", type: "text" },
            { name: "creatorAuthor", label: "Creator/Author", type: "text" },
            { name: "contributor", label: "Contributor (Person/Office/Unit/Department)", type: "text" },
            { name: "dateCreated", label: "Date Created", type: "date" },
            { name: "title", label: "Title", type: "text" },
            {
              name: "materialType",
              label: "Material Type",
              type: "select",
              options: [
                "Personal Paper",
                "Advertisements",
                "Posters",
                "Broadsides",
                "Cards",
                "Flyers",
                "Brochures",
                "Memorabilia such Photographs, Drawings, Plaque, Pins and other objects associated with memorable people"
              ]
            },
            { name: "physicalDescription", label: "Physical Description", type: "text" },
            { name: "remarks", label: "Remarks", type: "textarea" },
            { name: "dateEncoded", label: "Date Encoded", type: "date" },
            { name: "contentDescription", label: "Content Description", type: "textarea" }
          ]
        }
      },
      "Distinguished Alumni Lecture Series (DALS)": [
        { name: "title", label: "Title", type: "text" },
        { name: "lecturers", label: "Lecturer/s", type: "text" },
        { name: "keywords", label: "Keywords", type: "textarea" },
        { name: "organizer", label: "Organizer", type: "text" },
        { name: "remarks", label: "Remarks", type: "textarea" },
        { name: "format", label: "Format", type: "text" },
        { name: "event", label: "Event", type: "text" },
        { name: "venue", label: "Venue", type: "text" },
        { name: "date", label: "Date", type: "date" }
      ],
      "Multimedia Files (Activities, events and others)": [
        { name: "title", label: "Title", type: "text" },
        { name: "creatorAuthors", label: "Creator/Author/s", type: "text" },
        { name: "keywords", label: "Keywords", type: "textarea" },
        { name: "faculty", label: "Faculty", type: "text" },
        { name: "remarks", label: "Remarks", type: "textarea" },
        { name: "format", label: "Format", type: "text" },
        { name: "event", label: "Event", type: "text" },
        { name: "venue", label: "Venue", type: "text" },
        { name: "date", label: "Date", type: "date" }
      ]
    }
  },

  "Faculty Publications": {
    collections: {
      "Book Chapters": [
        { name: "title", label: "Title", type: "text" },
        { name: "authors", label: "Author/s", type: "text" },
        { name: "keywords", label: "Keywords", type: "textarea" },
        { name: "faculty", label: "Faculty", type: "text" },
        { name: "remarks", label: "Remarks", type: "textarea" },
        { name: "titleOfConference", label: "Title of Conference", type: "text" },
        { name: "pageNo", label: "Page No.", type: "text" },
        { name: "organizer", label: "Organizer", type: "text" },
        { name: "placeOfConference", label: "Place of Conference", type: "text" },
        { name: "dateFrom", label: "Date From", type: "date" },
        { name: "dateTo", label: "Date To", type: "date" },
        { name: "abstract", label: "Abstract", type: "textarea" }
      ],
      "Conference Proceedings/Symposium": [
        { name: "title", label: "Title", type: "text" },
        { name: "authors", label: "Author/s", type: "text" },
        { name: "keywords", label: "Keywords", type: "textarea" },
        { name: "faculty", label: "Faculty", type: "text" },
        { name: "remarks", label: "Remarks", type: "textarea" },
        { name: "titleOfConference", label: "Title of Conference", type: "text" },
        { name: "pageNo", label: "Page No.", type: "text" },
        { name: "organizer", label: "Organizer", type: "text" },
        { name: "placeOfConference", label: "Place of Conference", type: "text" },
        { name: "dateFrom", label: "Date From", type: "date" },
        { name: "dateTo", label: "Date To", type: "date" },
        { name: "abstract", label: "Abstract", type: "textarea" }
      ],
      "Journal Articles": [
        { name: "title", label: "Title", type: "text" },
        { name: "authors", label: "Author/s", type: "text" },
        { name: "keywords", label: "Keywords", type: "textarea" },
        { name: "faculty", label: "Faculty", type: "text" },
        { name: "remarks", label: "Remarks", type: "textarea" },
        { name: "status", label: "Status", type: "text" },
        {
          name: "citationDatabase",
          label: "Scientific Citation Indexing Databases",
          type: "select",
          options: [
            "Web of Science (WoS)",
            "Institute for Scientific Information (ISI)",
            "Scopus",
            "Google Scholar",
            "Others"
          ]
        },
        {
          name: "access",
          label: "Access",
          type: "select",
          options: [
            "Open",
            "via Subscription"
          ]
        },
        { name: "journalTitle", label: "Title of the Journal", type: "text" },
        { name: "volume", label: "Volume", type: "text" },
        { name: "issueNo", label: "Issue No.", type: "text" },
        { name: "pageNo", label: "Page No.", type: "text" },
        { name: "date", label: "Date", type: "date" },
        { name: "abstract", label: "Abstract", type: "textarea" }
      ]
    }
  },

  "Student Works": {
    collections: {
      "Default": [
        { name: "accessCode", label: "Access Code", type: "text" },
        { name: "locationCode", label: "Location Code", type: "text" },
        { name: "boxNo", label: "Box No.", type: "text" },
        { name: "title", label: "Title", type: "text" },
        { name: "author", label: "Author", type: "text" },
        { name: "keywords", label: "Keywords", type: "textarea" },
        { name: "publisher", label: "Publisher", type: "text" },
        { name: "placeOfPublication", label: "Place of Publication", type: "text" },
        { name: "yearPublished", label: "Year Published", type: "text" },
        { name: "physicalDescription", label: "Physical Description", type: "textarea" },
        { name: "provenance", label: "Provenance (Office/Unit/Department)", type: "text" },
        {
          name: "materialType",
          label: "Material Type",
          type: "select",
          options: [
            "Yearbooks",
            "Directories",
            "Course Catalogs",
            "Handbooks",
            "Conference Proceedings",
            "Reports",
            "Journals",
            "Magazines",
            "Newspaper",
            "Clippings",
            "Newsletter",
            "Gazettes"
          ]
        },
        { name: "dateEncoded", label: "Date Encoded", type: "date" },
        { name: "contentDescription", label: "Content Description", type: "textarea" }
      ]
    }
  }
};
