import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Terminal.css";

function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { text: "Welcome to Aryan Tomar's Terminal Portfolio!", type: "system" },
    { text: 'Type "help" to see available commands.', type: "system" },
  ]);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRocket, setShowRocket] = useState(false);
  const [autoShowPortfolio, setAutoShowPortfolio] = useState(false);

  const [portfolioSection, setPortfolioSection] = useState(0);
  const [showTechProfile, setShowTechProfile] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const bottomRef = useRef(null);
  const rocketRef = useRef(null);
  const [showProfilePhoto, setShowProfilePhoto] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [scanningText, setScanningText] = useState(false);

  const portfolioSections = [
    "about",
    "skills",
    "education",
    "experience",
    "projects",
    "activities",
    "contact",
  ];
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await axios.get("/api/resume");
        setResumeData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load resume data");
        setLoading(false);
      }
    };

    fetchResumeData();
  }, []);

  useEffect(() => {
    // Scroll to bottom when history changes
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Auto-show portfolio effect
  useEffect(() => {
    let profileInterval;
    let initialDelayTimeout;

    if (autoShowPortfolio && resumeData) {
      // Initial delay before starting the auto-showcase
      initialDelayTimeout = setTimeout(() => {
        setShowTechProfile(true);
        setScanningText(true);

        // Add profile introduction with gaming style text
        setHistory((prev) => [
          ...prev,
          { text: "--- INITIATING PROFILE SCAN ---", type: "system-highlight" },
        ]);

        // Start photo scan after 2 seconds
        setTimeout(() => {
          setShowProfilePhoto(true);
          setHistory((prev) => [
            ...prev,
            { text: "► Scanning agent photo...", type: "system-scan" },
          ]);

          // Show profile details after 3 more seconds
          setTimeout(() => {
            setShowProfileDetails(true);
            setHistory((prev) => [
              ...prev,
              { text: "► Retrieving agent data...", type: "system-scan" },
            ]);

            // Start the portfolio section display
            let currentSection = 0;
            profileInterval = setInterval(() => {
              if (currentSection >= portfolioSections.length) {
                clearInterval(profileInterval);
                setHistory((prev) => [
                  ...prev,
                  { text: "--- PROFILE SCAN COMPLETE ---", type: "system-highlight" },
                  { text: "Type any command to continue...", type: "system" },
                ]);
                setAutoShowPortfolio(false);
                return;
              }

              const command = portfolioSections[currentSection];
              const result = executeCommand(command);

              setHistory((prev) => [
                ...prev,
                { text: `$ ${command}`, type: "command-auto" },
                ...result,
              ]);

              currentSection++;
            }, Math.floor(Math.random() * 4000) + 5000);
          }, 3000);
        }, 2000);
      }, 3000);

      return () => {
        clearTimeout(initialDelayTimeout);
        clearInterval(profileInterval);
      };
    }
  }, [autoShowPortfolio, resumeData]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const resetPortfolioShowcase = () => {
    setPortfolioSection(0);
    setShowTechProfile(false);
    setShowProfilePhoto(false);
    setShowProfileDetails(false);
    setScanningText(false);
    setAutoShowPortfolio(false);
  };

  const executeCommand = (cmd) => {
    if (!resumeData && cmd !== "clear" && cmd !== "start" && cmd !== "help") {
      return [
        {
          text: `${cmd}: Command not executed - Resume data is loading...`,
          type: "error",
        },
      ];
    }

    const command = cmd.trim().toLowerCase();
    const parts = command.split(" ");
    const mainCommand = parts[0];
    const args = parts.slice(1);

    switch (mainCommand) {
      case "help":
        return [
          { text: "Available commands:", type: "system" },
          {
            text: "start        - Launch interactive portfolio showcase with animations",
            type: "system-highlight",
          },
          {
            text: "About        - Display basic information about me",
            type: "system",
          },
          { text: "Skills       - List my technical skills", type: "system" },
          {
            text: "Education    - Show my educational background",
            type: "system",
          },
          { text: "Experience   - Display my work experience", type: "system" },
          { text: "projects     - Show my projects", type: "system" },
          {
            text: "Activities   - List my extracurricular activities",
            type: "system",
          },
          {
            text: "Contact      - Show my contact information",
            type: "system",
          },
          { text: "clear        - Clear the terminal", type: "system" },
          {
            text: "cat [file]   - View specific section in detail (e.g., cat projects)",
            type: "system",
          },
          {
            text: "ls           - List all sections available",
            type: "system",
          },
          {
            text: 'exit         - "Exit" the terminal (just for fun)',
            type: "system",
          },
        ];
      case "start":
        // Reset portfolio states to start fresh
        resetPortfolioShowcase();

        // Start the rocket animation
        setShowRocket(true);

        // Set timeout to hide rocket and start auto portfolio after animation completes
        setTimeout(() => {
          setShowRocket(false);
          setAutoShowPortfolio(true);
        }, 4000); // Rocket animation duration

        return [
          { text: "Initiating launch sequence...", type: "system-highlight" },
          { text: "3...", type: "system-countdown" },
          { text: "2...", type: "system-countdown" },
          { text: "1...", type: "system-countdown" },
          { text: "LIFTOFF!", type: "system-liftoff" },
        ];
      case "about":
        return [
          { text: `Name: ${resumeData.personal.name}`, type: "output" },
          { text: `Location: ${resumeData.personal.location}`, type: "output" },
          { text: `Objective: ${resumeData.objective}`, type: "output" },
        ];
      case "skills":
        return [
          { text: "Technical Skills:", type: "output" },
          { text: resumeData.skills.technical.join(", "), type: "output" },
          { text: "Databases:", type: "output" },
          { text: resumeData.skills.databases.join(", "), type: "output" },
          { text: "Tools:", type: "output" },
          { text: resumeData.skills.tools.join(", "), type: "output" },
        ];
      case "education":
        return resumeData.education.map((edu) => ({
          text: `${edu.degree} - ${edu.institution} (${edu.duration})`,
          type: "output",
        }));
      case "experience":
        return resumeData.experience.flatMap((exp) => [
          {
            text: `${exp.title} at ${exp.company}, ${exp.location}`,
            type: "output",
          },
          { text: `Duration: ${exp.duration}`, type: "output" },
          { text: "Responsibilities:", type: "output" },
          ...exp.responsibilities.map((resp) => ({
            text: `- ${resp}`,
            type: "output",
          })),
          { text: "", type: "output" },
        ]);
      case "projects":
        return [
          { text: "My Projects:", type: "system-highlight" },
          ...resumeData.projects.map((project) => ({
            text: (
              <div className="project-card" 
                onClick={() => handleProjectClick(project)}
                onKeyPress={(e) => e.key === 'Enter' && handleProjectClick(project)}
                tabIndex={0}
                role="button"
                aria-label={`View project: ${project.name}`}
              >
                <div className="project-title">
                  {project.name}
                  {project.isLive && <span className="project-live-badge">LIVE</span>}
                </div>
                <div className="project-description">{project.description}</div>
                <div className="project-links">
                  {project.github && (
                    <span className="project-link">GitHub →</span>
                  )}
                  {project.demo && (
                    <span className="project-link">Live Demo →</span>
                  )}
                </div>
              </div>
            ),
            type: "output-card"
          }))
        ];
      case "activities":
        return resumeData.activities.map((activity) => ({
          text: `- ${activity}`,
          type: "output",
        }));
      case "contact":
        return [
          { text: `Email: ${resumeData.personal.email}`, type: "output" },
          { text: `Phone: ${resumeData.personal.phone}`, type: "output" },
          { text: `LinkedIn: ${resumeData.personal.linkedin}`, type: "output" },
          {
            text: `Portfolio: ${resumeData.personal.portfolio}`,
            type: "output",
          },
        ];
      case "clear":
        resetPortfolioShowcase();
        return "clear";
      case "ls":
        return [
          { text: "about       education   experience", type: "output" },
          { text: "skills      projects    activities", type: "output" },
          { text: "contact", type: "output" },
        ];
      case "cat":
        if (args.length === 0) {
          return [{ text: "Usage: cat [section]", type: "error" }];
        }
        const section = args[0].toLowerCase();
        switch (section) {
          case "about":
            return executeCommand("about");
          case "skills":
            return executeCommand("skills");
          case "education":
            return executeCommand("education");
          case "experience":
            return executeCommand("experience");
          case "projects":
            return executeCommand("projects");
          case "activities":
            return executeCommand("activities");
          case "contact":
            return executeCommand("contact");
          default:
            return [{ text: `File not found: ${section}`, type: "error" }];
        }
      case "exit":
        return [
          {
            text: "Thank you for visiting my terminal portfolio!",
            type: "system",
          },
          {
            text: "(This is just for fun, you can continue using the terminal)",
            type: "system",
          },
        ];
      case "":
        return [];
      default:
        return [
          { text: `Command not found: ${command}`, type: "error" },
          { text: 'Type "help" to see available commands.', type: "system" },
        ];
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (input.trim() === "") return;

    // Stop auto-showcase if user enters a command
    if (autoShowPortfolio) {
      setAutoShowPortfolio(false);
    }

    const newHistoryItem = { text: `$ ${input}`, type: "command" };
    const result = executeCommand(input);

    if (result === "clear") {
      setHistory([]);
      setShowTechProfile(false);
    } else {
      setHistory((prev) => [...prev, newHistoryItem, ...result]);
    }

    setInput("");
  };

  const renderRocketAnimation = () => {
    return (
      <div className="rocket-animation" ref={rocketRef}>
        <div className="rocket">
          <div className="rocket-body">
            <div className="window"></div>
          </div>
          <div className="rocket-engine">
            <div className="fire-base">
              <div className="fire-center"></div>
            </div>
          </div>
          <div className="rocket-fins">
            <div className="fin-left"></div>
            <div className="fin-right"></div>
          </div>
          <div className="rocket-shadow"></div>
        </div>
        <div className="stars">
          {Array(20)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                className="star"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              ></div>
            ))}
        </div>
      </div>
    );
  };

  const TechProfile = () => {
    if (!showTechProfile) return null;

    return (
      <div className="tech-profile">
        <div className={`profile-photo ${showProfilePhoto ? 'show' : ''}`}>
          <div className="photo-frame">
            <div className="photo-placeholder">
              <span>
                {resumeData.personal.name.split(" ")[0][0]}
                {resumeData.personal.name.split(" ")[1][0]}
              </span>
            </div>
            <img
              src="/images/profile.jpg"
              alt="Profile"
              className="profile-image"
            />
          </div>
          <div className="scan-line"></div>
        </div>
        {showProfileDetails && (
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">AGENT ID:</span>
              <span className="stat-value">
                DEV-{Math.floor(Math.random() * 9000) + 1000}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">STATUS:</span>
              <span className="stat-value active">ACTIVE</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">CLEARANCE:</span>
              <span className="stat-value">LEVEL 5</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">SPECIALIZATION:</span>
              <span className="stat-value">FULL STACK DEVELOPMENT</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.body.classList.toggle("light-theme");
  };

  const ThemeSwitcher = () => {
    return (
      <div className="theme-switcher" onClick={toggleTheme}>
        <div className={`theme-icon ${isDarkTheme ? "dark" : "light"}`}>
          <div className="sun-moon">
            <div className="sun-moon-inner"></div>
          </div>
          <div className="rays">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="ray"
                style={{ transform: `rotate(${i * 45}deg)` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const handleProjectClick = (project) => {
    // Add exit animation class
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => card.classList.add('exiting'));

    // Wait for animation and then navigate
    setTimeout(() => {
      if (project.demo) {
        window.open(project.demo, '_blank');
      } else if (project.github) {
        window.open(project.github, '_blank');
      }
    }, 300);
  };

  if (loading) {
    return (
      <div className="terminal-container">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <div className="terminal-button red"></div>
            <div className="terminal-button yellow"></div>
            <div className="terminal-button green"></div>
          </div>
          <div className="terminal-title">aryan@portfolio:~</div>
        </div>
        <div className="terminal-body">
          <p className="loading-text">
            <span className="loading-spinner"></span>
            Loading portfolio data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="terminal-container">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <div className="terminal-button red"></div>
            <div className="terminal-button yellow"></div>
            <div className="terminal-button green"></div>
          </div>
          <div className="terminal-title">aryan@portfolio:~</div>
        </div>
        <div className="terminal-body">
          <p className="error-text">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`terminal-container ${
        isDarkTheme ? "dark-theme" : "light-theme"
      }`}
    >
      <ThemeSwitcher />
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-button red"></div>
          <div className="terminal-button yellow"></div>
          <div className="terminal-button green"></div>
        </div>
        <div className="terminal-title">aryan@portfolio:~</div>
      </div>
      <div className="terminal-body">
        {showRocket && renderRocketAnimation()}
        <TechProfile />
        {history.map((item, index) => (
          <div key={index} className={`terminal-line ${item.type}`}>
            {typeof item.text === 'string' ? item.text : item.text}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="terminal-input-line">
          <span className="terminal-prompt">aryan@portfolio:~$</span>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            autoFocus
            className="terminal-input"
            spellCheck="false"
          />
        </form>
        <div ref={bottomRef} />
        <div className="stars">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random(),
              }}
            />
          ))}
          {/* Shooting Stars */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`shooting-${i}`}
              className="shooting-star"
              style={{
                top: `${Math.random() * 100}vh`,
                left: `${Math.random() * 100}vw`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
