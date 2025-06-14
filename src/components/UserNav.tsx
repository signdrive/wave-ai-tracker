
import React from 'react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/hooks/useAuth';
import { useMentorship } from '@/hooks/useMentorship';
import { LogOut, User, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function UserNav() {
  const { user, signOut } = useAuth();
  const { userRole } = useMentorship();

  if (!user) {
    return null;
  }
  
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500';
      case 'mentor': return 'bg-green-500';
      case 'student': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getInitials = (email: string) => {
    return email ? email.slice(0, 2).toUpperCase() : 'U';
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.user_metadata?.avatar_url} alt="User avatar" />
            <AvatarFallback>{getInitials(user.email || '')}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        {userRole && <DropdownMenuItem disabled><Badge className={getRoleBadgeColor(userRole)}>{userRole}</Badge></DropdownMenuItem>}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/surf-log" className="w-full cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>My Surf Log</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/privacy-settings" className="w-full cursor-pointer">
            <Shield className="mr-2 h-4 w-4" />
            <span>Privacy Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
