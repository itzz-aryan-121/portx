import React from 'react';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

interface ProjectCardProps {
  title: string;
  description: string;
  isLive?: boolean;
  githubUrl?: string;
  liveUrl?: string;
  onExit?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  isLive = false,
  githubUrl,
  liveUrl,
  onExit,
}) => {
  const [isExiting, setIsExiting] = React.useState(false);

  const handleClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (liveUrl) {
        window.open(liveUrl, '_blank');
      } else if (githubUrl) {
        window.open(githubUrl, '_blank');
      }
      onExit?.();
    }, 300);
  };

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <div 
      className={`project-card ${isExiting ? 'exiting' : ''}`}
      onClick={handleClick}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
      role="button"
      tabIndex={0}
    >
      <div className="project-title">
        {title}
        {isLive && <span className="project-live-badge">Live</span>}
      </div>
      <div className="project-description">{description}</div>
      <div className="project-links">
        {githubUrl && (
          <a
            href={githubUrl}
            onClick={(e) => handleLinkClick(e, githubUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            <FiGithub /> Source
          </a>
        )}
        {liveUrl && (
          <a
            href={liveUrl}
            onClick={(e) => handleLinkClick(e, liveUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            <FiExternalLink /> Demo
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard; 