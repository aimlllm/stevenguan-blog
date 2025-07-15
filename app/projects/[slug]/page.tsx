import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ExternalLink, Github, Calendar, ArrowLeft, Code, Star } from 'lucide-react';
import { formatDate } from '@/shared/utils/format';
import { SITE_CONFIG } from '@/shared/constants';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

async function getProject(slug: string) {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_SITE_URL + `/api/projects/${slug}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProject(params.slug);
  
  if (!project) {
    return {
      title: 'Project Not Found | ' + SITE_CONFIG.title,
    };
  }
  
  return {
    title: project.title + ' | ' + SITE_CONFIG.title,
    description: project.description,
    openGraph: {
      title: project.title + ' | ' + SITE_CONFIG.title,
      description: project.description,
      url: SITE_CONFIG.url + `/projects/${params.slug}`,
      images: project.featured_image ? [
        {
          url: SITE_CONFIG.url + project.featured_image,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.slug);
  
  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/projects"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Projects
        </Link>

        {/* Project Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Featured Image */}
          {project.featured_image && (
            <div className="relative h-64 md:h-96 bg-gradient-to-br from-blue-500 to-purple-600">
              <Image
                src={project.featured_image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          
          {/* Project Info */}
          <div className="p-8">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              <Calendar size={16} className="mr-2" />
              {formatDate(project.created_at)}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {project.title}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              {project.description}
            </p>
            
            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech_stack?.map((tech: string) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {project.demo_url && (
                <Link
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <ExternalLink size={20} className="mr-2" />
                  Live Demo
                </Link>
              )}
              
              {project.github_url && (
                <Link
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                >
                  <Github size={20} className="mr-2" />
                  View Code
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Project Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        </div>

        {/* Related Projects */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            More Projects
          </h2>
          <div className="text-center">
            <Link
              href="/projects"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Code size={20} className="mr-2" />
              View All Projects
            </Link>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center">
            <Star size={48} className="mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Like this project?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              If you found this project interesting or useful, I'd love to hear from you! 
              Feel free to reach out for collaboration opportunities or just to say hello.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={SITE_CONFIG.links.github}
                className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                <Github size={20} className="mr-2" />
                Follow on GitHub
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