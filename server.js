// server.js (CommonJS version)
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 7001;

// CORS and Middleware Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// MongoDB Connection with modern options
mongoose.connect('mongodb://127.0.0.1:27017/portfolio')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Resume Data Schema with modern schema definition
const resumeSchema = new mongoose.Schema({
  personal: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true },
    linkedin: { type: String, required: true },
    portfolio: { type: String, required: true }
  },
  objective: { type: String, required: true },
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    duration: { type: String, required: true }
  }],
  skills: {
    technical: [{ type: String }],
    databases: [{ type: String }],
    tools: [{ type: String }]
  },
  experience: [{
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    responsibilities: [{ type: String }]
  }],
  projects: [{
    name: { type: String, required: true },
    description: { type: String, required: true },
    isLive: { type: Boolean, default: false }
  }],
  activities: [{ type: String }]
});

const Resume = mongoose.model('Resume', resumeSchema);

// Initialize with resume data if none exists using async/await
async function initializeResumeData() {
  try {
    const count = await Resume.countDocuments();
    
    if (count === 0) {
      const resumeData = {
        personal: {
          name: "ARYAN TOMAR",
          phone: "+91 7617605666",
          location: "Ghaziabad, UP",
          email: "contact@aryantomar.com",
          linkedin: "linkedin.com/aryantomar",
          portfolio: "Portfolio"
        },
        objective: "As an aspiring Full Stack Developer with a strong foundation in HTML, CSS, JavaScript, ReactJS, Node.js, and MongoDB etc. My goal is to design and develop user-centric applications that provide seamless user experiences.",
        education: [
          {
            degree: "B.Tech in Information Technology",
            institution: "ABES ENGINEERING COLLEGE",
            duration: "2022-2026"
          }
        ],
        skills: {
          technical: ["HTML 5", "CSS 3", "JavaScript", "Node.JS", "Express", "REST APIs", "React JS", "Tailwind", "NextJs"],
          databases: ["MongoDB", "Firebase", "Convex", "SQL"],
          tools: ["Git", "Github"]
        },
        experience: [
          {
            title: "Full Stack Developer Intern",
            company: "Elysion Softwares Pvt. Ltd.",
            location: "Gurugram, India",
            duration: "Jan 2025 - Present",
            responsibilities: ["Developed Shopify Store for Company's Product"]
          },
          {
            title: "Web Developer Intern",
            company: "Zidio Development",
            location: "Bangalore, India",
            duration: "Sep 2024 - Dec 2024",
            responsibilities: [
              "Developed MERN Stack Projects for Company Welfare",
              "Redesigned Company Website and improved UX",
              "Gained Expertise in Web Sockets and UI Design."
            ]
          }
        ],
        projects: [
          {
            name: "Real Time Device Tracking",
            description: "Developed to track the live location of devices in real-time, providing enhanced monitoring capabilities.",
            isLive: true
          },
          {
            name: "QR-Code Generator",
            description: "Build QR Code Generator that does something and had quantified success which i made using MERN Stack.",
            isLive: true
          },
          {
            name: "Boom App",
            description: "Designed to enable seamless and secure video communication between users, suitable for virtual meetings, interviews, and collaboration.",
            isLive: true
          }
        ],
        activities: [
          "Technical Events: Participated in hackathons, coding challenges, or tech fests. Attended workshops or seminars on emerging technologies like AI, ML, and blockchain.",
          "Leadership Roles: Served as a team lead in group projects or college committees. Organized events or webinars for peers.",
          "Clubs and Societies: Member of a coding club, Enigma, or any technology-focused organization. Active involvement in a college cultural or technical society.",
          "Sports: Played Badminton and won Various Competitions"
        ]
      };
      
      await Resume.create(resumeData);
      console.log('Resume data initialized');
    }
  } catch (error) {
    console.error('Error initializing resume data:', error);
  }
}


initializeResumeData();


app.get('/api/resume', async (req, res) => {
  try {
    const resumeData = await Resume.findOne().lean();
    res.json(resumeData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});