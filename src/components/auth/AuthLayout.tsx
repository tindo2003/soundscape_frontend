import SimpleHeader from "../layout/SimpleHeader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>
      
      <footer className="p-6 border-t">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Support</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</a>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 Soundscape
          </div>
        </div>
      </footer>
    </div>
  );
}