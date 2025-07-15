'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { LogIn, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { getInitials } from '@/shared/utils/utils';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  if (session?.user) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm">
              {getInitials(session.user.name || session.user.email || 'U')}
            </div>
          )}
          <span className="hidden md:block text-sm">
            {session.user.name || session.user.email}
          </span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border z-20">
            <div className="p-4 border-b">
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-sm text-gray-500">{session.user.email}</p>
            </div>
            <div className="p-2">
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="btn-primary inline-flex items-center gap-2"
    >
      <LogIn size={16} />
      Sign In
    </button>
  );
}