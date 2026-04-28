// src/config/fieldConfig.js

export const fieldConfig = [
  { name: "accession_no", label: "Accession No.", type: "text" },
  { name: "box_number", label: "Box Number", type: "text" },
  { name: "title", label: "Title", type: "text" },
  { name: "place_of_publication", label: "Place of Publication", type: "text" },
  { name: "publisher", label: "Publisher", type: "text" },
  { name: "date_of_publication", label: "Date of Publication", type: "text" },
  { name: "description_content", label: "Description/Content", type: "textarea" },
  { name: "content_type", label: "Type", type: "text" }, // Changed from 'type' to 'content_type' to match DB
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