import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[var(--color-gunmetal)] to-[var(--color-thistle)] border-t border-[var(--card-border)] mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
            <div className="flex space-x-4 justify-center">
              <a
                href="https://linkedin.com/in/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[var(--accent)] transition-colors"
                aria-label="LinkedIn Profile"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="mailto:your-email@example.com"
                className="text-white hover:text-[var(--accent)] transition-colors"
                aria-label="Email Contact"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <nav className="space-y-2 flex flex-col items-center">
              <Link href="/" className="block text-[var(--accent)] hover:text-[var(--color-thistle)] transition-colors">
                Home
              </Link>
              <Link href="/projects" className="block text-[var(--accent)] hover:text-[var(--color-thistle)] transition-colors">
                Projects
              </Link>
              <Link href="/about" className="block text-[var(--accent)] hover:text-[var(--color-thistle)] transition-colors">
                About
              </Link>
              <Link href="/contact" className="block text-[var(--accent)] hover:text-[var(--color-thistle)] transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Technology Stack */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Built With</h3>
            <div className="space-y-2 text-sm text-white flex flex-col items-center">
              <div className="flex items-center space-x-2 justify-center">
                <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                <span>Next.js</span>
              </div>
              <div className="flex items-center space-x-2 justify-center">
                <span className="w-2 h-2 bg-[var(--color-thistle)] rounded-full"></span>
                <span>Drupal</span>
              </div>
              <div className="flex items-center space-x-2 justify-center">
                <span className="w-2 h-2 bg-[var(--color-mountbatten_pink)] rounded-full"></span>
                <span>Tailwind CSS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--card-border)] mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-white">
              © {new Date().getFullYear()} Binyam Gebresellassie. All rights reserved.
            </p>
            <p className="text-sm text-[var(--color-gunmetal)]">
              Powered by <span className="text-[var(--color-gunmetal)]">Next.js</span> & <span className="text-[var(--color-gunmetal)]">Drupal</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
