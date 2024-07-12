import React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectCard from './ProjectCard';
import { BrowserRouter as Router } from 'react-router-dom';
import userStore from '../../../stores/userStore';

jest.mock('../../../stores/userStore');

const mockProject = {
  id: 1,
  name: "Test Project",
  image: "test-image.jpg",
  status: "In_Progress",
  interests: [{ name: "React" }, { name: "JavaScript" }, { name: "CSS" }, { name: "HTML" }],
  skills: [{ name: "React" }, { name: "Node.js" }, { name: "Express" }, { name: "MongoDB" }],
  description: "<p>Project description</p>",
  teamMembers: [],
};

describe('ProjectCard Component', () => {
  beforeEach(() => {
    userStore.mockReturnValue({
      user: { id: 1 },
    });
  });

  test('renders project name and image', () => {
    render(
      <Router>
        <ProjectCard project={mockProject} isLoggedIn={false} />
      </Router>
    );

    expect(screen.getByText(/Test Project/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Project Test Project/i)).toBeInTheDocument();
  });

  test('displays the project status correctly', () => {
    render(
      <Router>
        <ProjectCard project={mockProject} isLoggedIn={false} />
      </Router>
    );

    expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
  });


  test('renders description with sanitized HTML', () => {
    render(
      <Router>
        <ProjectCard project={mockProject} isLoggedIn={false} />
      </Router>
    );

    expect(screen.getByText(/Project description/i)).toBeInTheDocument();
  });

  test('shows the correct button for logged in users', () => {
    render(
      <Router>
        <ProjectCard project={mockProject} isLoggedIn={true} />
      </Router>
    );

    expect(screen.getByText(/See Details/i)).toBeInTheDocument();
  });


});


