"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { LogIn, LogOut, User, MoreHorizontal, Sparkles } from "lucide-react"
import { clsx } from "clsx"

export interface AuthButtonProps {
  variant?: "topbar" | "sidebar"
}

export default function AuthButton({ variant = "topbar" }: AuthButtonProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className={clsx(
        "animate-pulse bg-white/[0.05] rounded-lg",
        variant === "sidebar" ? "h-12 w-full" : "h-8 w-24"
      )} />
    )
  }

  if (session) {
    if (variant === "sidebar") {
      return (
        <div className="group relative w-full">
          <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/[0.05] transition-all duration-200">
            {session.user?.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name || "User"} 
                className="w-8 h-8 rounded-full ring-1 ring-white/10"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-aura-purple to-aura-cyan flex items-center justify-center text-xs font-bold">
                {session.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </div>
            )}
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-medium truncate group-hover:text-white transition-colors">
                {session.user?.name}
              </p>
              <p className="text-[10px] text-text-secondary truncate flex items-center gap-1">
                <Sparkles size={8} className="text-aura-purple" />
                Free Plan
              </p>
            </div>
            <MoreHorizontal size={14} className="text-text-secondary group-hover:text-white" />
          </button>
          
          <div className="absolute bottom-full left-0 mb-2 w-full bg-bg-surface border border-border-main rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 overflow-hidden z-50">
            <div className="px-3 py-2 border-b border-border-main mb-1">
              <p className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">Account</p>
              <p className="text-xs truncate font-medium">{session.user?.email}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 group relative">
        <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors">
          {session.user?.image ? (
            <img 
              src={session.user.image} 
              alt={session.user.name || "User"} 
              className="w-6 h-6 rounded-full ring-1 ring-white/10"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
              <User size={14} className="text-text-secondary" />
            </div>
          )}
          <span className="text-xs font-medium text-text-secondary hidden md:block group-hover:text-white transition-colors">
            {session.user?.name?.split(' ')[0]}
          </span>
        </button>
        
        <div className="absolute top-full right-0 mt-1 w-40 bg-bg-surface border border-border-main rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 overflow-hidden z-50">
          <div className="px-3 py-2 border-b border-border-main mb-1">
            <p className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">Logged in as</p>
            <p className="text-xs truncate font-medium">{session.user?.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  if (variant === "sidebar") {
    return (
      <button
        onClick={() => signIn("google")}
        className="flex items-center gap-3 w-full p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all group group"
      >
        <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center group-hover:bg-white/[0.1] transition-colors">
          <LogIn size={16} className="text-text-secondary group-hover:text-white" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium group-hover:text-white transition-colors">Sign in</p>
          <p className="text-[10px] text-text-secondary">to save your chats</p>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-sm font-medium transition-all active:scale-95"
    >
      <LogIn size={14} className="text-text-secondary" />
      Sign In
    </button>
  )
}
