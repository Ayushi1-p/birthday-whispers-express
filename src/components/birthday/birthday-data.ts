// Edit this single file to personalize the entire surprise.
export const birthdayContent = {
  friendName: "[FRIEND NAME]",
  yourName: "[YOUR NAME]",
  letters: [
    { title: "Open Me", icon: "✉️", body: "[LETTER 1 — WRITE YOUR MESSAGE HERE]" },
    { title: "One More", icon: "✨", body: "[LETTER 2 — WRITE YOUR MESSAGE HERE]" },
    { title: "For You", icon: "💌", body: "[LETTER 3 — WRITE YOUR MESSAGE HERE]" },
  ],
  memories: [
    { label: "PHOTO 1", caption: "[MEMORY 1]", message: "[PHOTO LETTER 1]" },
    { label: "PHOTO 2", caption: "[MEMORY 2]", message: "[PHOTO LETTER 2]" },
    { label: "PHOTO 3", caption: "[MEMORY 3]", message: "[PHOTO LETTER 3]" },
  ],
  finalLetter: "[FINAL LETTER — WRITE YOUR FINAL BIRTHDAY MESSAGE HERE]",
} as const;
