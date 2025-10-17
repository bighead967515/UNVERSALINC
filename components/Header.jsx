import React, { useState } from 'react';
    import { Link, NavLink, useNavigate } from 'react-router-dom';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Menu, X, LogIn, User, LayoutDashboard, Search } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useAuth } from '@/contexts/AuthContext';
    import { Input } from '@/components/ui/input';


    const Header = () => {
      const [isOpen, setIsOpen] = useState(false);
      const [searchQuery, setSearchQuery] = useState('');
      const { user } = useAuth();
      const navigate = useNavigate();

      const navLinks = [
        { to: '/browse', text: 'Find an Artist' },
        { to: '/dream-tattoo', text: 'Tattoo Ideas' },
        { to: '/cover-up-posts', text: 'Cover-ups' },
        { to: '/gallery', text: 'Gallery' },
      ];

      const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
          navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
          setSearchQuery('');
        }
      };

      const mobileMenuVariants = {
        closed: { opacity: 0, x: '-100%' },
        open: { opacity: 1, x: '0%' },
      };

      return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              <Link to="/home" className="text-xl font-black gradient-text tracking-widest">
                Universal Inc
              </Link>

              <nav className="hidden lg:flex items-center space-x-6">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `font-mono text-sm font-medium transition-colors hover:text-primary ${
                        isActive ? 'text-primary cyber-text-glow' : 'text-muted-foreground'
                      }`
                    }
                  >
                    {link.text}
                  </NavLink>
                ))}
              </nav>

              <div className="hidden md:flex items-center space-x-4 flex-1 justify-end">
                <form onSubmit={handleSearch} className="relative w-full max-w-xs hidden lg:block">
                  <Input 
                    type="search"
                    placeholder="Search artists..."
                    className="pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>

                {user ? (
                  <Link to="/dashboard">
                    <Button>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button>
                        <User className="mr-2 h-4 w-4" />
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              <div className="lg:hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="text-foreground">
                  {isOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="lg:hidden absolute top-full left-0 w-full bg-background border-t border-border"
              >
                <nav className="flex flex-col items-center space-y-6 p-8 max-h-[calc(100vh-5rem)] overflow-y-auto">
                  <form onSubmit={handleSearch} className="relative w-full max-w-xs">
                    <Input 
                      type="search"
                      placeholder="Search artists..."
                      className="pr-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `text-lg font-mono transition-colors hover:text-primary ${
                          isActive ? 'text-primary cyber-text-glow' : 'text-muted-foreground'
                        }`
                      }
                    >
                      {link.text}
                    </NavLink>
                  ))}
                  
                  <div className="pt-6 w-full space-y-4">
                    {user ? (
                      <Link to="/dashboard" className="w-full">
                        <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Link to="/login" className="w-full">
                          <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                          </Button>
                        </Link>
                        <Link to="/signup" className="w-full">
                          <Button className="w-full" onClick={() => setIsOpen(false)}>
                            <User className="mr-2 h-4 w-4" />
                            Sign Up
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      );
    };

    export default Header;