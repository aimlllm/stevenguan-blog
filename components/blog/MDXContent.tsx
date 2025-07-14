'use client';

import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

interface MDXContentProps {
  mdxSource: MDXRemoteSerializeResult;
}

export default function MDXContent({ mdxSource }: MDXContentProps) {
  return (
    <article className="prose prose-lg dark:prose-dark max-w-none">
      <MDXRemote {...mdxSource} />
    </article>
  );
} 