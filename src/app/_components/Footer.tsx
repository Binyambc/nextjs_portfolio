import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[var(--color-gunmetal)] to-[var(--color-thistle)] border-t border-[var(--card-border)] mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto">
          {/* Social Links */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4">Connect</h3>
            <div className="flex flex-col items-center justify-center space-y-4">
              <a
                href="https://github.com/Binyambc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[var(--accent)] transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/public-profile/settings/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_self_edit_contact_info%3BIkH3rb3yT%2FOJ2dfwjQm7rw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[var(--accent)] transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <Link
                href="/contact"
                className="text-white hover:text-[var(--accent)] transition-colors"
                aria-label="Contact Form"
              >
                <Mail className="w-6 h-6" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-left mx-auto md:mx-0">
            <h3 className="text-base font-semibold text-white mb-4 text-left">Quick Links</h3>
            <nav className="space-y-2 text-left">
              <Link href="/" className="block text-sm text-[var(--accent)] hover:text-[var(--color-thistle)] transition-colors">
                Home
              </Link>
              <Link href="/projects" className="block text-sm text-[var(--accent)] hover:text-[var(--color-thistle)] transition-colors">
                Projects
              </Link>
              <Link href="/about" className="block text-sm text-[var(--accent)] hover:text-[var(--color-thistle)] transition-colors">
                About
              </Link>
              <Link href="/contact" className="block text-sm text-[var(--accent)] hover:text-[var(--color-thistle)] transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Technology Stack */}
          <div className="text-left mx-auto md:mx-0">
            <h3 className="text-base font-semibold text-white mb-4 text-left">Built With</h3>
            <div className="space-y-2 text-xs text-white text-left">
              <div>Next.js</div>
              <div>Drupal</div>
              <div>Tailwind CSS</div>
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
