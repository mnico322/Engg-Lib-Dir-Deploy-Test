// src/config/fieldConfig.js

export const fieldConfig = [
  { name: "accessionNo", label: "Accession No.", type: "text" },
  { name: "boxNumber", label: "Box Number", type: "text" },
  { name: "title", label: "Title", type: "text" },
  { name: "placeOfPublication", label: "Place of Publication", type: "text" },
  { name: "publisher", label: "Publisher", type: "text" },
  { name: "dateOfPublication", label: "Date of Publication", type: "text" },
  { name: "descriptionContent", label: "Description/Content", type: "textarea" },
  { name: "type", label: "Type", type: "text" },
  { name: "paper", label: "Paper", type: "text" },
  { name: "abstract", label: "Abstract", type: "textarea" },
  { name: "keywords", label: "Keywords", type: "textarea" },
  { name: "file", label: "Upload Document", type: "file" },
  {
    name: "accessLevel",
    label: "Access Level",
    type: "select",
    options: [
      "Public (Metadata Only)",
      "Public (Metadata & File)",
      "Private (Staff Only)"
    ]
  }
];