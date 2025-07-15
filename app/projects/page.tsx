import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Github, Calendar, Code } from 'lucide-react';
import { apiGet } from '@/shared/utils/api';
import { formatDate } from '@/shared/utils/format';
import { SITE_CONFIG } from '@/shared/constants';

export const metadata: Metadata = {
  title: 'Projects | ' + SITE_CONFIG.title,
  description: 'Explore my latest projects and development work',
  openGraph: {
    title: 'Projects | ' + SITE_CONFIG.title,
    description: 'Explore my latest projects and development work',
    url: SITE_CONFIG.url + '/projects',
    images: [
      {
        url: SITE_CONFIG.url + '/images/projects-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Projects - ' + SITE_CONFIG.name,
      },
    ],
  },
};

async function getProjects() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/projects', {
      cache: 'no-store', // Always fetch fresh data
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            My Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A showcase of my development work, from web applications to open-source contributions.
            Each project represents a learning journey and a step forward in my development career.
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <Code size={64} className="mx-auto mb-4" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              No Projects Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              I'm currently working on some exciting projects. Check back soon to see what I've been building!
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interested in Collaborating?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={SITE_CONFIG.links.github}
                className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                <Github size={20} className="mr-2" />
                View on GitHub
              </Link>
              <Link
                href={SITE_CONFIG.links.linkedin}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <ExternalLink size={20} className="mr-2" />
                Connect on LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Project Image */}
      {project.featured_image && (
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
          <Image
            src={project.featured_image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      {/* Project Content */}
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Calendar size={16} className="mr-2" />
          {formatDate(project.created_at)}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {project.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {project.description}
        </p>
        
        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech_stack?.slice(0, 3).map((tech: string) => (
            <span
              key={tech}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
            >
              {tech}
            </span>
          ))}
          {project.tech_stack?.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
              +{project.tech_stack.length - 3} more
            </span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href={`/projects/${project.slug}`}
            className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
          
          {project.demo_url && (
            <Link
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              title="Live Demo"
            >
              <ExternalLink size={20} />
            </Link>
          )}
          
          {project.github_url && (
            <Link
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
              title="GitHub Repository"
            >
              <Github size={20} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 