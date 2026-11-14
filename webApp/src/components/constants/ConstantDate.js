export const CardData = {
  heading: "Frontend Developer",
  description: "Application submitted successfully",
  status: {
    title: "Applied",
    "bg-color": "bg-blue-100",
    "text-color": "text-blue-700",
  },
  "btm-left-text": "Bangalore",
  "btm-right-text": "Just now",
};

// Scattered around the centered person. top/left are % of the section, rotate is the tilt.
export const POSITIONS = [
  // top row (gap in the middle for the head)
  { top: "1%",  left: "10%",  rotate: "-6deg" },
  { top: "4%",  left: "52%", rotate: "5deg"  },

  // upper-middle
  { top: "25%", left: "6%", rotate: "4deg"  },
  { top: "26%", left: "54%", rotate: "-4deg" },

  // lower-middle
  { top: "47%", left: "2%",  rotate: "-3deg" },
  { top: "50%", left: "55%", rotate: "6deg"  },

  // bottom row
  { top: "73%", left: "18%",  rotate: "5deg"  },
  { top: "78%", left: "50%", rotate: "-1deg" },
];