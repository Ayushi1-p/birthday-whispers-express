// Edit this single file to personalize the entire surprise.
// Photos live in /public/images/ (photo1.jpg ... photo4.jpg).
// Don't use the " character inside the text; use ' instead. \n\n starts a new paragraph.
export const birthdayContent = {
  friendName: "[FRIEND NAME]",
  yourName: "[YOUR NAME]",
  letters: [
    {
      title: "Open Me",
      icon: "✉️",
      body: "Thank you for coming into my life and making it better.\n\nI am sorry for bothering you so much... and thanks mujhe jhelne ke liye 🫶",
    },
    {
      title: "One More",
      icon: "✨",
      body: "Happiest birthday! 🎂\n\nJyada kuch hua nahi, bas yahi ho paya... but it's made with a lot of love.",
    },
    {
      title: "For You",
      icon: "💌",
      body: "You are such a blessing.\n\nYou are important. Ye hamesha yaad rakhna ✨",
    },
  ],
  memories: [
    {
      label: "PHOTO 1",
      image: "/images/photo1.jpg",
      caption: "That look 😌",
      message: "Ye wala expression sirf tum hi de sakti ho.",
    },
    {
      label: "PHOTO 2",
      image: "/images/photo2.jpg",
      caption: "Road trip vibes 🚗",
      message: "Car, snacks aur bakwaas baatein. Best combo.",
    },
    {
      label: "PHOTO 3",
      image: "/images/photo3.jpg",
      caption: "Model pose ✨",
      message: "Aise hi hamesha muskurate rehna.",
    },
    {
      label: "PHOTO 4",
      image: "/images/photo4.jpg",
      caption: "Cool mode on 😎",
      message: "Goggles, peace sign aur full swag. Ye wali to frame karni chahiye.",
    },
  ],
  finalLetter:
    "I love and appreciate you more than I even know how to express in words, but I'm going to try my best. People come and go but you're somebody that I know I can always count on to be there for me no matter what. I hope you know that I will always be there for you too, even if we're arguing or we haven't talked in months (which I hope doesn't happen). I'll always have time for you so please don't hesitate to 'bother' me because I promise you that no matter what you're going through I will always try my best to help you and work through it with you.\n\nSince we became friends my life has been so much brighter and happier even despite all of the bad days. You changed my life without even trying to and I don't think I could ever express how grateful I am for that. I can't imagine what my life would be like without you. I thought you were ignoring me this summer and it just about broke me. Please never leave me and I promise I will do the same.",
} as const;
