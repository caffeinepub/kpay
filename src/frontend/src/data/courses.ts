export interface MockCourse {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  instructor: string;
  thumbnail: string;
  description: string;
  lessons: MockLesson[];
}

export interface MockLesson {
  id: string;
  title: string;
  duration: string;
}

export const MOCK_COURSES: MockCourse[] = [
  {
    id: "1",
    title: "Advanced Film Making",
    category: "Film",
    price: 149,
    rating: 4.9,
    instructor: "Alex Rivera",
    thumbnail: "https://picsum.photos/seed/film1/400/225",
    description:
      "Master cinematic techniques used by Hollywood professionals. Learn lighting, composition, camera movement, and storytelling that transforms your films from amateur to breathtaking.",
    lessons: [
      { id: "l1", title: "Introduction to Cinematography", duration: "12:30" },
      { id: "l2", title: "Mastering Natural Light", duration: "18:45" },
      { id: "l3", title: "Camera Movement Techniques", duration: "22:10" },
      { id: "l4", title: "Composition & Framing", duration: "15:20" },
      { id: "l5", title: "Editing for Emotion", duration: "28:05" },
    ],
  },
  {
    id: "2",
    title: "UI/UX Design Mastery",
    category: "Design",
    price: 129,
    rating: 4.8,
    instructor: "Sarah Chen",
    thumbnail: "https://picsum.photos/seed/design1/400/225",
    description:
      "Build stunning interfaces that users love. From wireframing to high-fidelity prototypes, master the tools and principles that top design teams use every day.",
    lessons: [
      { id: "l1", title: "Design Fundamentals", duration: "10:00" },
      { id: "l2", title: "Wireframing Essentials", duration: "14:30" },
      { id: "l3", title: "Figma Deep Dive", duration: "25:50" },
      { id: "l4", title: "User Research Methods", duration: "19:15" },
      { id: "l5", title: "Prototyping & Testing", duration: "21:40" },
    ],
  },
  {
    id: "3",
    title: "Business Strategy 101",
    category: "Business",
    price: 99,
    rating: 4.7,
    instructor: "Marcus Johnson",
    thumbnail: "https://picsum.photos/seed/biz1/400/225",
    description:
      "Scale your business with proven strategies from Fortune 500 consultants. Learn competitive analysis, market positioning, and execution frameworks that drive real growth.",
    lessons: [
      { id: "l1", title: "Market Analysis Basics", duration: "16:00" },
      { id: "l2", title: "Competitive Positioning", duration: "20:30" },
      { id: "l3", title: "Revenue Model Design", duration: "18:00" },
      { id: "l4", title: "Building Your Team", duration: "14:45" },
      { id: "l5", title: "Scaling Operations", duration: "23:20" },
    ],
  },
  {
    id: "4",
    title: "Cinematic Color Grading",
    category: "Film",
    price: 89,
    rating: 4.8,
    instructor: "Emma Davis",
    thumbnail: "https://picsum.photos/seed/film2/400/225",
    description:
      "Professional color grading secrets from award-winning colorists. Transform raw footage into cinematic gold using DaVinci Resolve, LUTs, and advanced color science.",
    lessons: [
      { id: "l1", title: "Color Science Fundamentals", duration: "11:30" },
      { id: "l2", title: "DaVinci Resolve Setup", duration: "9:45" },
      { id: "l3", title: "Creating Custom LUTs", duration: "17:20" },
      { id: "l4", title: "Film Emulation Techniques", duration: "22:00" },
      { id: "l5", title: "Client Delivery Workflows", duration: "13:55" },
    ],
  },
  {
    id: "5",
    title: "Brand Identity Design",
    category: "Design",
    price: 119,
    rating: 4.9,
    instructor: "David Park",
    thumbnail: "https://picsum.photos/seed/design2/400/225",
    description:
      "Create iconic brands that stand the test of time. Master logo design, visual systems, brand voice, and the strategic thinking behind brands people fall in love with.",
    lessons: [
      { id: "l1", title: "Brand Strategy Foundations", duration: "13:00" },
      { id: "l2", title: "Logo Design Process", duration: "28:30" },
      { id: "l3", title: "Color & Typography Systems", duration: "19:45" },
      { id: "l4", title: "Brand Guidelines Creation", duration: "16:20" },
      { id: "l5", title: "Presenting to Clients", duration: "11:10" },
    ],
  },
  {
    id: "6",
    title: "Startup Fundraising",
    category: "Business",
    price: 199,
    rating: 4.6,
    instructor: "Lisa Wang",
    thumbnail: "https://picsum.photos/seed/biz2/400/225",
    description:
      "Raise capital successfully from angels, VCs, and crowdfunding platforms. Learn pitch deck mastery, term sheet negotiation, and how to find the right investors for your vision.",
    lessons: [
      { id: "l1", title: "Fundraising Landscape Overview", duration: "15:00" },
      { id: "l2", title: "Crafting Your Pitch Deck", duration: "32:20" },
      { id: "l3", title: "Finding the Right Investors", duration: "18:40" },
      { id: "l4", title: "Due Diligence Preparation", duration: "21:15" },
      { id: "l5", title: "Closing the Deal", duration: "14:30" },
    ],
  },
];
