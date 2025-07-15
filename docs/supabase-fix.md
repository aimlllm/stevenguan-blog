# Quick Fix: Supabase Integration Issues on Vercel

## 🚨 Immediate Actions Required

### 1. **Verify Environment Variables in Vercel**

Go to your Vercel project settings and ensure these variables are set:

```bash
# Required for Supabase
NEXT_PUBLIC_SUPABASE_URL=https://asciyoncfkeqkkcxdrqz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzY2l5b25jZmtlcWtrY3hkcnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTIyMjIsImV4cCI6MjA2Nzc2ODIyMn0.YI8nIWMIu0Ls4Kqs6jjc6epKei-4cfCSWxFWLMzIX6Q
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzY2l5b25jZmtlcWtrY3hkcnF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE5MjIyMiwiZXhwIjoyMDY3NzY4MjIyfQ.7cjF6YgzMH3JZZBTmyEDDLxZCZTQSDZWhOu1yGsFFsI

# Required for NextAuth
NEXTAUTH_URL=https://stevenguan.com
NEXTAUTH_SECRET=your-secret-here

# OAuth providers
GOOGLE_CLIENT_ID=928585084803-8purk82meipnp8k9k3sbfdd3ctc66du1.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-secret
GITHUB_CLIENT_ID=Iv23liM1F88FmJSn3G9a
GITHUB_CLIENT_SECRET=your-github-secret
```

### 2. **Test Database Connection**

Create a test API route to verify connection:

```typescript
// app/api/test-db/route.ts
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected successfully',
      data 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    }, { status: 500 })
  }
}
```

### 3. **Enhanced Error Handling**

Update your Supabase client configuration:

```typescript
// lib/supabase.ts - Enhanced version
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error('Missing required Supabase environment variables')
}

// Client-side Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: false,
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Server-side Supabase client
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Enhanced user sync with better error handling
export async function syncUserToSupabase(user: any, account: any): Promise<void> {
  try {
    console.log('Syncing user to Supabase:', user.email)
    
    const { data: existingUser, error: selectError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      throw new Error(`Failed to check existing user: ${selectError.message}`)
    }

    if (existingUser) {
      // Update existing user
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          name: user.name,
          avatar_url: user.image,
          provider: account.provider,
          provider_id: account.providerAccountId,
          updated_at: new Date().toISOString(),
        })
        .eq('email', user.email)

      if (updateError) {
        throw new Error(`Failed to update user: ${updateError.message}`)
      }
    } else {
      // Create new user
      const { error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          email: user.email,
          name: user.name,
          avatar_url: user.image,
          provider: account.provider,
          provider_id: account.providerAccountId,
        })

      if (insertError) {
        throw new Error(`Failed to create user: ${insertError.message}`)
      }
    }

    console.log('User successfully synced to Supabase')
  } catch (error) {
    console.error('Error syncing user to Supabase:', error)
    throw error
  }
}

// Enhanced user retrieval
export async function getUserByEmail(email: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get user: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Error getting user by email:', error)
    throw error
  }
}
```

### 4. **Database Health Check**

Add a health check endpoint:

```typescript
// app/api/health/route.ts
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const checks = {
    database: false,
    auth: false,
    environment: false,
  }

  try {
    // Check environment variables
    checks.environment = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Check database connection
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1)
    
    checks.database = !error

    // Check auth configuration
    checks.auth = !!(
      process.env.NEXTAUTH_URL &&
      process.env.NEXTAUTH_SECRET
    )

    const allHealthy = Object.values(checks).every(Boolean)

    return NextResponse.json({
      healthy: allHealthy,
      checks,
      timestamp: new Date().toISOString(),
    }, { status: allHealthy ? 200 : 500 })

  } catch (error) {
    return NextResponse.json({
      healthy: false,
      checks,
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
```

### 5. **Debugging Steps**

1. **Visit your health check**: `https://stevenguan.com/api/health`
2. **Test database connection**: `https://stevenguan.com/api/test-db`
3. **Check browser console** for client-side errors
4. **Monitor Vercel logs** for server-side errors

### 6. **Common Issues & Solutions**

**Issue**: "Missing required Supabase environment variables"
**Solution**: Double-check environment variables in Vercel dashboard

**Issue**: "Failed to create user: 23505"
**Solution**: Duplicate user issue - user already exists

**Issue**: "Row Level Security violated"
**Solution**: Check RLS policies in Supabase dashboard

**Issue**: "JWT expired"
**Solution**: Refresh the service role key from Supabase settings

### 7. **Immediate Test After Fix**

1. **Deploy the fixes** to Vercel
2. **Test authentication** flow
3. **Try commenting** on a blog post
4. **Check user data** appears in Supabase dashboard

This should resolve your immediate Supabase integration issues. Let me know the results of these health checks! 