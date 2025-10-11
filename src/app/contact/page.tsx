"use client";

import { useState } from "react";

export default function ContactPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setIsSubmitting(true);
		setStatus(null);

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name,
					email,
					message,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				setStatus(data.message);
				setName("");
				setEmail("");
				setMessage("");
			} else {
				setStatus(`Error: ${data.error}`);
			}
		} catch (error) {
			setStatus("Error: Failed to send message. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<section className="container mx-auto px-4 py-8">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl font-semibold mb-8 text-responsive text-center">Contact</h1>
				
				<div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8">
					<form onSubmit={onSubmit} className="space-y-6">
						<div>
							<label htmlFor="name" className="block text-sm font-semibold text-responsive mb-2">
								Name
							</label>
							<input
								id="name"
								className="w-full border border-[var(--color-paynes_gray)] bg-[var(--card-bg)] text-responsive px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all"
								placeholder="Your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
						
						<div>
							<label htmlFor="email" className="block text-sm font-semibold text-responsive mb-2">
								Email
							</label>
							<input
								id="email"
								className="w-full border border-[var(--color-paynes_gray)] bg-[var(--card-bg)] text-responsive px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all"
								placeholder="your.email@example.com"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						
						<div>
							<label htmlFor="message" className="block text-sm font-semibold text-responsive mb-2">
								Message
							</label>
							<textarea
								id="message"
								className="w-full border border-[var(--color-paynes_gray)] bg-[var(--card-bg)] text-responsive px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all resize-vertical"
								placeholder="Your message..."
								rows={6}
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								required
							/>
						</div>
						
						<button 
							className="w-full bg-gradient-to-r from-[var(--color-mountbatten_pink)] to-[var(--color-thistle)] text-[var(--color-gunmetal)] px-6 py-3 font-semibold text-lg hover:from-[var(--color-thistle)] hover:to-[var(--color-mountbatten_pink)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg" 
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Sending...' : 'Send Message'}
						</button>
						
						{status && (
							<div className={`text-sm p-3 rounded border ${
								status.includes('Error') ? 'error-message' : 'success-message'
							}`}>
								{status}
							</div>
						)}
					</form>
				</div>
			</div>
		</section>
	);
}
